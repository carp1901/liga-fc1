'use strict';
const assert=require('assert');
const DATA=require('./public/data');
const ENG=require('./public/engine');

const nat=DATA.DIVS.find(d=>d.id==='ar2');
assert(nat&&nat.teams.length,'debe existir Primera Nacional');
const club=nat.teams[0].id;
let car=ENG.realNew({me:{club}});
assert(!car.error&&car.rosters&&car.rosters[club],'debe iniciar carrera');
const initialSize=car.rosters[club].length;
const retired=new Set();
let totalEvents=0;

for(let year=0;year<6;year++){
  const roster=car.rosters[club];
  const field=roster.find(p=>p.p!=='POR'&&!p.regen&&!retired.has(p.uid));
  const keeper=roster.find(p=>p.p==='POR'&&!p.regen&&!retired.has(p.uid));
  assert(field&&keeper,'debe haber jugadores originales disponibles para probar retiros sucesivos');
  field.age=37;
  keeper.age=39;
  retired.add(field.uid);
  retired.add(keeper.uid);

  car.pre=ENG.preparePre(car);
  const ids=car.cats[car.me.cat].teams;
  const table=ids.map((id,i)=>({id,pts:ids.length-i,g:0,gf:0,ga:0}));
  const result=ENG.careerClose(car,table);
  assert(!result.error&&result.car,'debe cerrar cada temporada');
  car=result.car;
  totalEvents+=2;

  assert.equal(car.season,2027+year,'el calendario debe avanzar año a año');
  assert.equal(car.rosters[club].length,initialSize,'el plantel debe conservar su tamaño');
  assert.equal(car.regenLog.length,totalEvents,'el historial debe acumular todos los retiros');
  const uids=car.rosters[club].map(p=>p.uid);
  assert.equal(new Set(uids).size,uids.length,'no puede haber UID duplicados');
  assert(car.rosters[club].filter(p=>p.regen).length>=totalEvents,'los juveniles deben permanecer en el plantel');

  // Simula guardar y restaurar la carrera, como hace el guardado local.
  car=JSON.parse(JSON.stringify(car));
  const cfg=ENG.careerCfg(car);
  assert(cfg.real&&cfg.teams.includes(club),'la carrera restaurada debe volver a cargar sus planteles');
  const active=DATA.squadMode(club,false);
  assert(active.some(p=>p.regen),'el motor debe utilizar los juveniles después de restaurar');
}

assert.equal(car.regenLog.length,12,'seis temporadas deben dejar doce regens registrados');
console.log('OK: seis temporadas consecutivas, doce retiros, UID únicos, tamaño estable, historial y restauración JSON de carrera.');
