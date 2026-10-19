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
CREATE TABLE IF NOT EXISTS usuarios(
 id SERIAL PRIMARY KEY,
 usuario TEXT NOT NULL,
 usuario_lc TEXT NOT NULL UNIQUE,
 pass_hash TEXT NOT NULL,
 creado TIMESTAMPTZ NOT NULL DEFAULT now(),
 ultimo_ingreso TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS sesiones(
 token_hash TEXT PRIMARY KEY,
 usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
 creada TIMESTAMPTZ NOT NULL DEFAULT now(),
 vence TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS sesiones_usuario_idx ON sesiones(usuario_id);
CREATE TABLE IF NOT EXISTS carreras(
 id SERIAL PRIMARY KEY,
 usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
 torneo_id TEXT NOT NULL,
 club TEXT NOT NULL,
 club_nombre TEXT,
 modalidad TEXT NOT NULL,
 origen TEXT,
 competicion TEXT,
 competicion_nombre TEXT,
 formato TEXT,
 participantes INTEGER,
 posicion INTEGER,
 resultado TEXT,
 campeon BOOLEAN NOT NULL DEFAULT false,
 pj INTEGER, g INTEGER, e INTEGER, p INTEGER, gf INTEGER, gc INTEGER, pts INTEGER,
 finalizado TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE(usuario_id, torneo_id)
);
CREATE INDEX IF NOT EXISTS carreras_usuario_idx ON carreras(usuario_id, finalizado DESC);
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
// ===================== CUENTAS (usuario + contraseña) E HISTORIAL DE CARRERAS =====================
// Las cuentas son opcionales: quien juega de invitado no pasa por nada de esto. La contraseña se guarda con scrypt + sal (nunca en claro) y la sesión es un
// token aleatorio del que solo se guarda el hash. Todo requiere la base de datos (DATABASE_URL); sin ella las cuentas no están disponibles.
const crypto=require('crypto');
const USER_RE=/^[A-Za-z0-9_.-]{3,16}$/,RESERVED=/^(admin|administrador|invitado|guest|cpu|anonimo|sistema|ligafc)$/i,SESS_DAYS=90;
const sha=x=>crypto.createHash('sha256').update(String(x)).digest('hex');
const scryptP=(pw,salt)=>new Promise((ok,no)=>crypto.scrypt(pw,salt,64,{N:16384,r:8,p:1},(e,k)=>e?no(e):ok(k)));
async function hashPw(pw){const salt=crypto.randomBytes(16),k=await scryptP(pw,salt);return'scrypt$'+salt.toString('hex')+'$'+k.toString('hex')}
async function checkPw(pw,h){const [alg,sl,k]=String(h).split('$');if(alg!='scrypt'||!sl||!k)return false;const a=Buffer.from(k,'hex'),b=await scryptP(pw,Buffer.from(sl,'hex'));return a.length==b.length&&crypto.timingSafeEqual(a,b)}
const DUMMY_HASH='scrypt$'+'00'.repeat(16)+'$'+'00'.repeat(64),UCACHE=new Map();   // UCACHE: hash de token -> usuario, 60 s (evita consultar la base en cada acción)
async function newSession(uid){const tok=crypto.randomBytes(32).toString('hex');await pool.query(`INSERT INTO sesiones(token_hash,usuario_id,vence) VALUES($1,$2,$3)`,[sha(tok),uid,new Date(Date.now()+SESS_DAYS*864e5).toISOString()]);return tok}
async function registrar(usuario,clave){
  if(!configured)return{error:'Las cuentas no están disponibles en este servidor'};
  usuario=String(usuario||'').trim();clave=String(clave||'');
  if(!USER_RE.test(usuario))return{error:'El usuario debe tener entre 3 y 16 caracteres: letras, números, _ . -'};
  if(RESERVED.test(usuario))return{error:'Ese nombre está reservado; elegí otro'};
  if(clave.length<6||clave.length>72)return{error:'La contraseña debe tener entre 6 y 72 caracteres'};
  await ensure();const h=await hashPw(clave);
  const r=await pool.query(`INSERT INTO usuarios(usuario,usuario_lc,pass_hash) VALUES($1,$2,$3) ON CONFLICT (usuario_lc) DO NOTHING RETURNING id,usuario`,[usuario,usuario.toLowerCase(),h]);
  if(!r.rowCount)return{error:'Ese usuario ya existe'};
  return{token:await newSession(r.rows[0].id),usuario:r.rows[0].usuario}}
async function login(usuario,clave){
  if(!configured)return{error:'Las cuentas no están disponibles en este servidor'};
  usuario=String(usuario||'').trim();clave=String(clave||'');await ensure();
  const r=await pool.query(`SELECT id,usuario,pass_hash FROM usuarios WHERE usuario_lc=$1`,[usuario.toLowerCase()]),u=r.rows[0];
  const ok=await checkPw(clave,u?u.pass_hash:DUMMY_HASH);   // el cálculo se hace siempre, exista o no el usuario: mismo tiempo y mismo mensaje
  if(!u||!ok)return{error:'Usuario o contraseña incorrectos'};
  await pool.query(`UPDATE usuarios SET ultimo_ingreso=now() WHERE id=$1`,[u.id]);pool.query(`DELETE FROM sesiones WHERE vence<now()`).catch(()=>{});
  return{token:await newSession(u.id),usuario:u.usuario}}
async function userByToken(tok){
  if(!configured||!tok||typeof tok!='string'||tok.length>128)return null;const k=sha(tok),c=UCACHE.get(k);if(c&&c.exp>Date.now())return{id:c.id,usuario:c.usuario};
  await ensure();const r=await pool.query(`SELECT u.id,u.usuario FROM sesiones s JOIN usuarios u ON u.id=s.usuario_id WHERE s.token_hash=$1 AND s.vence>now()`,[k]);
  if(!r.rowCount){UCACHE.delete(k);return null}UCACHE.set(k,{id:r.rows[0].id,usuario:r.rows[0].usuario,exp:Date.now()+60000});return{id:r.rows[0].id,usuario:r.rows[0].usuario}}
async function logout(tok){if(!configured||!tok||typeof tok!='string')return;const k=sha(tok);UCACHE.delete(k);await ensure();await pool.query(`DELETE FROM sesiones WHERE token_hash=$1`,[k])}
// Una fila por carrera terminada y por jugador con cuenta. UNIQUE(usuario_id,torneo_id): reintentos o reconexiones nunca duplican. Si la base falla, se reintenta unos segundos después.
async function addCareers(recs,att){att=att||0;if(!configured)return;const fail=[];
  try{await ensure()}catch(e){if(att<6)setTimeout(()=>addCareers(recs,att+1),5000).unref();return}
  for(const c of recs){if(!c.uid)continue;
    try{await pool.query(`INSERT INTO carreras(usuario_id,torneo_id,club,club_nombre,modalidad,origen,competicion,competicion_nombre,formato,participantes,posicion,resultado,campeon,pj,g,e,p,gf,gc,pts,finalizado)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) ON CONFLICT (usuario_id,torneo_id) DO NOTHING`,
      [c.uid,c.tid,c.club,c.clubNombre??null,c.mod,c.origen??null,c.comp??null,c.compNombre??null,c.fmt??null,c.n??null,c.pos??null,c.resultado??null,!!c.campeon,c.pj??null,c.g??null,c.e??null,c.p??null,c.gf??null,c.gc??null,c.pts??null,new Date(c.at||Date.now()).toISOString()])}
    catch(e){console.error('carrera no guardada:',e.message);fail.push(c)}}
  if(fail.length&&att<6)setTimeout(()=>addCareers(fail,att+1),5000).unref()}
async function perfil(uid){
  if(!configured)return{enabled:false};await ensure();
  const u=await pool.query(`SELECT usuario,creado FROM usuarios WHERE id=$1`,[uid]);if(!u.rowCount)return{error:'Usuario inexistente'};
  const [h,a]=await Promise.all([pool.query(`SELECT torneo_id,club,club_nombre,modalidad,origen,competicion,competicion_nombre,formato,participantes,posicion,resultado,campeon,pj,g,e,p,gf,gc,pts,finalizado FROM carreras WHERE usuario_id=$1 ORDER BY finalizado DESC, id DESC LIMIT 100`,[uid]),
    pool.query(`SELECT count(*)::int AS carreras, count(*) FILTER (WHERE campeon)::int AS campeonatos, count(*) FILTER (WHERE modalidad<>'offline')::int AS online, count(DISTINCT club)::int AS clubes FROM carreras WHERE usuario_id=$1`,[uid])]);
  const x=a.rows[0]||{};return{enabled:true,usuario:u.rows[0].usuario,creado:u.rows[0].creado,resumen:{carreras:x.carreras||0,campeonatos:x.campeonatos||0,online:x.online||0,offline:(x.carreras||0)-(x.online||0),clubes:x.clubes||0},historial:h.rows}}
module.exports={registrar,login,userByToken,logout,addCareers,perfil,USER_RE,init,register,insert,list,ranking,rankRows,club,clubStats,titulo,tituloInfo,status,SCHEMA,INSERT,LIST,COUNT,ALL};
