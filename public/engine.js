(function(){
const D=typeof require!=='undefined'?require('./data'):window.DATA,{DIVS,CUPS,TM,FM,slots,autoXI,squad,setMix,roleOvr,squadMode,PHIL,phOff,phDelta,validPhil}=D,AV=(x,a)=>x.at?x.at[a]:x.r,avg=(arr,f)=>arr.length?arr.reduce((s,x)=>s+f(x),0)/arr.length:60,rnd=Math.random,rooms={},CFG={rankMin:10,tick:1000,offline:typeof window!=='undefined',fastWaits:false,realK:D.NORMAL.K,realC:D.NORMAL.C};
// Fuerza efectiva por modo: equilibrado = plantel normalizado (data.js); normal = diferencias reales atenuadas (CFG.realK) para que la calidad no decida de antemano.
const cmpV=v=>CFG.realC+(v-CFG.realC)*CFG.realK;
const sqOf=(r,team)=>{const c=r.sqc||(r.sqc={});if(c[team])return c[team];const mix=!!(r.cfg&&r.cfg.mix),raw=squadMode(team,mix);return c[team]=mix?raw:raw.map(x=>({...x,r:cmpV(x.r),at:Object.fromEntries(Object.keys(x.at).map(a=>[a,cmpV(x.at[a])]))}))};
const poolOf=r=>r.cfg.div=='all'?DIVS.flatMap(d=>d.teams):r.cfg.cup?(CUPS.find(x=>'cup:'+x.id==r.cfg.div)||{clubs:[]}).clubs.map(i=>TM[i]):(DIVS.find(d=>d.id==r.cfg.div)||{teams:[]}).teams;
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
const wx=()=>{const q=rnd(),k=q<.5?0:q<.8?1:2;return{k,t:Math.round(k==0?17+rnd()*17:k==1?9+rnd()*13:6+rnd()*12)}},newMatch=(a,b)=>({a,b,w:wx(),ga:0,gb:0,evs:[],gl:[],fl:null,st:[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],pg:[{},{}],pas:[{},{}],pr:[{},{}],yc:[{},{}],off:[new Set(),new Set()],used:[new Set(),new Set()],sb:[0,0],of:[0,0],fc:[{},{}],lf:[-9,-9]});
const rate=(m,s,i,d)=>{if(i>=0)m.pr[s][i]=clamp((m.pr[s][i]??6)+d,3,10)},eid=r=>r.eid=(r.eid||0)+1;
const nm=(r,m,s,i)=>squad(r.pl[s?m.b:m.a].team)[i].n;   // nombre del jugador i del lado s
function scoreG(r,m,s,i,min,k,as){s?m.gb++:m.ga++;m.st[s][2]++;m.pg[s][i]=(m.pg[s][i]||0)+1;if(as>=0)m.pas[s][as]=(m.pas[s][as]||0)+1;rate(m,s,i,.9);rate(m,s,as,.35);const D=r.pl[s?m.a:m.b].tac;rate(m,1-s,D.xi[0],-.25);D.xi.forEach((j,q)=>{if(q&&q<=FM[D.f][0])rate(m,1-s,j,-.08)});m.gl.push({t:s,n:nm(r,m,s,i),m:min,k})}
function pickTaker(r,m,s){const P=r.pl[s?m.b:m.a],tc=P.tac,sq=sqOf(r,P.team);let i=tc.pk;if(!tc.xi.includes(i)||m.off[s].has(i))i=tc.xi.filter((x,k)=>k&&!m.off[s].has(x)).reduce((b,x)=>b<0||AV(sq[x],'rem')>AV(sq[b],'rem')?x:b,-1);return i}
// faltas: la presión alta genera más; tarjetas; el expulsado deja al equipo con uno menos. Cada falta puede ser penal, tiro libre peligroso o falta simple.
function foul(r,m,s,min){const P=r.pl[s?m.b:m.a],tc=P.tac,sq=sqOf(r,P.team),sl=slots(tc.f),c=[],avA=avg(tc.xi.filter((i,k)=>k).map(i=>sq[i]),x=>AV(x,'ant'));tc.xi.forEach((i,k)=>{if(k&&!m.off[s].has(i))for(let w=0;w<Math.max(1,Math.round(({DEF:9,MED:10,DEL:6}[sl[k]]||5)*(m.yc[s][i]>0?.35:1)/(1+((m.fc&&m.fc[s][i])||0)*.6)*clamp(1+(avA-AV(sq[i],'ant'))/120,.7,1.4)));w++)c.push(i)});if(!c.length)return;
 const i=c[Math.floor(rnd()*c.length)];if(m.fc)m.fc[s][i]=(m.fc[s][i]||0)+1;if(m.lf)m.lf[s]=min;rate(m,s,i,-.15);m.fl={id:eid(r),m:min,x:'f',s,n:sq[i].n};const q=rnd();let red=q<.005;
 if(!red&&q<.21){m.yc[s][i]=(m.yc[s][i]||0)+1;m.st[s][5]++;rate(m,s,i,-.3);m.fl.x='y';if(m.yc[s][i]>=2){red=true;m.fl.x='r2'}}
 if(red){m.off[s].add(i);m.st[s][6]++;rate(m,s,i,-1.5);if(m.fl.x!='r2')m.fl.x='r'}
 const o=1-s,z=rnd(),tk=pickTaker(r,m,o),gk=tc.xi[0];
 if(z<.03){const x=rnd()<clamp(.76+(AV(sqOf(r,r.pl[o?m.b:m.a].team)[tk],'rem')-AV(sq[gk],'ref'))/300,.6,.88)?'g':rnd()<.6?'s':'o';m.st[o][1]++;if(x=='g')scoreG(r,m,o,tk,min,'pen',-1);else if(x=='s'){m.st[o][2]++;rate(m,o,tk,-.15);rate(m,s,gk,.8)}else rate(m,o,tk,-.3);m.evs.push({id:eid(r),k:'pen',m:min,t:o,x,n:nm(r,m,o,tk),si:tk,fn:sq[i].n})}
 else if(z<.27){const y=rnd(),x=y<.10*clamp(1+(AV(sqOf(r,r.pl[o?m.b:m.a].team)[tk],'rem')-AV(sq[gk],'ref'))/100,.5,1.6)?'g':y<.43?'w':y<.68?'s':'o';m.st[o][1]++;if(x=='g')scoreG(r,m,o,tk,min,'fk',-1);else if(x=='s'){m.st[o][2]++;rate(m,s,gk,.3)}m.evs.push({id:eid(r),k:'fk',m:min,t:o,x,n:nm(r,m,o,tk),si:tk,fn:sq[i].n})}
 else m.evs.push({id:eid(r),k:'foul',m:min,t:o,fn:sq[i].n})}
// cambios automáticos desde el minuto 60: sale quien rinde mal (<5,7) o tiene amarilla; entra el mejor suplente de su puesto (máx. 3)
function autoSub(r,m,min){if(min<60)return;for(let s=0;s<2;s++){const P=r.pl[s?m.b:m.a],tc=P.tac;if(!tc.auto||m.sb[s]>=3)continue;const sq=squad(P.team),sl=slots(tc.f),xi=tc.xi;let w=-1,wv=99;
 xi.forEach((i,k)=>{if(!k||m.off[s].has(i))return;const v=m.pr[s][i]??6;if((v<5.7||m.yc[s][i]>0)&&v<wv){wv=v;w=k}});if(w<0)continue;
 const out=xi[w];let b=-1;sq.forEach((x,i)=>{if(xi.includes(i)||m.off[s].has(i)||m.used[s].has(i))return;if(x.p==sl[w]&&(b<0||x.r>sq[b].r))b=i});if(b<0||sq[b].r<sq[out].r-10)continue;
 xi[w]=b;m.used[s].add(out);m.sb[s]++;m.pr[s][b]=6;m.fl={id:eid(r),m:min,x:'sub',s,n:sq[out].n+' ➜ '+sq[b].n}}}
// probabilidad de falta por minuto: baja respecto de antes (los contactos leves no son infracción); la comete más el que defiende que el que tiene la pelota; no se encadenan faltas seguidas del mismo equipo; la presión alta y el estilo ofensivo siguen sumando
function foulP(m,s,t,min,tc,ph){const gap=min-((m.lf&&m.lf[s])??-9);return .106*[.8,1,1.4][tc.pr]*[.9,1,1.08][tc.st]*((ph||{ev:{foul:1}}).ev.foul)*(s==t?.62:1.3)*(gap<3?.3:gap<6?.7:1)}
function simMin(r,m,min){const A=r.pl[m.a],B=r.pl[m.b];if(!A||!B)return;const P=[A,B],sa=strength(r,A.team,A.tac,m.off[0],A.phil),sb=strength(r,B.team,B.tac,m.off[1],B.phil),pa=(sa.m*[.92,1,1.08][A.tac.st]*[.97,1,1.04][A.tac.pr])**2/((sa.m*[.92,1,1.08][A.tac.st]*[.97,1,1.04][A.tac.pr])**2+(sb.m*[.92,1,1.08][B.tac.st]*[.97,1,1.04][B.tac.pr])**2),t=rnd()<pa?0:1;m.st[t][0]++;
 for(let s=0;s<2;s++){const tc=P[s].tac;if(rnd()<foulP(m,s,t,min,tc,PHIL[P[s].phil])){m.st[s][4]++;foul(r,m,s,min)}}
  const pfA=PHIL[P[t].phil],pfD=PHIL[P[1-t].phil];if(rnd()>[.25,.33,.43][P[t].tac.st]+(P[1-t].tac.st==2?.03:0)+(pfA?pfA.ev.atk:0)+(pfD?pfD.ev.oppAtk:0))return;const at=t?sb:sa,df=t?sa:sb,atc=P[t].tac,dfc=P[1-t].tac,wing=atc.wing,mod=wing?(FM[dfc.f][0]>=5?.95:1.05):(FM[dfc.f][1]>=5?.95:1.05),
 lead=t?m.gb-m.ga:m.ga-m.gb,ch=chain(atc,wing,m.off[t]),ev={id:eid(r),k:'att',m:min,t,ch,x:'l'};
 const sqA=sqOf(r,P[t].team),sqD=sqOf(r,P[1-t].team),slA=slots(atc.f),slD=slots(dfc.f),ea=(s,x,k,a)=>AV(x,a)+phOff(P[s].phil,(s==t?slA:slD)[k],a);   // atributo efectivo = dato del jugador + ajuste de la filosofía según la línea (se recalcula limpio, no se acumula)
 if(pfA&&pfA.ev.direct&&ch.length>3&&rnd()<pfA.ev.direct)ch.splice(1,ch.length-3);   // juego directo
 {const lk=ch[ch.length-1],ln=slA[lk];if(ln=='DEL'||ln=='MED'){const cand=atc.xi.map((i,k)=>k).filter(k=>slA[k]==ln&&!m.off[t].has(atc.xi[k])&&(k==lk||!ch.includes(k)));
  if(cand.length>1&&rnd()<.55){const w=cand.map(k=>{const x=sqA[atc.xi[k]];return Math.pow(Math.max(20,ea(t,x,k,'rem'))/60,3)*(ea(t,x,k,'des')/60)});let u=rnd()*w.reduce((a,b)=>a+b,0),pk=cand[0];for(let j=0;j<cand.length;j++){u-=w[j];if(u<=0){pk=cand[j];break}}ch[ch.length-1]=pk}}}   // los que mejor definen y se desmarcan reciben más remates
 const lk2=ch[ch.length-1],shx=sqA[atc.xi[lk2]],defs=dfc.xi.map((i,k)=>({x:sqD[i],k,i})).filter(o=>slD[o.k]=='DEF'&&!m.off[1-t].has(o.i)),passers=ch.slice(0,-1),
  pq=passers.length?avg(passers,k=>ea(t,sqA[atc.xi[k]],k,'pas')):ea(t,shx,lk2,'pas'),carry=(ea(t,shx,lk2,'ctl')+ea(t,shx,lk2,'reg'))/2,dq=avg(defs,o=>(ea(1-t,o.x,o.k,'mar')+ea(1-t,o.x,o.k,'ant'))/2),dAnt=avg(defs,o=>ea(1-t,o.x,o.k,'ant')),aDes=avg(ch.slice(-3),k=>ea(t,sqA[atc.xi[k]],k,'des')),
  offF=clamp(1-(aDes-dAnt)/150,.7,1.4),lostP=clamp(.30*(1-((pq+carry)/2-dq)/150)+(pfD?pfD.ev.lostDef:0)+(pfA?pfA.ev.lostAtk:0),.2,.46);   // pase y conducción vs marca y anticipación; desmarque vs anticipación
 ch.forEach(k=>rate(m,t,atc.xi[k],.025));
 const offP=clamp(.05+(dfc.pr==2?.04:dfc.pr==0?-.015:0)+(dfc.st==2?.03:dfc.st==0?-.02:0)+(atc.st==2?.025:0)+clamp((at.a*mod/df.d-1)*.2,0,.06),.02,.16);   // fuera de juego: más si la defensa rival sube la línea o si se ataca al límite
 if(rnd()<clamp(offP*offF,.02,.2)){ev.x='f';rate(m,t,atc.xi[ch[ch.length-1]],-.08);m.of[t]++;m.evs.push(ev);return}
 if(rnd()<lostP){rate(m,t,atc.xi[ch[ch.length-1]],-.12);const dl=dfc.xi.filter((i,k)=>k&&!m.off[1-t].has(i));rate(m,1-t,dl[Math.floor(rnd()*dl.length)],.08);m.evs.push(ev);return}
 m.st[t][1]++;let p=clamp(.072*Math.pow(at.a*mod*[.95,1,1.07][dfc.st]/df.d,2.2),.02,.35);if(lead>=2)p*=Math.pow(.55,lead-1);if(lead>=4)p=.01;
 const sh=atc.xi[ch[ch.length-1]],as=ch.length>1?atc.xi[ch[ch.length-2]]:-1,gk=dfc.xi[0],duel=(ea(t,shx,lk2,'rem')*.7+ea(t,shx,lk2,'des')*.3)-(ea(1-t,sqD[gk],0,'ref')*.55+dq*.45);p=clamp(p*clamp(1+duel/120,.75,1.3)*((pfD&&pfD.ev.guard)||1),.01,.4);   // definición y desmarque del que remata vs reflejos del arquero y defensa
 if(rnd()<p){ev.x='g';ev.n=nm(r,m,t,sh);ev.si=sh;ev.ai=as;scoreG(r,m,t,sh,min,'att',as)}
 else if(rnd()<clamp(.5+duel/300,.4,.62)){ev.x='s';m.st[t][2]++;rate(m,t,sh,.12);rate(m,1-t,gk,.45)}
 else{ev.x='o';rate(m,t,sh,-.12)}
 m.evs.push(ev);
 if(ev.x!='g'&&rnd()<(ev.x=='s'?.4:.15)*[.8,1,1.25][atc.st]){m.st[t][3]++;const cg=rnd()<.06,c={id:eid(r),k:'cor',m:min,t,x:cg?'g':'c'};
  if(cg){const sl=slots(atc.f),w=[];atc.xi.forEach((x,k)=>{if(k&&!m.off[t].has(x))for(let n=0;n<({DEF:2,MED:1,DEL:3}[sl[k]]||1);n++)w.push(x)});const hd=w[Math.floor(rnd()*w.length)];m.st[t][1]++;c.n=nm(r,m,t,hd);c.si=hd;scoreG(r,m,t,hd,min,'cor',-1)}
  m.evs.push(c)}}
function mkFixtures(r){const ids=shuf(r.order.map(p=>r.pl[p].team));if(r.cfg.fmt=='copa'){r.alive=ids;return}
 const a=[...ids],R=[];if(a.length%2)a.push(null);const n=a.length;for(let k=0;k<n-1;k++){const x=[];for(let i=0;i<n/2;i++)x.push(k%2?[a[n-1-i],a[i]]:[a[i],a[n-1-i]]);R.push(x);a.splice(1,0,a.pop())}
 r.fx=r.cfg.fmt=='liga2'?[...R,...R.map(x=>x.map(([p,q])=>[q,p]))]:R;r.total=r.fx.length}
function copaPairs(r){const a=[...r.alive];while(a.length&&(a.length&(a.length-1)))a.push(null);const h=a.length/2,x=[];for(let i=0;i<h;i++)x.push([a[i],a[a.length-1-i]]);return x}
const byTeam=(r,t)=>r.order.find(p=>r.pl[p].team==t);
function startRound(r){const pairs=r.cfg.fmt=='copa'?copaPairs(r):r.fx[r.round];r.byes=[];r.ms=[];r.award=null;
 pairs.forEach(([x,y])=>{if(!x||!y)r.byes.push(x||y);else r.ms.push(newMatch(byTeam(r,x),byTeam(r,y)))});
 r.order.forEach(p=>{r.pl[p].ready=!!r.pl[p].bot;r.pl[p].skip=false});r.phase='cer';r.min=0;r.t=18;if(r.offline)botTune(r,0)}
function maybeStart(r){if(r.order.length==r.cfg.n&&r.order.every(p=>r.pl[p].team)){r.order.forEach(p=>r.table[r.pl[p].team]={pj:0,gf:0,ga:0,pts:0,g:0,e:0,p:0});mkFixtures(r);r.phase='pre';r.t=180}}
function begin1(r){r.phase='m1';r.t=0;r.order.forEach(p=>{const P=r.pl[p];P.skip=false;if(!P.bot&&P.tac)P.base=cl(P.tac)})}
function endRound(r){r.order.forEach(p=>{const P=r.pl[p];if(!P.bot&&P.base){P.tac=P.base;P.base=null}});   // lo que cambiaste durante el partido no queda para los siguientes
 const res=[];if(r.cfg.fmt!='copa')r.prevRank=rankOf(r);r.ms.forEach(m=>{const A=r.pl[m.a].team,B=r.pl[m.b].team;let pen='';
 if(r.cfg.fmt=='copa'){if(m.ga==m.gb){pen=rnd()<.5?A:B}}else{const s=r.table;[[A,m.ga,m.gb],[B,m.gb,m.ga]].forEach(([t,f,c])=>{const q=s[t];q.pj++;q.gf+=f;q.ga+=c;q.pts+=f>c?3:f==c?1:0;q.g+=+(f>c);q.e+=+(f==c);q.p+=+(f<c)})}
 res.push({a:A,b:B,ga:m.ga,gb:m.gb,pen})});r.res=res;r.ms=[];(r.hist=r.hist||[]).push(res);r.round++;
 if(r.cfg.fmt=='copa'){const w=[...r.byes];res.forEach(x=>w.push(x.ga>x.gb?x.a:x.gb>x.ga?x.b:x.pen));r.alive=w;r.total=r.total||Math.log2(copaPairs({alive:r.order.map(p=>r.pl[p].team)}).length*2);if(w.length==1){r.phase='end';r.champ=w[0];regTitle(r);return}}
 else if(r.round>=r.total){r.phase='end';r.champ=Object.entries(r.table).map(([id,q])=>({id,...q})).sort(cmpT)[0].id;regTitle(r);return}
 r.phase='lobby';r.t=r.cfg.fmt=='copa'&&r.alive&&r.order.every(p=>r.pl[p].bot||!r.alive.includes(r.pl[p].team))?6:90;r.ms=[];r.order.forEach(p=>r.pl[p].ready=!!r.pl[p].bot)}
// Equipo de la fecha: más goles; si empatan, mejor diferencia; si siguen igualados, mejores estadísticas (posesión, remates, a puerta, córners, menos faltas y tarjetas)
const cmpT=(a,b)=>b.pts-a.pts||b.g-a.g||b.gf-a.gf||(b.gf-b.ga)-(a.gf-a.ga);
const rankOf=r=>{const o={};Object.entries(r.table).map(([id,q])=>({id,...q})).sort(cmpT).forEach((q,i)=>o[q.id]=i+1);return o};
function awardOf(r){let best=null;r.ms.forEach(m=>[0,1].forEach(s=>{const o=1-s,gf=s?m.gb:m.ga,ga=s?m.ga:m.gb,st=m.st[s],tot=(m.st[0][0]+m.st[1][0])||1,comp=st[0]/tot*40+st[1]*1.2+st[2]*2+st[3]*.5-st[4]*.2-st[5]*.5-st[6]*3+rnd()*.01,sc=[gf,gf-ga,comp];
  if(!best||sc[0]>best.sc[0]||(sc[0]==best.sc[0]&&(sc[1]>best.sc[1]||(sc[1]==best.sc[1]&&sc[2]>best.sc[2]))))best={sc,team:r.pl[s?m.b:m.a].team,rival:r.pl[o?m.b:m.a].team,gf,ga}}));
 if(best){r.award={team:best.team,rival:best.rival,gf:best.gf,ga:best.ga};r.aw=r.aw||{};r.aw[best.team]=(r.aw[best.team]||0)+1}}
function tick(r){setMix(r.cfg&&r.cfg.mix);if(r.paused)return;if(r.phase=='pre'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0)startRound(r)}else if(r.phase=='cer'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0)begin1(r)}else if(r.phase=='m1'||r.phase=='m2'){if(r.add>0){r.ms.forEach(m=>{m.evs=[]});if(r.add==1&&!CFG.fastWaits&&(r.hold=(r.hold||0)+1)<=30&&r.order.some(p=>!r.pl[p].bot&&r.pl[p].busy)){}else if(--r.add==0){r.hold=0;r.order.forEach(p=>r.pl[p].busy=false);if(r.min==45){r.phase='ht';r.t=15;r.order.forEach(p=>r.pl[p].skip=false);if(r.offline)botTune(r,1)}else{r.phase='fin';r.t=5}}}else{r.min++;r.ms.forEach(m=>{m.evs=[];simMin(r,m,r.min);autoSub(r,m,r.min)});if(r.min==45||r.min>=90){r.add=CFG.fastWaits?1:3;r.hold=0}}}   // tiempo agregado: sin jugadas nuevas, para que se terminen de ver las que quedaron antes del descanso/final
 
 else if(r.phase=='fin'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0){awardOf(r);r.phase='awd';r.t=5}}else if(r.phase=='awd'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0)endRound(r)}else if(r.phase=='ht'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0)r.phase='m2'}else if(r.phase=='lobby'){r.t-=CFG.fastWaits?1:1/r.spd;if(r.t<=0)startRound(r)}else return;push(r)}
function nextOf(r,team){if(r.phase=='pick'||r.phase=='end')return null;const pr=r.cfg.fmt=='copa'?copaPairs(r):r.fx&&r.fx[r.round],p=pr&&pr.find(x=>x.includes(team));return p?(p[0]&&p[1]?{o:p[0]==team?p[1]:p[0],h:p[0]==team}:{o:null}):null}
function calOf(r,team){const c=[],H=r.hist||[],sc=(x,h)=>(h?x.ga:x.gb)+'-'+(h?x.gb:x.ga);
 if(r.cfg.fmt!='copa'){(r.fx||[]).forEach((pr,i)=>{const p=pr.find(x=>x.includes(team));if(!p)return;const h=p[0]==team,x=H[i]&&H[i].find(q=>q.a==p[0]&&q.b==p[1]);c.push({r:i+1,o:h?p[1]:p[0],h,s:x?sc(x,h):null})})}
 else H.forEach((hs,i)=>{const x=hs.find(q=>q.a==team||q.b==team);if(x){const h=x.a==team;c.push({r:i+1,o:h?x.b:x.a,h,s:sc(x,h)+(x.pen?(x.pen==team?' (ganó x pen.)':' (perdió x pen.)'):'')})}});return c}
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),cd=(a,b)=>{const x=hx(a),y=hx(b);return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2])},lmn=c=>{const x=hx(c);return(.299*x[0]+.587*x[1]+.114*x[2])/255};
const kitsOf=(A,B)=>{const ka=[A.tac.k1,A.tac.k2];let kb=[B.tac.k1,B.tac.k2];if(cd(ka[0],kb[0])<110){kb=[B.tac.k2,B.tac.k1];if(cd(ka[0],kb[0])<110)kb=[lmn(ka[0])>.55?'#1b1b1b':'#f4f4f4',B.tac.k1]}return[ka,kb]};   // camiseta alternativa para el visitante
const DORS=[1,12,2,3,4,5,13,15,6,8,10,14,16,20,9,7,11,19];
const pInfo=(m,s,P)=>{const tc=P.tac;return{x:tc.xi.slice(),n:tc.xi.map(i=>DORS[i]),y:tc.xi.map((i,k)=>m.yc[s][i]>0&&!m.off[s].has(i)?k:-1).filter(k=>k>=0),g:tc.xi.map(i=>m.pg[s][i]||0),a:tc.xi.map(i=>m.pas[s][i]||0),c:tc.xi.indexOf(tc.cap)}};
const offKs=(m,s,P)=>P.tac.xi.map((i,k)=>m.off[s].has(i)?k:-1).filter(k=>k>=0);
function view(r,pid){setMix(r.cfg&&r.cfg.mix);const me=r.pl[pid],own={};r.order.forEach(p=>{if(r.pl[p].team)own[r.pl[p].team]=r.pl[p].name});
 const v={code:r.code,rk:rankInfo(r),tit:r.tit||null,cfg:r.cfg,rn:r.cfg.fmt=='copa'&&r.alive?(()=>{const k=r.alive.length;return k==2?'Final':k==4?'Semifinales':k==8?'Cuartos de final':k==16?'Octavos de final':(k&(k-1))?'Ronda preliminar':''})():'',elim:!!(me&&me.team&&r.cfg.fmt=='copa'&&r.alive&&r.round>0&&!r.alive.includes(me.team)&&['lobby','pre'].includes(r.phase)),needRiv:!!r.needRiv,spd:r.spd||1,phase:r.phase,round:r.round,total:r.total,t:Math.ceil(r.t),min:r.min,own,champ:r.champ,res:r.res,byes:r.byes,prev:r.prevRank||null,award:r.award||null,aw:r.aw||{},
 table:Object.entries(r.table).map(([id,q])=>({id,...q})),chat:r.chat.slice(-40).map(c=>({id:c.id,n:c.n,t:c.t,u:c.u.length,d:c.d.length,me:c.pid===pid,my:c.u.includes(pid)?1:c.d.includes(pid)?-1:0})),
 ms:(r.ms||[]).map(m=>{const A=r.pl[m.a],B=r.pl[m.b],kt=kitsOf(A,B);return{a:A.team,b:B.team,pha:A.phil||'equilibrada',phb:B.phil||'equilibrada',w:m.w,ra:[A.tac.k1,A.tac.k2],rb:[B.tac.k1,B.tac.k2],ga:m.ga,gb:m.gb,fa:A.tac.f,fb:B.tac.f,ka:kt[0],kb:kt[1],evs:m.evs,gl:m.gl,ta:[A.tac.st,A.tac.pr,A.tac.wing,A.tac.sal,A.tac.mk],tb:[B.tac.st,B.tac.pr,B.tac.wing,B.tac.sal,B.tac.mk],fl:m.fl,of:m.of,st:m.st.map(x=>[...x]),oa:offKs(m,0,A),ob:offKs(m,1,B),pa:pInfo(m,0,A),pb:pInfo(m,1,B)}}),
 ready:r.order.map(p=>r.pl[p].ready),n:r.order.length,pls:r.order.map(p=>({n:r.pl[p].name,t:r.pl[p].team,b:!!r.pl[p].bot,f:r.pl[p].phil||'equilibrada'})),off:!!r.offline,paused:!!r.paused,sk:(()=>{const hs=r.order.filter(p=>!r.pl[p].bot);return{n:hs.filter(p=>r.pl[p].skip).length,of:hs.length,me:!!(me&&me.skip)}})(),nf:(r.phase=='pre'||r.phase=='lobby')?((r.cfg.fmt=='copa'?copaPairs(r):(r.fx&&r.fx[r.round]))||null):null};
 if(me){v.me={team:me.team,ready:me.ready,tac:me.tac,phil:me.phil||'equilibrada'};if(me.team){v.me.sq=squad(me.team).map(({at,...q})=>q);v.me.sl=slots(me.tac.f);const mm=(r.ms||[]).find(x=>x.a==pid||x.b==pid);if(mm){const s=mm.a==pid?0:1;v.me.rt=v.me.sq.map((_,i)=>mm.pr[s][i]!==undefined?+mm.pr[s][i].toFixed(1):(me.tac.xi.includes(i)?6:null));v.me.cd=v.me.sq.map((_,i)=>[mm.yc[s][i]||0,mm.off[s].has(i)?1:0]);v.me.sb=mm.sb[s];v.me.used=[...mm.used[s]]}v.next=nextOf(r,me.team);if(!['cer','m1','ht','m2','fin','awd'].includes(r.phase))v.cal=calOf(r,me.team)}}return v}
function push(r){r.order.forEach(p=>{const c=r.pl[p];if(c.cb)try{c.cb(view(r,p))}catch(e){}})}
function addBots(r,div,ids){const free=ids?[...ids].reverse():shuf(div.teams.map(t=>t.id).filter(id=>!r.order.some(p=>r.pl[p].team==id)));
 for(let i=1;r.order.length<r.cfg.n;i++){const id=free.pop(),bp='bot'+i;r.pl[bp]={name:'CPU '+i,team:id,ready:true,tac:{...newTac(id),auto:1},res:null,bot:true};r.order.push(bp)}}
// IA: elige formación, estilo, presión y ataque según el rival; en el entretiempo reacciona al marcador.
function botTune(r,half){r.ms.forEach(m=>[[m.a,m.b,m.ga-m.gb],[m.b,m.a,m.gb-m.ga]].forEach(([p,o,d])=>{const P=r.pl[p],O=r.pl[o];if(!P.bot)return;const t=P.tac,sq=squad(P.team);
 if(!half){const ot=O.tac,os=strength(r,O.team,ot,undefined,O.phil);let best=null;
  for(let f=0;f<FM.length;f++){const c={...t,f,xi:autoXI(sq,f)},s=strength(r,P.team,c,undefined,P.phil),sc=s.a+s.m+s.d+(FM[f][1]>=5&&os.m>s.m?3:0)+rnd()*2;if(!best||sc>best.sc)best={sc,f,xi:c.xi}}
  if(best.f!=t.f){t.f=best.f;t.xi=best.xi;t.cap=t.xi.reduce((q,i)=>sq[i].r>sq[q].r?i:q,t.xi[0]);t.pk=t.xi.reduce((q,i)=>sq[i].p=='DEL'&&(q<0||sq[i].r>sq[q].r)?i:q,-1)}
  const me=strength(r,P.team,t,undefined,P.phil),df=me.a+me.m+me.d-(os.a+os.m+os.d);t.st=df>4?2:df<-4?0:1;t.pr=me.m>os.m?2:1;t.wing=FM[ot.f][0]>=5?0:FM[ot.f][1]>=5?1:rnd()<.5?1:0;t.sal=ot.pr==2?(rnd()<.5?2:1):0;t.mk=rnd()<.5?1:0}
 else if(d<0){t.st=2;t.pr=2}else if(d>=2){t.st=0;t.pr=0}else if(d==1)t.st=1}))}
function listen(code,pid,cb){const r=rooms[code],c=r&&r.pl[pid];if(!c)return false;c.cb=cb;if(cb)try{cb(view(r,pid))}catch(e){}return true}
// cambia de formación en pleno partido sin cambiar jugadores: reubica a los mismos 11 en las nuevas posiciones
function reslot(sq,f,xi){const sl=slots(f),u=new Set();return sl.map(p=>{let b=-1;xi.forEach(i=>{if(u.has(i))return;const ok=sq[i].p==p;if(b<0||(ok&&sq[b].p!=p)||(ok==(sq[b].p==p)&&sq[i].r>sq[b].r))b=i});u.add(b);return b})}
function act(b){const a=b.a,pid=txt(b.pid,40),name=txt(b.name,16)||'Invitado';if(!pid)return'Falta id';let r=rooms[txt(b.room,12).toLowerCase()];
 if(a=='create'){const c=b.cfg||{},isAll=c.div=='all',cup=CUPS.find(x=>'cup:'+x.id==c.div),div=isAll?{id:'all',ok:1}:cup?{id:'cup:'+cup.id,ok:1,teams:cup.clubs.map(i=>TM[i])}:DIVS.find(d=>d.id==c.div&&d.ok),code=txt(b.room,12).toLowerCase(),nn=cup?Math.max(4,Math.min(cup.clubs.length,Math.floor(+c.n)||cup.clubs.length)):+c.n;
  if(!/^[a-z0-9]{3,12}$/.test(code))return'Código: 3-12 letras o números';if(rooms[code])return'Ese código ya existe';if(Object.keys(rooms).length>=60)return'Servidor lleno';
  if(!div||(!cup&&![4,6,8,10,12,16,20].includes(nn))||!['liga1','liga2','copa'].includes(c.fmt))return'Configuración inválida';if(!isAll&&div.teams.length<nn)return'Esa división tiene solo '+div.teams.length+' clubes: elegí menos jugadores';
  r=rooms[code]={code,tid:newTid(),cfg:{div:div.id,fmt:c.fmt,n:nn,mix:(isAll||(cup&&c.mix))?1:0,cup:cup?cup.title:undefined},pl:{},order:[],chat:[],phase:'pick',round:0,t:0,min:0,table:{},ms:[],touched:Date.now(),offline:!!(b.off&&CFG.offline)};r.spd=r.offline?clamp(+b.speed||1,.25,100):1;r.timer=setInterval(()=>tick(r),r.offline?1000/clamp(+b.speed||1,.25,100):CFG.tick)}
 else if(!r)return'No existe esa sala';
 if(!r.pl[pid]){if(r.order.length>=r.cfg.n||r.phase!='pick')return'Sala llena o ya empezó';r.pl[pid]={name,team:null,ready:false,tac:null,res:null,phil:r.offline?'equilibrada':validPhil(b.phil)};r.order.push(pid)}
 const me=r.pl[pid];r.touched=Date.now();let err=null;if(b.phil!==undefined&&!r.offline&&['pick','pre'].includes(r.phase))me.phil=validPhil(b.phil);
 if(a=='pick'&&r.phase=='pick'){const div={teams:poolOf(r)};if(!div.teams.some(t=>t.id==b.team)||r.order.some(p=>r.pl[p].team==b.team))return'Equipo ocupado';
  me.team=b.team;me.tac=newTac(b.team);if(r.offline){if(r.cfg.cup&&r.cfg.n>=div.teams.length)addBots(r,null,div.teams.map(t=>t.id).filter(id=>id!=b.team));else r.needRiv=1}maybeStart(r)}
 else if(a=='rivals'&&r.offline&&r.phase=='pick'&&me.team&&r.order.length<r.cfg.n){const pool=poolOf(r).map(t=>t.id).filter(id=>id!=me.team),need=r.cfg.n-1,ids=b.random?shuf([...pool]).slice(0,need):[...new Set(Array.isArray(b.teams)?b.teams:[])].filter(id=>pool.includes(id));if(ids.length!=need)return'Elegí exactamente '+need+' rivales';addBots(r,null,ids);r.needRiv=0;maybeStart(r)}
 else if(a=='ready'&&me.team&&['pre','lobby'].includes(r.phase)){me.ready=!!b.v;if(r.order.every(p=>r.pl[p].ready))startRound(r)}
 else if(a=='pause'){if(r.offline)r.paused=!!b.v}
 else if(a=='skip'){if(r.phase=='cer'){me.skip=true;if(r.order.every(p=>r.pl[p].bot||r.pl[p].skip))begin1(r)}else if(r.phase=='ht'){me.skip=true;if(r.order.every(p=>r.pl[p].bot||r.pl[p].skip)){r.phase='m2';r.t=0}}}
 else if(a=='phil'){if(!r.offline&&['pick','pre'].includes(r.phase))me.phil=validPhil(b.v)}
 else if(a=='speed'){if(r.offline){r.spd=clamp(+b.v||1,.25,100);clearInterval(r.timer);r.timer=setInterval(()=>tick(r),1000/r.spd)}}
 else if(a=='busy'){me.busy=!!b.v}
 else if(a=='chat'){const s=txt(b.text,140);if(s&&Date.now()-(me.lc||0)>400){me.lc=Date.now();r.chat.push({id:(r.cid=(r.cid||0)+1),n:me.name,pid,t:s,tm:Date.now(),u:[],d:[]});if(r.chat.length>200)r.chat.shift()}}
 else if(a=='vote'){const c=r.chat.find(x=>x.id==b.id),v=+b.v;if(c&&c.pid!==pid&&(v==1||v==-1)){const had=c.u.includes(pid)?1:c.d.includes(pid)?-1:0;c.u=c.u.filter(x=>x!=pid);c.d=c.d.filter(x=>x!=pid);if(had!=v)(v==1?c.u:c.d).push(pid)}}
 else if(a=='tac'&&me.tac){const t=me.tac,x=b.p||{},sq=squad(me.team),mm=['m1','ht','m2'].includes(r.phase)?(r.ms||[]).find(q=>q.a==pid||q.b==pid):null,ms=mm?(mm.a==pid?0:1):0;
  if(Number.isInteger(x.f)&&x.f>=0&&x.f<FM.length&&x.f!=t.f){t.f=x.f;t.xi=mm?reslot(sq,x.f,t.xi):autoXI(sq,x.f);t.cap=t.xi.reduce((q,i)=>sq[i].r>sq[q].r?i:q,t.xi[0]);t.pk=t.xi.reduce((q,i)=>sq[i].p=='DEL'&&(q<0||sq[i].r>sq[q].r)?i:q,-1)}
  if([0,1,2].includes(x.st))t.st=x.st;if([0,1,2].includes(x.pr))t.pr=x.pr;if([0,1].includes(x.wing))t.wing=x.wing;if([0,1,2].includes(x.sal))t.sal=x.sal;if([0,1].includes(x.mk))t.mk=x.mk;
  if(Number.isInteger(x.cap)&&x.cap>=0&&x.cap<sq.length)t.cap=x.cap;if(Number.isInteger(x.pk)&&x.pk>=0&&x.pk<sq.length)t.pk=x.pk;
  if([0,1].includes(x.auto))t.auto=x.auto;
  if(x.fill){if(mm)err='Formar automático solo se usa antes del partido';else{t.xi=autoXI(sq,t.f);t.cap=t.xi.reduce((q,i)=>sq[i].r>sq[q].r?i:q,t.xi[0]);t.pk=t.xi.reduce((q,i)=>sq[i].p=='DEL'&&(q<0||sq[i].r>sq[q].r)?i:q,-1)}}
  for(const k of['k1','k2'])if(/^#[0-9a-f]{6}$/i.test(x[k]))t[k]=x[k];
  if(Array.isArray(x.sw)&&x.sw.length==2&&x.sw.every(i=>Number.isInteger(i)&&i>=0&&i<sq.length)){const[i,j]=x.sw,a1=t.xi.indexOf(i),b1=t.xi.indexOf(j);if(a1>=0&&b1>=0)[t.xi[a1],t.xi[b1]]=[j,i];else if(a1>=0||b1>=0){const st=a1>=0?a1:b1,out=a1>=0?i:j,inn=a1>=0?j:i;
   if(!mm)t.xi[st]=inn;else if(mm.sb[ms]>=5)err='Ya hiciste los 5 cambios del partido';else if(mm.used[ms].has(inn))err='Ese jugador ya salió y no puede volver';else if(mm.off[ms].has(out))err='Un expulsado no se puede reemplazar';else{t.xi[st]=inn;mm.used[ms].add(out);mm.sb[ms]++;mm.pr[ms][inn]=6}}}}
 push(r);return err}

function simGame(ta,tb,o){o=o||{};setMix(!!o.mix);const r={pl:{A:{name:'A',team:ta,tac:o.tacA||newTac(ta),phil:o.philA},B:{name:'B',team:tb,tac:o.tacB||newTac(tb),phil:o.philB}},order:['A','B'],cfg:{mix:!!o.mix},eid:0},m=newMatch('A','B');for(let min=1;min<=90;min++){m.evs=[];simMin(r,m,min)}return m}   // simula 90 minutos sin sala (para pruebas)
function teamStrength(team,o){o=o||{};const r={cfg:{mix:!!o.mix}};return strength(r,team,newTac(team),undefined,o.phil)}
// Mínimo de personas para que un torneo ONLINE sea elegible para ranking. Cuenta jugadores humanos distintos (pid) de la sala; los equipos de la IA no cuentan y los torneos offline nunca son elegibles.
// OJO: el pid es un id que genera el navegador (no hay cuentas), así que esto cuenta navegadores distintos, no personas verificadas.
function rankInfo(r){const min=CFG.rankMin,h=r.order.filter(p=>!r.pl[p].bot).length,n=r.cfg.n;return{min,h,n,off:!!r.offline,ok:!r.offline&&n>=min&&(r.phase=='pick'||h>=min)}}
// ---- Registro de títulos (Bloque 4). Solo en el servidor: server.js define CFG.onTitle (guarda en PostgreSQL). En el navegador (offline) no se registra nada.
// Se llama UNA vez por torneo, cuando termina de forma normal (fase 'end' con campeón). El servidor vuelve a validar mínimo de personas y que el campeón sea un club de un jugador de la sala.
const newTid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,10)+Math.random().toString(36).slice(2,8);
function regTitle(r){if(r.titled)return;r.titled=1;if(r.offline||!CFG.onTitle)return;
 const k=rankInfo(r),dt=r.order.find(p=>!r.pl[p].bot&&r.pl[p].team==r.champ);
 if(!r.champ||!dt||!TM[r.champ]){r.tit={st:'no',why:'campeon'};return}
 if(!k.ok||k.h<k.min){r.tit={st:'no',why:'minimo'};return}
 const cup=r.cfg.cup?CUPS.find(x=>'cup:'+x.id==r.cfg.div):null,dv=cup?null:DIVS.find(d=>d.id==r.cfg.div);
 const rec={tid:r.tid,club:r.champ,clubNombre:TM[r.champ].name,dt:r.pl[dt].name,mod:cup?'barrial':'clasico',comp:cup?cup.id:r.cfg.div,compNombre:cup?cup.title:dv?dv.name:(r.cfg.div=='all'?'Todas las divisiones':String(r.cfg.div)),fmt:r.cfg.fmt,n:k.h,at:Date.now()};
 r.tit={st:'pend'};let p;try{p=Promise.resolve(CFG.onTitle(rec))}catch(e){p=Promise.reject(e)}
 p.then(x=>{r.tit=x&&x.status=='disabled'?{st:'no',why:'sin_db'}:{st:'ok',dup:!!(x&&x.status=='duplicate')};push(r)},e=>{r.tit={st:'err'};push(r);console.error('título no registrado:',e&&e.message)})}
const API={act,listen,rooms,CFG,simGame,teamStrength,rankInfo};if(typeof module!=='undefined')module.exports=API;else window.ENG=API;
})();
