// Configuración del backend separado (Cloudflare Pages -> servidor Node).
// Al desplegar, reemplazá el valor por la URL HTTPS pública del backend.
// En desarrollo local dejalo vacío para usar el mismo origen.
window.CF_API_BASE = window.CF_API_BASE || '';
const apiUrl = path => {
  const value = String(path || '');
  if (/^https?:\/\//i.test(value)) return value;
  const base = String(window.CF_API_BASE || '').trim().replace(/\/+$/, '');
  return new URL(value, (base || window.location.origin) + '/').toString();
};
const apiFetch = (path, options) => window.fetch(apiUrl(path), options);
