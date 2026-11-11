'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
function parseCSV(input){const rows=[];let row=[],value='',quoted=false;for(let i=0;i<input.length;i++){const c=input[i];if(quoted){if(c==='"'&&input[i+1]==='"'){value+='"';i++;}else if(c==='"')quoted=false;else value+=c;}else if(c==='"')quoted=true;else if(c===','){row.push(value);value='';}else if(c==='\n'){row.push(value.replace(/\r$/,''));rows.push(row);row=[];value='';}else value+=c;}if(value.length||row.length){row.push(value.replace(/\r$/,''));rows.push(row);}return rows;}
const source=fs.readFileSync('public/data.js','utf8');
const match=source.match(/const ROLE_OFFSETS=\{([\s\S]*?)\n\};/);
assert(match,'No se encontró ROLE_OFFSETS');
const supported=new Set([...match[1].matchAll(/^\s*([A-Z]+):\{/gm)].map(m=>m[1]));
supported.add('POR');
const batches=[
 {file:'planteles/borradores/primera-b-metro-2026/tanda1.csv',expected:{arsenal:22,brown:25,armenio:20,argentinomerlo:21,argentinoquilmes:25,camioneros:25,comunicaciones:24,defensoresunidos:23}},
 {file:'planteles/borradores/primera-b-metro-2026/tanda2.csv',expected:{docksud:27,laferrere:26,deportivomerlo:27,excursionistas:27,flandria:26,ituzaingo:21,liniers:25}}
];
const allNames=new Set();
let total=0;
for(const batch of batches){
 const rows=parseCSV(fs.readFileSync(batch.file,'utf8'));
 const headers=rows.shift().map(x=>x.trim().toLowerCase());
 const col=Object.fromEntries(headers.map((h,i)=>[h,i]));
 const counts={},numbers=new Set();
 for(const [n,r] of rows.entries()){
  if(!r.some(x=>x.trim()))continue;
  const get=k=>r[col[k]]||'';
  const club=get('club_id'),name=get('nombre'),role=get('rol_especifico');
  counts[club]=(counts[club]||0)+1;total++;
  assert(['POR','DEF','MED','DEL'].includes(get('posicion')),batch.file+' fila '+(n+2)+': posición general inválida');
  assert(supported.has(role),batch.file+' fila '+(n+2)+': rol sin perfil '+role);
  assert(Number.isInteger(Number(get('rating')))&&Number(get('rating'))>=1&&Number(get('rating'))<=99,batch.file+' fila '+(n+2)+': rating inválido');
  assert(Number.isInteger(Number(get('edad')))&&Number(get('edad'))>=15&&Number(get('edad'))<=50,batch.file+' fila '+(n+2)+': edad inválida');
  assert(get('rating_source').includes('FM27')||get('rating_source').startsWith('Estimación propia'),batch.file+' fila '+(n+2)+': fuente de media no identificada');
  assert(get('fuente')&&get('fuente_edad')&&get('fuente_rol')&&get('fuente_participacion'),batch.file+' fila '+(n+2)+': faltan fuentes');
  assert.equal(Number(get('rating_base')),Number(get('rating')),batch.file+' fila '+(n+2)+': rating_base no coincide');
  assert.equal(Number(get('ajuste_rating')),0,batch.file+' fila '+(n+2)+': ajuste de B Metro debe ser cero');
  const key=club+'|'+name.toLowerCase();
  assert(!allNames.has(key),batch.file+' fila '+(n+2)+': jugador duplicado entre tandas '+name);
  allNames.add(key);
  if(get('dorsal')){const nk=club+'|'+get('dorsal');assert(!numbers.has(nk),batch.file+' fila '+(n+2)+': dorsal duplicado '+get('dorsal'));numbers.add(nk);}
 }
 assert.deepEqual(counts,batch.expected,batch.file+': cambió la cantidad de jugadores por club');
}
assert.equal(Object.keys(batches[0].expected).length+Object.keys(batches[1].expected).length,15,'Las dos tandas deben cubrir 15 clubes');
console.log('OK: dos tandas B Metro — '+total+' jugadores, 15 clubes, perfiles válidos, fuentes presentes y sin duplicados.');
