# Promocional Amateur 2026 — planteles reales

Estado: **planteles ampliados a 30 futbolistas por club; pendiente de validación automatizada e integración al runtime**.

## Alcance
La temporada 2026 tuvo 17 participantes divididos en dos zonas. Se cargan futbolistas reales identificados en nóminas de temporada y planillas de partidos. No se completan cupos con nombres ficticios. Máximo operativo: 30 jugadores por club.

## Planteles ampliados — 510 jugadores

| Club | ID | Jugadores |
|---|---|---:|
| Defensores de Glew | `defglew` | 30 |
| Deportivo Metalúrgico | `metalurgico` | 30 |
| Náutico Hacoaj | `hacoaj` | 30 |
| FC Ezeiza | `fcezeiza` | 30 |
| Belgrano de Zárate | `belgranozarate` | 30 |
| Uribelarrea | `uribelarrea` | 30 |
| Alumni de Los Hornos | `alumni` | 30 |
| Atlético Pilar | `atpilar` | 30 |
| Barrancas FC | `barrancas` | 30 |
| Buenos Aires City FC | `bacity` | 30 |
| Control Orientado | `controlorientado` | 30 |
| Estrella de Berisso | `estrellaberisso` | 30 |
| Everton de La Plata | `everton` | 30 |
| Juventud de Bernal | `juventudbernal` | 30 |
| Las Mandarinas | `mandarinas` | 30 |
| Social Atlético Televisión (SAT) | `sat` | 30 |
| Provincial de Lobos | `udprovincial` | 30 |
| **Total** | **17 clubes** | **510** |

La ampliación de los tres planteles se realizó con nombres y posiciones publicados en las nóminas de temporada de Solo Ascenso (Defensores de Glew y Everton) y la plantilla de Sofascore de Juventud de Bernal. Los seis nuevos registros conservan medias y dorsales estimados; no se presentan como ratings ni dorsales oficiales.

## Fuentes por club
- Defensores de Glew: https://www.soloascenso.com.ar/club/defensores-de-glew/859
- Deportivo Metalúrgico: https://www.afa.com.ar/en/posts/metalurgico-derroto-1-0-a-f.c.-ezeiza-y-es-el-campeon-del-promocional-amateur
- Náutico Hacoaj: https://www.soloascenso.com.ar/club/nautico-hacoaj/501
- FC Ezeiza: https://www.soloascenso.com.ar/club/fc-ezeiza/1074
- Belgrano de Zárate: https://www.soloascenso.com.ar/club/belgrano-zarate/470
- Uribelarrea: https://www.soloascenso.com.ar/club/uribelarrea-futbol-club/1243
- Alumni de Los Hornos: https://www.sofascore.com/es/football/team/alumni-los-hornos/401405
- Atlético Pilar: nómina 2026 https://www.sofascore.com/es-la/football/team/club-atletico-pilar/507165
- Barrancas FC: https://www.soloascenso.com.ar/club/barrancas-fc/1075
- Buenos Aires City FC: nómina 2026 https://www.sofascore.com/es-la/football/team/buenos-aires-city/1217896
- Control Orientado: nómina 2026 https://www.sofascore.com/es-la/football/team/control-orientado/1217894
- Estrella de Berisso: https://www.soloascenso.com.ar/club/estrella-de-berisso/738
- Everton de La Plata: https://www.soloascenso.com.ar/club/everton-la-plata/476
- Juventud de Bernal: https://www.soloascenso.com.ar/club/juventud-de-bernal/759
- Las Mandarinas: https://www.soloascenso.com.ar/club/las-mandarinas-brandsen/908
- SAT: https://www.soloascenso.com.ar/club/social-atletico-television/703
- Provincial de Lobos: https://www.soloascenso.com.ar/club/provincial-lobos/1076

## Criterios y pendientes
- Temporada de referencia: 2026.
- Nombres y posiciones generales transcritos de nóminas y planillas. En clubes con nóminas parciales, se usan jugadores que aparecen en formaciones o suplencias confirmadas.
- Las medias (38–43 en esta primera pasada) son **estimaciones propias**, no OVR oficiales ni valoraciones de EA FC.
- Los dorsales se asignaron de forma secuencial para el juego y están marcados como estimados; no se presentan como dorsales oficiales.
- Edad, nacionalidad, pie hábil y roles específicos se completarán sólo con evidencia adicional.
- Revisar vigencia de cada futbolista al cierre de 2026, apariciones, bajas y homónimos antes del cierre definitivo.
- No se supera el máximo de 30 por club ni se duplican nombres o dorsales dentro de un mismo club.

## Archivos
- `tanda1-inicial.csv`: 6 clubes / 178 jugadores.
- `tanda2-inicial.csv`: 11 clubes / 326 jugadores.
- `test-promocional-amateur-draft.js`: controles de estructura, cupos, duplicados y runtime.
