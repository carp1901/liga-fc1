const assert=require('assert');
const DATA=require('./public/data');
const EXPECTED=['boca','river','racing','independiente','sanlorenzo','estudiantes','velez','talleres','lanus','rosario','huracan','belgrano','argentinos','defensa','newells','union','tigre','platense','banfield','gimnasia','centralcba','rivadavia','instituto','atletico','barracas','riestra','sarmiento','aldosivi','gimnasiamza','estudiantesrc'];
const ATTRS=DATA.ATTRS;
assert.strictEqual(EXPECTED.length,30);
let total=0,keepers=0,outfield=0;
for(const id of EXPECTED){
  const squad=DATA.squad(id);
  assert(squad.length>=11,id+': plantel demasiado corto');
  for(const p of squad){
    total++;
    assert(p.n&&p.p,id+': jugador sin nombre/posición');
    assert(Number.isFinite(p.r)&&p.r>=1&&p.r<=99,id+'/'+p.n+': media inválida');
    assert(Number.isInteger(p.age)&&p.age>=15&&p.age<=50,id+'/'+p.n+': edad inválida');
    assert(Number.isInteger(p.number)&&p.number>=1&&p.number<=99,id+'/'+p.n+': dorsal inválido');
    assert(p.specificRole,id+'/'+p.n+': falta rol específico');
    assert(p.at,id+'/'+p.n+': faltan atributos');
    for(const a of ATTRS)assert(Number.isFinite(p.at[a])&&p.at[a]>=15&&p.at[a]<=99,id+'/'+p.n+': atributo '+a+' inválido');
    if(p.p==='POR')keepers++;else{outfield++;for(const a of ['ref','par','man','sal'])assert.strictEqual(p.at[a],15,id+'/'+p.n+': atributo de arquero en jugador de campo')}
  }
}
assert.strictEqual(total,1013,'cambió inesperadamente el total de Primera');
assert(keepers>0&&outfield>0);
console.log('OK: 30 clubes, '+total+' jugadores, medias/edades/dorsales/roles y '+ATTRS.length+' atributos completos; '+keepers+' arqueros y '+outfield+' jugadores de campo.');
