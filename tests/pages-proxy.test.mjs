import test from "node:test";
import assert from "node:assert/strict";
import { onRequest as proxyApi } from "../functions/api/[[path]].js";
import { onRequest as proxyAct } from "../functions/act.js";
import { onRequest as proxyEv } from "../functions/ev.js";
import { onRequest as proxyTeams } from "../functions/teams.json.js";

function fakeService(handler) {
  return { fetch: handler };
}

test("Pages API proxy forwards same-origin requests and strips Origin", async () => {
  let received;
  const request = new Request("https://clash-futbol.pages.dev/api/auth/login", {
    method: "POST",
    headers: { origin: "https://clash-futbol.pages.dev", "content-type": "application/json", authorization: "Bearer test" },
    body: JSON.stringify({ usuario: "demo", clave: "test" })
  });
  const response = await proxyApi({
    request,
    env: { CLASH_API: fakeService(async forwarded => {
      received = forwarded;
      return Response.json({ ok: true });
    }) }
  });
  assert.equal(response.status, 200);
  assert.equal(received.url, request.url);
  assert.equal(received.headers.get("origin"), null);
  assert.equal(received.headers.get("authorization"), "Bearer test");
  assert.deepEqual(await received.json(), { usuario: "demo", clave: "test" });
});

test("Pages proxy preserves streaming responses for EventSource", async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("data:ok\n\n"));
      controller.close();
    }
  });
  const response = await proxyEv({
    request: new Request("https://clash-futbol.pages.dev/ev?room=abc123&pid=p1"),
    env: { CLASH_API: fakeService(async () => new Response(stream, {
      headers: { "content-type": "text/event-stream; charset=utf-8" }
    })) }
  });
  assert.equal(response.headers.get("content-type"), "text/event-stream; charset=utf-8");
  assert.equal(await response.text(), "data:ok\n\n");
});

test("Pages proxy routes action and static JSON endpoints to the Worker", async () => {
  const seen = [];
  const service = fakeService(async request => {
    seen.push(new URL(request.url).pathname);
    return new Response("ok");
  });
  for (const [handler, path, method] of [
    [proxyAct, "/act", "POST"],
    [proxyTeams, "/teams.json", "GET"]
  ]) {
    const response = await handler({
      request: new Request("https://clash-futbol.pages.dev" + path, { method }),
      env: { CLASH_API: service }
    });
    assert.equal(response.status, 200);
  }
  assert.deepEqual(seen, ["/act", "/teams.json"]);
});

test("Pages proxy fails closed when the service binding is missing", async () => {
  const response = await proxyApi({
    request: new Request("https://clash-futbol.pages.dev/api/db/health"),
    env: {}
  });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "Backend no configurado" });
});
