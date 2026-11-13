# Auditoría general — Primera C 2026

Fecha de actualización: 13/11/2026  
Estado: depuración individual en curso; el recuento vigente está consolidado en la última sección. Las secciones 1–5 conservan el corte histórico de la primera auditoría (1.124 registros) y no representan el estado actual.

## 1. Resultado general

- **28 clubes** cargados.
- **1.124 jugadores** en runtime después de la primera depuración general.
- **1.132 registros nominales iniciales** entre las cuatro tandas; se retiraron diez nombres netos (dos en la depuración de la tanda 1, ocho en la primera auditoría general y Franco Gómez de Central Ballester), y se reincorporó Gabriel Rivera por figurar en la nómina oficial de Estrella del Sur y se agregaron Matías Arias y Néstor Acosta por evidencia de participación en 2026.
- Los 28 clubes cumplen el mínimo de 22 jugadores: el menor plantel actual tiene 29 y el mayor 50.
- Promedio actual: 40,1 jugadores por club. Es una base preliminar; todavía hay equipos demasiado grandes para considerarlos definitivos.

## 2. Composición actual por club

| Club | Jugadores | ARQ | DEF | MED | DEL |
|---|---:|---:|---:|---:|---:|
| Juventud Unida | 51 | 4 | 15 | 21 | 11 |
| Central Ballester | 50 | 4 | 16 | 17 | 13 |
| Argentino de Rosario | 50 | 3 | 11 | 26 | 10 |
| Sacachispas | 50 | 4 | 14 | 24 | 8 |
| J.J. Urquiza | 49 | 4 | 11 | 23 | 11 |
| Leandro N. Alem | 46 | 4 | 14 | 22 | 6 |
| Atlético Lugano | 45 | 4 | 17 | 15 | 9 |
| El Porvenir | 44 | 4 | 13 | 17 | 10 |
| Estrella del Sur | 43 | 5 | 10 | 18 | 9 |
| Deportivo Paraguayo | 42 | 3 | 15 | 16 | 8 |
| Atlas | 42 | 4 | 12 | 21 | 5 |
| Fénix | 42 | 3 | 13 | 19 | 7 |
| Claypole | 39 | 3 | 7 | 22 | 7 |
| Deportivo Español | 39 | 5 | 10 | 16 | 8 |
| Sportivo Barracas | 39 | 3 | 7 | 16 | 13 |
| Yupanqui | 39 | 3 | 10 | 18 | 8 |
| Berazategui | 38 | 4 | 11 | 14 | 9 |
| Muñiz | 38 | 4 | 12 | 14 | 8 |
| Victoriano Arenas | 37 | 4 | 8 | 18 | 7 |
| Leones FC | 37 | 4 | 10 | 16 | 7 |
| Club Mercedes | 35 | 4 | 12 | 11 | 8 |
| Defensores de Cambaceres | 35 | 2 | 9 | 16 | 8 |
| General Lamadrid | 36 | 4 | 9 | 17 | 6 |
| Puerto Nuevo | 33 | 2 | 9 | 15 | 7 |
| Luján | 33 | 3 | 8 | 15 | 7 |
| Central Córdoba (Rosario) | 32 | 4 | 9 | 17 | 2 |
| Cañuelas | 31 | 3 | 7 | 15 | 6 |
| Centro Español | 29 | 3 | 6 | 15 | 5 |
| **Total** | **1.124** | **102** | **305** | **494** | **223** |

## 3. Controles de integridad

- 1.124 nombres únicos dentro de sus respectivos clubes.
- 1.124 dorsales asignados.
- 0 dorsales vacíos.
- 0 dorsales duplicados dentro de un mismo club.
- Santino Sapio aparece una sola vez en Cañuelas; MED está registrado como posición secundaria.
- Víctor Gómez se incorporó a Cambaceres por evidencia de 25 presencias, aunque no figuraba en el bloque principal de la nómina.
- Mirko Pfarherr se mantiene en Central Córdoba de Rosario como defensor por sus convocatorias/participaciones.
- Se diferenciaron los homónimos entre clubes; los seis pares que continúan simultáneamente en runtime están documentados en las auditorías de las tandas.

**Importante:** los 1.124 dorsales siguen siendo estimaciones, no números oficiales de temporada. Las fichas de partido muestran camisetas utilizadas en encuentros puntuales y no se convierten automáticamente en dorsales permanentes.

## 4. Depuración aplicada

### Tanda 1

- Gabriel Rivera (Estrella del Sur): perfil individual sin partidos jugados en 2026.
- Nicolás Gentile (Leandro N. Alem): sin participaciones ni convocatorias de primer equipo en 2026.

### Corrección de Sacachispas

- **Matías Arias** se agregó al plantel como mediocampista: su ficha de Primera C 2026 registra 16 partidos y 1.306 minutos. La nómina general de Solo Ascenso lo omitía, pero su participación está respaldada por el perfil estadístico. Dorsal 51 estimado; edad 25 confirmada. Fuente: https://www.zerozero.pt/jogador/matias-arias/1235568?edicao_id=212447

### Central Ballester

Se retiraron cinco jugadores:
- Lucas Contreras, Ramón Francois y Franco Gerez: no se encontró evidencia de convocatoria o participación del primer equipo en 2026; tampoco aparecen en la nómina actual de cuatro arqueros del primer equipo consultada.
- Federico Vega: cero presencias de primer equipo en 2026.
- Alexis Oviedo: cuatro convocatorias como suplente sin ingresar.

Se conservan Nehuén Viñas, Santino Gutiérrez, Nicolás Suaya y Santiago Garro. Viñas tuvo continuidad; Suaya y Garro fueron incorporaciones anunciadas para el primer equipo y aparecen en convocatorias, aunque no sumaron minutos. Fuentes: [plantel actualizado](https://www.zerozero.com.ve/equipo/central-ballester/45605?epoca_id=155), [llegadas de Suaya y otros refuerzos](https://www.soloascenso.com.ar/notas/central-ballester/el-canalla-presento-a-tres-jugadores-nuevos-para-el-plantel/223900), [llegada de Garro](https://www.soloascenso.com.ar/notas/central-ballester/central-ballester-incorporo-a-otro-joven-arquero-al-plantel/225381), [perfil de Federico Vega](https://www.soloascenso.com.ar/perfil/federico-vega/31290), [perfil de Alexis Oviedo](https://www.soloascenso.com.ar/perfil/alexis-oviedo/32256).

### El Porvenir

Se retiraron tres arqueros:
- Cristian Arce: perfil con cero presencias en 2026.
- Facundo Arcas: no se encontró participación ni convocatoria de primer equipo en 2026; la actividad disponible corresponde a temporadas anteriores.
- Tomás Guzmán: no se encontró participación del primer equipo; sus apariciones localizadas corresponden a reserva.

Se conservan Sergio Juárez, Diego Freire, Lautaro Guzmán y Luis Andrade. Luis Andrade (nombre completo Luis Miguel Andrade Arboleda) registra dos partidos y 118 minutos. Fuentes: [perfil de Cristian Arce](https://www.soloascenso.com.ar/perfil/cristian-arce/24105), [perfil de Luis Andrade](https://www.ceroacero.com.co/jugador/luis-andrade/848249?epoca_id=155), [ficha El Porvenir–Cañuelas](https://www.soloascenso.com.ar/ficha/45321), [ficha El Porvenir–Español](https://www.soloascenso.com.ar/ficha/45292).

## 5. Distribución de posiciones y datos pendientes

| Posición | Jugadores | Porcentaje |
|---|---:|---:|
| Arqueros | 102 | 9,1% |
| Defensores | 305 | 27,1% |
| Mediocampistas | 494 | 43,9% |
| Delanteros | 223 | 19,8% |

- Las 1.124 medias son estimaciones iniciales por nivel de club y posición; promedio global 44,47, rango 40–50. No son ratings oficiales ni se consideran calibradas.
- Los 1.124 dorsales están marcados como estimados.
- Falta la edad en 1.122 registros (Matías Arias tiene 25 años documentados); faltan nacionalidad, pie hábil y rol específico en los 1.124.
- El rol genérico (ARQ/DEF/MED/DEL) está completo, pero no alcanza para mostrar posiciones detalladas como LD, LI, DFC, MCD, MC, MCO, EI, ED o DC.
- Las medias de Luján, Deportivo Español y Leones FC están entre las más altas de la categoría por la escala provisional asignada; deberán revisarse con rendimiento individual y referencias de nivel.

## 6. Próximas prioridades

1. Seguir depurando los planteles más numerosos: Juventud Unida (51), Argentino de Rosario (50), Central Ballester (50), Sacachispas (50), J.J. Urquiza (49), Alem (46), Lugano (45) y El Porvenir (44).
2. Revisar especialmente los equipos con muchos arqueros o acumulación de mediocampistas/delanteros.
3. Cruzar perfiles individuales, fichas de partidos y movimientos de mercado para los 1.124 jugadores, no sólo las listas generales.
4. Completar edades, nacionalidades, pie hábil y roles específicos.
5. Recalibrar medias y sustituir dorsales estimados por números oficiales cuando se encuentren fuentes fiables.

**Conclusión:** la carga de Primera C está completa y la integridad básica está validada. La depuración aplicada ya eliminó nombres sin participación de primer equipo, pero el trabajo no debe considerarse final hasta revisar la participación y la composición de los 28 planteles.


## 5. Auditoría individual en curso — Central Ballester

Se contrastó el plantel de 51 jugadores con las estadísticas de Primera C 2026 y las convocatorias publicadas:

- ZeroZero registra 32 futbolistas con minutos en Central Ballester al cierre de la fase regular (actualización del 16/10/2026). De ellos, 31 están en el CSV actual.
- El restante es **Aarón Quijano**: disputó 14 partidos y 1.138 minutos para Ballester, pero salió a Central Córdoba de Rosario el 22/06/2026. No debe quedar en el plantel de cierre de Ballester; ya figura correctamente en el CSV de Central Córdoba.
- **Franco Gómez** fue retirado del CSV: su perfil individual de Solo Ascenso registra cero presencias, cero titularidades y cero convocatorias en 2026.
- **Agustín Corbalán** fue anunciado como baja en enero de 2025, pero aparece en la nómina actual de Central Ballester publicada por Solo Ascenso. Se conserva por esa evidencia de pertenencia al plantel 2026; falta confirmar si integró convocatorias.
- Hay otros 19 nombres del CSV que no aparecen en la tabla de minutos de ZeroZero. No se eliminan automáticamente: deben cruzarse con fichas de partido y convocatorias para distinguir jugadores sin participación de suplentes no utilizados o altas del primer equipo.

Fuentes: [estadísticas de minutos de Central Ballester (ZeroZero)](https://www.zerozero.pt/edicao/primera-c-2026/212447/estatisticas?id_equipa=45605&v1=j&v2=t&v3=5), [perfil de Franco Gómez (Solo Ascenso)](https://www.soloascenso.com.ar/perfil/franco-gomez/16183), [baja de Agustín Corbalán (Solo Ascenso)](https://www.soloascenso.com.ar/notas/central-ballester/el-canalla-sumo-varias-desvinculaciones-en-su-equipo/211667), [salida de Aarón Quijano a Central Córdoba (Solo Ascenso)](https://www.soloascenso.com.ar/notas/central-ballester/central-ballester-tuvo-una-baja-y-tiene-un-refuerzo-al-caer/229572).

**Estado de esta revisión:** Central Ballester queda con 50 jugadores tras retirar a Franco Gómez, sin tocar a Agustín Corbalán por su presencia en la nómina actual. Aarón Quijano sigue correctamente en Central Córdoba tras su salida de Ballester.


## 6. Auditoría individual — segunda tanda amplia

Se revisaron en conjunto Sacachispas, Argentino de Rosario, Juventud Unida y J.J. Urquiza, contrastando CSV con nóminas, fichas de partidos, convocatorias y movimientos de mitad de temporada.

### Sacachispas — 50 cargados

- Las fichas de las fechas 18, 27 y 31 confirman continuidad de Neyder Aragón, Luis Lorenzi, Gonzalo Rocaniere, Alan Buonofiglio, Benjamín Arias, Ricardo Priori, Leandro Ríos, Santiago Gallardo, Gonzalo Vivanco, Alejo Monje, Lautaro Torres, Diego Molina Fariña, Uriel Sosa y Facundo Durso, entre otros.
- **Valentín Mancuso** aparece en el banco de suplentes en las fechas 18 y 27. Ya figura en el CSV actual. Se completa su edad en **21 años** con TACAZO. Sobre la posición hay fuentes discrepantes: Solo Ascenso lo clasifica como **MED** en la nómina 2026, mientras TACAZO y Mundo Ascenso lo listan como defensor; se conserva MED por ahora, siguiendo la ficha de plantel de Solo Ascenso y sin convertir la discrepancia en una corrección definitiva.
- La nómina de Mundo Ascenso muestra una plantilla de menor tamaño y nombres que no coinciden completamente con las convocatorias de septiembre/octubre. Por eso no se toma esa lista aislada como motivo para borrar jugadores.
- No se retira ningún jugador en esta tanda: primero hay que cotejar los 50 nombres con el historial completo de convocatorias y confirmar si existen otros jugadores del primer equipo ausentes del CSV.

Fuentes: [Sacachispas vs Juventud Unida, fecha 18](https://www.soloascenso.com.ar/ficha/45177), [Centro Español vs Sacachispas, fecha 27](https://www.soloascenso.com.ar/ficha/45273), [Sacachispas vs Estrella del Sur, fecha 31](https://www.soloascenso.com.ar/ficha/45312), [plantel publicado por Mundo Ascenso](https://www.mundoascenso.com.ar/plantel/1942-sacachispas-fc).

### Argentino de Rosario — 50 cargados

- La nómina actual de Solo Ascenso y las fichas de las fechas 3, 17 y 26 permiten confirmar una base amplia del plantel, incluyendo Francisco Olivera, Bruno Cabrera, Tiago Celes, Thiago Bartalini, Juan Cruz Cisneros, Manuel Correa Medina, Theo Guiñazú, Luciano Fernández, Lautaro Torrez, Octavio Rubarth, Wilfran Quinto Orejuela, Kevin Schmidt, entre otros.
- Se confirma como correcta la depuración de **Dago Sánchez Palencia, Carlos Raga Córdoba y Facundo Aronna** del plantel de cierre: los tres participaron en la primera parte del año, pero Dago y Raga salieron hacia Cambaceres en junio; Aronna también dejó el equipo en ese recambio. No deben volver a agregarse como integrantes del cierre de Argentino.
- El plantel de cierre debe reflejar los refuerzos y juveniles que tomaron esos lugares. No se retira ningún otro nombre en esta tanda.

Fuentes: [plantel y goleadores de Argentino de Rosario](https://www.soloascenso.com.ar/club/argentino-de-rosario/243), [bajas de Dago y Raga](https://www.soloascenso.com.ar/notas/argentino-de-rosario/argentino-de-rosario-sufrio-dos-bajas-en-el-mediocampo/229363), [salida de Aronna y rearmado para la segunda mitad](https://www.soloascenso.com.ar/notas/argentino-de-rosario/argentino-afrontara-un-duelo-directo-por-la-permanencia/229684), [Argentino vs Centro Español, fecha 26](https://www.soloascenso.com.ar/ficha/45255), [Juventud vs Argentino, fecha 17](https://www.soloascenso.com.ar/ficha/45158).

### Juventud Unida — 51 cargados

- Se comprobó que el CSV no conserva a **Fernando Giménez** ni a **Santino Bevilacqua** como parte del plantel de cierre, correctamente: Giménez se fue a préstamo a Villa Dálmine el 23/07 luego de jugar 10 partidos y marcar cinco goles; Bevilacqua pasó a San Miguel durante la primera mitad del año.
- Las ocho incorporaciones anunciadas antes del debut y las cinco altas iniciales fueron contrastadas con las fichas de partidos. Los futbolistas que continuaron en el equipo aparecen en las convocatorias y alineaciones de marzo a septiembre.
- El registro de ZeroZero publica 42 integrantes en su plantilla de temporada y una columna de estadísticas liderada por Maximiliano Paredes (31 partidos), Ian Escobar (28), Mariano Di Franco, Diego Cardozo y Nahuel Aiuto (24 cada uno). Es una referencia de uso, no una lista exhaustiva de todos los convocados; no se recorta el CSV solo por la diferencia de conteo.
- **No se aplican bajas automáticas**: queda pendiente el cruce nominal completo de los 51 con las convocatorias, especialmente arqueros y jugadores sin minutos.

Fuentes: [altas iniciales de enero](https://www.soloascenso.com.ar/notas/argentino-de-merlo/inicio-la-pretemporada-con-refuerzos-y-amistosos-confirmados/223842), [ocho incorporaciones previas al debut](https://www.soloascenso.com.ar/notas/juventud-unida/el-lobo-sumo-ocho-caras-nuevas-previo-al-debut-en-el-torneo/224961), [salida de Fernando Giménez y Bevilacqua](https://www.soloascenso.com.ar/notas/sacachispas-fc/salida-sensible-en-juventud-unida-se-fue-su-goleador/230602), [estadísticas de temporada y plantilla](https://www.zerozero.com.ar/equipo/juventud-unida-san-miguel/45600), [Juventud vs Mercedes, fecha 26](https://www.soloascenso.com.ar/ficha/45257).

### J.J. Urquiza — 49 cargados

- Se cruzaron las convocatorias oficiales del club del 6 y 28 de septiembre. Los titulares y suplentes publicados coinciden con jugadores incluidos en el CSV: Facundo Durán, Elías Quiroga, Leonardo Luna, Patricio Díaz, Issa Jean Sane, Bautista García, Nehuén Montoya, Franco Ocampo, Fabián Lucero, Thiago Ventura, Axel Meridione, Mateo Figueroa, Thiago Urquiza, Mateo Chade, Tomás Mendoza, Manuel Aiello, Luca Fusca, Joaquín Del Castillo y Apolo Rapp.
- **Gastón Cueto y Fabián Lucero se conservan**: aunque una nota de enero los incluyó entre las bajas, el club publicó a ambos en convocatorias oficiales de septiembre. La evidencia posterior prevalece sobre el anuncio inicial.
- No se elimina ningún jugador por la nota de bajas de enero; las convocatorias oficiales de la temporada muestran que hubo cambios posteriores.

Fuentes: [J.J. Urquiza vs Juventud Unida, fecha 27](https://www.jjurquiza.com.ar/NotasPrimera/Nota4123.html), [J.J. Urquiza vs Alem, fecha 30](https://jjurquiza.com.ar/NotasPrimera/Nota4127.html), [bajas anunciadas en enero](https://www.soloascenso.com.ar/notas/jj-urquiza/jj-urquiza-inicia-2026-con-cinco-bajas-en-su-plantel/223387).

**Resultado de esta tanda:** se confirmaron dos salidas ya correctamente reflejadas en Juventud Unida y tres salidas de Argentino que no deben reintroducirse. Valentín Mancuso ya estaba cargado en Sacachispas; se corrigieron su posición (DEF) y edad (21), con respaldo de fuentes de temporada. No se hicieron recortes especulativos.


## 7. Auditoría individual — tercera tanda amplia

Se revisaron Leandro N. Alem, Atlético Lugano, El Porvenir y Estrella del Sur. El cruce se hizo sobre las nóminas de los CSV y movimientos/convocatorias de 2026.

### Leandro N. Alem — 46 cargados

- Las fichas de agosto y octubre confirman el núcleo utilizado: Lucas Rodríguez, Claudio Curima, Leandro Cantón, Iván Gauna, Cristian Seltzer, Ezequiel Abal, Matías Medina, Alan Cristeff, Brian Risso Patrón, Lautaro Segovia y Diego Pertossi aparecen en la temporada.
- Ignacio y Tomás Buenrostro habían sido anunciados como bajas antes del inicio de 2026 y no están en el CSV.
- Gonzalo Mendiburu se conserva: su participación sostenida durante 2026 prevalece sobre cualquier anuncio de salida posterior.
- El plantel de 46 sigue siendo demasiado grande para darlo por definitivo. No se recorta a los demás jugadores sin cruzar sus presencias y convocatorias.

Fuentes: [Alem vs Puerto Nuevo, fecha 26](https://www.soloascenso.com.ar/ficha/45260), [Alem vs Centro Español, fecha 31](https://www.soloascenso.com.ar/ficha/45313), [salidas de Ignacio y Tomás Buenrostro](https://www.soloascenso.com.ar/notas/villa-san-carlos/los-jugadores-de-alem-que-jugaran-en-la-primera-nacional/222698).

### Atlético Lugano — 45 cargados

- La nómina de Solo Ascenso coincide en sus nombres principales con el CSV.
- Se verificaron las cuatro incorporaciones de la temporada que figuran en el mercado: Ignacio Gallo, Denzel Giménez, Leonel Ovejero y Matías Benardoni. Los cuatro están incluidos.
- Pablo Quiroga también permanece correctamente: su pase desde El Porvenir a Lugano está registrado en el mercado de pases.
- No encontré una baja documentada que permita quitar a otro integrante del CSV. La cantidad de 45 requiere una pasada de participación individual antes de reducirse.

Fuentes: [plantel de Atlético Lugano](https://www.soloascenso.com.ar/club/lugano/289), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### El Porvenir — 44 cargados

- Se contrastaron las convocatorias de agosto, septiembre y octubre. Aparecen de forma reiterada Sergio Juárez, Kevin Romero, Julián Quinteros, Javier Peralta Salinas, Esteban Ayala, Franco Ávalos, Leonel Bolig, Jeremías Arrieta, Leandro Villagra, Hernán Rodríguez, Ulises Macías, Luis Pérez Díaz y Nicolás De Benedetti.
- **Darío Nami no está en el CSV**, correctamente: salió a General Lamadrid el 28/06 después de disputar 16 partidos y marcar cuatro goles con El Porvenir.
- El mercado de enero documentó 11 altas y 12 bajas; los nombres que dejaron el club antes del inicio no deben reincorporarse solo por aparecer en planteles históricos.
- No se retiran más jugadores todavía. El tamaño de 44 exige revisar especialmente los nombres que no aparecen en las convocatorias del segundo semestre.

Fuentes: [mercado de altas y bajas de enero](https://www.soloascenso.com.ar/notas/el-porvenir/el-porvenir-sacude-el-mercado-refuerzos-y-salidas-definidas/224370), [salida de Darío Nami](https://www.soloascenso.com.ar/notas/muniz/el-porvenir-sufrio-su-primera-baja-y-ya-tiene-destino/229788), [El Porvenir vs Claypole, fecha 26](https://www.soloascenso.com.ar/ficha/45263), [El Porvenir vs Cañuelas, fecha 31](https://www.soloascenso.com.ar/ficha/45321).

### Estrella del Sur — 42 cargados

- Las convocatorias de septiembre confirman a Valentín Díaz, Ramiro López, Gastón David, Gonzalo Núñez, Dilan Maidana, Aaron Spagna, Lucas Chiapparo, Tomás Bravo, Julián Eseiza, Ciro Campuzano, Lautaro Torres, Lucas Vázquez y Leandro Moreira.
- Las incorporaciones de Valentín Díaz, Santiago Gutiérrez y Ramiro López fueron anunciadas en febrero; las tres están contempladas en el CSV.
- Lautaro Torres y Leandro Moreira llegaron durante el año y también están incluidos.
- Benjamín Gutiérrez e Iván Caravaca fueron bajas y no aparecen en el CSV actual, correctamente.
- No se aplican recortes por la diferencia entre la lista de plantel y las convocatorias: falta cruzar la nómina completa y separar suplentes habituales de nombres sin actividad.

Fuentes: [altas de febrero](https://www.soloascenso.com.ar/notas/afa/estrella-del-sur-sumo-tres-refuerzos-para-su-plantel/224620), [Estrella del Sur vs Yupanqui, fecha 28](https://www.soloascenso.com.ar/ficha/46100), [Estrella del Sur vs Argentino de Rosario, fecha 30](https://www.soloascenso.com.ar/ficha/45303), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

**Resultado de esta tanda:** se confirmaron como correctas las bajas ya reflejadas de los cuatro clubes (Buenrostro, Nami, y las bajas de Estrella), así como las incorporaciones de Lugano y Estrella. No se encontró evidencia suficientemente concluyente para retirar más jugadores. Los cuatro planteles siguen en revisión individual por su tamaño.


## 8. Auditoría individual — cuarta tanda amplia

Se revisaron Victoriano Arenas, Deportivo Paraguayo, Atlas y Fénix. En esta tanda hubo buen cruce entre los listados de plantel de Solo Ascenso y los CSV.

### Victoriano Arenas — 37 cargados

- La nómina de Solo Ascenso coincide con los 37 jugadores del CSV.
- Se verificaron como incorporaciones de 2026 a Julián García, Sebastián De Luca y Matías Rodríguez, todos incluidos.
- Jeremías Denis y Matías Billordo, anunciados como bajas antes de 2026, no aparecen en el CSV.
- La convocatoria de la fecha 30 confirma a Julián García, Sebastián De Luca, Matías Gómez, Alan Salmantón, Emanuel Saporito, Fabián Monserrat, Leonel Duarte, Matías Sosa, Santiago Soria, Isaías González y Ramiro Rivarola, todos incluidos.
- No se detectó una omisión ni una baja nueva para aplicar.

Fuentes: [plantel de Victoriano Arenas](https://www.soloascenso.com.ar/club/victoriano-arenas/314), [bajas y refuerzos de diciembre](https://www.soloascenso.com.ar/notas/victoriano-arenas/el-cava-tiene-dos-bajas-confirmadas-para-el-2026/223243), [Victoriano vs Juventud Unida, fecha 30](https://www.soloascenso.com.ar/sintesis/boca-juniors-racing-club/45301).

### Deportivo Paraguayo — 42 cargados

- La nómina de Solo Ascenso coincide con los 42 jugadores del CSV.
- Se verificó la salida previa al torneo de Rodrigo Dinocco, Diego Zumbo y Ezequiel Abal; no aparecen en el CSV de Paraguayo.
- Ian Lynch y Rodrigo Ortiz se incorporaron durante 2026 y sí están incluidos. Lynch llegó desde Lamadrid a mitad de año; Ortiz regresó en julio.
- Diego Fassi y Ramiro Oliverio sufrieron lesiones importantes durante la temporada, pero permanecen como integrantes del plantel: una lesión de larga duración no equivale a una desvinculación.
- No se detectó una omisión o una baja adicional para aplicar.

Fuentes: [plantel de Deportivo Paraguayo](https://www.soloascenso.com.ar/club/deportivo-paraguayo/268), [bajas de diciembre](https://www.soloascenso.com.ar/notas/deportivo-paraguayo/se-dieron-a-conocer-las-primeras-salidas-en-paraguayo/222920), [llegada de Ian Lynch y Rodrigo Ortiz](https://www.soloascenso.com.ar/notas/claypole/paraguayo-tiene-una-nueva-incorporacion-para-el-ataque/230131), [lesiones de Fassi y Oliverio](https://www.soloascenso.com.ar/notas/deportivo-paraguayo/paraguayo-tendra-un-duelo-crucial-con-argentino-de-rosario/230866), [convocatoria previa a la fecha 30](https://www.soloascenso.com.ar/notas/estrella-del-sur-alejandro-korn/paraguayo-juega-en-su-casa-frente-a-uno-de-los-escoltas/233008).

### Atlas — 42 cargados

- La nómina de Solo Ascenso coincide con los 42 jugadores del CSV.
- Se contrastaron las incorporaciones anunciadas en febrero: los nombres del listado de altas están representados en el CSV.
- Los jugadores que el mercado registra como bajas hacia Control Orientado, Leones FC y Lugano no deben reincorporarse al plantel de Atlas.
- No se detectó una omisión ni una baja nueva para aplicar. El número de 42 sigue siendo alto, pero no hay evidencia suficiente para recortar nombres de la lista vigente sin revisar participaciones individuales.

Fuentes: [plantel de Atlas](https://www.soloascenso.com.ar/club/atlas/247), [refuerzos presentados en febrero](https://www.soloascenso.com.ar/notas/atlas/el-marron-presento-oficialmente-a-sus-nuevos-jugadores/224589), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Fénix — 42 cargados

- La nómina de Solo Ascenso coincide con los 42 jugadores del CSV.
- Se revisó el extenso recambio previo al inicio de 2026: las bajas de Ramiro Cordero, Juan Martín Chiarantano, Ramiro Gómez, Kevin Lugo, Ignacio Rojas, Fabián Díaz, Dante Silva, Santiago Auteri, Carlos Giménez, Ignacio Ahumada, Eduardo Sánchez y otros nombres del plantel anterior no fueron reintroducidas en el CSV.
- Se verificaron las altas de Damián Pérez Roa, Diego Zumbo, Facundo Gómez, Nahuel Ortigoza, Emir Ham, Nicolás Velazco, Marcos Jara, Lucas Rancic, Augusto Ghiglione, Mariano Mittelman, Santiago Erviti, Bautista Álvarez y otras incorporaciones: están representadas en la nómina actual.
- Jeremías Mayor se conserva porque su continuidad fue confirmada pese a que inicialmente se lo había mencionado entre las posibles salidas.
- No se detectó una omisión ni una baja adicional para aplicar.

Fuentes: [plantel de Fénix](https://www.soloascenso.com.ar/club/fenix/274), [once bajas confirmadas en enero](https://www.soloascenso.com.ar/notas/fenix/malas-noticias-en-fenix-se-confirmaron-once-bajas/224238), [refuerzos de enero](https://www.soloascenso.com.ar/notas/afa/dos-nuevos-refuerzos-se-sumaron-al-plantel-de-fenix/224442), [altas de febrero](https://www.soloascenso.com.ar/notas/afa/fenix-presento-cuatro-nuevos-refuerzos-para-la-primera-c/223460).

**Resultado de esta tanda:** los cuatro CSV coinciden con las nóminas de plantel consultadas y reflejan las altas y bajas relevantes del mercado. No se modificaron jugadores: la auditoría no consiste en reducir planteles arbitrariamente, sino en asegurar que cada nombre tenga respaldo y pertenezca al plantel de 2026.


## 9. Auditoría individual — quinta tanda amplia

Se revisaron Claypole, Deportivo Español, Sportivo Barracas y Yupanqui, contrastando las cuatro nóminas con las listas actuales de Solo Ascenso y las novedades de mercado de 2026.

### Claypole — 39 cargados

- La nómina de Solo Ascenso coincide con los 39 jugadores del CSV.
- Se verificaron las altas previas al torneo: Alejo Klipauka, Tomás Luján y Joaquín Cabrera están incluidos.
- Tomás Tello, Santiago Galván y Matías Coselli, informados como salidas antes del inicio, no aparecen en el CSV.
- La lista de plantel publicada incluye a los futbolistas que sostuvieron el equipo durante el segundo semestre. No se detecta omisión o baja nueva en este cruce.

Fuentes: [plantel de Claypole](https://www.soloascenso.com.ar/club/claypole/258), [altas y bajas antes del torneo](https://www.soloascenso.com.ar/notas/claypole/con-fixture-definido-claypole-ya-piensa-en-el-proximo-ano/223128), [renovaciones y tres refuerzos](https://www.soloascenso.com.ar/notas/claypole/tres-refuerzos-una-baja-y-varias-renovaciones-en-claypole/222830).

### Deportivo Español — 39 cargados

- La nómina actual de Solo Ascenso coincide con los 39 jugadores del CSV.
- Las seis promociones desde Reserva anunciadas el 22/08 fueron revisadas: Juan Torre y Luca Morales ya están incluidos. José Carballo, Nahuel Gamboa, Tobías Díaz y Franco Stábile no se agregan por ahora porque el anuncio confirma su promoción y entrenamientos con Primera, pero no acredita por sí solo minutos ni convocatorias de partido.
- Las altas registradas en el mercado (Santiago Ávila, Darío Salina, Fabián Leguizamón y Franco Lopresti) están reflejadas en el CSV.
- Las bajas de Rodrigo Jalitt, Nicolás Ortiz, Thomas Arrieta, Bruno Robles, Diosnel Zuccarino y Simón Martínez no se reincorporan.
- No se detecta omisión o baja nueva que justifique modificar el CSV.

Fuentes: [plantel de Deportivo Español](https://www.soloascenso.com.ar/club/deportivo-espanol/307), [seis juveniles promovidos a Primera](https://www.soloascenso.com.ar/notas/deportivo-espanol/seis-juveniles-de-espanol-empezaron-a-entrenar-con-primera/231701), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c), [convocatoria de la fecha 30](https://www.soloascenso.com.ar/ficha/45309).

### Sportivo Barracas — 39 cargados

- La nómina de Solo Ascenso coincide con los 39 jugadores del CSV.
- Las altas de enero (incluidos Alen Boschi y Leonel Barrionuevo) están incorporadas.
- Se confirmó la llegada de Nicolás Jorquera en julio y Exequiel Ortiz también aparece como incorporación de mitad de año; ambos están en el CSV.
- Las bajas anunciadas antes de la temporada (Fabrizio Brandán, Onan Hilt, Franco Sosa y Santiago Chira, entre otros) no se incorporaron.
- No se detecta omisión o baja nueva en el cruce.

Fuentes: [plantel de Sportivo Barracas](https://www.soloascenso.com.ar/club/sportivo-barracas/249), [bajas previas al torneo](https://www.soloascenso.com.ar/notas/sportivo-barracas/se-confirmaron-las-primeras-salidas-en-sportivo-barracas/223263), [alta de Alen Boschi y mercado inicial](https://www.soloascenso.com.ar/notas/sportivo-barracas/sportivo-barracas-anuncio-la-llegada-de-un-nuevo-refuerzo/224357), [llegada de Leonel Barrionuevo](https://www.soloascenso.com.ar/notas/sportivo-barracas/desde-almagro-llego-un-nuevo-refuerzo-para-el-arrabalero/224444), [llegada de Nicolás Jorquera](https://www.soloascenso.com.ar/notas/sportivo-barracas/presento-su-segunda-incorporacion/230104).

### Yupanqui — 39 cargados

- La nómina de Solo Ascenso coincide con los 39 jugadores del CSV.
- Se verificaron las incorporaciones de enero y febrero, así como las renovaciones anunciadas. Los futbolistas que dejaron el club antes del inicio no fueron cargados.
- **Santino Colángelo se conserva correctamente**: aunque figuró entre las bajas de enero, regresó desde Almagro a préstamo el 06/07 y disputó 11 partidos con Yupanqui en 2026.
- Santiago Brotzman y Santino Colángelo fueron las incorporaciones del mercado de invierno; ambos están contemplados.
- Felipe Rocca, que salió a Gimnasia de Concepción del Uruguay, no figura en el CSV.
- No se detecta omisión o baja nueva en el cruce.

Fuentes: [plantel de Yupanqui](https://www.soloascenso.com.ar/club/yupanqui/317), [altas, bajas y renovaciones de enero](https://www.soloascenso.com.ar/notas/yupanqui/el-trapero-presento-tres-incorporaciones-y-una-renovacion/224236), [refuerzos de febrero](https://www.soloascenso.com.ar/notas/lujan/el-trapero-confirmo-la-llegada-de-seis-nuevos-refuerzos/224666), [regreso de Santino Colángelo](https://www.soloascenso.com.ar/notas/yupanqui/santino-colangelo-vuelve-a-ponerse-la-camiseta-de-yupanqui/230105), [registro de 11 partidos en 2026](https://www.soloascenso.com.ar/perfil/santino-colangelo/30359).

**Resultado de esta tanda:** los cuatro planteles coinciden con sus nóminas actuales y las altas/bajas documentadas. Se confirma el regreso de Colángelo a Yupanqui y se evita sumar juveniles a Español solo por haber entrenado con Primera. No se aplicaron cambios especulativos.


## 10. Auditoría individual — sexta tanda amplia

Se revisaron Leones FC, Luján, Central Córdoba de Rosario y General Lamadrid.

### Leones FC — 37 cargados

- La nómina actual de Solo Ascenso coincide con los 37 nombres del CSV.
- Las altas de Gustavo Britos, Nicolás Giménez, Lionel Segovia y Gonzalo Gómez están incluidas.
- No se detectó una baja adicional ni una omisión inequívoca en el cruce de la lista actual.
- Se mantiene pendiente profundizar el historial individual de los jugadores con poca participación; la lista nominal por sí sola no alcanza para recortar el plantel.

Fuente: [plantel de Leones FC](https://www.soloascenso.com.ar/club/leones-fc-rosario/1228), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Luján — 33 cargados

- La nómina actual de Solo Ascenso coincide con los 33 nombres del CSV.
- Se verificaron las incorporaciones de Sebastián Gallo, Tobías Luna y Adrián Ocampo; los tres están incluidos.
- Brandon Arriola se marchó a Dock Sud en junio y no aparece en el CSV.
- Luján fue campeón de la Primera C 2026 y ascendió a Primera B para 2027. La composición del plantel de cierre queda correctamente separada de los movimientos que ocurran después de la temporada.
- No se detecta omisión o baja nueva en este cruce.

Fuentes: [plantel de Luján](https://www.soloascenso.com.ar/club/lujan/290), [llegadas de Tobías Luna y Adrián Ocampo y salida de Brandon Arriola](https://www.soloascenso.com.ar/notas/berazategui/lujan-tiene-dos-refuerzos-para-el-segundo-semestre/229549), [estadísticas de la campaña campeona](https://www.soloascenso.com.ar/notas/lujan/los-grandes-numeros-del-lujan-campeon-de-la-primera-c/233965).

### Central Córdoba de Rosario — 32 cargados

- Se cotejó el plantel oficial presentado en febrero (30 futbolistas) con los movimientos de mitad de temporada.
- Las salidas de Renzo Altamura, Gino Albertengo y Brian Otero están correctamente reflejadas: los tres dejaron el club en junio.
- Las incorporaciones de Aarón Quijano, Mirko Pfarherr, Diego Barrionuevo y Nelson Ávalos aparecen en el CSV.
- **Leonel Fagúndez** tuvo tres participaciones y 34 minutos al inicio de la temporada, pero no figura en el CSV actual. Como su actividad fue muy limitada, queda como caso a evaluar en el criterio de plantel de cierre, no como alta automática.
- No se retiran otros nombres en esta tanda.

Fuentes: [plantel profesional presentado para 2026](https://www.soloascenso.com.ar/notas/central-cordoba-rosario/central-cordoba-y-sus-jugadores-para-competir-en-el-2026/225133), [salidas de Altamura, Albertengo y Otero](https://www.soloascenso.com.ar/notas/general-lamadrid/tres-bajas-en-la-delantera-de-central-cordoba-de-rosario/229367), [perfil y tres participaciones de Leonel Fagúndez](https://www.zerozero.pt/jogador/leonel-fagundez/2700216?epoca_id=155), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### General Lamadrid — 36 cargados

- La presentación oficial de febrero confirmó 33 integrantes del plantel profesional, y la nómina actual de Solo Ascenso registra las incorporaciones y movimientos posteriores.
- **Néstor Acosta ya fue incorporado al CSV**: fue titular en los 33 partidos de Liga, con 2.887 minutos y 16 vallas invictas. Se le asignó dorsal 31 estimado, libre en el club.
- Tomás Moreno, Iván Ruíz y Breyner Mata salieron del plantel en octubre para buscar continuidad y no deben reincorporarse al cierre de temporada.
- Darío Nami se incorporó desde El Porvenir durante el año y está correctamente incluido.
- La incorporación de Néstor Acosta se integra junto con la depuración de Central Ballester mediante una misma actualización del runtime.

Fuentes: [presentación del plantel profesional de 2026](https://www.soloascenso.com.ar/notas/general-lamadrid/lamadrid-presento-a-todos-sus-futbolistas-para-el-2026/225081), [perfil de Acosta: 33 partidos y 2.887 minutos](https://www.soloascenso.com.ar/perfil/nestor-acosta/12874), [confirmación de su salida recién para 2027](https://www.soloascenso.com.ar/notas/deportivo-camioneros/nestor-acosta-el-idolo-no-continuara-en-lamadrid/234243), [movimiento de Nami desde El Porvenir](https://www.soloascenso.com.ar/notas/muniz/el-porvenir-sufrio-su-primera-baja-y-ya-tiene-destino/229788).

**Resultado de esta tanda:** se corrigió la omisión de Néstor Acosta y se retiró a Franco Gómez. Leonel Fagúndez sigue fuera del CSV de Central Córdoba porque sólo registra 34 minutos en tres partidos; se mantiene la decisión de no inflar el plantel con participaciones mínimas.


## 11. Auditoría individual — séptima tanda amplia

Se revisaron Berazategui, Cañuelas, Centro Español y Club Mercedes.

### Berazategui — 38 cargados

- La nómina actual de Solo Ascenso coincide con los 38 jugadores del CSV.
- Se verificaron las incorporaciones anunciadas en el mercado de pases: Santiago Escudero, Federico Tursi, Leonel Miranda y Joaquín Molina. Los cuatro están incluidos.
- No se detectó una baja adicional u omisión inequívoca en este cruce.
- No se recorta el plantel sin revisar participación individual de los nombres con menos actividad.

Fuentes: [plantel de Berazategui](https://www.soloascenso.com.ar/club/berazategui/253), [plantel 2026 de Mundo Ascenso](https://www.mundoascenso.com.ar/plantel/8382-berazategui), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Cañuelas — 31 cargados

- La nómina de Solo Ascenso coincide con los 31 jugadores del CSV.
- Se verificaron las renovaciones y altas iniciales: Agustín Coali, Adrián Marín, Mateo Coyette y Alexis Quagliano están incluidos.
- Facundo Cipresso llegó desde Argentino de Merlo en julio y está incluido.
- Jeremías Heidenreich, Santiago Pavón, Santiago Centurión, Nahuel Guerrero, Laureano Colombo, David Soria y Kevin Ribeiro no se reincorporaron al plantel 2026.
- Gerónimo Patritti fue transferido a Gimnasia de Mendoza antes del inicio y no aparece en el CSV.
- Santino Sapio figura una sola vez; MED se conserva como posición secundaria para evitar duplicarlo por aparecer en más de una línea de las fuentes.

Fuentes: [plantel de Cañuelas](https://www.soloascenso.com.ar/club/canuelas-fc/256), [bajas y primeras altas](https://www.soloascenso.com.ar/notas/canuelas-fc/el-tambero-pierde-a-su-goleador-para-afrontar-lo-que-viene/222729), [salidas adicionales](https://www.soloascenso.com.ar/notas/canuelas-fc/el-tambero-dio-a-conocer-la-salida-de-varios-jugadores/222048), [venta de Gerónimo Patritti](https://www.soloascenso.com.ar/notas/canuelas-fc/el-capitan-de-canuelas-dio-el-salto-a-la-liga-profesional/224411), [alta de Facundo Cipresso](https://www.soloascenso.com.ar/notas/deportivo-espanol/desde-la-primera-b-llego-un-refuerzo-para-canuelas/230619), [convocatoria de la fecha 27](https://www.soloascenso.com.ar/notas/canuelas-fc/canuelas-se-la-juega-frente-al-puntero-del-torneo/232237).

### Centro Español — 29 cargados

- La nómina actual de Solo Ascenso coincide con los 29 jugadores del CSV.
- Tomás Rozic, incorporación desde Comunicaciones, está incluido.
- Las bajas de William Giménez, Ivo Regules, Rodrigo Suárez y Carlos Di Pietro no fueron incorporadas al plantel de cierre.
- Santiago Gómez y David Bulacio, bajas confirmadas antes del inicio de 2026, tampoco aparecen en el CSV.
- La ficha de la fecha 27 confirma titulares y suplentes del núcleo del plantel y coincide con los nombres cargados.
- No se detecta omisión o baja nueva en este cruce.

Fuentes: [plantel de Centro Español](https://www.soloascenso.com.ar/club/centro-espanol/257), [bajas de Santiago Gómez y David Bulacio](https://www.soloascenso.com.ar/notas/centro-espanol/centro-espanol-sufrio-la-partida-de-dos-jugadores/223373), [convocatoria de la fecha 27](https://www.soloascenso.com.ar/ficha/45273), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Club Mercedes — 35 cargados

- La nómina actual de Solo Ascenso coincide con los 35 jugadores del CSV.
- La incorporación de Arturo Daniel Mendoza desde Jorge Newbery de Comodoro Rivadavia está incluida.
- No se detectó una baja u omisión nueva que justifique modificar el CSV.
- Se mantiene la revisión de dorsales como estimados cuando no existe número oficial confirmado; no se altera la cantidad de jugadores para forzar un tamaño fijo.

Fuentes: [plantel de Club Mercedes](https://www.soloascenso.com.ar/club/mercedes/438), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

**Resultado de esta tanda:** los cuatro CSV coinciden con las nóminas actuales consultadas y con los movimientos de mercado verificados. No se aplican recortes especulativos ni se agregan juveniles sin convocatoria o participación comprobable.


## 12. Auditoría individual — octava tanda amplia

Se revisaron Defensores de Cambaceres, Puerto Nuevo y Deportivo Muñiz.

### Defensores de Cambaceres — 35 cargados

- La nómina actual de Solo Ascenso coincide con los 35 jugadores del CSV.
- Se verificó la incorporación de Dago Sánchez Palencia, Carlos Raga Córdoba y Facundo Aronna desde Argentino de Rosario. Los tres están incluidos en Cambaceres y correctamente excluidos del plantel de cierre de Argentino.
- Víctor Gómez se conserva: sumó 25 presencias y dos goles en la temporada. Su salida anunciada en octubre fue posterior al cierre de la fase regular, por lo que no debe borrarse del plantel 2026.
- Las trece salidas anunciadas el 23/10 corresponden a la preparación de 2027; no se usan para borrar retroactivamente a quienes integraron el plantel durante 2026.
- No se detecta omisión o baja nueva en este cruce.

Fuentes: [plantel de Cambaceres](https://www.soloascenso.com.ar/club/defensores-de-cambaceres/265), [ficha de la fecha 30 ante Centro Español](https://www.soloascenso.com.ar/ficha/45300), [presentación de las trece bajas para 2027](https://www.universofutbol.com/plantillas/archivos/template_clubes.php?camp=1839&div=4&equ=274), [movimientos desde Argentino de Rosario](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Puerto Nuevo — 33 cargados

- La nómina actual de Solo Ascenso coincide con los 33 jugadores del CSV.
- El club había presentado 26 profesionales en febrero; el CSV refleja las incorporaciones posteriores que sí quedaron en el plantel y aparecen en las convocatorias, entre ellas Yair Núñez, Lautaro Arellano, Ricardo Grance, Carlos Ortiz, Ezequiel Sánchez, Santiago Roldán y Luciano Verón.
- Se verificó que Guido Ferrara, Ricardo Grance, Juan Pablo López, Franco Coronel, Maximiliano Carnelutto, Rodrigo Martínez, Ignacio Cahiza, Enzo Ritacco, Lautaro Arellano, Luciano Verón, Facundo Esquivel y Mateo Escobar integraron convocatorias de la temporada.
- No se detecta omisión o baja nueva que justifique modificar el CSV.

Fuentes: [plantel oficial presentado en febrero](https://www.soloascenso.com.ar/notas/puerto-nuevo/puerto-nuevo-tiene-todo-listo-para-competir-en-el-2026/225078), [plantel actual de Puerto Nuevo](https://www.soloascenso.com.ar/club/puerto-nuevo/297), [refuerzos adicionales](https://www.soloascenso.com.ar/notas/puerto-nuevo/puerto-nuevo-presento-otros-cuatro-jovenes-refuerzos/224463), [convocatoria de la fecha 14](https://www.soloascenso.com.ar/ficha/45116), [convocatoria de la fecha 19](https://www.soloascenso.com.ar/ficha/45188).

### Deportivo Muñiz — 38 cargados

- La nómina actual de Solo Ascenso coincide con los 38 jugadores del CSV.
- Se verificaron las 17 bajas de la temporada anterior y las seis incorporaciones iniciales. Los nombres que no continuaron no se reincorporaron al CSV.
- Félix Orode no aparece en el CSV de cierre, correctamente: fue parte del equipo durante el primer semestre, pero en agosto pasó a La Campana de Saladillo. Sus dos goles y 16 partidos de 2026 no implican que siguiera en Muñiz al cierre.
- Se incluyeron las altas posteriores que aparecen en convocatorias, entre ellas Nicolás Slimmens, Juan Cruz Mesa y Ezequiel López.
- La lista de plantel coincide con los 38 nombres cargados. No se detecta omisión o baja nueva.

Fuentes: [plantel actual de Muñiz](https://www.soloascenso.com.ar/club/muniz/346), [17 bajas y seis altas de enero](https://www.soloascenso.com.ar/notas/muniz/el-rayo-volvio-al-trabajo-con-mucho-movimiento-en-su-plantel/223532), [refuerzos confirmados antes del inicio](https://www.soloascenso.com.ar/notas/muniz/muniz-viajo-a-la-costa-para-continuar-con-la-pretemporada/223979), [salida de Félix Orode en agosto](https://www.sportdigital.com.ar/nota/14553/futbol-gran-refuerzo-de-la-campana-para-el-torneo-clausura), [registro de su temporada con Muñiz](https://www.besoccer.com/player/felix-orode).

**Resultado de esta tanda:** los tres CSV coinciden con las nóminas actuales consultadas. Se confirma que Orode debe permanecer fuera del plantel de cierre de Muñiz, mientras que Víctor Gómez debe conservarse en Cambaceres para la temporada 2026.


## 13. Correcciones finales de la auditoría — Central Ballester y Lamadrid

- **Central Ballester:** Franco Gómez se retiró del CSV por registrar cero presencias y cero convocatorias en 2026. El plantel baja de 51 a 50 jugadores; su distribución queda en 4 ARQ, 16 DEF, 17 MED y 13 DEL.
- **Agustín Corbalán se conserva** a pesar de la baja anunciada en enero de 2025, porque figura en la nómina actual del primer equipo de Central Ballester. La pertenencia está respaldada; sus convocatorias todavía deben verificarse.
- **General Lamadrid:** se agregó Néstor Acosta. Fue titular en los 33 partidos de 2026, sumó 2.887 minutos y 16 vallas invictas. El CSV pasa de 35 a 36 jugadores; dorsal 31 estimado, sin duplicados.
- El total global se mantiene en **1.124 jugadores**: se quitó un jugador sin actividad y se agregó uno con participación plena. La distribución global actual queda en 101 ARQ, 305 DEF, 494 MED y 223 DEL.

Fuentes adicionales: [nómina actual de Central Ballester](https://www.soloascenso.com.ar/club/central-ballester/261), [perfil 2026 de Franco Gómez](https://www.soloascenso.com.ar/perfil/franco-gomez/16183), [perfil 2026 de Néstor Acosta](https://www.soloascenso.com.ar/perfil/nestor-acosta/12874).


### Central Ballester — cruce adicional de convocatorias

- **Maximiliano Maciel se conserva**: fue citado 21 veces, ingresó en 11 partidos y fue suplente sin entrar en ocho. Su retiro anunciado el 16/10 fue posterior al cierre de la temporada, por lo que pertenece al plantel 2026.
- **Santiago Garro se conserva**: fue presentado como refuerzo del primer equipo en febrero y aparece como suplente en convocatorias de septiembre y octubre.
- **Nicolás Suaya se conserva**: fue presentado como refuerzo del primer equipo en enero. No registra minutos, pero sí convocatorias de suplentes no utilizados en las fichas de temporada.
- **Jesús Monzón se conserva**: aparece en el banco de suplentes de la fecha 13.
- **Agustín Corbalán se mantiene en revisión**: figura en la nómina actual del primer equipo, aunque todavía no se encontró una convocatoria o minuto de 2026.
- Los demás nombres sin minutos no se eliminan por ahora: falta completar el cruce de convocatorias y fichas individuales. La regla es no retirar a un integrante del primer equipo sólo por no haber ingresado.

Fuentes: [Maximiliano Maciel: 21 convocatorias, 11 ingresos y ocho partidos sin ingresar](https://www.soloascenso.com.ar/notas/central-ballester/un-referente-de-ballester-se-retiro-del-futbol-profesional/233675), [continuidad de Maciel para 2026](https://www.soloascenso.com.ar/notas/central-ballester/el-delantero-con-experiencia-que-seguira-en-ballester/223881), [presentación de Santiago Garro](https://www.soloascenso.com.ar/notas/puerto-nuevo/central-ballester-incorporo-a-otro-joven-arquero-al-plantel/225381), [presentación de Nicolás Suaya](https://www.soloascenso.com.ar/notas/central-ballester/el-canalla-presento-a-tres-jugadores-nuevos-para-el-plantel/223900), [convocatoria de la fecha 31](https://www.soloascenso.com.ar/ficha/45320), [convocatoria de la fecha 13](https://www.ceroacero.es/partido/2026-08-04-paraguayo-central-ballester/12020535).


### Corrección de datos individuales — Valentín Mancuso (Sacachispas)

- El jugador ya estaba incluido en `tanda1-inicial.csv`; la observación anterior que lo marcaba como ausente era incorrecta.
- TACAZO informa edad 21 y posición defensor para el plantel 2026; Mundo Ascenso también lo lista entre los defensores con dorsal 15. La ficha de partido de la fecha 27 lo muestra como suplente utilizado en el banco.
- Se actualiza el registro del juego a edad `21`, conservando `MED` de forma provisional por la clasificación de Solo Ascenso. El dorsal 42 sigue como estimación propia: Mundo Ascenso publica #15, pero antes de reemplazarlo se debe confirmar si ese número es camiseta oficial de temporada y no numeración de lista.
- Fuentes: https://tacazo.com.ar/equipo.html?id=club-1942 ; https://www.mundoascenso.com.ar/plantel/1942-sacachispas-fc ; https://www.soloascenso.com.ar/ficha/45273 .


### Nota de consistencia de fuentes — Valentín Mancuso

- La nómina de Solo Ascenso para Primera C 2026 (https://www.soloascenso.com.ar/club/sacachispas-fc/300) lo clasifica como MED; TACAZO (https://tacazo.com.ar/equipo.html?id=club-1942) y Mundo Ascenso (https://www.mundoascenso.com.ar/plantel/1942-sacachispas-fc) lo clasifican como DEF. Se mantiene MED provisionalmente porque la fuente de plantilla de Solo Ascenso está vinculada al mismo registro de temporada utilizado para el resto del plantel. Revisar rol específico antes de cerrar.
- TACAZO publica edad 21. El registro ya la incorpora. El dorsal 42 permanece estimado hasta validar el #15 que aparece en la lista de Mundo Ascenso.


## 14. Completar edades verificadas — Sacachispas

Se incorporan edades publicadas por TACAZO para 15 futbolistas de Sacachispas, con la URL guardada en `fuente_edad`: Facundo Troncoso (23), Héctor Navarro (18), Alan Buonofiglio (29), Lautaro Cardozo (23), Ezequiel Moschen (25), Emanuel Barreiro (23), Héctor Canteros (36), Facundo Durso (25), Santiago Gallardo (29), Valentín Mancuso (21), Diego Molina Fariña (32), Alejo Monje (24), Juan Cruz Oltmann (24), Ricardo Priori (29) y Lautaro Torres (29). Matías Arias ya tenía edad 25 documentada por ZeroZero. El club queda con 16/50 edades informadas; no se completan las restantes por inferencia.

Fuente de las 15 edades: https://tacazo.com.ar/equipo.html?id=club-1942 . Fuente de Matías Arias: https://www.zerozero.pt/jogador/matias-arias/1235568?edicao_id=212447 .

### Cruce de nómina de Sacachispas

La nómina de temporada de Solo Ascenso contiene 49 nombres y los 49 están presentes en el CSV. Matías Arias es el único registro adicional respecto de esa lista, incorporado aparte por su ficha individual de temporada (16 partidos, 1.306 minutos). Por lo tanto, el total de 50 tiene respaldo nominal; no se agregan nombres por la lista parcial de TACAZO/Mundo Ascenso. Kevin Romero aparece en algunas fuentes de Sacachispas, pero sus registros de 2026 lo ubican en El Porvenir (23 partidos, 1.845 minutos), por lo que no se incorpora a Sacachispas.

Fuentes: https://www.soloascenso.com.ar/club/sacachispas-fc/300 ; https://es.besoccer.com/jugador/k-romero-3540358 .


## 7. Auditoría ampliada — Juventud Unida, Argentino de Rosario y Central Ballester

### Juventud Unida — cierre de temporada

- Se contrastaron los **51 registros** del CSV con la nómina 2026 publicada por Solo Ascenso: coinciden los nombres del plantel cargado, incluidos los cuatro arqueros.
- La convocatoria y formación confirmada frente a Mercedes (fecha 26) aporta una segunda verificación: los 11 titulares y los nueve suplentes publicados están incluidos en el CSV. Se confirma especialmente la presencia de Andrés Molinas, Emiliano Ortíz y Mateo Pedemonti, que no deben confundirse con altas de otros clubes.
- Fernando Giménez y Santino Bevilacqua no se reincorporan al plantel de cierre: las fuentes de mercado/temporada registran sus salidas durante el año.
- **Resultado:** no se recorta el plantel por ahora. Los 51 coinciden con la nómina actual consultada; el tamaño queda marcado para una depuración posterior sólo si aparecen bajas o jugadores ajenos al primer equipo con evidencia individual.

Fuentes: [nómina 2026 de Juventud Unida](https://www.soloascenso.com.ar/club/juventud-unida/284), [convocados y formación ante Mercedes](https://www.soloascenso.com.ar/ficha/45257), [previa del partido y lista de convocados](https://www.soloascenso.com.ar/notas/central-ballester/juventud-unida-y-un-enfrentamiento-directo-contra-mercedes/231988).

### Argentino de Rosario — movimientos y nómina de cierre

- La nómina vigente de Solo Ascenso y las convocatorias de las fechas 26, 28, 30 y 31 confirman la presencia de la base que figura en el CSV: Francisco Olivera, Mateo González, Ignacio Canteros, Tiago Celes, Luciano Fernández, Joaquín Galimberti, Juan Cruz Cisneros, Theo Guiñazú, Thiago Bartalini, Octavio Rubarth y Juan Bautista Cantiani, entre otros.
- Se mantiene la exclusión de **Carlos Raga Córdoba, Dago Sánchez Palencia y Facundo Aronna** del plantel de cierre, porque sus salidas a Cambaceres fueron registradas en el mercado de mitad de temporada.
- El registro de mercado menciona a Manuel González como alta desde Chañarense, pero no aparece en la nómina consolidada de Solo Ascenso ni en las convocatorias finales consultadas. **No se agrega** sin evidencia de integración efectiva al plantel de cierre.
- **Resultado:** no se agregan nombres por rumores o registros aislados de mercado ni se eliminan futbolistas que aparecen en convocatorias de la segunda mitad.

Fuentes: [nómina 2026 de Argentino de Rosario](https://www.soloascenso.com.ar/club/argentino-de-rosario/243), [formación y banco ante Centro Español, fecha 26](https://www.soloascenso.com.ar/ficha/45255), [convocatoria ante Central Córdoba, fecha 28](https://www.soloascenso.com.ar/notas/argentino-de-rosario/argentino-busca-quedarse-con-el-clasico-en-el-gabino-sosa/232558), [formación ante Estrella del Sur, fecha 30](https://www.soloascenso.com.ar/notas/argentino-de-rosario/argentino-volvio-a-caer-y-quedo-muy-comprometido/233061), [bajas de Raga y Dago](https://www.soloascenso.com.ar/notas/argentino-de-rosario/argentino-de-rosario-sufrio-dos-bajas-en-el-mediocampo/229363), [mercado de pases Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Central Ballester — altas y bajas de mitad de año

- Se confirma que **Gabriel González** llegó a préstamo desde Comunicaciones en junio; el mediocampista ya figura en el CSV.
- **Brian Vittadello** llegó desde J.J. Urquiza en junio y disputó siete partidos con Central Ballester; también figura en el CSV. La lesión informada al cierre de la temporada no cambia su pertenencia al plantel 2026.
- **Luca Navarra** llegó desde Claypole y está incluido en el CSV. Se conserva porque integró el plantel y tuvo participación; no se lo confunde con la baja de Aaron Quijano.
- **Aaron Quijano** permanece correctamente en Central Córdoba de Rosario tras su salida de Ballester. No se duplica entre ambos clubes.
- **Resultado:** las tres incorporaciones de mitad de temporada identificadas (González, Vittadello y Navarra) están contempladas. No se agregan duplicados ni se hacen bajas adicionales sin revisar las convocatorias restantes.

Fuentes: [llegada de Gabriel González](https://www.soloascenso.com.ar/notas/atlas/central-ballester-tiene-un-nuevo-jugador-en-el-mediocampo/229554), [llegadas de Vittadello y Navarra](https://www.soloascenso.com.ar/notas/central-ballester/se-confirmo-un-refuerzo-y-llego-otro-atacante-en-ballester/229680), [participación y lesión de Vittadello](https://www.soloascenso.com.ar/notas/central-ballester/brian-vittadello-se-lesiono-y-sera-baja-por-un-tiempo-largo/233662), [traspasos de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Corrección estadística

Al recalcular las 1.124 filas de los cuatro CSV, la distribución correcta es **101 ARQ, 305 DEF, 494 MED y 223 DEL**. Se corrige la tabla de distribución de posiciones; el total de 1.124 jugadores y 28 clubes no cambia.


## 8. Auditoría ampliada — Estrella del Sur, Victoriano Arenas y Club Mercedes

### Estrella del Sur — corrección por nómina oficial

- La nómina 2026 publicada por Solo Ascenso incluye a **Gabriel Rivera** como arquero del plantel. Aunque no registra minutos de primera división en la revisión estadística previa, su presencia en la nómina consolidada es evidencia directa de pertenencia al plantel.
- Se lo **reincorpora** al CSV como sexto arquero del listado, con rating 45 y dorsal 32 estimados; edad y dorsal quedan pendientes de confirmación. No se presenta el número como oficial.
- Las fichas de las fechas 26, 28 y 31 confirman además la continuidad de los titulares y suplentes principales que ya están cargados.
- **Resultado:** Estrella del Sur pasa de 42 a 43 jugadores. La reincorporación corrige una exclusión demasiado estricta basada sólo en minutos disputados.

Fuentes: [nómina 2026 de Estrella del Sur](https://www.soloascenso.com.ar/club/estrella-sur-alejandro-korn/900), [formación y banco ante Victoriano Arenas, fecha 26](https://www.soloascenso.com.ar/ficha/45259), [formación y banco ante Yupanqui, fecha 28](https://www.soloascenso.com.ar/ficha/46100), [formación y banco ante Sacachispas, fecha 31](https://www.soloascenso.com.ar/ficha/45312).

### Victoriano Arenas — nómina de cierre

- Los **37 jugadores** del CSV coinciden con la nómina 2026 publicada por Solo Ascenso.
- La incorporación de **Facundo Rodríguez**, delantero cedido por Talleres de Remedios de Escalada durante julio, está correctamente incluida y respaldada por la noticia de su llegada.
- La convocatoria y el once confirmado ante Berazategui (fecha 25), así como la ficha ante Juventud Unida (fecha 30), confirman a los jugadores principales del bloque.
- **Resultado:** no se agregan ni se eliminan jugadores. El tamaño de 37 se considera razonable para el plantel cargado.

Fuentes: [nómina 2026 de Victoriano Arenas](https://www.soloascenso.com.ar/club/victoriano-arenas/314), [incorporación de Facundo Rodríguez](https://www.soloascenso.com.ar/notas/excursionistas/victoriano-arenas-ya-conoce-a-su-primera-incorporacion/230248), [formación y suplentes ante Berazategui](https://www.soloascenso.com.ar/ficha/45242), [formación ante Juventud Unida](https://www.soloascenso.com.ar/sintesis/boca-juniors-racing-club/45301).

### Club Mercedes — nómina de cierre

- Los **35 jugadores** del CSV coinciden con la nómina 2026 publicada por Solo Ascenso.
- La formación y el banco de suplentes ante Juventud Unida (fecha 26) confirman la presencia de Iván Casco, Thomas Bentancor, Máximo Chan, Hernán Pineda, Martín Zuccaro, Tomás Chaparro, Maximiliano Pighin, Arturo Mendoza, Franco Ortigosa, Francisco Ruiz y los relevos utilizados o convocados.
- **Resultado:** no se detectan omisiones nominales ni incorporaciones pendientes en el cruce realizado; se conserva el plantel de 35 sin ampliarlo artificialmente.

Fuentes: [nómina 2026 de Club Mercedes](https://www.soloascenso.com.ar/club/mercedes/438), [formación y banco ante Juventud Unida](https://www.soloascenso.com.ar/ficha/45257).

### Recuento estructural actualizado

La reincorporación de Gabriel Rivera deja **1.124 jugadores en 28 clubes**. Distribución recalculada: **102 ARQ, 305 DEF, 494 MED y 223 DEL**. El CSV de Estrella del Sur conserva dorsales completos y sin duplicados dentro del club.


## 9. Auditoría ampliada — Berazategui, Deportivo Paraguayo, Cambaceres y Puerto Nuevo

### Berazategui — nómina de cierre

- Los **38 jugadores** del CSV coinciden con la nómina 2026 publicada por Solo Ascenso.
- Se verifican incorporaciones de mitad de temporada como Leonel Miranda y Joaquín Molina, ambos ya incluidos en el archivo.
- No se incorporan jugadores sólo por aparecer en notas de mercado sin formar parte de la nómina de cierre.
- **Resultado:** sin altas ni bajas adicionales en este cruce.

Fuente: [nómina 2026 de Berazategui](https://www.soloascenso.com.ar/club/berazategui/253).

### Deportivo Paraguayo — nómina de cierre

- Los **42 jugadores** cargados coinciden con la nómina 2026 publicada por Solo Ascenso.
- La llegada de Ian Lynch está reflejada en el CSV; no se detectan omisiones nominales adicionales en el cruce de la lista consolidada.
- **Resultado:** se conserva el plantel de 42 sin ampliarlo.

Fuente: [nómina 2026 de Deportivo Paraguayo](https://www.soloascenso.com.ar/club/deportivo-paraguayo/268).

### Defensores de Cambaceres — altas de mitad de temporada

- Los **35 jugadores** del CSV coinciden con la nómina 2026 publicada por Solo Ascenso.
- Se mantienen **Carlos Raga Córdoba, Dago Sánchez Palencia y Facundo Aronna**: llegaron desde Argentino de Rosario durante junio y aparecen en la nómina de Cambaceres. Su salida de Argentino no implica que hayan quedado fuera de Primera C.
- Se mantiene también **Víctor Gómez**, quien figura en la nómina 2026 y tuvo participación durante el torneo.
- Las bajas anunciadas al finalizar octubre corresponden a la preparación de 2027 y no se aplican retroactivamente al plantel de cierre 2026.
- **Resultado:** el traspaso de los tres jugadores colombianos está correctamente reflejado entre los dos clubes, sin duplicarlos en Argentino.

Fuentes: [nómina 2026 de Cambaceres](https://www.soloascenso.com.ar/club/defensores-de-cambaceres/265), [llegada de Raga y Dago](https://www.soloascenso.com.ar/notas/central-cordoba-rosario/defensores-de-cambaceres-sumo-sus-primeros-dos-refuerzos/229362), [depuración anunciada para 2027](https://www.soloascenso.com.ar/notas/san-miguel/cambaceres-comenzo-la-depuracion-trece-bajas-confirmadas/234036).

### Puerto Nuevo — nómina de cierre

- Los **33 jugadores** del CSV coinciden con la nómina 2026 publicada por Solo Ascenso.
- Se mantienen los jugadores que integraron el primer equipo durante el cierre de temporada.
- Los futbolistas probados en el amistoso posterior al torneo ante la reserva de Platense (entre ellos Santiago Molina, Axel Viani, Kevin Sotelo y Matheo Domínguez) no se agregan automáticamente: esa práctica corresponde a la preparación posterior y no acredita por sí sola que integraran el plantel competitivo 2026.
- **Resultado:** no se detectan omisiones ni altas adicionales confirmadas para el cierre de 2026.

Fuentes: [nómina 2026 de Puerto Nuevo](https://www.soloascenso.com.ar/club/puerto-nuevo/297), [amistoso posterior al cierre ante Platense](https://www.soloascenso.com.ar/notas/leones-fc-rosario/puerto-nuevo-sumo-minutos-de-futbol-frente-a-platense/234329).

### Resultado del bloque

Se revisaron cuatro planteles completos más. No hubo cambios de filas: las nóminas consolidadas coinciden con los CSV y los movimientos de mitad de temporada están asignados al club correcto. Se mantiene el total de **1.124 jugadores en 28 clubes**.


## 10. Auditoría ampliada — J.J. Urquiza, Atlético Lugano, Atlas, Cañuelas y Centro Español

Se realizó un cruce nominal completo de los cinco CSV con las nóminas de cierre 2026 publicadas por Solo Ascenso y una revisión conjunta de altas, bajas y convocatorias relevantes. **No se modifican filas en este bloque**: no apareció una omisión o salida inequívoca que justifique cambiar los datos actuales.

### J.J. Urquiza — 49 cargados

- Los 49 nombres del CSV coinciden con la nómina actual de Solo Ascenso.
- La ficha del debut ante Mercedes confirma que Brian Vittadello integró el equipo al comienzo del torneo, pero el registro de mercado muestra su salida a Central Ballester en junio. Por eso está correctamente ausente del CSV de J.J. Urquiza y presente en Central Ballester.
- Fabián Lucero y Gastón Cueto se conservan: ambos aparecen en la nómina de cierre y en la formación/banco de la primera fecha; además Cueto figura entre los goleadores.
- Manuel Aiello está incluido como alta de mitad de año desde Riestra.
- La nómina de 49 es grande. No se recorta por intuición: queda priorizada para una auditoría individual de minutos y convocatorias antes de cualquier baja.

Fuentes: [nómina de J.J. Urquiza](https://www.soloascenso.com.ar/club/jj-urquiza/283), [síntesis J.J. Urquiza–Mercedes, fecha 1](https://www.soloascenso.com.ar/sintesis/jj-urquiza-mercedes/44981), [mercado de pases Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Atlético Lugano — 45 cargados

- Los 45 nombres del CSV coinciden con la nómina de cierre publicada por Solo Ascenso.
- Se corroboran las incorporaciones de Jonathan García, Rodrigo Soria, Celso Báez, Gabriel Urruchúa, Matías Gelpi, Juan Cristaldo, Matías Coselli, Nicolás Insaurralde, José Montiel, Ángel Gómez, Juan Cruz Julián, Pablo Quiroga, Dylan Jara, Santino Milanesi, Damián Fernández, Tobías Graña, Jonathan Acuña, Luca Godoy y Nazareno Plaza.
- La probable formación y la lista de convocados del debut ante Sacachispas incluyen a los principales refuerzos; la nómina de cierre también conserva a los jugadores que sostuvieron el equipo en el segundo semestre.
- Se conserva la grafía **Matías Benardoni** del plantel de Solo Ascenso; el registro de mercado presenta la variante “Bernardoni”.
- 45 es un plantel numeroso. Se deja marcado para revisar minutos/convocatorias y no se elimina a suplentes o juveniles sólo por no tener minutos.

Fuentes: [nómina de Atlético Lugano](https://www.soloascenso.com.ar/club/lugano/289), [refuerzo Jonathan García y altas de enero](https://www.soloascenso.com.ar/notas/lugano/lugano-confirmo-la-incorporacion-de-un-arquero/224109), [convocados ante Sacachispas, fecha 1](https://www.soloascenso.com.ar/notas/lugano/lugano-inicia-un-nuevo-campeonato-frente-a-sacachispas/225093), [mercado de pases Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Atlas — 42 cargados

- Los 42 nombres del CSV coinciden con la nómina actual de Solo Ascenso.
- El equipo titular anunciado para el debut confirma la presencia inicial de Ricardo Grieger, Agustín Polito, Gustavo Alcaraz, Arturo Ordano, Braian Brandán, Daian Vocos, Leonardo Celín, Alexander Meza, Federico González, Nicolás Vidal y Gustavo Britos.
- **Gustavo Britos** no se reincorpora: fue transferido a Leones FC durante la temporada y está correctamente fuera del CSV de Atlas.
- **Ignacio Gallo** también salió de Atlas y aparece en Lugano, donde está correctamente incluido.
- Nicolás Pérez regresó a Atlas en julio y está contemplado en el CSV.
- El tamaño de 42 se marca para revisión individual de participación; no se recorta sin comprobar primero las convocatorias.

Fuentes: [nómina de Atlas](https://www.soloascenso.com.ar/club/atlas/247), [formación probable del debut 2026](https://www.soloascenso.com.ar/notas/atlas/atlas-comienza-una-nueva-temporada-ante-central-ballester/225092), [regreso de Nicolás Pérez](https://www.universofutbol.com/plantillas/archivos/template_clubes.php?camp=1839&div=4&equ=43), [mercado de pases Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Cañuelas — 31 cargados

- Los 31 nombres únicos del CSV coinciden con la nómina vigente de Solo Ascenso. Esa página repite a **Santino Sapio** en DEF y MED; el CSV lo conserva una sola vez como DEF y MED queda documentado como posición secundaria, sin duplicar al futbolista.
- Se mantienen las incorporaciones y renovaciones identificadas: Agustín Coali, Diego Aguirre, Gian Laurito, Mateo Tarrío, Tobías Ybarra y Facundo Cipresso.
- **Gerónimo Patritti** no se reincorpora: la información de mercado previa al inicio registra su transferencia a Gimnasia de Mendoza.
- Se detectó una discrepancia con otra página de plantel que publica nombres diferentes y más antiguos (incluye jugadores que no aparecen en las convocatorias de cierre). Para no mezclar planteles ni temporadas, se prioriza la nómina actual de Solo Ascenso, que coincide con el CSV, y la otra lista queda como fuente secundaria no confirmada.
- **Resultado:** se mantiene el plantel de 31; no se duplica a Sapio ni se agregan nombres por una nómina discordante.

Fuentes: [nómina y goleadores de Cañuelas](https://www.soloascenso.com.ar/club/canuelas-fc/256), [plantel alternativo con discrepancias](https://www.datafutbol.app/liga/arg_primera_c/club/canuelas), [mercado de pases Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Centro Español — 29 cargados

- Los 29 nombres del CSV coinciden con la nómina actual de Solo Ascenso.
- **Tomás Rozic** está correctamente incluido: llegó desde Comunicaciones en junio, debutó con gol y fue el único refuerzo de Centro Español para el segundo semestre.
- Se mantienen fuera del CSV **William Giménez, Ivo Regules, Rodrigo Suárez y Carlos Di Pietro**, cuyas salidas fueron confirmadas hacia Excursionistas, FC Ezeiza, SAT y Atlético Escobar, respectivamente.
- **Resultado:** nómina y movimientos de mercado coinciden; no se detectan altas o bajas pendientes.

Fuentes: [nómina de Centro Español](https://www.soloascenso.com.ar/club/centro-espanol/257), [llegada de Tomás Rozic y cuatro bajas](https://www.soloascenso.com.ar/notas/centro-espanol/el-nuevo-refuerzo-de-centro-espanol-debuto-con-un-gol/229747), [mercado de pases Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Resultado del bloque

Se auditaron cinco clubes adicionales. Los cinco CSV coinciden nominalmente con las nóminas de cierre consultadas; se validaron movimientos relevantes y se documentó la discrepancia secundaria de Cañuelas. **No se modificaron filas**. J.J. Urquiza (49), Lugano (45) y Atlas (42) quedan como prioridad para una pasada individual de minutos y convocatorias, con el objetivo de depurar sin sobrepoblar y sin borrar suplentes legítimos.


## 11. Primera pasada de participación — J.J. Urquiza, Atlético Lugano y Atlas

Se inició la depuración de los tres planteles más extensos. Se cruzó la nómina cargada con las páginas de cierre 2026 y con estadísticas públicas de participación. **No se eliminan jugadores en esta pasada**, porque la información disponible confirma nóminas completas y algunos indicadores de rotación, pero no ofrece un registro individual exhaustivo y homogéneo de minutos para todos los integrantes. Recortar por intuición podría quitar suplentes reales o juveniles utilizados.

### J.J. Urquiza — 49 cargados
- Los 49 nombres del CSV coinciden con la nómina de cierre de Solo Ascenso.
- La temporada de Primera C 2026 registra 32 partidos. BeSoccer identifica a Nehuén Montoya entre los jugadores destacados con 31 partidos y 2.745 minutos; también aparecen como destacados Facundo Durán, Dylan Gauna, Bautista García y Leonardo Luna.
- La nómina publicada contiene cuatro arqueros, 11 defensores, 27 mediocampistas y delanteros combinados. La cantidad es alta, pero la lista de cierre por sí sola no distingue entre titulares, relevos y juveniles.
- **Decisión:** conservar los 49 provisionalmente y no hacer una poda sin fichas de presencias/minutos para el resto.

Fuentes: [nómina de J.J. Urquiza](https://www.soloascenso.com.ar/club/jj-urquiza/283), [estadísticas de J.J. Urquiza 2025/26](https://es.besoccer.com/equipo/jj-urquiza?redirby=rf_rest), [perfil estadístico de Patricio Díaz](https://www.soloascenso.com.ar/perfil/patricio-diaz/29027).

### Atlético Lugano — 45 cargados
- Los 45 nombres del CSV coinciden con la nómina de cierre de Solo Ascenso.
- La temporada 2026 registra 30 partidos de liga en la ficha de estadísticas consultada.
- ZeroZero destaca a Celso Báez como el jugador con más minutos (2.665) y a Jonathan Acuña como el jugador número 12, con 14 partidos ingresando desde el banco. Gabriel Urruchúa terminó como máximo goleador con nueve tantos; también figuran Juan Cruz Iglesias (cinco), Matías Coselli (cuatro) y Rodrigo Soria (tres).
- **Decisión:** conservar los 45 provisionalmente. Los datos confirman rotación y participación de suplentes, pero no permiten clasificar con seguridad a los restantes futbolistas sin actividad.

Fuentes: [nómina y goleadores de Lugano](https://www.soloascenso.com.ar/club/lugano/289), [estadísticas de Lugano 2026](https://www.zerozero.pt/equipa/lugano/45602/estatisticas), [convocados del debut 2026](https://www.soloascenso.com.ar/notas/lugano/lugano-inicia-un-nuevo-campeonato-frente-a-sacachispas/225093).

### Atlas — 42 cargados
- Los 42 nombres del CSV coinciden con la nómina de cierre de Solo Ascenso.
- La temporada consultada registra 31 partidos. ZeroZero/CeroaCero identifica a Ricardo Grieger como líder de minutos con 2.790 y a Nahuel Piethe como principal relevo, con 12 partidos ingresando desde el banco.
- Los goleadores publicados incluyen a Gustavo Britos (cinco), Alexander Meza (cuatro), Simón Martínez (tres) y Nicolás Pérez (dos). Britos no se agrega al CSV de cierre porque su salida a Leones FC ya fue documentada en la auditoría anterior.
- **Decisión:** conservar los 42 provisionalmente; no se confunde a los jugadores de menor participación con futbolistas ajenos al plantel.

Fuentes: [nómina y goleadores de Atlas](https://www.soloascenso.com.ar/club/atlas/247), [estadísticas individuales de Atlas 2026](https://www.ceroacero.com.co/equipo/atlas/45609/estadisticas), [plantel Atlas 2026](https://www.zerozero.pt/equipa/atlas/45609?edicao_id=212447).

### Resultado de esta pasada
Se validaron tres nóminas y se incorporaron indicadores verificables de participación. **No hubo cambios de filas ni de dorsales**. La depuración definitiva de estos tres clubes queda condicionada a poder cruzar presencias individuales de todos los jugadores; no se aplicará un máximo arbitrario de integrantes.


## 12. Auditoría nominal ampliada — Leandro N. Alem, Central Córdoba (Rosario), Claypole, Deportivo Español y Muñiz

Se revisó un segundo bloque de cinco clubes, cruzando los CSV con nóminas publicadas, anuncios de plantel y fichas de partidos. No se aplicaron recortes automáticos: cuando una fuente describe el plantel inicial y otra refleja incorporaciones posteriores, se prioriza el plantel de cierre y se documenta el movimiento.

### Leandro N. Alem — 46 cargados
- Se corroboró que Gonzalo Mendiburu integró el primer equipo durante 2026: fue citado 25 veces, titular en 15, suplente en diez e ingresó en cuatro. Su salida anunciada el 6 de noviembre corresponde a la temporada 2027 y no debe borrarse del plantel histórico 2026.
- Nicolás Gentile y Agustín Dilandro tampoco se agregan al CSV: la fuente informa que Gentile no tuvo participaciones ni integró bancos en 2026, mientras que Dilandro salió a préstamo.
- El bloque de 46 sigue siendo grande; se conserva por ahora hasta disponer de la nómina de cierre completa y el registro individual de todos los futbolistas.

Fuentes: [bajas de Alem para 2027 y balance de Mendiburu/Gentile](https://www.soloascenso.com.ar/notas/claypole/leandro-alem-sufrio-dos-bajas-de-cara-al-proximo-ano/234281), [altas de Alem para 2026](https://www.soloascenso.com.ar/notas/leandro-n-alem/leandro-alem-volvio-a-sumar-jugadores-en-el-plantel/224300).

### Central Córdoba (Rosario) — 32 cargados
- El anuncio oficial de inicio de temporada presentó un plantel de 30 jugadores, con nombres que luego tuvieron movimientos y salidas. La nómina estadística de cierre consultada publica 27 futbolistas y no debe tomarse como padrón exhaustivo, ya que omite jugadores que aparecen en fichas posteriores.
- El CSV contiene 32 registros e incorpora movimientos posteriores, entre ellos Aaron Quijano, que llegó desde Central Ballester, además de otros jugadores de la rotación. No se detectó evidencia suficiente para quitar dos nombres sólo por la diferencia entre la presentación inicial (30) y el CSV de cierre.
- **Decisión:** mantener 32 provisionalmente; completar el cruce individual de altas, bajas y presencias antes de recortar.

Fuentes: [presentación del plantel inicial de 30 futbolistas](https://www.soloascenso.com.ar/notas/central-cordoba-rosario/central-cordoba-y-sus-jugadores-para-competir-en-el-2026/225133), [plantel y resultados de Central Córdoba 2026](https://www.mundoascenso.com.ar/plantel/75-central-cordoba-r), [nómina estadística de Central Córdoba 2026](https://www.zerozero.pt/equipa/central-cordoba-rosario/29621?edicao_id=212447).

### Claypole — 39 cargados
- Los 39 nombres del CSV coinciden con la nómina de cierre de Solo Ascenso. Se contrastaron además convocatorias de distintas etapas: la ficha ante Muñiz (fecha 16) confirma titulares y banco, y la previa ante Central Córdoba de septiembre confirma continuidad de la base titular.
- Las altas de Valentín Hiriart y Brahian Guayquinao en julio están contempladas; Hiriart fue titular y Guayquinao integró el banco en su primera convocatoria.
- La lista inicial de Mundo Ascenso/TACAZO es más corta que la nómina de cierre de Solo Ascenso, por lo que no se mezcla como si fuera una baja definitiva.
- **Decisión:** conservar los 39; la nómina consolidada y los movimientos de mitad de año respaldan la composición actual del CSV.

Fuentes: [nómina de cierre de Claypole](https://www.soloascenso.com.ar/club/claypole/258), [convocatoria y formación ante Muñiz](https://www.soloascenso.com.ar/ficha/45155), [altas de Hiriart y Guayquinao](https://www.soloascenso.com.ar/notas/leandro-n-alem/santiago-fleitas-es-el-nuevo-director-tecnico-de-claypole/230133), [plantel publicado por TACAZO](https://tacazo.com.ar/equipo.html?id=club-8391).

### Deportivo Español — 39 cargados
- Los 39 nombres del CSV coinciden con la nómina de cierre de Solo Ascenso.
- Las convocatorias de junio y septiembre confirman rotación amplia: aparecen entre otros Matías Caputo, Elías Barraza, Ricardo Cabrera, Santiago Yossini, Enzo Martínez, Lautaro Barros, Cristian Canan, Matías David, Mauricio Fernández, Tobías Narejko, Patricio Pérez y Nicolás Ríos.
- La nómina reducida de Mundo Ascenso no representa todo el plantel; se prioriza la lista detallada de Solo Ascenso y las fichas de partidos.
- **Decisión:** mantener los 39; no se detectaron bajas o duplicaciones inequívocas en este cruce.

Fuentes: [nómina de cierre de Deportivo Español](https://www.soloascenso.com.ar/club/deportivo-espanol/307), [convocatoria ante Claypole, junio](https://www.soloascenso.com.ar/notas/deportivo-espanol/espanol-enfrentara-a-claypole-y-quiere-seguir-sumando/228851), [formación y suplentes ante Central Ballester, septiembre](https://www.soloascenso.com.ar/ficha/45309).

### Deportivo Muñiz — 38 cargados
- Se contrastó la nómina con fichas de partidos del segundo semestre. Ante Leandro N. Alem (fecha 28), la formación y el banco incluyen a Agustín Di Biase, Eric Giménez, Kevin Farías, Brandon Verón, Gonzalo Villafañe, Ezequiel Ponce, Iván Malmoria, Agustín Gutiérrez, Juan Carabali, Alexis Oviedo, Dylan Albornoz y varios relevos que están contemplados en el CSV.
- La nómina resumida de Mundo Ascenso está incompleta y no se usa como fundamento para dar de baja a los restantes futbolistas.
- **Decisión:** conservar los 38 por ahora; falta una revisión de presencias individual de todos los nombres para una poda responsable.

Fuentes: [ficha Muñiz–Alem, fecha 28](https://www.zerozero.pt/jogo/2026-09-12-deportivo-muniz-leandro-n-alem/12020646), [resultados y nómina parcial de Muñiz](https://www.mundoascenso.com.ar/plantel/8393-muniz).

### Resultado del bloque
Se auditaron cinco clubes adicionales. Se confirmó la permanencia histórica de Mendiburu en Alem para 2026, se documentaron diferencias entre planteles iniciales y de cierre en Central Córdoba y Claypole, y se corroboraron convocatorias de Claypole, Español y Muñiz. **No se modificaron filas**: no apareció una salida inequívoca que justificara un cambio seguro.


## 13. Auditoría final de los siete clubes restantes — correcciones nominales

Se completó el cruce nominal de los siete clubes que faltaban revisar en este bloque. Se priorizaron las nóminas de cierre de Solo Ascenso y AFA, las presentaciones oficiales y las fichas de partidos. Hubo dos correcciones concretas en el CSV de tanda 4.

### General Lamadrid — corrección de tres omisiones
- La nómina actual de Solo Ascenso incluye a **Tomás Moreno** e **Iván Ruiz** en el mediocampo y a **Breyner Mata** en ataque. Los tres estaban ausentes del CSV.
- Se incorporan los tres con ratings y dorsales estimados, dejando explícito que los dorsales no son oficiales: Tomás Moreno #44, Iván Ruiz #45 y Breyner Mata #46.
- El plantel pasa de 36 a **39 jugadores**, coincidiendo con la nómina de cierre consultada. La presentación inicial del club había anunciado 33, pero la lista de cierre incorpora más futbolistas durante la temporada.

Fuentes: [nómina de cierre de General Lamadrid](https://www.soloascenso.com.ar/club/general-lamadrid/278), [presentación del plantel inicial de 33](https://www.soloascenso.com.ar/notas/almagro/lamadrid-presento-a-todos-sus-futbolistas-para-el-2026/225081).

### Yupanqui — baja confirmada de Santino Colángelo
- El CSV todavía contenía a **Santino Colángelo**, pero el registro de mercado de enero confirma que dejó Yupanqui y pasó a Almagro antes del inicio de la temporada 2026.
- Se elimina su fila del CSV. Las otras bajas anunciadas (Alan Palavecino, Dante Pérez Lazarte, Mauro Peiro y Lautaro Ortega) ya estaban correctamente ausentes.
- El plantel pasa de 39 a **38 jugadores**. No se elimina a Juan Ignacio Varela, que renovó para 2026, ni a los refuerzos incorporados durante el armado de la temporada.

Fuentes: [baja de Santino Colángelo y renovaciones/refuerzos de Yupanqui](https://www.soloascenso.com.ar/notas/yupanqui/el-trapero-presento-tres-incorporaciones-y-una-renovacion/224236), [refuerzos y bajas adicionales de Yupanqui](https://www.soloascenso.com.ar/notas/lujan/el-trapero-confirmo-la-llegada-de-seis-nuevos-refuerzos/224666).

### Leones FC (Rosario) — 37 cargados
- Los 37 nombres del CSV coinciden con la nómina de cierre de Solo Ascenso. La nómina incluye a Mario Senra, Gustavo Britos y Lucas Manochi, cuya trayectoria entre clubes ya se había revisado para evitar duplicaciones.
- Se conserva el plantel; no se detectan bajas pendientes en el cruce nominal.

Fuente: [nómina de cierre y goleadores de Leones FC](https://www.soloascenso.com.ar/club/leones-fc-rosario/1228).

### Luján — 33 cargados
- Los 33 nombres del CSV coinciden con la nómina de cierre de Solo Ascenso. La lista oficial de AFA presenta un recorte de jugadores, mientras que las fichas de partidos del cierre muestran una convocatoria más amplia con titulares y suplentes; por eso no se reduce el CSV a la lista abreviada.
- Se confirma que Adrián Ocampo y Tobías Luna llegaron en junio y están incluidos; Brandon Arriola salió a Dock Sud y no figura en el CSV.
- **Decisión:** conservar los 33.

Fuentes: [nómina de cierre de Luján](https://www.soloascenso.com.ar/club/lujan/290), [plantel 2026 y campaña según AFA](https://www.afa.com.ar/es/posts/lujan-supero-a-berazategui-en-la-final-por-el-ascenso-y-jugara-la-proxima-temporada-en-primera-b), [altas y baja de mitad de año](https://www.soloascenso.com.ar/notas/estrella-del-sur-alejandro-korn/lujan-tiene-dos-refuerzos-para-el-segundo-semestre/229549), [formación y banco en la final](https://www.soloascenso.com.ar/ficha/46167).

### El Porvenir — 44 cargados
- Los 44 registros del CSV coinciden con la base principal de la nómina de cierre. Solo Ascenso publica además tres arqueros (Facundo Arcas, Cristian Arce y Tomás Guzmán) que no están en el CSV, lo que elevaría el bloque de arqueros a siete.
- Para evitar sobrepoblar el puesto, no se agregan esos tres nombres sin confirmar participación o convocatorias individuales. Se deja la diferencia señalada para revisar presencias antes de incorporarlos.

Fuente: [nómina de cierre de El Porvenir](https://www.soloascenso.com.ar/club/el-porvenir/270).

### Fénix — 42 cargados
- Se cruzó el CSV con dos listados 2026, pero presentan discrepancias importantes de nombres y dorsales; uno de los listados de mercado duplica futbolistas en varias posiciones. No se usa esa fuente incompleta para eliminar jugadores ni para agregar nombres sin una ficha individual que confirme su pertenencia.
- **Decisión:** mantener los 42 y dejar el cruce nominal como pendiente de resolución por ficha de partido/participación.

Fuentes: [plantel Fénix 2026 en Mundo Ascenso](https://www.mundoascenso.com.ar/plantel/103-fenix), [plantel Fénix 2026 en ZeroZero](https://www.zerozero.pt/equipa/fenix/26695?edicao_id=212447).

### Sportivo Barracas — 39 cargados
- El listado disponible de Mundo Ascenso es parcial y no contiene la nómina completa; el mercado previo a la temporada registra ocho incorporaciones y varias bajas, por lo que no es correcto compararlo como padrón definitivo contra los 39 del CSV.
- Se conserva el bloque y se evita eliminar nombres a partir de una página incompleta.

Fuentes: [plantel parcial 2026 de Sportivo Barracas](https://www.mundoascenso.com.ar/plantel/110-sportivo-barracas), [altas de Diego Perea y armado del plantel](https://www.soloascenso.com.ar/notas/ituzaingo/diego-perea-se-convirtio-en-nuevo-refuerzo-del-arrabalero/224281), [primeras bajas confirmadas](https://www.soloascenso.com.ar/notas/sportivo-barracas/se-confirmaron-las-primeras-salidas-en-sportivo-barracas/223263).

### Resultado y validación estructural actualizada
- Se agregaron **Tomás Moreno, Iván Ruiz y Breyner Mata** a Lamadrid y se retiró **Santino Colángelo** de Yupanqui.
- Recuento actualizado: **1.126 jugadores en 28 clubes**.
- Distribución: **102 ARQ, 305 DEF, 495 MED y 224 DEL**.
- Validación de los cuatro CSV: cero dorsales vacíos, cero nombres duplicados dentro de un club y cero dorsales duplicados dentro de un club.
- Los siete clubes restantes quedaron revisados; Fénix y Sportivo Barracas mantienen una salvedad por fuentes parciales o discordantes, y El Porvenir queda con tres arqueros adicionales pendientes de confirmar por participación.


## 14. Revisión de salvedades: Fénix, Sportivo Barracas y El Porvenir

Esta pasada resuelve las salvedades que habían quedado abiertas en la sección 13. Se compararon los cuatro CSV con las nóminas completas de cierre de Solo Ascenso y, cuando hubo información disponible, con fichas de partidos y estadísticas individuales.

### Fénix — 42 jugadores, nómina confirmada
- **El CSV coincide nombre por nombre con la nómina de cierre de Solo Ascenso**: 3 arqueros, 13 defensores, 19 mediocampistas y 7 delanteros.
- La página de Mundo Ascenso que había generado la discrepancia presenta duplicaciones y una lista distinta; se considera una ficha desactualizada o inconsistente y deja de usarse como padrón de control.
- Las fichas de partido confirman participación de futbolistas del CSV: en marzo aparecen Mariano Mittelman, Julián Bembo, Facundo Gómez, Nahuel Ortigoza, Emir Ham, Nicolás Velazco, Diego Zumbo, Matías Martínez, Iván Gorosito, Joan Esteche y Sebastián Montero entre titulares y suplentes. En octubre aparecen Marcos Jara, Agustín Suárez, Facundo Gómez, Sebastián Ibars, Manuel Masdeu, Joan Esteche, Leonel Álvarez, Lucas Rancic, Iván Gorosito, Matías Martínez y Diego Palacios Mena, además de suplentes del mismo CSV.
- **Decisión:** mantener los 42. Se cierra la discrepancia: no hay que importar la nómina alternativa de Mundo Ascenso.

Fuentes: [plantel de cierre de Fénix](https://www.soloascenso.com.ar/club/fenix/274), [convocatoria de marzo](https://www.soloascenso.com.ar/sintesis/fenix-puerto-nuevo/45715), [formación de octubre](https://www.soloascenso.com.ar/ficha/45322), [plantel alternativo de Mundo Ascenso](https://www.mundoascenso.com.ar/plantel/103-fenix).

### Sportivo Barracas — 39 jugadores, nómina confirmada
- **El CSV coincide nombre por nombre con la nómina completa de Solo Ascenso**: 3 arqueros, 7 defensores, 16 mediocampistas y 13 delanteros.
- La página de Mundo Ascenso muestra una versión abreviada (dos arqueros, cuatro defensores y once jugadores en cada una de las otras líneas) y no debe utilizarse para reducir el plantel.
- La ficha del partido del 5 de octubre confirma una convocatoria real de jugadores del CSV: Leonel Barrionuevo, Italo Portillo, Franco Córdoba, Nazareno Vidal, Santiago Sosa, Mauro Romay, Felipe Estevez, Nahuel Durruty, Tomás Di Criscenzo, Iván Santa Cruz y Julián Rodríguez como titulares; Ignacio Díaz Peyrous, Rodrigo Sequeira, Agustín Titunik, Santiago Gómez, Lautaro Ortega, Exequiel Ortiz, Tomás Boschi, Ignacio Zanzi y Tomás Bellido como suplentes.
- Las estadísticas públicas de temporada son parciales y cubren sólo parte de la nómina; no justifican borrar a futbolistas de la lista completa que tuvieron menos minutos.
- **Decisión:** mantener los 39 y cerrar la salvedad de fuente incompleta.

Fuentes: [nómina completa de Sportivo Barracas](https://www.soloascenso.com.ar/club/sportivo-barracas/249), [ficha del partido ante Leones](https://www.zerozero.com.ve/partido/2026-10-05-sportivo-barracas-leones-fc/12020683), [plantel abreviado de Mundo Ascenso](https://www.mundoascenso.com.ar/plantel/110-sportivo-barracas), [estadísticas parciales de temporada](https://www.plaibook.live/pro/teams/sportivo-barracas).

### El Porvenir — 44 jugadores, cuatro arqueros conservados
- El CSV tiene **4 arqueros**: Luis Andrade, Diego Freire, Lautaro Guzmán y Sergio Juárez. Los cuatro cuentan con evidencia de participación o uso en el primer equipo: Andrade (2 partidos), Freire (1), Guzmán (3) y Juárez como arquero titular habitual, además de la convocatoria ante Fénix.
- Solo Ascenso publica otros tres arqueros en su lista general: Facundo Arcas, Cristian Arce y Tomás Guzmán. La ficha individual de Cristian Arce marca cero presencias en 2026; Tomás Guzmán fue incorporado desde Comunicaciones para completar la estructura del plantel y no hay evidencia de minutos en Primera; no se encontró una ficha de participación 2026 que justifique sumar a Arcas.
- Diego Freire fue presentado como arquero que alternaría con Reserva, pero sí tuvo al menos una aparición oficial con Primera. Lautaro Guzmán debutó en septiembre y tuvo tres apariciones registradas.
- **Decisión:** mantener cuatro arqueros y no agregar los tres nombres sólo por figurar en una nómina extensa. La evidencia disponible no los acredita como alternativas utilizadas del primer equipo durante la temporada.

Fuentes: [nómina de cierre de El Porvenir](https://www.soloascenso.com.ar/club/el-porvenir/270), [perfil de Cristian Arce (0 presencias)](https://www.soloascenso.com.ar/perfil/cristian-arce/24105), [incorporaciones de pretemporada](https://www.soloascenso.com.ar/notas/el-porvenir/el-porvenir-perfila-su-plantel-en-plena-pretemporada/224708), [estadísticas de Diego Freire](https://www.ceroacero.com.co/jugador/diego-freire/3569433?epoca_id=155), [estadísticas de Luis Andrade](https://www.ceroacero.com.co/jugador/luis-andrade/848249?epoca_id=155), [estadísticas de Lautaro Guzmán](https://www.ceroacero.com.co/jugador/lautaro-guzman/3527638?epoca_id=155), [convocatoria ante Fénix](https://www.soloascenso.com.ar/ficha/45226), [debut de Lautaro Guzmán](https://www.cutralcoalinstante.com/2026/09/08/el-arquero-lautaro-jose-guzman-debuto-en-el-primer-equipo-de-el-porvenir/).

### Resultado de esta revisión
- Las salvedades de Fénix y Sportivo Barracas quedan resueltas: sus 42 y 39 jugadores, respectivamente, coinciden con la nómina de cierre de Solo Ascenso.
- El Porvenir queda con cuatro arqueros respaldados por participación/uso de Primera; no se incorporan los otros tres nombres de la lista general por falta de evidencia de uso en el primer equipo.
- **No se modificaron filas del CSV en esta pasada**. Recuento global sin cambios: 1.126 jugadores en 28 clubes. Se mantienen las validaciones estructurales ya registradas.


## 15. Corrección de cifras de participación — J.J. Urquiza, Lugano y Atlas

Se corrigieron algunos datos de la primera pasada de participación (sección 11), porque la lectura inicial mezcló estadísticas de diferentes fuentes y temporadas.

- **J.J. Urquiza:** la ficha de CeroaCero atribuye 2.745 minutos a Facundo Durán; BeSoccer registra 26 partidos y 2.303 minutos para Nehuén Montoya. El jugador número 12 de JJU fue Franco Ocampo, con 15 ingresos desde el banco. No corresponde atribuir los 2.745 minutos a Montoya.
- **Atlético Lugano:** la ficha de estadísticas de Primera C 2026 registra 2.665 minutos para Celso Báez y 14 ingresos desde el banco para Jonathan Acuña.
- **Atlas:** la ficha de Primera C 2026 registra 2.790 minutos para Ricardo Grieger y 12 ingresos desde el banco para Nahuel Piethe.

Estos indicadores confirman participación real de titulares y relevos, pero no equivalen a una lista completa de apariciones de los 42–49 jugadores de cada plantel. No se usa la ausencia de un jugador en los líderes estadísticos como prueba de que no participó.

Fuentes: [estadísticas J.J. Urquiza 2026](https://www.ceroacero.com.co/equipo/justo-jose-de-urquiza/45579/estadisticas), [estadísticas J.J. Urquiza en BeSoccer](https://es.besoccer.com/equipo/jj-urquiza?redirby=rf_rest), [estadísticas Lugano 2026](https://www.zerozero.pt/equipa/lugano/45602/estatisticas), [estadísticas Atlas 2026](https://www.ceroacero.com.co/equipo/atlas/45609/estadisticas).


## 16. Criterio definitivo de cantidad — comparación entre categorías

A partir de la revisión conjunta de los CSV de las categorías cargadas, se establece un límite operativo para Primera C: **ningún plantel debe superar los 30 futbolistas**. La referencia más cercana son las divisiones inferiores ya relevadas, no el tamaño de las nóminas de Primera División.

| Categoría | Clubes | Jugadores | Promedio por club | Rango |
|---|---:|---:|---:|---:|
| Primera División | 30 | 1.012 | 33,7 | 22–46 |
| Primera Nacional | 36 | 1.026 | 28,5 | 22–34 |
| Primera B Metropolitana | 22 | 533 | 24,2 | 20–27 |
| Federal A (tanda integrada) | 10 | 237 | 23,7 | 22–27 |
| Primera C actual | 28 | 1.126 | 40,2 | 29–51 |

Primera División no se toma como patrón porque sus planteles profesionales son más amplios. B Metro y Federal A muestran una composición compacta, generalmente de 22 a 27 futbolistas; Primera Nacional promedia 28,5. Por lo tanto, el criterio acordado para Primera C es: **preferentemente 22–27 jugadores y nunca más de 30**. No se rellenan planteles por cantidad mínima si la nómina real justifica menos.

### Exceso inicial de Primera C (antes de la poda de Central Ballester)

Antes de la primera poda, 27 de los 28 clubes estaban por encima del máximo. Para llevarlos a 30, el exceso acumulado era de **286 registros**. La cifra es la línea de base previa a la depuración documentada en la sección 17.

- Juventud Unida: 51 → reducir al menos 21.
- Argentino de Rosario: 50 → reducir al menos 20.
- Victoriano Arenas: 37 → reducir al menos 7.
- Sacachispas: 50 → reducir al menos 20.
- Leandro N. Alem: 46 → reducir al menos 16.
- Club Mercedes: 35 → reducir al menos 5.
- Estrella del Sur: 43 → reducir al menos 13.
- Berazategui: 38 → reducir al menos 8.
- Deportivo Paraguayo: 42 → reducir al menos 12.
- Cambaceres: 35 → reducir al menos 5.
- Puerto Nuevo: 33 → reducir al menos 3.
- J.J. Urquiza: 49 → reducir al menos 19.
- Atlético Lugano: 45 → reducir al menos 15.
- Atlas: 42 → reducir al menos 12.
- Cañuelas: 31 → reducir al menos 1.
- Central Ballester: 50 → reducir al menos 20.
- Central Córdoba (Rosario): 32 → reducir al menos 2.
- Claypole: 39 → reducir al menos 9.
- Deportivo Español: 39 → reducir al menos 9.
- Muñiz: 38 → reducir al menos 8.
- El Porvenir: 44 → reducir al menos 14.
- Fénix: 42 → reducir al menos 12.
- General Lamadrid: 39 → reducir al menos 9.
- Leones FC: 37 → reducir al menos 7.
- Luján: 33 → reducir al menos 3.
- Sportivo Barracas: 39 → reducir al menos 9.
- Yupanqui: 38 → reducir al menos 8.

### Método de depuración desde esta revisión

1. Mantener jugadores con titularidades, ingresos desde el banco o convocatorias repetidas y verificables en 2026.
2. Priorizar para revisión los nombres sin presencias, sin convocatorias o que sólo figuren en listados generales/juveniles, además de duplicados, jugadores transferidos y bajas anteriores al corte.
3. No usar la ausencia en una tabla parcial de goleadores o líderes de minutos como prueba de inactividad.
4. Si un club no tiene 30 futbolistas con participación demostrable, conservar un plantel menor; no incorporar reservas sin uso para alcanzar una cifra.
5. Actualizar los cuatro CSV, recalcular dorsales y ejecutar la validación estructural al terminar cada bloque.

**Estado:** este apartado fija el criterio y cuantifica la línea de base. La primera poda posterior redujo Central Ballester de 50 a 30 y el total de los CSV a 1.106 jugadores; la sección 17 registra ese cambio.


## 17. Primera depuración por participación — Central Ballester

Se aplicó por primera vez el criterio definitivo de máximo 30 jugadores, usando la tabla individual completa de minutos de Primera C 2026 de ZeroZero y el plantel de temporada del club.

- El CSV tenía 50 jugadores.
- La tabla de minutos registra 32 futbolistas con participación en la temporada. El cruce nominal identifica 31 de esos jugadores en el CSV; Guido López León corresponde al registro estadístico de Guido López. Aarón Quijano no se duplica porque su destino de mitad de temporada fue Central Córdoba de Rosario, donde ya está cargado.
- Se conservaron 30 jugadores: futbolistas con participación y los casos de Santiago Garro, Nicolás Suaya y Agustín Corbalán, mantenidos por su pertenencia/uso de primer equipo ya documentado. 
- Se retiraron 20 registros: 16 nombres sin minutos en la tabla individual y sin prioridad de convocatoria para el corte final, más cuatro futbolistas con la menor participación registrada: Santiago Peredo (19 minutos), Tomás Echeverría (21), Brian Vittadello (58) y Alexis Galván (78).
- Los otros nombres sin minutos retirados fueron Axel Arredondo, Alejo Camejo, Enzo D'Angelis, Alan González, Federico Martínez, Braian Mendoza, Jesús Monzón, Luciano Salomón, Pablo Balbuena, Ramiro Franco, Joel Maciel, Tomás Patiño, Kevin Ramayo, Nicolás Caceres, Donato Lanzillotta y Maximo Scalia.
- **Resultado:** Central Ballester pasa de 50 a **30 jugadores**. Se mantienen 30 dorsales únicos y no se alteran los demás clubes de la tanda 3.

La decisión no se basó en una nómina abreviada: se cruzó el padrón con la tabla individual de minutos y se preservaron los tres casos de primer equipo mencionados. Quijano se mantiene únicamente en Central Córdoba, su club posterior de 2026, para evitar duplicarlo.

Fuentes: [estadísticas individuales de Central Ballester 2026 — tabla completa de minutos](https://www.zerozero.pt/edicao/primera-c-2026/212447/estatisticas?id_equipa=45605&v1=j&v2=t&v3=5), [plantel Central Ballester 2026](https://www.zerozero.pt/equipa/central-ballester/45605?edicao_id=212447), [traspaso y participación de Aarón Quijano](https://www.soloascenso.com.ar/notas/berazategui/central-cordoba-presento-a-un-volante-ofensivo-como-refuerzo/229559).

### Validación del cambio
- Central Ballester: 50 → 30 (−20).
- Primera C: 1.126 → **1.106 jugadores** en 28 clubes.
- El resto de los 27 planteles permanece sin cambios en esta intervención.
- La validación completa de los cuatro CSV y del runtime queda pendiente de ejecutarse después de completar la depuración de los demás clubes.


## 18. Validación estructural posterior a la poda

Después de la reducción de Central Ballester y la corrección de la fila de Gabriel Rivera en la tanda 1, se volvió a recorrer el contenido de los cuatro CSV con el mismo esquema de parseo de la prueba automatizada.

- 1.106 registros en 28 clubes.
- 31 columnas consistentes en todas las filas; ninguna fila malformada.
- Cero nombres vacíos, dorsales vacíos, dorsales duplicados o nombres duplicados dentro del mismo club.
- Se mantienen identificados los seis homónimos entre clubes que ya estaban documentados en la prueba.
- La prueba `test-primera-c-draft.js` quedó actualizada a los nuevos recuentos y total de 1.106.

**Importante:** esta comprobación replica las validaciones estructurales del script sobre los CSV, pero todavía no equivale a una ejecución confirmada de GitHub Actions ni a la auditoría del runtime. El workflow debe ejecutar la importación de los cuatro CSV y la verificación de `public/squads.json` cuando corra en el PR.


## 19. Segunda depuración — Cañuelas

Cañuelas tenía 31 jugadores en el CSV. Se retiró **Francisco Riscino** por no encontrar participación oficial de Primera C 2026: no aparece en la tabla individual de jugadores con partidos de Cañuelas, y el boletín disciplinario de AFA que lo menciona lo ubica en Tercera C. Su inclusión en la nómina general de Solo Ascenso y en un amistoso de pretemporada no alcanza para considerarlo parte de la primera plantilla con participación oficial.

- Cañuelas: 31 → **30 jugadores**.
- Se conservan los otros 30 nombres, incluidos los jugadores de rotación y suplentes con participación oficial.
- El recuento general de los cuatro CSV pasa de 1.106 a **1.105 jugadores** en 28 clubes.

Fuentes: [estadísticas de jugadores de Cañuelas 2026](https://www.zerozero.pt/equipa/canuelas/45601/jogadores), [plantel 2026 de Solo Ascenso](https://www.soloascenso.com.ar/club/canuelas-fc/256), [boletín AFA que registra a Riscino en Tercera C](https://assets1.afa.com.ar/2026/BOLETINES/Boletin-6885-29.04.docx-%282%29.pdf), [amistosos de pretemporada](https://www.soloascenso.com.ar/notas/canuelas-fc/el-tambero-se-midio-ante-un-equipo-de-la-primera-nacional/224295).


## 20. Validación posterior a la segunda poda

Tras depurar Cañuelas, se volvió a ejecutar el recorrido estructural equivalente al test de los cuatro CSV:

- **1.105 jugadores y 28 clubes**.
- Central Ballester: 30; Cañuelas: 30.
- 25 clubes siguen por encima de 30.
- Las cuatro tandas conservan el mismo esquema de 31 columnas; no hay filas malformadas, campos obligatorios vacíos, dorsales duplicados ni nombres duplicados dentro de cada club.
- Los seis homónimos entre clubes siguen explícitamente contemplados por el test.
- `test-primera-c-draft.js` ya espera 1.105 registros y los nuevos recuentos de Cañuelas y Central Ballester.

GitHub Actions todavía no devuelve una ejecución confirmada para estos commits. Por eso el resultado de esta revisión es una validación de los datos y de la lógica del test, no una certificación del runtime. La integración automática del runtime debe confirmarse en el PR.


## 21. Tercera depuración — Sacachispas

Sacachispas tenía 50 jugadores. Se aplicó el cruce entre la tabla de participación de temporada y las fichas de partido confirmadas:

- La tabla de análisis «con y sin» registra participación para 26 jugadores del CSV, desde Leandro Ríos (28 partidos con él en cancha) hasta Alan Abregú (3). Se conservaron esos 26 nombres.
- Se sumaron cuatro jugadores respaldados por convocatorias de primer equipo: Benjamín Arias (titular en la ficha del 21/09), Ezequiel Barreiro (arquero suplente en la ficha del 04/10), Nicolás Navarro (suplente en fichas del 05/09 y 04/10) y Valentín Mancuso (convocado en las fichas del 22/08, 05/09 y 04/10).
- Santiago Romero no se mantuvo: solo aparece en una convocatoria puntual del 05/09, sin minutos ni evidencia de recurrencia comparable a los cuatro casos conservados.
- Se retiraron 20 nombres sin participación estadística ni convocatoria de cierre suficiente: Héctor Navarro, Martín Cols, Renzo Fernández, Santiago Flores, Ignacio Loccizano, Lucas Medina, Leonardo Zaragoza, Santiago Arrieta, Ignacio Branda, Lucas Cipresso, Mateo Comignaghi, Nicolás Cuestas, León Fariza, Fernando Lavalle, Juan Cruz Oltmann, Francesco Toldo, Bautista Brange, Santiago Ciotta, Sebastián Martínez y Santiago Romero.
- **Resultado: 50 → 30 jugadores.** No se completó el plantel con reservas profundas; se conservaron tres arqueros y los futbolistas de campo con uso o convocatorias respaldadas.

Fuentes: [participación por jugador de Sacachispas 2026](https://www.ceroacero.com.co/equipo/sacachispas/27315/con-y-sin), [plantel y resumen de temporada](https://www.ceroacero.com.co/equipo/sacachispas/27315?epoca_id=155), [ficha 22/08 ante Mercedes](https://www.zerozero.pt/jogo/2026-08-22-club-mercedes-sacachispas/12020596), [ficha 05/09 ante Centro Español](https://www.zerozero.pt/jogo/2026-09-05-centro-espanol-sacachispas/12020623), [ficha 04/10 ante Estrella del Sur](https://www.zerozero.pt/jogo/2026-10-04-sacachispas-estrella-del-sur/12020681), [ficha 21/09 ante Victoriano Arenas](https://www.soloascenso.com.ar/ficha/45283).

## 22. Cuarta depuración — Leandro N. Alem

Leandro N. Alem tenía 46 jugadores. Se cruzó la tabla individual de Primera C 2026, el plantel actualizado y las bajas de mitad de temporada:

- Se conservaron 29 jugadores del CSV con participación de temporada suficiente para formar parte del plantel de cierre.
- Se retiraron 16 nombres sin minutos registrados en la tabla individual 2026: Julián Cazaux, Román Kozicki, Thomas Mielniczuk, Franco Torrico, Diego Altamirano, Thiago Arrieta, Santiago Castellis, Iván Colman, Alan Falkiewicz, Ciro Farias, Juan Ibáñez, José María Leiva, Ivo Oszust, Juan Rodríguez, Federico Vallone y Rodrigo Onofrio.
- También se retiró Facundo Moreno: la tabla de temporada le asigna una única aparición y 18 minutos, insuficientes para mantenerlo en el plantel reducido.
- **Agustín Dilandro no se incorpora al CSV de cierre.** Aunque disputó 16 partidos y 731 minutos por Alem, el 15/09/2026 se confirmó su salida a préstamo a Guillermo Renny de Córdoba; su última participación había sido el 18/07. Se conserva como participante histórico de Alem en 2026, no como integrante del plantel de cierre.
- **Resultado: 46 → 29 jugadores.** Se deja el club por debajo del máximo de 30, sin incorporar juveniles o suplentes sin uso para completar cupos.

Se mantiene el nombre **Alan Cristeff**: su perfil individual de 2026 registra 23 partidos y 1.827 minutos; una tabla agregada muestra una variante inconsistente del nombre. Se priorizó el perfil individual y la nómina actualizada.

Fuentes: [estadísticas individuales de Alem 2026](https://www.zerozero.com.mx/equipo/leandro-n-alem/45580/jogadores?epoca_stats_id=155), [perfil 2026 de Agustín Dilandro: 16 partidos y 731 minutos](https://www.zerozero.com.mx/jugador/agustin-dilandro/3525872?epoca_id=155), [confirmación de su préstamo a Guillermo Renny, 15/09/2026](https://www.soloascenso.com.ar/notas/deportivo-espanol/leandro-alem-sufrio-una-baja-de-peso-en-el-mediocampo/232660), [plantel de Alem al cierre](https://www.ceroacero.com.co/equipo/leandro-n-alem/45580), [perfil 2026 de Alan Cristeff](https://www.zerozero.com.ve/jugador/alan-cristeff/363169?edicao_id=212447&op=zoomstats&tpstats=club).

## 23. Sincronización de CSV, runtime y prueba — 13/11/2026

Después de las podas de Sacachispas y Alem, se sincronizaron `public/squads.json`, `public/squads.js` y `public/squads-meta.json` con los cuatro CSV. El total de Primera C queda en **1.068 jugadores en 28 clubes**; el runtime completo de las 153 plantillas queda en **4.540 jugadores**.

- Sacachispas: 30; Leandro N. Alem: 29; Central Ballester: 30; Cañuelas: 30; Centro Español: 29.
- Quedan **23 clubes** por encima del máximo de 30.
- Se actualizaron los recuentos de `test-primera-c-draft.js` a 1.068, con los nuevos totales por club.
- Se recalcularon los contadores de cobertura de dorsales, edades, nacionalidad, pie, roles específicos y medias en `public/squads-meta.json`.
- La sincronización de archivos ya está hecha; falta ejecutar GitHub Actions y la prueba con `--runtime` para confirmar formalmente la importación, antes de integrar el PR.


## 6. Estado vigente — 13/11/2026

- CSV: **1.013 jugadores en 28 clubes**.
- Once clubes ya cumplen el máximo de 30: Central Ballester (30), Cañuelas (30), Sacachispas (30), Leandro N. Alem (29), Centro Español (29), Luján (27), Puerto Nuevo (30), Juventud Unida (30), Estrella del Sur (29), Cambaceres (30) y Club Mercedes (29).
- Quedan **17 planteles** por encima de 30; no se harán recortes automáticos sólo para alcanzar un número.

### Luján — 33 → 27

Se aplicó una depuración respaldada por la nómina oficial AFA 2026, el plantel de cierre de Solo Ascenso y las convocatorias de Primera C:

- Retirados: Valentín Alegre (tercer arquero sin aparición/convocatoria oficial localizada), Juan Moreno, Román Busto, Santiago Tríbulo, Gonzalo Ramírez y Aaron Villecco (no figuran en la nómina AFA y no se encontró evidencia de participación o convocatoria oficial de Primera C).
- Conservado Maximiliano Piñeiro: aunque no está en la nómina AFA de 26, aparece como suplente en la ficha de Luján–Berazategui del 25/10/2026 (fecha 34), por lo que se mantiene como integrante convocado del primer equipo.
- Nahuel Icazatti se conserva: su perfil individual lo identifica con nombre completo Leandro Nahuel Icazatti y registra 29 presencias, 23 titularidades y 6 ingresos desde el banco.
- Posiciones corregidas según AFA: Lucas Gómez DEF, Tomás Dopazo MED y Franco Pérez DEL.

Fuentes: [nómina oficial AFA y ascenso de Luján](https://www.afa.com.ar/es/posts/lujan-supero-a-berazategui-en-la-final-por-el-ascenso-y-jugara-la-proxima-temporada-en-primera-b), [plantel de cierre Solo Ascenso](https://www.soloascenso.com.ar/club/lujan/290), [perfil de Nahuel Icazatti](https://www.soloascenso.com.ar/perfil/nahuel-icazatti/22784), [síntesis Luján–Berazategui, fecha 34](https://www.soloascenso.com.ar/ficha/46167).

**Pendiente:** la integración de runtime (squads.json, squads.js y squads-meta.json) se ejecuta por el workflow del PR después de los cambios en CSV/test. No se considera sincronizada hasta verificar un run exitoso y el commit automático resultante.


### Puerto Nuevo — 33 → 30

Se retiraron Benjamín Ferreyra, Federico Aciar y Tomás Schefer. Los tres aparecen en la nómina actualizada del club, pero sus estadísticas individuales de Primera C 2026 registran cero partidos jugados; las fichas de partido consultadas los muestran como suplentes no utilizados. Se conservaron otros jugadores con participaciones breves (por ejemplo, Joaquín Pillwein: 5 partidos/53 minutos; Ezequiel Sánchez: 1/19; Lucas Ortiz: 1/1), y se mantuvo a Thiago Ricalde como segundo arquero por pertenecer a la nómina profesional inicial.

Fuentes: [plantel profesional inicial de 26 jugadores](https://www.soloascenso.com.ar/notas/puerto-nuevo/puerto-nuevo-tiene-todo-listo-para-competir-en-el-2026/225078), [plantel actualizado](https://www.soloascenso.com.ar/club/puerto-nuevo/297), [estadísticas individuales de Puerto Nuevo](https://www.ceroacero.com.co/equipo/puerto-nuevo/45607/jugadores?epoca_stats_id=155), [Benjamín Ferreyra](https://www.ceroacero.com.co/jugador/benjamin-ferreyra/3555652?epoca_id=155), [Federico Aciar](https://www.ceroacero.com.co/jugador/federico-aciar/3625947?epoca_id=155), [Tomás Schefer](https://www.ceroacero.com.co/jugador/tomas-schefer/3558784?epoca_id=155).

**Recuento vigente:** 1.059 jugadores en 28 clubes; siete planteles dentro del límite y 21 pendientes. La integración runtime no se considera completada hasta verificar el workflow y sus archivos generados.


### Juventud Unida — 51 → 30

Se cruzó el CSV con la tabla individual de ZeroZero para Primera C 2026, que registra partidos disputados por futbolista. La tabla contiene 35 jugadores con participación; 33 estaban en el CSV, mientras que Fernando Giménez (10 partidos) y Santino Bevilacqua (2) no estaban cargados.

- Se retiraron 18 nombres del CSV sin apariciones registradas en la tabla individual de temporada.
- De los jugadores con participación, se retiraron los cuatro de menor uso presentes en el CSV: Mateo Ursi (3 partidos), Joaquín Iglesias (2), Diego López (1) y Santiago Núñez (1). Santino Bevilacqua no se incorporó por quedar también por debajo del corte.
- Se incorporó Fernando Giménez, mediocampista de 32 años, con 10 partidos. Dorsal 67 estimado porque la fuente estadística no aporta un número individual confirmado.
- La nómina resultante queda en 30 jugadores, priorizando participación oficial comprobable y evitando completar cupos con reservas sin minutos.

Fuentes: [tabla individual de Juventud Unida 2026](https://www.zerozero.pt/equipa/juventud-unida-san-miguel/45600/jogadores), [plantel y estadísticas de temporada](https://www.zerozero.com.ar/equipo/juventud-unida-san-miguel/45600), [El Porvenir–Juventud Unida: Fernando Giménez titular y goleador](https://www.ceroacero.com.co/partido/2026-05-16-el-porvenir-juventud-unida-san-miguel/12020423).

**Recuento vigente:** 1.038 jugadores en 28 clubes; ocho planteles dentro del límite y 20 pendientes. La integración runtime no se considera completada hasta verificar el workflow y sus archivos generados.


### Estrella del Sur — 43 → 29

Se contrastó la nómina del CSV con el plantel de cierre de ZeroZero y sus estadísticas individuales. Se retiraron 14 nombres que no figuran en el plantel de cierre ni en los registros de participación. Se conservaron Gabriel Rivera, Lucas Cabrera y Felipe Scabuzzo porque sí figuran en la nómina de cierre aunque no tengan minutos registrados.

- Iván Caravaca se excluye del plantel de cierre: aunque disputó cinco partidos y 149 minutos al inicio de 2026, comunicó su salida el 30/06/2026.
- Juan Scarel se excluye por su transferencia a Argentino de Quilmes el 18/07/2026.
- Se conserva una única ficha de Lautaro Torres: la tabla de estadísticas lo duplica con edades y posiciones distintas.

Fuentes: [plantel 2026 de Estrella del Sur](https://www.zerozero.pt/equipa/estrella-del-sur/341204?epoca_id=155), [tabla de estadísticas individuales](https://www.zerozero.pt/equipa/estrella-del-sur/341204/jogadores), [transferencias 2026](https://www.zerozero.pt/equipa/estrella-del-sur/341204/transferencias), [nota sobre la salida de Caravaca](https://www.soloascenso.com.ar/notas/general-lamadrid/estrella-del-sur-sumo-un-refuerzo-y-sufrio-una-baja/229820), [perfil de Caravaca con cinco partidos](https://www.ceroacero.com.co/jugador/ivan-caravaca/1238941).

**Recuento vigente:** 1.024 jugadores en 28 clubes; nueve planteles dentro del límite y 19 pendientes. La integración runtime no se considera completada hasta verificar el workflow y sus archivos generados.


### Defensores de Cambaceres — 35 → 30

Se ordenó la nómina por partidos disputados en la tabla individual de Primera C 2026 y se conservó el corte de 30 futbolistas con mayor participación. Se retiraron 14 nombres fuera de ese corte y se incorporaron nueve jugadores de uso comprobado que faltaban en el CSV: Esteban Coronel, Bryan Schmidt, Román Zárate, Facundo Odello, Javier Sequeyra, Tomás Baglieri, Tomás Ledesma, Renzo Fernández y Mariano Coletto.

Se conserva el nombre **Facundo Fajardo** tal como lo registra Solo Ascenso: su perfil confirma 22 presencias y 21 titularidades. ZeroZero lo muestra como “Agustín Fajardo”, pero el perfil individual de Solo Ascenso identifica su nombre completo como Facundo Fajardo González; no se crean dos registros por esa diferencia de fuentes. Edad 27 confirmada.

Fuentes: [estadísticas individuales de Cambaceres](https://www.zerozero.pt/equipa/defensores-de-cambaceres/45576/jogadores), [plantel 2026](https://www.zerozero.pt/equipa/defensores-de-cambaceres/45576), [perfil de Facundo Fajardo](https://www.soloascenso.com.ar/perfil/facundo-fajardo/25469), [síntesis de la fecha 29](https://www.jjurquiza.com.ar/NotasPrimera/Nota4125.html).

**Recuento vigente:** 1.019 jugadores en 28 clubes; diez planteles dentro del límite y 18 pendientes. La integración runtime no se considera completada hasta verificar el workflow y sus archivos generados.


### Club Mercedes — 35 → 29

Se tomó como referencia el plantel de cierre 2026 de ZeroZero, que enumera 29 futbolistas. Se retiraron Franco Tonatto, Román Cruz, Franco Taborda, Lucas Calderón, Ulises Antonio Dematei y Lautaro Lagos, ausentes de esa nómina de cierre. Se conservaron Rodrigo Nicasio y Santiago Romagnoli aunque no tengan minutos, porque sí forman parte del plantel publicado.

Se corrigieron posiciones: Franco Ortigosa como delantero y Francisco Ruiz como mediocampista. La tabla individual registra 27 futbolistas con participación y dos sin minutos, coherente con la nómina de 29.

Fuentes: [plantel de cierre de Club Mercedes](https://www.zerozero.pt/equipa/club-mercedes/91322), [estadísticas individuales 2026](https://www.zerozero.com.mx/equipa/club-mercedes/91322/jugadores?epoca_stats_id=155), [plantel Solo Ascenso](https://www.soloascenso.com.ar/club/mercedes/438), [citados para la fecha 25](https://noticiasmercedinas.com/site/2026/08/21/club-mercedes-y-sacahispas-sobresale-en-la-primera-c/).

**Recuento vigente:** 1.013 jugadores en 28 clubes; once planteles dentro del límite y 17 pendientes. La integración runtime no se considera completada hasta verificar el workflow y sus archivos generados.
