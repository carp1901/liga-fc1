// Muestra qué escudos ya están cargados y cuáles faltan. Uso: node tools/check-crests.js
const fs=require('fs'),path=require('path'),{DIVS}=require('../public/data');
const dir=path.join(__dirname,'..','public','crests'),have=new Set(fs.existsSync(dir)?fs.readdirSync(dir).map(f=>f.replace(/\.(png|svg|webp)$/i,'')):[]);
let tot=0,ok=0;for(const d of DIVS){const miss=d.teams.filter(t=>!have.has(t.id));tot+=d.teams.length;ok+=d.teams.length-miss.length;console.log(`${d.name}: ${d.teams.length-miss.length}/${d.teams.length}`+(miss.length?'  faltan: '+miss.map(t=>t.id).join(', '):''))}
console.log(`Total: ${ok}/${tot}`);
