// Sincronización CSV = juego: regenera todos los planteles desde los CSV en un directorio temporal y exige que
// public/squads.json, squads.js y squads-meta.json sean idénticos (salvo la fecha de actualización), y que cada club
// del juego tenga exactamente los jugadores de los CSV. Falla ante cualquier divergencia. node test-planteles-sync.js
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), assert = require('assert'), { execFileSync } = require('child_process');
const ROOT = __dirname, PUB = path.join(ROOT, 'public');
let fails = 0; const ok = (c, m) => { console.log((c ? 'OK  ' : 'FALLA ') + m); if (!c) fails++; };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-planteles-'));
try {
  const meta0 = JSON.parse(fs.readFileSync(path.join(PUB, 'squads-meta.json'), 'utf8'));
  execFileSync(process.execPath, [path.join(ROOT, 'tools', 'regenerar-planteles.js'), '--out', tmp, '--updated-at', meta0.updatedAt], { cwd: ROOT, stdio: 'pipe' });
  for (const f of ['squads.json', 'squads.js']) ok(fs.readFileSync(path.join(tmp, f), 'utf8') === fs.readFileSync(path.join(PUB, f), 'utf8'), f + ' coincide con la regeneración desde los CSV');
  const metaR = JSON.parse(fs.readFileSync(path.join(tmp, 'squads-meta.json'), 'utf8'));
  ok(JSON.stringify(metaR) === JSON.stringify(meta0), 'squads-meta.json coincide con la regeneración');

  // CSV → juego, club por club (independiente del importador): mismos nombres y misma cantidad.
  const parse = s => { const rows = []; let row = [], v = '', q = false; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { if (c == '"' && s[i + 1] == '"') { v += '"'; i++ } else if (c == '"') q = false; else v += c } else if (c == '"') q = true; else if (c == ',') { row.push(v); v = '' } else if (c == '\n') { row.push(v); rows.push(row); row = []; v = '' } else if (c != '\r') v += c } if (v || row.length) { row.push(v); rows.push(row) } return rows };
  const csvs = require('./tools/regenerar-planteles.js').CSV_FILES;
  const want = {};
  for (const f of csvs) { const rows = parse(fs.readFileSync(path.join(ROOT, f), 'utf8')), h = rows.shift().map(x => x.trim().toLowerCase()), ci = h.indexOf('club_id'), ni = h.indexOf('nombre'); for (const r of rows) { if (!r.some(x => x.trim())) continue; const c = r[ci].trim(); (want[c] = want[c] || new Map()).set(r[ni].trim(), f) } }
  const game = JSON.parse(fs.readFileSync(path.join(PUB, 'squads.json'), 'utf8'));
  const missing = [], extra = [];
  for (const [club, names] of Object.entries(want)) { const g = new Set((game[club] || []).map(p => p.n)); for (const n of names.keys()) if (!g.has(n)) missing.push(club + '/' + n); }
  for (const [club, arr] of Object.entries(game)) for (const p of arr) if (!want[club] || !want[club].has(p.n)) extra.push(club + '/' + p.n);
  ok(!missing.length, 'todo jugador de los CSV está en el juego' + (missing.length ? ': ' + missing.slice(0, 5).join(', ') + (missing.length > 5 ? ' …(' + missing.length + ')' : '') : ''));
  ok(!extra.length, 'el juego no tiene jugadores fuera de los CSV' + (extra.length ? ': ' + extra.slice(0, 5).join(', ') + (extra.length > 5 ? ' …(' + extra.length + ')' : '') : ''));
  ok(Object.keys(game).length === Object.keys(want).length, 'mismos clubes en CSV y juego (' + Object.keys(want).length + ')');
  ok(csvs.length === 18, 'se leyeron los 18 CSV del pipeline');
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
console.log(fails ? '\nFALLAS: ' + fails : '\nTodo OK'); process.exit(fails ? 1 : 0);
