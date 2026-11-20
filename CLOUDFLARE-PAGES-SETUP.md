# Publicación del frontend en Cloudflare Pages

## Estado

El frontend estático se genera directamente desde `public/`. Las Pages Functions de `functions/` reenvían únicamente las rutas dinámicas del juego al Worker `clash-futbol-edge` mediante un Service binding llamado `CLASH_API`. El archivo `public/_routes.json` limita las invocaciones de Functions a esas rutas, dejando los archivos estáticos servidos directamente por Pages.

El Worker no necesita una URL pública `workers.dev`, rutas ni dominio propio: el Service binding permite que Pages lo invoque internamente.

## Configuración del proyecto Pages

Crear el proyecto desde el repositorio `carp1901/liga-fc1`, seleccionando la rama `cloudflare-workers-backend`.

- Framework preset: None
- Build command: dejar vacío
- Build output directory: `public`
- Root directory: `/` (raíz del repositorio)

No crear el proyecto ni iniciar un despliegue hasta que las pruebas previas estén aprobadas.

## Binding requerido

En el proyecto Pages, tanto en Production como en Preview:

1. Settings → Bindings → Add → Service binding.
2. Variable name: `CLASH_API`.
3. Service: `clash-futbol-edge`.
4. Guardar y volver a desplegar Pages cuando el despliegue esté autorizado.

Las funciones eliminan el encabezado Origin en el salto interno. El navegador usa rutas del mismo origen (`/api/*`, `/act`, `/ev` y `/teams.json`), por lo que no se publica el Worker ni se depende de CORS entre dominios.

## Verificaciones antes del corte

- Confirmar que el binding CLASH_API existe en Production y Preview.
- Probar registro/login, perfil, amistades, chat, rankings y palmarés.
- Probar salas públicas, espectadores, SSE, reconexión y acciones.
- Probar Android y reconexiones de EventSource.
- Resolver la partida aleatoria: `POST /api/random` todavía no está portada al runtime Durable Objects. No habilitar el cambio del dominio público mientras falte.
- Ejecutar las pruebas de equivalencia del motor y revisar límites/costos.

El dominio público anterior no se modifica durante estas pruebas. No desplegar el Worker públicamente ni habilitar `workers.dev`, rutas o dominios hasta aprobar las pruebas y autorizar el corte.
