// Descarga escudos desde las URLs que vos indiques en crests-urls.json ({"boca":"https://…/boca.png", …}) a public/crests/<id>.png
const fs=require('fs'),m=JSON.parse(fs.readFileSync('crests-urls.json','utf8'));fs.mkdirSync('public/crests',{recursive:true});
(async()=>{for(const[id,u]of Object.entries(m)){if(!u)continue;try{const r=await fetch(u);if(!r.ok)throw r.status;fs.writeFileSync(`public/crests/${id}.png`,Buffer.from(await r.arrayBuffer()));console.log('ok',id)}catch(e){console.log('falló',id,e)}}})();
