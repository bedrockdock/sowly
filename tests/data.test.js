const T = require('./helpers')();
const { CROPS, CARE, NB, plantSVG } = T;
let fouten = 0; const fout = (...a) => { fouten++; console.log('FOUT', ...a); };
for (const c of CROPS) for (let s = 0; s < 5; s++) if (/NaN|undefined|\[object/.test(plantSVG(c, s))) fout('svg', c.id, s);
const ids = CROPS.map(c => c.id);
if (ids.length !== new Set(ids).size) fout('dubbele id');
for (const c of CROPS) {
  if (!c.n || !c.tip) fout('tekst ontbreekt', c.id);
  for (const [t, a, b] of c.s) if (a > b || a < 1 || b > 52) fout('bereik', c.id, t, a, b);
  const care = CARE[c.id];
  if (!care) fout('verzorging ontbreekt', c.id); else for (const k of ['l', 'w', 'v']) if (!care[k][1]) fout('verzorgingstekst leeg', c.id, k);
}
for (const [land, r] of Object.entries(T.REGIONS)) {
  if (!r.src) fout('bron ontbreekt', land);
  for (const id of Object.keys(r.cs || {})) if (!r.s[id]) fout('bron per gewas zonder periodes', land, id);
  for (const [id, s] of Object.entries(r.s)) {
    if (!ids.includes(id)) fout('onbekend gewas', land, id);
    for (const [t, a, b] of s) if (a > b || a < 1 || b > 52 || !['binnen', 'glas', 'verpot', 'buiten', 'uitplant', 'oogst'].includes(t)) fout('bereik', land, id, t, a, b);
    if (!s.some(x => x[0] == 'oogst')) fout('geen oogst', land, id);
  }
}
for (const id in NB) { const n = NB[id]; for (const x of n.g) if (n.s.includes(x)) fout('buur zowel goed als slecht', id, x); }
console.log(`${CROPS.length} gewassen, ${fouten} fouten`);
process.exit(fouten ? 1 : 0);
