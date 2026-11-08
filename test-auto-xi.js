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
let clubs=0,river=null;
for(const div of DATA.DIVS)for(const team of div.teams){
 const sq=DATA.squad(team.id);if(!sq||sq.length<11)continue;
 const xi=DATA.autoXI(sq,0,null,1),layout=SIM.roleLayout(0,1);assert.strictEqual(xi.length,11,team.id+' once completo');assert.strictEqual(new Set(xi).size,11,team.id+' sin duplicados');assert(xi.every(i=>i>=0&&i<sq.length),team.id+' índices válidos');
 if(team.id==='river')river={sq,xi,layout};
 clubs++;
}
if(river)console.log('River 4-4-2:',river.layout.map((q,k)=>exact(q)+': '+river.sq[river.xi[k]].n+' ('+river.sq[river.xi[k]].specificRole+')').join(' | '));
console.log('OK: asignación exacta en '+(DATA.FM.length*3)+' combinaciones de formación/estilo y planteles de '+clubs+' clubes sin duplicados.');
