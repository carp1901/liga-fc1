'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('public/index.html','utf8');
const start=html.indexOf('const NAT_FLAG_ALIASES=');
const end=html.indexOf('const ATL=',start);
assert(start>=0&&end>start,'No se encontró el módulo de banderas SVG');
const source=html.slice(start,end)+'\nglobalThis.__flags={natFlagSvg,natCountryName,NAT_FLAG_ALIASES};';
const sandbox={esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
vm.runInNewContext(source,sandbox,{timeout:1000});
const cases=['Argentina','Uruguay','Paraguay','Chile','Brasil','Colombia','Ecuador','Perú','Bolivia','Venezuela','Siria','México','Estados Unidos','España','Portugal','Francia','Italia','Alemania','Hungría','Irlanda','Malasia','Suiza','Japón','Puerto Rico','Eslovenia','Guatemala','Armenia','ARG','URU','SUI','COL','PAR','CHL','SYR','ESP','MEX','ITA','PER'];
for(const country of cases){
 const svg=sandbox.__flags.natFlagSvg(country);
 assert(svg.includes('<svg')&&svg.includes('</svg>'),'Bandera SVG inválida: '+country);
 assert(!/🇦🇷|🇺🇾|🇧🇷/.test(svg),'La bandera no debe depender de emojis: '+country);
 assert(sandbox.__flags.natCountryName(country),'No se pudo normalizar: '+country);
}
const ids=[...html.matchAll(/id="nfclip(\\d+)"/g)].map(m=>m[1]);
assert(ids.length===0,'El código no debe fijar IDs de clipPath estáticos');
console.log('OK: '+cases.length+' variantes de nacionalidad renderizan banderas SVG por código.');
