# Cómo poner los escudos reales

El juego busca cada escudo en `public/crests/<id>.png` (también acepta `.svg` y `.webp`).
Si el archivo no existe, dibuja un escudo con los colores del club, así que podés cargarlos de a poco.

1. **Lista de nombres**: abrí `escudos-lista.csv` (Excel o Google Sheets). La primera columna es el nombre exacto del archivo (por ejemplo `boca.png`).
2. **Conseguí las imágenes**: PNG con fondo transparente, de unos 128 a 256 px de alto (cada una debería pesar menos de 40 KB). Fuentes habituales: el sitio oficial del club, Wikipedia o Wikimedia Commons.
   Los escudos son marcas registradas de cada club: revisá la licencia de cada imagen y usalos solo en un proyecto de fans, sin fines comerciales.
3. **Renombrá y copiá** cada archivo a la carpeta `public/crests/` con el nombre de la lista.
4. **Revisá lo que falta**: `node tools/check-crests.js` muestra cuántos hay por división y cuáles faltan.
5. **Probalo en tu compu**: `node server.js` y abrí http://localhost:3000.
6. **Subilo a GitHub**:
   - Con git: `git add public/crests` → `git commit -m "escudos"` → `git push`.
   - Desde la web de GitHub: entrá a la carpeta `public/crests` → Add file → Upload files → arrastrá los PNG (máx. 100 por vez; son 116 clubes, así que hacelo en dos tandas) → Commit changes.
7. **Railway** detecta el cambio y se actualiza solo en uno o dos minutos. Si no ves los escudos, hacé Ctrl+F5 (el navegador guarda las imágenes unos 5 minutos).

Opcional (descarga automática): completá las URLs directas en `crests-urls.json` y corré `node tools/crests.js`.
