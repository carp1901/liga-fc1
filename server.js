// Servidor sin dependencias: HTTP + Server-Sent Events. Uso: node server.js (PORT opcional)
const http=require('http'),fs=require('fs'),path=require('path'),E=require('./public/engine'),{DIVS}=require('./public/data');
const PORT=process.env.PORT||3000,PUB=path.join(__dirname,'public'),rooms=E.rooms;E.CFG.tick=+process.env.TICK_MS||1000;
const MIME={'.html':'text/html;charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.js':'text/javascript','.css':'text/css'};
function body(req,cb){let s='';req.on('data',d=>{s+=d;if(s.length>4096)req.destroy()});req.on('end',()=>{try{cb(JSON.parse(s))}catch(e){cb(null)}})}
http.createServer((req,res)=>{try{const u=new URL(req.url,'http://x');
 if(req.method=='POST'&&u.pathname=='/act')return body(req,b=>{const e=b?E.act(b):'Pedido inválido';res.writeHead(e?400:200,{'Content-Type':'application/json'});res.end(JSON.stringify({error:e}))});
 if(u.pathname=='/ev'){const r=rooms[(u.searchParams.get('room')||'').toLowerCase()],pid=u.searchParams.get('pid'),c=r&&r.pl[pid];if(!c){res.writeHead(404);return res.end()}
  res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive','X-Accel-Buffering':'no'});c.res=res;res.write('retry:2000\n\n');E.listen(r.code,pid,v=>res.write('data:'+JSON.stringify(v)+'\n\n'));req.on('close',()=>{if(c.res===res){c.res=null;E.listen(r.code,pid,null)}});return}
 if(u.pathname=='/teams.json'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify(DIVS))}
 if(u.pathname=='/health'){res.writeHead(200);return res.end('ok '+Object.keys(rooms).length)}
 let f=path.normalize(path.join(PUB,u.pathname=='/'?'index.html':decodeURIComponent(u.pathname)));
 if(!f.startsWith(PUB)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('404')}
 res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'public,max-age=300'});fs.createReadStream(f).pipe(res)}catch(e){try{res.writeHead(500);res.end()}catch(_){}}}).listen(PORT,()=>console.log('Liga FC en http://localhost:'+PORT));
setInterval(()=>{const now=Date.now();for(const k in rooms){const r=rooms[k];r.order.forEach(p=>{const c=r.pl[p].res;if(c)try{c.write(':ping\n\n')}catch(e){}});if(now-r.touched>36e5&&!r.order.some(p=>r.pl[p].res)){clearInterval(r.timer);delete rooms[k]}}},15000);
process.on('uncaughtException',e=>console.error('error',e.message));
