/* Zaaitijden Frankrijk, Midden & Oost. Bron: CIVAM Auvergne-Rhône-Alpes, "Calendrier des semis, plantations et récoltes",
   gepubliceerd door de DRAAF Auvergne-Rhône-Alpes (ministère de l'Agriculture), met Préfet de région en ARS:
   https://draaf.auvergne-rhone-alpes.agriculture.gouv.fr/IMG/pdf/FICHE_TECH_CALENDRIER_SEMIS_PLANTATIONS_RECOLTES-2_cle091634.pdf
   Lijnen exact uit de PDF gelezen. Semis = buiten zaaien (alleen bij gewassen die ook bij ons direct gezaaid worden),
   Plantations = uitplanten, Récoltes = oogsten. Binnen voorzaaien en onder glas staan niet in de bron: NL-weken.
   Niet overgenomen (bron maakt het onderscheid niet): aardappel (vroeg/laat), venkel (staat bij de kruiden), boerenkool en
   savooiekool ("chou frisé" is dubbelzinnig). Gewassen die CIVAM niet heeft, komen uit de landelijke GNIS-tabel (zie region-frn.js);
   die staan in cs (bron per gewas). Details: notes/bronnen.md. */
REGIONS.frc={src:'CIVAM Auvergne-Rhône-Alpes',cs:{"andijvie": "GNIS (Jardiner Malin)", "savooiekool": "GNIS (Jardiner Malin)", "spruitkool": "GNIS (Jardiner Malin)", "augurk": "GNIS (Jardiner Malin)", "courgette": "GNIS (Jardiner Malin)", "pompoen": "GNIS (Jardiner Malin)", "venkel": "GNIS (Jardiner Malin)", "tuinboon": "GNIS (Jardiner Malin)", "veldsla": "GNIS (Jardiner Malin)", "mais": "GNIS (Jardiner Malin)", "aardappel-vroeg": "GNIS (Jardiner Malin)", "aardappel-laat": "GNIS (Jardiner Malin)"},s:{
  'sla':[["binnen", 6, 12], ["glas", 6, 12], ["buiten", 7, 43], ["uitplant", 12, 38], ["oogst", 10, 48]],
  'snijbiet':[["buiten", 14, 34], ["oogst", 1, 9], ["oogst", 22, 51]],
  'rucola':[["glas", 8, 11], ["buiten", 9, 39], ["oogst", 18, 48]],
  'spinazie':[["glas", 1, 9], ["buiten", 6, 18], ["buiten", 31, 39], ["oogst", 1, 9], ["oogst", 14, 26], ["oogst", 36, 52]],
  'stamslaboon':[["binnen", 16, 19], ["buiten", 18, 31], ["uitplant", 18, 31], ["oogst", 23, 39]],
  'stokboon':[["buiten", 18, 31], ["oogst", 23, 39]],
  'doperwt':[["buiten", 10, 31], ["oogst", 23, 39]],
  'peterselie':[["glas", 9, 13], ["buiten", 14, 35], ["uitplant", 5, 44], ["oogst", 1, 52]],
  'bloemkool':[["glas", 3, 12], ["uitplant", 9, 35], ["oogst", 18, 48]],
  'broccoli':[["glas", 10, 14], ["uitplant", 9, 35], ["oogst", 18, 48]],
  'wittekool':[["glas", 6, 13], ["uitplant", 9, 35], ["oogst", 31, 52]],
  'rodekool':[["glas", 10, 14], ["uitplant", 9, 35], ["oogst", 31, 52]],
  'chinesekool':[["buiten", 26, 35], ["oogst", 39, 52]],
  'prei':[["binnen", 6, 13], ["buiten", 14, 21], ["uitplant", 18, 34], ["oogst", 1, 9], ["oogst", 31, 52]],
  'bosui':[["buiten", 10, 26], ["oogst", 26, 39]],
  'knoflook':[["buiten", 40, 48, "teentjes"], ["oogst", 14, 26]],
  'ui':[["buiten", 10, 26], ["uitplant", 10, 26, "uitjes"], ["oogst", 22, 35]],
  'komkommer':[["binnen", 16, 22], ["uitplant", 19, 35], ["oogst", 26, 39]],
  'aubergine':[["binnen", 9, 13], ["uitplant", 22, 31], ["oogst", 31, 39]],
  'paprika':[["binnen", 9, 22], ["uitplant", 22, 31], ["oogst", 31, 39]],
  'peper':[["binnen", 16, 22], ["uitplant", 22, 31], ["oogst", 31, 39]],
  'tomaat':[["binnen", 6, 19], ["glas", 12, 16], ["uitplant", 18, 34], ["oogst", 26, 39]],
  'wortel':[["glas", 7, 10], ["buiten", 9, 26], ["oogst", 22, 52]],
  'pastinaak':[["buiten", 9, 22], ["oogst", 31, 52]],
  'radijs':[["glas", 7, 17], ["buiten", 5, 18], ["buiten", 31, 44], ["oogst", 14, 22], ["oogst", 36, 48]],
  'biet':[["buiten", 9, 35], ["oogst", 18, 52]],
  'selderij':[["glas", 10, 17], ["uitplant", 9, 22], ["oogst", 26, 52]]
,
  'andijvie':[["buiten", 5, 32], ["uitplant", 9, 35], ["oogst", 18, 52]],
  'savooiekool':[["buiten", 5, 26], ["uitplant", 14, 30], ["oogst", 23, 52], ["oogst", 1, 13]],
  'spruitkool':[["buiten", 9, 22], ["uitplant", 18, 26], ["oogst", 40, 52], ["oogst", 1, 8]],
  'augurk':[["binnen", 9, 17], ["buiten", 14, 26], ["uitplant", 11, 19], ["oogst", 23, 43]],
  'courgette':[["binnen", 9, 17], ["buiten", 14, 26], ["uitplant", 18, 26], ["oogst", 29, 48]],
  'pompoen':[["binnen", 14, 22], ["uitplant", 18, 26], ["oogst", 36, 48]],
  'venkel':[["buiten", 14, 32], ["uitplant", 18, 35], ["oogst", 31, 43]],
  'tuinboon':[["buiten", 5, 17], ["oogst", 18, 26]],
  'veldsla':[["buiten", 29, 43], ["oogst", 36, 52], ["oogst", 1, 13]],
  'mais':[["glas", 9, 22], ["buiten", 23, 30], ["oogst", 22, 47]],
  'aardappel-vroeg':[["buiten", 9, 17, "pootaardappelen"], ["oogst", 23, 35]],
  'aardappel-laat':[["buiten", 9, 17, "pootaardappelen"], ["oogst", 36, 43]]
}};
