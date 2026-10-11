// Prueba de carga: N jugadores simulados juegan una liga completa. Uso: TICK_MS=15 node server.js & node test.js [N] [formato]
const N=+process.argv[2]||12,FMT=process.argv[3]||'liga1',B='http://localhost:'+(process.env.PORT||3000),code='t'+Date.now().toString(36).slice(-6);
const post=b=>fetch(B+'/act',{method:'POST',body:JSON.stringify(b)}).then(r=>r.json());
const S=[];let msgs=0,maxG=0,goals=0,games=0,t0=Date.now();
(async()=>{const dv=await (await fetch(B+'/teams.json')).json(),T=dv[0].teams.map(t=>t.id);
 for(let i=0;i<N;i++){const pid='p'+i,name='Jug'+i;let e=await post({a:i?'join':'create',room:code,pid,name,cfg:{div:'ar1',fmt:FMT,n:N}});if(e.error)throw e.error;
  const st={pid,v:null};S.push(st);fetch(B+'/ev?room='+code+'&pid='+pid).then(async r=>{const rd=r.body.getReader(),dc=new TextDecoder();let buf='';for(;;){const{done,value}=await rd.read();if(done)break;buf+=dc.decode(value);let k;while((k=buf.indexOf('\n\n'))>=0){const m=buf.slice(0,k);buf=buf.slice(k+2);if(m.startsWith('data:')){st.v=JSON.parse(m.slice(5));msgs++}}}})}
 for(let i=0;i<N;i++)await post({a:'pick',room:code,pid:'p'+i,team:T[i]});
 const lag=[];let last=Date.now();const iv=setInterval(()=>{const n=Date.now();lag.push(n-last-20);last=n},20);
 let round=-1;const seen=new Set();
 while(true){await new Promise(r=>setTimeout(r,40));const v=S[0].v;if(!v)continue;
  if(v.phase=='m1'||v.phase=='m2')v.ms.forEach(m=>{});
  if(v.phase=='lobby'||v.phase=='end'){if(v.res&&!seen.has(v.round)){seen.add(v.round);v.res.forEach(x=>{games++;goals+=x.ga+x.gb;maxG=Math.max(maxG,x.ga,x.gb)})}}
  if(v.phase=='end')break;
  if(v.phase=='pre'||v.phase=='lobby'){for(let i=0;i<N;i++){await post({a:'chat',room:code,pid:'p'+i,text:'hola'});await post({a:'ready',room:code,pid:'p'+i,v:true})}}
  if(v.phase=='m1')for(let i=0;i<N;i+=3)post({a:'tac',room:code,pid:'p'+i,p:{st:i%3,pr:i%2,wing:(i+1)%2}})}
 clearInterval(iv);const v=S[0].v,tb=v.table.sort((a,b)=>b.pts-a.pts||b.gf-b.ga-(a.gf-a.ga));
 console.log(JSON.stringify({jugadores:N,formato:FMT,fechas:v.round,partidos:games,golesPorPartido:+(goals/Math.max(1,games)).toFixed(2),maxGolesDeUnEquipo:maxG,mensajesRecibidos:msgs,segundos:(Date.now()-t0)/1000,lagMaxMs:Math.max(...lag),todosRecibieronEstado:S.every(s=>s.v&&s.v.phase=='end'),campeon:v.champ||tb[0].id,ptsTotal:tb.reduce((a,x)=>a+x.pts,0)}));process.exit(0)})().catch(e=>{console.error('FALLO',e);process.exit(1)});
