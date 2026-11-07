const assert=require('node:assert/strict');
const fs=require('fs');
const DATA=require('./public/data');
const file='planteles/primera-nacional-2026-bloque1.csv';
const lines=fs.readFileSync(file,'utf8').trim().split(/\r?\n/);
const headers=lines.shift().split(',');
const idx=Object.fromEntries(headers.map((h,i)=>[h,i]));
const rows=lines.map((line,n)=>{const a=line.split(',');assert.equal(a.length,headers.length,'columnas incorrectas fila '+(n+2));return Object.fromEntries(headers.map((h,i)=>[h,a[i]]))});
const div=DATA.DIVS.find(d=>d.id==='ar2');
assert.ok(div,'No existe Primera Nacional ar2');
const valid=new Set(div.teams.map(t=>t.id));
const zones={
 A:['allboys','ferro','madryn','chaco','moron','estudiantesba','racingcba','losandes','mitre','almirantebrown','ciudadbolivar','colon','centralnorte','godoycruz','santelmo','sanmiguel','defensoresbelgrano','acassuso'],
 B:['nuevachicago','chacarita','atlanta','sanmartintuc','gimnasiajujuy','almagro','sanmartinsj','temperley','guemes','tristansuarez','agropecuario','patronato','gimnasiatiro','maipu','quilmes','colegiales','rafaela','midland']
};
assert.equal(valid.size,36,'Primera Nacional debe tener 36 equipos');
assert.equal(zones.A.length,18);assert.equal(zones.B.length,18);
assert.equal(new Set([...zones.A,...zones.B]).size,36,'Zonas duplicadas');
assert.deepEqual(new Set([...zones.A,...zones.B]),valid,'La distribución debe incluir exactamente los 36 IDs del juego');
const blockA=['allboys','ferro','madryn'],blockB=['nuevachicago','chacarita','atlanta'];
assert.equal(blockA.length,3);assert.equal(blockB.length,3);
const counts={},seen=new Set(),numbers=new Set();
for(const p of rows){
 assert.ok(valid.has(p.club_id),'Club fuera de ar2: '+p.club_id);
 assert.ok(p.nombre&&p.posicion&&p.rating_source&&p.fuente,'Dato esencial incompleto: '+p.nombre);
 assert.ok(['POR','DEF','MED','DEL'].includes(p.posicion),'Posición inválida: '+p.nombre);
 assert.ok(Number(p.rating)>=1&&Number(p.rating)<=99,'Media inválida: '+p.nombre);
 const age=p.edad!==''?Number(p.edad):(()=>{if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(p.fecha_nacimiento))return NaN;const [y,m,d]=p.fecha_nacimiento.split('-').map(Number);let a=2026-y;if(m>11||(m===11&&d>6))a--;return a})();\n assert.ok(Number.isInteger(age)&&age>=15&&age<=50,'Edad faltante o inválida: '+p.nombre);
 const k=p.club_id+'|'+p.nombre.toLowerCase();
 assert.ok(!seen.has(k),'Jugador duplicado: '+k);seen.add(k);
 const nk=p.club_id+'|'+p.dorsal;
 assert.ok(p.dorsal&&Number(p.dorsal)>=1&&Number(p.dorsal)<=99,'Dorsal inválido: '+p.nombre);
 assert.ok(!numbers.has(nk),'Dorsal repetido: '+nk);numbers.add(nk);
 assert.ok(p.dorsal_source,'Falta fuente de dorsal: '+p.nombre);
 counts[p.club_id]=(counts[p.club_id]||0)+1;
}
for(const id of [...blockA,...blockB])assert.ok((counts[id]||0)>=18,'Plantel inicial demasiado corto: '+id);
assert.equal(Object.keys(counts).length,6,'El bloque debe incluir 6 clubes');
console.log(JSON.stringify({ok:true,block:1,clubs:Object.keys(counts).length,players:rows.length,counts,zoneA:blockA,zoneB:blockB,ratings:'estimaciones identificadas',numbers:'asignación interna explícita; pendiente contraste oficial'},null,2));
