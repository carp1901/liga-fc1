// E3 · SEG-04: ranking de técnicos online (verificado) y offline (informado) por separado, con las mismas reglas de puntos.
// store.js con un pool simulado que aplica la condición SQL que recibe. node test-ranking.js
'use strict';
const { execFileSync } = require('child_process'), vm = require('vm'), path = require('path');
const Ranking = require('./shared/ranking'), store = require('./store');
let fails = 0; const ok = (c, m) => { console.log((c ? 'OK  ' : 'FALLA ') + m); if (!c) fails++; };

console.log('== puntos: la regla única es idéntica a la anterior de store.js');
let viejo = null;
try {
  const src = execFileSync('git', ['show', '17f702d:store.js'], { cwd: __dirname, encoding: 'utf8', maxBuffer: 1 << 24 });
  const m = src.match(/function puntosTecnico\(c\)\{[\s\S]*?\n\}/); const ctx = {}; vm.runInNewContext(m[0] + ';this.f=puntosTecnico', ctx); viejo = ctx.f;
} catch (e) { console.log('   (sin git: se omite la comparación con la versión anterior)'); }
const casos = [];
for (const n of [4, 8, 16, 20, 32, 40]) {
  for (const fmt of ['liga1', 'liga2']) for (let pos = 0; pos <= n + 1; pos++) casos.push({ participantes: n, formato: fmt, posicion: pos });
  for (const res of ['Campeón', 'Finalista', 'Semifinal', 'Cuartos de final', 'Octavos de final', 'Dieciseisavos', '32avos', 'Fase de grupos', '']) casos.push({ participantes: n, formato: 'copa', resultado: res });
}
ok(casos.every(c => Number.isFinite(Ranking.puntosTecnico(c))), casos.length + ' casos calculados');
if (viejo) ok(casos.every(c => Ranking.puntosTecnico(c) === viejo(c)), 'los puntos son los mismos que antes en los ' + casos.length + ' casos');

console.log('\n== dos rankings separados (store.js, pool simulado)');
const U = { 1: 'Ana', 2: 'Beto', 3: 'Caro' };
const C = [ // uid, modalidad, origen, competitivo, participantes, formato, posicion, resultado
  [1, 'clasico', 'publica', true, 8, 'liga1', 1], [1, 'offline', 'offline', false, 20, 'liga1', 1],
  [2, 'offline', 'offline', false, 20, 'liga1', 1], [2, 'offline', 'offline', false, 20, 'liga1', 2],
  [3, 'clasico', 'privada', true, 8, 'copa', null, 'Campeón'], [3, 'clasico', 'privada', false, 8, 'liga1', 1], // no competitiva: no suma
  [3, 'offline', 'offline', false, 6, 'liga1', 1], // offline de 6 equipos: no suma
].map(([uid, modalidad, origen, competitivo, participantes, formato, posicion, resultado], i) => ({ uid, usuario: U[uid], club_favorito: null, torneo_id: 't' + i, modalidad, origen, competitivo, participantes, formato, posicion, resultado: resultado || null, campeon: posicion === 1 || resultado === 'Campeón', finalizado: '2026-0' + (1 + i % 9) + '-01T00:00:00Z', club: 'boca', club_nombre: 'Boca', competicion_nombre: 'X' }));
const pasa = (sql, c) => {
  const on = /competitivo=true/.test(sql), off = /modalidad='offline' AND c?\.?participantes >= (\d+)/.exec(sql);
  const esOn = c.competitivo === true && ['clasico', 'barrial'].includes(c.modalidad) && c.origen !== 'offline', esOff = c.modalidad === 'offline' && off && c.participantes >= +off[1];
  return (on && esOn) || (!!off && esOff);
};
const consultas = [];
store.init({ pool: { on() {}, query: async (sql, p = []) => {
  sql = String(sql); consultas.push(sql);
  if (/FROM carreras c JOIN usuarios u/.test(sql)) { const rows = C.filter(c => pasa(sql, c)); return { rows, rowCount: rows.length }; }
  if (/FROM usuarios u LEFT JOIN perfiles p ON p.usuario_id=u.id WHERE u.usuario_lc=\$1/.test(sql)) { const id = Object.keys(U).find(k => U[k].toLowerCase() === p[0]); return id ? { rows: [{ usuario: U[id], creado: '2026-01-01', club_favorito: null, descripcion: null }], rowCount: 1 } : { rows: [], rowCount: 0 }; }
  if (/FROM carreras c WHERE usuario_id=\(SELECT id FROM usuarios WHERE usuario_lc=\$1\)/.test(sql)) { const id = +Object.keys(U).find(k => U[k].toLowerCase() === p[0]); const rows = C.filter(c => c.uid === id && pasa(sql, c)); return { rows, rowCount: rows.length }; }
  return { rows: [], rowCount: 0 };
} } });
(async () => {
  const on = await store.rankingTecnicos('historico', 'online'), off = await store.rankingTecnicos('historico', 'offline'), def = await store.rankingTecnicos('historico');
  ok(on.tipo === 'online' && def.tipo === 'online', 'por defecto, el ranking online');
  ok(JSON.stringify(on.rows.map(x => x.usuario + ':' + x.puntos)) === JSON.stringify(['Ana:8', 'Caro:8']), 'online: solo torneos online competitivos (' + on.rows.map(x => x.usuario + ':' + x.puntos).join(', ') + ')');
  ok(JSON.stringify(off.rows.map(x => x.usuario + ':' + x.puntos)) === JSON.stringify(['Beto:39', 'Ana:20']), 'offline: solo carreras offline desde 8 equipos (' + off.rows.map(x => x.usuario + ':' + x.puntos).join(', ') + ')');
  ok(on.rows.every(x => x.pos === 1) && off.rows[0].pos === 1 && off.rows[1].pos === 2, 'posiciones con empate compartido');
  ok(!on.rows.some(x => x.usuario === 'Beto'), 'quien solo juega offline no aparece en el ranking online');
  const perf = await store.perfilPublico('Ana');
  ok(perf.resumen.puntos === 8 && perf.resumen.pos === 1 && perf.resumenOffline.puntos === 20 && perf.resumenOffline.pos === 2, 'el perfil separa el resumen online (8 pts, 1.°) del offline (20 pts, 2.°)');
  ok(perf.historial.length === 2 && perf.historial.some(h => h.tipo === 'online') && perf.historial.some(h => h.tipo === 'offline'), 'el historial marca cada carrera como online u offline');
  const n = consultas.length; await store.rankingTecnicos('historico', 'online');
  ok(consultas.length === n, 'REN-06: una segunda consulta dentro de 30 s usa el caché');
  ok(!consultas.some(s => /CASE WHEN|ELSE 10/.test(s)), 'ninguna consulta con mínimos viejos');
  console.log(fails ? '\nFALLAS: ' + fails : '\nTodo OK'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('ERROR', e.stack); process.exit(1); });
