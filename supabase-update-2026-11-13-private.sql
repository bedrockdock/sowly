-- Sowly: update van 13 november 2026 (3). Bestaande gegevens blijven staan.
-- Plak dit in Supabase: SQL Editor > New query > Run. Eén keer draaien, na supabase-update-2026-11-13-uitnodigingen.sql.
--
-- De hulpfuncties is_member, can_edit en is_owner gaan naar het schema "private". Supabase biedt dat schema niet aan
-- via de API, dus niemand kan ze nog los aanroepen. De RLS-regels verwijzen naar de functie zelf (niet naar de naam)
-- en blijven dus werken. Lost drie meldingen van de Security Advisor op.

begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter function public.is_member(uuid) set schema private;
alter function public.can_edit(uuid) set schema private;
alter function public.is_owner(uuid) set schema private;

revoke execute on function private.is_member(uuid), private.can_edit(uuid), private.is_owner(uuid) from public, anon;
grant execute on function private.is_member(uuid), private.can_edit(uuid), private.is_owner(uuid) to authenticated;

commit;
