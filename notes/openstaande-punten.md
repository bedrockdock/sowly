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
- [x] **Uitnodigen met link** in de app, per uitnodiging meekijken of meewerken. Weghalen trekt ook de link in waarmee iemand binnenkwam.
- [x] **Kaart "Log in om je tuin te bewaren"** bovenaan Mijn tuin zolang je niet bent ingelogd. (Lokale tuin meenemen is vervallen met het lokaal opslaan.)
- [x] **E-mailadres bevestigen** voordat iemand kan inloggen (Supabase: Confirm email aan). Houdt aanmelden zelf niet tegen.
- [x] **Database inrichten** (12 november 2026): `supabase.sql` in Supabase uitgevoerd (SQL Editor > Run). Na een wijziging in dat bestand opnieuw draaien; het script begint met opruimen, dus bestaande gegevens gaan dan weg.
- [x] **Eigen SMTP** (12 november 2026): Brevo, gratis plan (300 mails per dag), afzender `noreply@sowly.eu`, domein geverifieerd met DNS-records bij Strato. Strato kon niet: het pakket van sowly.eu heeft geen mail.
- [x] **Redirect URLs** in Supabase: sowly.eu en www.sowly.eu. Inloggen, bevestigen en de live site getest en werkend (12 november 2026).
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
- [ ] **De rest van de interface-teksten** (knoppen, koppen, meldingen in `app.js`) ook naar het taalpakket verplaatsen.
- [ ] **Taalkiezer** en keuze onthouden. Taal uit de browser als beginwaarde, Engels als terugval.
- [ ] **Vertalingen** (Engels, Duits, daarna Pools, Tsjechisch, Slowaaks, Zweeds, Deens). Door een moedertaalspreker laten nalezen, vooral verzorging en buren.
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
