# Planteles reales 2026

La recopilación se hace por etapas y se guarda en el propio juego. No se consulta ninguna API durante los partidos.

## Primera División

- Fuente principal de consulta: Promiedos, ficha de cada club y sección PLANTEL.
- Verificación: web oficial del club cuando haya dudas o diferencias.
- Transfermarkt: solo contraste manual puntual; no se automatiza su extracción.
- No copiar fotos.
- No inventar nombres para completar planteles.
- Si falta un dato, dejarlo vacío. Si falta un jugador, el club queda pendiente.
- El campo `rating` puede quedar vacío: el importador asigna 60 neutral, no una valoración real.

## Formato CSV

Una fila por jugador. `club_id` debe coincidir exactamente con el ID del club del juego.

Posiciones admitidas: `POR`, `DEF`, `MED`, `DEL`. El campo `rol` conserva el puesto más específico de la fuente (por ejemplo, lateral derecho o mediocampista ofensivo).

Campos:
- `club_id`: ID interno del club.
- `nombre`: nombre del jugador.
- `posicion`: POR/DEF/MED/DEL.
- `rating`: opcional; vacío = 60 neutral.
- `edad`, `dorsal`, `rol`: datos publicados por la fuente.
- `fuente`: URL exacta consultada.
- `consultado`: fecha de consulta YYYY-MM-DD.
- `pie`, `posiciones_secundarias`, `id` y atributos: opcionales.

## Importación

Para una carga parcial de trabajo:
```bash
node import-squads.js planteles/primera-2026.csv
```

Para publicar Primera solo cuando estén los 30 clubes y cada uno tenga al menos 11 jugadores:
```bash
node import-squads.js planteles/primera-2026.csv --require-primera-complete
```

El importador valida el CSV antes de escribir los archivos de `public/`. No agrega jugadores ficticios.
