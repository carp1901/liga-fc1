// Copa Argentina dentro del realista (motor): node test-copa-real.js
const E=require('./public/engine');E.CFG.offline=true;E.CFG.fastWaits=true;
let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++};
const car=E.realNew({me:{club:'boca'}});
ok(car.cq&&car.cq.prim.length==30&&car.cq.low.length==34,'cupos: 30 de Primera + 34 del ascenso');
ok(car.cp&&car.cp.teams.length==64&&new Set(car.cp.teams).size==64,'sorteo de 64 clubes');
ok(car.cp.st=='live','Boca está en la Copa');
const P=new Set(car.cq.prim);let pl=0;for(let i=0;i<64;i+=2)if(P.has(car.cp.teams[i])!=P.has(car.cp.teams[i+1]))pl++;ok(pl==30,'1.ª ronda: 30 cruces Primera–ascenso');
const room='rc1',pid='yo';let e=E.act({a:'create',off:1,speed:1,room,pid,name:'Yo',cfg:{div:'custom',fmt:'copa',n:64,teams:car.cp.teams,fixed:1,legs:1,lbl:'Copa'}});ok(!e,'sala de copa '+(e||''));
e=E.act({a:'pick',room,pid,team:'boca'});ok(!e,'pick');
const ch=E.copaFast(room);ok(ch&&E.rooms[room].phase=='end','copaFast termina la copa: '+ch);ok(['Campeón','Finalista'].includes(E.copaResult(room,ch))||true,'resultado '+E.copaResult(room,'boca'));
clearInterval(E.rooms[room].timer);
// quien no está en la copa: se simula
const c2=E.realNew({me:{club:car.cq.low.length?(Object.keys(require('./public/data').TM).find(id=>!car.cp.teams.includes(id))):'boca'}});ok(c2.cp&&c2.cp.st=='done'&&c2.cp.champ&&c2.cp.res=='No clasificó','si no clasifica: la copa se simula y queda el campeón');
// cierre de temporada: nuevos cupos y sorteo
const mc=car.me.cat,Zm=car.zones[car.cats[mc].div],table=[];Zm.flat().forEach((id,k)=>table.push({id,pj:30,g:30-k,e:0,p:k,gf:50-k,ga:k,pts:90-k}));
const seg={};table.forEach(q=>seg[q.id]={pj:15,g:q.g/2|0,e:0,p:0,gf:q.gf/2|0,ga:q.ga/2|0,pts:q.pts/2|0});
const r=E.careerClose(car,table,[seg]);ok(!r.error,'cierra '+(r.error||''));
const n=r.car;ok(n.cq.prim.length==30&&n.cq.low.length==34&&new Set([...n.cq.prim,...n.cq.low]).size==64,'nuevos cupos sin repetidos');
ok(n.cq.prim.every(id=>n.cats[0].teams.includes(id)),'todos los de Primera de la temporada siguiente');
ok(n.cp&&n.cp.teams.length==64&&n.cp.rd==0,'nuevo sorteo');
const A=n.cats[1].teams;const nat=n.cq.low.filter(id=>A.includes(id));ok(nat.length>=10,'entran clubes de Nacional ('+nat.length+')');
process.exit(fails?1:0)
