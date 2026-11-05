// Importa planteles reales desde CSV verificado manualmente.
// Uso: node import-squads.js planteles/primera-2026.csv
// Para exigir los 30 clubes de Primera y al menos 11 jugadores por club:
// node import-squads.js planteles/primera-2026.csv --require-primera-complete
// Columnas: club_id,nombre,posicion,rating,edad,dorsal,rol,fuente,consultado,pie,posiciones_secundarias,id,pas,ctl,reg,rem,des,mar,ant,ref
// rating es opcional: si falta, se usa 60 neutral (no es una valoración deportiva).
const fs=require('fs'),path=require('path');
const file=process.argv[2];
const REQUIRE_PRIMERA=process.argv.includes('--require-primera-complete');
if(!file){console.error('Uso: node import-squads.js archivo.csv [--require-primera-complete]');process.exit(1)}
function parseCSV(s){
 const rows=[];let row=[],v='',q=false;
 for(let i=0;i<s.length;i++){const c=s[i];
  if(q){if(c=='"'&&s[i+1]=='"'){v+='"';i++}else if(c=='"')q=false;else v+=c}
  else if(c=='"')q=true;else if(c==','){row.push(v);v=''}else if(c=='\n'){row.push(v.replace(/\r$/,''));rows.push(row);row=[];v=''}else v+=c;
 }
 if(v.length||row.length){row.push(v.replace(/\r$/,''));rows.push(row)}
 return rows;
}
const POS={POR:'POR',ARQ:'POR',GK:'POR',GOALKEEPER:'POR',DEF:'DEF',DF:'DEF',DEFENDER:'DEF',MED:'MED',MC:'MED',MCD:'MED',MO:'MED',MID:'MED',MF:'MED',MIDFIELDER:'MED',DEL:'DEL',FW:'DEL',ATA:'DEL',ATTACKER:'DEL'};
const ATTR=['pas','ctl','reg','rem','des','mar','ant','ref'];
const PRIMERA=['boca','river','racing','independiente','sanlorenzo','estudiantes','velez','talleres','lanus','rosario','huracan','belgrano','argentinos','defensa','newells','union','tigre','platense','banfield','gimnasia','centralcba','rivadavia','instituto','atletico','barracas','riestra','sarmiento','aldosivi','gimnasiamza','estudiantesrc'];
const rows=parseCSV(fs.readFileSync(file,'utf8'));
if(rows.length<2)throw Error('El CSV no contiene jugadores');
const headers=rows.shift().map(x=>x.trim().toLowerCase()),col=Object.fromEntries(headers.map((h,i)=>[h,i]));
for(const h of ['club_id','nombre','posicion'])if(col[h]==null)throw Error('Falta columna obligatoria: '+h);
const out={},errors=[],sources={},seen={};
rows.forEach((r,i)=>{
 if(!r.some(x=>x.trim()))return;
 const get=k=>col[k]==null?'':(r[col[k]]||'').trim(),club=get('club_id'),name=get('nombre'),rawPos=get('posicion').toUpperCase(),pos=POS[rawPos],rating=get('rating')===''?60:Number(get('rating')),age=get('edad')?Number(get('edad')):null,number=get('dorsal')?Number(get('dorsal')):null;
 if(!club||!name||!pos||!Number.isFinite(rating)||rating<1||rating>99){errors.push('Fila '+(i+2)+': club, nombre, posición o rating inválido');return}
 if(age!=null&&(!Number.isInteger(age)||age<15||age>50)){errors.push('Fila '+(i+2)+': edad inválida');return}
 if(number!=null&&(!Number.isInteger(number)||number<1||number>99)){errors.push('Fila '+(i+2)+': dorsal inválido');return}
 const key=club+'|'+name.toLowerCase();
 if(seen[key]){errors.push('Fila '+(i+2)+': jugador duplicado en '+club+': '+name);return}seen[key]=1;
 const player={n:name,p:pos,r:Math.round(rating),role:get('rol')||rawPos};
 if(get('id'))player.id=get('id');
 if(age!=null)player.age=age;
 if(number!=null)player.number=number;
 if(get('pie'))player.foot=get('pie');
 if(get('posiciones_secundarias'))player.alt=get('posiciones_secundarias').split(/[;|]/).map(x=>POS[x.trim().toUpperCase()]).filter(Boolean);
 const at={};ATTR.forEach(a=>{if(get(a)!==''){const n=Number(get(a));if(!Number.isFinite(n)||n<15||n>99)errors.push('Fila '+(i+2)+': atributo '+a+' fuera de rango');else at[a]=Math.round(n)}});
 if(Object.keys(at).length)player.at=at;
 (out[club]||(out[club]=[])).push(player);
 const src=get('fuente')||'Promiedos (verificación manual)',date=get('consultado')||new Date().toISOString().slice(0,10);
 (sources[club]||(sources[club]={source:src,consulted:date}));
 if(sources[club].source!==src||sources[club].consulted!==date) sources[club].mixed=true;
});
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
if(!Object.keys(out).length)throw Error('No hay jugadores válidos para importar');
if(REQUIRE_PRIMERA){
 const missing=PRIMERA.filter(id=>!out[id]||out[id].length<11);
 const extras=Object.keys(out).filter(id=>!PRIMERA.includes(id));
 if(missing.length||extras.length)throw Error('Primera incompleta. Clubes faltantes o con menos de 11: '+missing.join(', ')+'; IDs ajenos a Primera: '+extras.join(', ')+'. No se modificó ningún archivo.');
}
const counts=Object.fromEntries(Object.entries(out).map(([id,s])=>[id,s.length]));
for(const [id,n] of Object.entries(counts))if(n<11)console.warn('PENDIENTE:',id,'solo tiene',n,'jugadores; no se agregaron jugadores ficticios.');
const pub=path.join(__dirname,'public');fs.mkdirSync(pub,{recursive:true});
fs.writeFileSync(path.join(pub,'squads.json'),JSON.stringify(out));
fs.writeFileSync(path.join(pub,'squads.js'),'window.SQUADS='+JSON.stringify(out)+';');
fs.writeFileSync(path.join(pub,'squads-meta.json'),JSON.stringify({season:2026,updatedAt:new Date().toISOString(),source:'Planteles recopilados y verificados manualmente',ratings:'60 neutral si no se informa un valor; no son estadísticas oficiales',counts,sources,completePrimera:PRIMERA.every(id=>out[id]&&out[id].length>=11)},null,2));
console.log('Importación lista:',Object.keys(out).length,'clubes y',Object.values(out).reduce((a,s)=>a+s.length,0),'jugadores.');
console.log('Planteles por club:',counts);
