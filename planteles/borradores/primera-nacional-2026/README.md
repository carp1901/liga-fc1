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
- Se detectaron duplicados provisionales en Midland: 13, 15 y 16. Se mantienen señalados hasta contrastar la numeración oficial; no se presentan como confirmados.
- Medias: 1.006 valores cargados, rango 48–66; 68 jugadores tienen media 60 (6,8%). Ninguna media cuenta todavía con OVR individual EA FC verificado: todas son estimaciones y deben revisarse.

## Próximas tareas
1. Roles específicos cargados para los 1.006 jugadores; 44 estimaciones orientativas quedan señaladas para validar o corregir en auditoría.
2. Verificar dorsales oficiales y resolver conflictos sin inventar numeración.
3. Revisar medias y atributos individuales; separar OVR documentado de estimaciones.
4. Depurar planteles y comprobar nóminas de Primera Nacional 2026.
5. Ejecutar validaciones estructurales e integradas contra la división `ar2`.
6. Recién entonces preparar la integración al juego.

La Primera División no forma parte de este trabajo ni debe modificarse durante esta etapa.
