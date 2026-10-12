// Física 2D tipo Haxball: fichas con aceleración y fricción, pelota con rebotes, pases lógicos (pared, entre líneas) y formación que se mueve en bloque.
// El servidor decide qué pasa; acá se "actúan" sus jugadas (ataques, tiros libres, penales, córners, faltas) sobre la física.
(function(){
const W=720,H=440,X0=20,Y0=20,FW=W-40,FH=H-40,GY0=H/2-48,GY1=H/2+48,R=13,BR=6,rnd=Math.random,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),
GEO=[[[1,.06,0],[4,.21,.5],[4,.37,.85],[2,.49,1]],[[1,.06,0],[4,.21,.5],[3,.37,.85],[3,.49,1]],[[1,.06,0],[3,.21,.5],[5,.37,.85],[2,.49,1]],[[1,.06,0],[4,.21,.5],[5,.37,.85],[1,.49,1]],[[1,.06,0],[5,.21,.5],[3,.37,.85],[2,.49,1]],
 [[1,.06,0],[4,.21,.5],[2,.32,.7],[3,.43,.9],[1,.49,1]],[[1,.06,0],[4,.21,.5],[2,.32,.7],[2,.43,.9],[2,.49,1]],[[1,.06,0],[3,.21,.5],[4,.37,.85],[3,.49,1]],[[1,.06,0],[5,.21,.5],[4,.37,.85],[1,.49,1]],
 [[1,.06,0],[4,.21,.5],[3,.36,.8],[1,.43,.95],[2,.49,1]],[[1,.06,0],[4,.21,.5],[1,.31,.65],[4,.42,.9],[1,.49,1]],[[1,.06,0],[4,.21,.5],[4,.36,.85],[1,.44,.95],[1,.49,1]],[[1,.06,0],[3,.21,.5],[4,.34,.8],[2,.43,.95],[1,.49,1]],[[1,.06,0],[5,.21,.5],[2,.35,.75],[3,.49,1]]];
const hom=(f,k)=>{const G=GEO[f];let c=0;for(let i=0;i<G.length;i++){const[n,x,w]=G[i];if(k<c+n){const l=i==0?0:i==G.length-1?3:i==1?1:2,hy=(k-c+1)/(n+1);return{l,wl:w,hx:x,hy,wide:l>=2&&Math.abs(hy-.5)>.22,fb:l==1&&G[1][0]>=4&&(hy<.3||hy>.7),piv:i==2&&G.length>=4&&(n<=2||Math.abs(hy-.5)<.12)}}c+=n}};
const segD=(a,b,c)=>{const dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy||1,t=clamp(((c.x-a.x)*dx+(c.y-a.y)*dy)/L,0,1);return Math.hypot(a.x+dx*t-c.x,a.y+dy*t-c.y)};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
class Sim{
 constructor(){this.P=[];this.B={x:W/2,y:H/2,vx:0,vy:0,own:null,recv:null,free:false};this.poss=0;this.sc=null;this.key=null;this.n=0;this.tr=[];this.passes=0;this.q=[];this.frozen=true;this.T=[[1,0,0],[1,0,0]];this.fx=null;this.goalN=0;this.onGoal=null;this.gap=0;this.fs=1;this.prev=null;this.runner=null;this.freeze=0;this.trail=[];this.ctx={min:0,sc:[0,0]};this.link=null;this.shot=null;this.run=null;this.vs=.9;this.refs=null;this.fbSide=[0,0]}
 setup(f0,f1,key){const k=key+'|'+f0+'|'+f1;if(k===this.key)return false;this.key=k;this.P=[];
  [f0,f1].forEach((f,s)=>{if(f==null)return;for(let i=0;i<11;i++){const h=hom(f,i);this.P.push({s,k:i,l:h.l,wl:h.wl,wide:h.wide,fb:h.fb,piv:h.piv,hy0:h.hy,hx:h.hx,hy:h.hy,x:0,y:0,vx:0,vy:0,fx:s?-1:1,fy:0,off:false,cool:0,hold:0,wait:20,tg:null})}});this.hardRest();return true}
 setTac(s,t){this.T[s]=t}
 hp(p){return{x:X0+(p.s?1-p.hx:p.hx)*FW,y:Y0+p.hy*FH}}
 tg(p,x,y){if(p)p.tg={x:clamp(x,X0+R,X0+FW-R),y:clamp(y,Y0+R,Y0+FH-R)}}
 clr(){this.P.forEach(p=>{p.tg=null;p.vmx=0})}
 rest(){const S=this,B=S.B;S.sc=null;S.fx=null;S.freeze=0;S.runner=null;S.prev=null;S.counter=null;S.build=null;S.trail=[];S.link=null;S.shot=null;S.run=null;S.clr();S.offs=null;S.refs=[{x:W/2,y:H/2+40,role:'ref'},{x:W/2,y:Y0-9,role:'l1'},{x:W/2,y:Y0+FH+9,role:'l2'}];S.P.forEach(p=>{p.hy=p.hy0;p.swpT=0;const h=S.hp(p);p.x=h.x;p.y=h.y;p.vx=p.vy=0;p.cool=0;p.hold=0});B.x=W/2;B.y=H/2;B.vx=B.vy=0;B.free=false;B.own=null;B.recv=null}
 hardRest(){this.q=[];this.gap=0;this.rest()}
 kickoff(side){const S=this,B=S.B;S.rest();const o=S.P.find(p=>p.s==side&&p.k==10&&!p.off)||S.P.find(p=>!p.off);if(!o)return;o.x=W/2+(o.s?14:-14);o.y=H/2;B.own=o;S.poss=o.s;o.hold=0;o.wait=24}
 setOff(s,list){this.P.forEach(p=>{if(p.s!==s)return;const off=!!(list&&list.includes(p.k));if(off&&this.B.own===p)this.B.own=null;p.off=off})}
 geo(as){return{gx:as?X0:X0+FW,dir:as?-1:1,ds:1-as}}
 near(arr,pt){return arr.reduce((b,p)=>!b||dist(p,pt)<dist(b,pt)?p:b,null)}
 psp(d){return clamp(d/24,3.8,6.2)*this.fs}
 kick(tx,ty,sp,recv,cv){const S=this,B=S.B;sp*=S.vs;const dx=tx-B.x,dy=ty-B.y,d=Math.hypot(dx,dy)||1;S.tr.push({x0:B.x,y0:B.y,x1:tx,y1:ty,n:S.n});if(S.tr.length>6)S.tr.shift();S.passes++;S.link=B.own&&recv?{a:B.own,b:recv,n:S.n}:null;
  if(B.own){B.own.cool=14;S.prev=B.own;B.x+=dx/d*(R+BR+1);B.y+=dy/d*(R+BR+1)}const c=cv===undefined?(d>90?(rnd()<.5?-1:1)*(.006+rnd()*.01):0):cv,ang=Math.atan2(dy,dx)-c*(d/sp)/2;B.vx=Math.cos(ang)*sp;B.vy=Math.sin(ang)*sp;B.cv=c;B.own=null;B.recv=recv||null}
 kickAt(q,sp,lead){const B=this.B,d=dist(q,B),t=d/sp,l=lead||.7;this.kick(q.x+q.vx*t*l,q.y+q.vy*t*l,sp,q)}
 setCtx(min,sc){this.ctx={min,sc}}
 setYel(s,list){this.P.forEach(p=>{if(p.s===s)p.yel=!!(list&&list.includes(p.k))})}
 mode(s){const c=this.ctx,lead=c.sc[s]-c.sc[1-s];return c.min<=0?'normal':lead>0&&c.min>=70?'protect':((lead<0&&c.min>=65)||(lead==0&&c.min>=85))?'chase':'normal'}
 hold(p){const m=this.mode(p.s),k=[1.2,1,.85][this.T[p.s][0]];if(p.k==0&&m!='chase')return 55+Math.floor(rnd()*40);return Math.round((m=='protect'?48+Math.floor(rnd()*40):m=='chase'?12+Math.floor(rnd()*14):20+Math.floor(rnd()*24))*k)}   // el arquero se toma su tiempo; los equipos defensivos juegan más cortado
 markShot(k,x,y){const B=this.B;this.shot={x0:B.x,y0:B.y,x1:x,y1:y,n:this.n,k}}
 won(d,o){const S=this,B=S.B;o.cool=18;B.own=d;B.recv=null;d.hold=0;d.wait=24+Math.floor(rnd()*20);S.checkCounter(d)}
 checkCounter(p){const S=this,B=S.B;if(S.sc||(S.counter&&S.n<S.counter.t+120))return;const u=p.s?1-(B.x-X0)/FW:(B.x-X0)/FW,tt=S.T[p.s];if(u<.6&&S.P.some(q=>q.s==p.s&&q.wide&&!q.off)&&(tt[2]==1||(tt[0]>=1&&rnd()<.5)||rnd()<.25||(S.T[1-p.s][0]==2&&rnd()<.35))){S.counter={s:p.s,t:S.n+170};S.counterN=(S.counterN||0)+1}}
 pass(o){const S=this,opp=S.P.filter(q=>q.s!==o.s&&!q.off),dir=o.s?-1:1,tt=S.T[o.s],fw0=[.35,.55,.85][tt[0]],press=opp.some(z=>dist(z,o)<32);const uo=o.s?1-(o.x-X0)/FW:(o.x-X0)/FW;
  const sal=tt[3]||0,upf=q=>q.fb&&(tt[0]==2||(tt[0]==1&&((q.hy0<.5)==(S.fbSide[o.s]==0))));
  if(((o.fb&&upf(o))||(o.wide&&tt[0]>0))&&uo>.62&&Math.abs(o.y-H/2)>FH*.24&&rnd()<.9){const bx=S.P.filter(q=>q.s===o.s&&!q.off&&q!==o&&q.k>0&&(q.s?1-(q.x-X0)/FW:(q.x-X0)/FW)>.66&&Math.abs(q.y-H/2)<95);if(bx.length){S.cross(o,bx[Math.floor(rnd()*bx.length)]);return}}   // lateral llegador: centro al área
  if(o.k==0&&!(S.build&&S.build.s===o.s&&S.n<S.build.t)){S.build={s:o.s,t:S.n+280};S.buildN=(S.buildN||0)+1}
  const build=!!(S.build&&S.build.s===o.s&&S.n<S.build.t)&&!press,cnt=!!(S.counter&&S.counter.s===o.s&&S.n<S.counter.t),md=S.mode(o.s),outl=o.k==0||(build&&uo<.3),fwE=md=='protect'?-.12:md=='chase'?fw0*1.5:build?.2:cnt?fw0*1.5:fw0;let best=null,bs=-1e9;
  if(outl&&sal==2&&!press){const nine=S.P.filter(q=>q.s==o.s&&q.l==3&&!q.off).sort((a,b)=>Math.abs(a.y-H/2)-Math.abs(b.y-H/2))[0];if(nine){S.longTo(o,nine);return}}   // salida directa: pelotazo al 9
  for(const q of S.P){if(q===o||q.s!==o.s||q.off)continue;const d=dist(q,o);if(d<45||d>(cnt||press?420:340))continue;
   const open=Math.min(220,...opp.map(z=>dist(z,q))),lane=Math.min(120,...opp.map(z=>segD(o,q,z))),fw=dir*(q.x-o.x);
   let sc=fw*fwE+open*.5+lane*1.2-d*.2+(q.k==0?-120:0)+(press?-fw*.25:0)+rnd()*45;
   if(fw>110&&lane>45)sc+=30;                                   // pase entre líneas
   if(tt[2])sc+=Math.abs(q.y-H/2)*.12;if(build){if(d>200)sc-=(d-200)*1.3;sc+=q.l<=2?25:-25}else if(!cnt&&!press&&d>280)sc-=(d-280)*.9;if(cnt&&q.wide&&fw>80)sc+=55;if(q.fb&&(q.s?1-(q.x-X0)/FW:(q.x-X0)/FW)>.6&&lane>40)sc+=75;if(md=='protect'){sc+=lane*.6;if(d>200)sc-=(d-200)*.8}if(md=='chase'&&d>280)sc+=(d-280)*.3;if(q.k==0&&press&&(o.s?1-(o.x-X0)/FW:(o.x-X0)/FW)<.4)sc+=140;if(S.run&&q===S.run.p&&S.n<S.run.t&&lane>35)sc+=95;                          // juego por las bandas
   if(S.runner&&q===S.runner.p&&S.n<S.runner.t)sc+=60+tt[0]*30; // pared / triangulación
   if(outl&&sal==0){if(d>230)sc-=(d-230)*2;sc+=(q.l==1&&!q.fb)?55:q.piv?45:q.fb?20:-30}if(outl&&sal==1){sc+=(q.l==2&&Math.abs(q.y-H/2)<115)?60:q.piv?30:-10}if(q.piv&&(press||build||md=='protect'))sc+=35;if(!press&&!cnt&&!build&&md=='normal'&&Math.abs(q.y-o.y)>FH*.45&&d>250&&lane>45)sc+=42;   // salida, el 5 y cambio de frente
   if(sc>bs){bs=sc;best=q}}
  if(!best){S.B.own=o;S.kick(clamp(o.x+dir*200,X0,X0+FW),clamp(o.y+(rnd()-.5)*200,Y0,Y0+FH),6,null);return}
  const dd2=dist(best,o),sp2=clamp(dd2/30,3.6,5.8)*(cnt?1.2:1)*[.92,1,1.06][tt[0]];if(Math.abs(best.y-o.y)>FH*.42&&dd2>240){S.crossT=S.n;S.crossD=dd2/(sp2*S.vs);S.switchN=(S.switchN||0)+1}
  S.kickAt(best,sp2,S.run&&S.run.p===best&&S.n<S.run.t?1.5:.7)}
 event(e,as){const S=this,n=S.q.length;if(!S.P.length||S.frozen||(as==1&&S.P.length<22))return;
  if((n>=3&&e.k=='lat')||(n>=4&&(e.k=='foul'||(e.k=='att'&&(e.x=='l'||e.x=='o'||e.x=='f')))))return;if(n>=7&&e.x!='g')return;S.q.push({e,as})}
 begin(){const S=this,it=S.q.shift(),e=it.e,as=it.as;S.clr();S.B.free=false;S.poss=as;S.fs=1+Math.min(.5,S.q.length*.15);
  if(e.k=='att')S.attSc(e,as);else if(e.k=='foul')S.foulSc(e,as);else if(e.k=='fk')S.fkSc(e,as);else if(e.k=='pen')S.penSc(e,as);else if(e.k=='cor')S.corSc(e,as);else if(e.k=='lat')S.latSc(e,as)}
 endSc(){this.sc=null;this.clr();this.gap=14}
 attSc(e,as){const S=this,P=S.P,B=S.B,ch=e.ch.map(k=>P.find(p=>p.s==as&&p.k==k)).filter(p=>p&&!p.off);if(!ch.length)return;
  S.sc={k:'att',e,side:as,ch,i:0,x:e.x,t:0,tk:0,ph:'c',wait:ch[0],in:false};S.kickAt(ch[0],clamp(dist(ch[0],B)/30,4.4,7)*S.fs)}
 finish(){const S=this,sc=S.sc,B=S.B,as=sc.side,o0=B.own;
  if(sc.x=='f'){S.offsideEnd();return}
  // un remate solo sale del último cuarto de cancha: si el cierre de la jugada está más atrás, el jugador conduce hasta ahí
  if(sc.x!='l'&&o0&&!sc.adv){const u=as?1-(o0.x-X0)/FW:(o0.x-X0)/FW;if(u<.78){sc.adv=true;sc.ph='adv';sc.shooter=o0;sc.tk=sc.t;S.tg(o0,X0+(as?1-.9:.9)*FW,o0.y+(H/2-o0.y)*.45);return}}
  const {gx,dir,ds}=S.geo(as),dg=S.P.filter(p=>p.s==ds&&!p.off),gk=dg.find(p=>p.k==0)||dg[0],fs=S.fs;sc.gk=gk;
  if(sc.x=='g'){const ty=H/2+(rnd()<.5?-1:1)*(18+rnd()*28);sc.ph='g';sc.wait=null;B.free=true;S.markShot('g',gx+dir*18,ty);S.kick(gx+dir*18,ty,8*fs,null,0);if(gk){S.tg(gk,gx-dir*8,ty-Math.sign(ty-H/2)*16);gk.vmx=2.6}}
  else if(sc.x=='s'){const ty=clamp(gk.y+(rnd()<.5?-1:1)*(16+rnd()*14),GY0+8,GY1-8),tx=gx-dir*10;sc.ph='s';sc.wait=gk;S.markShot('s',tx,ty);S.kick(tx,ty,7.2*fs,gk,0);S.tg(gk,tx,ty);gk.vmx=3.8}
  else if(sc.x=='o'){const ty=rnd()<.5?GY0-34:GY1+34;sc.ph='o';sc.wait=null;sc.t2=S.n;S.markShot('o',gx,ty);S.kick(gx,ty,7.6*fs,null,0)}
  else{const z=dg.filter(p=>p.k).reduce((b,p)=>!b||dist(p,B)<dist(b,B)?p:b,null)||gk;sc.ph='l';sc.wait=z;S.kickAt(z,5.2*fs)}}
 reach(p,pt,tol,t0,lim,sc){if(dist(p,pt)<=tol)return true;if(sc.t-t0>lim){p.x=pt.x;p.y=pt.y;p.vx=p.vy=0;return true}return false}   // el ejecutante tiene que estar en la pelota (si tarda de más, se lo ubica)
 offsideEnd(){const S=this,sc=S.sc,as=sc.side,ds=1-as,o=S.B.own||sc.wait,df=S.P.filter(p=>p.s==ds&&!p.off&&p.k>0),lx=df.length?(as?Math.min(...df.map(p=>p.x)):Math.max(...df.map(p=>p.x))):S.B.x;S.offs={x:lx,n:S.n,p:o};S.offN=(S.offN||0)+1;S.clr();S.foulSc({},ds,'FUERA DE JUEGO')}
 cross(o,q){const S=this,d=dist(o,q),sp=clamp(d/26,4,5.6);S.crossT=S.n;S.crossD=d/sp;S.crossN=(S.crossN||0)+1;S.kickAt(q,sp,1.1)}
 longTo(o,q){const S=this,d=dist(o,q),sp=clamp(d/24,4.6,6.4);S.crossT=S.n;S.crossD=d/(sp*S.vs);S.directN=(S.directN||0)+1;S.counter={s:o.s,t:S.n+150};S.kickAt(q,sp,1.1)}
 stepRefs(){const S=this,B=S.B,P=S.P,lm=[0,1].map(s=>{const o=P.filter(z=>z.s===s&&!z.off&&z.k>0);return o.length?(s?Math.max(...o.map(z=>z.x)):Math.min(...o.map(z=>z.x))):W/2}),[r,l1,l2]=S.refs;
  r.tx=clamp(B.x*.85+W/2*.15,X0+30,X0+FW-30);r.ty=clamp(B.y+(B.y<H/2?34:-34),Y0+20,Y0+FH-20);l1.tx=clamp(lm[0],X0+20,W/2+90);l1.ty=Y0-9;l2.tx=clamp(lm[1],W/2-90,X0+FW-20);l2.ty=Y0+FH+9;S.refs.forEach(q=>{q.x+=(q.tx-q.x)*.08;q.y+=(q.ty-q.y)*.12})}   // árbitro cerca de la jugada; jueces de línea a la altura del último defensor
 cornerCross(){const S=this,sc=S.sc,tg=sc.box.length?sc.box[Math.floor(rnd()*sc.box.length)]:sc.taker;sc.tgt=tg;sc.ph='cx';sc.wait=tg;sc.tk=sc.t;S.crossT=S.n;S.crossD=dist(tg,S.B)/(5*S.fs);S.kickAt(tg,5*S.fs,1);
  S.P.forEach(p=>{if(p.k==0||p===sc.taker)return;if(sc.box.includes(p)||p.s!==sc.side){S.tg(p,tg.x+(rnd()-.5)*46,tg.y+(rnd()-.5)*46);p.vmx=2.6}else p.tg=null})}   // todos van a buscar la pelota
 air(){const d=this.crossD;if(!d||this.n-this.crossT>d+4)return 0;return 9*Math.sin(Math.PI*clamp((this.n-this.crossT)/d,0,1))}
 swapRoles(){const S=this;[0,1].forEach(s=>{if(rnd()<.5)return;const c=S.P.filter(p=>p.s==s&&!p.off&&p.l>=2&&!p.tg&&!(p.swpT>S.n));if(c.length<2)return;const a=c[Math.floor(rnd()*c.length)],cd=c.filter(q=>q!==a&&q.l===a.l&&Math.abs(q.hy0-a.hy0)>.3);if(!cd.length)return;const b=cd[Math.floor(rnd()*cd.length)],ta=a.hy0,tb=b.hy0;a.hy=tb;b.hy=ta;a.swpT=b.swpT=S.n+300;a.wide=Math.abs(a.hy-.5)>.22;b.wide=Math.abs(b.hy-.5)>.22;S.swapN=(S.swapN||0)+1})}   // intercambio de posiciones
 foulSc(e,as,label){const S=this,B=S.B;B.own=null;B.vx=B.vy=0;B.recv=null;S.sc={k:'foul',e,side:as,t:0,ph:'f',label:label||'FALTA'};S.fx={n:S.n,x:B.x,y:B.y}}
 fkSc(e,as){const S=this,{gx,dir,ds}=S.geo(as),P=S.P,B=S.B,ba={x:clamp(gx-dir*(110+rnd()*60),X0+40,X0+FW-40),y:H/2+(rnd()-.5)*200},
  at=P.filter(p=>p.s==as&&!p.off&&p.k>=4),taker=S.near(at.length?at:P.filter(p=>p.s==as&&!p.off),ba),u={x:gx-ba.x,y:H/2-ba.y},ul=Math.hypot(u.x,u.y)||1;u.x/=ul;u.y/=ul;
  const wc={x:ba.x+u.x*70,y:ba.y+u.y*70},wall=P.filter(p=>p.s==ds&&!p.off&&p.k>=1&&p.k<=7).sort((a,b)=>dist(a,wc)-dist(b,wc)).slice(0,4);
  wall.forEach((p,j)=>S.tg(p,wc.x-u.y*(j-1.5)*14,wc.y+u.x*(j-1.5)*14));S.tg(taker,ba.x-u.x*26,ba.y-u.y*26);
  let i=0;P.forEach(p=>{if(p===taker||wall.includes(p)||p.off||p.k==0)return;const j=i++;if(p.s==as&&p.k>=4)S.tg(p,gx-dir*(90+(j%2)*20),H/2+((j%5)-2)*34);else if(p.s==ds)S.tg(p,gx-dir*(55+(j%3)*14),H/2+((j%5)-2)*30);else S.tg(p,W/2-dir*40,H/2+((j%5)-2)*40)});
  const gk=P.find(p=>p.s==ds&&p.k==0&&!p.off);S.tg(gk,gx-dir*10,H/2+clamp((ba.y-H/2)*.25,-30,30));
  const dcs=P.filter(p=>p.s==as&&!p.off&&p.k>=4&&p!==taker),decoy=dcs.length&&rnd()<.35?S.near(dcs,ba):null;if(decoy)S.tg(decoy,ba.x-u.x*8-u.y*32,ba.y-u.y*8+u.x*32);
  B.x=ba.x;B.y=ba.y;B.vx=B.vy=0;B.own=null;B.recv=null;S.sc={k:'fk',e,side:as,ph:'set',t:0,x:e.x,ba,taker,wall,gk,u,decoy,tpos:{x:ba.x-u.x*26,y:ba.y-u.y*26},label:decoy?'TIRO LIBRE ENSAYADO':'TIRO LIBRE'};S.fx={n:S.n,x:ba.x,y:ba.y}}
 penSc(e,as){const S=this,{gx,dir,ds}=S.geo(as),P=S.P,B=S.B,ba={x:gx-dir*72,y:H/2},at=P.filter(p=>p.s==as&&!p.off&&p.k>=5),taker=S.near(at.length?at:P.filter(p=>p.s==as&&!p.off),ba);
  S.tg(taker,ba.x-dir*24,ba.y);let i=0;P.forEach(p=>{if(p===taker||p.off||p.k==0)return;S.tg(p,gx-dir*(125+(p.s==ds?16:0)),H/2+(((i++)%9)-4)*34)});
  const gk=P.find(p=>p.s==ds&&p.k==0&&!p.off);S.tg(gk,gx-dir*8,H/2);S.tg(P.find(p=>p.s==as&&p.k==0&&!p.off),gx-dir*300,H/2);
  B.x=ba.x;B.y=ba.y;B.vx=B.vy=0;B.own=null;B.recv=null;S.sc={k:'pen',e,side:as,ph:'set',t:0,x:e.x,ba,taker,gk,tpos:{x:ba.x-dir*24,y:ba.y},label:'PENAL'};S.fx={n:S.n,x:ba.x,y:ba.y}}
 corSc(e,as){const S=this,{gx,dir,ds}=S.geo(as),P=S.P,B=S.B,top=rnd()<.5,fl={x:gx-dir*4,y:top?Y0+4:Y0+FH-4},at=P.filter(p=>p.s==as&&!p.off&&p.k>=3),taker=S.near(at.length?at:P.filter(p=>p.s==as&&!p.off),fl),box=[];
  S.tg(taker,fl.x-dir*10,fl.y+(top?10:-10));const sty=S.T[as][0],el=P.filter(p=>p.s==as&&!p.off&&p!==taker&&p.k>0&&(p.k>=5||(p.l==1&&!p.fb&&p.k>=2&&p.k<=3)||(sty==2&&p.l>=1))).sort((a,b)=>b.k-a.k).slice(0,sty==0?3:sty==2?8:5);let i=0;P.forEach(p=>{if(p===taker||p.off||p.k==0)return;const j=i++;if(p.s==as&&el.includes(p)){S.tg(p,gx-dir*(40+(j%3)*26),H/2+((j%5)-2)*34);box.push(p)}else if(p.s==ds)S.tg(p,gx-dir*(34+(j%3)*24),H/2+((j%5)-2)*30);else S.tg(p,W/2-dir*40,H/2+((j%5)-2)*40)});
  const gk=P.find(p=>p.s==ds&&p.k==0&&!p.off);S.tg(gk,gx-dir*8,H/2);B.x=fl.x-dir*6;B.y=fl.y+(top?6:-6);B.vx=B.vy=0;B.own=null;B.recv=null;
  const sh=(box.length&&rnd()<.3)?S.near(box,fl):null;if(sh)S.tg(sh,fl.x-dir*55,fl.y+(top?45:-45));
  S.sc={k:'cor',e,side:as,ph:'set',t:0,x:e.x,taker,box,gk,sh,tpos:{x:fl.x-dir*10,y:fl.y+(top?10:-10)},label:sh?'CÓRNER CORTO':'CÓRNER',tk:0};S.fx={n:S.n,x:B.x,y:B.y}}
 latSc(e,as){const S=this,{dir}=S.geo(as),P=S.P,B=S.B,top=B.y<H/2,lx=clamp(B.x,X0+60,X0+FW-60),ly=top?Y0+3:Y0+FH-3,sg=top?1:-1,at=P.filter(p=>p.s==as&&!p.off&&p.k>0),taker=S.near(at,{x:lx,y:ly});if(!taker)return;
  const tpos={x:lx,y:top?Y0+R:Y0+FH-R};S.tg(taker,tpos.x,tpos.y);
  const ref={x:lx+dir*50,y:ly+sg*70},opts=at.filter(p=>p!==taker).sort((a,b)=>dist(a,ref)-dist(b,ref)).slice(0,3);opts.forEach((p,j)=>S.tg(p,lx+dir*(45+j*38),ly+sg*(80+j*32)));
  let i=0;P.forEach(p=>{if(p.s!==as&&!p.off&&p.k>0){const j=(i++)%3;S.tg(p,lx+dir*(70+j*35),ly+sg*(60+j*30))}});
  B.x=lx;B.y=ly;B.vx=B.vy=0;B.own=null;B.recv=null;S.sc={k:'lat',e,side:as,ph:'set',t:0,taker,opts,tpos,label:'LATERAL'};S.fx={n:S.n,x:lx,y:ly}}
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
  if(sc.k=='att'){if(B.own===sc.wait&&B.own.hold>=6){sc.i++;if(sc.i<sc.ch.length){sc.wait=sc.ch[sc.i];sc.tk=sc.t;if(sc.x=='f'&&sc.i==sc.ch.length-1){const df=S.P.filter(p=>p.s==1-sc.side&&!p.off&&p.k>0),lx=sc.side?Math.min(...df.map(p=>p.x)):Math.max(...df.map(p=>p.x));S.tg(sc.wait,lx+(sc.side?-1:1)*26,sc.wait.y);sc.wait.vmx=3.2}S.kickAt(sc.wait,S.psp(dist(sc.wait,B)))}else S.finish()}
   else if(!B.own&&sc.t-sc.tk>70){B.own=sc.wait;sc.wait.hold=0}}
  else if(sc.k=='fk'||sc.k=='pen'){const T=sc.k=='fk'?[95,36,8]:[95,42,8];
   if(ph=='set'){if(sc.t>=T[0]&&S.reach(sc.taker,sc.tpos,12,T[0],90,sc)){sc.ph='wait';sc.tw=sc.t;S.fx={n:S.n,x:sc.ba.x,y:sc.ba.y}}}
   else if(ph=='wait'){if(sc.t-sc.tw>=T[1]){sc.ph='run';sc.tr=sc.t;S.tg(sc.taker,sc.ba.x,sc.ba.y);if(sc.decoy)S.tg(sc.decoy,sc.ba.x+sc.u.x*50,sc.ba.y+sc.u.y*50)}}
   else if(ph=='run'){if(sc.t-sc.tr>=T[2]&&S.reach(sc.taker,sc.ba,R+4,sc.tr,45,sc))S.shotSp()}}
  else if(sc.k=='lat'){
   if(ph=='set'){if(sc.t>=40&&S.reach(sc.taker,sc.tpos,6,40,80,sc)){sc.ph='hold';sc.th=sc.t;B.own=sc.taker;sc.taker.hold=0;sc.taker.fx=sc.side?-1:1;sc.taker.fy=0}}
   else if(ph=='hold'){if(sc.t-sc.th>=30){sc.ph='lt';sc.wait=sc.opts[0]||sc.taker;sc.tk=sc.t;S.kickAt(sc.wait,4.2*S.fs)}}
   else if(ph=='lt'){if(B.own===sc.wait)S.endSc();else if(!B.own&&sc.t-sc.tk>70){B.own=sc.wait;sc.wait.hold=0}}}
  else if(sc.k=='cor'){
   if(ph=='set'){if(sc.t>=90&&S.reach(sc.taker,sc.tpos,16,90,90,sc)){sc.ph='wait';sc.tw=sc.t;S.fx={n:S.n,x:B.x,y:B.y}}}
   else if(ph=='wait'){if(sc.t-sc.tw>=40){if(sc.sh){sc.ph='sh';sc.wait=sc.sh;sc.tk=sc.t;S.kickAt(sc.sh,3.8*S.fs)}else S.cornerCross()}}
   else if(ph=='sh'){if(B.own===sc.sh){if(!sc.th)sc.th=sc.t;if(sc.t-sc.th>=26)S.cornerCross()}else if(!B.own&&sc.t-sc.tk>70){B.own=sc.sh;sc.sh.hold=0}}
   else if(ph=='cx'){if(B.own===sc.tgt){const{gx,dir}=S.geo(sc.side);if(sc.x=='g'){sc.ph='g';sc.wait=null;B.free=true;B.own=null;const ty2=H/2+(rnd()-.5)*50;S.markShot('g',gx+dir*18,ty2);S.kick(gx+dir*18,ty2,8*S.fs,null,0)}else{S.kick(W/2,H/2+(rnd()-.5)*200,6.2*S.fs,null);S.endSc()}}
    else if(!B.own&&sc.t-sc.tk>70){B.own=sc.tgt;sc.tgt.hold=0}}}}
 step(){const S=this,B=S.B,P=S.P;S.n++;if(!P.length||S.frozen)return;
  if(!S.sc){if(S.gap>0)S.gap--;else if(S.q.length)S.begin()}
  if(S.sc&&S.sc.k=='foul'){const sc=S.sc;if(++sc.t>=30){const{dir}=S.geo(sc.side),c=S.near(P.filter(p=>p.s==sc.side&&!p.off&&p.k>0),B);if(c){c.x=clamp(B.x-dir*14,X0+R,X0+FW-R);c.y=B.y;B.own=c;c.hold=0;c.wait=18}S.endSc()}return}
  if(S.sc)S.script();if(S.sc&&S.sc.ph=='g'&&S.sc.in)return;S.lift=(S.sc&&S.sc.k=='lat'&&B.own===S.sc.taker)?9:0;if(S.n%540==0&&!S.sc)S.swapRoles();if(S.n%720==0)S.fbSide=[Math.round(rnd()),Math.round(rnd())];if(S.refs)S.stepRefs();
  const bnx=(B.x-X0)/FW,bny=(B.y-Y0)/FH,near=[null,null],nd=[1e9,1e9],near2=[null,null],nd2=[1e9,1e9];
  P.forEach(p=>{if(p.off||p.k==0)return;const d=dist(p,B);if(d<nd[p.s]){nd2[p.s]=nd[p.s];near2[p.s]=near[p.s];nd[p.s]=d;near[p.s]=p}else if(d<nd2[p.s]){nd2[p.s]=d;near2[p.s]=p}});
  const LL=[0,1].map(s=>{const o=P.filter(z=>z.s!==s&&!z.off&&z.k>0);return o.length?(s?Math.min(...o.map(z=>z.x)):Math.max(...o.map(z=>z.x))):null});
  P.forEach(p=>{if(p.off)return;if(p.swpT&&S.n>=p.swpT){p.hy=p.hy0;p.swpT=0;p.wide=p.l>=2&&Math.abs(p.hy0-.5)>.22}let tx,ty,vm=p.l==0?1.5:1.9;const tt=S.T[p.s];
   if(p.k==0){const gx0=p.s?X0+FW:X0,dgx=p.s?-1:1,bd=Math.abs(B.x-gx0),rival=B.own&&B.own.s!==p.s,adv=rival?clamp((260-bd)*.28,0,64):clamp((200-bd)*.1,0,16);   // achica hasta el borde del área
     tx=gx0+dgx*(14+adv);const side=clamp((B.y-H/2)/(bd*.5+70),-1,1);ty=H/2+side*(rival?42:30)+Math.sin(S.n/20+p.s*2)*6;vm=2.4;   // tapa el palo del lado de la pelota y nunca está quieto
     if(B.own===p){tx=gx0+dgx*30;ty=H/2+Math.sin(S.n/30)*14;vm=1.2}
     else if(!B.own&&!S.sc&&dist(p,B)<170&&dist(p,B)<nd[1-p.s]){tx=B.x;ty=B.y;vm=3}}   // sale a cortar balones largos y pases al vacío
   else{const att=S.poss==p.s,bu=p.s?1-bnx:bnx,wl=p.wl,adv=[.85,1,1.2][tt[0]];
    let ux=att?p.hx+wl*(bu*.55*adv-.08):p.hx+wl*(bu-.55)*.35+wl*(([-.04,0,.05][tt[1]])-(tt[0]==0?.04:0));ux=clamp(ux+wl*((tt[0]==2?.04:0)+(tt[0]==1&&p.l==2&&!p.piv?.05*Math.sin(S.n/170+p.k):0))+wl*(S.mode(p.s)=='protect'?-.07:S.mode(p.s)=='chase'?.06:0),.05,p.l==3?.93:.85);
    let uy=clamp(p.hy+(bny-p.hy)*.3*Math.min(1,wl+.25),.05,.95);if(att&&tt[2]&&p.l>=2)uy=clamp(uy+(p.hy<.5?-1:1)*.16,.06,.94);
    tx=X0+(p.s?1-ux:ux)*FW;ty=Y0+uy*FH;
    if(S.counter&&S.counter.s===p.s&&S.n<S.counter.t&&att&&p.l>=2&&B.own!==p){const u2=p.wide?.82:.76;tx=X0+(p.s?1-u2:u2)*FW;if(p.wide)ty=Y0+(p.hy<.5?.1:.9)*FH;vm=2.6}
    if(att&&p.fb&&tt[0]>0&&(tt[0]==2||((p.hy0<.5)==(S.fbSide[p.s]==0)))&&bu>.5&&B.own!==p&&!p.tg){tx=X0+(p.s?1-.74:.74)*FW;ty=Y0+(p.hy<.5?.07:.93)*FH;vm=2.4}   // lateral llegador: sube por la banda hasta el fondo
    const og=p.s?1:-1;   // sentido hacia su propio arco
    if(!att&&!p.tg&&B.own!==p){
     if(p.l==1&&bu<.6){const mk=S.near(P.filter(z=>z.s!==p.s&&!z.off&&z.k>0&&Math.abs(z.x-p.x)<140),p);if(mk){tx=mk.x+og*20;ty=mk.y*.8+p.y*.2;vm=2.2}}   // los defensores marcan
     else if(p.l==2&&!p.piv){const mk=S.near(P.filter(z=>z.s!==p.s&&!z.off&&z.k>0&&z.l>=1&&Math.abs(z.x-p.x)<80),p);if(mk){tx=mk.x+og*14;ty=mk.y;vm=2.2}}}
    if(p.piv&&B.own!==p&&!p.tg){   // el 5: se ofrece en la salida, tapa delante de los centrales y presiona
     if(S.build&&S.build.s===p.s){tx=X0+(p.s?1-.24:.24)*FW;ty=H/2+clamp((B.y-H/2)*.2,-30,30);vm=2.2}
     else if(!att){tx=X0+(p.s?1-.31:.31)*FW;ty=Y0+clamp(bny,.25,.75)*FH;vm=2.2}
     else{const ux2=clamp(bu-.2,.34,.62);tx=X0+(p.s?1-ux2:ux2)*FW;ty=Y0+(bny*.5+.25)*FH;vm=1.9}}
    if(S.build&&S.build.s===p.s&&(tt[3]||0)==0&&p.l==1&&!p.fb&&!p.tg&&B.own!==p){tx=X0+(p.s?1-.13:.13)*FW;ty=Y0+(p.hy0<.5?.3:.7)*FH;vm=2.2}   // salida desde abajo: los centrales abiertos al lado del arquero
    if(att&&B.own&&B.own!==p&&B.own.s===p.s&&(p.l==3||p.wide)&&!p.tg&&LL[p.s]!=null){
     if(p.runUntil>S.n){tx=LL[p.s]+(p.s?-1:1)*38;ty=Y0+Math.max(.1,Math.min(.9,p.hy+(.5-p.hy)*.25))*FH;vm=2.8;S.run={p,t:p.runUntil}}      // pica al vacío, a la espalda de la defensa
     else if(S.n>(p.runCool||0)&&B.own.hold>6&&rnd()<.012&&(p.s?p.x>LL[1]+10:p.x<LL[0]-10)&&dist(B.own,p)>60){p.runUntil=S.n+55;p.runCool=S.n+170;S.runN=(S.runN||0)+1}}
    if(B.own===p){{const blk=P.some(z=>z.s!==p.s&&!z.off&&z.k>0&&Math.abs(z.y-p.y)<48&&(p.s?-1:1)*(z.x-p.x)>0&&(p.s?-1:1)*(z.x-p.x)<92);if(blk){tx=p.x+p.fx*10;ty=p.y+(p.y<H/2?1:-1)*28;vm=1.5}else{tx=p.x+p.fx*22;ty=p.y+p.fy*22;vm=1.4}}   // juega para el costado si lo marcan, sin salir corriendo
     if(S.mode(p.s)=='protect'&&bu>.55){tx=X0+(p.s?.05:.95)*FW;ty=p.y<H/2?Y0+36:Y0+FH-36;vm=1.5}}   // si va ganando, conduce al córner y aguanta
    else if(B.recv===p||(S.sc&&S.sc.wait===p)){tx=B.x+B.vx*10;ty=B.y+B.vy*10;vm=3}
    else if(S.runner&&S.runner.p===p&&S.n<S.runner.t&&B.own&&B.own.s===p.s){const o=B.own,d=p.s?-1:1;tx=clamp(o.x+d*80,X0,X0+FW);ty=o.y+(H/2-o.y)*.3+(p.y<o.y?-25:25)}
    else if(near[p.s]===p&&(!B.own||B.own.s!==p.s)){if(p.yel&&B.own){tx=B.x+(p.s?1:-1)*30;ty=B.y;vm=2}else{tx=B.x+B.vx*6;ty=B.y+B.vy*6;vm=2.4}}
    else if(near2[p.s]===p&&B.own&&B.own.s!==p.s&&bu<.55){tx=(B.x+(p.s?X0+FW:X0))/2;ty=B.y;vm=2.1}   // segundo marcador: cubre
    else if(att&&B.own&&B.own!==p&&p.l>=2)tx+=(p.s?-1:1)*30}
   if(p.tg){tx=p.tg.x;ty=p.tg.y;vm=p.vmx||2.7}
   const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy)||1,sp=Math.min(vm,d*.1);p.vx+=(dx/d*sp-p.vx)*.2;p.vy+=(dy/d*sp-p.vy)*.2;
   p.x=clamp(p.x+p.vx,X0+R,X0+FW-R);p.y=clamp(p.y+p.vy,Y0+R,Y0+FH-R);if(p.cool>0)p.cool--;
   if(B.own===p){const gx=p.s?X0:X0+FW,ax=gx-p.x,ay=(H/2-p.y)*.6,al=Math.hypot(ax,ay)||1;p.fx=ax/al;p.fy=ay/al}
   else{const v=Math.hypot(p.vx,p.vy);if(v>.3){p.fx=p.vx/v;p.fy=p.vy/v}}});
  for(let i=0;i<P.length;i++){const a=P[i];if(a.off)continue;for(let j=i+1;j<P.length;j++){const b=P[j];if(b.off)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
   if(d<R*1.8&&d>.01){const f=(R*1.8-d)/2/d;a.x-=dx*f*.5;a.y-=dy*f*.5;b.x+=dx*f*.5;b.y+=dy*f*.5}}}
  if(B.own){const o=B.own;if(o.off)B.own=null;else{const tx0=o.x+o.fx*(R+BR),ty0=o.y+o.fy*(R+BR),kk=o.hold<8?.4:1;B.x+=(tx0-B.x)*kk;B.y+=(ty0-B.y)*kk;B.vx=B.vy=0;B.cv=0;S.poss=o.s;o.hold++;if(!S.sc){const dd=S.near(P.filter(z=>z.s!==o.s&&!z.off&&z.k>0&&z.cool<=0),o);if(dd&&dist(dd,o)<R*2.3){const t2=S.T[dd.s];if(rnd()<.0045*(t2[0]==0?1.8:t2[0]==2?.8:1)*[.8,1,1.35][t2[1]]*(dd.yel?.25:1)){S.won(dd,o);S.tackles=(S.tackles||0)+1;return}}if(dd&&dist(dd,o)<R*2.6&&o.hold>14)o.wait=Math.min(o.wait,o.hold+4);if(o.hold>o.wait){S.pass(o);o.wait=S.hold(o)}}}}
  else{if(B.cv){const cc=Math.cos(B.cv),ss=Math.sin(B.cv),nvx=B.vx*cc-B.vy*ss;B.vy=B.vx*ss+B.vy*cc;B.vx=nvx}B.x+=B.vx;B.y+=B.vy;B.vx*=.985;B.vy*=.985;const mouth=B.y>GY0&&B.y<GY1;
   if(B.y<Y0+BR){B.y=Y0+BR;B.vy=Math.abs(B.vy)*.7}if(B.y>Y0+FH-BR){B.y=Y0+FH-BR;B.vy=-Math.abs(B.vy)*.7}
   if(B.x<X0+BR&&!(B.free&&mouth)){B.x=X0+BR;B.vx=Math.abs(B.vx)*.7}if(B.x>X0+FW-BR&&!(B.free&&mouth)){B.x=X0+FW-BR;B.vx=-Math.abs(B.vx)*.7}
   if(B.free){if(B.x<X0-24){B.x=X0-24;B.vx=0}if(B.x>X0+FW+24){B.x=X0+FW+24;B.vx=0}}
   for(const p of P){if(p.off||p.cool>0)continue;if(dist(p,B)>=R+BR+1)continue;
    if(S.sc&&S.sc.wait!==p)continue;if(S.sc&&S.sc.ph=='g')continue;
    if(B.recv!==p&&p.k!==0&&!S.sc&&Math.hypot(B.vx,B.vy)>4.8&&rnd()<.35)continue;
    if(!S.sc&&S.prev&&S.prev!==p&&S.prev.s===p.s&&S.prev.k>0)S.runner={p:S.prev,t:S.n+60};
    const was=S.poss;B.own=p;B.recv=null;B.free=false;p.hold=0;p.wait=S.hold(p);if(was!==p.s&&!S.sc)S.checkCounter(p);break}}
  {const dx=B.x-(S.lbx===undefined?B.x:S.lbx),dy=B.y-(S.lby===undefined?B.y:S.lby),dd=Math.hypot(dx,dy);B.rot=(B.rot||0)+dd/BR;S.lbx=B.x;S.lby=B.y;if(dd>.6)S.trail.push({x:B.x,y:B.y,n:S.n});while(S.trail.length&&S.n-S.trail[0].n>22)S.trail.shift()}}
}
const API={Sim,W,H,X0,Y0,FW,FH,GY0,GY1,R,BR};if(typeof module!=='undefined')module.exports=API;else window.SIM2D=API;
})();
