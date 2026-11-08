const assert=require('assert');
const DATA=require('./public/data');
const SIM=require('./public/sim2d');
const group=r=>r==='POR'?'POR':['DFC','LI','LD','LIB'].includes(r)?'DEF':['MCD','MC','MO','MP','MI','MD'].includes(r)?'MED':['DC','SD','EI','ED'].includes(r)?'DEL':null;
const exact=q=>q.rl==='ARQ'?'POR':q.rl==='DEF'?'DFC':q.rl==='L'?(q.rs<0?'LI':'LD'):q.rl==='M'?(q.rs<0?'MI':'MD'):q.rl==='EX'?(q.rs<0?'EI':'ED'):q.rl;
const roles=new Set();
for(let f=0;f<DATA.FM.length;f++)for(let st=0;st<3;st++)SIM.roleLayout(f,st).forEach(q=>roles.add(exact(q)));
const players=[];let id=0;
for(const role of roles)for(let n=0;n<4;n++)players.push({n:'P'+(++id),p:group(role),specificRole:role,r:70+n,at:{pas:70+n,ctl:70+n,reg:70+n,rem:70+n,des:70+n,mar:70+n,ant:70+n,ref:15,vel:70+n,ace:70+n,res:70+n,fue:70+n,cab:70+n,cen:70+n,pot:70+n,agr:70+n,par:15,man:15,sal:15,pie:70+n,lea:50}});
for(let f=0;f<DATA.FM.length;f++)for(let st=0;st<3;st++){
 const xi=DATA.autoXI(players,f,null,st),layout=SIM.roleLayout(f,st);
 assert.strictEqual(xi.length,11,'once titulares');
 assert.strictEqual(new Set(xi).size,11,'sin duplicados');
 layout.forEach((q,k)=>assert.strictEqual(players[xi[k]].specificRole,exact(q),'puesto exacto '+DATA.FN[f]+' / '+st+' / '+k));
}
// En sistemas de doble punta deben existir un SD y un DC, y la media debe permitir que entre el mejor delantero.
for(const f of [0,2,4,9]){
 const rolesIn=DATA.exactSlots(f,1).filter(x=>x==='SD'||x==='DC').sort();
 assert.deepStrictEqual(rolesIn,['DC','SD'],DATA.FN[f]+' debe tener SD y DC');
}
const doubleSquad=[];
for(const role of roles){for(let n=0;n<3;n++)doubleSquad.push({n:role+n,p:group(role),specificRole:role,r:70+n,at:{pas:70,ctl:70,reg:70,rem:70,des:70,mar:70,ant:70,ref:15,vel:70,ace:70,res:70,fue:70,cab:70,cen:70,pot:70,agr:70,par:15,man:15,sal:15,pie:70,lea:50}})}
doubleSquad.push({n:'A. Correa',p:'DEL',specificRole:'DC',r:91,at:{pas:88,ctl:90,reg:88,rem:91,des:90,mar:35,ant:60,ref:15,vel:86,ace:86,res:82,fue:78,cab:80,cen:55,pot:90,agr:60,par:15,man:15,sal:15,pie:80,lea:60}});
const correaXI=DATA.autoXI(doubleSquad,0,null,1);
assert(correaXI.includes(doubleSquad.findIndex(x=>x.n==='A. Correa')),'el delantero con mejor media debe entrar en el 4-4-2');
let clubs=0,river=null;
for(const div of DATA.DIVS)for(const team of div.teams){
 const sq=DATA.squad(team.id);if(!sq||sq.length<11)continue;
 const xi=DATA.autoXI(sq,0,null,1),layout=SIM.roleLayout(0,1);assert.strictEqual(xi.length,11,team.id+' once completo');assert.strictEqual(new Set(xi).size,11,team.id+' sin duplicados');assert(xi.every(i=>i>=0&&i<sq.length),team.id+' índices válidos');
 if(team.id==='river')river={sq,xi,layout};
 clubs++;
}
if(river)console.log('River 4-4-2:',river.layout.map((q,k)=>exact(q)+': '+river.sq[river.xi[k]].n+' ('+river.sq[river.xi[k]].specificRole+')').join(' | '));
console.log('OK: asignación exacta en '+(DATA.FM.length*3)+' combinaciones de formación/estilo y planteles de '+clubs+' clubes sin duplicados.');
