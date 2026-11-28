// Cliente (index.html) contra server.js de Node: SSE sin deltas, y decodificador de deltas del Worker (v=2) con un estado real. Requiere Playwright/Chromium: node test-cliente-sse.js
const {chromium}=require('playwright'),{spawn}=require('child_process');
const PORT=38000+Math.floor(Math.random()*1000),root=__dirname;let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++};
(async()=>{
 const srv=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:String(PORT),DATABASE_URL:''},stdio:['ignore','pipe','pipe']});
 await new Promise((res,rej)=>{srv.stdout.on('data',d=>{if(/localhost/.test(d))res()});setTimeout(()=>rej(new Error('server no arrancó')),20000)});
 const b=await chromium.launch(),p=await b.newPage(),errs=[];
 p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});p.on('pageerror',e=>errs.push(String(e)));
 const evs=[];p.on('request',r=>{if(/\/ev\?/.test(r.url()))evs.push(r.url())});
 await p.goto('http://127.0.0.1:'+PORT+'/',{waitUntil:'load'});
 ok(await p.evaluate(()=>typeof apiFetch=='function'&&typeof apiUrl=='function'&&window.CF_API_BASE===''),'api-config.js cargado: apiFetch/apiUrl, base vacía (mismo origen)');
 ok(await p.evaluate(()=>document.querySelector('.minH')&&document.querySelector('.minH').textContent=='8'),'textos con el mínimo de 8 (DATA.MIN_HUMANOS)');
 // 1) contra Node: el servidor manda el estado completo sin __cf
 const er=await p.evaluate(async()=>{room='e2enode';const r=await post({a:'create',cfg:{div:'ar1',fmt:'liga1',n:4}});start();return r&&r.error||null});
 ok(!er,'sala online creada por /act (apiFetch) contra server.js'+(er?': '+er:''));
 await p.waitForFunction(()=>window.S!==undefined&&S&&S.phase,null,{timeout:10000}).catch(()=>{});
 const ph=await p.evaluate(()=>S&&S.phase);ok(ph=='pick','el cliente recibe el estado por /ev sin deltas (fase '+ph+')');
 ok(evs.some(u=>/v=2/.test(u)),'el cliente pide v=2 y Node lo ignora sin romper');
 const salas=await p.evaluate(async()=>{const r=await apiFetch('/api/salas');return r.status});ok(salas==200,'/api/salas por apiFetch responde 200');
 // 2) decodificador de deltas del Worker, con un estado real de la sala
 const res=await p.evaluate(async()=>{
  const real=JSON.parse(JSON.stringify(S));const sent=[];let inst=null;
  window.EventSource=class{constructor(u){this.url=u;inst=this;sent.push(u)}close(){}};
  start();const emit=o=>inst.onmessage({data:JSON.stringify(o)});const out={};
  S=undefined;emit({__cf:'patch',u:[[['phase'],'pre']],d:[]});out.patchSinBase=S===undefined;
  emit({__cf:'full',v:real});out.full=S&&S.phase==real.phase&&JSON.stringify(S)==JSON.stringify(real);
  const k=Object.keys(real).find(x=>typeof real[x]=='number');emit({__cf:'patch',u:[[[k],real[k]+7]],d:[]});out.patch=S[k]==real[k]+7;
  const dk=Object.keys(S).find(x=>x!=='phase'&&x!==k);emit({__cf:'patch',u:[],d:[[dk]]});out.del=!(dk in S);
  emit({__cf:'patch',u:[[[],real]],d:[]});out.root=JSON.stringify(S)==JSON.stringify(real);
  emit({...real,phase:'pick'});out.plain=S.phase=='pick'&&JSON.stringify(S)==JSON.stringify({...real,phase:'pick'});
  inst.onmessage({data:'no-json'});out.badJson=S.phase=='pick';
  out.url=sent[0];return out});
 ok(res.patchSinBase,'un parche sin estado previo se ignora');
 ok(res.full,'mensaje __cf:"full" reemplaza el estado');
 ok(res.patch,'mensaje __cf:"patch" actualiza una clave');
 ok(res.del,'parche con borrado quita la clave');
 ok(res.root,'parche de raíz (ruta vacía) reemplaza todo el estado');
 ok(res.plain,'mensaje sin __cf (Node) se toma como estado completo');
 ok(res.badJson,'un mensaje inválido no rompe el estado');
 ok(/\/ev\?room=e2enode&pid=.+&v=2$/.test(new URL(res.url).pathname+new URL(res.url).search),'URL del SSE armada con apiUrl');
 await p.waitForTimeout(500);
 const inj=errs.filter(e=>/Estado en vivo inválido: SyntaxError.*no-json/.test(e));ok(inj.length==1,'el mensaje inválido inyectado se registra una vez (esperado)');const real=errs.filter(e=>!/favicon|ERR_|net::|crests|escudo|Failed to load resource/.test(e)&&!/no-json/.test(e));ok(real.length==0,'sin errores de JS en la página'+(real.length?': '+real.slice(0,3).join(' | '):''));
 await b.close();srv.kill();console.log(fails?'\nFALLAS: '+fails:'\nTodo OK');process.exit(fails?1:0)})().catch(e=>{console.log('ERROR',e.stack);process.exit(1)});
