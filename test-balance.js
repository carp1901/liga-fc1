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

const seasons=Number(process.env.BALANCE_SEASONS||100);
const tournamentCount=seasons*2;
const stats=Object.fromEntries(clubs.map(id=>[id,{champ:0,top4:0,top8:0,pos:0}]));
const zero=Object.fromEntries(clubs.map(id=>[id,{id,pts:0,g:0,gf:0,ga:0}]));
function standings(ids){
  const order=ENG.simSeason(ids,'liga1');
  const table=order.map((id,i)=>({id,pts:100-i,g:50-i,gf:100-i,ga:0}));
  order.forEach((id,i)=>{const x=stats[id];x.pos+=i+1;if(i<4)x.top4++;if(i<8)x.top8++});
  return table;
}
const champions=[];
for(let s=0;s<seasons;s++){
  for(const name of ['Apertura','Clausura']){
    const table=[...standings(zones[0]),...standings(zones[1])];
    const seeds=ENG.poSeeds(zones,table,[zero],0);
    if(!seeds||seeds.length!==16)throw new Error('No se generaron los 16 clasificados de '+name);
    const champ=ENG.poSim(seeds,name).champ;
    stats[champ].champ++;
    champions.push(champ);
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
const result={format:'Primera realista: dos zonas de 15, top 8 por zona y playoffs de 16; Apertura y Clausura',
  seasons,tournaments:tournamentCount,clubs:clubs.length,zoneA:zones[0],zoneB:zones[1],
  champions:[...new Set(champions)].length,
  avgPositionSpread:+(Math.max(...ranked.map(x=>x.avgPos))-Math.min(...ranked.map(x=>x.avgPos))).toFixed(2),
  titleDistribution:ranked.map(({id,champ,champPct,avgPos,top4Pct,top8Pct})=>({id,champ,champPct,avgPos,top4Pct,top8Pct})),
  strongestXI:quality.slice(0,5),weakestXI:quality.slice(-5).reverse(),tacticalComparison:tactics};
console.log(JSON.stringify(result,null,2));
