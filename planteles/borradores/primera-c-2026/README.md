# Primera C 2026 — planteles reales

Trabajo de recopilación por cuatro tandas. Los archivos de esta carpeta son borradores editables y no se integran al juego hasta completar los 28 clubes y pasar la auditoría conjunta.

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
- Mínimo de 22 jugadores por club; no es un número exacto. Se incluyen primera plantilla y futbolistas con participación verificable, evitando reservas profundas y planteles inflados.
- Deben quedar al menos siete alternativas de banco además del XI.
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

- [x] Relevamiento nominal inicial de tanda 1: 7 clubes
- [x] Carga preliminar de tanda 1 en runtime: 312 jugadores en 7 clubes
- [ ] Auditoría general posterior a la carga: apariciones, bajas, posiciones, tamaño, edades, roles, medias y dorsales
- [ ] Tanda 2: 7 clubes
- [ ] Tanda 3: 7 clubes
- [ ] Tanda 4: 7 clubes
- [ ] Auditoría conjunta final de los 28 clubes

La integración deberá conservar los planteles de Primera, Primera Nacional, B Metropolitana y Federal A. No modificar la lista de equipos, el motor ni las divisiones ya completas.


## Avance 12/11/2026

- La primera captura nominal de los siete clubes está guardada en `relevamiento-tanda1.md`: Juventud Unida (51), Estrella del Sur (43), Argentino de Rosario (50), Victoriano Arenas (37), Sacachispas (49), Leandro N. Alem (47) y Club Mercedes (35).
- Estas cantidades corresponden a las nóminas publicadas por Solo Ascenso, no a la cantidad final que se importará. Se depurarán nombres sin participación, bajas y movimientos de mitad de temporada; no se va a cargar automáticamente cada nombre ni a sobrepoblar clubes.
- La carga preliminar ya está integrada en `public/squads.json`, `public/squads.js` y `public/squads-meta.json`: 312 jugadores, todos con dorsal estimado identificado y sin duplicados dentro de cada club. No se considera carga definitiva: edades, nacionalidades, roles específicos y medias deben revisarse en la auditoría general.


## Carga inicial — tanda 1

Se acordó cambiar el orden de trabajo: cargar primero la nómina nominal de los siete clubes y realizar después una auditoría general conjunta. El archivo `tanda1-inicial.csv` contiene 312 registros (51 Juventud Unida, 43 Estrella del Sur, 50 Argentino de Rosario, 37 Victoriano Arenas, 49 Sacachispas, 47 Leandro N. Alem y 35 Club Mercedes).

Las medias y los dorsales de esta carga inicial son provisionales y están identificados explícitamente como estimaciones; no se presentan como datos oficiales. Las edades, nacionalidades y roles específicos no se completan por inferencia. La auditoría posterior deberá revisar apariciones, altas/bajas, identidades, posiciones, tamaño razonable de cada plantel y reemplazar las estimaciones cuando haya evidencia individual mejor.

La importación automatizada se ejecuta en el PR: valida el CSV, integra únicamente estos siete clubes en el runtime de la rama y comprueba que el resto de los planteles quede idéntico a `main`. Los otros 21 clubes de Primera C quedan fuera de esta primera tanda. El runtime contiene sólo estos siete planteles de la categoría por ahora.


La prueba de integración compara los clubes ajenos a Primera C contra el runtime de `main`; la lectura de ese archivo usa un buffer ampliado para permitir la comparación completa de los planteles existentes.
