import { dbQuery } from "./db.mjs";
import Data from "../public/data.js";

// Mínimo de equipos para que una carrera offline sume al ranking: el mismo de P2 (public/data.js), sin copias propias.
export const MIN_EQUIPOS = Math.floor(Number(Data.MIN_EQUIPOS));
if (!(MIN_EQUIPOS > 0)) throw new Error("MIN_EQUIPOS inválido en public/data.js");
// Carreras que suman al ranking de técnicos: online competitivas (el motor decide «competitivo» con MIN_HUMANOS y MIN_EQUIPOS) u offline con al menos MIN_EQUIPOS equipos.
export function eligibleCareerSql(a = "c") {
  return "((" + a + ".competitivo=true AND " + a + ".modalidad IN ('clasico','barrial') AND " + a + ".origen<>'offline') OR (" + a + ".modalidad='offline' AND " + a + ".participantes >= " + MIN_EQUIPOS + "))";
}

export async function addCareers(env, records) {
  if (!Array.isArray(records)) return;
  for (const c of records) {
    if (!c || !Number.isSafeInteger(Number(c.uid)) || Number(c.uid)<1 || !c.tid) continue;
    await dbQuery(env,`INSERT INTO carreras(usuario_id,torneo_id,club,club_nombre,modalidad,origen,competicion,competicion_nombre,formato,participantes,posicion,resultado,campeon,pj,g,e,p,gf,gc,pts,competitivo,participantes_reales,finalizado)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
      ON CONFLICT(usuario_id,torneo_id) DO NOTHING`,
      [Number(c.uid),String(c.tid),String(c.club||""),c.clubNombre??null,String(c.mod||""),c.origen??null,c.comp??null,c.compNombre??null,c.fmt??null,c.n??null,c.pos??null,c.resultado??null,!!c.campeon,c.pj??null,c.g??null,c.e??null,c.p??null,c.gf??null,c.gc??null,c.pts??null,!!c.competitivo,Math.max(0,Math.floor(Number(c.humanos)||0)),new Date(c.at||Date.now()).toISOString()]);
  }
}
export async function addTitle(env,r) {
  const q=await dbQuery(env,`INSERT INTO titulos(torneo_id,club,club_nombre,dt,modalidad,competicion,competicion_nombre,formato,participantes,finalizado,verificacion)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT(torneo_id) DO NOTHING RETURNING id`,
    [r.tid,r.club,r.clubNombre,r.dt||null,r.mod,r.comp,r.compNombre,r.fmt,r.n,new Date(r.at||Date.now()).toISOString(),r.ver||"pid-navegador"]);
  return {status:q.rows.length?"inserted":"duplicate"};
}
export function offlineTitleRecord(b,D) {
  const tid=String(b.tid||""),comp=String(b.comp||""),club=String(b.club||""),fmt=String(b.fmt||""),n=Math.floor(Number(b.n));
  if(!/^[a-z0-9]{8,60}$/.test(tid))return "ID de torneo inválido";
  if(!["liga1","liga2","copa","mixto"].includes(fmt))return "Formato inválido";
  const cup=(D.CUPS||[]).find(x=>x.id===comp),dv=cup?null:(D.DIVS||[]).find(x=>x.id===comp&&x.ok),all=comp==="all",custom=comp==="custom",pers=["pers","real","custom"].includes(comp),real=comp==="real",arg=comp==="copaarg";
  const clubs=cup?cup.clubs:dv?dv.teams.map(x=>x.id):all?(D.DIVS||[]).flatMap(x=>x.teams.map(t=>t.id)):pers||arg?Object.keys(D.TM||{}):null;
  if(!clubs)return "Competición inválida"; if(!clubs.includes(club)||!D.TM?.[club])return "El club no pertenece a esa competición";
  if(!(n>=4&&n<=clubs.length))return "Cantidad de equipos inválida";
  if(pers&&!((real||custom?n<=40:n<=20&&n%2===0)&&fmt!=="copa"))return "Cantidad de equipos inválida";
  if(arg&&!(fmt==="copa"&&n===64))return "Cantidad de equipos inválida";
  return {tid,club,clubNombre:D.TM[club].name,dt:String(b.dt||"").replace(/[<>&"]/g,"").slice(0,16)||null,mod:"offline",comp:cup?cup.id:comp,compNombre:cup?cup.title:dv?dv.name:arg?"Copa Argentina":real?"Clásico realista":custom?(String(b.compNombre||"").trim()&&String(b.compNombre).trim()!=="custom"?String(b.compNombre).replace(/[<>&"]/g,"").slice(0,60):"Carrera personalizada"):pers?"Clásico personalizado":"Todas las divisiones",fmt,n,competitivo:n>=MIN_EQUIPOS,at:Date.now(),ver:"offline-informado"};
}
function country(r){const c=String(r.competicion||"").toLowerCase(),club=String(r.club||"").toLowerCase();if(club.startsWith("uy_"))return "Uruguay";if(club.startsWith("br_"))return "Brasil";if(c==="uy"||c.startsWith("uy1")||c.startsWith("uy2"))return "Uruguay";if(c==="br"||c.startsWith("br1")||c.startsWith("br2"))return "Brasil";return "Argentina";}
export function rankRows(rows,f={}) {
  const mod=f.mod||"online",pass=r=>(mod==="online"?(r.modalidad==="clasico"||r.modalidad==="barrial"):r.modalidad===mod)&&(!f.comp||(f.comp==="all"?/^(ar|uy|br)\d+$/i.test(String(r.competicion||"")):r.competicion===f.comp))&&(!f.country||country(r)===f.country)&&(!f.fmt||(f.fmt==="copa"?r.formato==="copa":f.fmt==="mixto"?r.formato==="mixto":String(r.formato).startsWith("liga")));
  const by=new Map();let total=0;for(const r of rows){if(!pass(r))continue;total++;const t=new Date(r.finalizado).getTime()||0,x=by.get(r.club);if(x){x.titulos++;if(t>=x.t){x.t=t;x.nombre=r.club_nombre;}}else by.set(r.club,{club:r.club,nombre:r.club_nombre,titulos:1,t});}
  const a=[...by.values()].sort((x,y)=>y.titulos-x.titulos||String(x.nombre).localeCompare(String(y.nombre),"es"));let pos=0;a.forEach((x,i)=>{if(i===0||x.titulos!==a[i-1].titulos)pos=i+1;x.pos=pos;});a.forEach(x=>{x.empate=a.filter(y=>y.pos===x.pos).length>1;x.ultimo=x.t?new Date(x.t).toISOString():null;delete x.t;});return {total,rows:a};
}
async function allTitles(env){return (await dbQuery(env,"SELECT torneo_id,club,club_nombre,modalidad,competicion,competicion_nombre,formato,participantes,finalizado FROM titulos WHERE estado='valido' ORDER BY finalizado,id",[])).rows;}
export async function rankingClubs(env,f={}){const all=await allTitles(env),year=Number(f.year)||0,rows=year?all.filter(r=>new Date(r.finalizado).getFullYear()===year):all;return {enabled:true,temporada:year||null,...rankRows(rows,f)};}
export async function club(env,id){
 const rows=await allTitles(env),mine=rows.filter(r=>r.club===id),isOn=r=>r.modalidad==="clasico"||r.modalidad==="barrial",mods=["online","clasico","barrial","offline"],totales={};
 for(const m of mods)totales[m]=mine.filter(r=>m==="online"?isOn(r):r.modalidad===m).length;
 const posiciones={};for(const m of mods){const q=rankRows(rows,{mod:m}),x=q.rows.find(y=>y.club===id);posiciones[m]=x?{pos:x.pos,de:q.rows.length,empate:x.empate}:null;}
 const groups=new Map();for(const r of mine){const k=r.modalidad+"|"+r.competicion,t=new Date(r.finalizado).getTime()||0,x=groups.get(k);if(x){x.titulos++;if(t>x.t)x.t=t;}else groups.set(k,{mod:r.modalidad,comp:r.competicion,nombre:r.competicion_nombre||r.competicion,titulos:1,t});}
 const competiciones=[...groups.values()].map(x=>{const q=rankRows(rows,{mod:x.mod,comp:x.comp}),y=q.rows.find(z=>z.club===id);return{mod:x.mod,comp:x.comp,nombre:x.nombre,titulos:x.titulos,ultimo:x.t?new Date(x.t).toISOString():null,pos:y?y.pos:null,empate:y?y.empate:false,de:q.rows.length};}).sort((a,b)=>b.titulos-a.titulos||String(a.nombre).localeCompare(String(b.nombre),"es"));
 const historial=mine.slice().sort((a,b)=>new Date(b.finalizado)-new Date(a.finalizado)).slice(0,20).map(r=>({tid:r.torneo_id,fecha:new Date(r.finalizado).toISOString(),mod:r.modalidad,comp:r.competicion,nombre:r.competicion_nombre||r.competicion,fmt:r.formato}));
 return {enabled:true,totales,posiciones,competiciones,historial};
}
export async function titleInfo(env,tid){
 const rows=await allTitles(env),r=rows.find(x=>x.torneo_id===tid);if(!r)return {enabled:true,error:"Título inexistente"};
 const g=x=>x.modalidad==="offline"?"offline":"online",same=rows.filter(x=>x.club===r.club&&g(x)===g(r)).sort((a,b)=>new Date(a.finalizado)-new Date(b.finalizado));
 return {enabled:true,tid,club:r.club,nombre:r.club_nombre,mod:r.modalidad,comp:r.competicion,compNombre:r.competicion_nombre||r.competicion,fmt:r.formato,fecha:new Date(r.finalizado).toISOString(),participantes:r.participantes,numero:same.findIndex(x=>x.torneo_id===tid)+1,de:same.length};
}
export async function listTitles(env,limit=100){const n=Math.max(1,Math.min(500,Math.floor(Number(limit)||100))),[a,b]=await Promise.all([dbQuery(env,"SELECT id,torneo_id,club,club_nombre,dt,modalidad,competicion,competicion_nombre,formato,participantes,verificacion,estado,finalizado FROM titulos WHERE estado='valido' ORDER BY finalizado DESC,id DESC LIMIT $1",[n]),dbQuery(env,"SELECT count(*)::int AS n FROM titulos WHERE estado='valido'",[])]);return {enabled:true,total:Number(b.rows[0]?.n||0),titulos:a.rows};}
export function pointsForCareer(c){const n=Math.max(1,Math.floor(Number(c.participantes)||0)),pos=Math.floor(Number(c.posicion)||0),fmt=String(c.formato||""),res=String(c.resultado||"").toLowerCase();if(fmt==="liga1"||fmt==="liga2")return pos>=1&&pos<=n?n-pos+1:0;let stage=7;if(res.includes("campeón"))stage=0;else if(res.includes("finalista"))stage=1;else if(res.includes("semifinal"))stage=2;else if(res.includes("cuartos"))stage=3;else if(res.includes("octavos"))stage=4;else if(res.includes("dieciseisavos"))stage=5;else if(res.includes("32avos"))stage=6;return Math.max(1,Math.ceil(n/Math.pow(2,stage)));}
const eligible=eligibleCareerSql;
export async function rankingCoaches(env,period="historico"){
 const year=new Date().getFullYear(),season=period==="temporada",r=await dbQuery(env,"SELECT u.usuario,p.club_favorito,c.torneo_id,c.formato,c.participantes,c.posicion,c.resultado,c.campeon,c.finalizado FROM carreras c JOIN usuarios u ON u.id=c.usuario_id LEFT JOIN perfiles p ON p.usuario_id=u.id WHERE "+eligible("c")+" AND ($1::boolean=false OR EXTRACT(YEAR FROM c.finalizado)=$2) ORDER BY c.finalizado DESC",[season,year]);
 const by=new Map();for(const c of r.rows){const k=c.usuario.toLowerCase(),x=by.get(k)||{usuario:c.usuario,clubFavorito:c.club_favorito,puntos:0,torneos:0,campeonatos:0,podios:0,ultimo:null};x.puntos+=pointsForCareer(c);x.torneos++;if(c.campeon)x.campeonatos++;if((c.formato==="liga1"||c.formato==="liga2")?Number(c.posicion)<=3:/campeón|finalista|semifinal/i.test(c.resultado||""))x.podios++;if(!x.ultimo||new Date(c.finalizado)>new Date(x.ultimo))x.ultimo=c.finalizado;if(!x.clubFavorito&&c.club_favorito)x.clubFavorito=c.club_favorito;by.set(k,x);}
 const rows=[...by.values()].filter(x=>x.puntos>0).sort((a,b)=>b.puntos-a.puntos||b.campeonatos-a.campeonatos||b.podios-a.podios||b.torneos-a.torneos||a.usuario.localeCompare(b.usuario,"es"));let pos=0;rows.forEach((x,i)=>{if(i===0||x.puntos!==rows[i-1].puntos)pos=i+1;x.pos=pos;});return {enabled:true,periodo:season?"temporada":"historico",temporada:year,rows};
}
export async function rankingFans(env){const r=await dbQuery(env,"SELECT p.club_favorito AS club,COUNT(*)::int AS puntos FROM perfiles p JOIN usuarios u ON u.id=p.usuario_id WHERE p.club_favorito IS NOT NULL AND p.club_favorito<>'' GROUP BY p.club_favorito ORDER BY puntos DESC,p.club_favorito ASC",[]),rows=r.rows.map((x,i)=>({...x,pos:i+1,hinchas:Number(x.puntos)}));return {enabled:true,totalCuentas:rows.reduce((n,x)=>n+x.hinchas,0),rows};}
