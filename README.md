# Sowly

Moestuinplanner voor Nederland en België (later internationaal). Je ziet per maand wat je moet zaaien, verpotten, uitplanten en oogsten, houdt je eigen tuin bij met een tijdlijn per gewas, en er zijn tekenfilmplanten met animaties.

Zonder eigen server: één HTML-bestand met lokale opslag (`localStorage`). Wie inlogt, krijgt een online tuin via Firebase (zie `src/cloud.js` en `firestore.rules`). Mascotte: Kiempje.

## Snel starten

```bash
npm run build       # bouwt docs/index.html uit src/
npm run fonts       # haalt de lettertypes (Fredoka en Nunito) lokaal binnen, eenmalig
npm test            # controleert gewassen, perioden en klimaatverschuiving
npm run serve       # lokaal bekijken op http://localhost:3000
```

Je kunt `docs/index.html` ook gewoon in een browser openen.

Zonder `npm run fonts` valt de pagina terug op systeemlettertypes; de app werkt dan gewoon, maar ziet er minder tekenfilmachtig uit.

## Mappen

| Map | Inhoud |
| --- | --- |
| `src/template.html` | stijl (CSS), de tabbalk en lege pagina-opzet |
| `src/data.js` | gewassen: perioden in weken, verzorging, buren, bevestigingen (`BEV`) |
| `src/lang-nl.js` | alle Nederlandse teksten van gewassen, stadia en activiteiten (taalpakket) |
| `src/plants.js` | de tekenfilmplanten (SVG), plantanimatie |
| `src/app.js` | de app: schermen, tijdlijn, tuin, mascotte, zaad-knoppen, samen tuinieren |
| `build.js` | plakt `src/` aan elkaar tot `docs/index.html` |
| `docs/` | wat je online zet (index, icoon, manifest, lettertypes) |
| `tests/` | controles zonder browser |
| `notes/` | openstaande punten, besluiten, bronnen |

## Online zetten

Zet de inhoud van `docs/` online. Alle drie de opties werken met dezelfde bestanden.

**GitHub Pages (om te testen):**
1. Zet het project in een GitHub-repo (voor het gratis abonnement moet die openbaar zijn).
2. Settings → Pages → Source: branch `main`, map `/docs`.
3. Je krijgt `https://<gebruikersnaam>.github.io/<repo>/`.

**Netlify of Cloudflare Pages:** koppel dezelfde repo. Build-commando `npm run build` (of leeg laten, `docs/` zit al in git), publicatiemap `docs`. Lees eerst de voorwaarden voor commercieel gebruik als je advertenties of affiliate-links toevoegt.

## Wat anders werkt dan in Claude

In Claude draait de app als gepubliceerde pagina met de database van Claude voor "samen tuinieren". In deze zelfstandige versie zijn die onderdelen er niet. De app merkt dat en valt terug op lokaal opslaan, zonder foutmelding. Samen tuinieren met een uitnodigingslink vraagt een eigen backend (voorstel: Firebase). Zie `notes/openstaande-punten.md`.

`npm run build:artifact` maakt `dist/artifact.html`, de variant zonder `<html>`-kop zoals Claude die publiceert.

## Een taal toevoegen

1. Kopieer in `src/lang-nl.js` het object `LANGS.nl` naar bijvoorbeeld `LANGS.de` en vertaal de teksten (gewasnamen, tips, verzorging, activiteiten, methodes, stadia). Ontbrekende teksten vallen terug op Nederlands.
2. De app kiest de taal uit de browser (`navigator.language`). Een taalkiezer en de interfaceteksten in `src/app.js` (knoppen, koppen) moeten nog naar het taalpakket.
3. Laat elke vertaling nalezen door een moedertaalspreker, vooral verzorging en buren.

## Klimaat en regio

Alle weken in `src/data.js` staan relatief aan week 20, de gebruikelijke laatste nachtvorst in NL/BE. De app verschuift vorstgevoelige gewassen met de ingestelde vorstweek (`S.frost`). `S.shift` verschuift alles met een aantal weken voor een ander klimaat of halfrond (bijvoorbeeld 26 op het zuidelijk halfrond). Er is nog geen schermkeuze voor.

## Affiliate-links

Zaad-knoppen en advertentievakken staan uit tot de KvK-inschrijving rond is: `COMMERCE=false` in `src/app.js`. Zet die op `true` om ze weer te tonen.

In `src/app.js` staat de lijst `SHOPS` met drie voorbeeldwinkels zonder link. Zodra je goedgekeurde links hebt, vul je daar naam en link per winkel in. De knoppen worden dan actief. Markeer elke link duidelijk als affiliate-link.

## Lettertypes

Fredoka en Nunito vallen onder de SIL Open Font License en mogen gratis worden meegeleverd.

## Wat bij welke naam hoort

Naam: Sowly. Mascotte: Kiempje (Nederlands). Domein: sowly.eu is het uitgangspunt, nog te controleren (zie `notes/besluiten.md`).
