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
