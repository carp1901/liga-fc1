import { neon } from "@neondatabase/serverless";

// Neon HTTP transport: each query is parameterized and does not keep TCP/WebSocket
// connections alive between Worker invocations.
export async function dbQuery(env, statement, params = []) {
  if (typeof env.__DB_QUERY__ === "function") {
    return env.__DB_QUERY__(statement, params);
  }
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL no está configurada");
  const sql = neon(env.DATABASE_URL, { fullResults: true });
  const result = await sql.query(statement, params);
  return {
    rows: result.rows || [],
    rowCount: Number.isInteger(result.rowCount) ? result.rowCount : (result.rows || []).length
  };
}
