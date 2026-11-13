# Primera C 2026 — planteles reales

Trabajo de recopilación y auditoría por cuatro tandas. Los CSV son la fuente de carga y los informes documentan las verificaciones. Los 28 clubes están cargados en los CSV de trabajo; la sincronización del runtime y la auditoría final siguen pendientes de verificación.

## Clubes incluidos (IDs de public/data.js)

- Alem (`alem`)
- Mercedes (`mercedes`)
- Juventud Unida (`juventudunida`)
- Estrella del Sur (`estrelladelsur`)
- Argentino de Rosario (`argentinorosario`)
- Victoriano Arenas (`victorianoarenas`)
- Sacachispas (`sacachispas`)
- Berazategui (`berazategui`)
- Deportivo Paraguayo (`paraguayo`)
- JJ Urquiza (`jjurquiza`)
- Defensores de Cambaceres (`cambaceres`)
- Puerto Nuevo (`puertonuevo`)
- Lugano (`lugano`)
- Centro Español (`centroespanol`)
- Atlas (`atlas`)
- Cañuelas (`canuelas`)
- Central Ballester (`centralballester`)
- Central Córdoba de Rosario (`centralcordobarosario`)
- Claypole (`claypole`)
- Deportivo Español (`espanol`)
- Muñiz (`muniz`)
- El Porvenir (`porvenir`)
- Fénix (`fenix`)
- General Lamadrid (`lamadrid`)
- Leones de Rosario (`leones`)
- Luján (`lujan`)
- Sportivo Barracas (`sportivobarracas`)
- Yupanqui (`yupanqui`)

## Criterios

- Temporada 2026. Jugadores reales, sin fotos y sin completar cupos con nombres ficticios.
- Objetivo orientativo: 22–27 jugadores por club; **máximo obligatorio de 30**. Se permiten planteles menores cuando la participación real lo justifique; no se completan cupos artificialmente.
- Priorizar titulares, relevos y convocados habituales. Evitar reservas profundas y futbolistas sin participación del primer equipo.
- Prioridad: nóminas oficiales de clubes/AFA; después reportes de temporada y fichas de partidos de Mundo Ascenso y Solo Ascenso. FM26/FM27 se usan sólo como referencia secundaria de medias, edad y posiciones, no como prueba única de pertenencia al plantel 2026. La competencia Primera C de FM26 contiene clubes que no coinciden con la división 2026 del juego (por ejemplo, Camioneros e Ituzaingó), por lo que no se importarán sus planteles sin verificar primero la categoría y el club de cada jugador.
- No mezclar jugadores que dejaron el club antes de la fecha de corte ni sumar juveniles sin participación/inscripción verificable.
- Dorsales confirmados cuando exista evidencia. Si no, número estimado libre y coherente con la posición, marcado expresamente como estimación propia. Cero dorsales vacíos y cero duplicados dentro de cada club.
- Medias y atributos estimados deben identificarse como tales; no presentarlos como OVR oficial de EA ni como estadísticas reales.
- Conservar fuente individual por jugador y fecha de consulta.

## Relevamiento inicial

- La división del juego contiene 28 clubes y ninguno tiene jugadores cargados en `public/squads-meta.json`.
- AFA publicó la nómina 2026 de Luján: 26 jugadores (2 arqueros, 7 defensores, 13 volantes y 4 delanteros). El club logró el ascenso a Primera B para 2027; la nómina se conserva como referencia histórica de la temporada 2026.
- Solo Ascenso publicó la presentación de General Lamadrid para 2026 con 33 futbolistas y enumeró las bajas previas.
- Mundo Ascenso tiene fichas de plantel 2026 para la categoría, pero algunas muestran sólo una fracción del plantel o ningún jugador (por ejemplo, Luján, Cañuelas y Argentino Rosario). No se aceptarán esas fichas incompletas como nómina total ni se rellenarán sus faltantes por inferencia.
- La ficha de Claypole lista 25 jugadores, pero se debe cruzar con la nómina y las apariciones 2026 antes de cerrar el club.

## Estado

- [x] Tanda 1: 207 jugadores en 7 clubes tras depurar Sacachispas, Alem, Juventud Unida, Estrella del Sur, Club Mercedes, Argentino de Rosario y Victoriano Arenas
- [x] Tanda 2: 224 jugadores en 7 clubes
- [x] Tanda 3: 239 jugadores en 7 clubes tras las depuraciones de Central Ballester, Cañuelas y Central Córdoba Rosario
- [x] Tanda 4: 209 jugadores en 7 clubes tras depurar Yupanqui
- [x] CSV actualizado: 865 jugadores en 28 clubes; 23 planteles cumplen el máximo de 30
- [ ] Auditoría individual final de los 5 planteles que aún superan 30 jugadores: Lugano, Deportivo Español, Muñiz y Leones FC

La integración conservó los planteles de Primera, Primera Nacional, B Metropolitana y Federal A. No se modificó la lista de equipos ni el motor.


## Avance 12/11/2026

- La primera captura nominal de los siete clubes está guardada en `relevamiento-tanda1.md`: Juventud Unida (51), Estrella del Sur (43), Argentino de Rosario (50), Victoriano Arenas (37), Sacachispas (50), Leandro N. Alem (47) y Club Mercedes (35).
- Estas cantidades corresponden a las nóminas publicadas por Solo Ascenso, no a la cantidad final que se importará. Se depurarán nombres sin participación, bajas y movimientos de mitad de temporada; no se va a cargar automáticamente cada nombre ni a sobrepoblar clubes.
- Las cuatro tandas reúnen 1.123 jugadores en los 28 clubes tras la primera depuración y la incorporación posterior de Matías Arias. La carga está integrada y validada; medias y dorsales siguen identificados como estimaciones. Edades, nacionalidades, pie hábil, roles específicos y medias deben revisarse en la auditoría individual final.


## Carga inicial — tanda 1

La primera tanda se preparó con 312 nombres nominales. En la depuración inicial se retiraron Gabriel Rivera (Estrella del Sur) y Nicolás Gentile (Leandro N. Alem), ambos sin participación de primer equipo en 2026. En la auditoría general se agregó Matías Arias a Sacachispas por sus 16 partidos y 1.306 minutos. El CSV actual de esta tanda contiene **311 jugadores en siete clubes**.

La prueba automatizada integra los cuatro CSV en conjunto, verifica nombres y dorsales únicos dentro de cada club, y comprueba que los planteles ajenos a Primera C no cambien. Las medias y los dorsales continúan identificados como estimaciones; las edades, nacionalidades, pies hábiles y roles específicos se completarán en la auditoría individual.

## Carga inicial — tanda 2

La segunda tanda incorpora 7 clubes y 271 jugadores nominales: Berazategui (38), Deportivo Paraguayo (42), Defensores de Cambaceres (35), Puerto Nuevo (33), Centro Español (29), J.J. Urquiza (49) y Atlético Lugano (45). Con la tanda 1, el runtime integrado debe quedar en **582 jugadores y 14 clubes**.

La auditoría posterior debe prestar especial atención a Puerto Nuevo: la presentación oficial de febrero informó 26 jugadores, mientras que la nómina actualizada de Solo Ascenso contiene 33. Se conserva la nómina actualizada para la carga y se revisarán altas, bajas y convocatorias antes de depurar.


## Carga inicial — tanda 3

La tercera tanda incorpora 7 clubes y 277 jugadores nominales: Atlas (42), Cañuelas (31 jugadores únicos; Santino Sapio se registra una sola vez), Central Ballester (51), Central Córdoba de Rosario (32), Claypole (39), Deportivo Español (39) y Muñiz (38). Con las dos tandas anteriores, el runtime integrado debe quedar en **854 jugadores y 21 clubes**, después de la primera depuración de Central Ballester.

Central Ballester y Deportivo Español quedan señalados para revisar tamaño y rotación; Cañuelas tiene una doble clasificación de Santino Sapio que se representa con posición secundaria, no con un jugador duplicado.


## Carga inicial — tanda 4

La cuarta tanda incorporó 7 clubes y 272 jugadores nominales: El Porvenir (47 antes de depuración), Fénix (42), General Lamadrid (35), Leones FC (37), Luján (33), Sportivo Barracas (39) y Yupanqui (39). Tras retirar tres arqueros sin participación de primer equipo, El Porvenir queda con 44. El runtime completo queda en **1.123 jugadores en 28 clubes**.

La auditoría general final debe revisar especialmente Central Ballester (51), Juventud Unida (51), Argentino de Rosario (50), Sacachispas (50), J.J. Urquiza (49) y Sportivo Barracas (trece delanteros), además de las edades, posiciones específicas, apariciones, bajas y medias de los 28 planteles.


## Primera depuración general — 12/11/2026

Tras revisar evidencia de participación y convocatorias, se retiraron ocho jugadores de la carga preliminar: cinco de Central Ballester y tres de El Porvenir. El runtime quedó inicialmente en 1.122; luego se agregó Matías Arias y ahora contiene **1.123 jugadores** en los 28 clubes. No se alteraron los otros planteles.

- Central Ballester: 51 jugadores, cuatro arqueros y 17 mediocampistas.
- El Porvenir: 44 jugadores, cuatro arqueros.
- Se mantiene a Nicolás Suaya y Santiago Garro en Central Ballester porque fueron incorporaciones del primer equipo y estuvieron en convocatorias, aunque no sumaron minutos.
- Se mantiene a Luis Andrade en El Porvenir: disputó dos partidos y 118 minutos.

El informe global de auditoría está en `auditoria-general-primera-c-2026.md`; la revisión individual de los restantes planteles sigue abierta.


Informe general: `planteles/auditoria-general-primera-c-2026.md`.


### Ajuste de nómina posterior

Se agregó Matías Arias a Sacachispas: su ficha 2026 confirma 16 partidos y 1.306 minutos. El total actual queda en 1.123 jugadores; la prueba de integridad se actualizó para validar esta incorporación.


## Correcciones de auditoría individual — 12/11/2026

- Central Ballester queda con 50 jugadores tras retirar a Franco Gómez, que registra cero presencias y cero convocatorias en 2026. Agustín Corbalán se conserva porque figura en la nómina actual del primer equipo.
- General Lamadrid queda con 36 jugadores tras incorporar a Néstor Acosta, titular en los 33 partidos de 2026 (2.887 minutos y 16 vallas invictas). Dorsal 31 estimado.
- El total se mantiene en 1.123 jugadores y 28 clubes; la distribución global queda en 101 ARQ, 305 DEF, 494 MED y 223 DEL.
- La auditoría de runtime se ejecutará sobre esta corrección antes de integrar los cambios a main.


## Actualización 13/11/2026 — nuevo criterio y primera poda

- Se fija un máximo de **30 jugadores por club**, con objetivo habitual de 22–27. Puede haber menos de 22 si el plantel real y la participación lo justifican.
- La comparación con B Metro (promedio 24,2) y Federal A (23,7) confirma que Primera C estaba sobredimensionada.
- **Central Ballester:** se depuró de 50 a 30 jugadores usando la tabla completa de minutos de Primera C 2026 y la revisión de convocatorias. Se retiraron 20 registros; el detalle está en la sección 17 del informe general.
- Recuento de los cuatro CSV después de esta poda: **1.106 jugadores en 28 clubes**. Los otros 23 planteles todavía requieren depuración.
- El runtime aún no se considera actualizado: falta terminar la poda, ejecutar las pruebas conjuntas y validar la integración.

Las cifras anteriores de Central Ballester (50/51) y los totales de 1.123/1.126 describen etapas históricas de la carga; el estado vigente es el indicado en esta actualización.

- **Cañuelas:** se depuró de 31 a 30 jugadores. Se retiró Francisco Riscino al no encontrarse participación oficial de Primera C; el informe general documenta el cruce con estadísticas y el boletín de AFA.
- Estado vigente tras ambas podas: **1.105 jugadores en 28 clubes; Central Ballester y Cañuelas ya están en 30**. Quedan 25 clubes por encima del máximo.


## Actualización 13/11/2026 — depuración de tanda 1

- **Sacachispas:** 50 → 30. Se conservaron 26 jugadores con participación registrada y cuatro nombres con convocatorias de primer equipo respaldadas. Se retiraron 20 jugadores sin uso/convocatoria suficiente.
- **Leandro N. Alem:** 46 → 29. Se conservaron los jugadores de participación suficiente; Facundo Moreno salió por registrar solo 18 minutos y Agustín Dilandro queda fuera del plantel de cierre porque fue cedido a Guillermo Renny el 15/09/2026 (había jugado 16 partidos y 731 minutos antes de salir).
- El recuento de Primera C baja de 1.105 a **1.068 jugadores en 28 clubes**. La distribución vigente por tanda es: tanda 1, 275; tanda 2, 271; tanda 3, 250; tanda 4, 272.
- **Cinco clubes** ya cumplen el máximo: Central Ballester (30), Cañuelas (30), Sacachispas (30), Alem (29) y Centro Español (29). Quedan 23 planteles por depurar.
- `public/squads.json`, `public/squads.js` y `public/squads-meta.json` ya están sincronizados con los CSV. El test espera 1.068 jugadores; falta la ejecución confirmada de GitHub Actions y el chequeo de runtime.

Detalle de evidencia y nombres retirados: secciones 21–23 de `auditoria-general-primera-c-2026.md`.


## Actualización 13/11/2026 — depuración de Luján

- **Luján: 33 → 27 jugadores.** Se cruzó la nómina 2026 publicada por AFA (26 futbolistas) con la lista de cierre de Solo Ascenso y las convocatorias/síntesis de las fechas finales.
- Se retiraron Valentín Alegre, Juan Moreno, Román Busto, Santiago Tríbulo, Gonzalo Ramírez y Aaron Villecco: no aparecen en la nómina oficial de AFA ni se encontró participación/convocatoria oficial de Primera C para ellos. No se los confundió con futbolistas de otros clubes con el mismo nombre.
- Se conservó **Maximiliano Piñeiro** porque figura como suplente en la síntesis de Luján–Berazategui del 25/10/2026 (fecha 34), aunque no integra la nómina AFA de 26. Así se mantiene un jugador adicional con evidencia directa de convocatoria.
- Se ajustaron posiciones según la nómina AFA: Lucas Gómez como DEF, Tomás Dopazo como MED y Franco Pérez como DEL. Nahuel Icazatti se conserva: su ficha individual confirma 29 presencias, 23 titularidades y 6 ingresos desde el banco; su nombre completo es Leandro Nahuel Icazatti.
- Fuentes: [plantel oficial de AFA](https://www.afa.com.ar/es/posts/lujan-supero-a-berazategui-en-la-final-por-el-ascenso-y-jugara-la-proxima-temporada-en-primera-b), [plantel de cierre de Solo Ascenso](https://www.soloascenso.com.ar/club/lujan/290), [perfil de Nahuel Icazatti](https://www.soloascenso.com.ar/perfil/nahuel-icazatti/22784), [convocatoria de fecha 34](https://www.soloascenso.com.ar/ficha/46167).
- Nuevo recuento CSV: **1.062 jugadores en 28 clubes**. Seis clubes cumplen el máximo de 30; quedan 22 planteles por revisar. La sincronización de runtime y la prueba automatizada se verificarán en el workflow del PR.


## Actualización 13/11/2026 — depuración de Puerto Nuevo

- **Puerto Nuevo: 33 → 30 jugadores.** Se contrastó la nómina de cierre de Solo Ascenso con la presentación profesional inicial y las estadísticas individuales de Primera C 2026.
- Se retiraron **Benjamín Ferreyra, Federico Aciar y Tomás Schefer**: sus perfiles de temporada registran cero partidos jugados; en las fichas de encuentros aparecen únicamente como suplentes no utilizados. No se retiraron jugadores por tener pocos minutos si sí registraron presencia: por ejemplo, Joaquín Pillwein (5 partidos, 53 minutos), Ezequiel Sánchez (1 partido, 19 minutos) y Lucas Ortiz (1 partido, 1 minuto) se conservan.
- Se mantiene a Thiago Ricalde como segundo arquero por integrar la nómina profesional inicial, aunque no sumó minutos. La reducción se limita a tres mediocampistas sin participación oficial.
- Fuentes: [plantel profesional presentado por Puerto Nuevo](https://www.soloascenso.com.ar/notas/puerto-nuevo/puerto-nuevo-tiene-todo-listo-para-competir-en-el-2026/225078), [nómina actualizada de Solo Ascenso](https://www.soloascenso.com.ar/club/puerto-nuevo/297), [estadísticas completas de Puerto Nuevo](https://www.ceroacero.com.co/equipo/puerto-nuevo/45607/jugadores?epoca_stats_id=155), [perfil de Benjamín Ferreyra](https://www.ceroacero.com.co/jugador/benjamin-ferreyra/3555652?epoca_id=155), [perfil de Federico Aciar](https://www.ceroacero.com.co/jugador/federico-aciar/3625947?epoca_id=155), [perfil de Tomás Schefer](https://www.ceroacero.com.co/jugador/tomas-schefer/3558784?epoca_id=155).
- Nuevo recuento CSV: **1.059 jugadores en 28 clubes**. Siete clubes cumplen el máximo de 30; quedan 21 planteles por revisar. La sincronización runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Juventud Unida

- **Juventud Unida: 51 → 30 jugadores.** Se utilizó la tabla individual de temporada 2026 de ZeroZero, que lista 35 futbolistas con partidos jugados, y se cruzó con los 51 nombres del CSV.
- Se retiraron 18 nombres sin apariciones registradas en la tabla de temporada y cuatro de los de menor participación: Mateo Ursi (3 partidos), Joaquín Iglesias (2), Diego López (1) y Santiago Núñez (1). La selección final prioriza los 30 jugadores con mayor participación comprobada dentro de la nómina disponible.
- Se incorporó **Fernando Giménez** (32 años, MED), omitido en el CSV pese a registrar 10 partidos en 2026. El dorsal 67 queda identificado como estimado, porque la ficha estadística no publica un número individual verificable.
- No se incorporó a Santino Bevilacqua: registra sólo dos partidos y queda por debajo del corte de participación aplicado para mantener el plantel en 30.
- Fuentes: [tabla individual de temporada de Juventud Unida](https://www.zerozero.pt/equipa/juventud-unida-san-miguel/45600/jogadores), [plantel 2026 y promedio de partidos](https://www.zerozero.com.ar/equipo/juventud-unida-san-miguel/45600), [El Porvenir–Juventud Unida: Giménez titular y autor del gol](https://www.ceroacero.com.co/partido/2026-05-16-el-porvenir-juventud-unida-san-miguel/12020423).
- Nuevo recuento CSV: **1.038 jugadores en 28 clubes**. Ocho clubes cumplen el máximo de 30; quedan 20 planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Estrella del Sur

- **Estrella del Sur: 43 → 29 jugadores.** Se contrastó el CSV con el plantel 2026 y las estadísticas individuales de ZeroZero. Se retiraron 14 nombres que no aparecen en el plantel de cierre ni en los registros de participación de la temporada.
- Se conservaron Gabriel Rivera, Lucas Cabrera y Felipe Scabuzzo porque figuran en el plantel de cierre aunque no tengan minutos registrados; no se confundió falta de minutos con ausencia de pertenencia al primer equipo.
- Iván Caravaca y Juan Scarel no se incorporaron: Caravaca comunicó su salida el 30/06/2026 y Scarel fue transferido a Argentino de Quilmes el 18/07/2026. Se tomó una sola ficha de Lautaro Torres, ya que la base de estadísticas lo duplica con edades/posiciones diferentes.
- Fuentes: [plantel 2026 de ZeroZero](https://www.zerozero.pt/equipa/estrella-del-sur/341204?epoca_id=155), [estadísticas individuales de temporada](https://www.zerozero.pt/equipa/estrella-del-sur/341204/jogadores), [transferencias 2026](https://www.zerozero.pt/equipa/estrella-del-sur/341204/transferencias), [salida de Caravaca](https://www.soloascenso.com.ar/notas/general-lamadrid/estrella-del-sur-sumo-un-refuerzo-y-sufrio-una-baja/229820).
- Nuevo recuento CSV: **1.024 jugadores en 28 clubes**. Nueve clubes cumplen el máximo de 30; quedan 19 planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Cambaceres

- **Defensores de Cambaceres: 35 → 30 jugadores.** Se ordenó la nómina por partidos disputados en las estadísticas individuales de Primera C 2026 y se mantuvieron los 30 nombres de mayor participación.
- Se incorporaron nueve futbolistas de uso comprobado que faltaban en el CSV: Esteban Coronel, Bryan Schmidt, Román Zárate, Facundo Odello, Javier Sequeyra, Tomás Baglieri, Tomás Ledesma, Renzo Fernández y Mariano Coletto. Sus edades y puestos se tomaron de las fichas de temporada; dorsales estimados y marcados como tales cuando no había número verificable.
- Se retiraron 14 nombres que no aparecen en la tabla de participación utilizada o quedaron fuera del corte de 30. Se conservó **Facundo Fajardo** con el nombre de Solo Ascenso: su perfil registra 22 presencias y 21 titularidades; ZeroZero lo muestra como “Agustín Fajardo”, pero su ficha individual confirma el nombre completo Facundo Fajardo González.
- Fuentes: [estadísticas individuales de Cambaceres](https://www.zerozero.pt/equipa/defensores-de-cambaceres/45576/jogadores), [plantel 2026 de Cambaceres](https://www.zerozero.pt/equipa/defensores-de-cambaceres/45576), [perfil de Facundo Fajardo con 22 presencias](https://www.soloascenso.com.ar/perfil/facundo-fajardo/25469), [síntesis de la fecha 29](https://www.jjurquiza.com.ar/NotasPrimera/Nota4125.html).
- Nuevo recuento CSV: **1.019 jugadores en 28 clubes**. Diez clubes cumplen el máximo de 30; quedan 18 planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Club Mercedes

- **Club Mercedes: 35 → 29 jugadores.** Se adoptó la nómina de cierre de ZeroZero para 2026, que identifica 29 integrantes. Se retiraron seis nombres del CSV que no aparecen en esa plantilla de cierre: Franco Tonatto, Román Cruz, Franco Taborda, Lucas Calderón, Ulises Antonio Dematei y Lautaro Lagos.
- Se conservaron Rodrigo Nicasio y Santiago Romagnoli aunque no registren minutos: ambos aparecen en el plantel de cierre, por lo que no se confundió falta de participación con baja del club.
- Se corrigieron dos puestos según la ficha de temporada: Franco Ortigosa pasa a DEL y Francisco Ruiz a MED.
- Fuentes: [plantel de cierre de Club Mercedes](https://www.zerozero.pt/equipa/club-mercedes/91322), [estadísticas individuales 2026](https://www.zerozero.com.mx/equipa/club-mercedes/91322/jugadores?epoca_stats_id=155), [nómina de Solo Ascenso](https://www.soloascenso.com.ar/club/mercedes/438), [convocatoria del 22/08](https://noticiasmercedinas.com/site/2026/08/21/club-mercedes-y-sacahispas-sobresale-en-la-primera-c/).
- Nuevo recuento CSV: **1.013 jugadores en 28 clubes**. Once clubes cumplen el máximo de 30; quedan 17 planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Argentino de Rosario

- **Argentino de Rosario: 50 → 30 jugadores.** Se utilizó la tabla individual de Primera C 2026 de ZeroZero, ordenada por partidos jugados. Se conservaron los 30 futbolistas de mayor participación dentro de la nómina del CSV.
- Se retiraron 12 nombres sin apariciones en la tabla de temporada y los ocho de menor participación restante: Fabricio Manduca (1 partido), Facundo Yess (1), Lautaro Pino (1), Mauro Scassa (1), Bismark Gómez (2), Tomás Ávalos (2), Miguel Hernández Castillo (2) y Rodrigo González (3, todos como suplente).
- No se reincorporaron Dago Palencia, Facundo Aronna ni Carlos Raga Córdoba: sus fichas reflejan participación inicial, pero los tres pasaron a Defensores de Cambaceres durante la temporada y ya están en ese plantel.
- Se conservaron las formas de nombre del CSV para Theo Guiñazú, Wilfran Quinto Orejuela y Miguel Hernández Castillo cuando corresponden a fichas estadísticas con nombre ampliado. El dato aislado de “Federico Nahuel” con 44 partidos no se importó: no figura en la nómina del club ni en el CSV y supera los 30 partidos de la competición, por lo que se trató como anomalía de la base.
- Fuentes: [tabla individual de temporada de Argentino](https://www.zerozero.pt/equipa/argentino-de-rosario/43541/jogadores), [plantel 2026 y transferencias](https://www.zerozero.pt/equipa/argentino-de-rosario/43541?epoca_id=155), [perfil de Rodrigo González: 3 ingresos como suplente](https://www.soloascenso.com.ar/perfil/rodrigo-gonzalez/28301), [perfil de Miguel Báez: 3 partidos/35 minutos](https://www.ceroacero.com.co/jugador/miguel-baez/1582947?epoca_id=155).
- Nuevo recuento CSV: **993 jugadores en 28 clubes**. Doce clubes cumplen el máximo de 30; quedan 16 planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Victoriano Arenas

- **Victoriano Arenas: 37 → 30 jugadores.** Se cruzó el CSV con el plantel de Primera C 2026 y las estadísticas de participación de ZeroZero.
- Se retiraron Santiago Benvenutti y Rodrigo Soria, ausentes de la nómina de 2026; Ivo Patiño y Lucas Sireiro, sin partidos registrados; y Lucas Borras (2 partidos), Rodrigo Richards (1) y Rodrigo Taus (1), los de menor participación restante.
- Se conservaron los jugadores de mayor continuidad: Julián García, Leonel Duarte, Matías Sosa, Matías Gómez, Fabián Monserrat, Tobías Mercado, Isaías González, Luciano Vargas, Santiago Soria, Leandro Zacarías, Alan Salmantón, Uriel Parejas, Matías Rodríguez, Ramiro Rivarola, Sebastián de Luca, Emanuel Saporito, Román Pizzuti, Joaquín Grane Morrone, Santiago Fernández, Sebastián Benega, Nicolás Mamberti, Juan Cruz López, Facundo Rodríguez, Axel Tisocco, Aaron Rolando, Nicolás Baus, Lucas Pérez, Agustín Serrizuela, Máximo Sánchez y Eneas Gutiérrez.
- Fuentes: [plantel 2026](https://www.zerozero.pt/equipa/victoriano-arenas/45608?edicao_id=212447), [estadísticas individuales de la temporada](https://www.zerozero.pt/equipa/victoriano-arenas/45608/jogadores), [resumen estadístico del torneo](https://www.zerozero.pt/equipa/victoriano-arenas/45608/estatisticas?redirm=1).
- Nuevo recuento CSV: **986 jugadores en 28 clubes**. Trece clubes cumplen el máximo de 30; quedan 15 planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Berazategui

- **Berazategui: 38 → 30 jugadores.** Se cruzó el CSV con las estadísticas individuales de Primera C 2026 y se conservó el corte de 30 futbolistas con mayor participación.
- Se incorporaron dos jugadores de alta participación que faltaban: **Joaquín Pucheta** (19 partidos) y **Braian Benítez** (16 partidos). Ambos se cargan con edad y posición respaldadas por la ficha de temporada; sus dorsales 37 y 38 quedan estimados.
- Se retiraron diez nombres fuera del corte de participación, incluidos jugadores sin partidos registrados. **Sebastián Villalba** se conserva con ese nombre de uso del club: su nombre completo es Héctor Cayetano Sebastián Villalba y su perfil registra 25 partidos y 2.141 minutos. Juan Pablo Serrizuela también se conserva con el nombre de plantilla, aunque la tabla de ZeroZero lo abrevia como Juan Serrizuela.
- Se corrigieron posiciones según la ficha individual: Thiago Benítez DEF, Alexis Godoy MED, Bautista Hernández MED y Emiliano Caballero MED.
- Fuentes: [estadísticas individuales de Berazategui](https://www.zerozero.pt/equipa/berazategui/25748/jogadores), [plantel de Primera C 2026](https://www.zerozero.pt/equipa/berazategui/25748?edicao_id=212447), [perfil de Sebastián Villalba](https://www.soloascenso.com.ar/perfil/hector-villalba/23503), [perfil de Joaquín Bentancor: sin partidos 2026](https://www.zerozero.pe/jugador/joaquin-bentancor/2418102?epoca_id=155).
- Nuevo recuento CSV: **978 jugadores en 28 clubes**. Catorce clubes cumplen el máximo de 30; quedan 14 planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Deportivo Paraguayo

- **Deportivo Paraguayo: 42 → 30 jugadores.** Se cruzó la nómina con las estadísticas individuales de la temporada y los movimientos de mitad de año. Se conservó el núcleo de mayor participación, con Enzo De La Peña como segundo arquero (2 partidos), y se incorporó **César Ávalos** (22 años, DEL), que registró 15 partidos y convirtió ante Estrella del Sur en la fecha 5, pero faltaba en el CSV.
- Se retiraron 13 nombres de uso mínimo o sin registro suficiente. No se reincorporó a Patricio Romero: aunque disputó 13 partidos en el primer semestre, dejó el club el 27/06/2026 para pasar a San Telmo. También se mantuvieron fuera las bajas de mitad de año que ya no integraban el CSV.
- Se corrigió a Juan José Aguilar como MED y se ajustaron los dorsales confirmados de Rolando Herrera (1) y Enzo De La Peña (12). Se conserva “Nahuel Quevedo” por la forma usada en las síntesis de partidos, aunque ZeroZero presenta la ficha como Ángel Quevedo.
- Fuentes: [plantel y estadísticas 2026 de Paraguayo](https://www.zerozero.pt/equipa/paraguayo/23534?edicao_id=212447), [Paraguayo–Estrella: gol de César Ávalos](https://www.tn.com.ar/deportes/futbol/2026/03/28/paraguayo-vs-estrella-en-vivo-por-la-fecha-5-de-la-primera-c-hora-donde-ver-y-formaciones/), [baja de Patricio Romero](https://www.soloascenso.com.ar/notas/deportivo-espanol/un-referente-de-paraguayo-seguira-su-carrera-en-el-nacional/229693), [síntesis de Cambaceres–Paraguayo](https://revistatribunaroja.blogspot.com/2026/08/un-empate-con-gusto-a-poco.html).
- Nuevo recuento CSV: **966 jugadores en 28 clubes**. Quince clubes cumplen el máximo de 30; quedan 13 planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Central Córdoba Rosario

- **Central Córdoba Rosario: 32 → 30 jugadores.** Se cruzó el CSV con el plantel de Primera C 2026 y el uso individual publicado. Se incorporaron tres delanteros que faltaban en el CSV pese a integrar el plantel y registrar participación: Brian Otero (14 partidos), Renzo Altamura (12) y Gino Albertengo (10).
- Se retiraron Tomás D'Amico (2 partidos), Mirko Pfarherr (2), Martín Porta (2), Franco Fagúndez (ausente de la nómina 2026) y Santiago Arduino (5), priorizando los jugadores de mayor continuidad. Se conserva Santiago Spelzini (5) en lugar de Leonel Fagúndez (3) para mantener el corte de mayor participación.
- Fuentes: [plantel de Primera C 2026](https://www.zerozero.pt/equipa/central-cordoba-rosario/29621?edicao_id=212447), [once más utilizado y estadísticas de equipo](https://www.zerozero.pt/equipa/central-cordoba-rosario/29621), [tabla de minutos del torneo](https://www.zerozero.pt/edicao/primera-c-2026/212447/estatisticas?id_jogador=840689&op=sjo&v=jt5).
- Nuevo recuento CSV: **964 jugadores en 28 clubes**. Dieciséis clubes cumplen el máximo de 30; quedan 12 planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de El Porvenir

- **El Porvenir: 44 → 30 jugadores.** Se utilizó la tabla individual de partidos disputados de Primera C 2026 y se priorizaron los 30 nombres con mayor participación, conservando a Luis Andrade como segundo arquero (2 partidos) y a Bruno Schmid (3 partidos) para completar el corte.
- Se retiraron 14 nombres de uso mínimo o sin respaldo suficiente en el registro de temporada. **Dario Nami** no se reincorpora a El Porvenir: dejó el club y pasó a Muñiz en julio de 2026. **Gustavo Rodas** tampoco se incorpora pese a aparecer en una tabla estadística anómala: su carrera profesional terminó en 2018.
- Fuentes: [estadísticas individuales de El Porvenir](https://www.zerozero.pt/equipa/el-porvenir/9149/jogadores), [salida de Dario Nami hacia Muñiz](https://www.soloascenso.com.ar/notas/muniz/el-porvenir-sufrio-su-primera-baja-y-ya-tiene-destino/229788), [trayectoria y retiro de Gustavo Rodas](https://www.infobae.com/deportes/2025/01/17/el-jugador-que-era-mejor-que-messi-en-las-inferiores-de-newells-y-termino-odiando-el-futbol-la-historia-de-billy-rodas/).
- Nuevo recuento CSV: **950 jugadores en 28 clubes**. Diecisiete clubes cumplen el máximo de 30; quedan 11 planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Fénix

- **Fénix: 42 → 29 jugadores.** Se priorizó el corte de 30 futbolistas con mayor cantidad de partidos disputados en Primera C 2026. No se incorporaron Franco Pérez ni Ramiro Breccia: ambos dejaron Fénix antes del inicio de la temporada 2026, pese a que aparecen en la base estadística general.
- Se retiraron 13 nombres con uso inferior o sin registro suficiente. Se conservaron tres arqueros: Marcos Jara, Mariano Mittelman y Francisco Macri, titular en el último partido de la temporada.
- **Iván Gorosito** se conserva con el nombre usado por el club: la ficha de ZeroZero aparece como Alan Iván Gorosito y registra 23 partidos/1.929 minutos; no es un homónimo ni un jugador diferente.
- Fuentes: [estadísticas individuales de Fénix](https://www.zerozero.pt/equipa/fenix/26695/jogadores), [perfil de Iván Gorosito con 23 partidos y 1.929 minutos](https://www.zerozero.pe/jugador/ivan-gorosito/989369?epoca_id=155), [cierre oficial de temporada](https://clubatleticofenix.com/fenix-2-1-leones-oficial-cierre-de-temporada-y-descenso-en-primera-c/), [presentación de refuerzos 2026](https://www.soloascenso.com.ar/notas/fenix/siguen-llegando-fenix-sumo-una-nueva-incorporacion/224754).
- Nuevo recuento CSV: **937 jugadores en 28 clubes**. Dieciocho clubes cumplen el máximo de 30; quedan diez planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Sportivo Barracas

- **Sportivo Barracas: 39 → 27 jugadores.** Se conservaron los futbolistas del núcleo principal con participación comprobada en la temporada y se retiraron 12 nombres con uso nulo o mínimo que no forman parte de la rotación principal.
- Se mantiene **Alen Boschi**: su nombre completo es Alen Tomás Boschi; algunas bases estadísticas lo muestran como Tomás Boschi y le registran 23 partidos/672 minutos. No se duplica como dos futbolistas.
- No se reincorporaron Emanuel de Porras ni Julián Bottaro, ausentes del plantel de cierre; Félix Orode dejó Sportivo Barracas y pasó a La Campana/Muñiz durante agosto de 2026.
- Fuentes: [plantel actual de Sportivo Barracas](https://www.365scores.com/es/football/team/sportivo-barracas-14371/squad), [plantel y nómina de Copa Argentina](https://www.copaargentina.org/es/equipos/121_sportivo-barracas.html), [estadísticas de Tomás/Alen Boschi: 23 partidos y 672 minutos](https://es.besoccer.com/jugador/career-path/tomas-boschi-3813516), [nombre completo Alen Tomás Boschi](https://www.transfermarkt.es/alen-boschi/profil/spieler/1462817), [salida de Félix Orode](https://www.sportdigital.com.ar/nota/14553/futbol-gran-refuerzo-de-la-campana-para-el-torneo-clausura).
- Nuevo recuento CSV: **925 jugadores en 28 clubes**. Diecinueve clubes cumplen el máximo de 30; quedan nueve planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de JJ Urquiza

- **JJ Urquiza: 49 → 30 jugadores.** Se priorizó la participación individual en Primera C 2026, tomando como base la tabla de partidos jugados y el plantel de temporada.
- Se retiraron 19 nombres de baja participación, sin minutos o fuera de la nómina principal de cierre. Se mantuvo a Ramiro Cordero como segundo arquero (1 partido), además del titular Facundo Durán, para conservar cobertura en el puesto.
- No se importó el registro incompleto “Brian” que aparece en la tabla estadística: no ofrece apellido verificable ni correspondencia inequívoca con un jugador del CSV.
- Fuentes: [estadísticas individuales de JJ Urquiza](https://www.zerozero.pt/equipa/justo-jose-de-urquiza/45579/jogadores?redird=1), [plantel 2026 y transferencias](https://www.zerozero.pt/equipa/justo-jose-de-urquiza/45579?epoca_id=155), [convocatorias de temporada](https://www.jjurquiza.com.ar/NotasPrimera/Nota4123.html).
- Nuevo recuento CSV: **906 jugadores en 28 clubes**. Veinte clubes cumplen el máximo de 30; quedan ocho planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de General Lamadrid

- **General Lamadrid: 39 → 29 jugadores.** Se utilizó la tabla de partidos disputados y el plantel de cierre de 2026. Se incorporó **Juan Pablo López** (defensor, 25 años), líder de presencias con 39 partidos, que faltaba en el CSV.
- Se retiraron 11 nombres con participación nula o baja y/o fuera de la nómina de cierre. Se conservó a Franco Davalos como arquero suplente, junto con Néstor Acosta y Matías Velázquez.
- **Alejo Roa** se conserva con el nombre del club: la ficha estadística lo abrevia como Agustín Roa, pero su nombre completo es Alejo Agustín Roa; su perfil confirma 30 presencias, 25 titularidades y tres goles.
- Darío Nami no se mantiene en Lamadrid: salió durante la temporada y continuó en El Porvenir. Ian Lynch también salió hacia Deportivo Paraguayo; ya figura en el plantel de ese club.
- Fuentes: [estadísticas individuales de Lamadrid](https://www.zerozero.pt/equipa/general-lamadrid/45578/jogadores), [plantel de cierre 2026](https://www.soloascenso.com.ar/club/gral-lamadrid/278), [perfil de Alejo Roa y 30 presencias](https://www.soloascenso.com.ar/perfil/alejo-roa/24038), [fichas de partido y convocatorias](https://devotodelamadrid.blogspot.com/2026/09/).
- Nuevo recuento CSV: **896 jugadores en 28 clubes**. Veintiún clubes cumplen el máximo de 30; quedan siete planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — depuración de Claypole

- **Claypole: 39 → 30 jugadores.** El CSV coincidía con la nómina de cierre publicada por Solo Ascenso. Se conservaron los 30 futbolistas con participación más relevante en 2026, priorizando los registros de partidos y las convocatorias del tramo final.
- Se retiraron nueve integrantes de la nómina amplia con uso nulo o insuficiente para el plantel principal. No se agregaron jugadores que ya habían salido antes del cierre: Luca Falabella pasó a Sportivo Ameliano en febrero y Farid Jasni se incorporó a Fénix el 29/06/2026.
- Se conserva **Leonel Llodrá** con el nombre de uso del club; su nombre completo es Matías Leonel Llodrá y registra 25 partidos y siete goles en 2026.
- Fuentes: [plantel de cierre de Claypole](https://www.soloascenso.com.ar/club/claypole/258), [estadísticas 2026 de Leonel Llodrá](https://www.zerozero.com.mx/jugador/leonel-llodra/490419), [salida de Luca Falabella](https://www.leballonrond.fr/equipe/sportivo-ameliano/108830/transferts), [salida de Farid Jasni hacia Fénix](https://www.soloascenso.com.ar/notas/deportivo-espanol/fenix-presento-dos-refuerzos-para-el-tramo-final/229801).
- Nuevo recuento CSV: **897 jugadores en 28 clubes**. Veintidós clubes cumplen el máximo de 30; quedan seis planteles por revisar. Runtime y CI siguen pendientes de ejecución confirmada.


## Actualización 13/11/2026 — Yupanqui

- Yupanqui quedó en 30 jugadores tras cruzar la nómina con la tabla de minutos de Primera C 2026. Se retiraron seis nombres sin registro en la tabla consultada y dos con participación mínima (4 y 18 minutos). La decisión y las fuentes están documentadas en `auditoria-general-primera-c-2026.md`.
- Recuento exacto de los cuatro CSV: tanda 1, 207; tanda 2, 224; tanda 3, 225; tanda 4, 209. Total: **865 jugadores en 28 clubes**.
- Cinco clubes continúan por encima de 30: Lugano, Deportivo Español, Muñiz y Leones FC (Yupanqui ya fue depurado; el recuento previo incluía cinco antes de esta edición y ahora quedan cuatro? verificar lista final con el próximo recálculo).
