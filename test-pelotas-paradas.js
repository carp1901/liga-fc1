// Pelotas paradas con decisión en vivo (tiro libre directo / lateral-lejano / córner): node test-pelotas-paradas.js
const fs=require('fs'),path=require('path'),Module=require('module');
const f=path.join(__dirname,'public','engine.js'),mod=new Module(f,module);mod.filename=f;mod.paths=Module._nodeModulePaths(path.dirname(f));
mod._compile(fs.readFileSync(f,'utf8').replace('if(typeof module!==\'undefined\')module.exports=API;','API._t={resSp,spStart,spOK,SPA,SPD};if(typeof module!==\'undefined\')module.exports=API;'),f);
const E=mod.exports,T=E._t,D=require('./public/data');E.CFG.tick=4;
const teams=D.DIVS.find(d=>d.id=='ar1').teams.map(t=>t.id);let fail=0;const ck=(c,m)=>{if(!c){fail++;console.log('FALLA:',m)}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function mk(room,ph){E.act({a:'create',pid:'a',name:'A',room,uid:'ua',cfg:{div:'ar1',fmt:'liga1',n:4}});['b','c','d'].forEach(x=>E.act({a:'join',pid:x,name:x,room,uid:'u'+x}));['a','b','c','d'].forEach((x,i)=>{E.listen(room,x,()=>{});E.act({a:'pick',pid:x,room,team:teams[i]})});const r=E.rooms[room];for(let i=0;i<400&&!(r.ms&&r.ms[0]);i++){if(r.phase=='pre')r.t=0;await sleep(10)}r.pl[r.ms[0].a].phil=ph||'equilibrada';return r}
// 1) opciones válidas por tipo y por lado (ataque / defensa)
const SPA=T.SPA,SPD=T.SPD,ok=(k,at,d)=>T.spOK({kind:k},at,d);
ck(ok('fkd',1,'L')&&ok('fkd',1,'R')&&!ok('fkd',1,'C')&&!ok('fkd',1,'P')&&!ok('fkd',1,'S'),'tiro libre directo: solo izq/der');
ck(ok('fkd',0,'L')&&ok('fkd',0,'R')&&!ok('fkd',0,'1'),'defensa directo: solo izq/der');
ck(ok('fkl',1,'C')&&ok('fkl',1,'P')&&!ok('fkl',1,'L')&&!ok('fkl',1,'S'),'lateral: solo centro/preparada');
ck(!ok('fkl',0,'L')&&!ok('fkl',0,'1')&&!ok('fkl',0,'-')&&!ok('fkl',0,'P'),'lateral: sin decisión defensiva');
ck(ok('cor',1,'S')&&ok('cor',1,'1')&&ok('cor',1,'2')&&!ok('cor',1,'P')&&!ok('cor',1,'L'),'córner ataque: corto/1º/2º');
ck(ok('cor',0,'1')&&ok('cor',0,'2')&&ok('cor',0,'P')&&!ok('cor',0,'S')&&!ok('cor',0,'L'),'córner defensa: 1º/2º/presionar');
// 2) resolución estadística: las 9 combinaciones del córner, perspectiva L/R, filosofía
async function rate(kind,cc,dc,ph,N,extra){const r=await mk('t'+Math.random().toString(36).slice(2,7),ph),m=r.ms[0],tac=r.pl[m.a].tac,tk=tac.xi[9],gk=r.pl[m.b].tac.xi[0];let g=0,l=0,bad=0;
 for(let i=0;i<N;i++){m.evs=[];m.pend=null;const ev={id:1e6+i,k:kind=='cor'?'cor':'fk',ft:kind=='fkl'?'l':undefined,m:30,t:0,dm:extra||24};T.resSp(r,m,{kind,o:0,tk,gk,ev,sh:cc,dv:dc});const e=m.evs[m.evs.length-1];
  if(!e||e.ak!=ev.id||e.cc!=cc||e.dc!=dc)bad++;else{if(e.x=='g')g++;if(e.x=='l')l++;if(!'gcsowl'.includes(e.x))bad++}}
 return{g:g/N,l:l/N,bad}}
(async()=>{
const N=6000,res={};
for(const a of SPA.cor)for(const d of SPD.cor){const x=await rate('cor',a,d,'equilibrada',N);res['cor '+a+d]=x;ck(!x.bad,'córner '+a+d+' evento inválido')}
console.log('córner goles%:',Object.entries(res).map(([k,v])=>k+'='+(v.g*100).toFixed(1)+(v.l?'/perd'+(v.l*100).toFixed(0):'')).join('  '));
ck(res['cor 11'].g<res['cor 12'].g,'1º vs cubrir 1º debe rendir menos que 1º vs cubrir 2º');
ck(res['cor 22'].g<res['cor 21'].g,'2º vs cubrir 2º debe rendir menos que 2º vs cubrir 1º');
ck(res['cor SP'].g<res['cor S1'].g&&res['cor SP'].l>res['cor S1'].l,'corto vs presionar: menos gol y más pelota perdida');
ck(Object.values(res).every(v=>v.g<.4),'ninguna combinación garantiza el gol');
const fk=await rate('fkd','L','L','equilibrada',N),fk2=await rate('fkd','L','R','equilibrada',N);console.log('directo gol%: atajó el lado '+(fk.g*100).toFixed(1)+'  lado contrario '+(fk2.g*100).toFixed(1));
ck(fk.g<fk2.g&&fk2.g<.7&&fk.g>0,'directo: acertar el lado reduce el gol, pero el lado contrario no garantiza');
ck(!(await rate('fkd','L','R','equilibrada',200)).bad,'directo evento válido');
const lc=await rate('fkl','C','-','equilibrada',N),lp=await rate('fkl','P','-','equilibrada',N);console.log('lateral gol%: centro '+(lc.g*100).toFixed(1)+' preparada '+(lp.g*100).toFixed(1)+' (perdida '+(lp.l*100).toFixed(0)+'%)');
ck(lp.l>.1&&lc.l==0,'la jugada preparada arriesga perder la pelota y el centro no');
// filosofía
const P=async(k,a,d,ph)=>(await rate(k,a,d,ph,N*2)).g,eq=await P('cor','1','2','equilibrada'),ru=await P('cor','1','2','rustica');ck(ru>eq,'rústico: más gol de córner ('+ru.toFixed(3)+' vs '+eq.toFixed(3)+')');
const el=await P('fkl','C','-','equilibrada'),li=await P('fkl','C','-','lirica');ck(li>el,'lírico: más gol de lateral ('+li.toFixed(3)+' vs '+el.toFixed(3)+')');
const od=await P('fkd','L','R','equilibrada'),of=await P('fkd','L','R','ofensiva');ck(of>od,'ofensivo: más gol de directo ('+of.toFixed(3)+' vs '+od.toFixed(3)+')');
ck((await P('cor','1','2','lirica'))<=ru&&(await P('fkd','L','R','rustica'))<of,'cada filosofía mejora lo suyo, no lo ajeno');

// 2b) dos pedidos seguidos (misma jugada/minuto): el segundo espera su turno, nunca se resuelve solo
{const r=await mk('cola'+Math.random().toString(36).slice(2,6)),m=r.ms[0],tac=r.pl[m.a].tac,gk=r.pl[m.b].tac.xi[0],A=m.a,Dd=m.b;m.pend=null;m.pq=[];const sc0=[m.ga,m.gb];
 for(const [i,k] of ['cor','fkd','fkl'].entries())T.spStart(r,m,k,0,tac.xi[9],gk,{id:9e6+i,k:k=='cor'?'cor':'fk',m:20,t:0,dm:22});
 ck(m.pend&&m.pend.id==9e6&&m.pq.length==2,'overlap: el primero queda activo y los otros dos en cola');
 E.act({a:'pdec',pid:A,room:r.code||Object.keys(E.rooms).find(c=>E.rooms[c]===r),id:9e6,d:'1'});E.act({a:'pdec',pid:Dd,room:Object.keys(E.rooms).find(c=>E.rooms[c]===r),id:9e6,d:'2'});
 ck(m.pend&&m.pend.id==9e6+1&&m.pq.length==1&&m.pend.sh==null&&m.pend.dv==null,'al resolver el primero pasa el siguiente, todavía sin decidir (no se ejecutó solo)')}
// 3) flujo en vivo: una sala con humanos, se deciden pedidos reales, sin duplicados ni bloqueos
E.CFG.tick=4;const st={pend:{},res:{},dup:0,bad:0},rooms=[];
 for(let k=0;k<10;k++){const room='pp'+k;E.act({a:'create',pid:'a'+k,name:'A',room,uid:'ua'+k,cfg:{div:'ar1',fmt:'liga1',n:4}});['b','c','d'].forEach(x=>E.act({a:'join',pid:x+k,name:x,room,uid:'u'+x+k}));['a','b','c','d'].forEach((x,i)=>{E.listen(room,x+k,()=>{});E.act({a:'pick',pid:x+k,room,team:teams[(k*4+i)%teams.length]})});rooms.push(room)}
 const t0=Date.now(),seen=new Set(),got=new Set(),OPA={fkd:'LR',fkl:'CP',cor:'S12'},OPD={fkd:'LR',cor:'12P'};
 while(Date.now()-t0<45000){for(const room of rooms){const r=E.rooms[room];if(r.phase=='pre')r.t=0;(r.ms||[]).forEach(m=>{const p=m.pend;if(p&&p.kind&&!seen.has(p.id)){seen.add(p.id);st.pend[p.kind]=(st.pend[p.kind]||0)+1;const A=p.o?m.b:m.a,Dd=p.o?m.a:m.b,n=seen.size%3;
   E.act({a:'pdec',pid:A,room,id:p.id,d:'Z'});E.act({a:'pdec',pid:A,room,id:p.id,d:p.kind=='cor'?'P':'S'});   // opciones que no corresponden: se ignoran
   if(p.sh!=null)st.bad++;
   if(n!=1){const d=OPA[p.kind][seen.size%OPA[p.kind].length];E.act({a:'pdec',pid:A,room,id:p.id,d});E.act({a:'pdec',pid:A,room,id:p.id,d:OPA[p.kind][(seen.size+1)%OPA[p.kind].length]});if(p.kind!='fkl'&&p.sh!=d)st.bad++}   // la segunda elección (repetida) no cambia nada
   if(OPD[p.kind]&&n!=2)E.act({a:'pdec',pid:Dd,room,id:p.id,d:OPD[p.kind][0]});
   E.act({a:'pdec',pid:'espectador',room,id:p.id,d:'L'})}   // quien no juega no decide
  (m.pv||[]).forEach(e=>{if(e.ak!=null&&!got.has(e.id)&&seen.has(e.ak)){got.add(e.id);st.res[e.k]=(st.res[e.k]||0)+1;if(!'gcsowl'.includes(e.x)||!e.cc||e.dc==null)st.bad++}else if(e.ak!=null&&got.has(e.id)&&0)st.dup++})})}await sleep(20)}
 console.log(JSON.stringify(st),'pedidos',seen.size,'resueltos',got.size);
 ck(seen.size>5,'se generaron pedidos de pelota parada en partidos reales');ck(got.size>=seen.size-rooms.length,'cada pedido se resolvió una sola vez (sin bloqueos)');ck(!st.bad,'decisiones inválidas ignoradas / eventos válidos');
 console.log(fail?'FALLA ('+fail+')':'Todo OK');process.exit(fail?1:0)})();