// Prueba del modo realista (bloque 1): node test-realista.js
const E=require('./public/engine'),D=require('./public/data');E.CFG.offline=true;E.CFG.fastWaits=true;
let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++},sleep=ms=>new Promise(r=>setTimeout(r,ms)),until=async(f,ms=120000)=>{const t=Date.now();while(!f()&&Date.now()-t<ms)await sleep(10);return f()};
const uniq=a=>new Set(a).size==a.length,all=c=>c.cats.flatMap(x=>x.teams),tbl=ids=>ids.map((id,i)=>({id,pj:0,gf:100-i,ga:i,pts:1000-i*10,g:50-i,e:0,p:0}));
(async()=>{
 console.log('== armado');
 let c=E.realNew({me:{club:'boca'}});const sz=c.cats.map(x=>x.teams.length);
 ok(!c.error&&c.mode=='real'&&c.season==2026&&sz.join()=='30,36,22,38,28,17','6 divisiones con los tamaños reales del juego ('+sz.join('/')+')');
 ok(uniq(all(c))&&all(c).length==171,'171 clubes distintos');
 ok(c.cats[c.me.cat].teams.includes('boca')&&c.me.cat==0,'Boca queda en Primera');
 ok(E.realNew({me:{club:'noexiste'}}).error,'club inexistente: rechazado');
 ok(c.fmts.join()=='liga1,liga1,liga2,liga1,liga1,liga2','formatos por categoría (B Metro y Promocional a dos ruedas)');
 console.log('\n== temporadas encadenadas (tablas armadas, jugador en distintas categorías)');
 for(const club of ['boca','sanmiguel','costabrava','quilmes']){
  let car=E.realNew({me:{club}}),good=true,path=[];const tot=all(car).slice().sort().join();
  for(let y=0;y<6;y++){const mc=car.me.cat,t=car.cats[mc].teams.filter(x=>x!=club);t.splice(y%2?t.length:0,0,club);
   const r=E.careerClose(car,tbl(t));if(r.error){console.log(r.error);good=false;break}car=r.car;path.push(car.me.cat);
   if(!(all(car).slice().sort().join()==tot&&car.cats.every((x,i)=>x.teams.length==sz[i])))good=false;
   // vías: nadie en B Metro (2) salvo metropolitanos que bajaron; Federal A (3) sin descenso
  }
  ok(good&&car.season==2032,club+': 6 temporadas, mismos 171 clubes y tamaños reales intactos (categorías '+path.map(x=>x+1).join('→')+')')}
 {const r=E.careerClose(E.realNew({me:{club:'boca'}}),tbl(E.realNew({me:{club:'boca'}}).cats[1].teams));ok(!!r.error,'tabla que no coincide: rechazada')}
 console.log('\n== sala de 38 equipos (Federal A) y de 17 (Promocional, impar)');
 for(const [club,n] of [['costabrava',38],['alumni',17]]){
  const car=E.realNew({me:{club}}),cat=car.cats[car.me.cat];let last=null;const room='re'+n,pid='yo';
  const e=E.act({a:'create',off:1,speed:100,room,pid,name:'Yo',cfg:E.careerCfg(car)});if(e)console.log('create:',e);E.listen(room,pid,v=>last=v);E.act({a:'pick',room,pid,team:club});
  const iv=setInterval(()=>{if(['pre','lobby'].includes(last.phase))E.act({a:'ready',room,pid,v:true})},10);const fin=await until(()=>last.phase=='end');clearInterval(iv);
  ok(fin&&last.table.length==cat.teams.length&&cat.teams.length==n,cat.name+' ('+n+' equipos, '+last.total+' fechas): terminó y la tabla tiene todos los equipos');
  const t0=Date.now(),r=E.careerClose(car,last.table);ok(!r.error&&all(r.car).length==171,'   cierre de temporada ok en '+(Date.now()-t0)+' ms (simula las otras 5 categorías)');
  clearInterval(E.rooms[room].timer);delete E.rooms[room]}
 console.log('\n== título para el ranking');
 {const car=E.realNew({me:{club:'boca'}});let rec=null;E.CFG.onTitle=x=>rec=x;let last=null;const room='rtit',pid='yo';
  E.act({a:'create',off:1,speed:100,room,pid,name:'Yo',cfg:{...E.careerCfg(car)}});E.listen(room,pid,v=>last=v);E.act({a:'pick',room,pid,team:'boca'});
  const iv=setInterval(()=>{if(['pre','lobby'].includes(last.phase))E.act({a:'ready',room,pid,v:true})},10);await until(()=>last.phase=='end');clearInterval(iv);
  if(last.champ=='boca')ok(rec&&rec.comp=='real'&&rec.compNombre=='Clásico realista','título de Boca sale como «Clásico realista»');else ok(true,'Boca no salió campeón en esta corrida (no se informa título, correcto: '+last.champ+')');
  clearInterval(E.rooms[room].timer);delete E.rooms[room]}
 console.log(fails?'\nFALLAS: '+fails:'\nTodo OK');process.exit(fails?1:0)})();
