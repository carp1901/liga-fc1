// Prueba de la física 2D sin navegador: node test-sim.js
const {Sim,X0,Y0,FW,FH}=require('./public/sim2d');
const S=new Sim();S.setup(0,1,'k');S.frozen=false;S.kickoff(0);let bad=0,out=0,goals=0;S.onGoal=()=>goals++;
const chk=()=>{const B=S.B;if(![B.x,B.y,B.vx,B.vy].every(Number.isFinite))bad++;S.P.forEach(p=>{if(!Number.isFinite(p.x+p.y)||p.x<X0||p.x>X0+FW||p.y<Y0||p.y>Y0+FH)out++})};
// 1) juego libre: ritmo de pases, posesión y llegada al último cuarto
let poss=[0,0],q4=0,own=0,mx=[0,0];const N=60*60*4;
for(let i=0;i<N;i++){S.step();chk();const o=S.B.own;if(o){poss[o.s]++;own++;const u=o.s?1-(S.B.x-X0)/FW:(S.B.x-X0)/FW;if(u>.75)q4++;mx[o.s]=Math.max(mx[o.s],u)}}
const min=N/3600,free={pasesPorMin:+(S.passes/min).toFixed(1),posesionIzq:Math.round(poss[0]/(poss[0]+poss[1])*100)+'%',tiempoConPelotaEnUltimoCuarto:Math.round(q4/own*100)+'%',maxAvance:[+mx[0].toFixed(2),+mx[1].toFixed(2)]};
// 2) cada jugada del servidor: termina y deja la pelota bien
const kinds=[['att','g'],['att','s'],['att','o'],['att','l'],['fk','g'],['fk','s'],['fk','o'],['fk','w'],['pen','g'],['pen','s'],['pen','o'],['cor','g'],['cor','c'],['foul',null]],res={};
for(const[k,x]of kinds){let ok=0,fr=0,mxf=0,g0=goals;for(let r=0;r<10;r++){S.kickoff(0);for(let i=0;i<40;i++)S.step();const as=r%2;
  S.event({k,x,ch:as?[1,6,9,10]:[2,5,8,9,10],n:'T. Test',t:as},as);let f=0;while((S.sc||S.q.length)&&f<1500){S.step();chk();f++}
  if(!S.sc&&!S.q.length&&f<1500)ok++;fr+=f;mxf=Math.max(mxf,f)}
 res[k+(x?':'+x:'')]=`${ok}/10 ok, ${(fr/10/60).toFixed(1)}s, goles ${goals-g0}`}
// 3) cola con muchas jugadas juntas
S.kickoff(0);for(let i=0;i<10;i++)S.event({k:'att',x:i%3?'o':'g',ch:[2,5,9,10],n:'T. Test'},i%2);let f=0;while((S.sc||S.q.length)&&f<6000){S.step();f++}
console.log(JSON.stringify({invalidos:bad,fichasFuera:out,juegoLibre:free,jugadas:res,colaDe10:{segundos:+(f/60).toFixed(1),vacia:!S.sc&&!S.q.length}},null,1));
