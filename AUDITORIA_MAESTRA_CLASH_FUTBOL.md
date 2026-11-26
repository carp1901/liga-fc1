# AUDITORÍA MAESTRA — CLASH FUTBOL

> Documento central del estado del proyecto. Consolida la primera auditoría técnica, la auditoría de posiciones, los informes de planteles del repositorio y los cambios posteriores. Es la base para trabajar por etapas hasta la publicación.
>
> - **Fecha:** 26/11/2026.
> - **Rama:** `ccr-5be3077b-nafczt` (HEAD `c6f6f7d`). **`main`:** `475fbf6`.
> - **Cómo se armó:** solo lectura. No se modificó código, datos ni tests, no se reimportó nada y no se hizo commit ni push.
> - **Estados:** cada uno se volvió a comprobar en el código o con tests el 26/11/2026, salvo donde se indica otra fecha.

---

## 1. Resumen general del estado del juego

**Qué funciona y está comprobado (tests ejecutados el 26/11/2026):**
- Motor de partidos.
- 2D sin valores NaN y con orientación correcta.
- Sustituciones en pleno partido (corregidas en esta rama).
- Formaciones SD+DC (corregidas en esta rama).
- Abandonos y reemplazos online.
- Carrera, desarrollo y regens con guardado y carga a nivel motor.
- Copa real, penales, clásicos y pelotas paradas del motor.
- Integridad de los CSV de B Metro, Primera C, Promocional y Federal A (tandas 1, 2 y 4).
- Auditorías de equilibrio de 60 temporadas (última corrida tras `c6f6f7d`, sin errores).

**Qué impide publicar con tranquilidad:**
1. **Seguridad del chat y de los rankings.** El dueño del chat se identifica por un nombre que cualquiera podría registrar. Los moderadores pueden sancionar al dueño. Los rankings se pueden inflar con datos inventados y los límites por IP se esquivan con un encabezado.
2. **Pérdida de carreras.** Una carrera realista argentina ocupa ~3,6 M de caracteres y no entran dos en el almacenamiento del navegador.
3. **Estabilidad del servidor.** Con 60 pedidos sin cuenta se llena el servidor. El lector de pedidos responde mal ante errores y rompe los acentos.
4. **Rendimiento en móvil.** La carga inicial es de 3,2 MB sin compresión (16,8 s en un Android emulado con red lenta). El online envía ~55 KB por segundo y por jugador, y el cierre de temporada congela la pantalla ~11 s.
5. **Calidad de datos de planteles:**
   - El importador descarta las posiciones secundarias.
   - 1.357 jugadores de Primera C y Promocional no tienen puesto específico.
   - 199 jugadores de Federal A tienen puestos aplanados.
   - Hay 39 errores de posición confirmados y 21 nombres sospechosos.
6. **Tests y CI.** `npm test` está roto desde la primera línea. Fallan 8 tests rápidos y el servidor y la base de datos no tienen ningún test.
7. **Trabajo divergente.** 7 PR abiertos sin integrar tocan estos mismos problemas: tráfico SSE, migración a Cloudflare/Neon, Primera C y Promocional. Las 2 correcciones verificadas de esta rama tampoco están en `main`.

### Problemas abiertos por área y gravedad

| # | Área | Crítica | Alta | Media | Baja | Total |
|---|---|---:|---:|---:|---:|---:|
| 1 | Rendimiento y optimización (REN) | 0 | 3 | 2 | 2 | 7 |
| 2 | Servidor y online (SRV) | 0 | 2 | 5 | 2 | 9 |
| 3 | Seguridad y anti-trampas (SEG) | 2 | 4 | 1 | 0 | 7 |
| 4 | Planteles (PLA) | 0 | 4 | 12 | 4 | 20 |
| 5 | Importadores y sincronización (IMP) | 0 | 2 | 2 | 1 | 5 |
| 6 | Motor, formaciones, valoración e IA (MOT) | 0 | 0 | 3 | 2 | 5 |
| 7 | Modo realista y temporadas (REA) | 0 | 0 | 1 | 2 | 3 |
| 8 | Personalizado y torneos (TOR) | 0 | 0 | 2 | 0 | 2 |
| 9 | Rankings, perfiles, chat (SOC) | 0 | 0 | 0 | 1 | 1 |
| 10 | Interfaz y Android (UI) | 0 | 2 | 1 | 1 | 4 |
| 11 | Guardados y base de datos (GUA) | 1 | 0 | 2 | 0 | 3 |
| 12 | Tests, CI y mantenimiento (TST) | 0 | 2 | 4 | 3 | 9 |
| | **Total abiertos** | **3** | **19** | **35** | **18** | **75** |

Además: **2 resueltos** (sección 5) y **2 descartados** (sección 6.2).

Por estado:
- **57 confirmados.**
- **15 pendientes de verificar.**
- **3 en curso:** trabajo en PR sin integrar. Otros 3 confirmados tienen una solución parcial en un PR abierto, indicada en cada ficha.

> Varios problemas de seguridad y social (chat, rankings) se cuentan una sola vez en el área donde está la causa. En el área 9 solo se cuenta lo exclusivo de esa área y se remite a SEG/REN.

---

## 2. Fuentes recuperadas y método

| Fuente | Ubicación | Estado |
|---|---|---|
| Primera auditoría técnica general (A1–A5, B1–B10, C1–C15, D) | **No está en el repositorio.** Se escribió en el archivo de plan de la sesión, que luego fue sobrescrito por otros planes. Se reconstruyó desde el registro de la sesión. | Recuperada y reverificada en código y tests (sección 4) |
| Auditoría general de posiciones | `planteles/auditoria-general-posiciones-2026.md` (sin commit) | Incorporada completa (PLA, IMP, MOT) |
| Investigación 155/156 de calibración | Informe de la sesión del 26/11 | Incorporada (PLA-20) |
| Auditoría Federal A | `planteles/auditoria-federal-a-2026-11-11.md` | Incorporada (PLA-14, PLA-15) |
| Auditoría Primera C | `planteles/auditoria-general-primera-c-2026.md` y `planteles/borradores/primera-c-2026/*.md` | Incorporada (PLA-14, PLA-18) |
| Resumen de equilibrio de 60 temporadas | `planteles/auditoria-resumen-60-temporadas.md` y JSON de auditoría | Incorporada (PLA-15/16/17, REA-01) |
| Vigencia de Primera Nacional | `planteles/borradores/primera-nacional-2026/auditoria-vigencia-2026-11-08.md` | Incorporada (PLA-13) |
| Promocional: auditoría ampliada y homónimos | `planteles/borradores/promocional-amateur-2026/*.md` | Incorporada (PLA-19) |
| Historial Git, ramas y PR | `git log`, `git ls-remote` y PR de GitHub #1–#91 | Revisado (sección 6.3) |

**Cómo se verificó cada estado (26/11/2026):**
- Búsquedas en el código actual de la rama.
- 22 tests rápidos ejecutados hoy.
- Para los tests largos, la última corrida en la sesión, con su commit.
- Lectura de los PR abiertos.

**Límites:**
- No se consultó la base de datos de producción ni las variables de entorno del servidor.
- No se probó en un Android real (solo Chromium emulando un Pixel 5).
- Football Manager no es accesible desde este entorno: el proxy responde 403 para FMInside, sortitoutsi, Transfermarkt, BDFA y Sofascore.
- Los PR abiertos no se ejecutaron: su estado es el que declaran.

---

## 3. Problemas críticos y prioritarios (top 12)

| Prioridad | ID | Problema | Por qué primero |
|---:|---|---|---|
| 1 | SEG-01 | Dueño del chat identificado por un nombre que se puede registrar | Toma total de la moderación con un registro; se arregla con poco riesgo |
| 2 | SEG-02 | Moderadores pueden silenciar al dueño y levantar sus sanciones | Mismo código que SEG-01; conviene hacerlos juntos |
| 3 | GUA-01 | Las carreras realistas no entran en `localStorage` | Pérdida de progreso del jugador |
| 4 | SRV-02 | `body()` responde dos veces y rompe el UTF-8 | Respuestas falsas y texto corrupto; base de cualquier otra corrección del servidor |
| 5 | SRV-01 | Saturación de salas sin autenticación | Cualquiera tira el online con 60 pedidos |
| 6 | SEG-03 | `X-Forwarded-For` falsificable | Anula todos los límites por IP; lo necesitan SRV-01 y SEG-05 |
| 7 | TST-01 / TST-06 | `npm test` roto; servidor sin tests | Sin red de seguridad, cada corrección es riesgosa |
| 8 | UI-02 | Versiones de caché desfasadas (se agravó en esta rama) | Los jugadores pueden correr un motor viejo con una interfaz nueva |
| 9 | REN-02 / REN-01 | Sin compresión; online de ~55 KB por segundo y por jugador | Carga lenta y consumo de datos en móviles; el PR #89 ya avanza en esto |
| 10 | REN-03 | Cierre de temporada bloqueante (~11 s) | Riesgo de que el jugador cierre la app durante el cierre |
| 11 | IMP-01 | El importador descarta las posiciones secundarias | Bloquea toda la corrección de secundarias |
| 12 | PLA-03 / PLA-01 | 21 identidades dudosas; 39 errores de posición confirmados | Lo más visible de los datos; las identidades primero |

---

## 4. Listado completo de hallazgos

Formato de cada ficha:
- **Gravedad** y **estado**.
- **Impacto** en el juego.
- **Solución** posible.
- **Dependencias** («depende de» y «bloquea»).
- **Archivos** involucrados.
- **Evidencia** (informe original o comprobación).

### 4.1 Rendimiento y optimización

**REN-01 — El online envía el estado completo en cada tick (~55 KB por jugador)**
- Gravedad: alta · Estado: confirmado. Solución en curso en el PR #89 (borrador, sin integrar y sin pruebas de carga).
- Impacto: ≥3 MB/min por jugador; ~190 MB/h de datos móviles (estimación); parseo y re-render completos cada segundo en Android.
- Solución: deltas por fase y gzip del SSE (es lo que implementa el PR #89; falta validarlo).
- Dependencias: relacionada con REN-04. Bloquea la experiencia móvil online.
- Archivos: `public/engine.js` (`view`, `push`), `server.js` (`/ev`), `public/index.html`.
- Evidencia: primera auditoría B10; medición en memoria (23 KB en `pick`, 53–57 KB en partidos); un cliente recibió 1,87 GB en la prueba de carga; PR #89.

**REN-02 — El servidor no comprime; la carga inicial pesa 3,2 MB**
- Gravedad: alta · Estado: confirmado (comprobado hoy: no hay zlib/gzip en `server.js`).
- Impacto: 16,8 s de carga en Pixel 5 emulado (1,6 Mbps y CPU 4× más lenta). `squads.js` pesa 2,63 MB (161 KB con gzip).
- Solución: gzip/brotli (precomprimido), caché larga con hash; cargar `squads` por división.
- Dependencias: se hace junto con UI-02 y REN-05.
- Archivos: `server.js`, `public/index.html`, `public/squads.js`.
- Evidencia: primera auditoría B6; medición con Playwright.

**REN-03 — El cierre de temporada realista bloquea el hilo principal ~11 s**
- Gravedad: alta · Estado: confirmado en el servidor (11,2 s; 11,7 y 12,6 s en `test-realista`). En Android la cifra de 30–60 s es una **estimación no verificada**.
- Impacto: pantalla congelada y riesgo de que el jugador cierre durante el cierre de temporada.
- Solución: Web Worker o procesamiento en tramos; guardar antes y después.
- Dependencias: bloquea UI-03; relacionado con GUA-01.
- Archivos: `public/engine.js` (`careerClose`), `public/index.html` (`cxLoading`).
- Evidencia: primera auditoría B5.

**REN-04 — `view()` se recalcula por jugador y por espectador en cada tick**
- Gravedad: media · Estado: pendiente de verificar (riesgo de CPU con 60 salas × 60 espectadores; la prueba de carga no terminó).
- Solución: cachear la parte común de la vista por tick.
- Dependencias: va junto con REN-01.
- Archivos: `public/engine.js`.
- Evidencia: primera auditoría C2.

**REN-05 — `squads.js` y `squads.json` duplicados; 237 KB de JS en línea sin caché**
- Gravedad: baja · Estado: confirmado.
- Solución: servir una sola copia y extraer el JS de `index.html`.
- Dependencias: va junto con REN-02.
- Archivos: `public/squads.*`, `public/index.html`.
- Evidencia: primera auditoría D.

**REN-06 — El ranking de técnicos y el perfil público recorren todas las carreras en cada pedido**
- Gravedad: media · Estado: confirmado en código.
- Impacto: crece con los usuarios.
- Solución: caché de corta duración o consultas agregadas.
- Archivos: `store.js` (`rankingTecnicos`, `perfilPublico`).
- Evidencia: primera auditoría C9.

**REN-07 — `UCACHE` de sesiones nunca se purga**
- Gravedad: baja · Estado: confirmado en código.
- Solución: purga periódica y tope de tamaño.
- Archivos: `store.js`.
- Evidencia: primera auditoría C10.

### 4.2 Servidor, conexiones y online

**SRV-01 — `/act` permite crear salas sin límite; 60 pedidos dejan el servidor «lleno»**
- Gravedad: alta · Estado: confirmado (reproducido en un servidor local; hoy no hay `rlOk` en `/act`).
- Impacto: denegación del online con un script trivial.
- Solución: límite por IP real o uid; expirar las salas en `pick` sin SSE a los ~5 min; cupo por creador.
- Dependencias: depende de SEG-03 (IP real).
- Archivos: `server.js`, `public/engine.js` (`act` create).
- Evidencia: primera auditoría B1.

**SRV-02 — `body()` vuelve a llamar al callback ante excepciones y rompe el UTF-8**
- Gravedad: alta · Estado: confirmado (sigue `try{cb(JSON.parse(s))}catch(e){cb(null)}` y `s+=d`).
- Impacto: respuestas «Pedido inválido» falsas; una «ñ» partida entre fragmentos llega como «��».
- Solución: acumular los Buffer, separar el parseo del callback.
- Dependencias: conviene antes de cualquier otro cambio en `server.js`.
- Archivos: `server.js:25`.
- Evidencia: primera auditoría B2 (reproducido con un socket).

**SRV-03 — Espectadores fantasma llenan el cupo de 60 por sala**
- Gravedad: media · Estado: confirmado en código.
- Solución: crear al espectador al conectar el SSE, o expirarlo si no se conecta.
- Archivos: `public/engine.js` (`pubApi0` watch).
- Evidencia: primera auditoría C1.

**SRV-04 — SSE del chat sin límite de conexiones; el cliente de `/ev` no tiene `onerror`**
- Gravedad: media · Estado: confirmado en código.
- Impacto: consumo de memoria; si la sala desaparece, la pantalla queda congelada sin aviso.
- Solución: tope por IP; `onerror` con aviso y vuelta al menú.
- Archivos: `server.js`, `public/index.html`.
- Evidencia: primera auditoría C3.

**SRV-05 — Una sala terminada con alguien conectado nunca se limpia**
- Gravedad: media · Estado: confirmado en código.
- Impacto: ocupa lugar en el tope de 60.
- Solución: expiración por fase `end`.
- Archivos: `server.js` (intervalo de limpieza).
- Evidencia: primera auditoría C8.

**SRV-06 — `uncaughtException` traga todos los errores**
- Gravedad: media · Estado: confirmado en código.
- Impacto: el proceso sigue con salas en estado inconsistente.
- Solución: registrar y aislar el error por sala.
- Archivos: `server.js`.
- Evidencia: primera auditoría C7.

**SRV-07 — URI mal formada da 500; `startsWith(PUB)` acepta directorios hermanos; `.json` sin MIME**
- Gravedad: baja · Estado: confirmado (reproducido; sigue igual hoy).
- Solución: `decodeURIComponent` con try, comprobar `PUB + sep` y agregar el MIME de `.json`.
- Archivos: `server.js:24,110-112`.
- Evidencia: primera auditoría C5 y C6.

**SRV-08 — `setMix()` es estado global modificado por sala**
- Gravedad: baja · Estado: confirmado en código (hoy sin efecto en el servidor).
- Solución: pasar la mezcla por parámetro.
- Archivos: `public/data.js`.
- Evidencia: primera auditoría C14.

**SRV-09 — Migración del backend a Cloudflare Workers/Neon en paralelo**
- Gravedad: media · Estado: en curso (PR #90 y #91 en borrador, sin desplegar).
- Impacto: el PR #91 reimplementa auth, chat, rankings, salas públicas y abandonos. Si avanza, varias fichas de este documento (SEG-01/02/04, GUA-02, SRV-01/03) habrá que verificarlas también en el Worker. Riesgo de doble mantenimiento.
- Pendientes declarados en el PR: prueba de extremo a extremo con `DATABASE_URL`, confirmar `CHAT_OWNER_USERNAME`, varias salas, Android real y pruebas de carga.
- Solución: decidir si la migración es el camino; si lo es, corregir los problemas una sola vez en la arquitectura destino.
- Evidencia: PR #90 y #91.

### 4.3 Seguridad, autenticación y anti-trampas

**SEG-01 — El dueño del chat es quien tenga el usuario `CHAT_OWNER_USERNAME||'Burzaco'`**
- Gravedad: crítica · Estado: confirmado en código (hoy 7 apariciones de `'Burzaco'`). **No se verificó si existe la cuenta en producción.**
- Impacto: si la variable no está definida y la cuenta no existe (base nueva o migración a Neon), cualquiera la registra y obtiene todos los permisos de moderación.
- Solución: identificar al dueño por id; exigir la variable; reservar el nombre.
- Dependencias: va junto con SEG-02. Relacionado con SRV-09 (el PR #91 deja `CHAT_OWNER_USERNAME` pendiente).
- Archivos: `server.js:79-93`, `store.js:290,297`.
- Evidencia: primera auditoría A3.

**SEG-02 — Los moderadores pueden silenciar al dueño y levantar sanciones**
- Gravedad: crítica · Estado: confirmado en código.
- Detalle: `/api/chat/moderar` compara con `CHAT_OWNER_USERNAME||''`, mientras el resto del código usa `'Burzaco'`. «Silenciar» reemplaza una suspensión y «reactivar» borra cualquier sanción.
- Impacto: los moderadores pueden silenciar al dueño y deshacer sus sanciones.
- Solución: un único helper `isOwner`; jerarquía de sanciones.
- Dependencias: va junto con SEG-01.
- Archivos: `server.js:93`, `store.js` (`chatModeracion`).
- Evidencia: primera auditoría A4.

**SEG-03 — Los límites por IP confían en `X-Forwarded-For` tal como llega**
- Gravedad: alta · Estado: confirmado (reproducido: un 429 se esquiva cambiando el encabezado).
- Impacto: anula todos los límites por IP (títulos, registro, login, salas).
- Solución: tomar solo el salto que agrega el proxy conocido (Render/Railway).
- Dependencias: bloquea SRV-01, SEG-05 y SEG-07.
- Archivos: `server.js:14` (`ipOf`).
- Evidencia: primera auditoría A5.

**SEG-04 — Ranking de técnicos falsificable con carreras offline informadas por el cliente**
- Gravedad: alta · Estado: confirmado en código. El PR #91 dice aceptar «únicamente registros offline validados» en el Worker, sin verificar.
- Impacto: hasta 40 puntos por registro y 120 registros por hora.
- Solución: tope diario; separar los rankings «verificados» de los «informados»; peso reducido para el offline.
- Dependencias: depende de una decisión tuya (D-3).
- Archivos: `server.js:67-73`, `store.js` (`rankingTecnicos`).
- Evidencia: primera auditoría A5.

**SEG-05 — Títulos offline sin cuenta, con límite esquivable**
- Gravedad: alta · Estado: confirmado.
- Impacto: el ranking offline de clubes se puede inflar.
- Solución: exigir cuenta; IP real; tope por cuenta.
- Dependencias: depende de SEG-03. También cubre los títulos de torneos personalizados (antes TOR).
- Archivos: `server.js:41-44`, `store.js` (`insert`).
- Evidencia: primera auditoría A5.

**SEG-06 — La elegibilidad de torneos online cuenta `pid` y no cuentas**
- Gravedad: alta · Estado: confirmado en código. El PR #91 cambia el mínimo a 8 participantes, pero no consta que cuente por uid.
- Impacto: un script con 10 `pid` completa un torneo «competitivo».
- Solución: contar uid distintos.
- Archivos: `public/engine.js` (`rankInfo`).
- Evidencia: primera auditoría A5.

**SEG-07 — Límite de login por usuario (20/h) permite bloquear cuentas ajenas**
- Gravedad: media · Estado: confirmado en código.
- Solución: límite por la combinación IP real + usuario, con backoff.
- Dependencias: depende de SEG-03.
- Archivos: `server.js:61`.
- Evidencia: primera auditoría C4.

### 4.4 Planteles (posiciones, nacionalidades, dorsales, nombres, datos)

> Base: `planteles/auditoria-general-posiciones-2026.md`. Se separa lo **confirmado con fuentes**, lo **sospechado** y lo **no verificado**. Las estimaciones se marcan como tales.

**PLA-01 — 39 errores de posición principal confirmados**
- Gravedad: alta · Estado: confirmado. Criterio: el puesto cargado lo contradicen al menos dos fuentes coincidentes.
- Impacto: alineaciones automáticas y perfiles de atributos incorrectos (por ejemplo, Braida cargado como LI cuando es extremo izquierdo).
- Solución: cambio en el CSV y reimportación, con tu autorización.
- Dependencias: depende de IMP-02 (reimportar limpio) y conviene después de PLA-03.
- Archivos: CSV de Primera y de Primera Nacional.
- Evidencia: informe de posiciones, sección D; lista en el Anexo A.

**PLA-02 — 42 cruces de línea dudosos**
- Gravedad: media · Estado: pendiente de verificar. Hay fuentes en conflicto; 19 de estos casos son además de identidad (ver PLA-03).
- Solución: verificar con la ficha FM o la planilla del club.
- Dependencias: depende de PLA-03.
- Evidencia: informe de posiciones, sección F; Anexo B.

**PLA-03 — 21 nombres o identidades sospechosos**
- Gravedad: alta · Estado: pendiente de verificar.
- Detalle: 19 nombres cargados no aparecen en ninguna fuente pero sí uno parecido en el mismo club (por ejemplo, «Alan Bordón» y Axel Bordón, «Facundo Fagúndez» y Franco Fagúndez). A eso se suma «Agustín Miró» (las fuentes lo nombran Alejo Agustín Miró) y el duplicado de Villalba (PLA-04). 18 de los 21 son de Primera Nacional y tienen a `pelotita.com.ar` como fuente.
- Impacto: datos reales de plantel posiblemente erróneos.
- Solución: confirmar la identidad antes de tocar posiciones o nombres.
- Dependencias: bloquea PLA-01 y PLA-02 para esos jugadores.
- Evidencia: informe de posiciones F.1 y D6; Anexo C.

**PLA-04 — Posible jugador duplicado: Santiago Villalba (Chaco For Ever) y Santiago Ariel Villalba (Almirante Brown)**
- Gravedad: media · Estado: pendiente de verificar.
- Detalle: mismo perfil de Soccerway (`Kx3Dkw4r`) y de ESPN (`364831`), los dos con 22 años; estuvo a préstamo en Almirante Brown hasta el 31/12/2025.
- Solución: dejarlo en un solo club tras confirmarlo.
- Archivos: `primera-nacional-2026/bloque2.csv` y `bloque4.csv`.
- Evidencia: informe de posiciones D7.

**PLA-05 — Primera C (839) y Promocional (518) sin puesto específico: 1.357 jugadores**
- Gravedad: alta · Estado: confirmado.
- Impacto: `autoXI` reparte a estos jugadores en LI, ED o MCD sin ningún criterio de puesto.
- Solución: asignar puestos por tandas de clubes, solo con fuente.
- Dependencias: depende de IMP-01, IMP-03 y de tu decisión D-8. Conviene después de integrar o descartar los PR #79 y #86 (PLA-18, PLA-19).
- Archivos: `primera-c-2026/tanda*-inicial.csv`, `promocional-amateur-2026/tanda*-inicial.csv` (Promocional no tiene la columna `rol_especifico`).
- Evidencia: informe de posiciones D2; Anexo 2 de ese informe.

**PLA-06 — Federal A, tanda 4: 199 jugadores de 7 clubes aplanados a DFC, MC o DC**
- Gravedad: alta · Estado: confirmado. Clubes: Gimnasia (CdU), Las Parejas, Vilelas, Argentino de Monte Maíz, Kimberley, Villa Mitre y Sarmiento (R).
- Impacto: ningún lateral, extremo, MCD ni MO; afecta la alineación automática.
- Solución: reasignar el puesto exacto desde la ficha FM27 (la fuente ya citada en el CSV).
- Dependencias: depende de tu decisión D-8 (acceso a FM).
- Archivos: `federal-a-2026-tanda-4/completo.csv`.
- Evidencia: informe de posiciones D3 y Anexo 3; muestra de 10 sin errores de grupo, con 2 nombres dudosos y 1 jugador sin datos.

**PLA-07 — 164 casos de «convención» de grupo: 139 extremos con grupo MED y 25 MO/MP con grupo DEL**
- Gravedad: media · Estado: confirmado (la incoherencia técnica); la posición real de cada jugador está pendiente de verificar.
- Impacto: penalización ×0,8 y atributos de volante en un casillero de delantero (MOT-05).
- Resultado de la muestra de 10: 4 errores confirmados, 5 dudosos (2 de ellos por nombre), 1 posible duplicado y **ningún caso confirmado como bien cargado**. Proyectar a los 154 restantes es solo una **estimación** (entre 49 y 98 errores), no un resultado.
- Solución: revisar uno por uno.
- Dependencias: relacionado con MOT-05 y PLA-08.
- Evidencia: informe de posiciones D4 y Anexo 4.

**PLA-08 — Jugadores marcados para verificación individual que no se verificaron**
- Gravedad: media · Estado: pendiente de verificar.
- **Corrección de cifra:** los «436» que figuran en el informe de posiciones salen de 237 jugadores con grupo incoherente **presentes en el juego** + 199 de la tanda 4. Contando sobre los CSV son 241 + 199 = 440 (4 de los 241 están en el CSV y no en el juego).
- **Se verificaron 97:** los 77 cruces de línea y dos muestras de 10.
- **Quedan 343 sin verificar individualmente** (sobre los CSV): 154 casos de convención y 189 de la tanda 4. No son 436.
- Además, ningún otro jugador de la base (4.811 en total) tiene verificación externa de posición en esta auditoría.
- Solución: completar con fichas FM por club (D-8).
- Evidencia: informe de posiciones, metodología.

**PLA-09 — No hay posiciones secundarias en casi ningún jugador**
- Gravedad: media · Estado: confirmado (solo 3 de 4.811 tienen alguna en el juego, todas «MED»).
- Impacto: el motor no puede usar secundarias.
- Hay 9 secundarias con evidencia listas (informe de posiciones, sección E): Alan Ruiz ED; Jorge Juárez MD y LD; Marcelino Moreno MI; Hernán López Muñoz ED, MC y MO; Darío Sarmiento MO; Joel González ED; Nicolás Herranz MCD; Gonzalo Lucero MI; Ignacio Rodríguez LI.
- Solución: cargar solo las que tengan fuente.
- Dependencias: **depende de IMP-01.** No tiene sentido cargarlas antes de corregir el importador.
- Evidencia: informe de posiciones E y D1.

**PLA-10 — 20 clubes sin lateral izquierdo o sin lateral derecho**
- Gravedad: media · Estado: pendiente de verificar.
- Detalle: Defensa y Justicia (Primera) tiene 0 LI y 0 LD. Tigre y Banfield no tienen LD. Los 7 de la tanda 4 se explican por PLA-06.
- Solución: revisar con el plantel real.
- Evidencia: informe de posiciones F.3.

**PLA-11 — Ituzaingó (B Metro) tiene un solo arquero**
- Gravedad: media · Estado: pendiente de verificar (dato real del plantel).
- Impacto: sin suplente natural para el arco.
- Evidencia: informe de posiciones F.3.

**PLA-12 — Nacionalidades de Federal A inválidas o distintas entre CSV y juego**
- Gravedad: media · Estado: confirmado (hoy fallan `test-federal-a-tanda3` y `test-federal-a-runtime`).
- Detalle: casos en Antoniana, Linqueño, Independiente de Chivilcoy, Escobar y otros; también 8, 20 y 36 diferencias por tanda.
- Solución: corregir con fuente y reimportar.
- Dependencias: depende de IMP-03 y IMP-04.
- Evidencia: primera auditoría (B3/B4); tests ejecutados hoy.

**PLA-13 — Vigencia de Primera Nacional: 22 bajas siguen en el CSV y faltan 62 altas**
- Gravedad: media · Estado: pendiente de verificar (el informe es una cola de contraste, no una depuración cerrada; datos del 08/11).
- Solución: verificar cada caso con fuente oficial y luego reimportar.
- Dependencias: relacionado con PLA-03 y PLA-04.
- Evidencia: `auditoria-vigencia-2026-11-08.md`.

**PLA-14 — Dorsales provisionales o estimados en casi todas las divisiones**
- Gravedad: baja · Estado: confirmado (documentados como estimados, no presentados como oficiales).
- Detalle:
  - Primera Nacional: 1.001 de 1.006 internos.
  - Federal A: 873 estimados.
  - B Metro: 527 estimados.
  - Primera C: estimados.
  - Promocional: secuenciales (el PR #86 los retira).
- Solución: reemplazar solo con planilla o nómina oficial.
- Evidencia: informes de Federal A, vigencia de Primera Nacional, `test-bmetro-draft` y PR #86.

**PLA-15 — Medias mayormente estimadas fuera de Primera**
- Gravedad: media · Estado: confirmado.
- Detalle: Primera Nacional tiene 4,4 % de medias verificadas. Promocional queda reducida a 41, 42 y 43. Primera C y Federal A usan estimaciones propias.
- Impacto: equilibrio dentro de las divisiones de ascenso.
- Solución: calibrar con rendimiento, sin inventar fuentes. No se toca la calibración del motor.
- Evidencia: `auditoria-resumen-60-temporadas.md`, `auditoria-ampliada.md` (Promocional, punto 7).

**PLA-16 — Falta el pie hábil en 2.008 jugadores (Primera y Primera Nacional)**
- Gravedad: baja · Estado: confirmado (no impide simular).
- Evidencia: `auditoria-resumen-60-temporadas.md`.

**PLA-17 — Tamaños de plantel atípicos: Tigre 46, San Lorenzo 40; seis clubes de Primera Nacional con 22–23**
- Gravedad: baja · Estado: pendiente de verificar.
- Evidencia: `auditoria-resumen-60-temporadas.md`.

**PLA-18 — Primera C: `main` tiene 839 jugadores; el PR #79 corrige a 824 (duplicados y nombres)**
- Gravedad: media · Estado: en curso (PR #79 en borrador, con workflow OK según el PR; sin integrar).
- Detalle: en `main` siguen los duplicados Juan Pablo López (Lamadrid y Puerto Nuevo) y Simón Martínez, y los nombres de Lugano sin corregir.
- Solución: revisar e integrar el PR #79.
- Dependencias: bloquea PLA-05 (Primera C).
- Evidencia: PR #79; `auditoria-general-primera-c-2026.md`.

**PLA-19 — Promocional: `main` tiene 518 jugadores; el PR #86 corrige a 509 y la auditoría deportiva no está cerrada**
- Gravedad: media · Estado: en curso (PR #86 en borrador).
- Detalle: homónimos pendientes (Franco González, Franco Barraza); Metalúrgico con la nómina de la temporada correcta; Glew, Everton y Juventud de Bernal.
- Solución: cerrar el PR #86 y la auditoría (puntos 1–8 de `auditoria-ampliada.md`).
- Dependencias: bloquea PLA-05 (Promocional).
- Evidencia: PR #86; `homonimos-pendientes.md`.

**PLA-20 — Calibración 156 contra 155: Cristo Lozada Echenique (All Boys) está en el CSV pero no en el juego**
- Gravedad: baja · Estado: pendiente de verificar (es una decisión tuya: D-7).
- Detalle: es la última fila de `bloque1.csv`, consultada el 16/11, con formato válido. Explica 156 contra 155 y su ausencia en el juego (IMP-04).
- Evidencia: investigación del 26/11; también en IMP-02.

### 4.5 Importadores y sincronización CSV → JSON → motor

**IMP-01 — El importador descarta las posiciones secundarias específicas**
- Gravedad: alta (bloqueante) · Estado: confirmado (hoy sigue `POS[x.trim().toUpperCase()]`).
- Detalle: el mapa `POS` es de grupos, así que LI, ED, SD, DFC, MI y MP se pierden y MC se convierte en MED. Solo separa por `;` o `|`, no por `,`. `roleFit` compara las secundarias contra el puesto exacto, así que nunca coinciden.
- Solución: mapear los puestos específicos del motor, aceptar «,» y validar contra el vocabulario.
- Dependencias: bloquea PLA-09 y el uso de secundarias en PLA-05 y PLA-06.
- Archivos: `import-squads.js`, `public/data.js` (`roleFit`).
- Evidencia: informe de posiciones D1.

**IMP-02 — CSV distinto del juego: Primera Nacional (21/8 + 1) y Federal A (1/1)**
- Gravedad: media · Estado: confirmado.
- Detalle: 21 filas de Primera Nacional no están en el juego (8 de Godoy Cruz, Lozada Echenique…). 8 nombres corregidos en el CSV nunca se reimportaron (Gimnasia y Tiro, Quilmes, Tristán Suárez). Thomas Ortega figura MC en el CSV y LD en el juego. En Federal A, Máximo y Maximiliano Ramos.
- Solución: reimportar desde los CSV (con tu autorización) y agregar un test de sincronización.
- Dependencias: depende de IMP-04.
- Evidencia: informe de posiciones D5.

**IMP-03 — Las nacionalidades de Primera C y Promocional nunca llegan al juego**
- Gravedad: alta · Estado: confirmado.
- Detalle: en Primera C ~537 de 839 y en Promocional ~354 de 518 tienen nacionalidad en el CSV y `undefined` en el juego. Los commits «Completa nacionalidades…» solo tocaron los CSV.
- Solución: un único workflow que regenere todo de forma determinista, más un control que falle ante divergencias.
- Dependencias: depende de IMP-04; relacionado con los PR #79 y #86.
- Archivos: `.github/workflows/validar-planteles.yml`, `test-promocional-amateur-draft.yml`.
- Evidencia: primera auditoría B4.

**IMP-04 — El workflow de publicación queda bloqueado por un test de datos y no regenera el juego**
- Gravedad: media · Estado: confirmado.
- Detalle: `validar-planteles.yml` corre `test-plantel-calibration`, que falla (PLA-20) antes de importar. Tampoco importa Promocional.
- Solución: separar la validación de la publicación y resolver PLA-20.
- Dependencias: bloquea IMP-02 e IMP-03.
- Evidencia: primera auditoría B3/B4; investigación 155/156.

**IMP-05 — Vocabulario de roles inconsistente**
- Gravedad: baja · Estado: confirmado.
- Detalle: ARQ y POR conviven; la columna `rol` mezcla etiquetas genéricas y específicas; aparece MCO; hay tres separadores distintos.
- Solución: normalizar en el importador y documentar el vocabulario.
- Evidencia: informe de posiciones D8.

### 4.6 Motor, formaciones, atributos, valoración e IA

**MOT-03 — Los puestos MP (73 jugadores) y LIB (1) no existen en ninguna formación**
- Gravedad: media · Estado: confirmado.
- Impacto: `roleFit` les da −5 siempre; un mediapunta cargado como MP queda subvalorado frente a un MO (+2,5).
- Solución: tratar MP como MO (o como alternativa) y decidir qué hacer con LIB.
- Dependencias: depende de tu decisión D-4.
- Archivos: `public/data.js` (`roleFit`), `public/sim2d.js` (`RS`).
- Evidencia: informe de posiciones D9.

**MOT-04 — Todos los delanteros se valoran con un único perfil, orientado al DC**
- Gravedad: media · Estado: confirmado en código.
- Impacto: un SD creativo queda subvalorado (caso Alan Ruiz).
- Solución: perfil específico de SD.
- Dependencias: depende de D-5; toca el modelo de valoración.
- Archivos: `public/data.js` (`roleOvr`, `PROFILES`).
- Evidencia: informe de la corrección SD+DC.

**MOT-05 — El grupo del jugador penaliza ×0,8 fuera de su línea y define el perfil de atributos**
- Gravedad: media · Estado: confirmado en código.
- Impacto: amplifica PLA-07 y PLA-01.
- Solución: no requiere cambiar el motor si se corrigen los datos; opcionalmente, derivar el grupo del puesto específico.
- Archivos: `public/data.js` (`autoXI`, `mkAt`).
- Evidencia: informe de posiciones D4.

**MOT-06 — La nivelación online usa el XI en 4-4-2**
- Gravedad: baja · Estado: confirmado (tras SD+DC cambió en Chacarita, −1, e Instituto, −0,67).
- Solución: aceptar el cambio o fijar la referencia.
- Dependencias: depende de D-6.
- Archivos: `public/data.js` (`xiQuality`, `squadN`).
- Evidencia: informe de la corrección SD+DC.

**MOT-07 — El árbitro queda dentro del grupo de jugadores en ~5–7 % de los córners**
- Gravedad: baja · Estado: confirmado.
- Detalle: 5,3 % antes y 6,7 % después de SD+DC, sobre 300 córners; la diferencia está dentro del ruido. Es cosmético.
- Dependencias: relacionado con TST-04.
- Archivos: `public/sim2d.js`.
- Evidencia: informe de la corrección SD+DC.

### 4.7 Modo realista, temporadas, ascensos, descensos y evolución

**REA-01 — El desarrollo individual de jugadores no está validado en las simulaciones de 60 temporadas**
- Gravedad: media · Estado: pendiente de verificar.
- Detalle: el test de 60 temporadas usa `simGame` y no pasa por `developRound`.
- Solución: test multitemporada con desarrollo.
- Evidencia: `auditoria-resumen-60-temporadas.md`, «Límites».

**REA-02 — Tras SD+DC, 23 clubes cambiaron su formación inicial**
- Gravedad: baja · Estado: confirmado (requiere decisión D-6).
- Detalle: el 4-4-2 bajó de 12 a 3 clubes y el 5-3-2 de 38 a 25; subieron el 5-4-1 (de 6 a 17) y el 4-3-1-2 (de 8 a 13). La auditoría de equilibrio posterior no mostró anomalías, aunque es una simulación con azar.
- Evidencia: informe de la corrección SD+DC.

**REA-03 — `copaarg` acepta clubes uruguayos en los títulos informados**
- Gravedad: baja · Estado: confirmado en código.
- Archivos: `server.js` (`offlineRec`).
- Evidencia: primera auditoría C11.

> El cierre de temporada lento está en REN-03 y la pérdida de carreras en GUA-01.

### 4.8 Modo personalizado y torneos

**TOR-01 — Los torneos personalizados no tienen cobertura efectiva de tests**
- Gravedad: media · Estado: confirmado.
- Detalle: `test-custom-tournaments` falla porque intenta compilar el bloque `ld+json` de `index.html`, así que lo que sí prueba (tamaños, byes, carrera Mixta) nunca termina en CI.
- Solución: arreglar el test (filtrar por `type`).
- Dependencias: relacionado con TST-02.
- Evidencia: test ejecutado hoy.

**TOR-02 — No se hizo una auditoría funcional específica del modo personalizado**
- Gravedad: media · Estado: pendiente de verificar.
- Detalle: solo se revisó de forma indirecta: validación de `act create` custom, títulos (SEG-05) y el PR #6 integrado.
- Solución: recorrido funcional y tests de extremo a extremo.

### 4.9 Rankings, perfiles, chat y funciones sociales

**SOC-01 — `perfiles.descripcion` existe pero no hay forma de editarla**
- Gravedad: baja · Estado: confirmado en código.
- Solución: endpoint e interfaz, u ocultar el campo.
- Archivos: `store.js`, `server.js`.
- Evidencia: primera auditoría C12.

> También afectan a esta área: SEG-01 y SEG-02 (moderación), SEG-04, SEG-05 y SEG-06 (integridad de rankings), REN-06 (rendimiento de rankings) y SRV-04 (SSE del chat). Los arreglos de interfaz de rankings y chat de los PR #7–#35 están integrados y son anteriores a la primera auditoría.

### 4.10 Interfaz, experiencia móvil y Android

**UI-01 — Ocho `confirm()` en flujos clave que los WebView pueden bloquear**
- Gravedad: alta · Estado: pendiente de verificar (depende de cómo se distribuye en Android: D-9; el propio código reconoce el problema).
- Flujos afectados: salir del torneo, unirse a una sala pública o vacante, cerrar sala, eliminar comentario, quitar amigo.
- Solución: modal propio o patrón de doble toque (ya usado en el borrado de ranuras).
- Archivos: `public/index.html`.
- Evidencia: primera auditoría B8.

**UI-02 — Las versiones de caché de los scripts no cambian con el código (agravado)**
- Gravedad: alta · Estado: confirmado.
- Detalle: `index.html` se sirve sin caché, pero `engine.js?v=20261111…` y `sim2d.js?v=20261111…` no cambiaron tras los commits 77ccd2d y c6f6f7d, y `data.js` no tiene `?v`.
- Impacto: un jugador puede combinar la interfaz nueva con un motor viejo.
- Solución: hash de contenido generado al publicar.
- Dependencias: va junto con REN-02.
- Evidencia: primera auditoría B7; comprobación de hoy.

**UI-03 — Cierre de temporada sin respuesta en móvil**
- Gravedad: media · Estado: pendiente de verificar en Android real.
- Dependencias: depende de REN-03.

**UI-04 — No se guarda en `pagehide`; el offline solo guarda en `pre`, `lobby` y `end`**
- Gravedad: baja · Estado: confirmado en código.
- Dependencias: relacionado con GUA-01.
- Archivos: `public/index.html`.
- Evidencia: primera auditoría C15.

> Comprobado sin problemas: el menú en Pixel 5 emulado no tiene scroll horizontal ni errores de consola.

### 4.11 Guardados, persistencia y bases de datos

**GUA-01 — Una carrera realista argentina ocupa ~3,6 M de caracteres y no entran dos en `localStorage`**
- Gravedad: crítica · Estado: confirmado.
- Detalle: medido en Chromium; la cuota está entre 4,9 y 5,3 M de caracteres. Las 3 ranuras van en una sola clave.
- Impacto: con una segunda carrera realista, los guardados fallan y el progreso se pierde al cerrar.
- Solución: una clave por ranura, sin los planteles base (solo el diff), IndexedDB, compresión y respaldo.
- Dependencias: relacionado con REN-03 y UI-04.
- Archivos: `public/index.html` (`careerSave`, `careerPut`), `public/engine.js` (`snapshot`).
- Evidencia: primera auditoría A2.

**GUA-02 — Los bloqueos por abandono no se guardan en la base: `store.abandono` no existe**
- Gravedad: media · Estado: confirmado (hoy 0 apariciones en `store.js`). En curso en el PR #91, en el Worker.
- Impacto: se pierden en cada reinicio o despliegue.
- Solución: tabla `abandonos` y `store.abandono`.
- Archivos: `server.js:7`, `store.js`.
- Evidencia: primera auditoría B9.

**GUA-03 — Estado de producción desconocido**
- Gravedad: media · Estado: pendiente de verificar.
- Detalle: no se consultó qué base usa el servicio público (Railway, según `store.js`; Neon, según el PR #91), si existe la cuenta del dueño, si `CHAT_OWNER_USERNAME` está definida, ni su versión desplegada (el PR #79 menciona Render).
- Solución: inventario de producción con tu acceso.
- Dependencias: condiciona la gravedad real de SEG-01.

### 4.12 Tests, GitHub Actions, workflows y mantenimiento

**TST-01 — `npm test` falla en la primera línea**
- Gravedad: alta · Estado: confirmado hoy.
- Detalle: `test.js` tiene saltos de línea literales dentro de un string y además necesita un servidor levantado.
- Solución: arreglar el string y separar la prueba de carga de `npm test`.

**TST-02 — Tests desactualizados o con errores propios**
- Gravedad: media · Estado: confirmado hoy.
- Detalle:
  - `test-custom-tournaments`: compila el bloque `ld+json`.
  - `test-ui`: el DOM simulado no tiene `classList.toggle`.
  - `test-pre`: supone una estructura vieja.
  - `test-copa`: incluye clubes uruguayos.
  - `test-offline`: no envía la acción `rivals`.
  - `test-realista`: espera Federal A con 38 clubes y 171 en total. **El 37 está decidido; hay que corregir el test**, no los datos. Última corrida antes de c6f6f7d.
- Solución: corregir cada test sin tocar el comportamiento del motor.

**TST-03 — Tests que fallan por datos**
- Gravedad: media · Estado: confirmado hoy.
- Detalle: `test-plantel-calibration` (156 contra 155, decisión D-7), `test-federal-a-tanda3` y `test-federal-a-runtime` (nacionalidades, PLA-12).
- Solución: resolver PLA-12 y PLA-20.
- Dependencias: depende de PLA-12 y PLA-20; bloquea IMP-04.

**TST-04 — `test-pelotas-paradas-2d` falla en 1 de 24 córners tras SD+DC**
- Gravedad: baja · Estado: confirmado.
- Detalle: el umbral ya estaba al límite antes (45,9 contra 45). No es una regresión estadística (MOT-07).
- Solución: criterio estadístico en el test, o ajustar la ubicación del árbitro.

**TST-05 — `test-random` es inestable**
- Gravedad: baja · Estado: confirmado.
- Detalle: falló 1 vez en paralelo y pasó 2 de 2 en secuencia; depende de tiempos.
- Solución: no depender del tiempo real.

**TST-06 — `server.js` y `store.js` no tienen ningún test**
- Gravedad: alta · Estado: confirmado.
- Detalle: sin cobertura de auth, chat, moderación, rankings, títulos, límites ni `body()`.
- Solución: tests HTTP con base simulada (`store.init({pool})` ya lo permite).
- Dependencias: necesario antes de E1 y E3.

**TST-07 — Workflows que hacen push solos**
- Gravedad: media · Estado: confirmado en código.
- Detalle: `balance.yml` y `validar-planteles.yml` hacen commit directo a `main`. `descargar-escudos-uruguay.yml` corre en cualquier rama y hace `pull --rebase origin main`. Varios tienen `contents: write` en PR.
- Solución: CI de solo lectura y publicación por PR.
- Dependencias: depende de D-10.

**TST-08 — Los tests nuevos no están en CI**
- Gravedad: media · Estado: confirmado.
- Detalle: `test-sustituciones`, abandonos, random, realista, penales, clásico y pelotas paradas no corren en ningún workflow.
- Solución: un workflow de CI rápido en cada PR.

**TST-09 — No hay linter**
- Gravedad: baja · Estado: confirmado.
- Detalle: `eslint` con `no-undef` habría detectado el error de las sustituciones.
- Solución: agregarlo en CI.

---

## 5. Problemas ya resueltos

| ID | Problema | Commit | Comprobación | Advertencia |
|---|---|---|---|---|
| MOT-01 | Sustituciones en pleno partido: `ReferenceError` (`m.subIn`), contador sin sumar, se superaba el límite de 5 y el HTTP respondía «Pedido inválido» | `77ccd2d` | `test-sustituciones.js`: 31/31 OK, también hoy; antes de la corrección fallaba en 6 puntos | **Solo en la rama `ccr-5be3077b-nafczt`, no en `main`.** No está en CI (TST-08). En el navegador también pesa UI-02 (caché) |
| MOT-02 | Formaciones de dos puntas: dos DC en lugar de SD + DC (4-4-2, 3-5-2, 5-3-2, 4-2-2-2, 4-3-1-2) | `c6f6f7d` | `test-auto-xi` OK hoy; ninguna formación con dos DC | **Solo en la rama.** Efectos laterales documentados: REA-02, MOT-06, TST-04 |

Resueltos antes de la primera auditoría e integrados en `main`: correcciones de rankings, chat, navegación y caché (PR #7–#35); nacionalidad opcional en planteles (PR #61); error de sintaxis en `store.js` (PR #22). La primera auditoría ya partió de ese estado.

---

## 6. Pendientes de verificar, descartados y trabajo en curso

### 6.1 Pendientes de verificar (15)
- **Rendimiento e interfaz:** REN-04 (CPU de `view`), UI-01 (WebView), UI-03 (Android real).
- **Planteles:** PLA-02 (42 dudosos), PLA-03 (21 identidades), PLA-04 (Villalba), PLA-08 (343 sin verificar), PLA-10 (laterales), PLA-11 (Ituzaingó), PLA-13 (altas y bajas de Primera Nacional), PLA-17 (tamaños), PLA-20 (decisión 155/156).
- **Otros:** REA-01 (desarrollo), TOR-02 (modo personalizado), GUA-03 (producción).

### 6.2 Descartados (2)
- **«Federal A debe tener 38 clubes»:** descartado por tu decisión (37; Estudiantes de San Luis queda fuera). El problema real es el test (TST-02).
- **«El `pid` de otros jugadores se filtra en el estado enviado»:** descartado. Se revisó `view()` y no se envían `pid` ajenos (el chat usa `me`/`my`, no el `pid`).

### 6.3 Trabajo en curso fuera de `main` (PR abiertos, sin integrar)

| PR | Tema | Relación con este documento | Estado declarado |
|---|---|---|---|
| #89 | SSE con gzip y deltas | REN-01 | Borrador; faltan pruebas de carga y online completas |
| #90 → #91 | Migración a Cloudflare Pages/Workers + Neon (auth, chat, rankings, salas, abandonos) | SRV-09, SEG-01/02/04/06, GUA-02 | Borrador; faltan prueba de extremo a extremo, `CHAT_OWNER_USERNAME`, Android y carga |
| #79 | Primera C: 824 jugadores, duplicados y nombres corregidos | PLA-18, PLA-05 | Borrador; workflow OK según el PR |
| #86 | Promocional: 509 jugadores, estructura y dorsales | PLA-19, PLA-14 | Borrador |
| #77 | Sacachispas: incorpora a Matías Arias | PLA-18 | Abierto (podría estar superado por el PR #79) |
| #5 | Primera Nacional en seis bloques | PLA-13 | Borrador desde el 07/11 (posiblemente superado) |
| Esta rama | 2 correcciones (MOT-01, MOT-02) e informe de posiciones sin commit | MOT-01/02, PLA-* | Sin PR |

---

## 7. Dependencias entre tareas

```
SEG-03 (IP real) ──► SRV-01 (saturación de salas), SEG-05 (títulos), SEG-07 (login)
SEG-01 ◄──► SEG-02 (mismo código, hacerlos juntos)  ··· GUA-03 condiciona la urgencia real
SRV-02 (body) ──► cualquier otro cambio en server.js
TST-06 (tests del servidor) ──► E1 y E3 con red de seguridad
REN-03 (Worker para el cierre) ──► UI-03 ;  GUA-01 ◄─ REN-03 / UI-04 (guardar en tramos)
REN-02 ◄──► UI-02 ◄──► REN-05 (pipeline de publicación de estáticos)
E0 (decidir PR #89/#91/#79/#86) ──► REN-01, SRV-09, PLA-18, PLA-19
PLA-20 + PLA-12 ──► TST-03 ──► IMP-04 (desbloquear publicación) ──► IMP-02, IMP-03 (reimportar)
IMP-01 (importador de secundarias) ──► PLA-09 (cargar secundarias), secundarias en PLA-05/06
PLA-18 / PLA-19 ──► PLA-05 (Primera C / Promocional)
PLA-03 (identidad) ──► PLA-01, PLA-02 ;  PLA-04 ⊂ PLA-03
D-8 (acceso a FM) ──► PLA-05, PLA-06, PLA-07, PLA-08
D-4 / D-5 ──► MOT-03 / MOT-04 ;  MOT-05 se resuelve en gran parte con PLA-01/07
TST-02 ──► TOR-01 ;  TST-08 + TST-09 ──► mantenimiento
```

---

## 8. Hoja de ruta recomendada por etapas

| Etapa | Objetivo | Incluye | Por qué en este orden | Riesgo |
|---|---|---|---|---|
| **E0. Ordenar la base** | Una sola línea de trabajo | Decidir los PR #89, #90/#91, #79, #86, #77 y #5; integrar las 2 correcciones de esta rama; definir si se migra a Cloudflare (SRV-09) | Sin esto, cada corrección se hace dos veces o sobre datos que van a cambiar | Bajo (decisión) |
| **E1. Bloqueantes de publicación** | Juego seguro y estable | TST-01 + una base mínima de TST-06 → SRV-02 → SEG-03 → SEG-01 + SEG-02 → SRV-01 → GUA-01 → UI-02 | Seguridad y pérdida de datos; cambios acotados y con tests | Medio (GUA-01 requiere migrar los guardados) |
| **E2. Rendimiento y móvil** | Carga y online razonables en Android | REN-02 + REN-05, REN-01 (validar el PR #89), REN-03 + UI-03, UI-01, UI-04, SRV-04 | Lo que más se nota en el teléfono | Medio |
| **E3. Integridad de rankings** | Rankings confiables | SEG-04/05/06/07, GUA-02, REN-06, SRV-03, SRV-05, SRV-06 | Depende de E1 (IP real y tests) y de D-3 | Medio |
| **E4. Pipeline de datos** | CSV = JSON = juego | PLA-20 + PLA-12 → TST-03 → IMP-04 → IMP-02 + IMP-03 → IMP-01 → IMP-05; PLA-04 | **Antes de cualquier corrección masiva de planteles** | Bajo-medio (reimportación controlada) |
| **E5. Planteles** | Posiciones correctas y completas | PLA-03 → PLA-01 → PLA-02 → PLA-06 / PLA-07 / PLA-08 → PLA-05 → PLA-09, con MOT-03/04 según D-4/D-5; luego PLA-10/11/13/15/16/17/14 | Primero identidad, luego lo confirmado, luego lo masivo con fuente | Bajo por cambio, alto volumen |
| **E6. Mantenimiento** | Proyecto sostenible | TST-02/04/05/07/08/09, TOR-01/02, REA-01/02/03, MOT-06/07, SRV-07/08, REN-04/07, SOC-01 | Deuda técnica y cobertura | Bajo |

**Mínimo para publicar:** E0 y E1 completos; de E2, REN-02, UI-02 y REN-03; de E3, SEG-04/05 o, en su lugar, ocultar los rankings informados.

---

## 9. Decisiones que te corresponden

| # | Decisión | Afecta a |
|---|---|---|
| D-1 | Qué hacer con cada PR abierto (#89, #90/#91, #79, #86, #77, #5) y con las 2 correcciones de esta rama | E0, SRV-09, REN-01, PLA-18/19 |
| D-2 | Cómo se identifica al dueño del chat (id de usuario o variable obligatoria) y confirmar el estado de la cuenta en producción | SEG-01, SEG-02, GUA-03 |
| D-3 | Política de rankings: separar los verificados de los informados, tope de carreras offline, contar por uid y mínimo de participantes (el PR #91 usa 8) | SEG-04/05/06 |
| D-4 | MP: tratarlo como MO o como alternativa; qué hacer con el único LIB | MOT-03 |
| D-5 | Crear o no un perfil de valoración propio para el SD | MOT-04 |
| D-6 | Aceptar los 23 cambios de formación inicial y la nivelación de Chacarita e Instituto tras SD+DC | REA-02, MOT-06 |
| D-7 | Calibración: 156 (incluir a Lozada Echenique) o 155 | PLA-20, TST-03, IMP-04 |
| D-8 | Fuente para puestos y secundarias de ascenso: acceso a FM (sortitoutsi/FMInside está bloqueado aquí) u otra fuente aceptada | PLA-05/06/07/08/09 |
| D-9 | Cómo se distribuye en Android: navegador, PWA o WebView propio | UI-01 (gravedad real) |
| D-10 | Si los workflows pueden seguir haciendo push a `main` | TST-07, IMP-04 |
| D-11 | Confirmar los 21 casos de identidad: corregir nombres solo con evidencia | PLA-03 |

---

## 10. Anexo de trazabilidad (ID maestro → origen)

| ID maestro | Origen |
|---|---|
| SEG-01, SEG-02, GUA-01 | Primera auditoría A3, A4, A2 |
| SEG-03/04/05/06 | Primera auditoría A5 |
| SRV-01, SRV-02 | Primera auditoría B1, B2 |
| TST-01, TST-02, TST-03 | Primera auditoría B3 (actualizado hoy) |
| IMP-03 | Primera auditoría B4 |
| REN-03, REN-02, UI-02, UI-01, GUA-02, REN-01 | Primera auditoría B5, B6, B7, B8, B9, B10 |
| SRV-03, SRV-04, SEG-07, SRV-07, SRV-06, SRV-05, REN-06, REN-07, REA-03, SOC-01, TST-07, SRV-08, UI-04 | Primera auditoría C1, C3, C4, C5/C6, C7, C8, C9, C10, C11, C12, C13, C14, C15 |
| REN-04 | Primera auditoría C2 |
| REN-05, TST-09 | Primera auditoría D |
| MOT-01 | Primera auditoría A1 (resuelto) |
| MOT-02, MOT-04, MOT-06, MOT-07, REA-02, TST-04 | Corrección SD+DC y su informe |
| PLA-20 | Investigación 155/156 |
| IMP-01, PLA-05, PLA-06, PLA-07, IMP-02, PLA-03, PLA-04, IMP-05, MOT-03, PLA-10, PLA-11 | Auditoría de posiciones D1–D9 y F.3 |
| PLA-01, PLA-02, PLA-09, PLA-08 | Auditoría de posiciones D, F, E y metodología |
| PLA-12 | Tests de Federal A (primera auditoría y hoy) |
| PLA-13 | `auditoria-vigencia-2026-11-08.md` |
| PLA-14, PLA-15, PLA-16, PLA-17, REA-01 | Informes de Federal A, Primera C, 60 temporadas y Promocional |
| PLA-18, PLA-19, SRV-09 | PR #79, #86, #90/#91 |
| TOR-01, TOR-02, TST-05, TST-06, TST-08, GUA-03 | Primera auditoría (cobertura) y revisión de hoy |

---

## Anexo A — Los 39 errores de posición principal confirmados (PLA-01)

Grupo / puesto según el CSV (en el juego es igual salvo Thomas Ortega, que figura LD). Detalle y motivo en `planteles/auditoria-general-posiciones-2026.md`, sección D.

| # | División | Club | Jugador | Actual | Propuesta | Fuente principal |
|---:|---|---|---|---|---|---|
| 1 | Primera | Boca Juniors | Malcom Braida | MED / LI | DEL / EI | [en.wikipedia.org](https://en.wikipedia.org/wiki/Malcom_Braida) |
| 2 | Primera | Rosario Central | Alan Rodríguez | MED / LI | MED / MCD | [cadena3.com](https://www.cadena3.com/noticia/futbol/alan-rodriguez-ya-es-refuerzo-de-rosario-central-el-volante-uruguayo-fue-presentado-oficialmente_580086) |
| 3 | Primera | Huracán | Thiago Pérez | DEF / MCD | MED / MCD | [fotmob.com](https://www.fotmob.com/es/players/1914685/thiago-perez) |
| 4 | Primera | Gimnasia (LP) | Nicolás Barros Schelotto | MED / LD | MED / MCD | [en.wikipedia.org](https://en.wikipedia.org/wiki/Nicol%C3%A1s_Barros_Schelotto) |
| 5 | Primera | Gimnasia (LP) | Facundo Di Biasi | MED / DFC | MED / MCD | [espn.com](https://www.espn.com/soccer/player/_/id/397601/facundo-di-biasi) |
| 6 | Primera | Argentinos Jrs. | Gastón Bouhier | MED / DC | DEL / DC | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/408142/gaston-bouhier) |
| 7 | Primera | Argentinos Jrs. | Joaquín Gho | DEL / MC | MED / MD | [en.wikipedia.org](https://en.wikipedia.org/wiki/Joaqu%C3%ADn_Gho) |
| 8 | Primera | Belgrano | Marcos Ortiz | MED / DFC | MED / MC | [us.soccerway.com](https://us.soccerway.com/player/ortiz-marcos/Cv8t2ZD8/) |
| 9 | Primera | Atl. Tucumán | Gabriel Compagnucci | MED / LD | DEF / LD (lado a confirmar: Tuttosport lo da como defensor izquierdo) | [espn.com](https://www.espn.com/soccer/player/bio/_/id/207650/gabriel-compagnucci) |
| 10 | Primera Nacional | Nueva Chicago | Alan Ruiz | MED / SD | MED / MO; secundaria ED | [fotmob.com](https://www.fotmob.com/es/players/263707/alan-ruiz) |
| 11 | Primera Nacional | Chaco For Ever | Agustín Ojeda | MED / LI | DEF / LI | [airedesantafe.com.ar](https://www.airedesantafe.com.ar/deportes/debuto-colon-no-se-asento-y-es-nuevo-refuerzo-un-rival-directo-la-primera-nacional-n640981) |
| 12 | Primera Nacional | Dep. Morón | Mariano Bíttolo | DEF / EI | DEF / LI | [en.wikipedia.org](https://en.wikipedia.org/wiki/Mariano_B%C3%ADttolo) |
| 13 | Primera Nacional | Estudiantes (BA) | Matías Núñez | MED / DC | MED / MC | [fichajes.com](https://www.fichajes.com/jugador/matias-ezequiel-nunez/) |
| 14 | Primera Nacional | Gimnasia (J) | Juan Franzoni | DEL / MC | DEL / DC | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/juan-franzoni-t2guyfg10wiv8b9cavmezg4q/) |
| 15 | Primera Nacional | San Martín (T) | Jorge Juárez | MED / LD | MED / MC; secundarias MD y LD | [lagaceta.com.ar](https://www.lagaceta.com.ar/nota/1135227/deportes/mientras-intenta-consolidarse-san-martin-encontro-juarez-herramienta-puede-crecer.html) |
| 16 | Primera Nacional | Güemes | Lucas Guiñazú Fernández | DEF / MC | MED / MC | [fichajes.com](https://www.fichajes.com/jugador/lucas-guinazu/) |
| 17 | Primera Nacional | Racing (Cba.) | Santiago Rinaudo | DEF / ED | DEF / LD | [statscrew.com](https://www.statscrew.com/worldfootball/stats/p-rinausan001) |
| 18 | Primera Nacional | Racing (Cba.) | Tomás Kummer | DEF / MCD | DEF / DFC | [fotmob.com](https://www.fotmob.com/es/players/1435860/tomas-kummer) |
| 19 | Primera Nacional | Racing (Cba.) | Lautaro Ávila | MED / DFC | MED / MC | [global.espn.com](https://global.espn.com/football/player/_/id/411476/lautaro-avila) |
| 20 | Primera Nacional | Colón | Matías Córdoba | MED / DC | DEL / DC | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/402917/matias-cordoba) |
| 21 | Primera Nacional | Colón | Darío Sarmiento | DEL / MC | DEL / DC; secundaria MO a confirmar | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/dario-sarmiento-a1m7f0ewof5suc4pvivuaudm2/) |
| 22 | Primera Nacional | Tristán Suárez | Kevin Colli | MED / DC | MED / MC | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/388341/kevin-colli) |
| 23 | Primera Nacional | Patronato | Facundo Heredia | DEL / LI | DEL / DC | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/facundo-heredia-b63ojekhiod69slyg0laqc844/) |
| 24 | Primera Nacional | Alte. Brown | Tomás Villoldo | DEF / EI | DEF (puesto de defensa a confirmar) | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/tomas-villoldo-4cmr3wt7wfwprmcvgnev6ohk9/) |
| 25 | Primera Nacional | Alte. Brown | Leonardo Jara | DEF / ED | DEF (puesto a confirmar; FotMob lo da como MCD) | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/leonardo-jara-1qyx65ku5j6sesp9wsp8psrth/) |
| 26 | Primera Nacional | Gimnasia y Tiro | Rubén Villarreal | MED / LI | MED (MC o MI, a precisar) | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/ruben-villarreal-c72shs2lndvv2081i93svjp3p/) |
| 27 | Primera Nacional | Quilmes | Thomas Ortega | DEF / MC en el CSV; DEF / LD en el juego | DEF / LI | [en.wikipedia.org](https://en.wikipedia.org/wiki/Thomas_Ortega) |
| 28 | Primera Nacional | Godoy Cruz | Santiago Martínez | MED / DC | MED / MC | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/392255/santiago-martinez) |
| 29 | Primera Nacional | San Telmo | Juan Ignacio Motroni | DEF / ED | DEF (puesto de defensa a confirmar) | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/399733/juan-motroni) |
| 30 | Primera Nacional | San Telmo | Martín González | DEF / MC | DEF (puesto de defensa a confirmar) | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/336487/martin-gonzalez) |
| 31 | Primera Nacional | San Telmo | Rodrigo Dinocco | DEF / ED | DEF (puesto de defensa a confirmar) | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/418910/rodrigo-dinocco) |
| 32 | Primera Nacional | San Telmo | Joel González | MED / DC | DEL / DC; secundaria ED a confirmar | [fichajes.com](https://www.fichajes.com/jugador/joel-gonzalez-3/) |
| 33 | Primera Nacional | Acassuso | David de Estéfano | DEL / MC | DEL / DC | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/418913/david-de-estefano) |
| 34 | Primera Nacional | Acassuso | Kevin Dubini | DEL / MC | DEL / DC | [canchallena.lanacion.com.ar](https://canchallena.lanacion.com.ar/jugador/kevin-dubini-f3x0isdvhu7qee9pvnul9w8o9/) |
| 35 | Primera Nacional | Atl. Rafaela | Joel Bonifacio | MED / DC | MED / MC | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/421300/joel-bonifacio) |
| 36 | Primera Nacional | Patronato | Agustín Miró | MED / ED | MED / MC | [espndeportes.espn.com](https://espndeportes.espn.com/futbol/jugador/_/id/365051/alejo-miro) |
| 37 | Primera Nacional | Chacarita Jrs. | Francisco Cristaldo | DEL / MO | DEL / DC | [us.soccerway.com](https://us.soccerway.com/player/cristaldo-francisco/n5K9shy0) |
| 38 | Primera | Lanús | Marcelino Moreno | DEL / MO | MED / MO; secundaria MI | [en.wikipedia.org](https://en.wikipedia.org/wiki/Marcelino_Moreno) |
| 39 | Primera Nacional | San Telmo | Gabriel Paredes | MED / EI | DEF / LI | [fotmob.com](https://www.fotmob.com/es-419/players/1373702) |

## Anexo B — Los 42 cruces de línea dudosos (PLA-02)

Fuentes en conflicto o insuficientes. Los marcados con ⚠ son además casos de identidad (PLA-03).

| # | División | Club | Jugador | Actual | Conflicto |
|---:|---|---|---|---|---|
| 1 | Primera | Racing Club | Ignacio Rodríguez | DEF / MC | ESPN y Sofascore: mediocampista; FotMob: carrilero izquierdo. El grupo DEF no coincide con el rol MC |
| 2 | Primera | Belgrano | Thiago Cortes | MED / LD | La única ficha encontrada (Cancha Llena) lo da como mediocampista; no hay fuente para LD |
| 3 | Primera Nacional | Chacarita Jrs. | Lorenzo Brun | MED / DC | ESPN y Fichajes: delantero; Soccerway y LiveSoccerTV: mediocampista |
| 4 | Primera Nacional | Chaco For Ever | Brian García | DEF / MC | No se encontró ninguna ficha de un Brian García en Chaco For Ever (solo Brian Guerra, otro jugador). Revisar si el nombre es correcto |
| 5 | Primera Nacional | Chaco For Ever | Ezequiel Pacheco | MED / DC | FotMob: delantero, con 3 goles en 2026; ESPN y Fichajes: mediocampista |
| 6 | Primera Nacional | Chaco For Ever | Santiago Villalba | MED / SD | LiveSoccerTV: delantero; ESPN: mediocampista |
| 7 | Primera Nacional | Dep. Morón | ⚠ Facundo Fagúndez | MED / DC | No aparece ningún Facundo Fagúndez en Morón; sí Franco Fagúndez (FotMob: delantero o extremo izquierdo; ESPN: mediocampista). Posible error de nombre |
| 8 | Primera Nacional | Estudiantes (BA) | Fernando Duré | MED / LD | FotMob: lateral derecho; ESPN: mediocampista |
| 9 | Primera Nacional | Estudiantes (BA) | Teo Cohen | MED / DC | ESPN, FotMob y Fichajes: mediocampista; Sofascore y Statshub: delantero |
| 10 | Primera Nacional | Almagro | Julián Vitale | MED / DFC | ESPN, Wikipedia y Cancha Llena: mediocampista; FotMob: defensor central |
| 11 | Primera Nacional | Mitre (SdE) | Martín Vázquez | DEF / MC | ESPN: defensor; figura entre los máximos asistidores del club, lo que sugiere un rol más ofensivo |
| 12 | Primera Nacional | San Martín (SJ) | Gonzalo Lucero | MED / LI | EA FC 26: LI con MI de alternativa; Soccerway: defensor; ESPN y La Nación: mediocampista |
| 13 | Primera Nacional | Temperley | ⚠ Lautaro Monti Azpiazu | MED / LD | Las fuentes lo nombran Lorenzo Monti Azpiazu. Mayoría mediocampista (ESPN AR, Soccerway); ESPN global y un perfil viejo de Sofascore: defensor |
| 14 | Primera Nacional | Temperley | ⚠ Omar Pacheco | DEL / DFC | Solo aparece Oswaldo Pacheco (colombiano): Soccerway lo da como defensor y ESPN como delantero |
| 15 | Primera Nacional | Güemes | ⚠ Alan Bordón | MED / LD | Solo aparece Axel Bordón (ESPN: defensor de Güemes); no se confirma el lado |
| 16 | Primera Nacional | Güemes | ⚠ Ramiro Arnay | MED / LI | Solo aparece Rodrigo Arnay: ESPN lo da como defensor y FootyStats como lateral derecho, no izquierdo |
| 17 | Primera Nacional | Güemes | Walter Juárez | DEF / MC | ESPN, LiveSoccerTV y Fussballtransfers: mediocampista; Worldfootball y Soccerway: defensor |
| 18 | Primera Nacional | Racing (Cba.) | Catriel Peña | DEF / ED | Una sola fuente (FootyStats: Central Midfield). Ni el grupo DEF ni el rol ED tienen respaldo |
| 19 | Primera Nacional | C. de Bolívar | ⚠ Franco Mucignat | DEF / ED | Solo aparece Facundo Mucignat, defensor según ESPN, La Nación y FotMob. Si es el mismo jugador, el rol ED es incorrecto |
| 20 | Primera Nacional | C. de Bolívar | ⚠ Nicolás Yeri | DEF / MC | Solo aparece Nahuel Yeri: ESPN y La Nación lo dan como defensor; Soccerway, como mediocampista |
| 21 | Primera Nacional | C. de Bolívar | Agustín Paredes | MED / LD | FotMob: lateral derecho; ESPN y Cancha Llena: mediocampista |
| 22 | Primera Nacional | C. de Bolívar | ⚠ Tomás Fernández | MED / LD | Solo aparece Tobías Fernández, mediocampista según La Nación y ESPN |
| 23 | Primera Nacional | Colón | ⚠ Cristian Ibarra | DEF / MC | En Colón solo aparecen Conrado Ibarra (defensor) y Zahir Ibarra; Cristian Ibarra es mediocampista de Olimpo |
| 24 | Primera Nacional | Agropecuario | ⚠ Ezequiel Aguirre | DEF / ED | En Agropecuario figuran Alan y Enzo Aguirre (defensores). Ezequiel Aguirre es un extremo de Defensores de Belgrano |
| 25 | Primera Nacional | Agropecuario | Federico Pérez | MED / LD | FotMob: lateral derecho; ESPN: mediocampista |
| 26 | Primera Nacional | Patronato | ⚠ Julián Salas | DEF / ED | Solo aparece Juan Salas: ESPN y Soccerway lo dan como defensor; FotMob, como volante derecho |
| 27 | Primera Nacional | Patronato | ⚠ Bruno Bravo | MED / LD | No aparece ningún Bruno Bravo en Patronato (sí Benjamín Bravo, mediocampista, y Federico Bravo, volante defensivo) |
| 28 | Primera Nacional | Patronato | Facundo Díaz | MED / DFC | ESPN: mediocampista; FotMob: defensor central |
| 29 | Primera Nacional | Patronato | ⚠ Matías Rueda | MED / LD | No aparece ningún Matías Rueda en Patronato (sí Walter Rueda, mediocampista, y Matías Ruiz Díaz, defensor) |
| 30 | Primera Nacional | Patronato | Santiago Piccioni | MED / DFC | Cancha Llena y ESPN: mediocampista; FotMob y Soccerway: defensor; Statscrew: central y mediocentro |
| 31 | Primera Nacional | Alte. Brown | ⚠ Rodrigo Fernández | DEF / EI | No aparece ningún Rodrigo Fernández; en Almirante Brown está Ramiro Fernández, lateral izquierdo según Wikipedia |
| 32 | Primera Nacional | Alte. Brown | Pedro Velurtas | MED / LD | ESPN: mediocampista; Soccerway: defensor |
| 33 | Primera Nacional | Quilmes | Nicolás Colazo | DEF / ED | La mayoría lo da como defensor (Cancha Llena, Statshub) y carrilero (FootballTransfers); Wikipedia: extremo; Crónica: volante |
| 34 | Primera Nacional | Quilmes | Tiago Marghetich | DEF / MCD | Fichajes y ESPN Argentina: defensor; Soccerway: mediocampista |
| 35 | Primera Nacional | Quilmes | Agustín Lavezzi | MED / DC | Cancha Llena, Wikipedia y ESPN: mediocampista; Soccerway y FotMob: delantero centro |
| 36 | Primera Nacional | Quilmes | ⚠ Agustín Batista | DEL / MC | No aparece ningún Agustín Batista en Quilmes; sí Axel Batista (ESPN: delantero; FotMob: mediocentro) |
| 37 | Primera Nacional | Godoy Cruz | Misael Sosa | MED / DC | ESPN y Fichajes: mediocampista; FootyStats: segundo delantero; Godoy Cruz lo presentó como delantero; en Perú jugó de extremo |
| 38 | Primera Nacional | San Miguel | Leandro Ortiz | MED / DFC | ESPN 2026: mediocampista; Soccerway: defensa |
| 39 | Primera Nacional | Acassuso | David Escalante | MED / DC | Fuentes recientes (Cancha Llena, ESPN, FotMob 2026): mediocampista; Wikipedia y un FotMob anterior (15 goles en la B Metro 2025): delantero |
| 40 | Primera Nacional | Acassuso | Lázaro Romero | MED / DC | Wikipedia, Soccerway y FotMob: delantero; Cancha Llena y ESPN: mediocampista |
| 41 | Primera Nacional | Atl. Rafaela | Nahuel Cainelli | MED / LD | La Nación, ESPN y Footmercato: mediocampista; FotMob: lateral derecho; Soccerway: delantero |
| 42 | Primera Nacional | Atl. Rafaela | Ulises Yegros | MED / DFC | Fichajes, ESPN y Globalsportsarchive: mediocampista; AiScore y Soccerway (datos de su etapa en Almagro): defensor central |

## Anexo C — Los 21 nombres o identidades sospechosos (PLA-03, PLA-04)

| # | División | Club | Nombre cargado | Lo que muestran las fuentes | Categoría |
|---:|---|---|---|---|---|
| 1 | Primera Nacional | Dep. Morón | Facundo Fagúndez | No aparece ningún Facundo Fagúndez en Morón; sí Franco Fagúndez (FotMob: delantero o extremo izquierdo; ESPN: mediocampista). Posible error de nombre | C |
| 2 | Primera Nacional | Temperley | Lautaro Monti Azpiazu | Las fuentes lo nombran Lorenzo Monti Azpiazu. Mayoría mediocampista (ESPN AR, Soccerway); ESPN global y un perfil viejo de Sofascore: defensor | C |
| 3 | Primera Nacional | Temperley | Omar Pacheco | Solo aparece Oswaldo Pacheco (colombiano): Soccerway lo da como defensor y ESPN como delantero | C |
| 4 | Primera Nacional | Güemes | Alan Bordón | Solo aparece Axel Bordón (ESPN: defensor de Güemes); no se confirma el lado | C |
| 5 | Primera Nacional | Güemes | Ramiro Arnay | Solo aparece Rodrigo Arnay: ESPN lo da como defensor y FootyStats como lateral derecho, no izquierdo | C |
| 6 | Primera Nacional | C. de Bolívar | Franco Mucignat | Solo aparece Facundo Mucignat, defensor según ESPN, La Nación y FotMob. Si es el mismo jugador, el rol ED es incorrecto | C |
| 7 | Primera Nacional | C. de Bolívar | Nicolás Yeri | Solo aparece Nahuel Yeri: ESPN y La Nación lo dan como defensor; Soccerway, como mediocampista | C |
| 8 | Primera Nacional | C. de Bolívar | Tomás Fernández | Solo aparece Tobías Fernández, mediocampista según La Nación y ESPN | C |
| 9 | Primera Nacional | Colón | Cristian Ibarra | En Colón solo aparecen Conrado Ibarra (defensor) y Zahir Ibarra; Cristian Ibarra es mediocampista de Olimpo | C |
| 10 | Primera Nacional | Agropecuario | Ezequiel Aguirre | En Agropecuario figuran Alan y Enzo Aguirre (defensores). Ezequiel Aguirre es un extremo de Defensores de Belgrano | C |
| 11 | Primera Nacional | Patronato | Julián Salas | Solo aparece Juan Salas: ESPN y Soccerway lo dan como defensor; FotMob, como volante derecho | C |
| 12 | Primera Nacional | Patronato | Bruno Bravo | No aparece ningún Bruno Bravo en Patronato (sí Benjamín Bravo, mediocampista, y Federico Bravo, volante defensivo) | C |
| 13 | Primera Nacional | Patronato | Matías Rueda | No aparece ningún Matías Rueda en Patronato (sí Walter Rueda, mediocampista, y Matías Ruiz Díaz, defensor) | C |
| 14 | Primera Nacional | Alte. Brown | Rodrigo Fernández | No aparece ningún Rodrigo Fernández; en Almirante Brown está Ramiro Fernández, lateral izquierdo según Wikipedia | C |
| 15 | Primera Nacional | Quilmes | Agustín Batista | No aparece ningún Agustín Batista en Quilmes; sí Axel Batista (ESPN: delantero; FotMob: mediocentro) | C |
| 16 | Primera Nacional | Patronato | Agustín Miró | Las fuentes lo nombran Alejo Agustín Miró: mediocampista según ESPN, StatsHub y Elonce; ninguna fuente lo da como extremo | A |
| 17 | Primera Nacional | C. de Bolívar | Matías Gutiérrez | En Ciudad de Bolívar solo aparece Maximiliano Gutiérrez (mediocampista) | C |
| 18 | Primera Nacional | Alte. Brown | Santiago Ariel Villalba | El mismo perfil de Soccerway (Kx3Dkw4r) y de ESPN (364831) aparece en Almirante Brown (préstamo de Barracas hasta el 31/12/2025) y en Chaco For Ever (préstamo hasta el 31/12/2026). Puede estar cargado en dos clubes. Posición: ESPN mediocampista; Soccerway delantero | D |
| 19 | Primera Nacional | Los Andes | Federico Villarreal | En Los Andes solo aparece Facundo Villarreal (ESPN y Soccerway: mediocampista; FotMob: delantero) | C |
| 20 | Federal A | Kimberley | Joaquín Zárate | Las fuentes lo nombran Jonathan Gustavo Zárate, volante interno de Kimberley (La Capital MdP). El puesto coincide | C |
| 21 | Federal A | Villa Mitre | Thiago Díaz | No aparece ningún Thiago Díaz en Villa Mitre; sí Thiago Pérez (centrocampista) | C |

## Anexo D — Resultado de la verificación de posiciones (resumen)

- Cruces de línea verificados: 77. Confirmados (A): 35; dudosos (C): 42.
- Muestra de casos de convención: 10. A: 4; C: 5; posible duplicado: 1.
- Muestra de la tanda 4 de Federal A: 10. Sin cambios: 5; secundaria con evidencia (B): 1; dudosos (C): 4.
- **Sin verificar individualmente:** 154 casos de convención + 189 de la tanda 4 = 343 (ver PLA-08). El resto de la base (4.811 jugadores) no tuvo verificación externa de posición en esta auditoría.

