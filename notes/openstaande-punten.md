# Sowly – openstaande punten

Bijgewerkt: vrijdag 23 oktober 2026. Naam: **Sowly** (internationaal, van "to sow"). De mascotte, het springende groene kereltje met de scheut, heet in Nederland **Kiempje** en krijgt per taal een eigen naam (Engels: Sprout, Duits: Spross).

## Eerst (om online te komen)
- [ ] **Domein: sowly.eu aanhouden.** Besluit 23 oktober: de naam Sowly blijft, met sowly.eu als adres. Bekend: sowly.com en sowly.app zijn bezet, en de naam is in meerdere landen bezet. Eerst uitzoeken wat er achter die bestaande Sowly's zit (actief bedrijf, welke sector?) en het merkenregister (EUIPO en Benelux, klasse 9, 42 en 31) raadplegen voordat je investeert. Controleer ook of sowly.eu zelf vrij is, en of "Sowly" in een andere taal iets onhandigs betekent.
- [ ] **Namen die niet gelukt zijn** (niet opnieuw proberen): Sowmate (bezet), moestuin-namen (meest bezet), Moonsprout (te lang), Harvia (saunamerk), Harvest Moon en FarmVille (merken). Nog niet gecontroleerd en bruikbaar als terugval: Growie, Plotty, Harvo, Orto, Veggo, Harvie, Tendrio, Verdo, Plotmate, Patchmate, First Frost.
- [ ] **Webversie online zetten** (aanpak: VS Code + Claude desktop, code in GitHub). Voorbereid in dit project: los `docs/index.html` met doctype en viewport, icoon (`icon.svg`, `icon-192.png`, `icon-512.png`), manifest voor het beginscherm en bouwscript.
  - [ ] eenmalig `npm run fonts` draaien (Fredoka en Nunito lokaal in `docs/fonts/`; kon in Claude niet gedownload worden)
  - [ ] repository op GitHub, daarna GitHub Pages (map `/docs`) om te testen, later Netlify of Cloudflare
  - [ ] let op: GitHub Pages is gratis alleen voor openbare repo's en niet bedoeld voor commerciële sites
- [ ] **Voorwaarden hosting lezen** voor affiliate-links en advertenties (Cloudflare noemt de gratis variant "voor persoonlijke of hobbyprojecten"; de algemene voorwaarden zijn niet gelezen).

## Accounts en samen tuinieren
- [ ] **Backend kiezen en opzetten.** Voorstel: Firebase (gratis project, jij maakt het aan, sleutels aan Claude). Supabase pauzeert gratis projecten na een week.
- [ ] **Inlogstroom:** eerst anoniem (lokaal opslaan), inloggen pas bij overal-synchroniseren, iemand uitnodigen of herinneringen. "Doorgaan met Google" en e-mail zonder wachtwoord.
- [ ] **Uitnodigen met link of code** in de app zelf (in de Claude-versie loopt het via Delen en moet de ander een Claude-account hebben). Keuze: meekijken of ook bewerken.
- [ ] **Lokale tuin meenemen naar het account** na het inloggen.
- [ ] **Herinnering "Zet je tuin veilig"** voor wie niet inlogt (bijvoorbeeld na het derde gewas).
- [ ] **Samen tuinieren testen met twee echte accounts.** Tot nu toe alleen getest met een nagebootste database.

## Inkomsten
- [ ] **KvK-inschrijving afronden.** Tot die tijd staan zaad-knoppen en advertenties uit (`COMMERCE=false` in `src/app.js`). Daarna op `true` zetten, samen met echte links in `SHOPS` en, voor advertenties, cookiebanner en privacyverklaring.
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

## Kleine punten
- [ ] Knoppen "Zaad zoeken" en "+ Planten" op één lijn in de gewassenlijst.
- [ ] Grotere plaatjes bij Deze maand en de nieuwe mascotte controleren op een echte telefoon.
- [ ] Mascotte ook in lege tuin en bij de plantanimatie gebruiken (idee).
- [ ] Merknaam controleren in het Benelux-merkenregister voordat je investeert.

## Bronnen die tot nu toe zijn gebruikt (alleen NL/BE)
Hubo, Leefmilieu Brussel, Velt, Boerenbond, Praxis, Welkoop, Gamma, Max Vandaag, ID.nl, Linda, de zaaikalender van een Publitas-catalogus en BTD (Universiteit Twente) voor de buurregels.
