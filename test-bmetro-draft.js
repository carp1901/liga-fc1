'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
function parseCSV(input){const rows=[];let row=[],value='',quoted=false;for(let i=0;i<input.length;i++){const c=input[i];if(quoted){if(c==='"'&&input[i+1]==='"'){value+='"';i++;}else if(c==='"')quoted=false;else value+=c;}else if(c==='"')quoted=true;else if(c===','){row.push(value);value='';}else if(c==='\n'){row.push(value.replace(/\r$/,''));rows.push(row);row=[];value='';}else value+=c;}if(value.length||row.length){row.push(value.replace(/\r$/,''));rows.push(row);}return rows;}
const source=fs.readFileSync('public/data.js','utf8');
const match=source.match(/const ROLE_OFFSETS=\{([\s\S]*?)\n\};/);
assert(match,'No se encontró ROLE_OFFSETS');
const supported=new Set([...match[1].matchAll(/^\s*([A-Z]+):\{/gm)].map(m=>m[1]));
supported.add('POR');
const pools={POR:[1,12,22,30,40],DEF:[2,3,4,6,13,14,15,16,18,21,24,25],MED:[5,7,8,10,17,19,20,23,26,27,28,29,31],DEL:[9,11,32,33,34,35,36,37,38,39]};
const estimated='Estimación propia por posición y orden del plantel; no se encontró dorsal confirmado.';
const batches=[
 {file:'planteles/borradores/primera-b-metro-2026/tanda1.csv',expected:{arsenal:22,brownadrogue:25,armenio:20,argentinomerlo:21,argentinoquilmes:25,camioneros:25,comunicaciones:24,defensoresunidos:23}},
 {file:'planteles/borradores/primera-b-metro-2026/tanda2.csv',expected:{docksud:27,laferrere:26,deportivomerlo:27,excursionistas:27,flandria:26,ituzaingo:21,liniers:25}},
 {file:'planteles/borradores/primera-b-metro-2026/tanda3.csv',expected:{realpilar:27,sanmartinburzaco:22,sportivoitaliano:21,talleresre:27,uai:24,villadalmine:22,villasancarlos:26}}
];
const allNames=new Set(),allNumbers=new Set();let total=0,verifiedDorsals=0,estimatedDorsals=0;
for(const batch of batches){
 const rows=parseCSV(fs.readFileSync(batch.file,'utf8'));const headers=rows.shift().map(x=>x.trim().toLowerCase());const col=Object.fromEntries(headers.map((h,i)=>[h,i]));const counts={},numbers=new Set();
 for(const [n,r] of rows.entries()){
  if(!r.some(x=>x.trim()))continue;const get=k=>r[col[k]]||'';const club=get('club_id'),name=get('nombre'),role=get('rol_especifico');counts[club]=(counts[club]||0)+1;total++;
  assert(['POR','DEF','MED','DEL'].includes(get('posicion')),batch.file+' fila '+(n+2)+': posición general inválida');assert(supported.has(role),batch.file+' fila '+(n+2)+': rol sin perfil '+role);
  assert(Number.isInteger(Number(get('rating')))&&Number(get('rating'))>=1&&Number(get('rating'))<=99,batch.file+' fila '+(n+2)+': rating inválido');assert(Number.isInteger(Number(get('edad')))&&Number(get('edad'))>=15&&Number(get('edad'))<=50,batch.file+' fila '+(n+2)+': edad inválida');
  assert(get('rating_source').includes('FM27')||get('rating_source').startsWith('Estimación propia'),batch.file+' fila '+(n+2)+': fuente de media no identificada');assert(get('fuente')&&get('fuente_edad')&&get('fuente_rol')&&get('fuente_participacion'),batch.file+' fila '+(n+2)+': faltan fuentes');assert.equal(Number(get('rating_base')),Number(get('rating')),batch.file+' fila '+(n+2)+': rating_base no coincide');assert.equal(Number(get('ajuste_rating')),0,batch.file+' fila '+(n+2)+': ajuste de B Metro debe ser cero');
  const key=club+'|'+name.toLowerCase();assert(!allNames.has(key),batch.file+' fila '+(n+2)+': jugador duplicado entre tandas '+name);allNames.add(key);
  assert(get('dorsal'),'Falta dorsal: '+club+'/'+name);assert(Number.isInteger(Number(get('dorsal')))&&Number(get('dorsal'))>=1&&Number(get('dorsal'))<=99,'Dorsal inválido: '+club+'/'+name);
  const src=get('dorsal_source');assert(src,'Falta fuente de dorsal: '+club+'/'+name);
  if(src==='https://clubatleticobrown.com/'){assert.equal(club,'brownadrogue','Fuente oficial asignada a club incorrecto');verifiedDorsals++;}
  else{assert.equal(src,estimated,'Fuente estimada no identificada: '+club+'/'+name);assert(pools[get('posicion')].includes(Number(get('dorsal'))),'Dorsal estimado no coherente con posición: '+club+'/'+name);estimatedDorsals++;}
  const nk=club+'|'+get('dorsal');assert(!numbers.has(nk),'Dorsal duplicado '+nk);assert(!allNumbers.has(nk),'Dorsal duplicado entre tandas '+nk);numbers.add(nk);allNumbers.add(nk);
 }
 assert.deepEqual(counts,batch.expected,batch.file+': cambió la cantidad de jugadores por club');
}
assert.equal(batches.reduce((n,b)=>n+Object.keys(b.expected).length,0),22);assert.equal(total,533);assert.equal(verifiedDorsals,6);assert.equal(estimatedDorsals,527);
console.log('OK: 22 clubes, 533 jugadores, 6 dorsales oficiales + 527 estimados, cero vacíos y cero duplicados.');
