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

Validar y publicar conjuntamente Primera y Primera Nacional se hace mediante GitHub Actions. El flujo une temporalmente `planteles/primera-2026.csv` con los seis bloques de `planteles/borradores/primera-nacional-2026/`, valida los 66 clubes y genera `public/squads.json`, `public/squads.js` y `public/squads-meta.json`. No modifica ni reemplaza los CSV originales.

Para una importación manual, primero se construye `/tmp/planteles-2026.csv` con la misma unión y se ejecuta:
```bash
node import-squads.js /tmp/planteles-2026.csv --dry-run --require-both-divisions
node import-squads.js /tmp/planteles-2026.csv --require-both-divisions
```

La importación conserva la combinación anterior y reemplaza sólo los clubes incluidos en el CSV. `--require-both-divisions` exige los 30 clubes de Primera y los 36 de Primera Nacional.


### Nacionalidades y pie dominante

La columna `nat` está completa para los 1.012 jugadores vigentes de Primera 2026. Las nacionalidades completadas durante la auditoría registran su fuente individual en `nat_source`; no se asignan nacionalidades por inferencia. El pie dominante (`pie`) se considera un dato complementario: permanece vacío cuando no se encontró una fuente individual fiable y no se fuerza un valor por defecto.

La auditoría vigente valida 30 clubes, 1.012 jugadores, 1.012 edades, 1.012 dorsales, 1.012 roles específicos, 1.012 nacionalidades y 21 atributos por jugador (146 con al menos un atributo manual y 866 con atributos derivados por rol, posición y media). Los dorsales están completos y sin duplicados; tres se mantienen señalados como asignados internamente. El pie dominante está cargado en 992 jugadores y permanece pendiente en 20, sin inferencias.

## Ajuste general de escala — 08/11/2026

Se aplicó el aumento acordado de **+10 puntos** a las 1.013 medias del corte de Primera del 08/11. En la revisión del 09/11 se retiró a Maximiliano Gutiérrez por su transferencia oficial al Dinamo Moscú; el corte vigente queda en 1.012 jugadores. Se conserva la valoración anterior en `rating_base` y el ajuste explícito en `ajuste_rating`; no se reemplazan ni se alteran las fuentes individuales. Resultado vigente: promedio 75,71; rango 60–92. La importación automática de GitHub Actions publicó esta versión de Primera en los archivos que consume el juego y la validación terminó correctamente.

El mismo ajuste se aplicó a los 1.026 registros de Primera Nacional: promedio 68,44; rango 56–78. En ambas divisiones se mantiene la diferencia original entre jugadores; el +10 es una calibración global de escala, no una nueva valoración individual.

## Integración Primera Nacional — 08/11/2026

Los seis bloques de Primera Nacional reúnen 36 clubes y 1.026 jugadores. Antes de la publicación se detectaron y resolvieron todos los dorsales duplicados: se conservaron los números respaldados por fuentes de partido/club y se reasignaron números internos únicos sólo a las fichas marcadas como provisionales. El plantel de Godoy Cruz se contrastó con la formación del 31/10/2026. El flujo de GitHub Actions valida y publica en conjunto los 66 clubes (1.013 de Primera + 1.026 de Primera Nacional), preservando la Primera existente y verificando nombres, dorsales, edades, roles y atributos.
