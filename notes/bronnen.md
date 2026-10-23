# Bronnen

Afspraak: voor nu alleen Nederlandse en Belgische bronnen. Bij elk nieuw land een eigen lijst met lokale bronnen.

## Gebruikt (NL/BE)
- **Zaai- en oogsttijden:** Hubo, Leefmilieu Brussel, Velt, Boerenbond, Praxis (zaadpagina's), Max Vandaag, ID.nl, Linda, zaaikalender in een Publitas-zadencatalogus.
- **Voeding (licht/water/voeding):** Gamma, Welkoop, Praxis.
- **Buren (goed/slecht):** BTD (Universiteit Twente). Wageningen University meldt dat buurregels niet wetenschappelijk bewezen zijn; daarom staat het meeste in de app als "niet bevestigd door een Nederlandse of Belgische bron".

## Praxis-pagina's die in de laatste ronde zijn gelezen
- rucola selvatica: binnen feb–mrt, buiten mrt–sep, volle zon, veel water
- prei: zaaien mrt–mei, volle zon, regelmatig en ruim water
- radijs: zaaien feb–aug, volle zon, regelmatig en ruim water
- wortel: zaaien feb–jul, volle zon
- komkommer/augurk: voorzaaien apr–mei, volle zon, veel water
- pompoen: zaaien begin mei tot half juni
- basilicum: onder glas mei–jul, volle grond jun–aug, volle zon

## Bekende afwijkingen
- Paprika zaaivenster: Praxis zegt "maart t/m april", een Publitas-catalogus "vanaf half april". In de app staat voorzaaien vanaf week 9. Nog uitzoeken.
- Tuinboon: najaarszaai (alleen een Brits bron) is bewust uit de app gehaald. Hubo zegt februari–maart.

## Regel voor de app
Elke bevestiging staat in `src/data.js` in `BEV` (l = licht, w = water, v = voeding) en in `BV_GOED` / `BV_SLECHT` (buren). Alleen waarden die een NL/BE-bron bevestigt komen daar in. De rest toont de app als "Nog niet bevestigd".
