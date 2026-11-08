# Auditoría de pie dominante — temporada 2026

## Criterio
- Registrar sólo pie dominante respaldado por una ficha individual del futbolista.
- Prioridad: Sofascore, FotMob, EA SPORTS FC/FIFA Index u otra base individual fiable.
- Valores CSV: `Derecho` / `Izquierdo`.
- No inferir por posición, nacionalidad, perfil táctico ni uso frecuente de una pierna.
- Si no hay fuente individual clara, dejar vacío y mantenerlo pendiente.
- Cada fila completada debe tener una fuente identificable en este registro.

## Primera tanda — San Lorenzo
Fecha de revisión: 08/11/2026.

| Jugador | Pie | Fuente |
|---|---|---|
| Mateo Clemente | Izquierdo | https://fifaindex.com/es-mx/jugadores/71462-mateo-clemente/fc26 |
| Facundo Altamirano | Derecho | https://www.sofascore.com/es/football/player/facundo-altamirano/794812 |
| José Devecchi | Derecho | https://www.sofascore.com/es/football/player/jose-devecchi/578460 |
| Teo Rodríguez Pagano | Izquierdo | https://www.sofascore.com/es/football/player/teo-rodriguez-pagano/1893304 |
| Mathías De Ritis | Izquierdo | https://www.sofascore.com/es/football/player/de-ritis-mathias/1199467 |
| Gastón Hernández | Derecho | https://www.sofascore.com/es/football/player/gaston-hernandez/980886 |
| Ezequiel Herrera | Derecho | https://www.fotmob.com/es/players/1353126/ezequiel-herrera |
| Emiliano Amor | Derecho | https://www.sofascore.com/es/football/player/emiliano-amor/780178 |
| Guzmán Corujo | Derecho | https://www.sofascore.com/es/football/player/guzman-corujo/874970 |
| Alejo Córdoba | Derecho | https://www.fotmob.com/es/players/1737755/alejo-cordoba |

**Resultado:** 10 pies dominantes verificados y cargados en `planteles/primera-2026.csv`. La importación automática del repositorio debe reflejar estos valores en los planteles publicados; la actualización de la base generada se verifica por separado.


## Segunda tanda — San Lorenzo
Fecha de revisión: 08/11/2026.

| Jugador | Pie | Fuente |
|---|---|---|
| Ignacio Perruzzi | Derecho | https://www.sofascore.com/es-la/football/player/ignacio-perruzzi/2035649 |
| Manuel Insaurralde | Derecho | https://www.fotmob.com/es/players/972814/manuel-insaurralde |
| Nicolás Tripichio | Derecho | https://www.sofascore.com/es-la/football/player/nicolas-tripichio/358924 |
| Martín Río | Derecho | https://www.sofascore.com/es-la/football/player/martin-rio/1083012 |
| Nahuel Barrios | Derecho | https://www.fotmob.com/es-419/players/838234/nahuel-barrios |

**Resultado acumulado:** 15 jugadores con pie dominante verificado y cargado en el CSV.

### Pendientes por discrepancia
- **Facundo Gulli:** FotMob lo identifica como zurdo (https://www.fotmob.com/es/players/1781586/facundo-gulli), mientras Sofascore lo identifica como diestro (https://www.sofascore.com/es/football/player/facundo-gulli/2188350). Se deja vacío hasta resolver la discrepancia; no se elige arbitrariamente una fuente.
