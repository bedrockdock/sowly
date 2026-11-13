# Sowly – openstaande punten

Bijgewerkt: zaterdag 24 oktober 2026. Naam: **Sowly** (internationaal, van "to sow"). De mascotte, het springende groene kereltje met de scheut, heet in Nederland **Kiempje** en krijgt per taal een eigen naam (Engels: Sprout, Duits: Spross).

## Eerst (om online te komen)
- [x] **Domein sowly.eu gekoppeld** (24 oktober 2026): GitHub Pages met eigen domein, HTTPS aan, www en bedrockdock.github.io/sowly sturen door. DNS bij Strato: A-record `185.199.108.153` op het hoofddomein, geen AAAA, CNAME `www` naar `bedrockdock.github.io`. Supabase: sowly.eu bij Site URL en Redirect URLs.
- [ ] **Merknaam Sowly controleren.** Besluit 23 oktober: de naam Sowly blijft, met sowly.eu als adres. Bekend: sowly.com en sowly.app zijn bezet, en de naam is in meerdere landen bezet. Eerst uitzoeken wat er achter die bestaande Sowly's zit (actief bedrijf, welke sector?) en het merkenregister (EUIPO en Benelux, klasse 9, 42 en 31) raadplegen voordat je investeert. Controleer ook of "Sowly" in een andere taal iets onhandigs betekent.
- [ ] **Namen die niet gelukt zijn** (niet opnieuw proberen): Sowmate (bezet), moestuin-namen (meest bezet), Moonsprout (te lang), Harvia (saunamerk), Harvest Moon en FarmVille (merken). Nog niet gecontroleerd en bruikbaar als terugval: Growie, Plotty, Harvo, Orto, Veggo, Harvie, Tendrio, Verdo, Plotmate, Patchmate, First Frost.
- [ ] **Webversie online zetten** (aanpak: VS Code + Claude desktop, code in GitHub). Voorbereid in dit project: los `docs/index.html` met doctype en viewport, icoon (`icon.svg`, `icon-192.png`, `icon-512.png`), manifest voor het beginscherm en bouwscript.
  - [ ] eenmalig `npm run fonts` draaien (Fredoka en Nunito lokaal in `docs/fonts/`; kon in Claude niet gedownload worden)
  - [x] repository op GitHub, daarna GitHub Pages (map `/docs`); later eventueel Netlify of Cloudflare
  - [ ] let op: GitHub Pages is gratis alleen voor openbare repo's en niet bedoeld voor commerciële sites
- [ ] **Voorwaarden hosting lezen** voor affiliate-links en advertenties (Cloudflare noemt de gratis variant "voor persoonlijke of hobbyprojecten"; de algemene voorwaarden zijn niet gelezen).
- [x] **Privacyverklaring** (12 november 2026): `src/privacy.html`, door `build.js` gekopieerd naar `docs/privacy.html`, met een link onderaan de site (alleen webversie). Noemt GitHub Pages, Cloudflare Web Analytics, jsDelivr, Supabase (West EU, Parijs) en Brevo; verantwoordelijke Bedrockdock (KvK 42216279), contact info@bedrockdock.com. Niet juridisch nagekeken.
- [ ] **Privacyverklaring bijwerken** bij advertenties, affiliate-links of een nieuwe dienst. Het klachtrecht bij de Autoriteit Persoonsgegevens blijft erin (AVG art. 13), kort gehouden. Cloudflare Web Analytics: zelf nalezen in hun privacyvoorwaarden of het klopt dat het zonder cookies en persoonsgegevens werkt.

## Accounts en samen tuinieren
- [x] **Backend:** Supabase (sinds 12 november 2026, project `xkreecbnockrjrisbswj`; daarvoor Firebase, zonder migratie). URL en publishable key in `src/cloud.js`, alleen in de webversie.
- [x] **Inlogstroom:** zonder account alleen voorbeeldplanten, niets lokaal opgeslagen (besluit 24 oktober: wie zijn cache leegt, zou zijn tuin kwijt zijn); Planten, Wijzigen en Verwijderen vragen om inloggen en gaan daarna verder; inloggen alleen met e-mail en wachtwoord (besluit 23 oktober: met wachtwoord, niet met inloglink; 12 november: geen Google). Wachtwoord vergeten via herstelmail, daarna nieuw wachtwoord kiezen in de app.
- [x] **Uitnodigen met link** in de app, per uitnodiging meekijken of meewerken. Weghalen trekt ook de link in waarmee iemand binnenkwam. Een link verloopt na 14 dagen (13 november 2026); wie al meedoet, blijft erin.
- [x] **`supabase-update-2026-11-13-uitnodigingen.sql` uitgevoerd** (13 november 2026): uitnodigingen verlopen na 14 dagen.
- [x] **`supabase-update-2026-11-13-private.sql` uitgevoerd** (13 november 2026): hulpfuncties in schema `private`.
- [x] **Kaart "Log in om je tuin te bewaren"** bovenaan Mijn tuin zolang je niet bent ingelogd. (Lokale tuin meenemen is vervallen met het lokaal opslaan.)
- [x] **E-mailadres bevestigen** voordat iemand kan inloggen (Supabase: Confirm email aan). Houdt aanmelden zelf niet tegen.
- [x] **Database inrichten** (12 november 2026): `supabase.sql` in Supabase uitgevoerd (SQL Editor > Run). `supabase.sql` is sinds 13 november alleen voor een nieuw, leeg project (het ruimt niets meer op). Wijzigingen voor het bestaande project gaan via een los bestand `supabase-update-<datum>.sql` dat de gegevens laat staan; daarna dezelfde wijziging ook in `supabase.sql` zetten.
- [x] **`supabase-update-2026-11-13.sql` uitgevoerd** (13 november 2026) in de SQL Editor: vaste vorm voor plantingen (geen HTML of script via de API) en grenzen (500 plantingen per tuin, 5 eigen tuinen per account, 50 leden en 50 open uitnodigingen per tuin).
- [x] **Beveiliging in het Supabase-dashboard** (13 november 2026): minimale wachtwoordlengte 8 (app vraagt 8 bij nieuw wachtwoord, inloggen met een ouder wachtwoord van 6 blijft werken), rate limits nagelopen.
- [ ] **Security Advisor** (linkermenu > Advisors > Security Advisor > Refresh), opnieuw na elke SQL-wijziging. Stand 13 november 2026: meldingen over `create_garden` en `join_invite` zijn bewust (de ingangen voor ingelogde gebruikers). Leaked Password Protection kan pas op het Pro-plan. Na de update naar schema `private`: 0 fouten, 3 waarschuwingen (deze drie), allemaal verklaard.
- [x] **Eigen SMTP** (12 november 2026): Brevo, gratis plan (300 mails per dag), afzender `noreply@sowly.eu`, domein geverifieerd met DNS-records bij Strato. Strato kon niet: het pakket van sowly.eu heeft geen mail.
- [x] **Redirect URLs** in Supabase: sowly.eu en www.sowly.eu. Inloggen, bevestigen en de live site getest en werkend (12 november 2026).
- [ ] **Back-ups van Supabase.** Het gratis plan heeft geen downloadbare back-ups; zelf maken met de Supabase-CLI (Docker Desktop moet draaien). Verbindingsregel: Supabase > Connect > **Session pooler** (de directe verbinding is op het gratis plan alleen IPv6), met het databasewachtwoord (Project Settings > Database; niet de publishable key). Drie bestanden, in een map buiten de repo:
  `npx supabase db dump --db-url "<regel>" -f roles.sql --role-only`
  `npx supabase db dump --db-url "<regel>" -f schema.sql`
  `npx supabase db dump --db-url "<regel>" -f data.sql --use-copy --data-only`
  Volgens de Supabase-documentatie zitten daarin tabellen, gegevens, RLS-regels, functies, triggers en `auth.users`; nog niet getest. Nooit in git (openbare repo; e-mailadressen en wachtwoordhashes). Eén keer terugzetten in een leeg tweede project om te bewijzen dat het werkt. Voorlopig wekelijks met de hand; eventueel later een script `npm run backup` met de verbindingsregel in een bestand buiten git, of Windows Taakplanner.
- [ ] **Firebase-project `sowly-f5be6` opruimen** in de Firebase-console (Project settings > Delete project). Wordt niet meer gebruikt.
- [ ] **Nederlandse mailteksten** in Supabase (Authentication > Email Templates): bevestigen en wachtwoord herstellen.
- [ ] **Gratis project pauzeert** na een week zonder gebruik (de reden dat Supabase op 23 oktober afviel). In de gaten houden, of een betaald plan nemen.
- [ ] **Bescherming tegen bots** (CAPTCHA bij aanmelden; Supabase ondersteunt hCaptcha en Cloudflare Turnstile), zodra er gebruikers zijn of misbruik zichtbaar is.
- [ ] **Testen met twee echte accounts:** inloggen, uitnodigen (meekijken en meewerken), weghalen, verlaten, wisselen tussen tuinen. Inloggen werkt live; samen tuinieren met twee accounts nog apart nalopen.
- [ ] **Account verwijderen** in de app (AVG: recht op verwijdering). Nu alleen via de Supabase-console (Authentication > Users); tuinen, lidmaatschappen en uitnodigingen verdwijnen dan mee.
- [ ] **Uitnodigingen beheren:** lijst van openstaande links en intrekken zonder iemand weg te halen.

## Inkomsten
- [x] **KvK-inschrijving** (12 november 2026): Bedrockdock, KvK 42216279.
- [ ] **Zaad-knoppen en advertenties aanzetten.** Staan nog uit (`COMMERCE=false` in `src/app.js`). Op `true` zetten samen met echte links in `SHOPS` en, voor advertenties, een cookiebanner en een bijgewerkte privacyverklaring.
- [ ] **Daisycon:** aanmelden bij de zaadwinkels van je keuze, wachten op goedkeuring (meestal is een live website nodig).
- [ ] **Affiliate per land uitzoeken.** Daisycon heeft kantoren in NL, BE, DE, DK, SE, FI en RO (niet bevestigd voor PL, CZ, SK, AT). Voor die landen een ander netwerk of directe partnerprogramma's zoeken. Per land een eigen lijst `SHOPS`, met winkels in de eigen taal.
- [ ] **Werkvolgorde per land:** eerst NL en BE (Daisycon), daarna DE, DK en SE (Daisycon, alleen als er zaadwinkels in hun lijst staan). Voor elk volgend land (PL, CZ, SK, AT): eerst vaststellen of er een netwerk met zaadwinkels is, daarna pas taal en planning toevoegen. Zonder werkende affiliate start dat land zonder zaad-knoppen of met advertenties.
- [ ] **Links invullen** in de lijst `SHOPS` in de code (nu drie grijze voorbeeldknoppen). Zoeklink per gewas in plaats van vaste productpagina's.
- [ ] **Altijd markeren als affiliate-link.** Teeltgegevens blijven onafhankelijk van wie commissie geeft.
- [ ] **Advertenties:** AdSense voor het web, AdMob voor de Android-app. Hiervoor zijn een cookiebanner en privacyverklaring nodig.
- [ ] Mogelijk: winkelmandje/zaadlijst voor het hele voorjaar in plaats van losse knoppen.

## Internationaal (Duitsland, Oostenrijk, Polen, Tsjechië, Slowakije, Zweden, Denemarken)
Gedaan: alle weken staan relatief aan week 20, er is een verschuiving (`shift`) voor ander klimaat of halfrond, en namen, tips en verzorgingsteksten staan in een taalpakket (`lang-nl.js`).
- [x] **De rest van de interface-teksten** (13 november 2026) (knoppen, koppen, meldingen in `app.js`) ook naar het taalpakket verplaatsen.
- [x] **Taalkiezer** en keuze onthouden (13 november 2026): vlaggetje rechtsboven, tandwiel met instellingen als je bent ingelogd. Taal uit de browser als beginwaarde, Engels als terugval; keuze in `localStorage` (`sowly.taal`), dus per apparaat en niet in je account.
- [ ] **Vertalingen** (Engels, Duits, daarna Pools, Tsjechisch, Slowaaks, Zweeds, Deens). Door een moedertaalspreker laten nalezen, vooral verzorging en buren.
- [ ] **Vertalingen nalezen** (Engels, Duits, Frans, Spaans, Italiaans staan erin sinds 13 november 2026, vertaald door Claude): door een moedertaalspreker laten nalezen, vooral verzorging, buren en gewasnamen (13 november nagezocht: Frans `andijvie` = chicorée scarole klopt (brede andijvie; frisée is de krulvorm); Spaans `winterpostelein` werd verdolaga de Cuba en `boerenkool` col rizada; Italiaans `winterpostelein` = Claytonia, geen gangbare Italiaanse volksnaam gevonden). Mascottenamen gekozen: Sprout, Spross, Pousse, Brotito, Germoglio.
- [x] **Land los van taal** (13 november 2026): keuze onder het vlaggetje en in de instellingen, beginwaarde uit de browser (`de-AT` -> Oostenrijk), opgeslagen in `localStorage` (`sowly.land`). `COUNTRIES` in `i18n.js` zegt per land welke gegevens gelden; zonder lokale gegevens toont de app een melding (Deze maand, Gewassen, voetnoot, jaarplanning).
- [x] **Land per tuin** (13 november 2026): opgeslagen met de vorstweek in `gardens.land`; `supabase-update-2026-11-13-land.sql` uitgevoerd, Security Advisor zonder nieuwe meldingen.
- [x] **Duitsland** (13 november 2026): zaaitijden voor 35 van 45 gewassen uit de Bayerische Gartenakademie (LWG), in `src/region-de.js`; details en vergelijking in `notes/bronnen.md`. Nog open: Duitse bron voor pompoen, knoflook, aubergine, rucola, peterselie, basilicum, peper, pluksla, winterpostelein en tuinboon; Oostenrijk en Zwitserland krijgen nog geen Duitse gegevens (eigen bronnen zoeken).
- [x] **Frankrijk in drie zones** (13 november 2026): FR-C (midden en oost) met CIVAM Auvergne-Rhône-Alpes, 27 van 45 gewassen. `supabase-update-2026-11-13-zones.sql` uitgevoerd (13 november 2026).
- [x] **Frankrijk noord en west** (13 november 2026): landelijke GNIS-tabel (via Jardiner Malin), 29 gewassen. Midden en oost aangevuld tot 39 gewassen.
- [ ] **Frankrijk zuid:** bron met perioden per gewas zoeken (Montpellier is te grof). Ook voor noord en west liever nog een regionale bron.
- [ ] **Frankrijk, 6 gewassen zonder bron** in midden en oost: boerenkool, basilicum, koolrabi, sjalot, pluksla, winterpostelein.
- [ ] **Andere landen** daarna één voor één, telkens eerst lokale bronnen (Spanje en Italië vragen een eigen kalender, geen verschuiving).
- [x] **België** (13 november 2026): `nl-BE` en `fr-BE` met Belgische vlag, zelfde teksten als NL en FR (aliassen in `i18n.js`).
- [ ] **Mails van Supabase per taal** (nu alleen Engels). De app zet de taal in het account (`user_metadata.lang`: nl, en, de, fr, es, it), bij aanmaken en bij wisselen. In Authentication > Email Templates per taal een blok met `{{ if eq .Data.lang "nl" }}…{{ else if … }}…{{ else }}Engels{{ end }}`; nog niet getest. Accounts van vóór 13 november hebben nog geen taal: die krijgen Engels tot ze één keer van taal wisselen.
- [ ] **Nog alleen Nederlands:** de privacyverklaring en de beschrijving in de `<head>` (zoekmachines).
- [ ] **Paginagrootte:** alle zes talen zitten in `docs/index.html` (van 137 naar 303 kB, ongecomprimeerd). Bij meer talen per taal los laden.
- [ ] **Eigen webadres per taal** (`/nl/`, `/de/`, …) met `hreflang` voor zoekmachines.
- [ ] **Locatie kiezen** (plaats of postcode) en daaruit laatste en eerste vorstdatum bepalen. IP-locatie hooguit als voorstel.
- [ ] **Regiogegevens per land met lokale bronnen** nalopen. Zweden en Noord-Polen hebben een latere voorjaarsvorst, Oostenrijk en Tsjechië strengere winters en warmere zomers.
- [ ] **Namen van gewassen per taal** en welke gewassen daar gangbaar zijn.
- [ ] Later: Zuid-Europa vraagt klimaatzones (herfstzaai, hete zomers), niet alleen een verschuiving.
- [ ] Mogelijk Frans voor Wallonië en Brussel.

## Gegevens en inhoud (NL/BE)
- [ ] **Paprika zaaivenster:** bronnen verschillen (Praxis: maart t/m april; Publitas: vanaf half april; app: voorzaaien vanaf week 9). Nader controleren.
- [ ] **Buurregels:** de meeste staan nog als "niet bevestigd door een Nederlandse of Belgische bron". Bij Wageningen University staat dat ze niet wetenschappelijk bewezen zijn.
- [ ] **Water- en lichtregels** zonder bronmarkering nalopen (bevestigd zijn nu o.a. tomaat, rucola, komkommer, paprika en de zon-eis van prei, radijs, wortel, basilicum en pompoen).
- [ ] **Zaaitijden aardbei en kruiden** zonder Nederlandse bron.
- [ ] **Extra gewassen:** dille, koriander, bieslook, munt, spitskool, schorseneer, raapstelen, rammenas, met "nog niet bevestigd" waar nodig.
- [ ] **Najaarszaai** als aparte methode (nu weggelaten).
- [ ] **Een pagina per gewas** voor zoekmachines (SEO).

## Android
- [ ] Android-app via Capacitor met AdMob (Play Store kost een eenmalig bedrag voor een ontwikkelaarsaccount).

## Mijn tuin
- [x] **Jaarplanning als pdf** (24 oktober 2026): knop bij Mijn tuin, kies een jaar, printvenster van de browser (Opslaan als pdf). A4 liggend: per plant een balk over twaalf maanden, daarna per maand een afvinklijst. Geen extra bibliotheek.
- [ ] Jaarplanning testen op een echte iPhone en Android-telefoon (printvenster en Opslaan als pdf).

## Kleine punten
- [ ] Knoppen "Zaad zoeken" en "+ Planten" op één lijn in de gewassenlijst.
- [ ] Grotere plaatjes bij Deze maand en de nieuwe mascotte controleren op een echte telefoon.
- [ ] Mascotte ook in lege tuin en bij de plantanimatie gebruiken (idee).
- [ ] Merknaam controleren in het Benelux-merkenregister voordat je investeert.

## Bronnen die tot nu toe zijn gebruikt (alleen NL/BE)
Hubo, Leefmilieu Brussel, Velt, Boerenbond, Praxis, Welkoop, Gamma, Max Vandaag, ID.nl, Linda, de zaaikalender van een Publitas-catalogus en BTD (Universiteit Twente) voor de buurregels.
