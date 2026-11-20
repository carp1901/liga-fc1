# Migración progresiva a Cloudflare Workers

## Estado de esta rama

La integración avanzó de transporte experimental a **runtime de salas integrado**:

- El Worker recibe las rutas de juego POST /act y GET /ev.
- Cada código de sala se enruta a su propio Durable Object.
- El Durable Object carga y guarda el estado completo del motor, incluidos los conjuntos usados por el partido.
- El reloj del motor dejó de crear temporizadores globales en este modo; cada Durable Object lo avanza mediante su alarma.
- Las conexiones SSE se vuelven a asociar al jugador cuando se reconecta.
- Los IDs de cuenta enviados por el navegador se descartan. Para POST /act, el Worker valida el token contra Neon y pasa al Durable Object únicamente el UID verificado mediante un encabezado interno que el cliente no puede imponer. Sin token válido, la partida queda como invitado.

**Todavía no es un backend listo para producción ni para cambiar el frontend.** Ya se agregó una primera migración de registro, login, sesiones y validación de token a través del driver HTTP de Neon. Los perfiles privados y públicos, el club favorito y las amistades ya tienen rutas en el Worker y consultas Neon en `src/social.mjs`. El chat general también está portado: lectura pública, escritura autenticada, filtro de lenguaje, reacciones, eliminación, permisos, moderación y eventos SSE en vivo mediante un Durable Object global (`src/chat.mjs` y `src/chat-hub.mjs`). Las carreras, los rankings de técnicos e hinchas y el palmarés de clubes también están conectados a Neon mediante `src/careers.mjs`; se conservan los endpoints y reglas del servidor anterior. Las salas públicas ahora usan un Durable Object global de lobby para listar, crear, ingresar, mirar, cerrar y reclamar vacantes en salas individuales; el índice se conserva en SQLite y los bloqueos por abandonos se guardan en ese lobby. La partida aleatoria ya usa un Durable Object global `RandomCoordinator`: la cola de 10 jugadores, las votaciones y cada sala aleatoria se persisten en SQLite; el mismo motor original sigue resolviendo las reglas y el flujo SSE. Se mantienen el límite de 120 solicitudes por IP/hora y la excepción de reconexión a una partida propia activa aunque el usuario tenga un bloqueo por abandonos. Las partidas oficiales automáticas siguen fuera de este alcance.

## Arquitectura del runtime de salas

1. El Worker valida el código de sala y enruta /act o /ev al Durable Object identificado por ese código. Los códigos `rnd...` se dirigen al coordinador global `RANDOM`, que mantiene las colas y salas aleatorias; `POST /api/random` entra a esa cola.
2. El Durable Object restaura el snapshot del motor al recibir la primera solicitud.
3. Las acciones se ejecutan con el motor original (public/engine.js), no con una simulación nueva ni una reimplementación de sus reglas.
4. Una alarma por sala avanza el reloj y persiste el estado. No hay un setInterval global que recorra todas las salas.
5. Los callbacks SSE son efímeros y se vuelven a registrar al reconectar; no se guardan en PostgreSQL ni en el snapshot.

## Configuración previa al frontend

En Cloudflare, el Worker `clash-futbol-edge` está conectado a la rama `cloudflare-workers-backend`. `DATABASE_URL` (secreto) y `CHAT_OWNER_USERNAME` (variable con el valor confirmado `Burzaco`) están configuradas en Production. El frontend se conectará mediante Pages Functions y un Service binding privado; no necesita publicar una URL workers.dev.

**Paso inicial especial para Durable Objects:** la primera aplicación de las migraciones `v1`–`v4` requiere `npx wrangler deploy`; `wrangler versions upload` no puede crear ni cambiar el ciclo de vida de esas clases. Para que ese deploy inicial no publique el backend en `workers.dev`, `wrangler.jsonc` establece temporalmente `workers_dev: false` y `preview_urls: false`, y no declara rutas ni dominios. Solo después de verificar esos valores en el archivo se cambia temporalmente el Deploy command de Workers Builds a `npx wrangler deploy` y se deja terminar esa compilación. Esto aplica las migraciones, pero no crea una URL pública de `workers.dev`. Luego se restaura el Deploy command `npx wrangler versions upload`; no se debe habilitar `workers_dev`, promover versiones ni conectar el frontend hasta completar las pruebas. `wrangler deploy` activa la versión al 100 % de cualquier tráfico que tenga una ruta, por eso es imprescindible mantener deshabilitadas las rutas durante este paso.

El endpoint `GET /api/db/health` permite comprobar la conexión real sin exponer credenciales. Antes de probarlo y usar las rutas de autenticación contra Neon, configurar `DATABASE_URL` como secreto del Worker (no pegarlo en el repositorio ni en el chat). El frontend está preparado para usar el Service binding privado `CLASH_API` desde Pages Functions; estas funciones eliminan `Origin` en el salto interno, por lo que no se necesita `FRONTEND_ORIGINS` ni habilitar CORS entre dominios. Mantener `workers_dev: false`, `preview_urls: false` y sin rutas ni dominios públicos. Configurar `CHAT_OWNER_USERNAME` con el nombre exacto de la cuenta propietaria; el valor confirmado para este proyecto es `Burzaco`.

## Fases pendientes

1. **Pruebas de equivalencia:** ya hay pruebas automatizadas de arranque de sala online de 8 jugadores, cambios SSE, persistencia y arranque del reloj; y de Partida Rápida de 10 jugadores, las dos votaciones de 15 segundos, selección de clubes, inicio de la competición, persistencia, límite por IP y reconexión con bloqueos. Falta comparar escenarios completos de partidos con Node y Cloudflare, incluidos espectadores, penales, pelotas paradas, desconexión/reconexión y abandono.
2. **Autenticación y progreso:** registro, login, cierre de sesión y validación de token están portados a `src/auth.mjs`. Las carreras autenticadas, rankings de técnicos (histórico/temporada), ranking de hinchas, títulos offline informados y palmarés (ranking por club, ficha, historial y listado) están portados a `src/careers.mjs`. Los cierres de torneos del motor online ya disparan la persistencia en Neon. La elegibilidad de torneos se ajustó al mínimo acordado de 8 participantes. Falta probar las consultas y los flujos con Neon real. El lobby ya tiene pruebas automatizadas simuladas para creación, listado, ingreso, espectadores, cierre, penalizaciones y ocho creaciones simultáneas; aún falta repetir esos escenarios en Cloudflare real, incluyendo vacantes, cierre por tiempo y reemplazos.
3. **Datos sociales y chat:** perfiles privados/públicos, club favorito y amistades están portados a `src/social.mjs`. El chat y la moderación están portados a `src/chat.mjs`; los eventos en vivo usan el Durable Object `ChatHub`. Se mantienen las reglas de cuenta, club favorito obligatorio para escribir, filtro de insultos, cooldowns, reacciones y permisos exclusivos del propietario para suspender/promover moderadores. Las pruebas usan una base simulada; falta validar con Neon real y revisar el nombre real del propietario antes de lanzar. **Pruebas pendientes:** validar carreras, rankings y palmarés con Neon real; las pruebas automatizadas usan una base simulada. Los datos de usuarios y sesiones en el proyecto Neon están actualmente vacíos; no hay hashes scrypt previos que deban migrarse.
4. **Frontend Pages:** desplegar Pages solo después de aprobar las pruebas previas; enlazar `CLASH_API` al Worker por Service binding privado y probar Android, EventSource, reconexiones y errores de red. La preparación del proxy está en `functions/`, con rutas limitadas por `public/_routes.json`.
5. **Carga y límites:** probar múltiples salas simultáneas en Cloudflare real, CPU, alarmas, requests y consumo de Durable Objects.
6. **Corte:** publicar Pages, configurar bindings y secretos, y cambiar el frontend únicamente después de aprobar las pruebas.

## Comandos locales

```sh
npm install
npm run test:cloudflare
npm run cf:dev
```

No ejecutar npm run cf:deploy ni cambiar el backend público hasta terminar las fases pendientes.
