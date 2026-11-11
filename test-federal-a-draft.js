const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'planteles/borradores/federal-a-2026-tanda-1/completo.csv');
const expected = {
  nuevejulio: 25, alvarado: 20, atenas: 19, atsanmartinmza: 17, bmitre: 15,
  bocaunidos: 19, cipolletti: 17, defbelgranovr: 22, rincon: 22, soldeamerica: 16
};
function parseCSV(s) {
  const rows=[]; let row=[], value='', quoted=false;
  for(let i=0;i<s.length;i++){
    const c=s[i];
    if(quoted){if(c==='"'&&s[i+1]==='"'){value+='"';i++;}else if(c==='"')quoted=false;else value+=c;}
    else if(c==='"')quoted=true;
    else if(c===','){row.push(value);value='';}
    else if(c==='\\n'){row.push(value.replace(/\\r$/,''));rows.push(row);row=[];value='';}
    else value+=c;
  }
  if(value.length||row.length){row.push(value.replace(/\\r$/,''));rows.push(row);}
  return rows;
}
const rows=parseCSV(fs.readFileSync(file,'utf8'));
const headers=rows.shift().map(x=>x.trim().toLowerCase());
const index=Object.fromEntries(headers.map((h,i)=>[h,i]));
const required=['club_id','nombre','posicion','rating','rating_source','fuente','fuente_rol','nat_source','rating_base','ajuste_rating','rol_especifico'];
for(const h of required)if(index[h]==null)throw Error('Falta columna '+h);
const errors=[],counts={},seen=new Set(),roles=new Set(['POR','DFC','LD','LI','MCD','MC','MI','MD','MP','ED','EI','DC']);
for(const [i,r] of rows.entries()){
  if(r.length!==headers.length){errors.push('Fila '+(i+2)+': columnas incorrectas '+r.length);continue;}
  const get=k=>(r[index[k]]||'').trim();
  const club=get('club_id'),name=get('nombre'),pos=get('posicion'),rating=Number(get('rating')),role=get('rol_especifico');
  counts[club]=(counts[club]||0)+1;
  if(!expected[club])errors.push('Club inesperado: '+club);
  if(!name)errors.push('Nombre vacío en fila '+(i+2));
  if(!['POR','DEF','MED','DEL'].includes(pos))errors.push('Posición inválida: '+name+' / '+pos);
  if(!Number.isInteger(rating)||rating<1||rating>99)errors.push('Rating inválido: '+name);
  if(!get('rating_source').startsWith('FM27 / FM Blog ABI'))errors.push('Fuente ABI ausente: '+name);
  if(!get('fuente')||!get('fuente_rol')||!get('nat_source'))errors.push('Fuente faltante: '+name);
  if(!roles.has(role))errors.push('Rol específico inválido: '+name+' / '+role);
  if(get('rating_base')!==get('rating')||get('ajuste_rating')!=='0')errors.push('Base/ajuste inválido: '+name);
  const key=club+'|'+name.toLowerCase();
  if(seen.has(key))errors.push('Duplicado: '+key);
  seen.add(key);
}
for(const [club,n] of Object.entries(expected))if(counts[club]!==n)errors.push(club+': se esperaban '+n+' jugadores y hay '+(counts[club]||0));
for(const club of Object.keys(counts))if(!expected[club])errors.push('ID no permitido: '+club);
if(rows.length!==192)errors.push('Total esperado 192; encontrado '+rows.length);
if(errors.length){console.error(errors.join('\\n'));process.exit(1);}
console.log('Federal A 2026: 10 clubes, 192 jugadores, columnas, roles, fuentes, medias y duplicados OK.');
