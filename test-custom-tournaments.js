const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const DATA = require('./public/data');
const ENG = require('./public/engine');

assert.deepEqual(DATA.CUSTOM_KO_SIZES, [4, 8, 16, 32, 64]);
assert.deepEqual(DATA.CUSTOM_LIGA_SIZES, [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]);

for (const n of [2, 3, 4, 5, 6, 7, 8, 12, 16, 24, 32, 64]) {
  const seeds = Array.from({ length: n }, (_, i) => 'club' + (i + 1));
  const out = ENG.customPlayoffPreview(seeds, n);
  const size = 2 ** Math.ceil(Math.log2(n));
  assert.equal(out.qualifiers.length, n);
  assert.equal(out.bracket[0].length, size / 2);
  assert.equal(out.bracket[0].filter(x => x.bye).length, size - n);
  assert.deepEqual(out.bracket[0].filter(x => x.bye).map(x => x.a), seeds.slice(0, size - n));
}

const club = DATA.DIVS.find(d => d.id === 'ar1').teams[0].id;
const car = ENG.careerNew({ lg: 'ar', k: 1, n: 4, ud: 0, fmt: 'mixto', playoff: 3, mixLegs: 2, me: { club, cat: 0 } });
assert.ok(!car.error, car.error);
assert.equal(car.fmt, 'mixto');
assert.equal(car.playoff, 3);
assert.equal(car.mixLegs, 2);
const cfg = ENG.careerCfg(car);
assert.equal(cfg.fmt, 'mixto');
assert.equal(cfg.playoff, 3);
assert.equal(cfg.mixLegs, 2);

const html = fs.readFileSync('public/index.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x => x[1]).filter(x => x.trim());
assert.ok(scripts.length);
scripts.forEach((source, i) => new vm.Script(source, { filename: 'public/index.html:inline-' + i }));
console.log('OK: tamaños, byes, carrera mult categoría Mixta y sintaxis de menú.');
