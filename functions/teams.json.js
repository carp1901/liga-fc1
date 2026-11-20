import { proxyToGame } from "./_proxy.js";

export async function onRequest(context) {
  return proxyToGame(context);
}
