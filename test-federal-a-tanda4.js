const fs=require('fs'),path=require('path');
function parseCSV(s){const rows=[];let row=[],v='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='"'&&s[i+1]==='"'){v+='"';i++;}else if(c==='"')q=false;else v+=c;}else if(c==='"')q=true;else if(c===','){row.push(v);v='';}else if(c==='\n'){row.push(v.replace(/\r$/,''));rows.push(row);row=[];v='';}else v+=c;}if(v||row.length){row.push(v.replace(/\r$/,''));rows.push(row);}return rows;}
const file=path.join(__dirname,'planteles/borradores/federal-a-2026-tanda-4/completo.csv');
const rows=parseCSV(fs.readFileSync(file,'utf8')),headers=rows.shift().map(x=>x.trim().toLowerCase()),idx=Object.fromEntries(headers.map((h,i)=>[h,i]));
const expected=['gimcdu','lasparejas','vilelas','argmontemaiz','sarmientores','kimberley','villamitre'];
const required=['club_id','nombre','posicion','rating','fuente','fuente_rol','nat_source','rating_source','rating_base','ajuste_rating','rol_especifico'];
const roles=new Set(['POR','DFC','LD','LI','MCD','MC','MI','MD','MP','ED','EI','DC']),errors=[],seen=new Set(),counts={};
if(headers.length!==34)errors.push('Se esperaban 34 columnas, hay '+headers.length);
for(const h of required)if(idx[h]==null)errors.push('Falta columna '+h);
for(const [i,r] of rows.entries()){
 if(r.length!==headers.length){errors.push('Columnas incorrectas fila '+(i+2));continue;}
 const get=k=>(r[idx[k]]||'').trim(),club=get('club_id'),name=get('nombre'),rating=Number(get('rating')),age=get('edad')===''?null:Number(get('edad')),role=get('rol_especifico');
 counts[club]=(counts[club]||0)+1;
 if(!expected.includes(club))errors.push('Club inesperado '+club);
 if(!name)errors.push('Nombre vacío fila '+(i+2));
 if(!['POR','DEF','MED','DEL'].includes(get('posicion')))errors.push('Posición inválida '+name);
 if(!Number.isInteger(rating)||rating<1||rating>99)errors.push('Rating inválido '+name);
 if(age!==null&&(!Number.isInteger(age)||age<16||age>55))errors.push('Edad inválida '+name);
 if(age!==null&&!get('fuente_edad'))errors.push('Edad sin fuente '+name);
 if(!get('rating_source').startsWith('Estimación propia /'))errors.push('Fuente de rating ausente '+name);
 if(!get('fuente')||!get('fuente_rol')||!get('nat_source'))errors.push('Fuente incompleta '+name);
 if(!roles.has(role))errors.push('Rol específico inválido '+name);
 if(get('rating_base')!==get('rating')||get('ajuste_rating')!=='0')errors.push('Base/ajuste incorrecto '+name);
 if(!['ARG','PAR','PER','URU','BRA','CHI','COL','BOL','ECU','VEN'].includes(get('nat')))errors.push('Nacionalidad inválida '+name);
 const key=club+'|'+name.toLowerCase();if(seen.has(key))errors.push('Duplicado '+key);seen.add(key);
}
for(const club of expected){const n=counts[club]||0;if(n<18||n>32)errors.push(club+': fuera del rango permitido 18–32 ('+n+')');}
if(Object.keys(counts).length!==expected.length)errors.push('La tanda debe contener exactamente los 7 clubes previstos');
if(rows.length<126)errors.push('La tanda no alcanza 126 registros (7 clubes x mínimo 18)');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Federal A tanda 4: 7 clubes, '+rows.length+' jugadores, mínimo 18 por equipo, fuentes, roles y duplicados OK.');
