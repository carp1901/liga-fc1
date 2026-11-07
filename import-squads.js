// Importa planteles reales desde CSV verificado manualmente.
// Uso: node import-squads.js planteles/primera-2026.csv
// Validación: node import-squads.js planteles/primera-2026.csv --dry-run --require-primera-complete
// Publicación: node import-squads.js planteles/primera-2026.csv --require-primera-complete
// No inventa jugadores, dorsales ni edades. Las medias pueden ser oficiales o estimaciones propias claramente identificadas.
// Los atributos estimados se guardan en CSV; los no observados se derivan en public/data.js según puesto y media.
const fs=require('fs'),path=require('path');
const file=process.argv[2],REQUIRE_PRIMERA=process.argv.includes('--require-primera-complete'),DRY_RUN=process.argv.includes('--dry-run');
const AGE_REFERENCE_DATE='2026-11-06';
if(!file){console.error('Uso: node import-squads.js archivo.csv [--dry-run] [--require-primera-complete]');process.exit(1)}
function parseCSV(s){const rows=[];let row=[],v='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c=='"'&&s[i+1]=='"'){v+='"';i++}else if(c=='"')q=false;else v+=c}else if(c=='"')q=true;else if(c==','){row.push(v);v=''}else if(c=='\n'){row.push(v.replace(/\r$/,''));rows.push(row);row=[];v=''}else v+=c}if(v.length||row.length){row.push(v.replace(/\r$/,''));rows.push(row)}return rows}
const POS={POR:'POR',ARQ:'POR',GK:'POR',GOALKEEPER:'POR',DEF:'DEF',DF:'DEF',DEFENDER:'DEF',MED:'MED',MC:'MED',MCD:'MED',MO:'MED',MID:'MED',MF:'MED',MIDFIELDER:'MED',DEL:'DEL',FW:'DEL',ATA:'DEL',ATTACKER:'DEL'};
const ATTR=['pas','ctl','reg','rem','des','mar','ant','ref'];
const PRIMERA=['boca','river','racing','independiente','sanlorenzo','estudiantes','velez','talleres','lanus','rosario','huracan','belgrano','argentinos','defensa','newells','union','tigre','platense','banfield','gimnasia','centralcba','rivadavia','instituto','atletico','barracas','riestra','sarmiento','aldosivi','gimnasiamza','estudiantesrc'];
const ageAt=(birth,reference)=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(birth||'');if(!m)return null;const [y,mo,d]=m.slice(1).map(Number),[ry,rm,rd]=reference.split('-').map(Number);let age=ry-y;if(rm<mo||(rm===mo&&rd<d))age--;return age};
const rows=parseCSV(fs.readFileSync(file,'utf8'));if(rows.length<2)throw Error('El CSV no contiene jugadores');
const headers=rows.shift().map(x=>x.trim().toLowerCase()),col=Object.fromEntries(headers.map((h,i)=>[h,i]));
for(const h of ['club_id','nombre','posicion'])if(col[h]==null)throw Error('Falta columna obligatoria: '+h);
const out={},errors=[],sources={},seen={},seenNumbers={};
rows.forEach((r,i)=>{
 if(!r.some(x=>x.trim()))return;
 const get=k=>col[k]==null?'':(r[col[k]]||'').trim(),club=get('club_id'),name=get('nombre'),raw=get('posicion').toUpperCase(),pos=POS[raw],rating=Number(get('rating')),birth=get('fecha_nacimiento'),age=get('edad')!==''?Number(get('edad')):ageAt(birth,AGE_REFERENCE_DATE),number=get('dorsal')!==''?Number(get('dorsal')):null;
 if(!club||!name||!pos||get('rating')===''||!Number.isFinite(rating)||rating<1||rating>99){errors.push('Fila '+(i+2)+': club, nombre, posición o rating inválido');return}
 if(age!=null&&(!Number.isInteger(age)||age<15||age>50)){errors.push('Fila '+(i+2)+': edad inválida');return}
 if(birth&&!/^\d{4}-\d{2}-\d{2}$/.test(birth)){errors.push('Fila '+(i+2)+': fecha_nacimiento inválida');return}
 if(number!=null&&(!Number.isInteger(number)||number<1||number>99)){errors.push('Fila '+(i+2)+': dorsal inválido');return}
 if(get('ref')&&!Number.isFinite(Number(get('ref')))){errors.push('Fila '+(i+2)+': valor no numérico en ref; revisar nacionalidad mal ubicada');return}
 if(!get('rating_source')){errors.push('Fila '+(i+2)+': falta rating_source; usar OVR oficial o una estimación propia identificada, no dejar 60 por defecto');return}
 const key=club+'|'+name.toLowerCase();if(seen[key]){errors.push('Fila '+(i+2)+': jugador duplicado en '+club+': '+name);return}seen[key]=1;
 if(number!=null){const nk=club+'|'+number;if(seenNumbers[nk]){errors.push('Fila '+(i+2)+': dorsal duplicado en '+club+': '+number);return}seenNumbers[nk]=1}
 const player={n:name,p:pos,r:Math.round(rating),role:get('rol')||raw};
 if(get('abreviatura'))player.short=get('abreviatura');if(get('nat'))player.nat=get('nat');if(get('nat_source'))player.natSource=get('nat_source');if(get('id'))player.id=get('id');
 if(age!=null)player.age=age;if(birth)player.birthDate=birth;if(get('fuente_edad'))player.ageSource=get('fuente_edad');
 if(number!=null)player.number=number;if(get('dorsal_source'))player.numberSource=get('dorsal_source');
 if(get('pie'))player.foot=get('pie');
 if(get('posiciones_secundarias'))player.alt=get('posiciones_secundarias').split(/[;|]/).map(x=>POS[x.trim().toUpperCase()]).filter(Boolean);
 if(get('rol_especifico'))player.specificRole=get('rol_especifico');if(get('fuente_rol'))player.roleSource=get('fuente_rol');
 const at={};ATTR.forEach(a=>{if(get(a)!==''){const n=Number(get(a));if(!Number.isFinite(n)||n<15||n>99)errors.push('Fila '+(i+2)+': atributo '+a+' fuera de rango');else at[a]=Math.round(n)}});if(Object.keys(at).length)player.at=at;
 if(get('match_rating_2026')){const n=Number(get('match_rating_2026'));if(!Number.isFinite(n)||n<0||n>10)errors.push('Fila '+(i+2)+': match_rating_2026 inválido');else player.matchRating2026=n}
 if(get('rating_apps_2026')){const n=Number(get('rating_apps_2026'));if(!Number.isInteger(n)||n<0)errors.push('Fila '+(i+2)+': rating_apps_2026 inválido');else player.ratingApps2026=n}
 if(get('rating_source'))player.ratingSource=get('rating_source');
 (out[club]||(out[club]=[])).push(player);
 const src=sources[club]||(sources[club]={source:[],consulted:[],ageSource:[],numberSource:[],ratingSource:[],roleSource:[],natSource:[]});
 [['source','fuente'],['consulted','consultado'],['ageSource','fuente_edad'],['numberSource','dorsal_source'],['ratingSource','rating_source'],['roleSource','fuente_rol'],['natSource','nat_source']].forEach(([a,b])=>{const v=get(b);if(v&&!src[a].includes(v))src[a].push(v)});
});
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
if(!Object.keys(out).length)throw Error('No hay jugadores válidos para importar');
if(REQUIRE_PRIMERA){const missing=PRIMERA.filter(id=>!out[id]||out[id].length<11),extras=Object.keys(out).filter(id=>!PRIMERA.includes(id));if(missing.length||extras.length)throw Error('Primera incompleta. Faltan: '+missing.join(', ')+'; IDs ajenos: '+extras.join(', ')+'. No se modificó ningún archivo.')}
let previous={},previousMeta={};const pub=path.join(__dirname,'public');
try{previous=JSON.parse(fs.readFileSync(path.join(pub,'squads.json'),'utf8'))}catch(e){}try{previousMeta=JSON.parse(fs.readFileSync(path.join(pub,'squads-meta.json'),'utf8'))}catch(e){}
const merged={...previous,...out},counts=Object.fromEntries(Object.entries(merged).map(([id,s])=>[id,s.length])),all=Object.values(merged).flat(),total=all.length;
const coverage={},ageBy={},ratingBy={},natBy={},roleBy={};
for(const [id,arr] of Object.entries(merged)){coverage[id]={total:arr.length,assigned:arr.filter(p=>p.number!=null).length,missing:arr.filter(p=>p.number==null).length};ageBy[id]={total:arr.length,assigned:arr.filter(p=>p.age!=null).length,missing:arr.filter(p=>p.age==null).length};ratingBy[id]={total:arr.length,verified:arr.filter(p=>p.ratingSource&&!/^Estimación propia/i.test(p.ratingSource)).length,estimated:arr.filter(p=>/^Estimación propia/i.test(p.ratingSource||'')).length,provisional:arr.filter(p=>!p.ratingSource&&p.matchRating2026==null).length};natBy[id]={total:arr.length,assigned:arr.filter(p=>p.nat).length};roleBy[id]={total:arr.length,specific:arr.filter(p=>p.specificRole).length}}
const sum=(o,k)=>Object.values(o).reduce((a,x)=>a+x[k],0),sourcesOut={...previousMeta.sources};
for(const id of Object.keys(sources)){const prev=sourcesOut[id]||{},s=sources[id],one=k=>s[k].length===1?s[k][0]:s[k];sourcesOut[id]={...prev,source:one('source')||prev.source,consulted:one('consulted')||prev.consulted,ageSource:one('ageSource')||prev.ageSource,numberSource:one('numberSource')||prev.numberSource,ratingSource:one('ratingSource')||prev.ratingSource,roleSource:one('roleSource')||prev.roleSource,natSource:one('natSource')||prev.natSource}}
const duplicates=Object.entries(merged).flatMap(([id,arr])=>{const ns=new Set(),ds=new Set(),d=[];for(const p of arr){if(ns.has(p.n.toLowerCase()))d.push('nombre:'+id);ns.add(p.n.toLowerCase());if(p.number!=null){if(ds.has(p.number))d.push('dorsal:'+id);ds.add(p.number)}}return d});
const meta={season:2026,updatedAt:new Date().toISOString(),source:'Planteles recopilados y verificados manualmente',ratings:`${sum(ratingBy,'verified')} medias con fuente individual + ${sum(ratingBy,'estimated')} estimaciones propias identificadas + ${sum(ratingBy,'provisional')} provisionales sin fuente. Las estimaciones no se presentan como OVR oficial; los atributos no observados se derivan por puesto, rol específico y media.`,counts,sources:sourcesOut,completePrimera:PRIMERA.every(id=>merged[id]&&merged[id].length>=11),dataQualityComplete:false,ageReferenceDate:AGE_REFERENCE_DATE,numberCoverage:{assigned:sum(coverage,'assigned'),missing:total-sum(coverage,'assigned'),total,byClub:coverage},dorsalsComplete:sum(coverage,'assigned')===total,ageCoverage:{assigned:sum(ageBy,'assigned'),missing:total-sum(ageBy,'assigned'),birthDates:all.filter(p=>p.birthDate).length,total,byClub:ageBy},nationalityCoverage:{assigned:sum(natBy,'assigned'),missing:total-sum(natBy,'assigned'),total,byClub:natBy},specificRoleCoverage:{assigned:sum(roleBy,'specific'),missing:total-sum(roleBy,'specific'),total,byClub:roleBy},ratingCoverage:{rated:sum(ratingBy,'verified'),estimated:sum(ratingBy,'estimated'),total,provisional:sum(ratingBy,'provisional'),byClub:ratingBy,source:'EA SPORTS FC 27/26 (EA, FCScoutDB, FIFAIndex/FIFACM), Sofascore, Statz.ai, Sportlumy y FotMob; estimaciones propias identificadas por separado.',formula:'Se prioriza OVR individual EA FC 27 y EA FC 26 como respaldo; después promedios de partido con al menos 10 apariciones. Sin evidencia individual, no se acepta una media por defecto.'},attributeCoverage:{manualPlayers:all.filter(p=>p.at&&Object.keys(p.at).length).length,derivedPlayers:all.filter(p=>!p.at||!Object.keys(p.at).length).length,method:'public/data.js deriva atributos por rol específico, posición y media.'},qualityAudit:{clubs:Object.keys(merged).length,players:total,duplicateNames:duplicates.filter(x=>x.startsWith('nombre:')).length,duplicateNumbers:duplicates.filter(x=>x.startsWith('dorsal:')).length,playersMissingAge:total-sum(ageBy,'assigned'),playersMissingDorsal:total-sum(coverage,'assigned'),verifiedRatings:sum(ratingBy,'verified'),estimatedRatings:sum(ratingBy,'estimated'),provisionalRatings:sum(ratingBy,'provisional'),playersMissingNationality:total-sum(natBy,'assigned'),playersMissingFoot:all.filter(p=>!p.foot).length,playersMissingSpecificRole:total-sum(roleBy,'specific'),playersWithoutManualAttributes:all.filter(p=>!p.at||!Object.keys(p.at).length).length}};
if(DRY_RUN){console.log('Validación correcta:',Object.keys(out).length,'clubes,',Object.values(out).reduce((a,s)=>a+s.length,0),'jugadores; edades',meta.ageCoverage.assigned+'/'+total,'; dorsales',meta.numberCoverage.assigned+'/'+total,'; medias verificadas',meta.ratingCoverage.rated+'/'+total);process.exit(0)}
fs.mkdirSync(pub,{recursive:true});fs.writeFileSync(path.join(pub,'squads.json'),JSON.stringify(merged));fs.writeFileSync(path.join(pub,'squads.js'),'window.SQUADS='+JSON.stringify(merged)+';');fs.writeFileSync(path.join(pub,'squads-meta.json'),JSON.stringify(meta,null,2));
console.log('Planteles publicados:',Object.keys(merged).length,'clubes y',total,'jugadores.');
