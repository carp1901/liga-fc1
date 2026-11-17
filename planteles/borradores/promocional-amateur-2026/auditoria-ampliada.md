# Auditoría ampliada — Promocional Amateur 2026

Fecha: 16/11/2026  
Estado: **parcial; no cerrar la división todavía**.

## 1. Controles automáticos sobre los CSV actuales

- 504 registros en dos CSV y 17 clubes.
- Distribución: 14 clubes con 30 jugadores y Defensores de Glew, Everton y Juventud de Bernal con 28.
- 11 columnas consistentes, sin filas con posición general inválida ni fuentes/fechas vacías.
- Sin nombres duplicados dentro de un mismo club.
- Sin dorsales duplicados dentro de un mismo club.
- Se detectaron 10 nombres repetidos entre clubes. No se eliminaron automáticamente: algunos pueden ser homónimos y otros movimientos entre clubes durante la temporada.
- Las 504 medias están concentradas únicamente en 41, 42 y 43. Todas son estimaciones propias, no valoraciones individuales verificadas.
- Los 504 dorsales son secuenciales estimados; ninguno está confirmado como dorsal oficial.
- En los metadatos de los 17 clubes no hay fuentes de nacionalidad ni de edad. Los roles específicos tampoco están documentados: en el CSV, rol y posición general coinciden en las 504 filas.

## 2. Hallazgos de contenido ya confirmados

### Deportivo Metalúrgico — revisión de identidad y temporada

La primera auditoría interpretó incorrectamente la fuente AFA como una lista de 2025. La página de AFA es el resumen del campeón del Promocional Amateur 2026 y contiene un plantel de cierre de temporada. La página de Solo Ascenso también presenta una plantilla 2026, pero parece ser una nómina actualizada en otra fecha: las listas no son idénticas y deben leerse junto con las planillas de partidos, no como una única nómina inmutable.

En la revisión se comprobó que Lucas Zamorano tuvo participación real y relevante en 2026: fue titular ante Juventud de Bernal (22/08), convirtió ante Provincial (05/08) y entró ante SAT (29/09). Se sustituyó en el CSV a Eric Giménez por Lucas Zamorano. Eric Giménez aparece en la lista del plantel campeón de AFA/Pilar Diario como defensor, pero no figura en las planillas de los partidos revisados ni en el plantel actualizado de Solo Ascenso; no debe mantenerse como delantero sin nueva evidencia.

Las planillas del 22/08, 29/08, 14/09 y 29/09 confirman la participación de varios jugadores que sí deben estar considerados en el grupo principal o en el banco: Rodrigo Acosta Barrios, Brian Rodríguez, Jerónimo Higuaín, Gabriel Luque, Thiago Domínguez, Franco Migueles, Tobías Sotelo, Agustín Varela, Leandro De Robertis, Carlos Ispizua, Mario Mendieta Benítez, Román Duarte, Tiziano Morales, Lucas Izaguirre, Tobías Schmit, Alexis Dalul, Lautaro Robin, Aaron Ibañez, Franco Morales y Lucas Zamorano. La lista cargada sigue necesitando revisión completa de altas y bajas; no se deben agregar todos automáticamente: aplicar el criterio de titulares y suplentes importantes, priorizando apariciones y minutos. No se encontró aún una fuente pública consistente de minutos individuales para todos.

Fuentes:
- https://www.afa.com.ar/en/posts/metalurgico-derroto-1-0-a-f.c.-ezeiza-y-es-el-campeon-del-promocional-amateur
- https://www.pilaradiario.com/la-liga/metalurgico-vuelo-campeon-puerto-nuevo-n5465020
- https://www.soloascenso.com.ar/club/deportivo-metalurgico/1073
- https://www.soloascenso.com.ar/ficha/45860
- https://www.soloascenso.com.ar/ficha/45845
- https://www.soloascenso.com.ar/ficha/46106
- https://www.soloascenso.com.ar/ficha/46114

### Defensores de Glew — prioridad alta

La página de plantilla 2026 publica un plantel mucho más amplio que los 28 registros cargados. Las planillas 2026 muestran a Leandro Colque como mediocampista (aparece en el sector central, con dorsal 5) y a Gustavo Romero como defensor. Se corrigió a Leandro Colque de DEF a MED; Gustavo Romero se mantiene como DEF. La selección completa de los 28 jugadores todavía requiere contraste con apariciones y minutos.

Fuentes:
- https://www.soloascenso.com.ar/club/defensores-de-glew/859
- https://www.soloascenso.com.ar/ficha/45845

### Juventud de Bernal — primera depuración por planillas

Se contrastaron planillas del 30/05, 28/07 y 22/08 de 2026. La lista inicial de 28 contenía varios nombres sin participación comprobada en esas fichas y omitía jugadores que sí fueron titulares o suplentes. Se reemplazaron nueve registros sin evidencia suficiente por futbolistas que sí aparecen en las planillas:
- Matías Gómez → Juan Salinas (arquero)
- Marcos Albet → Abimelec Santiago Vera Núñez
- Leonel Conidi → Juan Pérez Tello
- Sebastián Díaz → Lautaro Cáceres
- Pedro Amarilla → Iván Nieto
- Santiago Benavidez → Lucas Rastelli
- Kevin Thomas Báez → Ulises Velázquez
- Ángel Hernández Ramírez → Leandro Martínez
- Miguel Leguizamón → Elián Muñoz

Se mantienen 28 jugadores, sin completar cupos. Las posiciones generales de los nuevos registros son provisionales y deberán afinarse con fichas individuales o más planillas. La depuración se basa en apariciones confirmadas, no en que la nómina publicada tenga un máximo determinado.

Fuentes:
- https://www.soloascenso.com.ar/sintesis/defensores-de-glew-juventud-de-bernal/45776
- https://www.soloascenso.com.ar/ficha/45828
- https://www.soloascenso.com.ar/ficha/45860
- https://www.soloascenso.com.ar/club/juventud-de-bernal/759

### Everton de La Plata — prioridad alta

El CSV tiene 28 jugadores, mientras que la plantilla publicada para 2026 es más amplia. La posición de Franco González requiere verificación: la página de Everton lo lista como ARQ, pero el CSV lo clasifica como MED. No corregir sin confirmar identidad.

Fuente:
- https://www.soloascenso.com.ar/club/everton-la-plata/476

### Otros contrastes iniciales

- FC Ezeiza: 30 cargados frente a 31 nombres en la plantilla publicada para 2026; revisar el nombre omitido y la participación antes de ampliar.
  - https://www.soloascenso.com.ar/club/fc-ezeiza/1074
- Barrancas FC: 30 cargados frente a una plantilla publicada más amplia; revisar apariciones y suplencias para seleccionar los 30 relevantes.
  - https://www.soloascenso.com.ar/club/barrancas-fc/1075
- Social Atlético Televisión: 30 cargados frente a una plantilla publicada más amplia; contrastar las posiciones y los jugadores usados en las fases finales.
  - https://www.soloascenso.com.ar/club/social-atletico-television/703
- Náutico Hacoaj: la plantilla publicada para 2026 es más amplia que los 30 cargados; revisar especialmente los jugadores con participación y goles.
  - https://www.soloascenso.com.ar/club/nautico-hacoaj/501
- Belgrano de Zárate: el plantel publicado para 2026 no coincide exactamente con la lista cargada; revisar las apariciones de cada jugador.
  - https://www.soloascenso.com.ar/club/belgrano-zarate/470
- Provincial de Lobos: la plantilla publicada es bastante más amplia que los 30 cargados; seleccionar por apariciones y minutos.
  - https://www.soloascenso.com.ar/club/provincial-lobos/1076
- Uribelarrea: la plantilla publicada es más amplia que los 30 cargados; revisar apariciones y minutos.
  - https://www.soloascenso.com.ar/club/uribelarrea-futbol-club/1243
- Juventud de Bernal: la plantilla publicada es mucho más amplia que los 28 cargados; el criterio debe seguir siendo participación real, no completar cupos.
  - https://www.soloascenso.com.ar/club/juventud-de-bernal/759
- Estrella de Berisso y Las Mandarinas: falta contrastar todos los registros cargados con las plantillas completas y las planillas 2026.
  - https://www.soloascenso.com.ar/club/estrella-de-berisso/738
  - https://www.soloascenso.com.ar/club/las-mandarinas-brandsen/908

## 3. Correcciones de documentación realizadas

- README: corregido el total erróneo de 474 a 504.
- Test: corregido el mensaje final que informaba 474 aunque validaba 504.
- No se han modificado todavía los 504 registros de jugadores. Evité corregir o borrar homónimos basándome únicamente en coincidencias de nombres.

## 4. Pendiente para cerrar la auditoría

1. Completar el contraste de Alumni, Atlético Pilar, Buenos Aires City y Control Orientado.
2. Para los 17 clubes, seleccionar XI y suplentes importantes a partir de planillas y apariciones de 2026, no de plantillas de años anteriores.
3. Resolver nombres repetidos entre clubes mediante edad, perfil y planillas.
4. Corregir posiciones generales y asignar roles específicos sólo con evidencia.
5. Verificar nacionalidades y banderas; hoy los metadatos de estos 17 clubes no contienen fuentes de nacionalidad.
6. Revisar dorsales: conservar como oficiales sólo los que tengan respaldo; los demás deben quedar identificados como internos/provisionales.
7. Afinar ratings: evitar que toda la división quede reducida a tres medias (41, 42 y 43) sin diferenciación por rendimiento.
8. Reimportar y validar el runtime, verificando que las demás divisiones no cambien.

**Conclusión:** la estructura técnica de los 504 registros está bien, pero la auditoría deportiva y de identidad no está terminada. No marcar la Promocional Amateur 2026 como cerrada hasta completar estos puntos.
