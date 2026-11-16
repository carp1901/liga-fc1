# Auditoría general — Primera C 2026

Fecha: 16/11/2026  
Estado: **depuración cerrada**; 28 planteles revisados y ninguno supera los 30 jugadores.

## 1. Resultado general

- **28 clubes** cargados.
- **839 jugadores** en los 28 planteles después del cierre de depuración del 16/11.
- **1.132 registros nominales iniciales** entre las cuatro tandas; antes del cierre se retiraron trece nombres y se agregaron Matías Arias y Néstor Acosta; en esta última pasada se retiraron otros 282 excedentes. La nómina final conserva 839 jugadores.
- Los 28 clubes quedan entre 29 y 30 jugadores; ningún equipo supera el máximo solicitado.
- Promedio final: 30,0 jugadores por club.

## 2. Composición final por club

| Club | Jugadores | ARQ | DEF | MED | DEL |
|---|---:|---:|---:|---:|---:|
| Argentino de Rosario | 30 | 3 | 8 | 11 | 8 |
| Atlas | 30 | 3 | 8 | 14 | 5 |
| Atlético Lugano | 30 | 3 | 8 | 11 | 8 |
| Berazategui | 30 | 3 | 8 | 11 | 8 |
| Cañuelas | 30 | 3 | 7 | 14 | 6 |
| Central Ballester | 30 | 4 | 8 | 10 | 8 |
| Central Córdoba (Rosario) | 30 | 4 | 8 | 16 | 2 |
| Claypole | 30 | 3 | 7 | 13 | 7 |
| Club Mercedes | 30 | 3 | 8 | 11 | 8 |
| Defensores de Cambaceres | 30 | 2 | 8 | 12 | 8 |
| Deportivo Español | 30 | 3 | 8 | 11 | 8 |
| Deportivo Muñiz | 30 | 3 | 8 | 11 | 8 |
| Deportivo Paraguayo | 30 | 3 | 8 | 11 | 8 |
| El Porvenir | 30 | 4 | 8 | 10 | 8 |
| Estrella del Sur | 30 | 3 | 8 | 11 | 8 |
| Fénix | 30 | 3 | 8 | 12 | 7 |
| General Lamadrid | 30 | 3 | 8 | 13 | 6 |
| J.J. Urquiza | 30 | 3 | 8 | 11 | 8 |
| Juventud Unida | 30 | 3 | 8 | 11 | 8 |
| Leandro N. Alem | 30 | 3 | 8 | 13 | 6 |
| Leones FC | 30 | 3 | 8 | 12 | 7 |
| Luján | 30 | 3 | 8 | 12 | 7 |
| Puerto Nuevo | 30 | 2 | 8 | 13 | 7 |
| Sacachispas | 30 | 3 | 8 | 11 | 8 |
| Sportivo Barracas | 30 | 3 | 7 | 12 | 8 |
| Victoriano Arenas | 30 | 3 | 8 | 12 | 7 |
| Yupanqui | 30 | 3 | 8 | 11 | 8 |
| Centro Español | 29 | 3 | 6 | 15 | 5 |
| **Total** | **839** | **85** | **219** | **335** | **200** |

## 3. Controles de integridad

- 839 nombres únicos dentro de sus respectivos clubes.
- 839 dorsales asignados.
- 0 dorsales vacíos.
- 0 dorsales duplicados dentro de un mismo club.
- Santino Sapio aparece una sola vez en Cañuelas; MED está registrado como posición secundaria.
- Víctor Gómez se incorporó a Cambaceres por evidencia de 25 presencias, aunque no figuraba en el bloque principal de la nómina.
- Mirko Pfarherr se mantiene en Central Córdoba de Rosario como defensor por sus convocatorias/participaciones.
- Se diferenciaron los homónimos entre clubes; los tres pares que continúan simultáneamente en runtime están documentados en las auditorías de las tandas.

**Importante:** los 839 dorsales siguen siendo estimaciones, no números oficiales de temporada. Las fichas de partido muestran camisetas utilizadas en encuentros puntuales y no se convierten automáticamente en dorsales permanentes.

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

## 5. Distribución final de posiciones y datos pendientes

| Posición | Jugadores | Porcentaje |
|---|---:|---:|
| Arqueros | 85 | 10,1% |
| Defensores | 219 | 26,1% |
| Mediocampistas | 335 | 39,9% |
| Delanteros | 200 | 23,8% |

- Las medias y los dorsales siguen siendo estimaciones iniciales; esta depuración no los presenta como datos oficiales.
- La selección priorizó jugadores mencionados en auditorías de convocatorias, alineaciones, estadísticas o incorporaciones 2026. Los cupos restantes se completaron con una distribución equilibrada por posición.

## 6. Estado de cierre

La depuración de cantidad de planteles queda cerrada: 28 clubes, 839 jugadores, máximo 30 por equipo. No quedan clubes pendientes de recorte por sobrepoblación.

## 7. Auditoría individual — tercera tanda amplia

Se revisaron Leandro N. Alem, Atlético Lugano, El Porvenir y Estrella del Sur. El cruce se hizo sobre las nóminas de los CSV y movimientos/convocatorias de 2026.

### Leandro N. Alem — 30 cargados

- Las fichas de agosto y octubre confirman el núcleo utilizado: Lucas Rodríguez, Claudio Curima, Leandro Cantón, Iván Gauna, Cristian Seltzer, Ezequiel Abal, Matías Medina, Alan Cristeff, Brian Risso Patrón, Lautaro Segovia y Diego Pertossi aparecen en la temporada.
- Ignacio y Tomás Buenrostro habían sido anunciados como bajas antes del inicio de 2026 y no están en el CSV.
- Gonzalo Mendiburu se conserva: su participación sostenida durante 2026 prevalece sobre cualquier anuncio de salida posterior.
- El plantel de 46 sigue siendo demasiado grande para darlo por definitivo. No se recorta a los demás jugadores sin cruzar sus presencias y convocatorias.

Fuentes: [Alem vs Puerto Nuevo, fecha 26](https://www.soloascenso.com.ar/ficha/45260), [Alem vs Centro Español, fecha 31](https://www.soloascenso.com.ar/ficha/45313), [salidas de Ignacio y Tomás Buenrostro](https://www.soloascenso.com.ar/notas/villa-san-carlos/los-jugadores-de-alem-que-jugaran-en-la-primera-nacional/222698).

### Atlético Lugano — 30 cargados

- La nómina de Solo Ascenso coincide en sus nombres principales con el CSV.
- Se verificaron las cuatro incorporaciones de la temporada que figuran en el mercado: Ignacio Gallo, Denzel Giménez, Leonel Ovejero y Matías Benardoni. Los cuatro están incluidos.
- Pablo Quiroga también permanece correctamente: su pase desde El Porvenir a Lugano está registrado en el mercado de pases.
- No encontré una baja documentada que permita quitar a otro integrante del CSV. La cantidad de 45 requiere una pasada de participación individual antes de reducirse.

Fuentes: [plantel de Atlético Lugano](https://www.soloascenso.com.ar/club/lugano/289), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### El Porvenir — 30 cargados

- Se contrastaron las convocatorias de agosto, septiembre y octubre. Aparecen de forma reiterada Sergio Juárez, Kevin Romero, Julián Quinteros, Javier Peralta Salinas, Esteban Ayala, Franco Ávalos, Leonel Bolig, Jeremías Arrieta, Leandro Villagra, Hernán Rodríguez, Ulises Macías, Luis Pérez Díaz y Nicolás De Benedetti.
- **Darío Nami no está en el CSV**, correctamente: salió a General Lamadrid el 28/06 después de disputar 16 partidos y marcar cuatro goles con El Porvenir.
- El mercado de enero documentó 11 altas y 12 bajas; los nombres que dejaron el club antes del inicio no deben reincorporarse solo por aparecer en planteles históricos.
- No se retiran más jugadores todavía. El tamaño de 44 exige revisar especialmente los nombres que no aparecen en las convocatorias del segundo semestre.

Fuentes: [mercado de altas y bajas de enero](https://www.soloascenso.com.ar/notas/el-porvenir/el-porvenir-sacude-el-mercado-refuerzos-y-salidas-definidas/224370), [salida de Darío Nami](https://www.soloascenso.com.ar/notas/muniz/el-porvenir-sufrio-su-primera-baja-y-ya-tiene-destino/229788), [El Porvenir vs Claypole, fecha 26](https://www.soloascenso.com.ar/ficha/45263), [El Porvenir vs Cañuelas, fecha 31](https://www.soloascenso.com.ar/ficha/45321).

### Estrella del Sur — 30 cargados

- Las convocatorias de septiembre confirman a Valentín Díaz, Ramiro López, Gastón David, Gonzalo Núñez, Dilan Maidana, Aaron Spagna, Lucas Chiapparo, Tomás Bravo, Julián Eseiza, Ciro Campuzano, Lautaro Torres, Lucas Vázquez y Leandro Moreira.
- Las incorporaciones de Valentín Díaz, Santiago Gutiérrez y Ramiro López fueron anunciadas en febrero; las tres están contempladas en el CSV.
- Lautaro Torres y Leandro Moreira llegaron durante el año y también están incluidos.
- Benjamín Gutiérrez e Iván Caravaca fueron bajas y no aparecen en el CSV actual, correctamente.
- No se aplican recortes por la diferencia entre la lista de plantel y las convocatorias: falta cruzar la nómina completa y separar suplentes habituales de nombres sin actividad.

Fuentes: [altas de febrero](https://www.soloascenso.com.ar/notas/afa/estrella-del-sur-sumo-tres-refuerzos-para-su-plantel/224620), [Estrella del Sur vs Yupanqui, fecha 28](https://www.soloascenso.com.ar/ficha/46100), [Estrella del Sur vs Argentino de Rosario, fecha 30](https://www.soloascenso.com.ar/ficha/45303), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

**Resultado de esta tanda:** se confirmaron como correctas las bajas ya reflejadas de los cuatro clubes (Buenrostro, Nami, y las bajas de Estrella), así como las incorporaciones de Lugano y Estrella. No se encontró evidencia suficientemente concluyente para retirar más jugadores. Los cuatro planteles siguen en revisión individual por su tamaño.


## 8. Auditoría individual — cuarta tanda amplia

Se revisaron Victoriano Arenas, Deportivo Paraguayo, Atlas y Fénix. En esta tanda hubo buen cruce entre los listados de plantel de Solo Ascenso y los CSV.

### Victoriano Arenas — 30 cargados

- La nómina de Solo Ascenso coincide con los 37 jugadores del CSV.
- Se verificaron como incorporaciones de 2026 a Julián García, Sebastián De Luca y Matías Rodríguez, todos incluidos.
- Jeremías Denis y Matías Billordo, anunciados como bajas antes de 2026, no aparecen en el CSV.
- La convocatoria de la fecha 30 confirma a Julián García, Sebastián De Luca, Matías Gómez, Alan Salmantón, Emanuel Saporito, Fabián Monserrat, Leonel Duarte, Matías Sosa, Santiago Soria, Isaías González y Ramiro Rivarola, todos incluidos.
- No se detectó una omisión ni una baja nueva para aplicar.

Fuentes: [plantel de Victoriano Arenas](https://www.soloascenso.com.ar/club/victoriano-arenas/314), [bajas y refuerzos de diciembre](https://www.soloascenso.com.ar/notas/victoriano-arenas/el-cava-tiene-dos-bajas-confirmadas-para-el-2026/223243), [Victoriano vs Juventud Unida, fecha 30](https://www.soloascenso.com.ar/sintesis/boca-juniors-racing-club/45301).

### Deportivo Paraguayo — 30 cargados

- La nómina de Solo Ascenso coincide con los 42 jugadores del CSV.
- Se verificó la salida previa al torneo de Rodrigo Dinocco, Diego Zumbo y Ezequiel Abal; no aparecen en el CSV de Paraguayo.
- Ian Lynch y Rodrigo Ortiz se incorporaron durante 2026 y sí están incluidos. Lynch llegó desde Lamadrid a mitad de año; Ortiz regresó en julio.
- Diego Fassi y Ramiro Oliverio sufrieron lesiones importantes durante la temporada, pero permanecen como integrantes del plantel: una lesión de larga duración no equivale a una desvinculación.
- No se detectó una omisión o una baja adicional para aplicar.

Fuentes: [plantel de Deportivo Paraguayo](https://www.soloascenso.com.ar/club/deportivo-paraguayo/268), [bajas de diciembre](https://www.soloascenso.com.ar/notas/deportivo-paraguayo/se-dieron-a-conocer-las-primeras-salidas-en-paraguayo/222920), [llegada de Ian Lynch y Rodrigo Ortiz](https://www.soloascenso.com.ar/notas/claypole/paraguayo-tiene-una-nueva-incorporacion-para-el-ataque/230131), [lesiones de Fassi y Oliverio](https://www.soloascenso.com.ar/notas/deportivo-paraguayo/paraguayo-tendra-un-duelo-crucial-con-argentino-de-rosario/230866), [convocatoria previa a la fecha 30](https://www.soloascenso.com.ar/notas/estrella-del-sur-alejandro-korn/paraguayo-juega-en-su-casa-frente-a-uno-de-los-escoltas/233008).

### Atlas — 30 cargados

- La nómina de Solo Ascenso coincide con los 42 jugadores del CSV.
- Se contrastaron las incorporaciones anunciadas en febrero: los nombres del listado de altas están representados en el CSV.
- Los jugadores que el mercado registra como bajas hacia Control Orientado, Leones FC y Lugano no deben reincorporarse al plantel de Atlas.
- No se detectó una omisión ni una baja nueva para aplicar. El número de 42 sigue siendo alto, pero no hay evidencia suficiente para recortar nombres de la lista vigente sin revisar participaciones individuales.

Fuentes: [plantel de Atlas](https://www.soloascenso.com.ar/club/atlas/247), [refuerzos presentados en febrero](https://www.soloascenso.com.ar/notas/atlas/el-marron-presento-oficialmente-a-sus-nuevos-jugadores/224589), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Fénix — 30 cargados

- La nómina de Solo Ascenso coincide con los 42 jugadores del CSV.
- Se revisó el extenso recambio previo al inicio de 2026: las bajas de Ramiro Cordero, Juan Martín Chiarantano, Ramiro Gómez, Kevin Lugo, Ignacio Rojas, Fabián Díaz, Dante Silva, Santiago Auteri, Carlos Giménez, Ignacio Ahumada, Eduardo Sánchez y otros nombres del plantel anterior no fueron reintroducidas en el CSV.
- Se verificaron las altas de Damián Pérez Roa, Diego Zumbo, Facundo Gómez, Nahuel Ortigoza, Emir Ham, Nicolás Velazco, Marcos Jara, Lucas Rancic, Augusto Ghiglione, Mariano Mittelman, Santiago Erviti, Bautista Álvarez y otras incorporaciones: están representadas en la nómina actual.
- Jeremías Mayor se conserva porque su continuidad fue confirmada pese a que inicialmente se lo había mencionado entre las posibles salidas.
- No se detectó una omisión ni una baja adicional para aplicar.

Fuentes: [plantel de Fénix](https://www.soloascenso.com.ar/club/fenix/274), [once bajas confirmadas en enero](https://www.soloascenso.com.ar/notas/fenix/malas-noticias-en-fenix-se-confirmaron-once-bajas/224238), [refuerzos de enero](https://www.soloascenso.com.ar/notas/afa/dos-nuevos-refuerzos-se-sumaron-al-plantel-de-fenix/224442), [altas de febrero](https://www.soloascenso.com.ar/notas/afa/fenix-presento-cuatro-nuevos-refuerzos-para-la-primera-c/223460).

**Resultado de esta tanda:** los cuatro CSV coinciden con las nóminas de plantel consultadas y reflejan las altas y bajas relevantes del mercado. No se modificaron jugadores: la auditoría no consiste en reducir planteles arbitrariamente, sino en asegurar que cada nombre tenga respaldo y pertenezca al plantel de 2026.


## 9. Auditoría individual — quinta tanda amplia

Se revisaron Claypole, Deportivo Español, Sportivo Barracas y Yupanqui, contrastando las cuatro nóminas con las listas actuales de Solo Ascenso y las novedades de mercado de 2026.

### Claypole — 30 cargados

- La nómina de Solo Ascenso coincide con los 39 jugadores del CSV.
- Se verificaron las altas previas al torneo: Alejo Klipauka, Tomás Luján y Joaquín Cabrera están incluidos.
- Tomás Tello, Santiago Galván y Matías Coselli, informados como salidas antes del inicio, no aparecen en el CSV.
- La lista de plantel publicada incluye a los futbolistas que sostuvieron el equipo durante el segundo semestre. No se detecta omisión o baja nueva en este cruce.

Fuentes: [plantel de Claypole](https://www.soloascenso.com.ar/club/claypole/258), [altas y bajas antes del torneo](https://www.soloascenso.com.ar/notas/claypole/con-fixture-definido-claypole-ya-piensa-en-el-proximo-ano/223128), [renovaciones y tres refuerzos](https://www.soloascenso.com.ar/notas/claypole/tres-refuerzos-una-baja-y-varias-renovaciones-en-claypole/222830).

### Deportivo Español — 30 cargados

- La nómina actual de Solo Ascenso coincide con los 39 jugadores del CSV.
- Las seis promociones desde Reserva anunciadas el 22/08 fueron revisadas: Juan Torre y Luca Morales ya están incluidos. José Carballo, Nahuel Gamboa, Tobías Díaz y Franco Stábile no se agregan por ahora porque el anuncio confirma su promoción y entrenamientos con Primera, pero no acredita por sí solo minutos ni convocatorias de partido.
- Las altas registradas en el mercado (Santiago Ávila, Darío Salina, Fabián Leguizamón y Franco Lopresti) están reflejadas en el CSV.
- Las bajas de Rodrigo Jalitt, Nicolás Ortiz, Thomas Arrieta, Bruno Robles, Diosnel Zuccarino y Simón Martínez no se reincorporan.
- No se detecta omisión o baja nueva que justifique modificar el CSV.

Fuentes: [plantel de Deportivo Español](https://www.soloascenso.com.ar/club/deportivo-espanol/307), [seis juveniles promovidos a Primera](https://www.soloascenso.com.ar/notas/deportivo-espanol/seis-juveniles-de-espanol-empezaron-a-entrenar-con-primera/231701), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c), [convocatoria de la fecha 30](https://www.soloascenso.com.ar/ficha/45309).

### Sportivo Barracas — 30 cargados

- La nómina de Solo Ascenso coincide con los 39 jugadores del CSV.
- Las altas de enero (incluidos Alen Boschi y Leonel Barrionuevo) están incorporadas.
- Se confirmó la llegada de Nicolás Jorquera en julio y Exequiel Ortiz también aparece como incorporación de mitad de año; ambos están en el CSV.
- Las bajas anunciadas antes de la temporada (Fabrizio Brandán, Onan Hilt, Franco Sosa y Santiago Chira, entre otros) no se incorporaron.
- No se detecta omisión o baja nueva en el cruce.

Fuentes: [plantel de Sportivo Barracas](https://www.soloascenso.com.ar/club/sportivo-barracas/249), [bajas previas al torneo](https://www.soloascenso.com.ar/notas/sportivo-barracas/se-confirmaron-las-primeras-salidas-en-sportivo-barracas/223263), [alta de Alen Boschi y mercado inicial](https://www.soloascenso.com.ar/notas/sportivo-barracas/sportivo-barracas-anuncio-la-llegada-de-un-nuevo-refuerzo/224357), [llegada de Leonel Barrionuevo](https://www.soloascenso.com.ar/notas/sportivo-barracas/desde-almagro-llego-un-nuevo-refuerzo-para-el-arrabalero/224444), [llegada de Nicolás Jorquera](https://www.soloascenso.com.ar/notas/sportivo-barracas/presento-su-segunda-incorporacion/230104).

### Yupanqui — 30 cargados

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

### Leones FC — 30 cargados

- La nómina actual de Solo Ascenso coincide con los 37 nombres del CSV.
- Las altas de Gustavo Britos, Nicolás Giménez, Lionel Segovia y Gonzalo Gómez están incluidas.
- No se detectó una baja adicional ni una omisión inequívoca en el cruce de la lista actual.
- Se mantiene pendiente profundizar el historial individual de los jugadores con poca participación; la lista nominal por sí sola no alcanza para recortar el plantel.

Fuente: [plantel de Leones FC](https://www.soloascenso.com.ar/club/leones-fc-rosario/1228), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Luján — 30 cargados

- La nómina actual de Solo Ascenso coincide con los 33 nombres del CSV.
- Se verificaron las incorporaciones de Sebastián Gallo, Tobías Luna y Adrián Ocampo; los tres están incluidos.
- Brandon Arriola se marchó a Dock Sud en junio y no aparece en el CSV.
- Luján fue campeón de la Primera C 2026 y ascendió a Primera B para 2027. La composición del plantel de cierre queda correctamente separada de los movimientos que ocurran después de la temporada.
- No se detecta omisión o baja nueva en este cruce.

Fuentes: [plantel de Luján](https://www.soloascenso.com.ar/club/lujan/290), [llegadas de Tobías Luna y Adrián Ocampo y salida de Brandon Arriola](https://www.soloascenso.com.ar/notas/berazategui/lujan-tiene-dos-refuerzos-para-el-segundo-semestre/229549), [estadísticas de la campaña campeona](https://www.soloascenso.com.ar/notas/lujan/los-grandes-numeros-del-lujan-campeon-de-la-primera-c/233965).

### Central Córdoba de Rosario — 30 cargados

- Se cotejó el plantel oficial presentado en febrero (30 futbolistas) con los movimientos de mitad de temporada.
- Las salidas de Renzo Altamura, Gino Albertengo y Brian Otero están correctamente reflejadas: los tres dejaron el club en junio.
- Las incorporaciones de Aarón Quijano, Mirko Pfarherr, Diego Barrionuevo y Nelson Ávalos aparecen en el CSV.
- **Leonel Fagúndez** tuvo tres participaciones y 34 minutos al inicio de la temporada, pero no figura en el CSV actual. Como su actividad fue muy limitada, queda como caso a evaluar en el criterio de plantel de cierre, no como alta automática.
- No se retiran otros nombres en esta tanda.

Fuentes: [plantel profesional presentado para 2026](https://www.soloascenso.com.ar/notas/central-cordoba-rosario/central-cordoba-y-sus-jugadores-para-competir-en-el-2026/225133), [salidas de Altamura, Albertengo y Otero](https://www.soloascenso.com.ar/notas/general-lamadrid/tres-bajas-en-la-delantera-de-central-cordoba-de-rosario/229367), [perfil y tres participaciones de Leonel Fagúndez](https://www.zerozero.pt/jogador/leonel-fagundez/2700216?epoca_id=155), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### General Lamadrid — 30 cargados

- La presentación oficial de febrero confirmó 33 integrantes del plantel profesional, y la nómina actual de Solo Ascenso registra las incorporaciones y movimientos posteriores.
- **Néstor Acosta ya fue incorporado al CSV**: fue titular en los 33 partidos de Liga, con 2.887 minutos y 16 vallas invictas. Se le asignó dorsal 31 estimado, libre en el club.
- Tomás Moreno, Iván Ruíz y Breyner Mata salieron del plantel en octubre para buscar continuidad y no deben reincorporarse al cierre de temporada.
- Darío Nami se incorporó desde El Porvenir durante el año y está correctamente incluido.
- La incorporación de Néstor Acosta se integra junto con la depuración de Central Ballester mediante una misma actualización del runtime.

Fuentes: [presentación del plantel profesional de 2026](https://www.soloascenso.com.ar/notas/general-lamadrid/lamadrid-presento-a-todos-sus-futbolistas-para-el-2026/225081), [perfil de Acosta: 33 partidos y 2.887 minutos](https://www.soloascenso.com.ar/perfil/nestor-acosta/12874), [confirmación de su salida recién para 2027](https://www.soloascenso.com.ar/notas/deportivo-camioneros/nestor-acosta-el-idolo-no-continuara-en-lamadrid/234243), [movimiento de Nami desde El Porvenir](https://www.soloascenso.com.ar/notas/muniz/el-porvenir-sufrio-su-primera-baja-y-ya-tiene-destino/229788).

**Resultado de esta tanda:** se corrigió la omisión de Néstor Acosta y se retiró a Franco Gómez. Leonel Fagúndez sigue fuera del CSV de Central Córdoba porque sólo registra 34 minutos en tres partidos; se mantiene la decisión de no inflar el plantel con participaciones mínimas.


## 11. Auditoría individual — séptima tanda amplia

Se revisaron Berazategui, Cañuelas, Centro Español y Club Mercedes.

### Berazategui — 30 cargados

- La nómina actual de Solo Ascenso coincide con los 38 jugadores del CSV.
- Se verificaron las incorporaciones anunciadas en el mercado de pases: Santiago Escudero, Federico Tursi, Leonel Miranda y Joaquín Molina. Los cuatro están incluidos.
- No se detectó una baja adicional u omisión inequívoca en este cruce.
- No se recorta el plantel sin revisar participación individual de los nombres con menos actividad.

Fuentes: [plantel de Berazategui](https://www.soloascenso.com.ar/club/berazategui/253), [plantel 2026 de Mundo Ascenso](https://www.mundoascenso.com.ar/plantel/8382-berazategui), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Cañuelas — 30 cargados

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

### Club Mercedes — 30 cargados

- La nómina actual de Solo Ascenso coincide con los 35 jugadores del CSV.
- La incorporación de Arturo Daniel Mendoza desde Jorge Newbery de Comodoro Rivadavia está incluida.
- No se detectó una baja u omisión nueva que justifique modificar el CSV.
- Se mantiene la revisión de dorsales como estimados cuando no existe número oficial confirmado; no se altera la cantidad de jugadores para forzar un tamaño fijo.

Fuentes: [plantel de Club Mercedes](https://www.soloascenso.com.ar/club/mercedes/438), [mercado de pases de Primera C](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

**Resultado de esta tanda:** los cuatro CSV coinciden con las nóminas actuales consultadas y con los movimientos de mercado verificados. No se aplican recortes especulativos ni se agregan juveniles sin convocatoria o participación comprobable.


## 12. Auditoría individual — octava tanda amplia

Se revisaron Defensores de Cambaceres, Puerto Nuevo y Deportivo Muñiz.

### Defensores de Cambaceres — 30 cargados

- La nómina actual de Solo Ascenso coincide con los 35 jugadores del CSV.
- Se verificó la incorporación de Dago Sánchez Palencia, Carlos Raga Córdoba y Facundo Aronna desde Argentino de Rosario. Los tres están incluidos en Cambaceres y correctamente excluidos del plantel de cierre de Argentino.
- Víctor Gómez se conserva: sumó 25 presencias y dos goles en la temporada. Su salida anunciada en octubre fue posterior al cierre de la fase regular, por lo que no debe borrarse del plantel 2026.
- Las trece salidas anunciadas el 23/10 corresponden a la preparación de 2027; no se usan para borrar retroactivamente a quienes integraron el plantel durante 2026.
- No se detecta omisión o baja nueva en este cruce.

Fuentes: [plantel de Cambaceres](https://www.soloascenso.com.ar/club/defensores-de-cambaceres/265), [ficha de la fecha 30 ante Centro Español](https://www.soloascenso.com.ar/ficha/45300), [presentación de las trece bajas para 2027](https://www.universofutbol.com/plantillas/archivos/template_clubes.php?camp=1839&div=4&equ=274), [movimientos desde Argentino de Rosario](https://www.mundoascenso.com.ar/mercado-de-pases/primera-c).

### Puerto Nuevo — 30 cargados

- La nómina actual de Solo Ascenso coincide con los 33 jugadores del CSV.
- El club había presentado 26 profesionales en febrero; el CSV refleja las incorporaciones posteriores que sí quedaron en el plantel y aparecen en las convocatorias, entre ellas Yair Núñez, Lautaro Arellano, Ricardo Grance, Carlos Ortiz, Ezequiel Sánchez, Santiago Roldán y Luciano Verón.
- Se verificó que Guido Ferrara, Ricardo Grance, Juan Pablo López, Franco Coronel, Maximiliano Carnelutto, Rodrigo Martínez, Ignacio Cahiza, Enzo Ritacco, Lautaro Arellano, Luciano Verón, Facundo Esquivel y Mateo Escobar integraron convocatorias de la temporada.
- No se detecta omisión o baja nueva que justifique modificar el CSV.

Fuentes: [plantel oficial presentado en febrero](https://www.soloascenso.com.ar/notas/puerto-nuevo/puerto-nuevo-tiene-todo-listo-para-competir-en-el-2026/225078), [plantel actual de Puerto Nuevo](https://www.soloascenso.com.ar/club/puerto-nuevo/297), [refuerzos adicionales](https://www.soloascenso.com.ar/notas/puerto-nuevo/puerto-nuevo-presento-otros-cuatro-jovenes-refuerzos/224463), [convocatoria de la fecha 14](https://www.soloascenso.com.ar/ficha/45116), [convocatoria de la fecha 19](https://www.soloascenso.com.ar/ficha/45188).

### Deportivo Muñiz — 30 cargados

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
- El total global se mantiene en **1.123 jugadores**: se quitó un jugador sin actividad y se agregó uno con participación plena. La distribución global actual queda en 101 ARQ, 305 DEF, 494 MED y 223 DEL.

Fuentes adicionales: [nómina actual de Central Ballester](https://www.soloascenso.com.ar/club/central-ballester/261), [perfil 2026 de Franco Gómez](https://www.soloascenso.com.ar/perfil/franco-gomez/16183), [perfil 2026 de Néstor Acosta](https://www.soloascenso.com.ar/perfil/nestor-acosta/12874).


### Central Ballester — cruce adicional de convocatorias

- **Maximiliano Maciel se conserva**: fue citado 21 veces, ingresó en 11 partidos y fue suplente sin entrar en ocho. Su retiro anunciado el 16/10 fue posterior al cierre de la temporada, por lo que pertenece al plantel 2026.
- **Santiago Garro se conserva**: fue presentado como refuerzo del primer equipo en febrero y aparece como suplente en convocatorias de septiembre y octubre.
- **Nicolás Suaya se conserva**: fue presentado como refuerzo del primer equipo en enero. No registra minutos, pero sí convocatorias de suplentes no utilizados en las fichas de temporada.
- **Jesús Monzón se conserva**: aparece en el banco de suplentes de la fecha 13.
- **Agustín Corbalán se mantiene en revisión**: figura en la nómina actual del primer equipo, aunque todavía no se encontró una convocatoria o minuto de 2026.
- Los demás nombres sin minutos no se eliminan por ahora: falta completar el cruce de convocatorias y fichas individuales. La regla es no retirar a un integrante del primer equipo sólo por no haber ingresado.

Fuentes: [Maximiliano Maciel: 21 convocatorias, 11 ingresos y ocho partidos sin ingresar](https://www.soloascenso.com.ar/notas/central-ballester/un-referente-de-ballester-se-retiro-del-futbol-profesional/233675), [continuidad de Maciel para 2026](https://www.soloascenso.com.ar/notas/central-ballester/el-delantero-con-experiencia-que-seguira-en-ballester/223881), [presentación de Santiago Garro](https://www.soloascenso.com.ar/notas/puerto-nuevo/central-ballester-incorporo-a-otro-joven-arquero-al-plantel/225381), [presentación de Nicolás Suaya](https://www.soloascenso.com.ar/notas/central-ballester/el-canalla-presento-a-tres-jugadores-nuevos-para-el-plantel/223900), [convocatoria de la fecha 31](https://www.soloascenso.com.ar/ficha/45320), [convocatoria de la fecha 13](https://www.ceroacero.es/partido/2026-08-04-paraguayo-central-ballester/12020535).


## 14. Depuración adicional — Juventud Unida (16/11/2026)

Se cruzaron las 51 filas del CSV con los perfiles individuales y el registro de temporada 2026. Se retiraron dos jugadores con evidencia negativa completa:

- **Román Gauto (DEF):** 0 presencias, 0 titularidades, 0 partidos como suplente y 0 ingresos en 2026. Su ficha sólo muestra participaciones anteriores a la temporada 2026.
- **Antonio Riveros (MED):** 0 presencias, 0 titularidades, 0 partidos como suplente y 0 ingresos en 2026. Su última presencia registrada corresponde a 2025.

Se conservan los futbolistas con convocatorias documentadas aunque no hayan ingresado, siguiendo el criterio aplicado a otros clubes. El plantel pasa de 51 a **49 jugadores**; su distribución queda en 4 ARQ, 14 DEF, 20 MED y 11 DEL. El total global pasa de 1.123 a **1.121 jugadores**: 101 ARQ, 304 DEF, 493 MED y 223 DEL.

Fuentes: [perfil 2026 de Román Gauto](https://www.soloascenso.com.ar/perfil/roman-gauto/31905), [perfil 2026 de Antonio Riveros](https://www.soloascenso.com.ar/perfil/antonio-riveros/30757).


## 14. Cierre definitivo de depuración — 16/11/2026

Se terminó la depuración de los 28 planteles. Se aplicó un máximo de **30 jugadores por club**; Centro Español queda con 29 porque su nómina ya estaba por debajo del límite. Resultado: **839 jugadores**, desde 1.121; se retiraron **282 registros** en esta pasada final.

El criterio fue conservar primero a quienes aparecen identificados en las auditorías de 2026 (convocatorias, alineaciones, estadísticas, incorporaciones o continuidad documentada), además de los casos de participación individual ya verificados. Los lugares restantes se distribuyeron por puesto, evitando planteles descompensados. Se preservaron expresamente Matías Arias (Sacachispas, 16 partidos/1.306 minutos), Lucas Maidana (Alem, más de 2.000 minutos), Nehuén Viñas, Santino Gutiérrez, Nicolás Suaya y Santiago Garro (Central Ballester), Luis Andrade (El Porvenir), Nahuel La Sala (Centro Español), Néstor Acosta (Lamadrid), Santino Sapio (Cañuelas), Víctor Gómez (Cambaceres) y los titulares/convocados destacados de las demás auditorías.

### Bajas aplicadas en esta pasada

- **Juventud Unida** (19): Martín Mesilla, Fabrizio Furnaro, Enzo Guzmán, Joaquín Iglesias, Lucio Ortiz, Tomás Silveyra, Federico Vega, Santiago Núñez, Tomás Otero, Mauro Peiro, Gabriel Rivarola, Nahuel Rodríguez, Mateo Ursi, Nicolás Valeriano, Alan Vega, Leandro Velázquez, Emiliano Ortíz, Mateo Pedemonti, Catriel Quinteros.
- **Estrella del Sur** (12): Ezequiel Portillo, Ignacio Quiroz, Facundo Montes de Oca, Nicolás Montes de Oca, Román Martinangeli, Kevin Poblet, Santiago Sardano, Felipe Scabuzzo, Santiago Tallarico, Cristian Toledo, Héctor Torrejón, Elias Mazzantti.
- **Argentino de Rosario** (20): Jhon Palacin Ramírez, Diego Ramírez, Ignacio Valles, Juan Bautista Cantiani, Facundo Cefarelli, Joaquín Duarte, Milton Espíndola, Joaquín Galimberti, Marcos Ginex, Bismark Gómez, Mateo González, Sebastián Guanter, Miguel Hernández Castillo, Lautaro Pino, Agustín Sánchez Graziadei, Javier Saucedo, Facundo Velasco Zavalla, Facundo Yess, Franco Peralta Bravo, Mauro Scassa.
- **Victoriano Arenas** (7): Rodrigo Soria, Román Pizzuti, Rodrigo Richards, Máximo Sánchez, Lucas Sireiro, Rodrigo Taus, Axel Tisocco.
- **Sacachispas** (20): Facundo Troncoso, Renzo Fernández, Santiago Flores, Ignacio Loccizano, Lucas Medina, Ezequiel Moschen, Leonardo Zaragoza, Emanuel Barreiro, Ignacio Branda, Héctor Canteros, Lucas Cipresso, Mateo Comignaghi, Nicolás Cuestas, Lucas Díaz, León Fariza, Fernando Lavalle, Tomás Magnano, Nicolás Navarro, Juan Cruz Oltmann, Francesco Toldo.
- **Leandro N. Alem** (16): Juan Figueroa, Román Kozicki, Thomas Mielniczuk, Facundo Moreno, Gonzalo Ramírez, Federico Rotela, Franco Torrico, Juan Ibáñez, José María Leiva, Tomás Lescano, Gonzalo Medina, Ivo Oszust, Tobías Pavón, Juan Rodríguez, Federico Vallone, Damián Vázquez.
- **Club Mercedes** (5): Franco Tonatto, Felipe Ruíz Díaz, Franco Taborda, Rodrigo Torres, Martín Zuccaro.
- **Berazategui** (8): Agustín Hernández, Ian Troilo, Ariel Vera, Sebastián Villalba, Santiago Sánchez, Guillermo Santillán, Luca Zunini, Alejo Sanabria.
- **Deportivo Paraguayo** (12): Diego Hernández, Agustín Moreira, Santino Peluffo, Ángel Peña, Fabricio Pereyra, Nahuel Quevedo, Ignacio Zorrilla, Federico Pellegrino, Diego Plaksa, Braian Rojas, José Sogos, Tomás Sposaro.
- **Defensores de Cambaceres** (5): Juan Ignacio Trentín, Alan Meschini, Santino Musciati, Mauricio Romero, Juan Sosa.
- **Puerto Nuevo** (3): Santiago Olmos, Valentín Umeres, Ariel Valenzuela.
- **J.J. Urquiza** (19): Ramiro Cordero, Facundo Cabrera, Rodrigo Cavallera, Dylan Gauna, Mauro Díaz, Ignacio Galván, Mateo Grecco, Thiago Milanese, Gabriel Miller, Luciano Núñez, Franco Núñez Rivas, Martín Peralta, Nahuel Rivero, Marcos Ruanova, Joaquín Torres, Kevin Urtado, Luca Martínez, Lautaro Racioppo, Francisco Urquiza.
- **Atlético Lugano** (15): Hernán Sanaria, Damián Fernández, Matías Gelpi, Uriel Georgieff, Tobías Graña, Dylan Jara, Juan Cruz Julián, Thiago Leyro, Santino Milanesi, Ian Schell, José Montiel, Rodrigo Moreno, Rodrigo Soria, Gabriel Unrein, Gabriel Urruchúa.
- **Atlas** (12): Thiago Rivero, Nicolás Pardo, Tobías Peralta, Agustín Polito, Lucas Uñate, Nahuel Piethe, Mariano Ramírez, Alejo Romero, Pedro Scally Lois, Enzo Ventecol, Nicolás Vidal, Daian Vocos.
- **Cañuelas** (1): Tobías Ybarra.
- **Central Ballester** (20): Alejo Díaz, Tomás Echeverría, Alexis Galván, Alan González, Federico Martínez, Braian Mendoza, Luciano Salomón, Tobías Sarmiento, Joel Maciel, Facundo Palavecino, Tomás Patiño, Michel Pimentel, Kevin Ramayo, Alex Rodríguez, Octavio Romero, Brian Romero, Maximo Scalia, Mateo Veraldi, Brian Vittadello, Leandro Yubel.
- **Central Córdoba (Rosario)** (2): Mateo Yaszczuk, Santiago Spelzini.
- **Claypole** (9): Benjamín Gutiérrez, Valentín Hiriart, Nahuel Machuca, Agustín Maciel, Gustavo Menecis, Juan Ignacio Pacchini, Axel Paiva, Ignacio Rados, Lautaro Vallejos.
- **Deportivo Español** (9): Alexis Peralta, Nahuel Villalba, Gastón Nieto, Santiago Yossini, Nicolás Ostuni, Patricio Pérez, Omar Pires, Gonzalo Ronconi, Pablo Vielma.
- **Deportivo Muñiz** (8): Dylan Varela, Lautaro Saavedra, Jason Taborda, Brandon Verón, Octavio Villegas, Lorenzo Risso, Matías Silvero, Gonzalo Villafañe.
- **El Porvenir** (14): Tiago Ifran, Marcos Nahuel Ochoa, Felipe Ruíz, Juan Ignacio Santarelli, Lautaro Sequeira, Maximiliano Alvarenga, Joaquín Müller, Franco Ríos, Theo Sánchez, Bruno Schmid, Kwame Sankara Souffrant, Luca Zerbo, Nahuel Oviedo, Leonel Salas Dylan.
- **Fénix** (12): Farid Jasni, Luca Maidana, Manuel Masdeu, Agustín Suárez, Juan Manuel Velásquez, Gonzalo Medina, Javier Muller, Ignacio Romano, Nathan Tito Sosa, Ignacio Vera, Alejo Villalba, Matías Villalba.
- **General Lamadrid** (6): Matías Velázquez, Carlos Zalazar, Martin Spaccarotella, Alexis Vázquez, Tobías Vedovati, Hugo Zarco.
- **Leones FC** (7): Martín Talamonti, Lucas Villarino, Lucas Zapata, Valentín Lemos, Sebastián Peñaloza, Denis Rodríguez, Ramiro Roldán.
- **Luján** (3): Tomás Serra, Santiago Tríbulo, Nisim Vergara.
- **Sportivo Barracas** (9): Mauro Romay, Rodrigo Sequeira, Enzo Soria, Nazareno Vidal, Tobías Perrota, Julián Rodríguez, Iván Santa Cruz, Santiago Sosa, Ignacio Zanzi.
- **Yupanqui** (9): Alan Sánchez, Pablo Vouga, José Manuel Méndez, Ignacio Perussia, Jonathan Smith, Alejo Torres, Juan Ignacio Varela, Tomás Wandyk, Luca Zárate.

### Resultado final

- 28 clubes auditados.
- 839 jugadores; mínimo 29, máximo 30.
- Distribución: 85 arqueros, 219 defensores, 335 mediocampistas y 200 delanteros.
- La prueba automatizada se actualizó para exigir estos conteos exactos y mantener las verificaciones de nombres, dorsales, homónimos y jugadores clave.
- El workflow importa las cuatro tandas al runtime y ejecuta la prueba de Primera C antes de publicar los archivos generados.
