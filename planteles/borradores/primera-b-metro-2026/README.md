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
6. Se conservan los dorsales confirmados en fuentes oficiales vigentes. Por autorización expresa del usuario (12/11/2026), cuando no hay un número verificable se asigna un dorsal estimado libre y coherente con la posición y el orden del plantel; se identifica en `dorsal_source` como estimación propia y nunca se presenta como oficial. Las planillas públicas de partido que numeran la formación del 1 al 20 no se toman como dorsales reales. El pie dominante se carga únicamente cuando hay una fuente individual.
7. Para B Metro se conserva el ABI como base (`ajuste_rating=0`). No se aplica automáticamente el +10 usado en Primera y Primera Nacional: la tercera categoría debe mantener su distancia de nivel hasta terminar la calibración.

## Estado de la tanda 1

- Archivo: `tanda1.csv`
- Clubes: 8
- Jugadores: **185**
- Medias de referencia FM27: 163
- Medias estimadas con participación 2026: 22
- Duplicados de nombre: 0
- Dorsales oficiales verificados: 6 (Brown de Adrogué); el resto queda vacío por falta de confirmación oficial
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
- Dorsales oficiales verificados: 0; no se encontró una nómina oficial vigente con números de camiseta inequívocos.
- Los jugadores cedidos a estos clubes se incluyen cuando FM27 los clasifica en la primera plantilla; los cedidos fuera quedan excluidos.

Las medias y posiciones se tomaron de las fichas de primera plantilla FM27; la pertenencia a los planteles 2026 se contrastó con Mundo Ascenso y, para Ituzaingó, también con Solo Ascenso. El validador se amplió para revisar ambas tandas juntas.

## Estado de la tanda 3

- Archivo: `tanda3.csv`
- Clubes: 7
- Jugadores: **169**
- Medias FM27 ABI: 169 (sin estimaciones propias en esta tanda).
- Distribución: Real Pilar 27, San Martín de Burzaco 22, Sportivo Italiano 21, Talleres (RE) 27, UAI Urquiza 24, Villa Dálmine 22 y Villa San Carlos 26.
- Se contrastó la pertenencia 2026 con las nóminas de Mundo Ascenso y se depuraron duplicados, jugadores cedidos fuera y nombres de FM27 que no aparecen en el plantel 2026 consultado.
- Los préstamos hacia el club se conservan cuando aparecen en la primera plantilla FM27; los préstamos hacia otros clubes se excluyen.
- Dorsales oficiales verificados: 0; no se encontró una nómina oficial vigente con números de camiseta inequívocos.

## Validación conjunta

- Tres archivos CSV, 22 clubes y **533 jugadores**.
- Tanda 1: 185; tanda 2: 179; tanda 3: 169.
- **533 dorsales asignados:** 6 oficiales verificados (Brown de Adrogué) y 527 estimados por posición/orden. Cero dorsales vacíos y cero duplicados dentro de un plantel.
- Se retiraron 65 números anteriores que provenían de listados o planillas cuya numeración correspondía al orden de la formación y no acreditaba el dorsal de camiseta.
- La nómina oficial de Brown de Adrogué confirma: Matías Wysocki (12), Carlos Aguirre (4), Alexis Castaño (14), Braian/Brian Guerrero Ruiz (18), Matías Sproat (10) y Nicolás Meaurio (58).
- La validación de cobertura, perfiles, edades, medias, fuentes, dorsales confirmados/estimados y duplicados se ejecuta sobre las tres tandas juntas.
- Los CSV quedan como respaldo editable. La integración al runtime se realiza desde `completo.csv` mediante el workflow, después de validar cobertura y perfiles; se conservan los planteles de las demás divisiones.

## Auditoría de dorsales

- Fuente oficial con números explícitos y temporada vigente localizada: [Club Atlético Brown de Adrogué](https://clubatleticobrown.com/).
- Las planillas de Camioneros y otros reportes de partido muestran la numeración de la formación (titulares 1–11 y suplentes 12–20), que no coincide necesariamente con la numeración de camiseta. Ejemplo: la planilla de Brown–Camioneros presenta a Meaurio como 9 y Castaño como 8, mientras el sitio oficial de Brown publica sus camisetas como 58 y 14.
- Por esa diferencia, esos números de planilla no se consideran confirmación. Los seis dorsales oficiales de Brown se conservan; los restantes se completan con estimaciones internas identificadas, sin atribuirles carácter oficial.
