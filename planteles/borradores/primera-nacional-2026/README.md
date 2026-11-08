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
- Medias: 1.006 valores cargados, rango 48–66 y promedio 58,41; 68 jugadores tienen media 60 (6,8%). No se buscan OVR individuales EA FC para esta división porque EA FC no cubre estos planteles. Las medias son estimaciones y se revisarán por coherencia competitiva; el ajuste general de +10 para Primera y Primera Nacional queda reservado para después de la auditoría.

- Revisión general de medias: promedio 58,43 (rango 48–66); los promedios por club van de 57,00 a 62,08. Godoy Cruz (62,08) y Defensores de Belgrano (60,00) son los únicos promedios de club en 60 o más. No se ajustan valores todavía: el aumento general de +10 para Primera y Primera Nacional queda para después de cerrar la auditoría.
- Revisión individual de medias: ajustes moderados para Thiago Ocampo (58), Joel Orlando (58), Ezequiel Cardozo (57), Juan Pablo De La Reta (57) y Enzo Wattier (57), respaldados por participación y estadísticas 2026. También se corrigieron los nombres Joaquín Orlando → Joel Orlando y Enzo Wuattier → Enzo Wattier. El promedio general actualizado es 58,43.
- Hay 397 jugadores con presencias 2026 cargadas y ningún rating de partido individual en los CSV; no se deben confundir las medias propias con valoraciones oficiales de EA FC.
- No se buscan OVR EA FC individuales para Primera Nacional porque el juego no cubre esta categoría. Los ocho campos técnicos de atributos (`pas`, `ctl`, `reg`, `rem`, `des`, `mar`, `ant`, `ref`) están vacíos en los 1.006 registros y se auditarán en la etapa siguiente.

## Próximas tareas
1. Roles específicos cargados para los 1.006 jugadores; 44 estimaciones orientativas quedan señaladas para validar o corregir en auditoría.
2. Contrastar dorsales oficiales cuando existan nóminas completas; los números restantes siguen siendo provisionales.
3. Revisar medias y atributos individuales; separar OVR documentado de estimaciones.
4. Depurar planteles y comprobar nóminas de Primera Nacional 2026.
5. Ejecutar validaciones estructurales e integradas contra la división `ar2`.
6. Recién entonces preparar la integración al juego.

La Primera División no forma parte de este trabajo ni debe modificarse durante esta etapa.
