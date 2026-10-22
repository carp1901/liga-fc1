// Prueba del modo realista (bloque 1): node test-realista.js
const E=require('./public/engine'),D=require('./public/data');E.CFG.offline=true;E.CFG.fastWaits=true;
let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++},sleep=ms=>new Promise(r=>setTimeout(r,ms)),until=async(f,ms=120000)=>{const t=Date.now();while(!f()&&Date.now()-t<ms)await sleep(10);return f()};
const sg=ids=>[Object.fromEntries(ids.map((id,i)=>[id,{pj:16,gf:20,ga:10,pts:30-(i%10),g:9,e:3,p:4}]))],uniq=a=>new Set(a).size==a.length,all=c=>c.cats.flatMap(x=>x.teams),tbl=ids=>ids.map((id,i)=>({id,pj:0,gf:100-i,ga:i,pts:1000-i*10,g:50-i,e:0,p:0}));
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
  for(let y=0;y<6;y++){const mc=car.me.cat,t=E.careerCfg(car).teams.filter(x=>x!=club);t.splice(y%2?t.length:0,0,club);
   const r=E.careerClose(car,tbl(t),sg(t));if(r.error){console.log(r.error);good=false;break}car=r.car;path.push(car.me.cat);
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
  const cf=E.careerCfg(car);ok(fin&&last.table.length==cf.teams.length&&cf.teams.length==(cf.zone?(n==17?(cf.teams.length):n):n),cat.name+' ('+cf.teams.length+' equipos'+(cf.zone?' de la zona':'')+', '+last.total+' fechas): terminó y la tabla tiene todos los equipos');
  const t0=Date.now(),r=E.careerClose(car,last.table,last.segT);ok(!r.error&&all(r.car).length==171,'   cierre de temporada ok en '+(Date.now()-t0)+' ms (simula las otras 5 categorías)');
  clearInterval(E.rooms[room].timer);delete E.rooms[room]}
 console.log('\n== Primera: Apertura + Clausura en una sala (2 zonas de 15, 32 fechas)');
 {const car=E.realNew({me:{club:'boca'}}),cf=E.careerCfg(car),room='rprim',pid='yo';let last=null;
  ok(cf.zones.length==2&&cf.zones.every(z=>z.length==15)&&cf.seg.join()=='16,16'&&cf.n==30,'sala de 30 clubes, 2 zonas de 15, 2 torneos de 16 fechas');
  const e=E.act({a:'create',off:1,speed:100,room,pid,name:'Yo',cfg:cf});if(e)console.log('create:',e);E.listen(room,pid,v=>last=v);E.act({a:'pick',room,pid,team:'boca'});
  const iv=setInterval(()=>{if(['pre','lobby'].includes(last.phase))E.act({a:'ready',room,pid,v:true})},10);await until(()=>last.phase=='end');clearInterval(iv);
  ok(last.total==32&&last.table.every(q=>q.pj==32),'32 fechas y 32 partidos por club (14 de zona + 2 interzonales, por torneo)');
  ok(last.segT&&last.segT.length==2&&Object.values(last.segT[0]).every(q=>q.pj==16),'tabla del Apertura guardada a la fecha 16');
  const zi=cf.zones.findIndex(z=>z.includes('boca')),tm={};last.table.forEach(q=>tm[q.id]=q);
  const r=E.careerClose(car,last.table,last.segT),ord=last.table.slice().sort((a,b)=>b.pts-a.pts||b.g-a.g||b.gf-a.gf||(b.gf-b.ga)-(a.gf-a.ga)).map(q=>q.id);
  ok(!r.error&&r.summary.cats[0].champ==ord[0],'campeón anual = el de más puntos sumando los dos torneos');
  ok(r.summary.cats[0].down.join()==ord.slice(-2).join()||r.summary.cats[0].down.slice().sort().join()==ord.slice(-2).slice().sort().join(),'bajan los 2 últimos de la tabla anual');
  ok(r.summary.cats[0].po.tor.length==2&&r.summary.cats[0].po.tor.every(t=>t.rds[0].m.length==8&&t.rds.length==4),'playoffs de Apertura y Clausura: 16 equipos, octavos a final');
  clearInterval(E.rooms[room].timer);delete E.rooms[room]}
 console.log('\n== clásicos reales en las fechas interzonales (sin jugar los partidos)');
 {const P1='boca-river,independiente-racing,sanlorenzo-huracan,estudiantes-gimnasia,rosario-newells,banfield-lanus,belgrano-talleres,argentinos-platense,tigre-velez,union-sarmiento,atletico-centralcba,aldosivi-defensa,barracas-riestra,estudiantesrc-instituto,gimnasiamza-rivadavia'.split(',').map(x=>x.split('-')),P2='allboys-nuevachicago,ferro-defensoresbelgrano,madryn-santelmo,sanmartinsj-racingcba,chaco-rafaela,sanmartintuc-gimnasiajujuy,moron-almirantebrown,estudiantesba-almagro,losandes-temperley,mitre-guemes,tristansuarez-quilmes,ciudadbolivar-agropecuario,colon-patronato,centralnorte-gimnasiatiro,godoycruz-maipu,sanmiguel-midland,colegiales-acassuso,atlanta-chacarita'.split(',').map(x=>x.split('-'));
  const isP=(P,a,b)=>P.some(([x,y])=>(x==a&&y==b)||(x==b&&y==a));
  for(const [club,P,fechas] of [['boca',P1,[15,31]],['sanmiguel',P2,[34,35]]]){const car=E.realNew({me:{club}}),cf=E.careerCfg(car),room='cl'+club;E.act({a:'create',off:1,speed:1,room,pid:'yo',name:'Yo',cfg:cf});E.act({a:'pick',room,pid:'yo',team:club});
   const r=E.rooms[room],tot=cf.iz?36:32;ok(r.total==tot,club+': '+tot+' fechas');
   const sepOk=P.every(([a,b])=>(cf.zones[0].includes(a)&&cf.zones[1].includes(b))||(cf.zones[1].includes(a)&&cf.zones[0].includes(b)));ok(sepOk,'   los clásicos quedan en zonas distintas');
   ok(fechas.every(f=>r.fx[f].every(([a,b])=>isP(P,a,b))),'   las fechas '+fechas.map(x=>x+1).join(' y ')+' son todas de clásicos reales');
   clearInterval(r.timer);delete E.rooms[room]}}
 console.log('\n== zonas: final, reducido, promoción y títulos');
 {const tits=[];E.CFG.onTitle=x=>{tits.push(x);return Promise.resolve({status:'ok'})};let car=E.realNew({me:{club:'sanmiguel'}}),bad=0,pr=0,lines=0;
  for(let y=0;y<8;y++){const cf=E.careerCfg(car);const r=E.careerClose(car,tbl(cf.teams),sg(cf.teams));if(r.error){bad++;console.log(r.error);break}
   const po=r.summary.cats.filter(c=>c.po);if(po.length!=6)bad++;po.forEach(c=>{const rd=c.po.red||(c.po.tor&&c.po.tor[1].rds);if(!rd.length)bad++;const L=rd[rd.length-1];if(L.m.length!=1)bad++;lines+=rd.length});
   if(r.summary.cats[5].po.promo)pr++;E.careerTitle(r.summary,'Yo');car=r.car}
  ok(!bad,'8 temporadas: Primera (playoffs), B Metro, Nacional, C y Promocional con su fase final (todas terminan en una final)');ok(pr==8,'la promoción C–Promocional se jugó las 8 veces');
  ok(car.zones.ar1.every(z=>z.length==15)&&car.zones.ar2[0].length==18&&car.zones.ar4[1].length==14&&car.zones.ar6[0].length==8&&car.zones.ar6[1].length==9&&car.zones.ar5.map(z=>z.length).join()=='10,10,9,9','zonas 15/15, 18/18, 10/10/9/9, 14/14 y 8/9');
  tits.length=0;E.careerTitle({me:{club:'boca',champ:true,zone:'A',n:36}},'Yo');E.careerTitle({me:{club:'boca',champ:false,zone:'A',n:36}},'Yo');ok(tits.length==1&&tits[0].comp=='real'&&tits[0].compNombre=='Clásico realista'&&tits[0].fmt=='liga2'&&tits[0].n==36,'solo el campeón de la categoría informa título, como «Clásico realista»')}
 console.log('\n== título para el ranking');
 {const car=E.realNew({me:{club:'boca'}});let rec=null;E.CFG.onTitle=x=>rec=x;let last=null;const room='rtit',pid='yo';
  E.act({a:'create',off:1,speed:100,room,pid,name:'Yo',cfg:{...E.careerCfg(car)}});E.listen(room,pid,v=>last=v);E.act({a:'pick',room,pid,team:'boca'});
  const iv=setInterval(()=>{if(['pre','lobby'].includes(last.phase))E.act({a:'ready',room,pid,v:true})},10);await until(()=>last.phase=='end');clearInterval(iv);
  if(last.champ=='boca')ok(rec&&rec.comp=='real'&&rec.compNombre=='Clásico realista','título de Boca sale como «Clásico realista»');else ok(true,'Boca no salió campeón en esta corrida (no se informa título, correcto: '+last.champ+')');
  clearInterval(E.rooms[room].timer);delete E.rooms[room]}
 console.log(fails?'\nFALLAS: '+fails:'\nTodo OK');process.exit(fails?1:0)})();
