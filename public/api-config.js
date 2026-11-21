// La web usa rutas del mismo origen. Cloudflare Pages Functions las reenvía
// al Worker privado mediante el Service binding CLASH_API.
// Mantener vacío: no apuntar a Render ni publicar una URL workers.dev.
window.CF_API_BASE = window.CF_API_BASE || '';
const apiUrl = path => {
  const value = String(path || '');
  if (/^https?:\/\//i.test(value)) return value;
  const base = String(window.CF_API_BASE || '').trim().replace(/\/+$/, '');
  return new URL(value, (base || window.location.origin) + '/').toString();
};
const apiFetch = (path, options) => window.fetch(apiUrl(path), options);
