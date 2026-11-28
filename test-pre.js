const E=require('./public/engine.js');let ok=true;const T=(c,m)=>{console.log((c?'OK  ':'FAIL ')+m);if(!c)ok=false};
// Flujo actual: realNew no calcula la pretemporada de las otras divisiones (se difiere para no bloquear la interfaz);
// la calcula el cierre de cada temporada para la siguiente. Se prueba la «pre» que deja el primer cierre.
// Tabla simulada de mi categoría (sala ficticia), con el club propio primero para que siga en Primera.
const cerrar=(car,club)=>{const me=car.cats[car.me.cat],Zm=car.zones[me.div],ids=[club,...Zm.flat().filter(x=>x!=club)],table=ids.map((id,k)=>({id,pj:30,g:30-k,e:0,p:k,gf:50-k,ga:k,pts:90-k}));
 const seg={};table.forEach(q=>seg[q.id]={pj:15,g:q.g/2|0,e:0,p:0,gf:q.gf/2|0,ga:q.ga/2|0,pts:q.pts/2|0});return E.careerClose(car,table,[seg])};
const car0=E.realNew({me:{club:'boca'}});T(!car0.pre,'al elegir club no se calcula la pretemporada (se difiere al cierre)');
const r0=cerrar(car0,'boca');T(!r0.error,'el primer cierre funciona sin pre (cálculo de respaldo) '+(r0.error||''));
const car=r0.car,mc=car.me.cat;
T(mc==0&&car.pre&&!car.pre[mc]&&Object.keys(car.pre).length==5,'el cierre deja pre para las 5 demás divisiones');
const i=1,c=car.cats[i],Z=car.zones[c.div];const fin=Z.map((z,j)=>E.preTab(car.pre[i].z[j],z).map(q=>q.id));
T(Z.every((z,j)=>E.preTab(car.pre[i].z[j],z,5).reduce((s,q)=>s+q.pj,0)==z.length*5),'fecha 5: cada club jugó 5');
T(fin.every((f,j)=>f.length==Z[j].length),'tabla final completa');
const r=cerrar(car,'boca');T(!r.error,'cierra '+(r.error||''));
if(!r.error){const nx=r.car;T(nx.pre&&!nx.pre[nx.me.cat],'la temporada siguiente trae su pre');
 const f2=r.summary.cats[i].po&&r.summary.cats[i].po.final;T(f2&&fin[0][0]==f2.a&&fin[1][0]==f2.b,'la final usa los líderes de la tabla guardada')}

const pc=E.careerNew({k:4,n:6,ud:1,fmt:'liga2',me:{club:'boca',cat:0}});
T(pc.pre&&Object.keys(pc.pre).join()=='1,2,3','personalizado trae pre de las otras categorías');
const tb=pc.cats[0].teams.map((id,i)=>({id,pj:10,g:5,e:0,p:0,gf:9-i,ga:i,pts:20-i}));const r2=E.careerClose(pc,tb);
T(!r2.error&&r2.car.pre&&Object.keys(r2.car.pre).length==3,'cierre personalizado ok y regenera pre');
process.exit(ok?0:1)
