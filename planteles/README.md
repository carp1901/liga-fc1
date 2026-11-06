# Planteles reales 2026

La recopilación se hace por etapas y se guarda en el propio juego. No se consulta ninguna API durante los partidos.

## Primera División

- Planteles y dorsales: página oficial del club y Liga Profesional/AFA; Promiedos y Transfermarkt sirven como contraste.
- Medias: OVR de EA SPORTS FC 27, contrastado con FCScoutDB y cartas oficiales de EA.
- Cuando no existe carta, se usan promedios de rendimiento de Statz.ai/Sportlumy si hay al menos 10 apariciones.
- Si dos fuentes discrepan, prevalece el club o la competición oficial y la diferencia queda pendiente de revisión.
- No copiar fotos.
- No inventar nombres, edades ni estadísticas.
- Si no aparece un dorsal oficial y el proyecto autoriza asignarlo, usar un número libre y dejar `dorsal_source` como `Asignado internamente`; nunca presentarlo como oficial.
- Si falta un dato verificable, dejarlo vacío. Si falta un jugador, el club queda pendiente.
- Las edades se calculan desde fecha de nacimiento usando la referencia 05/11/2026 cuando esa fecha está documentada.
- La media 60 es provisional cuando no hay OVR de EA FC 27 ni una muestra estadística verificable. Toda media contrastada conserva su fuente.
- Los atributos técnicos/físicos que no tienen observación individual se derivan en `public/data.js` por perfil de posición y media; no se presentan como estadísticas reales.

## Formato CSV

Una fila por jugador. `club_id` debe coincidir exactamente con el ID del club del juego.

Posiciones admitidas: `POR`, `DEF`, `MED`, `DEL`. El campo `rol` conserva el puesto publicado.

Campos principales:
- `club_id`, `nombre`, `posicion`, `rating`.
- `edad`, `fecha_nacimiento`, `fuente_edad`.
- `dorsal`, `dorsal_source`.
- `rol`, `rol_especifico`, `fuente_rol`.
- `nat`, `abreviatura`, `pie`, `posiciones_secundarias`, `id`.
- `pas`, `ctl`, `reg`, `rem`, `des`, `mar`, `ant`, `ref`: atributos manuales opcionales (15-99).
- `match_rating_2026`, `rating_apps_2026`, `rating_source`: respaldo de OVR EA FC 27 o promedio estadístico; `rating_source` identifica la fuente.

## Importación

Validar:
```bash
node import-squads.js planteles/primera-2026.csv --dry-run --require-primera-complete
```

Publicar:
```bash
node import-squads.js planteles/primera-2026.csv --require-primera-complete
```

GitHub Actions valida y publica automáticamente `public/squads.json`, `public/squads.js` y `public/squads-meta.json` cuando cambia el CSV o el importador.
