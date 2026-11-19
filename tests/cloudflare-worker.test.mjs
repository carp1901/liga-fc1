import test from "node:test";
import assert from "node:assert/strict";
import worker, { RoomCoordinator } from "../src/worker.mjs";

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
