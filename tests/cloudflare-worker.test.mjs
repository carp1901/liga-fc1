import test from "node:test";
import assert from "node:assert/strict";
import worker, { RoomCoordinator } from "../src/worker.mjs";

class MemoryStorage {
  data = new Map();
  async get(key) { return this.data.get(key); }
  async put(key, value) { this.data.set(key, value); }
}
function mockEnv() {
  const objects = new Map();
  return {
    ROOMS: {
      idFromName: name => name,
      get: id => {
        if (!objects.has(id)) {
          const storage = new MemoryStorage();
          const instance = new RoomCoordinator({ storage }, {});
          objects.set(id, { fetch: req => instance.fetch(req), instance });
        }
        return objects.get(id);
      }
    }
  };
}

test("Worker health endpoint reports its migration phase", async () => {
  const response = await worker.fetch(new Request("https://game.test/health"), mockEnv());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true, platform: "cloudflare-workers", phase: "transport-foundation"
  });
});

test("room coordinator persists and returns a snapshot", async () => {
  const env = mockEnv();
  const put = await worker.fetch(new Request("https://game.test/__cf/rooms/test-room/state", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ snapshot: { phase: "waiting", players: 8 } })
  }), env);
  assert.equal(put.status, 200);

  const get = await worker.fetch(new Request("https://game.test/__cf/rooms/test-room/state"), env);
  assert.equal(get.status, 200);
  assert.deepEqual(await get.json(), { snapshot: { phase: "waiting", players: 8 } });
});

test("invalid room IDs are rejected before reaching Durable Objects", async () => {
  const response = await worker.fetch(new Request("https://game.test/__cf/rooms/../state"), mockEnv());
  assert.equal(response.status, 404);
});

test("invalid snapshot payloads are rejected", async () => {
  const object = new RoomCoordinator({ storage: new MemoryStorage() }, {});
  const response = await object.fetch(new Request("https://game.test/room/state", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ wrong: true })
  }));
  assert.equal(response.status, 400);
});
