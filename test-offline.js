// Prueba del modo offline (motor + IA) sin navegador: node test-offline.js [formato] [equipos]
const E=require('./public/engine');E.CFG.offline=true;
const fmt=process.argv[2]||'liga2',n=+process.argv[3]||6,room='off1',pid='yo';let last=null;
console.log('crear:',E.act({a:'create',off:1,speed:100,room,pid,name:'Yo',cfg:{div:'ar1',fmt,n}}));
E.listen(room,pid,v=>last=v);
console.log('elegir:',E.act({a:'pick',room,pid,team:'boca'}),'| fase:',last.phase,'| equipos:',Object.keys(last.own).length);
let games=0,goals=0,max=0,seen=new Set(),t0=Date.now();
const iv=setInterval(()=>{const v=last;if(['pre','lobby'].includes(v.phase))E.act({a:'ready',room,pid,v:true});
 if(v.res&&!seen.has(v.round)&&['lobby','end'].includes(v.phase)){seen.add(v.round);v.res.forEach(x=>{games++;goals+=x.ga+x.gb;max=Math.max(max,x.ga,x.gb)})}
 if(v.phase=='end'){clearInterval(iv);const t=[...v.table].sort((a,b)=>b.pts-a.pts);console.log(JSON.stringify({formato:fmt,equipos:n,fechas:v.round,partidos:games,golesPorPartido:+(goals/games).toFixed(2),maxGolesDeUnEquipo:max,campeon:v.champ||t[0].id,tuEquipoBoca:v.table.find(x=>x.id=='boca'),segundos:(Date.now()-t0)/1000}));process.exit(0)}},30);
