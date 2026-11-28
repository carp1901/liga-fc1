// TST-09: corre ESLint («no-undef», ver eslint.config.mjs) sobre el código y también sobre el <script> inline de
// public/index.html, que se extrae a .lint/ (carpeta temporal, se borra al terminar). Necesita eslint y globals instalados
// (en CI: npm i --no-save eslint@9.17.0 globals@15.14.0). Uso: node tools/lint.js
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), TMP = path.join(ROOT, '.lint');
const html = fs.readFileSync(path.join(ROOT, 'public', 'index.html'), 'utf8');
const esJS = attrs => { const t = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1]; return !t || /^(text|application)\/(javascript|ecmascript)$/i.test(t); };
const inline = [...html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi)].filter(m => esJS(m[1] || '') && !/\bsrc\s*=/.test(m[1] || '') && m[2].trim());
fs.rmSync(TMP, { recursive: true, force: true }); fs.mkdirSync(TMP);
inline.forEach((m, i) => fs.writeFileSync(path.join(TMP, 'index-inline-' + i + '.js'), m[2]));
const bin = path.join(ROOT, 'node_modules', 'eslint', 'bin', 'eslint.js');
const r = spawnSync(process.execPath, [bin, '--max-warnings=0', '.'], { cwd: ROOT, stdio: 'inherit' });
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(r.status === null ? 1 : r.status);
