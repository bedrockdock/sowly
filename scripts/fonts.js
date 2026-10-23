#!/usr/bin/env node
/* Haalt de lettertypes (Fredoka en Nunito, SIL Open Font License) lokaal binnen via npm.
 * Gebruik: node scripts/fonts.js     (daarna: node build.js hoeft niet opnieuw)
 */
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sowly-fonts-'));
const dest = path.join(__dirname, '..', 'docs', 'fonts');
fs.mkdirSync(dest, { recursive: true });
execSync('npm init -y', { cwd: tmp, stdio: 'ignore' });
execSync('npm install @fontsource/fredoka @fontsource/nunito', { cwd: tmp, stdio: 'inherit' });
let n = 0;
for (const fam of ['fredoka', 'nunito']) {
  const dir = path.join(tmp, 'node_modules', '@fontsource', fam, 'files');
  for (const f of fs.readdirSync(dir)) {
    if (/^(fredoka|nunito)-latin(-ext)?-(400|500|600|700)-normal\.woff2$/.test(f)) { fs.copyFileSync(path.join(dir, f), path.join(dest, f)); n++; }
  }
}
console.log(n + ' lettertypebestanden gekopieerd naar docs/fonts');
