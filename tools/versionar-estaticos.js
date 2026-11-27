// UI-02: pone en cada <script src="…"> local de public/index.html un ?v=<hash del contenido del archivo>.
// Así un navegador nunca combina una interfaz nueva con un motor o unos planteles viejos de su caché.
// Uso: node tools/versionar-estaticos.js          → actualiza index.html
//      node tools/versionar-estaticos.js --check  → solo verifica (sale con 1 si algún ?v no coincide)
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const PUB = path.join(__dirname, '..', 'public'), INDEX = path.join(PUB, 'index.html');

const hashOf = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 12);
const SCRIPT_RE = /<script src="(\/?)([A-Za-z0-9_.\/-]+\.js)(?:\?v=([^"]*))?"/g;

function scan(html) {
  const out = [];
  for (const m of html.matchAll(SCRIPT_RE)) {
    const [tag, slash, file, current] = m;
    const abs = path.join(PUB, file);
    if (!fs.existsSync(abs)) throw Error('index.html referencia un script que no existe: ' + file);
    out.push({ tag, slash, file, current: current || null, wanted: hashOf(abs) });
  }
  return out;
}
function version(html) {
  return html.replace(SCRIPT_RE, (tag, slash, file) => `<script src="${slash}${file}?v=${hashOf(path.join(PUB, file))}"`);
}
module.exports = { scan, version, hashOf };

if (require.main === module) {
  const html = fs.readFileSync(INDEX, 'utf8'), items = scan(html);
  if (process.argv.includes('--check')) {
    const bad = items.filter(x => x.current !== x.wanted);
    for (const x of items) console.log((x.current === x.wanted ? 'ok     ' : 'VIEJO  ') + x.file.padEnd(24) + ' ?v=' + (x.current || '(sin versión)') + (x.current === x.wanted ? '' : ' → debe ser ' + x.wanted));
    process.exit(bad.length ? 1 : 0);
  }
  const next = version(html);
  if (next !== html) fs.writeFileSync(INDEX, next);
  console.log((next === html ? 'Sin cambios: ' : 'Versionados: ') + items.map(x => x.file).join(', '));
}
