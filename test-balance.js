// Auditoría reproducible de Primera. Solo mide; no modifica ratings ni reglas del juego.
let seed=20261107;
Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const DATA=require('./public/data');
const ENG=require('./public/engine');

const clubs=DATA.DIVS.find(d=>d.id==='ar1').teams.map(t=>t.id);
if(clubs.length!==30)throw new Error('Primera debe tener 30 clubes; encontrados: '+clubs.length);
const zoneCounts=Object.fromEntries(clubs.map(id=>[id,{a:0,b:0}]));

const seasons=Number(process.env.BALANCE_SEASONS||60);
const tournaments=seasons*2;
const stats=Object.fromEntries(clubs.map(id=>[id,{champ:0,top4:0,top8:0,pos:0}]));
const CLASSICS={
 ar1:'boca-river,independiente-racing,sanlorenzo-huracan,estudiantes-gimnasia,rosario-newells,banfield-lanus,belgrano-talleres,argentinos-platense,tigre-velez,union-sarmiento,atletico-centralcba,aldosivi-defensa,barracas-riestra,estudiantesrc-instituto,gimnasiamza-rivadavia',
 ar2:'allboys-nuevachicago,ferro-defensoresbelgrano,madryn-santelmo,sanmartinsj-racingcba,chaco-rafaela,sanmartintuc-gimnasiajujuy,moron-almirantebrown,estudiantesba-almagro,losandes-temperley,mitre-guemes,tristansuarez-quilmes,ciudadbolivar-agropecuario,colon-patronato,centralnorte-gimnasiatiro,godoycruz-maipu,sanmiguel-midland,colegiales-acassuso,atlanta-chacarita'
};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const CLP=Object.values(CLASSICS).flatMap(x=>x.split(',').map(p=>p.split('-')));
const RGN=(()=>{const m={};DATA.CUPS.forEach(c=>c.clubs.forEach(id=>(m[id]=m[id]||[]).push(c.id)));return m})();
const cmp=(a,b)=>b.pts-a.pts||b.g-a.g||b.gf-a.gf||(b.gf-b.ga)-(a.gf-a.ga);
const rrRounds=ids=>{const a=[...ids],R=[];if(a.length%2)a.push(null);const n=a.length;for(let k=0;k<n-1;k++){const x=[];for(let i=0;i<n/2;i++)x.push(k%2?[a[n-1-i],a[i]]:[a[i],a[n-1-i]]);R.push(x);a.splice(1,0,a.pop())}return R};
function clasicos(zA,zB){
 const fb=shuffle(zB),out=[],used=new Set(),sA=new Set(zA),sB=new Set(zB),real=new Map();
 CLP.forEach(([x,y])=>{if(sA.has(x)&&sB.has(y))real.set(x,y);else if(sA.has(y)&&sB.has(x))real.set(y,x)});
 shuffle(zA).forEach(a=>{const rv=real.get(a);if(rv&&!used.has(rv)){used.add(rv);out.push([a,rv]);return}
  const j=fb.findIndex(b=>!used.has(b)&&!CLP.some(([x,y])=>x==b||y==b)&&(RGN[a]||[]).some(g=>(RGN[b]||[]).includes(g)));
  if(j>=0){used.add(fb[j]);out.push([a,fb[j]])}else out.push([a,null])});
 const free=fb.filter(b=>!used.has(b));out.forEach(p=>{if(!p[1])p[1]=free.pop()});return out
}
// Copia el generador de fixture que usa el motor para Primera (primFx).
function primFixtures(zA,zB,reverse){
 for(let tr=0;tr<60;tr++){
  const RA=rrRounds(shuffle(zA)),RB=rrRounds(shuffle(zB)),cl=clasicos(zA,zB),key=new Set(cl.map(([a,b])=>a+'|'+b)),fx=[];
  let ok=true;
  for(let k=0;k<RA.length;k++){
   const pa=RA[k].find(q=>!q[0]||!q[1]),pb=RB[k].find(q=>!q[0]||!q[1]),ta=pa[0]||pa[1],tb=pb[0]||pb[1];
   if(key.has(ta+'|'+tb))ok=false;
   fx.push([...RA[k].filter(q=>q!==pa),...RB[k].filter(q=>q!==pb),Math.random()<.5?[ta,tb]:[tb,ta]]);
  }
  if(!ok&&tr<59)continue;
  fx.push(cl.map(([a,b])=>Math.random()<.5?[a,b]:[b,a]));
  const result=reverse?fx.map(round=>round.map(([a,b])=>[b,a])):fx;
  const appearances=Object.fromEntries(clubs.map(id=>[id,0]));
  result.flat().forEach(([a,b])=>{appearances[a]++;appearances[b]++});
  if(result.length!==16||result.flat().length!==240||clubs.some(id=>appearances[id]!==16))
   throw new Error('Fixture de Primera inválido: debe tener 16 fechas y 16 partidos por club');
  return result;
 }
 throw new Error('No se pudo generar el fixture de Primera');
}
function playStage(fx,zones){
 const T=Object.fromEntries(clubs.map(id=>[id,{id,pj:0,g:0,e:0,p:0,gf:0,ga:0,pts:0}]));
 for(const round of fx)for(const [home,away] of round){
  const m=ENG.simGame(home,away,{mix:false}),h=m.ga,a=m.gb,A=T[home],B=T[away];
  A.pj++;B.pj++;A.gf+=h;A.ga+=a;B.gf+=a;B.ga+=h;
  if(h>a){A.pts+=3;A.g++;B.p++}else if(h<a){B.pts+=3;B.g++;A.p++}else{A.pts++;B.pts++;A.e++;B.e++}
 }
 const orders=zones.map(z=>z.map(id=>T[id]).sort(cmp));
 orders.forEach(order=>order.forEach((q,i)=>{const x=stats[q.id];x.pos+=i+1;if(i<4)x.top4++;if(i<8)x.top8++}));
 return{map:T,rows:clubs.map(id=>T[id]),orders};
}
function addStages(A,B){
 const out={};
 clubs.forEach(id=>{const x=A.map[id],y=B.map[id];out[id]={id,pj:x.pj+y.pj,g:x.g+y.g,e:x.e+y.e,p:x.p+y.p,gf:x.gf+y.gf,ga:x.ga+y.ga,pts:x.pts+y.pts}});
 return out;
}
const champions=[];
for(let s=0;s<seasons;s++){
 const career=ENG.realNew({me:{club:'river'}}),zones=career.zones.ar1;
 if(!zones||zones.length!==2||zones.some(z=>z.length!==15))throw new Error('La Primera realista no tiene dos zonas de 15 clubes');
 zones[0].forEach(id=>zoneCounts[id].a++);zones[1].forEach(id=>zoneCounts[id].b++);
 const fxA=primFixtures(zones[0],zones[1],false),fxC=primFixtures(zones[0],zones[1],true);
 const A=playStage(fxA,zones),B=playStage(fxC,zones),annual=addStages(A,B);
 for(const [name,stage,index] of [['Apertura',A,0],['Clausura',B,1]]){
  const seeds=ENG.poSeeds(zones,Object.values(annual),[A.map],index);
  if(!seeds||seeds.length!==16||new Set(seeds).size!==16)throw new Error('Clasificación inválida a playoffs de '+name);
  const champ=ENG.poSim(seeds,name).champ;
  if(!stats[champ])throw new Error('Campeón no pertenece a Primera: '+champ);
  stats[champ].champ++;champions.push(champ);
 }
}
const ranked=clubs.map(id=>({id,...stats[id],avgPos:+(stats[id].pos/tournaments).toFixed(2),
 champPct:+(stats[id].champ/tournaments*100).toFixed(1),top4Pct:+(stats[id].top4/tournaments*100).toFixed(1),
 top8Pct:+(stats[id].top8/tournaments*100).toFixed(1)})).sort((a,b)=>a.avgPos-b.avgPos);

function bestXI(team,fixedFormation){
 const sq=DATA.squad(team),formations=fixedFormation==null?DATA.FM.map((_,i)=>i):[fixedFormation];let best=null;
 for(const f of formations){const xi=DATA.autoXI(sq,f),sl=DATA.slots(f);
  const score=xi.reduce((v,i,k)=>v+(i>=0?DATA.roleOvr(sq[i],sl[k])*(sq[i].p===sl[k]?1:.8):0),0);
  if(!best||score>best.score)best={f,xi,score};
 }
 return best;
}
function makeTac(team,st=1,pr=1,formation){
 const sq=DATA.squad(team),b=bestXI(team,formation),xi=b.xi;
 const cap=xi.reduce((best,i)=>((sq[i].at?.lea||50)*.65+sq[i].r*.35)>
  ((sq[best].at?.lea||50)*.65+sq[best].r*.35)?i:best,xi[0]);
 const pk=xi.reduce((best,i)=>sq[i].p==='DEL'&&(best<0||(sq[i].at?.rem||0)>(sq[best].at?.rem||0))?i:best,-1);
 return{f:b.f,st,pr,wing:0,sal:0,mk:0,auto:0,xi,cap,pk,k1:DATA.TM[team].c1,k2:DATA.TM[team].c2};
}
function tacticalSample(label,st,pr,formation,n=300){
 const A='river',B='banfield',ta=makeTac(A,st,pr,formation),tb=makeTac(B,1,1),out={w:0,d:0,l:0,gf:0,ga:0};
 for(let i=0;i<n;i++){
  const swap=i%2===1,m=swap?ENG.simGame(B,A,{mix:false,tacA:tb,tacB:ta}):ENG.simGame(A,B,{mix:false,tacA:ta,tacB:tb});
  const gf=swap?m.gb:m.ga,ga=swap?m.ga:m.gb;out.gf+=gf;out.ga+=ga;
  if(gf>ga)out.w++;else if(gf===ga)out.d++;else out.l++;
 }
 return{configuration:label,matches:n,w:out.w,d:out.d,l:out.l,ppg:+((out.w*3+out.d)/n).toFixed(3),
  goalsFor:+(out.gf/n).toFixed(2),goalsAgainst:+(out.ga/n).toFixed(2),formation:DATA.FN[ta.f]};
}
const tactics=[
 tacticalSample('equilibrada',1,1,null),
 tacticalSample('defensiva',0,1,null),
 tacticalSample('ofensiva',2,1,null),
 tacticalSample('presion baja',1,0,null),
 tacticalSample('presion alta',1,2,null),
 tacticalSample('4-3-3',1,1,1),
 tacticalSample('4-4-2',1,1,0)
];
const result={
 format:'Primera realista del motor: Apertura y Clausura; cada torneo con 16 fechas, 14 partidos intrazona y 2 interzonales por club; top 8 de cada zona y playoffs de 16',
 seasons,tournaments,clubs:clubs.length,zoneAssignmentSamples:seasons,
 zoneDistribution:clubs.map(id=>({id,zoneA:zoneCounts[id].a,zoneB:zoneCounts[id].b})),
 uniqueChampions:[...new Set(champions)].length,
 avgPositionSpread:+(Math.max(...ranked.map(x=>x.avgPos))-Math.min(...ranked.map(x=>x.avgPos))).toFixed(2),
 titleDistribution:ranked.map(({id,champ,champPct,avgPos,top4Pct,top8Pct})=>({id,champ,champPct,avgPos,top4Pct,top8Pct})),
 strongestXI:clubs.map(id=>{const b=bestXI(id);return{id,xi:+(b.score/11).toFixed(2),formation:DATA.FN[b.f]}}).sort((a,b)=>b.xi-a.xi).slice(0,5),
 weakestXI:clubs.map(id=>{const b=bestXI(id);return{id,xi:+(b.score/11).toFixed(2),formation:DATA.FN[b.f]}}).sort((a,b)=>a.xi-b.xi).slice(0,5),
 tacticalComparison:tactics
};
console.log(JSON.stringify(result,null,2));
