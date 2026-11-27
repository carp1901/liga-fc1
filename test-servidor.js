// Tests del servidor Node (TST-06, base mínima): lector de pedidos (SRV-02), IP real (SEG-03), propietario del chat por id
// y jerarquía de sanciones (SEG-01/02), y saturación de salas (SRV-01). Sin base de datos real. node test-servidor.js
'use strict';
process.env.PORT = String(39000 + Math.floor(Math.random() * 900));
process.env.CHAT_OWNER_ID = '1000';
process.env.ROOM_CREATE_MAX = '3';
delete process.env.TRUST_PROXY;
const net = require('net'), path = require('path');
let fails = 0; const ok = (c, m) => { console.log((c ? 'OK  ' : 'FALLA ') + m); if (!c) fails++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- store simulado para el servidor (el real se prueba más abajo con un pool simulado)
const USERS = { owner: { id: 1000, usuario: 'Dueno' }, impostor: { id: 2, usuario: 'Burzaco' }, mod: { id: 3, usuario: 'Mod' } };
const sent = [];
const stub = new Proxy({}, { get: (t, k) => ({
  init: () => Promise.resolve(false),
  userByToken: tok => Promise.resolve(USERS[tok] || null),
  chatEsModerador: id => Promise.resolve(id === 3),
  chatEnviar: (uid, msg) => { sent.push(msg); return Promise.resolve({ ok: 1, mensaje: { id: sent.length, mensaje: msg } }); },
}[k] || (() => Promise.resolve({}))) });
const storePath = require.resolve('./store');
require.cache[storePath] = { id: storePath, filename: storePath, loaded: true, exports: stub };
const server = require('./server');

// Cuerpo de una respuesta HTTP/1.1 (con o sin chunked encoding).
function parseBody(out) {
  const i = out.indexOf('\r\n\r\n'), head = out.slice(0, i); let b = out.slice(i + 4);
  if (/transfer-encoding: chunked/i.test(head)) { let r = ''; for (;;) { const j = b.indexOf('\r\n'), n = parseInt(b.slice(0, j), 16); if (!n) break; r += b.slice(j + 2, j + 2 + n); b = b.slice(j + 2 + n + 2); } b = r; }
  try { return JSON.parse(b); } catch { return null; }
}
// Pedido HTTP crudo: permite partir el cuerpo en fragmentos de bytes y contar cuántas respuestas llegan.
function raw(method, url, chunks, headers = {}) {
  return new Promise((resolve, reject) => {
    const bodyLen = chunks.reduce((a, c) => a + c.length, 0);
    const s = net.connect(+process.env.PORT, '127.0.0.1');
    let out = '';
    s.on('data', d => out += d.toString('utf8'));
    s.on('error', reject);
    s.on('close', () => resolve({ out, status: +(/^HTTP\/1\.1 (\d+)/.exec(out) || [])[1], responses: (out.match(/HTTP\/1\.1 \d+/g) || []).length, json: parseBody(out) }));
    s.on('connect', async () => {
      const h = Object.entries({ Host: 'x', 'Content-Type': 'application/json', 'Content-Length': bodyLen, Connection: 'close', ...headers }).map(([k, v]) => k + ': ' + v).join('\r\n');
      s.write(method + ' ' + url + ' HTTP/1.1\r\n' + h + '\r\n\r\n');
      for (const c of chunks) { s.write(c); await sleep(40); }
    });
  });
}
const post = (url, obj, headers) => raw('POST', url, [Buffer.from(JSON.stringify(obj))], headers);

(async () => {
  await sleep(300);
  console.log('== SRV-02: lector de pedidos');
  const msg = 'Año señor — ñandú';
  const bytes = Buffer.from(JSON.stringify({ mensaje: msg }));
  const cut = bytes.indexOf(Buffer.from('ñ')) + 1; // parte la «ñ» (0xC3 0xB1) entre dos fragmentos
  const r1 = await raw('POST', '/api/chat', [bytes.subarray(0, cut), bytes.subarray(cut)], { Authorization: 'Bearer owner' });
  ok(r1.status === 200 && sent[sent.length - 1] === msg, 'una «ñ» partida entre fragmentos llega intacta (' + JSON.stringify(sent[sent.length - 1]) + ')');
  const r2 = await raw('POST', '/act', [Buffer.from('{"a":"create",')]);
  ok(r2.status === 400 && r2.responses === 1, 'JSON inválido: una sola respuesta 400 (respuestas: ' + r2.responses + ')');
  const big = Buffer.from(JSON.stringify({ a: 'join', pad: 'x'.repeat(9000) }));
  const r3 = await raw('POST', '/act', [big.subarray(0, 5000), big.subarray(5000)]);
  ok(r3.status === 400 && r3.responses === 1, 'pedido de más de 8 KB: una sola respuesta 400');

  console.log('\n== SEG-01/02: propietario del chat por id');
  const perms = async tok => (await raw('GET', '/api/chat/permisos', [], { Authorization: 'Bearer ' + tok })).json;
  ok(JSON.stringify(await perms('owner')) === '{"owner":true,"moderador":true}', 'el id 1000 (CHAT_OWNER_ID) es propietario');
  ok((await perms('impostor')).owner === false, 'una cuenta llamada «Burzaco» no es propietaria');
  const pm = await perms('mod');
  ok(pm.owner === false && pm.moderador === true, 'un moderador no es propietario');
  const susp = await post('/api/chat/moderar', { usuario: 'Alguien', accion: 'suspender' }, { Authorization: 'Bearer mod' });
  ok(susp.status === 403, 'suspender está reservado al propietario');

  console.log('\n== SEG-03 + SRV-01: IP real y tope de salas');
  const create = (i, xff) => post('/act', { a: 'create', pid: 'h' + i, name: 'H', room: 'srv' + i + Date.now().toString(36).slice(-4), cfg: { div: 'ar1', fmt: 'liga1', n: 4 } }, xff ? { 'X-Forwarded-For': xff } : {});
  const st = [];
  for (let i = 0; i < 3; i++) st.push((await create(i, '10.0.0.' + i)).status);
  ok(st.every(s => s === 200), 'las primeras 3 salas se crean (' + st.join(',') + ')');
  const r4 = await create(3, '203.0.113.9');
  ok(r4.status === 429, 'la 4.ª se rechaza aunque cambie X-Forwarded-For: sin TRUST_PROXY se usa la IP del socket');

  console.log('\n== SRV-01: una sala en elección de clubes sin nadie conectado vence a los 5 min');
  const E = require('./public/engine');
  const codes = Object.keys(E.rooms).filter(k => k.startsWith('srv'));
  ok(codes.length === 3 && codes.every(k => E.rooms[k].phase === 'pick'), 'hay 3 salas en «pick»');
  server.sweep(Date.now() + 4 * 60e3);
  ok(Object.keys(E.rooms).filter(k => k.startsWith('srv')).length === 3, 'a los 4 min siguen');
  server.sweep(Date.now() + 6 * 60e3);
  ok(Object.keys(E.rooms).filter(k => k.startsWith('srv')).length === 0, 'a los 6 min se liberan');

  console.log('\n== store.js real (pool simulado): jerarquía de sanciones por por_id');
  delete require.cache[storePath];
  const store = require('./store');
  const sanciones = new Map(), log = [];
  store.init({ pool: { on() {}, query: async (sql, p = []) => {
    sql = String(sql); log.push(sql);
    if (/^SELECT por_id FROM chat_sanciones/.test(sql)) { const s = sanciones.get(p[0]); return { rows: s ? [{ por_id: s.por_id }] : [], rowCount: s ? 1 : 0 }; }
    if (/^INSERT INTO chat_sanciones/.test(sql)) { const porId = /'mute'/.test(sql) ? p[3] : p[2]; sanciones.set(p[0], { tipo: /'mute'/.test(sql) ? 'mute' : 'suspension', por_id: porId }); return { rows: [], rowCount: 1 }; }
    if (/^DELETE FROM chat_sanciones/.test(sql)) { const had = sanciones.delete(p[0]); return { rows: [], rowCount: had ? 1 : 0 }; }
    if (/^SELECT usuario_id FROM chat_mensajes/.test(sql)) return { rows: [{ usuario_id: 1000 }], rowCount: 1 };
    return { rows: [], rowCount: 0 };
  } } });
  ok(!(await store.chatModeracion(1000, 50, 'suspender', 0, 'grave')).error && sanciones.get(50).por_id === 1000, 'el propietario suspende: por_id = 1000');
  ok(/propietario/.test((await store.chatModeracion(3, 50, 'silenciar', 5, '')).error || ''), 'un moderador no puede pisar la suspensión del propietario');
  ok(/propietario/.test((await store.chatModeracion(3, 50, 'reactivar', 0, '')).error || '') && sanciones.get(50).tipo === 'suspension', 'ni levantarla');
  ok(!(await store.chatModeracion(3, 60, 'silenciar', 5, '')).error && sanciones.get(60).por_id === 3, 'el moderador sanciona a otro: por_id = 3');
  ok(!(await store.chatModeracion(3, 60, 'reactivar', 0, '')).error, 'y levanta su propia sanción');
  ok(/propietario/.test((await store.chatModeracion(3, 1000, 'silenciar', 5, '')).error || ''), 'nadie sanciona al propietario (por id)');
  ok(!(await store.chatModeracion(1000, 50, 'reactivar', 0, '')).error && !sanciones.has(50), 'el propietario levanta su sanción');
  const del = await store.chatEliminar(3, 7, false, true);
  ok(/propietario/.test(del.error || ''), 'un moderador no borra mensajes del propietario (autor por id)');
  ok(!log.some(s => /lower\(usuario\)|Burzaco/.test(s)), 'ninguna consulta compara nombres de usuario');

  console.log(fails ? '\nFALLAS: ' + fails : '\nTodo OK'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('ERROR', e.stack); process.exit(1); });
