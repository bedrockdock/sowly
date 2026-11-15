/* Zaaitijden Polen. Bron: "ABC ekologicznego ogródka przydomowego", prof. dr hab. Bożena Łozowicka, in opdracht van het
   Urząd Marszałkowski Województwa Podlaskiego (KSOW, Programma voor plattelandsontwikkeling 2014-2020), Białystok 2022, tabel
   "Kalendarz siewu/sadzenia w ogrodzie" (blz. 39-41): https://podlaskie.ksow.pl/files/podlaskie/2023/wlasne/ABC_warzywniaka.pdf
   Eén tabel voor heel Polen (de bron noemt de termijnen "orientacyjne"), per maand. Maanden naar weken zoals in region-frn.js:
   I 1-4, II 5-8, III 9-13, IV 14-17, V 18-22, VI 23-26, VII 27-30, VIII 31-35, IX 36-39, X 40-43, XI 44-48, XII 49-52.
   Omzetting: siew do gruntu = buiten, siew pod osłonami = glas, sadzenie rozsady = uitplanten, zbiór = oogst.
   Binnen voorzaaien staat niet in de tabel: daarvoor blijven de NL-weken (zoals bij Duitsland). Uitplanten ontbreekt bij
   kapusta głowiasta, papryka en por: NL-weken. Niet overgenomen (zie notes/bronnen.md): pomidor sadzenie IV-V (de brochure
   zegt zelf dat tomaten pas na de laatste vorst de grond in gaan; NL-weken), rzodkiewka zbiór "III-I" (afgebroken; III-IX),
   marchew sadzenie V (wortels worden niet verplant), pietruszka (wortel- of bladpeterselie niet aangegeven).
   Verzamelrijen: kapusta głowiasta = witte en rode kool, fasola szparagowa = stam- en stokboon, ogórek = komkommer en augurk,
   kabaczek = courgette.
   Aanvulling (15 november 2026, bron per gewas in cs, details in notes/bronnen.md):
   - PNOS Ożarów (zaadbedrijf), productkaart van één ras per gewas: roszponka Volhart 3, jarmuż Dwarf Green Curled, pasternak
     Półdługi Biały, pietruszka naciowa Festival 68, bazylia właściwa Cytrynowa, kapusta włoska Langedijska, kapusta pekińska
     Bristol, kukurydza cukrowa Gucio F1, papryka ostra Cyklon. Wysiew = buiten, pod osłonami/rozsadnik = glas,
     sadzenie = uitplanten. Dekaden: datum naar week = dag van het jaar / 7 naar boven, binnen de weken van die maand.
   - Czosnek: SODR (M. Miłek), sadzenie half september tot eind oktober, zbiór juli.
   - Ziemniak: COBORU, rassenproeven 2024 en 2025 (WPDO 224): sadzenie 8.04-12.05; zeer vroege rassen, zbiór 40 dagen na
     opkomst 13.06-15.07 (= vroeg); middenvroege en middenlate rassen, zbiór 27.08-27.10 (= laat).
   - Kapusta pekińska: oogst ontbreekt op de kaart: NL-weken. Voorjaarsteelt (rozsada II, sadzenie IV) zonder oogst niet overgenomen.
   Gewassen zonder Poolse bron volgen de algemene gegevens (de app meldt dat). */
REGIONS.pl={src:'KSOW Podlaskie',cs:{"veldsla": "PNOS Ożarów", "boerenkool": "PNOS Ożarów", "pastinaak": "PNOS Ożarów",
  "peterselie": "PNOS Ożarów", "basilicum": "PNOS Ożarów", "savooiekool": "PNOS Ożarów", "chinesekool": "PNOS Ożarów",
  "mais": "PNOS Ożarów", "peper": "PNOS Ożarów", "knoflook": "SODR", "aardappel-vroeg": "COBORU", "aardappel-laat": "COBORU"},s:{
  'veldsla':[["buiten", 9, 17], ["buiten", 27, 35], ["oogst", 5, 17], ["oogst", 40, 52]],
  'boerenkool':[["buiten", 19, 25], ["uitplant", 25, 29], ["oogst", 28, 45]],
  'pastinaak':[["buiten", 9, 17], ["oogst", 31, 43]],
  'peterselie':[["buiten", 10, 29], ["oogst", 9, 48]],
  'basilicum':[["binnen", 14, 19], ["glas", 11, 17], ["buiten", 20, 20], ["uitplant", 20, 30], ["oogst", 27, 39]],
  'savooiekool':[["glas", 9, 17], ["uitplant", 18, 26], ["oogst", 40, 48]],
  'chinesekool':[["buiten", 27, 30], ["oogst", 38, 46]],
  'mais':[["binnen", 16, 19], ["buiten", 18, 22], ["uitplant", 20, 24], ["oogst", 36, 43]],
  'peper':[["glas", 9, 12], ["uitplant", 18, 22], ["oogst", 27, 39]],
  'knoflook':[["buiten", 37, 43, "teentjes"], ["oogst", 27, 30]],
  'aardappel-vroeg':[["buiten", 14, 19, "pootaardappelen"], ["oogst", 24, 28]],
  'aardappel-laat':[["buiten", 14, 19, "pootaardappelen"], ["oogst", 35, 43]],
  'tomaat':[["binnen", 6, 19], ["glas", 9, 17], ["uitplant", 21, 26], ["oogst", 23, 39]],
  'courgette':[["binnen", 15, 19], ["glas", 14, 17], ["buiten", 18, 22], ["uitplant", 18, 26], ["oogst", 27, 39]],
  'sla':[["binnen", 6, 12], ["glas", 5, 17], ["glas", 27, 35], ["buiten", 14, 26], ["uitplant", 18, 22], ["oogst", 18, 43]],
  'pluksla':[["glas", 5, 30], ["buiten", 14, 26], ["uitplant", 18, 22], ["oogst", 18, 39]],
  'wortel':[["buiten", 9, 26], ["oogst", 23, 43]],
  'rammenas':[["buiten", 14, 30], ["oogst", 23, 43]],
  'radijs':[["buiten", 5, 39], ["oogst", 9, 39]],
  'pompoen':[["binnen", 15, 19], ["glas", 14, 17], ["buiten", 18, 22], ["uitplant", 18, 22], ["oogst", 36, 43]],
  'stamslaboon':[["binnen", 16, 19], ["buiten", 18, 30], ["uitplant", 20, 24], ["oogst", 27, 39]],
  'stokboon':[["buiten", 18, 30], ["oogst", 27, 39]],
  'spinazie':[["buiten", 9, 17], ["buiten", 31, 43], ["oogst", 14, 26], ["oogst", 40, 48]],
  'komkommer':[["binnen", 16, 22], ["glas", 14, 22], ["buiten", 18, 22], ["uitplant", 18, 26], ["oogst", 23, 35]],
  'augurk':[["binnen", 14, 18], ["glas", 14, 22], ["buiten", 18, 22], ["uitplant", 18, 26], ["oogst", 23, 35]],
  'paprika':[["binnen", 9, 22], ["glas", 9, 17], ["uitplant", 22, 26], ["oogst", 27, 39]],
  'aubergine':[["binnen", 9, 13], ["glas", 9, 17], ["uitplant", 18, 26], ["oogst", 27, 43]],
  'biet':[["buiten", 18, 26], ["oogst", 23, 43]],
  'snijbiet':[["buiten", 18, 26], ["oogst", 18, 26], ["oogst", 31, 39]],
  'prei':[["binnen", 6, 13], ["glas", 9, 17], ["buiten", 9, 17], ["uitplant", 14, 28], ["oogst", 36, 48]],
  'ui':[["glas", 9, 13], ["buiten", 9, 17], ["uitplant", 14, 22], ["oogst", 27, 39]],
  'doperwt':[["buiten", 9, 22], ["oogst", 23, 30]],
  'tuinboon':[["glas", 5, 13], ["buiten", 9, 17], ["uitplant", 14, 17], ["oogst", 27, 30]],
  'bloemkool':[["glas", 9, 13], ["uitplant", 9, 22], ["oogst", 23, 39]],
  'broccoli':[["glas", 9, 17], ["uitplant", 14, 30], ["oogst", 27, 43]],
  'spruitkool':[["glas", 14, 17], ["uitplant", 18, 26], ["oogst", 31, 43]],
  'wittekool':[["glas", 9, 17], ["uitplant", 19, 24], ["oogst", 23, 43]],
  'rodekool':[["glas", 9, 17], ["uitplant", 19, 24], ["oogst", 23, 43]],
  'koolrabi':[["glas", 5, 13], ["uitplant", 18, 26], ["oogst", 23, 30]],
  'rucola':[["glas", 9, 35], ["buiten", 18, 30], ["oogst", 18, 43]],
  'selderij':[["glas", 9, 13], ["uitplant", 18, 22], ["oogst", 27, 43]]
}};
