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
  const response = await worker.fetch(post("https://game.test/act", {
    a: "create", room: "secure1", pid: "player1", uid: 999999, name: "DT",
    cfg: { div: "ar1", fmt: "liga1", n: 8 }
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
