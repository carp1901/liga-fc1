(function(){
// Equipos 2026 (Argentina). Formato: id|nombre|color1|color2|nivel(1-100). Los colores y niveles son aproximados.
// Planteles: se generan con nombres argentinos verosímiles; para datos reales usá tools/import-squads.js (ver README).
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
sanmartinburzaco|San Martín (B)|#d1001f|#111111|47
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
estudiantessl|Estudiantes (SL)|#d1001f|#ffffff|50`;
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
const DIVS=[{id:'ar1',country:'Argentina',name:'Primera División',ok:true,teams:mk(R1)},{id:'ar2',country:'Argentina',name:'Primera Nacional',ok:true,teams:mk(R2)},
{id:'ar5',country:'Argentina',name:'Federal A',ok:true,teams:mk(R5)},
{id:'ar3',country:'Argentina',name:'Primera B Metropolitana',ok:true,teams:mk(R3)},{id:'ar4',country:'Argentina',name:'Primera C',ok:true,teams:mk(R4)},
{id:'ar6',country:'Argentina',name:'Promocional Amateur',ok:true,teams:mk(R6)}];
const teams=DIVS.flatMap(x=>x.teams);
const TM={};teams.forEach(t=>TM[t.id]=t);
const FM=[[4,4,2],[4,3,3],[3,5,2],[4,5,1],[5,3,2],[4,5,1],[4,4,2],[3,4,3],[5,4,1],[4,4,2],[4,5,1],[4,5,1],[3,6,1],[5,2,3]];
const FN=['4-4-2','4-3-3','3-5-2','4-5-1','5-3-2','4-2-3-1','4-2-2-2','3-4-3','5-4-1','4-3-1-2','4-1-4-1','4-4-1-1','3-4-2-1','5-2-3'];
const slots=f=>{const[d,m,a]=FM[f];return['POR',...Array(d).fill('DEF'),...Array(m).fill('MED'),...Array(a).fill('DEL')]};
function autoXI(sq,f,ban){const sl=slots(f),pool=sq.map((_,i)=>i).filter(i=>!(ban&&ban.has(i))),eff=(i,p)=>roleOvr(sq[i],p)*(sq[i].p==p?1:(p=='POR'||sq[i].p=='POR')?.3:.8),xi=[],u=new Set();   // eficacia = media (menos si juega fuera de puesto)
 sl.forEach(p=>{let b=-1,bv=-1;pool.forEach(i=>{if(u.has(i))return;const v=eff(i,p);if(v>bv){bv=v;b=i}});u.add(b);xi.push(b)});
 let imp=true,g=0;while(imp&&g++<60){imp=false;for(let a=0;a<sl.length;a++)for(const i of pool){const b=xi.indexOf(i);if(b<0){if(eff(i,sl[a])>eff(xi[a],sl[a])+1e-9){xi[a]=i;imp=true}}else if(b>a&&eff(xi[a],sl[a])+eff(xi[b],sl[b])<eff(xi[b],sl[a])+eff(xi[a],sl[b])-1e-9){[xi[a],xi[b]]=[xi[b],xi[a]];imp=true}}}   // mejora hasta que no se pueda sumar más
 return xi}
const rng=s=>{s>>>=0;return()=>{s=s+0x6D2B79F5>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
const hs=x=>{let h=2166136261;for(const c of x)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const AP=['Acosta','Aguirre','Álvarez','Barrios','Benítez','Blanco','Bustos','Cabrera','Castro','Chávez','Correa','Cuello','Díaz','Domínguez','Escobar','Fernández','Figueroa','Flores','Giménez','Godoy','Gómez','González','Herrera','Ibarra','Juárez','Ledesma','López','Luna','Maldonado','Martínez','Medina','Molina','Montenegro','Moreno','Navarro','Núñez','Ojeda','Ortiz','Páez','Peralta','Pereyra','Pérez','Quiroga','Ramírez','Rey','Ríos','Rivero','Rodríguez','Rojas','Romero','Ruiz','Salas','Sánchez','Silva','Sosa','Suárez','Torres','Vega','Villalba','Vera'];
const POS=['POR','POR','DEF','DEF','DEF','DEF','DEF','DEF','MED','MED','MED','MED','MED','MED','DEL','DEL','DEL','DEL'];
// ===== Atributos de los jugadores (datos + modelo) =====
// Cada jugador tiene 8 atributos (15-99) que usa el motor en las acciones del partido; la media `r` queda como resumen del puesto.
// pas: pase y visión · ctl: control y conducción · reg: regate · rem: definición · des: desmarque y movimiento
// mar: marcaje y recuperación · ant: anticipación e intercepción · ref: reflejos y juego del arquero
// PROFILES (datos, sin excepciones por nombre): `off` = sesgo de cada atributo respecto de la media según el puesto; `w` = peso de cada atributo en la media de ese puesto.
const ATTRS=['pas','ctl','reg','rem','des','mar','ant','ref'];
const PROFILES={
 POR:{off:{ref:10,pas:-14,ctl:-12,reg:-30,rem:-38,des:-32,mar:-20,ant:2},w:{ref:.7,ant:.15,pas:.1,ctl:.05}},
 DEF:{off:{mar:8,ant:7,pas:-3,ctl:-6,reg:-14,rem:-20,des:-10,ref:-45},w:{mar:.35,ant:.3,pas:.12,ctl:.1,reg:.05,des:.04,rem:.04}},
 MED:{off:{pas:7,ctl:6,reg:3,rem:-5,des:1,mar:-1,ant:3,ref:-45},w:{pas:.28,ctl:.22,reg:.12,mar:.1,ant:.1,des:.1,rem:.08}},
 DEL:{off:{rem:9,des:8,reg:4,ctl:2,pas:-5,mar:-20,ant:-10,ref:-45},w:{rem:.32,des:.25,reg:.15,ctl:.12,pas:.08,ant:.04,mar:.04}}};
const clampA=v=>Math.max(15,Math.min(99,Math.round(v)));
// media de un jugador en un puesto: promedio ponderado de sus atributos relevantes para ese puesto
const roleOvr=(x,pos)=>{const w=(PROFILES[pos]||PROFILES.MED).w;let s=0;for(const a in w)s+=w[a]*(x.at?x.at[a]:x.r);return s};
function mkAt(p,r,rr){const P=PROFILES[p]||PROFILES.MED,at={};ATTRS.forEach(a=>at[a]=r+(P.off[a]||0)+(rr()-.5)*12);
 for(let k=0;k<3;k++){let s=0;for(const a in P.w)s+=P.w[a]*at[a];const dl=r-s;ATTRS.forEach(a=>at[a]=Math.max(15,Math.min(99,at[a]+dl)))}   // se recentra para que la media del puesto coincida con r
 ATTRS.forEach(a=>at[a]=clampA(at[a]));return at}
// completa un jugador: si trae los 8 atributos se respetan (y si falta la media se calcula); si trae algunos, el resto se deriva; si no trae ninguno, se deriva todo de p y r
const withAt=(x,key)=>{if(x.at&&ATTRS.every(a=>typeof x.at[a]=='number'))return x.r!=null?x:{...x,r:Math.round(roleOvr(x,x.p))};
 const r0=x.r!=null?x.r:60,gen=mkAt(x.p,r0,rng(hs('at|'+key+'|'+x.n+'|'+x.p)));return{...x,r:r0,at:{...gen,...(x.at||{})}}};
const SQ={};let REAL={};try{REAL=require('./squads.json')}catch(e){REAL=(typeof window!=='undefined'&&window.SQUADS)||{}}
const rawSquad=id=>SQ[id]||(SQ[id]=(REAL[id]||(()=>{const t=TM[id],r=rng(hs('sq'+id));return POS.map(p=>({p,n:String.fromCharCode(65+Math.floor(r()*26))+'. '+AP[Math.floor(r()*AP.length)],r:Math.round(t.r-10+r()*16)}))})()).map((x,i)=>withAt(x,id+'|'+i)));
let MIX=false;const setMix=b=>{MIX=!!b};
// modo "Todas las divisiones": cada plantel se lleva a una media común, así la diferencia la hace la táctica
const SN={};const squadN=id=>SN[id]||(SN[id]=(()=>{const s=rawSquad(id),avg=s.reduce((a,x)=>a+x.r,0)/s.length;return s.map(x=>{const nr=Math.max(40,Math.min(85,Math.round(x.r-avg+64))),dl=nr-x.r;return{...x,r:nr,at:Object.fromEntries(ATTRS.map(a=>[a,clampA(x.at[a]+dl)]))}})})());
const squad=id=>MIX?squadN(id):rawSquad(id);
// Torneos barriales/regionales (fantasía, no oficiales). IDs resueltos contra los clubes existentes; los del Promocional Amateur usan sus IDs actuales (fcezeiza, defglew, metalurgico, atpilar, hacoaj, controlorientado, belgranozarate, barrancas, bacity, everton, alumni, estrellaberisso, mandarinas, udprovincial, etc.).
const CUPS=[{"id": "sur", "name": "Capo del Sur", "clubs": ["racing", "independiente", "lanus", "banfield", "defensa", "losandes", "quilmes", "santelmo", "temperley", "tristansuarez", "arsenal", "argentinoquilmes", "brownadrogue", "docksud", "sanmartinburzaco", "talleresre", "camioneros", "estrelladelsur", "victorianoarenas", "berazategui", "canuelas", "claypole", "porvenir", "fcezeiza", "defglew", "juventudbernal"], "title": "Copa «Capo del Sur»"}, {"id": "oeste", "name": "Capo del Oeste", "clubs": ["almirantebrown", "almagro", "moron", "estudiantesba", "sanmiguel", "midland", "argentinomerlo", "liniers", "laferrere", "deportivomerlo", "ituzaingo", "sportivoitaliano", "uai", "alem", "mercedes", "juventudunida", "lugano", "centroespanol", "atlas", "jjurquiza", "flandria", "lujan", "muniz", "yupanqui", "paraguayo", "sat", "metalurgico"], "title": "Copa «Capo del Oeste»"}, {"id": "norte", "name": "Capo del Norte", "clubs": ["tigre", "platense", "chacarita", "colegiales", "acassuso", "defensoresunidos", "armenio", "realpilar", "villadalmine", "centralballester", "puertonuevo", "escobar", "atpilar", "hacoaj", "controlorientado", "belgranozarate"], "title": "Copa «Capo del Norte»"}, {"id": "caba", "name": "Capo de CABA", "clubs": ["boca", "river", "sanlorenzo", "velez", "argentinos", "huracan", "barracas", "riestra", "allboys", "atlanta", "defensoresbelgrano", "nuevachicago", "ferro", "comunicaciones", "excursionistas", "espanol", "lamadrid", "sacachispas", "sportivobarracas", "fenix", "barrancas", "bacity"], "title": "Copa «Capo de CABA»"}, {"id": "cuyo", "name": "Copa de Cuyo", "clubs": ["rivadavia", "gimnasiamza", "godoycruz", "maipu", "sanmartinsj", "atsanmartinmza", "fadep", "huracanlh", "juventudsl", "estudiantessl"], "title": "Copa de Cuyo"}, {"id": "litoral", "name": "Copa del Litoral", "clubs": ["newells", "rosario", "union", "colon", "rafaela", "patronato", "chaco", "argentinorosario", "centralcordobarosario", "leones", "nuevejulio", "bmitre", "bocaunidos", "soldeamerica", "sanmartinformosa", "sarmientores", "gimcdu", "lasparejas", "vilelas"], "title": "Copa del Litoral"}, {"id": "noa", "name": "Copa del Noroeste Argentino (NOA)", "clubs": ["atletico", "centralcba", "centralnorte", "gimnasiajujuy", "gimnasiatiro", "guemes", "mitre", "sanmartintuc", "tucumancentral", "antoniana", "sarmientolb"], "title": "Copa del Noroeste Argentino (NOA)"}, {"id": "patagonia", "name": "Copa de la Patagonia", "clubs": ["madryn", "cipolletti", "rincon", "soldemayo", "costabrava", "germinal", "gbrown"], "title": "Copa de la Patagonia"}, {"id": "cordoba", "name": "Copa Córdoba", "clubs": ["talleres", "belgrano", "instituto", "racingcba", "estudiantesrc", "atenas", "sportivobelgrano", "argmontemaiz"], "title": "Copa Córdoba"}, {"id": "bonaerense", "name": "Copa Bonaerense", "clubs": ["estudiantes", "gimnasia", "aldosivi", "sarmiento", "agropecuario", "ciudadbolivar", "villasancarlos", "cambaceres", "alvarado", "circulo", "santamarina", "douglashaig", "gimchivilcoy", "indchivilcoy", "linqueno", "defbelgranovr", "olimpo", "everton", "alumni", "estrellaberisso", "mandarinas", "uribelarrea", "udprovincial"], "title": "Copa Bonaerense"}];
// Excepciones de color (opcional). Los colores salen solos del PNG del escudo; si alguno sale mal, forzalo acá con { idDelClub: ['#principal','#secundario'] }.
const COLOR_OVERRIDES={};
// Cargar planteles por datos (jugadores reales, nuevas ligas): loadSquads({ idClub: [ {p:'DEL',n:'L. Nombre',r:78,at:{rem:85}}, ... ] }). at es opcional y puede ser parcial.
const loadSquads=o=>{for(const id in o){REAL[id]=o[id];delete SQ[id];delete SN[id]}},mkPlayer=(p,r,n,key)=>withAt({p,n:n||'J. Prueba',r},key||n||'x');
const API={ATTRS,PROFILES,roleOvr,loadSquads,mkPlayer,COLOR_OVERRIDES,CUPS,DIVS,TM,FM,FN,slots,autoXI,squad,setMix};if(typeof module!=='undefined')module.exports=API;else window.DATA=API;

})();
