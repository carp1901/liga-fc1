// Servidor sin dependencias: HTTP + Server-Sent Events. Uso: node server.js (PORT opcional)
const http=require('http'),fs=require('fs'),path=require('path'),E=require('./public/engine'),{DIVS}=require('./public/data'),store=require('./store');
const PORT=process.env.PORT||3000,PUB=path.join(__dirname,'public'),rooms=E.rooms;E.CFG.tick=+process.env.TICK_MS||1000;
store.init();E.CFG.onTitle=rec=>store.register(rec); // palmarés permanente (PostgreSQL)
// ---- Títulos offline: los informa el navegador. El servidor valida lo que SÍ puede comprobar (formato, club dentro de la competición, tamaño, límites de uso) y los guarda aparte, marcados como no verificables.
const {CUPS,TM}=require('./public/data'),RL=new Map(),rlOk=(k,max)=>{const n=Date.now(),a=(RL.get(k)||[]).filter(t=>n-t<36e5);if(a.length>=max){RL.set(k,a);return false}a.push(n);RL.set(k,a);return true};
setInterval(()=>{const n=Date.now();for(const[k,a]of RL){const b=a.filter(t=>n-t<36e5);b.length?RL.set(k,b):RL.delete(k)}},6e5).unref();
const ipOf=req=>String((req.headers['x-forwarded-for']||'').split(',')[0]||req.socket.remoteAddress||'').trim();
function offlineRec(b){
 const tid=String(b.tid||''),comp=String(b.comp||''),club=String(b.club||''),fmt=String(b.fmt||''),n=Math.floor(+b.n);
 if(!/^[a-z0-9]{8,60}$/.test(tid))return'ID de torneo inválido';if(!['liga1','liga2','copa'].includes(fmt))return'Formato inválido';
 const cup=CUPS.find(c=>c.id==comp),dv=cup?null:DIVS.find(d=>d.id==comp&&d.ok),all=comp=='all';
 const clubs=cup?cup.clubs:dv?dv.teams.map(t=>t.id):all?DIVS.flatMap(d=>d.teams.map(t=>t.id)):null;
 if(!clubs)return'Competición inválida';if(!clubs.includes(club)||!TM[club])return'El club no pertenece a esa competición';
 if(!(n>=4&&n<=clubs.length))return'Cantidad de equipos inválida';
 return{tid,club,clubNombre:TM[club].name,dt:String(b.dt||'').replace(/[<>&"]/g,'').slice(0,16)||null,mod:'offline',comp:cup?cup.id:comp,compNombre:cup?cup.title:dv?dv.name:'Todas las divisiones',fmt,n,at:Date.now(),ver:'offline-informado'};
}
const MIME={'.html':'text/html;charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.js':'text/javascript','.css':'text/css'};
function body(req,cb){let s='';req.on('data',d=>{s+=d;if(s.length>4096)req.destroy()});req.on('end',()=>{try{cb(JSON.parse(s))}catch(e){cb(null)}})}
http.createServer((req,res)=>{try{const u=new URL(req.url,'http://x');
 if(req.method=='POST'&&u.pathname=='/api/titulo-offline')return body(req,b=>{const send=(c,o)=>{res.writeHead(c,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
  if(!b)return send(400,{error:'Pedido inválido'});const rec=offlineRec(b);if(typeof rec=='string')return send(400,{error:rec});
  if(!rlOk('ip:'+ipOf(req),30)||!rlOk('pid:'+String(b.pid||'').slice(0,40),30))return send(429,{error:'Demasiados títulos informados; probá más tarde'});
  store.insert(rec).then(r=>r.status=='disabled'?send(503,{error:'Palmarés no disponible'}):send(200,{status:r.status}),e=>{console.error('offline:',e.message);send(503,{error:'Base de datos no disponible'})})});
 if(req.method=='POST'&&u.pathname=='/act')return body(req,b=>{const e=b?E.act(b):'Pedido inválido';res.writeHead(e?400:200,{'Content-Type':'application/json'});res.end(JSON.stringify({error:e}))});
 if(u.pathname=='/ev'){const r=rooms[(u.searchParams.get('room')||'').toLowerCase()],pid=u.searchParams.get('pid'),c=r&&r.pl[pid];if(!c){res.writeHead(404);return res.end()}
  res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive','X-Accel-Buffering':'no'});c.res=res;res.write('retry:2000\n\n');E.listen(r.code,pid,v=>res.write('data:'+JSON.stringify(v)+'\n\n'));req.on('close',()=>{if(c.res===res){c.res=null;E.listen(r.code,pid,null)}});return}
 if(u.pathname=='/teams.json'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify(DIVS))}
 if(u.pathname=='/api/ranking'){const g=k=>u.searchParams.get(k)||'',f={mod:['online','clasico','barrial','offline'].includes(g('mod'))?g('mod'):'online',comp:/^[a-z0-9]{1,30}$/.test(g('comp'))?g('comp'):'',fmt:['liga','copa'].includes(g('fmt'))?g('fmt'):''};
  return store.ranking(f).then(d=>{res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({...d,filtros:f}))},e=>{res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Base de datos no disponible'}))})}
 if(u.pathname=='/api/titulo'){const id=u.searchParams.get('id')||'',jn=(c,o)=>{res.writeHead(c,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(o))};if(!/^[a-z0-9]{8,60}$/.test(id))return jn(400,{error:'ID inválido'});
  return store.titulo(id).then(d=>d.error?jn(404,d):jn(200,d),e=>jn(503,{error:'Base de datos no disponible'}))}
 if(u.pathname=='/api/club'){const id=u.searchParams.get('id')||'';if(!/^[a-z0-9]{1,40}$/.test(id)||!TM[id]){res.writeHead(404,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'Club inexistente'}))}
  return store.club(id).then(d=>{res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({id,nombre:TM[id].name,...d}))},e=>{res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Base de datos no disponible'}))})}
 if(u.pathname=='/api/titulos'){return store.list(+u.searchParams.get('limit')||100).then(d=>{res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(d))},e=>{res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Base de datos no disponible'}))})}
 if(u.pathname=='/health'){res.writeHead(200);return res.end('ok '+Object.keys(rooms).length+' db='+store.status())}
 let f=path.normalize(path.join(PUB,u.pathname=='/'?'index.html':decodeURIComponent(u.pathname)));
 if(!f.startsWith(PUB)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('404')}
 res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'public,max-age=300'});fs.createReadStream(f).pipe(res)}catch(e){try{res.writeHead(500);res.end()}catch(_){}}}).listen(PORT,()=>console.log('Liga FC en http://localhost:'+PORT));
setInterval(()=>{const now=Date.now();for(const k in rooms){const r=rooms[k];r.order.forEach(p=>{const c=r.pl[p].res;if(c)try{c.write(':ping\n\n')}catch(e){}});if(now-r.touched>36e5&&!r.order.some(p=>r.pl[p].res)){clearInterval(r.timer);delete rooms[k]}}},15000);
process.on('uncaughtException',e=>console.error('error',e.message));process.on('unhandledRejection',e=>console.error('promesa rechazada',e&&e.message));
