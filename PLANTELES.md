# Planteles reales — temporada de referencia 2026

## Formato CSV

Columnas obligatorias: `club_id,nombre,posicion,rating`.

Opcionales: `edad,pie,posiciones_secundarias,id,pas,ctl,reg,rem,des,mar,ant,ref`.

- `club_id`: identificador exacto del club en `data.js` (ej. `boca`, `river`, `temperley`).
- `posicion` (grupo): POR/GK/ARQ, DEF/DF, MED/MID/MF y DEL/FW/ATA.
- `rol_especifico` (puesto que usa el motor para alinear): uno del vocabulario de abajo. Si falta, el motor usa el grupo.
- `posiciones_secundarias`: puestos del vocabulario de abajo, separados por `;`, `|` o `,`. Un grupo (por ejemplo `MED`) no es un puesto: se descarta con un aviso.
- `rol`: texto libre heredado de las fuentes; el juego no lo usa.

### Vocabulario de puestos (IMP-05)

| Código | Puesto | Grupo |
|---|---|---|
| POR | Arquero | POR |
| DFC | Defensor central | DEF |
| LI / LD | Lateral izquierdo / derecho | DEF |
| LIB | Líbero (sin casillero en las formaciones actuales) | DEF |
| MCD | Mediocampista defensivo | MED |
| MC | Mediocampista central | MED |
| MO | Mediocampista ofensivo | MED |
| MP | Mediapunta (sin casillero en las formaciones actuales) | MED |
| MI / MD | Volante izquierdo / derecho | MED |
| EI / ED | Extremo izquierdo / derecho | DEL |
| SD | Segundo delantero | DEL |
| DC | Delantero centro | DEL |

Alias aceptados: `EXD` → `ED`, `EXI` → `EI`, `MCO` → `MO`. Un puesto fuera de esta lista hace fallar la importación, con el número de fila.
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
