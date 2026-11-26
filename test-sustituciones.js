// Prueba de sustituciones en pleno partido (hallazgo A1 de la auditoría): node test-sustituciones.js
// 1) Motor en memoria: cambio válido en el 1.º y en el 2.º tiempo, contador, jugador entrante, límite de 5, sexto rechazado y otras acciones tácticas intactas.
// 2) HTTP: levanta server.js en un puerto libre (sin base de datos) y comprueba que POST /act responde 200 sin error y que el estado enviado por /ev refleja el cambio.
const E=require('./public/engine'),D=require('./public/data'),{spawn}=require('child_process'),path=require('path');
let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++};
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),until=async(f,ms=30000)=>{const t=Date.now();while(!f()&&Date.now()-t<ms)await sleep(5);return f()};
const T=D.DIVS.find(d=>d.id=='ar1').teams.map(t=>t.id);
const noThrow=f=>{try{return{v:f()}}catch(e){return{ex:e}}};
const matchOf=(r,pid)=>{const m=(r.ms||[]).find(q=>q.a==pid||q.b==pid);return m?{m,s:m.a==pid?0:1}:null};
const benchOf=(r,pid)=>{const P=r.pl[pid],sq=D.squad(P.team),{m,s}=matchOf(r,pid);return sq.map((_,i)=>i).filter(i=>!P.tac.xi.includes(i)&&!m.used[s].has(i))};
// Sala online de 4 (2 humanos + 2 IA) en memoria hasta el primer tiempo.
async function salaEnPartido(room){
 E.act({a:'create',pid:'p1',name:'Uno',room,cfg:{div:'ar1',fmt:'liga1',n:4}});E.act({a:'join',pid:'p2',name:'Dos',room});
 const last={};['p1','p2'].forEach(p=>E.listen(room,p,v=>last[p]=v));
 E.act({a:'pick',pid:'p1',room,team:T[0]});E.act({a:'pick',pid:'p2',room,team:T[1]});E.act({a:'addai',pid:'p1',room});E.act({a:'addai',pid:'p1',room});
 const r=E.rooms[room];await until(()=>r.phase=='pre');r.t=1e9;['p1','p2'].forEach(p=>E.act({a:'ready',pid:p,room,v:true}));r.t=1;
 await until(()=>r.phase=='m1');return{r,last}}

async function motor(){
 E.CFG.fastWaits=true;E.CFG.tick=5;
 console.log('== primer tiempo: cambio válido');
 const room='subs1',{r,last}=await salaEnPartido(room);ok(r.phase=='m1','el partido está en el primer tiempo');
 const P=r.pl.p1,{m,s}=matchOf(r,'p1'),sb0=m.sb[s];   // sb0: por si el motor ya hizo un cambio por lesión
 const out=P.tac.xi[5],inn=benchOf(r,'p1')[0],pos=P.tac.xi.indexOf(out);
 const res=noThrow(()=>E.act({a:'tac',pid:'p1',room,p:{sw:[out,inn]}}));
 ok(!res.ex,'no lanza excepción'+(res.ex?' ('+res.ex.message+')':''));ok(res.v===null,'act devuelve sin error ('+res.v+')');
 ok(m.sb[s]==sb0+1,'el contador de cambios sube en 1 ('+sb0+' → '+m.sb[s]+')');
 ok(P.tac.xi[pos]===inn&&!P.tac.xi.includes(out),'el suplente ocupa el puesto del titular que sale');
 ok(m.subIn&&m.subIn[s].has(inn),'se registra el jugador entrante (subIn)');ok(m.used[s].has(out),'el que sale queda registrado como usado');
 ok(m.pr[s][inn]===6,'el entrante arranca con puntaje 6');ok(m.sm&&Number.isFinite(m.sm[s][pos]),'se anota el minuto del cambio');
 ok(last.p1&&last.p1.me&&last.p1.me.sb==m.sb[s],'el estado enviado al jugador ya muestra el cambio (sb='+(last.p1&&last.p1.me&&last.p1.me.sb)+')');
 ok(/no puede volver/.test(E.act({a:'tac',pid:'p1',room,p:{sw:[P.tac.xi[6],out]}})||''),'el que salió no puede volver a entrar');
 console.log('\n== límite de cinco cambios');
 let errs=[];while(m.sb[s]<5){const o=P.tac.xi[1+m.sb[s]],i=benchOf(r,'p1')[0];const x=noThrow(()=>E.act({a:'tac',pid:'p1',room,p:{sw:[o,i]}}));if(x.ex||x.v){errs.push(x.ex?x.ex.message:x.v);break}}
 ok(!errs.length&&m.sb[s]==5,'se pueden completar los 5 cambios ('+m.sb[s]+(errs.length?', error: '+errs[0]:'')+')');ok(m.subIn[s].size==5,'subIn registra a los 5 entrantes ('+m.subIn[s].size+')');
 const xiAntes=P.tac.xi.slice(),o6=P.tac.xi[9],i6=benchOf(r,'p1')[0],r6=noThrow(()=>E.act({a:'tac',pid:'p1',room,p:{sw:[o6,i6]}}));
 ok(!r6.ex&&/5 cambios/.test(r6.v||''),'el sexto cambio se rechaza ('+(r6.ex?r6.ex.message:r6.v)+')');
 ok(m.sb[s]==5&&P.tac.xi.join()==xiAntes.join()&&!m.subIn[s].has(i6),'tras el rechazo no cambia nada (sb=5, mismo XI)');
 console.log('\n== otras acciones tácticas en pleno partido');
 ok(E.act({a:'tac',pid:'p1',room,p:{st:2,pr:0,wing:0,sal:2,mk:1}})===null&&P.tac.st==2&&P.tac.pr==0&&P.tac.wing==0&&P.tac.sal==2&&P.tac.mk==1,'estilo, presión, banda, salida y marca se cambian');
 {const a=P.tac.xi[2],b=P.tac.xi[7],sbA=m.sb[s];ok(E.act({a:'tac',pid:'p1',room,p:{sw:[a,b]}})===null&&P.tac.xi[2]==b&&P.tac.xi[7]==a&&m.sb[s]==sbA,'intercambiar dos titulares de puesto no cuenta como cambio')}
 {const set=new Set(P.tac.xi),f=(P.tac.f+1)%D.FM.length;ok(E.act({a:'tac',pid:'p1',room,p:{f}})===null&&P.tac.f==f&&P.tac.xi.length==11&&P.tac.xi.every(i=>set.has(i)),'cambiar la formación reubica a los mismos 11')}
 ok(/antes del partido/.test(E.act({a:'tac',pid:'p1',room,p:{fill:'a'}})||''),'«formar automático» sigue bloqueado durante el partido');
 ok(E.act({a:'tac',pid:'p1',room,p:{k1:'#123456'}})===null&&P.tac.k1=='#123456','el color de camiseta se cambia');
 console.log('\n== segundo tiempo: cambio válido del otro equipo');
 await until(()=>r.phase=='m2');ok(r.phase=='m2','el partido está en el segundo tiempo');
 const Q=r.pl.p2,q=matchOf(r,'p2'),sbB=q.m.sb[q.s];
 if(sbB>=5)ok(true,'(p2 ya hizo 5 cambios por lesión; se omite)');else{const o2=Q.tac.xi[4],i2=benchOf(r,'p2')[0],x2=noThrow(()=>E.act({a:'tac',pid:'p2',room,p:{sw:[o2,i2]}}));
  ok(!x2.ex&&x2.v===null,'no lanza excepción ni error'+(x2.ex?' ('+x2.ex.message+')':x2.v?' ('+x2.v+')':''));ok(q.m.sb[q.s]==sbB+1&&Q.tac.xi.includes(i2)&&q.m.subIn[q.s].has(i2),'contador y entrante correctos en el 2.º tiempo')}
 console.log('\n== antes del partido (sin partido en curso)');
 await until(()=>['lobby','pre','end'].includes(r.phase));
 if(r.phase!='end'){const xi=P.tac.xi,a=xi[3],b=D.squad(P.team).map((_,i)=>i).find(i=>!xi.includes(i));ok(E.act({a:'tac',pid:'p1',room,p:{sw:[a,b]}})===null&&P.tac.xi.includes(b),'entre fechas el cambio de titular sigue funcionando sin contar cambios')}
 Object.values(E.rooms).forEach(x=>clearInterval(x.timer));for(const k in E.rooms)delete E.rooms[k]}

// ---- HTTP real contra server.js
async function http(){
 console.log('\n== HTTP: POST /act en el servidor');
 const port=3900+Math.floor(Math.random()*90),B='http://127.0.0.1:'+port,env={...process.env,PORT:String(port),TICK_MS:'25'};delete env.DATABASE_URL;
 const srv=spawn(process.execPath,[path.join(__dirname,'server.js')],{env,stdio:['ignore','pipe','pipe']});let log='';srv.stdout.on('data',d=>log+=d);srv.stderr.on('data',d=>log+=d);
 const ctrl=new AbortController();
 try{
  await until(()=>/localhost:/.test(log),10000);
  const post=async b=>{const r=await fetch(B+'/act',{method:'POST',body:JSON.stringify(b)});return{status:r.status,json:await r.json()}};
  const room='h'+Date.now().toString(36).slice(-8),st={};
  ok((await post({a:'create',room,pid:'h1',name:'Uno',cfg:{div:'ar1',fmt:'liga1',n:4}})).status==200,'crear sala');await post({a:'join',room,pid:'h2',name:'Dos'});
  for(const p of['h1','h2'])fetch(B+'/ev?room='+room+'&pid='+p,{signal:ctrl.signal}).then(async r=>{const rd=r.body.getReader(),dc=new TextDecoder();let buf='';for(;;){const{done,value}=await rd.read();if(done)break;buf+=dc.decode(value,{stream:true});let k;while((k=buf.indexOf('\n\n'))>=0){const m=buf.slice(0,k);buf=buf.slice(k+2);if(m.startsWith('data:'))st[p]=JSON.parse(m.slice(5))}}}).catch(()=>{});
  await post({a:'pick',room,pid:'h1',team:T[0]});await post({a:'pick',room,pid:'h2',team:T[1]});await post({a:'addai',room,pid:'h1'});await post({a:'addai',room,pid:'h1'});
  await until(()=>st.h1&&st.h1.phase=='pre',15000);for(const p of['h1','h2'])await post({a:'ready',room,pid:p,v:true});
  await until(()=>st.h1&&st.h1.phase=='m1'&&st.h1.me&&st.h1.me.sb!=null,60000);ok(st.h1&&st.h1.phase=='m1','el partido arrancó por HTTP');
  const me=st.h1.me,sb0=me.sb,out=me.tac.xi[5],inn=me.sq.map((_,i)=>i).find(i=>!me.tac.xi.includes(i)&&!(me.used||[]).includes(i));
  const r1=await post({a:'tac',room,pid:'h1',p:{sw:[out,inn]}});ok(r1.status==200&&r1.json.error===null,'POST /act de un cambio responde 200 con error=null ('+r1.status+' '+JSON.stringify(r1.json)+')');
  await until(()=>st.h1.me&&st.h1.me.sb==sb0+1,5000);ok(st.h1.me.sb==sb0+1&&st.h1.me.tac.xi.includes(inn),'el estado recibido por /ev muestra el cambio (sb '+sb0+' → '+st.h1.me.sb+')');
  const bad=await post({a:'tac',room,pid:'h1',p:{sw:[st.h1.me.tac.xi[6],out]}});ok(bad.status==400&&/no puede volver/.test(bad.json.error||''),'un cambio inválido responde 400 con su mensaje real ('+bad.json.error+')');
  ok(!/error|promesa rechazada/i.test(log.replace(/palmarés[^\n]*/g,'')),'el servidor no registró excepciones'+(log.match(/error[^\n]*/i)?' ('+log.match(/error[^\n]*/i)[0]+')':''));
 }catch(e){ok(false,'HTTP: '+e.message)}finally{ctrl.abort();srv.kill()}}

(async()=>{await motor();await http();console.log(fails?'\nFALLAS: '+fails:'\nTodo OK');process.exit(fails?1:0)})();
