# Planteles reales 2026

La recopilación se hace por etapas y se guarda en el propio juego. No se consulta ninguna API durante los partidos.

## Primera División

- Planteles y dorsales: página oficial del club y Liga Profesional/AFA; Promiedos y Transfermarkt sirven como contraste.
- Medias: priorizar OVR de EA SPORTS FC 27; si el jugador no aparece en esa edición, usar EA SPORTS FC 26 como respaldo (FIFAIndex/FIFACM cuando no haya ficha EA) y dejar la edición identificada en `rating_source`. Contrastar con FCScoutDB y cartas oficiales de EA. Una página de club de FCScoutDB solo respalda la media si el jugador aparece en su tabla y coincide el OVR; no usar la valoración global del club como media individual.
- Cuando no existe carta, se usan promedios de rendimiento de Sofascore, Statz.ai, Sportlumy o FotMob si hay al menos 10 apariciones.
- Si dos fuentes discrepan, prevalece el club o la competición oficial y la diferencia queda pendiente de revisión.
- No copiar fotos.
- No inventar nombres, edades ni estadísticas.
- Si no aparece un dorsal oficial y el proyecto autoriza asignarlo, usar un número libre y dejar `dorsal_source` como `Asignado internamente`; nunca presentarlo como oficial.
- Si falta un dato verificable, dejarlo vacío. Si falta un jugador, el club queda pendiente.
- Las edades se calculan desde fecha de nacimiento usando la referencia 06/11/2026 cuando esa fecha está documentada.
- No se permite completar una media faltante con 60 por defecto. Una media puede ser 60 y estar verificada si EA publica ese OVR. Las estimaciones propias deben estar identificadas en `rating_source` y contarse separadas de las medias con fuente.
- Para juveniles sin OVR oficial ni muestra suficiente, se permite una **estimación propia identificada**: edad, posición, dorsal de plantel, experiencia juvenil verificable cuando exista y comparación con jugadores de nivel/edad similar. Las estimaciones no se etiquetan como EA ni como dato oficial; se revisan cuando aparezca una fuente mejor.
- Atributos estimados: se construyen desde el perfil posicional y la media provisional, con variación individual pequeña. POR conserva reflejos; los jugadores de campo no reciben atributos de arquero. Son valores de juego, no estadísticas reales.
- Evolución: el potencial individual oculto limita la progresión; minutos, valoraciones y edad determinan cuándo puede subir o bajar la media. El sistema se aplica a carreras guardadas, no altera el plantel base.
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


### Nacionalidades y pie dominante

La columna `nat` está completa para los 1.013 jugadores de Primera 2026. Las nacionalidades completadas durante la auditoría registran su fuente individual en `nat_source`; no se asignan nacionalidades por inferencia. El pie dominante (`pie`) se considera un dato complementario: permanece vacío cuando no se encontró una fuente individual fiable y no se fuerza un valor por defecto.

La auditoría final valida 30 clubes, 1.013 jugadores, 1.013 edades, 1.013 dorsales, 1.013 roles específicos, 1.013 nacionalidades y 21 atributos por jugador (147 con atributos manuales y 866 con atributos derivados por rol, posición y media).

## Primera Nacional 2026

La división se recopila en seis bloques, cada uno con tres clubes de Zona A y tres de Zona B. El CSV de trabajo no se importa a `public/squads.json` hasta completar los 36 clubes y pasar las validaciones. Se priorizan nóminas oficiales de clubes/AFA; Mundo Ascenso y Canchallena se usan para contraste de planteles, edades y dorsales. Las medias sin OVR individual EA FC 27/26 se registran como estimaciones propias, nunca como valor oficial. Los dorsales que no tengan confirmación oficial se identifican como `Asignado internamente`.
