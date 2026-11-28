// REN-03: cierre de temporada fuera del hilo principal. Recibe la carrera y la tabla final, reproduce los planteles
// de la carrera (careerCfg) y ejecuta el mismo ENG.careerClose que antes corría en la página. Si algo falla, responde
// con error y la página cierra la temporada en el hilo principal, como siempre.
'use strict';
self.window = self; // los scripts del juego se registran en window.* (DATA, ENG, PLAYERDEV, PLAYERREG, SQUADS)
let loaded = false;
self.onmessage = e => {
  const { id, scripts, cfg, car, table, segT, winner } = e.data || {};
  try {
    if (!loaded) { importScripts(...scripts); loaded = true; }
    const ENG = self.ENG;
    Object.assign(ENG.CFG, cfg || {}); // misma configuración del motor que la página (solo valores simples)
    ENG.careerCfg(car); // en modo realista carga los planteles propios de la carrera (loadSquads), igual que en la página
    const t0 = Date.now(), r = ENG.careerClose(car, table, segT, winner);
    self.postMessage({ id, ok: true, r, ms: Date.now() - t0 });
  } catch (err) {
    self.postMessage({ id, ok: false, error: String(err && err.message || err) });
  }
};
