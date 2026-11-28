// GUA-01: guardados de carrera en IndexedDB (gzip), migración desde careers_v1 y respaldo en localStorage.
// Chromium real contra server.js. Requiere Playwright. node test-guardados.js
'use strict';
const { chromium } = require('playwright'), { spawn } = require('child_process'), fs = require('fs'), path = require('path');
const PORT = 38000 + Math.floor(Math.random() * 1000), URL0 = 'http://127.0.0.1:' + PORT + '/';
let fails = 0; const ok = (c, m) => { console.log((c ? 'OK  ' : 'FALLA ') + m); if (!c) fails++; };

// Estado de carrera grande y realista: planteles reales (poco comprimibles por nombres y números) hasta ~3,6 M de caracteres.
const SQ = fs.readFileSync(path.join(__dirname, 'public', 'squads.json'), 'utf8');
const bigState = tag => { let s = JSON.stringify({ v: 1, tag, room: { squads: JSON.parse(SQ) } }); while (s.length < 3.6e6) s = s.slice(0, -1) + ',"x' + s.length + '":' + JSON.stringify(SQ.slice(0, 400000)) + '}'; return s; };
const rec = (tag, state) => ({ club: 'boca', clubName: 'Boca', comp: 'Primera', cup: false, pers: true, real: true, season: 2026, txt: tag, pct: 10, at: Date.now(), spd: 1, state, car: { mode: 'real', season: 2026, tag } });

(async () => {
  const srv = spawn(process.execPath, ['server.js'], { cwd: __dirname, env: { ...process.env, PORT: String(PORT), DATABASE_URL: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((res, rej) => { srv.stdout.on('data', d => { if (/localhost/.test(d)) res(); }); setTimeout(() => rej(new Error('server no arrancó')), 20000); });
  const browser = await chromium.launch();
  try {
    // ---------- 1) migración desde careers_v1 ----------
    let ctx = await browser.newContext(), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto(URL0);
    const legacyA = rec('legado-1', JSON.stringify({ v: 1, room: { code: 'old1', n: 'x'.repeat(200000) } })), legacyC = rec('legado-3', JSON.stringify({ v: 1, room: { code: 'old3' } }));
    await p.evaluate(([a, c]) => { localStorage.setItem('careers_v1', JSON.stringify([a, null, c])); }, [legacyA, legacyC]);
    await p.reload(); await p.evaluate(() => CSTORE.whenReady);
    const m1 = await p.evaluate(() => ({ mode: CSTORE.mode(), slots: careerGet().map(c => c && c.txt), legacy: localStorage.getItem('careers_v1') }));
    ok(m1.mode === 'idb', 'usa IndexedDB');
    ok(JSON.stringify(m1.slots) === JSON.stringify(['legado-1', null, 'legado-3']), 'migró las ranuras 1 y 3 sin pérdida (' + JSON.stringify(m1.slots) + ')');
    ok(m1.legacy === null, 'borró careers_v1 recién después de releer lo migrado');
    const same = await p.evaluate(a => careerGet()[0].state === a.state, legacyA);
    ok(same, 'el estado migrado es idéntico al original');

    // ---------- 2) tres carreras de ~3,6 M (no entraban dos en localStorage) ----------
    const states = ['A', 'B', 'C'].map(bigState);
    ok(states.every(s => s.length >= 3.6e6), 'estados de prueba de ' + (states[0].length / 1e6).toFixed(2) + ' M de caracteres');
    for (let i = 0; i < 3; i++) {
      const r = await p.evaluate(([i, c]) => CSTORE.put(i, c), [i, rec('grande-' + i, states[i])]);
      ok(r === true, 'ranura ' + (i + 1) + ': guardado confirmado');
    }
    await p.reload(); await p.evaluate(() => CSTORE.whenReady);
    const back = await p.evaluate(() => careerGet().map(c => c && { txt: c.txt, len: c.state.length, head: c.state.slice(0, 40), tail: c.state.slice(-40), car: c.car && c.car.tag }));
    ok(back.every((b, i) => b && b.txt === 'grande-' + i && b.car === 'grande-' + i && b.len === states[i].length && b.head === states[i].slice(0, 40) && b.tail === states[i].slice(-40)), 'tras recargar, las 3 carreras grandes vuelven completas');
    const full = await p.evaluate(s => careerGet()[1].state === s, states[1]);
    ok(full, 'la ranura 2 vuelve byte a byte igual');
    const usage = await p.evaluate(async () => (await navigator.storage.estimate()).usage || 0);
    ok(usage > 0 && usage < 3 * 3.6e6, 'comprimido: ocupa ' + (usage / 1e6).toFixed(2) + ' MB para 3 carreras de 3,6 M');
    const ls = await p.evaluate(() => localStorage.getItem('careers_v1'));
    ok(ls === null, 'no se escribe nada en localStorage');

    // ---------- 3) interfaz: ranuras, borrado y carga clonada ----------
    await p.evaluate(() => slotsDraw());
    ok((await p.locator('#slots [data-sc]').count()) === 3, 'la pantalla de ranuras muestra 3 carreras para continuar');
    await p.evaluate(async () => { await CSTORE.put(2, null); });
    await p.reload(); await p.evaluate(() => CSTORE.whenReady);
    ok(await p.evaluate(() => careerGet()[2] === null && !!careerGet()[0]), 'borrar una ranura persiste tras recargar y no toca las otras');
    ok(await p.evaluate(() => { const c = careerGet()[0], x = clone(c.car); x.tag = 'cambiado'; return careerGet()[0].car.tag === 'grande-0'; }), 'clone(): modificar la carrera cargada no altera la copia guardada en memoria');
    ok(errs.length === 0, 'sin errores de JavaScript' + (errs.length ? ': ' + errs[0] : ''));
    await ctx.close();

    // ---------- 4) antes de cargar: «Cargando ranuras…» ----------
    ctx = await browser.newContext(); p = await ctx.newPage();
    await p.addInitScript(() => { const o = indexedDB.open.bind(indexedDB); indexedDB.open = (...a) => { const r = o(...a); return new Proxy(r, { set(t, k, v) { if (k === 'onsuccess') { t.onsuccess = e => setTimeout(() => v.call(t, e), 1500); return true; } t[k] = v; return true; }, get(t, k) { const v = t[k]; return typeof v === 'function' ? v.bind(t) : v; } }); }; });
    await p.goto(URL0);
    const early = await p.evaluate(() => { slotsDraw(); return { ready: CSTORE.ready(), html: document.querySelector('#slots').textContent }; });
    ok(!early.ready && /Cargando ranuras/.test(early.html), 'mientras carga, la pantalla de ranuras no ofrece «Nueva carrera» sobre ranuras que podrían estar ocupadas');
    await p.evaluate(() => CSTORE.whenReady); await p.waitForTimeout(100);
    ok(/Ranura 1/.test(await p.locator('#slots').textContent()), 'al terminar de cargar se dibujan las ranuras');
    await ctx.close();

    // ---------- 5) sin IndexedDB: respaldo en localStorage ----------
    ctx = await browser.newContext(); p = await ctx.newPage();
    await p.addInitScript(() => { Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true }); });
    await p.goto(URL0); await p.evaluate(() => CSTORE.whenReady);
    ok(await p.evaluate(() => CSTORE.mode()) === 'ls', 'sin IndexedDB pasa a localStorage');
    ok(await p.evaluate(c => CSTORE.put(0, c), rec('chica', JSON.stringify({ v: 1, room: {} }))) === true, 'una carrera chica se guarda en careers_v1');
    ok(await p.evaluate(() => JSON.parse(localStorage.getItem('careers_v1'))[0].txt === 'chica'), 'queda en el formato viejo (compatible)');
    const r2 = await p.evaluate(c => CSTORE.put(1, c), rec('enorme', states[0] + states[1]));
    ok(r2 === false, 'si no entra, put() devuelve false (careerSave lo muestra como «sin espacio»)');
    await ctx.close();
  } finally { await browser.close(); srv.kill(); }
  console.log(fails ? '\nFALLAS: ' + fails : '\nTodo OK'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('ERROR', e.stack); process.exit(1); });
