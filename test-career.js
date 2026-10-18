// Prueba de guardar/cargar carreras offline (motor, sin navegador): node test-career.js
const E=require('./public/engine'),D=require('./public/data');E.CFG.offline=true;E.CFG.fastWaits=true;
let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++},sleep=ms=>new Promise(r=>setTimeout(r,ms)),until=async(f,ms=30000)=>{const t=Date.now();while(!f()&&Date.now()-t<ms)await sleep(10);return f()};
const sets=(o,seen=new Set(),p='')=>{if(!o||typeof o!='object'||seen.has(o))return[];seen.add(o);if(o instanceof Set||o instanceof Map)return[p||'raíz'];return Object.keys(o).filter(k=>!['timer','cb','sqc'].includes(k)).flatMap(k=>sets(o[k],seen,p+'.'+k))};
async function run(label,cfg,team){
 console.log('\n== '+label);const room='car'+label,pid='yo';let last=null,snap=null,sv=null,mid=null;
 E.act({a:'create',off:1,speed:100,room,pid,name:'Yo',cfg});
 E.listen(room,pid,v=>{last=v;if(!mid&&v.phase=='m1'){mid=E.snapshot(room)}if(!snap&&v.phase=='lobby'&&v.round>=1){snap=E.snapshot(room);sv=v}});
 E.act({a:'pick',room,pid,team});if(last.needRiv)E.act({a:'rivals',room,pid,random:1});
 ok(E.snapshot(room)!==null&&last.phase=='pre','en la pretemporada ya se puede guardar');
 const iv=setInterval(()=>{if(last.phase=='pre'||(last.phase=='lobby'&&last.round<1))E.act({a:'ready',room,pid,v:true})},10);
 await until(()=>snap);clearInterval(iv);
 ok(snap!==null&&sv.round>=1,'se guarda entre fechas (fecha '+(sv&&sv.round)+' jugada)');ok(mid===null,'en medio de un partido NO se puede guardar');
 ok(sets(E.rooms[room]).length==0,'el torneo no contiene Set/Map (todo se serializa bien)');
 ok(JSON.parse(snap).room.timer===undefined&&!snap.includes('"cb"'),'la foto no arrastra timers ni callbacks');
 clearInterval(E.rooms[room].timer);delete E.rooms[room];
 const r=E.restore(snap,{pid:'otro',speed:100});ok(r.code&&!r.error,'se restaura con otro id de navegador');let v2=null;E.listen(r.code,'otro',v=>v2=v);
 ok(v2&&v2.me.team==team&&v2.round==sv.round&&v2.phase=='lobby','vuelve en el mismo punto: club, fecha y fase');
 ok(JSON.stringify(v2.table)==JSON.stringify(sv.table)&&JSON.stringify(v2.me.sq.map(x=>x.n))==JSON.stringify(sv.me.sq.map(x=>x.n)),'misma tabla y mismo plantel que antes de guardar');
 const iv2=setInterval(()=>{if(['pre','lobby'].includes(v2.phase))E.act({a:'ready',room:r.code,pid:'otro',v:true})},10);
 ok(await until(()=>v2.phase=='end',60000),'la carrera cargada se juega hasta el final (campeón: '+(v2&&v2.champ)+')');clearInterval(iv2);ok(!!v2.champ,'hay campeón');
 ok(E.snapshot(r.code)!==null,'una carrera terminada también se puede guardar');clearInterval(E.rooms[r.code].timer);delete E.rooms[r.code]}
(async()=>{
 await run('liga',{div:'ar1',fmt:'liga1',n:4},'boca');
 await run('copa',{div:'ar1',fmt:'copa',n:4,legs:1,seed:'rand'},'river');
 await run('barrial',{div:'cup:oeste',fmt:'liga1',n:4},D.CUPS.find(c=>c.id=='oeste').clubs[0]);
 console.log('\n== casos inválidos');
 ok(E.restore('{no es json',{pid:'a'}).error,'texto dañado → error claro');
 ok(E.restore(JSON.stringify({v:1,room:{cfg:{},pl:{},order:[],table:{},phase:'m1'}}),{pid:'a'}).error,'foto en fase no segura / vacía → error');
 ok(E.restore(JSON.stringify({v:2}),{pid:'a'}).error,'versión desconocida → error');
 E.CFG.offline=false;ok(E.restore('{}',{pid:'a'}).error,'en el servidor online no se puede cargar');
 console.log(fails?'\n'+fails+' FALLAS':'\nTodo OK');process.exit(fails?1:0)})();
