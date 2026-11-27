import Engine from "../public/engine.js";
import Data from "../public/data.js";
import Sim2D from "../public/sim2d.js";
import * as Auth from "./auth.mjs";
import { dbQuery } from "./db.mjs";
import * as Social from "./social.mjs";
import * as Chat from "./chat.mjs";
import * as Careers from "./careers.mjs";
import { ChatHub } from "./chat-hub.mjs";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};
const ROOM_RE = /^[a-z0-9]{3,12}$/i;

Engine.CFG.externalClock = true;
Engine.CFG.offline = false;
// 2D sin pantalla en el servidor (faltas, córners, ataques y remates salen de ahí en salas online con humanos).
// APAGADO por defecto: solo se activa con la variable SERVER_2D="1". Cualquier otro valor (o ninguno) usa el motor clásico.
export function server2dEnabled(env) {
  return String(env && env.SERVER_2D != null ? env.SERVER_2D : "").trim() === "1";
}
export function applyServer2d(env) {
  Engine.CFG.auth2dServer = server2dEnabled(env);
  return Engine.CFG.auth2dServer;
}
Engine.CFG.Sim = Sim2D.Sim;
Engine.CFG.auth2dServer = false;

const AUTH_ATTEMPTS = new Map();
const ROOM_CREATE_MAX = 20; // salas privadas por IP y por hora (mismo tope que server.js)
const CHAT_SEND_TIMES = new Map();
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
export function deltaSender(controller) { // exportada para tools/medir-sse.mjs
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
    applyServer2d(env);
    const origin = request.headers.get("origin") || "";
    const allowed = String(env.FRONTEND_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean);
    if (origin && !allowed.includes(origin)) return json({ error: "Origen no autorizado" }, 403);
    if (request.method === "OPTIONS") return addCors(new Response(null, { status: 204 }), origin);
    return addCors(await routeRequest(request, env), origin);
  }
};

async function publishChat(env, tipo, data) {
  const id = env.CHAT.idFromName("global");
  const stub = env.CHAT.get(id);
  await stub.fetch(new Request("https://chat.internal/broadcast", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ tipo, data })
  }));
}

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

    if (request.method === "GET" && url.pathname === "/api/db/health") {
      try {
        const result = await dbQuery(env, "SELECT 1 AS ok", []);
        return json({ ok: true, database: "connected", value: result.rows[0]?.ok ?? null });
      } catch (error) {
        console.error("Neon health check failed:", error?.message || error);
        return json({ ok: false, database: "unavailable" }, 503);
      }
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

    if (request.method === "GET" && authPath === "/api/auth/perfil") {
      try {
        const user = await Auth.userByToken(env, Auth.tokenFromRequest(request));
        if (!user) return json({ error: "Sesión inválida o vencida" }, 401);
        return json(await Social.profile(env, user.id));
      } catch (error) {
        console.error("Profile lookup failed:", error?.message || error);
        return json({ error: "Perfil no disponible" }, 503);
      }
    }
    if (request.method === "POST" && authPath === "/api/auth/favorito") {
      const body = await readJson(request.clone());
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      try {
        const user = await Auth.userByToken(env, Auth.tokenFromRequest(request, body));
        if (!user) return json({ error: "Iniciá sesión para elegir tu club favorito" }, 401);
        const club = String(body.club || "").trim();
        if (!Object.prototype.hasOwnProperty.call(Data.TM || {}, club)) {
          return json({ error: "Elegí un club válido" }, 400);
        }
        const result = await Social.setFavorite(env, user.id, club);
        return json(result, result.error ? 409 : 200);
      } catch (error) {
        console.error("Favorite club update failed:", error?.message || error);
        return json({ error: "No se pudo guardar el club favorito" }, 503);
      }
    }
    if (url.pathname === "/api/amigos" || url.pathname.startsWith("/api/amigos/")) {
      const route = url.pathname.slice(12);
      const body = request.method === "POST" ? await readJson(request.clone()) : null;
      if (request.method === "POST" && (!body || typeof body !== "object")) {
        return json({ error: "Pedido inválido" }, 400);
      }
      try {
        const user = await Auth.userByToken(env, Auth.tokenFromRequest(request, body));
        if (!user) return json({ error: "Iniciá sesión para usar Amigos" }, 401);
        if (request.method === "GET" && route === "") {
          return json(await Social.friends(env, user.id));
        }
        if (request.method !== "POST") return json({ error: "No existe" }, 404);
        if (!allowAuthAttempt("friends:" + user.id, 200)) {
          return json({ error: "Demasiadas acciones; probá más tarde" }, 429);
        }
        let result;
        if (route === "solicitar") {
          if (!allowAuthAttempt("friend-requests:" + user.id, 40)) {
            return json({ error: "Enviaste muchas solicitudes; probá más tarde" }, 429);
          }
          result = await Social.requestFriend(env, user.id, body.usuario);
        } else if (route === "responder") {
          result = await Social.respondFriend(env, user.id, body.id, body.accion);
        } else if (route === "cancelar") {
          result = await Social.cancelFriendRequest(env, user.id, body.id);
        } else if (route === "quitar") {
          result = await Social.removeFriend(env, user.id, body.id);
        } else {
          return json({ error: "No existe" }, 404);
        }
        return json(result, result.error ? 400 : 200);
      } catch (error) {
        console.error("Friends request failed:", error?.message || error);
        return json({ error: "No se pudo completar la operación de amigos" }, 503);
      }
    }
    if (request.method === "GET" && url.pathname === "/api/tecnico") {
      try {
        const result = await Social.publicProfile(env, url.searchParams.get("usuario") || "");
        return json(result, result.error ? 404 : 200);
      } catch (error) {
        console.error("Public profile lookup failed:", error?.message || error);
        return json({ error: "Perfil no disponible" }, 503);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/auth/carrera") {
      const body = await readJson(request.clone());
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      try {
        const user = await Auth.userByToken(env, Auth.tokenFromRequest(request, body));
        if (!user) return json({ error: "Sesión inválida o vencida" }, 401);
        if (!allowAuthAttempt("career:" + user.id, 120)) return json({ error: "Demasiados registros; probá más tarde" }, 429);
        // This public-facing endpoint only accepts offline careers, as in the legacy server.
        // Online career records are generated and persisted by the authoritative Durable Object engine.
        const record = Careers.offlineTitleRecord(body, Data);
        if (typeof record === "string") return json({ error: record }, 400);
        const pos = body.pos == null ? null : Math.floor(Number(body.pos));
        if (pos != null && !(pos >= 1 && pos <= record.n)) return json({ error: "Posición inválida" }, 400);
        const num = value => value == null ? null : Math.max(0, Math.min(999, Math.floor(Number(value) || 0)));
        await Careers.addCareers(env, [{
          ...record, uid: user.id, origen: "offline", pos,
          resultado: String(body.resultado || "").replace(/[<>&"]/g, "").slice(0, 40) || null,
          campeon: !!body.campeon, pj: num(body.pj), g: num(body.g), e: num(body.e),
          p: num(body.p), gf: num(body.gf), gc: num(body.gc), pts: num(body.pts)
        }]);
        return json({ ok: 1 });
      } catch (error) {
        console.error("Career save failed:", error?.message || error);
        return json({ error: "No se pudo guardar la carrera" }, 503);
      }
    }
    if (request.method === "POST" && url.pathname === "/api/titulo-offline") {
      const body = await readJson(request.clone());
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      const ip = request.headers.get("cf-connecting-ip") || "unknown";
      const pid = String(body.pid || "").slice(0, 40);
      if (!allowAuthAttempt("offline-title-ip:" + ip, 30) || !allowAuthAttempt("offline-title-pid:" + pid, 30)) {
        return json({ error: "Demasiados títulos informados; probá más tarde" }, 429);
      }
      const record = Careers.offlineTitleRecord(body, Data);
      if (typeof record === "string") return json({ error: record }, 400);
      try { return json(await Careers.addTitle(env, record)); }
      catch (error) {
        console.error("Offline title save failed:", error?.message || error);
        return json({ error: "Base de datos no disponible" }, 503);
      }
    }
    if (request.method === "GET" && url.pathname === "/api/ranking") {
      const get = key => url.searchParams.get(key) || "";
      const year = /^20\d{2}$/.test(get("year")) ? Number(get("year")) : 0;
      const filters = {
        mod: ["online","clasico","barrial","offline"].includes(get("mod")) ? get("mod") : "online",
        comp: /^[a-z0-9]{1,30}$/.test(get("comp")) ? get("comp") : "",
        fmt: ["liga","copa","mixto"].includes(get("fmt")) ? get("fmt") : "",
        country: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{2,30}$/.test(get("country")) ? get("country") : "",
        year
      };
      try { return json({ ...(await Careers.rankingClubs(env, filters)), filtros: filters }); }
      catch (error) { console.error("Club ranking failed:", error?.message || error); return json({ error: "Base de datos no disponible" }, 503); }
    }
    if (request.method === "GET" && url.pathname === "/api/titulo") {
      const id = url.searchParams.get("id") || "";
      if (!/^[a-z0-9]{8,60}$/.test(id)) return json({ error: "ID inválido" }, 400);
      try { const result = await Careers.titleInfo(env, id); return json(result, result.error ? 404 : 200); }
      catch (error) { console.error("Title lookup failed:", error?.message || error); return json({ error: "Base de datos no disponible" }, 503); }
    }
    if (request.method === "GET" && url.pathname === "/api/club") {
      const id = url.searchParams.get("id") || "";
      if (!/^[a-z0-9]{1,40}$/.test(id) || !Object.prototype.hasOwnProperty.call(Data.TM || {}, id)) return json({ error: "Club inexistente" }, 404);
      try { return json({ id, nombre: Data.TM[id].name, ...(await Careers.club(env, id)) }); }
      catch (error) { console.error("Club palmares failed:", error?.message || error); return json({ error: "Base de datos no disponible" }, 503); }
    }
    if (request.method === "GET" && url.pathname === "/api/titulos") {
      try { return json(await Careers.listTitles(env, url.searchParams.get("limit"))); }
      catch (error) { console.error("Titles list failed:", error?.message || error); return json({ error: "Base de datos no disponible" }, 503); }
    }
    if (request.method === "GET" && url.pathname === "/api/ranking-tecnicos") {
      const period = url.searchParams.get("periodo") === "temporada" ? "temporada" : "historico";
      try { return json(await Careers.rankingCoaches(env, period)); }
      catch (error) { console.error("Coach ranking failed:", error?.message || error); return json({ error: "Ranking no disponible" }, 503); }
    }
    if (request.method === "GET" && url.pathname === "/api/ranking-hinchas") {
      try { return json(await Careers.rankingFans(env)); }
      catch (error) { console.error("Fan ranking failed:", error?.message || error); return json({ error: "Ranking de hinchas no disponible" }, 503); }
    }

    if (request.method === "GET" && url.pathname === "/api/salas") {
      const id = env.LOBBY.idFromName("global");
      return env.LOBBY.get(id).fetch(new Request("https://lobby.internal/list"));
    }
    if (request.method === "POST" && url.pathname === "/api/pub") {
      const body = await readJson(request.clone());
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      const ip = request.headers.get("cf-connecting-ip") || "unknown";
      if (!allowAuthAttempt("public-lobby:" + ip, 120)) return json({ error: "Demasiados intentos; probá más tarde" }, 429);
      try {
        let user = null;
        const token = Auth.tokenFromRequest(request, body);
        if (token) user = await Auth.userByToken(env, token);
        const { uid: clientUid, tok: clientToken, ...safeBody } = body;
        if (user) safeBody.uid = user.id;
        const id = env.LOBBY.idFromName("global");
        return env.LOBBY.get(id).fetch(new Request("https://lobby.internal/api", {
          method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(safeBody)
        }));
      } catch (error) {
        console.error("Public lobby request failed:", error?.message || error);
        return json({ error: "No se pudo completar la operación de sala" }, 503);
      }
    }

    if (url.pathname.startsWith("/api/chat")) {
      const chatPath = url.pathname;
      if (chatPath === "/api/chat/stream" && request.method === "GET") {
        const id = env.CHAT.idFromName("global");
        return env.CHAT.get(id).fetch(new Request("https://chat.internal/stream"));
      }
      if (chatPath === "/api/chat" && request.method === "GET") {
        try {
          let user = null;
          const token = Auth.tokenFromRequest(request);
          if (token) user = await Auth.userByToken(env, token);
          return json(await Chat.history(env, url.searchParams.get("limit"), user?.id || null));
        } catch (error) {
          console.error("Chat history failed:", error?.message || error);
          return json({ error: "Chat no disponible" }, 503);
        }
      }
      const needsBody = request.method === "POST";
      const body = needsBody ? await readJson(request.clone()) : null;
      if (needsBody && (!body || typeof body !== "object")) return json({ error: "Pedido inválido" }, 400);
      if (chatPath === "/api/chat" && request.method === "POST") {
        try {
          const user = await Auth.userByToken(env, Auth.tokenFromRequest(request, body));
          if (!user) return json({ error: "Iniciá sesión para escribir en el chat" }, 401);
          const perms = await Chat.permissions(env, user);
          const interval = perms.owner ? 0 : perms.moderador ? 10000 : 20000;
          const last = CHAT_SEND_TIMES.get(user.id) || 0;
          const wait = interval - (Date.now() - last);
          if (wait > 0) return json({
            error: "Para evitar spam, esperá " + Math.ceil(wait / 1000) + " segundos antes de enviar otro mensaje.",
            espera: Math.ceil(wait / 1000)
          }, 429);
          const badWords = ["poronga","pija","verga","concha","cogida","cogido","coger","putita","putito","puta","puto","mierda"];
          const filter = new RegExp("(^|[^\\p{L}\\p{N}])(" + badWords.join("|") + ")(?=$|[^\\p{L}\\p{N}])", "giu");
          const filtered = String(body.mensaje || "").replace(filter, (all, left, word) => left + "•".repeat(word.length));
          const result = await Chat.sendMessage(env, user.id, filtered);
          if (result.error) return json(result, 403);
          if (!perms.owner) CHAT_SEND_TIMES.set(user.id, Date.now());
          await publishChat(env, "mensaje", result.mensaje);
          return json(result);
        } catch (error) {
          console.error("Chat send failed:", error?.message || error);
          return json({ error: "Chat no disponible" }, 503);
        }
      }
      if (chatPath === "/api/chat/permisos" && request.method === "GET") {
        try {
          const user = await Auth.userByToken(env, Auth.tokenFromRequest(request));
          if (!user) return json({ error: "Iniciá sesión" }, 401);
          return json(await Chat.permissions(env, user));
        } catch (error) {
          console.error("Chat permissions failed:", error?.message || error);
          return json({ error: "Chat no disponible" }, 503);
        }
      }
      if (chatPath === "/api/chat/reaccion" && request.method === "POST") {
        try {
          const user = await Auth.userByToken(env, Auth.tokenFromRequest(request, body));
          if (!user) return json({ error: "Iniciá sesión para reaccionar" }, 401);
          if (!allowAuthAttempt("chatvote:" + user.id, 180)) return json({ error: "Demasiadas reacciones; probá más tarde" }, 429);
          const result = await Chat.vote(env, user.id, body.id, body.valor);
          if (result.error) return json(result, 400);
          await publishChat(env, "reaccion", {
            id: result.reaccion.id, likes: result.reaccion.likes, dislikes: result.reaccion.dislikes
          });
          return json(result);
        } catch (error) {
          console.error("Chat reaction failed:", error?.message || error);
          return json({ error: "Chat no disponible" }, 503);
        }
      }
      if (chatPath === "/api/chat/reaccionarios" && request.method === "GET") {
        try {
          const user = await Auth.userByToken(env, Auth.tokenFromRequest(request));
          if (!user) return json({ error: "Iniciá sesión" }, 401);
          const perms = await Chat.permissions(env, user);
          if (!perms.moderador) return json({ error: "No tenés permisos para ver quién reaccionó" }, 403);
          const result = await Chat.reactionUsers(env, url.searchParams.get("id"), url.searchParams.get("valor"));
          return json(result, result.error ? 400 : 200);
        } catch (error) {
          console.error("Chat reaction users failed:", error?.message || error);
          return json({ error: "Chat no disponible" }, 503);
        }
      }
      if (chatPath === "/api/chat/eliminar" && request.method === "POST") {
        try {
          const user = await Auth.userByToken(env, Auth.tokenFromRequest(request, body));
          if (!user) return json({ error: "Iniciá sesión" }, 401);
          const perms = await Chat.permissions(env, user);
          const result = await Chat.deleteMessage(env, user.id, body.id, perms.owner, perms.moderador);
          if (result.error) return json(result, 403);
          await publishChat(env, "eliminado", { id: result.id });
          return json(result);
        } catch (error) {
          console.error("Chat delete failed:", error?.message || error);
          return json({ error: "No se pudo eliminar el comentario" }, 503);
        }
      }
      if (chatPath === "/api/chat/moderar" && request.method === "POST") {
        try {
          const user = await Auth.userByToken(env, Auth.tokenFromRequest(request, body));
          if (!user) return json({ error: "Iniciá sesión" }, 401);
          const perms = await Chat.permissions(env, user);
          if (!perms.moderador) return json({ error: "No tenés permisos de moderación" }, 403);
          const action = String(body.accion || "");
          if (["suspender", "moderar", "desmoderar"].includes(action) && !perms.owner) {
            return json({ error: "Esta acción está reservada al propietario del chat" }, 403);
          }
          const result = await Chat.moderate(env, user.id, body.usuario, action, body.minutos, body.razon);
          return json(result, result.error ? 400 : 200);
        } catch (error) {
          console.error("Chat moderation failed:", error?.message || error);
          return json({ error: "Chat no disponible" }, 503);
        }
      }
      return json({ error: "Ruta no disponible" }, 404);
    }

    let roomId = "";
    let path = "";
    let verifiedUid = null;
    let forwardedBody = null;
    let randomRequest = false;
    if (request.method === "POST" && url.pathname === "/api/random") {
      const body = await readJson(request.clone());
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      const ip = request.headers.get("cf-connecting-ip") || "unknown";
      if (!allowAuthAttempt("random:" + ip, 120)) {
        return json({ error: "Demasiados intentos; probá más tarde" }, 429);
      }
      const token = Auth.tokenFromRequest(request, body);
      if (token) {
        try {
          const user = await Auth.userByToken(env, token);
          verifiedUid = user ? user.id : null;
        } catch (error) {
          console.error("Random matchmaking auth check failed:", error?.message || error);
          return json({ error: "No se pudo validar la sesión" }, 503);
        }
      }
      const { uid: clientUid, tok: clientToken, ...safeBody } = body;
      forwardedBody = safeBody;
      roomId = "rnd-global";
      path = "/join";
      randomRequest = true;
    }
    if (!randomRequest && request.method === "POST" && url.pathname === "/act") {
      const body = await readJson(request.clone());
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      roomId = String(body.room || "").toLowerCase();
      if (!validRoomId(roomId)) return json({ error: "Código de sala inválido" }, 400);
      // SRV-01: cada sala privada es un Durable Object; se limita su creación por IP (límite en memoria de la instancia).
      if (body.a === "create" && !allowAuthAttempt("room-create:" + (request.headers.get("cf-connecting-ip") || "unknown"), ROOM_CREATE_MAX)) {
        return json({ error: "Demasiadas salas creadas; probá más tarde" }, 429);
      }
      const token = Auth.tokenFromRequest(request, body);
      if (token) {
        try {
          const user = await Auth.userByToken(env, token);
          verifiedUid = user ? user.id : null;
        } catch (error) {
          console.error("Game action auth check failed:", error?.message || error);
          return json({ error: "No se pudo validar la sesión" }, 503);
        }
      }
      const { uid: clientUid, tok: clientToken, ...safeBody } = body;
      forwardedBody = safeBody;
      path = "/room/" + roomId + "/act";
    } else if (!randomRequest && request.method === "GET" && url.pathname === "/ev") {
      roomId = String(url.searchParams.get("room") || "").toLowerCase();
      if (!validRoomId(roomId)) return json({ error: "Código de sala inválido" }, 400);
      path = "/room/" + roomId + "/ev?pid=" + encodeURIComponent(url.searchParams.get("pid") || "") + "&v=" + encodeURIComponent(url.searchParams.get("v") || "");
    } else if (!randomRequest && request.method === "GET" && url.pathname === "/api/sesion") {
      roomId = String(url.searchParams.get("room") || "").toLowerCase();
      if (!validRoomId(roomId)) return json({ error: "Código de sala inválido" }, 400);
      path = "/room/" + roomId + "/session?pid=" + encodeURIComponent(url.searchParams.get("pid") || "");
    } else if (!randomRequest && request.method === "GET" && url.pathname === "/teams.json") {
      return json(Data.DIVS);
    } else if (!randomRequest && request.method === "GET" && url.pathname === "/__cf/rooms/state") {
      roomId = String(url.searchParams.get("room") || "").toLowerCase();
      if (!validRoomId(roomId)) return json({ error: "Código de sala inválido" }, 400);
      path = "/room/" + roomId + "/state";
    } else if (!randomRequest) {
      return json({ error: "Ruta no disponible" }, 404);
    }

    const coordinator = randomRequest || roomId.startsWith("rnd") ? env.RANDOM : env.ROOMS;
    if (!coordinator) return json({ error: "Partida rápida no disponible" }, 503);
    const id = coordinator.idFromName(randomRequest ? "global" : roomId.startsWith("rnd") ? "global" : roomId);
    const stub = coordinator.get(id);
    let forwarded;
    if (request.method === "POST" && forwardedBody) {
      const headers = new Headers(request.headers);
      headers.delete("x-clash-auth-user-id");
      headers.delete("authorization");
      headers.delete("content-length");
      headers.delete("content-encoding");
      headers.set("content-type", "application/json");
      if (verifiedUid !== null && Number.isSafeInteger(Number(verifiedUid)) && Number(verifiedUid) > 0) {
        headers.set("x-clash-auth-user-id", String(verifiedUid));
      }
      forwarded = new Request(new URL(path, url.origin), {
        method: "POST",
        headers,
        body: JSON.stringify(forwardedBody)
      });
    } else {
      forwarded = new Request(new URL(path, url.origin), request);
    }
    return stub.fetch(forwarded);
}

export { ChatHub };


export class LobbyCoordinator {
  constructor(state, env) {
    applyServer2d(env);
    this.state = state;
    this.env = env;
    this.queue = Promise.resolve();
  }
  fetch(request) {
    const run = this.queue.then(() => this.handle(request));
    this.queue = run.catch(() => {});
    return run;
  }
  async roomCodes() { return (await this.state.storage.get("public-room-codes")) || []; }
  async roomFetch(code, action, method = "GET", body = null, query = "") {
    const id = this.env.ROOMS.idFromName(code);
    const init = method === "POST" ? { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body || {}) } : { method };
    return this.env.ROOMS.get(id).fetch(new Request("https://room.internal/room/" + code + "/" + action + query, init));
  }
  async listRooms() {
    const codes = await this.roomCodes();
    const results = await Promise.all(codes.map(async code => {
      try {
        const response = await this.roomFetch(code, "public-list");
        const found = await response.json();
        return response.ok && Array.isArray(found) && found.length ? { code, rooms: found } : null;
      } catch (error) {
        console.error("Public room index cleanup failed:", error?.message || error);
        return null;
      }
    }));
    const active = results.filter(Boolean);
    const keep = active.map(item => item.code);
    if (keep.length !== codes.length) await this.state.storage.put("public-room-codes", keep);
    return active.flatMap(item => item.rooms).sort((a,b)=>(b.vac>0)-(a.vac>0)||b.h-a.h);
  }
  async abandon(uid) {
    if (!Number.isSafeInteger(Number(uid)) || Number(uid)<1) return;
    const all=(await this.state.storage.get("abandonments"))||{},key=String(uid),now=Date.now();
    const entry=all[key]||{times:[],until:0};
    entry.times=(entry.times||[]).filter(time=>now-time<864e5);entry.times.push(now);
    if(entry.times.length>=3){entry.until=now+30*60*1000;entry.times=[];}
    all[key]=entry;await this.state.storage.put("abandonments",all);
  }
  async handle(request) {
    const url=new URL(request.url);
    if(request.method==="GET"&&url.pathname==="/list")return json(await this.listRooms());
    if(request.method==="POST"&&url.pathname==="/abandon"){
      const body=await readJson(request);if(!body)return json({error:"Pedido inválido"},400);
      await this.abandon(body.uid);return json({ok:true});
    }
    if(request.method==="POST"&&url.pathname==="/check"){
      const body=await readJson(request);if(!body)return json({error:"Pedido inválido"},400);
      const uid=Number(body.uid);
      if(!Number.isSafeInteger(uid)||uid<1)return json({blocked:false,aviso:""});
      const all=(await this.state.storage.get("abandonments"))||{},entry=all[String(uid)]||{times:[],until:0},now=Date.now();
      entry.times=(entry.times||[]).filter(time=>now-time<864e5);
      if(entry.until>now){
        const until=new Date(entry.until).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit",timeZone:"America/Argentina/Buenos_Aires"});
        return json({blocked:true,error:"Estás bloqueado por abandonos reiterados hasta las "+until+". Podés volver a jugar entonces."});
      }
      await this.state.storage.put("abandonments",all);
      return json({blocked:false,aviso:entry.times.length>=2?"Aviso: ya abandonaste 2 partidas en las últimas 24 h. Al tercer abandono no vas a poder entrar a salas públicas ni a partida aleatoria durante 30 minutos.":""});
    }
    if(request.method!=="POST"||url.pathname!=="/api")return json({error:"Ruta no disponible"},404);
    const body=await readJson(request);if(!body||typeof body!=="object")return json({error:"Pedido inválido"},400);
    const op=String(body.op||""),pid=String(body.pid||"").slice(0,40),uid=Number(body.uid);
    if(!pid)return json({error:"Falta id"},400);
    const account=Number.isSafeInteger(uid)&&uid>0?String(uid):"";
    const all=(await this.state.storage.get("abandonments"))||{};
    const penalty=account?(all[account]||{times:[],until:0}):{times:[],until:0};
    penalty.times=(penalty.times||[]).filter(time=>Date.now()-time<864e5);
    if(["create","play","take"].includes(op)&&penalty.until>Date.now()){
      const until=new Date(penalty.until).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit",timeZone:"America/Argentina/Buenos_Aires"});
      return json({error:"Estás bloqueado por abandonos reiterados hasta las "+until+". Podés volver a jugar entonces."},403);
    }
    const codes=await this.roomCodes();
    if(["create","play"].includes(op)){
      for(const code of codes){
        const existing=await this.roomFetch(code,"public-player","GET",null,"?pid="+encodeURIComponent(pid));
        if((await existing.json()).ok)return json({room:code});
      }
    }
    let code=String(body.room||"").toLowerCase();
    if(op==="create"){
      if(codes.length>=60)return json({error:"Servidor lleno"},400);
      const alphabet="0123456789abcdefghijklmnopqrstuvwxyz";
      const bytes=new Uint8Array(5);crypto.getRandomValues(bytes);
      code="pub"+Array.from(bytes,value=>alphabet[value%alphabet.length]).join("");
      while(codes.includes(code)){crypto.getRandomValues(bytes);code="pub"+Array.from(bytes,value=>alphabet[value%alphabet.length]).join("");}
    }else if(!/^[a-z0-9]{3,12}$/.test(code)||!codes.includes(code)){
      return json({error:"Esa sala ya no existe o se cerró"},404);
    }
    const response=await this.roomFetch(code,"public","POST",{...body,pid,room:code});
    const result=await response.json();
    if(op==="create"&&response.ok&&result.room===code){
      const latest=await this.roomCodes();if(!latest.includes(code))await this.state.storage.put("public-room-codes",[...latest,code]);
    }
    if(result.room&&response.ok&&account&&penalty.times.length===2&&["create","play","take"].includes(op)){
      result.aviso="Aviso: ya abandonaste 2 partidas en las últimas 24 h. Al tercer abandono no vas a poder entrar a salas públicas ni a partida aleatoria durante 30 minutos.";
    }
    return json(result,response.status);
  }
}

export class RoomCoordinator {
  constructor(state, env) {
    applyServer2d(env);
    this.state = state;
    this.env = env;
    this.loadedCode = null;
    this.clients = new Map();
    this.queue = Promise.resolve();
  }

  installCallbacks() {
    Engine.CFG.onCareer = records => {
      const pending = Careers.addCareers(this.env, records).catch(error => {
        console.error("Career persistence failed:", error?.message || error);
      });
      if (this.state.waitUntil) this.state.waitUntil(pending);
      return pending;
    };
    Engine.CFG.onTitle = record => Careers.addTitle(this.env, record);
    Engine.CFG.onAbandon = (uid, room) => {
      if (!this.env.LOBBY) return;
      const id = this.env.LOBBY.idFromName("global");
      const pending = this.env.LOBBY.get(id).fetch(new Request("https://lobby.internal/abandon", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ uid, room })
      }));
      if (this.state.waitUntil) this.state.waitUntil(pending);
      return pending;
    };
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
      if (this.state.storage.setAlarm) {
        const spd = Math.max(0.5, Math.min(5, Number(Engine.rooms[code] && Engine.rooms[code].spd) || 1));
        await this.state.storage.setAlarm(Date.now() + Math.max(250, Math.round(1000 / spd)));
      }
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
    const match = url.pathname.match(/^\/room\/([a-z0-9]{3,12})\/(act|ev|state|session|public|public-list|public-player)$/i);
    if (!match) return json({ error: "Ruta no disponible" }, 404);
    const code = match[1].toLowerCase();
    const action = match[2];
    await this.load(code);
    this.installCallbacks();

    if (action === "public-list" && request.method === "GET") {
      return json(Engine.pubList().filter(room => room.code === code));
    }
    if (action === "public-player" && request.method === "GET") {
      const pid = String(url.searchParams.get("pid") || "").slice(0, 40);
      const room = Engine.rooms[code];
      const active = room && room.pub && !room.closed && room.phase !== "end"
        && (room.phase !== "pick" || Date.now() < room.pub.closeAt);
      return json({ ok: !!active && !!room.pl[pid] && !room.pl[pid].ai });
    }
    if (action === "public" && request.method === "POST") {
      const body = await readJson(request);
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      if (String(body.room || "").toLowerCase() !== code) return json({ error: "La sala no coincide" }, 400);
      const result = Engine.pubApi(body);
      await this.persist(code);
      return json(result, result.error ? 400 : 200);
    }

    if (action === "act" && request.method === "POST") {
      const body = await readJson(request);
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      if (String(body.room || "").toLowerCase() !== code) return json({ error: "La sala no coincide" }, 400);
      // Only the outer Worker can set this internal header after validating a session in Neon.
      const { uid: clientUid, tok: clientToken, ...safeBody } = body;
      const trustedUid = Number(request.headers.get("x-clash-auth-user-id"));
      const action = { ...safeBody, room: code };
      if (Number.isSafeInteger(trustedUid) && trustedUid > 0) action.uid = trustedUid;
      const error = Engine.act(action);
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
    this.installCallbacks();
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

    // La velocidad del marcador (x0.5..x5) la fija el anfitrión: el reloj corre `spd` ticks por segundo real.
    const spd = Math.max(0.5, Math.min(5, Number(room.spd) || 1)), now = Date.now();
    const elapsed = Math.max(0, Math.min(5000, now - (room.lastTickAt || now - 1000)));
    room.lastTickAt = now;
    room.tickAcc = (room.tickAcc || 0) + elapsed * spd / 1000;
    const nTicks = Math.max(1, Math.min(8, Math.floor(room.tickAcc + 1e-6)));
    room.tickAcc = Math.max(0, room.tickAcc - nTicks);
    for (let i = 0; i < nTicks; i++) Engine.tickRoom(code);
    await this.persist(code);
    for (const client of this.clients.values()) {
      try { client.controller.enqueue(new TextEncoder().encode(":ping\n\n")); }
      catch { /* A canceled stream is removed by its cancel handler. */ }
    }
  }
}


export class RandomCoordinator {
  constructor(state, env) {
    applyServer2d(env);
    this.state = state;
    this.env = env;
    this.loaded = false;
    this.clients = new Map();
    this.queue = Promise.resolve();
  }

  installCallbacks() {
    Engine.CFG.onCareer = records => {
      const pending = Careers.addCareers(this.env, records).catch(error => console.error("Career persistence failed:", error?.message || error));
      if (this.state.waitUntil) this.state.waitUntil(pending);
      return pending;
    };
    Engine.CFG.onTitle = record => Careers.addTitle(this.env, record);
    Engine.CFG.onAbandon = (uid, room) => {
      if (!this.env.LOBBY) return;
      const pending = this.env.LOBBY.get(this.env.LOBBY.idFromName("global")).fetch(new Request("https://lobby.internal/abandon", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ uid, room })
      }));
      if (this.state.waitUntil) this.state.waitUntil(pending);
      return pending;
    };
  }

  fetch(request) {
    const run = this.queue.then(() => this.handle(request));
    this.queue = run.catch(() => {});
    return run;
  }

  async loadAll() {
    if (this.loaded) return;
    const entries = await this.state.storage.list({ prefix: "random-room:" });
    for (const [key, snapshot] of entries) {
      const code = key.slice("random-room:".length);
      if (snapshot) Engine.loadRoom(code, snapshot);
    }
    Engine.setRandomQueueCode(await this.state.storage.get("random-queue-code"));
    this.loaded = true;
  }

  async persistAll() {
    const codes = Object.values(Engine.rooms).filter(room => room.rand).map(room => room.code);
    const keep = new Set(codes);
    const entries = await this.state.storage.list({ prefix: "random-room:" });
    for (const key of entries.keys()) {
      const code = key.slice("random-room:".length);
      if (!keep.has(code)) await this.state.storage.delete(key);
    }
    for (const code of codes) {
      const snapshot = Engine.saveRoom(code);
      if (snapshot) await this.state.storage.put("random-room:" + code, snapshot);
    }
    await this.state.storage.put("random-queue-code", Engine.randomQueueCode());
    if (this.state.storage.setAlarm && codes.length) await this.state.storage.setAlarm(Date.now() + 1000);
    else if (!codes.length && this.state.storage.deleteAlarm) await this.state.storage.deleteAlarm();
  }

  async handle(request) {
    await this.loadAll();
    this.installCallbacks();
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/join") {
      const body = await readJson(request);
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      const trustedUid = Number(request.headers.get("x-clash-auth-user-id"));
      const { uid: ignoredUid, tok: ignoredToken, ...safeBody } = body;
      if (Number.isSafeInteger(trustedUid) && trustedUid > 0) {
        const pid = String(safeBody.pid || "").slice(0, 40);
        const alreadyInThisRandomMatch = Object.values(Engine.rooms).some(room =>
          room.rand && room.phase !== "end" && !!room.pl[pid]
        );
        // A block prevents entering another match, but never prevents reconnecting
        // to the player's own active random match (legacy server behavior).
        if (!alreadyInThisRandomMatch) {
          const lobby = this.env.LOBBY && this.env.LOBBY.get(this.env.LOBBY.idFromName("global"));
          if (lobby) {
            const checked = await lobby.fetch(new Request("https://lobby.internal/check", {
              method: "POST", headers: { "content-type": "application/json" },
              body: JSON.stringify({ uid: trustedUid })
            }));
            const status = await checked.json();
            if (status.blocked) return json({ error: status.error }, 403);
            if (status.aviso) safeBody.aviso = status.aviso;
          }
        }
        safeBody.uid = trustedUid;
      }
      const result = Engine.rJoin(safeBody);
      if (safeBody.aviso && !result.error) result.aviso = safeBody.aviso;
      await this.persistAll();
      return json(result, result.error ? 400 : 200);
    }

    const match = url.pathname.match(/^\/room\/(rnd[a-z0-9]{5,9})\/(act|ev|session)$/i);
    if (!match) return json({ error: "Ruta no disponible" }, 404);
    const code = match[1].toLowerCase();
    const action = match[2];
    if (!Engine.rooms[code]) return json({ error: "Sala inexistente" }, 404);

    if (action === "act" && request.method === "POST") {
      const body = await readJson(request);
      if (!body || typeof body !== "object") return json({ error: "Pedido inválido" }, 400);
      if (String(body.room || "").toLowerCase() !== code) return json({ error: "La sala no coincide" }, 400);
      const { uid: ignoredUid, tok: ignoredToken, ...safeBody } = body;
      const trustedUid = Number(request.headers.get("x-clash-auth-user-id"));
      const actionBody = { ...safeBody, room: code };
      if (Number.isSafeInteger(trustedUid) && trustedUid > 0) actionBody.uid = trustedUid;
      const error = Engine.act(actionBody);
      await this.persistAll();
      return error ? json({ error }, 400) : json({ ok: true });
    }

    if (action === "session" && request.method === "GET") {
      const pid = String(url.searchParams.get("pid") || "").slice(0, 40);
      const room = Engine.rooms[code];
      const player = room && !room.offline && pid && (room.pl[pid] || (room.spec && room.spec[pid]));
      return json({ ok: !!player && !(player.ai && !player.nm0) });
    }

    if (action === "ev" && request.method === "GET") {
      const pid = String(url.searchParams.get("pid") || "").slice(0, 40);
      if (!pid) return json({ error: "Falta id de jugador" }, 400);
      let client;
      const stream = new ReadableStream({
        start: controller => {
          client = { controller };
          const key = code + ":" + pid;
          this.clients.set(key, client);
          const send = url.searchParams.get("v") === "2"
            ? deltaSender(controller)
            : value => controller.enqueue(new TextEncoder().encode("data:" + JSON.stringify(value) + "\n\n"));
          controller.enqueue(new TextEncoder().encode("retry:2000\n\n"));
          const connected = Engine.listen(code, pid, value => {
            try { send(value); } catch { this.clients.delete(key); }
          });
          if (!connected) { this.clients.delete(key); controller.close(); }
        },
        cancel: () => {
          const key = code + ":" + pid;
          if (this.clients.get(key) === client) {
            this.clients.delete(key);
            Engine.listen(code, pid, null);
          }
        }
      });
      return new Response(stream, { headers: {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        "x-accel-buffering": "no"
      }});
    }
    return json({ error: "Método no disponible" }, 405);
  }

  alarm() {
    const run = this.queue.then(() => this.handleAlarm());
    this.queue = run.catch(() => {});
    return run;
  }

  async handleAlarm() {
    await this.loadAll();
    this.installCallbacks();
    const codes = Object.values(Engine.rooms).filter(room => room.rand).map(room => room.code);
    for (const code of codes) {
      const room = Engine.rooms[code];
      const idle = Date.now() - (room.touched || Date.now()) > 60 * 60 * 1000;
      const connected = room.order.some(pid => room.pl[pid] && room.pl[pid].cb);
      if (idle && !connected) Engine.removeRoom(code);
      else Engine.tickRoom(code);
    }
    await this.persistAll();
    for (const client of this.clients.values()) {
      try { client.controller.enqueue(new TextEncoder().encode(":ping\n\n")); } catch {}
    }
  }
}
