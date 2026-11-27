// REN-03: el cierre de temporada en un Web Worker (public/cierre-worker.js) da el MISMO resultado que en la página.
// 1) Node: con Math.random fijo, cierre «como en la página» (motor que jugó la temporada) = cierre «como en el Worker»
//    (motor recién cargado + careerCfg). Clásico personalizado y Realista (con planteles propios de la carrera).
// 2) Chromium: closeInWorker() de index.html corre el cierre en el Worker mientras la página sigue respondiendo.
// node test-cierre-worker.js
'use strict';
const { spawnSync, spawn } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
let fails = 0; const ok = (c, m) => { console.log((c ? 'OK  ' : 'FALLA ') + m); if (!c) fails++; };
const sleep = ms => new Promise(r => setTimeout(r, ms)), until = async (f, ms = 240000) => { const t = Date.now(); while (!f() && Date.now() - t < ms) await sleep(10); return f(); };
// El motor guarda rnd=Math.random al cargarse: el generador con semilla se instala ANTES de cargarlo y se reinicia con __reseed().
const SEED_JS = 'let __s=1;Math.random=()=>{__s^=__s<<13;__s^=__s>>>17;__s^=__s<<5;return ((__s>>>0)%1e9)/1e9};global.__reseed=()=>{__s=0x2f6b3a1};__reseed();';
eval(SEED_JS);

// Hijo «como en el Worker»: motor nuevo, careerCfg(car), semilla, careerClose.
const CHILD = `${SEED_JS}const fs=require('fs'),E=require(process.argv[1]+'/public/engine');E.CFG.offline=true;
const {cfg,car,table,segT,winner}=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));Object.assign(E.CFG,cfg);E.careerCfg(car);__reseed();
const r=E.careerClose(car,table,segT,winner);fs.writeFileSync(process.argv[3],JSON.stringify(r));`;

async function playSeason(E, car, tag) {
  const room = 'cw' + tag, pid = 'yo'; let last = null;
  const e = E.act({ a: 'create', off: 1, speed: 100, room, pid, name: 'Yo', cfg: E.careerCfg(car) }); if (e) throw new Error('create: ' + e);
  E.listen(room, pid, v => last = v);
  const e2 = E.act({ a: 'pick', room, pid, team: car.me.club }); if (e2) throw new Error('pick: ' + e2);
  const iv = setInterval(() => { if (last && ['pre', 'lobby'].includes(last.phase)) E.act({ a: 'ready', room, pid, v: true }); }, 10);
  const fin = await until(() => last && last.phase == 'end'); clearInterval(iv);
  car.dev = E.development(room);
  const winner = (E.rooms[room] && E.rooms[room].champ) || last.champ || null;
  clearInterval(E.rooms[room].timer); delete E.rooms[room];
  return { fin, table: last.table, segT: last.segT, winner };
}

async function equivalencia(nombre, makeCar) {
  const E = require('./public/engine'); E.CFG.offline = true; E.CFG.fastWaits = true;
  const car = makeCar(E); if (car.error) throw new Error(car.error);
  const s = await playSeason(E, car, nombre.replace(/[^a-z]/g, '').slice(0, 6));
  ok(s.fin, nombre + ': temporada jugada hasta el final');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cierre-')), inp = path.join(tmp, 'in.json'), out = path.join(tmp, 'out.json');
  // Igual que closeInWorker(): se pasan los valores simples de CFG (p. ej. fastWaits).
  const cfg = Object.fromEntries(Object.entries(E.CFG).filter(([k, v]) => ['number', 'boolean', 'string'].includes(typeof v)));
  fs.writeFileSync(inp, JSON.stringify({ cfg, car, table: s.table, segT: s.segT, winner: s.winner }));
  const before = JSON.stringify(car);
  __reseed(); // misma semilla para el cierre «como en la página»
  const t0 = Date.now(), r1 = E.careerClose(car, s.table, s.segT, s.winner), ms = Date.now() - t0;
  ok(!r1.error, nombre + ': cierre en la página sin error (' + ms + ' ms)');
  ok(JSON.stringify(car) === before, nombre + ': careerClose no modifica la carrera que recibe (el Worker trabaja sobre una copia)');
  const c = spawnSync(process.execPath, ['-e', CHILD, __dirname, inp, out], { encoding: 'utf8', maxBuffer: 1 << 26 });
  ok(c.status === 0, nombre + ': cierre «como en el Worker» sin error' + (c.status ? ': ' + (c.stderr || '').slice(0, 300) : ''));
  const r2 = c.status === 0 ? fs.readFileSync(out, 'utf8') : '';
  const same = r2 === JSON.stringify(r1);
  ok(same, nombre + ': mismo resultado byte a byte (' + (r2.length / 1e6).toFixed(2) + ' MB)');
  if (!same && r2) { const diffs = [], d = (x, y, p) => { if (diffs.length > 6 || JSON.stringify(x) === JSON.stringify(y)) return; if (x && y && typeof x == 'object' && typeof y == 'object') { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) d(x[k], y[k], p + '.' + k); } else diffs.push(p + ': ' + String(JSON.stringify(x)).slice(0, 70) + ' | ' + String(JSON.stringify(y)).slice(0, 70)); }; d(JSON.parse(JSON.stringify(r1)), JSON.parse(r2), 'r'); diffs.forEach(x => console.log('      ' + x)); }
  fs.rmSync(tmp, { recursive: true, force: true });
  return r1;
}

(async () => {
  // Cada caso en un proceso nuevo, como una página recién cargada. (En un mismo proceso, preStrengthCache del motor
  // conserva fuerzas de una carrera anterior: es un comportamiento previo de la página, informado aparte.)
  const caso = process.argv[process.argv.indexOf('--caso') + 1];
  if (process.argv.includes('--caso')) {
    if (caso === 'clasico') { const r1 = await equivalencia('clásico personalizado', E => E.careerNew({ k: 4, n: 6, ud: 2, fmt: 'liga1', me: { club: 'boca', cat: 0 }, picks: [['river'], [], []] })); ok(r1.car && r1.car.season === 2027, 'clásico: el cierre arma la temporada siguiente'); }
    else { const promo = require('./public/data').DIVS.find(d => /promocional/i.test(d.name)).teams[0].id; const r2 = await equivalencia('realista (' + promo + ')', E => E.realNew({ me: { club: promo } })); ok(r2.car && r2.car.season === 2027 && !!r2.car.rosters, 'realista: temporada siguiente con planteles propios de la carrera'); }
    process.exit(fails ? 1 : 0);
  }
  console.log('== 1) equivalencia en Node');
  for (const c of ['clasico', 'realista']) { const r = spawnSync(process.execPath, [__filename, '--caso', c], { stdio: 'inherit' }); if (r.status !== 0) fails++; }

  console.log('\n== 2) Chromium: el cierre corre en el Worker');
  const { chromium } = require('playwright');
  const PORT = 38000 + Math.floor(Math.random() * 1000);
  const srv = spawn(process.execPath, ['server.js'], { cwd: __dirname, env: { ...process.env, PORT: String(PORT), DATABASE_URL: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((res, rej) => { srv.stdout.on('data', d => { if (/localhost/.test(d)) res(); }); setTimeout(() => rej(new Error('server no arrancó')), 20000); });
  const browser = await chromium.launch();
  try {
    const p = await browser.newPage(), errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('http://127.0.0.1:' + PORT + '/');
    const res = await p.evaluate(async () => {
      ENG.CFG.fastWaits = true;
      const car = ENG.realNew({ me: { club: DATA.DIVS.find(d => /promocional/i.test(d.name)).teams[0].id } });
      const room = 'cwb', pid = 'yo'; let last = null;
      ENG.act({ a: 'create', off: 1, speed: 100, room, pid, name: 'Yo', cfg: ENG.careerCfg(car) }); ENG.listen(room, pid, v => last = v);
      ENG.act({ a: 'pick', room, pid, team: car.me.club });
      await new Promise(done => { const iv = setInterval(() => { if (last && ['pre', 'lobby'].includes(last.phase)) ENG.act({ a: 'ready', room, pid, v: true }); if (last && last.phase == 'end') { clearInterval(iv); done(); } }, 10); });
      car.dev = ENG.development(room); clearInterval(ENG.rooms[room].timer);
      let ticks = 0, maxGap = 0, prev = performance.now();
      const iv = setInterval(() => { const n = performance.now(); maxGap = Math.max(maxGap, n - prev); prev = n; ticks++; }, 20);
      const t0 = performance.now(), r = await closeInWorker(car, last.table, last.segT, last.champ || null), ms = performance.now() - t0;
      clearInterval(iv);
      const t1 = performance.now(); ENG.careerClose(car, last.table, last.segT, last.champ || null); const msMain = performance.now() - t1;
      return { err: r && r.error, season: r && r.car && r.car.season, rosters: !!(r && r.car && r.car.rosters), ms, msMain, ticks, maxGap };
    });
    ok(!res.err && res.season === 2027 && res.rosters, 'closeInWorker devuelve la temporada siguiente con planteles');
    ok(res.maxGap < 250, 'la página siguió respondiendo durante el cierre (' + res.ticks + ' ticks; pausa máxima ' + Math.round(res.maxGap) + ' ms; cierre ' + Math.round(res.ms) + ' ms en el Worker, ' + Math.round(res.msMain) + ' ms en la página)');
    ok(errs.length === 0, 'sin errores de JavaScript' + (errs.length ? ': ' + errs[0] : ''));
    const fb = await p.evaluate(async () => { const W = window.Worker; window.Worker = undefined; CXW = null; try { await closeInWorker({}, [], null, null); return 'resolvió'; } catch (e) { return 'rechazó: ' + e.message; } finally { window.Worker = W; } });
    ok(/rechazó/.test(fb), 'sin Worker, closeInWorker rechaza y la página cierra en el hilo principal (' + fb + ')');
  } finally { await browser.close(); srv.kill(); }
  console.log(fails ? '\nFALLAS: ' + fails : '\nTodo OK'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('ERROR', e.stack); process.exit(1); });
