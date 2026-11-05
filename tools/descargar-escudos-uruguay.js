// Descarga únicamente escudos uruguayos. Fuentes: FootyLogos (PNG transparente).
// Los dos clubes sin URL confirmada se omiten; no se inventan escudos.
const fs = require('fs');
const sharp = require('sharp');
const urls = JSON.parse(fs.readFileSync('crests-urls.json', 'utf8'));
const outDir = 'public/crests';
fs.mkdirSync(outDir, { recursive: true });

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
  console.log(`Resultado: ${ok} descargados, ${failed} fallidos, ${skipped} sin fuente.`);
  if (failed) process.exitCode = 1;
})();
