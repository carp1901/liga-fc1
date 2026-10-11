// Humo de la interfaz sin navegador: carga index.html en un DOM falso y juega el modo offline completo. node test-ui.js
const vm=require('vm'),fs=require('fs');const errs=[],els={},H={};
const ctxProxy=()=>new Proxy({},{get:(t,k)=>k=='measureText'?()=>({width:10}):()=>{},set:()=>true});
const el=()=>new Proxy({style:{},dataset:{},hidden:false,innerHTML:'',value:'',textContent:'',scrollTop:0,clientHeight:0,scrollHeight:0,getContext:ctxProxy},{get:(t,k)=>k in t?t[k]:()=>{},set:(t,k,v)=>{t[k]=v;return true}});
const ctx={console,setInterval,setTimeout,clearInterval,Math,Date,JSON,Object,Array,Set,Number,String,Promise,localStorage:{},performance:{now:()=>Date.now()},requestAnimationFrame:()=>{},location:{reload(){}},fetch:()=>Promise.reject('x'),
 document:{querySelector:s=>els[s]||(els[s]=el()),addEventListener:(t,f)=>H[t]=f}};ctx.window=ctx;vm.createContext(ctx);
const html=fs.readFileSync('public/index.html','utf8'),sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop()[1];
const q=s=>ctx.document.querySelector(s);
vm.runInContext(fs.readFileSync('public/data.js','utf8'),ctx);vm.runInContext(fs.readFileSync('public/engine.js','utf8'),ctx);vm.runInContext(fs.readFileSync('public/sim2d.js','utf8'),ctx);vm.runInContext(sc,ctx);
const o=ctx.render;ctx.render=()=>{try{o()}catch(e){errs.push(e.stack.split('\n').slice(0,3).join(' | '))}};
const Q=s=>ctx.document.querySelector(s),click=d=>H.click({target:{closest:()=>({dataset:d})}}),DIV=process.argv[2]||'ar4';
q('#nm').value='Yo';q('#odv').value=DIV;q('#ofm').value='liga1';q('#onp').value='4';q('#osp').value='5';
(async()=>{await ctx.offline();const S=()=>vm.runInContext('S',ctx);let t0=Date.now(),sent=0,picked=0,f={st:0,cal:0,rt:0,btn:0,sub:0,card:0,sb:0,gol:0,ht:0,cer:0};
 const iv=setInterval(()=>{const v=S();if(!v)return;try{ctx.frame();ctx.frame();ctx.frame()}catch(e){errs.push('frame '+e.message)}if(v.ms.length&&/Posesión/.test(Q('#sts').innerHTML)&&/🟨/.test(Q('#sts').innerHTML))f.st=1;if(/class="m1 r[wdl]"/.test(Q('#cal').innerHTML))f.cal=1;if(/class="rt/.test(Q('#tc').innerHTML))f.rt=1;{const o=vm.runInContext("cache['#ov']||''",ctx),sb=Q('#sb').innerHTML;if(/sbar/.test(sb))f.sb=1;if(/GOOOL/.test(o)&&/\(/.test(o))f.gol=1;if(/ENTRETIEMPO/.test(o))f.ht=1;if(v.phase=='cer')f.cer=1}if(/Formar automático/.test(Q('#tc').innerHTML)&&/Cambios automáticos/.test(Q('#tc').innerHTML))f.btn=1;
  if(v.phase=='pick'&&!picked){picked=1;click({p:v.cfg&&vm.runInContext('DV',ctx).find(d=>d.id==DIV).teams[0].id})}
  if(['pre','lobby'].includes(v.phase)&&v.me&&!v.me.ready){click({r:1});if(!sent){sent=1;q('#ci').value='hola';H.click({target:{closest:()=>({id:'cs',dataset:{}})}});click({cal:1});click({s:v.me.tac.xi[0]});click({s:[...Array(18).keys()].find(i=>!v.me.tac.xi.includes(i))});}}
  if(v.phase=='end'||Date.now()-t0>200000){clearInterval(iv);const T=q('#tb').innerHTML,C=q('#cal').innerHTML,TC=q('#tc').innerHTML;
   console.log(JSON.stringify({fase:v.phase,fechas:v.round,erroresDeRender:errs.length,estadisticas:f.st,calendarioColor:f.cal,puntajesEnLista:f.rt,botonesAuto:f.btn,marcadorBarra:f.sb,carteleraGol:f.gol,carteleraEntretiempo:f.ht,ceremonia:f.cer,tablaConColumnasGEP:/<th>GC<\/th>/.test(T),tablaConParticipante:/\(CPU 1\)|\(Yo\)/.test(T),tieneTactica:/<select data-k="f"/.test(TC),calendarioConFilas:/Fecha 1/.test(C),foroConVotos:/data-vid/.test(q('#chl').innerHTML)||'sin mensajes'}));if(errs.length)console.log(errs.slice(0,3));process.exit(errs.length?1:0)}},30)})();
