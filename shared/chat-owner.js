// Propietario del chat: UNA sola regla para el servidor Node (server.js, store.js) y el Worker (src/chat.mjs).
// Se identifica SOLO por el id inmutable de la cuenta (usuarios.id), cargado en el secreto/variable CHAT_OWNER_ID.
// Nunca por nombre de usuario. Si falta o no es un entero positivo válido, nadie es propietario.
'use strict';
const OWNER_ID_RE = /^[1-9][0-9]{0,15}$/;
let warned = false;

function ownerId(env) {
  const raw = String(env && env.CHAT_OWNER_ID != null ? env.CHAT_OWNER_ID : '').trim();
  const id = Number(raw);
  if (OWNER_ID_RE.test(raw) && Number.isSafeInteger(id)) return id;
  if (!warned) {
    warned = true;
    // No se registra el valor del secreto: solo que falta o es inválido.
    console.warn('chat: CHAT_OWNER_ID ausente o inválido; nadie tiene permisos de propietario');
  }
  return null;
}
function isOwnerId(id, env) {
  const owner = ownerId(env);
  return owner !== null && id != null && String(id).trim() !== '' && Number(id) === owner;
}
// Jerarquía de sanciones: una sanción aplicada por el propietario (por_id) solo la puede cambiar o levantar el propietario.
function blockedBySanctionHierarchy(actorId, sanctionAuthorId, env) {
  return !isOwnerId(actorId, env) && isOwnerId(sanctionAuthorId, env);
}
module.exports = { ownerId, isOwnerId, blockedBySanctionHierarchy, OWNER_ID_RE };
