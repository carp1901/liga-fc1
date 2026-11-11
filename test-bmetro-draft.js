'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
function parseCSV(input){const rows=[];let row=[],value='',quoted=false;for(let i=0;i<input.length;i++){const c=input[i];if(quoted){if(c==='"'&&input[i+1]==='"'){value+='"';i++;}else if(c==='"')quoted=false;else value+=c;}else if(c==='"')quoted=true;else if(c===','){row.push(value);value='';}else if(c==='\\n'){row.push(value.replace(/\\r$/,''));rows.push(row);row=[];value='';}else value+=c;}if(value.length||row.length){row.push(value.replace(/\\r$/,''));rows.push(row);}return rows;}
const file='planteles/borradores/primera-b-metro-2026/tanda1.csv';
const rows=parseCSV(fs.readFileSync(file,'utf8'));
const headers=rows.shift().map(x=>x.trim().toLowerCase());
const col=Object.fromEntries(headers.map((h,i)=>[h,i]));
const source=fs.readFileSync('public/data.js','utf8');
const match=source.match(/const ROLE_OFFSETS=\\{([\\s\\S]*?)\\n\\};/);
assert(match,'No se encontró ROLE_OFFSETS');
const supported=new Set([...match[1].matchAll(/^\\s*([A-Z]+):\\{/gm)].map(m=>m[1]));
supported.add('POR');
const expected={arsenal:21,brown:22,armenio:18,argentinomerlo:20,argentinoquilmes:24,camioneros:26,comunicaciones:24,defensoresunidos:22};
const counts={},names=new Set(),numbers=new Set();
for(const [n,r] of rows.entries()){
 if(!r.some(x=>x.trim()))continue;
 const get=k=>r[col[k]]||'';
 const club=get('club_id'),name=get('nombre'),role=get('rol_especifico');
 counts[club]=(counts[club]||0)+1;
 assert(['POR','DEF','MED','DEL'].includes(get('posicion')),file+' fila '+(n+2)+': posición general inválida');
 assert(supported.has(role),file+' fila '+(n+2)+': rol sin perfil '+role);
 assert(Number.isInteger(Number(get('rating')))&&Number(get('rating'))>=1&&Number(get('rating'))<=99,file+' fila '+(n+2)+': rating inválido');
 assert(Number.isInteger(Number(get('edad')))&&Number(get('edad'))>=15&&Number(get('edad'))<=50,file+' fila '+(n+2)+': edad inválida');
 assert(get('rating_source').includes('FM27'),file+' fila '+(n+2)+': falta fuente FM27');
 assert(get('fuente')&&get('fuente_edad')&&get('fuente_rol'),file+' fila '+(n+2)+': faltan fuentes de plantel, edad o rol');
 assert.equal(Number(get('rating_base')),Number(get('rating')),file+' fila '+(n+2)+': rating_base no coincide');
 assert.equal(Number(get('ajuste_rating')),0,file+' fila '+(n+2)+': el ajuste de B Metro debe permanecer en cero');
 const key=club+'|'+name.toLowerCase();assert(!names.has(key),file+' fila '+(n+2)+': jugador duplicado '+name);names.add(key);
 if(get('dorsal')){const nk=club+'|'+get('dorsal');assert(!numbers.has(nk),file+' fila '+(n+2)+': dorsal duplicado '+get('dorsal'));numbers.add(nk);}
}
assert.deepEqual(counts,expected,'Cambió la cantidad de candidatos de la tanda 1');
assert.equal(Object.keys(counts).length,8,'La tanda 1 debe tener ocho clubes');
console.log('OK: tanda 1 de Primera B Metro — '+rows.filter(r=>r.some(x=>x.trim())).length+' jugadores, 8 clubes, roles válidos y sin nombres/dorsales duplicados.');
