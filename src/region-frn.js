/* Bron: tabel "Calendrier de semis et récolte au potager" van Jardiner Malin (bijgewerkt 24 april 2026), met als bron GNIS:
   https://www.jardiner-malin.fr/fiche/calendrier-semis-recolte-potager.html . Landelijk Frans, niet per streek.
   Omzetting: À l'intérieur = binnen, Sous abri = glas, Pleine terre en Pépinière = buiten, Repiquage = uitplanten, Récolte = oogst;
   'mi-' = halverwege de maand, 'fin' = laatste 2 weken, 'début' = eerste 2 weken. Varianten voor zachte streken en het zuidwesten
   niet overgenomen. Komkommer/augurk: repiquage "15 jours après le semis" = binnenzaai + 2 weken. Maïs: oogst "3-4 mois après le
   semis" = zaaiperiode + 13 tot 17 weken. Details: notes/bronnen.md. */
/* Aanvulling 15 november 2026: Vilmorin (zaadbedrijf, landelijk), productkaarten op eshop.vilmorin-jardin.fr met
   "Mois de semis" en "Mois de récolte" (alleen maanden, geen methode). Eén ras per gewas, zie notes/bronnen.md. Methode zoals
   de app het gewas zaait (direct gezaaid = buiten, voorgezaaid = binnen); uitplanten staat niet op de kaart: NL-weken. */
REGIONS.frn={src:'GNIS (Jardiner Malin)',cs:{"raap": "GNIS (Jardiner Malin)", "meloen": "GNIS (Jardiner Malin)", "knoflook": "Vilmorin", "prei": "Vilmorin", "doperwt": "Vilmorin", "boerenkool": "Vilmorin", "rucola": "Vilmorin", "snijbiet": "Vilmorin", "pastinaak": "Vilmorin", "peterselie": "Vilmorin", "basilicum": "Vilmorin", "koolrabi": "Vilmorin", "chinesekool": "Vilmorin", "peper": "Vilmorin", "sjalot": "Vilmorin", "pluksla": "Vilmorin"},s:{
  'knoflook':[["buiten", 40, 48, "teentjes"], ["oogst", 23, 30]],
  'prei':[["binnen", 6, 13], ["buiten", 9, 22], ["uitplant", 14, 28], ["oogst", 1, 13], ["oogst", 36, 52]],
  'doperwt':[["buiten", 9, 26], ["oogst", 23, 35]],
  'boerenkool':[["buiten", 14, 26], ["uitplant", 24, 30], ["oogst", 1, 8], ["oogst", 40, 52]],
  'rucola':[["buiten", 9, 35], ["oogst", 18, 43]],
  'snijbiet':[["buiten", 14, 30], ["oogst", 31, 48]],
  'pastinaak':[["buiten", 5, 26], ["oogst", 1, 13], ["oogst", 31, 52]],
  'peterselie':[["buiten", 5, 39], ["oogst", 1, 52]],
  'basilicum':[["binnen", 9, 22], ["uitplant", 20, 24], ["oogst", 18, 43]],
  'koolrabi':[["buiten", 9, 26], ["uitplant", 14, 30], ["oogst", 27, 48]],
  'chinesekool':[["buiten", 27, 35], ["oogst", 36, 48]],
  'peper':[["binnen", 5, 17], ["uitplant", 22, 26], ["oogst", 31, 48]],
  'sjalot':[["buiten", 1, 13, "plantsjalotten"], ["buiten", 44, 52, "plantsjalotten"], ["oogst", 23, 30]],
  'pluksla':[["buiten", 9, 35], ["oogst", 14, 39]],
  'tomaat':[["binnen", 1, 13], ["glas", 9, 17], ["uitplant", 18, 22], ["oogst", 27, 43]],
  'paprika':[["binnen", 5, 17], ["uitplant", 18, 22], ["oogst", 27, 39]],
  'aubergine':[["binnen", 5, 17], ["uitplant", 14, 22], ["oogst", 27, 43]],
  'biet':[["buiten", 9, 30], ["oogst", 27, 48]],
  'wortel':[["glas", 5, 13], ["glas", 42, 48], ["buiten", 9, 30], ["oogst", 18, 48]],
  'selderij':[["binnen", 5, 13], ["glas", 5, 13], ["buiten", 16, 22], ["uitplant", 14, 22], ["oogst", 31, 48]],
  'andijvie':[["buiten", 5, 32], ["uitplant", 9, 35], ["oogst", 18, 52]],
  'broccoli':[["buiten", 18, 26], ["uitplant", 23, 35], ["oogst", 40, 52], ["oogst", 1, 22]],
  'wittekool':[["buiten", 5, 26], ["uitplant", 14, 30], ["oogst", 23, 52], ["oogst", 1, 13]],
  'rodekool':[["buiten", 5, 26], ["uitplant", 14, 30], ["oogst", 23, 52], ["oogst", 1, 13]],
  'savooiekool':[["buiten", 5, 26], ["uitplant", 14, 30], ["oogst", 23, 52], ["oogst", 1, 13]],
  'spruitkool':[["buiten", 9, 22], ["uitplant", 18, 26], ["oogst", 40, 52], ["oogst", 1, 8]],
  'bloemkool':[["buiten", 9, 26], ["uitplant", 23, 35], ["oogst", 27, 52], ["oogst", 9, 26]],
  'komkommer':[["binnen", 9, 17], ["buiten", 14, 26], ["uitplant", 11, 19], ["oogst", 23, 43]],
  'augurk':[["binnen", 9, 17], ["buiten", 14, 26], ["uitplant", 11, 19], ["oogst", 23, 43]],
  'courgette':[["binnen", 9, 17], ["buiten", 14, 26], ["uitplant", 18, 26], ["oogst", 29, 48]],
  'pompoen':[["binnen", 14, 22], ["uitplant", 18, 26], ["oogst", 36, 48]],
  'spinazie':[["buiten", 31, 41], ["buiten", 5, 17], ["oogst", 40, 52], ["oogst", 1, 17], ["oogst", 18, 26]],
  'venkel':[["buiten", 14, 32], ["uitplant", 18, 35], ["oogst", 31, 43]],
  'tuinboon':[["buiten", 5, 17], ["oogst", 18, 26]],
  'stamslaboon':[["buiten", 14, 32], ["oogst", 23, 41]],
  'stokboon':[["buiten", 14, 28], ["oogst", 25, 41]],
  'sla':[["glas", 44, 52], ["glas", 1, 4], ["buiten", 7, 43], ["uitplant", 1, 8], ["uitplant", 14, 43], ["oogst", 9, 43]],
  'veldsla':[["buiten", 29, 43], ["oogst", 36, 52], ["oogst", 1, 13]],
  'mais':[["glas", 9, 22], ["buiten", 23, 30], ["oogst", 22, 47]],
  'ui':[["buiten", 5, 17], ["buiten", 33, 39], ["uitplant", 40, 52], ["uitplant", 1, 8], ["oogst", 27, 39], ["oogst", 14, 26]],
  'raap':[["buiten", 10, 22], ["buiten", 27, 39], ["oogst", 18, 28], ["oogst", 36, 48]],
  'meloen':[["binnen", 5, 17], ["buiten", 18, 22], ["uitplant", 16, 22], ["oogst", 23, 39]],
  'rammenas':[["buiten", 23, 35], ["oogst", 44, 52]],
  'radijs':[["buiten", 7, 39], ["oogst", 11, 48]],
  'aardappel-vroeg':[["buiten", 9, 17, "pootaardappelen"], ["oogst", 23, 35]],
  'aardappel-laat':[["buiten", 9, 17, "pootaardappelen"], ["oogst", 36, 43]]
}};
