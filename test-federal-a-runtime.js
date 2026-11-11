const fs=require('fs'),path=require('path');
function parseCSV(s){const rows=[];let row=[],v='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='"'&&s[i+1]==='"'){v+='"';i++;}else if(c==='"')q=false;else v+=c;}else if(c==='"')q=true;else if(c===','){row.push(v);v='';}else if(c==='\n'){row.push(v.replace(/\r$/,''));rows.push(row);row=[];v='';}else v+=c;}if(v||row.length){row.push(v.replace(/\r$/,''));rows.push(row);}return rows;}
const batches=[
 {label:'primera tanda',file:'planteles/borradores/federal-a-2026-tanda-1/completo.csv',exact:{"nuevejulio":25,"alvarado":20,"atenas":19,"atsanmartinmza":18,"bmitre":18,"bocaunidos":19,"cipolletti":18,"defbelgranovr":22,"rincon":22,"soldeamerica":18}},
 {label:'segunda tanda',file:'planteles/borradores/federal-a-2026-tanda-2/completo.csv',exact:{"soldemayo":18,"tucumancentral":22,"costabrava":18,"circulo":20,"fadep":18,"germinal":18,"gbrown":18,"juventudsl":18,"santamarina":18,"douglashaig":18}},
 {label:'tercera tanda',file:'planteles/borradores/federal-a-2026-tanda-3/completo.csv',minimum:['gimchivilcoy','sanmartinformosa','sarmientolb','sportivobelgrano','huracanlh','olimpo','antoniana','linqueno','indchivilcoy','escobar']},
 {label:'cuarta tanda',file:'planteles/borradores/federal-a-2026-tanda-4/completo.csv',minimum:['gimcdu','lasparejas','vilelas','argmontemaiz','sarmientores','kimberley','villamitre']}
];
const squads=JSON.parse(fs.readFileSync(path.join(__dirname,'public/squads.json'),'utf8')),errors=[];
let federalClubs=0,federalPlayers=0;
for(const batch of batches){
 const rows=parseCSV(fs.readFileSync(path.join(__dirname,batch.file),'utf8')),headers=rows.shift().map(x=>x.trim().toLowerCase()),idx=Object.fromEntries(headers.map((h,i)=>[h,i])),counts={};
 for(const row of rows){
  const get=k=>(row[idx[k]]||'').trim(),club=get('club_id'),name=get('nombre');
  counts[club]=(counts[club]||0)+1;
  const p=(squads[club]||[]).find(x=>x.n.toLowerCase()===name.toLowerCase());
  if(!p){errors.push(batch.label+' no está en runtime: '+club+' / '+name);continue;}
  if(p.r!==Number(get('rating')))errors.push('Media distinta: '+club+' / '+name);
  if(get('edad')!==''&&p.age!==Number(get('edad')))errors.push('Edad distinta: '+club+' / '+name);
  if(get('edad')===''&&p.age!=null)errors.push('Edad sin fuente en CSV: '+club+' / '+name);
  if(p.specificRole!==get('rol_especifico'))errors.push('Rol distinto: '+club+' / '+name);
  if(p.nat!==get('nat'))errors.push('Nacionalidad distinta: '+club+' / '+name);
 }
 if(batch.exact){
  for(const [club,n] of Object.entries(batch.exact)){
   if(counts[club]!==n)errors.push(club+': CSV esperado '+n+', encontrado '+(counts[club]||0));
   if((squads[club]||[]).length!==n)errors.push(club+': runtime esperado '+n+', encontrado '+((squads[club]||[]).length));
  }
 }else{
  const expected=batch.minimum;
  for(const club of expected){
   if((counts[club]||0)<18)errors.push(club+': CSV con menos de 18 jugadores');
   if((squads[club]||[]).length!==counts[club])errors.push(club+': runtime no coincide con CSV ('+((squads[club]||[]).length)+' vs '+(counts[club]||0)+')');
  }
  if(Object.keys(counts).length!==expected.length)errors.push(batch.label+': cantidad de clubes inesperada');
 }
 federalClubs+=Object.keys(counts).length;federalPlayers+=rows.length;
}
for(const [club,players] of Object.entries(squads))if(players.length<18)errors.push(club+': menos de 18 jugadores ('+players.length+')');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Federal A runtime OK: '+federalClubs+' clubes, '+federalPlayers+' jugadores; mínimo 18 por club, CSV/runtime, medias, edades, roles y nacionalidad verificados.');
