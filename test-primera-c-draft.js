'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
function parseCSV(input){const rows=[];let row=[],value='',quoted=false;for(let i=0;i<input.length;i++){const c=input[i];if(quoted){if(c==='"'&&input[i+1]==='"'){value+='"';i++;}else if(c==='"')quoted=false;else value+=c;}else if(c==='"')quoted=true;else if(c===','){row.push(value);value='';}else if(c.charCodeAt(0)===10){row.push(value.endsWith(String.fromCharCode(13))?value.slice(0,-1):value);rows.push(row);row=[];value='';}else value+=c;}if(value.length||row.length){row.push(value.endsWith(String.fromCharCode(13))?value.slice(0,-1):value);rows.push(row);}return rows;}
const files=[
 'planteles/borradores/primera-c-2026/tanda1-inicial.csv',
 'planteles/borradores/primera-c-2026/tanda2-inicial.csv',
 'planteles/borradores/primera-c-2026/tanda3-inicial.csv',
 'planteles/borradores/primera-c-2026/tanda4-inicial.csv'
];
const parsed=files.map(file=>parseCSV(fs.readFileSync(file,'utf8')));
const headers=parsed[0].shift().map(x=>x.trim().toLowerCase());
for(let i=1;i<parsed.length;i++)assert.deepEqual(parsed[i].shift().map(x=>x.trim().toLowerCase()),headers,'Los cuatro CSV deben compartir esquema');
const rows=parsed.flat();const col=Object.fromEntries(headers.map((h,i)=>[h,i]));
const expected={
 juventudunida:30,estrelladelsur:29,argentinorosario:30,victorianoarenas:30,sacachispas:30,alem:29,mercedes:29,
 berazategui:30,paraguayo:42,cambaceres:30,puertonuevo:30,centroespanol:29,jjurquiza:49,lugano:45,
 atlas:42,canuelas:30,centralballester:30,centralcordobarosario:32,claypole:39,espanol:39,muniz:38,
 porvenir:44,fenix:42,lamadrid:39,leones:37,lujan:27,sportivobarracas:39,yupanqui:38
};
const allowed=new Set(Object.keys(expected)),names=new Set(),numbers=new Set(),totalByClub={};let total=0;
const normalizedName=s=>Array.from(s.normalize('NFD')).filter(ch=>{const n=ch.charCodeAt(0);return n<768||n>879;}).join('').toLowerCase();
const crossNames=new Map();
for(const [i,row] of rows.entries()){
 if(!row.some(x=>x.trim()))continue;
 const get=k=>row[col[k]]||'',club=get('club_id'),name=get('nombre'),pos=get('posicion'),rating=Number(get('rating')),dorsal=Number(get('dorsal'));
 assert(allowed.has(club),'Club fuera de Primera C: '+club);assert(name,'Nombre vacío en fila '+(i+2));
 assert(['ARQ','DEF','MED','DEL'].includes(pos),'Posición inválida: '+name);
 assert(Number.isInteger(rating)&&rating>=38&&rating<=53,'Media provisional fuera de rango: '+name);
 assert(get('rating_source').startsWith('Estimación propia inicial v1'),'La media debe quedar marcada como estimación: '+name);
 assert(Number.isInteger(dorsal)&&dorsal>=1&&dorsal<=99,'Dorsal estimado inválido: '+name);
 assert(get('dorsal_source').includes('estimado'),'Fuente del dorsal no identificada como estimada: '+name);
 assert(get('fuente')&&get('consultado'),'Falta procedencia nominal: '+name);
 const key=club+'|'+normalizedName(name);assert(!names.has(key),'Jugador duplicado dentro del club: '+key);names.add(key);
 totalByClub[club]=(totalByClub[club]||0)+1;const nk=club+'|'+dorsal;assert(!numbers.has(nk),'Dorsal duplicado: '+nk);numbers.add(nk);total++;
 if(!crossNames.has(normalizedName(name)))crossNames.set(normalizedName(name),[]);
 crossNames.get(normalizedName(name)).push({club,pos,name});
}
assert.deepEqual(totalByClub,expected,'Cambió la cantidad nominal de las cuatro tandas');assert.equal(total,978,'Total nominal inesperado');
const collisions=[...crossNames.entries()].filter(([,v])=>v.length>1).map(([n])=>n).sort();
assert.deepEqual(collisions,['gonzalo medina','lautaro torres','rodrigo ortiz','rodrigo soria','santiago diaz'],'Apareció un homónimo entre clubes no auditado');
const pair=(name,expectedPair)=>assert.deepEqual(crossNames.get(name).map(x=>x.club+'|'+x.pos).sort(),expectedPair);
pair('rodrigo soria',['lugano|MED','victorianoarenas|ARQ']);
pair('lautaro torres',['estrelladelsur|DEL','sacachispas|MED']);
pair('rodrigo ortiz',['claypole|MED','paraguayo|DEL']);
pair('gonzalo medina',['alem|MED','fenix|MED']);
pair('santiago diaz',['cambaceres|DEF','lujan|MED']);
const berazateguiRows=rows.filter(row=>row[col.club_id]==='berazategui');assert.equal(berazateguiRows.length,30,'Berazategui debe quedar con los 30 jugadores de mayor participación 2026');
for(const name of ['Santiago Escudero','Agustín Hernández','Federico Tursi','Joaquín Asselborn','Derek Bentancor','Facundo Caballero','Luciano De Respinis','Luca Bergliavaz','Thiago Ferreyra','Camilo Díaz'])assert(!berazateguiRows.some(row=>row[col.nombre]===name),'Berazategui conserva un jugador fuera del corte de participación: '+name);
for(const name of ['Joaquín Pucheta','Braian Benítez'])assert(berazateguiRows.some(row=>row[col.nombre]===name),'Falta jugador de alta participación en Berazategui: '+name);
for(const [name,pos] of [['Thiago Benítez','DEF'],['Alexis Godoy','MED'],['Bautista Hernández','MED'],['Emiliano Caballero','MED']])assert.equal(berazateguiRows.find(row=>row[col.nombre]===name)?.[col.posicion],pos,'Posición de Berazategui incorrecta: '+name);
const victorianoRows=rows.filter(row=>row[col.club_id]==='victorianoarenas');assert.equal(victorianoRows.length,30,'Victoriano Arenas debe quedar en 30 jugadores');
for(const name of ['Santiago Benvenutti','Rodrigo Soria','Lucas Borras','Ivo Patiño','Rodrigo Richards','Lucas Sireiro','Rodrigo Taus'])assert(!victorianoRows.some(row=>row[col.nombre]===name),'Victoriano conserva un jugador fuera del corte de participación: '+name);
const argentinoRows=rows.filter(row=>row[col.club_id]==='argentinorosario');assert.equal(argentinoRows.length,30,'Argentino de Rosario debe quedar en 30 futbolistas con mayor participación');
for(const name of ['Fabricio Manduca','Tomás Ávalos','Brandon Fontana','Jhon Palacin Ramírez','Facundo Cefarelli','Joaquín Duarte','Marcos Ginex','Bismark Gómez','Sebastián Guanter','Miguel Hernández Castillo','Lautaro Pino','Agustín Sánchez Graziadei','Javier Saucedo','Facundo Yess','Facundo Franceschini','Rodrigo González','Nicolás Heiz','Lucas Molina','Franco Peralta Bravo','Mauro Scassa'])assert(!argentinoRows.some(row=>row[col.nombre]===name),'Argentino conserva un jugador fuera del corte de participación: '+name);
const mercedesRows=rows.filter(row=>row[col.club_id]==='mercedes');assert.equal(mercedesRows.length,29,'Club Mercedes debe quedar con su plantel de cierre de 29 jugadores');
for(const name of ['Franco Tonatto','Román Cruz','Franco Taborda','Lucas Calderón','Ulises Antonio Dematei','Lautaro Lagos'])assert(!mercedesRows.some(row=>row[col.nombre]===name),'Mercedes conserva un jugador fuera del plantel de cierre: '+name);
assert.equal(mercedesRows.find(row=>row[col.nombre]==='Franco Ortigosa')?.[col.posicion],'DEL','Franco Ortigosa debe figurar como delantero');
assert.equal(mercedesRows.find(row=>row[col.nombre]==='Francisco Ruiz')?.[col.posicion],'MED','Francisco Ruiz debe figurar como mediocampista');
const cambaceresRows=rows.filter(row=>row[col.club_id]==='cambaceres');assert.equal(cambaceresRows.length,30,'Cambaceres debe quedar en los 30 futbolistas de mayor participación 2026');
for(const name of ['Enzo Avalos','Dylan Godoy','Benjamín González','Román Abelando','Matías Arbizu','Santiago Argüello','Federico Giménez','Ignacio Lachalde','Nicolas Le Bellot','Santino Musciati','Juan Sosa','Damián Martínez','Matías Rebagliati','Juan Segundo Vera'])assert(!cambaceresRows.some(row=>row[col.nombre]===name),'Cambaceres conserva un jugador fuera del corte de participación: '+name);
for(const name of ['Esteban Coronel','Bryan Schmidt','Román Zárate','Facundo Odello','Javier Sequeyra','Tomás Baglieri','Tomás Ledesma','Renzo Fernández','Mariano Coletto'])assert(cambaceresRows.some(row=>row[col.nombre]===name),'Falta jugador con participación confirmada en Cambaceres: '+name);
const estrellaRows=rows.filter(row=>row[col.club_id]==='estrelladelsur');assert.equal(estrellaRows.length,29,'Estrella del Sur debe quedar en 29 jugadores del plantel de cierre');
for(const name of ['Santiago Delabarba','Tomás Lingua Bender','Ignacio Quiroz','Tomás Eguia','Kevin Escobar','Facundo Montes de Oca','Nicolás Montes de Oca','Kevin Aquino','Joshua Gómez','Santiago Tallarico','Cristian Toledo','Nicolás Maldonado','Geremías Martínez','Elias Mazzantti'])assert(!estrellaRows.some(row=>row[col.nombre]===name),'Estrella conserva un jugador fuera del plantel de cierre: '+name);
for(const name of ['Gabriel Rivera','Lucas Cabrera','Felipe Scabuzzo'])assert(estrellaRows.some(row=>row[col.nombre]===name),'Falta integrante confirmado del plantel de cierre de Estrella: '+name);
const juventudRows=rows.filter(row=>row[col.club_id]==='juventudunida');assert.equal(juventudRows.length,30,'Juventud Unida debe quedar en 30 jugadores con presencia priorizada');
for(const name of ['Ezequiel Figueroa','Martín Mesilla','Julián Carnelos','Fabrizio Furnaro','Román Gauto','Tomás Silveyra','Felipe Ameijeiras','Santino Barletta','Tobías Barrientos','Lautaro Montes','Tomás Otero','Gabriel Rivarola','Antonio Riveros','Nahuel Rodríguez','Nicolás Valeriano','Leandro Velázquez','Lautaro Candia','Daniel Mafrici','Mateo Ursi','Joaquín Iglesias','Diego López','Santiago Núñez'])assert(!juventudRows.some(row=>row[col.nombre]===name),'Juventud Unida conserva un jugador fuera del corte de participación: '+name);
assert(juventudRows.some(row=>row[col.nombre]==='Fernando Giménez'),'Debe incorporarse Fernando Giménez, con 10 partidos en 2026');
const puertoRows=rows.filter(row=>row[col.club_id]==='puertonuevo');assert.equal(puertoRows.length,30,'Puerto Nuevo debe quedar en 30 jugadores');
for(const name of ['Federico Aciar','Benjamín Ferreyra','Tomás Schefer'])assert(!puertoRows.some(row=>row[col.nombre]===name),'Puerto Nuevo conserva un jugador sin presencias oficiales: '+name);
const lujanRows=rows.filter(row=>row[col.club_id]==='lujan');assert.equal(lujanRows.length,27,'Luján debe quedar en 27 jugadores tras la depuración respaldada');
for(const name of ['Valentín Alegre','Juan Moreno','Román Busto','Santiago Tríbulo','Gonzalo Ramírez','Aaron Villecco'])assert(!lujanRows.some(row=>row[col.nombre]===name),'Luján conserva un nombre retirado sin participación oficial: '+name);
assert(lujanRows.some(row=>row[col.nombre]==='Maximiliano Piñeiro'),'Debe conservarse Piñeiro por convocatoria en la fecha 34');
for(const [name,pos] of [['Lucas Gómez','DEF'],['Franco Pérez','DEL'],['Tomás Dopazo','MED']])assert.equal(lujanRows.find(row=>row[col.nombre]===name)?.[col.posicion],pos,'Posición de Luján incorrecta: '+name);
const sapio=rows.filter(row=>row[col.nombre]==='Santino Sapio');assert.equal(sapio.length,1);assert.equal(sapio[0][col.posiciones_secundarias],'MED');
const matias=rows.find(row=>row[col.club_id]==='sacachispas'&&row[col.nombre]==='Matías Arias');assert(matias,'Falta Matías Arias, con 16 partidos y 1.306 minutos');assert.equal(matias[col.posicion],'MED');assert.equal(Number(matias[col.edad]),25);assert.equal(Number(matias[col.dorsal]),51);
assert(rows.some(row=>row[col.club_id]==='cambaceres'&&row[col.nombre]==='Víctor Gómez'),'Falta Víctor Gómez, confirmado por perfil individual en Cambaceres');
assert(rows.some(row=>row[col.club_id]==='lamadrid'&&row[col.nombre]==='Néstor Acosta'),'Falta Néstor Acosta, titular en los 33 partidos de Lamadrid');
assert(!rows.some(row=>row[col.club_id]==='centralballester'&&row[col.nombre]==='Franco Gómez'),'Franco Gómez no tuvo presencias ni convocatorias de primer equipo en 2026');
if(process.argv.includes('--runtime')){
 const runtime=JSON.parse(fs.readFileSync('public/squads.json','utf8'));const meta=JSON.parse(fs.readFileSync('public/squads-meta.json','utf8'));const data=fs.readFileSync('public/data.js','utf8');
 for(const [id,count] of Object.entries(expected)){
  assert(data.includes(id+'|'),'Club inexistente en public/data.js: '+id);assert(Array.isArray(runtime[id]),'Falta club en runtime: '+id);assert.equal(runtime[id].length,count,'Cantidad incorrecta en runtime: '+id);
  const actual=new Map(runtime[id].map(p=>[p.n,p]));
  for(const row of rows){const get=k=>row[col[k]]||'';if(get('club_id')!==id)continue;const p=actual.get(get('nombre'));assert(p,'No importado: '+id+'/'+get('nombre'));
   assert.equal(p.p,get('posicion')==='ARQ'?'POR':get('posicion'),'Posición runtime incorrecta: '+p.n);assert.equal(p.r,Number(get('rating')),'Media runtime incorrecta: '+p.n);assert.equal(p.role,get('rol'),'Rol runtime incorrecto: '+p.n);
   assert.equal(p.number,Number(get('dorsal')),'Dorsal runtime incorrecto: '+p.n);assert.equal(p.numberSource,get('dorsal_source'),'Fuente dorsal runtime incorrecta: '+p.n);assert(p.ratingSource.startsWith('Estimación propia inicial v1'),'Media sin etiqueta de estimación: '+p.n);
  }
  assert.equal(meta.counts[id],count,'Metadata incorrecta: '+id);
 }
 const baseline=JSON.parse(require('node:child_process').execFileSync('git',['show','origin/main:public/squads.json'],{encoding:'utf8',maxBuffer:20*1024*1024}));
 for(const [id,players] of Object.entries(baseline))if(!allowed.has(id))assert.deepEqual(runtime[id],players,'Se alteró accidentalmente otro plantel: '+id);
}
console.log(process.argv.includes('--runtime')?'OK: 978 jugadores cargados en 28 clubes; homónimos identificados y los demás planteles intactos.':'OK: CSV de Primera C — 28 clubes, 976 jugadores, sin duplicados internos ni dorsales repetidos.');
