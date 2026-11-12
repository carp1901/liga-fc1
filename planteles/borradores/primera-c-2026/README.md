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
- Prioridad: nóminas oficiales de clubes/AFA; después reportes de temporada y fichas de partidos de Mundo Ascenso y Solo Ascenso; FM26/FM27 se usan como referencia de medias, edad, posiciones y contraste, no como prueba única de pertenencia al plantel 2026.
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

- [ ] Tanda 1: 7 clubes
- [ ] Tanda 2: 7 clubes
- [ ] Tanda 3: 7 clubes
- [ ] Tanda 4: 7 clubes
- [ ] Auditoría conjunta: 28 clubes, mínimo 22 por club, siete suplentes, nombres/clubes, dorsales y fuentes
- [ ] Importación a `public/squads.json`, `public/squads.js` y `public/squads-meta.json` sólo después de aprobar la auditoría

La integración deberá conservar los planteles de Primera, Primera Nacional, B Metropolitana y Federal A. No modificar la lista de equipos, el motor ni las divisiones ya completas.
