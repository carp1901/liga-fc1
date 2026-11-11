# Auditoría de planteles — Federal A 2026
Fecha de corte: 11/11/2026

## Criterio de revisión
- Rango operativo de control: 18 a 32 futbolistas por club.
- Objetivo de distribución: 22–28 futbolistas, siempre que los registros respalden esos nombres.
- No se agregan jugadores sólo para alcanzar una cifra ni se recortan planteles automáticamente.
- Se priorizan jugadores del plantel profesional 2026 y futbolistas con participación/convocatoria comprobable. Se contrastan fuentes de clubes, medios, Transfermarkt/FMag y registros de partidos.
- No se cuentan duplicados de listados por posición como jugadores distintos.

## Recuento final
- Clubes: 37
- Jugadores: 883
- Media: 23,9 por club
- Por debajo del objetivo (18–21): 0
- En el objetivo (22–28): 33
- Por encima del objetivo (29–32): 4

| Club | Jugadores | Estado |
|---|---:|---|
| 9 de Julio | 25 | En rango |
| Alvarado | 22 | En rango |
| Atenas | 22 | En rango |
| Atlético San Martín (Mendoza) | 22 | En rango |
| Atlético Escobar | 22 | En rango |
| Bartolomé Mitre | 27 | En rango |
| Boca Unidos | 22 | En rango |
| Círculo Deportivo | 22 | En rango |
| Cipolletti | 26 | En rango |
| Costa Brava | 22 | En rango |
| Defensores de Belgrano (Villa Ramallo) | 22 | En rango |
| Defensores (Puerto Vilelas) | 25 | En rango |
| Douglas Haig | 22 | En rango |
| Deportivo Rincón | 22 | En rango |
| El Linqueño | 22 | En rango |
| FADEP | 22 | En rango |
| Germinal | 22 | En rango |
| Gimnasia (Chivilcoy) | 22 | En rango |
| Gimnasia (Concepción del Uruguay) | 32 | Revisar exceso |
| Guillermo Brown | 22 | En rango |
| Huracán Las Heras | 22 | En rango |
| Independiente (Chivilcoy) | 22 | En rango |
| Juventud Antoniana | 22 | En rango |
| Juventud Unida Universitario | 22 | En rango |
| Kimberley | 30 | Revisar exceso |
| Olimpo | 22 | En rango |
| Ramón Santamarina | 22 | En rango |
| San Martín (Formosa) | 27 | En rango |
| Sarmiento (La Banda) | 22 | En rango |
| Sarmiento (Resistencia) | 24 | En rango |
| Sol de América | 27 | En rango |
| Sol de Mayo | 24 | En rango |
| Sportivo Belgrano | 22 | En rango |
| Sportivo Las Parejas | 30 | Revisar exceso |
| Tucumán Central | 22 | En rango |
| Villa Mitre | 32 | Revisar exceso |
| Argentino (Monte Maíz) | 26 | En rango |

## Las dos tandas de cobertura baja

### Tanda 1 — 10 clubes, 40 incorporaciones
Cada equipo pasó a 22 jugadores:
- Atlético San Martín (Mendoza): 18 → 22
- Germinal: 18 → 22
- Guillermo Brown: 18 → 22
- Juventud Unida Universitario: 18 → 22
- Santamarina: 18 → 22
- Douglas Haig: 18 → 22
- Gimnasia de Chivilcoy: 18 → 22
- Sarmiento de La Banda: 18 → 22
- Sportivo Belgrano: 18 → 22
- Huracán Las Heras: 18 → 22

PR: https://github.com/carp1901/liga-fc1/pull/62

### Tanda 2 — 9 clubes, 30 incorporaciones
Cada equipo pasó a 22 jugadores:
- Alvarado: 20 → 22
- Atenas: 19 → 22
- Boca Unidos: 19 → 22
- Círculo Deportivo: 20 → 22
- Olimpo: 18 → 22
- Juventud Antoniana: 18 → 22
- El Linqueño: 18 → 22
- Independiente de Chivilcoy: 18 → 22
- Atlético Escobar: 18 → 22

PR: https://github.com/carp1901/liga-fc1/pull/63

## Ampliaciones anteriores
- Bartolomé Mitre: 18 → 27
- San Martín de Formosa: 18 → 27
- Sol de América: 18 → 27
- Cipolletti: 18 → 26
- Costa Brava: 18 → 22
- FADEP: 18 → 22
- Sol de Mayo: 18 → 24

## Calidad y datos no verificados
- Las medias nuevas sin CA individual verificable se identifican como estimaciones propias; no se presentan como valores oficiales de Football Manager.
- No se inventaron dorsales en estas dos tandas.
- Edad y nacionalidad quedan vacías cuando no se encontró una fuente individual fiable; la ausencia de nacionalidad está justificada en `nat_source`.
- No se inventaron participaciones ni minutos. Sólo se registran cuando existe evidencia de partidos.

## Validación y siguiente etapa
- Las cuatro validaciones de tandas, los cuatro dry-runs de importación, las cuatro importaciones y la prueba integral del runtime terminaron correctamente en ambas tandas.
- El runtime se generó desde los cuatro CSV y el test comprobó los 37 clubes, sus cantidades y la correspondencia CSV/runtime.
- La siguiente revisión es nominal: Gimnasia (Concepción del Uruguay) y Villa Mitre (32 cada uno), Sportivo Las Parejas y Kimberley (30 cada uno). Sólo se retirarán jugadores si se confirma que son reservas sin participación relevante o registros incorrectos.
- Después de cerrar la auditoría de sobrepoblación se abordarán los dorsales.
