// Regenera desde cero los archivos que consume el juego (public/squads.json, squads.js y squads-meta.json)
// a partir de TODOS los CSV de planteles, en un orden fijo. Es la única vía de publicación de datos:
// el juego queda igual a los CSV, sin acumular importaciones anteriores.
//
// Uso:
//   node tools/regenerar-planteles.js                 → regenera public/
//   node tools/regenerar-planteles.js --out DIR       → regenera en DIR (no toca public/)
//   node tools/regenerar-planteles.js --snapshots DIR → además guarda en DIR la base previa a cada división
//                                                       (antes-primera-c.json, antes-promocional.json) para los tests runtime
//   --updated-at ISO  fecha de squads-meta.json. Por defecto, la del último commit que tocó planteles/ o el importador;
//                     así dos corridas sobre el mismo commit dan archivos idénticos.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const OUT = path.resolve(arg('--out') || path.join(ROOT, 'public'));
const SNAP = arg('--snapshots') ? path.resolve(arg('--snapshots')) : null;

// Orden fijo de publicación (mismo orden histórico de los workflows).
const PRIMERA_Y_NACIONAL = ['planteles/primera-2026.csv', ...[1, 2, 3, 4, 5, 6].map(n => `planteles/borradores/primera-nacional-2026/bloque${n}.csv`)];
const ETAPAS = [
  { csv: 'planteles/borradores/primera-b-metro-2026/completo.csv' },
  ...[1, 2, 3, 4].map(n => ({ csv: `planteles/borradores/federal-a-2026-tanda-${n}/completo.csv` })),
  ...[1, 2, 3, 4].map(n => ({ csv: `planteles/borradores/primera-c-2026/tanda${n}-inicial.csv`, snapshot: n === 1 ? 'antes-primera-c.json' : null })),
  ...[1, 2].map(n => ({ csv: `planteles/borradores/promocional-amateur-2026/tanda${n}-inicial.csv`, snapshot: n === 1 ? 'antes-promocional.json' : null })),
];

// Todos los CSV que alimentan el juego, en orden de publicación (los usa también test-planteles-sync.js).
const CSV_FILES = [...PRIMERA_Y_NACIONAL, ...ETAPAS.map(e => e.csv)];
module.exports = { CSV_FILES };
if (require.main !== module) return;

function updatedAt() {
  const given = arg('--updated-at');
  if (given) { if (isNaN(Date.parse(given))) throw Error('--updated-at inválido: ' + given); return new Date(given).toISOString(); }
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', 'planteles', 'import-squads.js'], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (iso) return new Date(iso).toISOString();
  } catch (e) { /* sin git */ }
  throw Error('No se pudo determinar la fecha de los datos: usar --updated-at ISO');
}

const env = { ...process.env, SQUADS_OUT_DIR: OUT, SQUADS_UPDATED_AT: updatedAt() };
const run = (csv, extra = []) => {
  const out = execFileSync(process.execPath, [path.join(ROOT, 'import-squads.js'), csv, ...extra], { cwd: ROOT, env, encoding: 'utf8' });
  return out.trim().split('\n').pop();
};

fs.mkdirSync(OUT, { recursive: true });
for (const f of ['squads.json', 'squads.js', 'squads-meta.json']) fs.rmSync(path.join(OUT, f), { force: true });
if (SNAP) fs.mkdirSync(SNAP, { recursive: true });

// Primera y Primera Nacional se publican juntas y deben quedar completas (66 clubes).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'planteles-'));
const unido = path.join(tmp, 'planteles-2026.csv');
const partes = PRIMERA_Y_NACIONAL.map((f, i) => { const s = fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r?\n$/, ''); return i ? s.split(/\r?\n/).slice(1).join('\n') : s; });
fs.writeFileSync(unido, partes.join('\n') + '\n');
try {
  console.log('Primera + Primera Nacional:', run(unido, ['--require-both-divisions']));
  for (const e of ETAPAS) {
    if (SNAP && e.snapshot) fs.copyFileSync(path.join(OUT, 'squads.json'), path.join(SNAP, e.snapshot));
    console.log(e.csv + ':', run(e.csv));
  }
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
// Si se publicó en public/, squads.js cambió: actualizar su ?v en index.html (UI-02).
if (OUT === path.join(ROOT, 'public')) { const V = require('./versionar-estaticos'), idx = path.join(ROOT, 'public', 'index.html'), html = fs.readFileSync(idx, 'utf8'), next = V.version(html); if (next !== html) { fs.writeFileSync(idx, next); console.log('index.html: ?v actualizado'); } }
