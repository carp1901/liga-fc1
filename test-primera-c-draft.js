'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
function parseCSV(input){const rows=[];let row=[],value='',quoted=false;for(let i=0;i<input.length;i++){const c=input[i];if(quoted){if(c==='"'&&input[i+1]==='"'){value+='"';i++;}else if(c==='"')quoted=false;else value+=c;}else if(c==='"')quoted=true;else if(c===','){row.push(value);value='';}else if(c.charCodeAt(0)===10){row.push(value.endsWith(String.fromCharCode(13))?value.slice(0,-1):value);rows.push(row);row=[];value='';}else value+=c;}if(value.length||row.length){row.push(value.endsWith(String.fromCharCode(13))?value.slice(0,-1):value);rows.push(row);}return rows;}
const file='planteles/borradores/primera-c-2026/tanda1-inicial.csv';
const rows=parseCSV(fs.readFileSync(file,'utf8'));const headers=rows.shift().map(x=>x.trim().toLowerCase());const col=Object.fromEntries(headers.map((h,i)=>[h,i]));
const expected={juventudunida:51,estrelladelsur:43,argentinorosario:50,victorianoarenas:37,sacachispas:49,alem:47,mercedes:35};
const allowed=new Set(Object.keys(expected)),names=new Set(),totalByClub={},numbersByClub={};let total=0;
for(const [i,row] of rows.entries()){
 if(!row.some(x=>x.trim()))continue;const get=k=>row[col[k]]||'';const club=get('club_id'),name=get('nombre'),pos=get('posicion'),rating=Number(get('rating')),dorsal=Number(get('dorsal'));
 assert(allowed.has(club),'Club fuera de la tanda: '+club);assert(name,'Nombre vacío en fila '+(i+2));
 assert(['ARQ','DEF','MED','DEL'].includes(pos),'Posición inválida: '+name);
 assert(Number.isInteger(rating)&&rating>=38&&rating<=53,'Media provisional fuera de rango: '+name);
 assert(get('rating_source').startsWith('Estimación propia inicial v1'),'La media debe quedar marcada como estimación: '+name);
 assert(Number.isInteger(dorsal)&&dorsal>=1&&dorsal<=99,'Dorsal estimado inválido: '+name);
 assert(get('dorsal_source').includes('estimado'),'Fuente del dorsal no identificada como estimada: '+name);
 assert(get('fuente')&&get('consultado'),'Falta procedencia nominal: '+name);
 const key=club+'|'+name.toLowerCase();assert(!names.has(key),'Jugador duplicado: '+key);names.add(key);
 totalByClub[club]=(totalByClub[club]||0)+1;const nk=club+'|'+dorsal;assert(!numbersByClub[nk],'Dorsal duplicado: '+nk);numbersByClub[nk]=1;total++;
}
assert.deepEqual(totalByClub,expected,'Cambió la cantidad nominal de la tanda');assert.equal(total,312,'Total nominal inesperado');
if(process.argv.includes('--runtime')){
 const runtime=JSON.parse(fs.readFileSync('public/squads.json','utf8'));const meta=JSON.parse(fs.readFileSync('public/squads-meta.json','utf8'));const data=fs.readFileSync('public/data.js','utf8');
 for(const [id,count] of Object.entries(expected)){
  assert(data.includes(id+'|'),'Club inexistente en public/data.js: '+id);assert(Array.isArray(runtime[id]),'Falta club en runtime: '+id);assert.equal(runtime[id].length,count,'Cantidad incorrecta en runtime: '+id);
  const actual=new Map(runtime[id].map(p=>[p.n,p]));
  for(const row of rows){const get=k=>row[col[k]]||'';if(get('club_id')!==id)continue;const p=actual.get(get('nombre'));assert(p,'No importado: '+id+'/'+get('nombre'));
   assert.equal(p.p,get('posicion')==='ARQ'?'POR':get('posicion'),'Posición runtime incorrecta: '+p.n);assert.equal(p.r,Number(get('rating')),'Media runtime incorrecta: '+p.n);assert.equal(p.role,get('rol'),'Rol runtime incorrecto: '+p.n);
   assert.equal(p.number,Number(get('dorsal')),'Dorsal runtime incorrecto: '+p.n);assert.equal(p.numberSource,get('dorsal_source'),'Fuente dorsal runtime incorrecta: '+p.n);assert(p.ratingSource.startsWith('Estimación propia inicial v1'),'Media sin etiqueta de estimación: '+p.n);
  }
 }
 const baseline=JSON.parse(require('node:child_process').execFileSync('git',['show','origin/main:public/squads.json'],{encoding:'utf8'}));
 for(const [id,players] of Object.entries(baseline))if(!allowed.has(id))assert.deepEqual(runtime[id],players,'Se alteró accidentalmente otro plantel: '+id);
 for(const [id,count] of Object.entries(expected))assert.equal(meta.counts[id],count,'Metadata incorrecta: '+id);
}
console.log(process.argv.includes('--runtime')?'OK: 312 jugadores cargados en 7 clubes; los demás planteles permanecen intactos.':'OK: CSV inicial de Primera C — 7 clubes, 312 jugadores, sin nombres ni dorsales duplicados.');
