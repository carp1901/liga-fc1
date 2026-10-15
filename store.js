// Palmarés permanente en PostgreSQL (Railway). Usa la variable DATABASE_URL y el paquete "pg".
// Solo lo usa server.js; NO está dentro de /public (no se sirve al navegador).
// Un título = una fila. torneo_id es UNIQUE: aunque el servidor reintente o se reconecte, un torneo registra un solo título.
const SCHEMA=`
CREATE TABLE IF NOT EXISTS titulos(
 id SERIAL PRIMARY KEY,
 torneo_id TEXT NOT NULL UNIQUE,
 club TEXT NOT NULL,
 club_nombre TEXT NOT NULL,
 dt TEXT,
 modalidad TEXT NOT NULL,
 competicion TEXT NOT NULL,
 competicion_nombre TEXT NOT NULL,
 formato TEXT NOT NULL,
 participantes INTEGER NOT NULL,
 verificacion TEXT NOT NULL DEFAULT 'pid-navegador',
 estado TEXT NOT NULL DEFAULT 'valido',
 finalizado TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS titulos_club_idx ON titulos(club);
CREATE INDEX IF NOT EXISTS titulos_comp_idx ON titulos(modalidad, competicion);
`;
const INSERT=`INSERT INTO titulos(torneo_id,club,club_nombre,dt,modalidad,competicion,competicion_nombre,formato,participantes,finalizado)
 VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (torneo_id) DO NOTHING RETURNING id`;
const LIST=`SELECT id,torneo_id,club,club_nombre,dt,modalidad,competicion,competicion_nombre,formato,participantes,verificacion,estado,finalizado
 FROM titulos WHERE estado='valido' ORDER BY finalizado DESC, id DESC LIMIT $1`;
const COUNT=`SELECT count(*)::int AS n FROM titulos WHERE estado='valido'`;

let pool=null,configured=false,schemaP=null,lastErr='';
const RETRIES=+process.env.TITLE_RETRIES||20,RETRY_MS=+process.env.TITLE_RETRY_MS||30000;

function sslFor(url){
  if(process.env.PGSSL==='0')return false;if(process.env.PGSSL==='1')return{rejectUnauthorized:false};
  if(/sslmode=disable/.test(url))return false;
  let h='';try{h=new URL(url).hostname}catch(e){}
  return(/\.railway\.internal$|^localhost$|^127\./.test(h))?false:{rejectUnauthorized:false}; // el proxy público de Railway exige SSL; la red interna no
}
// opts.pool permite inyectar un pool de prueba
function init(opts){
  opts=opts||{};
  if(opts.pool){pool=opts.pool;configured=true}
  else{
    const url=process.env.DATABASE_URL;
    if(!url){console.log('palmarés: sin DATABASE_URL → los títulos NO se guardan');return Promise.resolve(false)}
    let pg;try{pg=require('pg')}catch(e){console.error('palmarés: falta el paquete "pg" (package.json) → los títulos NO se guardan');lastErr='falta pg';return Promise.resolve(false)}
    pool=new pg.Pool({connectionString:url,ssl:sslFor(url),max:4,connectionTimeoutMillis:8000,idleTimeoutMillis:30000});
    pool.on('error',e=>{lastErr=e.message});configured=true;
  }
  return ensure().then(()=>{console.log('palmarés: PostgreSQL listo (tabla titulos)');return true},e=>{console.error('palmarés: no se pudo preparar la tabla (se reintenta al registrar):',e.message);return false});
}
const ensure=()=>schemaP||(schemaP=pool.query(SCHEMA).then(()=>{lastErr=''}).catch(e=>{schemaP=null;lastErr=e.message;throw e}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function insertOnce(rec){
  await ensure();
  const r=await pool.query(INSERT,[rec.tid,rec.club,rec.clubNombre,rec.dt||null,rec.mod,rec.comp,rec.compNombre,rec.fmt,rec.n,new Date(rec.at||Date.now()).toISOString()]);
  lastErr='';return r.rowCount>0?{status:'inserted'}:{status:'duplicate'};
}
// Registra el título. Si la base no responde, reintenta (la fila es idempotente por torneo_id).
async function register(rec){
  if(!configured)return{status:'disabled'};
  let err;
  for(let i=0;i<RETRIES;i++){
    try{return await insertOnce(rec)}catch(e){err=e;lastErr=e.message;console.error('palmarés: intento '+(i+1)+' falló:',e.message);if(i<RETRIES-1)await sleep(RETRY_MS)}
  }
  throw err;
}
async function list(limit){
  if(!configured)return{enabled:false,total:0,titulos:[]};
  await ensure();
  const [a,b]=await Promise.all([pool.query(LIST,[Math.max(1,Math.min(500,+limit||100))]),pool.query(COUNT)]);
  return{enabled:true,total:b.rows[0].n,titulos:a.rows};
}
const status=()=>!configured?'off':lastErr?'error':'ok';
module.exports={init,register,list,status,SCHEMA,INSERT,LIST,COUNT};
