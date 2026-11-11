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
3. Se contrasta la pertenencia al plantel con fuentes del club, AFA/Copa Argentina, Mundo Ascenso, Solo Ascenso y fichas estadísticas. Cuando hay contradicción de posición, se prioriza la evidencia de temporada 2026 y se deja la fuente en `fuente_rol`.
4. Sólo se agregan futbolistas del plantel profesional actual con evidencia suficiente. No se cargan reservas, juveniles sin participación ni jugadores cedidos fuera.
5. No se inventan dorsales, pies dominantes ni fechas de nacimiento. Los campos sin respaldo quedan vacíos; se completan cuando aparezca una fuente fiable.
6. Para B Metro se conserva el ABI como base (`ajuste_rating=0`). No se aplica automáticamente el +10 usado en Primera y Primera Nacional: la tercera categoría debe mantener su distancia de nivel hasta terminar la calibración.

## Estado de la tanda 1

- Archivo: `tanda1.csv`
- Clubes: 8
- Jugadores cargados como candidatos verificados: 177
- Duplicados de nombre: 0
- Dorsales duplicados: 0
- Dorsales con fuente individual: 21
- Edades cargadas: 177; fechas de nacimiento documentadas: 4
- Pies dominantes documentados: 0

Los dorsales y pies pendientes no se rellenan con valores ficticios. Antes de la importación final se revisarán las apariciones de cada futbolista, los movimientos de mercado y las discrepancias de posición, y se ejecutará el validador del importador.
