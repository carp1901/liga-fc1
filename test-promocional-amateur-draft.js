'use strict';
// Auditoría estructural y de runtime del Promocional Amateur 2026.
// El máximo habitual es 30; se admite hasta 32 cuando la nómina y la participación lo justifican.
const fs=require('node:fs');
const assert=require('node:assert/strict');
function parseCSV(s){const rows=[];let row=[],v='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='"'&&s[i+1]==='"'){v+='"';i++;}else if(c==='"')q=false;else v+=c;}else if(c==='"')q=true;else if(c===','){row.push(v);v='';}else if(c==='\n'){row.push(v.endsWith('\r')?v.slice(0,-1):v);rows.push(row);row=[];v='';}else v+=c;}if(v.length||row.length){row.push(v.endsWith('\r')?v.slice(0,-1):v);rows.push(row);}return rows;}
const files=['planteles/borradores/promocional-amateur-2026/tanda1-inicial.csv','planteles/borradores/promocional-amateur-2026/tanda2-inicial.csv'];
const parsed=files.map(f=>parseCSV(fs.readFileSync(f,'utf8')));
const headers=parsed[0].shift().map(x=>x.trim().toLowerCase());
for(let i=1;i<parsed.length;i++)assert.deepEqual(parsed[i].shift().map(x=>x.trim().toLowerCase()),headers,'Los CSV deben compartir esquema');
const rows=parsed.flat(),col=Object.fromEntries(headers.map((h,i)=>[h,i]));
const expected={defglew:30,metalurgico:32,hacoaj:30,fcezeiza:30,belgranozarate:30,uribelarrea:32,alumni:30,atpilar:30,barrancas:31,bacity:30,controlorientado:30,estrellaberisso:32,everton:28,juventudbernal:29,mandarinas:30,sat:32,udprovincial:32};
const clubs=new Set(Object.keys(expected)),counts={},names=new Set(),numbers=new Set();let total=0;
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
for(const [i,row] of rows.entries()){
 if(!row.some(x=>x.trim()))continue;
 const get=k=>row[col[k]]||'',club=get('club_id'),name=get('nombre'),pos=get('posicion'),rating=Number(get('rating')),dorsalRaw=get('dorsal'),dorsal=dorsalRaw===''?null:Number(dorsalRaw);
 assert(clubs.has(club),'Club no previsto: '+club);assert(name,'Nombre vacío en fila '+(i+2));
 assert(['ARQ','DEF','MED','DEL'].includes(pos),'Posición inválida: '+name);
 assert(Number.isInteger(rating)&&rating>=38&&rating<=53,'Media fuera de rango: '+name);
 assert(/^(Estimación propia|Estimación provisional)/.test(get('rating_source')),'Media no identificada como estimación: '+name);
 if(dorsal!==null){assert(Number.isInteger(dorsal)&&dorsal>=1&&dorsal<=99,'Dorsal inválido: '+name);assert(/estimado|verificado|provisional/i.test(get('dorsal_source')),'Dorsal no identificado como estimado/verificado/provisional: '+name);}
 else assert(/pendiente/i.test(get('dorsal_source')),'Dorsal vacío sin marcar como pendiente: '+name);
 assert(get('fuente')&&get('consultado'),'Falta fuente o fecha: '+name);
 const key=club+'|'+norm(name);assert(!names.has(key),'Nombre duplicado: '+key);names.add(key);
 if(dorsal!==null){const nk=club+'|'+dorsal;assert(!numbers.has(nk),'Dorsal duplicado: '+nk);numbers.add(nk);}
 counts[club]=(counts[club]||0)+1;total++;
}
assert.deepEqual(counts,expected,'Los conteos por club cambiaron');
assert.equal(total,518,'Total de jugadores inesperado');
const byName=new Map();
for(const row of rows){const name=norm(row[col.nombre]);if(!byName.has(name))byName.set(name,new Set());byName.get(name).add(row[col.club_id]);}
const crossDuplicates=[...byName].filter(([,ids])=>ids.size>1).map(([name])=>name).sort();
const expectedCrossDuplicates=['franco barraza','franco gonzalez','gonzalo acosta','ivan barraza','santiago segovia'].sort();
assert.deepEqual(crossDuplicates,expectedCrossDuplicates,'Cambió la lista de homónimos entre clubes; revisar antes de integrar');
const homonymDoc=norm(fs.readFileSync('planteles/borradores/promocional-amateur-2026/homonimos-pendientes.md','utf8'));
for(const name of expectedCrossDuplicates)assert(homonymDoc.includes(name),'Homónimo no documentado: '+name);
const data=fs.readFileSync('public/data.js','utf8');
for(const id of clubs)assert(data.includes(id+'|'),'ID no encontrado en public/data.js: '+id);
if(process.argv.includes('--runtime')){
 const runtime=JSON.parse(fs.readFileSync('public/squads.json','utf8'));
 const meta=JSON.parse(fs.readFileSync('public/squads-meta.json','utf8'));
 for(const [id,count] of Object.entries(expected)){
  assert(Array.isArray(runtime[id]),'Falta club en runtime: '+id);assert.equal(runtime[id].length,count,'Cantidad runtime incorrecta: '+id);
  assert.equal(meta.counts[id],count,'Metadata incorrecta: '+id);
  const byPlayer=new Map(runtime[id].map(p=>[p.n,p]));
  for(const row of rows){if(row[col.club_id]!==id)continue;const player=byPlayer.get(row[col.nombre]);assert(player,'Jugador no importado: '+id+'/'+row[col.nombre]);const dorsal=row[col.dorsal]===''?null:Number(row[col.dorsal]);assert.equal(player.number??null,dorsal,'Dorsal runtime distinto al CSV: '+id+'/'+row[col.nombre]);}
 }
 // Base: lo publicado antes de importar Promocional (el pipeline la deja en SQUADS_BASELINE_PATH); sin ella, origin/main como antes.
 const baselinePath=process.env.SQUADS_BASELINE_PATH,baseline=JSON.parse(baselinePath?fs.readFileSync(baselinePath,'utf8'):require('node:child_process').execFileSync('git',['show','origin/main:public/squads.json'],{encoding:'utf8',maxBuffer:30*1024*1024}));
 for(const [id,players] of Object.entries(baseline))if(!clubs.has(id))assert.deepEqual(runtime[id],players,'Se alteró otro plantel: '+id);
}
console.log(process.argv.includes('--runtime')?'OK: 518 jugadores cargados en 17 clubes; las demás divisiones permanecen intactas.':'OK: 518 jugadores en 17 clubes; sin duplicados internos ni dorsales falsamente presentados como oficiales.');
