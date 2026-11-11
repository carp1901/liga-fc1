# Primera B Metropolitana 2026 — planteles reales

Trabajo por tres tandas, con 22 clubes en total. Los CSV son fuentes editables; no se incorporan al runtime hasta completar y validar las tres tandas.

## División en tandas

### Tanda 1 — 8 clubes
- Arsenal
- Brown de Adrogué
- Deportivo Armenio
- Argentino de Merlo
- Argentino de Quilmes
- Camioneros
- Comunicaciones
- Defensores Unidos

### Tanda 2 — 7 clubes
- Dock Sud
- Deportivo Laferrere
- Deportivo Merlo
- Excursionistas
- Flandria
- Ituzaingó
- Liniers

### Tanda 3 — 7 clubes
- Real Pilar
- San Martín de Burzaco
- Sportivo Italiano
- Talleres (RE)
- UAI Urquiza
- Villa Dálmine
- Villa San Carlos

## Criterio de relevamiento

1. FM27 es la referencia principal para la lista de primera plantilla, posición y capacidad actual.
2. Las páginas de FM Blog publican **FMB Ability (ABI) de 1 a 99**, una normalización propia basada en Football Manager. No es el CA/PA bruto del editor de FM ni un OVR de EA FC; se identifica expresamente en `rating_source`.
3. Se contrasta la pertenencia al plantel y la participación 2026 con estadísticas de temporada, fichas individuales, reportes de partidos y fuentes de clubes. La columna `fuente_participacion` conserva la referencia utilizada para comprobar actividad.
4. Cuando un jugador importante de la temporada no aparece en la ficha FM consultada, se permite una estimación propia de media, claramente etiquetada. No se presenta como dato FM.
5. No se cargan reservas o juveniles sin participación suficiente. Los casos de cambio de club durante 2026 se conservan sólo cuando tuvieron participación comprobable con ese equipo.
6. No se inventan dorsales ni fechas de nacimiento. Los campos sin respaldo quedan vacíos. El pie dominante se carga únicamente cuando hay una fuente individual.
7. Para B Metro se conserva el ABI como base (`ajuste_rating=0`). No se aplica automáticamente el +10 usado en Primera y Primera Nacional: la tercera categoría debe mantener su distancia de nivel hasta terminar la calibración.

## Estado de la tanda 1

- Archivo: `tanda1.csv`
- Clubes: 8
- Jugadores: **185**
- Medias de referencia FM27: 163
- Medias estimadas con participación 2026: 22
- Duplicados de nombre: 0
- Dorsales verificados: 0 (se dejan vacíos hasta confirmar número de camiseta real)
- Pies dominantes con fuente individual: 19
- Fechas de nacimiento documentadas: 31

El validador específico pasó manualmente sobre las 185 filas: cobertura de los ocho clubes, roles válidos, fuentes presentes y sin duplicados. El `--dry-run` completo del importador se repetirá al terminar las tres tandas, antes de publicar. La integración a `public/squads.*` queda pendiente hasta completar las tres tandas y la revisión final de cobertura.

## Estado de la tanda 2

- Archivo: `tanda2.csv`
- Clubes: 7
- Jugadores: **179**
- Medias FM27 ABI: 179 (sin estimaciones propias en esta tanda)
- Distribución: Dock Sud 27, Laferrere 26, Deportivo Merlo 27, Excursionistas 27, Flandria 26, Ituzaingó 21 y Liniers 25.
- Duplicados internos y contra tanda 1: 0
- Dorsales: vacíos cuando la fuente consultada no acredita el número de camiseta individual.
- Los jugadores cedidos a estos clubes se incluyen cuando FM27 los clasifica en la primera plantilla; los cedidos fuera quedan excluidos.

Las medias y posiciones se tomaron de las fichas de primera plantilla FM27; la pertenencia a los planteles 2026 se contrastó con Mundo Ascenso y, para Ituzaingó, también con Solo Ascenso. El validador se amplió para revisar ambas tandas juntas.
