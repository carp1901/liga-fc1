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
 constructor(){this.P=[];this.B={x:W/2,y:H/2,vx:0,vy:0,own:null,recv:null,free:false};this.poss=0;this.sc=null;this.key=null;this.n=0;this.tr=[];this.passes=0;this.q=[];this.frozen=true;this.T=[[1,0,0],[1,0,0]];this.fx=null;this.goalN=0;this.onGoal=null;this.gap=0;this.fs=1;this.prev=null;this.runner=null;this.freeze=0;this.trail=[];this.ctx={min:0,sc:[0,0]};this.link=null;this.shot=null;this.run=null;this.vs=.9;this.refs=null;this.fbSide=[0,0];this.mkm=[new Map(),new Map()];this.thr=[0,0];this.latLock=null}
 setup(f0,f1,key){const k=key+'|'+f0+'|'+f1;if(k===this.key)return false;this.key=k;this.thr=[0,0];this.latLock=null;this.P=[];
  [f0,f1].forEach((f,s)=>{if(f==null)return;for(let i=0;i<11;i++){const h=hom(f,i);this.P.push({s,k:i,l:h.l,wl:h.wl,wide:h.wide,fb:h.fb,piv:h.piv,hy0:h.hy,hx:h.hx,hy:h.hy,x:0,y:0,vx:0,vy:0,fx:s?-1:1,fy:0,off:false,cool:0,hold:0,wait:20,tg:null})}});this.hardRest();return true}
 setTac(s,t){this.T[s]=t}
 hp(p){return{x:X0+(p.s?1-p.hx:p.hx)*FW,y:Y0+p.hy*FH}}
 tg(p,x,y){if(p)p.tg={x:clamp(x,X0+R,X0+FW-R),y:clamp(y,Y0+R,Y0+FH-R)}}
 clr(){this.P.forEach(p=>{p.tg=null;p.vmx=0})}
 rest(){const S=this,B=S.B;S.sc=null;S.ko=null;S.rp=null;S.fx=null;S.freeze=0;S.runner=null;S.prev=null;S.counter=null;S.build=null;S.third=null;S.sb=null;S.trail=[];S.link=null;S.shot=null;S.run=null;S.clr();S.offs=null;S.mkm=[new Map(),new Map()];S.refs=[{x:W/2,y:H/2+40,role:'ref'},{x:W/2,y:Y0-9,role:'l1'},{x:W/2,y:Y0+FH+9,role:'l2'}];S.P.forEach(p=>{p.hy=p.hy0;p.swpT=0;const h=S.hp(p);p.x=h.x;p.y=h.y;p.vx=p.vy=0;p.cool=0;p.hold=0});B.x=W/2;B.y=H/2;B.vx=B.vy=0;B.free=false;B.own=null;B.recv=null}
 hardRest(){this.q=[];this.gap=0;this.rest()}
 kickoff(side,soft){const S=this,B=S.B,old=soft?S.P.map(p=>[p.x,p.y]):null;S.rest();S.ko=null;const o=S.P.find(p=>p.s==side&&p.k==10&&!p.off)||S.P.find(p=>!p.off);if(!o)return;o.x=W/2+(o.s?14:-14);o.y=H/2;B.own=o;S.poss=o.s;o.hold=0;o.wait=24;
  if(old){let md=0;S.P.forEach((p,i)=>{if(p.off)return;const hx=p.x,hy=p.y;p.x=old[i][0];p.y=old[i][1];md=Math.max(md,Math.hypot(hx-p.x,hy-p.y));S.tg(p,hx,hy);p.vmx=4.2});const w=clamp(Math.ceil(md/4.2)+18,30,170);S.P.forEach(p=>{p.cool=w+4});B.own=null;B.x=W/2;B.y=H/2;S.ko={t:S.n+w,o};S.gap=w+10}}   // después de un gol los jugadores vuelven caminando a sus posiciones (no aparecen de golpe) y recién ahí se saca del medio
 
 setOff(s,list){this.P.forEach(p=>{if(p.s!==s)return;const off=!!(list&&list.includes(p.k));if(off&&this.B.own===p)this.B.own=null;p.off=off})}
 geo(as){const g=this.pso?0:as;return{gx:g?X0:X0+FW,dir:g?-1:1,ds:1-as}}   // en la tanda de penales todos se patean al mismo arco
 near(arr,pt){return arr.reduce((b,p)=>!b||dist(p,pt)<dist(b,pt)?p:b,null)}
 psp(d){return clamp(d/24,3.8,6.2)*this.fs}
 kick(tx,ty,sp,recv,cv){const S=this,B=S.B;if(S.cap&&S.cap===B.own&&!S.sc&&!S.cap.xk){const o=S.cap,an=Math.atan2(ty-B.y,tx-B.x);if(o.hd==null)o.hd=Math.atan2(o.fy||0,o.fx||(o.s?-1:1));let df=an-o.hd;df=Math.atan2(Math.sin(df),Math.cos(df));if(Math.abs(df)>.5){S.pend={o,args:[tx,ty,sp,recv,cv],ang:an,t:S.n,r0:recv?{x:recv.x,y:recv.y}:null};S.pendN=(S.pendN||0)+1;return}}sp*=S.vs;const dx=tx-B.x,dy=ty-B.y,d=Math.hypot(dx,dy)||1;S.tr.push({x0:B.x,y0:B.y,x1:tx,y1:ty,n:S.n});if(S.tr.length>6)S.tr.shift();S.passes++;S.link=B.own&&recv?{a:B.own,b:recv,n:S.n}:null;
  if(B.own){B.own.cool=14;S.prev=B.own;const off0=Math.min(R+BR+1,d*.4);B.x+=dx/d*off0;B.y+=dy/d*off0}const c=cv===undefined?(d>90?(rnd()<.5?-1:1)*(.006+rnd()*.01):0):cv,ang=Math.atan2(dy,dx)-c*(d/sp)/2+S.passErr(B.own,recv,d);B.vx=Math.cos(ang)*sp;B.vy=Math.sin(ang)*sp;B.cv=c;B.own=null;B.recv=recv||null}
 kickAt(q,sp,lead){const B=this.B,d=dist(q,B),t=d/sp,l=lead||.7;this.kick(q.x+q.vx*t*l,q.y+q.vy*t*l,sp,q)}
 setCtx(min,sc){this.ctx={min,sc}}
 setYel(s,list){this.P.forEach(p=>{if(p.s===s)p.yel=!!(list&&list.includes(p.k))})}
 mode(s){const c=this.ctx,lead=c.sc[s]-c.sc[1-s];return c.min<=0?'normal':lead>0&&c.min>=70?'protect':((lead<0&&c.min>=65)||(lead==0&&c.min>=85))?'chase':'normal'}
 hold(p){if(this.third&&this.third.p===p&&this.n<this.third.t)return 7+Math.floor(rnd()*6);const m=this.mode(p.s),k=[1.4,1,.75][this.T[p.s][0]];if(p.k==0&&m!='chase')return 55+Math.floor(rnd()*40);return (this.build&&this.build.s===p.s&&(this.T[p.s][3]||0)==0&&p.l<=2?16:0)+Math.round((m=='protect'?48+Math.floor(rnd()*40):m=='chase'?12+Math.floor(rnd()*14):20+Math.floor(rnd()*24))*k)}   // el arquero se toma su tiempo; los equipos defensivos juegan más cortado
 markShot(k,x,y){const B=this.B;this.shot={x0:B.x,y0:B.y,x1:x,y1:y,n:this.n,k}}
 won(d,o){const S=this,B=S.B;o.cool=18;B.own=d;B.recv=null;d.hold=0;d.wait=24+Math.floor(rnd()*20);S.checkCounter(d)}
 checkCounter(p){const S=this,B=S.B;if(S.sc||(S.counter&&S.n<S.counter.t+120))return;const u=p.s?1-(B.x-X0)/FW:(B.x-X0)/FW,tt=S.T[p.s];if(u<.6&&S.P.some(q=>q.s==p.s&&q.wide&&!q.off)&&(tt[2]==1||(tt[0]>=1&&rnd()<.5)||rnd()<.25||(S.T[1-p.s][0]==2&&rnd()<.35))){S.counter={s:p.s,t:S.n+170};S.counterN=(S.counterN||0)+1}}
 // ----- atributos de los jugadores (los entrega el cliente/servidor: setSk(lado,[atributos por puesto del 11])) -----
 sv(p,a){const q=this.sk&&this.sk[p.s]&&this.sk[p.s][p.k];return q?q[a]:62}
 setSk(s,arr){if(!this.sk)this.sk=[null,null];this.sk[s]=arr}
 passErr(o,recv,d){if(!o||!recv||this.sc||!this.sk)return 0;const sg=.01+(100-this.sv(o,'pas'))*.0045;return(rnd()+rnd()+rnd()-1.5)*2*sg*(.6+d/260)}   // pases: el error crece con la distancia y baja con el atributo de pase
 // Perfilarse: antes de dar un pase en juego abierto el que la tiene gira el cuerpo hacia donde va a jugar la pelota (máx. ~0,27 s) y recién ahí patea; el receptor se perfila hacia la pelota.
 pass(o){const S=this;if(S.pend&&S.pend.o===o)return;S.cap=o;try{S.pass0(o)}finally{S.cap=null}}
 pass0(o){const k0=(a,b)=>(a.fb&&b.l>=2&&!b.fb)||(b.fb&&a.l>=2&&!a.fb)||(a.l==2&&b.l==3&&b.wide)||(a.l==3&&a.wide&&b.l==2);const S=this,opp=S.P.filter(q=>q.s!==o.s&&!q.off),dir=o.s?-1:1,tt=S.T[o.s],fw0=[.5,.6,.85][tt[0]],press=opp.some(z=>dist(z,o)<32);const uo=o.s?1-(o.x-X0)/FW:(o.x-X0)/FW;
  if(!S.sc&&Math.abs(o.y-H/2)>FH*.25&&rnd()<.4){const up=o.y<H/2;S.kick(clamp(o.x+(o.s?-1:1)*(70+rnd()*70),X0+40,X0+FW-40),up?Y0-30:Y0+FH+30,7.5,null);return}   // pase que se va por la línea: saque de banda
  const sal=tt[3]||0,upf=q=>q.fb&&(tt[0]==2||(tt[0]==1&&((q.hy0<.5)==(S.fbSide[o.s]==0))));
  if(((o.fb&&upf(o))||(o.wide&&tt[0]>0))&&uo>.62&&Math.abs(o.y-H/2)>FH*.24&&rnd()<.9){const bx=S.P.filter(q=>q.s===o.s&&!q.off&&q!==o&&q.k>0&&(q.s?1-(q.x-X0)/FW:(q.x-X0)/FW)>.66&&Math.abs(q.y-H/2)<95);if(bx.length){S.cross(o,bx[Math.floor(rnd()*bx.length)]);return}}   // lateral llegador: centro al área
  if(o.k==0&&!(S.build&&S.build.s===o.s&&S.n<S.build.t)){S.build={s:o.s,t:S.n+280};S.buildN=(S.buildN||0)+1}
  const build=!!(S.build&&S.build.s===o.s&&S.n<S.build.t)&&!press,cnt=!!(S.counter&&S.counter.s===o.s&&S.n<S.counter.t),md=S.mode(o.s),outl=o.k==0||(build&&uo<.3),fwE=md=='protect'?-.12:md=='chase'?fw0*1.5:build?.45:cnt?fw0*1.5:fw0;let best=null,bs=-1e9,bl=0;const cong=sal==1?opp.filter(z=>Math.abs(z.y-H/2)<95&&dist(z,o)<170).length:0;
  if(sal==2&&(o.k==0||(uo<.3&&o.l<=1))&&(!press||rnd()<.85||S.T[1-o.s][4]==1)){const od=c=>Math.min(160,...opp.map(z=>dist(z,c))),tg=S.P.filter(q=>q.s==o.s&&!q.off&&q.l==3).sort((a,b)=>(od(b)*.6-Math.abs(b.y-H/2)*.4)-(od(a)*.6-Math.abs(a.y-H/2)*.4))[0];if(tg&&rnd()<(press?.95:.8)){S.longTo(o,tg);return}}   // salida directa: del arco o de la defensa en su zona, pelotazo al delantero mejor ubicado (también contra presión o marca al hombre)
  for(const q of S.P){if(q===o||q.s!==o.s||q.off)continue;const d=dist(q,o);if(d<45||d>(cnt||press?420:340))continue;
   const open=Math.min(220,...opp.map(z=>dist(z,q))),lane=Math.min(120,...opp.map(z=>segD(o,q,z))),fw=dir*(q.x-o.x);
   let sc=fw*fwE+open*.5+lane*1.2-d*.2+(q.k==0?((sal==0&&uo<.35)?-40:-120):0)+(press?-fw*.25:0)+rnd()*(18+(100-S.sv(o,'pas'))*.45);
   {const adel=fw>25&&lane>38,cost=Math.abs(fw)<=25&&lane>38;if(md!='protect'){if(adel)sc+=38+Math.min(fw,160)*.18;else if(cost)sc+=14;if(fw<-30&&!press&&q.k>0)sc-=50}if(press&&fw<-20&&q.k>0&&lane>40)sc+=24}
   if(fw>110&&lane>45)sc+=30;                                   // pase entre líneas
   if(tt[2])sc+=Math.abs(q.y-H/2)*.12;if(build){if(d>200)sc-=(d-200)*1.3;sc+=q.l<=2?25:-25}else if(!cnt&&!press&&d>280)sc-=(d-280)*.9;if(cnt&&q.wide&&fw>80)sc+=55;if(q.fb&&(q.s?1-(q.x-X0)/FW:(q.x-X0)/FW)>.6&&lane>40)sc+=75;if(md=='protect'){sc+=lane*.6;if(d>200)sc-=(d-200)*.8}if(md=='chase'&&d>280)sc+=(d-280)*.3;if(q.k==0&&press&&(o.s?1-(o.x-X0)/FW:(o.x-X0)/FW)<.3)sc+=100;if(S.run&&q===S.run.p&&S.n<S.run.t&&lane>35)sc+=95;                          // juego por las bandas
   if(S.runner&&q===S.runner.p&&S.n<S.runner.t&&fw>15)sc+=60+tt[0]*30; // pared / triangulación
   if(outl&&sal==0){if(d>230)sc-=(d-230)*2;sc+=(q.l==1&&!q.fb)?55:q.piv?45:q.fb?20:-30}if(outl&&sal==1){sc+=(q.l==2&&Math.abs(q.y-H/2)<115)?60:q.piv?30:-10}if(q.piv&&(press||build||md=='protect'))sc+=35;if(!press&&!cnt&&!build&&md=='normal'&&Math.abs(q.y-o.y)>FH*.45&&d>250&&lane>45)sc+=42;   // salida, el 5 y cambio de frente
   if(S.lp&&S.lp.to===o&&q===S.lp.from&&S.n-S.lp.n<150&&!press)sc-=75;if(fw<-30&&uo>.6&&!press&&q.k>0)sc-=45;if(fw<-25&&!press&&md!='protect'&&q.k>0)sc-=30+(uo>.45?25:0);if(!press&&open<30&&fw<110)sc-=28;
   q.libB=q.cgB=false;q.soc=0;
    if(!S.sc&&k0(o,q)){const dy=Math.abs(o.y-q.y);if(((o.y<H/2)==(q.y<H/2))&&dy<150&&d<210&&fw>-15&&lane>(press?34:42)){q.soc=(o.fb&&q.l>=2)||(o.l==2&&q.l==3)?1:2;sc+=(press?26:40)+(q.soc==1?8:0)}}
   if(sal==1&&!S.sc&&uo<.5){   // salida al centro: el volante recibe perfilado; si lo presionan, el rival que lo marca deja libre a otro; si se cierran por el centro, cambio de orientación
    if(q.l==2&&!q.wide&&open>60&&dir*q.fx>.25)sc+=20;
    const lane2=Math.min(120,...opp.filter(z=>dist(z,o)>=40).map(z=>segD(o,q,z)));   // línea de pase sin contar al que lo está presionando
    if(o.l==2&&S.lp&&S.lp.to===o&&S.n-S.lp.n<90&&press&&(q.l<=1||q.fb||q.piv)&&open>65&&lane2>45){sc+=34;q.libB=true}
    if(cong>=4&&(q.wide||q.fb)&&Math.abs(q.y-H/2)>FH*.3&&(q.y<H/2)!==(o.y<H/2)&&lane2>45){sc+=26;q.cgB=true}}
   if(sal==0&&uo<.6&&q.k>0&&!S.sc){let tr=null;for(const r2 of S.P){if(r2.s!==o.s||r2.off||r2===q||r2===o||r2.k==0||dir*(r2.x-q.x)<70||dist(q,r2)>260)continue;if(Math.min(120,...opp.map(z=>segD(q,r2,z)))>40&&Math.min(160,...opp.map(z=>dist(z,r2)))>55){tr=r2;break}}if(tr){sc+=26;q.thR=tr}else q.thR=null}   // tercer hombre: se juega con el que tiene un compañero libre más adelante
   if(S.third&&S.third.p===o&&S.n<S.third.t&&q===S.third.r)sc+=75;
   if(sc>bs){bs=sc;best=q;bl=lane}}
  if(sal==0&&press&&uo<.28&&(o.l<=1||o.k==0)&&(!best||bl<14)&&rnd()<.25){const nine2=S.P.filter(q=>q.s==o.s&&q.l==3&&!q.off).sort((a,b)=>Math.abs(a.y-H/2)-Math.abs(b.y-H/2))[0];if(nine2){S.longTo(o,nine2);return}}   // presión muy fuerte y sin líneas de pase claras: pelotazo seguro al delantero
  if(best&&sal==1){if(best.libB)S.libN=(S.libN||0)+1;if(best.cgB)S.cgN=(S.cgN||0)+1}
  if(best&&best.soc&&best.k>0&&!S.sc){S.runner={p:o,t:S.n+(best.soc==1?110:85),ov:best.soc==1};S.socN=(S.socN||0)+1;if(best.soc==1)S.ovN=(S.ovN||0)+1}
   if(best&&sal==0&&best.thR&&best.k>0){S.third={p:best,r:best.thR,t:S.n+130};S.thirdN=(S.thirdN||0)+1}
  if(!best){S.B.own=o;S.kick(clamp(o.x+dir*200,X0,X0+FW),clamp(o.y+(rnd()-.5)*200,Y0,Y0+FH),6,null);return}
  S.lp={from:o,to:best,n:S.n};const dd2=dist(best,o),sp2=clamp(dd2/30,3.6,5.8)*(cnt?1.2:1)*[.88,1,1.1][tt[0]];if(Math.abs(best.y-o.y)>FH*.42&&dd2>240){S.crossT=S.n;S.crossD=dd2/(sp2*S.vs);S.switchN=(S.switchN||0)+1}
  S.kickAt(best,sp2,S.run&&S.run.p===best&&S.n<S.run.t?1.5:.7)}
 event(e,as){const S=this,n=S.q.length;if(!S.P.length||S.frozen||(as==1&&S.P.length<22))return;
  const dn=S.dropN||1;if(n>=dn&&n<4&&e.k=='att'&&e.x=='l'&&as!=null&&rnd()<.6&&S.n-(S.lastLat||-999)>600){S.lastLat=S.n;S.latQ=(S.latQ||0)+1;S.q.push({e:{k:'lat'},as:1-as});return}   // la pérdida que se iba a descartar se convierte en saque lateral para el rival
  if((n>=dn&&e.k=='lat')||(n>=dn&&(e.k=='foul'||(e.k=='att'&&(e.x=='l'||e.x=='f'))))||(n>=dn+2&&e.k=='att'&&e.x=='o'))return;if(n>=7&&e.x!='g')return;S.q.push({e,as})}
 begin(){const S=this,it=S.q.shift(),e=it.e,as=it.as;S.clr();S.B.free=false;S.poss=as;S.fs=S.noRush?1:1+Math.min(.5,S.q.length*.15);
  if(e.k=='att')S.attSc(e,as);else if(e.k=='pso'){S.pso=true;S.penSc(e,as)}else if(e.k=='foul'||e.k=='fk'||e.k=='pen')S.incSc(e,as);else if(e.k=='cor')S.corSc(e,as);else if(e.k=='lat')S.latSc(e,as)}
 endSc(){this.sc=null;this.clr();this.gap=14}
 attSc(e,as){const S=this,P=S.P,B=S.B,all=e.ch.map(k=>P.find(p=>p.s==as&&p.k==k)).filter(p=>p&&!p.off);if(!all.length)return;
  const u=p=>as?1-(p.x-X0)/FW:(p.x-X0)/FW,mates=P.filter(p=>p.s==as&&!p.off&&p.k>0),own=B.own&&B.own.s==as?B.own:null,st=own||S.near(mates,B)||all[0],shooter=all[all.length-1];
  // la jugada arranca desde quien tiene la pelota (o desde el que la recupera) y va hacia adelante: no se la teletransporta ni se pasa para atrás desde cualquier lado
  const ch=all.slice(0,-1).filter(p=>p!==st&&p!==shooter&&u(p)>=u(st)-.03).slice(-3);if(e.cr&&all.length>1){const cr=all[all.length-2];if(cr!==shooter){const i0=ch.indexOf(cr);if(i0>=0)ch.splice(i0,1);ch.push(cr)}}ch.push(shooter);
  if(own&&!S.sc)S.socStart(own,ch,as);
   S.sc={k:'att',e,side:as,ch,i:0,x:e.x,t:0,tk:0,ph:own?'c':'rec',wait:own?ch[0]:st,st,in:false,cr:e.cr&&ch.length>=2&&ch[ch.length-2]!==shooter?1:0};if(S.sc.cr&&ch.length==2)S.crSet(S.sc);
  if(own&&ch[0]!==own)S.kickAt(ch[0],clamp(dist(ch[0],B)/30,4.4,7)*S.fs)}
 recStep(){const S=this,sc=S.sc,B=S.B,st=sc.st,o=B.own,go=()=>{st.tg=null;st.vmx=0;sc.ph='c';sc.wait=sc.ch[0];sc.tk=sc.t;if(sc.ch[0]!==st)S.kickAt(sc.ch[0],clamp(dist(sc.ch[0],B)/30,4.4,7)*S.fs)};
  S.tg(st,B.x+B.vx*4,B.y+B.vy*4);st.vmx=3.1;
  if(o===st||(!o&&dist(st,B)<R+BR+3)){B.own=st;B.recv=null;st.hold=0;B.vx=B.vy=0;go()}
  else if(o&&o.s!==st.s&&(dist(st,o)<R*2.1||sc.t>80)){S.won(st,o);go()}
  else if(sc.t>110){B.own=st;B.recv=null;st.hold=0;st.x=B.x;st.y=B.y;go()}}   // recupera la pelota corriendo hasta el que la tiene
 finish(){const S=this,sc=S.sc,B=S.B,as=sc.side,o0=B.own;
  if(sc.x=='f'){S.offsideEnd();return}
  // un remate solo sale del último cuarto de cancha: si el cierre de la jugada está más atrás, el jugador conduce hasta ahí
  if(sc.x!='l'&&o0&&sc.adv!=2){const u=as?1-(o0.x-X0)/FW:(o0.x-X0)/FW,ok=S.shotOK(o0,as);if(u<.78||!ok){const g0=as?X0:X0+FW,dx0=Math.abs(g0-o0.x),dd=as?-1:1;sc.adv=true;sc.ph='adv';sc.shooter=o0;sc.tk=sc.t;const tx=u<.78?X0+(as?1-.9:.9)*FW:g0-dd*clamp(dx0<62?80:dx0,80,150);S.tg(o0,tx,H/2+clamp(o0.y-H/2,-70,70)*(u<.78?.55:.8));return}}
  const {gx,dir,ds}=S.geo(as),dg=S.P.filter(p=>p.s==ds&&!p.off),gk=dg.find(p=>p.k==0)||dg[0],fs=S.fs;sc.gk=gk;
  if(sc.x=='g'){const ty=H/2+(rnd()<.5?-1:1)*(18+rnd()*28);sc.ph='g';sc.wait=null;B.free=true;S.markShot('g',gx+dir*18,ty);S.kick(gx+dir*18,ty,8*fs,null,0);if(gk){S.tg(gk,gx-dir*8,ty-Math.sign(ty-H/2)*16);gk.vmx=2.6}}
  else if(sc.x=='s'){const far=Math.abs(gk.x-gx)>40||Math.abs(B.x-gx)<46,ty=far?gk.y+(rnd()<.5?-1:1)*8:clamp(gk.y+(rnd()<.5?-1:1)*(16+rnd()*14),GY0+8,GY1-8),tx=far?gk.x:gx-dir*10;   // si el arquero quedó adelantado, el remate va a su cuerpo (no rebota en el fondo y vuelve rodando)
  sc.ph='s';sc.wait=gk;S.markShot('s',tx,ty);S.kick(tx,ty,7.2*fs,gk,0);S.tg(gk,tx,ty);gk.vmx=3.8}
  else if(sc.x=='o'){const cl=o0&&Math.abs(gx-o0.x)<95&&Math.abs(o0.y-H/2)<60?6:34,ty=rnd()<.5?GY0-cl:GY1+cl;sc.ph='o';sc.wait=null;sc.t2=S.n;S.markShot('o',gx,ty);S.kick(gx,ty,7.6*fs,null,0);B.free=true}
  else if(sc.x=='l'&&o0&&o0.k>0&&Math.abs(o0.y-H/2)>FH*.2&&rnd()<.5){const up=o0.y<H/2,ad=as?-1:1;S.prev=o0;S.endSc();S.kick(clamp(o0.x+ad*(50+rnd()*60),X0+30,X0+FW-30),up?Y0-30:Y0+FH+30,7,null);S.lostOut=(S.lostOut||0)+1}   // la jugada se pierde con la pelota afuera por la banda: saque lateral para el rival
   else{const z=dg.filter(p=>p.k).reduce((b,p)=>!b||dist(p,B)<dist(b,B)?p:b,null)||gk;sc.ph='l';sc.wait=z;S.kickAt(z,5.2*fs)}}
 socScene(sc,o){const S=this,ch=sc.ch,i=sc.i,w=sc.wait;if(!o||!w||o.k==0||sc.soc||(sc.cr&&i>=ch.length-2)||ch.length>=6||sc.x=='f'||rnd()>.95)return;
  if(!(o.fb||o.l==2||(o.l==3&&o.wide)))return;const dir=sc.side?-1:1,opp=S.P.filter(z=>z.s!==o.s&&!z.off);
  let b=null,bs=-1e9;for(const q of S.P){if(q.s!==o.s||q.off||q===o||q.k==0||ch.includes(q))continue;const ok=(o.fb&&q.l>=2&&!q.fb)||(q.fb&&o.l>=2&&!o.fb)||(o.l==2&&q.l==3&&q.wide)||(o.l==3&&o.wide&&q.l==2);if(!ok)continue;
   const d=dist(o,q);if((o.y<H/2)!=(q.y<H/2)||Math.abs(o.y-q.y)>200||d<50||d>250||dir*(q.x-o.x)<-45)continue;const lane=Math.min(120,...opp.map(z=>segD(o,q,z)));if(lane<22)continue;const s2=lane*.5-d*.2+dir*(q.x-o.x)*.2;if(s2>bs){bs=s2;b=q}}
  if(!b)return;sc.soc=1;ch.splice(i,0,b,o);sc.wait=b;S.runner={p:o,t:S.n+150,ov:!!(o.fb||(o.l==2&&b.l==3))};S.socN=(S.socN||0)+1;if(S.runner.ov)S.ovN=(S.ovN||0)+1}   // sociedad en plena jugada: pared / sobrepaso con el socio de banda y recién después sigue con la cadena
 socStart(o,ch,as){const S=this;if(o.k==0||o.s!==as||ch[0]===o||ch.length>=5||ch.includes(o)||rnd()>.55)return;const dir=as?-1:1,opp=S.P.filter(z=>z.s!==as&&!z.off);
  let b=null,bs=-1e9;for(const q of S.P){if(q.s!==as||q.off||q===o||q.k==0||ch.includes(q))continue;const ok=(o.fb&&q.l>=2&&!q.fb)||(q.fb&&o.l>=2&&!o.fb)||(o.l==2&&q.l==3&&q.wide)||(o.l==3&&o.wide&&q.l==2);if(!ok)continue;
   const d=dist(o,q);if((o.y<H/2)!=(q.y<H/2)||Math.abs(o.y-q.y)>150||d<55||d>210||dir*(q.x-o.x)<-15)continue;const lane=Math.min(120,...opp.map(z=>segD(o,q,z)));if(lane<38)continue;const sc=lane*.5-d*.2+dir*(q.x-o.x)*.2;if(sc>bs){bs=sc;b=q}}
  if(!b)return;ch.unshift(b,o);S.runner={p:o,t:S.n+150,ov:!!(o.fb||(o.l==2&&b.l==3))};S.socN=(S.socN||0)+1;if(S.runner.ov)S.ovN=(S.ovN||0)+1}   // sociedad al inicio de la jugada: pared / sobrepaso con el socio de banda y recién después sigue
 rollStep(){const S=this,B=S.B,r=S.sc.rt,dx=r.x-B.x,dy=r.y-B.y,d=Math.hypot(dx,dy);B.own=null;B.recv=null;if(d<=r.v){B.x=r.x;B.y=r.y;S.sc.rt=null}else{B.x+=dx/d*r.v;B.y+=dy/d*r.v}B.vx=B.vy=0}   // la pelota que se pidió reponer rueda hasta el lugar en lugar de aparecer ahí
 // Repetición de goles: se graba cada cuadro (últimos ~5 s) y, tras el festejo, se reproduce la jugada del gol más lenta antes del saque del medio (solo a velocidad normal)
 recF(){const S=this,P=S.P,NF=300,N=P.length*6+4;if(!S.rb||S.rb.length!==NF*N){S.rb=new Float32Array(NF*N);S.rbn=new Int32Array(NF).fill(-1)}const i=S.n%NF,o=i*N,B=S.B;S.rbn[i]=S.n;let k=o;for(const p of P){S.rb[k++]=p.x;S.rb[k++]=p.y;S.rb[k++]=p.vx;S.rb[k++]=p.vy;S.rb[k++]=p.fx||0;S.rb[k++]=p.fy||0}S.rb[k++]=B.x;S.rb[k++]=B.y;S.rb[k++]=B.vx;S.rb[k++]=B.vy}
 startReplay(sc){const S=this,B=S.B,NF=300,f2=sc.t2+30,f1=Math.max(sc.t2-195,S.n-NF+2);if(f2-f1<60){S.kickoff(1-sc.side,true);return}
  S.rp={f1,f2,pos:f1,save:{P:S.P.map(p=>[p.x,p.y,p.vx,p.vy,p.fx,p.fy]),B:{x:B.x,y:B.y,vx:B.vx,vy:B.vy,own:B.own,recv:B.recv,free:B.free}}};S.rpN=(S.rpN||0)+1;S.fx=null;S.trail=[]}
 rpStep(){const S=this,r=S.rp,P=S.P,B=S.B,NF=300,N=P.length*6+4;r.pos+=.75;const f=Math.floor(r.pos);
  if(f>r.f2){P.forEach((p,i)=>{const a=r.save.P[i];p.x=a[0];p.y=a[1];p.vx=a[2];p.vy=a[3];p.fx=a[4];p.fy=a[5]});Object.assign(B,r.save.B);S.rp=null;return}
  const i=f%NF;if(S.rbn[i]!==f)return;let k=i*N;for(const p of P){p.x=S.rb[k++];p.y=S.rb[k++];p.vx=S.rb[k++];p.vy=S.rb[k++];p.fx=S.rb[k++];p.fy=S.rb[k++]}B.x=S.rb[k++];B.y=S.rb[k++];B.vx=S.rb[k++];B.vy=S.rb[k++];B.own=null;B.recv=null;S.trail=[]}
 shotOK(o,as){const gx=as?X0:X0+FW,dx=Math.abs(gx-o.x),dy=Math.abs(o.y-H/2);return dy<=dx*1.05+34&&(dx>=55||dy<=Math.min(48,dx*1.3))}   // ángulo de remate razonable: ni pegado a la línea de fondo ni tan abierto que no vea el arco
 reach(p,pt,tol,t0,lim,sc){if(dist(p,pt)<=tol)return true;if(sc.t-t0>lim){p.x=pt.x;p.y=pt.y;p.vx=p.vy=0;return true}return false}   // el ejecutante tiene que estar en la pelota (si tarda de más, se lo ubica)
 offsideEnd(){const S=this,sc=S.sc,as=sc.side,ds=1-as,o=S.B.own||sc.wait,df=S.P.filter(p=>p.s==ds&&!p.off&&p.k>0),lx=df.length?(as?Math.min(...df.map(p=>p.x)):Math.max(...df.map(p=>p.x))):S.B.x;S.offs={x:lx,n:S.n,p:o};S.offN=(S.offN||0)+1;S.clr();S.foulSc({},ds,'FUERA DE JUEGO')}
 crSet(sc){const S=this,w=sc.ch[sc.ch.length-2],sh=sc.ch[sc.ch.length-1],{gx,dir}=S.geo(sc.side);sc.ws={x:gx-dir*FW*.1,y:w.hy0<.5?Y0+FH*.08:Y0+FH*.92};S.tg(w,sc.ws.x,sc.ws.y);w.vmx=3;S.tg(sh,gx-dir*(95+rnd()*20),H/2+(rnd()-.5)*44);sh.vmx=3}   // el que centra se abre a la banda y el rematador se planta en el área
 cross(o,q){const S=this,d=dist(o,q),sp=clamp(d/26,4,5.6);S.crossT=S.n;S.crossD=d/sp;S.crossN=(S.crossN||0)+1;S.kickAt(q,sp,1.1)}
 longTo(o,q){const S=this,d=dist(o,q),sp=clamp(d/24,4.6,6.4);S.crossT=S.n;S.crossD=d/(sp*S.vs);S.directN=(S.directN||0)+1;S.counter={s:o.s,t:S.n+150};S.kickAt(q,sp,1.1);S.setSB(o.s,q)}
 setSB(s,tg){const S=this;S.sb={s,x:tg.x,y:tg.y,t:S.n+140,tg,n0:S.n,def:S.P.filter(z=>z.s!==s&&!z.off&&z.k>0).sort((a,b)=>dist(a,tg)-dist(b,tg)).slice(0,2)}}   // zona de segunda pelota: los de arriba pelean el rechace y los dos rivales más cercanos salen a disputarla
 // marcaje: cada defensor/volante tiene UN solo par (así no se amontonan sobre el mismo rival). Hombre a hombre: persigue a su par. Zonal: solo toma al que entra en su zona.
 assignMarks(){const S=this,P=S.P;S.mkm=[0,1].map(s=>{const m=new Map(),man=(S.T[s][4]||0)==1,def=P.filter(p=>p.s==s&&!p.off&&p.k>0&&(p.l==1||(p.l==2&&!p.piv))),opp=P.filter(z=>z.s!==s&&!z.off&&z.k>0&&(man||z!==S.B.own)),ogx=s?X0+FW:X0;
  if(!man){   // ZONAL: a cada rival lo toma el dueño de la zona donde está; si sale de la zona, pasa al compañero de la zona vecina. Entre dos zonas, con la pelota: duda
   const own=new Map();
   opp.forEach(z=>{let b=null,b2=null,bd=1e9,bd2=1e9;def.forEach(d=>{const wd=Math.hypot((z.x-(d.zax==null?d.x:d.zax))*.8,(z.y-(d.zay==null?d.y:d.zay))*1.25);if(wd<bd){bd2=bd;b2=b;bd=wd;b=d}else if(wd<bd2){bd2=wd;b2=d}});
    if(!b)return;const Rz=b.l==1?(b.fb?105:92):(b.wide?118:112);if(bd>=Rz)return;
    if(b2&&bd2<bd*1.2&&(z===S.B.own||z===S.B.recv)){b.dub=b2.dub=S.n+16;S.dubN=(S.dubN||0)+1}
    const cur=own.get(b);if(!cur||Math.abs(z.x-ogx)<Math.abs(cur.x-ogx))own.set(b,z)});
   own.forEach((z,d)=>m.set(d,z));return m}
  // CUERPO A CUERPO: pares fijos que se mantienen aunque el rival se aleje; la figura rival la toma el mejor marcador
  const prev=S.mkm&&S.mkm[s] instanceof Map?S.mkm[s]:null,ud=new Set(),uz=new Set();
  if(prev)prev.forEach((z,d)=>{if(!d.off&&!z.off&&def.includes(d)&&z.s!==s&&dist(d,z)<520&&!uz.has(z)){m.set(d,z);ud.add(d);uz.add(z)}});
  const rt=z=>(S.sv(z,'pas')+S.sv(z,'reg')+S.sv(z,'des')+S.sv(z,'rem'))/4,star=opp.filter(z=>z.l>=2).sort((a,b)=>rt(b)-rt(a))[0];
  if(star&&!uz.has(star)){const bm=def.slice().sort((a,b)=>(S.sv(b,'mar')+S.sv(b,'ant'))-(S.sv(a,'mar')+S.sv(a,'ant')))[0];if(bm){const old=m.get(bm);if(old)uz.delete(old);m.set(bm,star);ud.add(bm);uz.add(star)}}
  const pairs=[];def.forEach(d=>{if(ud.has(d))return;opp.forEach(z=>{if(uz.has(z))return;const r=Math.abs((d.l==1?3:2)-z.l),c=dist(d,z)+38*r;if(c<340)pairs.push([c,d,z])})});
  pairs.sort((a,b)=>a[0]-b[0]);pairs.forEach(([c,d,z])=>{if(!ud.has(d)&&!uz.has(z)){ud.add(d);uz.add(z);m.set(d,z)}});return m})}
 // apoyos: los 2 compañeros más cercanos al que tiene la pelota se ofrecen a una distancia útil (80-150 px) y en un ángulo con la línea de pase libre; el resto mantiene su posición
 calcSup(){const S=this,B=S.B,o=B.own;S.sup=[new Set(),new Set()];if(!o||S.sc||o.off||S.frozen)return;S.sup[o.s]=new Set(S.P.filter(q=>q.s===o.s&&!q.off&&q.k>0&&q!==o&&q.l>=1&&dist(q,o)<240).sort((a,b)=>dist(a,o)-dist(b,o)).slice(0,2))}
 supPoint(o,p,tx,ty){const S=this,opp=S.P.filter(z=>z.s!==o.s&&!z.off&&z.k>0);let vx=tx-o.x,vy=ty-o.y,d0=Math.hypot(vx,vy)||1;const D=clamp(d0,85,150),a0=Math.atan2(vy,vx);let best=null,bv=-1e9;
  for(const da of[0,.45,-.45,.9,-.9]){const a=a0+da,q={x:clamp(o.x+Math.cos(a)*D,X0+R,X0+FW-R),y:clamp(o.y+Math.sin(a)*D,Y0+R,Y0+FH-R)},lane=Math.min(110,...opp.map(z=>segD(o,q,z))),open=Math.min(110,...opp.map(z=>dist(z,q))),v=lane*1.2+open*.6-Math.abs(da)*18-dist(q,{x:tx,y:ty})*.12;if(v>bv){bv=v;best=q}}
  return best}
 stepRefs(){const S=this,B=S.B,P=S.P,lm=[0,1].map(s=>{const o=P.filter(z=>z.s===s&&!z.off&&z.k>0);return o.length?(s?Math.max(...o.map(z=>z.x)):Math.min(...o.map(z=>z.x))):W/2}),[r,l1,l2]=S.refs;
  r.tx=clamp(W/2+(B.x-W/2)*.62,X0+60,X0+FW-60);if(!r.sd||S.n%900==0)r.sd=rnd()<.5?-1:1;r.ty=clamp(B.y+r.sd*46,Y0+24,Y0+FH-24);l1.tx=clamp(lm[0],X0+20,W/2+90);l1.ty=Y0-9;l2.tx=clamp(lm[1],W/2-90,X0+FW-20);l2.ty=Y0+FH+9;
  {const dx=r.tx-r.x,dy=r.ty-r.y,d=Math.hypot(dx,dy);if(d>34){const sp=Math.min(2.1,(d-34)*.04+.3);r.x+=dx/d*sp;r.y+=dy/d*sp}const bd=Math.hypot(r.x-B.x,r.y-B.y);if(bd<34&&bd>.1){const k=Math.min(1.8,34-bd);r.x+=(r.x-B.x)/bd*k;r.y+=(r.y-B.y)/bd*k}}   // el árbitro no corre detrás de la pelota: acompaña desde lejos, en diagonal
  [l1,l2].forEach(w=>{w.x+=clamp((w.tx-w.x)*.08,-1.8,1.8);w.y+=(w.ty-w.y)*.12})}   // árbitro cerca de la jugada; jueces de línea a la altura del último defensor
 cornerCross(){const S=this,sc=S.sc,tg=sc.box.length?sc.box[Math.floor(rnd()*sc.box.length)]:sc.taker;sc.tgt=tg;sc.ph='cx';sc.wait=tg;sc.tk=sc.t;S.crossT=S.n;S.crossD=dist(tg,S.B)/(5*S.fs);S.kickAt(tg,5*S.fs,1);
  S.P.forEach(p=>{if(p.k==0||p===sc.taker)return;if(sc.box.includes(p)||p.s!==sc.side){S.tg(p,tg.x+(rnd()-.5)*46,tg.y+(rnd()-.5)*46);p.vmx=2.6}else p.tg=null})}   // todos van a buscar la pelota
 air(){const d=this.crossD;if(!d||this.n-this.crossT>d+4)return 0;return 9*Math.sin(Math.PI*clamp((this.n-this.crossT)/d,0,1))}
 swapRoles(){const S=this;[0,1].forEach(s=>{if(rnd()<.5)return;const c=S.P.filter(p=>p.s==s&&!p.off&&p.l>=2&&!p.tg&&!(p.swpT>S.n));if(c.length<2)return;const a=c[Math.floor(rnd()*c.length)],cd=c.filter(q=>q!==a&&q.l===a.l&&Math.abs(q.hy0-a.hy0)>.3);if(!cd.length)return;const b=cd[Math.floor(rnd()*cd.length)],ta=a.hy0,tb=b.hy0;a.hy=tb;b.hy=ta;a.swpT=b.swpT=S.n+300;a.wide=Math.abs(a.hy-.5)>.22;b.wide=Math.abs(b.hy-.5)>.22;S.swapN=(S.swapN||0)+1})}   // intercambio de posiciones
 // incidente previo a una falta: el que la recibe lleva la pelota hasta el lugar y el rival lo derriba (la jugada detenida siempre tiene una causa visible)
 incSc(e,as){const S=this,B=S.B,P=S.P,{gx,dir,ds}=S.geo(as),at=P.filter(p=>p.s==as&&!p.off&&p.k>0),df=P.filter(p=>p.s==ds&&!p.off&&p.k>0),fw=at.filter(p=>p.k>=3),
  spot=e.k=='fk'?{x:clamp(gx-dir*(105+rnd()*110),X0+40,X0+FW-40),y:H/2+(rnd()-.5)*200}:e.k=='pen'?{x:gx-dir*(52+rnd()*16),y:H/2+(rnd()-.5)*80}:{x:B.x,y:B.y},
  vic=S.near(e.k=='foul'||!fw.length?at:fw,B),fo=S.near(df,spot);
  if(!vic||!fo){S.afterInc(e,as);return}
  if(e.k=='fk')e.spot=spot;S.sc={k:'inc',e,side:as,t:0,ph:'get',vic,fo,spot,tk:0};S.poss=as}
 afterInc(e,as){const S=this;S.sc=null;S.clr();if(e.k=='fk')S.fkSc(e,as);else if(e.k=='pen')S.penSc(e,as);else S.foulSc(e,as)}
 incStep(){const S=this,sc=S.sc,B=S.B,vic=sc.vic,fo=sc.fo;
  if(sc.ph=='get'){if(dist(vic,B)>40&&!sc.k1){sc.k1=1;sc.tk=sc.t;sc.wait=vic;S.kickAt(vic,5)}
   if(dist(vic,B)<=40||B.own===vic||sc.t-sc.tk>55){B.own=vic;vic.hold=0;vic.wait=999;B.vx=B.vy=0;B.recv=null;sc.wait=null;sc.ph='run';sc.tr=sc.t;S.tg(vic,sc.spot.x,sc.spot.y);S.tg(fo,sc.spot.x,sc.spot.y)}}
  else if(sc.ph=='run'){if(dist(vic,sc.spot)<16||sc.t-sc.tr>170){sc.ph='hit';sc.th=sc.t;vic.tg=null}else S.tg(fo,vic.x+(sc.side?-1:1)*8,vic.y)}
  else if(sc.ph=='hit'){S.tg(fo,vic.x,vic.y);if(dist(fo,vic)<R*2.1||sc.t-sc.th>45){vic.fell=S.n;B.own=null;B.vx=B.vy=0;B.recv=null;S.fx={n:S.n,x:vic.x,y:vic.y};sc.ph='fall';sc.tf=sc.t}}
  else if(sc.ph=='fall'){if(sc.t-sc.tf>26)S.afterInc(sc.e,sc.side)}}
 foulSc(e,as,label){const S=this,B=S.B;B.own=null;B.vx=B.vy=0;B.recv=null;S.sc={k:'foul',e,side:as,t:0,ph:'f',label:label||'FALTA'};S.fx={n:S.n,x:B.x,y:B.y}}
 fkSc(e,as){const S=this,{gx,dir,ds}=S.geo(as),P=S.P,B=S.B,ba=e.spot||{x:clamp(gx-dir*(110+rnd()*60),X0+40,X0+FW-40),y:H/2+(rnd()-.5)*200},
  at=P.filter(p=>p.s==as&&!p.off&&p.k>=4),taker=S.near(at.length?at:P.filter(p=>p.s==as&&!p.off),ba),u={x:gx-ba.x,y:H/2-ba.y},ul=Math.hypot(u.x,u.y)||1;u.x/=ul;u.y/=ul;
  // Barrera: a 9,15 m de la pelota, en línea recta perpendicular a la dirección del tiro (apuntando al palo más cercano) y con los jugadores hombro con hombro. Cuantos más metros al arco, menos hombres: 5 / 4 / 3 / 2 / 1 / ninguno.
  const dgm=Math.hypot(gx-ba.x,H/2-ba.y)/6.5,nw=Math.max(dgm<20?5:dgm<24?4:dgm<28?3:dgm<32?2:dgm<36?1:0,e.x=='w'?2:0),sgn=ba.y>=H/2?1:-1,
   aim={x:gx,y:H/2+sgn*Math.min(24,Math.abs(ba.y-H/2)*.3)},v={x:aim.x-ba.x,y:aim.y-ba.y},vl=Math.hypot(v.x,v.y)||1;v.x/=vl;v.y/=vl;
  const wc={x:ba.x+v.x*62,y:ba.y+v.y*62},pp={x:-v.y,y:v.x},gp=2*R+1,pr=p=>(p.x-wc.x)*pp.x+(p.y-wc.y)*pp.y,
   wall=P.filter(p=>p.s==ds&&!p.off&&p.k>=1&&p.k<=7).sort((a,b)=>dist(a,wc)-dist(b,wc)).slice(0,nw).sort((a,b)=>pr(a)-pr(b));
  const wt=wall.map((p,j)=>{const o=(j-(wall.length-1)/2)*gp,t={x:clamp(wc.x+pp.x*o,X0+R,X0+FW-R),y:clamp(wc.y+pp.y*o,Y0+R,Y0+FH-R)};S.tg(p,t.x,t.y);return t});S.tg(taker,ba.x-u.x*26,ba.y-u.y*26);
  const edge=wall.length?P.filter(p=>p.s==as&&!p.off&&p.k>=4&&p!==taker).sort((a,b)=>dist(a,wc)-dist(b,wc))[0]:null;
  if(edge){const o=(rnd()<.5?-1:1)*(wall.length*gp/2+R+6);S.tg(edge,wc.x+pp.x*o-v.x*8,wc.y+pp.y*o-v.y*8)}
  // El resto se ubica sin pisar la barrera, a la pelota ni a los demás: si el lugar está ocupado se corre a un costado.
  const placed=[...wt,{x:ba.x-u.x*26,y:ba.y-u.y*26},ba];if(edge){const q=edge.tg;if(q)placed.push(q)}
  const put=(p,x,y)=>{const y0=y;for(let a=0;a<14;a++){const yy=y0+(a%2?1:-1)*Math.ceil(a/2)*30,xx=x-dir*(a>=8?26:0);if(placed.every(q=>Math.hypot(q.x-xx,q.y-yy)>=2.3*R)){x=xx;y=yy;break}}placed.push({x,y});S.tg(p,x,y)};
  let i=0;P.forEach(p=>{if(p===taker||wall.includes(p)||p===edge||p.off||p.k==0)return;const j=i++;if(p.s==as&&p.k>=4)put(p,gx-dir*(90+(j%2)*20),H/2+((j%5)-2)*34);else if(p.s==ds)put(p,gx-dir*(55+(j%3)*14),H/2+((j%5)-2)*30);else put(p,W/2-dir*40,H/2+((j%5)-2)*40)});
  const gk=P.find(p=>p.s==ds&&p.k==0&&!p.off);S.tg(gk,gx-dir*10,H/2-(wall.length>=2?sgn*Math.min(24,Math.abs(ba.y-H/2)*.3):0)+(wall.length<2?clamp((ba.y-H/2)*.25,-30,30):0));
  const dcs=P.filter(p=>p.s==as&&!p.off&&p.k>=4&&p!==taker),decoy=dcs.length&&rnd()<.35?S.near(dcs,ba):null;if(decoy)S.tg(decoy,ba.x-u.x*8-u.y*32,ba.y-u.y*8+u.x*32);
  B.x=ba.x;B.y=ba.y;B.vx=B.vy=0;B.own=null;B.recv=null;S.sc={k:'fk',e,side:as,ph:'set',t:0,x:e.x,ba,taker,wall,wt,gk,u,decoy,tpos:{x:ba.x-u.x*26,y:ba.y-u.y*26},label:decoy?'TIRO LIBRE ENSAYADO':'TIRO LIBRE'};S.fx={n:S.n,x:ba.x,y:ba.y}}
 penSc(e,as){const S=this,{gx,dir,ds}=S.geo(as),P=S.P,B=S.B,ba={x:gx-dir*72,y:H/2},at=P.filter(p=>p.s==as&&!p.off&&p.k>=5),taker=(e.k=='pso'&&e.ti>=0&&P.find(p=>p.s==as&&p.k==e.ti&&!p.off))||S.near(at.length?at:P.filter(p=>p.s==as&&!p.off),ba);
  S.tg(taker,ba.x-dir*24,ba.y);let i=0;P.forEach(p=>{if(p===taker||p.off||p.k==0)return;S.tg(p,gx-dir*(125+(p.s==ds?16:0)),H/2+(((i++)%9)-4)*34)});
  const gk=P.find(p=>p.s==ds&&p.k==0&&!p.off);S.tg(gk,gx-dir*8,H/2);S.tg(P.find(p=>p.s==as&&p.k==0&&!p.off),gx-dir*300,H/2);
  B.x=ba.x;B.y=ba.y;B.vx=B.vy=0;B.own=null;B.recv=null;S.sc={k:'pen',e,side:as,ph:'set',t:0,x:e.x,ba,taker,gk,tpos:{x:ba.x-dir*24,y:ba.y},label:'PENAL'};S.fx={n:S.n,x:ba.x,y:ba.y}}
 corSc(e,as){const S=this,{gx,dir,ds}=S.geo(as),P=S.P,B=S.B,top=rnd()<.5,fl={x:gx-dir*4,y:top?Y0+4:Y0+FH-4},at=P.filter(p=>p.s==as&&!p.off&&p.k>=3),taker=S.near(at.length?at:P.filter(p=>p.s==as&&!p.off),fl),box=[];
  S.tg(taker,fl.x-dir*10,fl.y+(top?10:-10));const sty=S.T[as][0],el=P.filter(p=>p.s==as&&!p.off&&p!==taker&&p.k>0&&(p.k>=5||(p.l==1&&!p.fb&&p.k>=2&&p.k<=3)||(sty==2&&p.l>=1))).sort((a,b)=>b.k-a.k).slice(0,sty==0?3:sty==2?8:5);let i=0;P.forEach(p=>{if(p===taker||p.off||p.k==0)return;const j=i++;if(p.s==as&&el.includes(p)){S.tg(p,gx-dir*(40+(j%3)*26),H/2+((j%5)-2)*34);box.push(p)}else if(p.s==ds)S.tg(p,gx-dir*(34+(j%3)*24),H/2+((j%5)-2)*30);else S.tg(p,W/2-dir*40,H/2+((j%5)-2)*40)});
  const gk=P.find(p=>p.s==ds&&p.k==0&&!p.off);S.tg(gk,gx-dir*8,H/2);const cx0=fl.x-dir*6,cy0=fl.y+(top?6:-6),cd=Math.hypot(B.x-cx0,B.y-cy0),rt=(cd>60&&B.x>X0&&B.x<X0+FW&&B.y>Y0&&B.y<Y0+FH)?{x:cx0,y:cy0,v:Math.max(5,cd/34)}:null;if(!rt){B.x=cx0;B.y=cy0}B.vx=B.vy=0;B.own=null;B.recv=null;
  const sh=(box.length&&rnd()<.3)?S.near(box,fl):null;if(sh)S.tg(sh,fl.x-dir*55,fl.y+(top?45:-45));
  S.sc={k:'cor',e,side:as,ph:'set',t:0,x:e.x,taker,box,gk,sh,tpos:{x:fl.x-dir*10,y:fl.y+(top?10:-10)},label:sh?'CÓRNER CORTO':'CÓRNER',tk:0,rt};S.fx={n:S.n,x:cx0,y:cy0}}
 // la pelota salió: sigue rodando un instante afuera y se reanuda (lateral, saque de arco o córner según quién la tocó último)
 outBall(edge){const S=this,B=S.B;S.outN=(S.outN||0)+1;S.sc={k:'oob',t:0,edge,x:B.x,side:S.prev?S.prev.s:0};
  if(edge=='t'||edge=='b'){B.vx=B.vy=0;S.P.forEach(p=>{if(!p.off)S.tg(p,p.x+p.vx*6,p.y+p.vy*6)})}   // lateral: la pelota queda donde salió y todos frenan
  else{B.vx*=.45;B.vy*=.45}}
 oobStep(){const S=this,sc=S.sc;if(sc.t<24)return;S.sc=null;S.clr();
  if(sc.edge=='t'||sc.edge=='b'){S.outThrow(sc.x,sc.edge=='t');return}
  const ds=sc.edge=='l'?0:1;if(sc.side===ds){S.cornerN=(S.cornerN||0)+1;S.corSc({k:'cor',x:'c',t:1-ds},1-ds)}else S.gkSc(ds)}
 // saque de arco: el arquero la saca según la SALIDA (desde abajo: dos centrales al costado y laterales a la par; al centro: a los volantes; directo: pelotazo al 9)
 gkSc(ds){const S=this,B=S.B,P=S.P,sal=(S.T[ds][3])||0,gx0=ds?X0+FW:X0,dgx=ds?-1:1,gk=P.find(p=>p.s==ds&&p.k==0&&!p.off);
  if(!gk){B.own=P.find(p=>p.s==ds&&!p.off)||null;return}
  const sp={x:gx0+dgx*34,y:H/2+(rnd()<.5?-1:1)*14},mates=P.filter(p=>p.s==ds&&!p.off&&p.k>0),cbs=mates.filter(p=>p.l==1&&!p.fb),fbs=mates.filter(p=>p.fb),mids=mates.filter(p=>p.l==2),fws=mates.filter(p=>p.l==3),oy=p=>H/2+(p.hy0-.5)*300;
  S.tg(gk,sp.x-dgx*10,sp.y);
  if(sal==0){cbs.slice(0,2).forEach((p,j)=>S.tg(p,gx0+dgx*(j?62:42),H/2+(j?1:-1)*64));fbs.forEach(p=>S.tg(p,gx0+dgx*70,H/2+(p.hy0<.5?-1:1)*120));mids.forEach(p=>S.tg(p,gx0+dgx*(p.piv?125:180),oy(p)));fws.forEach(p=>S.tg(p,gx0+dgx*250,H/2+(p.hy0-.5)*220))}
  else if(sal==1){cbs.slice(0,2).forEach((p,j)=>S.tg(p,gx0+dgx*58,H/2+(j?1:-1)*80));fbs.forEach(p=>S.tg(p,gx0+dgx*105,H/2+(p.hy0<.5?-1:1)*140));mids.forEach(p=>S.tg(p,gx0+dgx*(p.piv?150:p.wide?260:190),H/2+(p.hy0-.5)*(p.wide?240:200)));fws.forEach(p=>S.tg(p,gx0+dgx*330,H/2+(p.hy0-.5)*200))}
  else{cbs.slice(0,2).forEach((p,j)=>S.tg(p,gx0+dgx*70,H/2+(j?1:-1)*90));fbs.forEach(p=>S.tg(p,gx0+dgx*150,H/2+(p.hy0<.5?-1:1)*150));mids.forEach(p=>S.tg(p,gx0+dgx*290,H/2+(p.hy0-.5)*250));fws.forEach(p=>S.tg(p,gx0+dgx*410,H/2+(p.hy0-.5)*180))}
  P.forEach(z=>{if(z.s!==ds&&!z.off&&z.k>0)S.tg(z,gx0+dgx*(z.l==3?(sal==0?150:240):300),H/2+(z.hy0-.5)*300)});   // los rivales esperan afuera del área
  B.x=sp.x;B.y=sp.y;B.vx=B.vy=0;B.own=null;B.recv=null;B.free=false;S.poss=ds;S.gkN=(S.gkN||0)+1;
  S.sc={k:'gk',side:ds,ph:'set',t:0,gk,sp,sal,label:'SAQUE DE ARCO',tpos:{x:sp.x-dgx*10,y:sp.y}};S.fx={n:S.n,x:sp.x,y:sp.y}}
 gkKick(){const S=this,sc=S.sc,ds=sc.side,sal=sc.sal,mates=S.P.filter(p=>p.s==ds&&!p.off&&p.k>0);let tgt,sp=3.6;
  if(sal==0){const cbs=mates.filter(p=>p.l==1&&!p.fb),rv=S.P.filter(z=>z.s!==ds&&!z.off),od=c=>Math.min(...rv.map(z=>dist(z,c)));tgt=cbs.length?cbs.slice().sort((a,b)=>od(b)-od(a))[0]:mates[0]}
  else if(sal==1){const ms=mates.filter(p=>p.l==2),pl=ms.filter(p=>!p.wide),rv=S.P.filter(z=>z.s!==ds&&!z.off),od=c=>Math.min(...rv.map(z=>dist(z,c)));tgt=(pl.length?pl:(ms.length?ms:mates)).slice().sort((a,b)=>od(b)-od(a))[0];sp=4.8}
  else{const f=mates.filter(p=>p.l==3),rv=S.P.filter(z=>z.s!==ds&&!z.off),od=c=>Math.min(160,...rv.map(z=>dist(z,c)));tgt=f.slice().sort((a,b)=>(od(b)*.6-Math.abs(b.y-H/2)*.4)-(od(a)*.6-Math.abs(a.y-H/2)*.4))[0]||mates[0];sp=6.2;S.crossT=S.n;S.crossD=dist(sc.gk,tgt)/(sp*S.vs);S.directN=(S.directN||0)+1;S.counter={s:ds,t:S.n+150}}
  sc.ph='go';sc.wait=tgt;sc.tk=sc.t;S.kickAt(tgt,sp*S.fs,sal==2?1.1:.6);if(sal==2)S.setSB(ds,tgt);S.clr();if(sal==1)S.counter={s:ds,t:S.n+90}}   // todos arrancan: los que atacan suben y los que defienden retroceden
 outThrow(x,top){const S=this,B=S.B,tk=1-S.prev.s;B.x=clamp(B.x,X0+16,X0+FW-16);B.vx=B.vy=0;B.own=null;B.recv=null;B.free=false;S.latSc({k:'lat'},tk);S.poss=tk;S.throwN=(S.throwN||0)+1;S.thr[tk]++}   // la pelota salió del campo: saque de banda para el rival
 latSc(e,as){const S=this,{dir}=S.geo(as),P=S.P,B=S.B,top=B.y<H/2,lx=clamp(B.x,X0+16,X0+FW-16),ly=top?Y0+3:Y0+FH-3,sg=top?1:-1,at=P.filter(p=>p.s==as&&!p.off&&p.k>0),taker=S.near(at,{x:lx,y:ly});if(!taker)return;
  const tpos={x:lx,y:top?Y0+R:Y0+FH-R};S.tg(taker,tpos.x,tpos.y);taker.vmx=3.3;
  const ref={x:lx+dir*50,y:ly+sg*70},opts=(at.filter(p=>p!==taker).length?at.filter(p=>p!==taker):P.filter(p=>p.s==as&&!p.off&&p!==taker)).sort((a,b)=>dist(a,ref)-dist(b,ref)).slice(0,3);opts.forEach((p,j)=>S.tg(p,lx+dir*(45+j*38),ly+sg*(80+j*32)));
  let i=0;P.forEach(p=>{if(p.s!==as&&!p.off&&p.k>0){const j=(i++)%3;S.tg(p,lx+dir*(70+j*35),ly+sg*(60+j*30))}});
  let rt=null;if(Math.abs(B.y-ly)>30||Math.abs(B.x-lx)>30){const ld=Math.hypot(B.x-lx,B.y-ly);if(ld>40&&B.x>X0&&B.x<X0+FW&&B.y>Y0&&B.y<Y0+FH)rt={x:lx,y:ly,v:Math.max(5,ld/34)};else{B.x=lx;B.y=ly}}   // solo se reubica si la pelota estaba lejos de la línea (jugada pedida desde afuera)
  B.vx=B.vy=0;B.own=null;B.recv=null;S.sc={k:'lat',e,side:as,ph:'set',t:0,taker,opts,tpos,label:'LATERAL',rt};S.fx={n:S.n,x:lx,y:ly}}
 latFoul(p){const S=this;S.latLock=null;S.latFoulN=(S.latFoulN||0)+1;S.clr();S.foulSc({},1-p.s,'SAQUE: DOBLE TOQUE')}   // el que sacó volvió a tocarla antes que otro: tiro libre indirecto para el rival (no hay gol directo de saque de banda: la pelota no puede entrar al arco en esta jugada)
 shotSp(){const S=this,sc=S.sc,B=S.B,{gx,dir}=S.geo(sc.side),gk=sc.gk,x=sc.x,sg=rnd()<.5?-1:1,fs=S.fs;B.own=null;
  if(sc.k=='pen'&&gk){gk.x=gx-dir*10;gk.y=H/2+(x=='g'?-sg:sg)*(x=='o'?0:30);gk.vx=gk.vy=0}   // el arquero se tira
  if(x=='g'){sc.ph='g';sc.wait=null;B.free=true;const ty=H/2+sg*(sc.k=='pen'?28:30+rnd()*8);S.markShot('g',gx+dir*18,ty);S.kick(gx+dir*18,ty,(sc.k=='pen'?8.6:8)*fs,null,0);if(gk&&sc.k=='fk'){S.tg(gk,gx-dir*8,ty-Math.sign(ty-H/2)*16);gk.vmx=2.6}}
  else if(x=='s'){sc.ph='s';sc.wait=gk;const ty=clamp((gk?gk.y:H/2)+(sc.k=='pen'?0:sg*(16+rnd()*14)),GY0+8,GY1-8),tx=gx-dir*10;S.markShot('s',tx,ty);S.kick(tx,ty,7.2*fs,gk,0);if(gk&&sc.k!='pen'){S.tg(gk,tx,ty);gk.vmx=3.8}}
  else if(x=='w'){const w=sc.wall[Math.floor(sc.wall.length/2)]||sc.wall[0];sc.ph='w';sc.wait=w;S.markShot('w',w.x,w.y);S.kickAt(w,7.2*fs)}
  else{const ty=rnd()<.5?GY0-34:GY1+34;sc.ph='o';sc.t2=S.n;sc.wait=null;S.markShot('o',gx,ty);S.kick(gx,ty,7.6*fs,null,0);B.free=true}}
 script(){const S=this,sc=S.sc,B=S.B,ph=sc.ph;sc.t++;
  if(sc.t>520){S.endSc();B.free=false;if(!B.own)B.own=S.P.find(p=>!p.off);return}
  if(sc.shooter&&sc.shooter.off){const nw=S.near(S.P.filter(p=>p.s==sc.shooter.s&&!p.off&&p.k>0),B);S.endSc();if(nw){B.own=nw;nw.hold=0}return}   // el que iba a rematar fue expulsado: la jugada termina y sigue otro compañero
  if(sc.wait&&sc.wait.off){const nw=S.near(S.P.filter(p=>p.s==sc.wait.s&&!p.off&&p.k>0),B);if(nw)sc.wait=nw}
  sc.fr=B.own?0:(sc.fr||0)+1;if(sc.wait&&!B.own&&(Math.hypot(B.vx,B.vy)<.5||sc.fr>90)){if((sc.stk=(sc.stk||0)+1)>20||sc.fr>90){S.tg(sc.wait,B.x,B.y);sc.wait.vmx=3.4};if(sc.fr>90&&dist(sc.wait,B)<42){B.own=sc.wait;sc.wait.hold=0;B.recv=null;B.vx=B.vy=0;sc.fr=0}}else sc.stk=0;
  if(sc.k=='inc'){S.incStep();return}
  if(sc.k=='oob'){S.oobStep();return}
  if(sc.k=='gk'){if(ph=='set'){if(sc.t>=42&&S.reach(sc.gk,sc.tpos,14,42,60,sc)){sc.ph='wait';sc.tw=sc.t}}else if(ph=='wait'){if(sc.t-sc.tw>=20)S.gkKick()}else if(ph=='go'){if(B.own===sc.wait){S.endSc();S.build={s:sc.side,t:S.n+320}}else if(!B.own&&sc.t-sc.tk>80){B.own=sc.wait;sc.wait.hold=0;S.endSc()}}return}
  if(ph=='rec'){S.recStep();return}
  if(ph=='g'){if(!sc.in&&(B.x<X0-4||B.x>X0+FW+4)){sc.in=true;sc.t2=S.n;S.goalN++;if(S.onGoal)S.onGoal(sc.side,sc.e.n,sc.e)}if(sc.in&&!sc.rpd&&S.n-sc.t2>=100&&S.noRush&&!S.pso&&S.rbn&&S.P.length>=22&&S.rpOn!==false){sc.rpd=1;S.startReplay(sc);return}if(sc.in&&S.n-sc.t2>105)S.kickoff(1-sc.side,!S.pso);return}
  if(ph=='s'){if(B.own===sc.gk)S.endSc();return}
  if(ph=='o'){if(!sc.in&&(B.x<X0-4||B.x>X0+FW+4)){sc.in=true;sc.t2=S.n}if(sc.in&&S.n-sc.t2>24){B.free=false;const sd=1-sc.side;S.endSc();S.gkSc(sd);return}if(!sc.in&&S.n-sc.t2>150){B.own=sc.gk;B.free=false;S.endSc()}return}   // remate desviado: la pelota pasa la línea de fondo y es saque de arco
  if(ph=='w'||ph=='l'){if(B.own===sc.wait)S.endSc();return}
  if(ph=='adv'){const o=sc.shooter;if(B.own===o){const u=sc.side?1-(o.x-X0)/FW:(o.x-X0)/FW;if((u>=.8&&S.shotOK(o,sc.side))||sc.t-sc.tk>220){o.tg=null;sc.ph='c';sc.adv=2;S.finish()}}else if(!B.own&&sc.t-sc.tk>40){B.own=o;o.hold=0}return}
  if(sc.k=='att'){const crR=!(sc.cr&&sc.i==sc.ch.length-2)||!sc.ws||!B.own||dist(B.own,sc.ws)<28||sc.t-sc.tk>150;if(B.own===sc.wait&&B.own.hold>=6&&crR){sc.i++;if(sc.i<sc.ch.length){sc.wait=sc.ch[sc.i];sc.tk=sc.t;if(sc.x=='f'&&sc.i==sc.ch.length-1){const df=S.P.filter(p=>p.s==1-sc.side&&!p.off&&p.k>0),lx=sc.side?Math.min(...df.map(p=>p.x)):Math.max(...df.map(p=>p.x));S.tg(sc.wait,lx+(sc.side?-1:1)*26,sc.wait.y);sc.wait.vmx=3.2}S.socScene(sc,B.own);if(sc.cr&&sc.i==sc.ch.length-2&&sc.i>0)S.crSet(sc);if(sc.cr&&sc.i==sc.ch.length-1)S.cross(B.own,sc.wait);else S.kickAt(sc.wait,S.psp(dist(sc.wait,B)))}else S.finish()}
   else if(!B.own&&sc.t-sc.tk>70){if(!sc.re&&dist(sc.wait,B)>R*2.2){sc.re=1;sc.tk=sc.t-38;S.kickAt(sc.wait,clamp(dist(sc.wait,B)/22,5,8)*S.fs)}else{B.own=sc.wait;sc.wait.hold=0}}}   // si el pase se frenó antes de llegar, se vuelve a tocar hacia el receptor (no se le entrega de golpe)
  else if(sc.k=='fk'||sc.k=='pen'){const T=sc.k=='fk'?[95,36,8]:[95,42,8];
   if(ph=='set'){if(sc.t>=T[0]&&S.reach(sc.taker,sc.tpos,12,T[0],90,sc)){sc.ph='wait';sc.tw=sc.t;S.fx={n:S.n,x:sc.ba.x,y:sc.ba.y};if(sc.wt)sc.wall.forEach((p,j)=>{if(dist(p,sc.wt[j])<30){p.x=sc.wt[j].x;p.y=sc.wt[j].y;p.vx=p.vy=0}})}}
   else if(ph=='wait'){if(sc.t-sc.tw>=T[1]){sc.ph='run';sc.tr=sc.t;S.tg(sc.taker,sc.ba.x,sc.ba.y);if(sc.decoy)S.tg(sc.decoy,sc.ba.x+sc.u.x*50,sc.ba.y+sc.u.y*50)}}
   else if(ph=='run'){if(sc.t-sc.tr>=T[2]&&S.reach(sc.taker,sc.ba,R+4,sc.tr,45,sc))S.shotSp()}}
  else if(sc.k=='lat'){
   if(ph=='set'){if(sc.t>=40&&!sc.rt&&S.reach(sc.taker,sc.tpos,8,40,150,sc)){sc.ph='hold';sc.th=sc.t;B.own=sc.taker;sc.taker.hold=0;sc.taker.fx=S.geo(sc.side).dir;sc.taker.fy=0}}
   else if(ph=='hold'){if(sc.t-sc.th>=30){sc.ph='lt';sc.wait=sc.opts[0]||sc.taker;sc.tk=sc.t;S.latLock={p:sc.taker};S.prev=sc.taker;sc.taker.cool=14;B.own=null;S.crossT=S.n;S.crossD=dist(sc.wait,B)/(4.2*S.fs*S.vs);S.kickAt(sc.wait,4.2*S.fs)}}
   else if(ph=='lt'){if(B.own===sc.wait){if(sc.wait===sc.taker)S.latFoul(sc.taker);else{S.latLock=null;S.endSc()}}else if(!B.own&&sc.t-sc.tk>70){B.own=sc.wait;sc.wait.hold=0}}}
  else if(sc.k=='cor'){
   if(ph=='set'){if(sc.t>=90&&S.reach(sc.taker,sc.tpos,16,90,90,sc)){sc.ph='wait';sc.tw=sc.t;S.fx={n:S.n,x:B.x,y:B.y}}}
   else if(ph=='wait'){if(sc.t-sc.tw>=40){if(sc.sh){sc.ph='sh';sc.wait=sc.sh;sc.tk=sc.t;S.kickAt(sc.sh,3.8*S.fs)}else S.cornerCross()}}
   else if(ph=='sh'){if(B.own===sc.sh){if(!sc.th)sc.th=sc.t;if(sc.t-sc.th>=26)S.cornerCross()}else if(!B.own&&sc.t-sc.tk>70){B.own=sc.sh;sc.sh.hold=0}}
   else if(ph=='cx'){if(B.own===sc.tgt){const{gx,dir}=S.geo(sc.side);if(sc.x=='g'){sc.ph='g';sc.wait=null;B.free=true;B.own=null;const ty2=H/2+(rnd()-.5)*50;S.markShot('g',gx+dir*18,ty2);S.kick(gx+dir*18,ty2,8*S.fs,null,0)}else{S.kick(W/2,H/2+(rnd()-.5)*200,6.2*S.fs,null);S.endSc()}}
    else if(!B.own&&sc.t-sc.tk>70){B.own=sc.tgt;sc.tgt.hold=0}}}}
 step(){const S=this,B=S.B,P=S.P;S.n++;if(!P.length||S.frozen)return;if(S.rp){S.rpStep();return}S.recF();if(S.sc&&S.sc.rt)S.rollStep();if(S.ko&&S.n>=S.ko.t){const o=S.ko.o;S.ko=null;S.clr();o.x=W/2+(o.s?14:-14);o.y=H/2;o.cool=0;B.own=o;S.poss=o.s;o.hold=0;o.wait=24}if(S.pso&&!S.sc&&!S.q.length)return;   // tanda de penales: entre un penal y otro la cancha queda quieta
 
  if(!S.sc){if(S.gap>0)S.gap--;else if(S.q.length)S.begin()}
  if(S.sc&&S.sc.k=='foul'){const sc=S.sc;if(++sc.t>=30){const{dir}=S.geo(sc.side),c=S.near(P.filter(p=>p.s==sc.side&&!p.off&&p.k>0),B);if(c){c.x=clamp(B.x-dir*14,X0+R,X0+FW-R);c.y=B.y;B.own=c;c.hold=0;c.wait=18}S.endSc()}return}
  if(S.sc)S.script();if(S.sc&&S.sc.ph=='g'&&S.sc.in)return;S.lift=(S.sc&&S.sc.k=='lat'&&B.own===S.sc.taker)?9:0;if(S.n%1200==0&&!S.sc)S.swapRoles();if(S.n%720==0)S.fbSide=[Math.round(rnd()),Math.round(rnd())];if(S.n%20==0)S.assignMarks();if(S.n%6==0)S.calcSup();if(S.refs)S.stepRefs();
  const bnx=(B.x-X0)/FW,bny=(B.y-Y0)/FH,near=[null,null],nd=[1e9,1e9],near2=[null,null],nd2=[1e9,1e9];
  P.forEach(p=>{if(p.off||p.k==0)return;const d=dist(p,B);if(d<nd[p.s]){nd2[p.s]=nd[p.s];near2[p.s]=near[p.s];nd[p.s]=d;near[p.s]=p}else if(d<nd2[p.s]){nd2[p.s]=d;near2[p.s]=p}});
  const LL=[0,1].map(s=>{const o=P.filter(z=>z.s!==s&&!z.off&&z.k>0);return o.length?(s?Math.min(...o.map(z=>z.x)):Math.max(...o.map(z=>z.x))):null});
  P.forEach(p=>{if(p.off)return;if(p.swpT&&S.n>=p.swpT){p.hy=p.hy0;p.swpT=0;p.wide=p.l>=2&&Math.abs(p.hy0-.5)>.22}let tx,ty,vm=p.l==0?1.5:1.9;const tt=S.T[p.s];
   if(p.k==0){const gx0=p.s?X0+FW:X0,dgx=p.s?-1:1,bd=Math.abs(B.x-gx0),rival=B.own&&B.own.s!==p.s,adv=rival?clamp((260-bd)*.28,0,64):clamp((200-bd)*.1,0,16);   // achica hasta el borde del área
     tx=gx0+dgx*(14+adv);const side=clamp((B.y-H/2)/(bd*.5+70),-1,1);ty=H/2+side*(rival?42:30)+Math.sin(S.n/20+p.s*2)*6;vm=2.2+S.sv(p,'ref')/400;   // tapa el palo del lado de la pelota y nunca está quieto
     if(B.own===p){tx=gx0+dgx*30;ty=H/2+Math.sin(S.n/30)*14;vm=1.2}
     else if((tt[3]||0)==0&&B.own&&B.own.s===p.s&&B.own.k>0&&Math.abs(B.x-gx0)<.42*FW&&!S.sc){tx=gx0+dgx*(46+Math.min(20,bd*.05));ty=H/2+clamp((H/2-B.y)*.5,-34,34);vm=1.9}   // jugando desde abajo: el arquero es un jugador más y ofrece un ángulo de pase
     else if(!B.own&&!S.sc&&dist(p,B)<170&&dist(p,B)<nd[1-p.s]){tx=B.x;ty=B.y;vm=3}}   // sale a cortar balones largos y pases al vacío
   else{const att=S.poss==p.s,bu=p.s?1-bnx:bnx,wl=[0,.6,.78,.9][p.l],adv=[.7,1,1.35][tt[0]];
    let ux=att?p.hx+wl*(bu*(((tt[3]||0)==0)?.72:((tt[3]||0)==2?.82:.55))*adv-.08):p.hx+wl*(bu-.55)*.35+wl*(([-.09,0,.09][tt[1]])-(tt[0]==0?.07:0));ux=clamp(ux+wl*((tt[0]==2?.07:0)+(tt[0]==1&&p.l==2&&!p.piv?.05*Math.sin(S.n/170+p.k):0))+wl*(S.mode(p.s)=='protect'?-.07:S.mode(p.s)=='chase'?.06:0),.05,p.l==3?.93:.85);
    let uy=clamp(p.hy+(bny-p.hy)*(att?.16:.16*[.85,1.15,1.4][tt[1]])*Math.min(1,wl+.25),.05,.95);if(att&&tt[2]&&p.l>=2)uy=clamp(uy+(p.hy<.5?-1:1)*.16,.06,.94);
    if(p.wide||p.fb){const sd=p.hy0<.5?-1:1,sameSide=(bny<.5)==(p.hy0<.5);uy=clamp(p.hy0+sd*(att?(sameSide?.1:0):(sameSide?.02:-.04)),.07,.93)}
    if(!att&&B.own&&B.own.s!==p.s&&bu<.45){if(p.l==1)ux=Math.min(ux,Math.max(.08,bu-.01));if(p.l<=2&&!p.wide&&!p.fb)uy=clamp(uy+(.5+(bny-.5)*.55-uy)*.32*(bu<.3?1.2:.8),.06,.94)}   // zona peligrosa: los centrales no se pasan de la pelota y cierran el centro
    tx=X0+(p.s?1-ux:ux)*FW;ty=Y0+uy*FH;const ax=tx,ay=ty;p.zax=ax;p.zay=ay;
    if(S.counter&&S.counter.s===p.s&&S.n<S.counter.t&&att&&p.l>=2&&B.own!==p){const u2=p.wide?.82:.76;tx=X0+(p.s?1-u2:u2)*FW;if(p.wide)ty=Y0+(p.hy<.5?.1:.9)*FH;vm=2.6}
    if(att&&p.fb&&tt[0]>0&&(tt[0]==2||((p.hy0<.5)==(S.fbSide[p.s]==0)))&&bu>.5&&B.own!==p&&!p.tg){tx=X0+(p.s?1-.74:.74)*FW;ty=Y0+(p.hy<.5?.07:.93)*FH;vm=2.4}   // lateral llegador: sube por la banda hasta el fondo
    const og=p.s?1:-1;   // sentido hacia su propio arco
    if(!att&&!p.tg&&B.own!==p){const mk=S.mkm[p.s].get(p),car=B.own&&B.own.s!==p.s?B.own:B;   // cada marcador con su par: se para en la línea de pase entre el rival y la pelota
     const man=(tt[4]||0)==1;
     if(mk&&man){const fat=1-clamp((S.ctx.min-60)/30,0,1)*.12,kk=.07*clamp(.6+S.sv(p,'ant')/100,.8,1.5);   // al hombre: pegado a su par, del lado de su arco, aunque se vaya lejos; se cansa con los minutos
      if(B.recv===mk&&dist(mk,B)<150){tx=mk.x+(B.x-mk.x)*.32;ty=mk.y+(B.y-mk.y)*.32}else{tx=mk.x+(car.x-mk.x)*kk+og*18;ty=mk.y+(car.y-mk.y)*kk}
      vm=(dist(mk,p)>60?2.6:2.3)*fat}
     else if(mk&&bu<.8&&Math.hypot((mk.x-ax)*.8,(mk.y-ay)*1.25)<(p.l==1?(p.fb?120:107):133)){const kk=.14*clamp(.6+S.sv(p,'ant')/100,.8,1.5),ly=mk.y+(car.y-mk.y)*kk;tx=mk.x+(car.x-mk.x)*kk+og*(p.l==1?16:10);ty=ly*.6+ty*.4;vm=2.2}   // zonal: toma al que entra en su parcela
     if(!man&&p.dub>S.n){tx=ax;ty=ay;vm=1.2}}
    if(p.piv&&B.own!==p&&!p.tg){   // el 5: se ofrece en la salida, tapa delante de los centrales y presiona
     if(S.build&&S.build.s===p.s){tx=X0+(p.s?1-.24:.24)*FW;ty=H/2+clamp((B.y-H/2)*.2,-30,30);vm=2.2}
     else if(!att){tx=X0+(p.s?1-.31:.31)*FW;ty=Y0+clamp(bny,.25,.75)*FH;vm=2.2}
     else{const ux2=clamp(bu-.2,.34,.62);tx=X0+(p.s?1-ux2:ux2)*FW;ty=Y0+(bny*.5+.25)*FH;vm=1.9}}
    if(S.build&&S.build.s===p.s&&(tt[3]||0)==0&&p.l==1&&!p.fb&&!p.tg&&B.own!==p&&bu<.3&&B.own&&B.own.s===p.s&&B.own.l<=1){const sb=(B.y<H/2)===(p.hy0<.5),ux3=sb?.185:.105;tx=X0+(p.s?1-ux3:ux3)*FW;ty=Y0+(p.hy0<.5?.3:.7)*FH;vm=2.2}   // salida desde abajo: los centrales abiertos al lado del arquero
    if(S.build&&S.build.s===p.s&&(tt[3]||0)==0&&p.fb&&!p.tg&&B.own!==p&&B.own&&B.own.s===p.s&&B.own.l<=1&&bu<.3){const sb=(B.y<H/2)===(p.hy0<.5),ux3=sb?.31:.22;tx=X0+(p.s?1-ux3:ux3)*FW;ty=Y0+(p.hy0<.5?.12:.88)*FH;vm=2.2}
    if(S.build&&S.build.s===p.s&&(tt[3]||0)==1&&!p.tg&&B.own!==p&&bu<.4&&B.own&&B.own.s===p.s&&B.own.l<=1){   // al centro: se agrupan cerca del arquero; un volante se retrasa a ofrecer línea y el otro fija al rival; los laterales se abren
     if(p.l==2&&!p.piv&&!p.wide){const dm=S.P.filter(q=>q.s===p.s&&!q.off&&q.l==2&&!q.piv&&!q.wide).sort((a,b)=>dist(a,B)-dist(b,B))[0];if(p===dm){tx=X0+(p.s?1-.25:.25)*FW;ty=H/2+clamp((B.y-H/2)*.35,-60,60);vm=2.3}else{tx=X0+(p.s?1-.4:.4)*FW;ty=H/2+(p.hy0-.5)*160;vm=2}}
     else if(p.fb){tx=X0+(p.s?1-.3:.3)*FW;ty=Y0+(p.hy0<.5?.1:.9)*FH;vm=2.2}}
    if(att&&B.own&&B.own!==p&&B.own.s===p.s&&(p.l==3||p.wide)&&!p.tg&&LL[p.s]!=null){
     if(p.runUntil>S.n){tx=LL[p.s]+(p.s?-1:1)*38;ty=Y0+Math.max(.1,Math.min(.9,p.hy+(.5-p.hy)*.25))*FH;vm=2.8;S.run={p,t:p.runUntil}}      // pica al vacío, a la espalda de la defensa
     else if(S.n>(p.runCool||0)&&B.own.hold>6&&rnd()<.012*(.55+S.sv(p,'des')/110)&&(p.s?p.x>LL[1]+10:p.x<LL[0]-10)&&dist(B.own,p)>60){p.runUntil=S.n+55;p.runCool=S.n+170;S.runN=(S.runN||0)+1}}
    if(att&&B.own&&B.own!==p&&B.own.s===p.s&&!p.tg&&!(p.runUntil>S.n)&&S.sup&&S.sup[p.s]&&S.sup[p.s].has(p)){const q=S.supPoint(B.own,p,tx,ty);if(q){tx=q.x;ty=q.y;vm=2.2;p.sp=1}}else p.sp=0
    if(B.own===p){{const blk=P.some(z=>z.s!==p.s&&!z.off&&z.k>0&&Math.abs(z.y-p.y)<48&&(p.s?-1:1)*(z.x-p.x)>0&&(p.s?-1:1)*(z.x-p.x)<92);if(blk){tx=p.x+p.fx*10;ty=p.y+(p.y<H/2?1:-1)*28;vm=1.5}else{const sp0=(p.s?-1:1);p.fr=p.k>0&&p.l>=1&&bu<.72&&S.mode(p.s)=='normal'&&!P.some(z=>z.s!==p.s&&!z.off&&sp0*(z.x-p.x)>-6&&dist(z,p)<115&&Math.abs(z.y-p.y)<62);if(p.hold<=1)p.ex=0;tx=p.x+p.fx*22;ty=p.y+p.fy*22;vm=(p.fr?1.9:1.4)*(1+.1*Math.sin(S.n/13+p.k))}}   // juega para el costado si lo marcan, sin salir corriendo
     if(S.mode(p.s)=='protect'&&bu>.55){tx=X0+(p.s?.05:.95)*FW;ty=p.y<H/2?Y0+36:Y0+FH-36;vm=1.5}}   // si va ganando, conduce al córner y aguanta
    else if(B.recv===p||(S.sc&&S.sc.wait===p)){tx=B.x+B.vx*10;ty=B.y+B.vy*10;vm=3}
    else if(S.runner&&S.runner.p===p&&S.n<S.runner.t&&B.own&&B.own.s===p.s){const o=B.own,d=p.s?-1:1;if(S.runner.ov){tx=clamp(o.x+d*105,X0,X0+FW);ty=p.y<H/2?Y0+26:Y0+FH-26;vm=Math.max(vm||0,2.9)}else{tx=clamp(o.x+d*80,X0,X0+FW);ty=o.y+(H/2-o.y)*.3+(p.y<o.y?-25:25)}}
    else if(near[p.s]===p&&(!B.own||B.own.s!==p.s)){if(B.own&&B.own.s!==p.s&&nd[p.s]>[150,230,340][tt[1]]){}   // lejos: no sale al choque, cuida su posición
     else if(p.yel&&B.own){tx=B.x+(p.s?1:-1)*30;ty=B.y;vm=2}else{tx=B.x+B.vx*6;ty=B.y+B.vy*6;vm=2.4}}
    else if(near2[p.s]===p&&B.own&&B.own.s!==p.s&&bu<[.3,.55,.75][tt[1]]){tx=(B.x+(p.s?X0+FW:X0))/2;ty=B.y;vm=2.1}   // segundo marcador: cubre
    else if(att&&B.own&&B.own!==p&&p.l>=2)tx+=(p.s?-1:1)*30
    if(!att&&!p.tg&&B.own&&B.own.s!==p.s&&near[p.s]!==p&&!((tt[4]||0)==1&&S.mkm[p.s].get(p))){const cx=tx-B.own.x,cy=ty-B.own.y,cd=Math.hypot(cx,cy)||1;if(cd<130){tx=B.own.x+cx/cd*130;ty=B.own.y+cy/cd*130}}
    {const prs=near[p.s]===p&&(!B.own||B.own.s!==p.s),exm=B.own===p||B.recv===p||(S.sc&&S.sc.wait===p)||prs||p.runUntil>S.n||p.sp;
     if(!exm&&!p.tg){const mf=(!att&&S.mkm[p.s].get(p))?((tt[4]||0)==1?3.6:.85):1,rx=mf*(p.fb?85:p.piv?70:p.l==1?46:p.l==2?92:p.l==3?105:100)*(att?1.3:1)*(S.counter&&S.counter.s===p.s&&S.n<S.counter.t?1.6:1),ry=mf*((p.l==1&&!p.fb)?52:p.l==3?66:p.fb?48:p.piv?52:p.wide?52:58);tx=clamp(tx,ax-rx,ax+rx);ty=clamp(ty,ay-ry,ay+ry)}}}   // cada uno cumple su tarea sin alejarse de su posición: centrales cortos, laterales por la banda, volantes en su zona, delanteros arriba   // solo uno presiona: los demás cuidan su posición sin amontonarse sobre el que la tiene
   if(!p.tg&&p.k>0&&B.own!==p&&B.recv!==p&&!(S.sc&&S.sc.wait===p)&&!(near[p.s]===p&&(!B.own||B.own.s!==p.s))){for(const q of P){if(q===p||q.s!==p.s||q.off||q.k==0)continue;const qx=tx-q.x,qy=ty-q.y,qd=Math.hypot(qx,qy),lm=q.l>=2&&p.l>=2?68:q.l==p.l?58:48;if(qd<lm&&qd>.01){const k=(lm-qd)*.9/qd;tx+=qx*k;ty+=qy*k}else if(qd<=.01){tx+=6}}tx=clamp(tx,X0+R,X0+FW-R);ty=clamp(ty,Y0+R,Y0+FH-R)}
   if(S.sb&&S.n<S.sb.t&&!p.tg&&p.k>0&&B.own!==p&&p!==S.sb.tg){const sb=S.sb;   // segunda pelota
    if(p.s===sb.s){if(p.l>=2){const a=(p.k*1.9)%6.28,r2=36+(p.k%4)*9;tx=sb.x+Math.cos(a)*r2;ty=sb.y+Math.sin(a)*r2;vm=2.7}}else if(sb.def&&sb.def.includes(p)){tx=sb.x;ty=sb.y;vm=2.6}}
   if(p.tg){const mv=S.sc&&(S.sc.k=='gk'||S.sc.k=='lat'||S.sc.k=='cor')&&p.k>0&&dist(p,p.tg)<14;tx=p.tg.x+(mv?Math.sin(S.n/23+p.k*1.7)*5:0);ty=p.tg.y+(mv?Math.cos(S.n/29+p.k*2.3)*5:0);vm=p.vmx||2.7}
   const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy)||1,sp=Math.min(vm,d*.1);p.vx+=(dx/d*sp-p.vx)*.2;p.vy+=(dy/d*sp-p.vy)*.2;
   p.x=clamp(p.x+p.vx,X0+R,X0+FW-R);p.y=clamp(p.y+p.vy,Y0+R,Y0+FH-R);if(p.cool>0)p.cool--;
   if(B.own===p){const gx=p.s?X0:X0+FW,ax=gx-p.x,ay=(H/2-p.y)*.6;let da=Math.atan2(ay,ax);   // conducción fluida: el rumbo gira de a poco, zigzaguea suave y esquiva al que lo marca de frente
    const mk=S.near(P.filter(z=>z.s!==p.s&&!z.off&&z.k>0),p);if(mk&&dist(mk,p)<95)da+=Math.sign((p.y-mk.y)||(p.k%2?1:-1))*(1-dist(mk,p)/95)*.9;
    da+=Math.sin(S.n/27+p.k*1.7)*.5*(.35+S.sv(p,'reg')/100);if(p.hd==null)p.hd=Math.atan2(p.fy||0,p.fx||(p.s?-1:1));
    let df=da-p.hd;df=Math.atan2(Math.sin(df),Math.cos(df));p.hd+=df*.07;p.fx=Math.cos(p.hd);p.fy=Math.sin(p.hd)}
   else{const v=Math.hypot(p.vx,p.vy);if(v>.3){p.fx=p.vx/v;p.fy=p.vy/v}}});
  for(let i=0;i<P.length;i++){const a=P[i];if(a.off)continue;for(let j=i+1;j<P.length;j++){const b=P[j];if(b.off)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
   const wl=S.sc&&S.sc.k=='fk'&&S.sc.wall,lim=a.s===b.s?(wl&&wl.includes(a)&&wl.includes(b)?R*2.02:R*2.9):R*1.8;if(d<lim&&d>.01){const f=(lim-d)/2/d;a.x-=dx*f*.5;a.y-=dy*f*.5;b.x+=dx*f*.5;b.y+=dy*f*.5}}}
  if(S.pend){const pd=S.pend,o=pd.o;if(B.own!==o||S.sc||o.off)S.pend=null;else{let df=pd.ang-o.hd;df=Math.atan2(Math.sin(df),Math.cos(df));o.hd+=clamp(df,-.34,.34);o.fx=Math.cos(o.hd);o.fy=Math.sin(o.hd);o.vx*=.6;o.vy*=.6;
    if(Math.abs(df)<.32||S.n-pd.t>16){S.pend=null;const a=pd.args;if(pd.r0&&a[3]){a[0]+=a[3].x-pd.r0.x;a[1]+=a[3].y-pd.r0.y}S.cap=o;o.xk=1;try{S.kick(a[0],a[1],a[2]/S.vs,a[3],a[4])}finally{o.xk=0;S.cap=null}}}}
  if(B.own){const o=B.own;if(o.off)B.own=null;else{const tc=Math.sin(S.n/5.5+o.k)*2.2,ts=Math.sin(S.n/9+o.k)*2.5,tx0=o.x+o.fx*(R+BR+tc)-o.fy*ts,ty0=o.y+o.fy*(R+BR+tc)+o.fx*ts,kk=o.hold<8?.4:1;const lt=S.sc&&S.sc.k=='lat'&&o===S.sc.taker,bx0=lt?o.x:tx0,by0=lt?o.y+(o.y<H/2?-1:1)*(R+BR-3):ty0;B.x+=(bx0-B.x)*kk;B.y+=(by0-B.y)*kk;B.vx=B.vy=0;B.cv=0;S.poss=o.s;o.hold++;if(!S.sc){const dd=S.near(P.filter(z=>z.s!==o.s&&!z.off&&z.k>0&&z.cool<=0),o),fixB=(S.T[o.s][3]||0)==0&&S.build&&S.build.s===o.s&&o.l<=2;if(dd&&dist(dd,o)<R*2.3){const t2=S.T[dd.s];if(rnd()<.0045*(t2[0]==0?1.8:t2[0]==2?.8:1)*[.8,1,1.35][t2[1]]*(dd.yel?.25:1)*clamp(1+(S.sv(dd,'mar')-(S.sv(o,'reg')*.6+S.sv(o,'ctl')*.4))/110,.55,1.7)*(S.mkm[dd.s].get(dd)===o?((t2[4]||0)==1?1.4:1.1):1)){S.won(dd,o);S.tackles=(S.tackles||0)+1;(S.tkS||(S.tkS=[0,0]))[dd.s]++;return}}if(dd&&dist(dd,o)<(fixB?82:R*2.6)&&o.hold>(fixB?10:14))o.wait=Math.min(o.wait,o.hold+4);if(o.hold>o.wait){if(o.fr&&(o.ex||0)<(fixB?64:36)&&S.sv(o,'reg')>=45){o.ex=(o.ex||0)+1}else{S.pass(o);o.wait=S.hold(o);o.fr=false}}}}}
  else{if(B.cv){const cc=Math.cos(B.cv),ss=Math.sin(B.cv),nvx=B.vx*cc-B.vy*ss;B.vy=B.vx*ss+B.vy*cc;B.vx=nvx}B.x+=B.vx;B.y+=B.vy;B.vx*=.985;B.vy*=.985;const mouth=B.y>GY0&&B.y<GY1;
   const live=!S.sc&&S.prev&&!S.frozen,oobs=S.sc&&S.sc.k=='oob';   // en juego libre la pelota sale de verdad por la línea (no rebota como en una pared)
   const oy=Math.max(Y0-BR-2-B.y,B.y-(Y0+FH+BR+2)),ox=Math.max(X0-BR-2-B.x,B.x-(X0+FW+BR+2));
   if(live&&oy>0&&!(ox>0&&!mouth&&ox>oy)){S.outBall(B.y<H/2?'t':'b');return}
   if(live&&!mouth&&ox>0){S.outBall(B.x<W/2?'l':'r');return}
   if(!live&&!oobs&&!(S.sc&&S.sc.k=='lat'&&S.sc.ph!='lt')){if(!B.free){if(B.y<Y0+BR){B.y=Y0+BR;B.vy=0;B.vx*=.9}if(B.y>Y0+FH-BR){B.y=Y0+FH-BR;B.vy=0;B.vx*=.9}}}
   if(!oobs){if(B.x<X0+BR&&!B.free&&(!live||mouth)){B.x=X0+BR;B.vx=Math.abs(B.vx)*.7}if(B.x>X0+FW-BR&&!B.free&&(!live||mouth)){B.x=X0+FW-BR;B.vx=-Math.abs(B.vx)*.7}}
   if(B.free){if(B.x<X0-24){B.x=X0-24;B.vx=0}if(B.x>X0+FW+24){B.x=X0+FW+24;B.vx=0}}
   for(const p of P){if(p.off||p.cool>0)continue;const rr=R+BR+1+((B.recv&&B.recv!==p&&S.prev&&p.s!==S.prev.s&&!S.sc&&S.sk)?clamp((S.sv(p,'ant')-62)/9,-3,4):0);if(dist(p,B)>=rr)continue;   // anticipación: el que lee mejor el pase llega a cortarlo desde más lejos
   
    if(S.sc&&S.sc.wait!==p)continue;if(S.sc&&S.sc.ph=='g')continue;
    if(B.recv===p&&!S.sc&&S.sk&&Math.hypot(B.vx,B.vy)>1.8&&rnd()<clamp(.06+(62-S.sv(p,'ctl'))*.003,.01,.18)){p.cool=16;B.vx*=.55;B.vy=B.vy*.55+(rnd()-.5)*2.4;B.recv=null;(S.ctlF||(S.ctlF=[0,0]))[p.s]++;continue}   // mal control: la pelota se le escapa
    if(B.recv!==p&&p.k!==0&&!S.sc&&Math.hypot(B.vx,B.vy)>4.8&&rnd()<clamp(.35+(62-S.sv(p,'ant'))/220,.2,.5))continue;   // anticipación: el que lee mejor la jugada la corta más
    if(!S.sc&&S.prev&&S.prev!==p&&S.prev.s===p.s&&S.prev.k>0)S.runner=(S.runner&&S.runner.p===S.prev&&S.n<S.runner.t)?S.runner:{p:S.prev,t:S.n+60};
    if(B.recv&&B.recv!==p&&S.prev&&p.s!==S.prev.s&&!S.sc){S.icp=(S.icp||0)+1;(S.icS||(S.icS=[0,0]))[p.s]++}if(S.latLock&&!S.sc){if(p===S.latLock.p){S.latFoul(p);break}S.latLock=null}
    const was=S.poss;B.own=p;B.recv=null;B.free=false;p.hold=0;p.wait=S.hold(p);if(S.sb&&S.n-S.sb.n0>8){S.sbT=(S.sbT||0)+1;if(p.s===S.sb.s)S.sbW=(S.sbW||0)+1;S.sb=null}if(was!==p.s&&!S.sc)S.checkCounter(p);break}}
  {const dx=B.x-(S.lbx===undefined?B.x:S.lbx),dy=B.y-(S.lby===undefined?B.y:S.lby),dd=Math.hypot(dx,dy);B.rot=(B.rot||0)+dd/BR;S.lbx=B.x;S.lby=B.y;if(dd>.6)S.trail.push({x:B.x,y:B.y,n:S.n});while(S.trail.length&&S.n-S.trail[0].n>22)S.trail.shift()}}
}
const wideSlots=f=>{const o=[];for(let k=1;k<11;k++){const h=hom(f,k);if(h&&(h.wide||h.fb))o.push(k)}return o},API={wideSlots,Sim,W,H,X0,Y0,FW,FH,GY0,GY1,R,BR};if(typeof module!=='undefined')module.exports=API;else window.SIM2D=API;
})();
