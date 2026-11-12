-- Sowly: tabellen en beveiligingsregels voor Supabase.
-- Plak dit in Supabase: SQL Editor > New query > Run. Opnieuw draaien mag: het script begint met opruimen.
-- Rollen per tuin (members.role): owner (eigenaar), edit (werkt mee), view (kijkt mee).
-- Inloggen kan pas na het bevestigen van het e-mailadres (Authentication > Sign In / Providers > Email > Confirm email aan),
-- dus iedereen met een sessie heeft een bevestigd adres.

drop table if exists public.invites, public.plantings, public.members, public.gardens, public.profiles cascade;
drop function if exists public.is_member(uuid), public.can_edit(uuid), public.is_owner(uuid),
  public.create_garden(text, int, text), public.join_invite(text, text), public.invite_info(text), public.planting_by() cascade;

-- Eigen profiel: welke tuinen, welke tuin open staat
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  garden uuid,
  gardens jsonb not null default '{}'::jsonb,
  name text not null default '' check (char_length(name) <= 60)
);

create table public.gardens (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users on delete cascade,
  name text not null check (char_length(name) <= 80),
  frost int not null check (frost between 14 and 26)
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
  id text not null check (char_length(id) <= 40),
  crop text not null check (char_length(crop) <= 40),
  method text not null check (char_length(method) <= 20),
  date text not null check (char_length(date) <= 10),
  label text not null default '' check (char_length(label) <= 30),
  bed text not null default '' check (char_length(bed) <= 30),
  by uuid,
  primary key (garden, id)
);

-- Uitnodigingen: de code is lang en willekeurig. Niemand kan ze opvragen behalve wie hem maakte;
-- meedoen gaat via join_invite() met de code zelf.
create table public.invites (
  code text primary key check (char_length(code) between 16 and 64),
  garden uuid not null references public.gardens on delete cascade,
  gname text not null check (char_length(gname) <= 80),
  role text not null check (role in ('edit', 'view')),
  by uuid not null default auth.uid() references auth.users on delete cascade
);

-- Hulpfuncties. security definer, zodat de regels op members niet naar zichzelf verwijzen.
create function public.is_member(g uuid) returns boolean language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.members where garden = g and uid = auth.uid()) $$;
create function public.can_edit(g uuid) returns boolean language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.members where garden = g and uid = auth.uid() and role in ('owner', 'edit')) $$;
create function public.is_owner(g uuid) returns boolean language sql stable security definer set search_path = '' as
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

-- Lid worden met een uitnodiging, met de rol uit die uitnodiging. Geeft de tuin en zijn naam terug.
create function public.join_invite(code text, mname text) returns table (garden uuid, gname text)
language plpgsql security definer set search_path = '' as $$
declare i public.invites;
begin
  if auth.uid() is null then raise exception 'niet ingelogd'; end if;
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

create policy "leden lezen de tuin" on public.gardens for select to authenticated using (public.is_member(id));
create policy "bewerkers wijzigen de vorstweek" on public.gardens for update to authenticated using (public.can_edit(id)) with check (public.can_edit(id));
create policy "eigenaar verwijdert de tuin" on public.gardens for delete to authenticated using (public.is_owner(id));
-- Alleen de vorstweek is aan te passen; naam en eigenaar niet (aanmaken gaat via create_garden)
revoke insert, update on public.gardens from anon, authenticated;
grant update (frost) on public.gardens to authenticated;

-- Je eigen lidmaatschap mag je altijd zien; leden zien elkaar
create policy "leden zien elkaar" on public.members for select to authenticated using (uid = auth.uid() or public.is_member(garden));
-- Zelf vertrekken (niet als eigenaar), of de eigenaar haalt iemand anders weg. Lid worden gaat via create_garden of join_invite.
create policy "vertrekken of weghalen" on public.members for delete to authenticated
  using (uid = auth.uid() and role <> 'owner' or uid <> auth.uid() and public.is_owner(garden));
revoke insert, update on public.members from anon, authenticated;

create policy "leden lezen plantingen" on public.plantings for select to authenticated using (public.is_member(garden));
create policy "bewerkers maken plantingen" on public.plantings for insert to authenticated with check (public.can_edit(garden));
create policy "bewerkers wijzigen plantingen" on public.plantings for update to authenticated using (public.can_edit(garden)) with check (public.can_edit(garden));
create policy "bewerkers verwijderen plantingen" on public.plantings for delete to authenticated using (public.can_edit(garden));

create policy "eigen uitnodigingen lezen" on public.invites for select to authenticated using (by = auth.uid());
create policy "eigenaar nodigt uit" on public.invites for insert to authenticated with check (by = auth.uid() and public.is_owner(garden));
create policy "eigen uitnodiging intrekken" on public.invites for delete to authenticated using (by = auth.uid());
revoke update on public.invites from anon, authenticated;

-- Niemand zonder login mag iets
revoke all on public.profiles, public.gardens, public.members, public.plantings, public.invites from anon;

-- Live bijwerken (Realtime). Bij verwijderen stuurt Supabase alleen de sleutel mee, daarom zit garden in de sleutel.
alter publication supabase_realtime add table public.gardens, public.members, public.plantings;
