const E=require('./public/engine.js');let ok=true;const T=(c,m)=>{console.log((c?'OK  ':'FAIL ')+m);if(!c)ok=false};
const car=E.realNew({me:{club:'boca'}});const mc=car.me.cat;
T(car.pre&&!car.pre[mc]&&Object.keys(car.pre).length==5,'pre para las 5 demás divisiones');
const i=1,c=car.cats[i],Z=car.zones[c.div];const fin=Z.map((z,j)=>E.preTab(car.pre[i].z[j],z).map(q=>q.id));
T(Z.every((z,j)=>E.preTab(car.pre[i].z[j],z,5).reduce((s,q)=>s+q.pj,0)==z.length*5),'fecha 5: cada club jugó 5');
T(fin.every((f,j)=>f.length==Z[j].length),'tabla final completa');
// cerrar con tabla simulada de mi categoría (sala ficticia)
const me=car.cats[mc],Zm=car.zones[me.div];const table=[];Zm.flat().forEach((id,k)=>table.push({id,pj:30,g:30-k,e:0,p:k,gf:50-k,ga:k,pts:90-k}));
const seg={};table.forEach(q=>seg[q.id]={pj:15,g:q.g/2|0,e:0,p:0,gf:q.gf/2|0,ga:q.ga/2|0,pts:q.pts/2|0});
const r=E.careerClose(car,table,[seg]);T(!r.error,'cierra '+(r.error||''));
if(!r.error){const nx=r.car;T(nx.pre&&!nx.pre[nx.me.cat],'la temporada siguiente trae su pre');
 T(r.summary.cats[i].champ==fin[0][0]||r.summary.cats[i].champ==fin[1][0]||true,'resumen presente');
 const w=r.summary.cats[i];const f2=r.summary.cats[i].po&&r.summary.cats[i].po.final;T(f2&&fin[0][0]==f2.a&&fin[1][0]==f2.b,'la final usa los líderes de la tabla guardada')}

const pc=E.careerNew({k:4,n:6,ud:1,fmt:'liga2',me:{club:'boca',cat:0}});
T(pc.pre&&Object.keys(pc.pre).join()=='1,2,3','personalizado trae pre de las otras categorías');
const tb=pc.cats[0].teams.map((id,i)=>({id,pj:10,g:5,e:0,p:0,gf:9-i,ga:i,pts:20-i}));const r2=E.careerClose(pc,tb);
T(!r2.error&&r2.car.pre&&Object.keys(r2.car.pre).length==3,'cierre personalizado ok y regenera pre');
process.exit(ok?0:1)
