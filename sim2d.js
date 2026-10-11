// Física 2D tipo Haxball: fichas con aceleración y fricción, pelota con rebotes, pases lógicos (pared, entre líneas) y formación que se mueve en bloque.
// El servidor decide qué pasa; acá se "actúan" sus jugadas (ataques, tiros libres, penales, córners, faltas) sobre la física.
(function(){
const W=720,H=440,X0=20,Y0=20,FW=W-40,FH=H-40,GY0=H/2-48,GY1=H/2+48,R=11,BR=6,rnd=Math.random,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),
FM=[[4,4,2],[4,3,3],[3,5,2],[4,5,1],[5,3,2]],XS=[.06,.21,.37,.49];
const hom=(f,k)=>{const[d,m,a]=FM[f],L=[1,d,m,a],st=[0,1,1+d,1+d+m];let l=3;while(k<st[l])l--;return{l,hx:XS[l],hy:(k-st[l]+1)/(L[l]+1)}};
const segD=(a,b,c)=>{const dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy||1,t=clamp(((c.x-a.x)*dx+(c.y-a.y)*dy)/L,0,1);return Math.hypot(a.x+dx*t-c.x,a.y+dy*t-c.y)};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
class Sim{
 constructor(){this.P=[];this.B={x:W/2,y:H/2,vx:0,vy:0,own:null,recv:null,free:false};this.poss=0;this.sc=null;this.key=null;this.n=0;this.tr=[];this.passes=0;this.q=[];this.frozen=true;this.T=[[1,0,0],[1,0,0]];this.fx=null;this.goalN=0;this.onGoal=null;this.gap=0;this.fs=1;this.prev=null;this.runner=null;this.freeze=0}
 setup(f0,f1,key){const k=key+'|'+f0+'|'+f1;if(k===this.key)return false;this.key=k;this.P=[];
  [f0,f1].forEach((f,s)=>{if(f==null)return;for(let i=0;i<11;i++){const h=hom(f,i);this.P.push({s,k:i,l:h.l,hx:h.hx,hy:h.hy,x:0,y:0,vx:0,vy:0,fx:s?-1:1,fy:0,off:false,cool:0,hold:0,wait:20,tg:null})}});this.hardRest();return true}
 setTac(s,t){this.T[s]=t}
 hp(p){return{x:X0+(p.s?1-p.hx:p.hx)*FW,y:Y0+p.hy*FH}}
 tg(p,x,y){if(p)p.tg={x:clamp(x,X0+R,X0+FW-R),y:clamp(y,Y0+R,Y0+FH-R)}}
 clr(){this.P.forEach(p=>p.tg=null)}
 rest(){const S=this,B=S.B;S.sc=null;S.fx=null;S.freeze=0;S.runner=null;S.prev=null;S.clr();S.P.forEach(p=>{const h=S.hp(p);p.x=h.x;p.y=h.y;p.vx=p.vy=0;p.cool=0;p.hold=0});B.x=W/2;B.y=H/2;B.vx=B.vy=0;B.free=false;B.own=null;B.recv=null}
 hardRest(){this.q=[];this.gap=0;this.rest()}
 kickoff(side){const S=this,B=S.B;S.rest();const o=S.P.find(p=>p.s==side&&p.k==10&&!p.off)||S.P.find(p=>!p.off);if(!o)return;o.x=W/2+(o.s?14:-14);o.y=H/2;B.own=o;S.poss=o.s;o.hold=0;o.wait=24}
 setOff(s,list){this.P.forEach(p=>{if(p.s!==s)return;const off=!!(list&&list.includes(p.k));if(off&&this.B.own===p)this.B.own=null;p.off=off})}
 geo(as){return{gx:as?X0:X0+FW,dir:as?-1:1,ds:1-as}}
 near(arr,pt){return arr.reduce((b,p)=>!b||dist(p,pt)<dist(b,pt)?p:b,null)}
 psp(d){return clamp(d/16,6,10)*this.fs}
 kick(tx,ty,sp,recv){const S=this,B=S.B,dx=tx-B.x,dy=ty-B.y,d=Math.hypot(dx,dy)||1;S.tr.push({x0:B.x,y0:B.y,x1:tx,y1:ty,n:S.n});if(S.tr.length>6)S.tr.shift();S.passes++;
  if(B.own){B.own.cool=14;S.prev=B.own;B.x+=dx/d*(R+BR+1);B.y+=dy/d*(R+BR+1)}B.vx=dx/d*sp;B.vy=dy/d*sp;B.own=null;B.recv=recv||null}
 kickAt(q,sp){const B=this.B,d=dist(q,B),t=d/sp;this.kick(q.x+q.vx*t*.7,q.y+q.vy*t*.7,sp,q)}
 pass(o){const S=this,opp=S.P.filter(q=>q.s!==o.s&&!q.off),dir=o.s?-1:1,tt=S.T[o.s],fw0=[.35,.55,.85][tt[0]],press=opp.some(z=>dist(z,o)<32);let best=null,bs=-1e9;
  for(const q of S.P){if(q===o||q.s!==o.s||q.off)continue;const d=dist(q,o);if(d<45||d>380)continue;
   const open=Math.min(220,...opp.map(z=>dist(z,q))),lane=Math.min(120,...opp.map(z=>segD(o,q,z))),fw=dir*(q.x-o.x);
   let sc=fw*fw0+open*.5+lane*1.2-d*.2+(q.k==0?-120:0)+(press?-fw*.25:0)+rnd()*45;
   if(fw>110&&lane>45)sc+=30;                                   // pase entre líneas
   if(tt[2])sc+=Math.abs(q.y-H/2)*.12;                          // juego por las bandas
   if(S.runner&&q===S.runner.p&&S.n<S.runner.t)sc+=60+tt[0]*30; // pared / triangulación
   if(sc>bs){bs=sc;best=q}}
  if(!best){S.B.own=o;S.kick(clamp(o.x+dir*200,X0,X0+FW),clamp(o.y+(rnd()-.5)*200,Y0,Y0+FH),8,null);return}
  S.kickAt(best,clamp(dist(best,o)/20,5.2,9))}
 event(e,as){const S=this,n=S.q.length;if(!S.P.length||S.frozen||(as==1&&S.P.length<22))return;
  if(n>=4&&(e.k=='foul'||(e.k=='att'&&(e.x=='l'||e.x=='o'))))return;if(n>=7&&e.x!='g')return;S.q.push({e,as})}
 begin(){const S=this,it=S.q.shift(),e=it.e,as=it.as;S.clr();S.B.free=false;S.poss=as;S.fs=1+Math.min(.8,S.q.length*.25);
  if(e.k=='att')S.attSc(e,as);else if(e.k=='foul')S.foulSc(e,as);else if(e.k=='fk')S.fkSc(e,as);else if(e.k=='pen')S.penSc(e,as);else if(e.k=='cor')S.corSc(e,as)}
 endSc(){this.sc=null;this.clr();this.gap=14}
 attSc(e,as){const S=this,P=S.P,B=S.B,ch=e.ch.map(k=>P.find(p=>p.s==as&&p.k==k)).filter(p=>p&&!p.off);if(!ch.length)return;
  S.sc={k:'att',e,side:as,ch,i:0,x:e.x,t:0,tk:0,ph:'c',wait:ch[0],in:false};S.kickAt(ch[0],clamp(dist(ch[0],B)/22,8,13)*S.fs)}
 finish(){const S=this,sc=S.sc,B=S.B,as=sc.side,{gx,dir,ds}=S.geo(as),dg=S.P.filter(p=>p.s==ds&&!p.off),gk=dg.find(p=>p.k==0)||dg[0],fs=S.fs;sc.gk=gk;
  if(sc.x=='g'){sc.ph='g';sc.wait=null;B.free=true;S.kick(gx+dir*18,H/2+(rnd()-.5)*70,12.5*fs,null)}
  else if(sc.x=='s'){sc.ph='s';sc.wait=gk;S.kick(gk.x,gk.y,11*fs,gk)}
  else if(sc.x=='o'){sc.ph='o';sc.wait=null;sc.t2=S.n;S.kick(gx,rnd()<.5?GY0-34:GY1+34,12*fs,null)}
  else{const z=dg.filter(p=>p.k).reduce((b,p)=>!b||dist(p,B)<dist(b,B)?p:b,null)||gk;sc.ph='l';sc.wait=z;S.kickAt(z,8*fs)}}
 foulSc(e,as){const S=this,B=S.B;B.own=null;B.vx=B.vy=0;B.recv=null;S.sc={k:'foul',e,side:as,t:0,ph:'f',label:'FALTA'};S.fx={n:S.n,x:B.x,y:B.y}}
 fkSc(e,as){const S=this,{gx,dir,ds}=S.geo(as),P=S.P,B=S.B,ba={x:clamp(gx-dir*(160+rnd()*70),X0+40,X0+FW-40),y:H/2+(rnd()-.5)*200},
  at=P.filter(p=>p.s==as&&!p.off&&p.k>=4),taker=S.near(at.length?at:P.filter(p=>p.s==as&&!p.off),ba),u={x:gx-ba.x,y:H/2-ba.y},ul=Math.hypot(u.x,u.y)||1;u.x/=ul;u.y/=ul;
  const wc={x:ba.x+u.x*70,y:ba.y+u.y*70},wall=P.filter(p=>p.s==ds&&!p.off&&p.k>=1&&p.k<=7).sort((a,b)=>dist(a,wc)-dist(b,wc)).slice(0,4);
  wall.forEach((p,j)=>S.tg(p,wc.x-u.y*(j-1.5)*14,wc.y+u.x*(j-1.5)*14));S.tg(taker,ba.x-u.x*26,ba.y-u.y*26);
  let i=0;P.forEach(p=>{if(p===taker||wall.includes(p)||p.off||p.k==0)return;const j=i++;if(p.s==as&&p.k>=4)S.tg(p,gx-dir*(90+(j%2)*20),H/2+((j%5)-2)*34);else if(p.s==ds)S.tg(p,gx-dir*(55+(j%3)*14),H/2+((j%5)-2)*30);else S.tg(p,W/2-dir*40,H/2+((j%5)-2)*40)});
  const gk=P.find(p=>p.s==ds&&p.k==0&&!p.off);S.tg(gk,gx-dir*10,H/2+clamp((ba.y-H/2)*.25,-30,30));
  B.x=ba.x;B.y=ba.y;B.vx=B.vy=0;B.own=null;B.recv=null;S.sc={k:'fk',e,side:as,ph:'set',t:0,x:e.x,ba,taker,wall,gk,label:'TIRO LIBRE'};S.fx={n:S.n,x:ba.x,y:ba.y}}
 penSc(e,as){const S=this,{gx,dir,ds}=S.geo(as),P=S.P,B=S.B,ba={x:gx-dir*72,y:H/2},at=P.filter(p=>p.s==as&&!p.off&&p.k>=5),taker=S.near(at.length?at:P.filter(p=>p.s==as&&!p.off),ba);
  S.tg(taker,ba.x-dir*24,ba.y);let i=0;P.forEach(p=>{if(p===taker||p.off||p.k==0)return;S.tg(p,gx-dir*(125+(p.s==ds?16:0)),H/2+(((i++)%9)-4)*34)});
  const gk=P.find(p=>p.s==ds&&p.k==0&&!p.off);S.tg(gk,gx-dir*8,H/2);S.tg(P.find(p=>p.s==as&&p.k==0&&!p.off),gx-dir*300,H/2);
  B.x=ba.x;B.y=ba.y;B.vx=B.vy=0;B.own=null;B.recv=null;S.sc={k:'pen',e,side:as,ph:'set',t:0,x:e.x,ba,taker,gk,label:'PENAL'};S.fx={n:S.n,x:ba.x,y:ba.y}}
 corSc(e,as){const S=this,{gx,dir,ds}=S.geo(as),P=S.P,B=S.B,top=rnd()<.5,fl={x:gx-dir*4,y:top?Y0+4:Y0+FH-4},at=P.filter(p=>p.s==as&&!p.off&&p.k>=3),taker=S.near(at.length?at:P.filter(p=>p.s==as&&!p.off),fl),box=[];
  S.tg(taker,fl.x-dir*10,fl.y+(top?10:-10));let i=0;P.forEach(p=>{if(p===taker||p.off||p.k==0)return;const j=i++;if(p.s==as&&p.k>=5){S.tg(p,gx-dir*(40+(j%3)*26),H/2+((j%5)-2)*34);box.push(p)}else if(p.s==ds)S.tg(p,gx-dir*(34+(j%3)*24),H/2+((j%5)-2)*30);else S.tg(p,W/2-dir*40,H/2+((j%5)-2)*40)});
  const gk=P.find(p=>p.s==ds&&p.k==0&&!p.off);S.tg(gk,gx-dir*8,H/2);B.x=fl.x-dir*6;B.y=fl.y+(top?6:-6);B.vx=B.vy=0;B.own=null;B.recv=null;
  S.sc={k:'cor',e,side:as,ph:'set',t:0,x:e.x,taker,box,gk,label:'CÓRNER',tk:0};S.fx={n:S.n,x:B.x,y:B.y}}
 shotSp(){const S=this,sc=S.sc,B=S.B,{gx,dir}=S.geo(sc.side),gk=sc.gk,x=sc.x,sg=rnd()<.5?-1:1,fs=S.fs;B.own=null;
  if(sc.k=='pen'&&gk){gk.x=gx-dir*10;gk.y=H/2+(x=='g'?-sg:sg)*(x=='o'?0:30);gk.vx=gk.vy=0}   // el arquero se tira
  if(x=='g'){sc.ph='g';sc.wait=null;B.free=true;S.kick(gx+dir*18,H/2+sg*(sc.k=='pen'?28:30+rnd()*8),(sc.k=='pen'?12.5:12)*fs,null)}
  else if(x=='s'){sc.ph='s';sc.wait=gk;S.kick(gk?gk.x:gx,gk?gk.y:H/2,11*fs,gk)}
  else if(x=='w'){const w=sc.wall[1]||sc.wall[0];sc.ph='w';sc.wait=w;S.kickAt(w,11*fs)}
  else{sc.ph='o';sc.t2=S.n;sc.wait=null;S.kick(gx,rnd()<.5?GY0-34:GY1+34,12*fs,null)}}
 script(){const S=this,sc=S.sc,B=S.B,ph=sc.ph;sc.t++;
  if(sc.t>520){S.endSc();B.free=false;if(!B.own)B.own=S.P.find(p=>!p.off);return}
  if(ph=='g'){if(!sc.in&&(B.x<X0-4||B.x>X0+FW+4)){sc.in=true;sc.t2=S.n;S.goalN++;if(S.onGoal)S.onGoal(sc.side,sc.e.n)}if(sc.in&&S.n-sc.t2>55)S.kickoff(1-sc.side);return}
  if(ph=='s'){if(B.own===sc.gk)S.endSc();return}
  if(ph=='o'){if(S.n-sc.t2>45||(sc.t>12&&Math.hypot(B.vx,B.vy)<.6)){B.own=sc.gk;B.free=false;S.endSc()}return}
  if(ph=='w'||ph=='l'){if(B.own===sc.wait)S.endSc();return}
  if(sc.k=='att'){if(B.own===sc.wait&&B.own.hold>=6){sc.i++;if(sc.i<sc.ch.length){sc.wait=sc.ch[sc.i];sc.tk=sc.t;S.kickAt(sc.wait,S.psp(dist(sc.wait,B)))}else S.finish()}
   else if(!B.own&&sc.t-sc.tk>70){B.own=sc.wait;sc.wait.hold=0}}
  else if(sc.k=='fk'||sc.k=='pen'){const T=sc.k=='fk'?[58,18,7]:[66,26,7];
   if(ph=='set'&&sc.t>=T[0]){sc.ph='wait';S.fx={n:S.n,x:sc.ba.x,y:sc.ba.y}}
   else if(ph=='wait'&&sc.t>=T[0]+T[1]){sc.ph='run';S.tg(sc.taker,sc.ba.x,sc.ba.y)}
   else if(ph=='run'&&sc.t>=T[0]+T[1]+T[2])S.shotSp()}
  else if(sc.k=='cor'){
   if(ph=='set'&&sc.t>=52)sc.ph='wait';
   else if(ph=='wait'&&sc.t>=66){const tg=sc.box.length?sc.box[Math.floor(rnd()*sc.box.length)]:sc.taker;sc.tgt=tg;sc.ph='cx';sc.wait=tg;sc.tk=sc.t;S.kickAt(tg,9*S.fs)}
   else if(ph=='cx'){if(B.own===sc.tgt){const{gx,dir}=S.geo(sc.side);if(sc.x=='g'){sc.ph='g';sc.wait=null;B.free=true;B.own=null;S.kick(gx+dir*18,H/2+(rnd()-.5)*50,12.5*S.fs,null)}else{S.kick(W/2,H/2+(rnd()-.5)*200,9*S.fs,null);S.endSc()}}
    else if(!B.own&&sc.t-sc.tk>70){B.own=sc.tgt;sc.tgt.hold=0}}}}
 step(){const S=this,B=S.B,P=S.P;S.n++;if(!P.length||S.frozen)return;
  if(!S.sc){if(S.gap>0)S.gap--;else if(S.q.length)S.begin()}
  if(S.sc&&S.sc.k=='foul'){const sc=S.sc;if(++sc.t>=30){const{dir}=S.geo(sc.side),c=S.near(P.filter(p=>p.s==sc.side&&!p.off&&p.k>0),B);if(c){c.x=clamp(B.x-dir*14,X0+R,X0+FW-R);c.y=B.y;B.own=c;c.hold=0;c.wait=18}S.endSc()}return}
  if(S.sc)S.script();
  const bnx=(B.x-X0)/FW,bny=(B.y-Y0)/FH,near=[null,null],nd=[1e9,1e9];
  P.forEach(p=>{if(p.off||p.k==0)return;const d=dist(p,B);if(d<nd[p.s]){nd[p.s]=d;near[p.s]=p}});
  P.forEach(p=>{if(p.off)return;let tx,ty,vm=p.l==0?1.5:1.9;const tt=S.T[p.s];
   if(p.k==0){tx=X0+(p.s?1-.04:.04)*FW;ty=H/2+clamp((B.y-H/2)*.4,-60,60);vm=2}
   else{const att=S.poss==p.s,bu=p.s?1-bnx:bnx,wl=[0,.5,.85,1][p.l],adv=[.85,1,1.2][tt[0]];
    let ux=att?p.hx+wl*(bu*.55*adv-.08):p.hx+wl*(bu-.55)*.35+wl*((tt[1]?.05:0)-(tt[0]==0?.04:0));ux=clamp(ux,.05,p.l==3?.93:.85);
    let uy=clamp(p.hy+(bny-p.hy)*.3*Math.min(1,wl+.25),.05,.95);if(att&&tt[2]&&p.l>=2)uy=clamp(uy+(p.hy<.5?-1:1)*.16,.06,.94);
    tx=X0+(p.s?1-ux:ux)*FW;ty=Y0+uy*FH;
    if(B.own===p){tx=p.x+p.fx*40;ty=p.y+p.fy*40;vm=1.8}
    else if(B.recv===p||(S.sc&&S.sc.wait===p)){tx=B.x+B.vx*10;ty=B.y+B.vy*10;vm=3}
    else if(S.runner&&S.runner.p===p&&S.n<S.runner.t&&B.own&&B.own.s===p.s){const o=B.own,d=p.s?-1:1;tx=clamp(o.x+d*80,X0,X0+FW);ty=o.y+(H/2-o.y)*.3+(p.y<o.y?-25:25)}
    else if(near[p.s]===p&&(!B.own||B.own.s!==p.s)){tx=B.x+B.vx*6;ty=B.y+B.vy*6;vm=2.4}
    else if(att&&B.own&&B.own!==p&&p.l>=2)tx+=(p.s?-1:1)*30}
   if(p.tg){tx=p.tg.x;ty=p.tg.y;vm=2.7}
   const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy)||1,sp=Math.min(vm,d*.1);p.vx+=(dx/d*sp-p.vx)*.2;p.vy+=(dy/d*sp-p.vy)*.2;
   p.x=clamp(p.x+p.vx,X0+R,X0+FW-R);p.y=clamp(p.y+p.vy,Y0+R,Y0+FH-R);if(p.cool>0)p.cool--;
   if(B.own===p){const gx=p.s?X0:X0+FW,ax=gx-p.x,ay=(H/2-p.y)*.6,al=Math.hypot(ax,ay)||1;p.fx=ax/al;p.fy=ay/al}
   else{const v=Math.hypot(p.vx,p.vy);if(v>.3){p.fx=p.vx/v;p.fy=p.vy/v}}});
  for(let i=0;i<P.length;i++){const a=P[i];if(a.off)continue;for(let j=i+1;j<P.length;j++){const b=P[j];if(b.off)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
   if(d<R*1.8&&d>.01){const f=(R*1.8-d)/2/d;a.x-=dx*f*.5;a.y-=dy*f*.5;b.x+=dx*f*.5;b.y+=dy*f*.5}}}
  if(B.own){const o=B.own;if(o.off)B.own=null;else{B.x=o.x+o.fx*(R+BR);B.y=o.y+o.fy*(R+BR);B.vx=B.vy=0;S.poss=o.s;o.hold++;if(!S.sc&&o.hold>o.wait){S.pass(o);o.wait=20+Math.floor(rnd()*24)}}}
  else{B.x+=B.vx;B.y+=B.vy;B.vx*=.985;B.vy*=.985;const mouth=B.y>GY0&&B.y<GY1;
   if(B.y<Y0+BR){B.y=Y0+BR;B.vy=Math.abs(B.vy)*.7}if(B.y>Y0+FH-BR){B.y=Y0+FH-BR;B.vy=-Math.abs(B.vy)*.7}
   if(B.x<X0+BR&&!(B.free&&mouth)){B.x=X0+BR;B.vx=Math.abs(B.vx)*.7}if(B.x>X0+FW-BR&&!(B.free&&mouth)){B.x=X0+FW-BR;B.vx=-Math.abs(B.vx)*.7}
   if(B.free){if(B.x<X0-24){B.x=X0-24;B.vx=0}if(B.x>X0+FW+24){B.x=X0+FW+24;B.vx=0}}
   for(const p of P){if(p.off||p.cool>0)continue;if(dist(p,B)>=R+BR+1)continue;
    if(S.sc&&S.sc.wait!==p)continue;if(S.sc&&S.sc.ph=='g')continue;
    if(B.recv!==p&&!S.sc&&Math.hypot(B.vx,B.vy)>5.5&&rnd()<.35)continue;
    if(!S.sc&&S.prev&&S.prev!==p&&S.prev.s===p.s&&S.prev.k>0)S.runner={p:S.prev,t:S.n+60};
    B.own=p;B.recv=null;B.free=false;p.hold=0;p.wait=20+Math.floor(rnd()*24);break}}}
}
const API={Sim,W,H,X0,Y0,FW,FH,GY0,GY1,R,BR};if(typeof module!=='undefined')module.exports=API;else window.SIM2D=API;
})();
