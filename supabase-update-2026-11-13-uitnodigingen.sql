-- Sowly: update van 13 november 2026 (2). Bestaande gegevens blijven staan.
-- Plak dit in Supabase: SQL Editor > New query > Run. Eén keer draaien, na supabase-update-2026-11-13.sql.
--
-- Uitnodigingen verlopen na 14 dagen. Bestaande uitnodigingen krijgen vandaag als begindatum,
-- dus die werken nog 14 dagen vanaf nu.

begin;

alter table public.invites add column created_at timestamptz not null default now();

-- Het moment van aanmaken bepaalt de database, niet de app. Verlopen uitnodigingen van de tuin worden eerst opgeruimd,
-- zodat ze niet meetellen voor de grens van 50.
create or replace function public.grens() returns trigger language plpgsql security definer set search_path = '' as $$
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
    new.created_at := now();
    delete from public.invites where garden = new.garden and created_at <= now() - interval '14 days';
    if (select count(*) from public.invites where garden = new.garden) >= 50 then
      raise exception 'maximaal 50 open uitnodigingen per tuin';
    end if;
  end if;
  return new;
end $$;
revoke execute on function public.grens() from public, anon, authenticated;

-- Lid worden kan alleen met een uitnodiging die jonger is dan 14 dagen. Verlopen uitnodigingen worden opgeruimd.
create or replace function public.join_invite(code text, mname text) returns table (garden uuid, gname text)
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
revoke execute on function public.join_invite(text, text) from public, anon;
grant execute on function public.join_invite(text, text) to authenticated;

commit;
