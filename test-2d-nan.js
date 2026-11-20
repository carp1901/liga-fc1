// 2D: tras goles/córners/faltas ninguna ficha ni la pelota debe quedar con posición NaN (fichas que desaparecen): node test-2d-nan.js
const dir=__dirname+'/public';const {Sim}=require(dir+'/sim2d'),D=require(dir+'/data');const NF=D.FM.length;let id=1,bad=0,tot=0;
for(let f0=0;f0<NF;f0+=2)for(let f1=1;f1<NF;f1+=3){const S=new Sim();S.setup(f0,f1,'k'+f0+f1);S.frozen=false;S.kickoff(0);
 for(const ev of [{k:'cor',x:'g'},{k:'fk',x:'g'},{k:'fk',x:'w'},{k:'att',x:'g'},{k:'cor',x:'c'},{k:'pen',x:'g'}]){const as=id%2;for(let i=0;i<30;i++)S.step();S.event({...ev,id:id++,t:as,n:'T',ch:[]},as);let w=0,nan=0;while((S.sc||S.q.length)&&w<3000){S.step();w++}for(let i=0;i<200;i++)S.step();tot++;if(S.P.some(p=>!Number.isFinite(p.x+p.y+p.vx+p.vy)))bad++}}
console.log('jugadas',tot,'con NaN',bad,bad?'FALLA':'Todo OK');process.exit(bad?1:0)
