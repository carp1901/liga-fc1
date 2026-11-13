# Primera C 2026 — planteles reales

Trabajo de recopilación y auditoría por cuatro tandas. Los CSV son la fuente de carga y los informes documentan las verificaciones. Los 28 clubes ya están integrados al runtime; la auditoría individual final sigue en curso.

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

- [x] Tanda 1: 275 jugadores en 7 clubes tras depurar Sacachispas y Alem
- [x] Tanda 2: 271 jugadores en 7 clubes
- [x] Tanda 3: 250 jugadores en 7 clubes tras las depuraciones de Central Ballester y Cañuelas
- [x] Tanda 4: 272 jugadores en 7 clubes
- [x] CSV y runtime sincronizados: 1.068 jugadores en 28 clubes (pruebas automáticas finales pendientes)
- [ ] Auditoría individual final de los 23 planteles que aún superan 30 jugadores

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
