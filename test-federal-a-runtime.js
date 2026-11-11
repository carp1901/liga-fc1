const fs=require('fs');
const path=require('path');
function parseCSV(s){const rows=[];let row=[],v='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='"'&&s[i+1]==='"'){v+='"';i++;}else if(c==='"')q=false;else v+=c;}else if(c==='"')q=true;else if(c===','){row.push(v);v='';}else if(c==='\n'){row.push(v.replace(/\r$/,''));rows.push(row);row=[];v='';}else v+=c;}if(v.length||row.length){row.push(v.replace(/\r$/,''));rows.push(row);}return rows;}
const csvPath=path.join(__dirname,'planteles/borradores/federal-a-2026-tanda-1/completo.csv');
const squads=JSON.parse(fs.readFileSync(path.join(__dirname,'public/squads.json'),'utf8'));
const rows=parseCSV(fs.readFileSync(csvPath,'utf8'));
const headers=rows.shift().map(x=>x.trim().toLowerCase()),idx=Object.fromEntries(headers.map((h,i)=>[h,i]));
const expected={nuevejulio:25,alvarado:20,atenas:19,atsanmartinmza:18,bmitre:18,bocaunidos:19,cipolletti:18,defbelgranovr:22,rincon:22,soldeamerica:18};
const errors=[],counts={};
for(const row of rows){const get=k=>(row[idx[k]]||'').trim(),club=get('club_id'),name=get('nombre');counts[club]=(counts[club]||0)+1;const p=(squads[club]||[]).find(x=>x.n.toLowerCase()===name.toLowerCase());if(!p){errors.push('No está en runtime: '+club+' / '+name);continue;}if(p.r!==Number(get('rating')))errors.push('Media distinta: '+club+' / '+name);if(p.age!==Number(get('edad')))errors.push('Edad distinta: '+club+' / '+name);if(p.specificRole!==get('rol_especifico'))errors.push('Rol específico distinto: '+club+' / '+name);if(p.nat!==get('nat'))errors.push('Nacionalidad distinta: '+club+' / '+name);}
for(const [club,n] of Object.entries(expected)){if(counts[club]!==n)errors.push(club+': CSV esperado '+n+', encontrado '+(counts[club]||0));if((squads[club]||[]).length!==n)errors.push(club+': runtime esperado '+n+', encontrado '+((squads[club]||[]).length));}
for(const [club,players] of Object.entries(squads)){if(players.length<18)errors.push(club+': tiene '+players.length+' jugadores; mínimo requerido 18 (11 titulares + 7 suplentes)');}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Federal A runtime OK: 10 clubes, 199 jugadores, media, edad, rol y nacionalidad coinciden con CSV.');
