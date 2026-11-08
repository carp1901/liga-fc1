'use strict';
const assert=require('assert');
const DATA=require('./public/data');
const ENG=require('./public/engine');
const REG=require('./public/player-regens');

const nat=DATA.DIVS.find(d=>d.id==='ar2');
assert(nat&&nat.teams.length,'debe existir Primera Nacional');
const club=nat.teams[0].id;
let car=ENG.realNew({me:{club}});
assert(!car.error&&car.rosters&&car.rosters[club],'debe iniciar carrera');
const initialSize=car.rosters[club].length;
const retired=new Set();
let forcedEvents=0;
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

  // Mismo paso generacional que ejecuta careerClose, aislado para acelerar seis ciclos.
  const nextSeason=car.season+1;
  const gen=REG.next(car.rosters,nextSeason);
  const oldLog=car.regenLog||[];
  car={...car,season:nextSeason,rosters:gen.rosters,regenLog:[...oldLog,...gen.events]};
  const events=gen.events.filter(e=>e.club===club);
  assert(events.length>=2,'cada temporada debe generar los dos juveniles forzados');
  forcedEvents+=2;
  events.forEach(e=>assert(car.rosters[club].some(p=>p.regen&&p.n===e.regen),'cada juvenil recién generado debe quedar en el plantel'));

  assert.equal(car.season,2027+year,'el calendario debe avanzar año a año');
  assert.equal(car.rosters[club].length,initialSize,'el plantel debe conservar su tamaño');
  assert((car.regenLog||[]).filter(e=>e.club===club).length>=initialClubLog+forcedEvents,'el historial del club debe acumular los retiros');
  const uids=car.rosters[club].map(p=>p.uid);
  assert.equal(new Set(uids).size,uids.length,'no puede haber UID duplicados');

  // Simula guardar y restaurar la carrera como hace el guardado local.
  car=JSON.parse(JSON.stringify(car));
  const cfg=ENG.careerCfg(car);
  assert(cfg.real&&cfg.teams.includes(club),'la carrera restaurada debe volver a cargar sus planteles');
  const active=DATA.squadMode(club,false);
  assert(active.some(p=>p.regen),'el motor debe utilizar los juveniles después de restaurar');
}

assert((car.regenLog||[]).filter(e=>e.club===club).length>=initialClubLog+12,'seis temporadas deben dejar doce regens registrados en el club');
console.log('OK: seis ciclos generacionales, doce retiros forzados, UID únicos, tamaño estable, historial y restauración JSON de carrera.');
