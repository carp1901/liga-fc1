const assert=require('assert');
const DATA=require('./public/data');
const EXPECTED=['boca','river','racing','independiente','sanlorenzo','estudiantes','velez','talleres','lanus','rosario','huracan','belgrano','argentinos','defensa','newells','union','tigre','platense','banfield','gimnasia','centralcba','rivadavia','instituto','atletico','barracas','riestra','sarmiento','aldosivi','gimnasiamza','estudiantesrc'];
const NATIONAL=DATA.DIVS.find(d=>d.id==='ar2').teams.map(t=>t.id);
const ATTRS=DATA.ATTRS;
assert.strictEqual(EXPECTED.length,30);
assert.strictEqual(NATIONAL.length,36,'Primera Nacional debe tener 36 clubes');
const all=Object.keys(require('./public/squads.json'));
assert.strictEqual(all.length,66,'deben publicarse exactamente Primera y Primera Nacional');
let totalPrimera=0,totalNacional=0,keepers=0,outfield=0;
function validateClub(id,division){
  const squad=DATA.squad(id);
  assert(squad.length>=11,id+': plantel demasiado corto');
  const names=new Set(),numbers=new Set();
  for(const p of squad){
    if(division==='primera')totalPrimera++;else totalNacional++;
    assert(p.n&&p.p,id+': jugador sin nombre/posición');
    assert(Number.isFinite(p.r)&&p.r>=1&&p.r<=99,id+'/'+p.n+': media inválida');
    assert(Number.isInteger(p.age)&&p.age>=15&&p.age<=50,id+'/'+p.n+': edad inválida');
    assert(Number.isInteger(p.number)&&p.number>=1&&p.number<=99,id+'/'+p.n+': dorsal inválido');
    assert(p.specificRole,id+'/'+p.n+': falta rol específico');
    assert(p.at,id+'/'+p.n+': faltan atributos');
    assert(!names.has(p.n.toLowerCase()),id+'/'+p.n+': nombre duplicado');names.add(p.n.toLowerCase());
    assert(!numbers.has(p.number),id+'/'+p.n+': dorsal duplicado #'+p.number);numbers.add(p.number);
    for(const a of ATTRS)assert(Number.isFinite(p.at[a])&&p.at[a]>=15&&p.at[a]<=99,id+'/'+p.n+': atributo '+a+' inválido');
    if(p.p==='POR')keepers++;else{outfield++;for(const a of ['ref','par','man','sal'])assert.strictEqual(p.at[a],15,id+'/'+p.n+': atributo de arquero en jugador de campo')}
  }
}
for(const id of EXPECTED)validateClub(id,'primera');
for(const id of NATIONAL)validateClub(id,'nacional');
assert.strictEqual(totalPrimera,1012,'cambió inesperadamente el total de Primera');
assert.strictEqual(totalNacional,1026,'cambió inesperadamente el total de Primera Nacional');
assert(keepers>0&&outfield>0);
console.log('OK: 66 clubes, 2.038 jugadores (1.012 Primera + 1.026 Nacional), medias/edades/dorsales/roles y '+ATTRS.length+' atributos completos; sin nombres ni dorsales duplicados.');
