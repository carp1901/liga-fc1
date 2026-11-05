// Descarga los escudos uruguayos y corrige el fondo blanco exterior de Kimberley MDP.
const fs = require('fs');
const sharp = require('sharp');
const urls = JSON.parse(fs.readFileSync('crests-urls.json', 'utf8'));
const outDir = 'public/crests';
fs.mkdirSync(outDir, { recursive: true });

async function quitarBlancoExterior(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const seen = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0;
  const esBlanco = i => data[i * channels] >= 242 && data[i * channels + 1] >= 242 && data[i * channels + 2] >= 242;
  const agregar = p => {
    if (p < 0 || p >= width * height || seen[p]) return;
    seen[p] = 1;
    if (esBlanco(p)) queue[tail++] = p;
  };
  for (let x = 0; x < width; x++) { agregar(x); agregar((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { agregar(y * width); agregar(y * width + width - 1); }
  while (head < tail) {
    const p = queue[head++], x = p % width, y = (p / width) | 0;
    data[p * channels + 3] = 0;
    if (x) agregar(p - 1);
    if (x + 1 < width) agregar(p + 1);
    if (y) agregar(p - width);
    if (y + 1 < height) agregar(p + width);
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

(async () => {
  let ok = 0, failed = 0, skipped = 0;
  for (const [id, url] of Object.entries(urls)) {
    if (!id.startsWith('uy_')) continue;
    if (!url) { console.log('SIN FUENTE:', id); skipped++; continue; }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const type = (response.headers.get('content-type') || '').toLowerCase();
      if (!type.includes('image/png')) throw new Error('Contenido no PNG: ' + type);
      const input = Buffer.from(await response.arrayBuffer());
      const output = await sharp(input)
        .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
        .toBuffer();
      fs.writeFileSync(`${outDir}/${id}.png`, output);
      console.log('OK:', id, Math.round(output.length / 1024) + ' KB');
      ok++;
    } catch (error) {
      console.error('ERROR:', id, error.message);
      failed++;
    }
  }

  const kimberleyPath = `${outDir}/kimberley.png`;
  if (fs.existsSync(kimberleyPath)) {
    try {
      const transparent = await quitarBlancoExterior(kimberleyPath);
      const output = await sharp(transparent)
        .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
        .toBuffer();
      fs.writeFileSync(kimberleyPath, output);
      console.log('OK: kimberley (fondo blanco exterior transparente)', Math.round(output.length / 1024) + ' KB');
    } catch (error) {
      console.error('ERROR kimberley:', error.message);
      failed++;
    }
  } else {
    console.log('SIN ARCHIVO EXISTENTE: kimberley.png');
  }

  console.log(`Resultado: ${ok} descargados, ${failed} fallidos, ${skipped} sin fuente.`);
  if (failed) process.exitCode = 1;
})();
