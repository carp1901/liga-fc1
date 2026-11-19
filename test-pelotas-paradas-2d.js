// 2D: la escena de pelota parada espera la decisión, se completa con el resultado y deja la cancha en orden: node test-pelotas-paradas-2d.js
const {Sim}=require('./public/sim2d');let fail=0,n=0,goals=0,id=1;const ck=(c,m)=>{if(!c){fail++;console.log('FALLA:',m)}};
const S=new Sim();S.setup(0,1,'k');S.frozen=false;S.onGoal=()=>goals++;
function run(base,res,as,fn){S.kickoff(0);for(let i=0;i<40;i++)S.step();const e={...base,id:id++,ask:1,n:'T. Test',t:as,ch:[]};S.event({...e},as);
 let f=0;while(!(S.sc&&S.sc.ph=='wait'&&S.sc.e&&S.sc.e.id==e.id&&S.sc.x==null)&&f<2500){S.step();f++}
 const waited=S.sc&&S.sc.ph=='wait'&&S.sc.x==null;let hold=0;if(waited){for(let i=0;i<300;i++){S.step();if(S.sc&&S.sc.e&&S.sc.e.id==e.id&&S.sc.ph=='wait')hold++}}
 const g0=goals,seq=new Set();S.event({...e,...res,ak:e.id,ask:0},as);let w=0;while((S.sc||S.q.length)&&w<2500){S.step();if(S.B.own)seq.add(S.B.own.k+'/'+S.B.own.s);w++}
 return{waited,held:hold>=290,done:w<2500,goal:goals>g0,seq,sc:fn&&fn()}}
for(const as of[0,1])for(const[cc,dc]of[['S','P'],['S','1'],['1','1'],['1','2'],['2','2'],['2','1']])for(const x of['g','c']){n++;
 const r=run({k:'cor'},{x,cc,dc,sd:cc,dd:dc},as);ck(r.waited,'córner '+cc+dc+' no esperó la decisión');ck(r.held,'córner '+cc+dc+' siguió sin resultado');ck(r.done,'córner '+cc+dc+x+' no terminó');
 if(x=='g')ck(r.goal,'córner '+cc+dc+' gol no animado (as='+as+')');else ck(!r.goal,'córner '+cc+dc+' gol de más');
 if(cc=='S'&&x=='g')ck(r.seq.size>=2,'córner corto: no hubo pase corto antes del centro')}
{const vr=new Set();let max=0;for(let i=0;i<14;i++){const r=run({k:'cor'},{x:'c',cc:'S',dc:'1',sd:'S',dd:'1'},i%2,()=>S.sc&&S.sc.vr);max=Math.max(max,r.seq.size)}ck(max>=3,'córner corto: nunca hubo devolución/combinación (max con pelota '+max+')')}
// córner corto con pelota perdida: cambia la posesión
{let lost=0,tot=0;for(let i=0;i<6;i++){const as=i%2,r=run({k:'cor'},{x:'l',cc:'S',dc:'P',sd:'S',dd:'P'},as);tot++;ck(r.done,'corto perdido no terminó');if(S.poss!=as)lost++}console.log('corto perdido: posesión al rival',lost+'/'+tot);ck(lost>=tot-1,'corto perdido debe dar la pelota al rival')}
for(const as of[0,1])for(const[cc,x]of[['C','g'],['C','c'],['P','g'],['P','l'],['C','s']]){const r=run({k:'fk',ft:'l'},{x,cc,dc:'-',sd:cc,dd:'-'},as);ck(r.waited,'lateral '+cc+x+' no esperó');ck(r.done,'lateral '+cc+x+' no terminó');if(x=='g')ck(r.goal,'lateral gol no animado');else ck(!r.goal,'lateral gol de más')}
for(const as of[0,1])for(const[sd,dd,x]of[['L','R','g'],['R','L','g'],['L','L','s'],['R','R','s'],['L','R','w'],['R','L','o']]){const r=run({k:'fk',dm:22},{x,sd,dd,cc:sd,dc:dd},as);ck(r.waited,'directo '+sd+dd+x+' no esperó');ck(r.done,'directo '+sd+dd+x+' no terminó');if(x=='g')ck(r.goal,'directo gol no animado');else ck(!r.goal,'directo gol de más')}
// resultado que llega antes de que la jugada esté en pantalla (cola): se completa igual, sin duplicar
{S.kickoff(0);for(let i=0;i<40;i++)S.step();const e={k:'cor',id:id++,ask:1,t:0,ch:[]};S.event({...e},0);const q0=S.q.length;S.event({...e,ask:0,ak:e.id,id:id++,x:'c',cc:'1',dc:'2',sd:'1',dd:'2'},0);ck(S.q.length==q0,'el resultado no debe duplicar la jugada en cola');let w=0;while((S.sc||S.q.length)&&w<2500){S.step();w++}ck(w<2500,'jugada en cola resuelta no terminó')}
console.log(fail?'FALLA ('+fail+')':'Todo OK',n+' córners');process.exit(fail?1:0);
