// Penal con decisión en vivo (servidor autoridad): node test-penales.js
const E=require('./public/engine'),D=require('./public/data');E.CFG.tick=4;E.CFG.reconn=5;
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),teams=D.DIVS.find(d=>d.id=='ar1').teams.map(t=>t.id),rooms=[],st={pend:0,res:0,bad:0,timeout:0};
for(let k=0;k<12;k++){const room='pn'+k;E.act({a:'create',pid:'a'+k,name:'A',room,uid:'ua'+k,cfg:{div:'ar1',fmt:'liga1',n:4}});['b','c','d'].forEach(x=>E.act({a:'join',pid:x+k,name:x,room,uid:'u'+x+k}));['a','b','c','d'].forEach((x,i)=>{E.listen(room,x+k,()=>{});E.act({a:'pick',pid:x+k,room,team:teams[(k*4+i)%teams.length]})});rooms.push(room)}
(async()=>{const t0=Date.now();while(Date.now()-t0<40000){for(const room of rooms){const r=E.rooms[room];if(r.phase=='pre')r.t=0;(r.ms||[]).forEach(m=>{if(m.pend&&!m.pend.seen){m.pend.seen=1;st.pend++;const A=m.pend.o?m.b:m.a,Dd=m.pend.o?m.a:m.b,n=st.pend%3;
 if(n==0){E.act({a:'pdec',pid:A,room,id:m.pend.id,d:'L'});E.act({a:'pdec',pid:A,room,id:m.pend.id,d:'R'});E.act({a:'pdec',pid:Dd,room,id:m.pend.id,d:'L'});if(m.pend&&m.pend.sh!='L')st.bad++}
 else if(n==1){E.act({a:'pdec',pid:A,room,id:m.pend.id,d:'C'});st.timeout++}else E.act({a:'pdec',pid:A,room,id:999999,d:'C'})}
 (m.pv||[]).forEach(e=>{if(!e.cnt){e.cnt=1;st.res++;if(!'gso'.includes(e.x)||!'LCR'.includes(e.sd)||!'LCR'.includes(e.dd)||e.ak==null)st.bad++}})})}await sleep(20)}
 console.log(JSON.stringify(st));const pend=rooms.filter(x=>E.rooms[x].ms.some(m=>m.pend&&Date.now()-m.pend.dl<-100)).length;
 const ok=st.pend>5&&st.res>=st.pend-rooms.length&&!st.bad;console.log(ok?'Todo OK':'FALLA');process.exit(ok?0:1)})();
