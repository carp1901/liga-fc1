# Migración progresiva a Cloudflare Workers

## Estado de esta rama

La integración avanzó de transporte experimental a **runtime de salas integrado**:

- El Worker recibe las rutas de juego POST /act y GET /ev.
- Cada código de sala se enruta a su propio Durable Object.
- El Durable Object carga y guarda el estado completo del motor, incluidos los conjuntos usados por el partido.
- El reloj del motor dejó de crear temporizadores globales en este modo; cada Durable Object lo avanza mediante su alarma.
- Las conexiones SSE se vuelven a asociar al jugador cuando se reconecta.
- Los IDs de cuenta enviados por el navegador se descartan. Para POST /act, el Worker valida el token contra Neon y pasa al Durable Object únicamente el UID verificado mediante un encabezado interno que el cliente no puede imponer. Sin token válido, la partida queda como invitado.

**Todavía no es un backend listo para producción ni para cambiar el frontend.** Ya se agregó una primera migración de registro, login, sesiones y validación de token a través del driver HTTP de Neon. Los perfiles privados y públicos, el club favorito y las amistades ya tienen rutas en el Worker y consultas Neon en `src/social.mjs`. El chat general también está portado: lectura pública, escritura autenticada, filtro de lenguaje, reacciones, eliminación, permisos, moderación y eventos SSE en vivo mediante un Durable Object global (`src/chat.mjs` y `src/chat-hub.mjs`). La ruta de juego y la autenticación en Cloudflare deben probarse antes de cualquier corte.

## Arquitectura del runtime de salas

1. El Worker valida el código de sala y enruta /act o /ev al Durable Object identificado por ese código.
2. El Durable Object restaura el snapshot del motor al recibir la primera solicitud.
3. Las acciones se ejecutan con el motor original (public/engine.js), no con una simulación nueva ni una reimplementación de sus reglas.
4. Una alarma por sala avanza el reloj y persiste el estado. No hay un setInterval global que recorra todas las salas.
5. Los callbacks SSE son efímeros y se vuelven a registrar al reconectar; no se guardan en PostgreSQL ni en el snapshot.

## Configuración previa al frontend

El endpoint `GET /api/db/health` permite comprobar la conexión real sin exponer credenciales. Antes de probarlo y usar las rutas de autenticación contra Neon, configurar `DATABASE_URL` como secreto del Worker (no pegarlo en el repositorio ni en el chat). Antes de conectar Pages, configurar la variable de entorno no secreta `FRONTEND_ORIGINS` en el Worker con el origen exacto del sitio, por ejemplo `https://clash-futbol.pages.dev`. Se aceptan varios orígenes separados por comas. El Worker rechaza otros orígenes y atiende OPTIONS para las peticiones del navegador.

## Fases pendientes

1. **Pruebas de equivalencia:** comparar el mismo flujo de partida en Node y Cloudflare; validar 8 y 10 jugadores, espectadores, penales, pelotas paradas, desconexión/reconexión y abandono.
2. **Autenticación:** registro, login, cierre de sesión y validación de token ya están portados a `src/auth.mjs`; usan `PBKDF2-SHA256` con sal y guardan únicamente el hash SHA-256 del token de sesión. Se agregaron límites básicos por IP/usuario en memoria del Worker. Falta probarlos contra Neon real, revisar el costo de CPU del hash y agregar rate limiting distribuido antes del lanzamiento. La identidad verificada ya se conecta a las acciones online del motor; falta conectar los eventos de fin de torneo con la persistencia de carreras y títulos.
3. **Datos sociales y chat:** perfiles privados/públicos, club favorito y amistades están portados a `src/social.mjs`. El chat y la moderación están portados a `src/chat.mjs`; los eventos en vivo usan el Durable Object `ChatHub`. Se mantienen las reglas de cuenta, club favorito obligatorio para escribir, filtro de insultos, cooldowns, reacciones y permisos exclusivos del propietario para suspender/promover moderadores. Las pruebas usan una base simulada; falta validar con Neon real y revisar el nombre real del propietario antes de lanzar. **Datos restantes:** carreras, rankings y palmarés siguen pendientes. Los datos de usuarios y sesiones en el proyecto Neon están actualmente vacíos; no hay hashes scrypt previos que deban migrarse.
4. **Frontend y CORS:** probar Android, EventSource, reconexiones y errores de red contra el Worker sin cambiar todavía el dominio público.
5. **Carga y límites:** probar múltiples salas simultáneas, CPU, alarmas, requests y consumo de Durable Objects.
6. **Corte:** publicar Pages, configurar bindings y secretos, y cambiar el frontend únicamente después de aprobar las pruebas.

## Comandos locales

```sh
npm install
npm run test:cloudflare
npm run cf:dev
```

No ejecutar npm run cf:deploy ni cambiar el backend público hasta terminar las fases pendientes.
