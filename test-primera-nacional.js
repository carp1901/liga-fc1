const assert=require('node:assert/strict');
const fs=require('fs');
const DATA=require('./public/data');
const valid=new Set(DATA.DIVS.find(d=>d.id==='ar2').teams.map(t=>t.id));
const zones={
 A:['allboys','ferro','madryn','chaco','moron','estudiantesba','racingcba','losandes','mitre','almirantebrown','ciudadbolivar','colon','centralnorte','godoycruz','santelmo','sanmiguel','defensoresbelgrano','acassuso'],
 B:['nuevachicago','chacarita','atlanta','sanmartintuc','gimnasiajujuy','almagro','sanmartinsj','temperley','guemes','tristansuarez','agropecuario','patronato','gimnasiatiro','maipu','quilmes','colegiales','rafaela','midland']
};
assert.equal(valid.size,36,'Primera Nacional debe tener 36 equipos');
assert.equal(zones.A.length,18);assert.equal(zones.B.length,18);
assert.equal(new Set([...zones.A,...zones.B]).size,36,'Zonas duplicadas');
assert.deepEqual(new Set([...zones.A,...zones.B]),valid,'La distribución debe incluir exactamente los 36 IDs del juego');
function validate(file,blockA,blockB){
 const lines=fs.readFileSync(file,'utf8').trim().split(String.fromCharCode(10));
 const headers=lines.shift().replace(/\r$/,'').split(',');
 const rows=lines.map((line,n)=>{const a=line.replace(/\r$/,'').split(',');assert.equal(a.length,headers.length,file+' columnas incorrectas fila '+(n+2));return Object.fromEntries(headers.map((h,i)=>[h,a[i]]))});
 const counts={},seen=new Set(),numbers=new Set();
 for(const p of rows){
  assert.ok(valid.has(p.club_id),'Club fuera de ar2: '+p.club_id);
  assert.ok(p.nombre&&p.posicion&&p.rating_source&&p.fuente,'Dato esencial incompleto: '+p.nombre);
  assert.ok(['POR','DEF','MED','DEL'].includes(p.posicion),'Posición inválida: '+p.nombre);
  assert.ok(Number(p.rating)>=1&&Number(p.rating)<=99,'Media inválida: '+p.nombre);
  assert.ok(Number.isInteger(Number(p.edad))&&Number(p.edad)>=15&&Number(p.edad)<=50,'Edad inválida: '+p.nombre);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(p.fecha_nacimiento),'Fecha de nacimiento sin fuente: '+p.nombre);
  const [y,m,d]=p.fecha_nacimiento.split('-').map(Number);let age=2026-y;if(m>11||(m===11&&d>6))age--;
  assert.equal(Number(p.edad),age,'Edad no coincide con fecha al 06/11/2026: '+p.nombre);
  const k=p.club_id+'|'+p.nombre.toLowerCase();assert.ok(!seen.has(k),'Jugador duplicado: '+k);seen.add(k);
  const nk=p.club_id+'|'+p.dorsal;assert.ok(p.dorsal&&Number(p.dorsal)>=1&&Number(p.dorsal)<=99,'Dorsal inválido: '+p.nombre);assert.ok(!numbers.has(nk),'Dorsal repetido: '+nk);numbers.add(nk);
  assert.ok(p.dorsal_source.includes('Asignado internamente'),'Dorsal sin estado de verificación: '+p.nombre);
  counts[p.club_id]=(counts[p.club_id]||0)+1;
 }
 assert.equal(Object.keys(counts).length,6,file+' debe tener seis clubes');
 assert.deepEqual(Object.keys(counts).sort(),[...blockA,...blockB].sort(),file+' debe respetar 3 clubes por zona');
 for(const id of [...blockA,...blockB])assert.ok((counts[id]||0)>=18,'Plantel inicial demasiado corto: '+id);
 return{file,players:rows.length,counts};
}
const reports=[
 validate('planteles/primera-nacional-2026-bloque1.csv',['allboys','ferro','madryn'],['nuevachicago','chacarita','atlanta']),
 validate('planteles/primera-nacional-2026-bloque2.csv',['chaco','moron','estudiantesba'],['sanmartintuc','gimnasiajujuy','almagro']),
 validate('planteles/primera-nacional-2026-bloque3.csv',['racingcba','losandes','mitre'],['sanmartinsj','temperley','guemes']),
 validate('planteles/primera-nacional-2026-bloque4.csv',['almirantebrown','ciudadbolivar','colon'],['tristansuarez','agropecuario','patronato'])
];
console.log(JSON.stringify({ok:true,division:'Primera Nacional',clubsCovered:24,blocks:reports,zones:{A:18,B:18},ageReference:'2026-11-06',ratings:'estimaciones identificadas',dorsals:'asignación interna explícita'},null,2));
