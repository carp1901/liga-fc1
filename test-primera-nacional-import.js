const assert=require('node:assert/strict');
const DATA=require('./public/data');
const expected=new Set([
 'allboys','ferro','madryn','chaco','moron','estudiantesba','racingcba','losandes','mitre','almirantebrown','ciudadbolivar','colon','centralnorte','godoycruz','santelmo','sanmiguel','defensoresbelgrano','acassuso',
 'nuevachicago','chacarita','atlanta','sanmartintuc','gimnasiajujuy','almagro','sanmartinsj','temperley','guemes','tristansuarez','agropecuario','patronato','gimnasiatiro','maipu','quilmes','colegiales','rafaela','midland'
]);
const div=DATA.DIVS.find(d=>d.id==='ar2');
assert.ok(div,'Falta división ar2');
const ids=new Set(div.teams.map(t=>t.id));
assert.deepEqual(ids,expected,'La división debe contener exactamente los 36 clubes de Primera Nacional 2026');
let total=0,keepers=0,outfield=0;
for(const id of expected){
 const squad=DATA.squad(id);
 assert.ok(squad.length>=18,id+': plantel demasiado corto');
 const names=new Set(),numbers=new Set();
 for(const p of squad){
  total++;
  assert.ok(p.n&&p.p,id+': jugador sin nombre/posición');
  assert.ok(Number.isFinite(p.r)&&p.r>=1&&p.r<=99,id+'/'+p.n+': media inválida');
  assert.ok(Number.isInteger(p.age)&&p.age>=15&&p.age<=50,id+'/'+p.n+': edad inválida');
  assert.ok(p.birthDate&&p.ageSource,id+'/'+p.n+': falta fecha o fuente de edad');
  assert.ok(Number.isInteger(p.number)&&p.number>=1&&p.number<=99,id+'/'+p.n+': dorsal inválido');
  assert.ok(p.numberSource,id+'/'+p.n+': falta fuente/estado del dorsal');
  assert.ok(p.ratingSource,id+'/'+p.n+': falta fuente de media');
  assert.ok(p.at,id+'/'+p.n+': faltan atributos');
  for(const a of DATA.ATTRS)assert.ok(Number.isFinite(p.at[a])&&p.at[a]>=15&&p.at[a]<=99,id+'/'+p.n+': atributo '+a+' inválido');
  const nk=p.n.toLowerCase();assert.ok(!names.has(nk),id+': jugador duplicado '+p.n);names.add(nk);
  assert.ok(!numbers.has(p.number),id+': dorsal repetido '+p.number);numbers.add(p.number);
  if(p.p==='POR')keepers++;else{outfield++;for(const a of ['ref','par','man','sal'])assert.strictEqual(p.at[a],15,id+'/'+p.n+': atributo de arquero en jugador de campo')}
 }
}
assert.equal(total,1249,'El total de Primera Nacional debe ser 1.249 jugadores');
assert.ok(keepers>0&&outfield>0);
console.log('OK: 36 clubes, '+total+' jugadores, medias/edades/dorsales/fuentes y '+DATA.ATTRS.length+' atributos derivados; '+keepers+' arqueros y '+outfield+' jugadores de campo.');
