const T = require('./helpers')();
const { CROPS, stepsOf, S } = T;
let fouten = 0;
// 1. Zonder verschuiving moet de planning gelijk zijn aan de basis (alle weken relatief aan week 20).
for (const c of CROPS) { S.frost = 20; S.shift = 0; for (const s of stepsOf(c)) if (s.a < 1 || s.b > 52 || s.a > s.b) { fouten++; console.log('FOUT bereik', c.id, s); } }
// 2. Verschuiving van 26 weken (zuidelijk halfrond): geen ongeldige bereiken, tomaat oogst valt in het voorjaar daar.
S.frost = 20; S.shift = 26;
for (const c of CROPS) for (const s of stepsOf(c)) if (s.a < 1 || s.b > 52 || s.a > s.b) { fouten++; console.log('FOUT +26', c.id, s); }
const oogst = stepsOf(CROPS.find(c => c.id === 'tomaat')).find(s => s.t === 'oogst');
if (!(oogst.a >= 1 && oogst.b <= 20)) { fouten++; console.log('FOUT tomaat oogst +26', oogst); }
console.log(fouten ? fouten + ' fouten' : 'verschuiving ok');
process.exit(fouten ? 1 : 0);
