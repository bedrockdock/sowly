/* Taalpakket Nederlands (nl). Eén bestand per taal; structuur en perioden staan in data.js.
   Dit is de brontaal: andere talen vallen per tekst terug op Nederlands. Toepassen gebeurt in i18n.js. */
const LANGS={nl:{
 "crops": {
  "tomaat": {
   "n": "Tomaat",
   "tip": "Vorstgevoelig: pas na de laatste nachtvorst buiten. Plant tomaten diep, tot aan de onderste bladeren."
  },
  "courgette": {
   "n": "Courgette",
   "tip": "Vorstgevoelig en groot: geef elke plant minstens 80 cm ruimte. Oogst jong en vaak."
  },
  "sla": {
   "n": "Sla",
   "tip": "Zaai elke twee weken een stukje voor een doorlopende oogst. In de hitte schiet sla door."
  },
  "wortel": {
   "n": "Wortel",
   "tip": "Niet verplanten. Zaai dun en houd de grond vochtig tot de zaadjes opkomen."
  },
  "radijs": {
   "n": "Radijs",
   "tip": "Het snelste gewas van de tuin: oogsten kan na vier tot zes weken. Zaai om de twee weken een stukje."
  },
  "pompoen": {
   "n": "Pompoen",
   "tip": "Vorstgevoelig en hongerig: geef veel compost. Oogst als de steel verhout is."
  },
  "stamslaboon": {
   "n": "Stamslaboon",
   "tip": "Vorstgevoelig. Rauwe bonen zijn giftig, kook ze dus altijd gaar."
  },
  "spinazie": {
   "n": "Spinazie",
   "tip": "Zaai in het voorjaar en het najaar. Bij lange dagen schiet spinazie door."
  },
  "veldsla": {
   "n": "Veldsla",
   "tip": "Zaai eind zomer. Veldsla verdraagt vorst en geeft de hele winter oogst."
  },
  "knoflook": {
   "n": "Knoflook",
   "tip": "Zet de teentjes 5 cm diep met de punt omhoog en 10 cm uit elkaar. Oogst als de onderste bladeren geel worden."
  },
  "komkommer": {
   "n": "Komkommer",
   "tip": "Vorstgevoelig en warmteminnend. Houd de grond gelijkmatig vochtig en oogst jong voor de beste smaak."
  },
  "paprika": {
   "n": "Paprika",
   "tip": "Zaai vroeg, want paprika heeft een lange warme groeitijd nodig. Zet hem pas na de laatste vorst buiten, bij voorkeur in de kas."
  },
  "aubergine": {
   "n": "Aubergine",
   "tip": "Warmteminnend: groeit het best in de kas of op een beschutte, zonnige plek."
  },
  "biet": {
   "n": "Biet",
   "tip": "Een bietenzaadje bevat meerdere kiemen: dun uit na het opkomen. Oogst bij een doorsnede van ongeveer 5 tot 8 cm."
  },
  "prei": {
   "n": "Prei",
   "tip": "Plant jonge preien diep, in een gat van ongeveer 15 cm, zodat de schacht wit blijft. Prei verdraagt vorst en kan tot in de winter blijven staan."
  },
  "ui": {
   "n": "Ui",
   "tip": "Zaaiuien zijn goedkoop, plantuitjes zijn de snelle route. Oogst als het loof omvalt en laat de uien daarna drogen."
  },
  "doperwt": {
   "n": "Doperwt",
   "tip": "Zaai vroeg: doperwten houden van koel weer en verdragen lichte vorst. Geef steun met rijshout of gaas."
  },
  "tuinboon": {
   "n": "Tuinboon",
   "tip": "Een van de vroegste gewassen: zaai vanaf februari. Knijp de toppen uit zodra de peulen zetten, dat helpt tegen bladluis."
  },
  "bloemkool": {
   "n": "Bloemkool",
   "tip": "Houdt van vochtige, voedselrijke grond en koel weer. Vouw een blad over de kop om hem tegen de zon te beschermen."
  },
  "broccoli": {
   "n": "Broccoli",
   "tip": "Oogst de hoofdkop voordat de bloemetjes geel worden. Daarna groeien er zijscheuten bij."
  },
  "rodekool": {
   "n": "Rode kool",
   "tip": "Een stabiel gewas dat ruimte vraagt: plant ongeveer 50 cm uit elkaar. Tegen koolwitjes helpt een net."
  },
  "boerenkool": {
   "n": "Boerenkool",
   "tip": "Boerenkool smaakt zoeter na de eerste nachtvorst. Pluk de onderste bladeren en laat de top doorgroeien."
  },
  "rucola": {
   "n": "Rucola",
   "tip": "Klaar in drie tot zes weken. Zaai in de halfschaduw, want in de volle zon schiet rucola snel door."
  },
  "snijbiet": {
   "n": "Snijbiet",
   "tip": "Pluk steeds de buitenste bladeren, dan groeit de plant door tot de eerste strenge vorst."
  },
  "pastinaak": {
   "n": "Pastinaak",
   "tip": "Kiemt langzaam en alleen met vers zaad. De smaak wordt beter na de eerste vorst."
  },
  "peterselie": {
   "n": "Peterselie",
   "tip": "Kiemt traag, soms pas na drie weken. Houd de grond intussen vochtig."
  },
  "basilicum": {
   "n": "Basilicum",
   "tip": "Vorstgevoelig en kouwelijk: pas na half mei buiten. Knijp de toppen regelmatig uit voor een bossige plant."
  },
  "koolrabi": {
   "n": "Koolrabi",
   "tip": "Oogst jong, bij ongeveer 6 tot 8 cm doorsnede. Grotere knollen worden houtig."
  },
  "aardappel-vroeg": {
   "n": "Aardappel (vroeg)",
   "tip": "Vroege rassen zijn snel klaar maar niet lang te bewaren. Laat de pootaardappelen vooraf voorkiemen en dek het loof af bij nachtvorst. Aanaarden beschermt tegen groene knollen."
  },
  "aardappel-laat": {
   "n": "Aardappel (laat)",
   "tip": "Halfvroege en late rassen geven de grootste opbrengst en zijn goed te bewaren. Bronnen noemen vooral september als oogstmaand. Oogst als het loof verdord is en laat de aardappels buiten drogen. Aanaarden beschermt tegen groene knollen."
  },
  "andijvie": {
   "n": "Andijvie",
   "tip": "Zaai pas vanaf half juni, anders schiet andijvie door. Bind de planten enkele weken voor de oogst bijeen om ze te bleken."
  },
  "spruitkool": {
   "n": "Spruitkool",
   "tip": "Een lange teelt: zaai in het voorjaar en oogst vanaf november. Plant stevig aan en pluk de sprotjes van onder naar boven."
  },
  "wittekool": {
   "n": "Witte kool",
   "tip": "De late teelt geeft koppen voor de herfst. Plant ongeveer 50 cm uit elkaar en leg een net tegen koolwitjes."
  },
  "savooiekool": {
   "n": "Savooiekool",
   "tip": "Zaai en plant zoals rode kool. Een net houdt koolwitjes tegen."
  },
  "chinesekool": {
   "n": "Chinese kool",
   "tip": "Zaai niet eerder dan half juli en direct op de plek waar de kool blijft staan. Oogst van half september tot half november."
  },
  "stokboon": {
   "n": "Stokboon",
   "tip": "Geef een klimsteun van minstens twee meter en zaai pas na half mei. Rauwe bonen zijn giftig, kook ze dus altijd gaar."
  },
  "mais": {
   "n": "Suikermaïs",
   "tip": "Zaai in blokken van meerdere rijen, zodat de bloemen elkaar bestuiven. Oogst als de kolfdraden bruin zijn."
  },
  "peper": {
   "n": "Peper",
   "tip": "Zaai vanaf half april en zet de plant pas na de laatste vorst buiten. Hoe pittig de vruchten worden, hangt vooral af van het ras."
  },
  "augurk": {
   "n": "Augurk",
   "tip": "Zaai onder glas in april of direct buiten vanaf half mei. Pluk regelmatig, dan blijft de plant nieuwe vruchten maken."
  },
  "sjalot": {
   "n": "Sjalot",
   "tip": "Druk de uitjes in de grond met de punt net erboven. Oogst als het loof geel wordt en laat ze daarna drogen."
  },
  "bosui": {
   "n": "Bosui",
   "tip": "Zaai dicht op elkaar in rijen. Trek de uitjes jong uit de grond of laat ze doorgroeien."
  },
  "pluksla": {
   "n": "Pluksla",
   "tip": "Pluk steeds de buitenste bladeren, dan groeit de plant door en kun je meerdere keren oogsten."
  },
  "winterpostelein": {
   "n": "Winterpostelein",
   "tip": "Zaai begin september op een plek die na de oogst vrij is gekomen. Oogst van eind oktober tot in het voorjaar."
  },
  "venkel": {
   "n": "Knolvenkel",
   "tip": "Zaai pas na 21 juni, eerder zaaien geeft doorschieten. Zet venkel niet naast tomaat of dille."
  },
  "selderij": {
   "n": "Knolselderij",
   "tip": "Zaai onder glas in maart en april en plant vanaf mei uit. Een geduldig gewas met een lange groeitijd."
  }
 },
 "care": {
  "tomaat": {
   "l": "Zo zonnig mogelijk, warm en beschut, bijvoorbeeld tegen een muur.",
   "w": "Regelmatig water, maar niet zoveel dat de grond doornat blijft. Staat de plant te droog, geef dan niet te veel water in één keer.",
   "v": "Plant in voedzame grond en geef een tomatenmeststof zodra de voeding is uitgewerkt. Stop met bemesten en geef minder water zodra de vruchten rood zijn."
  },
  "courgette": {
   "l": "Volle zon en een warme plek.",
   "w": "Veel water, vooral bij droog weer. Giet aan de voet om meeldauw te beperken.",
   "v": "Plant op compost of verteerde mest en geef bij de vruchtzetting extra voeding."
  },
  "sla": {
   "l": "Zon in het voorjaar, halfschaduw in de zomer. Dan schiet sla minder snel door.",
   "w": "Regelmatig en in kleine beurten. Bij droogte wordt sla bitter.",
   "v": "Een lichte eter: compost vooraf is genoeg."
  },
  "wortel": {
   "l": "Zon, of lichte halfschaduw.",
   "w": "Houd de grond vochtig tot de opkomst, daarna matig. Wisselend vocht laat wortels splijten.",
   "v": "Een matige eter, extra mest is meestal niet nodig. Geen verse mest: die geeft vertakte wortels."
  },
  "radijs": {
   "l": "Volle zon. Zaai in de zomer vaker en houd de grond vochtig.",
   "w": "Gelijkmatig vochtig voor snelle, knapperige radijsjes.",
   "v": "Geen extra voeding nodig."
  },
  "pompoen": {
   "l": "Volle zon en veel ruimte.",
   "w": "Veel water, vooral tijdens het groeien van de vruchten.",
   "v": "Een hongerige plant: plant in een kuil met veel compost."
  },
  "stamslaboon": {
   "l": "Zon en een warme, beschutte plek.",
   "w": "Water vooral tijdens de bloei en de peulzetting.",
   "v": "Bonen halen zelf stikstof uit de lucht. Geef geen stikstofrijke mest."
  },
  "spinazie": {
   "l": "Zon in het voor- en najaar, halfschaduw in de zomer.",
   "w": "Houd de grond vochtig, anders schiet spinazie door.",
   "v": "Houdt van stikstofrijke grond: werk compost in."
  },
  "veldsla": {
   "l": "Zon tot halfschaduw.",
   "w": "Houd de zaaibedding vochtig tot de opkomst, daarna matig.",
   "v": "Geen extra voeding nodig."
  },
  "knoflook": {
   "l": "Volle zon.",
   "w": "Matig water. Natte grond in de winter geeft rot.",
   "v": "Geen verse mest. Compost vooraf is genoeg."
  },
  "komkommer": {
   "l": "Volle zon en beschut.",
   "w": "Veel water, aan de voet gegeven.",
   "v": "Een flinke eter: compost vooraf en elke twee weken voeding."
  },
  "paprika": {
   "l": "Volle zon, liefst in de kas of tegen een warme muur.",
   "w": "Regelmatig en ruim water, gelijkmatig vochtig houden.",
   "v": "Wekelijks voeding zodra de eerste vruchten zetten."
  },
  "aubergine": {
   "l": "Volle zon en veel warmte.",
   "w": "Regelmatig water, de grond mag niet uitdrogen.",
   "v": "Geef elke twee weken voeding vanaf de bloei."
  },
  "biet": {
   "l": "Zon tot halfschaduw.",
   "w": "Gelijkmatig vochtig houden.",
   "v": "Compost vooraf, geen verse mest."
  },
  "prei": {
   "l": "Zon tot lichte halfschaduw.",
   "w": "Regelmatig water in droge perioden.",
   "v": "Een flinke eter: compost vooraf en halverwege het seizoen extra voeding."
  },
  "ui": {
   "l": "Volle zon.",
   "w": "Matig water. Stop zodra het loof omvalt.",
   "v": "Geen verse mest."
  },
  "doperwt": {
   "l": "Zon tot halfschaduw. Doperwten houden van koele grond.",
   "w": "Water vooral tijdens de bloei en de peulzetting.",
   "v": "Erwten halen zelf stikstof uit de lucht."
  },
  "tuinboon": {
   "l": "Zon tot halfschaduw, ook goed op koele grond.",
   "w": "Matig, iets meer tijdens de bloei.",
   "v": "Maakt zelf stikstof via de wortels. Geen extra voeding."
  },
  "bloemkool": {
   "l": "Volle zon, op stevige grond.",
   "w": "Gelijkmatig vochtig houden. Droogte geeft kleine, losse koppen.",
   "v": "Een zware eter: veel compost vooraf en halverwege het seizoen extra voeding."
  },
  "broccoli": {
   "l": "Volle zon, op stevige grond.",
   "w": "Gelijkmatig vochtig houden. Droogte geeft kleine, losse koppen.",
   "v": "Een zware eter: veel compost vooraf en halverwege het seizoen extra voeding."
  },
  "rodekool": {
   "l": "Volle zon, op stevige grond.",
   "w": "Gelijkmatig vochtig houden. Droogte geeft kleine, losse koppen.",
   "v": "Een zware eter: veel compost vooraf en halverwege het seizoen extra voeding."
  },
  "boerenkool": {
   "l": "Zon tot halfschaduw.",
   "w": "Regelmatig water, zeker in een droge zomer.",
   "v": "Een flinke eter: compost vooraf en in de zomer extra voeding."
  },
  "koolrabi": {
   "l": "Zon, op losse en vochtige grond.",
   "w": "Gelijkmatig vochtig, anders worden de knollen houtig.",
   "v": "Een koolgewas en dus een flinke eter: werk compost in en geef halverwege het seizoen extra voeding."
  },
  "rucola": {
   "l": "Volle zon. Houd de grond vochtig, anders schiet rucola door.",
   "w": "Regelmatig en veel water, vooral bij warm weer. Droogte maakt rucola scherp.",
   "v": "Geen extra voeding nodig."
  },
  "snijbiet": {
   "l": "Zon tot halfschaduw.",
   "w": "Regelmatig water. De plant verdraagt een korte droogte.",
   "v": "Compost vooraf en bij langdurig oogsten wat extra voeding."
  },
  "pastinaak": {
   "l": "Zon, op diepe en losse grond.",
   "w": "Gelijkmatig vochtig, na het opkomen matig.",
   "v": "Geen verse mest: die geeft vertakte wortels."
  },
  "peterselie": {
   "l": "Zon tot halfschaduw.",
   "w": "Houd de grond vochtig, vooral tijdens het kiemen.",
   "v": "Keukenkruiden hebben weinig voeding nodig."
  },
  "basilicum": {
   "l": "Volle zon en beschutting. Basilicum is kouwelijk.",
   "w": "Houd licht vochtig en geef water aan de voet.",
   "v": "Een beetje compost volstaat."
  },
  "aardappel-vroeg": {
   "l": "Volle zon.",
   "w": "Vooral tijdens de bloei en de knolvorming water geven.",
   "v": "Compost of verteerde mest vooraf. Geen kalk, dat geeft schurft."
  },
  "aardappel-laat": {
   "l": "Volle zon.",
   "w": "Vooral tijdens de bloei en de knolvorming water geven.",
   "v": "Compost of verteerde mest vooraf. Geen kalk, dat geeft schurft."
  },
  "andijvie": {
   "l": "Zon tot halfschaduw.",
   "w": "Regelmatig water, zeker in droge zomers.",
   "v": "Compost vooraf is genoeg."
  },
  "spruitkool": {
   "l": "Volle zon, op stevige grond.",
   "w": "Gelijkmatig vochtig houden. Droogte geeft kleine, losse koppen.",
   "v": "Een zware eter: veel compost vooraf en halverwege het seizoen extra voeding."
  },
  "wittekool": {
   "l": "Volle zon, op stevige grond.",
   "w": "Gelijkmatig vochtig houden. Droogte geeft kleine, losse koppen.",
   "v": "Een zware eter: veel compost vooraf en halverwege het seizoen extra voeding."
  },
  "savooiekool": {
   "l": "Volle zon, op stevige grond.",
   "w": "Gelijkmatig vochtig houden. Droogte geeft kleine, losse koppen.",
   "v": "Een zware eter: veel compost vooraf en halverwege het seizoen extra voeding."
  },
  "chinesekool": {
   "l": "Zon tot halfschaduw.",
   "w": "Gelijkmatig vochtig houden.",
   "v": "Een koolgewas en dus een flinke eter: werk compost in."
  },
  "stokboon": {
   "l": "Zon en een warme, beschutte plek.",
   "w": "Water vooral tijdens de bloei en de peulzetting.",
   "v": "Bonen halen zelf stikstof uit de lucht. Geef geen stikstofrijke mest."
  },
  "mais": {
   "l": "Volle zon en beschut tegen wind.",
   "w": "Regelmatig water, vooral tijdens de bloei en de kolfvorming.",
   "v": "Een hongerige plant: werk compost in en voed halverwege het seizoen bij."
  },
  "peper": {
   "l": "Volle zon, liefst in de kas of tegen een warme muur.",
   "w": "Gelijkmatig water, niet te nat.",
   "v": "Wekelijks voeding zodra de eerste vruchten zetten."
  },
  "augurk": {
   "l": "Volle zon en beschut.",
   "w": "Veel water, aan de voet gegeven.",
   "v": "Compost vooraf en elke twee weken voeding."
  },
  "sjalot": {
   "l": "Volle zon.",
   "w": "Matig water. Stop zodra het loof geel wordt.",
   "v": "Geen verse mest."
  },
  "bosui": {
   "l": "Zon tot lichte halfschaduw.",
   "w": "Houd de grond licht vochtig.",
   "v": "Geen extra voeding nodig."
  },
  "pluksla": {
   "l": "Zon in het voorjaar, halfschaduw in de zomer. Dan schiet sla minder snel door.",
   "w": "Regelmatig en in kleine beurten.",
   "v": "Compost vooraf is genoeg."
  },
  "winterpostelein": {
   "l": "Zon tot halfschaduw. Houdt van koel weer.",
   "w": "Matig water.",
   "v": "Geen extra voeding nodig."
  },
  "venkel": {
   "l": "Volle zon.",
   "w": "Gelijkmatig vochtig houden.",
   "v": "Compost vooraf is meestal genoeg."
  },
  "selderij": {
   "l": "Zon tot halfschaduw, op vochtige en voedselrijke grond.",
   "w": "Houd de grond gelijkmatig vochtig.",
   "v": "Een flinke eter: werk compost in en voed halverwege bij."
  }
 },
 "act": {
  "binnen": {
   "n": "Voorzaaien binnen",
   "s": "Binnen"
  },
  "glas": {
   "n": "Zaaien onder glas",
   "s": "Onder glas"
  },
  "verpot": {
   "n": "Verpotten",
   "s": "Verpotten"
  },
  "buiten": {
   "n": "Direct buiten zaaien",
   "s": "Buiten zaaien"
  },
  "uitplant": {
   "n": "Uitplanten",
   "s": "Uitplanten"
  },
  "oogst": {
   "n": "Oogsten",
   "s": "Oogsten"
  }
 },
 "methods": {
  "binnen": "Voorgezaaid binnen",
  "glas": "Gezaaid onder glas",
  "buiten": "Direct buiten"
 },
 "stages": [
  "Zaadje",
  "Kiem",
  "Jonge plant",
  "Volgroeid",
  "Oogstklaar"
 ],
 "name": "Nederlands",
 "cal": {
  "m": ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],
  "m3": ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],
  "d": ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],
  "ini": "JFMAMJJASOND",
  "lower": true
 },
 "ui": {
  "per.teentjes": "Poten (teentjes)",
  "per.uitjes": "Plantuitjes poten",
  "per.pootaardappelen": "Poten (pootaardappelen)",
  "per.plantsjalotten": "Poten (plantsjalotten)",
  "today": "{day} {d} {month} · week {w}",
  "date": "{d} {m}",
  "longdate": "{d} {month} {y}",
  "rel.0": "vandaag",
  "rel.1": "morgen",
  "rel.n": "over {n} dagen",
  "you": "jij",
  "someone": "iemand",
  "youMark": "(jij)",
  "role.owner": "eigenaar",
  "role.edit": "werkt mee",
  "role.view": "kijkt mee",
  "example": "voorbeeld",
  "ex.bed": "Bak {n}",
  "ex.sill": "Vensterbank",
  "mascot": "Kiempje, de mascotte van Sowly",
  "tab.tuin": "Mijn tuin",
  "tab.maand": "Deze maand",
  "tab.gewassen": "Gewassen",
  "nav": "Hoofdmenu",
  "close": "Sluiten",
  "note": "Zaaitijden zijn indicatief voor Nederland en België. Het zaadzakje blijft leidend.",
  "privacy": "Privacy",

  "lang.btn": "Taal: {name}",
  "langland.title": "Taal en land",
  "land.q": "Waar ligt je tuin?",
  "note.partial": "Zaaitijden voor {land} (bron: {src}) zijn er voor {n} van de {t} gewassen. Voor de andere is er nog geen lokale bron; die zaaitijden zijn een algemene richtlijn. Het zaadzakje blijft leidend.",
  "src.local": "Zaaitijden voor {land}: {src}.",
  "src.none": "Voor dit gewas is er nog geen bron uit {land}; de zaaitijden zijn een algemene richtlijn.",
  "note.zone": "Voor {land} is er nog geen lokale bron. De zaaitijden zijn een algemene richtlijn; pas de laatste nachtvorst aan voor je streek. Het zaadzakje blijft leidend.",
  "zone.FR-N": "Noord en west",
  "zone.FR-C": "Midden en oost",
  "zone.FR-S": "Zuid (mediterraan)",
  "note.other": "Voor {land} is er nog geen lokale bron. De zaaitijden zijn een algemene richtlijn; pas de laatste nachtvorst aan voor je streek. Het zaadzakje blijft leidend.",
  "lang.title": "Taal",
  "lang.note": "Zaaitijden hangen af van het land, niet van de taal.",
  "set.btn": "Instellingen",
  "set.title": "Instellingen",
  "set.lang": "Taal",
  "set.frostShared": "Dit geldt voor iedereen in deze tuin.",
  "set.account": "Account",
  "set.samen": "Samen tuinieren",

  "link.expired": "Deze link is verlopen of al gebruikt. Log in of vraag een nieuwe aan.",
  "link.bad": "Deze link werkt niet. Log in of vraag een nieuwe aan.",
  "err.loginDown": "Inloggen is nu niet bereikbaar, dus opslaan lukt even niet. Probeer het later opnieuw.",
  "err.gardenOpen": "Je online tuin kon niet worden geopend. Probeer het later opnieuw.",
  "login.invited": "Je bent uitgenodigd voor een tuin. Log in of maak een account om mee te doen.",
  "login.clickFirst": "Klik eerst op de link in de mail. Log daarna hier in met je e-mailadres en wachtwoord.",
  "joined": "Je doet nu mee in {name}.",
  "garden.of": "Tuin van {name}",
  "garden.mine": "Mijn tuin",
  "garden.shared": "Gedeelde tuin",
  "invite.gone": "Deze uitnodiging is verlopen of bestaat niet meer. Vraag een nieuwe aan.",
  "noAccess": "Je hebt geen toegang meer tot deze tuin.",

  "inv.madeTitle": "Uitnodiging gemaakt",
  "inv.madeEdit": "Wie deze link opent en inlogt, kan meewerken in je tuin: planten toevoegen, aanpassen en verwijderen.",
  "inv.madeView": "Wie deze link opent en inlogt, kan meekijken in je tuin, maar niets aanpassen.",
  "inv.link": "Link",
  "inv.copy": "Kopiëren",
  "inv.share": "Delen",
  "inv.madeNote": "Iedereen met deze link kan 14 dagen lang meedoen. Daarna verloopt hij; wie al meedoet, blijft erin. Deel hem alleen met wie je vertrouwt. Haal je iemand weg met het kruisje bij de naam, dan werkt de link waarmee die persoon binnenkwam ook niet meer.",
  "inv.title": "Iemand uitnodigen",
  "inv.q": "Wat mag de ander in je tuin?",
  "inv.edit": "Meewerken: planten toevoegen, aanpassen en verwijderen",
  "inv.view": "Meekijken: alleen bekijken",
  "inv.note": "Je krijgt een link die je zelf doorstuurt, bijvoorbeeld via WhatsApp of mail. De ander moet inloggen of een account maken.",
  "inv.fail": "De uitnodiging kon niet worden gemaakt. Probeer het opnieuw.",
  "copied": "Link gekopieerd.",
  "share.text": "Doe mee in mijn moestuin op Sowly",

  "ae.cred": "E-mailadres of wachtwoord klopt niet.",
  "ae.mail": "Dit e-mailadres klopt niet.",
  "ae.exists": "Er is al een account met dit e-mailadres. Log in of vraag een nieuw wachtwoord aan.",
  "ae.weak": "Kies een sterker wachtwoord van minstens 8 tekens.",
  "ae.same": "Kies een ander wachtwoord dan je oude.",
  "ae.rate": "Te veel pogingen. Wacht even en probeer het opnieuw.",
  "ae.mailrate": "Er zijn net te veel mails verstuurd. Wacht even en probeer het opnieuw.",
  "ae.nosignup": "Een account maken kan nu niet.",
  "ae.noprovider": "Inloggen met e-mail staat nog niet aan.",
  "ae.offline": "Geen verbinding. Controleer je internet.",
  "ae.generic": "Er ging iets mis. Probeer het opnieuw.",

  "lg.newpw": "Nieuw wachtwoord",
  "lg.forgot": "Wachtwoord vergeten",
  "lg.signup": "Account maken",
  "lg.login": "Inloggen",
  "lg.pw": "Wachtwoord",
  "lg.min8": "(minstens 8 tekens)",
  "lg.noAccount": "Nog geen account? Maak er een",
  "lg.forgotQ": "Wachtwoord vergeten?",
  "lg.back": "Terug naar inloggen",
  "lg.name": "Je naam",
  "lg.nameNote": "Anderen in een gedeelde tuin zien deze naam.",
  "lg.mail": "E-mailadres",
  "lg.savePw": "Wachtwoord opslaan",
  "lg.sendReset": "Stuur herstelmail",
  "lg.pwChanged": "Je wachtwoord is aangepast.",
  "lg.resetSent": "Als er een account met dit adres is, staat er nu een mail klaar om je wachtwoord opnieuw in te stellen. Kijk ook in je spam.",
  "lg.confirmFirst": "Bevestig eerst je e-mailadres. Klik op de link in de mail.",
  "need.loading": "Inloggen wordt nog geladen. Probeer het zo opnieuw.",
  "need.opening": "Je online tuin wordt nog geopend. Probeer het zo opnieuw.",
  "need.confirm": "Bevestig eerst je e-mailadres, dan kun je opslaan.",
  "need.login": "Log in om planten in je tuin te zetten. Je tuin staat dan veilig online, ook als je je browser leegmaakt.",

  "acc.title": "Account",
  "acc.loading": "Even laden…",
  "acc.confTitle": "Bevestig je e-mailadres",
  "acc.confText": "We hebben een mail gestuurd naar {mail}. Klik op de link in die mail. Daarna kun je je tuin opslaan. Geen mail gezien? Kijk ook in je spam.",
  "acc.confirmed": "Ik heb bevestigd",
  "acc.resend": "Mail opnieuw sturen",
  "acc.other": "Inloggen met een ander account",
  "acc.saveTitle": "Log in om je tuin te bewaren",
  "acc.saveText": "Hieronder zie je voorbeeldplanten. Log in om je eigen tuin bij te houden. Hij staat dan veilig online, op al je apparaten, en je kunt samen tuinieren.",
  "acc.saveBtn": "Inloggen of account maken",
  "acc.opening": "Je online tuin wordt geopend…",
  "acc.garden": "Tuin",
  "acc.own": "Dit is jouw tuin. Nodig iemand uit om mee te kijken of mee te werken.",
  "acc.edit": "Je werkt mee in {g}.",
  "acc.view": "Je kijkt mee in {g}. Aanpassen kan alleen de eigenaar of wie meewerkt.",
  "acc.invite": "Iemand uitnodigen",
  "loggedAs": "Ingelogd als {name}",
  "logout": "Uitloggen",
  "kick.label": "{name} uit je tuin halen",
  "kick.yes": "ja, weghalen",
  "leave": "Deze tuin verlaten",
  "leave.yes": "Ja, verlaten",
  "samen": "Samen",
  "samen.aria": "Samen tuinieren, {n} {p}",
  "person1": "persoon",
  "personN": "personen",
  "samen.title": "Samen tuinieren",
  "viewOnly": "Je kijkt mee in deze tuin. Aanpassen kan alleen de eigenaar of wie meewerkt.",
  "checkFail": "Controleren lukte niet. Probeer het opnieuw.",
  "resent": "Mail opnieuw gestuurd.",
  "fail": "Dat lukte niet. Probeer het opnieuw.",
  "switchFail": "Die tuin kon niet worden geopend.",

  "tl.plant": "Poten",
  "tl.shoot": "Eerste scheut",
  "tl.sprout": "Kiemt",

  "ad": "Hier komt later een advertentie (AdMob in de Android-app).",
  "shop": "Zaadwinkel {n}",
  "seed.title": "Zaad halen voor de komende weken",
  "seed.from": "zaaien vanaf {d}",
  "seed.now": "nu zaaien",
  "seed.find": "Zaad zoeken",
  "seed.aff": "Links naar webwinkels zijn affiliate-links: de planner krijgt een kleine vergoeding als je koopt. Dat kost jou niets extra.",
  "seed.sheet": "Zaad zoeken: {c}",
  "seed.pick": "Kies een webwinkel. Je gaat naar de zoekresultaten voor {q}.",
  "seed.q": "{c}zaad",
  "seed.afflabel": "(affiliate-link)",
  "seed.example": "<b>Voorbeeld:</b> hier komen de echte winkelknoppen met jouw Daisycon-links zodra je programma's zijn goedgekeurd. Elke knop wordt zichtbaar gemarkeerd als affiliate-link.",

  "m.prev": "Vorige maand",
  "m.next": "Volgende maand",
  "frost.title": "Laatste nachtvorst: week {w}",
  "frost.around": "(rond {d})",
  "frost.note": "Vorstgevoelige gewassen schuiven mee.",
  "frost.earlier": "Een week eerder",
  "frost.later": "Een week later",
  "crop1": "gewas",
  "cropN": "gewassen",
  "past": "voorbij",
  "from": "vanaf {d}",
  "until": "t/m {d}",
  "plantBtn": "Planten",
  "m.emptyT": "Deze maand valt er weinig te doen.",
  "m.emptyP": "Kijk bij Gewassen wat je alvast kunt voorbereiden.",

  "lv.l.zon": "Volle zon",
  "lv.l.zh": "Zon tot halfschaduw",
  "lv.l.half": "Halfschaduw",
  "lv.w.veel": "Veel water",
  "lv.w.gemiddeld": "Gemiddeld water",
  "lv.w.weinig": "Weinig water",
  "lv.v.zwaar": "Zware eter",
  "lv.v.middel": "Matige eter",
  "lv.v.licht": "Lichte eter",
  "chip.aardappel": "Aardappel",
  "chip.kool": "Koolsoorten",
  "care.title": "Verzorging",
  "care.l": "Licht",
  "care.w": "Water",
  "care.v": "Voeding",
  "care.ok": "Bevestigd door Nederlandse of Belgische bron",
  "care.unc": "Nog niet bevestigd door een Nederlandse of Belgische bron",
  "nb.title": "Buren",
  "nb.good": "Gaan goed samen",
  "nb.bad": "Liever niet ernaast",
  "nb.more": "Ook genoemd, niet bevestigd door een Nederlandse of Belgische bron",
  "nb.good2": "Zou goed samen kunnen gaan",
  "nb.bad2": "Zou liever niet ernaast kunnen",
  "nb.none": "Geen bevestigde buurregel gevonden.",
  "nbc.title": "Buren in je tuin",
  "nbc.pair": "{a} en {b} ({bed}): {v}",
  "nbc.bad": "liever niet naast elkaar.",
  "nbc.good": "gaan goed samen.",
  "nbc.warn": "Let op",
  "nbc.ok": "Goed",
  "nbc.note": "Alleen combinaties die een Nederlandse bron noemt, gebaseerd op de plek die je bij elke plant invult.",

  "g.title": "Gewassen",
  "g.count": "{n} gewassen",
  "g.search": "Zoek een gewas",
  "g.ph": "Bijvoorbeeld tomaat",
  "g.sow": "Zaaien: {r}",
  "g.harvest": "Oogst: {r}",
  "g.plus": "+ Planten",
  "g.none": "Geen gewas gevonden voor \"{q}\".",

  "gantt": "Tijdlijn van zaaien tot einde oogst",
  "pc.busy": "nu bezig",
  "pc.done": "Seizoen afgerond",
  "pc.sowOn": "Zaaien op {d}",
  "pc.day": "Dag {n} · {stage}",
  "pc.methodOn": "{m} op {d}",
  "pc.by": "door {name}",
  "edit": "Wijzigen",
  "del": "Verwijderen",
  "del.yes": "Ja, verwijderen",
  "up.title": "Komende 30 dagen",
  "up.now": "Nu",
  "up.none": "Geen taken de komende 30 dagen.",

  "yp.title": "Jaarplanning {y}",
  "yp.sub": "{g} · laatste nachtvorst week {w} (rond {d}) · gemaakt met Sowly op {today}",
  "yp.month": "Per maand",
  "yp.sheet": "Jaarplanning",
  "yp.intro": "Een overzicht van je tuin over het hele jaar, met per maand een afvinklijst voor in de tuin.",
  "yp.pdf": "Je browser opent het printvenster. Kies daar <b>Opslaan als pdf</b> voor een pdf, of print direct.",
  "yp.file": "Sowly jaarplanning {y}",
  "yp.noprint": "Printen lukt hier niet. Open Sowly in je browser.",

  "cl.nosave": "Opslaan en samen tuinieren werken hier niet. Wat je toevoegt, ben je kwijt als je de pagina sluit.",
  "cl.shared": "Deze tuin wordt gedeeld: wie je uitnodigt ziet en bewerkt dezelfde planten, direct.",
  "cl.invite": "<b>Uitnodigen:</b> kies bovenaan in Claude <b>Delen</b>, voeg de ander toe en geef bewerkrechten. Met alleen kijkrechten kan iemand meekijken maar niets wijzigen.",

  "sort.by": "Sorteren op",
  "sort.aandacht": "Eerst aandacht nodig",
  "sort.alfabet": "Alfabet",
  "sort.label": "Herkenning",
  "sort.plek": "Plek",

  "inst.short": "App installeren",
  "inst.btn": "Installeer Sowly-app",
  "inst.done": "Sowly staat nu als app op je toestel.",
  "inst.title": "Sowly-app installeren",
  "inst.intro": "Zet Sowly op je beginscherm. Hij opent dan zonder adresbalk, als een app.",
  "inst.s1": "Tik in Safari op de <b>Deel</b>-knop {icon} (in Chrome of Edge: het Deel-menu).",
  "inst.s2": "Kies <b>Zet op beginscherm</b>. Staat het er niet, scrol dan naar beneden.",
  "inst.s3": "Tik op <b>Voeg toe</b>.",
  "inst.note": "De app heeft een eigen opslag, los van Safari. Log daar dus één keer opnieuw in.",
  "inst.icon": "Deel-knop",

  "tuin.title": "Mijn tuin",
  "tuin.inl": "Ingelogd als <b>{name}</b>",
  "tuin.inlGarden": "tuin {g}",
  "tuin.add": "+ Gewas planten",
  "tuin.year": "Jaarplanning",
  "tuin.loading": "Je tuin wordt geladen…",
  "tuin.emptyT": "Je tuin is nog leeg.",
  "tuin.emptyP": "Voeg een gewas toe en zie direct wanneer je moet verpotten, uitplanten en oogsten.",

  "cs.stages": "Groeistadium",
  "cs.play": "▶ Afspelen",
  "cs.year": "Het hele jaar",
  "cs.today": "De streep geeft vandaag aan.",
  "cs.add": "Planten in mijn tuin",

  "add.title": "Gewas planten",
  "f.crop": "Gewas",
  "f.method": "Zaaimethode",
  "f.date": "Datum van zaaien of poten",
  "f.label": "Herkenning (optioneel)",
  "f.label2": "Herkenning",
  "f.labelPh": "Bijvoorbeeld Roma of Rij 2",
  "f.bed": "Plek (optioneel)",
  "f.bed2": "Plek",
  "f.bedPh": "Bijvoorbeeld Bak 1",
  "f.hint": "Je hebt al {n} {crop} in je tuin. Geef deze een eigen naam, zoals de variëteit of de rij. Laat je het leeg, dan wordt het #{next}.",
  "add": "Toevoegen",
  "cancel": "Annuleren",
  "save": "Opslaan",
  "edit.title": "{crop} aanpassen"
 }
}};
