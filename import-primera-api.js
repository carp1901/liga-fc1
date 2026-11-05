// Importa planteles actuales de Primera Argentina desde API-Football.
// El plan gratuito no permite consultar la temporada 2026 en /leagues.
// Por eso se identifican los clubes por búsqueda y se usa /players/squads (plantel actual).
// Nunca inventa nombres: si falta un club o un plantel, aborta sin sobrescribir archivos.
const fs = require('node:fs');
const path = require('node:path');

const KEY = process.env.API_FOOTBALL_KEY;
const SEASON = 2026;
const BASE = 'https://v3.football.api-sports.io';
if (!KEY) throw new Error('Falta el secreto API_FOOTBALL_KEY.');

const CLUBS = {
  boca:['Boca Juniors'], river:['River Plate'], racing:['Racing Club'],
  independiente:['Independiente'], sanlorenzo:['San Lorenzo'],
  estudiantes:['Estudiantes de La Plata','Estudiantes L.P.'],
  velez:['Velez Sarsfield'], talleres:['Talleres de Cordoba','Talleres Cordoba'],
  lanus:['Lanus'], rosario:['Rosario Central'], huracan:['Huracan'],
  belgrano:['Belgrano'], argentinos:['Argentinos Juniors'],
  defensa:['Defensa y Justicia'], newells:['Newells Old Boys','Newells'],
  union:['Union de Santa Fe','Union Santa Fe'], tigre:['Tigre'],
  platense:['Platense'], banfield:['Banfield'],
  gimnasia:['Gimnasia La Plata','Gimnasia y Esgrima La Plata','Gimnasia L.P.'],
  centralcba:['Central Cordoba','Central Cordoba Santiago del Estero'],
  rivadavia:['Independiente Rivadavia'], instituto:['Instituto'],
  atletico:['Atletico Tucuman','Atletico de Tucuman'],
  barracas:['Barracas Central'], riestra:['Deportivo Riestra','Riestra'],
  sarmiento:['Sarmiento'], aldosivi:['Aldosivi'],
  gimnasiamza:['Gimnasia Mendoza','Gimnasia y Esgrima Mendoza'],
  estudiantesrc:['Estudiantes de Rio Cuarto','Estudiantes Rio Cuarto']
};
const norm = s => String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
async function api(endpoint, params={}) {
  const url=new URL(BASE+'/'+endpoint);
  for(const [k,v] of Object.entries(params)) url.searchParams.set(k,String(v));
  const res=await fetch(url,{headers:{'x-apisports-key':KEY}});
  if(!res.ok) throw new Error('API-Football HTTP '+res.status+' en /'+endpoint);
  const json=await res.json();
  if(json.errors && Object.keys(json.errors).length) throw new Error('API-Football /'+endpoint+': '+JSON.stringify(json.errors));
  return json;
}
(async()=>{
  const found=new Map();
  for(const [clubId,aliases] of Object.entries(CLUBS)){
    let match=null;
    for(const alias of aliases){
      const data=await api('teams',{search:alias});
      const candidates=data.response||[];
      match=candidates.find(x=>aliases.some(a=>norm(a)===norm(x.team&&x.team.name)));
      if(match) break;
    }
    if(!match || !match.team || !match.team.id)
      throw new Error('No se pudo identificar con coincidencia exacta el club '+clubId+' ('+aliases.join(' / ')+'). No se modificó ningún archivo.');
    found.set(clubId,match.team);
    console.log('Club identificado:',clubId,'=',match.team.name,'(ID '+match.team.id+')');
  }
  if(found.size!==30) throw new Error('Se identificaron '+found.size+' de 30 clubes. Importación cancelada.');

  const output={},report={};
  for(const [clubId,team] of found){
    const data=await api('players/squads',{team:team.id});
    const entry=(data.response||[]).find(x=>x.team&&x.team.id===team.id)||(data.response||[])[0];
    const players=entry&&entry.players||[];
    if(players.length<11) throw new Error(team.name+' devolvió '+players.length+' jugadores. Importación cancelada sin sobrescribir.');
    const seen=new Set();
    output[clubId]=players.map(p=>{
      const name=String(p.name||'').trim();
      if(!name || !p.id || seen.has(p.id)) throw new Error('Jugador inválido o duplicado en '+team.name);
      seen.add(p.id);
      const pos=norm(p.position);
      const position=pos.includes('goalkeeper')?'POR':pos.includes('defender')?'DEF':pos.includes('midfielder')?'MED':pos.includes('attacker')?'DEL':null;
      if(!position) throw new Error('Posición no reconocida para '+name+' ('+p.position+') en '+team.name);
      return {
        id:String(p.id), n:name, p:position, r:60,
        age:Number.isInteger(p.age)?p.age:undefined,
        number:Number.isInteger(p.number)?p.number:undefined
      };
    });
    report[clubId]={name:team.name,players:players.length};
    console.log(team.name+': '+players.length+' jugadores descargados.');
  }

  const total=Object.values(output).reduce((n,a)=>n+a.length,0);
  if(total<300) throw new Error('Solo se obtuvieron '+total+' jugadores; no se guardará un conjunto incompleto.');
  const pub=path.join(process.cwd(),'public');
  fs.mkdirSync(pub,{recursive:true});
  fs.writeFileSync(path.join(pub,'squads.json'),JSON.stringify(output));
  fs.writeFileSync(path.join(pub,'squads.js'),'window.SQUADS='+JSON.stringify(output)+';');
  fs.writeFileSync(path.join(pub,'squads-meta.json'),JSON.stringify({
    season:SEASON,seasonType:'planteles actuales consultados durante 2026',
    updatedAt:new Date().toISOString(),source:'API-Football /players/squads',
    ratings:'valor neutral 60; no se presentan como estadísticas oficiales',
    totalPlayers:total,clubs:report
  },null,2));
  console.log('IMPORTACIÓN COMPLETA:',found.size,'clubes y',total,'jugadores.');
})().catch(e=>{console.error(e.message);process.exit(1)});
