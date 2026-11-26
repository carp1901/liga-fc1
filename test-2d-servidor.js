// 2D en el servidor (online): dos humanos, el 2D corre sin pantalla dentro del motor. node test-2d-servidor.js
const E=require('./public/engine'),{Sim}=require('./public/sim2d');E.CFG.offline=false;E.CFG.auth2dServer=process.env.SRV!=='0';E.CFG.Sim=Sim;
let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++},sleep=ms=>new Promise(r=>setTimeout(r,ms)),until=async(f,ms)=>{const t=Date.now();while(!f()&&Date.now()-t<ms)await sleep(20);return f()};
(async()=>{const room='sv1';let v1=null,v2=null,e;
 e=E.act({a:'create',pid:'p1',name:'Uno',room,uid:'u1',cfg:{div:'ar1',fmt:'liga1',n:4}});if(e)throw new Error('create '+e);
 e=E.act({a:'join',pid:'p2',name:'Dos',room,uid:'u2'});if(e)throw new Error('join '+e);E.act({a:'speed',room,pid:'p1',v:+process.env.SPD||5});E.act({a:'addai',room,pid:'p1'});E.act({a:'addai',room,pid:'p1'});
 E.listen(room,'p1',v=>v1=v);E.listen(room,'p2',v=>v2=v);
 E.act({a:'pick',room,pid:'p1',team:'river'});E.act({a:'pick',room,pid:'p2',team:'boca'});
 const R=E.rooms[room];let hosted=0,headSeen=0,evs={},maxHs=false;
 const iv=setInterval(()=>{const v=v1;if(!v)return;if(['pre','lobby'].includes(v.phase)){E.act({a:'ready',room,pid:'p1',v:true});E.act({a:'ready',room,pid:'p2',v:true})}
  (R.ms||[]).forEach(m=>{if(m.hosted&&m.headless)headSeen++;if(v.ms&&v.ms[0]&&v.ms[0].hs)maxHs=true});
  const mm=(v.ms||[])[0];if(mm&&mm.evs)mm.evs.forEach(x=>{const k=x.k+(x.x?'.'+x.x:'');evs[k]=(evs[k]||0)+1});
  // decisiones: la primera persona resuelve rápido
  ['p1','p2'].forEach(pid=>{const vv=pid=='p1'?v1:v2;if(vv&&vv.pend&&vv.pend.id!=null)E.act({a:'pdec',room,pid,id:vv.pend.id,v:0})})},15);
 const fin=await until(()=>R.ms&&R.ms[0]&&R.ms[0].clock>=+(process.env.MIN||45),+process.env.TMO||100000);clearInterval(iv);
 const m0=R.ms&&R.ms[0];
 console.log(JSON.stringify({fase:v1&&v1.phase,min:R.ms&&R.ms[0]&&R.ms[0].clock,score:m0&&[m0.ga,m0.gb],st:m0&&m0.st,headSeen,hsEnVista:maxHs,evs}));
 const cpu=process.cpuUsage();console.log('CPU s',((cpu.user+cpu.system)/1e6).toFixed(1));ok(fin,'el reloj online avanza hasta el minuto '+(process.env.MIN||45));ok(!E.CFG.auth2dServer||headSeen>0,'el 2D se aloja en el servidor');ok(!maxHs,'el cliente no queda en modo anfitrión');
 clearInterval(R.timer);delete E.rooms[room];console.log(fails?'FALLARON '+fails:'Todo OK');process.exit(fails?1:0)})().catch(x=>{console.log('ERROR',x.stack||x);process.exit(1)});
