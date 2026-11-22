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
// dirección: la pelota va al lado elegido (perspectiva del que patea) para los dos equipos; el 2.º tiempo también (SIM.setHalf no cambia la geometría, el cliente espeja los botones)
{const {H}=require('./public/sim2d');for(const second of[false,true])for(const as of[0,1])for(const sd of['L','R'])for(const x of['g','s','o']){S.setHalf(second);S.kickoff(0);for(let i=0;i<40;i++)S.step();const e={k:'fk',dm:22,id:id++,ask:1,t:as,n:'T',ch:[]};S.event({...e},as);let f=0;while(!(S.sc&&S.sc.ph=='wait'&&S.sc.e&&S.sc.e.id==e.id&&S.sc.x==null)&&f<3000){S.step();f++}
 const dd=x=='s'?sd:(sd=='L'?'R':'L');S.event({...e,ask:0,ak:e.id,id:id++,x,sd,dd,cc:sd,dc:dd},as);const gx=S.geo(as).gx;let yb=null,bd=null,w=0;while((S.sc||S.q.length)&&w<2500){S.step();w++;if(w<400){const d=Math.abs(S.B.x-gx);if(bd==null||d<bd){bd=d;yb=S.B.y}}}
 const want=(sd=='L'?-1:1)*(as?-1:1);ck(yb!=null&&Math.sign(yb-H/2)==want,'directo '+sd+' x='+x+' as='+as+(second?' (2.º tiempo)':'')+': la pelota fue al lado equivocado (y='+yb+')')}S.setHalf(false)}
// córner sin jugada previa visible: nunca de la nada (hay una pelota larga/remate que termina en el córner y la pelota sale por el fondo)
{for(const as of[0,1]){S.kickoff(0);for(let i=0;i<40;i++)S.step();const e={k:'cor',id:id++,ask:1,t:as,n:'T',ch:[]},kinds=[];S.event({...e},as);let f=0;while(!(S.sc&&S.sc.k=='cor'&&S.sc.ph=='wait'&&S.sc.e&&S.sc.e.id==e.id)&&f<4000){S.step();f++;if(S.sc&&kinds[kinds.length-1]!=S.sc.k)kinds.push(S.sc.k)}
 ck(kinds.includes('att'),'córner sin causa: no hubo jugada previa ('+kinds.join('>')+')')}}
// centro de tiro libre lejano: la pelota viaja al área (no al compañero cercano); córner 1º/2º palo caen en zonas distintas y con vuelo distinto; el corto no nace marcado; jugada preparada con variantes
{const {H}=require('./public/sim2d');const info={};let nearCover=0,nearN=0;const labels=new Set();
 const go=(base,res,as)=>{S.kickoff(0);for(let i=0;i<40;i++)S.step();const e={...base,id:id++,ask:1,t:as,n:'T',ch:[]};S.event({...e},as);let f=0;while(!(S.sc&&S.sc.ph=='wait'&&S.sc.e&&S.sc.e.id==e.id&&S.sc.x==null)&&f<4000){S.step();f++}
  const sc=S.sc,gx=S.geo(as).gx,sh=sc&&sc.shc,cov=sh?S.P.filter(p=>p.s!==as&&!p.off&&p.k>0&&Math.hypot(p.x-sh.x,p.y-sh.y)<80).length:0;for(let i=0;i<30;i++)S.step();
  S.event({...e,...res,ask:0,ak:e.id,id:id++},as);const o={cov,gx,as,zone:null,crossD:null,airH:null,lbl:[],landX:null,landY:null,flag:S.B.y};let w=0;
  while((S.sc||S.q.length)&&w<2500){S.step();w++;const c=S.sc;if(c&&c.label)o.lbl.push(c.label);if(c&&c.ph=='cx'&&o.zone==null){o.zone=c.zone;o.crossD=S.crossD;o.airH=S.airH;o.x0=S.B.x;o.y0=S.B.y}if(c&&c.ph=='cx'&&S.n-S.crossT<=Math.floor(S.crossD)-2){o.landX=S.B.x;o.landY=S.B.y}}return o};
 for(let i=0;i<10;i++){const as=i%2;
  for(const cc of['1','2']){const o=go({k:'cor'},{x:'c',cc,dc:'P',sd:cc,dd:'P'},as);(info[cc]=info[cc]||[]).push(o)}
  const c=go({k:'cor'},{x:'c',cc:'S',dc:'1',sd:'S',dd:'1'},as);nearCover+=c.cov;nearN++;
  const l=go({k:'fk',ft:'l'},{x:'c',cc:'C',dc:'-',sd:'C',dd:'-'},as);ck(l.zone!=null&&Math.abs(l.x0-l.gx)>150&&l.landX!=null&&Math.abs(l.landX-l.gx)<175,'centro lateral: no llegó al área (salió de x='+Math.round(l.x0||0)+', recibió en x='+Math.round(l.landX||0)+')');
  const p=go({k:'fk',ft:'l'},{x:'c',cc:'P',dc:'-',sd:'P',dd:'-'},as);p.lbl.forEach(x=>labels.add(x))}
 const m=a=>a.reduce((x,y)=>x+y,0)/a.length,z1=info['1'].filter(o=>o.zone).map(o=>o.zone),z2=info['2'].filter(o=>o.zone).map(o=>o.zone);
 ck(z1.every(z=>z=='n')&&z1.length>=8&&z2.every(z=>z=='f')&&z2.length>=8,'1º y 2º palo deben tener zonas distintas');
 ck(m(info['2'].map(o=>o.crossD))>m(info['1'].map(o=>o.crossD))*1.15&&m(info['2'].map(o=>o.airH))>m(info['1'].map(o=>o.airH))+4,'1º palo: pelota rápida y baja; 2º palo: lenta y alta ('+m(info['1'].map(o=>o.crossD)).toFixed(0)+' vs '+m(info['2'].map(o=>o.crossD)).toFixed(0)+' ticks)');
 console.log(JSON.stringify(info['2'].map(o=>[o.zone,o.as,Math.round(o.flag),Math.round(o.landX||0),Math.round(o.landY||0),Math.round(o.crossD)])));const side=o=>Math.sign(o.landY-H/2)*Math.sign(o.flag-H/2),n1=info['1'].filter(o=>o.landY!=null),n2=info['2'].filter(o=>o.landY!=null);console.log('recibe del lado del banderín: 1º palo',n1.filter(o=>side(o)>0).length+'/'+n1.length,' 2º palo',n2.filter(o=>side(o)<0).length+'/'+n2.length);
 const df=a=>m(a.map(o=>Math.abs(o.landY-o.flag)));ck(df(n2)>df(n1)+35,'2º palo debe caer más lejos del banderín que el 1º ('+df(n1).toFixed(0)+' vs '+df(n2).toFixed(0)+' px)');
 ck(nearCover<=nearN*.2,'córner corto: había rivales encima del receptor ('+nearCover+')');console.log('jugadas preparadas vistas:',[...labels].join(' | '));ck(labels.size>=3,'jugada preparada con pocas variantes: '+[...labels].join(','))}
// córner con la formación de un córner real: poco amontonamiento y el árbitro fuera del racimo
{const D=require('./public/data');let pares=0,refN=0,nn=0;for(let f=0;f<D.FM.length;f+=3)for(const as of[0,1]){const T=new Sim();T.setup(f,(f*3+1)%D.FM.length,'c'+f);T.frozen=false;T.kickoff(0);for(let i=0;i<40;i++)T.step();const e={k:'cor',id:id++,ask:1,t:as,n:'T',ch:[]};T.event({...e},as);let g=0;while(!(T.sc&&T.sc.ph=='wait'&&T.sc.e&&T.sc.e.id==e.id)&&g<4000){T.step();g++}for(let i=0;i<220;i++)T.step();
 const P=T.P.filter(p=>!p.off&&p.k>0);for(let a=0;a<P.length;a++)for(let b=a+1;b<P.length;b++)if(Math.hypot(P[a].x-P[b].x,P[a].y-P[b].y)<22)pares++;const r=T.refs[0];if(Math.min(...P.map(p=>Math.hypot(p.x-r.x,p.y-r.y)))<45)refN++;nn++}
 ck(pares<=nn*1.2,'córner amontonado: '+pares+' pares de jugadores casi superpuestos en '+nn+' córners');ck(refN==0,'el árbitro quedó metido entre los jugadores en '+refN+' córners')}
console.log(fail?'FALLA ('+fail+')':'Todo OK',n+' córners');process.exit(fail?1:0);
