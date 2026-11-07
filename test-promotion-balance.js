// Regression tests for temporary promotion/relegation strength adjustments.
const assert=require('node:assert/strict');
let seed=20261107;
Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const DATA=require('./public/data');
const ENG=require('./public/engine');

const car=ENG.realNew({me:{club:'river'}});
assert.equal(car.mode,'real');
assert.equal(car.cats.length,6);
const original=car.cats.map(c=>c.teams.slice());
const up=original[1][0],down=original[0][0];
const moved=original.map(x=>x.slice());
moved[0]=moved[0].filter(id=>id!==down).concat(up);
moved[1]=moved[1].filter(id=>id!==up).concat(down);
const next=ENG.careerNextAdapt(car,moved);
assert.deepEqual(next[up],{delta:1,remaining:2},'ascenso de Nacional a Primera');
assert.deepEqual(next[down],{delta:-1,remaining:2},'descenso de Primera a Nacional');
const factors=ENG.careerTeamAdj({...car,adapt:next});
assert.equal(factors[up],1.035);
assert.equal(factors[down],.965);

const base=ENG.teamStrength(up,{mix:false});
const boosted=ENG.teamStrength(up,{mix:false,teamAdj:factors});
for(const k of ['a','m','d'])assert.ok(Math.abs(boosted[k]/base[k]-1.035)<1e-9,'el ajuste debe afectar '+k+' sin cambiar atributos');
const before=JSON.stringify(DATA.squad(up));
ENG.simGame(up,down,{mix:false,teamAdj:factors});
assert.equal(JSON.stringify(DATA.squad(up)),before,'los atributos del plantel no deben modificarse');
const cfg=ENG.careerCfg({...car,adapt:next});
assert.equal(cfg.teamAdj[up],1.035);
assert.equal(cfg.teamAdj[down],.965);
assert.equal(ENG.simSeason(original[1].slice(0,8),'liga1',factors).length,8,'la simulación de temporada debe aceptar ajustes');

const sameTier=original.map(x=>x.slice());
const metro=sameTier[2][0],federal=sameTier[3][0];
sameTier[2]=sameTier[2].filter(id=>id!==metro).concat(federal);
sameTier[3]=sameTier[3].filter(id=>id!==federal).concat(metro);
const lateral=ENG.careerNextAdapt(car,sameTier);
assert.equal(lateral[metro],undefined,'B Metro y Federal A son el mismo nivel');
assert.equal(lateral[federal],undefined,'Federal A y B Metro no deben recibir ajuste por intercambio');

const twoTier=original.map(x=>x.slice());
const national=twoTier[1][0],primeraC=twoTier[4][0];
twoTier[1]=twoTier[1].filter(id=>id!==national).concat(primeraC);
twoTier[4]=twoTier[4].filter(id=>id!==primeraC).concat(national);
const two=ENG.careerNextAdapt(car,twoTier),twoFactors=ENG.careerTeamAdj({...car,adapt:two});
assert.equal(two[national].delta,-2);
assert.equal(twoFactors[national],.93);
assert.equal(two[primeraC].delta,2);
assert.equal(twoFactors[primeraC],1.07);

const decayCar={...car,adapt:{[up]:{delta:1,remaining:2},[down]:{delta:-1,remaining:1}}};
const decayed=ENG.careerNextAdapt(decayCar,original);
assert.deepEqual(decayed[up],{delta:1,remaining:1},'el segundo año debe reducir el efecto a la mitad');
assert.equal(decayed[down],undefined,'el ajuste debe desaparecer después de dos temporadas');
assert.equal(ENG.careerTeamAdj({...car,adapt:decayed})[up],1.0175);

const relegationCar=ENG.realNew({me:{club:'river'}});
ENG.preparePre(relegationCar);
const river='river';
const annual=relegationCar.cats[0].teams.map((id,i)=>({id,pts:id===river?0:100-i,g:30,gf:40,ga:20}));
annual.sort((a,b)=>b.pts-a.pts||b.g-b.g||b.gf-a.gf);
const annualMap=Object.fromEntries(annual.map(q=>[q.id,{...q}]));
const closed=ENG.careerClose(relegationCar,annual,[annualMap]);
assert.ok(!closed.error,'careerClose debe completar la transición');
assert.ok(closed.car.cats[1].teams.includes(river),'el último de Primera debe pasar a Nacional');
assert.deepEqual(closed.car.adapt[river],{delta:-1,remaining:2},'careerClose debe activar el ajuste al descender');
assert.equal(ENG.careerCfg(closed.car).teamAdj[river],.965);

console.log(JSON.stringify({ok:true,checks:15,examples:{promotion:1.035,relegation:.965,twoTierPromotion:1.07,twoTierRelegation:.93,secondSeason:1.0175,sameTierMetroFederalA:1},integration:'careerClose confirmó el descenso de Primera a Nacional'},null,2));
