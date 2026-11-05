# Planteles reales 2026

La recopilación se hace por etapas y se guarda en el propio juego. No se consulta ninguna API durante los partidos.

## Primera División

- Fuente principal: página oficial de plantel del propio club, cuando esté disponible.
- Segunda fuente: Liga Profesional/AFA y páginas oficiales de las competiciones.
- Promiedos: fuente complementaria para clubes sin una ficha oficial accesible y para detectar diferencias.
- Transfermarkt: contraste manual puntual; no se automatiza su extracción.
- Si dos fuentes discrepan, prevalece el club o la competición oficial y la diferencia queda pendiente de revisión.
- No copiar fotos.
- No inventar nombres, dorsales, edades ni estadísticas para completar planteles.
- Si falta un dato, dejarlo vacío. Si falta un jugador, el club queda pendiente.
- Las edades se calculan desde fecha de nacimiento usando la referencia 05/11/2026 cuando esa fecha está documentada.
- La media 60 es provisional cuando no hay una muestra estadística verificable. Las medias respaldadas conservan promedio, partidos y fuente.
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
- `match_rating_2026`, `rating_apps_2026`, `rating_source`: respaldo de medias estadísticas.

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
