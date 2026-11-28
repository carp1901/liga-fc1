// Tests del guard de destino Neon (tests/neon-guard.mjs). Sin red ni base de datos: un `sql` falso
// registra cada consulta y responde lo que informaría el servidor.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { verificarDestinoNeon, PROD_BRANCH_ID, GuardError } from "./neon-guard.mjs";

const PROYECTO = "falling-mountain-37997500", RAMA = "br-prueba-abc123";
const envOk = { NEON_TEST_PROJECT_ID: PROYECTO, NEON_TEST_BRANCH_ID: RAMA };
const escritura = q => /\b(INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|CREATE)\b/i.test(q);

function sqlFalso(fila) {
  const consultas = [];
  return { consultas, query: async (q) => { consultas.push(q); return { rows: fila === undefined ? [] : [fila] }; } };
}

async function aborta(env, fila, motivo) {
  const sql = sqlFalso(fila);
  await assert.rejects(verificarDestinoNeon(sql, env), e => e instanceof GuardError && motivo.test(e.message));
  assert.equal(sql.consultas.filter(escritura).length, 0, "el guard no escribe nada");
  return sql;
}

test("destino correcto: pasa, con una sola consulta de solo lectura", async () => {
  const sql = sqlFalso({ p: PROYECTO, b: RAMA });
  assert.deepEqual(await verificarDestinoNeon(sql, envOk), { proyecto: PROYECTO, rama: RAMA });
  assert.equal(sql.consultas.length, 1);
  assert.ok(!escritura(sql.consultas[0]) && /current_setting\('neon\.project_id', true\)/.test(sql.consultas[0]) && /current_setting\('neon\.branch_id', true\)/.test(sql.consultas[0]));
});

test("faltan o son inválidas las variables esperadas: aborta sin consultar", async () => {
  for (const env of [{}, { NEON_TEST_PROJECT_ID: PROYECTO }, { NEON_TEST_BRANCH_ID: RAMA }, { ...envOk, NEON_TEST_BRANCH_ID: "pr92-ensayo" }, { ...envOk, NEON_TEST_PROJECT_ID: "x y" }, { ...envOk, NEON_TEST_BRANCH_ID: "br-; DROP" }]) {
    const sql = await aborta(env, { p: PROYECTO, b: RAMA }, /NEON_TEST_(PROJECT|BRANCH)_ID/);
    assert.equal(sql.consultas.length, 0, "no llega a consultar la base");
  }
});

test("la rama esperada configurada es producción: aborta sin consultar", async () => {
  const sql = await aborta({ ...envOk, NEON_TEST_BRANCH_ID: PROD_BRANCH_ID }, { p: PROYECTO, b: PROD_BRANCH_ID }, /producción/);
  assert.equal(sql.consultas.length, 0);
});

test("el servidor no informa proyecto o rama (no es Neon o no se puede verificar): aborta", async () => {
  await aborta(envOk, { p: null, b: null }, /no informa/);
  await aborta(envOk, { p: PROYECTO, b: null }, /no informa/);
  await aborta(envOk, { p: "", b: RAMA }, /no informa/);
  await aborta(envOk, undefined, /no informa/);
});

test("el servidor dice que es la rama de producción: aborta aunque la configuración diga otra cosa", async () => {
  await aborta(envOk, { p: PROYECTO, b: PROD_BRANCH_ID }, /rama de producción/);
});

test("proyecto o rama distintos de los esperados: aborta", async () => {
  await aborta(envOk, { p: "otro-proyecto-123", b: RAMA }, /no es el esperado/);
  await aborta(envOk, { p: PROYECTO, b: "br-otra-rama-999" }, /no es el esperado/);
});

test("el script de integración real aborta (código 2) antes de conectarse si el guard no puede verificar", () => {
  const script = fileURLToPath(new URL("./neon-worker-integration.mjs", import.meta.url));
  // URL ficticia a un host inexistente: si el guard dejara pasar, el script intentaría conectarse y fallaría distinto.
  const env = { ...process.env, NEON_TEST_DATABASE_URL: "postgresql://u:p@guard-test.invalid/db", NEON_TEST_PROJECT_ID: "", NEON_TEST_BRANCH_ID: "" };
  const r = spawnSync(process.execPath, [script], { env, encoding: "utf8", timeout: 60000 });
  assert.equal(r.status, 2, "sale con código 2: " + r.stderr);
  assert.match(r.stderr, /GUARD: falta o es inválido NEON_TEST_PROJECT_ID\. No se escribió nada\./);
  assert.doesNotMatch(r.stdout, /CLEANUP_OK|INTEGRATION_OK/);
});
