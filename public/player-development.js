(function(){
// Sistema determinista de evolución e involución de futbolistas.
// El perfil se guarda dentro de cada carrera; nunca modifica el plantel base.
// Integración prevista: crear perfiles al iniciar carrera y registrar minutos al cerrar cada fecha.
'use strict';

const ATTRS = ['pas','ctl','reg','rem','des','mar','ant','ref'];
const PHYSICAL = ['vel','ace','res'];
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const hash = s => { let h=2166136261; for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)} return h>>>0; };
const noise = (seed,lo,hi) => lo + (hash(seed) % (hi-lo+1));

function cycleMatches(age) {
  if(age <= 17) return 6;
  if(age <= 20) return 8;
  if(age <= 23) return 10;
  if(age <= 26) return 13;
  if(age <= 29) return 16;
  if(age <= 31) return 20;
  if(age <= 33) return 22;
  return 26;
}

function potentialFor(player, seed) {
  const age = Number(player.age) || 24;
  const current = clamp(Math.round(Number(player.r)||60),35,94);
  const youth = age <= 17 ? 13 : age <= 20 ? 10 : age <= 23 ? 7 : age <= 26 ? 4 : age <= 29 ? 2 : 0;
  const spread = age <= 20 ? 8 : age <= 24 ? 6 : age <= 28 ? 4 : 2;
  const teamBonus = clamp((Number(player.teamLevel)||65)-65,-3,3);
  return clamp(current + youth + noise(seed || player.id || player.n,0,spread) + teamBonus, current, 94);
}

function createProfile(player, seed) {
  const age = Number(player.age)||24;
  const ca = clamp(Math.round(Number(player.r)||60),35,94);
  return {
    v:1, ca, pot:potentialFor(player,seed), ageAtStart:age,
    appearances:0, minutes:0, progress:0, goodForm:0, poorForm:0,
    lastChange:0, changes:0
  };
}

// Un partido solo cuenta en proporción a los minutos jugados. Rendimiento esperado: escala 0-10.
function recordAppearance(profile, player, match) {
  const p = {...profile};
  const minutes = clamp(Number(match.minutes)||0,0,120);
  const performance = clamp(Number(match.performance)||6,0,10);
  if(minutes < 15) return {profile:p,player:{...player},changed:false};
  p.appearances++;
  p.minutes += minutes;
  const participation = Math.min(1,minutes/75);
  const form = clamp(0.72 + (performance-6)*0.12,0.35,1.2);
  p.progress += participation*form;
  if(performance >= 7.2) p.goodForm++;
  if(performance < 5.5) p.poorForm++;

  const age = Number(player.age)||p.ageAtStart||24;
  const threshold = cycleMatches(age);
  if(p.progress < threshold) return {profile:p,player:{...player},changed:false};

  p.progress -= threshold;
  let delta = 0;
  if(age <= 23 && p.ca < p.pot && p.goodForm >= Math.max(2,Math.round(threshold*.22))) delta = 1;
  else if(age <= 27 && p.ca < p.pot && p.goodForm >= Math.max(3,Math.round(threshold*.3))) delta = 1;
  else if(age <= 29 && p.ca < p.pot && p.goodForm >= Math.max(5,Math.round(threshold*.4))) delta = 1;
  else if(age >= 34 && p.goodForm < Math.round(threshold*.4)) delta = -1;
  else if(age >= 32 && p.poorForm >= Math.max(3,Math.round(threshold*.25))) delta = -1;
  else if(age >= 28 && p.poorForm >= Math.max(4,Math.round(threshold*.35))) delta = -1;

  if(delta > 0) { p.ca=Math.min(p.pot,p.ca+1); p.goodForm=0; p.poorForm=0; }
  if(delta < 0) { p.ca=Math.max(35,p.ca-1); p.goodForm=0; p.poorForm=0; }
  p.lastChange=delta; if(delta) p.changes++;
  const next={...player,r:p.ca,at:{...(player.at||{})}};
  if(delta) {
    // El desarrollo técnico/mental es gradual; el desgaste tardío afecta primero la velocidad.
    const keys=age>=32?PHYSICAL:(player.p==='POR'?['ref','par','man']:player.p==='DEL'?['rem','vel','ace','des']:player.p==='DEF'?['mar','ant','pas']:['pas','ctl','reg','ant']);
    keys.forEach(k=>{if(typeof next.at[k]==='number')next.at[k]=clamp(next.at[k]+delta,15,99)});
  }
  return {profile:p,player:next,changed:!!delta,delta};
}

const API={cycleMatches,potentialFor,createProfile,recordAppearance};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else if(typeof window!=='undefined')window.PLAYERDEV=API;

})();
