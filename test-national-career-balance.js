// Auditoría multitemporada de Primera Nacional y trayectoria de sus ascendidos.
// Usa el motor real (simGame + careerClose) y conserva títulos, movimientos y categoría de cada club.
let seed=20261108;
Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const DATA=require('./public/data');
const ENG=require('./public/engine');
const seasons=Number(process.env.NATIONAL_SEASONS||60);
const start=DATA.DIVS.find(d=>d.id==='ar2').teams[0].id;
const cmp=(a,b)=>b.pts-a.pts||b.g-b.g||b.gf-a.gf||(b.gf-b.ga)-(a.gf-a.ga);
function tableFor(ids,fmt,adj){
 const T=Object.fromEntries(ids.map(id=>[id,{id,pj:0,g:0,e:0,p:0,gf:0,ga:0,pts:0}]));
 const play=(a,b)=>{const m=ENG.simGame(a,b,{mix:false,teamAdj:adj}),A=T[a],B=T[b];A.pj++;B.pj++;A.gf+=m.ga;A.ga+=m.gb;B.gf+=m.gb;B.ga+=m.ga;
  if(m.ga>m.gb){A.pts+=3;A.g++;B.p++}else if(m.ga<m.gb){B.pts+=3;B.g++;A.p++}else{A.pts++;B.pts++;A.e++;B.e++}};
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){if(Math.random()<.5)play(ids[i],ids[j]);else play(ids[j],ids[i]);if(fmt==='liga2'){if(Math.random()<.5)play(ids[j],ids[i]);else play(ids[i],ids[j])}}
 return Object.values(T).sort(cmp);
}
function mergeTables(...tables){
 const m={};tables.flat().forEach(q=>{const x=m[q.id]||(m[q.id]={id:q.id,pj:0,g:0,e:0,p:0,gf:0,ga:0,pts:0});
  for(const k of ['pj','g','e','p','gf','ga','pts'])x[k]+=(q[k]||0)});
 return Object.values(m).sort(cmp);
}
function currentSeasonTable(car){
 const i=car.me.cat,div=car.cats[i].div,teams=car.cats[i].teams,Z=car.zones&&car.zones[div],adj=ENG.careerTeamAdj(car);
 if(div==='ar1'){
  const A=Z.map(z=>tableFor(z,'liga1',adj)),B=Z.map(z=>tableFor(z,'liga1',adj));
  const annual=mergeTables(...A,...B);
  const first=Object.fromEntries(A.flat().map(q=>[q.id,q]));
  return{table:annual,segT:[first]};
 }
 if(Z){
  const fmt=div==='ar5'?'liga1':'liga2';
  const parts=Z.map(z=>tableFor(z,fmt,adj));
  return{table:mergeTables(...parts)};
 }
 return{table:tableFor(teams,car.fmts&&car.fmts[i]||'liga2',adj)};
}
const car0=ENG.realNew({me:{club:start},spd:100});
if(car0.error)throw new Error(car0.error);
let car=car0;
const ids=Object.keys(DATA.TM).filter(id=>DATA.TM[id]);
const history=Object.fromEntries(ids.map(id=>[id,{id,name:DATA.TM[id].name,firstNationalPromotion:null,firstDivisionTitles:0,firstDivisionSeasons:[],nationalTitles:0,metroSeasons:0,firstCSeasons:0,lowestTier:null,seasonMoves:[]} ]));
const titles=Object.fromEntries(car.cats.map(c=>[c.div,{}]));
const promotedFromNational=new Set(),firstDivisionChampions={},seasonSummaries=[];
const bump=(o,id)=>o[id]=(o[id]||0)+1;
const catName=Object.fromEntries(car.cats.map(c=>[c.div,c.name]));
for(let y=0;y<seasons;y++){
 ENG.preparePre(car);
 const {table,segT}=currentSeasonTable(car);
 const closed=ENG.careerClose(car,table,segT||[]);
 if(closed.error)throw new Error('Temporada '+car.season+': '+closed.error);
 const sum=closed.summary,year=car.season;
 const first=sum.cats.find(x=>x.name===catName.ar1);
 const firstTitles=first&&first.po&&first.po.tor?first.po.tor.map(x=>({tournament:x.n,champ:x.champ})).filter(x=>x.champ):[];
 firstTitles.forEach(x=>{bump(firstDivisionChampions,x.champ);history[x.champ].firstDivisionTitles++;history[x.champ].firstDivisionSeasons.push(year);bump(titles.ar1,x.champ)});
 const nat=sum.cats.find(x=>x.name===catName.ar2);
 if(nat&&nat.champ){history[nat.champ].nationalTitles++;bump(titles.ar2,nat.champ)}
 if(nat)(nat.up||[]).forEach(id=>{promotedFromNational.add(id);if(!history[id].firstNationalPromotion)history[id].firstNationalPromotion=year});
 const moves=[];
 sum.cats.forEach((c,i)=>{
  const div=car.cats[i].div;
  (c.up||[]).forEach(id=>moves.push({id,from:div,to:car.cats[Math.max(0,i-1)].div,type:'up'}));
  (c.down||[]).forEach(id=>moves.push({id,from:div,to:car.cats[Math.min(car.cats.length-1,i+1)].div,type:'down'}));
 });
 const next=closed.car;
 next.cats.forEach((c,i)=>c.teams.forEach(id=>{
  const h=history[id];if(!h)return;
  const d=c.div;
  if(d==='ar3')h.metroSeasons++;
  if(d==='ar4')h.firstCSeasons++;
  const level={ar1:1,ar2:2,ar3:3,ar5:3,ar4:4,ar6:5}[d]||5;
  h.lowestTier=h.lowestTier==null?level:Math.max(h.lowestTier,level);
 }));
 moves.forEach(m=>{const h=history[m.id];if(h)h.seasonMoves.push({season:year,...m})});
 seasonSummaries.push({season:year,nationalChampion:nat&&nat.champ,firstDivisionChampions:firstTitles.map(x=>x.champ),
  promotedFromNational:nat?nat.up:[],relegatedFromNational:nat?nat.down:[],firstDivisionRelegated:first?first.down:[]});
 car=next;
}
const promoted=[...promotedFromNational].map(id=>{const h=history[id];return{id,name:h.name,firstNationalPromotion:h.firstNationalPromotion,
 firstDivisionTitles:h.firstDivisionTitles,firstDivisionSeasons:h.firstDivisionSeasons,
 metroSeasons:h.metroSeasons,firstCSeasons:h.firstCSeasons,lowestTier:h.lowestTier,seasonMoves:h.seasonMoves}});
const descendedToC=promoted.filter(x=>x.firstCSeasons>0).sort((a,b)=>b.firstCSeasons-a.firstCSeasons);
const report={
 audit:'Primera Nacional · carrera realista multitemporada',
 seasons,startingClub:DATA.TM[start].name,startingSeason:2026,clubsTracked:ids.length,
 divisions:car.cats.map(c=>({id:c.div,name:c.name,teams:c.teams.length})),
 nationalChampions:Object.entries(titles.ar2).map(([id,count])=>({club:DATA.TM[id].name,id,titles:count})).sort((a,b)=>b.titles-a.titles),
 firstDivisionChampions:Object.entries(firstDivisionChampions).map(([id,count])=>({club:DATA.TM[id].name,id,titles:count})).sort((a,b)=>b.titles-a.titles),
 clubsPromotedFromNational:promoted.length,promotedFromNational:promoted,
 promotedWhoWonFirstDivision:promoted.filter(x=>x.firstDivisionTitles>0),
 promotedWhoReachedPrimeraC:descendedToC,
 allTrackedClubsReachingPrimeraC:ids.filter(id=>history[id].firstCSeasons>0).map(id=>({id,club:history[id].name,seasons:history[id].firstCSeasons,moves:history[id].seasonMoves})),
 seasonSummaries
};
console.log(JSON.stringify(report,null,2));
