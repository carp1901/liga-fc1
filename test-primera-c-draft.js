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
 juventudunida:30,
 estrelladelsur:30,
 argentinorosario:30,
 victorianoarenas:30,
 sacachispas:30,
 alem:30,
 mercedes:30,
 berazategui:30,
 paraguayo:30,
 cambaceres:30,
 puertonuevo:30,
 centroespanol:29,
 jjurquiza:30,
 lugano:30,
 atlas:30,
 canuelas:30,
 centralballester:30,
 centralcordobarosario:30,
 claypole:30,
 espanol:30,
 muniz:30,
 porvenir:30,
 fenix:30,
 lamadrid:30,
 leones:30,
 lujan:30,
 sportivobarracas:30,
 yupanqui:30
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
assert.deepEqual(totalByClub,expected,'Cambió la cantidad nominal de las cuatro tandas');assert.equal(total,839,'Total nominal inesperado');
const collisions=[...crossNames.entries()].filter(([,v])=>v.length>1).map(([n])=>n).sort();
assert.deepEqual(collisions,["lautaro torres","rodrigo ortiz","santiago diaz"],'Cambió el conjunto de homónimos entre clubes');
const sapio=rows.filter(row=>row[col.nombre]==='Santino Sapio');assert.equal(sapio.length,1);assert.equal(sapio[0][col.posiciones_secundarias],'MED');
const matias=rows.find(row=>row[col.club_id]==='sacachispas'&&row[col.nombre]==='Matías Arias');assert(matias,'Falta Matías Arias, con 16 partidos y 1.306 minutos');assert.equal(matias[col.posicion],'MED');assert.equal(Number(matias[col.edad]),25);assert.equal(Number(matias[col.dorsal]),51);
assert(rows.some(row=>row[col.club_id]==='cambaceres'&&row[col.nombre]==='Víctor Gómez'),'Falta Víctor Gómez, confirmado por perfil individual en Cambaceres');
assert(rows.some(row=>row[col.club_id]==='lamadrid'&&row[col.nombre]==='Néstor Acosta'),'Falta Néstor Acosta, titular en los 33 partidos de Lamadrid');
assert(!rows.some(row=>row[col.club_id]==='centralballester'&&row[col.nombre]==='Franco Gómez'),'Franco Gómez no tuvo presencias ni convocatorias de primer equipo en 2026');
assert(!rows.some(row=>row[col.club_id]==='juventudunida'&&row[col.nombre]==='Román Gauto'),'Román Gauto registra cero presencias y cero convocatorias en 2026');
assert(!rows.some(row=>row[col.club_id]==='juventudunida'&&row[col.nombre]==='Antonio Riveros'),'Antonio Riveros registra cero presencias y cero convocatorias en 2026');
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
 const baselinePath=process.env.SQUADS_BASELINE_PATH;const baseline=JSON.parse(baselinePath?fs.readFileSync(baselinePath,'utf8'):require('node:child_process').execFileSync('git',['show','origin/main:public/squads.json'],{encoding:'utf8',maxBuffer:20*1024*1024}));
 for(const [id,players] of Object.entries(baseline))if(!allowed.has(id))assert.deepEqual(runtime[id],players,'Se alteró accidentalmente otro plantel: '+id);
}
console.log(process.argv.includes('--runtime')?'OK: 839 jugadores cargados en 28 clubes; homónimos identificados y los demás planteles intactos.':'OK: CSV de Primera C — 28 clubes, 839 jugadores, sin duplicados internos ni dorsales repetidos.');
