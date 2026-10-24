// Copa Argentina suelta: node test-copa.js
const E=require('./public/engine');E.CFG.offline=true;E.CFG.fastWaits=true;
let fails=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fails++},sleep=ms=>new Promise(r=>setTimeout(r,ms)),until=async(f,ms=240000)=>{const t=Date.now();while(!f()&&Date.now()-t<ms)await sleep(10);return f()};
(async()=>{
 const c=E.copaSuelta(),T=c.teams,P=new Set(c.q.prim);
 ok(T.length==64&&new Set(T).size==64,'64 clubes distintos');ok(c.q.prim.length==30&&c.q.low.length==34,'30 de Primera + 34 del ascenso');
 let pp=0,pl=0,ll=0;for(let i=0;i<64;i+=2){const a=P.has(T[i]),b=P.has(T[i+1]);if(a&&b)pp++;else if(a||b)pl++;else ll++}
 ok(pp==0&&pl==30&&ll==2,'1.ª ronda: 30 cruces Primera–ascenso y 2 entre ascenso ('+pl+'/'+ll+')');
 const room='cup1',pid='yo';let last=null;
 let e=E.act({a:'create',off:1,speed:100,room,pid,name:'Yo',cfg:{div:'custom',fmt:'copa',n:64,teams:T,fixed:1,legs:1,lbl:'Copa Argentina'}});ok(!e,'crea la sala '+(e||''));
 E.listen(room,pid,v=>last=v);e=E.act({a:'pick',room,pid,team:T[0]});ok(!e,'elige club '+(e||''));
 const r=E.rooms[room];ok(r.br&&r.br.length==6&&r.br[0].length==32,'6 rondas, 32 partidos en la 1.ª');
 ok(r.br[0].every((m,i)=>m.a==T[2*i]&&m.b==T[2*i+1]),'cruces según el sorteo');
 const iv=setInterval(()=>{if(['pre','lobby'].includes(last.phase))E.act({a:'ready',room,pid,v:true})},10);const fin=await until(()=>last.phase=='end'||(last.elim&&last.phase=='lobby'&&false));clearInterval(iv);
 ok(fin&&last.champ,'termina con campeón: '+(last.champ||'-'));
 clearInterval(r.timer);process.exit(fails?1:0)})()
