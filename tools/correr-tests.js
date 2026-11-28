// Corredor de tests (TST-01). Uso:
//   node tools/correr-tests.js            → tests rápidos (npm test): todos deben pasar
//   node tools/correr-tests.js completo   → rápidos + largos (npm run test:completo)
//   node tools/correr-tests.js pendientes → tests con fallos YA CONOCIDOS (npm run test:pendientes):
//                                           se corren y se informan; avisa si alguno empezó a pasar
// La prueba de carga (test.js) necesita un servidor levantado y va aparte: npm run test:carga.
'use strict';
const { spawnSync } = require('child_process'), path = require('path');
const ROOT = path.join(__dirname, '..');

const RAPIDOS = [
  'test-sustituciones', 'test-auto-xi', 'test-sim2d-orientation', 'test-minimos', 'test-random', 'test-abandonos',
  'test-player-development', 'test-player-regens', 'test-career', 'test-career-development', 'test-career-regens', 'test-sim', 'test-2d-nan',
  'test-servidor', 'test-versiones', 'test-cache-fuerza', 'test-ranking', 'test-importador',
  'test-plantel-calibration', 'test-squads', 'test-planteles-sync', 'test-bmetro-draft', 'test-bmetro-runtime',
  'test-federal-a-draft', 'test-federal-a-tanda2', 'test-federal-a-tanda3', 'test-federal-a-tanda4', 'test-federal-a-runtime',
  'test-primera-c-draft', 'test-promocional-amateur-draft',
  'test-custom-tournaments', 'test-copa', 'test-offline', 'test-pre', 'test-pelotas-paradas-2d',
];
const LARGOS = ['test-clasico', 'test-copa-real', 'test-2d-servidor', 'test-penales', 'test-pelotas-paradas', 'test-cliente-sse', 'test-guardados', 'test-ui-movil', 'test-cierre-worker', 'test-ui', 'test-realista'];
// Fallos conocidos y su motivo (auditoría maestra). No se ocultan: se corren con «pendientes».
// E6: los 7 que había (TST-02/TST-04) se arreglaron y pasaron a RAPIDOS o LARGOS. Si aparece uno nuevo, va acá con su motivo.
const PENDIENTES = {};

const modo = process.argv[2] || 'rapidos';
const lista = modo === 'pendientes' ? Object.keys(PENDIENTES) : modo === 'completo' ? [...RAPIDOS, ...LARGOS] : RAPIDOS;
let fallas = 0, empezaronAPasar = [];
for (const t of lista) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [t + '.js'], { cwd: ROOT, encoding: 'utf8', timeout: modo === 'pendientes' && t !== 'test-realista' ? 90e3 : 600e3, maxBuffer: 64 * 1024 * 1024 });
  const ok = r.status === 0, seg = ((Date.now() - t0) / 1000).toFixed(1) + ' s';
  if (modo === 'pendientes') {
    console.log((ok ? 'PASA   ' : 'falla  ') + t.padEnd(26) + seg.padStart(8) + '  ' + PENDIENTES[t] + (r.error && r.error.code === 'ETIMEDOUT' ? ' (tiempo agotado)' : ''));
    if (ok) empezaronAPasar.push(t);
  } else {
    console.log((ok ? 'OK     ' : 'FALLA  ') + t.padEnd(26) + seg.padStart(8));
    if (!ok) { fallas++; const out = (r.stdout || '') + (r.stderr || ''); console.log(out.split('\n').filter(l => /FALLA|Error|assert/i.test(l)).slice(0, 4).map(l => '         ' + l.slice(0, 200)).join('\n')); }
  }
}
if (modo === 'pendientes') {
  console.log('\n' + (!lista.length ? 'No hay tests con fallos conocidos.' : empezaronAPasar.length ? 'Empezaron a pasar (sacarlos de PENDIENTES): ' + empezaronAPasar.join(', ') : 'Todos los pendientes siguen fallando por su motivo conocido.'));
  process.exit(empezaronAPasar.length ? 1 : 0);
}
console.log('\n' + (fallas ? fallas + ' FALLAS de ' + lista.length : 'Todo OK: ' + lista.length + ' tests'));
process.exit(fallas ? 1 : 0);
