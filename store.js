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
const INSERT=`INSERT INTO titulos(torneo_id,club,club_nombre,dt,modalidad,competicion,competicion_nombre,formato,participantes,finalizado,verificacion)
 VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (torneo_id) DO NOTHING RETURNING id`;
// Para rankings: se leen los títulos válidos y se agrupan en JS (rankRows). Consulta simple a propósito.
const ALL=`SELECT torneo_id,club,club_nombre,modalidad,competicion,competicion_nombre,formato,participantes,finalizado FROM titulos WHERE estado='valido' ORDER BY finalizado, id`;
const LIST=`SELECT id,torneo_id,club,club_nombre,dt,modalidad,competicion,competicion_nombre,formato,participantes,verificacion,estado,finalizado
 FROM titulos WHERE estado='valido' ORDER BY finalizado DESC, id DESC LIMIT $1`;
const COUNT=`SELECT count(*)::int AS n FROM titulos WHERE estado='valido'`;

let pool=null,configured=false,schemaP=null,lastErr='',cache=null;
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
  const r=await pool.query(INSERT,[rec.tid,rec.club,rec.clubNombre,rec.dt||null,rec.mod,rec.comp,rec.compNombre,rec.fmt,rec.n,new Date(rec.at||Date.now()).toISOString(),rec.ver||'pid-navegador']);
  cache=null;lastErr='';return r.rowCount>0?{status:'inserted'}:{status:'duplicate'};
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
// Ranking: títulos por club. mod: online (clásico+barrial) | clasico | barrial | offline. comp: id de competición/división. fmt: liga | copa.
// Empates: comparten posición (1,1,3…) y se listan por orden alfabético.
function rankRows(rows,f){
  f=f||{};const mod=f.mod||'online';
  const pass=r=>(mod=='online'?(r.modalidad=='clasico'||r.modalidad=='barrial'):r.modalidad==mod)&&(!f.comp||r.competicion==f.comp)&&(!f.fmt||(f.fmt=='copa'?r.formato=='copa':String(r.formato).startsWith('liga')));
  const by=new Map();let total=0;
  for(const r of rows){if(!pass(r))continue;total++;const t=new Date(r.finalizado).getTime()||0,x=by.get(r.club);
    if(x){x.titulos++;if(t>=x.t){x.t=t;x.nombre=r.club_nombre}}else by.set(r.club,{club:r.club,nombre:r.club_nombre,titulos:1,t})}
  const a=[...by.values()].sort((p,q)=>q.titulos-p.titulos||String(p.nombre).localeCompare(String(q.nombre),'es'));
  let pos=0;a.forEach((x,i)=>{if(i==0||x.titulos!=a[i-1].titulos)pos=i+1;x.pos=pos});
  a.forEach(x=>{x.empate=a.filter(y=>y.pos==x.pos).length>1;x.ultimo=x.t?new Date(x.t).toISOString():null;delete x.t});
  return{total,rows:a};
}
async function allRows(){await ensure();if(!cache||Date.now()-cache.at>10000)cache={at:Date.now(),rows:(await pool.query(ALL)).rows};return cache.rows}
async function ranking(f){
  if(!configured)return{enabled:false,total:0,rows:[]};
  return{enabled:true,...rankRows(await allRows(),f)};
}
// Ficha de un club: totales por modalidad, posición en cada ranking, competiciones ganadas e historial reciente. Todo sale del mismo registro que los rankings (mismas cifras).
function clubStats(rows,id){
  const mine=rows.filter(r=>r.club==id),isOn=r=>r.modalidad=='clasico'||r.modalidad=='barrial',MODS=['online','clasico','barrial','offline'];
  const totales={};for(const m of MODS)totales[m]=mine.filter(r=>m=='online'?isOn(r):r.modalidad==m).length;
  const posiciones={};for(const m of MODS){const rk=rankRows(rows,{mod:m}),x=rk.rows.find(y=>y.club==id);posiciones[m]=x?{pos:x.pos,de:rk.rows.length,empate:x.empate}:null}
  const g=new Map();for(const r of mine){const k=r.modalidad+'|'+r.competicion,t=new Date(r.finalizado).getTime()||0,x=g.get(k);if(x){x.titulos++;if(t>x.t)x.t=t}else g.set(k,{mod:r.modalidad,comp:r.competicion,nombre:r.competicion_nombre||r.competicion,titulos:1,t})}
  const competiciones=[...g.values()].map(x=>{const rk=rankRows(rows,{mod:x.mod,comp:x.comp}),y=rk.rows.find(z=>z.club==id);return{mod:x.mod,comp:x.comp,nombre:x.nombre,titulos:x.titulos,ultimo:x.t?new Date(x.t).toISOString():null,pos:y?y.pos:null,empate:y?y.empate:false,de:rk.rows.length}}).sort((a,b)=>b.titulos-a.titulos||String(a.nombre).localeCompare(String(b.nombre),'es'));
  const historial=mine.slice().sort((a,b)=>new Date(b.finalizado)-new Date(a.finalizado)).slice(0,20).map(r=>({tid:r.torneo_id,fecha:new Date(r.finalizado).toISOString(),mod:r.modalidad,comp:r.competicion,nombre:r.competicion_nombre||r.competicion,fmt:r.formato}));
  return{totales,posiciones,competiciones,historial};
}
// Datos de UN título validado para armar la tarjeta para compartir. Sale solo del registro del servidor (nunca de texto del navegador).
// numero = posición de este título entre los del club en su grupo (online = clásico + barrial; offline aparte), por fecha de finalización.
function tituloInfo(rows,tid){
  const r=rows.find(x=>x.torneo_id==tid);if(!r)return null;
  const g=x=>x.modalidad=='offline'?'offline':'online',same=rows.filter(x=>x.club==r.club&&g(x)==g(r)).sort((a,b)=>new Date(a.finalizado)-new Date(b.finalizado));
  return{tid,club:r.club,nombre:r.club_nombre,mod:r.modalidad,comp:r.competicion,compNombre:r.competicion_nombre||r.competicion,fmt:r.formato,fecha:new Date(r.finalizado).toISOString(),participantes:r.participantes,numero:same.findIndex(x=>x.torneo_id==tid)+1,de:same.length};
}
async function titulo(tid){
  if(!configured)return{enabled:false};
  const i=tituloInfo(await allRows(),tid);return i?{enabled:true,...i}:{enabled:true,error:'Título inexistente'};
}
async function club(id){
  if(!configured)return{enabled:false};
  return{enabled:true,...clubStats(await allRows(),id)};
}
// Un solo intento (para pedidos HTTP; el cliente reintenta si falla).
const insert=rec=>configured?insertOnce(rec):Promise.resolve({status:'disabled'});
const status=()=>!configured?'off':lastErr?'error':'ok';
module.exports={init,register,insert,list,ranking,rankRows,club,clubStats,titulo,tituloInfo,status,SCHEMA,INSERT,LIST,COUNT,ALL};
