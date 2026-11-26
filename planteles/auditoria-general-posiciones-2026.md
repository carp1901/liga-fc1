# Auditoría general de posiciones — planteles argentinos 2026

> Informe de **solo lectura**: no se modificaron datos, código ni planteles. Generado el 26/11/2026 sobre la rama `ccr-5be3077b-nafczt` (commit `c6f6f7d`). Todas las cifras salen de recalcular `public/squads.json` (lo que carga el juego), los CSV de `planteles/` y el código de `public/data.js`, `public/sim2d.js` e `import-squads.js`.

## Resumen ejecutivo

- **4.811 jugadores** en **170 clubes** de 6 divisiones argentinas (no existe Primera D en el proyecto; Uruguay no tiene planteles cargados).
- **Posiciones secundarias prácticamente inexistentes:** solo 3 de 4.811 jugadores tienen alguna en el juego, y el importador **no puede guardarlas** aunque estén en el CSV (D1).
- **1.357 jugadores sin puesto específico** (todo Primera C y Promocional: solo ARQ/DEF/MED/DEL) (D2).
- **Federal A, tanda 4:** 199 jugadores de 7 clubes aplanados a DFC/MC/DC (ningún lateral, extremo, MCD ni MO) (D3).
- **241 jugadores con grupo incoherente con su puesto** (por ejemplo, un DC cargado en el grupo MED). En el motor eso cambia la valoración (D4).
- **73 jugadores con rol MP y 1 con LIB**: ninguna formación tiene casilleros MP ni LIB, así que el motor siempre los penaliza (D9).
- **Verificación web** de 77 cruces de línea más dos muestras (10 + 10): **39 errores de posición principal confirmados (A)**, 9 posiciones secundarias con evidencia (B; 4 de ellas en jugadores cuyo puesto principal es dudoso) y 51 casos dudosos (C). Entre los casos verificados hay **21 con nombre o identidad dudosos** (el nombre cargado no aparece en ninguna fuente; casi todos en Primera Nacional).

## Metodología y límites

- **Fuentes técnicas:** `public/squads.json` (lo que usa el juego), los CSV de cada división, `import-squads.js` (cómo se convierten) y `public/data.js` / `public/sim2d.js` (qué roles soporta y usa el motor).
- **Football Manager no se pudo consultar directamente:** desde este entorno el proxy rechaza FMInside, sortitoutsi, Transfermarkt, BDFA y Sofascore (HTTP 403). La verificación externa se hizo con búsqueda web: fichas de FotMob, ESPN, La Nación/Cancha Llena, Soccerway, Wikipedia, Fichajes, prensa local y, cuando apareció, FMScout. Cada hallazgo cita sus URL.
- **Alcance de la verificación externa:** los 77 cruces de línea del punto D4 se verificaron completos. De los 164 casos de convención (extremo con grupo MED, MO/MP con grupo DEL) y de los 199 de la tanda 4 se verificó una **muestra de 10 cada uno**. El resto queda **sin verificar externamente**.
- **Criterios:**
  - **A**, error confirmado: el puesto cargado lo contradicen al menos dos fuentes independientes que coinciden entre sí, y como mucho una fuente aislada lo respalda.
  - **B**, secundaria con evidencia: una fuente la indica explícitamente.
  - **C**, dudoso: fuentes en conflicto, una sola fuente o identidad dudosa.
  - **D**, inconsistencia técnica entre archivos o con el motor.
- No se asignaron posiciones por edad, altura ni atributos. No se tocaron medias, atributos, nacionalidades, dorsales ni edades.
- Primera y Primera Nacional se consideran terminadas: solo se proponen cambios puntuales con evidencia, nunca masivos.

## A. Divisiones existentes, clubes y jugadores

| División | Id | Clubes | Jugadores en el juego | Filas en CSV | Archivos fuente |
|---|---|---:|---:|---:|---|
| Primera División | ar1 | 30 | 1.012 | 1.012 | `primera-2026.csv` |
| Primera Nacional | ar2 | 36 | 1.026 | 1.039 | `borradores/primera-nacional-2026/bloque1.csv`<br>`borradores/primera-nacional-2026/bloque2.csv`<br>`borradores/primera-nacional-2026/bloque3.csv`<br>`borradores/primera-nacional-2026/bloque4.csv`<br>`borradores/primera-nacional-2026/bloque5.csv`<br>`borradores/primera-nacional-2026/bloque6.csv` |
| Primera B Metropolitana | ar3 | 22 | 533 | 533 | `borradores/primera-b-metro-2026/completo.csv` |
| Federal A | ar5 | 37 | 883 | 883 | `borradores/federal-a-2026-tanda-1/completo.csv`<br>`borradores/federal-a-2026-tanda-2/completo.csv`<br>`borradores/federal-a-2026-tanda-3/completo.csv`<br>`borradores/federal-a-2026-tanda-4/completo.csv` |
| Primera C | ar4 | 28 | 839 | 839 | `borradores/primera-c-2026/tanda1-inicial.csv`<br>`borradores/primera-c-2026/tanda2-inicial.csv`<br>`borradores/primera-c-2026/tanda3-inicial.csv`<br>`borradores/primera-c-2026/tanda4-inicial.csv` |
| Promocional Amateur | ar6 | 17 | 518 | 518 | `borradores/promocional-amateur-2026/tanda1-inicial.csv`<br>`borradores/promocional-amateur-2026/tanda2-inicial.csv` |
| **Total** | | **170** | **4.811** | **4.824** | |

Primera Nacional tiene 13 filas más en el CSV que en el juego; ver G/D5.

## B. Distribución de posiciones actuales por división (datos del juego)

### Grupos

| División | POR | DEF | MED | DEL |
|---|---:|---:|---:|---:|
| Primera | 104 | 337 | 325 | 246 |
| Primera Nacional | 103 | 316 | 350 | 257 |
| B Metro | 47 | 168 | 179 | 139 |
| Federal A | 112 | 306 | 318 | 147 |
| Primera C | 85 | 219 | 336 | 199 |
| Promocional | 64 | 144 | 197 | 113 |

### Puestos específicos

| División | POR | DFC | LI | LD | LIB | MCD | MC | MO | MP | MI | MD | EI | ED | SD | DC | — |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Primera | 104 | 238 | 50 | 54 | 0 | 56 | 186 | 59 | 0 | 0 | 0 | 38 | 39 | 4 | 184 | 0 |
| Primera Nacional | 103 | 166 | 77 | 73 | 1 | 24 | 157 | 37 | 14 | 23 | 28 | 75 | 73 | 2 | 173 | 0 |
| B Metro | 47 | 95 | 32 | 41 | 0 | 34 | 57 | 22 | 20 | 15 | 23 | 28 | 37 | 3 | 79 | 0 |
| Federal A | 112 | 201 | 50 | 55 | 0 | 45 | 163 | 0 | 39 | 9 | 21 | 21 | 33 | 0 | 134 | 0 |
| Primera C | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 839 |
| Promocional | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 518 |

«—» = sin puesto específico.

Observaciones:
- Primera tiene solo 4 SD y ningún MI, MD ni MP: los volantes por banda figuran como EI/ED o MC.
- En Federal A, 134 de 147 delanteros son DC y no hay ningún SD; buena parte se debe a la tanda 4 (D3).

## C. Jugadores con posiciones genéricas

| División | Sin puesto específico (solo grupo) | Puesto aplanado (tanda 4) | Columna `rol` genérica en CSV con `rol_especifico` cargado | Sin ninguna secundaria |
|---|---:|---:|---:|---:|
| Primera | 0 | 0 | 1.012 | 1.012 |
| Primera Nacional | 0 | 0 | 1.024 | 1.024 |
| B Metro | 0 | 0 | 47 | 533 |
| Federal A | 0 | 199 | 380 | 883 |
| Primera C | 839 | 0 | 0 | 838 |
| Promocional | 518 | 0 | 0 | 518 |
| **Total** | **1.357** | **199** | **2.463** | **4.808** |

- **Puesto aplanado:** en los 7 clubes de la tanda 4 todos los defensores son DFC, todos los mediocampistas MC y todos los delanteros DC, aunque la fuente citada es la ficha FM27 del club en sortitoutsi, que trae puestos detallados.
- La columna `rol` genérica es cosmética: el juego usa `rol_especifico`. Igual, la convivencia de ambas convenciones en los mismos archivos (por ejemplo, Federal A tandas 1 y 3, Primera Nacional bloques 2 a 4) confunde las auditorías.

## D. Errores confirmados de posición principal (categoría A)

39 casos. «Grupo / puesto» es el par `posicion` / `rol_especifico` del CSV, idéntico en el juego salvo donde se indica.

| # | División | Club | Jugador | Actual | Propuesta | Motivo | Fuentes |
|---|---|---|---|---|---|---|---|
| 1 | Primera | Boca Juniors | Malcom Braida | MED / LI | **DEL / EI** | Extremo izquierdo; ninguna fuente lo da como lateral | [en.wikipedia.org](https://en.wikipedia.org/wiki/Malcom_Braida)<br>[fotmob.com](https://www.fotmob.com/fr/players/938003/malcom-braida)<br>[espn.com](https://www.espn.com/soccer/player/bio/_/id/259166/malcom-braida) |
| 3 | Primera | Rosario Central | Alan Rodríguez | MED / LI | **MED / MCD** | Volante central uruguayo (26 años, llegó de Internacional en 2026); el LI de Central era un homónimo paraguayo | [cadena3.com](https://www.cadena3.com/noticia/futbol/alan-rodriguez-ya-es-refuerzo-de-rosario-central-el-volante-uruguayo-fue-presentado-oficialmente_580086)<br>[lacapital.com.ar](https://www.lacapital.com.ar/ovacion/alan-rodriguez-llega-central-inter-porto-alegre-pero-se-cayo-lo-braian-aguirre-n10273116.html) |
| 4 | Primera | Huracán | Thiago Pérez | DEF / MCD | **MED / MCD** | Todas las fuentes lo dan como volante/mediocampista; el grupo DEF es incorrecto (rol MCD compatible) | [fotmob.com](https://www.fotmob.com/es/players/1914685/thiago-perez)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/364833/thiago-perez) |
| 5 | Primera | Gimnasia (LP) | Nicolás Barros Schelotto | MED / LD | **MED / MCD** | Volante (FotMob: volante defensivo; camiseta 10). El lateral derecho es su primo Bautista, ya cargado como LD | [en.wikipedia.org](https://en.wikipedia.org/wiki/Nicol%C3%A1s_Barros_Schelotto)<br>[fotmob.com](https://www.fotmob.com/es-419/players/1521000)<br>[elgrafico.com.ar](https://elgrafico.com.ar/articulo/primera-division/98994/mistica-en-el-bosque-los-barros-schelotto-volvieron-a-ser-protagonistas-en-el-11-de-gimnasia) |
| 6 | Primera | Gimnasia (LP) | Facundo Di Biasi | MED / DFC | **MED / MCD** | ESPN: mediocampista; FotMob: volante defensivo. Ninguna fuente lo da como central | [espn.com](https://www.espn.com/soccer/player/_/id/397601/facundo-di-biasi)<br>[fotmob.com](https://www.fotmob.com/ko/players/1700566/facundo-di-biasi) |
| 7 | Primera | Argentinos Jrs. | Gastón Bouhier | MED / DC | **DEL / DC** | Delantero según ESPN y Soccerway; el grupo MED es incorrecto | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/408142/gaston-bouhier)<br>[es.soccerway.com](https://es.soccerway.com/jugador/bouhier-gaston/WdO2h13m) |
| 8 | Primera | Argentinos Jrs. | Joaquín Gho | DEL / MC | **MED / MD** | Volante derecho (Wikipedia y FotMob: right midfielder; ESPN: midfielder) | [en.wikipedia.org](https://en.wikipedia.org/wiki/Joaqu%C3%ADn_Gho)<br>[africa.espn.com](https://africa.espn.com/football/player/bio/_/id/311120/joaquin-gho) |
| 10 | Primera | Belgrano | Marcos Ortiz | MED / DFC | **MED / MC** | Volante central según Soccerway, Footystats, Hoy Día Córdoba y CMTracker (CM); ninguna fuente lo da como central | [us.soccerway.com](https://us.soccerway.com/player/ortiz-marcos/Cv8t2ZD8/)<br>[footystats.org](https://footystats.org/players/argentina/marcos-ortiz)<br>[hoydia.com.ar](https://hoydia.com.ar/?p=403033)<br>[cmtracker.net](https://cmtracker.net/en/players/88243/marcos-ortiz) |
| 11 | Primera | Atl. Tucumán | Gabriel Compagnucci | MED / LD | **DEF / LD (lado a confirmar: Tuttosport lo da como defensor izquierdo)** | Defensor según ESPN, La Nación y Fichajes; el grupo MED es incorrecto. El lado (LD o LI) queda dudoso | [espn.com](https://www.espn.com/soccer/player/bio/_/id/207650/gabriel-compagnucci)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/gabriel-compagnucci-1xhacxggfxpq6rdws7oimzi6t/)<br>[tuttosport.com](https://www.tuttosport.com/giocatore/calcio/gabriel-compagnucci/194334) |
| 12 | Primera Nacional | Nueva Chicago | Alan Ruiz | MED / SD | **MED / MO; secundaria ED** | Mediocampista ofensivo (Wikipedia: attacking midfielder/winger; FotMob: mediocentro con extremo derecho de secundaria; La Nación: mediocampista). Ninguna fuente lo da como segundo delantero | [fotmob.com](https://www.fotmob.com/es/players/263707/alan-ruiz)<br>[en.wikipedia.org](https://en.wikipedia.org/wiki/Alan_Ruiz)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/alan-ruiz-3w3z6g8x70ii3pltaxyxbycwl/) |
| 15 | Primera Nacional | Chaco For Ever | Agustín Ojeda | MED / LI | **DEF / LI** | Lateral izquierdo según la prensa local; Sofascore: defensor. El grupo MED es incorrecto (rol LI correcto) | [airedesantafe.com.ar](https://www.airedesantafe.com.ar/deportes/debuto-colon-no-se-asento-y-es-nuevo-refuerzo-un-rival-directo-la-primera-nacional-n640981) |
| 18 | Primera Nacional | Dep. Morón | Mariano Bíttolo | DEF / EI | **DEF / LI** | Lateral izquierdo (Wikipedia); defensor zurdo según ESPN y La Nación. Ninguna fuente lo da como extremo | [en.wikipedia.org](https://en.wikipedia.org/wiki/Mariano_B%C3%ADttolo)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/mariano-bittolo-bx2unizrctwjoa951z62meymt/)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/132071/mariano-bittolo) |
| 21 | Primera Nacional | Estudiantes (BA) | Matías Núñez | MED / DC | **MED / MC** | Mediocampista según Fichajes, Cancha Llena y ESPN; ninguna fuente lo da como delantero | [fichajes.com](https://www.fichajes.com/jugador/matias-ezequiel-nunez/)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/matias-nunez-e0lfm7wswi4kjdp0ratp4445w/) |
| 23 | Primera Nacional | Gimnasia (J) | Juan Franzoni | DEL / MC | **DEL / DC** | Delantero según Cancha Llena, ESPN y Sofascore; el rol MC no tiene respaldo | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/juan-franzoni-t2guyfg10wiv8b9cavmezg4q/)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/263088/juan-franzoni) |
| 24 | Primera Nacional | San Martín (T) | Jorge Juárez | MED / LD | **MED / MC; secundarias MD y LD** | Volante de recuperación que puede jugar de interior, doble 5 o por derecha (La Gaceta); FotMob: mediocentro. Jugó de lateral derecho solo como reemplazo puntual (Contexto Tucumán) | [lagaceta.com.ar](https://www.lagaceta.com.ar/nota/1135227/deportes/mientras-intenta-consolidarse-san-martin-encontro-juarez-herramienta-puede-crecer.html)<br>[contextotucuman.com](https://www.contextotucuman.com/nota/399599/san-martin-dejo-escapar-el-empate-y-cayo-2-1-con-temperley-en-ciudadela.html)<br>[fotmob.com](https://www.fotmob.com/fr/players/1348885) |
| 31 | Primera Nacional | Güemes | Lucas Guiñazú Fernández | DEF / MC | **MED / MC** | Mediocampista según Fichajes, Cancha Llena y Fussballtransfers; el grupo DEF es incorrecto | [fichajes.com](https://www.fichajes.com/jugador/lucas-guinazu/)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/lucas-guinazu-1ihg23isufdv1g4qa5945v9ck/) |
| 34 | Primera Nacional | Racing (Cba.) | Santiago Rinaudo | DEF / ED | **DEF / LD** | Lateral derecho (Statscrew); Vía País: lateral titular; ESPN: defensor | [statscrew.com](https://www.statscrew.com/worldfootball/stats/p-rinausan001)<br>[viapais.com.ar](https://viapais.com.ar/cordoba/finalmente-santiago-rinaudo-no-va-a-godoy-cruz-y-seguira-en-racing/)<br>[espn.co.uk](https://www.espn.co.uk/football/player/_/id/342800/santiago-rinaudo) |
| 35 | Primera Nacional | Racing (Cba.) | Tomás Kummer | DEF / MCD | **DEF / DFC** | Defensor central según FotMob y FootyStats; ESPN: defensor | [fotmob.com](https://www.fotmob.com/es/players/1435860/tomas-kummer)<br>[footystats.org](https://footystats.org/players/argentina/tomas-andres-kummer) |
| 37 | Primera Nacional | Racing (Cba.) | Lautaro Ávila | MED / DFC | **MED / MC** | Mediocampista según ESPN y Soccerway; ninguna fuente lo da como central | [global.espn.com](https://global.espn.com/football/player/_/id/411476/lautaro-avila)<br>[es.soccerway.com](https://es.soccerway.com/jugador/avila-lautaro/IVsaVx7c) |
| 43 | Primera Nacional | Colón | Matías Córdoba | MED / DC | **DEL / DC** | Delantero según ESPN y Soccerway (algunas páginas regionales de ESPN dicen mediocampista); el grupo MED es incorrecto | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/402917/matias-cordoba)<br>[cl.soccerway.com](https://cl.soccerway.com/jugador/cordoba-matias/I9hW27P9) |
| 44 | Primera Nacional | Colón | Darío Sarmiento | DEL / MC | **DEL / DC; secundaria MO a confirmar** | Delantero según La Nación, Fichajes y ESPN; FotMob: mediapunta. El rol MC no tiene respaldo | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/dario-sarmiento-a1m7f0ewof5suc4pvivuaudm2/)<br>[fichajes.com](https://www.fichajes.com/jugador/dario-sarmiento/)<br>[fotmob.com](https://www.fotmob.com/es/players/1095198) |
| 45 | Primera Nacional | Tristán Suárez | Kevin Colli | MED / DC | **MED / MC** | Mediocampista según ESPN, Soccerway y Fussballtransfers; ninguna fuente lo da como delantero | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/388341/kevin-colli)<br>[es.soccerway.com](https://es.soccerway.com/jugador/colli-kevin/EJ0ykYvf) |
| 53 | Primera Nacional | Patronato | Facundo Heredia | DEL / LI | **DEL / DC** | Delantero según La Nación, Fichajes y ESPN; solo una página de FotMob lo da como carrilero izquierdo | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/facundo-heredia-b63ojekhiod69slyg0laqc844/)<br>[fichajes.com](https://www.fichajes.com/jugador/facundo-heredia/)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/316143/facundo-heredia) |
| 54 | Primera Nacional | Alte. Brown | Tomás Villoldo | DEF / EI | **DEF (puesto de defensa a confirmar)** | Defensor según ESPN y La Nación; ninguna fuente lo da como extremo. Las fuentes no precisan si es central o lateral | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/tomas-villoldo-4cmr3wt7wfwprmcvgnev6ohk9/)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/310776/tomas-villoldo) |
| 55 | Primera Nacional | Alte. Brown | Leonardo Jara | DEF / ED | **DEF (puesto a confirmar; FotMob lo da como MCD)** | Defensor según ESPN, La Nación y Fichajes; FotMob: volante defensivo. Ninguna fuente lo da como extremo | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/leonardo-jara-1qyx65ku5j6sesp9wsp8psrth/)<br>[fotmob.com](https://www.fotmob.com/ro/players/175357)<br>[fichajes.com](https://www.fichajes.com/jugador/leonardo-rafael-jara/) |
| 58 | Primera Nacional | Gimnasia y Tiro | Rubén Villarreal | MED / LI | **MED (MC o MI, a precisar)** | Mediocampista según ESPN, Soccerway y Cancha Llena; solo StatsCrew (con datos hasta 2023) lo da como extremo izquierdo. Ninguna fuente lo da como lateral | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/ruben-villarreal-c72shs2lndvv2081i93svjp3p/)<br>[ca.soccerway.com](https://ca.soccerway.com/player/villarreal-ruben-dario/G2iiDeFG/)<br>[statscrew.com](https://statscrew.com/worldfootball/stats/p-villarub001) |
| 61 | Primera Nacional | Quilmes | Thomas Ortega | DEF / MC en el CSV; DEF / LD en el juego | **DEF / LI** | Lateral izquierdo (Wikipedia, camiseta 3; ESPN NL: defensor por izquierda); ESPN y La Nación: defensor. Ni MC (CSV) ni LD (juego) tienen respaldo | [en.wikipedia.org](https://en.wikipedia.org/wiki/Thomas_Ortega)<br>[espn.com](https://www.espn.com/soccer/player/bio/_/id/301964/thomas-ortega)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/thomas-ortega-caczcbx2yoeczyh5rogufusfe/) |
| 64 | Primera Nacional | Godoy Cruz | Santiago Martínez | MED / DC | **MED / MC** | Mediocampista según ESPN y FMScout (FM 2026); ninguna fuente lo da como delantero | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/392255/santiago-martinez)<br>[fmscout.com](https://www.fmscout.com/player/2000255717/santiago-martínez.html) |
| 66 | Primera Nacional | San Telmo | Juan Ignacio Motroni | DEF / ED | **DEF (puesto de defensa a confirmar)** | Defensor según ESPN, Soccerway y Footmercato; ninguna fuente lo da como extremo | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/399733/juan-motroni)<br>[es.soccerway.com](https://es.soccerway.com/jugador/motroni-juan/IysfNK1p)<br>[footmercato.net](https://www.footmercato.net/joueur/juan-ignacio-motroni/) |
| 67 | Primera Nacional | San Telmo | Martín González | DEF / MC | **DEF (puesto de defensa a confirmar)** | Defensor según ESPN; a préstamo desde Germinal (Soccerway). Ninguna fuente lo da como mediocampista | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/336487/martin-gonzalez)<br>[es.soccerway.com](https://es.soccerway.com/jugador/gonzalez-martin/hptKLBJD) |
| 68 | Primera Nacional | San Telmo | Rodrigo Dinocco | DEF / ED | **DEF (puesto de defensa a confirmar)** | Defensor según ESPN y Soccerway; ninguna fuente lo da como extremo | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/418910/rodrigo-dinocco)<br>[es.soccerway.com](https://es.soccerway.com/jugador/dinocco-rodrigo/dUdWXCz3) |
| 69 | Primera Nacional | San Telmo | Joel González | MED / DC | **DEL / DC; secundaria ED a confirmar** | Delantero según Fichajes, Soccerway y ESPN; FotMob: extremo derecho. El grupo MED es incorrecto | [fichajes.com](https://www.fichajes.com/jugador/joel-gonzalez-3/)<br>[ar.soccerway.com](https://ar.soccerway.com/jugador/gonzalez-joel/EyxfIC02)<br>[fotmob.com](https://www.fotmob.com/it/players/1480803) |
| 73 | Primera Nacional | Acassuso | David de Estéfano | DEL / MC | **DEL / DC** | Delantero según ESPN, Soccerway y FootyStats; solo FotMob lo da como mediocampista | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/418913/david-de-estefano)<br>[es.soccerway.com](https://es.soccerway.com/jugador/de-estefano-david/OYaw1pDG)<br>[footystats.org](https://footystats.org/players/argentina/david-hernan-de-estefano) |
| 74 | Primera Nacional | Acassuso | Kevin Dubini | DEL / MC | **DEL / DC** | Delantero según La Nación, ESPN y Fichajes; solo FotMob lo da como mediocentro defensivo | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/kevin-dubini-f3x0isdvhu7qee9pvnul9w8o9/)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/241616/kevin-dubini)<br>[fichajes.com](https://www.fichajes.com/jugador/kevin-daniel-dubini/) |
| 77 | Primera Nacional | Atl. Rafaela | Joel Bonifacio | MED / DC | **MED / MC** | Mediocampista según ESPN, FotMob y Soccerway; ninguna fuente lo da como delantero | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/421300/joel-bonifacio)<br>[fotmob.com](https://www.fotmob.com/el/players/1917335)<br>[es.soccerway.com](https://es.soccerway.com/jugador/bonifacio-joel/6XPaBty1) |
| S1 | Primera Nacional | Patronato | Agustín Miró | MED / ED | **MED / MC** | Las fuentes lo nombran Alejo Agustín Miró: mediocampista según ESPN, StatsHub y Elonce; ninguna fuente lo da como extremo | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/365051/alejo-miro)<br>[statshub.com](https://statshub.com/player/alejo-agustin-miro/128931)<br>[elonce.com](https://www.elonce.com/uid-888995) |
| S4 | Primera Nacional | Chacarita Jrs. | Francisco Cristaldo | DEL / MO | **DEL / DC** | Delantero según Soccerway y Fussballtransfers; ninguna fuente lo da como mediapunta | [us.soccerway.com](https://us.soccerway.com/player/cristaldo-francisco/n5K9shy0)<br>[fussballtransfers.com](https://www.fussballtransfers.com/spieler/francisco-javier-cristaldo/) |
| S7 | Primera | Lanús | Marcelino Moreno | DEL / MO | **MED / MO; secundaria MI** | Mediapunta o volante de creación según todas las fuentes (Wikipedia, FotMob MCO/MI, ESPN, La Nación, El Universo); el grupo DEL es incorrecto | [en.wikipedia.org](https://en.wikipedia.org/wiki/Marcelino_Moreno)<br>[fotmob.com](https://www.fotmob.com/es/players/561737)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/marcelino-moreno-d42nqefiqme45lyi9mtclhtjp/) |
| S9 | Primera Nacional | San Telmo | Gabriel Paredes | MED / EI | **DEF / LI** | FotMob: lateral izquierdo; Sofascore y Soccerway: defensor; ESPN: mediocampista. Ninguna fuente lo da como extremo | [fotmob.com](https://www.fotmob.com/es-419/players/1373702)<br>[ca.soccerway.com](https://ca.soccerway.com/player/paredes-gabriel/65sMusFC)<br>[sofascore.com](https://www.sofascore.com/player/gabriel-paredes/1382891) |

Tipos de error: 8 son solo de **grupo** (el puesto específico es correcto, por ejemplo Bouhier DC con grupo MED); el resto son de **puesto** (por ejemplo, un volante cargado como lateral o un delantero como MC).

## E. Posiciones secundarias faltantes con evidencia (categoría B)

> Importante: hoy ninguna de estas secundarias llegaría al juego aunque se cargue en el CSV, porque el importador descarta los puestos específicos (D1). Primero hay que corregir D1.

| División | Club | Jugador | Puesto principal propuesto | Secundarias con evidencia | Fuente |
|---|---|---|---|---|---|
| Primera Nacional | Nueva Chicago | Alan Ruiz | MO | **ED** | [fotmob.com](https://www.fotmob.com/es/players/263707/alan-ruiz) |
| Primera Nacional | San Martín (T) | Jorge Juárez | MC | **MD, LD** | [lagaceta.com.ar](https://www.lagaceta.com.ar/nota/1135227/deportes/mientras-intenta-consolidarse-san-martin-encontro-juarez-herramienta-puede-crecer.html) |
| Primera | Lanús | Marcelino Moreno | MO | **MI** | [fotmob.com](https://www.fotmob.com/es/players/561737) |
| Primera | Argentinos Jrs. | Hernán López Muñoz | (dudoso, ver F) | **ED, MC, MO** | [fotmob.com](https://www.fotmob.com/es/players/1037535/hernan-lopez) |
| Primera Nacional | Colón | Darío Sarmiento | DC | **MO** | [fotmob.com](https://www.fotmob.com/es/players/1095198) |
| Primera Nacional | San Telmo | Joel González | DC | **ED** | [fotmob.com](https://www.fotmob.com/it/players/1480803) |
| Federal A | Sp. Las Parejas | Nicolás Herranz | DFC | **MCD** | [en.soccerwiki.org](https://en.soccerwiki.org/player.php?pid=87258) |
| Primera Nacional | San Martín (SJ) | Gonzalo Lucero | (dudoso, ver F) | **MI** | [ea.com](https://www.ea.com/es/games/ea-sports-fc/ratings/player-ratings/gonzalo-matias-lucero/76903) |
| Primera | Racing Club | Ignacio Rodríguez | (dudoso, ver F) | **LI (carrilero)** | [fotmob.com](https://www.fotmob.com/players/1244348) |

Total con evidencia: 9. Faltan secundarias en toda la base: 4.808 de 4.811 jugadores no tienen ninguna. Las secundarias **no se pueden completar sin fuente por jugador**; la referencia natural es la ficha FM de cada club (sortitoutsi o FMInside), inaccesible desde este entorno.

## F. Casos dudosos que necesitan verificación (categoría C)

### F.1 Identidad o nombre dudoso (19)

El nombre cargado no aparece en ninguna fuente; aparece otro jugador parecido en el mismo club. **Antes de tocar la posición hay que confirmar quién es el jugador**: puede ser un error de carga del nombre (dato real de plantel, fuera del alcance de esta auditoría).

| División | Club | Nombre cargado | Actual | Lo que aparece en las fuentes | Fuentes |
|---|---|---|---|---|---|
| Primera Nacional | Dep. Morón | Facundo Fagúndez | MED / DC | No aparece ningún Facundo Fagúndez en Morón; sí Franco Fagúndez (FotMob: delantero o extremo izquierdo; ESPN: mediocampista). Posible error de nombre | [fotmob.com](https://www.fotmob.com/players/1463598)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/318097/franco-fagundez) |
| Primera Nacional | Temperley | Lautaro Monti Azpiazu | MED / LD | Las fuentes lo nombran Lorenzo Monti Azpiazu. Mayoría mediocampista (ESPN AR, Soccerway); ESPN global y un perfil viejo de Sofascore: defensor | [espn.com.ar](https://www.espn.com.ar/futbol/jugador/_/id/399705/lorenzo-monti-azpiazu)<br>[cl.soccerway.com](https://cl.soccerway.com/jugador/monti-lorenzo/zT79l7UI) |
| Primera Nacional | Temperley | Omar Pacheco | DEL / DFC | Solo aparece Oswaldo Pacheco (colombiano): Soccerway lo da como defensor y ESPN como delantero | [ar.soccerway.com](https://ar.soccerway.com/jugador/pacheco-oswaldo/ED7j7u2a)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/358113/oswaldo-pacheco) |
| Primera Nacional | Güemes | Alan Bordón | MED / LD | Solo aparece Axel Bordón (ESPN: defensor de Güemes); no se confirma el lado | [espn.com](https://www.espn.com/soccer/player/bio/_/id/287653/axel-bordon) |
| Primera Nacional | Güemes | Ramiro Arnay | MED / LI | Solo aparece Rodrigo Arnay: ESPN lo da como defensor y FootyStats como lateral derecho, no izquierdo | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/419123/rodrigo-arnay)<br>[footystats.org](https://footystats.org/players/argentina/rodrigo-arnay) |
| Primera Nacional | C. de Bolívar | Franco Mucignat | DEF / ED | Solo aparece Facundo Mucignat, defensor según ESPN, La Nación y FotMob. Si es el mismo jugador, el rol ED es incorrecto | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/facundo-mucignat-5zaicxw1uxyr8e1cgzvh1gd0/)<br>[fotmob.com](https://www.fotmob.com/players/1268251) |
| Primera Nacional | C. de Bolívar | Nicolás Yeri | DEF / MC | Solo aparece Nahuel Yeri: ESPN y La Nación lo dan como defensor; Soccerway, como mediocampista | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/200261/nahuel-yeri)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/nahuel-yeri-a9z3ive5cktirzg2bzy1bg3it/) |
| Primera Nacional | C. de Bolívar | Tomás Fernández | MED / LD | Solo aparece Tobías Fernández, mediocampista según La Nación y ESPN | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/tobias-fernandez-82w6a1qtyx5dtmyr06b1ul6hg/)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/343235/tobias-fernandez) |
| Primera Nacional | Colón | Cristian Ibarra | DEF / MC | En Colón solo aparecen Conrado Ibarra (defensor) y Zahir Ibarra; Cristian Ibarra es mediocampista de Olimpo | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/309420/conrado-ibarra)<br>[fotmob.com](https://www.fotmob.com/es-419/players/1033285) |
| Primera Nacional | Agropecuario | Ezequiel Aguirre | DEF / ED | En Agropecuario figuran Alan y Enzo Aguirre (defensores). Ezequiel Aguirre es un extremo de Defensores de Belgrano | [promiedos.com.ar](https://www.promiedos.com.ar/team/agropecuario/bbjce)<br>[wikipedia.org](https://www.wikipedia.org/wiki/Ezequiel_Aguirre) |
| Primera Nacional | Patronato | Julián Salas | DEF / ED | Solo aparece Juan Salas: ESPN y Soccerway lo dan como defensor; FotMob, como volante derecho | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/290729/juan-salas)<br>[fotmob.com](https://www.fotmob.com/pt-BR/players/1283770) |
| Primera Nacional | Patronato | Bruno Bravo | MED / LD | No aparece ningún Bruno Bravo en Patronato (sí Benjamín Bravo, mediocampista, y Federico Bravo, volante defensivo) | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/343828/benjamin-bravo)<br>[en.wikipedia.org](https://en.wikipedia.org/wiki/Federico_Bravo) |
| Primera Nacional | Patronato | Matías Rueda | MED / LD | No aparece ningún Matías Rueda en Patronato (sí Walter Rueda, mediocampista, y Matías Ruiz Díaz, defensor) | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/292021/walter-rueda)<br>[eluniverso.com](https://www.eluniverso.com/tablaposiciones/jugador/matias-ruiz-diaz/200953) |
| Primera Nacional | Alte. Brown | Rodrigo Fernández | DEF / EI | No aparece ningún Rodrigo Fernández; en Almirante Brown está Ramiro Fernández, lateral izquierdo según Wikipedia | [wikipedia.org](https://Www.Wikipedia.org/wiki/Ramiro_Fern%C3%A1ndez)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/292025/ramiro-fernandez) |
| Primera Nacional | Quilmes | Agustín Batista | DEL / MC | No aparece ningún Agustín Batista en Quilmes; sí Axel Batista (ESPN: delantero; FotMob: mediocentro) | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/338689/axel-batista)<br>[fotmob.com](https://www.fotmob.com/es-419/players/1403126) |
| Primera Nacional | C. de Bolívar | Matías Gutiérrez | MED / EI | En Ciudad de Bolívar solo aparece Maximiliano Gutiérrez (mediocampista) | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/maximiliano-gutierrez-ai864ibtm7y47mo94fa7ndfx1/) |
| Primera Nacional | Los Andes | Federico Villarreal | MED / ED | En Los Andes solo aparece Facundo Villarreal (ESPN y Soccerway: mediocampista; FotMob: delantero) | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/399782/facundo-villarreal)<br>[ar.soccerway.com](https://ar.soccerway.com/jugador/villarreal-sebastian-facundo/tzUvZxTn) |
| Federal A | Kimberley | Joaquín Zárate | MED / MC | Las fuentes lo nombran Jonathan Gustavo Zárate, volante interno de Kimberley (La Capital MdP). El puesto coincide | [lacapitalmdp.com](https://www.lacapitalmdp.com/sigue-jonathan-zarate-y-arranque-confirmado/)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/jonathan-zarate-3gii40bf6chzxrei7d7c94yui/) |
| Federal A | Villa Mitre | Thiago Díaz | MED / MC | No aparece ningún Thiago Díaz en Villa Mitre; sí Thiago Pérez (centrocampista) | [es.soccerway.com](https://es.soccerway.com/jugador/perez-thiago/4MIghVfS) |

### F.2 Posición en conflicto entre fuentes (32)

| División | Club | Jugador | Actual | Posible propuesta | Conflicto | Fuentes |
|---|---|---|---|---|---|---|
| Primera | Racing Club | Ignacio Rodríguez | DEF / MC | MED / MC (secundaria LI a confirmar) | ESPN y Sofascore: mediocampista; FotMob: carrilero izquierdo. El grupo DEF no coincide con el rol MC | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/317430/ignacio-agustin-rodriguez)<br>[fotmob.com](https://www.fotmob.com/players/1244348) |
| Primera | Belgrano | Thiago Cortes | MED / LD | MED / MC (a confirmar) | La única ficha encontrada (Cancha Llena) lo da como mediocampista; no hay fuente para LD | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/thiago-cortes-2u3ged5k6xpkt41itcl6ibnkk/) |
| Primera Nacional | Chacarita Jrs. | Lorenzo Brun | MED / DC | DEL / DC o MED / MC | ESPN y Fichajes: delantero; Soccerway y LiveSoccerTV: mediocampista | [africa.espn.com](https://africa.espn.com/football/player/_/id/382879/lorenzo-brun)<br>[cl.soccerway.com](https://cl.soccerway.com/jugador/brun-lorenzo/27RG2Gvo) |
| Primera Nacional | Chaco For Ever | Brian García | DEF / MC | sin propuesta | No se encontró ninguna ficha de un Brian García en Chaco For Ever (solo Brian Guerra, otro jugador). Revisar si el nombre es correcto | [mx.soccerway.com](https://mx.soccerway.com/jugador/guerra-brian/E7yn5Yfs) |
| Primera Nacional | Chaco For Ever | Ezequiel Pacheco | MED / DC | DEL / DC (a confirmar) | FotMob: delantero, con 3 goles en 2026; ESPN y Fichajes: mediocampista | [fotmob.com](https://www.fotmob.com/es/players/1904737)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/418995/ezequiel-pacheco) |
| Primera Nacional | Chaco For Ever | Santiago Villalba | MED / SD | DEL / SD o DC (a confirmar) | LiveSoccerTV: delantero; ESPN: mediocampista | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/364831/santiago-villalba)<br>[livesoccertv.com](https://www.livesoccertv.com/ru/player/s-villalba/934963/) |
| Primera Nacional | Estudiantes (BA) | Fernando Duré | MED / LD | DEF / LD o MED / MC (a confirmar) | FotMob: lateral derecho; ESPN: mediocampista | [fotmob.com](https://www.fotmob.com/es/players/1524137)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/378753/fernando-dure) |
| Primera Nacional | Estudiantes (BA) | Teo Cohen | MED / DC | MED / MC o DEL / DC (a confirmar) | ESPN, FotMob y Fichajes: mediocampista; Sofascore y Statshub: delantero | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/399754/teo-cohen)<br>[fotmob.com](https://www.fotmob.com/sv/players/1756452/teo-cohen)<br>[statshub.com](https://statshub.com/player/teo-cohen/1131315) |
| Primera Nacional | Almagro | Julián Vitale | MED / DFC | MED / MC o DEF / DFC (a confirmar) | ESPN, Wikipedia y Cancha Llena: mediocampista; FotMob: defensor central | [en.wikipedia.org](https://en.wikipedia.org/wiki/Juli%C3%A1n_Vitale)<br>[fotmob.com](https://www.fotmob.com/players/645347) |
| Primera Nacional | Mitre (SdE) | Martín Vázquez | DEF / MC | a confirmar | ESPN: defensor; figura entre los máximos asistidores del club, lo que sugiere un rol más ofensivo | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/418933/martin-vazquez) |
| Primera Nacional | San Martín (SJ) | Gonzalo Lucero | MED / LI | DEF / LI (secundaria MI) o MED (a confirmar) | EA FC 26: LI con MI de alternativa; Soccerway: defensor; ESPN y La Nación: mediocampista | [ea.com](https://www.ea.com/es/games/ea-sports-fc/ratings/player-ratings/gonzalo-matias-lucero/76903)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/gonzalo-lucero-1khp1t5w8wcv14job4ffy6syc/) |
| Primera Nacional | Güemes | Walter Juárez | DEF / MC | a confirmar | ESPN, LiveSoccerTV y Fussballtransfers: mediocampista; Worldfootball y Soccerway: defensor | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/379686/walter-juarez)<br>[worldfootball.net](https://www.worldfootball.net/player_summary/walter-juarez/) |
| Primera Nacional | Racing (Cba.) | Catriel Peña | DEF / ED | MED / MC (a confirmar) | Una sola fuente (FootyStats: Central Midfield). Ni el grupo DEF ni el rol ED tienen respaldo | [footystats.org](https://footystats.org/players/argentina/catriel-pena)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/419245/catriel-pena) |
| Primera Nacional | C. de Bolívar | Agustín Paredes | MED / LD | DEF / LD o MED (a confirmar) | FotMob: lateral derecho; ESPN y Cancha Llena: mediocampista | [fotmob.com](https://www.fotmob.com/players/1644859)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/agustin-paredes-7op6sq9axiqp5k4sjmtlumo7o/) |
| Primera Nacional | Agropecuario | Federico Pérez | MED / LD | DEF / LD o MED (a confirmar) | FotMob: lateral derecho; ESPN: mediocampista | [fotmob.com](https://www.fotmob.com/fr/players/1606721/federico-perez)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/379731/federico-perez) |
| Primera Nacional | Patronato | Facundo Díaz | MED / DFC | a confirmar | ESPN: mediocampista; FotMob: defensor central | [espn.com](https://www.espn.com/soccer/player/bio/_/id/260679/facundo-diaz)<br>[fotmob.com](https://www.fotmob.com/uk/players/1378714/facundo-diaz) |
| Primera Nacional | Patronato | Santiago Piccioni | MED / DFC | a confirmar (DFC con secundaria MC, o al revés) | Cancha Llena y ESPN: mediocampista; FotMob y Soccerway: defensor; Statscrew: central y mediocentro | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/santiago-piccioni-dvzuwr4m1xv4flm8ple5h2gpg/)<br>[statscrew.com](https://www.statscrew.com/worldfootball/stats/p-piccisan001)<br>[fotmob.com](https://www.fotmob.com/fr/players/1372168) |
| Primera Nacional | Alte. Brown | Pedro Velurtas | MED / LD | a confirmar | ESPN: mediocampista; Soccerway: defensor | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/330574/pedro-velurtas)<br>[us.soccerway.com](https://us.soccerway.com/player/velurtas-pedro/KKNPm2VR/) |
| Primera Nacional | Quilmes | Nicolás Colazo | DEF / ED | DEF / lateral o carrilero (lado a confirmar) | La mayoría lo da como defensor (Cancha Llena, Statshub) y carrilero (FootballTransfers); Wikipedia: extremo; Crónica: volante | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/nicolas-colazo-7qz5lqvjgp6by6xrwgyf58g5x/)<br>[en.wikipedia.org](https://en.wikipedia.org/wiki/Nicol%C3%A1s_Colazo)<br>[statshub.com](https://statshub.com/player/nicolas-colazo/2952) |
| Primera Nacional | Quilmes | Tiago Marghetich | DEF / MCD | a confirmar | Fichajes y ESPN Argentina: defensor; Soccerway: mediocampista | [fichajes.com](https://www.fichajes.com/jugador/tiago-marghetich/)<br>[es.soccerway.com](https://es.soccerway.com/jugador/marghetich-tiago/l2GAxqpg) |
| Primera Nacional | Quilmes | Agustín Lavezzi | MED / DC | a confirmar | Cancha Llena, Wikipedia y ESPN: mediocampista; Soccerway y FotMob: delantero centro | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/agustin-lavezzi-adrmz8qbbfr4i1zsc2qwr460a/)<br>[fotmob.com](https://www.fotmob.com/fr/players/1216346/agustin-lavezzi) |
| Primera Nacional | Godoy Cruz | Misael Sosa | MED / DC | DEL / SD o EI/ED (a confirmar) | ESPN y Fichajes: mediocampista; FootyStats: segundo delantero; Godoy Cruz lo presentó como delantero; en Perú jugó de extremo | [footystats.org](https://footystats.org/players/argentina/misael-sosa)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/379691/misael-sosa)<br>[exitosanoticias.pe](https://www.exitosanoticias.pe/deportes/es-oficial-sporting-cristal-despidio-extremo-argentino-misael-sosa-tras-siete-meses-n155534/amp) |
| Primera Nacional | San Miguel | Leandro Ortiz | MED / DFC | a confirmar | ESPN 2026: mediocampista; Soccerway: defensa | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/141079/leandro-ortiz)<br>[es.soccerway.com](https://es.soccerway.com/jugador/ortiz-leandro/WM16LDce) |
| Primera Nacional | Acassuso | David Escalante | MED / DC | a confirmar (MED / MC o DEL / DC) | Fuentes recientes (Cancha Llena, ESPN, FotMob 2026): mediocampista; Wikipedia y un FotMob anterior (15 goles en la B Metro 2025): delantero | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/david-escalante-8pkifbn41qhg6zsfp5584q95h/)<br>[en.wikipedia.org](https://en.wikipedia.org/wiki/David_Escalante)<br>[fotmob.com](https://www.fotmob.com/es/players/558365/david-escalante) |
| Primera Nacional | Acassuso | Lázaro Romero | MED / DC | DEL / DC (a confirmar) | Wikipedia, Soccerway y FotMob: delantero; Cancha Llena y ESPN: mediocampista | [en.wikipedia.org](https://en.wikipedia.org/wiki/L%C3%A1zaro_Romero)<br>[fotmob.com](https://www.fotmob.com/players/845715)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/lazaro-romero-5hf0odjanci45xs2dyfbpeq5l/) |
| Primera Nacional | Atl. Rafaela | Nahuel Cainelli | MED / LD | MED / MC con secundaria LD (a confirmar) | La Nación, ESPN y Footmercato: mediocampista; FotMob: lateral derecho; Soccerway: delantero | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/nahuel-cainelli-2lxgs37wf9esfawiek3h1i2ju/)<br>[fotmob.com](https://www.fotmob.com/players/937100/nahuel-cainelli)<br>[footmercato.net](https://www.footmercato.net/joueur/nahuel-adriel-cainelli/) |
| Primera Nacional | Atl. Rafaela | Ulises Yegros | MED / DFC | a confirmar | Fichajes, ESPN y Globalsportsarchive: mediocampista; AiScore y Soccerway (datos de su etapa en Almagro): defensor central | [fichajes.com](https://www.fichajes.com/jugador/ulises-yegros/)<br>[aiscore.com](https://www.aiscore.com/player-/8lk2di1pydlco73)<br>[globalsportsarchive.com](https://globalsportsarchive.com/en/soccer/athlete/ulises-yegros/7795792/career) |
| Primera Nacional | Quilmes | Ulises Vera | MED / EI | MED / MI o MC (a confirmar) | ESPN y Fichajes: mediocampista; FotMob: volante central en una versión y volante por izquierda en otra | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/358117/ulises-vera)<br>[fotmob.com](https://www.fotmob.com/es/players/1442707) |
| Primera | Argentinos Jrs. | Hernán López Muñoz | DEL / MO | MED / MO o DEL / ED (a confirmar); secundarias ED/MC/MO | FotMob: extremo derecho, con MC y MO de otras posiciones; Wikipedia: mediapunta; ESPN y Tuttosport: mediocampista | [fotmob.com](https://www.fotmob.com/es/players/1037535/hernan-lopez)<br>[en.wikipedia.org](https://en.wikipedia.org/wiki/Hern%C3%A1n_L%C3%B3pez_(footballer)) |
| Federal A | Círculo Deportivo | Ian Norberto | MED / ED | a confirmar | Un perfil lo da como mediocampista; la nómina de La Nación lo lista entre los defensores | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/equipo/circulo-deportivo-5gbyhtnjrpffvujd54ltl0xp4/) |
| Federal A | Sp. Las Parejas | Gonzalo Schönfeld | DEL / DC | a confirmar | Soccerway: delantero; Cancha Llena y FCUpdate: mediocampista | [es.soccerway.com](https://es.soccerway.com/jugador/schonfeld-gonzalo/zm2sRTnt)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/gonzalo-schonfeld-354ppyf9fismxmdkwfwq6gaac/) |
| Federal A | Def. P. Vilelas | Juan Carlos Molina | DEF / DFC | sin datos | No se encontró ninguna ficha futbolística | — |

### F.3 Otros casos dudosos detectados en los datos (sin verificación externa)

- **Arqueros:** Ituzaingó (B Metro) tiene 1 arquero. Con un solo arquero, el juego no tiene suplente natural.
- **Clubes sin lateral izquierdo o sin lateral derecho** (sin contar Primera C y Promocional): 20.

| División | Club | LI | LD |
|---|---|---:|---:|
| Primera | Banfield | 1 | 0 |
| Primera | Defensa y J. | 0 | 0 |
| Primera | Tigre | 1 | 0 |
| Primera Nacional | Ferro | 0 | 3 |
| B Metro | Camioneros | 0 | 2 |
| B Metro | Dep. Armenio | 2 | 0 |
| B Metro | Ituzaingó | 0 | 2 |
| B Metro | Talleres (RE) | 1 | 0 |
| B Metro | Villa S. Carlos | 0 | 1 |
| Federal A | Argentino (MM) | 0 | 0 |
| Federal A | Atenas (RC) | 1 | 0 |
| Federal A | Círculo Deportivo | 2 | 0 |
| Federal A | Def. P. Vilelas | 0 | 0 |
| Federal A | Gimnasia (CdU) | 0 | 0 |
| Federal A | Guillermo Brown | 2 | 0 |
| Federal A | Kimberley | 0 | 0 |
| Federal A | Sarmiento (R) | 0 | 0 |
| Federal A | Sp. Las Parejas | 0 | 0 |
| Federal A | Tucumán Central | 3 | 0 |
| Federal A | Villa Mitre | 0 | 0 |

Los 7 clubes de la tanda 4 de Federal A aparecen por D3. Defensa y Justicia, en Primera, no tiene ni LI ni LD: conviene revisarlo.

## G. Diferencias entre archivos fuente y planteles del juego (categoría D)

### D1 — El importador descarta las posiciones secundarias específicas
- `import-squads.js` hace `player.alt = posiciones_secundarias.split(/[;|]/).map(x => POS[x])`, donde `POS` es el mapa de **grupos** (POR, DEF, MED, DEL y sinónimos; incluye MC, MCD y MO como «MED»).
- Un valor como `LI`, `ED`, `SD`, `DFC`, `MI` o `MP` no está en `POS` y **se descarta**; `MC` se convierte en `MED`.
- `roleFit` (`public/data.js`) compara `alt` contra el puesto exacto del casillero (por ejemplo, `LI`), así que una secundaria «MED» nunca coincide.
- **Resultado:** las secundarias no tienen ningún efecto en el juego. En origen hay 6 valores en todo el proyecto, todos en Primera Nacional: `MCO` (no es un rol soportado), `MC`, `EI`, `MD,EI` (separado por coma, que el importador no divide), `MO` y `MCD`. En el juego quedaron 3, todas «MED».

### D2 — Primera C y Promocional sin puesto específico
- 839 (Primera C) + 518 (Promocional) jugadores tienen solo grupo. Los CSV de Promocional ni siquiera tienen la columna `rol_especifico`, y los de Primera C la tienen vacía.
- En el juego, `autoXI` asigna estos jugadores a los casilleros exactos (LI, ED, MCD…) sin ningún criterio de puesto: solo media y grupo.
- Lista por club en el Anexo 2.

### D3 — Federal A, tanda 4: puestos aplanados
- 199 jugadores, solo DFC/MC/DC (Anexo 3). Es estadísticamente imposible para 7 planteles reales; se cargaron por defecto por grupo.
- La muestra verificada (10) no encontró errores de grupo, pero sí 2 nombres dudosos y 1 jugador sin datos; los puestos exactos (lateral, MCD, extremo) no se pueden confirmar sin la ficha FM.

### D4 — Grupo incoherente con el puesto específico (241 en CSV; 237 en el juego)

| División | Casos |
|---|---:|
| Primera | 44 |
| Primera Nacional | 144 |
| B Metro | 12 |
| Federal A | 41 |
| Primera C | 0 |
| Promocional | 0 |

Tipos:
- **Cruces de línea (77)**, por ejemplo MED→DC, MED→LD, DEF→MC o DEL→MC. Se verificaron todos: 35 A y 42 C (ver D y F).
- **Convención (164)**: extremos EI/ED con grupo MED (139) y MO/MP con grupo DEL (25). En la muestra de 10: 4 errores confirmados (incluidos «extremos» que en realidad son volantes o laterales), 5 dudosos, 1 posible duplicado y **ningún caso confirmado como extremo bien cargado**. No es una convención inofensiva.
- **Efecto en el motor:**
  - `autoXI` multiplica la valoración por 0,8 cuando el grupo del jugador no coincide con el del casillero.
  - `mkAt` genera atributos con el perfil del grupo.
  - Un EI con grupo MED juega en un casillero DEL (EI/ED pertenecen al grupo DEL en `roleGroup`) con penalización y atributos de volante.

Lista completa en el Anexo 1.

### D5 — CSV distinto del juego
- **Primera Nacional:** 21 filas del CSV no están en el juego; 8 jugadores del juego no están en el CSV; 1 con puesto distinto.
  - En el CSV y no en el juego: All Boys: Cristo Lozada Echenique; San Martín (T): Juan Jaime; San Martín (T): Alejandro Galván; Tristán Suárez: Renzo Conechny; Alte. Brown: Gastón Moreyra; Gimnasia y Tiro: Tiago Banega; Gimnasia y Tiro: Juan Rocca; Gimnasia y Tiro: Juan Capano; Gimnasia y Tiro: Fabricio Rojas; Gimnasia y Tiro: Jonás Aguirre; Quilmes: Gonzalo Marinelli; Quilmes: Agustín Ortega; Godoy Cruz: Nicolás Claa; Godoy Cruz: Camilo Alessandria; Godoy Cruz: Leandro Quiroz; Godoy Cruz: Ezequiel Tejada; Godoy Cruz: Bautista Cejas; Godoy Cruz: Gonzalo Quinteros; Godoy Cruz: Bruno Barrionuevo; Godoy Cruz: Antonio Guerrero; Def. de Belgrano: Dilan Acosta.
  - En el juego y no en el CSV (probables nombres corregidos en el CSV y no reimportados): Tristán Suárez: Rodrigo Conechny; Gimnasia y Tiro: Tomás Banega; Gimnasia y Tiro: Joaquín Rocca; Gimnasia y Tiro: Joaquín Capano; Gimnasia y Tiro: Franco Rojas; Gimnasia y Tiro: Javier Aguirre; Quilmes: Gastón Marinelli; Quilmes: Tomás Ortega.
  - Puesto distinto: Quilmes: Thomas Ortega (CSV MC, juego LD).
- **Federal A:** 1 filas del CSV no están en el juego; 1 jugadores del juego no están en el CSV; 0 con puesto distinto.
  - En el CSV y no en el juego: Cipolletti: Máximo Ramos.
  - En el juego y no en el CSV (probables nombres corregidos en el CSV y no reimportados): Cipolletti: Maximiliano Ramos.
- El resto de las divisiones coincide al 100 % entre CSV y juego en nombres, grupo y puesto.

### D6 — Nombres no encontrados en ninguna fuente (21)
Ver F.1. 18 de los 21 son de Primera Nacional y su fuente de rol en el CSV es `pelotita.com.ar`; 1 es de Primera Nacional con fuente Transfermarkt y 2 de Federal A (tanda 4). Sugiere errores de nombre en la carga; no se corrigieron porque son datos reales de plantel.

### D7 — Posible jugador duplicado
- «Santiago Villalba» (Chaco For Ever, `bloque2.csv`) y «Santiago Ariel Villalba» (Almirante Brown, `bloque4.csv`) comparten el mismo perfil de Soccerway (`Kx3Dkw4r`) y de ESPN (`364831`), y ambos figuran con 22 años.
- Según Soccerway, estuvo a préstamo en Almirante Brown hasta el 31/12/2025 y en 2026 juega en Chaco For Ever. Probablemente está cargado en dos clubes.

### D8 — Vocabulario de roles inconsistente
- La columna `rol` usa a la vez etiquetas genéricas («DEF», «Defensor», «ARQ») y específicas («DFC», «LI»). Valores fuera del vocabulario del motor en origen: `MCO` en secundarias.
- Separador de secundarias inconsistente: `;`, `|` y `,`; el importador solo reconoce los dos primeros.
- En Primera C y Promocional el arquero es `ARQ`; en las demás divisiones, `POR`. El importador lo normaliza, pero conviene unificarlo.

### D9 — Roles cargados que ninguna formación usa (MP y LIB)
- Los casilleros exactos de las 14 formaciones × 3 estilos solo usan: DC, DFC, ED, EI, LD, LI, MC, MCD, MD, MI, MO, POR, SD. **MP y LIB no existen en ningún casillero.**
- Hay 73 jugadores con MP (Primera Nacional 14, B Metro 20, Federal A 39) y 1 con LIB.
- `roleFit` les da −5 en cualquier casillero (mismo grupo, distinto puesto), mientras que un MO recibe +2,5 en un casillero MO. Un mediapunta cargado como MP queda sistemáticamente subvalorado en la alineación automática.
- **Solución técnica:** tratar MP como MO (o agregar MP como alternativa de MO en `roleFit`). Requiere decisión, porque toca el motor.

## H. Ranking de divisiones más afectadas

Jugadores con al menos un problema de posición detectado (D2, D3, D4, D5 o D9; sin contar la falta general de secundarias, que afecta a todos):

| Puesto | División | Afectados | % del CSV | Problema principal |
|---:|---|---:|---:|---|
| 1 | Primera C | 839 | 100,0 % | Sin puesto específico (D2) |
| 2 | Promocional Amateur | 518 | 100,0 % | Sin puesto específico (D2) |
| 3 | Federal A | 280 | 31,7 % | Tanda 4 aplanada (D3), extremos con grupo MED (D4), MP sin casillero (D9) |
| 4 | Primera Nacional | 172 | 16,6 % | Grupo incoherente (D4), nombres dudosos (D6), CSV distinto del juego (D5) |
| 5 | Primera B Metropolitana | 31 | 5,8 % | MP sin casillero (D9), extremos con grupo MED (D4) |
| 6 | Primera División | 44 | 4,3 % | Grupo incoherente (D4), errores puntuales (A) |

## I. Estimación del total de correcciones necesarias

| Bloque | Cantidad | Tipo de corrección | Estado |
|---|---:|---|---|
| Errores de posición principal confirmados | 39 | Cambiar grupo y/o puesto | Listos para aplicar con tu autorización (D) |
| Cruces de línea dudosos | 42 | Verificar y luego corregir; 19 requieren primero confirmar la identidad | Pendiente de fuente (F) |
| Casos de convención no verificados | 154 | Revisar uno por uno; estimado 49–98 errores reales (por la muestra) | Sin verificar |
| Federal A, tanda 4 aplanada | 199 | Reasignar el puesto exacto (lateral, MCD, MO, extremo…) | Requiere ficha FM por club |
| Primera C y Promocional sin puesto específico | 1.357 | Asignar puesto específico | Requiere fuente por jugador |
| Jugadores con MP o LIB sin casillero | 74 | Decisión de motor (MP como MO) o cambio de dato | Decisión tuya |
| CSV distinto del juego | 23 | Reimportar Primera Nacional y Federal A (sin tocar datos) | Técnica |
| Importador de secundarias (D1) | 1 cambio de código | Mapear puestos específicos y aceptar «,» | Técnica, previa a cargar secundarias |
| Secundarias faltantes | hasta 4.808 | Cargar solo las que tengan fuente | Requiere fuente por jugador |

**Orden de magnitud:** hasta unas 378 correcciones puntuales de posición principal en las divisiones con puestos cargados, más 1.357 asignaciones nuevas en Primera C y Promocional, más las secundarias que se puedan documentar.

### Orden de corrección sugerido
1. **D1** (importador): sin esto, ninguna secundaria sirve.
2. **D5 y D7**: reimportar Primera Nacional y Federal A desde sus CSV y resolver el duplicado Villalba.
3. **F.1 (identidad)**: confirmar los nombres dudosos antes de tocar posiciones.
4. **Los 39 errores A**: es un cambio de dato en el CSV; luego se reimporta.
5. **D9** (MP/LIB): decisión de motor.
6. **D3** (tanda 4) y la convención de extremos (D4), con la ficha FM por club.
7. **D2** (Primera C y Promocional), por tandas de clubes.

---

## Anexo 1 — Lista completa de grupo incoherente con el puesto (D4, 241)

| División | Club | Jugador | Grupo | Puesto | Tipo | Verificado |
|---|---|---|---|---|---|---|
| Primera | Argentinos Jrs. | Gastón Bouhier | MED | DC | cruce de línea | A |
| Primera | Argentinos Jrs. | Joaquín Gho | DEL | MC | cruce de línea | A |
| Primera | Argentinos Jrs. | Hernán López Muñoz | DEL | MO | convención | C |
| Primera | Atl. Tucumán | Gabriel Compagnucci | MED | LD | cruce de línea | A |
| Primera | Atl. Tucumán | Franco Nicola | MED | ED | convención | — |
| Primera | Atl. Tucumán | Martín Benítez | DEL | MO | convención | — |
| Primera | Banfield | Neyder Moreno | MED | EI | convención | — |
| Primera | Barracas Central | Tomás Lavezzi | MED | ED | convención | — |
| Primera | Barracas Central | Mateo Coronel | MED | ED | convención | — |
| Primera | Belgrano | Thiago Cortes | MED | LD | cruce de línea | C |
| Primera | Belgrano | Marcos Ortiz | MED | DFC | cruce de línea | A |
| Primera | Boca Juniors | Alan Velasco | MED | EI | convención | — |
| Primera | Boca Juniors | Malcom Braida | MED | LI | cruce de línea | A |
| Primera | Central Cba. (SdE) | Horacio Tijanovich | MED | EI | convención | — |
| Primera | Dep. Riestra | Ángel Stringa | MED | EI | convención | — |
| Primera | Gimnasia (LP) | Nicolás Barros Schelotto | MED | LD | cruce de línea | A |
| Primera | Gimnasia (LP) | Facundo Di Biasi | MED | DFC | cruce de línea | A |
| Primera | Gimnasia (M) | Luciano Cingolani | MED | EI | convención | — |
| Primera | Gimnasia (M) | Facundo Lencioni | MED | EI | convención | — |
| Primera | Huracán | Thiago Pérez | DEF | MCD | cruce de línea | A |
| Primera | Huracán | Thaiel Peralta | DEL | MO | convención | — |
| Primera | Indep. Rivadavia | Alessandro Riep | MED | EI | convención | — |
| Primera | Indep. Rivadavia | Rodrigo Atencio | DEL | MO | convención | — |
| Primera | Independiente | Maximiliano Meza | MED | ED | convención | — |
| Primera | Instituto | Jonás Acevedo | MED | EI | convención | — |
| Primera | Lanús | Marcelino Moreno | DEL | MO | convención | A |
| Primera | Newell's | Mateo García | MED | ED | convención | — |
| Primera | Newell's | Facundo Guch | MED | EI | convención | — |
| Primera | Platense | Guido Mainero | MED | ED | convención | — |
| Primera | Racing Club | Ignacio Rodríguez | DEF | MC | cruce de línea | C |
| Primera | Racing Club | Valentín Carboni | DEL | MO | convención | — |
| Primera | River Plate | Lautaro Pereyra | DEL | MO | convención | — |
| Primera | Rosario Central | Jaminton Campaz | MED | EI | convención | — |
| Primera | Rosario Central | Franco Cervi | MED | EI | convención | — |
| Primera | Rosario Central | Giovanni Cantizano | MED | EI | convención | — |
| Primera | Rosario Central | Paolo Giaccone | MED | ED | convención | — |
| Primera | Rosario Central | Alan Rodríguez | MED | LI | cruce de línea | A |
| Primera | San Lorenzo | Nahuel Barrios | MED | EI | convención | — |
| Primera | San Lorenzo | Juan Pablo Álvarez | MED | EI | convención | — |
| Primera | San Lorenzo | Matías Reali | MED | EI | convención | — |
| Primera | Sarmiento (J) | Santiago Salle | MED | ED | convención | — |
| Primera | Unión (SF) | Brahian Cuello | MED | EI | convención | — |
| Primera | Unión (SF) | Franco Fragapane | MED | EI | convención | — |
| Primera | Vélez | Matías Pellegrini | MED | EI | convención | — |
| Primera Nacional | Acassuso | David Escalante | MED | DC | cruce de línea | C |
| Primera Nacional | Acassuso | Lázaro Romero | MED | DC | cruce de línea | C |
| Primera Nacional | Acassuso | David de Estéfano | DEL | MC | cruce de línea | A |
| Primera Nacional | Acassuso | Kevin Dubini | DEL | MC | cruce de línea | A |
| Primera Nacional | Acassuso | Juan Ignacio Quattrocchi | DEL | MP | convención | — |
| Primera Nacional | Agropecuario | Ezequiel Aguirre | DEF | ED | cruce de línea | C |
| Primera Nacional | Agropecuario | Federico Pérez | MED | LD | cruce de línea | C |
| Primera Nacional | Agropecuario | Joaquín Heritier | MED | EI | convención | — |
| Primera Nacional | Agropecuario | Marcos Millanes | MED | EI | convención | — |
| Primera Nacional | Agropecuario | Ramiro Castro | MED | ED | convención | — |
| Primera Nacional | Agropecuario | Santiago Gallucci | MED | EI | convención | — |
| Primera Nacional | Agropecuario | Ramiro Mosqueira | DEL | MO | convención | — |
| Primera Nacional | All Boys | Emiliano Purita | MED | ED | convención | — |
| Primera Nacional | All Boys | Tomás Calone | MED | ED | convención | — |
| Primera Nacional | All Boys | Ignacio Palacio | MED | EI | convención | — |
| Primera Nacional | Almagro | Federico Bustamante | MED | EI | convención | — |
| Primera Nacional | Almagro | Julián Vitale | MED | DFC | cruce de línea | C |
| Primera Nacional | Alte. Brown | Tomás Villoldo | DEF | EI | cruce de línea | A |
| Primera Nacional | Alte. Brown | Leonardo Jara | DEF | ED | cruce de línea | A |
| Primera Nacional | Alte. Brown | Rodrigo Fernández | DEF | EI | cruce de línea | C |
| Primera Nacional | Alte. Brown | Pedro Velurtas | MED | LD | cruce de línea | C |
| Primera Nacional | Alte. Brown | Ramón González Herrero | DEL | MO | convención | — |
| Primera Nacional | Alte. Brown | Santiago Ariel Villalba | DEL | MP | convención | D |
| Primera Nacional | Atl. Rafaela | Nahuel Cainelli | MED | LD | cruce de línea | C |
| Primera Nacional | Atl. Rafaela | Ulises Yegros | MED | DFC | cruce de línea | C |
| Primera Nacional | Atl. Rafaela | Joel Bonifacio | MED | DC | cruce de línea | A |
| Primera Nacional | Atl. Rafaela | Federico Jourdan | MED | ED | convención | — |
| Primera Nacional | Atl. Rafaela | Juan Cavallaro | MED | EI | convención | — |
| Primera Nacional | Atlanta | Federico Álvarez | DEL | MO | convención | — |
| Primera Nacional | Atlanta | Braian Rivero | MED | ED | convención | — |
| Primera Nacional | Atlanta | Ignacio Rodríguez | DEL | MO | convención | — |
| Primera Nacional | C. de Bolívar | Franco Mucignat | DEF | ED | cruce de línea | C |
| Primera Nacional | C. de Bolívar | Nicolás Yeri | DEF | MC | cruce de línea | C |
| Primera Nacional | C. de Bolívar | Agustín Paredes | MED | LD | cruce de línea | C |
| Primera Nacional | C. de Bolívar | Matías Gutiérrez | MED | EI | convención | C |
| Primera Nacional | C. de Bolívar | Tomás Fernández | MED | LD | cruce de línea | C |
| Primera Nacional | Central Norte | Matías Moravec | MED | EI | convención | — |
| Primera Nacional | Central Norte | Tomás Castro | MED | ED | convención | — |
| Primera Nacional | Chacarita Jrs. | Tomás Pérez Serra | MED | ED | convención | — |
| Primera Nacional | Chacarita Jrs. | Brian Calderara | MED | EI | convención | — |
| Primera Nacional | Chacarita Jrs. | Lucas Bustos | MED | EI | convención | — |
| Primera Nacional | Chacarita Jrs. | Cristian Guanca | MED | EI | convención | — |
| Primera Nacional | Chacarita Jrs. | Lorenzo Brun | MED | DC | cruce de línea | C |
| Primera Nacional | Chacarita Jrs. | Francisco Cristaldo | DEL | MO | convención | A |
| Primera Nacional | Chacarita Jrs. | Mauricio Cuero | DEL | MO | convención | — |
| Primera Nacional | Chaco For Ever | Brian García | DEF | MC | cruce de línea | C |
| Primera Nacional | Chaco For Ever | Agustín Ojeda | MED | LI | cruce de línea | A |
| Primera Nacional | Chaco For Ever | Enzo Gaggi | MED | ED | convención | — |
| Primera Nacional | Chaco For Ever | Ezequiel Pacheco | MED | DC | cruce de línea | C |
| Primera Nacional | Chaco For Ever | Santiago Villalba | MED | SD | cruce de línea | C |
| Primera Nacional | Colón | Cristian Ibarra | DEF | MC | cruce de línea | C |
| Primera Nacional | Colón | Matías Córdoba | MED | DC | cruce de línea | A |
| Primera Nacional | Colón | Matías Muñoz | MED | ED | convención | — |
| Primera Nacional | Colón | Darío Sarmiento | DEL | MC | cruce de línea | A |
| Primera Nacional | Dep. Maipú | Tomás Silva | MED | EI | convención | — |
| Primera Nacional | Dep. Morón | Mariano Bíttolo | DEF | EI | cruce de línea | A |
| Primera Nacional | Dep. Morón | Ezequiel Contreras | MED | ED | convención | — |
| Primera Nacional | Dep. Morón | Facundo Fagúndez | MED | DC | cruce de línea | C |
| Primera Nacional | Dep. Morón | Gastón González | MED | ED | convención | — |
| Primera Nacional | Dep. Morón | Santiago Kubiszyn | MED | ED | convención | — |
| Primera Nacional | Dep. Morón | Gonzalo Berterame | DEL | MO | convención | — |
| Primera Nacional | Estudiantes (BA) | Fernando Duré | MED | LD | cruce de línea | C |
| Primera Nacional | Estudiantes (BA) | Lucas Silva | MED | EI | convención | — |
| Primera Nacional | Estudiantes (BA) | Matías Núñez | MED | DC | cruce de línea | A |
| Primera Nacional | Estudiantes (BA) | Rodrigo Iñaki Melo | MED | ED | convención | — |
| Primera Nacional | Estudiantes (BA) | Teo Cohen | MED | DC | cruce de línea | C |
| Primera Nacional | Estudiantes (BA) | Ian Vera | DEL | MP | convención | — |
| Primera Nacional | Estudiantes (BA) | Jorge Correa | DEL | MP | convención | — |
| Primera Nacional | Ferro | Lucas Marra | MED | EI | convención | — |
| Primera Nacional | Gimnasia (J) | Emiliano Zambrano | MED | ED | convención | — |
| Primera Nacional | Gimnasia (J) | Francisco Maidana | MED | EI | convención | — |
| Primera Nacional | Gimnasia (J) | Francisco Molina | MED | EI | convención | — |
| Primera Nacional | Gimnasia (J) | Hugo Soria | MED | ED | convención | — |
| Primera Nacional | Gimnasia (J) | Juan Franzoni | DEL | MC | cruce de línea | A |
| Primera Nacional | Gimnasia (J) | Mauro Cachi | DEL | MO | convención | — |
| Primera Nacional | Gimnasia y Tiro | Rubén Villarreal | MED | LI | cruce de línea | A |
| Primera Nacional | Gimnasia y Tiro | Tiago Banega | MED | EI | convención | — |
| Primera Nacional | Gimnasia y Tiro | Franco Sivetti | MED | ED | convención | — |
| Primera Nacional | Gimnasia y Tiro | Juan Capano | DEL | MO | convención | — |
| Primera Nacional | Gimnasia y Tiro | Fabricio Rojas | DEL | MO | convención | — |
| Primera Nacional | Godoy Cruz | Vicente Poggi | MED | ED | convención | — |
| Primera Nacional | Godoy Cruz | Santiago Martínez | MED | DC | cruce de línea | A |
| Primera Nacional | Godoy Cruz | Agustín Guerrero | MED | EI | convención | — |
| Primera Nacional | Godoy Cruz | Misael Sosa | MED | DC | cruce de línea | C |
| Primera Nacional | Godoy Cruz | Antonio Guerrero | MED | EI | convención | — |
| Primera Nacional | Güemes | Alan Bordón | MED | LD | cruce de línea | C |
| Primera Nacional | Güemes | Joaquín Carranza | MED | EI | convención | — |
| Primera Nacional | Güemes | Lucas Guiñazú Fernández | DEF | MC | cruce de línea | A |
| Primera Nacional | Güemes | Matías Gerez | MED | ED | convención | — |
| Primera Nacional | Güemes | Ramiro Arnay | MED | LI | cruce de línea | C |
| Primera Nacional | Güemes | Santiago Farrera | MED | EI | convención | — |
| Primera Nacional | Güemes | Walter Juárez | DEF | MC | cruce de línea | C |
| Primera Nacional | Los Andes | Tomás Díaz | MED | ED | convención | — |
| Primera Nacional | Los Andes | Ariel Valdez Chamorro | MED | EI | convención | — |
| Primera Nacional | Los Andes | Federico Villarreal | MED | ED | convención | C |
| Primera Nacional | Midland | Matías Abbruzzese | MED | EI | convención | — |
| Primera Nacional | Midland | Uriel Guzmán | DEL | MO | convención | — |
| Primera Nacional | Mitre (SdE) | Martín Vázquez | DEF | MC | cruce de línea | C |
| Primera Nacional | Nueva Chicago | Ramiro Balbuena | MED | EI | convención | — |
| Primera Nacional | Nueva Chicago | Alan Ruiz | MED | SD | cruce de línea | A |
| Primera Nacional | Nueva Chicago | Maximiliano Rogoski | MED | ED | convención | — |
| Primera Nacional | Patronato | Julián Salas | DEF | ED | cruce de línea | C |
| Primera Nacional | Patronato | Agustín Miró | MED | ED | convención | A |
| Primera Nacional | Patronato | Bruno Bravo | MED | LD | cruce de línea | C |
| Primera Nacional | Patronato | Facundo Díaz | MED | DFC | cruce de línea | C |
| Primera Nacional | Patronato | Gonzalo Salega | MED | ED | convención | — |
| Primera Nacional | Patronato | Matías Rueda | MED | LD | cruce de línea | C |
| Primera Nacional | Patronato | Santiago Piccioni | MED | DFC | cruce de línea | C |
| Primera Nacional | Patronato | Valentín Pereyra | MED | EI | convención | — |
| Primera Nacional | Patronato | Facundo Heredia | DEL | LI | cruce de línea | A |
| Primera Nacional | Quilmes | Nicolás Colazo | DEF | ED | cruce de línea | C |
| Primera Nacional | Quilmes | Tiago Marghetich | DEF | MCD | cruce de línea | C |
| Primera Nacional | Quilmes | Thomas Ortega | DEF | MC | cruce de línea | A |
| Primera Nacional | Quilmes | Agustín Lavezzi | MED | DC | cruce de línea | C |
| Primera Nacional | Quilmes | Gonzalo Vega | MED | ED | convención | — |
| Primera Nacional | Quilmes | Joaquín Yangali | MED | ED | convención | — |
| Primera Nacional | Quilmes | Ramiro Martínez | MED | ED | convención | — |
| Primera Nacional | Quilmes | Ulises Vera | MED | EI | convención | C |
| Primera Nacional | Quilmes | Agustín Batista | DEL | MC | cruce de línea | C |
| Primera Nacional | Racing (Cba.) | Santiago Rinaudo | DEF | ED | cruce de línea | A |
| Primera Nacional | Racing (Cba.) | Tomás Kummer | DEF | MCD | cruce de línea | A |
| Primera Nacional | Racing (Cba.) | Catriel Peña | DEF | ED | cruce de línea | C |
| Primera Nacional | Racing (Cba.) | Lautaro Ávila | MED | DFC | cruce de línea | A |
| Primera Nacional | San Martín (SJ) | Gonzalo Lucero | MED | LI | cruce de línea | C |
| Primera Nacional | San Martín (SJ) | Lucas Acosta | MED | EI | convención | — |
| Primera Nacional | San Martín (T) | Jorge Juárez | MED | LD | cruce de línea | A |
| Primera Nacional | San Martín (T) | Alan Cisnero | MED | EI | convención | — |
| Primera Nacional | San Miguel | Leandro Desábato | MED | ED | convención | — |
| Primera Nacional | San Miguel | Leandro Ortiz | MED | DFC | cruce de línea | C |
| Primera Nacional | San Miguel | Mateo Serra | MED | EI | convención | — |
| Primera Nacional | San Miguel | Thomas Carosio | MED | ED | convención | — |
| Primera Nacional | San Miguel | Tomás Díaz Grassano | MED | EI | convención | — |
| Primera Nacional | San Telmo | Juan Ignacio Motroni | DEF | ED | cruce de línea | A |
| Primera Nacional | San Telmo | Martín González | DEF | MC | cruce de línea | A |
| Primera Nacional | San Telmo | Rodrigo Dinocco | DEF | ED | cruce de línea | A |
| Primera Nacional | San Telmo | Elías Brítez | MED | EI | convención | — |
| Primera Nacional | San Telmo | Román Gamarra | MED | EI | convención | — |
| Primera Nacional | San Telmo | Gabriel Paredes | MED | EI | convención | A |
| Primera Nacional | San Telmo | Joel González | MED | DC | cruce de línea | A |
| Primera Nacional | Temperley | Lautaro Monti Azpiazu | MED | LD | cruce de línea | C |
| Primera Nacional | Temperley | Omar Pacheco | DEL | DFC | cruce de línea | C |
| Primera Nacional | Temperley | Román Quiroga | DEL | MO | convención | — |
| Primera Nacional | Tristán Suárez | Kevin Colli | MED | DC | cruce de línea | A |
| Primera Nacional | Tristán Suárez | Nicolás Sánchez | MED | EI | convención | — |
| B Metro | Def. Unidos | Alan Sombra | DEL | MP | convención | — |
| B Metro | Def. Unidos | Joaquín Tello | DEL | MO | convención | — |
| B Metro | Excursionistas | Alan Espeche | MED | ED | convención | — |
| B Metro | Excursionistas | Máximo Blanco | MED | ED | convención | — |
| B Metro | Excursionistas | Juan Pereyra | MED | ED | convención | — |
| B Metro | Ituzaingó | Jonathan Maza | MED | ED | convención | — |
| B Metro | Ituzaingó | Mauricio Bermejo | MED | ED | convención | — |
| B Metro | Ituzaingó | Franco Luppino | MED | EI | convención | — |
| B Metro | Laferrere | Alan Ortiz | MED | EI | convención | — |
| B Metro | Liniers | Franco Camejo | MED | ED | convención | — |
| B Metro | Liniers | Joaquín Camejo | MED | ED | convención | — |
| B Metro | Liniers | Federico Moreno | MED | ED | convención | — |
| Federal A | 9 de Julio (R) | Joaquín Cabral | MED | ED | convención | — |
| Federal A | Alvarado | Santiago Gutiérrez | MED | ED | convención | — |
| Federal A | Alvarado | Ariel Castellano | MED | ED | convención | — |
| Federal A | Atenas (RC) | Nicolás Castro | MED | EI | convención | — |
| Federal A | Atenas (RC) | Franco Schiavoni | MED | ED | convención | — |
| Federal A | Atenas (RC) | Facundo Quiroga | MED | ED | convención | — |
| Federal A | Atenas (RC) | Emiliano Gómez | MED | ED | convención | — |
| Federal A | Atl. San Martín (M) | Juan Almeida | MED | EI | convención | — |
| Federal A | Atl. San Martín (M) | Leandro Barrera | MED | EI | convención | — |
| Federal A | Boca Unidos | Kevin Fernández | MED | ED | convención | — |
| Federal A | Cipolletti | Andrés Almirón | MED | ED | convención | — |
| Federal A | Cipolletti | Gonzalo Lucero | MED | EI | convención | — |
| Federal A | Cipolletti | Ulises Romero | MED | EI | convención | — |
| Federal A | Cipolletti | Fernando Pettineroli | MED | ED | convención | — |
| Federal A | Cipolletti | Enzo Vallejos | MED | ED | convención | — |
| Federal A | Círculo Deportivo | Ian Norberto | MED | ED | convención | C |
| Federal A | Círculo Deportivo | Leandro Piñeyro | MED | EI | convención | — |
| Federal A | Círculo Deportivo | Mateo Sasso | MED | ED | convención | — |
| Federal A | Círculo Deportivo | Ciro Rius | MED | ED | convención | — |
| Federal A | Círculo Deportivo | Rodrigo Juárez | MED | EI | convención | — |
| Federal A | Costa Brava | Nicolás Ovando | MED | EI | convención | — |
| Federal A | Def. Belgrano (VR) | Jeremías Bertacín | MED | ED | convención | — |
| Federal A | Douglas Haig | Elián Tus | MED | ED | convención | — |
| Federal A | Escobar FC | Santiago Piersigilli | MED | ED | convención | — |
| Federal A | FADEP | José Méndez | MED | ED | convención | — |
| Federal A | Germinal | Kevin Lencina | MED | ED | convención | — |
| Federal A | Germinal | Joaquín Estrada | MED | ED | convención | — |
| Federal A | Gimnasia (Chiv.) | Brian Visser | MED | ED | convención | — |
| Federal A | Guillermo Brown | Ezequiel Goiburu | MED | EI | convención | — |
| Federal A | Guillermo Brown | Luis Dezi | MED | ED | convención | — |
| Federal A | Juv. Antoniana | Tomás Assennato | MED | ED | convención | — |
| Federal A | Juventud Unida (SL) | Facundo Noguera | MED | ED | convención | — |
| Federal A | Juventud Unida (SL) | Iván Escobares | MED | EI | convención | — |
| Federal A | San Martín (F) | Orlando Vega | MED | EI | convención | — |
| Federal A | San Martín (F) | Alejandro Aquino | MED | EI | convención | — |
| Federal A | Santamarina | Tomás Romero | MED | ED | convención | — |
| Federal A | Sol de América (F) | Sebastián Jiménez | MED | EI | convención | — |
| Federal A | Sol de Mayo | Lucas Galiano | MED | EI | convención | — |
| Federal A | Sol de Mayo | Miqueas Martínez | MED | ED | convención | — |
| Federal A | Tucumán Central | Brahian Collante | MED | EI | convención | — |
| Federal A | Tucumán Central | Guillermo Abregú | MED | ED | convención | — |

## Anexo 2 — Primera C y Promocional: jugadores sin puesto específico por club (D2)

| División | Club | ARQ | DEF | MED | DEL | Total |
|---|---|---:|---:|---:|---:|---:|
| Primera C | Argentino (R) | 3 | 8 | 11 | 8 | 30 |
| Primera C | Atlas | 3 | 8 | 14 | 5 | 30 |
| Primera C | Berazategui | 3 | 8 | 11 | 8 | 30 |
| Primera C | Cañuelas | 3 | 7 | 14 | 6 | 30 |
| Primera C | Central Ballester | 4 | 8 | 10 | 8 | 30 |
| Primera C | Central Cba. (R) | 4 | 8 | 16 | 2 | 30 |
| Primera C | Centro Español | 3 | 6 | 15 | 5 | 29 |
| Primera C | Claypole | 3 | 7 | 13 | 7 | 30 |
| Primera C | Def. de Cambaceres | 2 | 8 | 12 | 8 | 30 |
| Primera C | Dep. Español | 3 | 8 | 11 | 8 | 30 |
| Primera C | Dep. Paraguayo | 3 | 8 | 11 | 8 | 30 |
| Primera C | El Porvenir | 4 | 8 | 11 | 7 | 30 |
| Primera C | Estrella d. Sur | 3 | 8 | 11 | 8 | 30 |
| Primera C | Fénix | 3 | 8 | 12 | 7 | 30 |
| Primera C | Gral. Lamadrid | 3 | 8 | 13 | 6 | 30 |
| Primera C | J. J. Urquiza | 3 | 8 | 11 | 8 | 30 |
| Primera C | Juventud Unida | 3 | 8 | 11 | 8 | 30 |
| Primera C | L. N. Alem | 3 | 8 | 13 | 6 | 30 |
| Primera C | Leones | 3 | 8 | 12 | 7 | 30 |
| Primera C | Lugano | 3 | 8 | 11 | 8 | 30 |
| Primera C | Luján | 3 | 8 | 12 | 7 | 30 |
| Primera C | Mercedes | 3 | 8 | 11 | 8 | 30 |
| Primera C | Muñiz | 3 | 8 | 11 | 8 | 30 |
| Primera C | Puerto Nuevo | 2 | 8 | 13 | 7 | 30 |
| Primera C | Sacachispas | 3 | 8 | 11 | 8 | 30 |
| Primera C | Sp. Barracas | 3 | 7 | 12 | 8 | 30 |
| Primera C | V. Arenas | 3 | 8 | 12 | 7 | 30 |
| Primera C | Yupanqui | 3 | 8 | 11 | 8 | 30 |
| Promocional | Alumni (LH) | 3 | 8 | 11 | 8 | 30 |
| Promocional | Atl. Pilar | 4 | 8 | 12 | 6 | 30 |
| Promocional | Barrancas | 4 | 9 | 10 | 8 | 31 |
| Promocional | Belgrano (Z) | 4 | 13 | 11 | 2 | 30 |
| Promocional | Buenos Aires City | 3 | 12 | 11 | 4 | 30 |
| Promocional | Control Orientado | 3 | 8 | 12 | 7 | 30 |
| Promocional | Def. de Glew | 4 | 9 | 10 | 7 | 30 |
| Promocional | Dep. Metalúrgico | 4 | 9 | 11 | 8 | 32 |
| Promocional | Estrella (Berisso) | 4 | 7 | 13 | 8 | 32 |
| Promocional | Everton (LP) | 4 | 8 | 10 | 6 | 28 |
| Promocional | FC Ezeiza | 3 | 8 | 13 | 6 | 30 |
| Promocional | Juventud (Bernal) | 4 | 5 | 12 | 8 | 29 |
| Promocional | Las Mandarinas | 4 | 8 | 10 | 8 | 30 |
| Promocional | Náutico Hacoaj | 4 | 8 | 12 | 6 | 30 |
| Promocional | SAT | 4 | 8 | 11 | 9 | 32 |
| Promocional | U. D. Provincial | 4 | 8 | 14 | 6 | 32 |
| Promocional | Uribelarrea FC | 4 | 8 | 14 | 6 | 32 |

## Anexo 3 — Federal A, tanda 4: puestos aplanados por club (D3)

| Club | DFC | MC | DC | POR | Total | Fuente citada |
|---|---:|---:|---:|---:|---:|---|
| Gimnasia (CdU) | 10 | 11 | 7 | 4 | 32 | [sortitoutsi.net](https://sortitoutsi.net/football-manager-2027/team/108567/club-gimnasia-y-esgrima-de-concepcion-del-uruguay) |
| Sp. Las Parejas | 8 | 11 | 8 | 3 | 30 | [mundoascenso.com.ar](https://www.mundoascenso.com.ar/plantel/1950-sportivo-las-parejas) |
| Def. P. Vilelas | 9 | 8 | 5 | 3 | 25 | [sortitoutsi.net](https://sortitoutsi.net/football-manager-data-update/team/14064734) |
| Argentino (MM) | 7 | 9 | 7 | 3 | 26 | [sortitoutsi.net](https://sortitoutsi.net/football-manager-2027/team/14064652/club-deportivo-argentino-de-monte-maiz) |
| Kimberley | 8 | 11 | 8 | 3 | 30 | [sortitoutsi.net](https://sortitoutsi.net/football-manager-2027/team/14037344/club-atletico-kimberley) |
| Villa Mitre | 9 | 10 | 10 | 3 | 32 | [sortitoutsi.net](https://sortitoutsi.net/football-manager-2027/team/108569/club-villa-mitre-de-bahia-blanca) |
| Sarmiento (R) | 7 | 8 | 6 | 3 | 24 | [sortitoutsi.net](https://sortitoutsi.net/football-manager-2027/team/14043913/club-atletico-sarmiento-de-resistencia) |

## Anexo 4 — Muestras verificadas

| Muestra | Club | Jugador | Actual | Resultado | Cat. | Fuentes |
|---|---|---|---|---|---|---|
| Convención | Patronato | Agustín Miró | MED / ED | MED / MC — Las fuentes lo nombran Alejo Agustín Miró: mediocampista según ESPN, StatsHub y Elonce; ninguna fuente lo da como extremo | A | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/365051/alejo-miro)<br>[statshub.com](https://statshub.com/player/alejo-agustin-miro/128931)<br>[elonce.com](https://www.elonce.com/uid-888995) |
| Convención | Quilmes | Ulises Vera | MED / EI | MED / MI o MC (a confirmar) — ESPN y Fichajes: mediocampista; FotMob: volante central en una versión y volante por izquierda en otra | C | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/358117/ulises-vera)<br>[fotmob.com](https://www.fotmob.com/es/players/1442707) |
| Convención | Argentinos Jrs. | Hernán López Muñoz | DEL / MO | MED / MO o DEL / ED (a confirmar); secundarias ED/MC/MO — FotMob: extremo derecho, con MC y MO de otras posiciones; Wikipedia: mediapunta; ESPN y Tuttosport: mediocampista | C | [fotmob.com](https://www.fotmob.com/es/players/1037535/hernan-lopez)<br>[en.wikipedia.org](https://en.wikipedia.org/wiki/Hern%C3%A1n_L%C3%B3pez_(footballer)) |
| Convención | Chacarita Jrs. | Francisco Cristaldo | DEL / MO | DEL / DC — Delantero según Soccerway y Fussballtransfers; ninguna fuente lo da como mediapunta | A | [us.soccerway.com](https://us.soccerway.com/player/cristaldo-francisco/n5K9shy0)<br>[fussballtransfers.com](https://www.fussballtransfers.com/spieler/francisco-javier-cristaldo/) |
| Convención | C. de Bolívar | Matías Gutiérrez | MED / EI | sin propuesta; revisar nombre — En Ciudad de Bolívar solo aparece Maximiliano Gutiérrez (mediocampista) | C | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/maximiliano-gutierrez-ai864ibtm7y47mo94fa7ndfx1/) |
| Convención | Alte. Brown | Santiago Ariel Villalba | DEL / MP | revisar: posible duplicado con Santiago Villalba de Chaco For Ever — El mismo perfil de Soccerway (Kx3Dkw4r) y de ESPN (364831) aparece en Almirante Brown (préstamo de Barracas hasta el 31/12/2025) y en Chaco For Ever (préstamo hasta el 31/12/2026). Puede estar cargado en dos clubes. Posición: ESPN mediocampista; Soccerway delantero | D | [ar.soccerway.com](https://ar.soccerway.com/jugador/villalba-santiago/Kx3Dkw4r)<br>[espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/364831/santiago-villalba) |
| Convención | Lanús | Marcelino Moreno | DEL / MO | MED / MO; secundaria MI — Mediapunta o volante de creación según todas las fuentes (Wikipedia, FotMob MCO/MI, ESPN, La Nación, El Universo); el grupo DEL es incorrecto | A | [en.wikipedia.org](https://en.wikipedia.org/wiki/Marcelino_Moreno)<br>[fotmob.com](https://www.fotmob.com/es/players/561737)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/marcelino-moreno-d42nqefiqme45lyi9mtclhtjp/) |
| Convención | Círculo Deportivo | Ian Norberto | MED / ED | a confirmar — Un perfil lo da como mediocampista; la nómina de La Nación lo lista entre los defensores | C | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/equipo/circulo-deportivo-5gbyhtnjrpffvujd54ltl0xp4/) |
| Convención | San Telmo | Gabriel Paredes | MED / EI | DEF / LI — FotMob: lateral izquierdo; Sofascore y Soccerway: defensor; ESPN: mediocampista. Ninguna fuente lo da como extremo | A | [fotmob.com](https://www.fotmob.com/es-419/players/1373702)<br>[ca.soccerway.com](https://ca.soccerway.com/player/paredes-gabriel/65sMusFC)<br>[sofascore.com](https://www.sofascore.com/player/gabriel-paredes/1382891) |
| Convención | Los Andes | Federico Villarreal | MED / ED | sin propuesta; revisar nombre — En Los Andes solo aparece Facundo Villarreal (ESPN y Soccerway: mediocampista; FotMob: delantero) | C | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/399782/facundo-villarreal)<br>[ar.soccerway.com](https://ar.soccerway.com/jugador/villarreal-sebastian-facundo/tzUvZxTn) |
| Tanda 4 | Kimberley | Joaquín Zárate | MED / MC | sin cambio de puesto; revisar nombre — Las fuentes lo nombran Jonathan Gustavo Zárate, volante interno de Kimberley (La Capital MdP). El puesto coincide | C | [lacapitalmdp.com](https://www.lacapitalmdp.com/sigue-jonathan-zarate-y-arranque-confirmado/)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/jonathan-zarate-3gii40bf6chzxrei7d7c94yui/) |
| Tanda 4 | Sarmiento (R) | Franco Domínguez | DEF / DFC | sin cambio (lado o puesto exacto no informados) — Defensor según Sofascore, LiveSoccerTV y Soccerway | OK | [sofascore.com](https://sofascore.com/player/franco-dominguez/1478413)<br>[es.soccerway.com](https://es.soccerway.com/jugador/dominguez-franco/86XmZAZP) |
| Tanda 4 | Sp. Las Parejas | Gonzalo Schönfeld | DEL / DC | a confirmar — Soccerway: delantero; Cancha Llena y FCUpdate: mediocampista | C | [es.soccerway.com](https://es.soccerway.com/jugador/schonfeld-gonzalo/zm2sRTnt)<br>[canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/gonzalo-schonfeld-354ppyf9fismxmdkwfwq6gaac/) |
| Tanda 4 | Gimnasia (CdU) | Juan Casares | MED / MC | sin cambio — Mediocampista según Apwin y Soccerway | OK | [apwin.com](https://www.apwin.com/player/955841/juan-casares/)<br>[ar.soccerway.com](https://ar.soccerway.com/jugador/casares-juan/WltZkQas) |
| Tanda 4 | Sp. Las Parejas | Martiniano Irribarría | MED / MC | sin cambio — Centrocampista según Soccerway | OK | [es.soccerway.com](https://es.soccerway.com/jugador/irribarria-martiniano/bNzrtPmS) |
| Tanda 4 | Villa Mitre | Ulises Olguín | DEF / DFC | sin cambio (puesto exacto no informado) — Defensor según Soccerway y FootyStats | OK | [es.soccerway.com](https://es.soccerway.com/jugador/olguin-ulises/4WsmSTUI)<br>[footystats.org](https://footystats.org/players/argentina/ulises-olguin) |
| Tanda 4 | Sp. Las Parejas | Nicolás Herranz | DEF / DFC | DEF / DFC; secundaria MCD — Defensor según Cancha Llena y Gioscore; Soccerwiki: D(RC), DM(R) | B | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/nicolas-herranz-cvubb35lo9a0tww7fbi7yqm7d/)<br>[en.soccerwiki.org](https://en.soccerwiki.org/player.php?pid=87258) |
| Tanda 4 | Def. P. Vilelas | Bruno Prieto | DEF / DFC | sin cambio (puesto exacto no informado) — Defensor según Soccerway (única fuente) | OK | [ca.soccerway.com](https://ca.soccerway.com/player/prieto-bruno/fqmkxCcK) |
| Tanda 4 | Villa Mitre | Thiago Díaz | MED / MC | sin propuesta; revisar nombre — No aparece ningún Thiago Díaz en Villa Mitre; sí Thiago Pérez (centrocampista) | C | [es.soccerway.com](https://es.soccerway.com/jugador/perez-thiago/4MIghVfS) |
| Tanda 4 | Def. P. Vilelas | Juan Carlos Molina | DEF / DFC | sin datos — No se encontró ninguna ficha futbolística | C | — |

