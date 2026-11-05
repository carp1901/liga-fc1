# Planteles reales — temporada de referencia 2026

## Formato CSV

Columnas obligatorias: `club_id,nombre,posicion,rating`.

Opcionales: `edad,pie,posiciones_secundarias,id,pas,ctl,reg,rem,des,mar,ant,ref`.

- `club_id`: identificador exacto del club en `data.js` (ej. `boca`, `river`, `temperley`).
- Posiciones: POR/GK/ARQ, DEF/DF, MED/MID/MF y DEL/FW/ATA.
- Posiciones secundarias: separadas por punto y coma.
- Atributos del motor: valores entre 15 y 99.

## Importar

Desde la raíz del repositorio: `node import-squads.js planteles.csv`.

Genera `public/squads.json` para Node, `public/squads.js` para el navegador y `public/squads-meta.json` con la fecha y cantidad de jugadores por club.

No completa planteles ni inventa suplentes. Los clubes no importados conservan temporalmente el generador actual hasta que se carguen sus datos reales.

## Criterios

- Una fila por jugador; no duplicar para completar cupos.
- Verificar los datos y registrar la fuente del lote.
- `rating` es una valoración interna del juego; no copiar ratings externos sin conversión.
- Los atributos completos se conservan; si faltan, el motor deriva los valores a partir de la posición y la media.
- No se importan fotografías.
