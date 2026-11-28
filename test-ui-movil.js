// E2 en Chromium emulando un Pixel 5: UI-01 (confirmación propia, sin confirm()), UI-04 (guardar al ocultar la página)
// y SRV-04 (aviso cuando se cae la conexión con la sala). Requiere Playwright. node test-ui-movil.js
'use strict';
const { chromium, devices } = require('playwright'), { spawn } = require('child_process'), fs = require('fs'), path = require('path');
const PORT = 38000 + Math.floor(Math.random() * 1000), URL0 = 'http://127.0.0.1:' + PORT + '/';
let fails = 0; const ok = (c, m) => { console.log((c ? 'OK  ' : 'FALLA ') + m); if (!c) fails++; };

(async () => {
  const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  const code = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n').replace(/\/\/[^\n]*/g, '');
  ok(!/[^A-Za-z_.$]confirm\(/.test(code), 'index.html ya no usa confirm() (los WebView pueden bloquearlo)');

  const srv = spawn(process.execPath, ['server.js'], { cwd: __dirname, env: { ...process.env, PORT: String(PORT), DATABASE_URL: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((res, rej) => { srv.stdout.on('data', d => { if (/localhost/.test(d)) res(); }); setTimeout(() => rej(new Error('server no arrancó')), 20000); });
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ ...devices['Pixel 5'] }), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.addInitScript(() => { window.confirm = () => { window.__usoConfirm = true; return false; }; });
    await p.goto(URL0); await p.evaluate(() => CSTORE.whenReady);

    console.log('== UI-01: uiConfirm');
    for (const [boton, esperado] of [['[data-uicf="1"]', true], ['[data-uicf="0"]', false], ['Escape', false], ['fuera', false]]) {
      await p.evaluate(() => { window.__r = 'pendiente'; uiConfirm('¿Seguro?\nSegunda línea', { si: 'Sí', no: 'No' }).then(v => window.__r = v); });
      ok(await p.locator('.uicf').isVisible(), 'el diálogo aparece (' + boton + ')');
      if (boton === 'Escape') await p.keyboard.press('Escape');
      else if (boton === 'fuera') await p.mouse.click(5, 5);
      else await p.locator(boton).click();
      await p.waitForFunction(() => window.__r !== 'pendiente');
      ok((await p.evaluate(() => window.__r)) === esperado && !(await p.locator('.uicf').count()), boton + ' → ' + esperado + ' y el diálogo se cierra');
    }
    const box = await p.locator('body').evaluate(() => { uiConfirm('x'); const b = document.querySelector('.uicf .box').getBoundingClientRect(); document.querySelector('[data-uicf="0"]').click(); return { w: b.width, vw: innerWidth }; });
    ok(box.w <= box.vw, 'entra en la pantalla del Pixel 5 (' + Math.round(box.w) + ' de ' + box.vw + ' px)');

    console.log('\n== UI-01: abandonar el torneo usa el diálogo propio');
    await p.evaluate(() => { window.__posts = []; OFF = false; S = { phase: 'lobby' }; post = b => { window.__posts.push(b); sessionStorage.setItem('__posts', JSON.stringify(window.__posts)); return Promise.resolve(null); }; exitGm(); });
    await p.locator('.uicf [data-uicf="0"]').click();
    ok((await p.evaluate(() => window.__posts.length)) === 0, '«Seguir jugando» no abandona');
    await p.evaluate(() => exitGm()); await p.locator('.uicf [data-uicf="1"]').click(); await p.waitForTimeout(500);
    ok(await p.evaluate(() => JSON.parse(sessionStorage.getItem('__posts') || '[]').some(b => b.a == 'quit') && !document.querySelector('#menu').hidden), '«Abandonar» envía quit y vuelve al menú');
    await p.evaluate(() => CSTORE.whenReady);
    ok(!(await p.evaluate(() => window.__usoConfirm)), 'no se llamó a confirm()');

    console.log('\n== UI-04: guardar al ocultar la página');
    const p2 = await ctx.newPage(); p2.on('pageerror', e => errs.push(String(e)));
    await p2.goto(URL0); await p2.evaluate(() => CSTORE.whenReady);
    await p2.evaluate(async () => {
      ENG.CFG.fastWaits = true; OFF = true; room = 'uim' + Math.random().toString(36).slice(2, 6);
      CAR = ENG.careerNew({ k: 4, n: 6, ud: 2, fmt: 'liga1', me: { club: 'boca', cat: 0 }, picks: [['river'], [], []] });
      ENG.act({ a: 'create', off: 1, speed: 1, room, pid, name: 'DT', cfg: ENG.careerCfg(CAR) });
      CUR = { slot: 1 }; start(); ENG.act({ a: 'pick', room, pid, team: CAR.me.club });
      await new Promise((r, j) => { const t0 = Date.now(), iv = setInterval(() => { if (S && S.phase == 'pre') { clearInterval(iv); r(); } else if (Date.now() - t0 > 20000) { clearInterval(iv); j(new Error('no llegó a pretemporada: ' + (S && S.phase))); } }, 20); });
      await CSTORE.put(1, null); // se vacía para comprobar que el guardado lo hace el evento
    });
    ok(await p2.evaluate(() => careerGet()[1] === null), 'antes de ocultar, la ranura 2 está vacía');
    await p2.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await p2.waitForTimeout(1500);
    await p2.reload(); await p2.evaluate(() => CSTORE.whenReady);
    const slot = await p2.evaluate(() => { const c = careerGet()[1]; return c && { txt: c.txt, club: c.club, tiene: !!c.state }; });
    ok(!!(slot && slot.tiene), 'al ocultar la página se guardó la carrera en la ranura 2 (' + JSON.stringify(slot) + ')');

    console.log('\n== SEG-04: selector de ranking de técnicos');
    const p3 = await ctx.newPage(); p3.on('pageerror', e => errs.push(String(e)));
    const pedidos = [];
    await p3.route('**/api/ranking-tecnicos*', route => { const u = new URL(route.request().url()), tipo = u.searchParams.get('tipo'); pedidos.push(tipo);
      route.fulfill({ contentType: 'application/json', body: JSON.stringify({ enabled: true, tipo, periodo: 'historico', temporada: 2026, rows: [{ usuario: tipo == 'offline' ? 'SoloOffline' : 'SoloOnline', puntos: 9, torneos: 1, campeonatos: 1, podios: 1, pos: 1 }] }) }); });
    await p3.goto(URL0); await p3.evaluate(() => { goM('m10'); rankingMode('tecnicos', false); });
    await p3.waitForFunction(() => /SoloOnline/.test(document.querySelector('#trlist').textContent));
    ok(pedidos[0] === 'online' && /verificado/.test(await p3.locator('#trinfo').textContent()), 'por defecto muestra el ranking online (verificado)');
    await p3.locator('#trtipo [data-trt="offline"]').click();
    await p3.waitForFunction(() => /SoloOffline/.test(document.querySelector('#trlist').textContent));
    ok(pedidos.includes('offline') && /informado/.test(await p3.locator('#trinfo').textContent()) && await p3.locator('#trtipo [data-trt="offline"]').evaluate(b => b.classList.contains('on')), 'el selector carga el ranking offline (informado)');

    console.log('\n== SEG-05: títulos offline sin sesión quedan en cola');
    const cola = await p3.evaluate(async () => { AUTH = null; let err = null; try { await ENG.CFG.onTitle({ tid: 'colaprueba01', club: 'boca', mod: 'offline', comp: 'ar1', fmt: 'liga1', n: 8 }); } catch (e) { err = e; } return { sesion: !!(err && err.sesion), enCola: ptGet().some(x => x.tid === 'colaprueba01') }; });
    ok(cola.sesion && cola.enCola, 'sin sesión no se envía: queda guardado para mandarlo al iniciar sesión');
    await p3.close();

    console.log('\n== SRV-04: se cae la conexión con la sala');
    await p2.close(); await p.bringToFront(); // una pestaña en segundo plano tiene los temporizadores frenados
    await p.evaluate(() => { const f = { readyState: 2, close() {} }; window.ES = f; evWatch(f); f.onerror(); });
    ok(/Se perdió la conexión/.test(await p.locator('#rnd').textContent()), 'conexión cerrada: aviso inmediato con «Volver al menú»');
    await p.evaluate(() => { set('#rnd', ''); $('#rnd').hidden = true; /* set() recuerda el último HTML: se limpia con set, no a mano */ const f = { readyState: 0, close() {} }; window.ES = f; evWatch(f); f.onerror(); window.__f = f; });
    await p.waitForTimeout(3000);
    ok(!/Se perdió/.test(await p.locator('#rnd').textContent()), 'reconectando: no avisa enseguida (EventSource reintenta solo)');
    await p.evaluate(() => { window.__f.readyState = 1; window.__f.onopen(); });
    await p.waitForTimeout(13000);
    ok(!/Se perdió/.test(await p.locator('#rnd').textContent()), 'si reconecta antes de 15 s, no hay aviso');
    await p.evaluate(() => { const f = { readyState: 0, close() {} }; window.ES = f; evWatch(f); f.onerror(); });
    await p.waitForTimeout(16500);
    ok(/Se perdió la conexión/.test(await p.locator('#rnd').textContent()), 'si no reconecta en 15 s, avisa');
    ok(errs.length === 0, 'sin errores de JavaScript' + (errs.length ? ': ' + errs[0] : ''));
  } finally { await browser.close(); srv.kill(); }
  console.log(fails ? '\nFALLAS: ' + fails : '\nTodo OK'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('ERROR', e.stack); process.exit(1); });
