const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function validRoomId(value) {
  return /^[a-z0-9-]{3,40}$/i.test(value || "");
}

/**
 * Edge entrypoint. Existing game routes intentionally remain unavailable here
 * until their engine handlers are migrated; this prevents a false-green launch.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, platform: "cloudflare-workers", phase: "transport-foundation" });
    }

    const match = url.pathname.match(/^\\/__cf\\/rooms\\/([^/]+)(?:\\/(state|stream))?$/);
    if (!match || !validRoomId(match[1])) {
      return json({ error: "Ruta no disponible en esta etapa" }, 404);
    }

    const roomId = match[1].toLowerCase();
    const objectId = env.ROOMS.idFromName(roomId);
    const stub = env.ROOMS.get(objectId);
    const forwarded = new Request(new URL(url.pathname.replace(/^\\/__cf\\/rooms\\//, "/") + url.search, url.origin), request);
    return stub.fetch(forwarded);
  }
};

export class RoomCoordinator {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.clients = new Set();
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname.endsWith("/state")) {
      const snapshot = await this.state.storage.get("snapshot");
      return snapshot === undefined
        ? json({ error: "Sala inexistente" }, 404)
        : json({ snapshot });
    }

    if (request.method === "PUT" && url.pathname.endsWith("/state")) {
      let body;
      try { body = await request.json(); } catch { return json({ error: "JSON inválido" }, 400); }
      if (!body || typeof body !== "object" || !Object.prototype.hasOwnProperty.call(body, "snapshot")) {
        return json({ error: "Falta snapshot" }, 400);
      }
      await this.state.storage.put("snapshot", body.snapshot);
      this.broadcast({ type: "snapshot", snapshot: body.snapshot });
      return json({ ok: true });
    }

    if (request.method === "GET" && url.pathname.endsWith("/stream")) {
      const encoder = new TextEncoder();
      let client;
      const stream = new ReadableStream({
        start: controller => {
          client = { controller, encoder };
          this.clients.add(client);
          controller.enqueue(encoder.encode("retry:3000\n\nevent: connected\ndata:{}\n\n"));
        },
        cancel: () => { if (client) this.clients.delete(client); }
      });
      return new Response(stream, {
        headers: {
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-cache, no-transform",
          "x-accel-buffering": "no"
        }
      });
    }

    return json({ error: "Ruta no disponible" }, 404);
  }

  broadcast(payload) {
    const frame = new TextEncoder().encode("data:" + JSON.stringify(payload) + "\n\n");
    for (const client of this.clients) {
      try { client.controller.enqueue(frame); }
      catch { this.clients.delete(client); }
    }
  }
}
