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
velez|Vélez Sarsfield|#ffffff|#00529b|75
talleres|Talleres (C)|#0b2a5a|#ffffff|76
lanus|Lanús|#8a1538|#ffffff|74
rosario|Rosario Central|#1e4fa3|#f7c600|75
huracan|Huracán|#ffffff|#d1001f|73
belgrano|Belgrano|#6fb7e9|#ffffff|73
argentinos|Argentinos Juniors|#d1001f|#ffffff|72
defensa|Defensa y Justicia|#f4d000|#0a7d3b|71
newells|Newell's Old Boys|#d1001f|#111111|70
union|Unión (SF)|#d1001f|#ffffff|71
tigre|Tigre|#0b2a5a|#d1001f|70
platense|Platense|#6b3b1f|#ffffff|70
banfield|Banfield|#0a7d3b|#ffffff|69
gimnasia|Gimnasia (LP)|#0b2a5a|#ffffff|70
centralcba|Central Córdoba (SdE)|#111111|#f4d000|69
rivadavia|Independiente Rivadavia|#1e4fa3|#ffffff|71
instituto|Instituto|#d1001f|#ffffff|68
atletico|Atlético Tucumán|#7fb3e0|#ffffff|68
barracas|Barracas Central|#d1001f|#ffffff|67
riestra|Deportivo Riestra|#111111|#ffffff|66
sarmiento|Sarmiento (J)|#0a7d3b|#ffffff|66
aldosivi|Aldosivi|#f4d000|#0a7d3b|65
gimnasiamza|Gimnasia (Mendoza)|#0b3d91|#ffffff|66
estudiantesrc|Estudiantes (Río Cuarto)|#7fb3e0|#ffffff|64`,R2=`agropecuario|Agropecuario|#1a8a3c|#ffffff|56
allboys|All Boys|#f4f4f4|#111111|58
almirantebrown|Almirante Brown|#f4d000|#111111|55
almagro|Almagro|#1e4fa3|#ffffff|58
atlanta|Atlanta|#f4d000|#1e4fa3|60
centralnorte|Central Norte (Salta)|#111111|#ffffff|55
chaco|Chaco For Ever|#0a7d3b|#ffffff|56
chacarita|Chacarita Juniors|#d1001f|#111111|59
colegiales|Colegiales|#0a7d3b|#ffffff|56
colon|Colón|#d1001f|#111111|63
defensoresbelgrano|Defensores de Belgrano|#111111|#ffffff|55
madryn|Deportivo Madryn|#0b3d91|#ffffff|58
maipu|Deportivo Maipú|#d1001f|#ffffff|59
moron|Deportivo Morón|#ffffff|#d1001f|56
estudiantesba|Estudiantes (BA)|#d1001f|#ffffff|55
ferro|Ferro Carril Oeste|#0a7d3b|#ffffff|62
gimnasiajujuy|Gimnasia (Jujuy)|#ffffff|#0b2a5a|60
gimnasiatiro|Gimnasia y Tiro (Salta)|#ffffff|#0b2a5a|56
guemes|Güemes (SdE)|#111111|#ffffff|56
losandes|Los Andes|#d1001f|#ffffff|57
mitre|Mitre (SdE)|#f4d000|#111111|58
nuevachicago|Nueva Chicago|#0a7d3b|#111111|59
patronato|Patronato|#d1001f|#111111|59
quilmes|Quilmes|#ffffff|#0b2a5a|59
racingcba|Racing (Córdoba)|#7fb3e0|#ffffff|60
sanmartintuc|San Martín (Tucumán)|#d1001f|#ffffff|59
sanmiguel|San Miguel|#0b3d91|#ffffff|54
santelmo|San Telmo|#0b3d91|#ffffff|54
temperley|Temperley|#7fb3e0|#ffffff|57
tristansuarez|Tristán Suárez|#0b2a5a|#ffffff|57
midland|Midland|#0a7d3b|#111111|58
rafaela|Atlético Rafaela|#7fb3e0|#ffffff|58
godoycruz|Godoy Cruz|#0b3d91|#ffffff|64
sanmartinsj|San Martín (SJ)|#111111|#0a7d3b|61
ciudadbolivar|Ciudad de Bolívar|#ffffff|#d1001f|54
acassuso|Acassuso|#ffffff|#0b3d91|55`,R3=`argentinomerlo|Argentino (Merlo)|#d1001f|#111111|50
argentinoquilmes|Argentino (Quilmes)|#d1001f|#ffffff|47
arsenal|Arsenal (Sarandí)|#7fb3e0|#d1001f|53
brownadrogue|Brown (Adrogué)|#ffffff|#111111|52
liniers|Liniers|#0b3d91|#ffffff|47
comunicaciones|Comunicaciones|#0b2a5a|#d1001f|50
defensoresunidos|Defensores Unidos|#0a7d3b|#111111|50
armenio|Deportivo Armenio|#d1001f|#0b2a5a|47
camioneros|Camioneros|#0b3d91|#ffffff|46
laferrere|Laferrere|#0a7d3b|#ffffff|48
deportivomerlo|Deportivo Merlo|#d1001f|#ffffff|48
docksud|Dock Sud|#d1001f|#0b2a5a|47
excursionistas|Excursionistas|#0b2a5a|#ffffff|49
flandria|Flandria|#f4d000|#0b2a5a|50
ituzaingo|Ituzaingó|#d1001f|#ffffff|47
realpilar|Real Pilar|#0b3d91|#ffffff|48
sanmartinburzaco|San Martín (Burzaco)|#d1001f|#111111|47
sportivoitaliano|Sportivo Italiano|#0b3d91|#d1001f|50
talleresre|Talleres (RE)|#0b2a5a|#ffffff|50
uai|UAI Urquiza|#0b2a5a|#f4d000|50
villadalmine|Villa Dálmine|#6a2c91|#ffffff|51
villasancarlos|Villa San Carlos|#0b3d91|#ffffff|48`,R4=`alem|Leandro N. Alem|#d1001f|#ffffff|42
mercedes|Mercedes|#f4d000|#111111|42
juventudunida|Juventud Unida|#0b3d91|#ffffff|41
estrelladelsur|Estrella del Sur|#d1001f|#ffffff|40
argentinorosario|Argentino (Rosario)|#0b2a5a|#ffffff|43
victorianoarenas|Victoriano Arenas|#d1001f|#ffffff|40
sacachispas|Sacachispas|#d1001f|#ffffff|44
berazategui|Berazategui|#0a7d3b|#ffffff|44
paraguayo|Deportivo Paraguayo|#d1001f|#0b3d91|39
jjurquiza|Justo José de Urquiza|#d1001f|#111111|40
cambaceres|Defensores de Cambaceres|#0a7d3b|#ffffff|42
puertonuevo|Puerto Nuevo|#0b3d91|#ffffff|41
lugano|Lugano|#d1001f|#ffffff|42
centroespanol|Centro Español|#d1001f|#f4d000|41
atlas|Atlas|#d1001f|#ffffff|40
canuelas|Cañuelas|#f4d000|#111111|41
centralballester|Central Ballester|#0b3d91|#ffffff|40
centralcordobarosario|Central Córdoba (Rosario)|#111111|#ffffff|43
claypole|Claypole|#0b2a5a|#ffffff|41
espanol|Deportivo Español|#d1001f|#f4d000|41
muniz|Muñiz|#0a7d3b|#ffffff|39
porvenir|El Porvenir|#111111|#ffffff|41
fenix|Fénix|#d1001f|#111111|42
lamadrid|General Lamadrid|#0b2a5a|#ffffff|41
leones|Leones de Rosario|#111111|#d1001f|43
lujan|Luján|#0b3d91|#ffffff|40
sportivobarracas|Sportivo Barracas|#0b2a5a|#ffffff|41
yupanqui|Yupanqui|#0b3d91|#ffffff|40`;
const DIVS=[{id:'ar1',country:'Argentina',name:'Primera División',ok:true,teams:mk(R1)},{id:'ar2',country:'Argentina',name:'Primera Nacional',ok:true,teams:mk(R2)},
{id:'ar3',country:'Argentina',name:'Primera B Metropolitana',ok:true,teams:mk(R3)},{id:'ar4',country:'Argentina',name:'Primera C',ok:true,teams:mk(R4)}];
const teams=DIVS.flatMap(x=>x.teams);
const TM={};teams.forEach(t=>TM[t.id]=t);
const FM=[[4,4,2],[4,3,3],[3,5,2],[4,5,1],[5,3,2]];
const FN=FM.map(f=>f.join('-'));
const slots=f=>{const[d,m,a]=FM[f];return['POR',...Array(d).fill('DEF'),...Array(m).fill('MED'),...Array(a).fill('DEL')]};
function autoXI(sq,f,ban){const u=new Set(),ok=i=>!u.has(i)&&!(ban&&ban.has(i));return slots(f).map(p=>{let b=-1;sq.forEach((x,i)=>{if(ok(i)&&x.p==p&&(b<0||x.r>sq[b].r))b=i});if(b<0)sq.forEach((x,i)=>{if(ok(i)&&(b<0||x.r>sq[b].r))b=i});u.add(b);return b})}
const rng=s=>{s>>>=0;return()=>{s=s+0x6D2B79F5>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
const hs=x=>{let h=2166136261;for(const c of x)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const AP=['Acosta','Aguirre','Álvarez','Barrios','Benítez','Blanco','Bustos','Cabrera','Castro','Chávez','Correa','Cuello','Díaz','Domínguez','Escobar','Fernández','Figueroa','Flores','Giménez','Godoy','Gómez','González','Herrera','Ibarra','Juárez','Ledesma','López','Luna','Maldonado','Martínez','Medina','Molina','Montenegro','Moreno','Navarro','Núñez','Ojeda','Ortiz','Páez','Peralta','Pereyra','Pérez','Quiroga','Ramírez','Rey','Ríos','Rivero','Rodríguez','Rojas','Romero','Ruiz','Salas','Sánchez','Silva','Sosa','Suárez','Torres','Vega','Villalba','Vera'];
const POS=['POR','POR','DEF','DEF','DEF','DEF','DEF','DEF','MED','MED','MED','MED','MED','MED','DEL','DEL','DEL','DEL'];
const SQ={};let REAL={};try{REAL=require('./squads.json')}catch(e){REAL=(typeof window!=='undefined'&&window.SQUADS)||{}}
const squad=id=>SQ[id]||(SQ[id]=REAL[id]||(()=>{const t=TM[id],r=rng(hs('sq'+id));return POS.map(p=>({p,n:String.fromCharCode(65+Math.floor(r()*26))+'. '+AP[Math.floor(r()*AP.length)],r:Math.round(t.r-10+r()*16)}))})());
const API={DIVS,TM,FM,FN,slots,autoXI,squad};if(typeof module!=='undefined')module.exports=API;else window.DATA=API;

})();
