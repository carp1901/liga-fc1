const assert=require('assert');
const {cycleMatches,potentialFor,createProfile,recordAppearance}=require('./public/player-development');
assert(cycleMatches(18)<cycleMatches(25));
const a={n:'Jugador joven',id:'test-1',p:'DEL',r:60,age:18,teamLevel:70,at:{pas:55,ctl:58,reg:60,rem:61,des:65,mar:30,ant:40,ref:20}};
assert.strictEqual(potentialFor(a,'seed'),potentialFor(a,'seed'));
const profile=createProfile(a,'seed');
assert(profile.pot>=profile.ca);
let state=profile,player=a,changed=false;
for(let i=0;i<30;i++){const r=recordAppearance(state,player,{minutes:90,performance:8});state=r.profile;player=r.player;changed ||= r.changed;}
assert(changed,'un juvenil con minutos y buen rendimiento debería poder evolucionar');
const veteran={...a,n:'Veterano',age:35,r:70,p:'MED'};
let vp=createProfile(veteran,'veteran'),vplayer=veteran,declined=false;
for(let i=0;i<40;i++){const r=recordAppearance(vp,vplayer,{minutes:90,performance:4.5});vp=r.profile;vplayer=r.player;declined ||= r.delta<0;}
assert(declined,'un veterano con mala forma debería poder involucionar');
console.log('OK: potencial determinista, ciclos por edad, evolución juvenil e involución veterana.');
