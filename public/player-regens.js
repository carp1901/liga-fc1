'use strict';
// Recambio generacional determinista para carreras realistas.
// Los planteles base nunca se modifican: cada carrera conserva su propia copia.
const FIRST=['Juan','Mateo','Thiago','Benjamín','Tomás','Lautaro','Joaquín','Franco','Santino','Nicolás','Facundo','Bautista','Valentino','Tobías','Bruno','Agustín','Máximo','Dylan','Enzo',' Valentín'];
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const pick=(a,s)=>a[hash(s)%a.length];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const isKeeper=p=>p==='POR';
function surname(n){const a=String(n||'Jugador').trim().split(/\s+/);return a.length>1?a[a.length-1]:a[0]}
function firstName(n){const a=String(n||'').trim().split(/\s+/);return a.length>1?a.slice(0,-1).join(' ').replace(/^[A-ZÁÉÍÓÚÑ]\.\s*/, ''):'';
}
function init(cats,getSquad){
 const rosters={};
 cats.forEach(c=>c.teams.forEach(id=>{
  rosters[id]=getSquad(id).map((p,i)=>({...p,age:Number(p.age)||18+(hash(id+'|age|'+i)%17),uid:p.uid||id+'-'+i}));
 }));
 return rosters;
}
function next(rosters,season){
 const out={},events=[];
 Object.keys(rosters||{}).forEach(id=>{
  const old=rosters[id]||[],kept=[];
  old.forEach((p,i)=>{
   const age=(Number(p.age)||24)+1,limit=isKeeper(p.p)?40:38;
   if(age>=limit){events.push({club:id,retired:p.n,age,position:p.p,regen:null});return}
   kept.push({...p,age});
  });
  // Un regen por cada retiro, mismo puesto y apellido, juvenil con media inicial modesta.
  events.filter(e=>e.club===id&&e.regen==null).forEach((e,j)=>{
   const parent=old.find(p=>p.n===e.retired),last=surname(e.retired),seed=id+'|'+season+'|'+e.retired;
   const fn=pick(FIRST,seed).trim(),name=fn+' '+last;
   const base=42+(hash(seed+'|ovr')%13),at={...(parent&&parent.at||{})};
   Object.keys(at).forEach(k=>{if(typeof at[k]==='number')at[k]=clamp(Math.round(base+(at[k]-(Number(parent.r)||base))*.25),15,75)});
   if(!isKeeper(e.position))['ref','par','man','sal'].forEach(k=>{if(k in at)at[k]=15});
   const regen={p:e.position,n:name,r:base,age:16+(hash(seed+'|age')%3),at,uid:id+'-regen-'+hash(seed),regen:true,regenOf:e.retired};
   kept.push(regen);e.regen=name;
  });
  out[id]=kept;
 });
 return{rosters:out,events};
}
const API={init,next};if(typeof module!=='undefined'&&module.exports)module.exports=API;else if(typeof window!=='undefined')window.PLAYERREG=API;
