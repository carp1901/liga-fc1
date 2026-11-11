// Regresión: orientación de los 11 puestos, todas las formaciones y ambos tiempos.
const assert = require('node:assert/strict');
const { Sim, roleLayout } = require('./public/sim2d');

let checked = 0;
function verify(sim, formation, secondHalf, style) {
  for (const p of sim.P) {
    const q = roleLayout(formation, style)[p.k];
    const mirrorY = (p.s === 1) !== secondHalf;
    const expectedY = mirrorY ? 1 - q.hy : q.hy;
    assert.equal(p.hy0, expectedY, `hy0 f=${formation} team=${p.s} slot=${p.k} half=${secondHalf}`);
    if (q.rs == null) {
      assert.equal(p.rs, q.rs);
    } else {
      const expectedSide = mirrorY ? -q.rs : q.rs;
      assert.equal(p.rs === 0 ? 0 : p.rs, expectedSide === 0 ? 0 : expectedSide,
        `rs f=${formation} team=${p.s} slot=${p.k} half=${secondHalf}`);
    }
    checked++;
  }
}

for (let formation = 0; formation < 14; formation++) {
  const sim = new Sim();
  sim.setup(formation, formation, `orientation-${formation}`);

  for (let style = 0; style < 3; style++) {
    sim.setTac(0, [style, 0, 0, 0, 0]);
    sim.setTac(1, [style, 0, 0, 0, 0]);

    for (const secondHalf of [false, true]) {
      sim.setHalf(secondHalf);
      verify(sim, formation, secondHalf, style);

      // Restablecer posiciones (como hace el saque inicial) no debe perder la orientación.
      sim.rest();
      for (const p of sim.P) assert.equal(p.hy, p.hy0);
    }
  }

  // Un nuevo setup de partido conserva el tiempo que informa la pantalla.
  sim.setHalf(true);
  sim.setup(formation, formation, `orientation-${formation}-new`);
  verify(sim, formation, true, 2);
}
console.log(`Orientación 2D OK: ${checked} asignaciones verificadas (14 formaciones, ambos equipos y tiempos).`);
