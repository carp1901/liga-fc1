// Mínimos para el ranking y el online: participantes HUMANOS (salas públicas, partida aleatoria, ranking) separados de la cantidad de EQUIPOS (tamaño del torneo). node test-minimos.js
process.env.PORT=process.env.PORT||String(36000+Math.floor(Math.random()*2000));
const E=require('./public/engine'),D=require('./public/data');E.CFG.fastWaits=true;
let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++};
const H=D.MIN_HUMANOS,N=D.MIN_EQUIPOS;
// sala simulada: h humanos y n equipos (el resto son bots); solo lo que miran rankInfo y competitivoInfo
// cada humano de la sala simulada tiene su cuenta (uid) salvo que o.uid diga otra cosa (SEG-06: cuentan cuentas distintas)
const fake=(h,n,o)=>{o=o||{};const pl={},order=[];for(let i=0;i<n;i++){const p='p'+i;pl[p]={bot:i>=h,uid:i<h?(o.uid?o.uid(i):'u'+i):undefined};order.push(p)}return{order,pl,part:[],cfg:{n,fmt:o.fmt||'liga1'},offline:!!o.offline,phase:o.phase||'end'}};
(async()=>{
 console.log('== constantes compartidas');
 ok(H===8&&N===8,'MIN_HUMANOS = 8 y MIN_EQUIPOS = 8 (data.js)');
 ok(E.CFG.rankMin===H&&E.CFG.rankMinN===N&&E.CFG.randN===H&&D.RANDOM_N===H,'el motor usa las constantes (rankMin, rankMinN, randN, RANDOM_N)');

 console.log('\n== ranking online: humanos y equipos se cuentan por separado');
 const ri=(h,n,o)=>E.rankInfo(fake(h,n,o));
 ok(ri(8,8).ok,'8 humanos en un torneo de 8 equipos: suma');
 ok(!ri(7,8).ok,'7 humanos (y 1 bot) en un torneo de 8 equipos: no suma');
 ok(ri(8,16).ok,'8 humanos en un torneo de 16 equipos (8 bots): suma');
 ok(!ri(7,16).ok,'7 humanos en un torneo de 16 equipos: no suma aunque haya 16 equipos');
 ok(!ri(4,4).ok&&!ri(6,6).ok,'torneos de 4 o 6 equipos: no suman aunque todos sean humanos');
 ok(!ri(8,8,{offline:true}).ok,'offline: el ranking online nunca cuenta');
 const r9=fake(7,8);r9.partU=['u0','u1','u2','u3','u4','u5','u6','u7'];ok(E.rankInfo(r9).ok&&E.rankInfo(r9).h==8,'cuentan las cuentas que participaron (partU), aunque una se haya ido');

 console.log('\n== SEG-06: cuentas distintas, no conexiones');
 ok(!ri(8,8,{uid:()=>'misma'}).ok&&E.rankInfo(fake(8,8,{uid:()=>'misma'})).h===1,'8 pestañas de la misma cuenta: cuentan como 1 y no suman');
 ok(!ri(8,8,{uid:i=>i<7?'u'+i:undefined}).ok,'7 cuentas + 1 invitado: no suma');
 ok(!ri(8,8,{uid:()=>undefined}).ok,'8 invitados sin cuenta: no suma');
 const rp=fake(8,8,{uid:()=>undefined});rp.part=['a','b','c','d','e','f','g','h'];ok(!E.rankInfo(rp).ok,'part con pid de invitados ya no cuenta (solo partU)');
 ok(!E.competitivoInfo(fake(8,8,{uid:i=>i<7?'u'+i:undefined})).competitivo,'competitivo: 7 cuentas + 1 invitado no alcanza');
 const i0=ri(8,8);ok(i0.min===H&&i0.minN===N&&i0.h===8&&i0.n===8,'rankInfo informa min (humanos), minN (equipos), h y n');

 console.log('\n== «competitivo» de la carrera (historial del técnico)');
 const cp=(h,n,o)=>E.competitivoInfo(fake(h,n,o)).competitivo;
 ok(cp(8,8)&&cp(8,8,{fmt:'copa'})&&cp(8,8,{fmt:'liga2'}),'8 humanos y 8 equipos: competitivo en liga, liga ida y vuelta y copa');
 ok(!cp(7,8)&&!cp(7,8,{fmt:'copa'}),'7 humanos: no competitivo (liga ni copa)');
 ok(cp(8,16)&&!cp(7,16),'16 equipos: depende de los humanos, no de los equipos');
 ok(!cp(8,8,{offline:true}),'offline: nunca competitivo por esta vía');
 ok(E.competitivoInfo(fake(8,16)).competidores===8,'competidores = humanos (no equipos)');

 console.log('\n== salas públicas');
 const e8=D.catalog().find(e=>e.fmts.includes('liga1')&&(e.sizes.liga1||[]).includes(8)),e6=D.catalog().find(e=>e.fmts.includes('liga1')&&(e.sizes.liga1||[]).includes(6));
 const p8=E.pubApi({op:'create',pid:'pa',uid:'ua',name:'A',div:e8.key,fmt:'liga1',n:8});ok(p8.room&&!p8.error,'sala pública de 8 jugadores: se crea ('+e8.key+')');
 const p6=E.pubApi({op:'create',pid:'pb',uid:'ub',name:'B',div:e6.key,fmt:'liga1',n:6});ok(/8 jugadores/.test(p6.error||''),'sala pública de 6: rechazada con el mínimo de 8 en el texto');

 console.log('\n== partida aleatoria');
 const views={},P=Array.from({length:H},(_,i)=>'r'+i);let room=null;
 P.forEach((p,i)=>{const j=E.rJoin({pid:p,uid:'ur'+i,name:p,mode:'queue'});room=room||j.room;E.listen(j.room,p,v=>views[p]=v)});
 const q=E.rooms[room];ok(q&&q.order.length==H&&q.phase=='vote1','la cola arranca la votación con el 8.º jugador');

 console.log('\n== servidor: títulos offline (offlineRec) y consultas del ranking (store)');
 const caps=[],stub=new Proxy({},{get:(t,k)=>k=='insert'?rec=>{caps.push(rec);return Promise.resolve({status:'inserted'})}:k=='init'?()=>Promise.resolve(false):()=>Promise.resolve({})});
 require.cache[require.resolve('./store')]={id:'store',filename:require.resolve('./store'),loaded:true,exports:stub};
 require('./server');await new Promise(r=>setTimeout(r,300));
 const post=b=>fetch('http://127.0.0.1:'+process.env.PORT+'/api/titulo-offline',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(r=>r.json());
 const ar1=D.DIVS.find(d=>d.id=='ar1').teams[0].id,tid=()=>'t'+Math.random().toString(36).slice(2,12);
 for(const [fmt,n,exp] of [['liga1',8,true],['copa',8,true],['liga1',6,false],['copa',4,false],['liga1',20,true]]){caps.length=0;await post({tid:tid(),comp:'ar1',club:ar1,fmt,n,pid:'s'+n+fmt});ok(caps.length==1&&caps[0].competitivo===exp,'título offline '+fmt+' de '+n+' equipos: competitivo='+exp)}
 delete require.cache[require.resolve('./store')];const store=require('./store'),qs=[];
 store.init({pool:{query:(sql,params)=>{qs.push({sql:String(sql),params:params||[]});return Promise.resolve({rows:[],rowCount:0})},on(){}}});
 await store.rankingTecnicos('historico','offline');const rq=qs.find(x=>/FROM carreras c JOIN usuarios/.test(x.sql));
 ok(rq&&!/ELSE 10/.test(rq.sql)&&new RegExp("modalidad='offline' AND c\\.participantes >= "+N+'\\)').test(rq.sql),'ranking de técnicos: las carreras offline cuentan desde '+N+' equipos (sin el 10)');
 const src=require('fs').readFileSync(require.resolve('./store'),'utf8');ok(!/THEN 8 ELSE 10/.test(src),'store.js no conserva el mínimo de 10 en ninguna consulta');

 Object.values(E.rooms).forEach(x=>clearInterval(x.timer));console.log(fails?'\nFALLAS: '+fails:'\nTodo OK');process.exit(fails?1:0)})().catch(e=>{console.log('ERROR',e.stack);process.exit(1)});
