import { dbQuery } from "./db.mjs";
import { eligibleCareerSql, rankingCoaches } from "./careers.mjs";
import Ranking from "../shared/ranking.js";

const USER_RE = /^[A-Za-z0-9_.-]{3,16}$/;
const AMG_MAX = 100;
const AMG_PEND = 30;

function enabledError() {
  return { error: "Las cuentas no están disponibles en este servidor" };
}
async function friendCount(env, id) {
  const result = await dbQuery(env,
    "SELECT count(*)::int AS n FROM amistades WHERE (de_id=$1 OR a_id=$1) AND estado='aceptada'",
    [id]
  );
  return Number(result.rows[0]?.n || 0);
}

export async function profile(env, uid) {
  const userResult = await dbQuery(env,
    "SELECT usuario,creado FROM usuarios WHERE id=$1", [uid]
  );
  if (!userResult.rows.length) return { error: "Usuario inexistente" };
  const [profileResult, historyResult, statsResult] = await Promise.all([
    dbQuery(env, "SELECT club_favorito,descripcion FROM perfiles WHERE usuario_id=$1", [uid]),
    dbQuery(env, "SELECT torneo_id,club,club_nombre,modalidad,origen,competicion,competicion_nombre,formato,participantes,posicion,resultado,campeon,pj,g,e,p,gf,gc,pts,finalizado FROM carreras WHERE usuario_id=$1 ORDER BY finalizado DESC, id DESC LIMIT 100", [uid]),
    dbQuery(env, "SELECT count(*)::int AS carreras, count(*) FILTER (WHERE campeon)::int AS campeonatos, count(*) FILTER (WHERE modalidad<>'offline')::int AS online, count(DISTINCT club)::int AS clubes FROM carreras WHERE usuario_id=$1", [uid])
  ]);
  const stats = statsResult.rows[0] || {};
  const profile = profileResult.rows[0] || null;
  const total = Number(stats.carreras || 0);
  const online = Number(stats.online || 0);
  return {
    enabled: true,
    usuario: userResult.rows[0].usuario,
    creado: userResult.rows[0].creado,
    perfilCompleto: !!profile,
    clubFavorito: profile?.club_favorito || null,
    descripcion: profile?.descripcion || "",
    resumen: {
      carreras: total,
      campeonatos: Number(stats.campeonatos || 0),
      online,
      offline: total - online,
      clubes: Number(stats.clubes || 0)
    },
    historial: historyResult.rows
  };
}

export async function setFavorite(env, uid, club) {
  const value = String(club || "").trim();
  if (!/^[a-z0-9_-]{1,40}$/.test(value)) return { error: "Club inválido" };
  const result = await dbQuery(env,
    "INSERT INTO perfiles(usuario_id,club_favorito) VALUES($1,$2) ON CONFLICT(usuario_id) DO NOTHING RETURNING club_favorito",
    [uid, value]
  );
  if (result.rows[0]) return { ok: 1, clubFavorito: result.rows[0].club_favorito };
  const existing = await dbQuery(env,
    "SELECT club_favorito FROM perfiles WHERE usuario_id=$1", [uid]
  );
  return {
    error: "El club favorito ya fue elegido y no se puede cambiar",
    clubFavorito: existing.rows[0]?.club_favorito || null
  };
}

export async function publicProfile(env, username) {
  const usuario = String(username || "").trim();
  if (!USER_RE.test(usuario)) return { error: "Usuario inválido" };
  const userResult = await dbQuery(env,
    "SELECT u.id,u.usuario,u.creado,p.club_favorito,p.descripcion FROM usuarios u LEFT JOIN perfiles p ON p.usuario_id=u.id WHERE u.usuario_lc=$1",
    [usuario.toLowerCase()]
  );
  const user = userResult.rows[0];
  if (!user) return { error: "No existe ese técnico" };

  // SEG-04: dos rankings separados (online verificado y offline informado); el historial marca de cuál es cada carrera.
  const [online, offline, historyResult] = await Promise.all([
    rankingCoaches(env, "historico", "online"),
    rankingCoaches(env, "historico", "offline"),
    dbQuery(env,
      `SELECT club,club_nombre,competicion_nombre,formato,participantes,posicion,resultado,campeon,finalizado,modalidad
       FROM carreras c WHERE c.usuario_id=$1 AND ${eligibleCareerSql("c", "todas")}
       ORDER BY finalizado DESC LIMIT 20`,
      [user.id]
    )
  ]);
  return {
    enabled: true,
    usuario: user.usuario,
    creado: user.creado,
    clubFavorito: user.club_favorito,
    descripcion: user.descripcion || "",
    resumen: Ranking.resumenDe(online.rows, user.usuario),
    resumenOffline: Ranking.resumenDe(offline.rows, user.usuario),
    historial: historyResult.rows.map(row => ({ ...row, tipo: Ranking.tipoDeCarrera(row) }))
  };
}

export async function friends(env, uid) {
  const result = await dbQuery(env,
    `SELECT a.id,a.de_id,a.a_id,a.estado,a.creada,a.aceptada,
      ud.usuario AS de_usuario,ua.usuario AS a_usuario
     FROM amistades a JOIN usuarios ud ON ud.id=a.de_id
     JOIN usuarios ua ON ua.id=a.a_id
     WHERE a.de_id=$1 OR a.a_id=$1 ORDER BY a.creada DESC`,
    [uid]
  );
  const output = { enabled: true, amigos: [], recibidas: [], enviadas: [] };
  for (const row of result.rows) {
    const isSender = Number(row.de_id) === Number(uid);
    const other = isSender
      ? { id: row.a_id, usuario: row.a_usuario }
      : { id: row.de_id, usuario: row.de_usuario };
    if (row.estado === "aceptada") output.amigos.push({ ...other, desde: row.aceptada || row.creada });
    else if (isSender) output.enviadas.push({ sol: row.id, ...other, fecha: row.creada });
    else output.recibidas.push({ sol: row.id, ...other, fecha: row.creada });
  }
  output.amigos.sort((a, b) => a.usuario.localeCompare(b.usuario, "es", { sensitivity: "base" }));
  return output;
}

export async function requestFriend(env, uid, username) {
  const usuario = String(username || "").trim();
  if (!USER_RE.test(usuario)) return { error: "Escribí el nombre de usuario completo de tu amigo" };
  const targetResult = await dbQuery(env,
    "SELECT id,usuario FROM usuarios WHERE usuario_lc=$1", [usuario.toLowerCase()]
  );
  const target = targetResult.rows[0];
  if (!target) return { error: "No existe ese usuario" };
  if (Number(target.id) === Number(uid)) return { error: "No podés agregarte a vos mismo" };

  const existingResult = await dbQuery(env,
    "SELECT id,de_id,a_id,estado FROM amistades WHERE (de_id=$1 AND a_id=$2) OR (de_id=$2 AND a_id=$1)",
    [uid, target.id]
  );
  if (existingResult.rows.length) {
    const existing = existingResult.rows[0];
    if (existing.estado === "aceptada") return { error: "Ya son amigos" };
    if (Number(existing.de_id) === Number(uid)) return { error: "Ya le enviaste una solicitud a " + target.usuario };
    const accepted = await respondFriend(env, uid, existing.id, "aceptar");
    return accepted.error ? accepted : { ok: 1, estado: "aceptada", usuario: target.usuario };
  }

  const pending = await dbQuery(env,
    "SELECT count(*)::int AS n FROM amistades WHERE de_id=$1 AND estado='pendiente'", [uid]
  );
  if (Number(pending.rows[0]?.n || 0) >= AMG_PEND) {
    return { error: "Tenés demasiadas solicitudes pendientes; esperá a que respondan" };
  }
  if (await friendCount(env, uid) >= AMG_MAX) {
    return { error: "Llegaste al máximo de " + AMG_MAX + " amigos" };
  }
  const inserted = await dbQuery(env,
    "INSERT INTO amistades(de_id,a_id) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING id",
    [uid, target.id]
  );
  return inserted.rows.length
    ? { ok: 1, estado: "pendiente", usuario: target.usuario }
    : { error: "No se pudo enviar la solicitud" };
}

export async function respondFriend(env, uid, id, action) {
  const requestId = Math.floor(Number(id));
  if (!(requestId > 0)) return { error: "Solicitud inválida" };
  if (action === "aceptar") {
    const request = await dbQuery(env,
      "SELECT de_id FROM amistades WHERE id=$1 AND a_id=$2 AND estado='pendiente'",
      [requestId, uid]
    );
    if (!request.rows.length) return { error: "Esa solicitud ya no existe" };
    if (await friendCount(env, uid) >= AMG_MAX || await friendCount(env, request.rows[0].de_id) >= AMG_MAX) {
      return { error: "No se puede aceptar: alguno de los dos llegó al máximo de " + AMG_MAX + " amigos" };
    }
    const updated = await dbQuery(env,
      "UPDATE amistades SET estado='aceptada',aceptada=now() WHERE id=$1 AND a_id=$2 AND estado='pendiente' RETURNING id",
      [requestId, uid]
    );
    return updated.rows.length ? { ok: 1 } : { error: "Esa solicitud ya no existe" };
  }
  if (action === "rechazar") {
    const deleted = await dbQuery(env,
      "DELETE FROM amistades WHERE id=$1 AND a_id=$2 AND estado='pendiente' RETURNING id",
      [requestId, uid]
    );
    return deleted.rows.length ? { ok: 1 } : { error: "Esa solicitud ya no existe" };
  }
  return { error: "Acción inválida" };
}

export async function cancelFriendRequest(env, uid, id) {
  const requestId = Math.floor(Number(id));
  if (!(requestId > 0)) return { error: "Solicitud inválida" };
  const deleted = await dbQuery(env,
    "DELETE FROM amistades WHERE id=$1 AND de_id=$2 AND estado='pendiente' RETURNING id",
    [requestId, uid]
  );
  return deleted.rows.length ? { ok: 1 } : { error: "Esa solicitud ya no existe" };
}

export async function removeFriend(env, uid, otherId) {
  const targetId = Math.floor(Number(otherId));
  if (!(targetId > 0)) return { error: "Amigo inválido" };
  const deleted = await dbQuery(env,
    "DELETE FROM amistades WHERE estado='aceptada' AND ((de_id=$1 AND a_id=$2) OR (de_id=$2 AND a_id=$1)) RETURNING id",
    [uid, targetId]
  );
  return deleted.rows.length ? { ok: 1 } : { error: "Ya no son amigos" };
}

export const limits = { friends: AMG_MAX, pending: AMG_PEND };
