import test from "node:test";
import assert from "node:assert/strict";
import worker, { RoomCoordinator } from "../src/worker.mjs";
import Data from "../public/data.js";

class MemoryStorage {
  data = new Map();
  alarm = null;
  async get(key) { return this.data.get(key); }
  async put(key, value) { this.data.set(key, structuredClone(value)); }
  async delete(key) { return this.data.delete(key); }
  async setAlarm(value) { this.alarm = value; }
}

function mockEnv() {
  const objects = new Map();
  const storages = new Map();
  const env = {
    ROOMS: {
      idFromName: name => name,
      get: id => {
        if (!objects.has(id)) {
          const storage = new MemoryStorage();
          storages.set(id, storage);
          const instance = new RoomCoordinator({ storage }, {});
          objects.set(id, { fetch: req => instance.fetch(req), instance });
        }
        return objects.get(id);
      }
    }
  };
  return { env, storages };
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
