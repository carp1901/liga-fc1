# Primera Nacional 2026 — borradores de trabajo

Estos seis CSV y `progreso.json` se publican en `main` como material de investigación y continuidad del trabajo.

**No están integrados en el juego ni reemplazan `public/squads.json` o `public/squads-meta.json`.** No importar estos archivos al motor todavía.

## Estado de esta versión
- 36 clubes distribuidos en seis bloques.
- 1.006 registros de jugadores en la base de trabajo.
- 1.006/1.006 roles específicos cargados (100%); 44 asignaciones orientativas fueron estimadas y quedan señaladas para revisión en la auditoría.
- Cuatro dorsales de Midland contrastados en varias planillas de partidos 2026; el resto sigue asignado internamente. No se presentan como numeración oficial de plantel.
- Los 44 subroles que faltaban se completaron con estimaciones orientativas a pedido del usuario; están identificados en `fuente_rol` y deben revisarse en la auditoría.
- Medias: hay estimaciones identificadas; deben continuar contrastándose con referencias individuales.
- Ningún club se considera completo bajo el criterio integral.
- Revisión adicional publicada: correcciones de nombres y posiciones, además de asignaciones de subroles respaldadas por perfiles y estadísticas de la temporada 2026.

## Auditoría en curso — primera pasada
- Validación estructural: 36 clubes, 1.006 jugadores y ningún campo obligatorio vacío.
- Dorsales: 1.002 números son asignaciones internas; sólo cuatro están contrastados en planillas de partidos. No equivalen a dorsales oficiales de plantel.
- Auditoría de duplicados: se corrigieron los tres conflictos internos de Midland. Tomás Muia pasó al 34, Facundo Marín al 35 y Gonzalo Gómez al 36; los cuatro dorsales respaldados por planillas se preservaron. No hay duplicados en la base tras la corrección, pero la numeración de plantel sigue sin estar oficialmente verificada para la mayoría.
- Medias: 1.006 valores cargados, rango 48–66 y promedio 58,46; 68 jugadores tienen media 60 (6,8%). No se buscan OVR individuales EA FC para esta división porque EA FC no cubre estos planteles. Las medias son estimaciones y se revisarán por coherencia competitiva; el ajuste general de +10 para Primera y Primera Nacional queda reservado para después de la auditoría.

- Revisión general de medias: promedio 58,46 (rango 48–66); los promedios por club van de 57,00 a 62,08. Godoy Cruz (62,08) y Defensores de Belgrano (60,00) son los únicos promedios de club en 60 o más. Se hicieron cinco correcciones individuales moderadas; el aumento general de +10 para Primera y Primera Nacional queda para después de cerrar la auditoría.
- Revisión individual de medias: ajustes moderados para Thiago Ocampo (58), Joel Orlando (58), Ezequiel Cardozo (57), Juan Pablo De La Reta (57), Enzo Wattier (57), Ignacio Rodríguez (58), Mirko Bonfigli (61) y Mario Sanabria (59), respaldados por participación y estadísticas 2026. También se corrigieron los nombres Joaquín Orlando → Joel Orlando y Enzo Wuattier → Enzo Wattier. El promedio general actualizado es 58,46.
- Nueva ronda: Mirko Bonfigli subió de 56 a 61 (36 partidos, 24 titularidades, 2.830 minutos, 7 goles y 2 asistencias); Mario Sanabria de 56 a 59 (35 partidos, 22 titularidades, 2.057 minutos, 1 gol y 5 asistencias). Se corrigieron también roles mal clasificados: Elías Ocampo a MD, Facundo Montiel a MO, Luciano Viano a LI/DEF, Iñaki Larthirigoyen a EI y Mario Sanabria a EI. Los casos con apariciones altas pero pocos minutos siguen sin recibir aumentos automáticos.
- Hay 391 jugadores con presencias 2026 cargadas y ningún rating de partido individual en los CSV; no se deben confundir las medias propias con valoraciones oficiales de EA FC.
- No se buscan OVR EA FC individuales para Primera Nacional porque el juego no cubre esta categoría. Los ocho campos técnicos de atributos (`pas`, `ctl`, `reg`, `rem`, `des`, `mar`, `ant`, `ref`) estaban vacíos en los 1.006 registros; se completaron el 08/11/2026 mediante perfiles por posición, subrol y media.

## Próximas tareas
1. Roles específicos cargados para los 1.006 jugadores; 44 estimaciones orientativas quedan señaladas para validar o corregir en auditoría.
2. Contrastar dorsales oficiales cuando existan nóminas completas; los números restantes siguen siendo provisionales.
3. Revisar medias y atributos individuales; separar OVR documentado de estimaciones.
4. Depurar planteles y comprobar nóminas de Primera Nacional 2026.
5. Ejecutar validaciones estructurales e integradas contra la división `ar2`.
6. Recién entonces preparar la integración al juego.

La Primera División no forma parte de este trabajo ni debe modificarse durante esta etapa.

- Nueva revisión cualitativa: Dylan Argüello (Atlanta) 54→56 (27 partidos, 1.742 minutos); Román Zalazar (Nueva Chicago) 54→56 (23 partidos, 20 titularidades, 1.360 minutos); Alan Cisnero (San Martín Tucumán) 55→56 (24 presencias, 18 titularidades, 2 goles); Luca Arfaras (San Martín Tucumán) 52→56 (21 partidos, 16 titularidades, 1.171 minutos, 3 goles y 1 asistencia); Leonel Pollacchi (San Telmo) 56→59 (33 partidos, 31 titularidades, 2.688 minutos). Las fuentes individuales quedaron registradas en `rating_source` de cada CSV.

- Revisión adicional: Francisco Monticelli (Racing de Córdoba) pasa de EI a MI (interior izquierdo) según FotMob; con 25 partidos, 10 titularidades, 1.079 minutos y 4 asistencias, su media pasa de 56 a 58. Se actualizaron también los conteos de presencias de Alan Cisnero (24) y Luca Arfaras (21) según las fuentes citadas.

- Recuento integral actualizado tras recalcular los seis CSV: promedio exacto 58,4563 (58,46 redondeado); 391 jugadores tienen presencias 2026 cargadas. La auditoría continúa: faltan contrastes de roles estimados, vigencia de planteles, dorsales oficiales y atributos.


## Cierre de auditoría diagnóstica — 07/11/2026

La revisión estructural y de consistencia de los seis bloques queda cerrada. Resultado: 36 clubes, 1.006 jugadores, cero campos obligatorios vacíos, 1.006 roles específicos cargados, 51 roles marcados explícitamente como estimados, 1.006 medias cargadas (promedio 58,46; rango 48–66) y 14 ajustes individuales respaldados por estadísticas de temporada. No hay dorsales duplicados.

**Dorsales:** 1.001 siguen siendo asignaciones internas provisionales; cinco tienen respaldo de planilla (cuatro de Midland y uno de Atlético Rafaela). Se corrigió Enzo Wattier al dorsal 3, confirmado en la planilla del 02/11/2026, y se reparó la mezcla de fuente en Ignacio Rodríguez.

**Pendientes:** verificar los 1.001 dorsales provisionales; revalidar la pertenencia actual de los planteles; profundizar la calibración de las medias sin ajuste individual documentado y validar cualitativamente los atributos derivados. No se aplicó el +10 general de medias acordado para Primera y Primera Nacional.

Esta auditoría cierra el control de calidad del material disponible, no significa que los CSV estén integrados al juego ni que todos los datos estimados estén confirmados oficialmente.

## Ajuste general de escala — 08/11/2026

Tras cerrar la auditoría diagnóstica se aplicó el aumento acordado de **+10 puntos** a los 1.006 ratings de los seis bloques. Se agregaron `rating_base` (valor anterior) y `ajuste_rating` (+10) para conservar trazabilidad. Resultado conjunto: promedio 68,46; rango 58–76. Los valores siguen siendo estimaciones propias; el ajuste no las convierte en OVR oficiales ni modifica sus fuentes.

Los seis CSV siguen siendo borradores de investigación: **no están integrados en el juego**. La automatización del repositorio publica únicamente el CSV de Primera División en los archivos de runtime.

## Perfiles de atributos por subrol — 08/11/2026

Se revisó la cobertura de perfiles del motor contra los 1.006 jugadores de Primera Nacional. Se encontraron 60 jugadores cuyos subroles no tenían un ajuste específico: MI, MD, MP y LIB. Se añadieron perfiles diferenciados para esos cuatro códigos en `public/data.js`; los 1.006 subroles ya tienen un perfil aplicable (POR usa su perfil base de arquero).

Los ocho atributos técnicos siguen sin cargarse manualmente en estos CSV. El motor los deriva por posición, subrol y media; por eso este cambio mejora la diferenciación de los valores generados, pero **no equivale a estadísticas individuales verificadas**. Se incorporó `test-plantel-calibration.js` al flujo de validación para comprobar que los siete CSV mantengan el +10 trazable y que todos los subroles tengan perfil.


## Atributos técnicos cargados — 08/11/2026

Se completaron los ocho atributos técnicos en los seis CSV: **1.006/1.006 jugadores** con pas, ctl, reg, rem, des, mar, ant y ref cargados (8.048 valores). Los valores se derivaron con el mismo generador determinista del motor (public/data.js): perfil de posición general, ajuste por subrol y media individual como referencia; se mantuvo el centrado ponderado de la valoración y los límites del motor. Los atributos son estimaciones coherentes y reproducibles, no estadísticas observadas ni datos oficiales.

La semilla usa club, orden del registro, nombre y posición, por lo que cada perfil es estable mientras esos datos no cambien. Los arqueros reciben un perfil específico y los jugadores de campo conservan valores de arquero mínimos según la regla del motor. No se modificaron ratings, edades, dorsales, roles ni fuentes. Los CSV siguen como borradores y no se importaron al runtime.

**Próximo control:** validar distribuciones por posición/subrol, detectar valores extremos o perfiles incoherentes y después seguir con dorsales oficiales y vigencia de los 36 planteles.


### Control de carga y distribución — 08/11/2026

Se revalidaron los seis archivos después de completar los atributos: 1.006 jugadores, 8.048/8.048 valores presentes y ningún campo técnico vacío. Rango global observado: 15–87. La distribución media por posición conserva la lógica del motor: arqueros con mayor peso en anticipación/reflejos; defensores en marca/anticipación; mediocampistas en pase/control; delanteros en remate/desmarque. Los 15 en atributos de arquero de jugadores de campo son el mínimo deliberado del motor, no datos faltantes. Esta comprobación es estructural y de coherencia por perfil, no una validación estadística individual.


## Auditoría de vigencia — 08/11/2026

Se cruzaron los seis CSV (36 clubes, 1.006 jugadores; corte interno 07/11) con el mercado de pases publicado por Mundo Ascenso. Se detectaron 22 coincidencias de nombres que figuran como bajas pero aún permanecen en el CSV del mismo club, y 62 altas publicadas que no aparecen en el CSV del club de destino. Son candidatos de revisión, no bajas/altas aplicadas automáticamente: falta confirmar cada caso con comunicados oficiales, AFA o fichas actuales. No se modificaron jugadores ni dorsales en esta pasada. La revisión está documentada en [auditoria-vigencia-2026-11-08.md](auditoria-vigencia-2026-11-08.md).

Dorsales: 1.001 asignaciones internas provisionales; cinco con respaldo de planillas de partidos (cuatro de Midland y uno de Atlético de Rafaela). Ninguno se considera todavía parte de una numeración oficial completa de plantel.


### Segunda pasada de vigencia — 08/11/2026
Se contrastaron candidatos de Chacarita, Temperley y Ferro con nóminas actuales y registros de partidos. Juan Cuevas se conserva: aparece en la nómina oficial actual de Chacarita y registra participación 2026. Miguel Mellado y Mateo Acosta siguen como posibles bajas sin confirmación formal. Valentino Werro y Nicolás Molina permanecen en conflicto entre mercado y nómina actual de Temperley. Alejandro Melo es un alta candidata de Temperley con participación documentada el 25/10, pendiente de completar ficha y confirmar continuidad. No se modificaron CSV ni dorsales. Detalle y fuentes: [auditoría de vigencia](auditoria-vigencia-2026-11-08.md).

- **All Boys:** nueva evidencia oficial del 08/11: Matías Nouet, pese a haber sido apartado en junio, integró el banco y entró ante Estudiantes el 02/11; se conserva. Gabriel Ramírez firmó contrato con el club hasta 31/12/2027 según comunicado oficial del 27/06; alta confirmada, pendiente de completar ficha antes de editar el CSV. Detalle en la auditoría de vigencia.


### Cuarta pasada de vigencia — Almagro, Almirante Brown, Atlanta y Atlético de Rafaela
Almagro: Matías Laba y Claudio Salto están respaldados por nóminas 2026 y registros de altas; Facundo De La Vega también aparece en la plantilla y como goleador. El CSV tiene nombres potencialmente confundidos (Cristian Salto / Franco de la Vega), que no se cambian hasta cotejar identidad. Almirante: Joaquín Ibáñez, Santiago Villalba, Julián López y Gonzalo Flores aparecen en nómina actual y/o estadísticas; Luciano/Lucas Pascual y Mariano/Matías Santiago quedan con identidad pendiente. Atlanta: Alejo Dramisino figura oficialmente cedido a Deportivo Riestra, por lo que no se incorpora a Atlanta; Francisco Romero y Franco Cáceres siguen pendientes. Atlético Rafaela: Gabriel Esparza y Matías Morello aparecen en la nómina actual consultada; Juan Ignacio Cavallaro ya está cargado como Juan Cavallaro. No se modificaron CSV ni dorsales. Fuentes y detalle: [auditoría de vigencia](auditoria-vigencia-2026-11-08.md).


### Quinta pasada ampliada — 12 clubes
Se amplió la revisión a Chaco For Ever, Colegiales, Defensores de Belgrano, Deportivo Madryn, Deportivo Morón, Midland, Gimnasia de Jujuy, Güemes, Racing de Córdoba, San Martín SJ, San Miguel y Central Norte. Se confirmaron tres bajas para limpiar posteriormente: Alan Pérez y Jonathan Dellarossa (Defensores), Gastón Espósito (Güemes). Se descartaron varias alertas de baja porque los jugadores siguen en nóminas actuales: Santiago Villalba, Jorge Zules Caicedo, Gonzalo Baglivo, Pío Bonacci, Facundo Ospitaleche, Tomás Ramírez, Matteo Cucinotta, Gonzalo Gómez, Ricardo Centurión y Leandro Córdoba. Altas respaldadas pendientes de ficha: Nicolás Morro, Leonardo Marinucci, Nahuel Sandrone y Cristian Vega. También aparecieron conflictos de nombres/identidad que deben resolverse antes de duplicar o renombrar jugadores. No se editaron CSV en esta pasada. Detalle y fuentes: [auditoría de vigencia](auditoria-vigencia-2026-11-08.md).


### Sexta pasada ampliada — 11 clubes
Se revisaron Acassuso, Agropecuario, Ciudad de Bolívar, Colón, Godoy Cruz, Los Andes, Nueva Chicago, Patronato, San Martín de Tucumán, San Telmo y Tristán Suárez. Se respaldaron diez altas ausentes del CSV y un candidato adicional (Fabricio Oviedo) sigue pendiente de identidad; se detectaron siete conflictos de identidad/nombre que no deben producir duplicados. Milton Ríos pertenece al plantel 2026, aunque su salida para 2027 fue anunciada. No se modificaron CSV ni dorsales. Detalle y fuentes: [auditoría de vigencia](auditoria-vigencia-2026-11-08.md).


## Actualización — cobertura completa y primera depuración (08/11/2026)

- Auditoría de vigencia: **36/36 clubes revisados**. Los hallazgos y fuentes están documentados en auditoria-vigencia-2026-11-08.md.
- Primera depuración aplicada sólo sobre salidas confirmadas: Alan Pérez y Jonathan Dellarossa (Defensores de Belgrano), Gastón Espósito (Güemes).
- Base actual: **1.003 jugadores** en seis CSV. Se preservaron ratings, trazabilidad rating_base / ajuste_rating, atributos técnicos y dorsales.
- Las altas respaldadas siguen pendientes de ficha individual; los conflictos de nombres y dorsales no se resuelven por coincidencia de iniciales ni se crean duplicados.
- Los borradores continúan sin integración al runtime.


## Segunda tanda de depuración — 08/11/2026

- Seis altas con ficha individual incorporadas: Valentín Serrano, Manuel Mónaco y Juan Ignacio Quattrocchi (Acassuso); Enzo Roldán, Facundo Castro e Iván Antúnez (Nueva Chicago).
- Dos identidades corregidas sin duplicar: Agustín González → Alexis González (Los Andes; DOB coincidente) y Facundo García → Franco García (Colón; DOB coincidente).
- Base actual: **1.009 jugadores**. Se mantienen ratings/atributos estimados y documentados; no se modificó runtime.
- Valentín Burgoa descartado como alta de Godoy Cruz por salida a Orense; Nicolás Ortiz de San Telmo sigue pendiente por conflicto de identidad.
- Ver detalle y fuentes en auditoria-vigencia-2026-11-08.md.


### Tercera tanda de depuración — 08/11/2026
Se incorporó a Leonardo Fabián Marinucci en Deportivo Madryn tras completar ficha individual y cotejar su pertenencia al club y participación 2026. Rating y atributos técnicos son estimaciones internas explícitas; dorsal provisional interno. Se dejó pendiente Nicolás Morro por conflicto de pertenencia/participaciones y se descartaron como altas de Racing de Córdoba a Nahuel Sandrone (Racing II) y Cristian Vega (Ciudad de Bolívar). Base: **1.010 jugadores**. Fuentes y criterio en la auditoría de vigencia.


### Cuarta tanda de depuración — Deportivo Maipú — 08/11/2026
Se agregaron siete fichas: Brian Orosco, Diego Agustín Yavante Gaitán, Matías Agustín Leiva, Mateo Ortale, Juan Cruz Arno, Luca Landriel y Agustín Pavón. Se completaron identidad, fecha de nacimiento, posición, rating y ocho atributos; ratings/atributos son estimaciones internas. Dorsales 99 internos provisionales, sin afirmar numeración oficial. Se corrigió el escapado CSV de siete filas anteriores del bloque 5 y se validó que todas las filas de ese bloque tengan 33 columnas. Base general: **1.017 jugadores**. Detalle y fuentes: auditoria-vigencia-2026-11-08.md.
