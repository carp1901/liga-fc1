// Ranking de técnicos: UNA sola definición para el servidor Node (store.js) y el Worker (src/careers.mjs, src/social.mjs).
// Dos rankings separados (decisión del 27/11/2026, SEG-04):
//   online  = verificado: torneos online competitivos (el servidor jugó los partidos; ≥8 cuentas y ≥8 equipos, ver engine.js)
//   offline = informado:  carreras offline que el dispositivo informa (el servidor no puede verificar los partidos)
'use strict';
const TIPOS = ['online', 'offline'];
const tipoRanking = t => (t === 'offline' ? 'offline' : 'online');

// Condición SQL de las carreras que suman a cada ranking. minEquipos sale de public/data.js (MIN_EQUIPOS).
// tipo 'todas' = las dos (historial del perfil).
function eligibleCareerSql(a, tipo, minEquipos) {
  const m = Math.floor(Number(minEquipos));
  if (!(m > 0)) throw new Error('minEquipos inválido');
  if (!/^[a-z_]+$/.test(a)) throw new Error('alias inválido');
  const online = `(${a}.competitivo=true AND ${a}.modalidad IN ('clasico','barrial') AND ${a}.origen<>'offline')`;
  const offline = `(${a}.modalidad='offline' AND ${a}.participantes >= ${m})`;
  return tipo === 'todas' ? `(${online} OR ${offline})` : tipo === 'offline' ? offline : online;
}
// Una carrera ya elegible, ¿es verificada (online) o informada (offline)?
const tipoDeCarrera = c => (c && c.modalidad === 'offline' ? 'offline' : 'online');

function puntosTecnico(c) {
  const n = Math.max(1, Math.floor(Number(c.participantes) || 0)), pos = Math.floor(Number(c.posicion) || 0), fmt = String(c.formato || ''), res = String(c.resultado || '').toLowerCase();
  if (fmt === 'liga1' || fmt === 'liga2') return pos >= 1 && pos <= n ? n - pos + 1 : 0;
  let etapa = 7;
  if (res.includes('campeón')) etapa = 0; else if (res.includes('finalista')) etapa = 1; else if (res.includes('semifinal')) etapa = 2;
  else if (res.includes('cuartos')) etapa = 3; else if (res.includes('octavos')) etapa = 4; else if (res.includes('dieciseisavos')) etapa = 5; else if (res.includes('32avos')) etapa = 6;
  return Math.max(1, Math.ceil(n / Math.pow(2, etapa)));
}
const esPodio = c => ((c.formato === 'liga1' || c.formato === 'liga2') ? Number(c.posicion) <= 3 : /campeón|finalista|semifinal/i.test(c.resultado || ''));

// Agrupa las carreras (filas con usuario, club_favorito, formato, participantes, posicion, resultado, campeon, finalizado)
// por técnico y devuelve la tabla ordenada, con posición compartida en caso de empate de puntos.
function agruparTecnicos(rows) {
  const by = new Map();
  for (const c of rows) {
    const k = String(c.usuario).toLowerCase(), x = by.get(k) || { usuario: c.usuario, clubFavorito: c.club_favorito, puntos: 0, torneos: 0, campeonatos: 0, podios: 0, ultimo: null };
    x.puntos += puntosTecnico(c); x.torneos++;
    if (c.campeon) x.campeonatos++;
    if (esPodio(c)) x.podios++;
    if (!x.ultimo || new Date(c.finalizado) > new Date(x.ultimo)) x.ultimo = c.finalizado;
    if (!x.clubFavorito && c.club_favorito) x.clubFavorito = c.club_favorito;
    by.set(k, x);
  }
  const out = [...by.values()].filter(x => x.puntos > 0).sort((a, b) => b.puntos - a.puntos || b.campeonatos - a.campeonatos || b.podios - a.podios || b.torneos - a.torneos || a.usuario.localeCompare(b.usuario, 'es'));
  let pos = 0; out.forEach((x, i) => { if (i === 0 || x.puntos !== out[i - 1].puntos) pos = i + 1; x.pos = pos; });
  return out;
}
const resumenVacio = () => ({ puntos: 0, torneos: 0, campeonatos: 0, podios: 0, pos: null });
const resumenDe = (tabla, usuario) => tabla.find(x => x.usuario.toLowerCase() === String(usuario).toLowerCase()) || resumenVacio();

// Caché corto (REN-06): el ranking y el perfil recorren todas las carreras; se recalculan como mucho cada RANKING_TTL_MS.
const RANKING_TTL_MS = 30000;
function cacheCorto(ttl = RANKING_TTL_MS) {
  const m = new Map();
  return {
    async get(key, calc) { const now = Date.now(), hit = m.get(key); if (hit && now - hit.t < ttl) return hit.v; const v = await calc(); m.set(key, { t: now, v }); if (m.size > 500) m.delete(m.keys().next().value); return v; },
    clear() { m.clear(); },
  };
}
module.exports = { TIPOS, tipoRanking, eligibleCareerSql, tipoDeCarrera, puntosTecnico, esPodio, agruparTecnicos, resumenDe, resumenVacio, cacheCorto, RANKING_TTL_MS };
