import { dbQuery } from "./db.mjs";

const USER_RE = /^[A-Za-z0-9_.-]{3,16}$/;
// Propietario del chat: se identifica SOLO por el id inmutable de la cuenta (usuarios.id), cargado en el secreto
// CHAT_OWNER_ID. Nunca por nombre de usuario. Si falta o no es un entero positivo válido, nadie es propietario.
const OWNER_ID_RE = /^[1-9][0-9]{0,15}$/;
let ownerWarned = false;
export function ownerId(env) {
  const raw = String(env && env.CHAT_OWNER_ID != null ? env.CHAT_OWNER_ID : "").trim();
  const id = Number(raw);
  if (OWNER_ID_RE.test(raw) && Number.isSafeInteger(id)) return id;
  if (!ownerWarned) {
    ownerWarned = true;
    // No se registra el valor del secreto, solo que falta o es inválido.
    console.warn("chat: CHAT_OWNER_ID ausente o inválido; nadie tiene permisos de propietario");
  }
  return null;
}
export function isOwnerId(id, env) {
  const owner = ownerId(env);
  return owner !== null && id != null && String(id).trim() !== "" && Number(id) === owner;
}
export function isOwner(user, env) {
  return !!user && isOwnerId(user.id, env);
}
export async function isModerator(env, uid) {
  const result = await dbQuery(env, "SELECT 1 FROM chat_moderadores WHERE usuario_id=$1", [uid]);
  return result.rows.length > 0;
}
export async function permissions(env, user) {
  const owner = isOwner(user, env);
  return { owner, moderador: owner || await isModerator(env, user.id) };
}
export async function history(env, limit, uid) {
  const n = Math.max(1, Math.min(150, Math.floor(Number(limit) || 80)));
  const owner = ownerId(env);
  const result = await dbQuery(env, `SELECT m.id,m.usuario,m.mensaje,m.creado,p.club_favorito,
    COALESCE(v.likes,0)::int AS likes,COALESCE(v.dislikes,0)::int AS dislikes,
    COALESCE(mv.valor,0)::int AS mi_voto,(m.usuario_id=$2) AS mio,
    COALESCE(m.usuario_id=$3,false) AS es_owner
    FROM chat_mensajes m LEFT JOIN perfiles p ON p.usuario_id=m.usuario_id
    LEFT JOIN (SELECT mensaje_id,COUNT(*) FILTER(WHERE valor=1) AS likes,
      COUNT(*) FILTER(WHERE valor=-1) AS dislikes FROM chat_reacciones GROUP BY mensaje_id) v ON v.mensaje_id=m.id
    LEFT JOIN chat_reacciones mv ON mv.mensaje_id=m.id AND mv.usuario_id=$2
    WHERE m.eliminado=false ORDER BY m.id DESC LIMIT $1`, [n, uid || null, owner]);
  return { enabled: true, mensajes: result.rows.reverse() };
}
export async function sendMessage(env, uid, message) {
  const value = String(message || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 300);
  if (!value) return { error: "El mensaje debe tener entre 1 y 300 caracteres" };
  if (String(message || "").trim().length > 300) return { error: "El mensaje debe tener entre 1 y 300 caracteres" };
  const sanction = await dbQuery(env,
    "SELECT tipo,hasta FROM chat_sanciones WHERE usuario_id=$1 AND (tipo='suspension' OR (tipo='mute' AND (hasta IS NULL OR hasta>now())))",
    [uid]
  );
  if (sanction.rows.length) {
    const row = sanction.rows[0];
    return { error: row.tipo === "suspension" ? "Tu cuenta está suspendida del chat." :
      "Tenés silenciado el chat hasta " + new Date(row.hasta).toLocaleString("es-AR") };
  }
  const user = await dbQuery(env,
    "SELECT u.usuario,p.club_favorito FROM usuarios u LEFT JOIN perfiles p ON p.usuario_id=u.id WHERE u.id=$1",
    [uid]
  );
  if (!user.rows.length) return { error: "Cuenta inexistente" };
  if (!user.rows[0].club_favorito) return { error: "Primero elegí tu club favorito para completar el perfil" };
  const inserted = await dbQuery(env,
    "INSERT INTO chat_mensajes(usuario_id,usuario,mensaje) VALUES($1,$2,$3) RETURNING id,usuario,mensaje,creado",
    [uid, user.rows[0].usuario, value]
  );
  return { ok: 1, mensaje: { ...inserted.rows[0], club_favorito: user.rows[0].club_favorito } };
}
export async function deleteMessage(env, uid, id, owner, moderator) {
  const messageId = Math.floor(Number(id));
  if (!(uid > 0 && messageId > 0)) return { error: "Comentario inválido" };
  const result = await dbQuery(env,
    "SELECT usuario_id FROM chat_mensajes WHERE id=$1 AND eliminado=false",
    [messageId]
  );
  const row = result.rows[0];
  if (!row) return { error: "El comentario ya no existe" };
  row.es_owner = isOwnerId(row.usuario_id, env);
  if (row.es_owner && !owner) return { error: "Solo el propietario puede eliminar sus propios comentarios" };
  if (!owner && !moderator) return { error: "No tenés permisos para eliminar comentarios" };
  if (moderator && !owner && Number(row.usuario_id) !== Number(uid) && row.es_owner) {
    return { error: "No podés eliminar comentarios del propietario" };
  }
  await dbQuery(env, "UPDATE chat_mensajes SET eliminado=true WHERE id=$1", [messageId]);
  await dbQuery(env, "DELETE FROM chat_reacciones WHERE mensaje_id=$1", [messageId]);
  return { ok: 1, id: messageId };
}
export async function vote(env, uid, id, value) {
  const messageId = Math.floor(Number(id)), reaction = Math.floor(Number(value));
  if (!(uid > 0 && messageId > 0) || ![1, -1].includes(reaction)) return { error: "Reacción inválida" };
  const message = await dbQuery(env,
    "SELECT usuario_id FROM chat_mensajes WHERE id=$1 AND eliminado=false", [messageId]);
  if (!message.rows.length) return { error: "El mensaje ya no está disponible" };
  if (Number(message.rows[0].usuario_id) === Number(uid)) return { error: "No podés reaccionar a tu propio mensaje" };
  const removed = await dbQuery(env,
    "DELETE FROM chat_reacciones WHERE mensaje_id=$1 AND usuario_id=$2 AND valor=$3 RETURNING mensaje_id",
    [messageId, uid, reaction]
  );
  if (!removed.rows.length) await dbQuery(env,
    "INSERT INTO chat_reacciones(mensaje_id,usuario_id,valor) VALUES($1,$2,$3) ON CONFLICT(mensaje_id,usuario_id) DO UPDATE SET valor=EXCLUDED.valor,creada=now()",
    [messageId, uid, reaction]
  );
  const totals = await dbQuery(env,
    "SELECT COUNT(*) FILTER(WHERE valor=1)::int AS likes,COUNT(*) FILTER(WHERE valor=-1)::int AS dislikes,COALESCE(MAX(valor) FILTER(WHERE usuario_id=$2),0)::int AS mi_voto FROM chat_reacciones WHERE mensaje_id=$1",
    [messageId, uid]
  );
  return { ok: 1, reaccion: { id: messageId, ...totals.rows[0] } };
}
export async function reactionUsers(env, id, value) {
  const messageId = Math.floor(Number(id)), reaction = Math.floor(Number(value));
  if (!(messageId > 0) || ![1, -1].includes(reaction)) return { error: "Reacción inválida" };
  const result = await dbQuery(env,
    "SELECT u.usuario FROM chat_reacciones cr JOIN usuarios u ON u.id=cr.usuario_id WHERE cr.mensaje_id=$1 AND cr.valor=$2 ORDER BY cr.creada DESC,u.usuario ASC",
    [messageId, reaction]
  );
  return { ok: 1, usuarios: result.rows.map(row => row.usuario) };
}
export async function moderate(env, actor, username, action, minutes, reason) {
  const targetName = String(username || "").trim();
  if (!USER_RE.test(targetName)) return { error: "Usuario inválido" };
  const targetResult = await dbQuery(env, "SELECT id,usuario FROM usuarios WHERE usuario_lc=$1", [targetName.toLowerCase()]);
  const target = targetResult.rows[0];
  if (!target) return { error: "No existe ese usuario" };
  if (isOwner(target, env)) return { error: "No se puede sancionar al propietario" };
  if (Number(target.id) === Number(actor)) return { error: "Participante inválido" };
  // Jerarquía: una sanción aplicada por el propietario (por_id) solo la puede cambiar o levantar el propietario.
  if (["silenciar", "suspender", "reactivar"].includes(action) && !isOwnerId(actor, env)) {
    const current = await dbQuery(env, "SELECT por_id FROM chat_sanciones WHERE usuario_id=$1", [target.id]);
    const row = current.rows[0];
    if (row && isOwnerId(row.por_id, env)) return { error: "Esa sanción la aplicó el propietario; solo él puede modificarla" };
  }
  const cleanReason = String(reason || "").replace(/[<>\u0000-\u001f]/g, "").slice(0, 160);
  if (action === "silenciar") {
    const mins = Math.max(1, Math.min(10080, Math.floor(Number(minutes) || 10)));
    const until = new Date(Date.now() + mins * 60000).toISOString();
    await dbQuery(env,
      "INSERT INTO chat_sanciones(usuario_id,tipo,hasta,razon,por_id) VALUES($1,'mute',$2,$3,$4) ON CONFLICT(usuario_id) DO UPDATE SET tipo='mute',hasta=EXCLUDED.hasta,razon=EXCLUDED.razon,por_id=EXCLUDED.por_id,creada=now()",
      [target.id, until, cleanReason, actor]);
    return { ok: 1, hasta: until };
  }
  if (action === "suspender") {
    await dbQuery(env,
      "INSERT INTO chat_sanciones(usuario_id,tipo,hasta,razon,por_id) VALUES($1,'suspension',NULL,$2,$3) ON CONFLICT(usuario_id) DO UPDATE SET tipo='suspension',hasta=NULL,razon=EXCLUDED.razon,por_id=EXCLUDED.por_id,creada=now()",
      [target.id, cleanReason, actor]);
    return { ok: 1 };
  }
  if (action === "reactivar") {
    const result = await dbQuery(env, "DELETE FROM chat_sanciones WHERE usuario_id=$1 RETURNING usuario_id", [target.id]);
    return result.rows.length ? { ok: 1 } : { error: "El participante no tenía una sanción activa" };
  }
  if (action === "moderar") {
    await dbQuery(env, "INSERT INTO chat_moderadores(usuario_id,por_id) VALUES($1,$2) ON CONFLICT(usuario_id) DO NOTHING", [target.id, actor]);
    return { ok: 1 };
  }
  if (action === "desmoderar") {
    const result = await dbQuery(env, "DELETE FROM chat_moderadores WHERE usuario_id=$1 RETURNING usuario_id", [target.id]);
    return result.rows.length ? { ok: 1 } : { error: "Ese usuario no era moderador" };
  }
  return { error: "Acción de moderación inválida" };
}
