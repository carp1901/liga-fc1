// Prueba del clásico personalizado (temporadas, ascensos y descensos), sin navegador: node test-clasico.js
const E=require('./public/engine'),D=require('./public/data');E.CFG.offline=true;E.CFG.fastWaits=true;
let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++},sleep=ms=>new Promise(r=>setTimeout(r,ms)),until=async(f,ms=60000)=>{const t=Date.now();while(!f()&&Date.now()-t<ms)await sleep(10);return f()},uniq=a=>new Set(a).size==a.length;
const tbl=(ids)=>ids.map((id,i)=>({id,pj:0,gf:10-i,ga:i,pts:100-i*10,g:10-i,e:0,p:0})),all=car=>car.cats.flatMap(c=>c.teams);
async function playSeason(car,tag){const room='cx'+tag,pid='yo';let last=null;
 const e=E.act({a:'create',off:1,speed:100,room,pid,name:'Yo',cfg:E.careerCfg(car)});if(e)throw new Error('create: '+e);E.listen(room,pid,v=>last=v);
 const e2=E.act({a:'pick',room,pid,team:car.me.club});if(e2)throw new Error('pick: '+e2);
 const iv=setInterval(()=>{if(['pre','lobby'].includes(last.phase))E.act({a:'ready',room,pid,v:true})},10);const fin=await until(()=>last.phase=='end');clearInterval(iv);
 const out={ok:fin,table:last.table,champ:last.champ,view:last};clearInterval(E.rooms[room].timer);delete E.rooms[room];return out}
(async()=>{
 console.log('== armado de la carrera');
 let c=E.careerNew({k:4,n:6,ud:2,fmt:'liga1',me:{club:'boca',cat:0},picks:[['river'],[],[]]});
 ok(!c.error&&c.season==2026&&c.cats.length==4&&c.cats.every(x=>x.teams.length==6)&&uniq(all(c)),'4 categorías de 6 equipos, 24 clubes distintos, temporada 2026');
 ok(c.cats[0].teams.includes('boca')&&c.cats[0].teams.includes('river'),'respeta los equipos elegidos (tu club y River en la 1ª)');
 ok(c.cats.every((x,i)=>x.teams.filter(id=>D.DIVS.find(d=>d.id==x.div).teams.some(t=>t.id==id)).length==6),'el resto se completa al azar con clubes de esa misma categoría real');
 c=E.careerNew({k:6,n:20,ud:3,fmt:'liga2',me:{club:'boca',cat:0}});ok(!c.error&&c.cats.every(x=>x.teams.length==20)&&uniq(all(c))&&all(c).length==120,'6 categorías de 20: 120 clubes distintos (Promocional Amateur tiene 17 y se completa con otros)');
 ok(E.careerNew({k:4,n:7,ud:1,fmt:'liga1',me:{club:'boca',cat:0}}).error,'equipos impares: rechazado');
 ok(E.careerNew({k:4,n:6,ud:4,fmt:'liga1',me:{club:'boca',cat:0}}).error,'más ascensos que la mitad de la categoría: rechazado');
 ok(E.careerNew({k:4,n:6,ud:2,fmt:'copa',me:{club:'boca',cat:0}}).error,'mata-mata no es válido para ascensos: rechazado');
 ok(E.careerNew({k:4,n:6,ud:2,fmt:'liga1',me:{club:'boca',cat:0},picks:[['river'],['river'],[]]}).error,'un club elegido en dos categorías: rechazado');
 ok(E.careerNew({k:4,n:4,ud:1,fmt:'liga1',me:{club:'boca',cat:0},picks:[['a1','b1','c1','d1','e1'],[],[]]}).error,'más clubes elegidos que lugares: rechazado');
 ok(E.careerNew({k:4,n:6,ud:2,fmt:'liga1',me:{club:'boca',cat:5}}).error&&E.careerNew({k:4,n:6,ud:2,fmt:'liga1',me:{club:'noexiste',cat:0}}).error,'categoría o club inválidos: rechazado');
 c=E.careerNew({k:1,n:8,ud:3,fmt:'liga1',me:{club:'boca',cat:0}});ok(!c.error&&c.ud==0,'una sola categoría: sin ascensos ni descensos');
 console.log('\n== sala de la categoría del jugador');
 c=E.careerNew({k:2,n:4,ud:1,fmt:'liga1',me:{club:'boca',cat:0}});const cfg=E.careerCfg(c);
 ok(E.act({a:'create',off:1,speed:100,room:'cxa',pid:'p',name:'P',cfg})==null,'se crea la sala con los equipos de la carrera');E.act({a:'pick',room:'cxa',pid:'p',team:'boca'});
 const rm=E.rooms.cxa;ok(rm.phase=='pre'&&rm.order.length==4&&rm.order.every(p=>c.cats[0].teams.includes(rm.pl[p].team)),'arranca solo con los 4 equipos de la categoría (los demás son IA)');
 const snap=E.snapshot('cxa');ok(snap&&JSON.parse(snap).room.cfg.teams.length==4,'una carrera personalizada también se puede guardar');clearInterval(rm.timer);delete E.rooms.cxa;
 const rs=E.restore(snap,{pid:'otro'});ok(rs.code&&E.rooms[rs.code].cfg.teams.join()==c.cats[0].teams.join(),'se carga con los mismos equipos');clearInterval(E.rooms[rs.code].timer);delete E.rooms[rs.code];
 ok(E.act({a:'create',off:1,room:'cxb',pid:'p',name:'P',cfg:{...cfg,teams:[...cfg.teams.slice(0,3),cfg.teams[0]]}})=='Configuración inválida','equipos repetidos: rechazado');
 ok(E.act({a:'create',off:1,room:'cxb',pid:'p',name:'P',cfg:{...cfg,fmt:'copa'}})=='Configuración inválida','mata-mata personalizado: rechazado');
 E.CFG.offline=false;ok(E.act({a:'create',off:1,room:'cxb',pid:'p',name:'P',cfg})=='Configuración inválida','en el servidor online no se puede crear');E.CFG.offline=true;
 console.log('\n== ascensos y descensos (tablas armadas)');
 const mk=(mc,pos)=>{const car=E.careerNew({k:4,n:4,ud:1,fmt:'liga1',me:{club:'boca',cat:mc}});const t=car.cats[mc].teams.filter(x=>x!='boca');t.splice(pos,0,'boca');return{car,table:tbl(t)}};
 for(const [mc,pos,exp0,cat0] of [[1,0,'sube',0],[1,3,'baja',2],[1,1,'sigue',1],[2,0,'sube',1],[0,3,'baja',1],[0,0,'sigue',0],[2,3,'sigue',2]]){
  const {car,table}=mk(mc,pos),r=E.careerClose(car,table),nc=r.car;
  // B Metro sube tantos como clubes metropolitanos bajaron de Nacional: si el que bajó es del interior, ese cupo lo usa Federal A
  const sinCupo=mc==2&&exp0=='sube'&&!r.summary.cats[1].down.some(E.isMetro),exp=sinCupo?'sigue':exp0,cat=sinCupo?2:cat0;
  ok(!r.error&&r.summary.me.res==exp&&nc.me.cat==cat&&nc.season==2027,'categoría '+(mc+1)+', puesto '+(pos+1)+' → '+exp+' (pasa a la categoría '+(cat+1)+')');
  ok(nc.cats.every(x=>x.teams.length==4)&&uniq(all(nc))&&all(nc).length==16&&all(nc).slice().sort().join()==all(car).slice().sort().join(),'   los 16 clubes siguen siendo los mismos y cada categoría tiene 4');
  if(exp=='sube'){const s=r.summary;ok(s.cats[mc].up.includes('boca')&&nc.cats[cat].teams.includes('boca')&&s.cats[cat].down.every(id=>nc.cats[mc].teams.includes(id)),'   el que sube y el que baja se cruzan entre las dos categorías')}}
 {const car=E.careerNew({k:4,n:6,ud:3,fmt:'liga1',me:{club:'boca',cat:1}}),t=car.cats[1].teams.filter(x=>x!='boca');t.splice(1,0,'boca');const r=E.careerClose(car,tbl(t));
  ok(!r.error&&r.car.cats.every(x=>x.teams.length==6)&&uniq(all(r.car)),'ud=3 con n=6 (categoría del medio: 3 suben y 3 bajan, nadie se repite)')}
 {const car=E.careerNew({k:1,n:6,ud:2,fmt:'liga1',me:{club:'boca',cat:0}}),r=E.careerClose(car,tbl(car.cats[0].teams));ok(!r.error&&r.car.season==2027&&r.car.cats[0].teams.slice().sort().join()==car.cats[0].teams.slice().sort().join(),'una sola categoría: pasa la temporada sin mover a nadie')}
 ok(E.careerClose(mk(1,0).car,tbl(['a','b','c','d'])).error,'tabla que no es de tu categoría: error claro');
 console.log('\n== temporadas reales encadenadas (3 categorías de 4, suben/bajan 1)');
 let car=E.careerNew({k:4,n:4,ud:1,fmt:'liga1',me:{club:'boca',cat:1}});
 for(let s=0;s<2;s++){const p=await playSeason(car,'s'+s);ok(p.ok&&p.table.length==4,'temporada '+car.season+' jugada hasta el final (categoría '+(car.me.cat+1)+')');
  const t0=Date.now(),r=E.careerClose(car,p.table);ok(!r.error&&r.car.season==car.season+1&&uniq(all(r.car))&&r.car.cats.every(x=>x.teams.length==4),'   cierra bien (se simularon las otras 2 categorías en '+(Date.now()-t0)+' ms)');
  const m=r.summary.me;ok((m.res=='sube'?m.to==m.from-1:m.res=='baja'?m.to==m.from+1:m.to==m.from)&&r.car.me.cat==m.to&&r.car.cats[m.to].teams.includes('boca'),'   el resultado ('+m.res+', puesto '+m.pos+') coincide con la categoría donde queda Boca');car=r.car}
 ok(car.hist.length==2&&car.season==2028,'el historial guarda las 2 temporadas jugadas');
 console.log('\n== vías paralelas B Metro / Federal A (6 categorías de 10, suben y bajan 3)');
{let car=E.careerNew({k:6,n:10,ud:3,fmt:'liga1',me:{club:'boca',cat:0}}),good=true,msg='',base=all(car).slice().sort().join();
 ok(car.cats[2].div=='ar3'&&car.cats[3].div=='ar5','orden: 3.º B Metro y 4.º Federal A, paralelas');
 for(let y=0;y<8&&good;y++){const t=car.cats[car.me.cat].teams.slice(),r=E.careerClose(car,tbl(t));if(r.error){good=false;msg=r.error;break}
  const n2=r.car,d=r.summary.cats[1].down;
  if(!(n2.cats.every(x=>x.teams.length==10)&&uniq(all(n2))&&all(n2).slice().sort().join()==base)){good=false;msg='tamaño/clubes año '+y}
  else if(!d.every(id=>E.isMetro(id)?n2.cats[2].teams.includes(id):n2.cats[3].teams.includes(id))){good=false;msg='vía equivocada año '+y}
  else if(r.summary.cats[3].down.length||r.summary.cats[2].up.length+r.summary.cats[3].up.length!=3){good=false;msg='cupos año '+y}
  car=n2}
 ok(good,'8 temporadas encadenadas: 60 clubes constantes, cada descendido de Nacional va a su vía, Federal A sin descenso, suben 3 en total a Nacional '+msg)}
ok(E.careerNew({k:3,n:6,ud:2,fmt:'liga1',me:{club:'boca',cat:0}}).error&&!E.careerNew({k:4,n:6,ud:2,fmt:'liga1',me:{club:'boca',cat:0}}).error,'4 categorías ok; 3 categorías rechazado');
console.log('\n== el título cuenta para el ranking');
 const weak=D.DIVS.flatMap(d=>d.teams.map(t=>t.id)).filter(x=>x!='river').sort((a,b)=>{const f=x=>{const s=E.teamStrength(x);return s.a+s.m+s.d};return f(a)-f(b)}).slice(0,3),recs=[];
 E.CFG.onTitle=rec=>{recs.push(rec);return Promise.resolve({status:'inserted'})};
 car=E.careerNew({k:1,n:4,ud:1,fmt:'liga1',me:{club:'river',cat:0},picks:[['river',...weak]]});let got=null;
 for(let s=0;s<6&&!got;s++){const p=await playSeason(car,'t'+s);if(p.champ=='river')got=recs[recs.length-1];car=E.careerClose(car,p.table).car}
 ok(!!got,'River (contra los 3 más débiles) ganó una temporada y se informó el título');
 if(got){ok(got.mod=='offline'&&got.comp=='pers'&&got.compNombre=='Clásico personalizado'&&got.club=='river'&&got.n==4&&got.fmt=='liga1'&&/^[a-z0-9]{8,60}$/.test(got.tid),'el título sale como offline · «Clásico personalizado» · liga de 4 equipos');ok(uniq(recs.map(r=>r.tid)),'cada temporada tiene su propio id de torneo (no se duplica en el palmarés)')}
 console.log(fails?'\n'+fails+' FALLAS':'\nTodo OK');process.exit(fails?1:0)})().catch(e=>{console.log('ERROR',e.stack.split('\n').slice(0,4).join(' | '));process.exit(1)});
