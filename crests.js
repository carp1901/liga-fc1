// Descarga escudos desde las URLs que vos indiques en crests-urls.json ({"boca":"https://…/boca.png", …}) a public/crests/<id>.<png|svg|webp>
// Uso: node tools/crests.js   (hace falta internet y que tengas derecho a usar esas imágenes)
const fs=require('fs'),m=JSON.parse(fs.readFileSync('crests-urls.json','utf8'));fs.mkdirSync('public/crests',{recursive:true});
(async()=>{let ok=0;for(const[id,u]of Object.entries(m)){if(!u)continue;try{const r=await fetch(u);if(!r.ok)throw r.status;const ct=(r.headers.get('content-type')||'').toLowerCase(),ext=ct.includes('svg')?'svg':ct.includes('webp')?'webp':'png';fs.writeFileSync(`public/crests/${id}.${ext}`,Buffer.from(await r.arrayBuffer()));console.log('ok',id+'.'+ext);ok++}catch(e){console.log('falló',id,e)}}console.log('Descargados:',ok)})();
