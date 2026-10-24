// Servidor sin dependencias: HTTP + Server-Sent Events. Uso: node server.js (PORT opcional)
const http=require('http'),fs=require('fs'),path=require('path'),E=require('./public/engine'),{DIVS}=require('./public/data'),store=require('./store');
const PORT=process.env.PORT||3000,PUB=path.join(__dirname,'public'),rooms=E.rooms;E.CFG.tick=+process.env.TICK_MS||1000;
store.init();E.CFG.onTitle=rec=>store.register(rec);
// Abandonos reiterados (solo con cuenta): 3 abandonos en 24 h = bloqueo de 30 min para salas públicas y partida aleatoria; al 2.º se avisa. En memoria; si hay base de datos también se registran.
const AB=new Map(),abOf=u=>{let a=AB.get(u);if(!a){a={t:[],until:0};AB.set(u,a)}a.t=a.t.filter(x=>Date.now()-x<864e5);return a};
E.CFG.onAbandon=(uid,room)=>{const a=abOf(uid);a.t.push(Date.now());if(a.t.length>=3){a.until=Date.now()+30*60e3;a.t=[]}if(store.abandono)try{Promise.resolve(store.abandono(uid,room)).catch(()=>{})}catch(e){}};
E.CFG.abBlock=uid=>{const a=uid&&AB.get(uid);return a&&a.until>Date.now()?a.until:0};
E.CFG.abWarn=uid=>{const a=uid&&AB.has(uid)&&abOf(uid);return a&&a.t.length==2?'Aviso: ya abandonaste 2 partidas en las últimas 24 h. Al tercer abandono no vas a poder entrar a salas públicas ni a partida aleatoria durante 30 minutos.':null}; // palmarés permanente (PostgreSQL)
E.CFG.onCareer=recs=>store.addCareers(recs); // historial de carreras de los jugadores con cuenta
// ---- Títulos offline: los informa el navegador. El servidor valida lo que SÍ puede comprobar (formato, club dentro de la competición, tamaño, límites de uso) y los guarda aparte, marcados como no verificables.
const {CUPS,TM}=require('./public/data'),RL=new Map(),rlOk=(k,max)=>{const n=Date.now(),a=(RL.get(k)||[]).filter(t=>n-t<36e5);if(a.length>=max){RL.set(k,a);return false}a.push(n);RL.set(k,a);return true};
setInterval(()=>{const n=Date.now();for(const[k,a]of RL){const b=a.filter(t=>n-t<36e5);b.length?RL.set(k,b):RL.delete(k)}},6e5).unref();
const ipOf=req=>String((req.headers['x-forwarded-for']||'').split(',')[0]||req.socket.remoteAddress||'').trim();
function offlineRec(b){
 const tid=String(b.tid||''),comp=String(b.comp||''),club=String(b.club||''),fmt=String(b.fmt||''),n=Math.floor(+b.n);
 if(!/^[a-z0-9]{8,60}$/.test(tid))return'ID de torneo inválido';if(!['liga1','liga2','copa'].includes(fmt))return'Formato inválido';
 const cup=CUPS.find(c=>c.id==comp),dv=cup?null:DIVS.find(d=>d.id==comp&&d.ok),all=comp=='all',pers=comp=='pers'||comp=='real',real=comp=='real',arg=comp=='copaarg';
 const clubs=cup?cup.clubs:dv?dv.teams.map(t=>t.id):all?DIVS.flatMap(d=>d.teams.map(t=>t.id)):pers||arg?Object.keys(TM):null;
 if(!clubs)return'Competición inválida';if(!clubs.includes(club)||!TM[club])return'El club no pertenece a esa competición';
 if(!(n>=4&&n<=clubs.length))return'Cantidad de equipos inválida';if(pers&&!((real?n<=40:n<=20&&n%2==0)&&fmt!='copa'))return'Cantidad de equipos inválida';if(arg&&!(fmt=='copa'&&n==64))return'Cantidad de equipos inválida';
 return{tid,club,clubNombre:TM[club].name,dt:String(b.dt||'').replace(/[<>&"]/g,'').slice(0,16)||null,mod:'offline',comp:cup?cup.id:comp,compNombre:cup?cup.title:dv?dv.name:arg?'Copa Argentina':real?'Clásico realista':pers?'Clásico personalizado':'Todas las divisiones',fmt,n,at:Date.now(),ver:'offline-informado'};
}
const MIME={'.html':'text/html;charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.js':'text/javascript','.css':'text/css'};
function body(req,cb){let s='';req.on('data',d=>{s+=d;if(s.length>4096)req.destroy()});req.on('end',()=>{try{cb(JSON.parse(s))}catch(e){cb(null)}})}
// ---- Cuentas (opcionales). El token viaja en el encabezado Authorization (o en el cuerpo). El uid de un jugador lo pone SOLO el servidor a partir del token: lo que mande el navegador se descarta.
const tokOf=(req,b)=>{const h=String(req.headers.authorization||'');return h.startsWith('Bearer ')?h.slice(7).trim():String((b&&b.tok)||'')};
const withUser=(req,b,cb)=>{if(!b||typeof b!='object')return cb();delete b.uid;const t=tokOf(req,b);if(!t)return cb();store.userByToken(t).then(u=>{if(u)b.uid=u.id;cb()},()=>cb())};   // sin sesión válida = invitado
http.createServer((req,res)=>{try{const u=new URL(req.url,'http://x');
 if(req.method=='POST'&&u.pathname=='/api/titulo-offline')return body(req,b=>{const send=(c,o)=>{res.writeHead(c,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
  if(!b)return send(400,{error:'Pedido inválido'});const rec=offlineRec(b);if(typeof rec=='string')return send(400,{error:rec});
  if(!rlOk('ip:'+ipOf(req),30)||!rlOk('pid:'+String(b.pid||'').slice(0,40),30))return send(429,{error:'Demasiados títulos informados; probá más tarde'});
  store.insert(rec).then(r=>r.status=='disabled'?send(503,{error:'Palmarés no disponible'}):send(200,{status:r.status}),e=>{console.error('offline:',e.message);send(503,{error:'Base de datos no disponible'})})});
 if(req.method=='POST'&&u.pathname=='/api/random')return body(req,b=>{const send=(c,o)=>{res.writeHead(c,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
  if(!b)return send(400,{error:'Pedido inválido'});if(!rlOk('rnd:'+ipOf(req),120))return send(429,{error:'Demasiados intentos; probá más tarde'});withUser(req,b,()=>send(200,E.rJoin(b)))});
  if(u.pathname=='/api/amigos'||u.pathname.startsWith('/api/amigos/')){const jn=(c,o)=>{res.writeHead(c,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(o))},dbErr=e=>{console.error('amigos:',e&&e.message);jn(503,{error:'Base de datos no disponible'})},ruta=u.pathname.slice(12);
   const go=b=>store.userByToken(tokOf(req,b)).then(us=>{if(!us)return jn(401,{error:'Iniciá sesión para usar Amigos'});const done=r=>r.error?jn(400,r):jn(200,r);
    if(req.method=='GET'&&ruta=='')return store.amigos(us.id).then(d=>jn(200,d));
    if(req.method!='POST')return jn(404,{error:'No existe'});
    if(!rlOk('amg:'+us.id,200))return jn(429,{error:'Demasiadas acciones; probá más tarde'});
    if(ruta=='solicitar'){if(!rlOk('amgs:'+us.id,40))return jn(429,{error:'Enviaste muchas solicitudes; probá más tarde'});return store.solicitar(us.id,b.usuario).then(done)}
    if(ruta=='responder')return store.responder(us.id,b.id,b.accion).then(done);
    if(ruta=='cancelar')return store.cancelarSol(us.id,b.id).then(done);
    if(ruta=='quitar')return store.quitarAmigo(us.id,b.id).then(done);
    return jn(404,{error:'No existe'})}).catch(dbErr);
   return req.method=='POST'?body(req,b=>b?go(b):jn(400,{error:'Pedido inválido'})):go(null)}
  if(u.pathname.startsWith('/api/auth/')){const jn=(c,o)=>{res.writeHead(c,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(o))},dbErr=e=>{console.error('auth:',e&&e.message);jn(503,{error:'Base de datos no disponible'})},ruta=u.pathname.slice(10);
   if(req.method=='POST'&&(ruta=='registro'||ruta=='login'))return body(req,b=>{if(!b)return jn(400,{error:'Pedido inválido'});const ip=ipOf(req);
    if(ruta=='registro'&&!rlOk('reg:'+ip,30))return jn(429,{error:'Demasiados intentos; probá más tarde'});
    if(ruta=='login'&&(!rlOk('lg:'+ip,150)||!rlOk('lgu:'+String(b.usuario||'').toLowerCase().slice(0,16),20)))return jn(429,{error:'Demasiados intentos; probá más tarde'});
    (ruta=='registro'?store.registrar:store.login)(b.usuario,b.clave).then(r=>r.error?jn(ruta=='login'?401:400,r):jn(200,r),dbErr)});
   if(req.method=='POST'&&ruta=='logout')return body(req,b=>store.logout(tokOf(req,b)).then(()=>jn(200,{ok:1}),()=>jn(200,{ok:1})));
   if(req.method=='GET'&&(ruta=='yo'||ruta=='perfil'))return store.userByToken(tokOf(req)).then(us=>{if(!us)return jn(401,{error:'Sesión inválida o vencida'});return ruta=='yo'?jn(200,{usuario:us.usuario}):store.perfil(us.id).then(d=>jn(200,d))}).catch(dbErr);
   // carrera offline: se juega en el celular y el servidor no puede comprobar los partidos; valida lo que sí puede (club dentro de la competición, formato, tamaño, límites) y la guarda como offline.
   if(req.method=='POST'&&ruta=='carrera')return body(req,b=>{if(!b)return jn(400,{error:'Pedido inválido'});
    store.userByToken(tokOf(req,b)).then(us=>{if(!us)return jn(401,{error:'Sesión inválida o vencida'});
     const rec=offlineRec(b);if(typeof rec=='string')return jn(400,{error:rec});
     if(!rlOk('car:'+ipOf(req),120)||!rlOk('caru:'+us.id,120))return jn(429,{error:'Demasiados registros; probá más tarde'});
     const pos=b.pos==null?null:Math.floor(+b.pos),num=x=>x==null?null:Math.max(0,Math.min(999,Math.floor(+x)||0));
     if(pos!=null&&!(pos>=1&&pos<=rec.n))return jn(400,{error:'Posición inválida'});
     return store.addCareers([{...rec,uid:us.id,origen:'offline',pos,resultado:String(b.resultado||'').replace(/[<>&"]/g,'').slice(0,40)||null,campeon:!!b.campeon,pj:num(b.pj),g:num(b.g),e:num(b.e),p:num(b.p),gf:num(b.gf),gc:num(b.gc),pts:num(b.pts)}]).then(()=>jn(200,{ok:1}))}).catch(dbErr)});
   return jn(404,{error:'No existe'})}
 if(u.pathname=='/api/salas'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify(E.pubList()))}   // salas públicas
 if(req.method=='POST'&&u.pathname=='/api/pub')return body(req,b=>{const send=(c,o)=>{res.writeHead(c,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
  if(!b)return send(400,{error:'Pedido inválido'});if(!rlOk('pub:'+ipOf(req),120))return send(429,{error:'Demasiados intentos; probá más tarde'});withUser(req,b,()=>{const r=E.pubApi(b);send(r.error?400:200,r)})});
 if(req.method=='POST'&&u.pathname=='/act')return body(req,b=>withUser(req,b,()=>{const e=b?E.act(b):'Pedido inválido';res.writeHead(e?400:200,{'Content-Type':'application/json'});res.end(JSON.stringify({error:e}))}));
 if(u.pathname=='/ev'){const r=rooms[(u.searchParams.get('room')||'').toLowerCase()],pid=u.searchParams.get('pid'),c=r&&((r.pl[pid]&&!r.pl[pid].ai)?r.pl[pid]:(r.spec&&r.spec[pid]));if(!c){res.writeHead(404);return res.end()}
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
setInterval(()=>{const now=Date.now();for(const k in rooms){const r=rooms[k];r.order.forEach(p=>{const c=r.pl[p].res;if(c)try{c.write(':ping\n\n')}catch(e){}});Object.values(r.spec||{}).forEach(c=>{if(c.res)try{c.res.write(':ping\n\n')}catch(e){}});if(now-r.touched>36e5&&!r.order.some(p=>r.pl[p].res)){clearInterval(r.timer);delete rooms[k]}}},15000);
process.on('uncaughtException',e=>console.error('error',e.message));process.on('unhandledRejection',e=>console.error('promesa rechazada',e&&e.message));
