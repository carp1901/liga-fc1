import test from "node:test";
import assert from "node:assert/strict";
import worker, { RoomCoordinator, ChatHub, LobbyCoordinator, RandomCoordinator } from "../src/worker.mjs";
import Data from "../public/data.js";
import { addCareers, addTitle, offlineTitleRecord, rankRows, pointsForCareer, rankingCoaches, rankingFans } from "../src/careers.mjs";

class MemoryStorage {
  data = new Map();
  alarm = null;
  async get(key) { return this.data.get(key); }
  async put(key, value) { this.data.set(key, structuredClone(value)); }
  async delete(key) { return this.data.delete(key); }
  async list(options = {}) { return new Map([...this.data.entries()].filter(([key]) => !options.prefix || key.startsWith(options.prefix))); }
  async setAlarm(value) { this.alarm = value; }
  async deleteAlarm() { this.alarm = null; }
}

function mockEnv() {
  const objects = new Map();
  const storages = new Map();
  const lobbyObjects = new Map();
  const lobbyStorages = new Map();
  const randomObjects = new Map();
  const randomStorages = new Map();
  const env = {};
  env.ROOMS = {
    idFromName: name => name,
    get: id => {
      if (!objects.has(id)) {
        const storage = new MemoryStorage();
        storages.set(id, storage);
        const instance = new RoomCoordinator({ storage }, env);
        objects.set(id, { fetch: req => instance.fetch(req), instance });
      }
      return objects.get(id);
    }
  };
  env.RANDOM = {
    idFromName: name => name,
    get: id => {
      if (!randomObjects.has(id)) {
        const storage = new MemoryStorage();
        randomStorages.set(id, storage);
        const instance = new RandomCoordinator({ storage }, env);
        randomObjects.set(id, { fetch: req => instance.fetch(req), instance });
      }
      return randomObjects.get(id);
    }
  };
  env.LOBBY = {
    idFromName: name => name,
    get: id => {
      if (!lobbyObjects.has(id)) {
        const storage = new MemoryStorage();
        lobbyStorages.set(id, storage);
        const instance = new LobbyCoordinator({ storage }, env);
        lobbyObjects.set(id, { fetch: req => instance.fetch(req), instance });
      }
      return lobbyObjects.get(id);
    }
  };
  return { env, storages, lobbyStorages, randomStorages };
}

const post = (url, body) => new Request(url, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body)
});

test("Worker health endpoint reports the integrated room runtime", async () => {
  const { env } = mockEnv();
  const response = await worker.fetch(new Request("https://game.test/health"), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true, platform: "cloudflare-workers", phase: "single-room-runtime", engine: "integrated"
  });
});

test("online engine creates a room inside its Durable Object and persists it", async () => {
  const { env, storages } = mockEnv();
  const create = await worker.fetch(post("https://game.test/act", {
    a: "create", room: "testroom", pid: "player1", name: "DT",
    cfg: { div: "ar1", fmt: "liga1", n: 8 }
  }), env);

  assert.equal(create.status, 200);
  assert.deepEqual(await create.json(), { ok: true });
  assert.ok(storages.get("testroom").alarm);

  const state = await worker.fetch(new Request(
    "https://game.test/__cf/rooms/state?room=testroom"
  ), env);
  assert.equal(state.status, 200);
  const data = await state.json();
  assert.equal(data.snapshot.code, "testroom");
  assert.equal(data.snapshot.phase, "pick");
  assert.deepEqual(data.snapshot.order, ["player1"]);
});


test("player actions use the original engine and survive persistence", async () => {
  const { env } = mockEnv();
  const room = "pickroom";
  const team = Data.DIVS.find(div => div.id === "ar1").teams[0].id;

  const create = await worker.fetch(post("https://game.test/act", {
    a: "create", room, pid: "player1", name: "DT",
    cfg: { div: "ar1", fmt: "liga1", n: 8 }
  }), env);
  assert.equal(create.status, 200);

  const pick = await worker.fetch(post("https://game.test/act", {
    a: "pick", room, pid: "player1", team
  }), env);
  assert.equal(pick.status, 200);

  const state = await worker.fetch(new Request(
    "https://game.test/__cf/rooms/state?room=" + room
  ), env);
  const data = await state.json();
  assert.equal(data.snapshot.pl.player1.team, team);
  assert.equal(data.snapshot.phase, "pick");
});

test("room state survives recreation of the Durable Object instance", async () => {
  const { env, storages } = mockEnv();
  await worker.fetch(post("https://game.test/act", {
    a: "create", room: "persist1", pid: "player1", name: "DT",
    cfg: { div: "ar1", fmt: "liga1", n: 8 }
  }), env);

  const restarted = new RoomCoordinator({ storage: storages.get("persist1") }, {});
  const state = await restarted.fetch(new Request("https://game.test/room/persist1/state"));
  assert.equal(state.status, 200);
  const data = await state.json();
  assert.equal(data.snapshot.phase, "pick");
  assert.deepEqual(data.snapshot.order, ["player1"]);
});

test("client-supplied account IDs are stripped before the engine receives actions", async () => {
  const { env } = mockEnv();
  const response = await worker.fetch(new Request("https://game.test/act", {
    method: "POST",
    headers: { "content-type": "application/json", "x-clash-auth-user-id": "999999" },
    body: JSON.stringify({
      a: "create", room: "secure1", pid: "player1", uid: 999999, name: "DT",
      cfg: { div: "ar1", fmt: "liga1", n: 8 }
    })
  }), env);
  assert.equal(response.status, 200);

  const state = await worker.fetch(new Request(
    "https://game.test/__cf/rooms/state?room=secure1"
  ), env);
  const data = await state.json();
  assert.equal(data.snapshot.pl.player1.uid, undefined);
});


test("session recovery and SSE preserve the frontend delta protocol", async () => {
  const { env } = mockEnv();
  const room = "stream01";
  const create = await worker.fetch(post("https://game.test/act", {
    a: "create", room, pid: "player1", name: "DT",
    cfg: { div: "ar1", fmt: "liga1", n: 8 }
  }), env);
  assert.equal(create.status, 200);

  const session = await worker.fetch(new Request(
    "https://game.test/api/sesion?room=" + room + "&pid=player1"
  ), env);
  assert.deepEqual(await session.json(), { ok: true });

  const stream = await worker.fetch(new Request(
    "https://game.test/ev?room=" + room + "&pid=player1&v=2"
  ), env);
  assert.equal(stream.status, 200);
  assert.match(stream.headers.get("content-type"), /text\/event-stream/);
  const reader = stream.body.getReader();
  let wire = "";
  while (!wire.includes("data:")) {
    const part = await reader.read();
    assert.equal(part.done, false);
    wire += new TextDecoder().decode(part.value);
  }
  const payload = wire.slice(wire.indexOf("data:") + 5).split("\n")[0];
  const event = JSON.parse(payload);
  assert.equal(event.__cf, "full");
  assert.equal(event.v.code, room);
  await reader.cancel();
});

test("teams.json remains available from the bundled game data", async () => {
  const { env } = mockEnv();
  const response = await worker.fetch(new Request("https://game.test/teams.json"), env);
  assert.equal(response.status, 200);
  const divisions = await response.json();
  assert.ok(divisions.some(div => div.id === "ar1"));
});


test("CORS allows only the configured Pages origin", async () => {
  const { env } = mockEnv();
  env.FRONTEND_ORIGINS = "https://clash-futbol.pages.dev";
  const allowed = await worker.fetch(new Request("https://game.test/health", {
    headers: { origin: "https://clash-futbol.pages.dev" }
  }), env);
  assert.equal(allowed.status, 200);
  assert.equal(allowed.headers.get("access-control-allow-origin"), "https://clash-futbol.pages.dev");

  const preflight = await worker.fetch(new Request("https://game.test/act", {
    method: "OPTIONS", headers: { origin: "https://clash-futbol.pages.dev" }
  }), env);
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get("access-control-allow-headers"), /Authorization/);

  const blocked = await worker.fetch(new Request("https://game.test/health", {
    headers: { origin: "https://evil.example" }
  }), env);
  assert.equal(blocked.status, 403);
});

test("invalid room IDs are rejected before reaching Durable Objects", async () => {
  const { env } = mockEnv();
  const response = await worker.fetch(post("https://game.test/act", {
    a: "create", room: "../bad", pid: "player1", cfg: {}
  }), env);
  assert.equal(response.status, 400);
});

test("malformed actions and missing rooms return controlled errors", async () => {
  const { env } = mockEnv();
  const malformed = await worker.fetch(new Request("https://game.test/act", {
    method: "POST", headers: { "content-type": "application/json" }, body: "{"
  }), env);
  assert.equal(malformed.status, 400);

  const missing = await worker.fetch(new Request(
    "https://game.test/ev?room=missing1&pid=player1"
  ), env);
  assert.equal(missing.status, 404);
});


function mockAuthDatabase() {
  const users = [];
  const sessions = [];
  let nextId = 1;
  const env = {
    __DB_QUERY__: async (statement, params) => {
      if (statement.startsWith("INSERT INTO usuarios")) {
        const [usuario, usuario_lc, pass_hash] = params;
        if (users.some(user => user.usuario_lc === usuario_lc)) return { rows: [], rowCount: 0 };
        const user = { id: nextId++, usuario, usuario_lc, pass_hash };
        users.push(user);
        return { rows: [{ id: user.id, usuario: user.usuario }], rowCount: 1 };
      }
      if (statement.startsWith("INSERT INTO sesiones")) {
        const [token_hash, usuario_id, vence] = params;
        sessions.push({ token_hash, usuario_id, vence });
        return { rows: [], rowCount: 1 };
      }
      if (statement.startsWith("SELECT id, usuario, pass_hash FROM usuarios")) {
        const user = users.find(item => item.usuario_lc === params[0]);
        return { rows: user ? [{ id: user.id, usuario: user.usuario, pass_hash: user.pass_hash }] : [], rowCount: user ? 1 : 0 };
      }
      if (statement.startsWith("UPDATE usuarios SET ultimo_ingreso")) return { rows: [], rowCount: 1 };
      if (statement.startsWith("DELETE FROM sesiones WHERE vence<now()")) return { rows: [], rowCount: 0 };
      if (statement.startsWith("SELECT u.id, u.usuario FROM sesiones")) {
        const session = sessions.find(item => item.token_hash === params[0] && Date.parse(item.vence) > Date.now());
        const user = session && users.find(item => item.id === session.usuario_id);
        return { rows: user ? [{ id: user.id, usuario: user.usuario }] : [], rowCount: user ? 1 : 0 };
      }
      if (statement.startsWith("DELETE FROM sesiones WHERE token_hash")) {
        const index = sessions.findIndex(item => item.token_hash === params[0]);
        if (index >= 0) sessions.splice(index, 1);
        return { rows: [], rowCount: index >= 0 ? 1 : 0 };
      }
      throw new Error("Unexpected SQL in auth test: " + statement);
    }
  };
  return { env, users, sessions };
}

test("account registration, login, token validation and logout use Neon-backed auth", async () => {
  const { env, users, sessions } = mockAuthDatabase();
  const registerResponse = await worker.fetch(post("https://game.test/api/auth/registro", {
    usuario: "Tecnico01", clave: "clave-segura-123"
  }), env);
  assert.equal(registerResponse.status, 200);
  const registered = await registerResponse.json();
  assert.equal(registered.usuario, "Tecnico01");
  assert.equal(typeof registered.token, "string");
  assert.equal(users.length, 1);
  assert.match(users[0].pass_hash, /^pbkdf2\$120000\$/);
  assert.notEqual(users[0].pass_hash, "clave-segura-123");
  assert.equal(sessions.length, 1);

  const duplicate = await worker.fetch(post("https://game.test/api/auth/registro", {
    usuario: "tecnico01", clave: "otra-clave-123"
  }), env);
  assert.equal(duplicate.status, 400);

  const me = await worker.fetch(new Request("https://game.test/api/auth/yo", {
    headers: { authorization: "Bearer " + registered.token }
  }), env);
  assert.equal(me.status, 200);
  assert.deepEqual(await me.json(), { usuario: "Tecnico01" });

  const loginResponse = await worker.fetch(post("https://game.test/api/auth/login", {
    usuario: "TECNICO01", clave: "clave-segura-123"
  }), env);
  assert.equal(loginResponse.status, 200);
  const loggedIn = await loginResponse.json();
  assert.equal(loggedIn.usuario, "Tecnico01");
  assert.notEqual(loggedIn.token, registered.token);

  const logout = await worker.fetch(post("https://game.test/api/auth/logout", {
    tok: loggedIn.token
  }), env);
  assert.equal(logout.status, 200);
  assert.deepEqual(await logout.json(), { ok: 1 });

  const invalid = await worker.fetch(new Request("https://game.test/api/auth/yo", {
    headers: { authorization: "Bearer " + loggedIn.token }
  }), env);
  assert.equal(invalid.status, 401);
});


test("Neon health endpoint checks the configured database adapter", async () => {
  const calls = [];
  const env = {
    __DB_QUERY__: async (statement, params) => {
      calls.push({ statement, params });
      return { rows: [{ ok: 1 }], rowCount: 1 };
    }
  };
  const response = await worker.fetch(new Request("https://game.test/api/db/health"), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, database: "connected", value: 1 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].statement, "SELECT 1 AS ok");
});


test("only a validated Neon session can attribute an account to an online player", async () => {
  const { env } = mockAuthDatabase();
  env.ROOMS = mockEnv().env.ROOMS;
  const registerResponse = await worker.fetch(post("https://game.test/api/auth/registro", {
    usuario: "CuentaReal", clave: "clave-segura-456"
  }), env);
  assert.equal(registerResponse.status, 200);
  const account = await registerResponse.json();

  const response = await worker.fetch(new Request("https://game.test/act", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + account.token,
      "x-clash-auth-user-id": "999999"
    },
    body: JSON.stringify({
      a: "create", room: "authroom", pid: "player1", uid: 888888,
      name: "DT", cfg: { div: "ar1", fmt: "liga1", n: 8 }
    })
  }), env);
  assert.equal(response.status, 200);

  const state = await worker.fetch(new Request(
    "https://game.test/__cf/rooms/state?room=authroom"
  ), env);
  const snapshot = (await state.json()).snapshot;
  assert.equal(snapshot.pl.player1.uid, 1);
  assert.notEqual(snapshot.pl.player1.uid, 888888);
  assert.notEqual(snapshot.pl.player1.uid, 999999);
});


function mockSocialDatabase() {
  const users = [];
  const sessions = [];
  const profiles = new Map();
  const friendships = [];
  let nextUserId = 1;
  let nextFriendId = 1;
  const env = {
    __DB_QUERY__: async (sql, params) => {
      if (sql.startsWith("INSERT INTO usuarios")) {
        const [usuario, usuario_lc, pass_hash] = params;
        if (users.some(user => user.usuario_lc === usuario_lc)) return { rows: [], rowCount: 0 };
        const user = { id: nextUserId++, usuario, usuario_lc, pass_hash, creado: "2026-01-01T00:00:00Z" };
        users.push(user);
        return { rows: [{ id: user.id, usuario: user.usuario }], rowCount: 1 };
      }
      if (sql.startsWith("INSERT INTO sesiones")) {
        const [token_hash, usuario_id, vence] = params;
        sessions.push({ token_hash, usuario_id, vence });
        return { rows: [], rowCount: 1 };
      }
      if (sql.startsWith("SELECT id, usuario, pass_hash FROM usuarios")) {
        const user = users.find(item => item.usuario_lc === params[0]);
        return { rows: user ? [{ id: user.id, usuario: user.usuario, pass_hash: user.pass_hash }] : [], rowCount: user ? 1 : 0 };
      }
      if (sql.startsWith("UPDATE usuarios SET ultimo_ingreso") || sql.startsWith("DELETE FROM sesiones WHERE vence<now()")) {
        return { rows: [], rowCount: 1 };
      }
      if (sql.startsWith("SELECT u.id, u.usuario FROM sesiones")) {
        const session = sessions.find(item => item.token_hash === params[0] && Date.parse(item.vence) > Date.now());
        const user = session && users.find(item => item.id === session.usuario_id);
        return { rows: user ? [{ id: user.id, usuario: user.usuario }] : [], rowCount: user ? 1 : 0 };
      }
      if (sql.startsWith("DELETE FROM sesiones WHERE token_hash")) {
        const index = sessions.findIndex(item => item.token_hash === params[0]);
        if (index >= 0) sessions.splice(index, 1);
        return { rows: [], rowCount: index >= 0 ? 1 : 0 };
      }
      if (sql.startsWith("SELECT usuario,creado FROM usuarios WHERE id=")) {
        const user = users.find(item => item.id === Number(params[0]));
        return { rows: user ? [{ usuario: user.usuario, creado: user.creado }] : [], rowCount: user ? 1 : 0 };
      }
      if (sql.startsWith("SELECT club_favorito,descripcion FROM perfiles")) {
        const profile = profiles.get(Number(params[0]));
        return { rows: profile ? [{ club_favorito: profile.club_favorito, descripcion: profile.descripcion }] : [], rowCount: profile ? 1 : 0 };
      }
      if (sql.startsWith("INSERT INTO perfiles")) {
        const [uid, club] = params;
        if (profiles.has(Number(uid))) return { rows: [], rowCount: 0 };
        profiles.set(Number(uid), { club_favorito: club, descripcion: "" });
        return { rows: [{ club_favorito: club }], rowCount: 1 };
      }
      if (sql.startsWith("SELECT club_favorito FROM perfiles")) {
        const profile = profiles.get(Number(params[0]));
        return { rows: profile ? [{ club_favorito: profile.club_favorito }] : [], rowCount: profile ? 1 : 0 };
      }
      if (sql.startsWith("SELECT count(*)::int AS carreras")) {
        return { rows: [{ carreras: 0, campeonatos: 0, online: 0, clubes: 0 }], rowCount: 1 };
      }
      if (sql.startsWith("SELECT torneo_id,club,club_nombre")) return { rows: [], rowCount: 0 };
      if (sql.startsWith("SELECT u.id,u.usuario,u.creado,p.club_favorito,p.descripcion")) {
        const user = users.find(item => item.usuario_lc === params[0]);
        if (!user) return { rows: [], rowCount: 0 };
        const profile = profiles.get(user.id);
        return { rows: [{
          id: user.id, usuario: user.usuario, creado: user.creado,
          club_favorito: profile?.club_favorito || null, descripcion: profile?.descripcion || ""
        }], rowCount: 1 };
      }
      if (sql.startsWith("SELECT u.usuario,p.club_favorito,c.torneo_id")) return { rows: [], rowCount: 0 };
      if (sql.startsWith("SELECT club,club_nombre,competicion_nombre")) return { rows: [], rowCount: 0 };
      if (sql.startsWith("SELECT count(*)::int AS n FROM amistades WHERE de_id=")) {
        const count = friendships.filter(item => item.de_id === Number(params[0]) && item.estado === "pendiente").length;
        return { rows: [{ n: count }], rowCount: 1 };
      }
      if (sql.startsWith("SELECT count(*)::int AS n FROM amistades WHERE (de_id=")) {
        const uid = Number(params[0]);
        const count = friendships.filter(item => (item.de_id === uid || item.a_id === uid) && item.estado === "aceptada").length;
        return { rows: [{ n: count }], rowCount: 1 };
      }
      if (sql.startsWith("SELECT id,usuario FROM usuarios WHERE usuario_lc=")) {
        const user = users.find(item => item.usuario_lc === params[0]);
        return { rows: user ? [{ id: user.id, usuario: user.usuario }] : [], rowCount: user ? 1 : 0 };
      }
      if (sql.startsWith("SELECT id,de_id,a_id,estado FROM amistades")) {
        const [a, b] = params.map(Number);
        const row = friendships.find(item => (item.de_id === a && item.a_id === b) || (item.de_id === b && item.a_id === a));
        return { rows: row ? [{ id: row.id, de_id: row.de_id, a_id: row.a_id, estado: row.estado }] : [], rowCount: row ? 1 : 0 };
      }
      if (sql.startsWith("INSERT INTO amistades")) {
        const [from, to] = params.map(Number);
        if (friendships.some(item => (item.de_id === from && item.a_id === to) || (item.de_id === to && item.a_id === from))) return { rows: [], rowCount: 0 };
        const row = { id: nextFriendId++, de_id: from, a_id: to, estado: "pendiente", creada: "2026-01-02T00:00:00Z", aceptada: null };
        friendships.push(row);
        return { rows: [{ id: row.id }], rowCount: 1 };
      }
      if (sql.startsWith("SELECT a.id,a.de_id,a.a_id")) {
        const uid = Number(params[0]);
        const rows = friendships.filter(item => item.de_id === uid || item.a_id === uid).map(item => ({
          ...item,
          de_usuario: users.find(user => user.id === item.de_id)?.usuario,
          a_usuario: users.find(user => user.id === item.a_id)?.usuario
        }));
        return { rows, rowCount: rows.length };
      }
      if (sql.startsWith("SELECT de_id FROM amistades WHERE id=")) {
        const [id, uid] = params.map(Number);
        const row = friendships.find(item => item.id === id && item.a_id === uid && item.estado === "pendiente");
        return { rows: row ? [{ de_id: row.de_id }] : [], rowCount: row ? 1 : 0 };
      }
      if (sql.startsWith("UPDATE amistades SET estado='aceptada'")) {
        const [id, uid] = params.map(Number);
        const row = friendships.find(item => item.id === id && item.a_id === uid && item.estado === "pendiente");
        if (!row) return { rows: [], rowCount: 0 };
        row.estado = "aceptada";
        row.aceptada = "2026-01-03T00:00:00Z";
        return { rows: [{ id }], rowCount: 1 };
      }
      if (sql.startsWith("DELETE FROM amistades WHERE id=")) {
        const [id, uid] = params.map(Number);
        const index = friendships.findIndex(item => item.id === id && (sql.includes("de_id=$2") ? item.de_id === uid : item.a_id === uid) && item.estado === "pendiente");
        if (index < 0) return { rows: [], rowCount: 0 };
        const [deleted] = friendships.splice(index, 1);
        return { rows: [{ id: deleted.id }], rowCount: 1 };
      }
      if (sql.startsWith("DELETE FROM amistades WHERE estado='aceptada'")) {
        const [a, b] = params.map(Number);
        const index = friendships.findIndex(item => item.estado === "aceptada" &&
          ((item.de_id === a && item.a_id === b) || (item.de_id === b && item.a_id === a)));
        if (index < 0) return { rows: [], rowCount: 0 };
        const [deleted] = friendships.splice(index, 1);
        return { rows: [{ id: deleted.id }], rowCount: 1 };
      }
      throw new Error("Unexpected SQL in social test: " + sql);
    }
  };
  return { env, users, profiles, friendships };
}

async function createAccount(env, username) {
  const response = await worker.fetch(post("https://game.test/api/auth/registro", {
    usuario: username, clave: "clave-segura-123"
  }), env);
  assert.equal(response.status, 200);
  return response.json();
}

test("profile endpoint and favorite club preserve one-time selection", async () => {
  const { env, profiles } = mockSocialDatabase();
  const account = await createAccount(env, "PerfilUno");
  const headers = { authorization: "Bearer " + account.token, "content-type": "application/json" };

  const profile = await worker.fetch(new Request("https://game.test/api/auth/perfil", { headers }), env);
  assert.equal(profile.status, 200);
  const initial = await profile.json();
  assert.equal(initial.usuario, "PerfilUno");
  assert.equal(initial.perfilCompleto, false);
  assert.equal(initial.clubFavorito, null);

  const favorite = await worker.fetch(new Request("https://game.test/api/auth/favorito", {
    method: "POST", headers, body: JSON.stringify({ club: "boca" })
  }), env);
  assert.equal(favorite.status, 200);
  assert.deepEqual(await favorite.json(), { ok: 1, clubFavorito: "boca" });
  assert.equal(profiles.get(1).club_favorito, "boca");

  const secondChoice = await worker.fetch(new Request("https://game.test/api/auth/favorito", {
    method: "POST", headers, body: JSON.stringify({ club: "river" })
  }), env);
  assert.equal(secondChoice.status, 409);
  assert.equal((await secondChoice.json()).clubFavorito, "boca");

  const invalidClub = await worker.fetch(new Request("https://game.test/api/auth/favorito", {
    method: "POST", headers, body: JSON.stringify({ club: "not-a-club" })
  }), env);
  assert.equal(invalidClub.status, 400);
});

test("friends API supports request, receive, accept, list and remove", async () => {
  const { env, friendships } = mockSocialDatabase();
  const alice = await createAccount(env, "TecnicoA");
  const bob = await createAccount(env, "TecnicoB");
  const auth = token => ({ authorization: "Bearer " + token, "content-type": "application/json" });

  const sent = await worker.fetch(new Request("https://game.test/api/amigos/solicitar", {
    method: "POST", headers: auth(alice.token), body: JSON.stringify({ usuario: "TecnicoB" })
  }), env);
  assert.equal(sent.status, 200);
  assert.deepEqual(await sent.json(), { ok: 1, estado: "pendiente", usuario: "TecnicoB" });
  assert.equal(friendships.length, 1);

  const bobList = await worker.fetch(new Request("https://game.test/api/amigos", {
    headers: auth(bob.token)
  }), env);
  const received = await bobList.json();
  assert.equal(received.recibidas.length, 1);
  assert.equal(received.recibidas[0].usuario, "TecnicoA");

  const accept = await worker.fetch(new Request("https://game.test/api/amigos/responder", {
    method: "POST", headers: auth(bob.token), body: JSON.stringify({ id: 1, accion: "aceptar" })
  }), env);
  assert.equal(accept.status, 200);
  assert.deepEqual(await accept.json(), { ok: 1 });

  const aliceList = await worker.fetch(new Request("https://game.test/api/amigos", {
    headers: auth(alice.token)
  }), env);
  const accepted = await aliceList.json();
  assert.equal(accepted.amigos.length, 1);
  assert.equal(accepted.amigos[0].usuario, "TecnicoB");

  const remove = await worker.fetch(new Request("https://game.test/api/amigos/quitar", {
    method: "POST", headers: auth(alice.token), body: JSON.stringify({ id: 2 })
  }), env);
  assert.equal(remove.status, 200);
  assert.deepEqual(await remove.json(), { ok: 1 });
  assert.equal(friendships.length, 0);
});

test("public technician profile is available without authentication", async () => {
  const { env } = mockSocialDatabase();
  const account = await createAccount(env, "PerfilPublico");
  const favorite = await worker.fetch(post("https://game.test/api/auth/favorito", {
    tok: account.token, club: "river"
  }), env);
  assert.equal(favorite.status, 200);

  const response = await worker.fetch(new Request("https://game.test/api/tecnico?usuario=PerfilPublico"), env);
  assert.equal(response.status, 200);
  const profile = await response.json();
  assert.equal(profile.usuario, "PerfilPublico");
  assert.equal(profile.clubFavorito, "river");
  assert.equal(profile.resumen.puntos, 0);
  assert.deepEqual(profile.historial, []);
});


let nextChatMockBase = 1000;
function mockChatDatabase() {
  const users = [], sessions = [], profiles = new Map(), messages = [], reactions = [];
  const sanctions = new Map(), moderators = new Set(), events = [];
  let nextUserId = nextChatMockBase, nextMessageId = 1;
  nextChatMockBase += 100;
  const env = {
    CHAT_OWNER_USERNAME: "Propietario",
    CHAT: {
      idFromName: name => name,
      get: () => ({ fetch: async request => {
        const url = new URL(request.url);
        if (url.pathname === "/broadcast") {
          const body = await request.json();
          events.push(body);
          return new Response(JSON.stringify({ ok: true }));
        }
        if (url.pathname === "/stream") return new Response("stream");
        return new Response("not found", { status: 404 });
      }})
    },
    __DB_QUERY__: async (sql, params) => {
      if (sql.startsWith("INSERT INTO usuarios")) {
        const [usuario, usuario_lc, pass_hash] = params;
        const user = { id: nextUserId++, usuario, usuario_lc, pass_hash, creado: "2026-01-01T00:00:00Z" };
        users.push(user);
        return { rows: [{ id: user.id, usuario }], rowCount: 1 };
      }
      if (sql.startsWith("INSERT INTO sesiones")) {
        sessions.push({ token_hash: params[0], usuario_id: params[1], vence: params[2] });
        return { rows: [], rowCount: 1 };
      }
      if (sql.startsWith("SELECT id, usuario, pass_hash FROM usuarios")) {
        const user = users.find(row => row.usuario_lc === params[0]);
        return { rows: user ? [{ id: user.id, usuario: user.usuario, pass_hash: user.pass_hash }] : [], rowCount: user ? 1 : 0 };
      }
      if (sql.startsWith("SELECT u.id, u.usuario FROM sesiones")) {
        const session = sessions.find(row => row.token_hash === params[0] && Date.parse(row.vence) > Date.now());
        const user = session && users.find(row => row.id === session.usuario_id);
        return { rows: user ? [{ id: user.id, usuario: user.usuario }] : [], rowCount: user ? 1 : 0 };
      }
      if (sql.startsWith("UPDATE usuarios SET ultimo_ingreso") || sql.startsWith("DELETE FROM sesiones WHERE vence<now()")) return { rows: [], rowCount: 1 };
      if (sql.startsWith("SELECT 1 FROM chat_moderadores")) return { rows: moderators.has(Number(params[0])) ? [{ "?column?": 1 }] : [], rowCount: moderators.has(Number(params[0])) ? 1 : 0 };
      if (sql.startsWith("SELECT tipo,hasta FROM chat_sanciones")) {
        const row = sanctions.get(Number(params[0]));
        const active = row && (row.tipo === "suspension" || !row.hasta || Date.parse(row.hasta) > Date.now());
        return { rows: active ? [{ tipo: row.tipo, hasta: row.hasta }] : [], rowCount: active ? 1 : 0 };
      }
      if (sql.startsWith("SELECT u.usuario,p.club_favorito FROM usuarios")) {
        const user = users.find(row => row.id === Number(params[0]));
        const profile = profiles.get(Number(params[0]));
        return { rows: user ? [{ usuario: user.usuario, club_favorito: profile?.club_favorito || null }] : [], rowCount: user ? 1 : 0 };
      }
      if (sql.startsWith("INSERT INTO chat_mensajes")) {
        const row = { id: nextMessageId++, usuario_id: Number(params[0]), usuario: params[1], mensaje: params[2], creado: "2026-01-02T00:00:00Z", eliminado: false };
        messages.push(row);
        return { rows: [{ id: row.id, usuario: row.usuario, mensaje: row.mensaje, creado: row.creado }], rowCount: 1 };
      }
      if (sql.startsWith("SELECT m.id,m.usuario,m.mensaje")) {
        const uid = params[1] == null ? null : Number(params[1]);
        const rows = messages.filter(row => !row.eliminado).slice(-Number(params[0])).map(row => ({
          id: row.id, usuario: row.usuario, mensaje: row.mensaje, creado: row.creado,
          club_favorito: profiles.get(row.usuario_id)?.club_favorito || null,
          likes: reactions.filter(v => v.mensaje_id === row.id && v.valor === 1).length,
          dislikes: reactions.filter(v => v.mensaje_id === row.id && v.valor === -1).length,
          mi_voto: reactions.find(v => v.mensaje_id === row.id && v.usuario_id === uid)?.valor || 0,
          mio: row.usuario_id === uid, es_owner: row.usuario.toLowerCase() === String(params[2]).toLowerCase()
        }));
        return { rows, rowCount: rows.length };
      }
      if (sql.startsWith("SELECT usuario_id,lower(usuario)=lower($2)")) {
        const row = messages.find(item => item.id === Number(params[0]) && !item.eliminado);
        return { rows: row ? [{ usuario_id: row.usuario_id, es_owner: row.usuario.toLowerCase() === String(params[1]).toLowerCase() }] : [], rowCount: row ? 1 : 0 };
      }
      if (sql.startsWith("UPDATE chat_mensajes SET eliminado=true")) {
        const row = messages.find(item => item.id === Number(params[0]));
        if (row) row.eliminado = true;
        return { rows: [], rowCount: row ? 1 : 0 };
      }
      if (sql.startsWith("DELETE FROM chat_reacciones WHERE mensaje_id=")) {
        const before = reactions.length;
        for (let i = reactions.length - 1; i >= 0; i--) if (reactions[i].mensaje_id === Number(params[0])) reactions.splice(i, 1);
        return { rows: [], rowCount: before - reactions.length };
      }
      if (sql.startsWith("SELECT usuario_id FROM chat_mensajes")) {
        const row = messages.find(item => item.id === Number(params[0]) && !item.eliminado);
        return { rows: row ? [{ usuario_id: row.usuario_id }] : [], rowCount: row ? 1 : 0 };
      }
      if (sql.startsWith("DELETE FROM chat_reacciones WHERE mensaje_id=$1 AND usuario_id=$2 AND valor=$3")) {
        const index = reactions.findIndex(row => row.mensaje_id === Number(params[0]) && row.usuario_id === Number(params[1]) && row.valor === Number(params[2]));
        if (index < 0) return { rows: [], rowCount: 0 };
        const [row] = reactions.splice(index, 1);
        return { rows: [{ mensaje_id: row.mensaje_id }], rowCount: 1 };
      }
      if (sql.startsWith("INSERT INTO chat_reacciones")) {
        const [mensaje_id, usuario_id, valor] = params.map(Number);
        const old = reactions.find(row => row.mensaje_id === mensaje_id && row.usuario_id === usuario_id);
        if (old) old.valor = valor;
        else reactions.push({ mensaje_id, usuario_id, valor });
        return { rows: [], rowCount: 1 };
      }
      if (sql.startsWith("SELECT COUNT(*) FILTER(WHERE valor=1)")) {
        const rows = reactions.filter(row => row.mensaje_id === Number(params[0]));
        return { rows: [{ likes: rows.filter(row => row.valor === 1).length, dislikes: rows.filter(row => row.valor === -1).length, mi_voto: rows.find(row => row.usuario_id === Number(params[1]))?.valor || 0 }], rowCount: 1 };
      }
      if (sql.startsWith("SELECT u.usuario FROM chat_reacciones")) {
        const rows = reactions.filter(row => row.mensaje_id === Number(params[0]) && row.valor === Number(params[1])).map(row => ({ usuario: users.find(user => user.id === row.usuario_id)?.usuario }));
        return { rows, rowCount: rows.length };
      }
      if (sql.startsWith("SELECT id,usuario FROM usuarios WHERE usuario_lc=")) {
        const user = users.find(row => row.usuario_lc === params[0]);
        return { rows: user ? [{ id: user.id, usuario: user.usuario }] : [], rowCount: user ? 1 : 0 };
      }
      if (sql.startsWith("INSERT INTO chat_sanciones")) {
        const [uid, tipo, hasta, razon, por_id] = sql.includes("'mute'") ? [params[0], "mute", params[1], params[2], params[3]] : [params[0], "suspension", null, params[1], params[2]];
        sanctions.set(Number(uid), { tipo, hasta, razon, por_id });
        return { rows: [], rowCount: 1 };
      }
      if (sql.startsWith("DELETE FROM chat_sanciones")) {
        const deleted = sanctions.delete(Number(params[0]));
        return { rows: deleted ? [{ usuario_id: Number(params[0]) }] : [], rowCount: deleted ? 1 : 0 };
      }
      if (sql.startsWith("INSERT INTO chat_moderadores")) {
        moderators.add(Number(params[0]));
        return { rows: [], rowCount: 1 };
      }
      if (sql.startsWith("DELETE FROM chat_moderadores")) {
        const deleted = moderators.delete(Number(params[0]));
        return { rows: deleted ? [{ usuario_id: Number(params[0]) }] : [], rowCount: deleted ? 1 : 0 };
      }
      throw new Error("Unexpected chat SQL: " + sql);
    }
  };
  return { env, users, profiles, messages, reactions, sanctions, moderators, events };
}

test("public chat history, authenticated sending, profanity filter and live event", async () => {
  const { env, users, profiles, messages, events } = mockChatDatabase();
  const account = await createAccount(env, "ChatUser");
  profiles.set(users[0].id, { club_favorito: "boca" });
  const headers = { authorization: "Bearer " + account.token, "content-type": "application/json" };
  const sent = await worker.fetch(new Request("https://game.test/api/chat", {
    method: "POST", headers, body: JSON.stringify({ mensaje: "Hola poronga" })
  }), env);
  assert.equal(sent.status, 200);
  const payload = await sent.json();
  assert.equal(payload.mensaje.mensaje, "Hola •••••••");
  assert.equal(messages.length, 1);
  assert.equal(events.at(-1).tipo, "mensaje");

  const history = await worker.fetch(new Request("https://game.test/api/chat?limit=20"), env);
  assert.equal(history.status, 200);
  const list = await history.json();
  assert.equal(list.enabled, true);
  assert.equal(list.mensajes.length, 1);
  assert.equal(list.mensajes[0].club_favorito, "boca");
});

test("chat requires login to write and favorite club to post", async () => {
  const { env } = mockChatDatabase();
  const account = await createAccount(env, "ChatNoClub");
  const headers = { authorization: "Bearer " + account.token, "content-type": "application/json" };
  const denied = await worker.fetch(new Request("https://game.test/api/chat", {
    method: "POST", headers, body: JSON.stringify({ mensaje: "Hola" })
  }), env);
  assert.equal(denied.status, 403);
  const anonymous = await worker.fetch(post("https://game.test/api/chat", { mensaje: "Hola" }), env);
  assert.equal(anonymous.status, 401);
});

test("chat reactions, owner moderation permissions and sanctions are enforced", async () => {
  const { env, users, profiles, messages, reactions, sanctions, moderators } = mockChatDatabase();
  const author = await createAccount(env, "ChatAutor");
  const user = await createAccount(env, "ChatOtro");
  const owner = await createAccount(env, "Propietario");
  profiles.set(users[0].id, { club_favorito: "boca" });
  profiles.set(users[1].id, { club_favorito: "river" });
  profiles.set(users[2].id, { club_favorito: "independiente" });
  const auth = token => ({ authorization: "Bearer " + token, "content-type": "application/json" });

  const sent = await worker.fetch(new Request("https://game.test/api/chat", {
    method: "POST", headers: auth(author.token), body: JSON.stringify({ mensaje: "Buenas" })
  }), env);
  assert.equal(sent.status, 200);
  const messageId = (await sent.json()).mensaje.id;
  const voted = await worker.fetch(new Request("https://game.test/api/chat/reaccion", {
    method: "POST", headers: auth(user.token), body: JSON.stringify({ id: messageId, valor: 1 })
  }), env);
  assert.equal(voted.status, 200);
  assert.equal((await voted.json()).reaccion.likes, 1);
  assert.equal(reactions.length, 1);

  const unauthorizedMod = await worker.fetch(new Request("https://game.test/api/chat/moderar", {
    method: "POST", headers: auth(user.token), body: JSON.stringify({ usuario: "ChatAutor", accion: "suspender" })
  }), env);
  assert.equal(unauthorizedMod.status, 403);

  const mute = await worker.fetch(new Request("https://game.test/api/chat/moderar", {
    method: "POST", headers: auth(owner.token), body: JSON.stringify({ usuario: "ChatAutor", accion: "silenciar", minutos: 5, razon: "spam" })
  }), env);
  assert.equal(mute.status, 200);
  assert.equal(sanctions.get(users[0].id).tipo, "mute");

  const suspended = await createAccount(env, "ChatSuspendido");
  profiles.set(users[3].id, { club_favorito: "racing" });
  sanctions.set(users[3].id, { tipo: "suspension", hasta: null });
  const suspendedPost = await worker.fetch(new Request("https://game.test/api/chat", {
    method: "POST", headers: auth(suspended.token), body: JSON.stringify({ mensaje: "No debería pasar" })
  }), env);
  assert.equal(suspendedPost.status, 403);
  assert.match((await suspendedPost.json()).error, /suspendida/);
  assert.equal(messages.length, 1);

  const promote = await worker.fetch(new Request("https://game.test/api/chat/moderar", {
    method: "POST", headers: auth(owner.token), body: JSON.stringify({ usuario: "ChatOtro", accion: "moderar" })
  }), env);
  assert.equal(promote.status, 200);
  assert.ok(moderators.has(users[1].id));
});

test("ChatHub broadcasts live SSE events to connected clients", async () => {
  const hub = new ChatHub({ storage: {} });
  const streamResponse = await hub.fetch(new Request("https://chat.test/stream"));
  const reader = streamResponse.body.getReader();
  const first = await reader.read();
  assert.match(new TextDecoder().decode(first.value), /event: conectado/);
  await hub.fetch(new Request("https://chat.test/broadcast", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ tipo: "mensaje", data: { id: 7, mensaje: "hola" } })
  }));
  const event = await reader.read();
  assert.match(new TextDecoder().decode(event.value), /event: mensaje/);
  assert.match(new TextDecoder().decode(event.value), /"id":7/);
  await reader.cancel();
});


test("club palmares ranking preserves modality, season and tie rules", () => {
  const rows = [
    { club: "ar_boca", club_nombre: "Boca", modalidad: "clasico", competicion: "ar1", formato: "liga1", finalizado: "2026-01-01T00:00:00Z" },
    { club: "ar_boca", club_nombre: "Boca", modalidad: "offline", competicion: "custom", formato: "copa", finalizado: "2026-02-01T00:00:00Z" },
    { club: "ar_river", club_nombre: "River", modalidad: "clasico", competicion: "ar1", formato: "liga1", finalizado: "2026-03-01T00:00:00Z" }
  ];
  assert.equal(rankRows(rows, { mod: "online" }).rows[0].club, "ar_boca");
  assert.equal(rankRows(rows, { mod: "offline" }).rows[0].club, "ar_boca");
  assert.equal(rankRows(rows, { mod: "online", year: 2026 }).total, 2);
});

test("offline title validation keeps the existing club, format and participant constraints", () => {
  const validClub = Data.DIVS.find(div => div.id === "ar1").teams[0].id;
  const valid = offlineTitleRecord({ tid: "torneo123456", comp: "ar1", club: validClub, fmt: "liga1", n: 8 }, Data);
  assert.equal(typeof valid, "object");
  assert.equal(valid.mod, "offline");
  assert.equal(valid.competitivo, true);
  assert.equal(offlineTitleRecord({ tid: "torneo123456", comp: "ar1", club: "no-existe", fmt: "liga1", n: 8 }, Data), "El club no pertenece a esa competición");
  assert.equal(offlineTitleRecord({ tid: "torneo123456", comp: "ar1", club: validClub, fmt: "liga1", n: 3 }, Data), "Cantidad de equipos inválida");
});

test("career writes are idempotent and bind the authenticated account ID", async () => {
  const calls = [];
  const env = { __DB_QUERY__: async (sql, params) => { calls.push({ sql, params }); return { rows: [], rowCount: 1 }; } };
  await addCareers(env, [{ uid: 7, tid: "career-1", club: "ar_boca", mod: "offline", humanos: 1, campeon: true }]);
  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /ON CONFLICT\(usuario_id,torneo_id\) DO NOTHING/);
  assert.equal(calls[0].params[0], 7);
  assert.equal(calls[0].params[1], "career-1");
});

test("club title inserts are idempotent", async () => {
  let sqlSeen = "";
  const env = { __DB_QUERY__: async (sql) => { sqlSeen = sql; return { rows: [], rowCount: 0 }; } };
  const result = await addTitle(env, { tid: "torneo123456", club: "ar_boca", clubNombre: "Boca", mod: "clasico", comp: "ar1", compNombre: "Primera", fmt: "liga1", n: 8 });
  assert.deepEqual(result, { status: "duplicate" });
  assert.match(sqlSeen, /ON CONFLICT\(torneo_id\) DO NOTHING/);
});

test("technician ranking keeps the established points and eight-player eligibility", async () => {
  assert.equal(pointsForCareer({ participantes: 8, formato: "liga1", posicion: 1 }), 8);
  assert.equal(pointsForCareer({ participantes: 8, formato: "copa", resultado: "Campeón" }), 8);
  let query = "";
  const env = { __DB_QUERY__: async (sql) => { query = sql; return { rows: [], rowCount: 0 }; } };
  const result = await rankingCoaches(env, "historico");
  assert.equal(result.enabled, true);
  assert.match(query, /ELSE 8 END/);
});

test("fan ranking groups accounts by their one-time favorite club", async () => {
  const env = { __DB_QUERY__: async () => ({ rows: [{ club: "ar_boca", puntos: 3 }, { club: "ar_river", puntos: 1 }], rowCount: 2 }) };
  const result = await rankingFans(env);
  assert.equal(result.totalCuentas, 4);
  assert.equal(result.rows[0].club, "ar_boca");
  assert.equal(result.rows[0].hinchas, 3);
});


test("authenticated career endpoint accepts only validated offline career records", async () => {
  const token = "career-token-test-unique";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  const tokenHash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
  const inserts = [];
  const env = {
    __DB_QUERY__: async (sql, params) => {
      if (sql.startsWith("SELECT u.id, u.usuario FROM sesiones")) {
        return { rows: params[0] === tokenHash ? [{ id: 42, usuario: "CarreraTest" }] : [], rowCount: 1 };
      }
      if (sql.startsWith("INSERT INTO carreras")) {
        inserts.push({ sql, params });
        return { rows: [], rowCount: 1 };
      }
      throw new Error("Unexpected career SQL: " + sql);
    }
  };
  const club = Data.DIVS.find(div => div.id === "ar1").teams[0].id;
  const response = await worker.fetch(post("https://game.test/api/auth/carrera", {
    tok: token, tid: "career001", comp: "ar1", club, fmt: "liga1", n: 8,
    pos: 1, resultado: "Campeón", campeon: true, origen: "clasico", mod: "clasico"
  }), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: 1 });
  assert.equal(inserts.length, 1);
  assert.equal(inserts[0].params[0], 42);
  assert.equal(inserts[0].params[4], "offline");
  assert.equal(inserts[0].params[5], "offline");
});


test("public lobby creates, lists, joins and closes rooms through Durable Objects", async () => {
  const { env } = mockEnv();
  const entry = Data.catalog().find(item => item.clubs >= 10 && item.sizes.liga1.includes(10));
  assert.ok(entry);
  const create = await worker.fetch(post("https://game.test/api/pub", {
    op: "create", pid: "host-player", uid: 999999, name: "Anfitrion", div: entry.key, fmt: "liga1", n: 10, title: "Sala de prueba"
  }), env);
  assert.equal(create.status, 200);
  const created = await create.json();
  assert.match(created.room, /^pub[a-z0-9]{5}$/);
  const createdState = await worker.fetch(new Request("https://game.test/__cf/rooms/state?room=" + created.room), env);
  const createdSnapshot = (await createdState.json()).snapshot;
  assert.equal(createdSnapshot.pl["host-player"].uid, undefined);

  const list = await worker.fetch(new Request("https://game.test/api/salas"), env);
  assert.equal(list.status, 200);
  let rooms = await list.json();
  assert.equal(rooms.length, 1);
  assert.equal(rooms[0].code, created.room);
  assert.equal(rooms[0].h, 1);

  const join = await worker.fetch(post("https://game.test/api/pub", {
    op: "play", room: created.room, pid: "second-player", name: "DT 2"
  }), env);
  assert.equal(join.status, 200);
  assert.deepEqual(await join.json(), { room: created.room });

  const afterJoin = await worker.fetch(new Request("https://game.test/api/salas"), env);
  rooms = await afterJoin.json();
  assert.equal(rooms[0].h, 2);

  const duplicateCreate = await worker.fetch(post("https://game.test/api/pub", {
    op: "create", pid: "host-player", name: "Anfitrion", div: entry.key, fmt: "liga1", n: 10
  }), env);
  assert.deepEqual(await duplicateCreate.json(), { room: created.room });

  const watch = await worker.fetch(post("https://game.test/api/pub", {
    op: "watch", room: created.room, pid: "spectator-1", name: "Espectador"
  }), env);
  assert.equal(watch.status, 200);
  assert.deepEqual(await watch.json(), { room: created.room });
  const withSpectator = await worker.fetch(new Request("https://game.test/api/salas"), env);
  rooms = await withSpectator.json();
  assert.equal(rooms[0].spec, 1);
  const spectatorControl = await worker.fetch(post("https://game.test/act", {
    a: "ready", room: created.room, pid: "spectator-1", ready: true
  }), env);
  assert.notEqual(spectatorControl.status, 200);

  const close = await worker.fetch(post("https://game.test/api/pub", {
    op: "close", room: created.room, pid: "host-player", name: "Anfitrion"
  }), env);
  assert.equal(close.status, 200);
  assert.deepEqual(await close.json(), { ok: 1 });

  const afterClose = await worker.fetch(new Request("https://game.test/api/salas"), env);
  assert.deepEqual(await afterClose.json(), []);
});


test("public lobby persists abandonment blocks for account users", async () => {
  const { env } = mockEnv();
  const lobby = env.LOBBY.get("global");
  for (let i = 0; i < 3; i++) {
    const reported = await lobby.fetch(post("https://lobby.internal/abandon", { uid: 77, room: "pub12345" }));
    assert.equal(reported.status, 200);
  }
  const blocked = await lobby.fetch(post("https://lobby.internal/api", {
    op: "create", uid: 77, pid: "blocked-player", div: "ar1", fmt: "liga1", n: 10
  }));
  assert.equal(blocked.status, 403);
  assert.match((await blocked.json()).error, /bloqueado por abandonos/);
});


test("public lobby handles simultaneous room creation without duplicate IDs", async () => {
  const { env } = mockEnv();
  const entry = Data.catalog().find(item => item.clubs >= 10 && item.sizes.liga1.includes(10));
  const requests = Array.from({ length: 8 }, (_, index) => worker.fetch(post("https://game.test/api/pub", {
    op: "create", pid: "parallel-host-" + index, name: "DT " + index,
    div: entry.key, fmt: "liga1", n: 10
  }), env));
  const responses = await Promise.all(requests);
  assert.ok(responses.every(response => response.status === 200));
  const created = await Promise.all(responses.map(response => response.json()));
  const codes = created.map(item => item.room);
  assert.equal(new Set(codes).size, 8);
  const listing = await worker.fetch(new Request("https://game.test/api/salas"), env);
  const rooms = await listing.json();
  assert.equal(rooms.length, 8);
  assert.deepEqual(new Set(rooms.map(room => room.code)), new Set(codes));
});


test("random matchmaking creates one durable 10-player queue and serves it over SSE", async () => {
  const { env, randomStorages } = mockEnv();
  let room = "";
  for (let i = 0; i < 10; i++) {
    const joined = await worker.fetch(post("https://game.test/api/random", {
      pid: "quick-" + i, name: "DT " + i
    }), env);
    assert.equal(joined.status, 200);
    const result = await joined.json();
    assert.match(result.room, /^rnd[a-z0-9]{5,9}$/);
    if (!room) room = result.room;
    assert.equal(result.room, room);
  }
  const stored = randomStorages.get("global").data;
  assert.ok(stored.has("random-room:" + room));
  assert.equal(stored.get("random-room:" + room).phase, "vote1");
  const events = await worker.fetch(new Request(
    "https://game.test/ev?room=" + room + "&pid=quick-0"
  ), env);
  assert.equal(events.status, 200);
  const reader = events.body.getReader();
  const first = await reader.read();
  const payload = new TextDecoder().decode(first.value);
  assert.match(payload, /"phase":"vote1"/);
  assert.match(payload, /"need":10/);
  await reader.cancel();
});

test("random matchmaking queue survives Durable Object reconstruction", async () => {
  const { env, randomStorages } = mockEnv();
  const first = await worker.fetch(post("https://game.test/api/random", { pid: "persist-a", name: "A" }), env);
  const room = (await first.json()).room;
  const storage = randomStorages.get("global");
  const restarted = new RandomCoordinator({ storage }, env);
  env.RANDOM.get = () => ({ fetch: request => restarted.fetch(request), instance: restarted });
  const second = await worker.fetch(post("https://game.test/api/random", { pid: "persist-b", name: "B" }), env);
  assert.equal((await second.json()).room, room);
  assert.equal(storage.data.get("random-room:" + room).order.length, 2);
});
