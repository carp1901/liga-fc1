# Auditoría de pie dominante — Primera Nacional 2026

## Criterio
El usuario autorizó asignar un pie predeterminado si no se encuentra una fuente individual confiable, en particular para juveniles. Las asignaciones predeterminadas se distinguen de las verificadas: no se afirman como datos biográficos confirmados, sino como valores funcionales iniciales para el simulador.

- LI, EI, MI: Izquierdo.
- LD, ED, MD: Derecho.
- POR, DFC, LIB, MCD, MC, MO, MP, DC, SD: Derecho como predeterminado.
- Valores normalizados en CSV: Derecho, Izquierdo y Ambidiestro.

## Resultado de carga

Se completaron los seis bloques de Primera Nacional: 1.026/1.026 jugadores con valor de pie dominante. Se conservaron las siete asignaciones que ya estaban en valores canónicos y se normalizaron 23 etiquetas heredadas DER/IZQ. Los 996 registros realmente vacíos se completaron por rol específico.

| Bloque | Jugadores | Predeterminados nuevos | Valores previos normalizados |
|---|---:|---:|---:|
| 1 | 155 | 150 | 4 |
| 2 | 171 | 165 | 6 |
| 3 | 182 | 179 | 3 |
| 4 | 194 | 190 | 1 |
| 5 | 164 | 157 | 4 |
| 6 | 160 | 155 | 5 |
| **Total** | **1.026** | **996** | **23** |

Además, 7 registros ya tenían un valor canónico antes de esta tanda. 996 + 23 + 7 = 1.026.

**Distribución de los predeterminados nuevos:** 824 derechos y 172 izquierdos. El rol LI/EI/MI recibe zurdo; el resto de los roles identificados recibe diestro.

Los CSV de los seis bloques son la fuente editable de la división. GitHub Actions debe regenerar public/squads.json, public/squads.js y public/squads-meta.json automáticamente; la publicación se considera terminada sólo después de que la ejecución de validación e importación finalice correctamente.
