#!/usr/bin/env node
/* Bouwt de app uit src/ tot één bestand.
 *   node build.js             -> docs/index.html   (voor GitHub Pages, Netlify, Cloudflare)
 *   node build.js --artifact  -> dist/artifact.html (zoals in Claude gepubliceerd, zonder doctype)
 */
const fs = require('fs'), path = require('path');
const src = f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const artifact = process.argv.includes('--artifact');

const template = src('template.html');
const js = ['data.js', 'lang-nl.js', 'plants.js', 'app.js'].map(src).join('\n');

const face = (family, weight, file, range) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url(fonts/${file}.woff2) format('woff2');${range ? 'unicode-range:' + range + ';' : ''}}`;
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
const fonts = [['Fredoka', [500, 600, 700]], ['Nunito', [400, 600, 700]]]
  .flatMap(([fam, ws]) => ws.flatMap(w => [
    face(fam, w, `${fam.toLowerCase()}-latin-${w}-normal`, LATIN),
    face(fam, w, `${fam.toLowerCase()}-latin-ext-${w}-normal`, EXT)])).join('\n');

let out;
if (artifact) {
  out = template + '\n' + js + '\n</script>\n';
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'dist', 'artifact.html'), out);
  console.log('dist/artifact.html', out.length, 'bytes');
} else {
  const head = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#2F8F46">
<meta name="description" content="Sowly: plan wanneer je zaait, verpot, uitplant en oogst, met je eigen tuin en tekenfilmplanten.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icon-192.png">
<style>body{margin:0}
${fonts}</style>
`;
  const body = template.replace('</style>', '</style>\n</head>\n<body>');
  out = head + body + '\n' + js + '\n</script>\n</body>\n</html>\n';
  fs.mkdirSync(path.join(__dirname, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'docs', 'index.html'), out);
  console.log('docs/index.html', out.length, 'bytes');
}
