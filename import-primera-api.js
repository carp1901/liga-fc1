// Importa el plantel actual de Primera División Argentina desde API-Football.
// Requiere API_FOOTBALL_KEY. No inventa nombres: si faltan clubes/planteles, aborta sin sobrescribir.
const fs = require('node:fs');
const path = require('node:path');

const KEY = process.env.API_FOOTBALL_KEY;
const SEASON = Number(process.env.SEASON || 2026);
const BASE = 'https://v3.football.api-sports.io';
if (!KEY) throw new Error('Falta el secreto API_FOOTBALL_KEY.');

const CLUBS = {
  boca: ['boca juniors'], river: ['river plate'], racing: ['racing club'],
  independiente: ['independiente'], sanlorenzo: ['san lorenzo'],
  estudiantes: ['estudiantes de la plata', 'estudiantes la plata', 'estudiantes l p'],
  velez: ['velez sarsfield'], talleres: ['talleres de cordoba', 'talleres cordoba'],
  lanus: ['lanus'], rosario: ['rosario central'], huracan: ['huracan'],
  belgrano: ['belgrano'], argentinos: ['argentinos juniors'],
  defensa: ['defensa y justicia'], newells: ['newells old boys', 'newells'],
  union: ['union de santa fe', 'union santa fe'], tigre: ['tigre'],
  platense: ['platense'], banfield: ['banfield'],
  gimnasia: ['gimnasia la plata', 'gimnasia y esgrima la plata', 'gimnasia l p'],
  centralcba: ['central cordoba', 'central cordoba santiago del estero', 'central cordoba sde'],
  rivadavia: ['independiente rivadavia'], instituto: ['instituto'],
  atletico: ['atletico tucuman', 'atletico de tucuman'],
  barracas: ['barracas central'], riestra: ['deportivo riestra', 'riestra'],
  sarmiento: ['sarmiento'], aldosivi: ['aldosivi'],
  gimnasiamza: ['gimnasia mendoza', 'gimnasia y esgrima mendoza'],
  estudiantesrc: ['estudiantes de rio cuarto', 'estudiantes rio cuarto']
};
const TEAM_RATING = {
  boca:80,river:82,racing:77,independiente:74,sanlorenzo:72,estudiantes:77,
  velez:75,talleres:76,lanus:74,rosario:75,huracan:73,belgrano:73,
  argentinos:72,defensa:71,newells:70,union:71,tigre:70,platense:70,
  banfield:69,gimnasia:70,centralcba:69,rivadavia:71,instituto:68,
  atletico:68,barracas:67,riestra:66,sarmiento:66,aldosivi:65,
  gimnasiamza:66,estudiantesrc:64
};
const norm = s => String(s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
async function api(endpoint, params = {}) {
  const url = new URL(BASE + '/' + endpoint);
  for (const [k,v] of Object.entries(params)) url.searchParams.set(k,String(v));
  const res = await fetch(url, {headers:{'x-apisports-key':KEY}});
  const left = res.headers.get('x-ratelimit-requests-remaining');
  if (!res.ok) throw new Error('API-Football HTTP '+res.status+' en /'+endpoint);
  const json = await res.json();
  if (json.errors && Object.keys(json.errors).length) throw new Error('API-Football /'+endpoint+': '+JSON.stringify(json.errors));
  if (left !== null) console.log('Consultas restantes hoy:', left);
  return json;
}
(async()=>{
  const leagueData = await api('leagues',{country:'Argentina',season:SEASON});
  const leagues = (leagueData.response || []).filter(x => {
    const n=norm(x.league && x.league.name);
    return x.country && norm(x.country.name)==='argentina' &&
      (n.includes('primera division') || n.includes('liga profesional')) &&
      x.league && x.league.type==='League';
  });
  if (!leagues.length) throw new Error('La API no devolvió Primera División Argentina para '+SEASON+'. No se modificaron planteles.');
  const league = leagues.find(x=>norm(x.league.name)==='liga profesional argentina') || leagues[0];
  console.log('Competición detectada:',league.league.name,'ID',league.league.id,'temporada',SEASON);
  if (league.seasons && !league.seasons.some(s=>s.year===SEASON && s.coverage && s.coverage.players)) {
    throw new Error('La cobertura de jugadores no figura activa para esta temporada.');
  }
  const teamData=await api('teams',{league:league.league.id,season:SEASON});
  const teams=teamData.response||[];
  const byClub=new Map();
  for(const item of teams){
    const apiName=norm(item.team && item.team.name);
    const hits=Object.entries(CLUBS).filter(([,aliases])=>aliases.some(a=>norm(a)===apiName));
    if(hits.length===1) byClub.set(hits[0][0],item.team);
    else console.log('Equipo de API sin equivalencia exacta:',item.team && item.team.name);
  }
  const missing=Object.keys(CLUBS).filter(id=>!byClub.has(id));
  if(missing.length) throw new Error('No se pudieron identificar '+missing.length+' clubes: '+missing.join(', ')+'. No se modificaron planteles.');
  if(byClub.size!==30) throw new Error('Se esperaba mapear 30 clubes y se mapearon '+byClub.size+'.');

  // Estadísticas de temporada: rating oficial de API-Football cuando existe.
  const statsMap=new Map();
  const first=await api('players',{league:league.league.id,season:SEASON,page:1});
  const totalPages=Math.max(1,Number(first.paging && first.paging.total)||1);
  const pages=[first];
  for(let p=2;p<=totalPages;p++) pages.push(await api('players',{league:league.league.id,season:SEASON,page:p}));
  for(const page of pages) for(const item of page.response||[]){
    const player=item.player||{};
    for(const st of item.statistics||[]){
      const teamId=st.team && st.team.id;
      const rating=Number(st.games && st.games.rating);
      if(player.id && teamId && Number.isFinite(rating) && rating>0)
        statsMap.set(player.id+':'+teamId,Math.max(15,Math.min(99,Math.round(rating*10))));
    }
  }

  const output={},report={};
  for(const [clubId,team] of byClub){
    const squadData=await api('players/squads',{team:team.id});
    const entry=(squadData.response||[]).find(x=>x.team && x.team.id===team.id) || (squadData.response||[])[0];
    const players=entry && entry.players || [];
    if(players.length<11) throw new Error(team.name+' devolvió solo '+players.length+' jugadores; importación cancelada sin sobrescribir.');
    const seen=new Set();
    output[clubId]=players.map(p=>{
      const name=String(p.name||'').trim();
      if(!name || !p.id || seen.has(p.id)) throw new Error('Jugador inválido/duplicado en '+team.name);
      seen.add(p.id);
      const pos=norm(p.position);
      const position=pos.includes('goalkeeper')?'POR':pos.includes('defender')?'DEF':pos.includes('midfielder')?'MED':pos.includes('attacker')?'DEL':null;
      if(!position) throw new Error('Posición no reconocida para '+name+' ('+p.position+') en '+team.name);
      const statRating=statsMap.get(p.id+':'+team.id);
      return {id:String(p.id),n:name,p:position,r:statRating||60,age:Number.isInteger(p.age)?p.age:undefined,
        number:Number.isInteger(p.number)?p.number:undefined,
        ratingSource:statRating?'api-football-2026':'neutral-pending'};
    });
    report[clubId]={name:team.name,players:players.length,withStats:output[clubId].filter(p=>p.ratingSource==='api-football-2026').length};
    console.log(team.name+': '+players.length+' jugadores; '+report[clubId].withStats+' con rating estadístico.');
  }
  const total=Object.values(output).reduce((n,a)=>n+a.length,0);
  if(total<300) throw new Error('El total de jugadores ('+total+') es demasiado bajo para una importación completa de Primera.');
  const pub=path.join(process.cwd(),'public');
  fs.mkdirSync(pub,{recursive:true});
  fs.writeFileSync(path.join(pub,'squads.json'),JSON.stringify(output));
  fs.writeFileSync(path.join(pub,'squads.js'),'window.SQUADS='+JSON.stringify(output)+';');
  fs.writeFileSync(path.join(pub,'squads-meta.json'),JSON.stringify({
    season:SEASON,updatedAt:new Date().toISOString(),source:'API-Football',
    league:{id:league.league.id,name:league.league.name},totalPlayers:total,clubs:report
  },null,2));
  console.log('IMPORTACIÓN COMPLETA:',Object.keys(output).length,'clubes y',total,'jugadores.');
})().catch(e=>{console.error(e.message);process.exit(1)});
