import { dbQuery } from "./db.mjs";

const USER_RE = /^[A-Za-z0-9_.-]{3,16}$/;
const RESERVED = /^(admin|administrador|invitado|guest|cpu|anonimo|sistema|ligafc)$/i;
const SESSION_DAYS = 90;
const PBKDF2_ITERATIONS = 100000;
const encoder = new TextEncoder();
const USER_CACHE = new Map();

function bytesToHex(bytes) {
  return Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
}
function hexToBytes(value) {
  if (!/^(?:[0-9a-f]{2})+$/i.test(value)) return new Uint8Array();
  return Uint8Array.from(value.match(/.{2}/g), byte => parseInt(byte, 16));
}
function randomHex(size) {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}
async function sha256(value) {
  return bytesToHex(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(String(value)))));
}
async function derivePassword(password, salt, iterations = PBKDF2_ITERATIONS) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256
  );
  return new Uint8Array(bits);
}
function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePassword(password, salt);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${bytesToHex(salt)}$${bytesToHex(hash)}`;
}
async function verifyPassword(password, encoded) {
  const [algorithm, roundsText, saltText, hashText] = String(encoded || "").split("$");
  const rounds = Number(roundsText);
  if (algorithm !== "pbkdf2" || !Number.isInteger(rounds) || rounds < 100000 || rounds > 100000
      || !saltText || !hashText) {
    // Same-cost dummy derivation for unknown users or malformed stored hashes.
    const dummy = await derivePassword(password, new Uint8Array(16));
    return constantTimeEqual(dummy, new Uint8Array(32)) && false;
  }
  const actual = await derivePassword(password, hexToBytes(saltText), rounds);
  return constantTimeEqual(actual, hexToBytes(hashText));
}
async function createSession(env, userId) {
  const token = randomHex(32);
  await dbQuery(env,
    "INSERT INTO sesiones(token_hash, usuario_id, vence) VALUES($1,$2,$3)",
    [await sha256(token), userId, new Date(Date.now() + SESSION_DAYS * 864e5).toISOString()]
  );
  return token;
}

export async function register(env, username, password) {
  const usuario = String(username || "").trim();
  const clave = String(password || "");
  if (!USER_RE.test(usuario)) return { error: "El usuario debe tener entre 3 y 16 caracteres: letras, números, _ . -" };
  if (RESERVED.test(usuario)) return { error: "Ese nombre está reservado; elegí otro" };
  if (clave.length < 6 || clave.length > 72) return { error: "La contraseña debe tener entre 6 y 72 caracteres" };

  const encoded = await hashPassword(clave);
  const result = await dbQuery(env,
    "INSERT INTO usuarios(usuario, usuario_lc, pass_hash) VALUES($1,$2,$3) ON CONFLICT (usuario_lc) DO NOTHING RETURNING id, usuario",
    [usuario, usuario.toLowerCase(), encoded]
  );
  const user = result.rows[0];
  if (!user) return { error: "Ese usuario ya existe" };
  return { token: await createSession(env, user.id), usuario: user.usuario };
}

export async function login(env, username, password) {
  const usuario = String(username || "").trim();
  const clave = String(password || "");
  const result = await dbQuery(env,
    "SELECT id, usuario, pass_hash FROM usuarios WHERE usuario_lc=$1",
    [usuario.toLowerCase()]
  );
  const user = result.rows[0];
  const valid = await verifyPassword(clave, user ? user.pass_hash : "");
  if (!user || !valid) return { error: "Usuario o contraseña incorrectos" };

  await dbQuery(env, "UPDATE usuarios SET ultimo_ingreso=now() WHERE id=$1", [user.id]);
  await dbQuery(env, "DELETE FROM sesiones WHERE vence<now()", []);
  return { token: await createSession(env, user.id), usuario: user.usuario };
}

export async function userByToken(env, token) {
  if (typeof token !== "string" || !token || token.length > 128) return null;
  const hash = await sha256(token);
  const cached = USER_CACHE.get(hash);
  if (cached && cached.expires > Date.now()) return { id: cached.id, usuario: cached.usuario };

  const result = await dbQuery(env,
    "SELECT u.id, u.usuario FROM sesiones s JOIN usuarios u ON u.id=s.usuario_id WHERE s.token_hash=$1 AND s.vence>now()",
    [hash]
  );
  const user = result.rows[0];
  if (!user) {
    USER_CACHE.delete(hash);
    return null;
  }
  USER_CACHE.set(hash, { id: user.id, usuario: user.usuario, expires: Date.now() + 30000 });
  return { id: user.id, usuario: user.usuario };
}

export async function logout(env, token) {
  if (typeof token !== "string" || !token || token.length > 128) return;
  const hash = await sha256(token);
  USER_CACHE.delete(hash);
  await dbQuery(env, "DELETE FROM sesiones WHERE token_hash=$1", [hash]);
}

export function tokenFromRequest(request, body) {
  const header = String(request.headers.get("authorization") || "");
  return header.startsWith("Bearer ") ? header.slice(7).trim() : String(body?.tok || "");
}
