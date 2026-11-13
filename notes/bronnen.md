# Bronnen

Afspraak: per land alleen lokale bronnen. NL/BE hieronder; elk ander land een eigen kopje.

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

## Duitsland (sinds 13 november 2026)
- **Zaai-, plant- en oogsttijden:** Bayerische Gartenakademie (LWG, Bayerische Landesanstalt für Weinbau und Gartenbau), *Sä- und Pflanztermine auf einen Blick* (2018, auteur Ilse Gaum), https://www.lwg.bayern.de/mam/cms06/gartenakademie/dateien/sae_und_pflanztermine.pdf . Eén pagina met balken per gewas. De balken zijn exact uit de PDF gelezen (coördinaten van de lijnen, niet op het oog) en omgerekend naar weken.
- **Ter controle gelezen:** Gartenakademie Rheinland-Pfalz (DLR Rheinpfalz), *Übersicht: Kultur verschiedener Gemüsearten im Hausgarten* (2006). Niet gebruikt in de app. Klopt grotendeels met LWG; afwijking: Fenchel zaaien in juli (DLR) tegenover half mei–juni (LWG). In de app staat LWG.
- **Omzetregels (src/region-de.js):** Saat ins Freiland = buiten zaaien (zonder die balk geen directe zaai in DE); Saat ins Frühbeet = onder glas; Pflanzung = uitplanten; Ernte = oogsten. Folie-teelt (stippellijnen bij Pflanzung en Erntebeginn) niet overgenomen. Binnen voorzaaien staat niet in de tabel: NL-weken. Begint het planten eerder dan 4 weken na het vroegste zaaien in de tabel, dan blijft ook de NL-periode onder glas staan (vroege planten zijn eerder opgekweekt).
- **Koppeling:** Kopfsalat = sla, Möhren = wortel, Radies = radijs, Buschbohnen = stamslaboon, Gurken = komkommer én augurk, Rote Bete = biet, Lauch = prei, Schalerbsen = doperwt, Grünkohl = boerenkool, Mangold = snijbiet, Frühkartoffel = aardappel (vroeg), Kartoffel = aardappel (laat), Endivien = andijvie, Rosenkohl = spruitkool, Wirsing = savooiekool, Frühlings- und Winterzwiebel = bosui, Säzwiebel + Steckzwiebel = ui, Schalotten = sjalot (Pflanzung = poten), Sellerie = knolselderij; de rest met dezelfde naam.
- **Niet in de bron (volgen NL/BE, de app meldt dat):** pompoen, knoflook, aubergine, rucola, peterselie, basilicum, peper, pluksla, winterpostelein, tuinboon.
- **Verzorging en buren** blijven NL/BE-bronnen; geen Duitse bevestiging gezocht.

### Vergelijking NL (data.js) en DE (region-de.js), in weken
```
tomaat           NL: binnen 6-19 | glas 12-16 | uitplant 21-26 | oogst 31-42
                 DE: binnen 6-19 | glas 12-16 | uitplant 20-25 | oogst 28-42
courgette        NL: binnen 15-19 | buiten 18-26 | uitplant 20-27 | oogst 27-40
                 DE: binnen 15-19 | uitplant 20-22 | oogst 29-40
sla              NL: binnen 6-12 | glas 6-12 | buiten 10-34 | uitplant 12-38 | oogst 19-43
                 DE: binnen 6-12 | glas 14-18 | glas 6-12 | buiten 18-29 | uitplant 11-34 | oogst 22-39
wortel           NL: glas 7-10 | buiten 10-28 | oogst 23-46
                 DE: glas 7-10 | buiten 9-24 | oogst 27-42
radijs           NL: glas 7-17 | buiten 11-35 | oogst 14-43
                 DE: glas 7-17 | buiten 11-38 | oogst 16-42
stamslaboon      NL: binnen 16-19 | buiten 20-28 | uitplant 20-24 | oogst 27-39
                 DE: binnen 16-19 | buiten 20-29 | uitplant 20-24 | oogst 29-40
spinazie         NL: glas 1-9 | buiten 5-15 | buiten 33-41 | oogst 14-25 | oogst 40-50
                 DE: glas 1-9 | buiten 9-16 | buiten 31-38 | oogst 11-18 | oogst 40-46
veldsla          NL: buiten 31-43 | oogst 40-52
                 DE: buiten 31-38 | uitplant 31-40 | oogst 1-14 | oogst 46-52
komkommer        NL: binnen 16-22 | buiten 18-30 | uitplant 21-25 | oogst 27-38
                 DE: binnen 16-22 | buiten 20-25 | uitplant 20-27 | oogst 30-35
augurk           NL: binnen 14-18 | buiten 20-24 | uitplant 21-24 | oogst 29-38
                 DE: binnen 14-18 | buiten 20-25 | uitplant 20-27 | oogst 30-35
paprika          NL: binnen 9-22 | uitplant 22-26 | oogst 33-42
                 DE: binnen 9-22 | uitplant 20-25 | oogst 33-40
biet             NL: buiten 11-27 | oogst 27-44
                 DE: buiten 18-25 | oogst 30-44
prei             NL: binnen 6-13 | buiten 16-26 | uitplant 14-28 | oogst 27-52
                 DE: binnen 6-13 | glas 12-16 | buiten 22-25 | uitplant 21-25 | uitplant 31-33 | oogst 1-9 | oogst 35-52
doperwt          NL: buiten 10-19 | oogst 26-31
                 DE: buiten 11-16 | oogst 20-31
bloemkool        NL: glas 3-12 | buiten 14-24 | uitplant 14-30 | oogst 20-30 | oogst 39-48
                 DE: glas 18-20 | glas 3-12 | buiten 20-25 | uitplant 14-31 | oogst 27-44
broccoli         NL: glas 10-14 | buiten 16-23 | uitplant 16-30 | oogst 24-44
                 DE: glas 18-22 | glas 10-14 | buiten 22-27 | uitplant 21-31 | oogst 27-44
rodekool         NL: glas 10-14 | buiten 13-18 | uitplant 19-24 | oogst 36-47
                 DE: glas 14-21 | glas 10-14 | uitplant 14-24 | oogst 27-46
boerenkool       NL: buiten 14-24 | uitplant 24-30 | oogst 44-52
                 DE: buiten 20-25 | uitplant 25-28 | oogst 42-52
snijbiet         NL: buiten 14-26 | oogst 24-44
                 DE: glas 14-16 | buiten 16-26 | uitplant 16-28 | oogst 22-40
pastinaak        NL: buiten 16-20 | buiten 27-30 | oogst 37-52
                 DE: buiten 9-22 | oogst 1-9 | oogst 35-52
koolrabi         NL: glas 10-17 | buiten 16-24 | uitplant 14-30 | oogst 22-44
                 DE: glas 17-22 | glas 10-17 | buiten 22-28 | uitplant 18-33 | oogst 30-36
aardappel-vroeg  NL: buiten 11-14 | oogst 23-30
                 DE: buiten 16-20 | oogst 24-34
aardappel-laat   NL: buiten 14-17 | oogst 36-40
                 DE: buiten 18-20 | oogst 31-38
andijvie         NL: buiten 24-33 | uitplant 28-37 | oogst 34-46
                 DE: glas 20-22 | buiten 22-29 | uitplant 24-35 | oogst 39-47
spruitkool       NL: buiten 12-20 | uitplant 19-26 | oogst 44-52
                 DE: glas 18-22 | uitplant 22-27 | oogst 1-8 | oogst 42-52
wittekool        NL: glas 6-13 | buiten 13-18 | uitplant 19-24 | oogst 36-47
                 DE: glas 14-20 | glas 6-13 | uitplant 14-25 | oogst 24-47
savooiekool      NL: glas 6-13 | buiten 15-20 | uitplant 19-26 | oogst 38-47
                 DE: glas 14-20 | glas 6-13 | uitplant 14-25 | oogst 25-47
chinesekool      NL: buiten 27-35 | oogst 38-46
                 DE: buiten 27-30 | uitplant 29-32 | oogst 35-46
stokboon         NL: buiten 19-28 | oogst 27-39
                 DE: buiten 21-27 | oogst 29-43
mais             NL: binnen 16-19 | buiten 20-22 | uitplant 20-24 | oogst 35-40
                 DE: binnen 16-19 | glas 18-20 | buiten 20-22 | uitplant 20-22 | oogst 33-40
sjalot           NL: buiten 11-16 | oogst 28-34
                 DE: buiten 9-14 | oogst 29-35
bosui            NL: buiten 10-18 | oogst 22-36
                 DE: buiten 9-14 | buiten 31-34 | oogst 22-40
venkel           NL: buiten 26-28 | oogst 35-39
                 DE: buiten 20-27 | uitplant 24-28 | oogst 33-42
selderij         NL: glas 10-17 | uitplant 19-24 | oogst 39-48
                 DE: glas 10-17 | uitplant 21-28 | oogst 33-46
ui               NL: buiten 6-15 | uitplant 11-16 | oogst 29-38
                 DE: buiten 9-14 | uitplant 9-14 | oogst 31-39
```
