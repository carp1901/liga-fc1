'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');

function parseCSV(input) {
  const rows = [];
  let row = [], value = '', quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quoted) {
      if (c === '"' && input[i + 1] === '"') { value += '"'; i++; }
      else if (c === '"') quoted = false;
      else value += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(value); value = ''; }
    else if (c === '\n') { row.push(value.replace(/\r$/, '')); rows.push(row); row = []; value = ''; }
    else value += c;
  }
  if (value.length || row.length) { row.push(value.replace(/\r$/, '')); rows.push(row); }
  return rows;
}

const source = fs.readFileSync('public/data.js', 'utf8');
const match = source.match(/const ROLE_OFFSETS=\{([\s\S]*?)\n\};/);
assert(match, 'No se encontró ROLE_OFFSETS en public/data.js');
const supported = new Set([...match[1].matchAll(/^\s*([A-Z]+):\{/gm)].map(m => m[1]));
supported.add('POR'); // Perfil base de arquero en PROFILES.

const files = [
  'planteles/primera-2026.csv',
  ...Array.from({ length: 6 }, (_, i) => `planteles/borradores/primera-nacional-2026/bloque${i + 1}.csv`)
];
const expected = [1012, 155, 171, 182, 194, 164, 160];
let total = 0;
for (let i = 0; i < files.length; i++) {
  const rows = parseCSV(fs.readFileSync(files[i], 'utf8'));
  const headers = rows.shift().map(x => x.trim().toLowerCase());
  const col = Object.fromEntries(headers.map((h, n) => [h, n]));
  for (const field of ['rating', 'rating_base', 'ajuste_rating', 'rol_especifico']) {
    assert.notEqual(col[field], undefined, files[i] + ': falta columna ' + field);
  }
  const technical = ['pas', 'ctl', 'reg', 'rem', 'des', 'mar', 'ant', 'ref'];
  if (i > 0) for (const field of ['posicion', ...technical]) {
    assert.notEqual(col[field], undefined, files[i] + ': falta columna ' + field);
  }
  const players = rows.filter(r => r.some(x => x.trim()));
  assert.equal(players.length, expected[i], files[i] + ': cantidad de jugadores inesperada');
  for (const [n, r] of players.entries()) {
    const rating = Number(r[col.rating]);
    const base = Number(r[col.rating_base]);
    const adjustment = Number(r[col.ajuste_rating]);
    assert(Number.isFinite(rating) && Number.isFinite(base), files[i] + ' fila ' + (n + 2) + ': rating inválido');
    assert.equal(adjustment, 10, files[i] + ' fila ' + (n + 2) + ': ajuste distinto de +10');
    assert.equal(rating, base + adjustment, files[i] + ' fila ' + (n + 2) + ': rating no coincide con su base');
    const role = r[col.rol_especifico];
    assert(supported.has(role), files[i] + ' fila ' + (n + 2) + ': rol sin perfil de atributos: ' + role);
    if (i > 0) {
      for (const field of technical) {
        const value = Number(r[col[field]]);
        assert(Number.isInteger(value) && value >= 15 && value <= 99, files[i] + ' fila ' + (n + 2) + ': atributo inválido ' + field + '=' + r[col[field]]);
      }
      if (r[col.posicion] !== 'POR') assert.equal(Number(r[col.ref]), 15, files[i] + ' fila ' + (n + 2) + ': reflejos de jugador de campo deben ser 15');
    }
  }
  total += players.length;
}
console.log('OK: ' + total + ' jugadores; escala +10 trazable y todos los roles específicos tienen perfil de atributos.');
