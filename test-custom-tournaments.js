const assert = require('node:assert/strict');
const DATA = require('./public/data');
const ENG = require('./public/engine');

assert.deepEqual(DATA.CUSTOM_KO_SIZES, [4, 8, 16, 32, 64]);
assert.deepEqual(DATA.CUSTOM_LIGA_SIZES, [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]);

for (const n of [2, 3, 4, 5, 6, 7, 8, 12, 16, 24, 32, 64]) {
  const seeds = Array.from({ length: n }, (_, i) => 'club' + (i + 1));
  const out = ENG.customPlayoffPreview(seeds, n);
  const size = 2 ** Math.ceil(Math.log2(n));
  const expectedByes = size - n;
  assert.equal(out.qualifiers.length, n, 'clasificados');
  assert.equal(out.bracket[0].length, size / 2, 'cruces de primera ronda');
  assert.equal(out.bracket[0].filter(x => x.bye).length, expectedByes, 'cantidad de pases libres');
  assert.deepEqual(out.bracket[0].filter(x => x.bye).map(x => x.a), seeds.slice(0, expectedByes), 'los mejores ubicados reciben los pases libres');
}
console.log('OK: tamaños personalizados y play-offs con byes para cantidades no perfectas.');
