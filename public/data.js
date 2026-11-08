(function(){
// Equipos 2026 (Argentina). Formato: id|nombre|color1|color2|nivel(1-100). Los colores y niveles son aproximados.
// Planteles: se generan con nombres argentinos verosímiles; para datos reales usá import-squads.js (ver planteles/README.md).
const mk=s=>s.split('\n').map(l=>{const[id,name,c1,c2,r]=l.split('|');return{id,name,c1,c2,r:+r}});
const R1=`boca|Boca Juniors|#103f91|#f7c600|80
river|River Plate|#f4f4f4|#e30613|82
racing|Racing Club|#7fb3e0|#ffffff|77
independiente|Independiente|#d1001f|#ffffff|74
sanlorenzo|San Lorenzo|#0a2a5e|#c8102e|72
estudiantes|Estudiantes (LP)|#d81e2b|#ffffff|77
velez|Vélez|#ffffff|#00529b|75
talleres|Talleres (C)|#0b2a5a|#ffffff|76
lanus|Lanús|#8a1538|#ffffff|74
rosario|Rosario Central|#1e4fa3|#f7c600|75
huracan|Huracán|#ffffff|#d1001f|73
belgrano|Belgrano|#6fb7e9|#ffffff|73
argentinos|Argentinos Jrs.|#d1001f|#ffffff|72
defensa|Defensa y J.|#f4d000|#0a7d3b|71
newells|Newell's|#d1001f|#111111|70
union|Unión (SF)|#d1001f|#ffffff|71
tigre|Tigre|#0b2a5a|#d1001f|70
platense|Platense|#6b3b1f|#ffffff|70
banfield|Banfield|#0a7d3b|#ffffff|69
gimnasia|Gimnasia (LP)|#0b2a5a|#ffffff|70
centralcba|Central Cba. (SdE)|#111111|#f4d000|69
rivadavia|Indep. Rivadavia|#1e4fa3|#ffffff|71
instituto|Instituto|#d1001f|#ffffff|68
atletico|Atl. Tucumán|#7fb3e0|#ffffff|68
barracas|Barracas Central|#d1001f|#ffffff|67
riestra|Dep. Riestra|#111111|#ffffff|66
sarmiento|Sarmiento (J)|#0a7d3b|#ffffff|66
aldosivi|Aldosivi|#f4d000|#0a7d3b|65
gimnasiamza|Gimnasia (M)|#0b3d91|#ffffff|66
estudiantesrc|Estudiantes (RC)|#7fb3e0|#ffffff|64`,R2=`agropecuario|Agropecuario|#1a8a3c|#ffffff|56
allboys|All Boys|#f4f4f4|#111111|58
almirantebrown|Alte. Brown|#f4d000|#111111|55
almagro|Almagro|#1e4fa3|#ffffff|58
atlanta|Atlanta|#f4d000|#1e4fa3|60
centralnorte|Central Norte|#111111|#ffffff|55
chaco|Chaco For Ever|#0a7d3b|#ffffff|56
chacarita|Chacarita Jrs.|#d1001f|#111111|59
colegiales|Colegiales|#0a7d3b|#ffffff|56
colon|Colón|#d1001f|#111111|63
defensoresbelgrano|Def. de Belgrano|#111111|#ffffff|55
madryn|Dep. Madryn|#0b3d91|#ffffff|58
maipu|Dep. Maipú|#d1001f|#ffffff|59
moron|Dep. Morón|#ffffff|#d1001f|56
estudiantesba|Estudiantes (BA)|#d1001f|#ffffff|55
ferro|Ferro|#0a7d3b|#ffffff|62
gimnasiajujuy|Gimnasia (J)|#ffffff|#0b2a5a|60
gimnasiatiro|Gimnasia y Tiro|#ffffff|#0b2a5a|56
guemes|Güemes|#111111|#ffffff|56
losandes|Los Andes|#d1001f|#ffffff|57
mitre|Mitre (SdE)|#f4d000|#111111|58
nuevachicago|Nueva Chicago|#0a7d3b|#111111|59
patronato|Patronato|#d1001f|#111111|59
quilmes|Quilmes|#ffffff|#0b2a5a|59
racingcba|Racing (Cba.)|#7fb3e0|#ffffff|60
sanmartintuc|San Martín (T)|#d1001f|#ffffff|59
sanmiguel|San Miguel|#0b3d91|#ffffff|54
santelmo|San Telmo|#0b3d91|#ffffff|54
temperley|Temperley|#7fb3e0|#ffffff|57
tristansuarez|Tristán Suárez|#0b2a5a|#ffffff|57
midland|Midland|#0a7d3b|#111111|58
rafaela|Atl. Rafaela|#7fb3e0|#ffffff|58
godoycruz|Godoy Cruz|#0b3d91|#ffffff|64
sanmartinsj|San Martín (SJ)|#111111|#0a7d3b|61
ciudadbolivar|C. de Bolívar|#ffffff|#d1001f|54
acassuso|Acassuso|#ffffff|#0b3d91|55`,R3=`argentinomerlo|Argentino (M)|#d1001f|#111111|50
argentinoquilmes|Argentino (Q)|#d1001f|#ffffff|47
arsenal|Arsenal|#7fb3e0|#d1001f|53
brownadrogue|Brown (A)|#ffffff|#111111|52
liniers|Liniers|#0b3d91|#ffffff|47
comunicaciones|Comunicaciones|#0b2a5a|#d1001f|50
defensoresunidos|Def. Unidos|#0a7d3b|#111111|50
armenio|Dep. Armenio|#d1001f|#0b2a5a|47
camioneros|Camioneros|#0b3d91|#ffffff|46
laferrere|Laferrere|#0a7d3b|#ffffff|48
deportivomerlo|Dep. Merlo|#d1001f|#ffffff|48
docksud|Dock Sud|#0b2a5a|#f4d000|47
excursionistas|Excursionistas|#0b2a5a|#ffffff|49
flandria|Flandria|#f4d000|#0b2a5a|50
ituzaingo|Ituzaingó|#d1001f|#ffffff|47
realpilar|Real Pilar|#0b3d91|#ffffff|48
sanmartinburzaco|San Martín (B)|#0b2a5a|#ffffff|47
sportivoitaliano|Sp. Italiano|#0b3d91|#d1001f|50
talleresre|Talleres (RE)|#0b2a5a|#ffffff|50
uai|UAI Urquiza|#0b2a5a|#f4d000|50
villadalmine|Villa Dálmine|#6a2c91|#ffffff|51
villasancarlos|Villa S. Carlos|#0b3d91|#ffffff|48`,R4=`alem|L. N. Alem|#d1001f|#ffffff|42
mercedes|Mercedes|#f4d000|#111111|42
juventudunida|Juventud Unida|#0b3d91|#ffffff|41
estrelladelsur|Estrella d. Sur|#d1001f|#ffffff|40
argentinorosario|Argentino (R)|#0b2a5a|#ffffff|43
victorianoarenas|V. Arenas|#d1001f|#ffffff|40
sacachispas|Sacachispas|#d1001f|#ffffff|44
berazategui|Berazategui|#0a7d3b|#ffffff|44
paraguayo|Dep. Paraguayo|#d1001f|#0b3d91|39
jjurquiza|J. J. Urquiza|#d1001f|#111111|40
cambaceres|Def. de Cambaceres|#0a7d3b|#ffffff|42
puertonuevo|Puerto Nuevo|#0b3d91|#ffffff|41
lugano|Lugano|#d1001f|#ffffff|42
centroespanol|Centro Español|#d1001f|#f4d000|41
atlas|Atlas|#d1001f|#ffffff|40
canuelas|Cañuelas|#f4d000|#111111|41
centralballester|Central Ballester|#0b3d91|#ffffff|40
centralcordobarosario|Central Cba. (R)|#111111|#ffffff|43
claypole|Claypole|#0b2a5a|#ffffff|41
espanol|Dep. Español|#d1001f|#f4d000|41
muniz|Muñiz|#0a7d3b|#ffffff|39
porvenir|El Porvenir|#111111|#ffffff|41
fenix|Fénix|#d1001f|#111111|42
lamadrid|Gral. Lamadrid|#0b2a5a|#ffffff|41
leones|Leones|#111111|#d1001f|43
lujan|Luján|#0b3d91|#ffffff|40
sportivobarracas|Sp. Barracas|#0b2a5a|#ffffff|41
yupanqui|Yupanqui|#0b3d91|#ffffff|40`;
const R5=`nuevejulio|9 de Julio (R)|#1e4fa3|#ffffff|50
alvarado|Alvarado|#d1001f|#ffffff|52
atenas|Atenas (RC)|#7fb3e0|#ffffff|51
atsanmartinmza|Atl. San Martín (M)|#0b3d91|#ffffff|50
bmitre|Bartolomé Mitre|#f4d000|#0b2a5a|49
bocaunidos|Boca Unidos|#0b3d91|#f4d000|52
cipolletti|Cipolletti|#0b3d91|#ffffff|53
defbelgranovr|Def. Belgrano (VR)|#111111|#ffffff|49
rincon|Dep. Rincón|#d1001f|#ffffff|47
soldeamerica|Sol de América (F)|#d1001f|#ffffff|48
soldemayo|Sol de Mayo|#0b2a5a|#ffffff|50
tucumancentral|Tucumán Central|#0a7d3b|#ffffff|48
costabrava|Costa Brava|#d1001f|#111111|47
circulo|Círculo Deportivo|#d1001f|#ffffff|48
fadep|FADEP|#0b3d91|#ffffff|47
germinal|Germinal|#0b2a5a|#ffffff|49
gbrown|Guillermo Brown|#0b3d91|#ffffff|53
juventudsl|Juventud Unida (SL)|#d1001f|#ffffff|50
santamarina|Santamarina|#0b2a5a|#ffffff|53
douglashaig|Douglas Haig|#d1001f|#111111|52
gimchivilcoy|Gimnasia (Chiv.)|#0b3d91|#ffffff|49
sanmartinformosa|San Martín (F)|#d1001f|#ffffff|48
sarmientolb|Sarmiento (LB)|#0a7d3b|#ffffff|52
sportivobelgrano|Sp. Belgrano|#0a7d3b|#ffffff|50
huracanlh|Huracán (LH)|#ffffff|#d1001f|48
olimpo|Olimpo|#f4d000|#111111|53
antoniana|Juv. Antoniana|#d1001f|#ffffff|48
linqueno|El Linqueño|#0b3d91|#ffffff|47
indchivilcoy|Independiente (Ch.)|#d1001f|#ffffff|48
escobar|Escobar FC|#0b2a5a|#ffffff|47
gimcdu|Gimnasia (CdU)|#0b3d91|#ffffff|50
lasparejas|Sp. Las Parejas|#d1001f|#111111|50
vilelas|Def. P. Vilelas|#0a7d3b|#ffffff|47
argmontemaiz|Argentino (MM)|#0b3d91|#ffffff|48
sarmientores|Sarmiento (R)|#0a7d3b|#ffffff|49
estudiantessl|Estudiantes (SL)|#d1001f|#ffffff|50
kimberley|Kimberley|#ffffff|#0a7d3b|48
villamitre|Villa Mitre|#0a7d3b|#ffffff|52`;
const R6=`alumni|Alumni (LH)|#d1001f|#ffffff|38
atpilar|Atl. Pilar|#0b3d91|#ffffff|39
barrancas|Barrancas|#0a7d3b|#ffffff|37
belgranozarate|Belgrano (Z)|#6fb7e9|#ffffff|38
bacity|Buenos Aires City|#0b2a5a|#f4d000|40
controlorientado|Control Orientado|#d1001f|#111111|37
defglew|Def. de Glew|#0a7d3b|#111111|39
metalurgico|Dep. Metalúrgico|#0b3d91|#f4d000|42
estrellaberisso|Estrella (Berisso)|#d1001f|#ffffff|39
everton|Everton (LP)|#1e4fa3|#ffffff|38
fcezeiza|FC Ezeiza|#0b3d91|#ffffff|41
juventudbernal|Juventud (Bernal)|#0b2a5a|#ffffff|38
mandarinas|Las Mandarinas|#f58220|#ffffff|37
hacoaj|Náutico Hacoaj|#0b3d91|#ffffff|39
sat|SAT|#d1001f|#ffffff|37
udprovincial|U. D. Provincial|#0a7d3b|#ffffff|36
uribelarrea|Uribelarrea FC|#0b3d91|#f4d000|37`;
const R7=`uy_nacional|Nacional (UY)|#ffffff|#1e4fa3|68
uy_penarol|Peñarol|#f4d000|#111111|68
uy_defensor|Defensor Sporting|#6b2a8a|#ffffff|60
uy_danubio|Danubio|#ffffff|#111111|57
uy_liverpool|Liverpool (UY)|#1e4fa3|#111111|57
uy_wanderers|Montevideo Wanderers|#111111|#ffffff|54
uy_riverplate|River Plate (UY)|#d1001f|#ffffff|53
uy_cerro|Cerro|#7fb3e0|#ffffff|51
uy_cerrolargo|Cerro Largo|#0b3d91|#ffffff|52
uy_plaza|Plaza Colonia|#ffffff|#0b3d91|50
uy_progreso|Progreso|#0b3d91|#f4d000|49
uy_racing|Racing (UY)|#0a7d3b|#ffffff|51
uy_boston|Boston River|#0a7d3b|#f4d000|52
uy_torque|Montevideo City Torque|#7fb3e0|#ffffff|56
uy_juventud|Juventud (UY)|#d1001f|#ffffff|50
uy_albion|Albion|#0b3d91|#d1001f|50`,R8=`uy_rentistas|Rentistas|#0b3d91|#d1001f|46
uy_miramar|Miramar Misiones|#d1001f|#ffffff|45
uy_uruguaymvd|Uruguay Montevideo|#ffffff|#0b3d91|44
uy_tacuarembo|Tacuarembó|#0b3d91|#ffffff|45
uy_rampla|Rampla Juniors|#d1001f|#0a7d3b|46
uy_maldonado|Deportivo Maldonado|#0b3d91|#ffffff|44
uy_central|Central Español|#d1001f|#0a7d3b|45
uy_sudamerica|Sud América|#d1001f|#ffffff|43
uy_villaesp|Villa Española|#d1001f|#f4d000|43
uy_fenix|Fénix|#6b2a8a|#ffffff|44
uy_oriental|Oriental|#d1001f|#ffffff|42
uy_canadian|Canadian|#d1001f|#111111|42
uy_atenas|Atenas (UY)|#7fb3e0|#ffffff|42
uy_artigas|Artigas|#0b3d91|#ffffff|41`;
const DIVS=[{id:'ar1',country:'Argentina',name:'Primera División',ok:true,teams:mk(R1)},{id:'ar2',country:'Argentina',name:'Primera Nacional',ok:true,teams:mk(R2)},
{id:'ar5',country:'Argentina',name:'Federal A',ok:true,teams:mk(R5)},
{id:'ar3',country:'Argentina',name:'Primera B Metropolitana',ok:true,teams:mk(R3)},{id:'ar4',country:'Argentina',name:'Primera C',ok:true,teams:mk(R4)},
{id:'ar6',country:'Argentina',name:'Promocional Amateur',ok:true,teams:mk(R6)},
{id:'uy1',country:'Uruguay',name:'Primera División (Uruguay)',ok:true,teams:mk(R7)},{id:'uy2',country:'Uruguay',name:'Segunda División (Uruguay)',ok:true,teams:mk(R8)}];
DIVS.forEach(d=>d.teams.sort((x,y)=>x.name.localeCompare(y.name,'es')));   // todos los clubes de cada división, en orden alfabético
// Registro de ligas (selector "Liga:" de Nueva carrera). Para sumar una liga nueva: agregar sus divisiones en DIVS (con country) y una entrada acá.
// order = categorías de arriba a abajo · cup = copa nacional de ese país · real = ¿ya tiene el formato realista cargado? · kl = texto del selector de categorías
const LEAGUES=[
 {id:'ar',name:'Argentina',order:['ar1','ar2','ar3','ar5','ar4','ar6'],cup:'Copa Argentina',real:true,kl:{2:'(Primera y Nacional)',4:'(hasta B Metro y Federal A)',5:'(+ Primera C)',6:'(+ Promocional Amateur)'}},
 {id:'uy',name:'Uruguay',order:['uy1','uy2'],cup:'Copa Uruguaya',real:true,kl:{2:'(Primera y Segunda)'}}];
const teams=DIVS.flatMap(x=>x.teams);
const TM={};teams.forEach(t=>TM[t.id]=t);
const FM=[[4,4,2],[4,3,3],[3,5,2],[4,5,1],[5,3,2],[4,5,1],[4,4,2],[3,4,3],[5,4,1],[4,4,2],[4,5,1],[4,5,1],[3,6,1],[5,2,3]];
const FN=['4-4-2','4-3-3','3-5-2','4-5-1','5-3-2','4-2-3-1','4-2-2-2','3-4-3','5-4-1','4-3-1-2','4-1-4-1','4-4-1-1','3-4-2-1','5-2-3'];
const slots=f=>{const[d,m,a]=FM[f];return['POR',...Array(d).fill('DEF'),...Array(m).fill('MED'),...Array(a).fill('DEL')]};
// Puesto exacto de cada casillero: se comparte la misma geometría que usa el campo 2D.
function exactSlots(f,st){
 try{
  const sim=typeof window!=='undefined'&&window.SIM2D?window.SIM2D:require('./sim2d');
  return sim.roleLayout(f,Number.isInteger(st)?st:1).map(q=>{
   if(q.rl=='ARQ')return'POR';if(q.rl=='DEF')return'DFC';
   if(q.rl=='L')return q.rs<0?'LI':'LD';if(q.rl=='M')return q.rs<0?'MI':'MD';
   if(q.rl=='EX')return q.rs<0?'EI':'ED';
   return q.rl;
  });
 }catch(e){return slots(f).map(p=>p=='POR'?'POR':p=='DEF'?'DFC':p=='MED'?'MC':'DC')}
}
const roleGroup=r=>r=='POR'?'POR':['DFC','LI','LD','LIB'].includes(r)?'DEF':['MCD','MC','MO','MP','MI','MD'].includes(r)?'MED':['DC','SD','EI','ED'].includes(r)?'DEL':null;
const roleFit=(x,want)=>{
 const main=String(x.specificRole||x.pos||'').trim().toUpperCase();
 const alt=Array.isArray(x.alt)?x.alt.map(v=>String(v||'').trim().toUpperCase()):[];
 if(!want||!main)return 0;
 if(main==want)return 4.5;
 if(alt.includes(want))return 2.5;
 if(roleGroup(main)==roleGroup(want))return -3.5;
 return -8;
};
// Asignación óptima de jugadores a casilleros (algoritmo húngaro, no elección voraz).
function maxAssignment(score){
 const n=score.length,m=score[0]?.length||0;if(!n||m<n)return null;
 const u=Array(n+1).fill(0),v=Array(m+1).fill(0),p=Array(m+1).fill(0),way=Array(m+1).fill(0);
 for(let i=1;i<=n;i++){
  p[0]=i;let j0=0,minv=Array(m+1).fill(Infinity),used=Array(m+1).fill(false);
  do{used[j0]=true;const i0=p[j0];let delta=Infinity,j1=0;
   for(let j=1;j<=m;j++)if(!used[j]){const cur=-score[i0-1][j-1]-u[i0]-v[j];if(cur<minv[j]){minv[j]=cur;way[j]=j0}if(minv[j]<delta){delta=minv[j];j1=j}}
   for(let j=0;j<=m;j++){if(used[j]){u[p[j]]+=delta;v[j]-=delta}else minv[j]-=delta}j0=j1;
  }while(p[j0]!==0);
  do{const j1=way[j0];p[j0]=p[j1];j0=j1}while(j0);
 }
 const out=Array(n).fill(-1);for(let j=1;j<=m;j++)if(p[j])out[p[j]-1]=j-1;return out;
}
function autoXI(sq,f,ban,st){
 const sl=slots(f),want=exactSlots(f,st),pool=sq.map((_,i)=>i).filter(i=>!(ban&&ban.has(i)));
 if(pool.length<sl.length)return sl.map(()=>-1);
 const weights=sl.map((pos,k)=>pool.map(i=>{
  const x=sq[i],base=roleOvr(x,pos)*(x.p==pos?1:(pos=='POR'||x.p=='POR')?.3:.8);
  return base+roleFit(x,want[k]);
 }));
 const assigned=maxAssignment(weights);return assigned?assigned.map(j=>pool[j]):sl.map(()=>-1);
}
const rng=s=>{s>>>=0;return()=>{s=s+0x6D2B79F5>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
const hs=x=>{let h=2166136261;for(const c of x)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const AP=['Acosta','Aguirre','Álvarez','Barrios','Benítez','Blanco','Bustos','Cabrera','Castro','Chávez','Correa','Cuello','Díaz','Domínguez','Escobar','Fernández','Figueroa','Flores','Giménez','Godoy','Gómez','González','Herrera','Ibarra','Juárez','Ledesma','López','Luna','Maldonado','Martínez','Medina','Molina','Montenegro','Moreno','Navarro','Núñez','Ojeda','Ortiz','Páez','Peralta','Pereyra','Pérez','Quiroga','Ramírez','Rey','Ríos','Rivero','Rodríguez','Rojas','Romero','Ruiz','Salas','Sánchez','Silva','Sosa','Suárez','Torres','Vega','Villalba','Vera'];
const POS=['POR','POR','DEF','DEF','DEF','DEF','DEF','DEF','MED','MED','MED','MED','MED','MED','DEL','DEL','DEL','DEL'];
// ===== Modelo de atributos y escalas de valoración =====
// Los datos reales se cargarán por etapas. La escala deja margen para futuras ligas de élite.
// Offline: 40-90 para Argentina; 91-99 reservado a futbolistas excepcionales de ligas top.
const PLAYER_SCALE={offline:{min:40,argentinaMax:90,futureEliteMin:91,max:99},online:{min:70,max:85,target:78},tiers:['alto','medio','bajo']};
// Tres escalones proporcionales dentro de CADA división, ordenados por nivel actual del club.
const TEAM_TIERS=Object.fromEntries(DIVS.map(d=>{const sorted=d.teams.slice().sort((a,b)=>b.r-a.r||a.name.localeCompare(b.name));const n=sorted.length;return[d.id,Object.fromEntries(sorted.map((t,i)=>[t.id,Math.min(2,Math.floor(i*3/n))]))]}));
const teamTier=(team,division)=>{const d=typeof division=='string'?DIVS.find(x=>x.id==division):division||DIVS.find(x=>x.teams.some(t=>t.id==team));return d?TEAM_TIERS[d.id]?.[team]??2:2};
// Atributos técnicos, tácticos, físicos y específicos de arquero (15-99).
// pas pase · ctl control · reg regate · rem definición · des desmarque · mar marca · ant anticipación · ref reflejos
// vel velocidad · ace aceleración · res resistencia · fue fuerza · cab cabeceo · cen centros · pot potencia de tiro · agr agresividad
// par atajadas · man blocaje · sal salidas/aéreo · pie juego con los pies.
const ATTRS=['pas','ctl','reg','rem','des','mar','ant','ref','vel','ace','res','fue','cab','cen','pot','agr','par','man','sal','pie','lea'];
const PROFILES={
 POR:{off:{ref:9,par:10,man:7,sal:4,pie:-2,ant:2,pas:-8,ctl:-8,vel:-8,ace:-8,res:-5,fue:1,cab:2,cen:-8,pot:-25,agr:-3,reg:-20,rem:-35,des:-25,mar:-12},w:{ref:.24,par:.28,man:.16,sal:.1,pie:.07,ant:.06,pas:.04,ctl:.03,vel:.01,ace:.01}},
 DEF:{off:{mar:8,ant:7,cab:5,fue:4,vel:1,ace:-1,res:3,agr:3,pas:-3,ctl:-5,reg:-12,rem:-18,des:-7,ref:-45,par:-45,man:-45,sal:-45,pie:-5,cen:-4,pot:-8},w:{mar:.22,ant:.17,cab:.1,fue:.1,vel:.09,res:.08,pas:.07,ctl:.05,agr:.04,ace:.03,reg:.02,des:.01,cen:.01,pot:.01}},
 MED:{off:{pas:7,ctl:6,reg:3,ant:3,res:4,vel:1,ace:1,cen:2,mar:-1,rem:-5,fue:-2,cab:-5,agr:-2,ref:-45,par:-45,man:-45,sal:-45,pie:2,pot:-4,des:1},w:{pas:.18,ctl:.14,reg:.09,ant:.1,res:.12,vel:.08,ace:.06,mar:.08,des:.06,cen:.03,fue:.02,pot:.02,agr:.02}},
 DEL:{off:{rem:9,des:8,reg:4,ctl:2,vel:5,ace:5,pot:5,cab:2,pas:-5,mar:-20,ant:-10,fue:1,res:1,agr:1,ref:-45,par:-45,man:-45,sal:-45,pie:-5,cen:1},w:{rem:.17,des:.14,vel:.12,ace:.1,reg:.12,ctl:.08,cab:.06,pot:.06,pas:.05,res:.03,fue:.02,agr:.02,mar:.01,ant:.01,cen:.01}}
};
const ROLE_OFFSETS={
 DFC:{mar:5,ant:5,cab:4,fue:3,vel:-2,ace:-2,reg:-4,rem:-3,des:-1},
 LI:{vel:5,ace:5,res:4,cen:5,reg:3,mar:1,ant:1,cab:-2,fue:-1},
 LD:{vel:5,ace:5,res:4,cen:4,reg:3,mar:1,ant:1,cab:-2,fue:-1},
 MCD:{mar:5,ant:4,pas:3,res:3,ctl:1,reg:-1,rem:-2,des:1},
 MC:{pas:3,ctl:3,reg:1,ant:1,res:2,vis:3,mar:0},
 MO:{ctl:5,reg:5,pas:4,vis:5,rem:3,des:2,mar:-4,ant:-2},
 MP:{ctl:5,reg:4,pas:5,rem:2,des:2,vel:1,mar:-4,ant:-2},
 EI:{vel:5,ace:5,reg:5,ctl:3,rem:3,cen:3,mar:-5,ant:-3},
 ED:{vel:5,ace:5,reg:5,ctl:3,rem:3,cen:3,mar:-5,ant:-3},
 MI:{vel:3,ace:3,res:4,cen:3,reg:2,mar:2,ant:1,pas:1},
 MD:{vel:3,ace:3,res:4,cen:3,reg:2,mar:2,ant:1,pas:1},
 DC:{rem:5,des:4,pot:4,cab:3,fue:2,vel:1,pas:-2,mar:-6},
 SD:{rem:4,des:4,ctl:4,reg:3,vis:3,pas:2,mar:-5},
 LIB:{mar:4,ant:5,cab:3,pas:2,ctl:1,fue:2,vel:-1,reg:-2}
};
const clampA=v=>Math.max(15,Math.min(99,Math.round(v)));
// media de un jugador en un puesto: promedio ponderado de sus atributos relevantes para ese puesto
const roleOvr=(x,pos)=>{const w=(PROFILES[pos]||PROFILES.MED).w;let s=0;for(const a in w)s+=w[a]*(x.at?x.at[a]:x.r);return s};
function mkAt(p,r,rr,role){const P=PROFILES[p]||PROFILES.MED,R=ROLE_OFFSETS[role]||{},at={};ATTRS.forEach(a=>at[a]=r+(P.off[a]||0)+(R[a]||0)+(rr()-.5)*12);
 for(let k=0;k<3;k++){let s=0;for(const a in P.w)s+=P.w[a]*at[a];const dl=r-s;ATTRS.forEach(a=>at[a]=Math.max(15,Math.min(99,at[a]+dl)))}   // se recentra para que la media del puesto coincida con r
 ATTRS.forEach(a=>at[a]=clampA(at[a]));return at}
// completa un jugador: si trae los 8 atributos se respetan (y si falta la media se calcula); si trae algunos, el resto se deriva; si no trae ninguno, se deriva todo de p y r
const goalkeeperOnly=['ref','par','man','sal'];
const withAt=(x,key)=>{if(x.at&&ATTRS.filter(a=>a!=='lea').every(a=>typeof x.at[a]=='number')){const age=Number(x.age),lead=Number.isFinite(age)&&age>0?Math.max(35,Math.min(92,Math.round(42+(age-18)*2.1))):50,at={...x.at,lea:x.at.lea??lead};if(x.p!=='POR')goalkeeperOnly.forEach(a=>at[a]=15);return{...x,r:x.r!=null?x.r:Math.round(roleOvr(x,x.p)),at};}
 const r0=x.r!=null?x.r:60,gen=mkAt(x.p,r0,rng(hs('at|'+key+'|'+x.n+'|'+x.p)),x.specificRole),age=Number(x.age),lead=Number.isFinite(age)&&age>0?Math.max(35,Math.min(92,Math.round(42+(age-18)*2.1))):50,at={...gen,...(x.at||{}),lea:x.at?.lea??lead};if(x.p!=='POR')goalkeeperOnly.forEach(a=>at[a]=15);return{...x,r:r0,at};};
const SQ={};let REAL={};try{REAL=require('./squads.json')}catch(e){REAL=(typeof window!=='undefined'&&window.SQUADS)||{}}
const rawSquad=id=>SQ[id]||(SQ[id]=(REAL[id]||(()=>{const t=TM[id],r=rng(hs('sq'+id));return POS.map(p=>({p,n:String.fromCharCode(65+Math.floor(r()*26))+'. '+AP[Math.floor(r()*AP.length)],r:Math.round(t.r-10+r()*16)}))})()).map((x,i)=>withAt(x,id+'|'+i)));
let MIX=false;const setMix=b=>{MIX=!!b};
// Modo "Todas las categorías (equilibrado)": copia derivada (los datos originales no se tocan). Se desplazan por igual la media y los atributos de todo el plantel
// hasta que la calidad de su once titular (4-4-2, con la media de cada puesto) llegue a BAL_T; se conservan las diferencias entre jugadores, líneas y perfiles.
const BAL_T=PLAYER_SCALE.online.target,SN={};
const xiQuality=sq=>{const xi=autoXI(sq,0),sl=slots(0);return xi.reduce((a,i,k)=>a+roleOvr(sq[i],sl[k]),0)/11};
const squadN=id=>SN[id]||(SN[id]=(()=>{const s=rawSquad(id),dl=BAL_T-xiQuality(s),lo=PLAYER_SCALE.online.min,hi=PLAYER_SCALE.online.max;return s.map(x=>({...x,r:Math.max(lo,Math.min(hi,Math.round(x.r+dl))),at:Object.fromEntries(ATTRS.map(a=>[a,x.p!=='POR'&&goalkeeperOnly.includes(a)?15:Math.max(lo,Math.min(hi,clampA(x.at[a]+dl)))]))}))})());
const squadMode=(id,mix)=>mix?squadN(id):rawSquad(id);
const squad=id=>MIX?squadN(id):rawSquad(id);
// Torneos barriales/regionales (fantasía, no oficiales). IDs resueltos contra los clubes existentes; los del Promocional Amateur usan sus IDs actuales (fcezeiza, defglew, metalurgico, atpilar, hacoaj, controlorientado, belgranozarate, barrancas, bacity, everton, alumni, estrellaberisso, mandarinas, udprovincial, etc.).
const CUPS=[{"id": "sur", "name": "Capo del Sur", "clubs": ["racing", "independiente", "lanus", "banfield", "defensa", "losandes", "quilmes", "santelmo", "temperley", "tristansuarez", "arsenal", "argentinoquilmes", "brownadrogue", "docksud", "sanmartinburzaco", "talleresre", "camioneros", "estrelladelsur", "victorianoarenas", "berazategui", "canuelas", "claypole", "porvenir", "fcezeiza", "defglew", "juventudbernal"], "title": "Copa «Capo del Sur»"}, {"id": "oeste", "name": "Capo del Oeste", "clubs": ["almirantebrown", "almagro", "moron", "estudiantesba", "sanmiguel", "midland", "argentinomerlo", "liniers", "laferrere", "deportivomerlo", "ituzaingo", "sportivoitaliano", "uai", "alem", "mercedes", "juventudunida", "lugano", "centroespanol", "atlas", "jjurquiza", "flandria", "lujan", "muniz", "yupanqui", "paraguayo", "sat", "metalurgico"], "title": "Copa «Capo del Oeste»"}, {"id": "norte", "name": "Capo del Norte", "clubs": ["tigre", "platense", "chacarita", "colegiales", "acassuso", "defensoresunidos", "armenio", "realpilar", "villadalmine", "centralballester", "puertonuevo", "escobar", "atpilar", "hacoaj", "controlorientado", "belgranozarate"], "title": "Copa «Capo del Norte»"}, {"id": "caba", "name": "Capo de CABA", "clubs": ["boca", "river", "sanlorenzo", "velez", "argentinos", "huracan", "barracas", "riestra", "allboys", "atlanta", "defensoresbelgrano", "nuevachicago", "ferro", "comunicaciones", "excursionistas", "espanol", "lamadrid", "sacachispas", "sportivobarracas", "fenix", "barrancas", "bacity"], "title": "Copa «Capo de CABA»"}, {"id": "cuyo", "name": "Copa de Cuyo", "clubs": ["rivadavia", "gimnasiamza", "godoycruz", "maipu", "sanmartinsj", "atsanmartinmza", "fadep", "huracanlh", "juventudsl", "estudiantessl"], "title": "Copa de Cuyo"}, {"id": "litoral", "name": "Copa del Litoral", "clubs": ["newells", "rosario", "union", "colon", "rafaela", "patronato", "chaco", "argentinorosario", "centralcordobarosario", "leones", "nuevejulio", "bmitre", "bocaunidos", "soldeamerica", "sanmartinformosa", "sarmientores", "gimcdu", "lasparejas", "vilelas"], "title": "Copa del Litoral"}, {"id": "noa", "name": "Copa del Noroeste Argentino (NOA)", "clubs": ["atletico", "centralcba", "centralnorte", "gimnasiajujuy", "gimnasiatiro", "guemes", "mitre", "sanmartintuc", "tucumancentral", "antoniana", "sarmientolb"], "title": "Copa del Noroeste Argentino (NOA)"}, {"id": "patagonia", "name": "Copa de la Patagonia", "clubs": ["madryn", "cipolletti", "rincon", "soldemayo", "costabrava", "germinal", "gbrown"], "title": "Copa de la Patagonia"}, {"id": "cordoba", "name": "Copa Córdoba", "clubs": ["talleres", "belgrano", "instituto", "racingcba", "estudiantesrc", "atenas", "sportivobelgrano", "argmontemaiz"], "title": "Copa Córdoba"}, {"id": "bonaerense", "name": "Copa Bonaerense", "clubs": ["estudiantes", "gimnasia", "aldosivi", "sarmiento", "agropecuario", "ciudadbolivar", "villasancarlos", "cambaceres", "alvarado", "kimberley", "circulo", "santamarina", "douglashaig", "gimchivilcoy", "indchivilcoy", "linqueno", "defbelgranovr", "olimpo", "villamitre", "everton", "alumni", "estrellaberisso", "mandarinas", "uribelarrea", "udprovincial"], "title": "Copa Bonaerense"}];
// Excepciones de color (opcional). Los colores salen solos del PNG del escudo; si alguno sale mal, forzalo acá con { idDelClub: ['#principal','#secundario'] }.
const COLOR_OVERRIDES={};   // colores base de la camiseta de los clubes con diseño propio (ver KIT_STYLES en index.html)
['river','boca','racing','sanlorenzo','velez','newells','estudiantes','atletico','gimnasia','talleres','instituto','union','banfield','aldosivi','uy_penarol','uy_liverpool','uy_wanderers','uy_rampla'].forEach(id=>{const t=TM[id];if(t)COLOR_OVERRIDES[id]=[t.c1,t.c2]});
// Cargar planteles por datos (jugadores reales, nuevas ligas): loadSquads({ idClub: [ {p:'DEL',n:'L. Nombre',r:78,at:{rem:85}}, ... ] }). at es opcional y puede ser parcial.
const loadSquads=o=>{for(const id in o){REAL[id]=o[id];delete SQ[id];delete SN[id]}},mkPlayer=(p,r,n,key)=>withAt({p,n:n||'J. Prueba',r},key||n||'x');
// ===== Filosofías tácticas (solo partidas online; las elige cada usuario, no son etiquetas de los clubes) =====
// off: ajuste de atributos SOLO de esa línea mientras dura la partida (no se guarda en los jugadores); hay ventajas y costos.
// ev: ajustes de la jugada: atk = frecuencia de ataque propio, oppAtk = ataques que concede, lostDef/lostAtk = pérdida de pelota del rival cuando defiende / propia cuando ataca, foul = frecuencia de faltas, direct = juego directo, guard = conversión de los remates rivales (protección del área / espacios atrás).
const PHIL_OPTS=['rustica','lirica','ofensiva'];
const PHIL={
 rustica:{nombre:'Rústica',desc:'Física, defensiva y directa: potencia arquero y defensa, gana duelos y sacrifica creatividad y profundidad ofensiva.',off:{POR:{ref:3,par:5,man:3,sal:4,pie:-3},DEF:{mar:7,ant:6,fue:4,cab:3,pas:-2,ctl:-2},MED:{mar:5,ant:3,fue:2,pas:-3,ctl:-2},DEL:{rem:-2,des:-3,reg:-2}},ev:{atk:-.01,oppAtk:0,lostDef:.03,lostAtk:0,foul:1.15,direct:.3,guard:.97}},
 lirica:{nombre:'Lírica',desc:'Técnica y asociativa: mejora salida, pase, control y circulación, con menor agresividad defensiva.',off:{POR:{pie:5,pas:4,ctl:2},DEF:{pas:3,ctl:3,mar:-4,ant:-3},MED:{pas:5,ctl:5,reg:2,mar:-3,ant:-1},DEL:{pas:2,ctl:2,des:1}},ev:{atk:-.005,oppAtk:0,lostDef:0,lostAtk:-.008,foul:.92,direct:0,guard:1}},
 ofensiva:{nombre:'Ofensiva',desc:'Agresiva y vertical: potencia velocidad, desmarque y definición arriba, asumiendo riesgos defensivos.',off:{POR:{ref:-2,par:-2,pie:2},DEF:{mar:-4,ant:-5,des:2},MED:{des:4,reg:2,mar:-4},DEL:{rem:4,des:6,reg:3,vel:2,ace:2}},ev:{atk:.03,oppAtk:.02,lostDef:-.01,lostAtk:.01,foul:1,direct:0,guard:1.04}}};
const validPhil=x=>PHIL_OPTS.includes(x)?x:'equilibrada';
const phOff=(ph,line,a)=>{const o=PHIL[ph];return o&&o.off[line]?o.off[line][a]||0:0};
const phDelta=(ph,line)=>{const o=PHIL[ph],w=(PROFILES[line]||PROFILES.MED).w;let s=0;if(o&&o.off[line])for(const a in w)s+=w[a]*(o.off[line][a]||0);return s};
const phApply=(at,line,ph)=>{const o=PHIL[ph]&&PHIL[ph].off[line];if(!o)return at;const n={...at};for(const a in o)n[a]=clampA(n[a]+o[a]);return n};
// Fuerza efectiva en el modo normal: las diferencias reales entre jugadores se atenúan (K) alrededor de C al calcular el partido; los datos no se modifican.
const NORMAL={K:.5,C:62};
// Torneos barriales: región y formatos que ofrece cada competición (liga1/liga2 = todos contra todos, copa = eliminación directa).
const CUP_META={sur:{region:'Conurbano Sur',fmts:['liga1','liga2','copa']},oeste:{region:'Conurbano Oeste',fmts:['liga1','liga2','copa']},norte:{region:'Conurbano Norte',fmts:['liga1','liga2','copa']},caba:{region:'CABA',fmts:['liga1','liga2','copa']},cuyo:{region:'Cuyo',fmts:['liga1','liga2','copa']},litoral:{region:'Litoral',fmts:['liga1','liga2','copa']},noa:{region:'NOA',fmts:['liga1','liga2','copa']},patagonia:{region:'Patagonia',fmts:['liga1','liga2']},cordoba:{region:'Córdoba',fmts:['liga1','liga2']},bonaerense:{region:'Provincia de Buenos Aires',fmts:['liga1','liga2','copa']}};
// ---- Catálogo único de competiciones (Bloque 1). Lo usan salas privadas, partida aleatoria y salas públicas: una sola fuente de verdad.
// Mata-mata: solo llaves completas (4, 8, 16 o 32), sin byes. Partida aleatoria: 10 personas, solo competiciones con 10+ clubes y solo liga (mata-mata de 10 no cierra).
const KO_SIZES=[4,8,16,32],LIGA_SIZES=[4,6,8,10,12,16,20],CUSTOM_KO_SIZES=[4,8,16,32,64],CUSTOM_LIGA_SIZES=[4,6,8,10,12,14,16,18,20,22,24,26,28,30],RANDOM_N=10;
function catalog(){const out=[];
 DIVS.filter(d=>d.ok).forEach(d=>out.push({key:d.id,id:d.id,cat:'clasico',name:d.name,region:d.country,clubs:d.teams.length,fmts:['liga1','liga2','copa']}));
 CUPS.forEach(c=>{const m=CUP_META[c.id]||{};out.push({key:'cup:'+c.id,id:c.id,cat:'barrial',name:c.name,title:c.title,region:m.region||'',clubs:c.clubs.length,fmts:(m.fmts||['liga1','liga2']).slice()})});
 return out.map(e=>({...e,sizes:Object.fromEntries(e.fmts.map(f=>[f,f=='copa'?KO_SIZES.filter(n=>n<=e.clubs):[...new Set([...LIGA_SIZES.filter(n=>n<=e.clubs),...(e.cat=='barrial'?[e.clubs]:[])])]])),random:e.clubs>=RANDOM_N,randomFmts:e.clubs>=RANDOM_N?e.fmts.filter(f=>f!='copa'):[]}))}
const API={LEAGUES,KO_SIZES,LIGA_SIZES,CUSTOM_KO_SIZES,CUSTOM_LIGA_SIZES,RANDOM_N,catalog,CUP_META,NORMAL,PLAYER_SCALE,TEAM_TIERS,teamTier,PHIL,PHIL_OPTS,validPhil,phOff,phDelta,phApply,squadMode,BAL_T,xiQuality,ATTRS,PROFILES,roleOvr,loadSquads,mkPlayer,COLOR_OVERRIDES,CUPS,DIVS,TM,FM,FN,slots,autoXI,squad,setMix};if(typeof module!=='undefined')module.exports=API;else window.DATA=API;

})();
