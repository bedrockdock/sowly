/* Laadt de app uit docs/index.html in een nagebootste omgeving (zonder browser). */
const fs = require('fs'), vm = require('vm'), path = require('path');
module.exports = function load() {
  const h = fs.readFileSync(path.join(__dirname, '..', 'docs', 'index.html'), 'utf8');
  const start = h.indexOf('<script>') + 8;
  let js = h.slice(start, h.indexOf('</script>', start)).replace("'use strict';", '');
  js = js.replace(/\}\)\(\);\s*$/, ';globalThis.__t={CROPS,CARE,NB,plantSVG,stepsOf,S}})();');
  const els = {};
  const mk = id => els[id] || (els[id] = { innerHTML: '', textContent: '', hidden: true, dataset: {}, focus() {}, setAttribute() {}, scrollTop: 0, style: {}, addEventListener() {}, classList: { add() {}, remove() {} } });
  const doc = { querySelector: s => mk(s), querySelectorAll: () => [], addEventListener() {}, getElementById: mk };
  const ctx = { document: doc, matchMedia: () => ({ matches: true }), scrollTo() {}, localStorage: { getItem: () => null, setItem() {} }, setInterval() {}, clearInterval() {}, setTimeout() {}, console, Date, Math, JSON, Object };
  vm.createContext(ctx);
  vm.runInContext(js, ctx);
  return { ...ctx.__t, els };
};
