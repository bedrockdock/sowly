-- Sowly: update van 15 november 2026. Bestaande gegevens blijven staan.
-- Plak dit in Supabase: SQL Editor > New query > Run. Eén keer draaien.
--
-- Eigen plant ("Overige"): de gebruiker geeft zelf een naam en data op.
-- crop is dan 'overig' (past al in plantings_crop_vorm). Nieuwe kolommen, leeg bij gewone gewassen:
--   name       naam van de plant (max. 30 tekens, zelfde grens als label)
--   uit        datum uitplanten, 'JJJJ-MM-DD' of leeg
--   oogst_van  begin van de oogst, 'JJJJ-MM-DD' of leeg
--   oogst_tot  einde van de oogst, 'JJJJ-MM-DD' of leeg

begin;

alter table public.plantings
  add column if not exists name text not null default '' constraint plantings_name_lengte check (char_length(name) <= 30),
  add column if not exists uit text not null default '' constraint plantings_uit_vorm check (uit = '' or uit ~ '^\d{4}-\d{2}-\d{2}$'),
  add column if not exists oogst_van text not null default '' constraint plantings_oogst_van_vorm check (oogst_van = '' or oogst_van ~ '^\d{4}-\d{2}-\d{2}$'),
  add column if not exists oogst_tot text not null default '' constraint plantings_oogst_tot_vorm check (oogst_tot = '' or oogst_tot ~ '^\d{4}-\d{2}-\d{2}$');

commit;
