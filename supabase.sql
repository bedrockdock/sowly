-- Sowly: tabellen en beveiligingsregels voor Supabase.
-- Alleen voor een NIEUW, leeg project: SQL Editor > New query > Run.
-- Het bestaande project niet opnieuw hiermee vullen: het script stopt dan met een fout (tabellen bestaan al).
-- Wijzigingen voor het bestaande project gaan via een los updatebestand (supabase-update-*.sql) dat de gegevens laat staan,
-- en komen daarna ook hier in, zodat dit bestand altijd de volledige stand beschrijft.
-- Rollen per tuin (members.role): owner (eigenaar), edit (werkt mee), view (kijkt mee).
-- Inloggen kan pas na het bevestigen van het e-mailadres (Authentication > Sign In / Providers > Email > Confirm email aan),
-- dus iedereen met een sessie heeft een bevestigd adres.

-- Eigen profiel: welke tuinen, welke tuin open staat
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  garden uuid,
  gardens jsonb not null default '{}'::jsonb,
  name text not null default '' check (char_length(name) <= 60),
  constraint profiles_gardens_vorm check (jsonb_typeof(gardens) = 'object' and pg_column_size(gardens) <= 16384)
);

create table public.gardens (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users on delete cascade,
  name text not null check (char_length(name) <= 80),
  frost int not null check (frost between 14 and 26),
  land text check (land is null or land ~ '^[A-Z]{2}$')
);

create table public.members (
  garden uuid not null references public.gardens on delete cascade,
  uid uuid not null references auth.users on delete cascade,
  role text not null check (role in ('owner', 'edit', 'view')),
  name text not null default '' check (char_length(name) <= 60),
  invite text,
  primary key (garden, uid)
);

create table public.plantings (
  garden uuid not null references public.gardens on delete cascade,
  id text not null constraint plantings_id_vorm check (id ~ '^[A-Za-z0-9_-]{1,40}$'),
  crop text not null constraint plantings_crop_vorm check (crop ~ '^[a-z0-9_-]{1,40}$'),
  method text not null constraint plantings_method_vorm check (method in ('binnen', 'glas', 'buiten')),
  date text not null constraint plantings_date_vorm check (date ~ '^\d{4}-\d{2}-\d{2}$'),
  label text not null default '' check (char_length(label) <= 30),
  bed text not null default '' check (char_length(bed) <= 30),
  by uuid,
  primary key (garden, id)
);

-- Uitnodigingen: de code is lang en willekeurig. Niemand kan ze opvragen behalve wie hem maakte;
-- meedoen gaat via join_invite() met de code zelf. Ze verlopen na 14 dagen (created_at zet de database zelf, zie grens()).
create table public.invites (
  code text primary key check (char_length(code) between 16 and 64),
  garden uuid not null references public.gardens on delete cascade,
  gname text not null check (char_length(gname) <= 80),
  role text not null check (role in ('edit', 'view')),
  by uuid not null default auth.uid() references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

-- Hulpfuncties. security definer, zodat de regels op members niet naar zichzelf verwijzen.
-- Ze staan in het schema private: dat biedt Supabase niet aan via de API, dus niemand kan ze los aanroepen.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
create function private.is_member(g uuid) returns boolean language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.members where garden = g and uid = auth.uid()) $$;
create function private.can_edit(g uuid) returns boolean language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.members where garden = g and uid = auth.uid() and role in ('owner', 'edit')) $$;
create function private.is_owner(g uuid) returns boolean language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.members where garden = g and uid = auth.uid() and role = 'owner') $$;

-- Eigen tuin aanmaken, met jezelf als eigenaar, in één stap
create function public.create_garden(gname text, gfrost int, mname text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare g uuid;
begin
  if auth.uid() is null then raise exception 'niet ingelogd'; end if;
  insert into public.gardens (owner, name, frost) values (auth.uid(), left(gname, 80), gfrost) returning id into g;
  insert into public.members (garden, uid, role, name) values (g, auth.uid(), 'owner', left(mname, 60));
  return g;
end $$;

-- Lid worden met een uitnodiging (jonger dan 14 dagen), met de rol uit die uitnodiging. Geeft de tuin en zijn naam terug.
-- Verlopen uitnodigingen worden meteen opgeruimd.
create function public.join_invite(code text, mname text) returns table (garden uuid, gname text)
language plpgsql security definer set search_path = '' as $$
declare i public.invites;
begin
  if auth.uid() is null then raise exception 'niet ingelogd'; end if;
  delete from public.invites where created_at <= now() - interval '14 days';
  select * into i from public.invites where invites.code = join_invite.code;
  if not found then return; end if;
  insert into public.members (garden, uid, role, name, invite) values (i.garden, auth.uid(), i.role, left(mname, 60), i.code)
    on conflict on constraint members_pkey do nothing;
  return query select i.garden, i.gname;
end $$;

-- Wie een planting maakt, staat erin als "by". Bij wijzigen blijft dat staan.
create function public.planting_by() returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then new.by := auth.uid();
  else new.by := old.by; new.garden := old.garden; end if;
  return new;
end $$;
create trigger planting_by before insert or update on public.plantings for each row execute function public.planting_by();

-- Grenzen: 500 plantingen per tuin, 5 eigen tuinen per account, 50 leden per tuin, 50 open uitnodigingen per tuin
create function public.grens() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name = 'plantings' then
    -- Een upsert van een bestaande planting telt niet als nieuwe
    if not exists (select 1 from public.plantings where garden = new.garden and id = new.id)
       and (select count(*) from public.plantings where garden = new.garden) >= 500 then
      raise exception 'maximaal 500 plantingen per tuin';
    end if;
  elsif tg_table_name = 'gardens' then
    if (select count(*) from public.gardens where owner = new.owner) >= 5 then
      raise exception 'maximaal 5 eigen tuinen per account';
    end if;
  elsif tg_table_name = 'members' then
    if (select count(*) from public.members where garden = new.garden) >= 50 then
      raise exception 'maximaal 50 leden per tuin';
    end if;
  elsif tg_table_name = 'invites' then
    -- Het moment van aanmaken bepaalt de database; verlopen uitnodigingen tellen niet mee
    new.created_at := now();
    delete from public.invites where garden = new.garden and created_at <= now() - interval '14 days';
    if (select count(*) from public.invites where garden = new.garden) >= 50 then
      raise exception 'maximaal 50 open uitnodigingen per tuin';
    end if;
  end if;
  return new;
end $$;
create trigger grens before insert on public.plantings for each row execute function public.grens();
create trigger grens before insert on public.gardens for each row execute function public.grens();
create trigger grens before insert on public.members for each row execute function public.grens();
create trigger grens before insert on public.invites for each row execute function public.grens();

revoke execute on function public.grens() from public, anon, authenticated;
revoke execute on function private.is_member(uuid), private.can_edit(uuid), private.is_owner(uuid) from public, anon;
grant execute on function private.is_member(uuid), private.can_edit(uuid), private.is_owner(uuid) to authenticated;
-- create_garden en join_invite zijn bewust aan te roepen door ingelogde gebruikers (Security Advisor meldt ze; dat klopt).
revoke execute on function public.create_garden(text, int, text), public.join_invite(text, text) from public, anon;
grant execute on function public.create_garden(text, int, text), public.join_invite(text, text) to authenticated;

alter table public.profiles enable row level security;
alter table public.gardens enable row level security;
alter table public.members enable row level security;
alter table public.plantings enable row level security;
alter table public.invites enable row level security;

create policy "eigen profiel lezen" on public.profiles for select to authenticated using (id = auth.uid());
create policy "eigen profiel maken" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "eigen profiel wijzigen" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "leden lezen de tuin" on public.gardens for select to authenticated using (private.is_member(id));
create policy "bewerkers wijzigen de vorstweek" on public.gardens for update to authenticated using (private.can_edit(id)) with check (private.can_edit(id));
create policy "eigenaar verwijdert de tuin" on public.gardens for delete to authenticated using (private.is_owner(id));
-- Alleen de vorstweek en het land zijn aan te passen; naam en eigenaar niet (aanmaken gaat via create_garden)
revoke insert, update on public.gardens from anon, authenticated;
grant update (frost, land) on public.gardens to authenticated;

-- Je eigen lidmaatschap mag je altijd zien; leden zien elkaar
create policy "leden zien elkaar" on public.members for select to authenticated using (uid = auth.uid() or private.is_member(garden));
-- Zelf vertrekken (niet als eigenaar), of de eigenaar haalt iemand anders weg. Lid worden gaat via create_garden of join_invite.
create policy "vertrekken of weghalen" on public.members for delete to authenticated
  using (uid = auth.uid() and role <> 'owner' or uid <> auth.uid() and private.is_owner(garden));
revoke insert, update on public.members from anon, authenticated;

create policy "leden lezen plantingen" on public.plantings for select to authenticated using (private.is_member(garden));
create policy "bewerkers maken plantingen" on public.plantings for insert to authenticated with check (private.can_edit(garden));
create policy "bewerkers wijzigen plantingen" on public.plantings for update to authenticated using (private.can_edit(garden)) with check (private.can_edit(garden));
create policy "bewerkers verwijderen plantingen" on public.plantings for delete to authenticated using (private.can_edit(garden));

create policy "eigen uitnodigingen lezen" on public.invites for select to authenticated using (by = auth.uid());
create policy "eigenaar nodigt uit" on public.invites for insert to authenticated with check (by = auth.uid() and private.is_owner(garden));
create policy "eigen uitnodiging intrekken" on public.invites for delete to authenticated using (by = auth.uid());
revoke update on public.invites from anon, authenticated;

-- Niemand zonder login mag iets
revoke all on public.profiles, public.gardens, public.members, public.plantings, public.invites from anon;

-- Live bijwerken (Realtime). Bij verwijderen stuurt Supabase alleen de sleutel mee, daarom zit garden in de sleutel.
alter publication supabase_realtime add table public.gardens, public.members, public.plantings;
