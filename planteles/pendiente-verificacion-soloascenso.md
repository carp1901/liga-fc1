# Tarea pendiente: verificar en Solo Ascenso los rescates de los PR #79 y #86

> **Estado:** pendiente desde el 27/11/2026. No se aplicó nada de esta lista.
>
> **Por qué quedó pendiente:** desde la sesión de Claude Code no se pudo leer `soloascenso.com.ar`, porque la red del entorno lo bloquea, y no se aprobó el cambio de red.
>
> **Para quién:** cualquier asistente o persona con acceso web, por ejemplo ChatGPT con navegación.
>
> **Regla:** solo se aplica lo que la fuente confirme. No se completan nombres, posiciones ni dorsales que no figuren.

## Qué verificar

### 1. Primera C — Lugano (PR #79)
**Fuente:** https://www.soloascenso.com.ar/club/lugano/289

| CSV actual (`planteles/borradores/primera-c-2026/tanda2-inicial.csv`) | Corrección propuesta | Posición | Qué confirmar |
|---|---|---|---|
| Matías Benardoni | **Matías Bernardoni** | DEF | Que el plantel lo escriba «Bernardoni» |
| Leonel Ovejero | **Axel Ovejero** | DEL | Que figure «Axel Ovejero» como delantero y que sea el mismo jugador (cambia el nombre de pila: puede ser otra persona) |

Solo cambia el nombre. Se conservan la media, el dorsal, la nacionalidad y las fuentes de la fila.

### 2. Promocional — Juventud de Bernal (PR #86): se reemplaza como un bloque
**Fuentes:**
- https://www.soloascenso.com.ar/club/juventud-de-bernal/759
- https://www.soloascenso.com.ar/perfil/enzo-gonzalez/32325

**Bajas (10):** confirmar que **no** están en la nómina 2026.

| Jugador | Posición |
|---|---|
| Abimelec Santiago Vera Núñez | MED |
| Elián Muñoz | DEL |
| Iván Nieto | DEL |
| José Martínez | MED |
| Juan Pérez Tello | MED |
| Juan Salinas | ARQ |
| Lautaro Cáceres | DEL |
| Leandro Martínez | DEL |
| Tomás Ventresca | MED |
| Ulises Velázquez | DEL |

**Altas (10):** confirmar que **sí** están en la nómina 2026.

| Jugador | Posición | Media estimada (del #86) |
|---|---|---:|
| Enzo González | MED | 44 |
| Kevin Thomas Báez | DEL | 43 |
| Leonel Conidi | DEF | 41 |
| Marcos Albet | DEF | 41 |
| Matías Gómez | ARQ | 42 |
| Miguel Leguizamón | DEL | 43 |
| Pedro Amarilla | MED | 42 |
| Santiago Benavidez | MED | 42 |
| Sebastián Díaz | DEF | 41 |
| Ángel Hernández Ramírez | DEL | 43 |

Si la página no confirma el bloque entero, informar qué coincide y qué no, y **no aplicar** el bloque.

### 3. Promocional — bajas por tope de plantel (PR #86)
Estas 9 bajas surgieron del tope de 30 o 31 jugadores por club (PR #83), no de una fuente. Solo se aplican si la página de cada club confirma que el jugador ya no está.

| Club (`club_id`) | Jugador | Posición |
|---|---|---|
| barrancas | Rodrigo Villamayor | DEF |
| estrellaberisso | Martín Videla | MED |
| estrellaberisso | Thiago Villoldo | MED |
| sat | Lucas Rastelli | DEL |
| sat | Valentín Vidal | MED |
| udprovincial | Lautaro Sapaya | MED |
| udprovincial | Lukas González | MED |
| uribelarrea | Axel Nuñez | MED |
| uribelarrea | Stéfano Gigena | MED |

## Qué entregar
Por cada caso:
- **resultado:** confirmado, no confirmado o no encontrado;
- **evidencia:** el texto tal como aparece en la página;
- **la URL consultada y la fecha de consulta.**

## Cómo se aplica después (por el pipeline, nunca a mano en `public/`)
1. Editar solo las filas afectadas en los CSV de `planteles/borradores/…`:
   - **Lugano:** solo el nombre.
   - **Juventud de Bernal:** las altas van con `dorsal` vacío y `dorsal_source` «Pendiente de verificar en planilla oficial 2026; no se asigna dorsal estimado.», `nat` vacía con `nat_source` justificado, y `rating_source` identificada como estimación propia.
2. Regenerar con `node tools/regenerar-planteles.js`.
3. Correr:
   - `node test-planteles-sync.js`;
   - `node test-primera-c-draft.js` y `node test-promocional-amateur-draft.js`;
   - con la base del pipeline, los dos en modo `--runtime` (ver `.github/workflows/planteles.yml`).

   Si cambian los totales de Promocional (hoy 518), actualizar los textos y conteos de esos tests con el total real.
