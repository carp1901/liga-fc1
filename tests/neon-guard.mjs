// Guard del test de integración Worker + Neon: antes de cualquier escritura o eliminación, verifica
// inequívocamente a qué proyecto y rama de Neon apunta la conexión.
//
// No se basa en el nombre de la variable, en el nombre de la rama ni en la URL: lee la identidad que
// informa el propio servidor de Postgres de Neon (neon.project_id y neon.branch_id). Neon los fija en la
// configuración del compute al arrancar (contexto «postmaster»): una sesión no puede cambiarlos con SET.
// En un Postgres que no sea de Neon no existen y current_setting(..., true) devuelve NULL: también aborta.
//
// Se cierra ante cualquier duda: si falta un dato, si un valor está mal formado, si el destino no coincide
// con el esperado o si es la rama de producción, lanza un error y el test no escribe nada.

// Rama «production» del proyecto clash-futbol-db. Lista de bloqueo fija, independiente de la configuración.
export const PROD_BRANCH_ID = "br-royal-night-bb56tn8k";

export class GuardError extends Error {}

const fallo = mensaje => { throw new GuardError(mensaje); };

export async function verificarDestinoNeon(sql, env) {
  const esperadoProyecto = env.NEON_TEST_PROJECT_ID;
  const esperadoRama = env.NEON_TEST_BRANCH_ID;
  if (!/^[a-z0-9-]{1,60}$/.test(esperadoProyecto || "")) fallo("falta o es inválido NEON_TEST_PROJECT_ID");
  if (!/^br-[a-z0-9-]{1,60}$/.test(esperadoRama || "")) fallo("falta o es inválido NEON_TEST_BRANCH_ID");
  if (esperadoRama === PROD_BRANCH_ID) fallo("NEON_TEST_BRANCH_ID es la rama de producción");

  // Única consulta del guard: solo lectura.
  const res = await sql.query("SELECT current_setting('neon.project_id', true) AS p, current_setting('neon.branch_id', true) AS b", []);
  const fila = (res && res.rows && res.rows[0]) || {};
  const proyecto = fila.p, rama = fila.b;
  if (!proyecto || !rama) fallo("el servidor no informa proyecto o rama de Neon: no se puede verificar el destino");
  if (rama === PROD_BRANCH_ID) fallo("la conexión apunta a la rama de producción");
  if (proyecto !== esperadoProyecto || rama !== esperadoRama) fallo(`el destino no es el esperado (servidor: ${proyecto}/${rama})`);
  return { proyecto, rama };
}
