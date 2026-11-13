-- Sowly: update van 13 november 2026 (5). Bestaande gegevens blijven staan.
-- Plak dit in Supabase: SQL Editor > New query > Run. Eén keer draaien, na supabase-update-2026-11-13-land.sql.
--
-- Land mag nu ook een klimaatzone zijn: FR-N (Frankrijk noord en west), FR-C (midden en oost), FR-S (zuid).
-- Een tuin die al op FR stond, wordt FR-N (de app doet hetzelfde).

begin;

alter table public.gardens drop constraint if exists gardens_land_check;
update public.gardens set land = 'FR-N' where land = 'FR';
alter table public.gardens add constraint gardens_land_check check (land is null or land ~ '^[A-Z]{2}(-[A-Z])?$');

commit;
