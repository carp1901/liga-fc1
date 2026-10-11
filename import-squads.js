// Convierte un CSV de plantillas (club_id,nombre,posicion,rating) en public/squads.json y public/squads.js
// Uso: node tools/import-squads.js plantel.csv   (posicion: POR/GK, DEF, MED/MID, DEL/FWD; rating 1-99)
const fs=require('fs'),f=process.argv[2];if(!f){console.log('Uso: node tools/import-squads.js plantel.csv');process.exit(1)}
const M={GK:'POR',POR:'POR',ARQ:'POR',DF:'DEF',DEF:'DEF',MF:'MED',MID:'MED',MED:'MED',FW:'DEL',DEL:'DEL',ATA:'DEL'},N={POR:2,DEF:6,MED:6,DEL:4},out={};
fs.readFileSync(f,'utf8').split(/\r?\n/).slice(1).forEach(l=>{const[c,n,p,r]=l.split(',').map(s=>s.trim()),q=M[(p||'').toUpperCase()];if(c&&n&&q&&+r)(out[c]=out[c]||{POR:[],DEF:[],MED:[],DEL:[]})[q].push({n,p:q,r:Math.min(99,+r)})});
const res={};for(const c in out){res[c]=[];for(const p of['POR','DEF','MED','DEL']){const a=out[c][p].sort((x,y)=>y.r-x.r).slice(0,N[p]);while(a.length<N[p]){console.warn(c,'faltan jugadores de',p);a.push({n:'Suplente '+p,p,r:50})}res[c].push(...a)}}
fs.writeFileSync('public/squads.json',JSON.stringify(res));fs.writeFileSync('public/squads.js','window.SQUADS='+JSON.stringify(res)+';');console.log('Listo:',Object.keys(res).length,'clubes');
