const assert=require('assert');
const {init,next}=require('./public/player-regens');
const cats=[{teams:['club1']}];
const base=[{p:'DEL',n:'A. González',r:72,age:37,at:{rem:75,vel:70,des:72}},{p:'POR',n:'B. Pérez',r:68,age:39,at:{ref:70,par:68,man:65,sal:66}}];
const rosters=init(cats,()=>base);
const first=next(rosters,2027);
assert.equal(first.events.length,2,'deben retirarse el jugador de campo de 37 y el arquero de 39 al cumplir el límite');
assert.equal(first.rosters.club1.length,2,'el plantel debe conservar su cantidad');
for(const e of first.events){assert(e.regen,'cada retiro debe generar un regen');}
const regen=first.rosters.club1.find(p=>p.regen);
assert(regen&&regen.age>=16&&regen.age<=18,'el regen debe ser juvenil');
assert.equal(regen.p,'DEL','debe conservar la posición');
assert.equal(regen.n.split(' ').slice(-1)[0],'González','debe conservar el apellido');
assert(regen.r>=42&&regen.r<=54,'media juvenil inicial');
const second=next(first.rosters,2028);
assert.equal(second.events.length,0,'no debe duplicar los retiros ya procesados');
assert(first.rosters.club1.some(p=>p.regen),'el regen debe persistir en la temporada siguiente');

const homonyms=init(cats,()=>[
 {p:'DEF',n:'A. González',r:65,age:37,uid:'same-a',at:{mar:68}},
 {p:'MED',n:'A. González',r:66,age:37,uid:'same-b',at:{pas:69}}
]);
const homonymNext=next(homonyms,2027);
assert.equal(homonymNext.events.length,2,'los homónimos deben retirarse por separado');
assert.notEqual(homonymNext.events[0].regen,homonymNext.events[1].regen,'cada homónimo debe recibir un regen distinto');
assert.deepEqual(homonymNext.rosters.club1.filter(p=>p.regen).map(p=>p.p).sort(),['DEF','MED'],'cada regen debe conservar el puesto de su padre');

console.log('OK: retiro, regen juvenil, posición, apellido, persistencia y sin duplicados.');
