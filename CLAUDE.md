# Sowly: projectnotities voor Claude Code

Moestuinplanner (NL/BE, later internationaal). Eigenaar: Titus, Nederlandstalig, wil directe en concrete antwoorden en wijst op onnauwkeurigheden.

## Hoe het project werkt
- Geen framework. `src/` wordt door `node build.js` aan elkaar geplakt tot `docs/index.html`. Pas nooit `docs/index.html` met de hand aan; pas `src/` aan en bouw opnieuw.
- `src/app.js` is één IIFE. `data.js`, de taalbestanden, `i18n.js` en `plants.js` staan buiten de IIFE.
- Talen: `src/lang-nl.js` (brontaal) en `lang-en/de/fr/es/it.js`. Daarin staan gewassen (naam, tip, verzorging), activiteiten, methodes, stadia, kalender (`cal`) en alle interfaceteksten (`ui`). Geen tekst in `app.js` of `data.js` zetten: voeg een sleutel toe aan `ui` in alle zes talen en gebruik `tx('sleutel',{plek:waarde})`. `tests/lang.test.js` controleert dat elke taal dezelfde sleutels, plekhouders en HTML-tags heeft. Waarden in `tx()` worden niet ontsnapt: gebruik `esc()` voor tekst van gebruikers.
- `src/i18n.js`: `pickLang()` (eerder gekozen taal in `localStorage` `sowly.taal`, anders de browsertaal, anders Engels), `applyLang()`, `tx()`, `lc()` (geen kleine letter in het Duits) en de vlaggen. Rechtsboven staan het vlaggetje (taal en land) en, als je bent ingelogd, het tandwiel (instellingen: taal, land, laatste nachtvorst, account).
- Land staat los van taal (`S.land`, `COUNTRIES` in `i18n.js`, `localStorage` `sowly.land`). Alleen landen met eigen bronnen krijgen eigen zaaigegevens: `src/region-xx.js` vult `REGIONS.xx` (periodes per gewas, zelfde vorm als `s` in `data.js`, met `src`), en `COUNTRIES` wijst het land daarnaar. Gewassen zonder lokale bron volgen NL/BE en de app meldt dat (`note.partial`, `src.none`); landen zonder bron tonen `note.other`. Gebruik in code altijd `sOf(c)`, niet `c.s`. Het land hoort bij de tuin (`gardens.land`, samen met de vorstweek opgeslagen).
- De tuin wordt nooit in `localStorage` bewaard (besluit 24 oktober 2026: wie zijn cache leegt, is hem kwijt). Opslaan gaat alleen online: in Claude via de gedeelde database (`startShared()`), op het web via inloggen (`startCloud()`). Zonder login zie je voorbeeldplanten; Planten, Wijzigen en Verwijderen openen dan het inlogscherm (`needLogin()`).
- Webversie: inloggen (alleen e-mail en wachtwoord, geen Google) en online tuin via Supabase (`src/cloud.js`, alleen in `docs/index.html`; `startCloud()` en `cloudDb()` in `app.js`). Beide routes gebruiken `attach()` met dezelfde `doc()`/`collection()`-vorm. Tabellen en wie wat mag staan in `supabase.sql`; dat plak je in de SQL Editor van Supabase, het wordt niet automatisch uitgerold.
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

## Privacy
- De privacyverklaring staat in `src/privacy.html`; `build.js` kopieert hem naar `docs/privacy.html` en zet de link onderaan de webversie. Komt er een dienst bij die gegevens verwerkt (advertenties, affiliate, analytics, mail), werk hem dan bij, inclusief de datum.

## Affiliate en advertenties
- Zaad-knoppen gebruiken `SHOPS` in `app.js`. Zonder link staan ze uitgeschakeld en gemarkeerd als voorbeeld. Elke echte link moet zichtbaar als affiliate-link zijn gemarkeerd. Teeltgegevens mogen niet door commissie beïnvloed worden.
- Voor het web: cookiebanner en privacyverklaring vóór advertenties.

## Nog te doen
Zie `notes/openstaande-punten.md` en `notes/besluiten.md`.
