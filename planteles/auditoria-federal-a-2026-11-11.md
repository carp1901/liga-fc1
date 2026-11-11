# Auditoría inicial de planteles — Federal A 2026
Fecha de corte: 11/11/2026

## Criterio de revisión
- Rango operativo de control: 18 a 32 futbolistas por club.
- Objetivo de distribución: 22–28 futbolistas, siempre que los registros de temporada respalden esos nombres.
- 18–21: revisar por posible falta de rotación; no agregar nombres para alcanzar una cifra sin confirmar.
- 22–28: distribución inicial equilibrada.
- 29–32: revisar por posible sobrepoblación y retirar sólo reservas sin participación relevante, no jugadores útiles.
- Se priorizan jugadores con participación o pertenencia comprobable al plantel 2026. Se contrastan fuentes de club, FMag/Transfermarkt, FM y estadísticas de temporada. No se cuentan duplicados de listados por posición como jugadores distintos.

## Recuento actual
- Clubes: 37
- Jugadores: 813 (consolidado CSV y runtime actualizado; 37 clubes)
- Media: 22.0 por club
- Por debajo del objetivo (18–21): 19
- En el objetivo (22–28): 14
- Por encima del objetivo (29–32): 4

| Club | Jugadores | Estado inicial |
|---|---:|---|
| Atlético San Martín (Mendoza) | 18 | Revisar cobertura |
| Cipolletti | 26 | En rango |
| Sol de América | 27 | En rango |
| Sol de Mayo | 24 | En rango |
| Costa Brava | 22 | En rango |
| FADEP | 22 | En rango |
| Germinal | 18 | Revisar cobertura |
| Guillermo Brown | 18 | Revisar cobertura |
| Juventud Unida Universitario | 18 | Revisar cobertura |
| Santamarina | 18 | Revisar cobertura |
| Douglas Haig | 18 | Revisar cobertura |
| Gimnasia (Chivilcoy) | 18 | Revisar cobertura |
| San Martín (Formosa) | 27 | En rango |
| Sarmiento (La Banda) | 18 | Revisar cobertura |
| Sportivo Belgrano | 18 | Revisar cobertura |
| Huracán Las Heras | 18 | Revisar cobertura |
| Olimpo | 18 | Revisar cobertura |
| Juventud Antoniana | 18 | Revisar cobertura |
| El Linqueño | 18 | Revisar cobertura |
| Independiente (Chivilcoy) | 18 | Revisar cobertura |
| Atlético Escobar | 18 | Revisar cobertura |
| Atenas | 19 | Revisar cobertura |
| Boca Unidos | 19 | Revisar cobertura |
| Alvarado | 20 | Revisar cobertura |
| Círculo Deportivo | 20 | Revisar cobertura |
| Defensores de Belgrano (Villa Ramallo) | 22 | En rango |
| Deportivo Rincón | 22 | En rango |
| Tucumán Central | 22 | En rango |
| Sarmiento (Resistencia) | 24 | En rango |
| 9 de Julio | 25 | En rango |
| Defensores (Puerto Vilelas) | 25 | En rango |
| Argentino (Monte Maíz) | 26 | En rango |
| Bartolomé Mitre | 27 | En rango |
| Sportivo Las Parejas | 30 | Revisar exceso |
| Kimberley | 30 | Revisar exceso |
| Gimnasia (Concepción del Uruguay) | 32 | Revisar exceso |
| Villa Mitre | 32 | Revisar exceso |

## Prioridad de revisión
### Cobertura baja (18–21)
- Atlético San Martín (Mendoza): 18
- Germinal: 18
- Guillermo Brown: 18
- Juventud Unida Universitario: 18
- Santamarina: 18
- Douglas Haig: 18
- Gimnasia (Chivilcoy): 18
- Sarmiento (La Banda): 18
- Sportivo Belgrano: 18
- Huracán Las Heras: 18
- Olimpo: 18
- Juventud Antoniana: 18
- El Linqueño: 18
- Independiente (Chivilcoy): 18
- Atlético Escobar: 18
- Atenas: 19
- Boca Unidos: 19
- Alvarado: 20
- Círculo Deportivo: 20

### En rango (22–28)
- Sol de Mayo: 24
- Cipolletti: 26
- Costa Brava: 22
- FADEP: 22
- Sol de América: 27
- San Martín (Formosa): 27
- Defensores de Belgrano (Villa Ramallo): 22
- Deportivo Rincón: 22
- Tucumán Central: 22
- Sarmiento (Resistencia): 24
- 9 de Julio: 25
- Defensores (Puerto Vilelas): 25
- Argentino (Monte Maíz): 26
- Bartolomé Mitre: 27

### Posible exceso (29–32)
- Sportivo Las Parejas: 30
- Kimberley: 30
- Gimnasia (Concepción del Uruguay): 32
- Villa Mitre: 32

## Primer ajuste
Bartolomé Mitre, San Martín de Formosa y Sol de América fueron ampliados de 18 a 27 jugadores cada uno, con nueve incorporaciones documentadas por club. Se usaron FMag/Transfermarkt, el plantel oficial de AFA y registros de temporada según disponibilidad. Las medias añadidas en los tres clubes se etiquetan como estimaciones propias y no como valores oficiales de Football Manager. El runtime se regeneró desde las cuatro tandas y las pruebas de importación/runtime pasaron.

## Ampliaciones posteriores en CSV
- Cipolletti: 18 → 26, ocho altas contrastadas con la nómina oficial del club y la cobertura de pretemporada 2026.
- Costa Brava: 18 → 22, cuatro altas contrastadas con el plantel 2026 y fuentes individuales.
- FADEP: 18 → 22, cuatro altas; tres con apariciones 2026 registradas (Gizzi 8, Klusener 20, Lentini 10) y Cogorno incorporado por anuncio de llegada al plantel.
- Sol de Mayo: 18 → 24, seis altas contrastadas con nóminas y registros 2026; Santiago Jara suma 23 presencias y Kevin Pereira 22.
- Las medias nuevas se identifican como estimaciones propias cuando no existe CA individual verificable. No se asignaron dorsales ni participaciones no respaldadas.
- Las cuatro ampliaciones están fusionadas en `main`, importadas al runtime y verificadas por `test-federal-a-runtime.js`. El runtime registra 813 jugadores en los 37 clubes del Federal A; los conteos de Cipolletti (26), Costa Brava (22), FADEP (22) y Sol de Mayo (24) coinciden con los CSV.

Este informe es una fotografía de cantidades, no una aprobación automática de cada nombre. La siguiente etapa es cruzar nominalmente los 20 clubes que siguen con 18–21 jugadores y luego revisar los cuatro que superan 28, manteniendo la regla de no sobrepoblar.
