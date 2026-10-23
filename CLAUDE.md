# Sowly: projectnotities voor Claude Code

Moestuinplanner (NL/BE, later internationaal). Eigenaar: Titus, Nederlandstalig, wil directe en concrete antwoorden en wijst op onnauwkeurigheden.

## Hoe het project werkt
- Geen framework. `src/` wordt door `node build.js` aan elkaar geplakt tot `docs/index.html`. Pas nooit `docs/index.html` met de hand aan; pas `src/` aan en bouw opnieuw.
- `src/app.js` is één IIFE. `data.js`, `lang-nl.js` en `plants.js` staan buiten de IIFE.
- Teksten van gewassen (naam, tip, verzorging), activiteiten, methodes en stadia staan in `src/lang-nl.js`, niet in `data.js`. `applyLang()` vult ze bij het opstarten in. Interfaceteksten in `app.js` staan nog ingebakken (zie `notes/openstaande-punten.md`).
- Bewaar je tuin met `save()` en `localStorage` (sleutel `moestuin.v1`). In Claude draait ook een gedeelde database (`startShared()`); buiten Claude is `claude` niet gedefinieerd en valt alles terug op lokaal.
- Webversie: inloggen en online tuin via Firebase (`src/cloud.js`, alleen in `docs/index.html`; `startCloud()` in `app.js`). Beide routes gebruiken `attach()` met dezelfde `doc()`/`collection()`-vorm. Wie wat mag staat in `firestore.rules`; die plak je in de Firebase-console, ze worden niet automatisch uitgerold.
- Controleer na elke wijziging: `npm run build && npm test`. Open de pagina ook echt in een browser; tests dekken geen uiterlijk.

## Regels voor de gegevens
- Alleen Nederlandse en Belgische bronnen voor NL/BE. Voor een nieuw land eerst lokale bronnen zoeken.
- Weken zijn 1 tot 52 en relatief aan week 20 (laatste nachtvorst NL/BE). `tender: true` schuift mee met `S.frost`. `S.shift` is voor een ander klimaat.
- Bevestiging: `BEV.l|w|v` (licht, water, voeding) en `BV_GOED`/`BV_SLECHT` (buren) bevatten alleen wat een NL/BE-bron bevestigt. Al het andere toont de app als "Nog niet bevestigd door een Nederlandse of Belgische bron". Zet niets in `BEV` zonder bron, en noteer de bron in `notes/bronnen.md`.
- Voeg geen verzonnen waarden toe. Als een bron ontbreekt, zeg dat, en markeer het als onbevestigd.
- Geen disclaimer over buurregels in de interface (de eigenaar wilde die weg).

## Uiterlijk en animatie
- Tekenfilmstijl, vrolijk, dikke rand. Respecteer `prefers-reduced-motion` (zie het blok in de CSS: dat zet animaties uit).
- De plantanimatie bij het toevoegen aan je tuin is bewust langzaam (ongeveer 5,5 seconden, vallen 1,4 seconden). Maak hem niet sneller.
- Mascotte Kiempje staat in `app.js` (`MASCOT`) en heeft eigen animaties met klassen `m*` in de CSS.

## Affiliate en advertenties
- Zaad-knoppen gebruiken `SHOPS` in `app.js`. Zonder link staan ze uitgeschakeld en gemarkeerd als voorbeeld. Elke echte link moet zichtbaar als affiliate-link zijn gemarkeerd. Teeltgegevens mogen niet door commissie beïnvloed worden.
- Voor het web: cookiebanner en privacyverklaring vóór advertenties.

## Nog te doen
Zie `notes/openstaande-punten.md` en `notes/besluiten.md`.
