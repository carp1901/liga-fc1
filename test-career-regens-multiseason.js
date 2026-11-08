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
const initialLog=car.regenLog?.length||0;
const initialClubLog=(car.regenLog||[]).filter(e=>e.club===club).length;

for(let year=0;year<6;year++){
  const roster=car.rosters[club];
  const field=roster.find(p=>p.p!=='POR'&&!retired.has(p.uid));
  const keeper=roster.find(p=>p.p==='POR'&&!retired.has(p.uid));
  assert(field&&keeper,'debe haber jugadores disponibles para probar retiros sucesivos');
  field.age=37;
  keeper.age=39;
  retired.add(field.uid);
  retired.add(keeper.uid);

  delete car.pre;
  ENG.preparePre(car);
  const ids=car.cats[car.me.cat].teams;
  const ordered=ids.filter(id=>id!==club);ordered.splice(Math.floor(ordered.length/2),0,club);
  const table=ordered.map((id,i)=>({id,pts:ordered.length-i,g:0,gf:0,ga:0}));
  const result=ENG.careerClose(car,table);
  assert(!result.error&&result.car,'debe cerrar cada temporada');
  const previousLog=car.regenLog||[];
  car=result.car;
  const seasonEvents=(car.regenLog||[]).slice(previousLog.length).filter(e=>e.club===club);
  totalEvents+=2;
  assert(seasonEvents.length>=2,'cada temporada debe generar los dos juveniles forzados');
  seasonEvents.forEach(e=>assert(car.rosters[club].some(p=>p.regen&&p.n===e.regen),'cada juvenil recién generado debe quedar en el plantel'));

  assert.equal(car.season,2027+year,'el calendario debe avanzar año a año');
  assert.equal(car.rosters[club].length,initialSize,'el plantel debe conservar su tamaño');
  assert(car.regenLog.length>=initialLog+totalEvents,'el historial global debe acumular los retiros de las seis temporadas');
  assert((car.regenLog||[]).filter(e=>e.club===club).length>=initialClubLog+totalEvents,'el historial del club debe acumular sus retiros');
  const uids=car.rosters[club].map(p=>p.uid);
  assert.equal(new Set(uids).size,uids.length,'no puede haber UID duplicados');

  // Simula guardar y restaurar la carrera, como hace el guardado local.
  car=JSON.parse(JSON.stringify(car));
  const cfg=ENG.careerCfg(car);
  assert(cfg.real&&cfg.teams.includes(club),'la carrera restaurada debe volver a cargar sus planteles');
  const active=DATA.squadMode(club,false);
  assert(active.some(p=>p.regen),'el motor debe utilizar los juveniles después de restaurar');
}

assert((car.regenLog||[]).filter(e=>e.club===club).length>=initialClubLog+12,'seis temporadas deben dejar doce regens registrados en el club');
console.log('OK: seis temporadas consecutivas, doce retiros, UID únicos, tamaño estable, historial y restauración JSON de carrera.');
