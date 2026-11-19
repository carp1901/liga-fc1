import Engine from "../public/engine.js";
import Data from "../public/data.js";
import * as Auth from "./auth.mjs";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};
const ROOM_RE = /^[a-z0-9]{3,12}$/i;

Engine.CFG.externalClock = true;
Engine.CFG.offline = false;

const AUTH_ATTEMPTS = new Map();
let authSweepCount = 0;
function allowAuthAttempt(key, limit, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  if (++authSweepCount % 256 === 0) {
    for (const [storedKey, values] of AUTH_ATTEMPTS) {
      const active = values.filter(time => now - time < windowMs);
      if (active.length) AUTH_ATTEMPTS.set(storedKey, active);
      else AUTH_ATTEMPTS.delete(storedKey);
    }
  }
  const recent = (AUTH_ATTEMPTS.get(key) || []).filter(time => now - time < windowMs);
  if (recent.length >= limit) {
    AUTH_ATTEMPTS.set(key, recent);
    return false;
  }
  recent.push(now);
  AUTH_ATTEMPTS.set(key, recent);
  return true;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}
function validRoomId(value) {
  return ROOM_RE.test(value || "");
}
function deltaSender(controller) {
  let previous = null;
  let sent = 0;
  const encoder = new TextEncoder();
  const isObject = value => value !== null && typeof value === "object";
  function diff(a, b, path, sets, deletes) {
    if (Object.is(a, b)) return;
    if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
      for (let i = 0; i < b.length; i++) diff(a[i], b[i], path.concat(i), sets, deletes);
      return;
    }
    if (isObject(a) && isObject(b) && !Array.isArray(a) && !Array.isArray(b)) {
      for (const key of Object.keys(a)) {
        if (!Object.prototype.hasOwnProperty.call(b, key)) deletes.push(path.concat(key));
      }
      for (const key of Object.keys(b)) {
        if (!Object.prototype.hasOwnProperty.call(a, key)) sets.push([path.concat(key), b[key]]);
        else diff(a[key], b[key], path.concat(key), sets, deletes);
      }
      return;
    }
    sets.push([path, b]);
  }
  return value => {
    const snapshot = JSON.parse(JSON.stringify(value));
    if (!previous || ++sent % 30 === 0) {
      controller.enqueue(encoder.encode("data:" + JSON.stringify({ __cf: "full", v: snapshot }) + "\n\n"));
      previous = snapshot;
      return;
    }
    const sets = [];
    const deletes = [];
    diff(previous, snapshot, [], sets, deletes);
    if (sets.length || deletes.length) {
      const patch = JSON.stringify({ __cf: "patch", u: sets, d: deletes });
      const full = JSON.stringify({ __cf: "full", v: snapshot });
      controller.enqueue(encoder.encode("data:" + (patch.length < full.length ? patch : full) + "\n\n"));
    }
    previous = snapshot;
  };
}
function addCors(response, origin) {
  if (!origin) return response;
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", origin);
  headers.set("access-control-allow-methods", "GET,POST,OPTIONS");
  headers.set("access-control-allow-headers", "Content-Type,Authorization");
  headers.set("access-control-max-age", "86400");
  headers.append("vary", "Origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    const allowed = String(env.FRONTEND_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean);
    if (origin && !allowed.includes(origin)) return json({ error: "Origen no autorizado" }, 403);
    if (request.method === "OPTIONS") return addCors(new Response(null, { status: 204 }), origin);
    return addCors(await routeRequest(request, env), origin);
  }
};

async function routeRequest(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        platform: "cloudflare-workers",
        phase: "single-room-runtime",
        engine: "integrated"
      });
    }

    const authPath = url.pathname;
    if (request.method === "POST" && (authPath === "/api/auth/registro" || authPath === "/api/auth/login")) {
      const body = await readJson(request.clone());
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      const ip = request.headers.get("cf-connecting-ip") || "unknown";
      const usernameKey = String(body.usuario || "").trim().toLowerCase().slice(0, 16);
      if (authPath.endsWith("/registro") && !allowAuthAttempt("register:" + ip, 30)) {
        return json({ error: "Demasiados intentos; probá más tarde" }, 429);
      }
      if (authPath.endsWith("/login") &&
          (!allowAuthAttempt("login-ip:" + ip, 150) || !allowAuthAttempt("login-user:" + usernameKey, 20))) {
        return json({ error: "Demasiados intentos; probá más tarde" }, 429);
      }
      try {
        const result = authPath.endsWith("/registro")
          ? await Auth.register(env, body.usuario, body.clave)
          : await Auth.login(env, body.usuario, body.clave);
        return json(result, result.error ? (authPath.endsWith("/login") ? 401 : 400) : 200);
      } catch (error) {
        console.error("Auth database error:", error?.message || error);
        return json({ error: "Base de datos no disponible" }, 503);
      }
    }
    if (request.method === "GET" && authPath === "/api/auth/yo") {
      try {
        const user = await Auth.userByToken(env, Auth.tokenFromRequest(request));
        return user ? json({ usuario: user.usuario }) : json({ error: "Sesión inválida o vencida" }, 401);
      } catch (error) {
        console.error("Auth database error:", error?.message || error);
        return json({ error: "Base de datos no disponible" }, 503);
      }
    }
    if (request.method === "POST" && authPath === "/api/auth/logout") {
      const body = await readJson(request.clone());
      try {
        await Auth.logout(env, Auth.tokenFromRequest(request, body));
        return json({ ok: 1 });
      } catch (error) {
        console.error("Auth database error:", error?.message || error);
        return json({ error: "Base de datos no disponible" }, 503);
      }
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
      path = "/room/" + roomId + "/ev?pid=" + encodeURIComponent(url.searchParams.get("pid") || "") + "&v=" + encodeURIComponent(url.searchParams.get("v") || "");
    } else if (request.method === "GET" && url.pathname === "/api/sesion") {
      roomId = String(url.searchParams.get("room") || "").toLowerCase();
      if (!validRoomId(roomId)) return json({ error: "Código de sala inválido" }, 400);
      path = "/room/" + roomId + "/session?pid=" + encodeURIComponent(url.searchParams.get("pid") || "");
    } else if (request.method === "GET" && url.pathname === "/teams.json") {
      return json(Data.DIVS);
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
    const match = url.pathname.match(/^\/room\/([a-z0-9]{3,12})\/(act|ev|state|session)$/i);
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
      if (error) {
        await this.persist(code);
        return json({ error }, 400);
      }
      await this.persist(code);
      return json({ ok: true });
    }

    if (action === "session" && request.method === "GET") {
      const pid = String(url.searchParams.get("pid") || "").slice(0, 40);
      const room = Engine.rooms[code];
      const player = room && !room.offline && !room.closed && pid
        && (room.pl[pid] || (room.spec && room.spec[pid]));
      return json({ ok: !!player && !(player.ai && !player.nm0) });
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
          const send = url.searchParams.get("v") === "2"
            ? deltaSender(controller)
            : value => controller.enqueue(new TextEncoder().encode("data:" + JSON.stringify(value) + "\n\n"));
          controller.enqueue(new TextEncoder().encode("retry:2000\n\n"));
          const connected = Engine.listen(code, pid, value => {
            try { send(value); }
            catch { this.clients.delete(pid); }
          });
          if (!connected) {
            this.clients.delete(pid);
            controller.close();
          }
        },
        cancel: () => {
          if (this.clients.get(pid) === client) {
            this.clients.delete(pid);
            Engine.listen(code, pid, null);
          }
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
