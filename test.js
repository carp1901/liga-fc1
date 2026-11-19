// Prueba de carga: N jugadores simulados juegan una liga completa.
// Uso: TICK_MS=50 node server.js & node test.js [N] [formato]
require('./test-player-development');
require('./test-player-regens');

const N = +process.argv[2] || 12;
const FMT = process.argv[3] || 'liga1';
const B = 'http://127.0.0.1:' + (process.env.PORT || 3000);
const code = 't' + Date.now().toString(36).slice(-6);
const post = async body => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(B + '/act', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || result.error) throw new Error(result.error || 'HTTP ' + response.status);
    return result;
  } finally {
    clearTimeout(timer);
  }
};

const players = [];
let msgs = 0, maxG = 0, goals = 0, games = 0;
const t0 = Date.now();

(async () => {
  const divisions = await (await fetch(B + '/teams.json')).json();
  const teams = divisions[0].teams.map(team => team.id);

  for (let i = 0; i < N; i++) {
    const pid = 'p' + i;
    const result = await post({
      a: i ? 'join' : 'create',
      room: code,
      pid,
      name: 'Jug' + i,
      cfg: { div: 'ar1', fmt: FMT, n: N }
    });
    if (result.error) throw new Error(result.error);
    players.push({ pid, v: null });
    fetch(B + '/ev?room=' + code + '&pid=' + pid + '&v=2')
      .then(async response => {
        if (!response.ok || !response.body) throw new Error('SSE HTTP ' + response.status);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let boundary;
          while ((boundary = buffer.indexOf('\n\n')) >= 0) {
            const packet = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);
            if (!packet.startsWith('data:')) continue;
            const message = JSON.parse(packet.slice(5));
            if (message.__cf === 'full') players[i].v = message.v;
            else if (message.__cf === 'patch' && players[i].v) {
              for (const path of message.d || []) {
                let target = players[i].v;
                for (let j = 0; j < path.length - 1; j++) target = target && target[path[j]];
                if (target != null) delete target[path[path.length - 1]];
              }
              for (const [path, value] of message.u || []) {
                let target = players[i].v;
                for (let j = 0; j < path.length - 1; j++) target = target && target[path[j]];
                if (target != null) target[path[path.length - 1]] = value;
              }
            }
            msgs++;
          }
        }
      })
      .catch(error => { players[i].streamError = error.message; });
  }

  for (let i = 0; i < N; i++) await post({ a: 'pick', room: code, pid: 'p' + i, team: teams[i] });

  const lag = [];
  let last = Date.now();
  const interval = setInterval(() => {
    const now = Date.now();
    lag.push(now - last - 20);
    last = now;
  }, 20);

  const handled = new Set();
  const sentChat = new Set();
  const deadline = Date.now() + 8 * 60 * 1000;

  while (Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const view = players[0].v;
    if (!view) {
      if (players.some(player => player.streamError)) throw new Error('SSE: ' + players.find(player => player.streamError).streamError);
      continue;
    }

    if ((view.phase === 'lobby' || view.phase === 'end') && view.res && !handled.has(view.round)) {
      handled.add(view.round);
      view.res.forEach(result => {
        games++;
        goals += result.ga + result.gb;
        maxG = Math.max(maxG, result.ga, result.gb);
      });
    }

    if (view.phase === 'end') break;

    // Una sola tanda de acciones por fase/fecha: evita saturar /act con pedidos repetidos.
    const phaseKey = view.phase + ':' + view.round;
    if ((view.phase === 'pre' || view.phase === 'lobby') && !handled.has('ready:' + phaseKey)) {
      handled.add('ready:' + phaseKey);
      await Promise.all(players.map(player => post({
        a: 'ready', room: code, pid: player.pid, v: true
      })));
      if (!sentChat.has('chat')) {
        sentChat.add('chat');
        await Promise.all(players.map(player => post({
          a: 'chat', room: code, pid: player.pid, text: 'hola'
        })));
      }
    }

    const tacticKey = 'tac:' + phaseKey;
    if (view.phase === 'm1' && !handled.has(tacticKey)) {
      handled.add(tacticKey);
      await Promise.all(players.filter((_, i) => i % 3 === 0).map((player, i) => post({
        a: 'tac', room: code, pid: player.pid,
        p: { st: i % 3, pr: i % 2, wing: (i + 1) % 2 }
      })));
    }
  }

  clearInterval(interval);
  const view = players[0].v;
  if (!view || view.phase !== 'end') throw new Error('Tiempo agotado: la liga no terminó en 8 minutos');
  const table = view.table.sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
  console.log(JSON.stringify({
    jugadores: N,
    formato: FMT,
    fechas: view.round,
    partidos: games,
    golesPorPartido: +(goals / Math.max(1, games)).toFixed(2),
    maxGolesDeUnEquipo: maxG,
    mensajesRecibidos: msgs,
    segundos: (Date.now() - t0) / 1000,
    lagMaxMs: Math.max(0, ...lag),
    todosRecibieronEstado: players.every(player => player.v && player.v.phase === 'end'),
    campeon: view.champ || table[0].id,
    ptsTotal: table.reduce((sum, team) => sum + team.pts, 0)
  }));
  process.exit(0);
})().catch(error => {
  console.error('FALLO', error);
  process.exit(1);
});
