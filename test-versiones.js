// UI-02: cada <script src> local de public/index.html debe tener ?v= igual al hash de su contenido. node test-versiones.js
// Si falla: node tools/versionar-estaticos.js
'use strict';
const fs = require('fs'), path = require('path'), { scan } = require('./tools/versionar-estaticos');
let fails = 0; const ok = (c, m) => { console.log((c ? 'OK  ' : 'FALLA ') + m); if (!c) fails++; };
const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8'), items = scan(html);
ok(items.length >= 7, 'index.html carga ' + items.length + ' scripts locales');
for (const x of items) ok(x.current === x.wanted, x.file + ' ?v=' + (x.current || '(sin versión)') + (x.current === x.wanted ? '' : ' → debe ser ' + x.wanted + ' (correr node tools/versionar-estaticos.js)'));
const headers = fs.readFileSync(path.join(__dirname, 'public', '_headers'), 'utf8');
ok(/\/index\.html\s*\n\s*Cache-Control: no-cache/.test(headers) && /^\/\s*\n\s*Cache-Control: no-cache/m.test(headers), '_headers: index.html sin caché (siempre se revalida)');
ok(/\/\*\.js\s*\n\s*Cache-Control: public, max-age=31536000, immutable/.test(headers), '_headers: scripts versionados con caché larga');
console.log(fails ? '\nFALLAS: ' + fails : '\nTodo OK'); process.exit(fails ? 1 : 0);
