// Same-origin Pages Functions proxy to the private Cloudflare Worker.
// The Service binding keeps the game API off the public Internet.
export async function proxyToGame(context) {
  const service = context.env.CLASH_API;
  if (!service) {
    return Response.json({ error: "Backend no configurado" }, { status: 503 });
  }

  const headers = new Headers(context.request.headers);
  // The Pages Function and Worker communicate through a Service binding.
  // CORS is not needed on this internal hop, and the Worker must not see
  // the browser's Pages Origin as an untrusted cross-origin request.
  headers.delete("origin");

  const request = new Request(context.request, { headers });
  return service.fetch(request);
}
