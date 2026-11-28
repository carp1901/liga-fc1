// REN-01: mide el tráfico SSE por jugador durante un partido online, con el mismo emisor de deltas del Worker
// (deltaSender, v=2) y sin deltas (estado completo en cada envío, como server.js). node tools/medir-sse.mjs [minutos]
// En producción el reloj avanza un tick por segundo (CFG.tick=1000): bytes por tick ≈ bytes por segundo.
import Engine from "../public/engine.js";
import { deltaSender } from "../src/worker.mjs";
const E = Engine, MIN = +process.argv[2] || 90;
E.CFG.offline = false; E.CFG.externalClock = false; E.CFG.auth2dServer = false; E.CFG.tick = 15; E.CFG.fastWaits = true;
const room = "med" + Date.now().toString(36).slice(-5);
const bytes = { full: 0, delta: 0, envios: 0, enPartido: 0 }, enc = new TextEncoder();
const fake = { enqueue: b => { if (cur.partido) bytes.delta += b.length; } };
const cur = { partido: false };
const send = deltaSender(fake);
let v1 = null;
E.act({ a: "create", pid: "p1", name: "Uno", room, uid: "u1", cfg: { div: "ar1", fmt: "liga1", n: 4 } });
E.act({ a: "join", pid: "p2", name: "Dos", room, uid: "u2" });
E.act({ a: "addai", room, pid: "p1" }); E.act({ a: "addai", room, pid: "p1" });
E.listen(room, "p1", v => {
  v1 = v; cur.partido = v.phase === "m1" || v.phase === "m2";
  if (cur.partido) { bytes.full += enc.encode("data:" + JSON.stringify(v) + "\n\n").length; bytes.enPartido++; }
  bytes.envios++; send(v);
});
E.listen(room, "p2", () => {});
E.act({ a: "pick", room, pid: "p1", team: "river" }); E.act({ a: "pick", room, pid: "p2", team: "boca" });
const R = E.rooms[room], t0 = Date.now();
let ticks0 = null, ticks = 0;
await new Promise(done => {
  const iv = setInterval(() => {
    const v = v1; if (!v) return;
    if (["pre", "lobby"].includes(v.phase)) { E.act({ a: "ready", room, pid: "p1", v: true }); E.act({ a: "ready", room, pid: "p2", v: true }); }
    (R.ms || []).forEach(m => { const p = m.pend; if (p && p.id != null) ["C", "L", "R"].forEach(d => [m.a, m.b].forEach(pid => E.act({ a: "pdec", room, pid, id: p.id, d }))); });
    const m0 = R.ms && R.ms[0];
    if (m0) { if (ticks0 == null) ticks0 = m0.clock; ticks = m0.clock - ticks0; }
    if ((m0 && m0.clock >= MIN) || (v.phase === "lobby" && bytes.enPartido > 0) || Date.now() - t0 > 120000) { clearInterval(iv); done(); }
  }, 10);
});
clearInterval(R.timer); delete E.rooms[room];
const per = (b, n) => n ? Math.round(b / n) : 0, kb = b => (b / 1024).toFixed(1) + " KB";
const n = bytes.enPartido;
console.log(JSON.stringify({ minutosSimulados: ticks, enviosEnPartido: n, sinDeltas: { porEnvio: kb(per(bytes.full, n)), totalPartido: kb(bytes.full) }, conDeltas: { porEnvio: kb(per(bytes.delta, n)), totalPartido: kb(bytes.delta) }, ahorro: n ? (100 - bytes.delta / bytes.full * 100).toFixed(1) + " %" : null }, null, 1));
process.exit(0);
