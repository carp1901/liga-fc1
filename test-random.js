// Prueba de la partida aleatoria (Bloque 2), sin navegador: node test-random.js
const E=require('./public/engine'),D=require('./public/data');
Object.assign(E.CFG,{tick:20,rVoteT:8,rGraceV:200,rGraceP:400});
let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++},sleep=ms=>new Promise(r=>setTimeout(r,ms)),until=async(f,ms=4000)=>{const t=Date.now();while(!f()&&Date.now()-t<ms)await sleep(10)};
const views={},conn=(room,pid)=>E.listen(room,pid,v=>views[pid]=v);
const join=(pid,b={})=>E.rJoin({pid,name:'J'+pid,...b});
(async()=>{
 // 1) cola global: 9 en cola, el 10º dispara la votación; todos en la misma sala
 const P=Array.from({length:10},(_,i)=>'p'+i);let room;
 for(let i=0;i<9;i++){const r=join(P[i]);room=room||r.room;ok(r.room===room,'jugador '+(i+1)+' entra a la misma cola');conn(room,P[i])}
 ok(views.p0.phase=='queue'&&views.p0.rq.n==9,'con 9 personas sigue en cola (9/10)');
 ok(join('p0').room===room,'reconectar con el mismo id devuelve la misma sala');
 const r10=join(P[9]);conn(room,P[9]);ok(r10.room===room&&views.p0.phase=='vote1','el 10º entra y empieza la votación de categoría');
 // 2) votos: inválido rechazado; válidos; empate
 ok(E.act({a:'rv',room,pid:'p0',v:'xx'})=='Opción inválida','voto inválido rechazado');
 ok(E.act({a:'rv',room,pid:'p0',v:'ar1'})=='Opción inválida','voto de otra fase rechazado');
 P.forEach((p,i)=>E.act({a:'rv',room,pid:p,v:i<5?'clasico':'barrial'}));   // 5 a 5 = empate
 ok(views.p0.rq.cnt.clasico==5&&views.p0.rq.cnt.barrial==5,'se cuentan los votos (5 y 5)');
 await until(()=>views.p0.phase=='vote2');
 ok(views.p0.phase=='vote2'&&['clasico','barrial'].includes(views.p0.rq.cat),'tras 15 s (acelerado) pasa a votar competición; empate resuelto al azar: '+views.p0.rq.cat);
 const cat=views.p0.rq.cat,exp=D.catalog().filter(e=>e.cat==cat&&e.random).map(e=>e.key);
 ok(JSON.stringify(views.p0.rq.opts.map(o=>o.id))==JSON.stringify(exp),'opciones = competiciones de la categoría con 10+ clubes ('+exp.length+')');
 ok(!views.p0.rq.opts.some(o=>/patagonia|cordoba/.test(o.id)),'Patagonia y Córdoba (menos de 10 clubes) no aparecen');
 const pick=exp[exp.length-1];P.forEach(p=>E.act({a:'rv',room,pid:p,v:pick}));await until(()=>views.p0.phase=='pick');
 ok(views.p0.phase=='pick'&&views.p0.cfg.div==pick&&views.p0.cfg.fmt=='liga1'&&views.p0.cfg.n==10,'queda elegida la competición, liga de 1 rueda, 10 jugadores');
 // 3) elegir clubes: no se puede repetir
 const pool=pick.startsWith('cup:')?D.CUPS.find(c=>'cup:'+c.id==pick).clubs:D.DIVS.find(d=>d.id==pick).teams.map(t=>t.id);
 ok(E.act({a:'pick',room,pid:'p0',team:pool[0]})==null,'p0 elige un club');
 ok(E.act({a:'pick',room,pid:'p1',team:pool[0]})=='Equipo ocupado','p1 no puede elegir el mismo club');
 for(let i=1;i<10;i++)E.act({a:'pick',room,pid:P[i],team:pool[i]});
 ok(views.p0.phase=='pre','con los 10 clubes elegidos empieza la preparación (pretemporada)');
 // 4) baja durante la votación + vacante con confirmación
 const Q=Array.from({length:10},(_,i)=>'q'+i);let r2;
 E.CFG.rVoteT=40;Q.forEach(p=>{const r=join(p);r2=r2||r.room;conn(r2,p)});ok(r2!=room&&views.q0.phase=='vote1','la nueva tanda de 10 arma otra sala');
 E.listen(r2,'q9',null);await until(()=>views.q0.rq.n==9);
 ok(views.q0.rq.n==9,'q9 se desconecta: pasada la gracia se libera su lugar (9/10)');
 const o=join('n1');ok(o.offer&&o.offer.room==r2&&o.offer.libres==1,'un jugador nuevo recibe la oferta de la vacante');
 const j=join('n1',{mode:'join',room:r2});ok(j.room==r2,'acepta y entra a la partida con vacante');conn(r2,'n1');
 const q2=join('n2',{mode:'queue'});ok(q2.room&&q2.room!=r2&&views.q0.rq.n==10||q2.room!=r2,'quien rechaza la oferta va a una cola nueva');
 // 5) baja durante la elección de clubes libera el club
 Q.slice(0,9).concat('n1').forEach(p=>E.act({a:'rv',room:r2,pid:p,v:'barrial'}));await until(()=>views.q0.phase=='vote2');
 const c2=views.q0.rq.opts[0].id;Q.slice(0,9).concat('n1').forEach(p=>E.act({a:'rv',room:r2,pid:p,v:c2}));await until(()=>views.q0.phase=='pick');
 ok(views.q0.phase=='pick','la sala con reemplazo llega a elegir clubes');
 const pool2=c2.startsWith('cup:')?D.CUPS.find(c=>'cup:'+c.id==c2).clubs:D.DIVS.find(d=>d.id==c2).teams.map(t=>t.id);
 E.act({a:'pick',room:r2,pid:'q8',team:pool2[0]});ok(views.q0.own[pool2[0]]=='Jq8','q8 tiene su club');
 E.listen(r2,'q8',null);await until(()=>views.q0.own[pool2[0]]===undefined);
 ok(views.q0.own[pool2[0]]===undefined&&views.q0.n==9,'q8 se va: pasados 30 s (acelerado) su club queda libre y su lugar vacante');
 ok(E.act({a:'pick',room:r2,pid:'n1',team:pool2[0]})==null,'otro jugador puede elegir el club liberado');
 for(const k in E.rooms)clearInterval(E.rooms[k].timer);
 console.log(fails?'\n'+fails+' FALLAS':'\nTodo OK');process.exit(fails?1:0)})();
