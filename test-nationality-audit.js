'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const files={
 Primera:['planteles/primera-2026.csv'],
 Nacional:Array.from({length:6},(_,i)=>'planteles/borradores/primera-nacional-2026/bloque'+(i+1)+'.csv'),
 'B Metropolitana':['planteles/borradores/primera-b-metro-2026/completo.csv'],
 'Federal A':Array.from({length:4},(_,i)=>'planteles/borradores/federal-a-2026-tanda-'+(i+1)+'/completo.csv'),
 'Primera C':Array.from({length:4},(_,i)=>'planteles/borradores/primera-c-2026/tanda'+(i+1)+'-inicial.csv'),
 'Promocional Amateur':['planteles/borradores/promocional-amateur-2026/tanda1-inicial.csv','planteles/borradores/promocional-amateur-2026/tanda2-inicial.csv']
};
const aliases={
 ARG:'ARG',ARGENTINA:'ARG',URU:'URU',URUGUAY:'URU',PAR:'PAR',PARAGUAY:'PAR',
 CHL:'CHL',CHILE:'CHL',BRA:'BRA',BRASIL:'BRA',COL:'COL',COLOMBIA:'COL',
 ECU:'ECU',ECUADOR:'ECU',PER:'PER',PERU:'PER',BOL:'BOL',BOLIVIA:'BOL',
 VEN:'VEN',VENEZUELA:'VEN',SYR:'SYR',SIRIA:'SYR',MEX:'MEX',MEXICO:'MEX',
 USA:'USA','ESTADOS UNIDOS':'USA',ESP:'ESP',ESPANA:'ESP',PRT:'PRT',PORTUGAL:'PRT',
 FRA:'FRA',FRANCIA:'FRA',ITA:'ITA',ITALIA:'ITA',DEU:'DEU',ALEMANIA:'DEU',
 HUN:'HUN',HUNGRIA:'HUN',IRL:'IRL',IRLANDA:'IRL',MYS:'MYS',MALASIA:'MYS',
 JPN:'JPN',JAPON:'JPN',PRI:'PRI','PUERTO RICO':'PRI',SVN:'SVN',ESLOVENIA:'SVN',
 GUA:'GUA',GUATEMALA:'GUA',ARM:'ARM',ARMENIA:'ARM',CHE:'CHE',SUI:'CHE',SUIZA:'CHE'
};
const normalize=value=>aliases[String(value||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()]||null;
function parseCSV(input){const rows=[];let row=[],value='',quoted=false;for(let i=0;i<input.length;i++){const ch=input[i];if(quoted){if(ch==='"'&&input[i+1]==='"'){value+='"';i++;}else if(ch==='"')quoted=false;else value+=ch;}else if(ch==='"')quoted=true;else if(ch===','){row.push(value);value='';}else if(ch==='\n'){row.push(value.replace(/\r$/,''));rows.push(row);row=[];value='';}else value+=ch;}if(value||row.length){row.push(value.replace(/\r$/,''));rows.push(row);}const header=rows.shift().map(x=>x.trim().toLowerCase());return rows.filter(r=>r.some(v=>v.trim())).map(r=>Object.fromEntries(header.map((h,i)=>[h,r[i]??''])));}
const expected={
 Primera:{total:1012,assigned:1012},
 Nacional:{total:1039,assigned:1039},
 'B Metropolitana':{total:533,assigned:533},
 'Federal A':{total:883,assigned:876},
 'Primera C':{total:839,assigned:0},
 'Promocional Amateur':{total:518,assigned:0}
};
const summary={};let total=0,assigned=0;
for(const [division,paths] of Object.entries(files)){
 const seen=new Set();let count=0,withNat=0;
 for(const path of paths)for(const player of parseCSV(fs.readFileSync(path,'utf8'))){
  count++;
  const key=player.club_id+'|'+player.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  assert(!seen.has(key),'Jugador duplicado en '+division+': '+key);seen.add(key);
  if(player.nat){const code=normalize(player.nat);assert(code,'Código de nacionalidad no reconocido en '+path+': '+player.nombre+' ('+player.nat+')');assert(player.nat_source,'Falta fuente de nacionalidad: '+player.nombre);withNat++;}
 }
 assert.equal(count,expected[division].total,'Cantidad de filas inesperada: '+division);
 assert.equal(withNat,expected[division].assigned,'Cantidad de nacionalidades asignadas inesperada: '+division);
 summary[division]={total:count,assigned:withNat,pending:count-withNat};
 total+=count;assigned+=withNat;
}
console.log(JSON.stringify({total,assigned,pending:total-assigned,divisions:summary},null,2));
