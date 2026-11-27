// preStrengthCache: la fuerza que usan las divisiones simuladas se actualiza cuando cambian los planteles (loadSquads).
// Antes se conservaba la primera calculada. node test-cache-fuerza.js
'use strict';
const E = require('./public/engine'), D = require('./public/data');
let fails = 0; const ok = (c, m) => { console.log((c ? 'OK  ' : 'FALLA ') + m); if (!c) fails++; };
const id = D.DIVS.find(d => /promocional/i.test(d.name)).teams[0].id;
const total = s => s.a + s.m + s.d;
const a1 = E.preRate(id), a2 = E.preRate(id);
ok(a1 === a2, 'sin cambios de planteles, el caché se reutiliza (misma referencia)');
const base = D.squad(id).map(p => ({ n: p.n, p: p.p, r: p.r, role: p.role, specificRole: p.specificRole }));
const fuerte = base.map(p => ({ ...p, r: Math.min(99, p.r + 25) }));
const rev0 = D.squadsRev();
D.loadSquads({ [id]: fuerte });
ok(D.squadsRev() === rev0 + 1, 'loadSquads sube la revisión de planteles');
const b = E.preRate(id);
ok(b !== a1 && total(b) > total(a1) + 1, 'con un plantel más fuerte, la fuerza simulada sube (' + total(a1).toFixed(1) + ' → ' + total(b).toFixed(1) + ')');
ok(total(b).toFixed(4) === total(E.teamStrength(id, { mix: false })).toFixed(4), 'coincide con teamStrength del plantel actual');
D.loadSquads({ [id]: base });
const c = E.preRate(id);
ok(Math.abs(total(c) - total(a1)) < 0.05, 'al volver al plantel original, vuelve la fuerza original (' + total(c).toFixed(1) + ')');
console.log(fails ? '\nFALLAS: ' + fails : '\nTodo OK'); process.exit(fails ? 1 : 0);
