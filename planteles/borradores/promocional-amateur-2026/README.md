# Promocional Amateur 2026 — planteles

Estado: **primera carga nominal de los 17 clubes preparada; auditoría individual pendiente**. Esta documentación no declara todavía cerrada la verificación de vigencia, identidad ni dorsales oficiales.

## Alcance
Temporada 2026, 17 participantes. Se recopilaron nombres desde nóminas de temporada y planillas de partidos. No se completan cupos con futbolistas ficticios ni se recortan planteles para igualarlos.

## Primera carga — 504 registros nominales

| Club | ID | Jugadores |
|---|---|---:|
| Defensores de Glew | `defglew` | 28 |
| Deportivo Metalúrgico | `metalurgico` | 32 |
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
| Everton de La Plata | `everton` | 28 |
| Juventud de Bernal | `juventudbernal` | 28 |
| Las Mandarinas | `mandarinas` | 30 |
| Social Atlético Televisión (SAT) | `sat` | 30 |
| Provincial de Lobos | `udprovincial` | 30 |
| **Total** | **17 clubes** | **506** |

Los tres planteles de 28 y los catorce de 30 cumplen el rango de trabajo acordado. El criterio de validación es **20 como mínimo, 30 como objetivo orientativo y 32 como máximo excepcional** cuando la evidencia del plantel lo justifique. No existe obligación de llevar cada club a 30.

## Fuentes nominales por club
- Defensores de Glew: https://www.soloascenso.com.ar/club/defensores-de-glew/859
- Deportivo Metalúrgico: https://www.soloascenso.com.ar/club/deportivo-metalurgico/1073 (plantel 2026); fichas de partidos 2026: https://www.soloascenso.com.ar/ficha/45860 y https://www.soloascenso.com.ar/ficha/46114
- Náutico Hacoaj: https://www.soloascenso.com.ar/club/nautico-hacoaj/501
- FC Ezeiza: https://www.soloascenso.com.ar/club/fc-ezeiza/1074
- Belgrano de Zárate: https://www.soloascenso.com.ar/club/belgrano-zarate/470
- Uribelarrea: https://www.soloascenso.com.ar/club/uribelarrea-futbol-club/1243
- Alumni de Los Hornos: https://www.sofascore.com/es/football/team/alumni-los-hornos/401405
- Atlético Pilar: https://www.sofascore.com/es-la/football/team/club-atletico-pilar/507165
- Barrancas FC: https://www.soloascenso.com.ar/club/barrancas-fc/1075
- Buenos Aires City FC: https://www.sofascore.com/es-la/football/team/buenos-aires-city/1217896
- Control Orientado: https://www.sofascore.com/es-la/football/team/control-orientado/1217894
- Estrella de Berisso: https://www.soloascenso.com.ar/club/estrella-de-berisso/738
- Everton de La Plata: https://www.soloascenso.com.ar/club/everton-la-plata/476
- Juventud de Bernal: https://www.soloascenso.com.ar/club/juventud-de-bernal/759
- Las Mandarinas: https://www.soloascenso.com.ar/club/las-mandarinas-brandsen/908
- SAT: https://www.soloascenso.com.ar/club/social-atletico-television/703
- Provincial de Lobos: https://www.soloascenso.com.ar/club/provincial-lobos/1076

## Calidad de datos y pendientes
- Las medias de esta primera carga son estimaciones propias identificadas como tales; no son OVR oficiales.
- Los dorsales quedaron **sin asignar** en los CSV porque las fuentes de nómina no confirman números de camiseta. Las cifras que estaban cargadas eran secuenciales y no se deben presentar como reales. Sólo se incorporarán dorsales cuando una planilla o ficha fiable identifique el número de camiseta.
- Edad, nacionalidad, pie hábil y roles específicos sólo se completan con evidencia individual fiable. Los datos no confirmados deben permanecer pendientes.
- Falta terminar la revisión de vigencia al cierre de 2026, homónimos, apariciones y correspondencia individual con las fuentes.
- No se agregan jugadores únicamente para alcanzar 30. Cualquier alta requiere evidencia nominal de 2026.
- El test estructural valida 17 clubes, entre 20 y 32 jugadores por plantel, ausencia de duplicados nominales y que los dorsales no verificados permanezcan vacíos y marcados como pendientes.

## Archivos
- `tanda1-inicial.csv`: 6 clubes / 180 registros.
- `tanda2-inicial.csv`: 11 clubes / 326 registros.
- `test-promocional-amateur-draft.js`: controles estructurales y de runtime.
