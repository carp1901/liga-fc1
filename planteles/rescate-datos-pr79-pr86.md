# Rescate de datos de los PR #79 y #86 (sin aplicar)

> Preparado el 26/11/2026 para cerrar los PR superados sin perder trabajo útil. **Nada de esto se aplicó**: los cambios deben hacerse en la etapa E4 de la auditoría maestra, sobre los CSV actuales de `main` y con una reimportación controlada.
>
> Los PR no se pueden fusionar: sus historias no tienen relación con el `main` actual. Además, sus CSV no tienen nacionalidades (`main` tiene 537 en Primera C y 354 en Promocional), traen una Primera Nacional vieja y versiones viejas del motor. Por eso solo se rescatan los cambios puntuales de abajo.

## 1. Primera C — Lugano (PR #79): 2 correcciones de nombre

Archivo: `planteles/borradores/primera-c-2026/tanda2-inicial.csv`.

| Línea actual en `main` | Nombre actual | Nombre corregido (#79) | Posición | Fuente citada |
|---:|---|---|---|---|
| 185 | Matías Benardoni | **Matías Bernardoni** | DEF | soloascenso.com.ar/club/lugano/289 |
| 208 | Leonel Ovejero | **Axel Ovejero** | DEL | soloascenso.com.ar/club/lugano/289 |

- Solo cambia el nombre. Se conservan la media, el dorsal, la nacionalidad y la fuente de cada fila.
- **No rescatar** el resto de las diferencias de Lugano entre el #79 y `main`. Son composiciones de plantel distintas: `main` re-depuró Lugano después, con el cierre a 30 jugadores por club del PR #83, y esa versión prevalece.
- Antes de aplicar: confirmar los dos nombres en la ficha del jugador (Solo Ascenso u otra). «Ovejero» cambia de nombre de pila, así que podría tratarse de otra persona.

## 2. Promocional — cambios del PR #86

Comparación por club y nombre entre `main` (518 jugadores) y el #86 (509).

### 2.1 Bajas (19)

| Club | Jugador | Posición | Dorsal actual en `main` |
|---|---|---|---:|
| barrancas | Rodrigo Villamayor | DEF | 31 |
| estrellaberisso | Martín Videla | MED | 31 |
| estrellaberisso | Thiago Villoldo | MED | 32 |
| juventudbernal | Abimelec Santiago Vera Núñez | MED | 5 |
| juventudbernal | Elián Muñoz | DEL | 26 |
| juventudbernal | Iván Nieto | DEL | 15 |
| juventudbernal | José Martínez | MED | 29 |
| juventudbernal | Juan Pérez Tello | MED | 9 |
| juventudbernal | Juan Salinas | ARQ | 4 |
| juventudbernal | Lautaro Cáceres | DEL | 12 |
| juventudbernal | Leandro Martínez | DEL | 25 |
| juventudbernal | Tomás Ventresca | MED | 30 |
| juventudbernal | Ulises Velázquez | DEL | 23 |
| sat | Lucas Rastelli | DEL | 31 |
| sat | Valentín Vidal | MED | 32 |
| udprovincial | Lautaro Sapaya | MED | 31 |
| udprovincial | Lukas González | MED | 32 |
| uribelarrea | Axel Nuñez | MED | 31 |
| uribelarrea | Stéfano Gigena | MED | 32 |

- Las 8 bajas fuera de Juventud de Bernal (Barrancas, Estrella de Berisso, SAT, Provincial y Uribelarrea) responden al tope de 30 o 31 jugadores; en `main` esos clubes tienen 31 o 32.
- Las 10 bajas de Juventud de Bernal reemplazan el plantel por el de las planillas de 2026.

### 2.2 Altas (10, todas en Juventud de Bernal)

| Jugador | Posición | Media (estimada) | Fuente citada en el #86 |
|---|---|---:|---|
| **Enzo González** | MED | 44 | soloascenso.com.ar/perfil/enzo-gonzalez/32325 |
| Kevin Thomas Báez | DEL | 43 | soloascenso.com.ar/club/juventud-de-bernal/759 |
| Leonel Conidi | DEF | 41 | ídem |
| Marcos Albet | DEF | 41 | ídem |
| Matías Gómez | ARQ | 42 | ídem |
| Miguel Leguizamón | DEL | 43 | ídem |
| Pedro Amarilla | MED | 42 | ídem |
| Santiago Benavidez | MED | 42 | ídem |
| Sebastián Díaz | DEF | 41 | ídem |
| Ángel Hernández Ramírez | DEL | 43 | ídem |

- **Corrección de lo informado antes:** no eran «9 bajas + 1 alta». Son **19 bajas y 10 altas (neto −9)**. El reemplazo del plantel de Juventud de Bernal debe revisarse como un bloque.
- Las altas del #86 no tienen nacionalidad (el #86 no tiene esa columna). Al aplicarlas sobre `main` hay que conservar el formato actual, con `nat` y `nat_source` vacíos y justificados.
- Las altas de Defensores de Glew (Sebastián Alcaraz y Lucas Arrabito) y el cambio de Metalúrgico **ya están en `main`**: no hay que rescatarlos.

### 2.3 Dorsales de Promocional

- **En `main`:** 456 de 518 jugadores tienen dorsal y **ninguno es oficial**. Son 437 «estimados secuenciales», 11 «internos provisionales secuenciales» y 8 «internos provisionales». Los otros 62 no tienen dorsal y figuran como «pendiente de planilla oficial».
- **En el #86:** los 509 jugadores quedan sin dorsal, con la fuente «Pendiente de verificar en planilla oficial 2026; no se asigna dorsal estimado».
- **Cambio a rescatar:** vaciar los 456 dorsales no oficiales de Promocional y dejar la fuente como pendiente.
- **Antes de aplicarlo, verificar** que el juego tolere jugadores sin dorsal: la interfaz y el 2D muestran números. `test-promocional-amateur-draft` ya admite dorsales vacíos en `main`. Si el juego necesita un número, es preferible mantener el estimado identificado como tal (como en Federal A y B Metro). **Decisión pendiente.**

## 3. Aplicación futura (E4)
1. Primero, el pipeline de datos (IMP-04, IMP-02 e IMP-03 de la auditoría maestra).
2. Después, aplicar las secciones 1 y 2 sobre los CSV de `main`, sin tocar nacionalidades ni el resto de los clubes.
3. Reimportar y correr `test-primera-c-draft`, `test-promocional-amateur-draft` y la comparación entre CSV y juego.
