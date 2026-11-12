'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
function parseCSV(input){const rows=[];let row=[],value='',quoted=false;for(let i=0;i<input.length;i++){const c=input[i];if(quoted){if(c==='"'&&input[i+1]==='"'){value+='"';i++;}else if(c==='"')quoted=false;else value+=c;}else if(c==='"')quoted=true;else if(c===','){row.push(value);value='';}else if(c.charCodeAt(0)===10){row.push(value.endsWith(String.fromCharCode(13))?value.slice(0,-1):value);rows.push(row);row=[];value='';}else value+=c;}if(value.length||row.length){row.push(value.endsWith(String.fromCharCode(13))?value.slice(0,-1):value);rows.push(row);}return rows;}
const files=[
 'planteles/borradores/primera-c-2026/tanda1-inicial.csv',
 'planteles/borradores/primera-c-2026/tanda2-inicial.csv',
 'planteles/borradores/primera-c-2026/tanda3-inicial.csv',
 'planteles/borradores/primera-c-2026/tanda4-inicial.csv'
];
const parsed=files.map(file=>parseCSV(fs.readFileSync(file,'utf8')));
const headers=parsed[0].shift().map(x=>x.trim().toLowerCase());
for(let i=1;i<parsed.length;i++)assert.deepEqual(parsed[i].shift().map(x=>x.trim().toLowerCase()),headers,'Los cuatro CSV deben compartir esquema');
const rows=parsed.flat();const col=Object.fromEntries(headers.map((h,i)=>[h,i]));
const expected={
 juventudunida:51,estrelladelsur:42,argentinorosario:50,victorianoarenas:37,sacachispas:49,alem:46,mercedes:35,
 berazategui:38,paraguayo:42,cambaceres:35,puertonuevo:33,centroespanol:29,jjurquiza:49,lugano:45,
 atlas:42,canuelas:31,centralballester:56,centralcordobarosario:32,claypole:39,espanol:39,muniz:38,
 porvenir:47,fenix:42,lamadrid:35,leones:37,lujan:33,sportivobarracas:39,yupanqui:39
};
const allowed=new Set(Object.keys(expected)),names=new Set(),numbers=new Set(),totalByClub={};let total=0;
const normalizedName=s=>Array.from(s.normalize('NFD')).filter(ch=>{const n=ch.charCodeAt(0);return n<768||n>879;}).join('').toLowerCase();
const crossNames=new Map();
for(const [i,row] of rows.entries()){
 if(!row.some(x=>x.trim()))continue;
 const get=k=>row[col[k]]||'',club=get('club_id'),name=get('nombre'),pos=get('posicion'),rating=Number(get('rating')),dorsal=Number(get('dorsal'));
 assert(allowed.has(club),'Club fuera de Primera C: '+club);assert(name,'Nombre vacío en fila '+(i+2));
 assert(['ARQ','DEF','MED','DEL'].includes(pos),'Posición inválida: '+name);
 assert(Number.isInteger(rating)&&rating>=38&&rating<=53,'Media provisional fuera de rango: '+name);
 assert(get('rating_source').startsWith('Estimación propia inicial v1'),'La media debe quedar marcada como estimación: '+name);
 assert(Number.isInteger(dorsal)&&dorsal>=1&&dorsal<=99,'Dorsal estimado inválido: '+name);
 assert(get('dorsal_source').includes('estimado'),'Fuente del dorsal no identificada como estimada: '+name);
 assert(get('fuente')&&get('consultado'),'Falta procedencia nominal: '+name);
 const key=club+'|'+normalizedName(name);assert(!names.has(key),'Jugador duplicado dentro del club: '+key);names.add(key);
 totalByClub[club]=(totalByClub[club]||0)+1;const nk=club+'|'+dorsal;assert(!numbers.has(nk),'Dorsal duplicado: '+nk);numbers.add(nk);total++;
 if(!crossNames.has(normalizedName(name)))crossNames.set(normalizedName(name),[]);
 crossNames.get(normalizedName(name)).push({club,pos,name});
}
assert.deepEqual(totalByClub,expected,'Cambió la cantidad nominal de las cuatro tandas');assert.equal(total,1130,'Total nominal inesperado');
const collisions=[...crossNames.entries()].filter(([,v])=>v.length>1).map(([n])=>n).sort();
assert.deepEqual(collisions,['alexis oviedo','federico vega','gonzalo medina','gonzalo ramirez','lautaro torres','rodrigo ortiz','rodrigo soria','santiago diaz'],'Apareció un homónimo entre clubes no auditado');
const pair=(name,expectedPair)=>assert.deepEqual(crossNames.get(name).map(x=>x.club+'|'+x.pos).sort(),expectedPair);
pair('rodrigo soria',['lugano|MED','victorianoarenas|ARQ']);
pair('lautaro torres',['estrelladelsur|DEL','sacachispas|MED']);
pair('federico vega',['centralballester|ARQ','juventudunida|DEF']);
pair('rodrigo ortiz',['claypole|MED','paraguayo|DEL']);
pair('alexis oviedo',['centralballester|MED','muniz|MED']);
pair('gonzalo medina',['alem|MED','fenix|MED']);
pair('gonzalo ramirez',['alem|DEF','lujan|DEL']);
pair('santiago diaz',['cambaceres|DEF','lujan|MED']);
const sapio=rows.filter(row=>row[col.nombre]==='Santino Sapio');assert.equal(sapio.length,1);assert.equal(sapio[0][col.posiciones_secundarias],'MED');
assert(rows.some(row=>row[col.club_id]==='cambaceres'&&row[col.nombre]==='Víctor Gómez'),'Falta Víctor Gómez, confirmado por perfil individual en Cambaceres');
if(process.argv.includes('--runtime')){
 const runtime=JSON.parse(fs.readFileSync('public/squads.json','utf8'));const meta=JSON.parse(fs.readFileSync('public/squads-meta.json','utf8'));const data=fs.readFileSync('public/data.js','utf8');
 for(const [id,count] of Object.entries(expected)){
  assert(data.includes(id+'|'),'Club inexistente en public/data.js: '+id);assert(Array.isArray(runtime[id]),'Falta club en runtime: '+id);assert.equal(runtime[id].length,count,'Cantidad incorrecta en runtime: '+id);
  const actual=new Map(runtime[id].map(p=>[p.n,p]));
  for(const row of rows){const get=k=>row[col[k]]||'';if(get('club_id')!==id)continue;const p=actual.get(get('nombre'));assert(p,'No importado: '+id+'/'+get('nombre'));
   assert.equal(p.p,get('posicion')==='ARQ'?'POR':get('posicion'),'Posición runtime incorrecta: '+p.n);assert.equal(p.r,Number(get('rating')),'Media runtime incorrecta: '+p.n);assert.equal(p.role,get('rol'),'Rol runtime incorrecto: '+p.n);
   assert.equal(p.number,Number(get('dorsal')),'Dorsal runtime incorrecto: '+p.n);assert.equal(p.numberSource,get('dorsal_source'),'Fuente dorsal runtime incorrecta: '+p.n);assert(p.ratingSource.startsWith('Estimación propia inicial v1'),'Media sin etiqueta de estimación: '+p.n);
  }
  assert.equal(meta.counts[id],count,'Metadata incorrecta: '+id);
 }
 const baseline=JSON.parse(require('node:child_process').execFileSync('git',['show','origin/main:public/squads.json'],{encoding:'utf8',maxBuffer:20*1024*1024}));
 for(const [id,players] of Object.entries(baseline))if(!allowed.has(id))assert.deepEqual(runtime[id],players,'Se alteró accidentalmente otro plantel: '+id);
}
console.log(process.argv.includes('--runtime')?'OK: 1.130 jugadores cargados en 28 clubes; homónimos identificados y los demás planteles intactos.':'OK: CSV de Primera C — 28 clubes, 1.130 jugadores, sin duplicados internos ni dorsales repetidos.');
