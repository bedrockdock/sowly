-- Sowly: update van 13 november 2026 (4). Bestaande gegevens blijven staan.
-- Plak dit in Supabase: SQL Editor > New query > Run. Eén keer draaien, na supabase-update-2026-11-13-private.sql.
--
-- Land per tuin (NL, BE, DE, ...), net als de vorstweek: wie mag bewerken, mag het land aanpassen.
-- Bestaande tuinen krijgen geen land; de app vult het land van het apparaat in zodra de eigenaar of een meewerker de tuin opent.

begin;

alter table public.gardens add column land text check (land is null or land ~ '^[A-Z]{2}$');

-- De regel "bewerkers wijzigen de vorstweek" (can_edit) geldt al voor updates; alleen de kolom vrijgeven
grant update (land) on public.gardens to authenticated;

commit;
