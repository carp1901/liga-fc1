// TST-09: linter mínimo. Solo «no-undef» (referencias a variables que no existen), que es lo que rompe en producción
// sin que lo vea ningún test. No impone estilo. Lo corre CI (.github/workflows/ci.yml) con: node tools/lint.js
import globals from 'globals';

// Globales que comparten los scripts de la página: los define cada archivo (window.X o const de nivel superior de un script clásico)
const juego = { DATA: 'readonly', ENG: 'readonly', PLAYERDEV: 'readonly', PLAYERREG: 'readonly', SQUADS: 'readonly', Sim: 'readonly', SIM2D: 'readonly', CLASH_API: 'readonly', apiUrl: 'readonly', apiFetch: 'readonly', ES: 'writable' };
const reglas = { 'no-undef': 'error' };

export default [
  { ignores: ['node_modules/**', '.wrangler/**', 'planteles/**'] },
  // Scripts del navegador que también se cargan en Node (patrón «typeof module»)
  {
    files: ['public/*.js', 'shared/*.js', '.lint/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'script', globals: { ...globals.browser, ...globals.commonjs, ...juego } },
    rules: reglas,
  },
  {
    files: ['public/cierre-worker.js'],
    languageOptions: { globals: { ...globals.worker, ...juego } },
  },
  // Pages Functions y el Worker de Cloudflare (módulos ES con APIs web)
  {
    files: ['functions/**/*.js', 'src/*.mjs'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.serviceworker, ...globals.browser } },
    rules: reglas,
  },
  // Node: servidor local, importador, herramientas y tests
  {
    files: ['*.js', 'tools/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'commonjs', globals: { ...globals.node } },
    rules: reglas,
  },
  // Tests con Playwright: las funciones de page.evaluate() corren dentro de la página, con sus globales; ahí no-undef no aplica
  {
    files: ['test-ui-movil.js', 'test-cliente-sse.js', 'test-guardados.js', 'test-cierre-worker.js'],
    rules: { 'no-undef': 'off' },
  },
  {
    files: ['tests/*.mjs', '*.mjs'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.node } },
    rules: reglas,
  },
];
