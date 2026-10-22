(function(){
const D=typeof require!=='undefined'?require('./data'):window.DATA,{DIVS,CUPS,TM,FM,slots,autoXI,squad,setMix,roleOvr,squadMode,PHIL,phOff,phDelta,validPhil}=D,AV=(x,a)=>x.at?x.at[a]:x.r,avg=(arr,f)=>arr.length?arr.reduce((s,x)=>s+f(x),0)/arr.length:60,rnd=Math.random,rooms={},CFG={randN:10,rVoteT:15,rGraceV:10000,rGraceP:30000,rankMin:10,tick:1000,offline:typeof window!=='undefined',fastWaits:false,realK:D.NORMAL.K,realC:D.NORMAL.C};
// Fuerza efectiva por modo: equilibrado = plantel normalizado (data.js); normal = diferencias reales atenuadas (CFG.realK) para que la calidad no decida de antemano.
const cmpV=v=>CFG.realC+(v-CFG.realC)*CFG.realK;
const sqOf=(r,team)=>{const c=r.sqc||(r.sqc={});if(c[team])return c[team];const mix=!!(r.cfg&&r.cfg.mix),raw=squadMode(team,mix);return c[team]=mix?raw:raw.map(x=>({...x,r:cmpV(x.r),at:Object.fromEntries(Object.keys(x.at).map(a=>[a,cmpV(x.at[a])]))}))};
const poolOf=r=>r.cfg.teams?r.cfg.teams.map(i=>TM[i]):r.cfg.div=='all'?DIVS.flatMap(d=>d.teams):r.cfg.cup?(CUPS.find(x=>'cup:'+x.id==r.cfg.div)||{clubs:[]}).clubs.map(i=>TM[i]):(DIVS.find(d=>d.id==r.cfg.div)||{teams:[]}).teams;
const cl=o=>JSON.parse(JSON.stringify(o)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),txt=(s,n)=>String(s||'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,n);
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function newTac(team){const sq=squad(team),xi=autoXI(sq,0),best=p=>xi.reduce((b,i)=>sq[i].p==p&&(b<0||AV(sq[i],'rem')>AV(sq[b],'rem'))?i:b,-1);
 return{f:0,st:1,pr:1,wing:0,sal:0,mk:0,auto:0,xi,cap:xi.reduce((b,i)=>sq[i].r>sq[b].r?i:b,xi[0]),pk:best('DEL'),k1:TM[team].c1,k2:TM[team].c2}}
function strength(r,team,tc,off,ph){const sq=sqOf(r,team),sl=slots(tc.f),n=k=>sl.filter(s=>s==k).length,o={a:0,m:0,d:0};
 tc.xi.forEach((i,k)=>{const x=sq[i],s=sl[k],v=off&&off.has(i)?0:(roleOvr(x,s)+phDelta(ph,s))*(x.p==s?1:.8)*(i==tc.cap?1.02:1);if(s=='POR'||s=='DEF')o.d+=v/(1+n('DEF'));else if(s=='MED')o.m+=v/n('MED');else o.a+=v/n('DEL')});
 o.a*=[.94,1,1.07][tc.st];o.d*=[1.07,1,.94][tc.st];o.m*=[.97,1,1.05][tc.pr];o.d*=[1.04,1,.96][tc.pr];return o}
function chain(tc,wing,off){const[d,m,a]=FM[tc.f],ln0=[[0],[...Array(d).keys()].map(i=>1+i),[...Array(m).keys()].map(i=>1+d+i),[...Array(a).keys()].map(i=>1+d+m+i)],ln=ln0.map(x=>{const y=off?x.filter(s=>!off.has(tc.xi[s])):x;return y.length?y:x}),
 yOf=(l,s)=>(ln[l].indexOf(s)+1)/(ln[l].length+1),pick=(l,ty)=>ln[l].reduce((b,s)=>Math.abs(yOf(l,s)-ty)<Math.abs(yOf(l,b)-ty)?s:b,ln[l][0]);
 const side=rnd()<.5?.12:.88;let l=rnd()<.3?0:1,cur=pick(l,.5),ch=[cur];
 while(l<3){const nl=rnd()<.35&&l>0&&ch.length<7?l:l+1,ty=wing&&nl>=2?side:.5+(rnd()-.5)*.35;cur=pick(nl,nl==l?1-yOf(l,cur):(yOf(l,cur)+ty*2)/3);if(nl==l&&ch.includes(cur))continue;ch.push(cur);l=nl}
  if(ch.length>=3&&(wing||rnd()<.2)&&ln[1].length>=4&&rnd()<.6){const fb=side<.5?ln[1][0]:ln[1][ln[1].length-1];if(!ch.includes(fb)&&!(off&&off.has(tc.xi[fb])))ch.splice(ch.length-1,0,fb)}return ch}
const wx=()=>{const q=rnd(),k=q<.5?0:q<.8?1:2;return{k,t:Math.round(k==0?17+rnd()*17:k==1?9+rnd()*13:6+rnd()*12)}},newMatch=(a,b)=>({a,b,w:wx(),ga:0,gb:0,xg:[0,0],evs:[],gl:[],fl:null,st:[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],pg:[{},{}],pas:[{},{}],pr:[{},{}],yc:[{},{}],off:[new Set(),new Set()],used:[new Set(),new Set()],sb:[0,0],of:[0,0],fc:[{},{}],lf:[-9,-9]});
const rate=(m,s,i,d)=>{if(i>=0)m.pr[s][i]=clamp((m.pr[s][i]??6)+d,3,10)},eid=r=>r.eid=(r.eid||0)+1;
const nm=(r,m,s,i)=>squad(r.pl[s?m.b:m.a].team)[i].n;   // nombre del jugador i del lado s
function scoreG(r,m,s,i,min,k,as){s?m.gb++:m.ga++;m.st[s][2]++;m.pg[s][i]=(m.pg[s][i]||0)+1;if(as>=0)m.pas[s][as]=(m.pas[s][as]||0)+1;rate(m,s,i,.9);rate(m,s,as,.35);const D=r.pl[s?m.a:m.b].tac;rate(m,1-s,D.xi[0],-.25);D.xi.forEach((j,q)=>{if(q&&q<=FM[D.f][0])rate(m,1-s,j,-.08)});m.gl.push({t:s,n:nm(r,m,s,i),m:min,k})}
const penP=(rem,ref)=>clamp(.76+(rem-ref)/300,.6,.88),penX=(rem,ref)=>rnd()<penP(rem,ref)?'g':rnd()<.6?'s':'o';   // definición de un penal (g=gol, s=atajado, o=afuera): la usan el penal de los 90' y la tanda
// Suspensiones: P.sus = índices del plantel expulsados en su último partido. Se pierden el siguiente y entra solo el mejor reemplazante (misma lógica de eficacia por puesto que autoXI).
const susOf=P=>new Set((P&&P.sus)||[]);
function fixSus(P){if(!P||!P.tac||!P.team||!(P.sus&&P.sus.length))return;const sq=squad(P.team),t=P.tac,ban=susOf(P),sl=slots(t.f);
 t.xi.forEach((i,k)=>{if(!ban.has(i))return;const pos=sl[k];let b=-1,bv=-1;sq.forEach((x,j)=>{if(t.xi.includes(j)||ban.has(j))return;const v=roleOvr(x,pos)*(x.p==pos?1:(pos=='POR'||x.p=='POR')?.3:.8);if(v>bv){bv=v;b=j}});if(b>=0)t.xi[k]=b});
 if(ban.has(t.cap))t.cap=t.xi.reduce((q,i)=>sq[i].r>sq[q].r?i:q,t.xi[0]);if(ban.has(t.pk))t.pk=t.xi.reduce((q,i)=>sq[i].p=='DEL'&&(q<0||sq[i].r>sq[q].r)?i:q,-1)}
function pickTaker(r,m,s){const P=r.pl[s?m.b:m.a],tc=P.tac,sq=sqOf(r,P.team);let i=tc.pk;if(!tc.xi.includes(i)||m.off[s].has(i))i=tc.xi.filter((x,k)=>k&&!m.off[s].has(x)).reduce((b,x)=>b<0||AV(sq[x],'rem')>AV(sq[b],'rem')?x:b,-1);return i}
// faltas: la presión alta genera más; tarjetas; el expulsado deja al equipo con uno menos. Cada falta puede ser penal, tiro libre peligroso o falta simple.
function foul(r,m,s,min){const P=r.pl[s?m.b:m.a],tc=P.tac,sq=sqOf(r,P.team),sl=slots(tc.f),c=[],avA=avg(tc.xi.filter((i,k)=>k).map(i=>sq[i]),x=>AV(x,'ant'));tc.xi.forEach((i,k)=>{if(k&&!m.off[s].has(i))for(let w=0;w<Math.max(1,Math.round(({DEF:9,MED:10,DEL:6}[sl[k]]||5)*(m.yc[s][i]>0?.35:1)/(1+((m.fc&&m.fc[s][i])||0)*.6)*clamp(1+(avA-AV(sq[i],'ant'))/120,.7,1.4)));w++)c.push(i)});if(!c.length)return;
 const i=c[Math.floor(rnd()*c.length)];if(m.fc)m.fc[s][i]=(m.fc[s][i]||0)+1;if(m.lf)m.lf[s]=min;rate(m,s,i,-.15);m.fl={id:eid(r),m:min,x:'f',s,n:sq[i].n};const q=rnd(),yP=.265*[.9,1,1.15][tc.pr]*(s==1?1.08:1)*(m.yc[s][i]>0?.85:1),rP=.006*[.6,1,1.3][tc.pr]*(s==1?1.08:1);let red=q<rP;
 if(!red&&q<rP+yP){m.yc[s][i]=(m.yc[s][i]||0)+1;m.st[s][5]++;rate(m,s,i,-.3);m.fl.x='y';if(m.yc[s][i]>=2){red=true;m.fl.x='r2'}}
 if(red){m.off[s].add(i);m.st[s][6]++;rate(m,s,i,-1.5);if(m.fl.x!='r2')m.fl.x='r'}
 const o=1-s,z=rnd(),tk=pickTaker(r,m,o),gk=tc.xi[0];
 if(z<.03){const rm=AV(sqOf(r,r.pl[o?m.b:m.a].team)[tk],'rem'),rf=AV(sq[gk],'ref');m.xg[o]+=penP(rm,rf);const x=penX(rm,rf);m.st[o][1]++;if(x=='g')scoreG(r,m,o,tk,min,'pen',-1);else if(x=='s'){m.st[o][2]++;rate(m,o,tk,-.15);rate(m,s,gk,.8)}else rate(m,o,tk,-.3);m.evs.push({id:eid(r),k:'pen',m:min,t:o,x,n:nm(r,m,o,tk),si:tk,fn:sq[i].n})}
 else if(z<.27){const y=rnd(),fp=.10*clamp(1+(AV(sqOf(r,r.pl[o?m.b:m.a].team)[tk],'rem')-AV(sq[gk],'ref'))/100,.5,1.6);m.xg[o]+=fp;const x=y<fp?'g':y<.43?'w':y<.68?'s':'o';m.st[o][1]++;if(x=='g')scoreG(r,m,o,tk,min,'fk',-1);else if(x=='s'){m.st[o][2]++;rate(m,s,gk,.3)}m.evs.push({id:eid(r),k:'fk',m:min,t:o,x,n:nm(r,m,o,tk),si:tk,fn:sq[i].n})}
 else m.evs.push({id:eid(r),k:'foul',m:min,t:o,fn:sq[i].n})}
// cambios automáticos desde el minuto 60: sale quien rinde mal (<5,7) o tiene amarilla; entra el mejor suplente de su puesto (máx. 3)
function autoSub(r,m,min){if(min<60)return;for(let s=0;s<2;s++){const P=r.pl[s?m.b:m.a],tc=P.tac;if(!tc.auto||m.sb[s]>=3)continue;const sq=squad(P.team),sl=slots(tc.f),xi=tc.xi;let w=-1,wv=99;
 xi.forEach((i,k)=>{if(!k||m.off[s].has(i))return;const v=m.pr[s][i]??6;if((v<5.7||m.yc[s][i]>0)&&v<wv){wv=v;w=k}});if(w<0)continue;
 const out=xi[w];let b=-1;sq.forEach((x,i)=>{if(xi.includes(i)||m.off[s].has(i)||m.used[s].has(i)||susOf(P).has(i))return;if(x.p==sl[w]&&(b<0||x.r>sq[b].r))b=i});if(b<0||sq[b].r<sq[out].r-10)continue;
 xi[w]=b;m.used[s].add(out);m.sb[s]++;m.pr[s][b]=6;m.fl={id:eid(r),m:min,x:'sub',s,n:sq[out].n+' ➜ '+sq[b].n}}}
// probabilidad de falta por minuto: baja respecto de antes (los contactos leves no son infracción); la comete más el que defiende que el que tiene la pelota; no se encadenan faltas seguidas del mismo equipo; la presión alta y el estilo ofensivo siguen sumando
// Tiempo de descuento: depende de lo que pasó en cada tiempo (goles, cambios, tarjetas, faltas). Se juega como minutos extra del reloj (1 s cada uno), con jugadas.
const hcnt=m=>[m.gl.length,m.sb[0]+m.sb[1],m.st[0][5]+m.st[0][6]+m.st[1][5]+m.st[1][6],m.st[0][4]+m.st[1][4]];
function stopAdd(r,lim){let sum=0;r.ms.forEach(m=>{const c=hcnt(m),b=lim==45?[0,0,0,0]:(m.h0||[0,0,0,0]);sum+=.5+.5*(c[0]-b[0])+.4*(c[1]-b[1])+.25*(c[2]-b[2])+.05*(c[3]-b[3])});return clamp(Math.round(sum/Math.max(1,r.ms.length)+rnd()*.8),1,lim==45?3:5)}
const wideCache={},wideOf=f=>{if(wideCache[f])return wideCache[f];try{const Q=typeof require!=='undefined'?require('./sim2d'):window.SIM2D,w=Q.wideSlots(f);if(w.length)wideCache[f]=w;return w}catch(e){return[]}};   // laterales/extremos de cada formación (los define el 2D)
const HOMEF=1.05;   // localía: ventaja leve del local (m.a); el visitante además recibe algo más de tarjetas
function foulP(m,s,t,min,tc,ph){const gap=min-((m.lf&&m.lf[s])??-9);return .106*[.8,1,1.4][tc.pr]*[.9,1,1.08][tc.st]*((ph||{ev:{foul:1}}).ev.foul)*(s==t?.62:1.3)*(tc.mk?1.15:.93)*(gap<3?.3:gap<6?.7:1)}
function simMin(r,m,min){const A=r.pl[m.a],B=r.pl[m.b];if(!A||!B)return;const P=[A,B],sa=strength(r,A.team,A.tac,m.off[0],A.phil),sb=strength(r,B.team,B.tac,m.off[1],B.phil),pa=(sa.m*HOMEF*[.92,1,1.08][A.tac.st]*[.97,1,1.04][A.tac.pr]*([1.02,1.01,.99][A.tac.sal||0]))**2/((sa.m*HOMEF*[.92,1,1.08][A.tac.st]*[.97,1,1.04][A.tac.pr]*([1.02,1.01,.99][A.tac.sal||0]))**2+(sb.m*[.92,1,1.08][B.tac.st]*[.97,1,1.04][B.tac.pr]*([1.02,1.01,.99][B.tac.sal||0]))**2),t=(m.cnt&&m.cnt.min==min-1&&rnd()<(m.cnt.f||.3))?m.cnt.s:(rnd()<pa?0:1);m.st[t][0]++;
 for(let s=0;s<2;s++){const tc=P[s].tac;if(rnd()<foulP(m,s,t,min,tc,PHIL[P[s].phil])){m.st[s][4]++;foul(r,m,s,min)}}
  const pfA=PHIL[P[t].phil],pfD=PHIL[P[1-t].phil];if(rnd()>[.25,.33,.43][P[t].tac.st]+(P[1-t].tac.st==2?.03:0)+(pfA?pfA.ev.atk:0)+(pfD?pfD.ev.oppAtk:0))return;const at=t?sb:sa,df=t?sa:sb,atc=P[t].tac,dfc=P[1-t].tac,wing=atc.wing,mod=wing?(FM[dfc.f][0]>=5?.95:1.05):(FM[dfc.f][1]>=5?.95:1.05),
 lead=t?m.gb-m.ga:m.ga-m.gb,ch=chain(atc,wing,m.off[t]),ev={id:eid(r),k:'att',m:min,t,ch,x:'l'};
 const sqA=sqOf(r,P[t].team),sqD=sqOf(r,P[1-t].team),slA=slots(atc.f),slD=slots(dfc.f),ea=(s,x,k,a)=>AV(x,a)+phOff(P[s].phil,(s==t?slA:slD)[k],a);   // atributo efectivo = dato del jugador + ajuste de la filosofía según la línea (se recalcula limpio, no se acumula)
 if(ch.length>3&&rnd()<((pfA?pfA.ev.direct||0:0)+((atc.sal||0)==2?.35:0)))ch.splice(1,ch.length-3);   // juego directo
 {const lk=ch[ch.length-1],ln=slA[lk];if(ln=='DEL'||ln=='MED'){const cand=atc.xi.map((i,k)=>k).filter(k=>slA[k]==ln&&!m.off[t].has(atc.xi[k])&&(k==lk||!ch.includes(k)));
  if(cand.length>1&&rnd()<.55){const w=cand.map(k=>{const x=sqA[atc.xi[k]];return Math.pow(Math.max(20,ea(t,x,k,'rem'))/60,3)*(ea(t,x,k,'des')/60)});let u=rnd()*w.reduce((a,b)=>a+b,0),pk=cand[0];for(let j=0;j<cand.length;j++){u-=w[j];if(u<=0){pk=cand[j];break}}ch[ch.length-1]=pk}}}   // los que mejor definen y se desmarcan reciben más remates
 let cx=-1;{const wk=wideOf(atc.f).filter(k=>!m.off[t].has(atc.xi[k])&&k!==ch[ch.length-1]);if(wk.length&&rnd()<clamp(.15+(atc.wing?.18:0)+(wk.length>=4?.04:0)+((atc.sal||0)==1&&!dfc.mk?.05:0)+((atc.sal||0)==2?.03:0),0,.45)){cx=wk[Math.floor(rnd()*wk.length)];const i0=ch.indexOf(cx);if(i0>=0)ch.splice(i0,1);ch.splice(ch.length-1,0,cx)}}   // centro desde la banda (lateral/extremo): más frecuente con táctica de bandas
  let mkSp=1;if(ch.length>1&&cx<0&&(dfc.mk||0)==1){const stI=atc.xi.reduce((b,i,k)=>k&&!m.off[t].has(i)&&(b<0||sqA[i].r>sqA[b].r)?i:b,-1);if(atc.xi[ch[ch.length-1]]===stI){if(rnd()<.5){const q=ch.length-2,tmp=ch[q];ch[q]=ch[ch.length-1];ch[ch.length-1]=tmp;mkSp=1.03}else mkSp=.9}else mkSp=1.03}   // marcaje al hombre: la figura rival remata menos (la mitad de las veces lo hace otro y, si remata, lo hace peor) pero los demás tienen más espacio
  const lk2=ch[ch.length-1],shx=sqA[atc.xi[lk2]],defs=dfc.xi.map((i,k)=>({x:sqD[i],k,i})).filter(o=>slD[o.k]=='DEF'&&!m.off[1-t].has(o.i)),passers=ch.slice(0,-1),
  pq=passers.length?avg(passers,k=>ea(t,sqA[atc.xi[k]],k,'pas')):ea(t,shx,lk2,'pas'),carry=(ea(t,shx,lk2,'ctl')+ea(t,shx,lk2,'reg'))/2,dq=avg(defs,o=>ea(1-t,o.x,o.k,'mar')*(dfc.mk?.6:.4)+ea(1-t,o.x,o.k,'ant')*(dfc.mk?.4:.6))*(dfc.mk?1-clamp((min-60)/30,0,1)*.05:1),dAnt=avg(defs,o=>ea(1-t,o.x,o.k,'ant')),aDes=avg(ch.slice(-3),k=>ea(t,sqA[atc.xi[k]],k,'des')),
  offF=clamp(1-(aDes-dAnt)/150,.7,1.4),sal0=(atc.sal||0)==0,bq=sal0?(()=>{const sl=slots(atc.f);let s=0,n=0;atc.xi.forEach((i,k)=>{if(sl[k]=='POR'){s+=ea(t,sqA[i],k,'pas')*2;n+=2}else if(sl[k]=='DEF'&&!m.off[t].has(i)){s+=ea(t,sqA[i],k,'pas')+ea(t,sqA[i],k,'ctl');n+=2}});return n?s/n:70})():70,sal1=(atc.sal||0)==1,mq=sal1?(()=>{const sl=slots(atc.f);let s=0,n=0;atc.xi.forEach((i,k)=>{if(sl[k]=='MED'&&!m.off[t].has(i)){s+=ea(t,sqA[i],k,'pas')+ea(t,sqA[i],k,'ctl');n+=2}});return n?s/n:70})():70,sal2=(atc.sal||0)==2,sbq=sal2?(()=>{const sl=slots(atc.f);let s=0,n=0;atc.xi.forEach((i,k)=>{if((sl[k]=='DEL'||sl[k]=='MED')&&!m.off[t].has(i)){s+=ea(t,sqA[i],k,'des')+ea(t,sqA[i],k,'ant');n+=2}});return n?s/n:70})():70,
   lostP=clamp(.30*(1-((pq+carry)/2-dq)/150)+(pfD?pfD.ev.lostDef:0)+(pfA?pfA.ev.lostAtk:0)+(sal0?((dfc.pr==2?.035:dfc.pr==0?-.02:0)-clamp((bq-70)/330,-.05,.05)):0)+(sal1?((dfc.pr==2?.012:dfc.pr==0?-.012:0)-clamp((mq-70)/330,-.04,.04)):0)+(sal2?(.02-(dfc.mk==1&&dfc.pr>=1?.025:0)-(dfc.pr==2?.01:0)-clamp((sbq-70)/330,-.04,.04)):0),.2,.46);   // salida desde abajo: si el rival presiona alto se pierde más, salvo que arquero y defensa pasen muy bien   // pase y conducción vs marca y anticipación; desmarque vs anticipación
 ch.forEach(k=>rate(m,t,atc.xi[k],.025));
 const offP=clamp(.05+(dfc.pr==2?.04:dfc.pr==0?-.015:0)+(dfc.st==2?.03:dfc.st==0?-.02:0)+(atc.st==2?.025:0)+((atc.sal||0)==2?.012:0)+(dfc.mk?-.012:.018)+clamp((at.a*mod/df.d-1)*.2,0,.06),.02,.16);   // fuera de juego: más si la defensa rival sube la línea o si se ataca al límite
 if(rnd()<clamp(offP*offF,.02,.2)){ev.x='f';rate(m,t,atc.xi[ch[ch.length-1]],-.08);m.of[t]++;m.evs.push(ev);return}
 if(rnd()<lostP){rate(m,t,atc.xi[ch[ch.length-1]],-.12);const dl=dfc.xi.filter((i,k)=>k&&!m.off[1-t].has(i));rate(m,1-t,dl[Math.floor(rnd()*dl.length)],.08);m.evs.push(ev);if(sal0&&rnd()<.3+(dfc.pr==2?.2:dfc.pr==0?-.15:0)-clamp((bq-70)/150,-.18,.18))m.cnt={s:1-t,min,f:.6,b:1.2};else if(!dfc.mk&&rnd()<.5)m.cnt={s:1-t,min};return}
 m.st[t][1]++;let p=clamp(.072*Math.pow(at.a*mod*[.95,1,1.07][dfc.st]/df.d,2.2),.02,.35);if(lead>=2)p*=Math.pow(.55,lead-1);if(lead>=4)p=.01;
 const sh=atc.xi[ch[ch.length-1]],as=ch.length>1?atc.xi[ch[ch.length-2]]:-1,gk=dfc.xi[0],duel=(ea(t,shx,lk2,'rem')*.7+ea(t,shx,lk2,'des')*.3)-(ea(1-t,sqD[gk],0,'ref')*.55+dq*.45);p=clamp(p*clamp(1+duel/120,.75,1.3)*((pfD&&pfD.ev.guard)||1)*(dfc.mk?1:clamp(1+(aDes-66)/260,.97,1.06))*mkSp*((m.cnt&&m.cnt.min==min-1&&m.cnt.s==t&&m.cnt.b)||1)*((sal0&&dfc.pr==2)?clamp(1+(bq-70)/180,1,1.14):1)*(sal1?clamp(1+(mq-70)/400,.97,1.04):1)*(sal2?clamp(1+(sbq-70)/400,.97,1.05):1),.01,.4);   // definición y desmarque del que remata vs reflejos del arquero y defensa
 if(cx>=0){p=clamp(p*.9*clamp(1+(ea(t,sqA[atc.xi[cx]],cx,'pas')-60)/250,.85,1.15),.01,.4);ev.cr=1}m.xg[t]+=p;if(rnd()<p){ev.x='g';ev.n=nm(r,m,t,sh);ev.si=sh;ev.ai=as;scoreG(r,m,t,sh,min,'att',as)}
 else if(rnd()>=clamp(.65-(ea(t,shx,lk2,'rem')-50)/100-duel/600,.15,.56)){ev.x='s';m.st[t][2]++;rate(m,t,sh,.12);rate(m,1-t,gk,.45)}
 else{ev.x='o';rate(m,t,sh,-.12)}
 m.evs.push(ev);
 if(ev.x!='g'&&rnd()<(ev.x=='s'?.4:.15)*[.8,1,1.25][atc.st]){m.st[t][3]++;m.xg[t]+=.06;const cg=rnd()<.06,c={id:eid(r),k:'cor',m:min,t,x:cg?'g':'c'};
  if(cg){const sl=slots(atc.f),w=[];atc.xi.forEach((x,k)=>{if(k&&!m.off[t].has(x))for(let n=0;n<({DEF:2,MED:1,DEL:3}[sl[k]]||1);n++)w.push(x)});const hd=w[Math.floor(rnd()*w.length)];m.st[t][1]++;c.n=nm(r,m,t,hd);c.si=hd;scoreG(r,m,t,hd,min,'cor',-1)}
  m.evs.push(c)}}
const zonesOk=c=>Array.isArray(c.zones)&&(c.zones.length==2||c.zones.length==4)&&c.zones.every(a=>Array.isArray(a)&&a.length>=4)&&c.zones.flat().length==c.teams.length&&new Set(c.zones.flat()).size==c.teams.length&&c.zones.flat().every(id=>c.teams.includes(id));
function mkFixtures(r){const ids=shuf(r.order.map(p=>r.pl[p].team));if(r.cfg.fmt=='copa'){r.alive=ids;r.seedOrder=[...ids];r.rd=0;r.leg=0;koBuild(r);return}
 if(r.cfg.zones){r.fx=zoneFx(r);r.total=r.fx.length;return}
 const a=[...ids],R=[];if(a.length%2)a.push(null);const n=a.length;for(let k=0;k<n-1;k++){const x=[];for(let i=0;i<n/2;i++)x.push(k%2?[a[n-1-i],a[i]]:[a[i],a[n-1-i]]);R.push(x);a.splice(1,0,a.pop())}
 r.fx=r.cfg.fmt=='liga2'?[...R,...R.map(x=>x.map(([p,q])=>[q,p]))]:R;r.total=r.fx.length}
// ---- Mata-mata: llave fija (ganador del cruce 2j vs ganador del 2j+1). Cada ronda se juega a 1 partido o ida y vuelta (cfg.legs); si el global empata, penales.
const koSize=n=>{let p=1;while(p<n)p*=2;return p};
function koBuild(r){const t=[...r.seedOrder],P=koSize(t.length),nb=P-t.length,L=r.cfg.legs||1,R=Math.log2(P),mk=(a,b,by)=>({a,b,l:[],g:null,w:by?a:null,pen:null,bye:!!by});
 const r0=[];for(let i=0;i<nb;i++)r0.push(mk(t.shift(),null,1));while(t.length)r0.push(mk(t.shift(),t.shift()));
 r.br=[r0];for(let k=1;k<R;k++)r.br.push(Array.from({length:r.br[k-1].length/2},()=>mk(null,null)));r.total=R*L}
const copaPairs=r=>r.br&&r.br[r.rd]?r.br[r.rd].map(t=>r.leg?[t.b,t.a]:[t.a,t.b]):[];
// ---- Tanda de penales (mata-mata): si el cruce queda igualado al cierre (partido único o global de la vuelta), cada humano elige 5 pateadores (cada uno solo los suyos), se juega con la misma definición de penal y gana quien no puede ser alcanzado; si sigue igualado, muerte súbita.
function psoNeed(r){const L=r.cfg.legs||1;if(r.leg<L-1)return[];const rd=(r.br&&r.br[r.rd])||[],out=[];
 r.ms.forEach(m=>{const A=r.pl[m.a].team,B=r.pl[m.b].team,t=rd.find(t=>!t.bye&&((t.a==A&&t.b==B)||(t.a==B&&t.b==A)));if(!t)return;const g=A==t.a?[m.ga,m.gb]:[m.gb,m.ga],sA=t.l.reduce((x,q)=>x+q[0],0)+g[0],sB=t.l.reduce((x,q)=>x+q[1],0)+g[1];if(sA==sB)out.push({m,key:t.a+'|'+t.b})});return out}
function psoDef(r,pid,m,s){const P=r.pl[pid],sq=sqOf(r,P.team),gk=P.tac.xi[0],el=P.tac.xi.filter(i=>!m.off[s].has(i)),sc=i=>(i==P.tac.pk?1e6:0)+(i==gk?-1e5:0)+AV(sq[i],'rem');return{el,def:el.slice().sort((x,y)=>sc(y)-sc(x))}}
function startPso(r,need){r.ps={step:0,items:need.map(({m,key})=>{const ia=psoDef(r,m.a,m,0),ib=psoDef(r,m.b,m,1);return{key,ta:r.pl[m.a].team,tb:r.pl[m.b].team,pa:m.a,pb:m.b,f:rnd()<.5?0:1,el:[ia.el,ib.el],def:[ia.def,ib.def],sel:[ia.def.slice(0,5),ib.def.slice(0,5)],gk:[r.pl[m.a].tac.xi[0],r.pl[m.b].tac.xi[0]],ok:[!!r.pl[m.a].bot,!!r.pl[m.b].bot],kicks:null,w:null,gF:[0,0]}})};
 r.phase='psel';r.t=45;r.order.forEach(p=>r.pl[p].busy=false);if(r.ps.items.every(it=>it.ok[0]&&it.ok[1]))startShoot(r)}
const psoClean=(it,s,arr)=>{const seen=new Set(),sel=[];(Array.isArray(arr)?arr:[]).forEach(v=>{v=Math.floor(+v);if(it.el[s].includes(v)&&!seen.has(v)&&sel.length<5){seen.add(v);sel.push(v)}});it.def[s].forEach(i=>{if(sel.length<5&&!seen.has(i)){seen.add(i);sel.push(i)}});return sel};
function startShoot(r){const ps=r.ps;ps.items.forEach(it=>{it.ord=[0,1].map(s=>[...it.sel[s],...it.def[s].filter(i=>!it.sel[s].includes(i))]);
  const sq=[sqOf(r,it.ta),sqOf(r,it.tb)],sc=[0,0],n=[0,0],ks=[];let turn=0;
  for(;;){const s=turn%2==0?it.f:1-it.f,d=1-s,tk=it.ord[s][n[s]%it.ord[s].length],x=penX(AV(sq[s][tk],'rem'),AV(sq[d][it.gk[d]],'ref'));n[s]++;if(x=='g')sc[s]++;ks.push({s,i:tk,x});turn++;
   const r0=Math.max(0,5-n[0]),r1=Math.max(0,5-n[1]);let done=false;if(n[0]<5||n[1]<5){if(sc[0]>sc[1]+r1||sc[1]>sc[0]+r0)done=true}else if(n[0]==n[1]&&sc[0]!=sc[1])done=true;if(done||turn>200)break}
  it.kicks=ks;it.gF=sc;it.w=sc[0]>sc[1]?it.ta:sc[1]>sc[0]?it.tb:(rnd()<.5?it.ta:it.tb)});
 ps.step=0;ps.end=null;r.phase='pso';r.pt=2;r.hold=0;r.t=0;r.order.forEach(p=>r.pl[p].busy=false)}
function finishPso(r){r.order.forEach(p=>r.pl[p].busy=false);r.psoItems=r.ps.items;r.pw={};r.ps.items.forEach(it=>r.pw[it.key]=it.w);r.ps=null;r.psoOK=true;endRound(r)}
const psoMine=(r,pid)=>r.ps&&r.ps.items.find(it=>it.pa==pid||it.pb==pid);
function psView(r,pid){if(!r.ps)return null;const ps=r.ps,on=r.phase=='pso';
 return{ph:r.phase,t:Math.ceil(r.t||0),items:ps.items.map(it=>{const ks=on?it.kicks.slice(0,ps.step):[],g=[0,0],n=[0,0];ks.forEach(k=>{n[k.s]++;if(k.x=='g')g[k.s]++});const done=on&&ps.step>=it.kicks.length,s=ks.length%2==0?it.f:1-it.f;
   return{a:it.ta,b:it.tb,f:it.f,ok:it.ok,k:ks,g,done,w:done?it.w:null,nx:done||!it.ord?null:{s,i:it.ord[s][n[s]%it.ord[s].length]}}}),
  me:(()=>{const it=psoMine(r,pid);if(!it)return null;const s=it.pa==pid?0:1;return{a:it.ta,b:it.tb,s,el:it.el[s],sel:it.sel[s],ok:it.ok[s],okOpp:it.ok[1-s]}})()}}
function koResolve(r,res){const L=r.cfg.legs||1,rd=r.br[r.rd],last=r.leg>=L-1;
 res.forEach(x=>{const t=rd.find(t=>(t.a==x.a&&t.b==x.b)||(t.a==x.b&&t.b==x.a));if(!t)return;const g=x.a==t.a?[x.ga,x.gb]:[x.gb,x.ga];t.l.push(g);t.g=[t.l.reduce((s,q)=>s+q[0],0),t.l.reduce((s,q)=>s+q[1],0)];x.leg=r.leg;x.agg=x.a==t.a?[t.g[0],t.g[1]]:[t.g[1],t.g[0]];
  if(last){if(t.g[0]!=t.g[1])t.w=t.g[0]>t.g[1]?t.a:t.b;else{const it=(r.psoItems||[]).find(i=>(i.ta==t.a&&i.tb==t.b)||(i.ta==t.b&&i.tb==t.a));t.w=it?it.w:(rnd()<.5?t.a:t.b);t.pen=t.w;if(it){const sw=it.ta==t.a;t.ps={g:sw?[it.gF[0],it.gF[1]]:[it.gF[1],it.gF[0]]};x.ps=sw==(x.a==t.a)?[it.gF[0],it.gF[1]]:[it.gF[1],it.gF[0]]}x.pen=t.pen}}});
 if(!last){r.leg++;return false}
 const w=rd.map(t=>t.w);r.alive=w;r.rd++;r.leg=0;if(w.length==1)return true;
 r.br[r.rd].forEach((t,j)=>{t.a=w[2*j];t.b=w[2*j+1]});return false}
const koView=r=>r.br?r.br.map(rd=>rd.map(t=>({a:t.a,b:t.b,l:t.l,g:t.g,w:t.w,pen:t.pen,ps:t.ps||null,bye:t.bye}))):null;
const isOut=(r,P)=>!!(P&&P.team&&r.cfg.fmt=='copa'&&r.alive&&!r.alive.includes(P.team)),playing=(r,p)=>(r.ms||[]).some(m=>m.a==p||m.b==p);
const byTeam=(r,t)=>r.order.find(p=>r.pl[p].team==t);
function startRound(r){const pairs=r.cfg.fmt=='copa'?copaPairs(r):r.fx[r.round];r.byes=[];r.ms=[];r.award=null;
 pairs.forEach(([x,y])=>{if(!x||!y)r.byes.push(x||y);else r.ms.push(newMatch(byTeam(r,x),byTeam(r,y)))});
 r.order.forEach(p=>{r.pl[p].ready=!!r.pl[p].bot;r.pl[p].skip=false;fixSus(r.pl[p])});r.phase='cer';r.min=0;r.t=18;if(r.offline)botTune(r,0)}
function maybeStart(r){if(r.order.length==r.cfg.n&&r.order.every(p=>r.pl[p].team)){r.order.forEach(p=>r.table[r.pl[p].team]={pj:0,gf:0,ga:0,pts:0,g:0,e:0,p:0});mkFixtures(r);r.phase='pre';r.t=180}}
function begin1(r){r.phase='m1';r.t=0;r.ad=0;r.sx=0;r.stp=false;r.hb=4;r.ms.forEach(m=>{m.h0=[0,0,0,0]});r.order.forEach(p=>{const P=r.pl[p];P.skip=false;if(!P.bot&&P.tac)P.base=cl(P.tac)})}
const tally=(r,m)=>{r.sc=r.sc||{};[0,1].forEach(s=>{const t=r.pl[s?m.b:m.a].team,sq=squad(t);[['g',m.pg[s]],['a',m.pas[s]]].forEach(([k,o])=>Object.keys(o||{}).forEach(i=>{if(!o[i]||!sq[i])return;const e=r.sc[t+':'+i]||(r.sc[t+':'+i]={t,n:sq[i].n,g:0,a:0});e[k]+=o[i]}))})},
 topSc=(r,k,o)=>Object.values(r.sc||{}).filter(e=>e[k]>0).sort((x,y)=>y[k]-x[k]||y[o]-x[o]||x.n.localeCompare(y.n)).slice(0,10).map(e=>({t:e.t,n:e.n,v:e[k]}));
function endRound(r){if(r.cfg.fmt=='copa'&&!r.psoOK){const need=psoNeed(r);if(need.length){startPso(r,need);return}}
 r.order.forEach(p=>{const P=r.pl[p];if(!P.bot&&P.base){P.tac=P.base;P.base=null}});   // lo que cambiaste durante el partido no queda para los siguientes
 const res=[];if(r.cfg.fmt!='copa')r.prevRank=rankOf(r);r.ms.forEach(m=>{const A=r.pl[m.a].team,B=r.pl[m.b].team;let pen='';
 if(r.cfg.fmt=='copa'){}else{const s=r.table;[[A,m.ga,m.gb],[B,m.gb,m.ga]].forEach(([t,f,c])=>{const q=s[t];q.pj++;q.gf+=f;q.ga+=c;q.pts+=f>c?3:f==c?1:0;q.g+=+(f>c);q.e+=+(f==c);q.p+=+(f<c)})}
 res.push({a:A,b:B,ga:m.ga,gb:m.gb,pen});tally(r,m);r.pl[m.a].sus=[...m.off[0]];r.pl[m.b].sus=[...m.off[1]]});r.order.forEach(p=>fixSus(r.pl[p]));r.res=res;r.ms=[];(r.hist=r.hist||[]).push(res);r.round++;
 if(r.cfg.seg){let c=0;if(r.cfg.seg.some(x=>(c+=x)==r.round))(r.segT=r.segT||[]).push(JSON.parse(JSON.stringify(r.table)))}
 if(r.cfg.fmt=='copa'){const fin=koResolve(r,res);r.psoItems=null;r.psoOK=false;r.pw=null;if(fin){r.phase='end';r.champ=r.alive[0];regTitle(r);recCareer(r);return}}
 else if(r.round>=r.total){r.phase='end';{const mt=(r.order.map(p=>r.pl[p]).find(P=>!P.bot)||{}).team,zz=r.cfg.zone&&r.cfg.zones&&(r.cfg.zones.find(a=>a.includes(mt))||r.cfg.zones[0]);r.champ=Object.entries(r.table).filter(([id])=>!zz||zz.includes(id)).map(([id,q])=>({id,...q})).sort(cmpT)[0].id}regTitle(r);recCareer(r);return}
 r.phase='lobby';r.t=r.cfg.fmt=='copa'&&r.alive&&r.order.every(p=>r.pl[p].bot||!r.alive.includes(r.pl[p].team))?6:90;r.ms=[];r.order.forEach(p=>r.pl[p].ready=!!r.pl[p].bot)}
// Equipo de la fecha: más goles; si empatan, mejor diferencia; si siguen igualados, mejores estadísticas (posesión, remates, a puerta, córners, menos faltas y tarjetas)
const cmpT=(a,b)=>b.pts-a.pts||b.g-a.g||b.gf-a.gf||(b.gf-b.ga)-(a.gf-a.ga);
const rankOf=r=>{const o={};Object.entries(r.table).map(([id,q])=>({id,...q})).sort(cmpT).forEach((q,i)=>o[q.id]=i+1);return o};
function awardOf(r){let best=null;r.ms.forEach(m=>[0,1].forEach(s=>{const o=1-s,gf=s?m.gb:m.ga,ga=s?m.ga:m.gb,st=m.st[s],tot=(m.st[0][0]+m.st[1][0])||1,comp=st[0]/tot*40+st[1]*1.2+st[2]*2+st[3]*.5-st[4]*.2-st[5]*.5-st[6]*3+rnd()*.01,sc=[gf,gf-ga,comp];
  if(!best||sc[0]>best.sc[0]||(sc[0]==best.sc[0]&&(sc[1]>best.sc[1]||(sc[1]==best.sc[1]&&sc[2]>best.sc[2]))))best={sc,team:r.pl[s?m.b:m.a].team,rival:r.pl[o?m.b:m.a].team,gf,ga}}));
 if(best){r.award={team:best.team,rival:best.rival,gf:best.gf,ga:best.ga};r.aw=r.aw||{};r.aw[best.team]=(r.aw[best.team]||0)+1}}
function tick(r){setMix(r.cfg&&r.cfg.mix);if(r.paused)return;if(r.pub){if(r.closed)return pubClosedTick(r);if(r.phase=='pick'){pubTick(r);if(r.closed)return pubClosedTick(r);return push(r)}}if(r.rand&&RLIVE.includes(r.phase))return randTick(r);if(r.phase=='pre'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0)startRound(r)}else if(r.phase=='cer'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0)begin1(r)}else if(r.phase=='m1'||r.phase=='m2'){if(r.add>0){r.ms.forEach(m=>{m.evs=[]});if(r.add==1&&!CFG.fastWaits&&(r.hold=(r.hold||0)+1)<=4&&r.order.some(p=>!r.pl[p].bot&&r.pl[p].busy)){}else if(--r.add==0){r.hold=0;r.order.forEach(p=>r.pl[p].busy=false);if(r.min==45){r.phase='ht';r.t=15;r.order.forEach(p=>r.pl[p].skip=false);if(r.offline)botTune(r,1)}else{r.phase='fin';r.t=5}}}else if(!CFG.fastWaits&&r.spd<=1.5&&r.hb>0&&(r.hold2=(r.hold2||0)+1)<=40&&r.order.some(p=>!r.pl[p].bot&&r.pl[p].busy>=2)){r.hb--}else{r.hold2=0;if(r.stp){const lm=r.min;r.sx++;r.ms.forEach(m=>{m.evs=[];simMin(r,m,lm);autoSub(r,m,lm)});if(r.sx>=r.ad){r.stp=false;r.add=1;r.hold=0;if(lm==45)r.ms.forEach(m=>{m.h0=hcnt(m)})}}else{r.min++;r.ms.forEach(m=>{m.evs=[];simMin(r,m,r.min);autoSub(r,m,r.min)});if(r.min==45||r.min>=90){r.ad=CFG.fastWaits?0:stopAdd(r,r.min);r.sx=0;if(r.ad>0)r.stp=true;else{r.add=CFG.fastWaits?1:3;r.hold=0}}}}}   // tiempo agregado: sin jugadas nuevas, para que se terminen de ver las que quedaron antes del descanso/final
 
 else if(r.phase=='fin'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0||(r.offline&&r.skipEnd)){awardOf(r);if(r.offline&&r.skipEnd)endRound(r);else{r.phase='awd';r.t=5}}}else if(r.phase=='awd'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0)endRound(r)}else if(r.phase=='ht'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0){r.phase='m2';r.ad=0;r.sx=0;r.stp=false;r.hb=4}}else if(r.phase=='lobby'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0)startRound(r)}else if(r.phase=='psel'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0){r.ps.items.forEach(it=>{it.ok=[true,true]});startShoot(r)}}
 else if(r.phase=='pso'){const ps=r.ps,mx=Math.max(...ps.items.map(it=>it.kicks.length));
  if(ps.step<mx){if(r.pt>0)r.pt--;else if(!CFG.fastWaits&&(r.hold=(r.hold||0)+1)<=30&&r.order.some(p=>!r.pl[p].bot&&r.pl[p].busy)){}else{r.hold=0;ps.step++;r.pt=CFG.fastWaits?0:2}}
  else{if(ps.end==null)ps.end=CFG.fastWaits?1:6;ps.end-=CFG.fastWaits?1:1/r.spd;if(ps.end<=0)finishPso(r)}}
 else return;push(r)}
function nextOf(r,team){if(r.phase=='pick'||r.phase=='end')return null;const pr=r.cfg.fmt=='copa'?copaPairs(r):r.fx&&r.fx[r.round],p=pr&&pr.find(x=>x.includes(team));return p?(p[0]&&p[1]?{o:p[0]==team?p[1]:p[0],h:p[0]==team}:{o:null}):null}
function calOf(r,team){const c=[],H=r.hist||[],sc=(x,h)=>(h?x.ga:x.gb)+'-'+(h?x.gb:x.ga);
 if(r.cfg.fmt!='copa'){(r.fx||[]).forEach((pr,i)=>{const p=pr.find(x=>x.includes(team));if(!p)return;const h=p[0]==team,x=H[i]&&H[i].find(q=>q.a==p[0]&&q.b==p[1]);c.push({r:i+1,o:h?p[1]:p[0],h,s:x?sc(x,h):null})})}
 else H.forEach((hs,i)=>{const x=hs.find(q=>q.a==team||q.b==team);if(x){const h=x.a==team;c.push({r:i+1,o:h?x.b:x.a,h,s:sc(x,h)+(x.pen?(x.pen==team?' (ganó x pen.)':' (perdió x pen.)'):'')})}});return c}
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),cd=(a,b)=>{const x=hx(a),y=hx(b);return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2])},lmn=c=>{const x=hx(c);return(.299*x[0]+.587*x[1]+.114*x[2])/255};
const kitsOf=(A,B)=>{const ka=[A.tac.k1,A.tac.k2];let kb=[B.tac.k1,B.tac.k2];if(cd(ka[0],kb[0])<110){kb=[B.tac.k2,B.tac.k1];if(cd(ka[0],kb[0])<110)kb=[lmn(ka[0])>.55?'#1b1b1b':'#f4f4f4',B.tac.k1]}return[ka,kb]};   // camiseta alternativa para el visitante
const DORS=[1,12,2,3,4,5,13,15,6,8,10,14,16,20,9,7,11,19];
const pInfo=(m,s,P)=>{const tc=P.tac;return{x:tc.xi.slice(),n:tc.xi.map(i=>DORS[i]),y:tc.xi.map((i,k)=>m.yc[s][i]>0&&!m.off[s].has(i)?k:-1).filter(k=>k>=0),g:tc.xi.map(i=>m.pg[s][i]||0),a:tc.xi.map(i=>m.pas[s][i]||0),c:tc.xi.indexOf(tc.cap)}};
const offKs=(m,s,P)=>P.tac.xi.map((i,k)=>m.off[s].has(i)?k:-1).filter(k=>k>=0);
function view(r,pid){setMix(r.cfg&&r.cfg.mix);const me=r.pl[pid]||(r.spec&&r.spec[pid]?SPECME:undefined),own={};r.order.forEach(p=>{if(r.pl[p].team)own[r.pl[p].team]=r.pl[p].name});
 const v={code:r.code,rq:rView(r,pid),rk:rankInfo(r),pb:pbOf(r),closed:r.closed||null,sp:!!(r.spec&&r.spec[pid]&&!r.pl[pid]),ns:Object.keys(r.spec||{}).filter(q=>r.spec[q].cb).length,tit:r.tit||null,cfg:r.cfg,rn:r.cfg.fmt=='copa'&&r.alive?(()=>{const k=r.alive.length;return k==2?'Final':k==4?'Semifinales':k==8?'Cuartos de final':k==16?'Octavos de final':(k&(k-1))?'Ronda preliminar':''})():'',elim:!!(me&&isOut(r,me)),ps:psView(r,pid),se:!!r.skipEnd,gs:topSc(r,'g','a'),as:topSc(r,'a','g'),host:r.order[0]==pid,br:koView(r),segT:r.segT||null,rd:r.rd||0,leg:r.leg||0,needRiv:!!r.needRiv,spd:r.spd||1,phase:r.phase,round:r.round,total:r.total,t:Math.ceil(r.t),min:r.min,own,champ:r.champ,res:r.res,byes:r.byes,prev:r.prevRank||null,award:r.award||null,aw:r.aw||{},
 table:Object.entries(r.table).map(([id,q])=>({id,...q})),chat:r.chat.slice(-40).map(c=>({id:c.id,n:c.n,t:c.t,u:c.u.length,d:c.d.length,me:c.pid===pid,my:c.u.includes(pid)?1:c.d.includes(pid)?-1:0})),
 ms:(r.ms||[]).map(m=>{const A=r.pl[m.a],B=r.pl[m.b],kt=kitsOf(A,B);return{a:A.team,b:B.team,pha:A.phil||'equilibrada',phb:B.phil||'equilibrada',w:m.w,ra:[A.tac.k1,A.tac.k2],rb:[B.tac.k1,B.tac.k2],ga:m.ga,gb:m.gb,fa:A.tac.f,fb:B.tac.f,ka:kt[0],kb:kt[1],evs:m.evs,gl:m.gl,ta:[A.tac.st,A.tac.pr,A.tac.wing,A.tac.sal,A.tac.mk],tb:[B.tac.st,B.tac.pr,B.tac.wing,B.tac.sal,B.tac.mk],fl:m.fl,of:m.of,xg:m.xg.map(x=>Math.round(x*100)/100),st:m.st.map(x=>[...x]),oa:offKs(m,0,A),ob:offKs(m,1,B),pa:pInfo(m,0,A),pb:pInfo(m,1,B)}}),
 ready:r.order.map(p=>r.pl[p].ready),n:r.order.length,pls:r.order.map(p=>({n:r.pl[p].name,t:r.pl[p].team,b:!!r.pl[p].bot,f:r.pl[p].phil||'equilibrada',o:isOut(r,r.pl[p])})),off:!!r.offline,paused:!!r.paused,ad:(r.phase=='m1'&&r.min>=45)||(r.phase=='m2'&&r.min>=90)?(r.ad||0):0,sx:(r.phase=='m1'&&r.min>=45)||(r.phase=='m2'&&r.min>=90)?(r.sx||0):0,hx:r.hb>0?0:1,sk:(()=>{const hs=r.order.filter(p=>!r.pl[p].bot&&playing(r,p));return{n:hs.filter(p=>r.pl[p].skip).length,of:hs.length,me:!!(me&&me.skip),pl:!!(me&&playing(r,pid))}})(),nf:(r.phase=='pre'||r.phase=='lobby')?((r.cfg.fmt=='copa'?copaPairs(r):(r.fx&&r.fx[r.round]))||null):null};
 if(me){v.me={team:me.team,ready:me.ready,tac:me.tac,phil:me.phil||'equilibrada',sus:me.sus||[]};if(me.team){v.me.sq=squad(me.team).map(({at,...q})=>q);v.me.sl=slots(me.tac.f);const mm=(r.ms||[]).find(x=>x.a==pid||x.b==pid);if(mm){const s=mm.a==pid?0:1;v.me.rt=v.me.sq.map((_,i)=>mm.pr[s][i]!==undefined?+mm.pr[s][i].toFixed(1):(me.tac.xi.includes(i)?6:null));v.me.cd=v.me.sq.map((_,i)=>[mm.yc[s][i]||0,mm.off[s].has(i)?1:0]);v.me.sb=mm.sb[s];v.me.used=[...mm.used[s]]}v.next=nextOf(r,me.team);if(!['cer','m1','ht','m2','fin','awd'].includes(r.phase))v.cal=calOf(r,me.team)}}return v}
function push(r){r.order.forEach(p=>{const c=r.pl[p];if(c.cb)try{c.cb(view(r,p))}catch(e){}});if(r.spec)for(const p in r.spec){const c=r.spec[p];if(c.cb)try{c.cb(view(r,p))}catch(e){}}}
function addBots(r,div,ids){const free=ids?[...ids].reverse():shuf(div.teams.map(t=>t.id).filter(id=>!r.order.some(p=>r.pl[p].team==id)));
 for(let i=1;r.order.length<r.cfg.n;i++){const id=free.pop(),bp='bot'+i;r.pl[bp]={name:'CPU '+i,team:id,ready:true,tac:{...newTac(id),auto:1},res:null,bot:true};r.order.push(bp)}}
// IA: elige formación, estilo, presión y ataque según el rival; en el entretiempo reacciona al marcador.
function botTune(r,half){r.ms.forEach(m=>[[m.a,m.b,m.ga-m.gb],[m.b,m.a,m.gb-m.ga]].forEach(([p,o,d])=>{const P=r.pl[p],O=r.pl[o];if(!P.bot)return;const t=P.tac,sq=squad(P.team);
 if(!half){const ot=O.tac,os=strength(r,O.team,ot,undefined,O.phil);let best=null;
  for(let f=0;f<FM.length;f++){const c={...t,f,xi:autoXI(sq,f,susOf(P))},s=strength(r,P.team,c,undefined,P.phil),sc=s.a+s.m+s.d+(FM[f][1]>=5&&os.m>s.m?3:0)+rnd()*2;if(!best||sc>best.sc)best={sc,f,xi:c.xi}}
  if(best.f!=t.f){t.f=best.f;t.xi=best.xi;t.cap=t.xi.reduce((q,i)=>sq[i].r>sq[q].r?i:q,t.xi[0]);t.pk=t.xi.reduce((q,i)=>sq[i].p=='DEL'&&(q<0||sq[i].r>sq[q].r)?i:q,-1)}
  const me=strength(r,P.team,t,undefined,P.phil),df=me.a+me.m+me.d-(os.a+os.m+os.d);t.st=df>4?2:df<-4?0:1;t.pr=me.m>os.m?2:1;t.wing=FM[ot.f][0]>=5?0:FM[ot.f][1]>=5?1:rnd()<.5?1:0;t.sal=ot.pr==2?(rnd()<.5?2:1):0;t.mk=rnd()<.5?1:0}
 else if(d<0){t.st=2;t.pr=2}else if(d>=2){t.st=0;t.pr=0}else if(d==1)t.st=1}))}
function listen(code,pid,cb){const r=rooms[code],c=r&&(r.pl[pid]||(r.spec&&r.spec[pid]));if(!c)return false;if(!r.pl[pid]&&!cb){delete r.spec[pid];return true}c.cb=cb;c.lost=cb?0:Date.now();if(cb)try{cb(view(r,pid))}catch(e){}return true}
// cambia de formación en pleno partido sin cambiar jugadores: reubica a los mismos 11 en las nuevas posiciones
function reslot(sq,f,xi){const sl=slots(f),u=new Set();return sl.map(p=>{let b=-1;xi.forEach(i=>{if(u.has(i))return;const ok=sq[i].p==p;if(b<0||(ok&&sq[b].p!=p)||(ok==(sq[b].p==p)&&sq[i].r>sq[b].r))b=i});u.add(b);return b})}
function act(b){const a=b.a,pid=txt(b.pid,40),name=txt(b.name,16)||'Invitado';if(!pid)return'Falta id';let r=rooms[txt(b.room,12).toLowerCase()];
 if(r&&r.spec&&r.spec[pid]&&!r.pl[pid]&&a!='join')return'Estás mirando esta sala';
 if(a=='create'){const c=b.cfg||{},isAll=c.div=='all',cus=c.div=='custom'&&!!(b.off&&CFG.offline)&&Array.isArray(c.teams)&&c.teams.length==+c.n&&c.n>=4&&(c.real?c.n<=40:c.n<=20&&c.n%2==0)&&new Set(c.teams).size==c.teams.length&&c.teams.every(i=>TM[i])&&['liga1','liga2'].includes(c.fmt),cup=CUPS.find(x=>'cup:'+x.id==c.div),div=isAll?{id:'all',ok:1}:cus?{id:'custom',ok:1,teams:c.teams.map(i=>TM[i])}:cup?{id:'cup:'+cup.id,ok:1,teams:cup.clubs.map(i=>TM[i])}:DIVS.find(d=>d.id==c.div&&d.ok),code=txt(b.room,12).toLowerCase(),nn=cup?Math.max(4,Math.min(cup.clubs.length,Math.floor(+c.n)||cup.clubs.length)):+c.n;
  if(!/^[a-z0-9]{3,12}$/.test(code))return'Código: 3-12 letras o números';if(rooms[code])return'Ese código ya existe';if(Object.keys(rooms).length>=60)return'Servidor lleno';
  if(!div||(!cup&&!cus&&!(c.fmt=='copa'?D.KO_SIZES:D.LIGA_SIZES).includes(nn))||!['liga1','liga2','copa'].includes(c.fmt))return'Configuración inválida';if(c.fmt=='copa'&&!D.KO_SIZES.includes(nn))return'Mata-mata: solo 4, 8, 16 o 32 equipos (llaves completas, sin pases libres)';if(!isAll&&div.teams.length<nn)return'Esa división tiene solo '+div.teams.length+' clubes: elegí menos jugadores';
  r=rooms[code]={code,tid:newTid(),cfg:{div:div.id,fmt:c.fmt,n:nn,mix:(isAll||(cup&&(c.mix||!(b.off&&CFG.offline))))?1:0,cup:cup?cup.title:undefined,teams:cus?c.teams.slice():undefined,real:cus&&c.real?1:undefined,lbl:cus?txt(c.lbl,60):undefined,zone:cus&&c.real&&c.zone?1:undefined,zones:cus&&c.real&&zonesOk(c)?c.zones.map(a=>a.slice()):undefined,iz:cus&&c.real&&zonesOk(c)&&c.iz&&c.zones.length==2?1:undefined,seg:cus&&c.real&&zonesOk(c)&&Array.isArray(c.seg)&&c.seg.length==2&&c.seg.every(x=>x==16)?[16,16]:undefined,zl:cus&&c.real&&Array.isArray(c.zl)?c.zl.slice(0,6).map(x=>({a:Math.floor(+x.a)||1,b:Math.floor(+x.b)||1,k:['F','R','D'].includes(x.k)?x.k:'R',w:x.w=='a'?'a':'z',t:txt(x.t,70)})):undefined,legs:c.fmt=='copa'&&+c.legs==2?2:1,seed:c.fmt=='copa'&&c.seed=='pick'?'pick':'rand'},pl:{},order:[],chat:[],phase:'pick',round:0,t:0,min:0,table:{},ms:[],touched:Date.now(),offline:!!(b.off&&CFG.offline)};r.spd=r.offline?clamp(+b.speed||1,.25,100):1;r.timer=setInterval(()=>tick(r),r.offline?1000/clamp(+b.speed||1,.25,100):CFG.tick)}
 else if(!r)return'No existe esa sala';
 if(r.closed)return'La sala está cerrada';
 if(!r.pl[pid]){if(r.order.length>=r.cfg.n||r.phase!='pick')return'Sala llena o ya empezó';r.pl[pid]={name,team:null,ready:false,tac:null,res:null,phil:r.offline?'equilibrada':validPhil(b.phil),uid:b.uid};r.order.push(pid)}
 const me=r.pl[pid];if(b.uid&&!me.uid)me.uid=b.uid;r.touched=Date.now();let err=null;if(b.phil!==undefined&&!r.offline&&['pick','pre'].includes(r.phase))me.phil=validPhil(b.phil);
 if(a=='pick'&&r.phase=='pick'){const div={teams:poolOf(r)};if(!div.teams.some(t=>t.id==b.team)||r.order.some(p=>r.pl[p].team==b.team))return'Equipo ocupado';
  me.team=b.team;me.tac=newTac(b.team);if(r.offline){if((r.cfg.cup||r.cfg.teams)&&r.cfg.n>=div.teams.length)addBots(r,null,div.teams.map(t=>t.id).filter(id=>id!=b.team));else r.needRiv=1}maybeStart(r)}
 else if(a=='rivals'&&r.offline&&r.phase=='pick'&&me.team&&r.order.length<r.cfg.n){const pool=poolOf(r).map(t=>t.id).filter(id=>id!=me.team),need=r.cfg.n-1,ids=b.random?shuf([...pool]).slice(0,need):[...new Set(Array.isArray(b.teams)?b.teams:[])].filter(id=>pool.includes(id));if(ids.length!=need)return'Elegí exactamente '+need+' rivales';addBots(r,null,ids);r.needRiv=0;maybeStart(r)}
 else if(a=='ready'&&me.team&&['pre','lobby'].includes(r.phase)){if(isOut(r,me))return'Estás eliminado';me.ready=!!b.v;if(r.order.every(p=>r.pl[p].ready||isOut(r,r.pl[p])))startRound(r)}
 else if(a=='seedswap'&&r.cfg.fmt=='copa'&&r.cfg.seed=='pick'&&r.phase=='pre'&&!r.rd&&!r.leg&&r.order[0]==pid){const i=Math.floor(+b.i),j=Math.floor(+b.j),o=r.seedOrder;if(!(i>=0&&j>=0&&i<o.length&&j<o.length&&i!=j))return'Cruce inválido';[o[i],o[j]]=[o[j],o[i]];koBuild(r)}
 else if(a=='psel'||a=='pready'){if(r.phase!='psel')return'La tanda no está en selección';const it=psoMine(r,pid);if(!it)return'No participás de esta tanda';const s=it.pa==pid?0:1;if(it.ok[s])return'Ya confirmaste tus pateadores';if(Array.isArray(b.sel))it.sel[s]=psoClean(it,s,b.sel);if(a=='pready'){it.sel[s]=psoClean(it,s,it.sel[s]);it.ok[s]=true;if(r.ps.items.every(i=>i.ok[0]&&i.ok[1]))startShoot(r)}}
 else if(a=='pause'){if(r.offline)r.paused=!!b.v}
 else if(a=='skipend'){if(r.offline){if(b.auto!==undefined)r.skipEnd=!!b.auto;if(b.now){if(r.phase=='fin'){awardOf(r);endRound(r)}else if(r.phase=='awd')endRound(r)}}}
 else if(a=='skip'){if(!playing(r,pid))return'No estás jugando este partido';const all=()=>r.order.every(p=>r.pl[p].bot||r.pl[p].skip||!playing(r,p));if(r.phase=='cer'){me.skip=true;if(all())begin1(r)}else if(r.phase=='ht'){me.skip=true;if(all()){r.phase='m2';r.t=0;r.ad=0;r.sx=0;r.stp=false;r.hb=4}}}
 else if(a=='phil'){if(!r.offline&&['pick','pre'].includes(r.phase))me.phil=validPhil(b.v)}
 else if(a=='speed'){if(r.offline){r.spd=clamp(+b.v||1,.25,100);clearInterval(r.timer);r.timer=setInterval(()=>tick(r),1000/r.spd)}}
 else if(a=='busy'){me.busy=Math.max(0,Math.min(2,+b.v||0))}
 else if(a=='rv'){if(!r.rand||!['vote1','vote2'].includes(r.phase))return'No se está votando';const o=rOpts(r).find(x=>x.id==b.v);if(!o)return'Opción inválida';r.rand.votes[pid]=o.id}
 else if(a=='chat'){const s=txt(b.text,140);if(s&&Date.now()-(me.lc||0)>400){me.lc=Date.now();r.chat.push({id:(r.cid=(r.cid||0)+1),n:me.name,pid,t:s,tm:Date.now(),u:[],d:[]});if(r.chat.length>200)r.chat.shift()}}
 else if(a=='vote'){const c=r.chat.find(x=>x.id==b.id),v=+b.v;if(c&&c.pid!==pid&&(v==1||v==-1)){const had=c.u.includes(pid)?1:c.d.includes(pid)?-1:0;c.u=c.u.filter(x=>x!=pid);c.d=c.d.filter(x=>x!=pid);if(had!=v)(v==1?c.u:c.d).push(pid)}}
 else if(a=='tac'&&me.tac){const t=me.tac,x=b.p||{},sq=squad(me.team),mm=['m1','ht','m2'].includes(r.phase)?(r.ms||[]).find(q=>q.a==pid||q.b==pid):null,ms=mm?(mm.a==pid?0:1):0;
  if(Number.isInteger(x.f)&&x.f>=0&&x.f<FM.length&&x.f!=t.f){t.f=x.f;t.xi=mm?reslot(sq,x.f,t.xi):autoXI(sq,x.f,susOf(me));t.cap=t.xi.reduce((q,i)=>sq[i].r>sq[q].r?i:q,t.xi[0]);t.pk=t.xi.reduce((q,i)=>sq[i].p=='DEL'&&(q<0||sq[i].r>sq[q].r)?i:q,-1)}
  if([0,1,2].includes(x.st))t.st=x.st;if([0,1,2].includes(x.pr))t.pr=x.pr;if([0,1].includes(x.wing))t.wing=x.wing;if([0,1,2].includes(x.sal))t.sal=x.sal;if([0,1].includes(x.mk))t.mk=x.mk;
  if(Number.isInteger(x.cap)&&x.cap>=0&&x.cap<sq.length)t.cap=x.cap;if(Number.isInteger(x.pk)&&x.pk>=0&&x.pk<sq.length)t.pk=x.pk;
  if([0,1].includes(x.auto))t.auto=x.auto;
  if(x.fill){if(mm)err='Formar automático solo se usa antes del partido';else{t.xi=autoXI(sq,t.f,susOf(me));t.cap=t.xi.reduce((q,i)=>sq[i].r>sq[q].r?i:q,t.xi[0]);t.pk=t.xi.reduce((q,i)=>sq[i].p=='DEL'&&(q<0||sq[i].r>sq[q].r)?i:q,-1)}}
  for(const k of['k1','k2'])if(/^#[0-9a-f]{6}$/i.test(x[k]))t[k]=x[k];
  if(Array.isArray(x.sw)&&x.sw.length==2&&x.sw.every(i=>Number.isInteger(i)&&i>=0&&i<sq.length)){const[i,j]=x.sw,a1=t.xi.indexOf(i),b1=t.xi.indexOf(j);if(a1>=0&&b1>=0)[t.xi[a1],t.xi[b1]]=[j,i];else if(a1>=0||b1>=0){const st=a1>=0?a1:b1,out=a1>=0?i:j,inn=a1>=0?j:i;
   if(susOf(me).has(inn))err='Está suspendido: lo expulsaron en el partido anterior';else if(!mm)t.xi[st]=inn;else if(mm.sb[ms]>=5)err='Ya hiciste los 5 cambios del partido';else if(mm.used[ms].has(inn))err='Ese jugador ya salió y no puede volver';else if(mm.off[ms].has(out))err='Un expulsado no se puede reemplazar';else{t.xi[st]=inn;mm.used[ms].add(out);mm.sb[ms]++;mm.pr[ms][inn]=6}}}}
 push(r);return err}

function simGame(ta,tb,o){o=o||{};setMix(!!o.mix);const r={pl:{A:{name:'A',team:ta,tac:o.tacA||newTac(ta),phil:o.philA},B:{name:'B',team:tb,tac:o.tacB||newTac(tb),phil:o.philB}},order:['A','B'],cfg:{mix:!!o.mix},eid:0},m=newMatch('A','B');for(let min=1;min<=90;min++){m.evs=[];simMin(r,m,min)}return m}   // simula 90 minutos sin sala (para pruebas)
function teamStrength(team,o){o=o||{};const r={cfg:{mix:!!o.mix}};return strength(r,team,newTac(team),undefined,o.phil)}
// Mínimo de personas para que un torneo ONLINE sea elegible para ranking. Cuenta jugadores humanos distintos (pid) de la sala; los equipos de la IA no cuentan y los torneos offline nunca son elegibles.
// OJO: el pid es un id que genera el navegador (no hay cuentas), así que esto cuenta navegadores distintos, no personas verificadas.
function rankInfo(r){const min=CFG.rankMin,h=r.order.filter(p=>!r.pl[p].bot).length,n=r.cfg.n;return{min,h,n,off:!!r.offline,ok:!r.offline&&n>=min&&(r.phase=='pick'||h>=min)}}
// ---- Registro de títulos (Bloque 4). Solo en el servidor: server.js define CFG.onTitle (guarda en PostgreSQL). En el navegador (offline) no se registra nada.
// Se llama UNA vez por torneo, cuando termina de forma normal (fase 'end' con campeón). El servidor vuelve a validar mínimo de personas y que el campeón sea un club de un jugador de la sala.
const newTid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,10)+Math.random().toString(36).slice(2,8);
function regTitle(r){if(r.titled||r.cfg.zone)return;r.titled=1;if(!CFG.onTitle)return;
 const k=rankInfo(r),dt=r.order.find(p=>!r.pl[p].bot&&r.pl[p].team==r.champ);
 // OFFLINE: el torneo se juega en el dispositivo y el servidor no puede comprobar los partidos: se informa solo si ganó el club del jugador y se guarda aparte (modalidad 'offline', sin verificar).
 if(r.offline){if(!dt||!TM[r.champ])return}
 else{if(!r.champ||!dt||!TM[r.champ]){r.tit={st:'no',why:'campeon'};return}
  if(!k.ok||k.h<k.min){r.tit={st:'no',why:'minimo'};return}}
 const cup=r.cfg.cup?CUPS.find(x=>'cup:'+x.id==r.cfg.div):null,dv=cup?null:DIVS.find(d=>d.id==r.cfg.div);
 const rec={tid:r.tid,club:r.champ,clubNombre:TM[r.champ].name,dt:r.pl[dt].name,mod:r.offline?'offline':cup?'barrial':'clasico',comp:cup?cup.id:r.cfg.div=='custom'?(r.cfg.real?'real':'pers'):r.cfg.div,compNombre:cup?cup.title:dv?dv.name:(r.cfg.div=='all'?'Todas las divisiones':r.cfg.div=='custom'?(r.cfg.real?'Clásico realista':'Clásico personalizado'):String(r.cfg.div)),fmt:r.cfg.fmt,n:r.offline?r.cfg.n:k.h,at:Date.now()};
 r.tit={st:'pend'};let p;try{p=Promise.resolve(CFG.onTitle(rec))}catch(e){p=Promise.reject(e)}
 p.then(x=>{r.tit=x&&x.status=='disabled'?{st:'no',why:'sin_db'}:{st:'ok',dup:!!(x&&x.status=='duplicate'),tid:r.tid};push(r)},e=>{r.tit={st:'err'};push(r);console.error('título no registrado:',e&&e.message)})}
// ---- Partida aleatoria (Bloque 2): cola global de CFG.randN personas -> votación de categoría (15 s) -> votación de competición (15 s) -> elección de clubes (la fase 'pick' de siempre). Formato fijo: liga de 1 rueda.
// Todo se valida en el servidor: votos, cupos, club libre (ya lo hace 'pick'), baja con tiempo de gracia (10 s en cola/votación, 30 s eligiendo club) y vacantes que se ofrecen con confirmación.
const RLIVE=['queue','vote1','vote2','pick'];let qOpen=null;
const rOpts=r=>r.phase=='vote1'?[{id:'clasico',label:'Clásico',sub:'Divisiones del fútbol argentino'},{id:'barrial',label:'Barrial / Regional',sub:'Copas de fantasía por región (no son torneos oficiales)'}]:D.catalog().filter(e=>e.cat==r.rand.cat&&e.random).map(e=>({id:e.key,label:e.cat=='barrial'?e.title:e.name,sub:(e.region?e.region+' · ':'')+e.clubs+' clubes'}));
const vacOf=()=>Object.values(rooms).filter(r=>r.rand&&['vote1','vote2','pick'].includes(r.phase)&&r.order.length<CFG.randN).sort((a,b)=>RLIVE.indexOf(b.phase)-RLIVE.indexOf(a.phase)||b.order.length-a.order.length)[0];
const vacInfo=r=>r&&{room:r.code,fase:r.phase=='pick'?'elección de clubes':r.phase=='vote1'?'votación de categoría':'votación de competición',comp:r.phase=='pick'?(r.cfg.cup||(DIVS.find(d=>d.id==r.cfg.div)||{}).name||''):'',cat:r.rand.cat,libres:CFG.randN-r.order.length};
const rView=(r,pid)=>{if(!r.rand)return null;const cnt={};Object.values(r.rand.votes).forEach(x=>cnt[x]=(cnt[x]||0)+1);const vt=r.phase=='vote1'||r.phase=='vote2';
 return{need:CFG.randN,n:r.order.length,names:r.order.map(p=>r.pl[p].name),opts:vt?rOpts(r):[],cnt,mine:r.rand.votes[pid]||null,cat:r.rand.cat,t:Math.ceil(r.t),vac:r.phase=='queue'?vacInfo(vacOf()):null}};
function dropP(r,p){if(!r.pl[p])return;delete r.rand.votes[p];delete r.pl[p];const i=r.order.indexOf(p);if(i>=0)r.order.splice(i,1);
 if(!r.order.length){clearInterval(r.timer);delete rooms[r.code];if(qOpen==r.code)qOpen=null}}
function addRand(r,pid,b){r.pl[pid]={name:txt(b.name,16)||'Invitado',team:null,ready:false,tac:null,res:null,phil:validPhil(b.phil),lost:Date.now(),uid:b.uid};r.order.push(pid);r.touched=Date.now()}
function newQueue(){let code;do code='rnd'+rnd().toString(36).slice(2,7);while(rooms[code]||code.length<8);
 const r=rooms[code]={code,tid:newTid(),cfg:{div:'ar1',fmt:'liga1',n:CFG.randN,mix:0,legs:1,seed:'rand'},pl:{},order:[],chat:[],phase:'queue',round:0,t:0,min:0,table:{},ms:[],touched:Date.now(),offline:false,spd:1,rand:{votes:{},cat:null}};
 r.timer=setInterval(()=>tick(r),CFG.tick);qOpen=code;return r}
function rResolve(r){const o=rOpts(r),cnt={};o.forEach(x=>cnt[x.id]=0);r.order.forEach(p=>{const x=r.rand.votes[p];if(x in cnt)cnt[x]++});
 const mx=Math.max(...Object.values(cnt)),win=shuf(o.filter(x=>cnt[x.id]==mx))[0].id;   // empate (o nadie votó): al azar entre las opciones empatadas
 if(r.phase=='vote1'){r.rand.cat=win;r.phase='vote2';r.t=CFG.rVoteT;r.rand.votes={}}
 else{const cup=CUPS.find(x=>'cup:'+x.id==win);r.cfg={div:win,fmt:'liga1',n:CFG.randN,mix:0,cup:cup?cup.title:undefined,legs:1,seed:'rand'};r.rand.comp=win;r.phase='pick';r.t=0;r.order.forEach(p=>r.pl[p].ready=false)}}
function randTick(r){const now=Date.now();r.order.slice().forEach(p=>{const c=r.pl[p];if(c&&c.lost&&now-c.lost>(r.phase=='pick'?CFG.rGraceP:CFG.rGraceV))dropP(r,p)});
 if(!rooms[r.code])return;if(r.phase=='vote1'||r.phase=='vote2'){if(--r.t<=0)rResolve(r)}push(r)}
// Entrar a "Partida aleatoria". b.mode: undefined (ofrece vacante si hay) | 'join' (acepta la vacante b.room) | 'queue' (rechaza la oferta y va a la cola)
function rJoin(b){const pid=txt(b.pid,40);if(!pid)return{error:'Falta id'};
 for(const k in rooms){const r=rooms[k];if(r.rand&&r.pl[pid]&&r.phase!='end'){if(b.mode=='join'&&r.phase=='queue'){dropP(r,pid);break}const c=r.pl[pid];if(!c.cb&&!c.lost)c.lost=Date.now();return{room:k}}}   // ya estabas en una: volvés a esa
 if(b.mode=='join'){const r=rooms[txt(b.room,12)];if(r&&r.rand&&['vote1','vote2','pick'].includes(r.phase)&&r.order.length<CFG.randN&&!r.pl[pid]){addRand(r,pid,b);push(r);return{room:r.code}}}
 else if(b.mode!='queue'){const v=vacOf();if(v)return{offer:vacInfo(v)}}
 let q=rooms[qOpen];if(!q||q.phase!='queue'||q.order.length>=CFG.randN){if(Object.keys(rooms).length>=60)return{error:'Servidor lleno'};q=newQueue()}
 addRand(q,pid,b);if(q.order.length>=CFG.randN){q.phase='vote1';q.t=CFG.rVoteT;q.rand.votes={}}
 push(q);return{room:q.code}}
// ---- Salas públicas: salas online sin código que aparecen en un listado. Se crean, se entra mientras esperan jugadores y se pueden mirar.
CFG.pubWait=CFG.pubWait||300;   // segundos (TIEMPO REAL, se mide con la hora del servidor) que espera jugadores una sala pública; si no se completa, se cierra
const SPECTAC={f:0,xi:[0,1,2,3,4,5,6,7,8,9,10],cap:0,pk:-1,st:1,pr:1,wing:0,sal:0,mk:0,k1:'#999999',k2:'#ffffff',auto:0},SPECME={name:'Espectador',team:null,ready:true,phil:'equilibrada',spec:true,tac:SPECTAC};
const pubInfo=r=>{const e=D.catalog().find(x=>x.key==r.cfg.div)||{},bar=e.cat=='barrial';return{comp:bar?e.title:e.name,region:bar?e.region:'',cat:bar?'barrial':'clasico'}};
const pbOf=r=>r.pub?{name:r.pub.title||('Sala de '+r.pub.host),...pubInfo(r),left:r.phase=='pick'&&!r.closed&&isFinite(r.pub.closeAt)?Math.max(0,r.pub.closeAt-Date.now()):null}:null;
// r.closed = motivo del cierre ('tiempo' | 'anfitrion'). Los jugadores ven "Sala cerrada" y a los 20 s la sala se elimina.
function closePub(r,why){if(r.closed)return;r.closed=why;r.closedAt=Date.now();push(r)}
function pubTick(r){if(r.phase=='pick'&&!r.closed&&Date.now()>=r.pub.closeAt)closePub(r,'tiempo')}
function pubClosedTick(r){push(r);if(Date.now()-r.closedAt>20000){clearInterval(r.timer);delete rooms[r.code]}}
// "viva" = existe, no se cerró y no terminó. Si venció el tiempo se cierra acá mismo (aunque el reloj interno no haya corrido), así nunca se lista ni se entra a una sala vencida.
const pubAlive=r=>{if(r.pub&&r.phase=='pick'&&!r.closed&&Date.now()>=r.pub.closeAt)closePub(r,'tiempo');return !!(r.pub&&!r.closed&&r.phase!='end')};
function pubList(){return Object.values(rooms).filter(pubAlive).map(r=>{const i=pubInfo(r),pick=r.phase=='pick',free=pick?Math.max(0,r.cfg.n-r.order.length):0;
 return{code:r.code,name:r.pub.title||('Sala de '+r.pub.host),cat:i.cat,comp:i.comp,region:i.region,fmt:r.cfg.fmt,n:r.cfg.n,h:r.order.filter(p=>!r.pl[p].bot).length,free,status:pick?(free>0?'esperando':'completa'):'juego',left:pick&&isFinite(r.pub.closeAt)?Math.max(0,r.pub.closeAt-Date.now()):0,phase:r.phase,round:r.round||0,total:r.total||0,rd:r.rd||0,spec:Object.keys(r.spec||{}).length}}).sort((a,b)=>b.h-a.h)}
// Cierra la sala el anfitrión (el primero en entrar) mientras espera jugadores.
function pubClose(b,pid){const r=rooms[txt(b.room,12).toLowerCase()];if(!r||!pubAlive(r))return{error:'Esa sala ya no existe o se cerró'};if(r.phase!='pick')return{error:'Solo se puede cerrar mientras espera jugadores'};if(r.order[0]!=pid)return{error:'Solo el anfitrión puede cerrar la sala'};closePub(r,'anfitrion');return{ok:1}}
// op: 'create' (div,fmt,n,title) | 'play' (room) | 'watch' (room) | 'close' (room). Devuelve {room} o {error}.
function pubApi(b){const pid=txt(b.pid,40),name=txt(b.name,16)||'Invitado';if(!pid)return{error:'Falta id'};
 if(b.op=='close')return pubClose(b,pid);
 for(const k in rooms){const r=rooms[k];if(r.pub&&pubAlive(r)&&r.pl[pid]&&b.op!='watch')return{room:k}}   // ya estabas en una: volvés a esa
 if(b.op=='create'){const e=D.catalog().find(x=>x.key==b.div),fmt=b.fmt,n=Math.floor(+b.n);
  if(!e||!e.fmts.includes(fmt)||!(e.sizes[fmt]||[]).includes(n)||n<10)return{error:'Configuración inválida: las salas públicas son de 10 jugadores o más'};
  if(Object.keys(rooms).length>=60)return{error:'Servidor lleno'};
  let code;do code='pub'+rnd().toString(36).slice(2,7);while(rooms[code]||code.length<8);
  const er=act({a:'create',pid,name,room:code,phil:b.phil,uid:b.uid,cfg:{div:e.key,fmt,n}});if(er)return{error:er};
  rooms[code].pub={title:txt(b.title,28),host:name,closeAt:Date.now()+CFG.pubWait*1000,created:Date.now()};return{room:code}}
 const r=rooms[txt(b.room,12).toLowerCase()];if(!r||!pubAlive(r))return{error:'Esa sala ya no existe o se cerró'};
 if(b.op=='play'){if(r.phase!='pick'||r.order.length>=r.cfg.n)return{error:'La sala se llenó o ya empezó. Podés mirarla.'};
  if(r.spec&&r.spec[pid])delete r.spec[pid];const er=act({a:'join',pid,name,room:r.code,phil:b.phil,uid:b.uid});return er?{error:er}:{room:r.code}}
 if(b.op=='watch'){if(r.pl[pid])return{room:r.code};r.spec=r.spec||{};if(!r.spec[pid]&&Object.keys(r.spec).length>=60)return{error:'La sala tiene demasiados espectadores'};
  r.spec[pid]=r.spec[pid]||{name,cb:null,lost:0};return{room:r.code}}
 return{error:'Pedido inválido'}}
// ---- Carreras offline (guardar/cargar). Solo se guarda en momentos seguros: pretemporada, entre fechas o torneo terminado (nunca con partidos en juego).
// snapshot() devuelve el torneo como texto; restore() lo vuelve a poner a andar. Los planteles no se guardan: salen de data.js y son siempre los mismos.
const SAVEPH=['pre','lobby','end'];
function snapshot(code){const r=rooms[code];if(!r||!r.offline||!SAVEPH.includes(r.phase)||(r.ms&&r.ms.length))return null;
 const {timer,sqc,ps,...rest}=r,pl={};Object.keys(r.pl).forEach(p=>{const {cb,res,lost,...q}=r.pl[p];pl[p]=q});return JSON.stringify({v:1,room:{...rest,pl}})}
function restore(json,o){o=o||{};if(!CFG.offline)return{error:'Cargar carreras solo funciona en modo offline'};let s;try{s=typeof json=='string'?JSON.parse(json):json}catch(x){return{error:'La carrera guardada está dañada'}}
 const r=s&&s.v==1&&s.room,pid=txt(o.pid,40);
 if(!r||!pid||!r.cfg||!r.pl||!Array.isArray(r.order)||!r.table||!SAVEPH.includes(r.phase)||!r.order.length||!r.order.every(p=>r.pl[p]&&(!r.pl[p].team||TM[r.pl[p].team])))return{error:'La carrera guardada es inválida o usa clubes que ya no existen'};
 const hum=r.order.filter(p=>!r.pl[p].bot);if(hum.length!=1)return{error:'La carrera guardada es inválida'};
 if(hum[0]!=pid){r.pl[pid]=r.pl[hum[0]];delete r.pl[hum[0]];r.order[r.order.indexOf(hum[0])]=pid}   // misma carrera aunque cambie el id del navegador
 let code=txt(r.code,12).toLowerCase();if(!/^[a-z0-9]{3,12}$/.test(code)||rooms[code])code='cpu'+rnd().toString(36).slice(2,7);
 r.code=code;r.offline=true;r.touched=Date.now();r.ms=[];r.paused=false;r.spd=clamp(+o.speed||+r.spd||1,.25,100);r.timer=setInterval(()=>tick(r),1000/r.spd);rooms[code]=r;return{code}}
// ---- Historial de carreras: al terminar un torneo se informa el resultado de cada jugador con cuenta (CFG.onCareer lo define el servidor; en el navegador, el cliente).
// Online: solo jugadores con cuenta (uid, puesto por el servidor). Offline: el único jugador humano; el cliente envía el registro solo si tiene sesión iniciada.
function copaRes(r,t){let last=0;(r.br||[]).forEach(rd=>{if(rd.some(x=>x.a==t||x.b==t))last=rd.length});
 return last==1?'Finalista':last==2?'Eliminado en semifinales':last==4?'Eliminado en cuartos de final':last==8?'Eliminado en octavos de final':last==16?'Eliminado en dieciseisavos de final':'Eliminado en la ronda previa'}
function recCareer(r){if(r.careered)return;r.careered=1;if(!CFG.onCareer)return;
 const cup=r.cfg.cup?CUPS.find(x=>'cup:'+x.id==r.cfg.div):null,dv=cup?null:DIVS.find(d=>d.id==r.cfg.div),copa=r.cfg.fmt=='copa',rk=copa?null:rankOf(r),
  origen=r.offline?'offline':r.pub?'publica':r.rand?'aleatoria':'privada',recs=[];
 r.order.forEach(p=>{const P=r.pl[p];if(!P||P.bot||!P.team||!TM[P.team])return;if(!r.offline&&!P.uid)return;
  const t=P.team,q=r.table[t]||{},champ=r.champ==t,pos=rk?(rk[t]||null):null;
  recs.push({uid:P.uid,tid:r.tid,club:t,clubNombre:TM[t].name,mod:r.offline?'offline':cup?'barrial':'clasico',origen,comp:cup?cup.id:r.cfg.div,compNombre:cup?cup.title:dv?dv.name:(r.cfg.div=='all'?'Todas las divisiones':String(r.cfg.div)),fmt:r.cfg.fmt,n:r.cfg.n,
   pos,resultado:champ?'Campeón':copa?copaRes(r,t):(pos?pos+'.º de '+r.cfg.n:'—'),campeon:champ,pj:copa?null:q.pj,g:copa?null:q.g,e:copa?null:q.e,p:copa?null:q.p,gf:copa?null:q.gf,gc:copa?null:q.ga,pts:copa?null:q.pts,at:Date.now()})});
 if(recs.length)try{CFG.onCareer(recs)}catch(e){console.error('carrera:',e.message)}}
// ---- Clásico personalizado: temporadas con ascensos y descensos.
// Una carrera = k categorías con n clubes cada una y ud ascensos/descensos entre categorías vecinas. La categoría del jugador se juega en una sala normal
// (cfg.div='custom', cfg.teams); las demás se simulan con simGame al cerrar la temporada. El estado es un objeto JSON simple que el navegador guarda en la ranura de carrera.
function simTab(teams,fmt){const T={};teams.forEach(id=>T[id]={id,pts:0,g:0,gf:0,ga:0});
 const play=(a,b)=>{const m=simGame(a,b,{mix:false}),A=T[a],B=T[b];A.gf+=m.ga;A.ga+=m.gb;B.gf+=m.gb;B.ga+=m.ga;if(m.ga>m.gb){A.pts+=3;A.g++}else if(m.ga<m.gb){B.pts+=3;B.g++}else{A.pts++;B.pts++}};
 for(let i=0;i<teams.length;i++)for(let j=i+1;j<teams.length;j++){const h=rnd()<.5,a=h?teams[i]:teams[j],b=h?teams[j]:teams[i];play(a,b);if(fmt=='liga2')play(b,a)}
 return Object.values(T).sort(cmpT)}
const simSeason=(t,f)=>simTab(t,f).map(q=>q.id);
const CXORD=['ar1','ar2','ar3','ar5','ar4','ar6'],CXLVL=[0,1,2,2,3,4],CXKS=[1,2,4,5,6],METRO=new Set(['sur','oeste','norte','caba'].flatMap(id=>(CUPS.find(c=>c.id==id)||{clubs:[]}).clubs));
const isMetro=id=>METRO.has(id);
function careerNew(o){o=o||{};const divs=CXORD.map(id=>DIVS.find(d=>d.id==id)).filter(d=>d&&d.ok),k=Math.floor(+o.k),n=Math.floor(+o.n),ud=Math.floor(+o.ud),fmt=o.fmt,me=o.me||{};
 if(!CXKS.includes(k)||k>divs.length)return{error:'Cantidad de categorías inválida'};
 if(!(n>=4&&n<=20&&n%2==0))return{error:'Equipos por categoría: número par, de 4 a 20'};
 if(!['liga1','liga2'].includes(fmt))return{error:'Formato inválido'};
 if(k>1&&!(ud>=1&&ud*2<=n))return{error:'Ascensos y descensos inválidos para '+n+' equipos'};
 const mc=Math.floor(+me.cat);if(!TM[me.club])return{error:'Elegí tu club'};if(!(mc>=0&&mc<k))return{error:'Categoría de tu club inválida'};
 const picks=Array.from({length:k},(_,i)=>{const a=o.picks&&o.picks[i];return Array.isArray(a)?a.filter(id=>id!==me.club):[]});picks[mc].unshift(me.club);
 const used=new Set();for(const a of picks){if(a.length>n)return{error:'Elegiste más clubes de los que entran en una categoría'};for(const id of a){if(!TM[id])return{error:'Club inexistente: '+id};if(used.has(id))return{error:'Un club está elegido en dos lugares'};used.add(id)}}
 const cats=[];for(let i=0;i<k;i++){const need=n-picks[i].length;   // lo que falta se completa al azar: primero con clubes de esa categoría real y, si no alcanzan, con cualquier club libre (B Metro prefiere metropolitanos, Federal A del interior)
  let add=shuf(divs[i].teams.map(t=>t.id).filter(id=>!used.has(id))).slice(0,need);add.forEach(id=>used.add(id));
  if(add.length<need){const tr=divs[i].id=='ar3'?true:divs[i].id=='ar5'?false:null,fr=Object.keys(TM).filter(id=>!used.has(id)),pf=tr===null?[]:fr.filter(id=>isMetro(id)===tr),rest=[...shuf(pf),...shuf(fr.filter(id=>!pf.includes(id)))].slice(0,need-add.length);rest.forEach(id=>used.add(id));add=add.concat(rest)}
  cats.push({div:divs[i].id,name:divs[i].name,teams:[...picks[i],...add]})}
 return{v:2,mode:'pers',season:2026,k,n,ud:k>1?ud:0,fmt,cats,me:{club:me.club,cat:mc},hist:[],last:null,spd:clamp(+o.spd||1,.25,100)}}
// ---- Modo realista (bloque 1): las 6 divisiones con sus clubes y tamaños reales del juego, una tabla por categoría, vías metro/federal y cupos configurables por temporada.
// Cupos [Primera↔Nacional, Nacional↔3.ª categoría (total), B Metro↔C, C↔Promocional]. Para otra temporada se agrega una entrada: RCUP[2027]=[...]. (Pendiente de confirmar con reglamento.)
const RCUP={2026:[2,4,2,1]},RFMT={ar1:'liga1',ar2:'liga1',ar3:'liga2',ar5:'liga1',ar4:'liga1',ar6:'liga2'};
function realNew(o){o=o||{};const divs=CXORD.map(id=>DIVS.find(d=>d.id==id)),club=o.me&&o.me.club;if(!TM[club])return{error:'Elegí tu club'};
 const cats=divs.map(d=>({div:d.id,name:d.name,teams:d.teams.map(t=>t.id)})),mc=cats.findIndex(c=>c.teams.includes(club));if(mc<0)return{error:'Ese club no está en ninguna división'};
 return{v:3,mode:'real',season:2026,k:6,n:0,ud:0,cup:RCUP[2026].slice(),fmts:divs.map(d=>RFMT[d.id]),zones:Object.fromEntries(cats.filter(c=>RZ[c.div]).map(c=>[c.div,zsplit(c.teams,RZ[c.div].zs,c.div)])),cats,me:{club,cat:mc},hist:[],last:null,spd:clamp(+o.spd||1,.25,100)}}
// ---- Realista bloque 2: Primera Nacional, Primera C y Promocional Amateur se juegan por zonas (2 ruedas) + final y reducido.
// La zona del jugador se juega en una sala normal (liga de 2 ruedas, cfg.zone/cfg.zl); la otra zona y las fases finales se simulan al cerrar la temporada.
// Cada formato es un dato (RZ): zs = tamaños de zona, red = puestos que van al reducido. Reducidos de C (2.º a 7.º) y Promocional (2.º a 4.º): ida y vuelta, define el mejor ubicado (local la vuelta). Pendiente: interzonales.
const RZ={ar1:{zs:[15,15]},ar5:{zs:[10,10,9,9]},ar2:{zs:[18,18],red:[2,8]},ar4:{zs:[14,14],red:[2,7]},ar6:{zs:[8,9],red:[2,4]}};
const RZL={
 ar1:[{a:1,b:8,k:'R',t:'Clasifica a los playoffs (8 por zona)',w:'z'},{a:29,b:30,k:'D',t:'Descenso a Primera Nacional (tabla anual)',w:'a'}],
 ar3:[{a:1,b:1,k:'F',t:'Ascenso directo a Primera Nacional'},{a:2,b:9,k:'R',t:'Reducido por el 2.º ascenso'},{a:21,b:22,k:'D',t:'Descenso a Primera C'}],
 ar2:[{a:1,b:1,k:'F',t:'Final por el 1.er ascenso'},{a:2,b:8,k:'R',t:'Reducido por el 2.º ascenso'},{a:17,b:18,k:'D',t:'Descenso directo'}],
 ar5:[{a:1,b:4,k:'F',t:'Zona Campeonato (por el 1.er ascenso)'},{a:5,b:5,k:'F',t:'Zona Campeonato solo en las zonas de 10; en las de 9 va a Reválida'},{a:6,b:10,k:'R',t:'Zona Reválida (por el 2.º ascenso)'}],
 ar4:[{a:1,b:1,k:'F',t:'Final por el 1.er ascenso'},{a:2,b:7,k:'R',t:'Reducido por el 2.º ascenso'},{a:14,b:14,k:'D',t:'Último de zona: juega por no descender'}],
 ar6:[{a:1,b:1,k:'F',t:'Final por el ascenso'},{a:2,b:4,k:'R',t:'Reducido (el ganador juega la promoción con Primera C)'}]};
// Clásicos reales (lista del usuario): cada par se separa en zonas distintas para poder jugarse en las fechas interzonales.
const CLAS={ar1:'boca-river,independiente-racing,sanlorenzo-huracan,estudiantes-gimnasia,rosario-newells,banfield-lanus,belgrano-talleres,argentinos-platense,tigre-velez,union-sarmiento,atletico-centralcba,aldosivi-defensa,barracas-riestra,estudiantesrc-instituto,gimnasiamza-rivadavia',
 ar2:'allboys-nuevachicago,ferro-defensoresbelgrano,madryn-santelmo,sanmartinsj-racingcba,chaco-rafaela,sanmartintuc-gimnasiajujuy,moron-almirantebrown,estudiantesba-almagro,losandes-temperley,mitre-guemes,tristansuarez-quilmes,ciudadbolivar-agropecuario,colon-patronato,centralnorte-gimnasiatiro,godoycruz-maipu,sanmiguel-midland,colegiales-acassuso,atlanta-chacarita'};
const CLP=Object.values(CLAS).flatMap(x=>x.split(',').map(p=>p.split('-')));
const zsplit=(ids,zs,div)=>{const set=new Set(ids),Z=zs.map(()=>[]),pr=div&&CLAS[div]&&zs.length==2?shuf(CLAS[div].split(',').map(p=>p.split('-')).filter(p=>p.every(t=>set.has(t)))):[],used=new Set();
 pr.forEach(([a,b])=>{const i=Z[0].length<zs[0]&&(Z[1].length>=zs[1]||rnd()<.5)?0:1,j=1-i;if(Z[i].length<zs[i]&&Z[j].length<zs[j]){Z[i].push(a);Z[j].push(b);used.add(a);used.add(b)}});
 const rest=shuf(ids.filter(t=>!used.has(t)));Z.forEach((z,i)=>{while(z.length<zs[i]&&rest.length)z.push(rest.pop())});return Z.map(z=>shuf(z))};
const pdl=(a,b)=>{const m=simGame(a,b,{mix:false});return[m.ga,m.gb]};
// Partido único: local el primero; si empatan gana el primero (mejor ubicado) o, en cancha neutral, penales.
const kt=(a,b,pen)=>{const[x,y]=pdl(a,b);return x!=y?(x>y?a:b):pen?(rnd()<.5?a:b):a};
// Ida y vuelta: a = mejor ubicado (cierra de local); suma de goles y, si empatan, avanza a.
const k2=(a,b)=>{const[x1,y1]=pdl(b,a),[x2,y2]=pdl(a,b);return y1+x2>=x1+y2?a:b};
// Llave por siembra (con pases libres a los mejores sembrados si no es potencia de 2); devuelve {w, rds:[{n,m:[{a,b,w}]}]}.
function zKO(seeds,two){let al=seeds.slice();const rds=[],P=2**Math.ceil(Math.log2(al.length)),by=P-al.length;
 const rd=(ent,first)=>{const m=[];for(let i=0;i<ent.length/2;i++){const a=ent[i],b=ent[ent.length-1-i];m.push({a,b,w:two=='pen'?kt(a,b,1):two?k2(a,b):kt(a,b)})}return m};
 const nm=n=>n==2?'Final':n==4?'Semifinales':n==8?'Cuartos de final':n==16?'Octavos de final':'1.ª fase';
 if(by){const ent=al.slice(by),m=rd(ent),ws=m.map(x=>x.w);rds.push({n:'1.ª fase',m});al=[...al.slice(0,by),...ws].sort((x,y)=>seeds.indexOf(x)-seeds.indexOf(y))}
 while(al.length>1){const m=rd(al);rds.push({n:nm(al.length),m});al=m.map(x=>x.w).sort((x,y)=>seeds.indexOf(x)-seeds.indexOf(y))}
 return{w:al[0],rds}}
const zKey=(zA,zB)=>t=>{const i=zA.indexOf(t);return i>=0?(i+1)*10:(zB.indexOf(t)+1)*10+1};
const zOrder=(zA,zB,first,last)=>{const key=zKey(zA,zB),ex=new Set([...first,...last]);return[...first,...[...zA,...zB].filter(t=>!ex.has(t)).sort((x,y)=>key(x)-key(y)),...last]};
// ---- Primera División: Apertura y Clausura (2 zonas de 15, 16 fechas cada uno); los 8 primeros de cada zona juegan playoffs (partido único, penales); campeón anual y descensos por la suma de puntos de los dos torneos.
const RGN=(()=>{const m={};CUPS.forEach(c=>c.clubs.forEach(id=>{(m[id]=m[id]||[]).push(c.id)}));return m})();
const rrRounds=ids=>{const a=[...ids],R=[];if(a.length%2)a.push(null);const n=a.length;for(let k=0;k<n-1;k++){const x=[];for(let i=0;i<n/2;i++)x.push(k%2?[a[n-1-i],a[i]]:[a[i],a[n-1-i]]);R.push(x);a.splice(1,0,a.pop())}return R};
// Clásico interzonal: cada club se empareja con uno de la otra zona de su misma región (copas regionales); el resto, al azar.
function clasicos(zA,zB){const fb=shuf(zB),out=[],used=new Set(),sA=new Set(zA),sB=new Set(zB),real=new Map();CLP.forEach(([x,y])=>{if(sA.has(x)&&sB.has(y))real.set(x,y);else if(sA.has(y)&&sB.has(x))real.set(y,x)});
 shuf(zA).forEach(a=>{const rv=real.get(a);if(rv&&!used.has(rv)){used.add(rv);out.push([a,rv]);return}const j=fb.findIndex(b=>!used.has(b)&&!CLP.some(([x,y])=>x==b||y==b)&&(RGN[a]||[]).some(g=>(RGN[b]||[]).includes(g)));if(j>=0){used.add(fb[j]);out.push([a,fb[j]])}else out.push([a,null])});
 const free=fb.filter(b=>!used.has(b));out.forEach(p=>{if(!p[1])p[1]=free.pop()});return out}
function primFx(zA,zB,rev){for(let tr=0;tr<60;tr++){const RA=rrRounds(shuf(zA)),RB=rrRounds(shuf(zB)),cl=clasicos(zA,zB),key=new Set(cl.map(([a,b])=>a+'|'+b)),fx=[];let ok=true;
  for(let k=0;k<RA.length;k++){const pa=RA[k].find(q=>!q[0]||!q[1]),pb=RB[k].find(q=>!q[0]||!q[1]),ta=pa[0]||pa[1],tb=pb[0]||pb[1];if(key.has(ta+'|'+tb))ok=false;
   fx.push([...RA[k].filter(q=>q!=pa),...RB[k].filter(q=>q!=pb),rnd()<.5?[ta,tb]:[tb,ta]])}
  if(!ok&&tr<59)continue;fx.push(cl.map(([a,b])=>rnd()<.5?[a,b]:[b,a]));return rev?fx.map(f=>f.map(([a,b])=>[b,a])):fx}}
function zoneFx(r){const Z=r.cfg.zones;if(r.cfg.seg&&Z.length==2)return[...primFx(Z[0],Z[1],false),...primFx(Z[0],Z[1],true)];
 const RR=Z.map(z=>{const R=rrRounds(z);return r.cfg.fmt=='liga2'?[...R,...R.map(x=>x.map(([p,q])=>[q,p]))]:R}),n=Math.max(...RR.map(x=>x.length)),fx=Array.from({length:n},(_,k)=>RR.flatMap(x=>x[k]||[]));
 if(r.cfg.iz&&Z.length==2){const cl=clasicos(Z[0],Z[1]).map(([a,b])=>rnd()<.5?[a,b]:[b,a]);fx.push(cl,cl.map(([a,b])=>[b,a]))}return fx}
const tabSub=(T,S0,id)=>({id,pts:T[id].pts-(S0?S0[id].pts:0),g:T[id].g-(S0?S0[id].g:0),gf:T[id].gf-(S0?S0[id].gf:0),ga:T[id].ga-(S0?S0[id].ga:0)});
function primPO(oA,oC,annual){const mk=(n,o)=>{const sd=[...o[0].slice(0,8).map((id,i)=>({id,k:(i+1)*10})),...o[1].slice(0,8).map((id,i)=>({id,k:(i+1)*10+1}))].sort((x,y)=>x.k-y.k).map(x=>x.id),ko=zKO(sd,'pen');return{n,champ:ko.w,rds:ko.rds}};return{order:annual,rep:{tor:[mk('Apertura',oA),mk('Clausura',oC)]}}}
function primFrom(Z,table,seg){const S0=seg&&seg[0];if(!S0)return null;const T={};table.forEach(q=>T[q.id]=q);const zo=f=>Z.map(zz=>zz.map(f).sort(cmpT).map(q=>q.id));
 return primPO(zo(id=>tabSub(S0,null,id)),zo(id=>tabSub(T,S0,id)),table.slice().sort(cmpT).map(q=>q.id))}
function primSim(Z){const a=Z.map(zz=>simTab(zz,'liga1')),c=Z.map(zz=>simTab(zz,'liga1')),ann={};[...a,...c].flat().forEach(q=>{const x=ann[q.id]=ann[q.id]||{id:q.id,pts:0,g:0,gf:0,ga:0};x.pts+=q.pts;x.g+=q.g;x.gf+=q.gf;x.ga+=q.ga});
 return primPO(a.map(t=>t.map(q=>q.id)),c.map(t=>t.map(q=>q.id)),Object.values(ann).sort(cmpT).map(q=>q.id))}
function fedGroup(ids,two,key){return simTab(ids,'liga1').map(q=>q.id)}
const ZF={
 ar5(z1,z2,z3,z4){const Z=[z1,z2,z3,z4],q=z=>z.length>=10?5:4,camp=[[...z1.slice(0,q(z1)),...z3.slice(0,q(z3))],[...z2.slice(0,q(z2)),...z4.slice(0,q(z4))]],rev=[[...z1.slice(q(z1)),...z3.slice(q(z3))],[...z2.slice(q(z2)),...z4.slice(q(z4))]];
  const zk=t=>{for(let i=0;i<4;i++){const j=Z[i].indexOf(t);if(j>=0)return(j+1)*10+i}return 999};
  const gc=camp.map(g=>fedGroup(g)),gr=rev.map(g=>fedGroup(g)),sd=(gs,n)=>[...gs[0].slice(0,n).map((id,i)=>({id,k:(i+1)*10})),...gs[1].slice(0,n).map((id,i)=>({id,k:(i+1)*10+1}))].sort((x,y)=>x.k-y.k).map(x=>x.id);
  const kc=zKO(sd(gc,4),true),kr=zKO(sd(gr,5),true),used=new Set([kc.w,kr.w]),rest=[...gc[0].concat(gc[1]).sort((x,y)=>zk(x)-zk(y)),...gr[0].concat(gr[1]).sort((x,y)=>zk(x)-zk(y))].filter(t=>!used.has(t));
  return{order:[kc.w,kr.w,...rest],rep:{pre:'',red:[...kc.rds.map(r=>({n:'Zona Campeonato · '+r.n,m:r.m})),...kr.rds.map(r=>({n:'Zona Reválida · '+r.n+(r==kr.rds[0]?' (por el 2.º ascenso)':''),m:r.m}))]}}},
 ar2(zA,zB){const key=zKey(zA,zB),f=kt(zA[0],zB[0],1),L=f==zA[0]?zB[0]:zA[0],m1=[];
  for(let k=2;k<=8;k++){const x=zA[k-1],y=zB[9-k],[a,b]=key(x)<=key(y)?[x,y]:[y,x];m1.push({a,b,w:kt(a,b)})}
  const q=[L,...m1.map(x=>x.w).sort((x,y)=>key(x)-key(y))],ko=zKO(q,true);
  return{order:zOrder(zA,zB,[f,ko.w],[zA[16],zA[17],zB[16],zB[17]]),rep:{final:{a:zA[0],b:zB[0],w:f},red:[{n:'1.ª fase (puestos 2.º a 8.º de cada zona, partido único)',m:m1},...ko.rds]}}},
 ar4(zA,zB){const key=zKey(zA,zB),f=kt(zA[0],zB[0],1),q=[...zA.slice(1,7),...zB.slice(1,7)].sort((x,y)=>key(x)-key(y)),ko=zKO(q,true),dA=zA[13],dB=zB[13],def=kt(dA,dB,1),drop=def==dA?dB:dA;
  return{def,drop,order:zOrder(zA,zB,[f,ko.w],[]),rep:{final:{a:zA[0],b:zB[0],w:f},red:ko.rds,last:{a:dA,b:dB,w:def}}}},
 ar6(zA,zB){const key=zKey(zA,zB),f=kt(zA[0],zB[0],1),q=[...zA.slice(1,4),...zB.slice(1,4)].sort((x,y)=>key(x)-key(y)),ko=zKO(q,true);
  return{red:ko.w,order:zOrder(zA,zB,[f],[]),rep:{final:{a:zA[0],b:zB[0],w:f},red:ko.rds}}}};
const careerCfg=car=>{const c0=car.cats[car.me.cat],Z=car.zones&&car.zones[c0.div];if(Z){const pr=c0.div=='ar1';return{div:'custom',real:1,zone:pr?undefined:1,iz:c0.div=='ar2'?1:undefined,zones:Z.map(a=>a.slice()),seg:pr?[16,16]:undefined,zl:RZL[c0.div],teams:Z.flat(),n:Z.flat().length,fmt:pr?'liga1':'liga2',lbl:c0.name+' · Temporada '+car.season}}const cc=careerCfg0(car);if(car.mode=='real'&&RZL[c0.div])cc.zl=RZL[c0.div];return cc};
const careerCfg0=car=>({div:'custom',real:car.mode=='real'?1:undefined,teams:car.cats[car.me.cat].teams.slice(),n:car.cats[car.me.cat].teams.length,fmt:car.fmts?car.fmts[car.me.cat]:car.fmt,lbl:car.cats[car.me.cat].name+' · Temporada '+car.season});
// Cierra la temporada: table = tabla final de la categoría del jugador (la sala ya terminó). Devuelve {car: carrera de la temporada siguiente, summary} o {error}.
function careerClose(car,table,segT){
 if(!car||!Array.isArray(car.cats)||!car.cats.length||!CXKS.includes(car.cats.length))return{error:'Carrera inválida'};
 const k=car.cats.length,ud=k>1?car.ud:0,cp=car.cup||[ud,ud,ud,ud],sz=car.cats.map(c=>c.teams.length),mc=car.me.cat,club=car.me.club,zc=car.zones&&car.zones[car.cats[mc].div],zi=zc?zc.findIndex(a=>a.includes(club)):-1;
 const mine=(Array.isArray(table)?table:[]).slice().sort(cmpT).map(q=>q.id);
 if(mine.length!=sz[mc]||!mine.every(id=>car.cats[mc].teams.includes(id)))return{error:'La tabla de la temporada no coincide con tu categoría'};
 const zr={};if(car.zones)car.cats.forEach((c,i)=>{const Z=car.zones[c.div];if(!Z)return;if(c.div=='ar1'){zr[i]=i==mc?primFrom(Z,table,segT):primSim(Z);if(!zr[i])throw new Error('falta la tabla del Apertura');return}const zt=Z.map(zz=>i==mc?mine.filter(id=>zz.includes(id)):simSeason(zz,'liga2'));zr[i]=ZF[c.div](...zt)});
 let xP=cp[3];if(zr[4]&&zr[5]){const C=zr[4],E=zr[5],w=kt(C.def,E.red,1),won=w==E.red;E.promo={a:E.red,b:C.def,w};xP=won?2:1;C.order=[...C.order.filter(t=>t!=C.def&&t!=C.drop),C.def,C.drop];if(won)E.order=[E.order[0],E.red,...E.order.slice(1).filter(t=>t!=E.red)]}
 const st=car.cats.map((c,i)=>zr[i]?zr[i].order:i==mc?mine:simSeason(c.teams,car.fmts?car.fmts[i]:car.fmt)),stay=[],up=st.map(()=>[]),down=st.map(()=>[]),inc=st.map(()=>[]);
 // Estructura: 0 Primera · 1 Nacional · 2 B Metro y 3 Federal A (vías paralelas) · 4 Primera C · 5 Promocional.
 // Nacional baja a cada club a B Metro (metropolitanos) o a Federal A (interior); las dos vías suben a Nacional tantos como recibieron. Federal A no tiene descenso.
 if(car.mode=='real'&&k>=3){const t=st[2],ko=zKO(t.slice(1,9),false);zr[2]={rep:{red:ko.rds}};st[2]=[t[0],ko.w,...t.slice(1).filter(x=>x!=ko.w)]}   // B Metro: el campeón sube directo; el reducido (puestos 2.º a 9.º, partido único) da el 2.º ascenso. Pendiente de confirmar con reglamento.
 st.forEach((s,i)=>{const t=s.slice();stay[i]=t});
 const take=(i,c,top)=>{const t=stay[i];return top?t.splice(0,c):t.splice(t.length-c,c)};
 if(k>1){down[0]=take(0,cp[0],0);up[1]=take(1,cp[0],1);down[1]=k>=4?take(1,cp[1],0):[];
  if(k>=4){const dm=down[1].filter(isMetro),df=down[1].filter(id=>!isMetro(id));up[2]=take(2,dm.length,1);up[3]=take(3,df.length,1);
   if(k>=5){down[2]=take(2,cp[2],0);up[4]=take(4,cp[2],1);down[4]=k>=6?take(4,xP,0):[];if(k>=6)up[5]=take(5,xP,1)}
   inc[1]=[...down[0],...up[2],...up[3]];inc[0]=up[1];inc[2]=[...dm,...(k>=5?up[4]:[])];inc[3]=df;if(k>=5){inc[4]=[...down[2],...(k>=6?up[5]:[])];if(k>=6)inc[5]=down[4]}}
  else{inc[0]=up[1];inc[1]=down[0]}}
 const teams=stay.map((t,i)=>[...t,...inc[i]]),to=teams.findIndex(t=>t.includes(club)),pos=(zi>=0&&car.cats[mc].div!='ar1'?mine.filter(id=>zc[zi].includes(id)):mine).indexOf(club)+1,champ=st[mc][0]==club,res=CXLVL[to]<CXLVL[mc]?'sube':CXLVL[to]>CXLVL[mc]?'baja':'sigue';
 if(teams.some((t,i)=>t.length!=sz[i]))return{error:'Error interno: cantidad de equipos desbalanceada'};
 const nc={...car,season:car.season+1,cup:car.cup?(RCUP[car.season+1]||car.cup):undefined,cats:car.cats.map((c,i)=>({...c,teams:teams[i]})),me:{club,cat:to},last:null,hist:[...(car.hist||[]),{y:car.season,cat:car.cats[mc].name,pos,champ,res}]};
 if(car.zones)nc.zones=Object.fromEntries(car.cats.map((c,i)=>RZ[c.div]?[c.div,zsplit(teams[i],RZ[c.div].zs,c.div)]:null).filter(Boolean));
 return{car:nc,summary:{season:car.season,cats:car.cats.map((c,i)=>({name:c.name,champ:st[i][0],up:up[i],down:down[i],po:zr[i]?{...zr[i].rep,promo:zr[i].promo}:undefined})),me:{club,from:mc,to,pos,champ,res,zone:zi>=0&&car.cats[mc].div!='ar1'?'ABCD'[zi]:undefined,tor:car.cats[mc].div=='ar1'&&zr[mc]?zr[mc].rep.tor.filter(t=>t.champ==club).map(t=>t.n):undefined,n:car.cats[mc].teams.length}}}}
function careerTitle(sum,dt){if(!CFG.onTitle||!sum||!sum.me||!TM[sum.me.club])return;const m=sum.me,w=[];if(m.champ&&m.zone)w.push('liga2');(m.tor||[]).forEach(()=>w.push('liga1'));w.forEach(fmt=>{const rec={tid:newTid(),club:m.club,clubNombre:TM[m.club].name,dt:String(dt||'DT').replace(/[<>&"]/g,'').slice(0,16)||'DT',mod:'offline',comp:'real',compNombre:'Clásico realista',fmt,n:m.n,at:Date.now()};try{Promise.resolve(CFG.onTitle(rec)).catch(()=>{})}catch(e){}})}
const API={act,listen,rooms,CFG,rJoin,pubList,pubApi,snapshot,restore,careerNew,realNew,careerCfg,careerClose,careerTitle,simSeason,isMetro,simGame,teamStrength,rankInfo};if(typeof module!=='undefined')module.exports=API;else window.ENG=API;
})();
