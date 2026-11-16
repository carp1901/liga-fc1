'use strict';
// Auditoría estructural del Promocional Amateur 2026.
// Los planteles conservan su tamaño real: mínimo 20; objetivo hasta 30; tolerancia máxima 32.
const fs=require('node:fs');
const assert=require('node:assert/strict');
function parseCSV(s){const rows=[];let row=[],v='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='"'&&s[i+1]==='"'){v+='"';i++;}else if(c==='"')q=false;else v+=c;}else if(c==='"')q=true;else if(c===','){row.push(v);v='';}else if(c==='\n'){row.push(v.endsWith('\r')?v.slice(0,-1):v);rows.push(row);row=[];v='';}else v+=c;}if(v.length||row.length){row.push(v.endsWith('\r')?v.slice(0,-1):v);rows.push(row);}return rows;}
const files=['planteles/borradores/promocional-amateur-2026/tanda1-inicial.csv','planteles/borradores/promocional-amateur-2026/tanda2-inicial.csv'];
const parsed=files.map(f=>parseCSV(fs.readFileSync(f,'utf8')));
const headers=parsed[0].shift().map(x=>x.trim().toLowerCase());
for(let i=1;i<parsed.length;i++)assert.deepEqual(parsed[i].shift().map(x=>x.trim().toLowerCase()),headers,'Los CSV deben compartir esquema');
const rows=parsed.flat(),col=Object.fromEntries(headers.map((h,i)=>[h,i]));
const expected=['defglew','metalurgico','hacoaj','fcezeiza','belgranozarate','uribelarrea','alumni','atpilar','barrancas','bacity','controlorientado','estrellaberisso','everton','juventudbernal','mandarinas','sat','udprovincial'];
const clubs=new Set(expected),counts={},names=new Set(),numbers=new Set();let total=0;
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
for(const [i,row] of rows.entries()){
 if(!row.some(x=>x.trim()))continue;
 const get=k=>row[col[k]]||'',club=get('club_id'),name=get('nombre'),pos=get('posicion'),rating=Number(get('rating')),dorsalRaw=get('dorsal'),dorsal=dorsalRaw===''?null:Number(dorsalRaw);
 assert(clubs.has(club),'Club no previsto: '+club);assert(name,'Nombre vacío en fila '+(i+2));
 assert(['ARQ','DEF','MED','DEL'].includes(pos),'Posición inválida: '+name);
 assert(Number.isInteger(rating)&&rating>=38&&rating<=53,'Media fuera de rango: '+name);
 assert(get('rating_source').startsWith('Estimación propia inicial v1'),'Media no identificada como estimación: '+name);
 if(dorsal!==null){assert(Number.isInteger(dorsal)&&dorsal>=1&&dorsal<=99,'Dorsal inválido: '+name);assert(get('dorsal_source').toLowerCase().includes('verificado'),'Dorsal asignado sin verificación: '+name);}
 else assert(get('dorsal_source').toLowerCase().includes('pendiente'),'Dorsal vacío sin marcar como pendiente: '+name);
 assert(get('fuente')&&get('consultado'),'Falta fuente o fecha: '+name);
 const key=club+'|'+norm(name);assert(!names.has(key),'Nombre duplicado: '+key);names.add(key);
 if(dorsal!==null){const nk=club+'|'+dorsal;assert(!numbers.has(nk),'Dorsal duplicado: '+nk);numbers.add(nk);}
 counts[club]=(counts[club]||0)+1;total++;
}
assert.equal(Object.keys(counts).length,17,'Deben existir exactamente 17 clubes');
for(const id of expected){const n=counts[id]||0;assert(n>=20&&n<=32,'Plantel fuera del rango acordado (20–32): '+id+' ('+n+')');}
assert.equal(total,Object.values(counts).reduce((a,b)=>a+b,0),'Total inconsistente');
const byNameClub=new Map();
for(const row of rows){const key=norm(row[col.nombre]);if(!byNameClub.has(key))byNameClub.set(key,new Set());byNameClub.get(key).add(row[col.club_id]);}
const crossDuplicates=[...byNameClub].filter(([,set])=>set.size>1).map(([name])=>name).sort();
const expectedCrossDuplicates=['franco barraza','franco gonzalez','gonzalo acosta','ivan barraza','matias gomez','santiago segovia'].sort();
assert.deepEqual(crossDuplicates,expectedCrossDuplicates,'Cambió la lista de homónimos entre clubes; revisar antes de integrar');
const homonymDoc=norm(fs.readFileSync('planteles/borradores/promocional-amateur-2026/homonimos-pendientes.md','utf8'));
for(const name of expectedCrossDuplicates)assert(homonymDoc.includes(name),'Homónimo no documentado: '+name);
const data=fs.readFileSync('public/data.js','utf8');
for(const id of clubs)assert(data.includes(id+'|'),'ID no encontrado en public/data.js: '+id);
if(process.argv.includes('--runtime')){
 const runtime=JSON.parse(fs.readFileSync('public/squads.json','utf8'));
 const meta=JSON.parse(fs.readFileSync('public/squads-meta.json','utf8'));
 for(const id of expected){
  const count=counts[id];
  assert(Array.isArray(runtime[id]),'Falta club en runtime: '+id);assert.equal(runtime[id].length,count,'Cantidad runtime incorrecta: '+id);
  assert.equal(meta.counts[id],count,'Metadata incorrecta: '+id);
  const byName=new Map(runtime[id].map(p=>[p.n,p]));
  for(const row of rows){if(row[col.club_id]!==id)continue;const player=byName.get(row[col.nombre]);assert(player,'Jugador no importado: '+id+'/'+row[col.nombre]);const dorsal=row[col.dorsal]===''?null:Number(row[col.dorsal]);assert.equal(player.number??null,dorsal,'Dorsal runtime distinto al CSV: '+id+'/'+row[col.nombre]);}
  assert.equal(meta.numberCoverage.byClub[id].assigned,0,'No deberían quedar dorsales sin verificar en runtime: '+id);
  assert.equal(meta.numberCoverage.byClub[id].missing,count,'Falta marcar dorsales pendientes en metadata: '+id);
  assert.equal(meta.nationalityCoverage.byClub[id].assigned,0,'No se deben inventar nacionalidades: '+id);
 }
 const baseSha=require('node:child_process').execFileSync('git',['merge-base','origin/main','HEAD'],{encoding:'utf8'}).trim();
 const baseline=JSON.parse(require('node:child_process').execFileSync('git',['show',baseSha+':public/squads.json'],{encoding:'utf8',maxBuffer:30*1024*1024}));
 for(const [id,players] of Object.entries(baseline))if(!clubs.has(id))assert.deepEqual(runtime[id],players,'Se alteró otro plantel: '+id);
}
console.log(process.argv.includes('--runtime')?'OK: Promocional Amateur validado en runtime; los demás planteles permanecen intactos.':`OK: ${total} registros en 17 clubes; planteles entre 20 y 32, homónimos documentados y dorsales no verificados pendientes.`);
