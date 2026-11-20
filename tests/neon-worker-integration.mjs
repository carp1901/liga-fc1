import assert from "node:assert/strict";
import { neon } from "@neondatabase/serverless";
import worker, { ChatHub, LobbyCoordinator, RoomCoordinator } from "../src/worker.mjs";
import Data from "../public/data.js";

const databaseUrl = process.env.NEON_TEST_DATABASE_URL;
if (!databaseUrl) throw new Error("Falta NEON_TEST_DATABASE_URL");
const sql = neon(databaseUrl, { fullResults: true });
const username = "cfcheck" + Date.now().toString(36).slice(-8);
const password = "Test-" + crypto.randomUUID().slice(0, 18);
const storages = new Map();
const roomObjects = new Map();
const lobbyStorage = new MemoryStorage();
const lobby = new LobbyCoordinator({ storage: lobbyStorage }, null);
const chatHub = new ChatHub({ storage: {} });
const env = {
  DATABASE_URL: databaseUrl,
  CHAT: { idFromName: () => "global", get: () => chatHub },
  LOBBY: { idFromName: () => "global", get: () => lobby },
  ROOMS: {
    idFromName: name => name,
    get: code => {
      if (!roomObjects.has(code)) {
        const storage = new MemoryStorage();
        storages.set(code, storage);
        roomObjects.set(code, new RoomCoordinator({ storage }, env));
      }
      return roomObjects.get(code);
    }
  }
};
lobby.env = env;
const call = (path, { method = "GET", body, token } = {}) => worker.fetch(new Request("https://integration.test" + path, {
  method,
  headers: {
    ...(body ? { "content-type": "application/json" } : {}),
    ...(token ? { authorization: "Bearer " + token } : {})
  },
  ...(body ? { body: JSON.stringify(body) } : {})
}), env);
let userId = null;
let token = null;
const checks = [];
try {
  const health = await call("/api/db/health");
  assert.equal(health.status, 200, "Neon health endpoint");
  assert.deepEqual(await health.json(), { ok: true, database: "connected", value: 1 });
  checks.push("Worker -> Neon: SELECT 1");

  const registered = await call("/api/auth/registro", {
    method: "POST", body: { usuario: username, clave: password }
  });
  assert.equal(registered.status, 200, "registro");
  const registration = await registered.json();
  assert.equal(registration.usuario, username);
  assert.ok(registration.token);
  token = registration.token;
  checks.push("Registro y creación de sesión");

  const me = await call("/api/auth/yo", { token });
  assert.equal(me.status, 200, "validación de sesión");
  assert.equal((await me.json()).usuario, username);
  checks.push("Validación de token");

  const club = Object.keys(Data.TM || {})[0];
  assert.ok(club, "Debe existir al menos un club en Data.TM");
  const favorite = await call("/api/auth/favorito", {
    method: "POST", token, body: { club }
  });
  assert.equal(favorite.status, 200, "guardar club favorito");
  assert.equal((await favorite.json()).clubFavorito, club);
  checks.push("Guardado de club favorito");

  const profile = await call("/api/auth/perfil", { token });
  assert.equal(profile.status, 200, "lectura de perfil");
  const profileData = await profile.json();
  assert.equal(profileData.usuario, username);
  assert.equal(profileData.clubFavorito, club);
  checks.push("Lectura de perfil");

  const chatStream = await call("/api/chat/stream");
  assert.equal(chatStream.status, 200, "chat SSE");
  const chatReader = chatStream.body.getReader();
  const connected = await chatReader.read();
  assert.match(new TextDecoder().decode(connected.value), /event: conectado/);
  const sent = await call("/api/chat", {
    method: "POST", token, body: { mensaje: "Prueba automatizada de chat" }
  });
  assert.equal(sent.status, 200, "enviar mensaje autenticado");
  const sentData = await sent.json();
  assert.equal(sentData.mensaje.club_favorito, club);
  const liveEvent = await chatReader.read();
  assert.match(new TextDecoder().decode(liveEvent.value), /event: mensaje/);
  await chatReader.cancel();
  const history = await call("/api/chat?limit=20");
  assert.equal(history.status, 200, "historial del chat");
  assert.ok((await history.json()).mensajes.some(row => row.mensaje === "Prueba automatizada de chat"));
  checks.push("Chat real en Neon: escritura, historial, escudo y evento SSE");

  const entry = Data.catalog().find(item => item.clubs >= 10 && item.sizes.liga1.includes(10));
  assert.ok(entry, "Debe existir un formato de liga pública de 10 equipos");
  const createdResponse = await call("/api/pub", {
    method: "POST", token,
    body: { op: "create", pid: "integration-host", name: username, div: entry.key, fmt: "liga1", n: 10, title: "Prueba aislada" }
  });
  assert.equal(createdResponse.status, 200, "crear sala pública");
  const created = await createdResponse.json();
  assert.match(created.room, /^pub[a-z0-9]{5}$/);
  const listed = await call("/api/salas");
  assert.equal(listed.status, 200, "listar salas");
  assert.ok((await listed.json()).some(room => room.code === created.room));
  const joined = await call("/api/pub", {
    method: "POST", body: { op: "play", room: created.room, pid: "integration-guest", name: "Invitado" }
  });
  assert.equal(joined.status, 200, "ingresar a sala");
  assert.deepEqual(await joined.json(), { room: created.room });
  const closed = await call("/api/pub", {
    method: "POST", token,
    body: { op: "close", room: created.room, pid: "integration-host", name: username }
  });
  assert.equal(closed.status, 200, "cerrar sala");
  assert.deepEqual(await closed.json(), { ok: 1 });
  const afterClose = await call("/api/salas");
  assert.deepEqual(await afterClose.json(), []);
  checks.push("Lobby/DO runtime: crear, listar, ingresar y cerrar sala pública");

  const found = await sql.query("SELECT id FROM usuarios WHERE usuario_lc=$1", [username.toLowerCase()]);
  userId = found.rows[0]?.id;
  assert.ok(userId, "usuario de prueba persistido en Neon");

  const logout = await call("/api/auth/logout", { method: "POST", token });
  assert.equal(logout.status, 200, "logout");
  const afterLogout = await call("/api/auth/yo", { token });
  assert.equal(afterLogout.status, 401, "sesión invalidada");
  checks.push("Cierre e invalidación de sesión");

  console.log("INTEGRATION_OK");
  for (const check of checks) console.log("PASS " + check);
} finally {
  if (!userId) {
    const found = await sql.query("SELECT id FROM usuarios WHERE usuario_lc=$1", [username.toLowerCase()]);
    userId = found.rows[0]?.id;
  }
  if (userId) {
    await sql.query("DELETE FROM chat_reacciones WHERE mensaje_id IN (SELECT id FROM chat_mensajes WHERE usuario_id=$1) OR usuario_id=$1", [userId]);
    await sql.query("DELETE FROM chat_mensajes WHERE usuario_id=$1", [userId]);
    await sql.query("DELETE FROM chat_moderadores WHERE usuario_id=$1 OR por_id=$1", [userId]);
    await sql.query("DELETE FROM chat_sanciones WHERE usuario_id=$1 OR por_id=$1", [userId]);
    await sql.query("DELETE FROM sesiones WHERE usuario_id=$1", [userId]);
    await sql.query("DELETE FROM perfiles WHERE usuario_id=$1", [userId]);
    await sql.query("DELETE FROM amistades WHERE de_id=$1 OR a_id=$1", [userId]);
    await sql.query("DELETE FROM carreras WHERE usuario_id=$1", [userId]);
    await sql.query("DELETE FROM usuarios WHERE id=$1", [userId]);
    console.log("CLEANUP_OK");
  }
}

class MemoryStorage {
  constructor() { this.data = new Map(); this.alarm = null; }
  async get(key) { return this.data.get(key); }
  async put(key, value) { this.data.set(key, structuredClone(value)); }
  async delete(key) { return this.data.delete(key); }
  async list(options = {}) {
    return new Map([...this.data.entries()].filter(([key]) => !options.prefix || key.startsWith(options.prefix)));
  }
  async setAlarm(value) { this.alarm = value; }
  async deleteAlarm() { this.alarm = null; }
}
