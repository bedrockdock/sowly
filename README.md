# Sowly

Moestuinplanner voor Nederland en België (later internationaal). Je ziet per maand wat je moet zaaien, verpotten, uitplanten en oogsten, houdt je eigen tuin bij met een tijdlijn per gewas, en er zijn tekenfilmplanten met animaties.

Tabbladen: Mijn tuin, Deze maand en Gewassen. Ingelogd opent Sowly op Mijn tuin, anders op Deze maand. In Mijn tuin sorteer je standaard op wat het eerst aandacht nodig heeft, en verder op alfabet, herkenning of plek. Bovenaan staat met wie je bent ingelogd (met Uitloggen), en de knop Samen voor delen en uitnodigen.

Zonder eigen server: één HTML-bestand. Je tuin opslaan kan alleen na inloggen, in een online tuin via Firebase (zie `src/cloud.js` en `firestore.rules`); de tuin staat niet in `localStorage`. Daar staat alleen het vlaggetje `sowly.ingelogd` (zodat Sowly direct op Mijn tuin opent) en tijdelijk een uitnodigingscode. Mascotte: Kiempje.

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

## Als app op je telefoon

`docs/` bevat een manifest en iconen, dus je kunt Sowly op het beginscherm zetten. Hij opent dan zonder adresbalk, als een app.

In Mijn tuin staat de knop **Installeer Sowly-app**. Op Android en in Chrome of Edge op de computer opent die de installatievraag van de browser. Op iPhone en iPad toont hij de stappen hieronder, want daar kan een website dat niet zelf. De knop verdwijnt als Sowly al als app draait, en op toestellen waar het niet kan.

- **Android (Chrome):** menu ⋮ → **App installeren** of **Toevoegen aan startscherm**. Chrome biedt het soms ook zelf aan.
- **iPhone en iPad:** iOS vraagt het nooit zelf. In Safari: **Deel**-knop → **Zet op beginscherm**. Sinds iOS 16.4 kan dat ook vanuit Chrome en Edge via hun Deel-menu.

Let op bij iOS: de app op het beginscherm heeft een eigen opslag, los van Safari. Je moet daar dus één keer opnieuw inloggen.

## Wat anders werkt dan in Claude

In Claude draait de app als gepubliceerde pagina met de database van Claude voor "samen tuinieren". In de webversie (`docs/index.html`) loopt opslaan en samen tuinieren via Firebase, met uitnodigen via een link. Zie `notes/openstaande-punten.md`.

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
