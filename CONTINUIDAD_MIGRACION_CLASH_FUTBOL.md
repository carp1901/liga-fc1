# Informe de continuidad — CLASH FUTBOL (para una sesión nueva)

## Contexto
> Generado el 27/11/2026 en la rama `ccr-5be3077b-nafczt`.
Verificación final de solo lectura después de que pausaste las publicaciones automáticas, y traspaso del trabajo a una sesión nueva. No se modificó código, datos, ramas ni producción. Este informe es el punto de partida de la próxima sesión.

## 1. Verificación de la pausa de publicaciones (27/11)

| Control | Resultado | Evidencia |
|---|---|---|
| Workflow de GitHub «Deploy CLASH FUTBOL Worker to Cloudflare» | **Desactivado** (`disabled_manually`; actualizado el 26/11 21:17 −03) | API de GitHub (comprobado) |
| Ejecuciones nuevas del workflow | **Ninguna.** Siguen siendo 20; la última es la n.º 20 (26/11 20:20:49 UTC, `405809d`) | API de GitHub (comprobado) |
| Worker `clash-futbol-edge` | **Sin publicaciones nuevas.** Fecha de modificación sin cambios (`2026-11-26T20:22:25Z`) | API de Cloudflare (comprobado) |
| Rama `cloudflare-workers-backend` | **Sin commits nuevos.** Sigue en `bfba562` | `git ls-remote` (comprobado) |
| Checks del PR #91 | Solo los 2 anteriores (Workers Builds 20:22 y Pages 20:21); ninguno nuevo | API de GitHub (comprobado) |
| Ajustes de Cloudflare (`versions upload` en Workers Builds; despliegues automáticos de Pages pausados) | **No verificable con mis herramientas**: no exponen la configuración de builds. No hubo pushes desde el cambio, así que la configuración todavía no se puso a prueba | Inferido; confirmalo en el panel o con un push de prueba |

## 2. Otra sesión de Claude (`session_0115xjpC4RnsJuBAMipTghJJ`)
- **Comprobado:** está inactiva (`IDLE`) y desconectada. Su última actividad fue el 26/11 a las 20:23:27 UTC, justo después de su último push (`bfba562`). Su estado dice «review_ready» y su último mensaje propone «pulir las pelotas paradas».
- **Comprobado:** la cuenta no tiene tareas programadas activas que puedan reactivarla.
- **Riesgo:** si alguien la retoma, puede volver a hacer push a `cloudflare-workers-backend`. Ya no publicaría por el workflow, pero sí generaría versiones en Workers Builds. Conviene **archivarla** o indicarle que no toque esa rama.

## 3. Estado de ramas, commits y archivos

**Ramas:**
- `main`: `475fbf6`, sin cambios. Su historia fue reescrita, así que 6 de los 7 PR abiertos no tienen historia en común con ella.
- **Rama de trabajo** `ccr-5be3077b-nafczt`: `d390f59`, subida al remoto. Commits por encima de `main`:
  1. `77ccd2d`: corrección de sustituciones (con `test-sustituciones.js`).
  2. `c6f6f7d`: SD+DC en formaciones de dos puntas.
  3. `d390f59`: `AUDITORIA_MAESTRA_CLASH_FUTBOL.md` y `planteles/auditoria-general-posiciones-2026.md`.
- **Sin commit:** `planteles/rescate-datos-pr79-pr86.md` (informe de rescate; esperaba tu autorización para subirlo).
- **Remotos:** 98 ramas. PR abiertos: #91 (contiene al #89, al #90 y al `main` actual), #89, #90, #79, #86, #77 y #5.

## 4. Decisiones confirmadas
- **Migración:** Cloudflare Pages + Workers + Neon mediante el #91, dividido en P2 (motor), P1 (Worker) y P3 (datos). **Render ya no se usa.**
- **Mínimos (reemplazan todos los de 10):**
  - Salas públicas: **8 jugadores humanos.**
  - Partida aleatoria: **8 jugadores humanos.**
  - Mata-mata y ligas: **8 equipos** para puntuar en el ranking.
  - Debe aplicarse igual en cliente, servidor, Worker, motor, ranking, textos y tests.
- **Dueño del chat:** identificador de usuario inmutable, nunca un nombre. **No asumir que la cuenta «burzaco» de Neon te pertenece.**
- **Dorsales no oficiales:** quedan vacíos; no se inventan.
- **SD+DC** en todas las formaciones de dos puntas. `test-auto-xi` no se debilita.
- **Federal A:** 37 clubes (Estudiantes de San Luis queda fuera).
- **Calibración 155/156:** pendiente de tu decisión (es Lozada Echenique, de All Boys).
- **PR superados a cerrar más adelante:** #77, #5, #79, #86 y, cuando P1 los reemplace, #89 y #90.

## 5. Estado comprobado de producción
- **Worker** `clash-futbol-edge`: versión activa del 26/11 20:22 (inferido: el código de `bfba562`). Sin URL pública propia. Corre con `SERVER_2D` activado y el dueño del chat por nombre (`"Burzaco"`), según el código de esa rama.
- **Pages** `clash-futbol`: rama de producción `cloudflare-workers-backend` (inferido de la guía de la rama). No se pudo comprobar desde este entorno si el sitio responde.
- **Neon** `clash-futbol-db` (`falling-mountain-37997500`): 2 usuarios, 1 sesión y 1 mensaje; ninguna carrera ni título.
- **Configuración pendiente:**
  - Secreto con el id del dueño (nuevo).
  - Confirmar el vínculo `CLASH_API` en Pages y si `DATABASE_URL` está cargado en el Worker.
  - Definir el dominio.

## 6. Próxima tarea (requiere tu autorización)
**P2 · Motor**, en una rama nueva sobre `main`:
1. Las dos correcciones (`77ccd2d` y `c6f6f7d`) y `test-auto-xi` correcto.
2. Reloj externo (`externalClock`) tomado del #91, sin `SERVER_2D` activado por defecto.
3. Mínimos de 8 en `engine.js`:
   - `rankMin`, `randN`;
   - salas públicas `n<10`;
   - la validación de competitivo (humanos y equipos).
   Idealmente con una sola constante compartida.
4. También a 8 en `server.js` (`offlineRec`), `store.js` (2 consultas del ranking) y `index.html` (4 textos y 3 o más filtros).
5. Tests:
   - nuevo test de participantes humanos contra cantidad de equipos;
   - ajustar `test-random`, `test-abandonos`, `test-clasico` y `test-copa-real`.
6. Verificar con la suite local (`test-sustituciones`, `test-auto-xi`, `test-abandonos`, `test-random` y los demás).

**Después:**
- **P1 · Worker:** sobre P2. Dueño por id, mínimos de 8 en `src/` y tests del Worker, sin publicación automática. Prueba de extremo a extremo con tu cuenta.
- **P3 · Datos:** por el pipeline (E4), incluido el rescate del #79 y el #86.
- **Luego, E1** según la auditoría maestra.

## 7. Documentos de referencia
- `AUDITORIA_MAESTRA_CLASH_FUTBOL.md`: 75 hallazgos, hoja de ruta E0–E6 y decisiones.
- `planteles/auditoria-general-posiciones-2026.md`: auditoría de posiciones.
- `planteles/rescate-datos-pr79-pr86.md` (sin commit):
  - Lugano: Benardoni → Bernardoni, Leonel → Axel Ovejero.
  - Promocional: 19 bajas y 10 altas (Juventud de Bernal).
  - Vaciar los 456 dorsales no oficiales.

## 8. Reglas de trabajo vigentes
- No integrar ni hacer merge sin autorización; no tocar `main`.
- No desplegar.
- No modificar datos fuera del pipeline.
- Diferenciar lo comprobado de lo inferido.
- Ahorrar tokens.

## 9. Riesgos abiertos (resumen)
1. **Configuración de Cloudflare sin probar.** Ni `versions upload` ni la pausa de Pages se pusieron a prueba todavía (no hubo pushes). Confirmar en el panel antes de cualquier push a `cloudflare-workers-backend`.
2. **La otra sesión** (`session_0115xjpC4RnsJuBAMipTghJJ`) puede retomarse y hacer push a esa rama. Archivarla.
3. **Producción corre código sin revisar.** En el Worker: dueño del chat por nombre, `SERVER_2D` activado y mínimos de 8 aplicados solo en parte.
4. **6 PR con historia incompatible con `main`:** ninguno se puede fusionar tal cual. Rehacer los cambios útiles; no fusionarlos.
5. **El #89 y el #91 debilitan `test-auto-xi`:** revertirlo en P2 y P1.
6. **El #91 incluye `squads.*` regenerados:** no incorporarlos (van por el pipeline, P3).
7. **Riesgos críticos de la auditoría maestra todavía abiertos:** SEG-01/02 (chat), GUA-01 (guardados), SRV-01/02 y SEG-03.

## 10. Prompt para iniciar la nueva sesión

```text
Continuamos el trabajo de CLASH FUTBOL (repo carp1901/liga-fc1). Antes de hacer nada, leé completos:
1. CONTINUIDAD_MIGRACION_CLASH_FUTBOL.md (estado, decisiones y orden de trabajo)
2. AUDITORIA_MAESTRA_CLASH_FUTBOL.md (75 hallazgos, hoja de ruta E0–E6)
3. planteles/rescate-datos-pr79-pr86.md (datos a aplicar más adelante, en P3/E4)
Están en la rama ccr-5be3077b-nafczt; el informe de continuidad y el de rescate pueden estar sin commit.

Contexto clave:
- Infraestructura: Cloudflare Pages + Workers + Neon. Render ya no se usa.
- Las publicaciones automáticas de la rama cloudflare-workers-backend están pausadas: workflow de GitHub desactivado, Worker con "npx wrangler versions upload" y despliegues automáticos de Pages pausados. No hagas push a esa rama ni despliegues.
- main (475fbf6) fue reescrito: 6 de los 7 PR abiertos (#89, #90, #79, #86, #77, #5) no tienen historia en común con main y no se pueden fusionar. El #91 contiene al #89, al #90 y al main actual.

Decisiones confirmadas (respetalas siempre):
- Mínimo 8 jugadores humanos para salas públicas y partida aleatoria; mínimo 8 equipos para que mata-mata y ligas sumen al ranking. Reemplaza todos los mínimos de 10 en cliente, servidor, Worker, motor, ranking, textos y tests. No confundir participantes humanos con equipos.
- Dueño del chat por identificador de usuario inmutable, nunca por nombre. No asumir que la cuenta "burzaco" de Neon pertenece al dueño.
- Dorsales no oficiales: vacíos; no inventar.
- SD+DC en todas las formaciones de dos puntas; no debilitar test-auto-xi.
- Federal A: 37 clubes. Calibración 155/156 (Lozada Echenique): pendiente de decisión.
- No alterar reglas futbolísticas, datos reales de planteles ni la calibración del motor.

Tarea siguiente: P2 · Motor, en una rama nueva creada desde main, con:
- las correcciones 77ccd2d (sustituciones) y c6f6f7d (SD+DC) de ccr-5be3077b-nafczt, y test-auto-xi en su versión correcta;
- el reloj externo (externalClock) tomado del PR #91, sin SERVER_2D activado por defecto;
- los mínimos de 8 en engine.js (rankMin, randN, salas públicas, competitivo), server.js (offlineRec), store.js (consultas de ranking) e index.html (textos y filtros), idealmente con una constante compartida;
- un test nuevo que distinga participantes humanos de cantidad de equipos, y el ajuste de test-random, test-abandonos, test-clasico y test-copa-real;
- verificación con la suite local.
Después: P1 (Worker, dueño por id, mínimos de 8 en src/, sin publicación automática), P3 (datos por el pipeline) y luego la etapa E1 de la auditoría maestra.

Reglas: no hacer merge a main, no desplegar, no cerrar PR, no modificar datos fuera del pipeline y no hacer commits ni push sin mi autorización explícita. Diferenciá lo comprobado de lo inferido. Ahorrá tokens. Antes de implementar, confirmame el plan de P2 y esperá mi autorización.
```
