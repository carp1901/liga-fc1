// Auditoría reproducible del equilibrio de Primera. No modifica ratings ni reglas del juego.
let seed=20261107;
Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const DATA=require('./public/data');
const ENG=require('./public/engine');

const clubs=DATA.DIVS.find(d=>d.id==='ar1').teams.map(t=>t.id);
if(clubs.length!==30)throw new Error('Primera debe tener 30 clubes; encontrados: '+clubs.length);
const career=ENG.realNew({me:{club:'river'}});
const zones=career.zones.ar1;
if(!zones||zones.length!==2||zones.some(z=>z.length!==15))throw new Error('La Primera realista no tiene dos zonas de 15 clubes');

const seasons=Number(process.env.BALANCE_SEASONS||60);
const tournamentCount=seasons*2;
const stats=Object.fromEntries(clubs.map(id=>[id,{champ:0,top4:0,top8:0,pos:0}]));
const classics='boca-river,independiente-racing,sanlorenzo-huracan,estudiantes-gimnasia,rosario-newells,banfield-lanus,belgrano-talleres,argentinos-platense,tigre-velez,union-sarmiento,atletico-centralcba,aldosivi-defensa,barracas-riestra,estudiantesrc-instituto,gimnasiamza-rivadavia'.split(',').map(x=>x.split('-'));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const cmp=(a,b)=>b.pts-a.pts||b.g-a.g||b.gf-a.gf||(b.gf-b.ga)-(a.gf-a.ga);

function fixtures(){
  const out=[];
  for(const z of zones)for(let i=0;i<z.length;i++)for(let j=i+1;j<z.length;j++)
    out.push(Math.random()<.5?[z[i],z[j]]:[z[j],z[i]]);
  const randomAway=shuffle(zones[1]);
  zones[0].forEach((id,i)=>out.push(Math.random()<.5?[id,randomAway[i]]:[randomAway[i],id]));
  classics.forEach(([a,b])=>{
    if(zones[0].includes(a)&&zones[1].includes(b)||zones[1].includes(a)&&zones[0].includes(b))
      out.push(Math.random()<.5?[a,b]:[b,a]);
  });
  return out;
}
function playTable(fx,reverse){
  const T=Object.fromEntries(clubs.map(id=>[id,{id,pts:0,g:0,gf:0,ga:0}]));
  for(const [home,away] of fx){
    const m=reverse?ENG.simGame(away,home,{mix:false}):ENG.simGame(home,away,{mix:false});
    const h=reverse?m.gb:m.ga,a=reverse?m.ga:m.gb,A=T[home],B=T[away];
    A.gf+=h;A.ga+=a;B.gf+=a;B.ga+=h;
    if(h>a){A.pts+=3;A.g++}else if(h<a){B.pts+=3;B.g++}else{A.pts++;B.pts++}
  }
  const rows=zones.flatMap(z=>z.map(id=>T[id]));
  const zoneOrders=zones.map(z=>z.map(id=>T[id]).sort(cmp));
  zoneOrders.forEach(order=>order.forEach((q,i)=>{const x=stats[q.id];x.pos+=i+1;if(i<4)x.top4++;if(i<8)x.top8++}));
  return{rows,map:T};
}
const champions=[];
for(let s=0;s<seasons;s++){
  const fx=fixtures();
  for(const [name,reverse] of [['Apertura',false],['Clausura',true]]){
    const table=playTable(fx,reverse),seeds=ENG.poSeeds(zones,table.rows,[table.map],0);
    if(!seeds||seeds.length!==16)throw new Error('No se generaron los 16 clasificados de '+name);
    const champ=ENG.poSim(seeds,name).champ;
    stats[champ].champ++;champions.push(champ);
  }
}
const ranked=clubs.map(id=>({id,...stats[id],avgPos:+(stats[id].pos/tournamentCount).toFixed(2),
  champPct:+(stats[id].champ/tournamentCount*100).toFixed(1),top4Pct:+(stats[id].top4/tournamentCount*100).toFixed(1),
  top8Pct:+(stats[id].top8/tournamentCount*100).toFixed(1)})).sort((a,b)=>a.avgPos-b.avgPos);

function bestXI(team){
  const sq=DATA.squad(team);let best=null;
  for(let f=0;f<DATA.FM.length;f++){
    const xi=DATA.autoXI(sq,f),sl=DATA.slots(f);
    const score=xi.reduce((v,i,k)=>v+(i>=0?DATA.roleOvr(sq[i],sl[k])*(sq[i].p===sl[k]?1:.8):0),0);
    if(!best||score>best.score)best={f,xi,score};
  }
  return best;
}
const quality=clubs.map(id=>{const b=bestXI(id);return{id,xi:+(b.score/11).toFixed(2),formation:DATA.FM[b.f].join('-')}})
  .sort((a,b)=>b.xi-a.xi);

function tac(team,st,pr){
  const sq=DATA.squad(team),b=bestXI(team),xi=b.xi;
  const cap=xi.reduce((best,i)=>((sq[i].at?.lea||50)*.65+sq[i].r*.35)>
    ((sq[best].at?.lea||50)*.65+sq[best].r*.35)?i:best,xi[0]);
  const pk=xi.reduce((best,i)=>sq[i].p==='DEL'&&(best<0||sq[i].at?.rem>sq[best].at?.rem)?i:best,-1);
  return{f:b.f,st,pr,wing:0,sal:0,mk:0,auto:0,xi,cap,pk,k1:DATA.TM[team].c1,k2:DATA.TM[team].c2};
}
function tacticalSample(st,pr,n=300){
  const A='river',B='banfield',ta=tac(A,st,pr),tb=tac(B,1,1),out={w:0,d:0,l:0,gf:0,ga:0};
  for(let i=0;i<n;i++){
    const swap=i%2===1,m=swap?ENG.simGame(B,A,{mix:false,tacA:tb,tacB:ta}):ENG.simGame(A,B,{mix:false,tacA:ta,tacB:tb});
    const gf=swap?m.gb:m.ga,ga=swap?m.ga:m.gb;out.gf+=gf;out.ga+=ga;
    if(gf>ga)out.w++;else if(gf===ga)out.d++;else out.l++;
  }
  return{style:st,pressure:pr,matches:n,w:out.w,d:out.d,l:out.l,ppg:+((out.w*3+out.d)/n).toFixed(3),
    goalsFor:+(out.gf/n).toFixed(2),goalsAgainst:+(out.ga/n).toFixed(2)};
}
const tactics=[tacticalSample(0,0),tacticalSample(1,1),tacticalSample(2,2)];
const result={format:'Primera realista: dos zonas de 15; 14 partidos intrazona + 2 interzonales por torneo; top 8 por zona y playoffs de 16; Apertura y Clausura',
  seasons,tournaments:tournamentCount,clubs:clubs.length,zoneA:zones[0],zoneB:zones[1],
  champions:[...new Set(champions)].length,
  avgPositionSpread:+(Math.max(...ranked.map(x=>x.avgPos))-Math.min(...ranked.map(x=>x.avgPos))).toFixed(2),
  titleDistribution:ranked.map(({id,champ,champPct,avgPos,top4Pct,top8Pct})=>({id,champ,champPct,avgPos,top4Pct,top8Pct})),
  strongestXI:quality.slice(0,5),weakestXI:quality.slice(-5).reverse(),tacticalComparison:tactics};
console.log(JSON.stringify(result,null,2));
