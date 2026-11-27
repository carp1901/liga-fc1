// SRV-04: tope total de conexiones SSE del chat por instancia; al pasarlo se responde 503 y el navegador reintenta solo.
export const CHAT_MAX_CLIENTS = 1000;
export class ChatHub {
  constructor(state) {
    this.state = state;
    this.clients = new Set();
  }
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/stream") {
      if (this.clients.size >= CHAT_MAX_CLIENTS) return new Response(JSON.stringify({ error: "Chat lleno; reintentá en unos segundos" }), { status: 503, headers: { "content-type": "application/json", "retry-after": "30" } });
      let client;
      const stream = new ReadableStream({
        start: controller => {
          client = controller;
          this.clients.add(controller);
          controller.enqueue(new TextEncoder().encode("retry:3000\nevent: conectado\ndata:{}\n\n"));
        },
        cancel: () => this.clients.delete(client)
      });
      return new Response(stream, { headers: {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        "x-accel-buffering": "no"
      }});
    }
    if (request.method === "POST" && url.pathname === "/broadcast") {
      const body = await request.json();
      const packet = "event: " + String(body.tipo || "mensaje") + "\ndata:" + JSON.stringify(body.data || {}) + "\n\n";
      const bytes = new TextEncoder().encode(packet);
      for (const client of this.clients) {
        try { client.enqueue(bytes); }
        catch { this.clients.delete(client); }
      }
      return new Response(JSON.stringify({ ok: true, clients: this.clients.size }), {
        headers: { "content-type": "application/json" }
      });
    }
    return new Response("Not found", { status: 404 });
  }
}
