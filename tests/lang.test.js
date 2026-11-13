/* Controleert dat elke taal dezelfde teksten heeft als Nederlands, met dezelfde {plekhouders} en HTML-tags. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = f => fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8');
const files = ['nl', 'en', 'de', 'fr', 'es', 'it'].map(l => `lang-${l}.js`).filter(f => fs.existsSync(path.join(__dirname, '..', 'src', f)));
const ctx = {};
vm.createContext(ctx);
vm.runInContext(files.map(src).join('\n') + ';globalThis.L=LANGS', ctx);
const L = ctx.L, nl = L.nl;
let fouten = 0; const fout = (...a) => { fouten++; console.log('FOUT', ...a); };
const holes = s => (String(s).match(/\{\w+\}/g) || []).sort().join(',');
const tags = s => (String(s).match(/<\/?\w+/g) || []).sort().join(',');
const same = (code, where, a, b) => {
  if (b == null || b === '') return fout(code, 'ontbreekt', where);
  if (holes(a) != holes(b)) fout(code, 'plekhouders', where, holes(a), '<>', holes(b));
  if (tags(a) != tags(b)) fout(code, 'html', where, tags(a), '<>', tags(b));
};
for (const code of Object.keys(L)) {
  const x = L[code];
  if (!x.name) fout(code, 'naam ontbreekt');
  for (const k of Object.keys(nl.ui)) same(code, 'ui.' + k, nl.ui[k], (x.ui || {})[k]);
  for (const k of Object.keys(x.ui || {})) if (!(k in nl.ui)) fout(code, 'onbekende sleutel', k);
  for (const id of Object.keys(nl.crops)) for (const k of ['n', 'tip']) same(code, `crops.${id}.${k}`, nl.crops[id][k], ((x.crops || {})[id] || {})[k]);
  for (const id of Object.keys(nl.care)) for (const k of ['l', 'w', 'v']) same(code, `care.${id}.${k}`, nl.care[id][k], ((x.care || {})[id] || {})[k]);
  for (const id of Object.keys(nl.act)) for (const k of ['n', 's']) same(code, `act.${id}.${k}`, nl.act[id][k], ((x.act || {})[id] || {})[k]);
  for (const id of Object.keys(nl.methods)) same(code, 'methods.' + id, nl.methods[id], (x.methods || {})[id]);
  if (!x.stages || x.stages.length != 5) fout(code, 'stadia');
  const c = x.cal || {};
  if ((c.m || []).length != 12 || (c.m3 || []).length != 12 || (c.d || []).length != 7 || (c.ini || '').length != 12 || typeof c.lower != 'boolean') fout(code, 'kalender');
}
console.log(`${Object.keys(L).length} talen, ${fouten} fouten`);
process.exit(fouten ? 1 : 0);
