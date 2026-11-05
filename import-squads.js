// Importa planteles reales desde CSV sin inventar jugadores.
// Uso: node import-squads.js planteles.csv
// Columnas: club_id,nombre,posicion,rating,edad,pie,posiciones_secundarias,id,pas,ctl,reg,rem,des,mar,ant,ref
const fs=require('fs'),path=require('path');
const file=process.argv[2];
if(!file){console.error('Uso: node import-squads.js planteles.csv');process.exit(1)}
function parseCSV(s){
 const rows=[];let row=[],v='',q=false;
 for(let i=0;i<s.length;i++){const c=s[i];
  if(q){if(c=='"'&&s[i+1]=='"'){v+='"';i++}else if(c=='"')q=false;else v+=c}
  else if(c=='"')q=true;else if(c==','){row.push(v);v=''}else if(c=='\n'){row.push(v.replace(/\r$/,''));rows.push(row);row=[];v=''}else v+=c;
 }
 if(v.length||row.length){row.push(v.replace(/\r$/,''));rows.push(row)}
 return rows;
}
const POS={POR:'POR',GK:'POR',ARQ:'POR',DEF:'DEF',DF:'DEF',MED:'MED',MID:'MED',MF:'MED',DEL:'DEL',FW:'DEL',ATA:'DEL'};
const ATTR=['pas','ctl','reg','rem','des','mar','ant','ref'];
const rows=parseCSV(fs.readFileSync(file,'utf8'));
if(rows.length<2)throw Error('El CSV no contiene jugadores');
const headers=rows.shift().map(x=>x.trim().toLowerCase()),col=Object.fromEntries(headers.map((h,i)=>[h,i]));
for(const h of ['club_id','nombre','posicion','rating'])if(col[h]==null)throw Error('Falta columna obligatoria: '+h);
const out={},errors=[];
rows.forEach((r,i)=>{
 if(!r.some(x=>x.trim()))return;
 const get=k=>col[k]==null?'':(r[col[k]]||'').trim(),club=get('club_id'),name=get('nombre'),pos=POS[get('posicion').toUpperCase()],rating=Number(get('rating')),age=get('edad')?Number(get('edad')):null;
 if(!club||!name||!pos||!Number.isFinite(rating)||rating<1||rating>99){errors.push('Fila '+(i+2)+': datos obligatorios inválidos');return}
 const player={n:name,p:pos,r:Math.round(rating)};
 if(get('id'))player.id=get('id');
 if(age!=null){if(!Number.isInteger(age)||age<15||age>50){errors.push('Fila '+(i+2)+': edad inválida');return}player.age=age}
 if(get('pie'))player.foot=get('pie');
 if(get('posiciones_secundarias'))player.alt=get('posiciones_secundarias').split(/[;|]/).map(x=>POS[x.trim().toUpperCase()]).filter(Boolean);
 const at={};ATTR.forEach(a=>{if(get(a)!==''){const n=Number(get(a));if(!Number.isFinite(n)||n<15||n>99)errors.push('Fila '+(i+2)+': atributo '+a+' fuera de rango');else at[a]=Math.round(n)}});
 if(Object.keys(at).length)player.at=at;
 (out[club]||(out[club]=[])).push(player);
});
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
const counts=Object.fromEntries(Object.entries(out).map(([id,s])=>[id,s.length]));
for(const [id,n] of Object.entries(counts))if(n<11)console.warn('ATENCIÓN:',id,'solo tiene',n,'jugadores; no se agregaron suplentes ficticios.');
const pub=path.join(__dirname,'public');fs.mkdirSync(pub,{recursive:true});
fs.writeFileSync(path.join(pub,'squads.json'),JSON.stringify(out));
fs.writeFileSync(path.join(pub,'squads.js'),'window.SQUADS='+JSON.stringify(out)+';');
fs.writeFileSync(path.join(pub,'squads-meta.json'),JSON.stringify({season:2026,updatedAt:new Date().toISOString(),source:'CSV verificado manualmente',counts},null,2));
console.log('Importación lista:',Object.keys(out).length,'clubes y',Object.values(out).reduce((a,s)=>a+s.length,0),'jugadores.');
console.log('Planteles por club:',counts);
