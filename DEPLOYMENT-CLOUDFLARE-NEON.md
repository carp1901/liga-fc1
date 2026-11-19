# Despliegue separado: Cloudflare Pages + Node + Neon

Esta migración separa el sitio estático del servidor de partidas. No cambia la lógica de juego ni mueve datos antiguos.

## 1. Cloudflare Pages (frontend)

- Conectar el repositorio `carp1901/liga-fc1`.
- Rama: `migracion-cloudflare-neon` durante las pruebas; usar la rama estable acordada al publicar.
- Framework preset: **None**.
- Build command: vacío.
- Build output directory: `public`.
- Root directory: vacío.
- No configurar secretos de PostgreSQL en Pages.

Antes de publicar, editar `public/api-config.js` y reemplazar el valor vacío de `window.CF_API_BASE` por la URL HTTPS del backend Node (por ejemplo, `https://api.tudominio.com`). No agregar una barra final.

## 2. Servidor Node (VM)

El backend debe ejecutarse en una VM/servidor Node persistente. No usar Cloudflare Pages Functions para este proceso: el juego mantiene salas y conexiones SSE en memoria.

Desde la raíz del repositorio:

```sh
npm ci
npm start
```

Variables de entorno requeridas/recomendadas:

- `PORT=3000` (o el puerto asignado por el proveedor).
- `DATABASE_URL`: connection string de Neon; cargarla como secreto en el panel del proveedor, nunca en Git.
- `FRONTEND_ORIGINS`: orígenes permitidos separados por coma, sin rutas. Ejemplo: `https://tu-proyecto.pages.dev,https://tudominio.com`.
- `SERVE_STATIC=0`: evita servir copias del frontend desde el backend.
- `CHAT_OWNER_USERNAME`: usuario real que debe tener permisos de propietario del chat. Configurarlo antes del lanzamiento; no asumir el valor por defecto actual.
- `NODE_ENV=production`.

El servidor expone `/health` para comprobar que está activo. El backend responde CORS solo a los orígenes enumerados en `FRONTEND_ORIGINS`; no habilitar comodines.

## 3. Neon PostgreSQL

- Usar el proyecto Neon ya creado para CLASH FUTBOL.
- Copiar la connection string desde Neon y guardarla como `DATABASE_URL` en el proveedor del backend.
- Mantener SSL habilitado.
- Al iniciar, `store.js` crea/verifica las tablas necesarias, incluidas cuentas, sesiones, carreras, amistades, perfiles y moderación del chat.
- No se requiere migrar la base prototipo anterior: se acordó comenzar limpia.

## 4. Orden seguro de puesta en marcha

1. Crear/configurar el backend y cargar secretos.
2. Comprobar `https://URL-DEL-BACKEND/health`.
3. Publicar Pages con `CF_API_BASE` apuntando al backend.
4. Probar registro/login, chat, salas, reconexión SSE, rankings y títulos offline.
5. Recién después de esas pruebas, cambiar el dominio público.

## Importante

- No se ha desplegado nada ni se ha reactivado Render.
- Las salas online viven en memoria del proceso: usar una sola instancia Node mientras no exista una capa compartida de salas/estado.
- Si el proceso Node se reinicia, las salas activas se pierden. Neon conserva cuentas e historial.
- Para HTTPS, poner el backend detrás de un proxy TLS o usar un proveedor que entregue HTTPS.
