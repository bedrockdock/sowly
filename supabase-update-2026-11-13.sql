-- Sowly: update van 13 november 2026. Bestaande gegevens blijven staan.
-- Plak dit in Supabase: SQL Editor > New query > Run. Eén keer draaien.
-- Alles gebeurt in één transactie: keurt een regel een bestaande rij af, dan verandert er niets en zie je een foutmelding.
--
-- 1. Vorm van plantingen vastleggen, zodat een meewerker via de API geen HTML of script in een id of methode kan stoppen.
-- 2. Grenzen op hoeveelheid, zodat één account de database niet kan volstoppen.

begin;

-- 1. Vorm van plantingen en profiel
alter table public.plantings
  add constraint plantings_id_vorm check (id ~ '^[A-Za-z0-9_-]{1,40}$'),
  add constraint plantings_crop_vorm check (crop ~ '^[a-z0-9_-]{1,40}$'),
  add constraint plantings_method_vorm check (method in ('binnen', 'glas', 'buiten')),
  add constraint plantings_date_vorm check (date ~ '^\d{4}-\d{2}-\d{2}$');

alter table public.profiles
  add constraint profiles_gardens_vorm check (jsonb_typeof(gardens) = 'object' and pg_column_size(gardens) <= 16384);

-- 2. Grenzen: 500 plantingen per tuin, 5 eigen tuinen per account, 50 leden per tuin, 50 open uitnodigingen per tuin
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
    if (select count(*) from public.invites where garden = new.garden) >= 50 then
      raise exception 'maximaal 50 open uitnodigingen per tuin';
    end if;
  end if;
  return new;
end $$;
revoke execute on function public.grens() from public, anon, authenticated;

drop trigger if exists grens on public.plantings;
drop trigger if exists grens on public.gardens;
drop trigger if exists grens on public.members;
drop trigger if exists grens on public.invites;
create trigger grens before insert on public.plantings for each row execute function public.grens();
create trigger grens before insert on public.gardens for each row execute function public.grens();
create trigger grens before insert on public.members for each row execute function public.grens();
create trigger grens before insert on public.invites for each row execute function public.grens();

-- Hulpfuncties zijn alleen voor de regels hierboven; zonder login niet aan te roepen
revoke execute on function public.is_member(uuid), public.can_edit(uuid), public.is_owner(uuid) from public, anon;
grant execute on function public.is_member(uuid), public.can_edit(uuid), public.is_owner(uuid) to authenticated;

commit;
