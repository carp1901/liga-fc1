# Migración progresiva a Cloudflare Workers

## Estado de esta rama

Esta etapa incorpora únicamente la base de transporte de Cloudflare:

- Worker con endpoint `/health`.
- Binding de Durable Objects con almacenamiento SQLite.
- Coordinador por identificador de sala, con persistencia de snapshot y canal SSE experimental.
- Pruebas unitarias locales para el contrato básico.

**No es todavía el backend del juego.** Las rutas existentes (`/act`, `/ev`, salas públicas, autenticación, chat, rankings y moderación) no están conectadas a este Worker. El frontend debe seguir apuntando al backend actual hasta completar y probar cada migración. No configurar Pages ni cambiar el dominio en esta fase.

## Por qué no se copia server.js directamente

El backend actual inicia un servidor HTTP Node, ejecuta un temporizador global que avanza todas las salas, mantiene `E.rooms` en memoria y entrega estados por SSE. Un Worker no ofrece un proceso Node persistente ni garantiza que una instancia permanezca viva. Durable Objects deben asumir la propiedad de cada sala, sus conexiones y su reloj mediante almacenamiento/alarms o WebSockets.

El motor actual (`public/engine.js`) también comparte un registro global `rooms`. Antes de integrarlo hay que extraer una instancia de motor por sala y eliminar la dependencia del registro global, sin alterar el comportamiento de las simulaciones.

## Fases obligatorias

1. **Transporte (actual):** Worker, Durable Object SQLite, health y pruebas.
2. **Motor:** aislar el estado y ciclo de vida de una sala; migrar `act`, `listen`, `snapshot`, `restore`, reconexión y abandono. Comparar resultados contra Node.
3. **Tiempo real:** sustituir el tick global por alarmas por sala y conservar SSE o migrar el cliente a WebSocket; validar Android, espectadores y reconexiones.
4. **Datos:** reemplazar `pg`/pool TCP de `store.js` por el driver HTTP compatible con Workers de Neon; mantener las mismas reglas de cuentas, sesiones, amigos, chat, moderación y rankings.
5. **Pruebas de carga:** 8 y 10 jugadores por sala, varias salas simultáneas, desconexiones, reinicios, límites de CPU/requests y consumo de Durable Objects.
6. **Corte:** solo después de las pruebas, publicar Pages, configurar secretos/bindings y cambiar el frontend.

## Comandos locales

```sh
npm install
npm run test:cloudflare
npm run cf:dev
```

No ejecutar `npm run cf:deploy` hasta que la integración del motor y los endpoints esté terminada y aprobada.
