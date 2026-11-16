'use strict';
// Primera carga auditada: 504 jugadores nominales en los 17 clubes del Promocional Amateur 2026.
const fs=require('node:fs');
const assert=require('node:assert/strict');
function parseCSV(s){const rows=[];let row=[],v='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='"'&&s[i+1]==='"'){v+='"';i++;}else if(c==='"')q=false;else v+=c;}else if(c==='"')q=true;else if(c===','){row.push(v);v='';}else if(c==='\n'){row.push(v.endsWith('\r')?v.slice(0,-1):v);rows.push(row);row=[];v='';}else v+=c;}if(v.length||row.length){row.push(v.endsWith('\r')?v.slice(0,-1):v);rows.push(row);}return rows;}
const files=['planteles/borradores/promocional-amateur-2026/tanda1-inicial.csv','planteles/borradores/promocional-amateur-2026/tanda2-inicial.csv'];
const parsed=files.map(f=>parseCSV(fs.readFileSync(f,'utf8')));
const headers=parsed[0].shift().map(x=>x.trim().toLowerCase());
for(let i=1;i<parsed.length;i++)assert.deepEqual(parsed[i].shift().map(x=>x.trim().toLowerCase()),headers,'Los CSV deben compartir esquema');
const rows=parsed.flat(),col=Object.fromEntries(headers.map((h,i)=>[h,i]));
const expected={defglew:30,metalurgico:30,hacoaj:30,fcezeiza:30,belgranozarate:30,uribelarrea:30,alumni:30,atpilar:30,barrancas:30,bacity:30,controlorientado:30,estrellaberisso:30,everton:30,juventudbernal:30,mandarinas:30,sat:30,udprovincial:30};
const clubs=new Set(Object.keys(expected)),counts={},names=new Set(),numbers=new Set();let total=0;
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
for(const [i,row] of rows.entries()){
 if(!row.some(x=>x.trim()))continue;
 const get=k=>row[col[k]]||'',club=get('club_id'),name=get('nombre'),pos=get('posicion'),rating=Number(get('rating')),dorsal=Number(get('dorsal'));
 assert(clubs.has(club),'Club no previsto: '+club);assert(name,'Nombre vacío en fila '+(i+2));
 assert(['ARQ','DEF','MED','DEL'].includes(pos),'Posición inválida: '+name);
 assert(Number.isInteger(rating)&&rating>=38&&rating<=53,'Media fuera de rango: '+name);
 assert(get('rating_source').startsWith('Estimación propia inicial v1'),'Media no identificada como estimación: '+name);
 assert(Number.isInteger(dorsal)&&dorsal>=1&&dorsal<=99,'Dorsal inválido: '+name);
 assert(get('dorsal_source').includes('estimado'),'Dorsal no identificado como estimado: '+name);
 assert(get('fuente')&&get('consultado'),'Falta fuente o fecha: '+name);
 const key=club+'|'+norm(name);assert(!names.has(key),'Nombre duplicado: '+key);names.add(key);
 const nk=club+'|'+dorsal;assert(!numbers.has(nk),'Dorsal duplicado: '+nk);numbers.add(nk);
 counts[club]=(counts[club]||0)+1;total++;
}
assert.deepEqual(counts,expected,'Los conteos por club cambiaron');
assert.equal(total,510,'Total de jugadores inesperado');
const data=fs.readFileSync('public/data.js','utf8');
for(const id of clubs)assert(data.includes(id+'|'),'ID no encontrado en public/data.js: '+id);
if(process.argv.includes('--runtime')){
 const runtime=JSON.parse(fs.readFileSync('public/squads.json','utf8'));
 const meta=JSON.parse(fs.readFileSync('public/squads-meta.json','utf8'));
 for(const [id,count] of Object.entries(expected)){
  assert(Array.isArray(runtime[id]),'Falta club en runtime: '+id);assert.equal(runtime[id].length,count,'Cantidad runtime incorrecta: '+id);
  assert.equal(meta.counts[id],count,'Metadata incorrecta: '+id);
  const set=new Set(runtime[id].map(p=>p.n));
  for(const row of rows){if(row[col.club_id]!==id)continue;assert(set.has(row[col.nombre]),'Jugador no importado: '+id+'/'+row[col.nombre]);}
 }
 const baseline=JSON.parse(require('node:child_process').execFileSync('git',['show','origin/main:public/squads.json'],{encoding:'utf8',maxBuffer:30*1024*1024}));
 for(const [id,players] of Object.entries(baseline))if(!clubs.has(id))assert.deepEqual(runtime[id],players,'Se alteró otro plantel: '+id);
}
console.log(process.argv.includes('--runtime')?'OK: 510 jugadores reales cargados en 17 clubes del Promocional Amateur; demás planteles intactos.':'OK: 510 jugadores nominales en 17 clubes; máximo 30, sin duplicados internos ni dorsales repetidos.');
