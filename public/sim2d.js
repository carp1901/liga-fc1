// Física 2D tipo Haxball: fichas con aceleración y fricción, pelota con rebotes, pases lógicos (pared, entre líneas) y formación que se mueve en bloque.
// El servidor decide qué pasa; acá se "actúan" sus jugadas (ataques, tiros libres, penales, córners, faltas) sobre la física.
(function(){
const W=720,H=440,X0=20,Y0=20,FW=W-40,FH=H-40,GY0=H/2-48,GY1=H/2+48,R=13,BR=6,rnd=Math.random,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),
GEO=[[[1,.06,0],[4,.21,.5],[4,.37,.85],[2,.49,1]],[[1,.06,0],[4,.21,.5],[3,.37,.85],[3,.49,1]],[[1,.06,0],[3,.21,.5],[5,.37,.85],[2,.49,1]],[[1,.06,0],[4,.21,.5],[5,.37,.85],[1,.49,1]],[[1,.06,0],[5,.21,.5],[3,.37,.85],[2,.49,1]],
 [[1,.06,0],[4,.21,.5],[2,.32,.7],[3,.43,.9],[1,.49,1]],[[1,.06,0],[4,.21,.5],[2,.32,.7],[2,.43,.9],[2,.49,1]],[[1,.06,0],[3,.21,.5],[4,.37,.85],[3,.49,1]],[[1,.06,0],[5,.21,.5],[4,.37,.85],[1,.49,1]]];
const hom=(f,k)=>{const G=GEO[f];let c=0;for(let i=0;i<G.length;i++){const[n,x,w]=G[i];if(k<c+n){const l=i==0?0:i==G.length-1?3:i==1?1:2,hy=(k-c+1)/(n+1);return{l,wl:w,hx:x,hy,wide:l>=2&&Math.abs(hy-.5)>.22}}c+=n}};
const segD=(a,b,c)=>{const dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy||1,t=clamp(((c.x-a.x)*dx+(c.y-a.y)*dy)/L,0,1);return Math.hypot(a.x+dx*t-c.x,a.y+dy*t-c.y)};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
class Sim{
 constructor(){this.P=[];this.B={x:W/2,y:H/2,vx:0,vy:0,own:null,recv:null,free:false};this.poss=0;this.sc=null;this.key=null;this.n=0;this.tr=[];this.passes=0;this.q=[];this.frozen=true;this.T=[[1,0,0],[1,0,0]];this.fx=null;this.goalN=0;this.onGoal=null;this.gap=0;this.fs=1;this.prev=null;this.runner=null;this.freeze=0;this.trail=[];this.ctx={min:0,sc:[0,0]};this.link=null;this.shot=null;this.run=null}
 setup(f0,f1,key){const k=key+'|'+f0+'|'+f1;if(k===this.key)return false;this.key=k;this.P=[];
  [f0,f1].forEach((f,s)=>{if(f==null)return;for(let i=0;i<11;i++){const h=hom(f,i);this.P.push({s,k:i,l:h.l,wl:h.wl,wide:h.wide,hx:h.hx,hy:h.hy,x:0,y:0,vx:0,vy:0,fx:s?-1:1,fy:0,off:false,cool:0,hold:0,wait:20,tg:null})}});this.hardRest();return true}
 setTac(s,t){this.T[s]=t}
 hp(p){return{x:X0+(p.s?1-p.hx:p.hx)*FW,y:Y0+p.hy*FH}}
 tg(p,x,y){if(p)p.tg={x:clamp(x,X0+R,X0+FW-R),y:clamp(y,Y0+R,Y0+FH-R)}}
 clr(){this.P.forEach(p=>{p.tg=null;p.vmx=0})}
 rest(){const S=this,B=S.B;S.sc=null;S.fx=null;S.freeze=0;S.runner=null;S.prev=null;S.counter=null;S.build=null;S.trail=[];S.link=null;S.shot=null;S.run=null;S.clr();S.P.forEach(p=>{const h=S.hp(p);p.x=h.x;p.y=h.y;p.vx=p.vy=0;p.cool=0;p.hold=0});B.x=W/2;B.y=H/2;B.vx=B.vy=0;B.free=false;B.own=null;B.recv=null}
 hardRest(){this.q=[];this.gap=0;this.rest()}
 kickoff(side){const S=this,B=S.B;S.rest();const o=S.P.find(p=>p.s==side&&p.k==10&&!p.off)||S.P.find(p=>!p.off);if(!o)return;o.x=W/2+(o.s?14:-14);o.y=H/2;B.own=o;S.poss=o.s;o.hold=0;o.wait=24}
 setOff(s,list){this.P.forEach(p=>{if(p.s!==s)return;const off=!!(list&&list.includes(p.k));if(off&&this.B.own===p)this.B.own=null;p.off=off})}
 geo(as){return{gx:as?X0:X0+FW,dir:as?-1:1,ds:1-as}}
 near(arr,pt){return arr.reduce((b,p)=>!b||dist(p,pt)<dist(b,pt)?p:b,null)}
 psp(d){return clamp(d/24,3.8,6.2)*this.fs}
 kick(tx,ty,sp,recv,cv){const S=this,B=S.B,dx=tx-B.x,dy=ty-B.y,d=Math.hypot(dx,dy)||1;S.tr.push({x0:B.x,y0:B.y,x1:tx,y1:ty,n:S.n});if(S.tr.length>6)S.tr.shift();S.passes++;S.link=B.own&&recv?{a:B.own,b:recv,n:S.n}:null;
  if(B.own){B.own.cool=14;S.prev=B.own;B.x+=dx/d*(R+BR+1);B.y+=dy/d*(R+BR+1)}const c=cv===undefined?(d>90?(rnd()<.5?-1:1)*(.006+rnd()*.01):0):cv,ang=Math.atan2(dy,dx)-c*(d/sp)/2;B.vx=Math.cos(ang)*sp;B.vy=Math.sin(ang)*sp;B.cv=c;B.own=null;B.recv=recv||null}
 kickAt(q,sp,lead){const B=this.B,d=dist(q,B),t=d/sp,l=lead||.7;this.kick(q.x+q.vx*t*l,q.y+q.vy*t*l,sp,q)}
 setCtx(min,sc){this.ctx={min,sc}}
 setYel(s,list){this.P.forEach(p=>{if(p.s===s)p.yel=!!(list&&list.includes(p.k))})}
 mode(s){const c=this.ctx,lead=c.sc[s]-c.sc[1-s];return c.min<=0?'normal':lead>0&&c.min>=70?'protect':((lead<0&&c.min>=65)||(lead==0&&c.min>=85))?'chase':'normal'}
 hold(p){const m=this.mode(p.s);return m=='protect'?48+Math.floor(rnd()*40):m=='chase'?12+Math.floor(rnd()*14):20+Math.floor(rnd()*24)}
 markShot(k,x,y){const B=this.B;this.shot={x0:B.x,y0:B.y,x1:x,y1:y,n:this.n,k}}
 won(d,o){const S=this,B=S.B;o.cool=18;B.own=d;B.recv=null;d.hold=0;d.wait=24+Math.floor(rnd()*20);S.checkCounter(d)}
 checkCounter(p){const S=this,B=S.B;if(S.sc)return;const u=p.s?1-(B.x-X0)/FW:(B.x-X0)/FW,tt=S.T[p.s];if(u<.6&&S.P.some(q=>q.s==p.s&&q.wide&&!q.off)&&(tt[2]==1||(tt[0]>=1&&rnd()<.5)||rnd()<.25)){S.counter={s:p.s,t:S.n+170};S.counterN=(S.counterN||0)+1}}
 pass(o){const S=this,opp=S.P.filter(q=>q.s!==o.s&&!q.off),dir=o.s?-1:1,tt=S.T[o.s],fw0=[.35,.55,.85][tt[0]],press=opp.some(z=>dist(z,o)<32);if(o.k==0&&!(S.build&&S.build.s===o.s&&S.n<S.build.t)){S.build={s:o.s,t:S.n+280};S.buildN=(S.buildN||0)+1}
  const build=!!(S.build&&S.build.s===o.s&&S.n<S.build.t)&&!press,cnt=!!(S.counter&&S.counter.s===o.s&&S.n<S.counter.t),md=S.mode(o.s),fwE=md=='protect'?-.12:md=='chase'?fw0*1.5:build?.2:cnt?fw0*1.5:fw0;let best=null,bs=-1e9;
  for(const q of S.P){if(q===o||q.s!==o.s||q.off)continue;const d=dist(q,o);if(d<45||d>(cnt||press?420:340))continue;
   const open=Math.min(220,...opp.map(z=>dist(z,q))),lane=Math.min(120,...opp.map(z=>segD(o,q,z))),fw=dir*(q.x-o.x);
   let sc=fw*fwE+open*.5+lane*1.2-d*.2+(q.k==0?-120:0)+(press?-fw*.25:0)+rnd()*45;
   if(fw>110&&lane>45)sc+=30;                                   // pase entre líneas
   if(tt[2])sc+=Math.abs(q.y-H/2)*.12;if(build){if(d>200)sc-=(d-200)*1.3;sc+=q.l<=2?25:-25}else if(!cnt&&!press&&d>280)sc-=(d-280)*.9;if(cnt&&q.wide&&fw>80)sc+=55;if(md=='protect'){sc+=lane*.6;if(d>200)sc-=(d-200)*.8}if(md=='chase'&&d>280)sc+=(d-280)*.3;if(q.k==0&&press&&(o.s?1-(o.x-X0)/FW:(o.x-X0)/FW)<.4)sc+=140;if(S.run&&q===S.run.p&&S.n<S.run.t&&lane>35)sc+=95;                          // juego por las bandas
   if(S.runner&&q===S.runner.p&&S.n<S.runner.t)sc+=60+tt[0]*30; // pared / triangulación
   if(sc>bs){bs=sc;best=q}}
  if(!best){S.B.own=o;S.kick(clamp(o.x+dir*200,X0,X0+FW),clamp(o.y+(rnd()-.5)*200,Y0,Y0+FH),6,null);return}
  S.kickAt(best,clamp(dist(best,o)/30,3.6,5.8)*(cnt?1.2:1),S.run&&S.run.p===best&&S.n<S.run.t?1.5:.7)}
 event(e,as){const S=this,n=S.q.length;if(!S.P.length||S.frozen||(as==1&&S.P.length<22))return;
  if((n>=3&&e.k=='lat')||(n>=4&&(e.k=='foul'||(e.k=='att'&&(e.x=='l'||e.x=='o')))))return;if(n>=7&&e.x!='g')return;S.q.push({e,as})}
 begin(){const S=this,it=S.q.shift(),e=it.e,as=it.as;S.clr();S.B.free=false;S.poss=as;S.fs=1+Math.min(.5,S.q.length*.15);
  if(e.k=='att')S.attSc(e,as);else if(e.k=='foul')S.foulSc(e,as);else if(e.k=='fk')S.fkSc(e,as);else if(e.k=='pen')S.penSc(e,as);else if(e.k=='cor')S.corSc(e,as);else if(e.k=='lat')S.latSc(e,as)}
 endSc(){this.sc=null;this.clr();this.gap=14}
 attSc(e,as){const S=this,P=S.P,B=S.B,ch=e.ch.map(k=>P.find(p=>p.s==as&&p.k==k)).filter(p=>p&&!p.off);if(!ch.length)return;
  S.sc={k:'att',e,side:as,ch,i:0,x:e.x,t:0,tk:0,ph:'c',wait:ch[0],in:false};S.kickAt(ch[0],clamp(dist(ch[0],B)/30,4.4,7)*S.fs)}
 finish(){const S=this,sc=S.sc,B=S.B,as=sc.side,o0=B.own;
  // un remate solo sale del último cuarto de cancha: si el cierre de la jugada está más atrás, el jugador conduce hasta ahí
  if(sc.x!='l'&&o0&&!sc.adv){const u=as?1-(o0.x-X0)/FW:(o0.x-X0)/FW;if(u<.78){sc.adv=true;sc.ph='adv';sc.shooter=o0;sc.tk=sc.t;S.tg(o0,X0+(as?1-.9:.9)*FW,o0.y+(H/2-o0.y)*.45);return}}
  const {gx,dir,ds}=S.geo(as),dg=S.P.filter(p=>p.s==ds&&!p.off),gk=dg.find(p=>p.k==0)||dg[0],fs=S.fs;sc.gk=gk;
  if(sc.x=='g'){const ty=H/2+(rnd()<.5?-1:1)*(18+rnd()*28);sc.ph='g';sc.wait=null;B.free=true;S.markShot('g',gx+dir*18,ty);S.kick(gx+dir*18,ty,8*fs,null,0);if(gk){S.tg(gk,gx-dir*8,ty-Math.sign(ty-H/2)*16);gk.vmx=2.6}}
  else if(sc.x=='s'){const ty=clamp(gk.y+(rnd()<.5?-1:1)*(16+rnd()*14),GY0+8,GY1-8),tx=gx-dir*10;sc.ph='s';sc.wait=gk;S.markShot('s',tx,ty);S.kick(tx,ty,7.2*fs,gk,0);S.tg(gk,tx,ty);gk.vmx=3.8}
  else if(sc.x=='o'){const ty=rnd()<.5?GY0-34:GY1+34;sc.ph='o';sc.wait=null;sc.t2=S.n;S.markShot('o',gx,ty);S.kick(gx,ty,7.6*fs,null,0)}
  else{const z=dg.filter(p=>p.k).reduce((b,p)=>!b||dist(p,B)<dist(b,B)?p:b,null)||gk;sc.ph='l';sc.wait=z;S.kickAt(z,5.2*fs)}}
 foulSc(e,as){const S=this,B=S.B;B.own=null;B.vx=B.vy=0;B.recv=null;S.sc={k:'foul',e,side:as,t:0,ph:'f',label:'FALTA'};S.fx={n:S.n,x:B.x,y:B.y}}
 fkSc(e,as){const S=this,{gx,dir,ds}=S.geo(as),P=S.P,B=S.B,ba={x:clamp(gx-dir*(110+rnd()*60),X0+40,X0+FW-40),y:H/2+(rnd()-.5)*200},
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
 latSc(e,as){const S=this,{dir}=S.geo(as),P=S.P,B=S.B,top=B.y<H/2,sp={x:clamp(B.x,X0+60,X0+FW-60),y:top?Y0+2:Y0+FH-2},at=P.filter(p=>p.s==as&&!p.off&&p.k>0),taker=S.near(at,sp),sg=top?1:-1;
  S.tg(taker,sp.x,sp.y+sg*8);const opts=at.filter(p=>p!==taker).sort((a,b)=>dist(a,sp)-dist(b,sp)).slice(0,3);opts.forEach((p,j)=>S.tg(p,sp.x+dir*(50+j*40),sp.y+sg*(70+j*35)));
  let i=0;P.forEach(p=>{if(p.s!==as&&!p.off&&p.k>0){const j=(i++)%3;S.tg(p,sp.x+dir*(60+j*35),sp.y+sg*(55+j*30))}});
  B.x=sp.x;B.y=sp.y+sg*6;B.vx=B.vy=0;B.own=null;B.recv=null;S.sc={k:'lat',e,side:as,ph:'set',t:0,taker,opts,label:'LATERAL'}}
 shotSp(){const S=this,sc=S.sc,B=S.B,{gx,dir}=S.geo(sc.side),gk=sc.gk,x=sc.x,sg=rnd()<.5?-1:1,fs=S.fs;B.own=null;
  if(sc.k=='pen'&&gk){gk.x=gx-dir*10;gk.y=H/2+(x=='g'?-sg:sg)*(x=='o'?0:30);gk.vx=gk.vy=0}   // el arquero se tira
  if(x=='g'){sc.ph='g';sc.wait=null;B.free=true;const ty=H/2+sg*(sc.k=='pen'?28:30+rnd()*8);S.markShot('g',gx+dir*18,ty);S.kick(gx+dir*18,ty,(sc.k=='pen'?8.6:8)*fs,null,0);if(gk&&sc.k=='fk'){S.tg(gk,gx-dir*8,ty-Math.sign(ty-H/2)*16);gk.vmx=2.6}}
  else if(x=='s'){sc.ph='s';sc.wait=gk;const ty=clamp((gk?gk.y:H/2)+(sc.k=='pen'?0:sg*(16+rnd()*14)),GY0+8,GY1-8),tx=gx-dir*10;S.markShot('s',tx,ty);S.kick(tx,ty,7.2*fs,gk,0);if(gk&&sc.k!='pen'){S.tg(gk,tx,ty);gk.vmx=3.8}}
  else if(x=='w'){const w=sc.wall[1]||sc.wall[0];sc.ph='w';sc.wait=w;S.markShot('w',w.x,w.y);S.kickAt(w,7.2*fs)}
  else{const ty=rnd()<.5?GY0-34:GY1+34;sc.ph='o';sc.t2=S.n;sc.wait=null;S.markShot('o',gx,ty);S.kick(gx,ty,7.6*fs,null,0)}}
 script(){const S=this,sc=S.sc,B=S.B,ph=sc.ph;sc.t++;
  if(sc.t>520){S.endSc();B.free=false;if(!B.own)B.own=S.P.find(p=>!p.off);return}
  if(ph=='g'){if(!sc.in&&(B.x<X0-4||B.x>X0+FW+4)){sc.in=true;sc.t2=S.n;S.goalN++;if(S.onGoal)S.onGoal(sc.side,sc.e.n,sc.e)}if(sc.in&&S.n-sc.t2>105)S.kickoff(1-sc.side);return}
  if(ph=='s'){if(B.own===sc.gk)S.endSc();return}
  if(ph=='o'){if(S.n-sc.t2>45||(sc.t>12&&Math.hypot(B.vx,B.vy)<.6)){B.own=sc.gk;B.free=false;S.endSc()}return}
  if(ph=='w'||ph=='l'){if(B.own===sc.wait)S.endSc();return}
  if(ph=='adv'){const o=sc.shooter;if(B.own===o){const u=sc.side?1-(o.x-X0)/FW:(o.x-X0)/FW;if(u>=.8||sc.t-sc.tk>220){o.tg=null;sc.ph='c';S.finish()}}else if(!B.own&&sc.t-sc.tk>40){B.own=o;o.hold=0}return}
  if(sc.k=='att'){if(B.own===sc.wait&&B.own.hold>=6){sc.i++;if(sc.i<sc.ch.length){sc.wait=sc.ch[sc.i];sc.tk=sc.t;S.kickAt(sc.wait,S.psp(dist(sc.wait,B)))}else S.finish()}
   else if(!B.own&&sc.t-sc.tk>70){B.own=sc.wait;sc.wait.hold=0}}
  else if(sc.k=='fk'||sc.k=='pen'){const T=sc.k=='fk'?[58,18,7]:[66,26,7];
   if(ph=='set'&&sc.t>=T[0]){sc.ph='wait';S.fx={n:S.n,x:sc.ba.x,y:sc.ba.y}}
   else if(ph=='wait'&&sc.t>=T[0]+T[1]){sc.ph='run';S.tg(sc.taker,sc.ba.x,sc.ba.y)}
   else if(ph=='run'&&sc.t>=T[0]+T[1]+T[2])S.shotSp()}
  else if(sc.k=='lat'){if(ph=='set'&&sc.t>=34){sc.ph='lt';sc.wait=sc.opts[0]||sc.taker;sc.tk=sc.t;S.kickAt(sc.wait,4.4*S.fs)}else if(ph=='lt'){if(B.own===sc.wait)S.endSc();else if(!B.own&&sc.t-sc.tk>70){B.own=sc.wait;sc.wait.hold=0}}}
  else if(sc.k=='cor'){
   if(ph=='set'&&sc.t>=52)sc.ph='wait';
   else if(ph=='wait'&&sc.t>=66){const tg=sc.box.length?sc.box[Math.floor(rnd()*sc.box.length)]:sc.taker;sc.tgt=tg;sc.ph='cx';sc.wait=tg;sc.tk=sc.t;S.kickAt(tg,5.6*S.fs)}
   else if(ph=='cx'){if(B.own===sc.tgt){const{gx,dir}=S.geo(sc.side);if(sc.x=='g'){sc.ph='g';sc.wait=null;B.free=true;B.own=null;const ty2=H/2+(rnd()-.5)*50;S.markShot('g',gx+dir*18,ty2);S.kick(gx+dir*18,ty2,8*S.fs,null,0)}else{S.kick(W/2,H/2+(rnd()-.5)*200,6.2*S.fs,null);S.endSc()}}
    else if(!B.own&&sc.t-sc.tk>70){B.own=sc.tgt;sc.tgt.hold=0}}}}
 step(){const S=this,B=S.B,P=S.P;S.n++;if(!P.length||S.frozen)return;
  if(!S.sc){if(S.gap>0)S.gap--;else if(S.q.length)S.begin()}
  if(S.sc&&S.sc.k=='foul'){const sc=S.sc;if(++sc.t>=30){const{dir}=S.geo(sc.side),c=S.near(P.filter(p=>p.s==sc.side&&!p.off&&p.k>0),B);if(c){c.x=clamp(B.x-dir*14,X0+R,X0+FW-R);c.y=B.y;B.own=c;c.hold=0;c.wait=18}S.endSc()}return}
  if(S.sc)S.script();if(S.sc&&S.sc.ph=='g'&&S.sc.in)return;
  const bnx=(B.x-X0)/FW,bny=(B.y-Y0)/FH,near=[null,null],nd=[1e9,1e9];
  P.forEach(p=>{if(p.off||p.k==0)return;const d=dist(p,B);if(d<nd[p.s]){nd[p.s]=d;near[p.s]=p}});
  const LL=[0,1].map(s=>{const o=P.filter(z=>z.s!==s&&!z.off&&z.k>0);return o.length?(s?Math.min(...o.map(z=>z.x)):Math.max(...o.map(z=>z.x))):null});
  P.forEach(p=>{if(p.off)return;let tx,ty,vm=p.l==0?1.5:1.9;const tt=S.T[p.s];
   if(p.k==0){const gx0=p.s?X0+FW:X0,vx0=B.x-gx0,vy0=B.y-H/2,L0=Math.hypot(vx0,vy0)||1,rival=B.own&&B.own.s!==p.s,adv=rival?clamp((FW*.34-L0)*.3,0,64):0;   // achica cuando el rival se acerca
     tx=gx0+vx0/L0*(11+adv);ty=clamp(H/2+vy0/L0*(11+adv)*.9,GY0-8,GY1+8);vm=2.4;
     if(!B.own&&!S.sc&&dist(p,B)<150&&dist(p,B)<nd[1-p.s]){tx=B.x;ty=B.y;vm=2.8}}   // sale a cortar balones largos y pases al vacío
   else{const att=S.poss==p.s,bu=p.s?1-bnx:bnx,wl=p.wl,adv=[.85,1,1.2][tt[0]];
    let ux=att?p.hx+wl*(bu*.55*adv-.08):p.hx+wl*(bu-.55)*.35+wl*(([-.04,0,.05][tt[1]])-(tt[0]==0?.04:0));ux=clamp(ux+wl*(S.mode(p.s)=='protect'?-.07:S.mode(p.s)=='chase'?.06:0),.05,p.l==3?.93:.85);
    let uy=clamp(p.hy+(bny-p.hy)*.3*Math.min(1,wl+.25),.05,.95);if(att&&tt[2]&&p.l>=2)uy=clamp(uy+(p.hy<.5?-1:1)*.16,.06,.94);
    tx=X0+(p.s?1-ux:ux)*FW;ty=Y0+uy*FH;
    if(S.counter&&S.counter.s===p.s&&S.n<S.counter.t&&att&&p.l>=2&&B.own!==p){const u2=p.wide?.82:.76;tx=X0+(p.s?1-u2:u2)*FW;if(p.wide)ty=Y0+(p.hy<.5?.1:.9)*FH;vm=2.6}
    if(att&&B.own&&B.own!==p&&B.own.s===p.s&&(p.l==3||p.wide)&&!p.tg&&LL[p.s]!=null){
     if(p.runUntil>S.n){tx=LL[p.s]+(p.s?-1:1)*38;ty=Y0+Math.max(.1,Math.min(.9,p.hy+(.5-p.hy)*.25))*FH;vm=2.8;S.run={p,t:p.runUntil}}      // pica al vacío, a la espalda de la defensa
     else if(S.n>(p.runCool||0)&&B.own.hold>6&&rnd()<.012&&(p.s?p.x>LL[1]+10:p.x<LL[0]-10)&&dist(B.own,p)>60){p.runUntil=S.n+55;p.runCool=S.n+170;S.runN=(S.runN||0)+1}}
    if(B.own===p){tx=p.x+p.fx*40;ty=p.y+p.fy*40;vm=1.8;if(S.mode(p.s)=='protect'&&bu>.55){tx=X0+(p.s?.05:.95)*FW;ty=p.y<H/2?Y0+36:Y0+FH-36;vm=1.5}}   // si va ganando, conduce al córner y aguanta
    else if(B.recv===p||(S.sc&&S.sc.wait===p)){tx=B.x+B.vx*10;ty=B.y+B.vy*10;vm=3}
    else if(S.runner&&S.runner.p===p&&S.n<S.runner.t&&B.own&&B.own.s===p.s){const o=B.own,d=p.s?-1:1;tx=clamp(o.x+d*80,X0,X0+FW);ty=o.y+(H/2-o.y)*.3+(p.y<o.y?-25:25)}
    else if(near[p.s]===p&&(!B.own||B.own.s!==p.s)){if(p.yel&&B.own){tx=B.x+(p.s?1:-1)*30;ty=B.y;vm=2}else{tx=B.x+B.vx*6;ty=B.y+B.vy*6;vm=2.4}}
    else if(att&&B.own&&B.own!==p&&p.l>=2)tx+=(p.s?-1:1)*30}
   if(p.tg){tx=p.tg.x;ty=p.tg.y;vm=p.vmx||2.7}
   const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy)||1,sp=Math.min(vm,d*.1);p.vx+=(dx/d*sp-p.vx)*.2;p.vy+=(dy/d*sp-p.vy)*.2;
   p.x=clamp(p.x+p.vx,X0+R,X0+FW-R);p.y=clamp(p.y+p.vy,Y0+R,Y0+FH-R);if(p.cool>0)p.cool--;
   if(B.own===p){const gx=p.s?X0:X0+FW,ax=gx-p.x,ay=(H/2-p.y)*.6,al=Math.hypot(ax,ay)||1;p.fx=ax/al;p.fy=ay/al}
   else{const v=Math.hypot(p.vx,p.vy);if(v>.3){p.fx=p.vx/v;p.fy=p.vy/v}}});
  for(let i=0;i<P.length;i++){const a=P[i];if(a.off)continue;for(let j=i+1;j<P.length;j++){const b=P[j];if(b.off)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
   if(d<R*1.8&&d>.01){const f=(R*1.8-d)/2/d;a.x-=dx*f*.5;a.y-=dy*f*.5;b.x+=dx*f*.5;b.y+=dy*f*.5}}}
  if(B.own){const o=B.own;if(o.off)B.own=null;else{const tx0=o.x+o.fx*(R+BR),ty0=o.y+o.fy*(R+BR),kk=o.hold<8?.4:1;B.x+=(tx0-B.x)*kk;B.y+=(ty0-B.y)*kk;B.vx=B.vy=0;B.cv=0;S.poss=o.s;o.hold++;if(!S.sc){const dd=S.near(P.filter(z=>z.s!==o.s&&!z.off&&z.k>0&&z.cool<=0),o);if(dd&&dist(dd,o)<R*2.3){const t2=S.T[dd.s];if(rnd()<.006*(t2[0]==0?1.8:t2[0]==2?.8:1)*[.8,1,1.35][t2[1]]*(dd.yel?.25:1)){S.won(dd,o);S.tackles=(S.tackles||0)+1;return}}if(o.hold>o.wait){S.pass(o);o.wait=S.hold(o)}}}}
  else{if(B.cv){const cc=Math.cos(B.cv),ss=Math.sin(B.cv),nvx=B.vx*cc-B.vy*ss;B.vy=B.vx*ss+B.vy*cc;B.vx=nvx}B.x+=B.vx;B.y+=B.vy;B.vx*=.985;B.vy*=.985;const mouth=B.y>GY0&&B.y<GY1;
   if(B.y<Y0+BR){B.y=Y0+BR;B.vy=Math.abs(B.vy)*.7}if(B.y>Y0+FH-BR){B.y=Y0+FH-BR;B.vy=-Math.abs(B.vy)*.7}
   if(B.x<X0+BR&&!(B.free&&mouth)){B.x=X0+BR;B.vx=Math.abs(B.vx)*.7}if(B.x>X0+FW-BR&&!(B.free&&mouth)){B.x=X0+FW-BR;B.vx=-Math.abs(B.vx)*.7}
   if(B.free){if(B.x<X0-24){B.x=X0-24;B.vx=0}if(B.x>X0+FW+24){B.x=X0+FW+24;B.vx=0}}
   for(const p of P){if(p.off||p.cool>0)continue;if(dist(p,B)>=R+BR+1)continue;
    if(S.sc&&S.sc.wait!==p)continue;if(S.sc&&S.sc.ph=='g')continue;
    if(B.recv!==p&&!S.sc&&Math.hypot(B.vx,B.vy)>4.8&&rnd()<.35)continue;
    if(!S.sc&&S.prev&&S.prev!==p&&S.prev.s===p.s&&S.prev.k>0)S.runner={p:S.prev,t:S.n+60};
    const was=S.poss;B.own=p;B.recv=null;B.free=false;p.hold=0;p.wait=S.hold(p);if(was!==p.s&&!S.sc)S.checkCounter(p);break}}
  {const dx=B.x-(S.lbx===undefined?B.x:S.lbx),dy=B.y-(S.lby===undefined?B.y:S.lby),dd=Math.hypot(dx,dy);B.rot=(B.rot||0)+dd/BR;S.lbx=B.x;S.lby=B.y;if(dd>.6)S.trail.push({x:B.x,y:B.y,n:S.n});while(S.trail.length&&S.n-S.trail[0].n>22)S.trail.shift()}}
}
const API={Sim,W,H,X0,Y0,FW,FH,GY0,GY1,R,BR};if(typeof module!=='undefined')module.exports=API;else window.SIM2D=API;
})();
