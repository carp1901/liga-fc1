// E4 · IMP-01 (posiciones secundarias específicas) e IMP-05 (vocabulario de puestos) del importador.
// Corre import-squads.js de verdad sobre CSV temporales (SQUADS_OUT_DIR aparte; no toca public/). node test-importador.js
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
let fails = 0; const ok = (c, m) => { console.log((c ? 'OK  ' : 'FALLA ') + m); if (!c) fails++; };

function importar(filas) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'imp-')), csv = path.join(dir, 'p.csv');
  const head = 'club_id,nombre,posicion,rating,rating_source,rol_especifico,posiciones_secundarias';
  fs.writeFileSync(csv, [head, ...filas.map(f => ['boca', f.n, f.p || 'MED', 60, 'Estimación de prueba', f.rol || '', f.sec || ''].map(v => /[,"]/.test(v) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(','))].join('\n') + '\n');
  const r = spawnSync(process.execPath, [path.join(__dirname, 'import-squads.js'), csv], { encoding: 'utf8', env: { ...process.env, SQUADS_OUT_DIR: path.join(dir, 'out'), SQUADS_UPDATED_AT: '2026-11-27T00:00:00.000Z' } });
  let squads = null; try { squads = JSON.parse(fs.readFileSync(path.join(dir, 'out', 'squads.json'), 'utf8')); } catch (e) {}
  fs.rmSync(dir, { recursive: true, force: true });
  return { status: r.status, out: r.stdout + r.stderr, squads, alt: n => squads && (squads.boca.find(p => p.n === n) || {}).alt };
}

console.log('== IMP-01: secundarias específicas');
const a = importar([
  { n: 'Uno', rol: 'MC', sec: 'MO;MCD' }, { n: 'Dos', rol: 'ED', sec: 'MD,EI' }, { n: 'Tres', rol: 'MC', sec: 'MC|MO' },
  { n: 'Cuatro', rol: 'MC', sec: 'MCO' }, { n: 'Cinco', p: 'DEF', rol: 'DFC', sec: 'MED' }, { n: 'Seis', rol: 'MC', sec: 'MO; MO ;mo' },
  { n: 'Siete', p: 'DEL', rol: 'EXD', sec: 'exi' }, { n: 'Ocho', rol: 'MC' },
]);
ok(a.status === 0, 'importa sin errores');
ok(JSON.stringify(a.alt('Uno')) === '["MO","MCD"]', 'separador «;»: MO, MCD');
ok(JSON.stringify(a.alt('Dos')) === '["MD","EI"]', 'separador «,»: MD, EI');
ok(JSON.stringify(a.alt('Tres')) === '["MC","MO"]', 'separador «|»: MC, MO');
ok(JSON.stringify(a.alt('Cuatro')) === '["MO"]', 'alias MCO → MO');
ok(a.alt('Cinco') === undefined && /Cinco.*«MED» es un grupo/.test(a.out), 'un grupo («MED») se descarta con aviso');
ok(JSON.stringify(a.alt('Seis')) === '["MO"]', 'sin duplicados, sin distinguir mayúsculas ni espacios');
ok(JSON.stringify(a.alt('Siete')) === '["EI"]', 'alias EXI → EI en minúsculas');
ok(a.alt('Ocho') === undefined, 'sin secundarias no se agrega «alt»');

console.log('\n== IMP-05: vocabulario');
const b = importar([{ n: 'Raro', rol: 'MC', sec: 'XX' }]);
ok(b.status === 1 && /secundaria desconocida «XX»/.test(b.out), 'una secundaria desconocida hace fallar la importación, con el motivo');
const c = importar([{ n: 'Raro2', rol: 'ZZ' }]);
ok(c.status === 1 && /rol_especifico desconocido «ZZ»/.test(c.out), 'un rol_especifico desconocido hace fallar la importación');
const d = importar([{ n: 'Alias', p: 'DEL', rol: 'EXD' }]);
ok(d.status === 0, 'los alias de rol_especifico (EXD) se aceptan');

console.log('\n== los casos reales en el juego (public/squads.json)');
const sq = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'squads.json'), 'utf8')), alt = (c, n) => ((sq[c] || []).find(p => p.n === n) || {}).alt;
const esperado = [['atlanta', 'Franco David Cáceres', ['MO']], ['almagro', 'Matías Alejandro Laba', ['MC']], ['losandes', 'Alexis González', ['EI']], ['temperley', 'Alejandro Melo', ['MD', 'EI']], ['godoycruz', 'Felipe Cairus Arabeity', ['MO', 'MCD']], ['canuelas', 'Santino Sapio', undefined],
  // PLA-09: las 4 secundarias aprobadas con fuente
  ['nuevachicago', 'Alan Ruiz', ['ED']], ['sanmartintuc', 'Jorge Juárez', ['MD', 'LD']], ['lanus', 'Marcelino Moreno', ['MI']], ['lasparejas', 'Nicolás Herranz', ['MCD']]];
for (const [c, n, e] of esperado) ok(JSON.stringify(alt(c, n)) === JSON.stringify(e), n + ' (' + c + '): ' + JSON.stringify(alt(c, n)));
const conAlt = Object.values(sq).flat().filter(p => p.alt);
ok(conAlt.length === 9 && conAlt.every(p => p.alt.every(r => /^(POR|DFC|LI|LD|LIB|MCD|MC|MO|MP|MI|MD|EI|ED|SD|DC)$/.test(r))), 'en todo el juego, solo 9 jugadores con secundarias (5 de E4 + 4 de PLA-09) y todas son puestos válidos');
console.log(fails ? '\nFALLAS: ' + fails : '\nTodo OK'); process.exit(fails ? 1 : 0);
