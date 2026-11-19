import Engine from "../public/engine.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};
const ROOM_RE = /^[a-z0-9]{3,12}$/i;

Engine.CFG.externalClock = true;
Engine.CFG.offline = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}
function validRoomId(value) {
  return ROOM_RE.test(value || "");
}
async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        platform: "cloudflare-workers",
        phase: "single-room-runtime",
        engine: "integrated"
      });
    }

    let roomId = "";
    let path = "";
    if (request.method === "POST" && url.pathname === "/act") {
      const body = await readJson(request.clone());
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      roomId = String(body.room || "").toLowerCase();
      if (!validRoomId(roomId)) return json({ error: "Código de sala inválido" }, 400);
      path = "/room/" + roomId + "/act";
    } else if (request.method === "GET" && url.pathname === "/ev") {
      roomId = String(url.searchParams.get("room") || "").toLowerCase();
      if (!validRoomId(roomId)) return json({ error: "Código de sala inválido" }, 400);
      path = "/room/" + roomId + "/ev?pid=" + encodeURIComponent(url.searchParams.get("pid") || "");
    } else if (request.method === "GET" && url.pathname === "/__cf/rooms/state") {
      roomId = String(url.searchParams.get("room") || "").toLowerCase();
      if (!validRoomId(roomId)) return json({ error: "Código de sala inválido" }, 400);
      path = "/room/" + roomId + "/state";
    } else {
      return json({ error: "Ruta no disponible" }, 404);
    }

    const id = env.ROOMS.idFromName(roomId);
    const stub = env.ROOMS.get(id);
    const forwarded = new Request(new URL(path, url.origin), request);
    return stub.fetch(forwarded);
  }
};

export class RoomCoordinator {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.loadedCode = null;
    this.clients = new Map();
    this.queue = Promise.resolve();
  }

  async load(code) {
    if (this.loadedCode === code) return;
    const saved = await this.state.storage.get("game-room");
    if (saved) Engine.loadRoom(code, saved);
    this.loadedCode = code;
  }

  async persist(code) {
    const snapshot = Engine.saveRoom(code);
    if (snapshot) {
      await this.state.storage.put("game-room", snapshot);
      await this.state.storage.put("room-code", code);
      if (this.state.storage.setAlarm) await this.state.storage.setAlarm(Date.now() + 1000);
    } else {
      await this.state.storage.delete("game-room");
      await this.state.storage.delete("room-code");
    }
  }

  fetch(request) {
    const run = this.queue.then(() => this.handle(request));
    this.queue = run.catch(() => {});
    return run;
  }

  async handle(request) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/room\/([a-z0-9]{3,12})\/(act|ev|state)$/i);
    if (!match) return json({ error: "Ruta no disponible" }, 404);
    const code = match[1].toLowerCase();
    const action = match[2];
    await this.load(code);

    if (action === "act" && request.method === "POST") {
      const body = await readJson(request);
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      if (String(body.room || "").toLowerCase() !== code) return json({ error: "La sala no coincide" }, 400);
      // Until the auth endpoints are migrated, never trust a client-supplied account ID.
      const { uid, ...safeBody } = body;
      const error = Engine.act({ ...safeBody, room: code });
      if (error) return json({ error }, 400);
      await this.persist(code);
      return json({ ok: true });
    }

    if (action === "state" && request.method === "GET") {
      const snapshot = Engine.saveRoom(code);
      return snapshot ? json({ snapshot }) : json({ error: "Sala inexistente" }, 404);
    }

    if (action === "ev" && request.method === "GET") {
      const pid = String(url.searchParams.get("pid") || "").slice(0, 40);
      if (!pid) return json({ error: "Falta id de jugador" }, 400);
      if (!Engine.rooms[code]) return json({ error: "Sala inexistente" }, 404);

      let client;
      const stream = new ReadableStream({
        start: controller => {
          client = { controller };
          this.clients.set(pid, client);
          const connected = Engine.listen(code, pid, value => {
            try { controller.enqueue(new TextEncoder().encode("data:" + JSON.stringify(value) + "\n\n")); }
            catch { this.clients.delete(pid); }
          });
          if (!connected) {
            this.clients.delete(pid);
            controller.close();
          }
        },
        cancel: () => {
          if (this.clients.get(pid) === client) this.clients.delete(pid);
          Engine.listen(code, pid, null);
        }
      });
      return new Response(stream, {
        headers: {
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-cache, no-transform",
          "x-accel-buffering": "no"
        }
      });
    }

    return json({ error: "Método no disponible" }, 405);
  }

  alarm() {
    const run = this.queue.then(() => this.handleAlarm());
    this.queue = run.catch(() => {});
    return run;
  }

  async handleAlarm() {
    const code = await this.state.storage.get("room-code");
    if (!code) return;
    await this.load(code);
    const room = Engine.rooms[code];
    if (!room) {
      await this.state.storage.delete("game-room");
      await this.state.storage.delete("room-code");
      return;
    }

    const idle = Date.now() - (room.touched || Date.now()) > 60 * 60 * 1000;
    const connected = room.order.some(pid => room.pl[pid] && room.pl[pid].cb)
      || Object.values(room.spec || {}).some(player => player.cb);
    if (idle && !connected) {
      Engine.removeRoom(code);
      await this.state.storage.delete("game-room");
      await this.state.storage.delete("room-code");
      return;
    }

    Engine.tickRoom(code);
    await this.persist(code);
    for (const client of this.clients.values()) {
      try { client.controller.enqueue(new TextEncoder().encode(":ping\n\n")); }
      catch { /* A canceled stream is removed by its cancel handler. */ }
    }
  }
}
