# Federal A 2026 — tanda 1

Trabajo en rama separada. Esta tanda contiene los primeros diez clubes del registro Federal A de `public/data.js`; no publica ni reemplaza planteles del runtime hasta completar y validar los diez.

## Clubes

1. `nuevejulio` — 9 de Julio (Rafaela)
2. `alvarado` — Alvarado
3. `atenas` — Atenas (Río Cuarto)
4. `atsanmartinmza` — Atlético San Martín (Mendoza)
5. `bmitre` — Bartolomé Mitre (Posadas)
6. `bocaunidos` — Boca Unidos
7. `cipolletti` — Cipolletti
8. `defbelgranovr` — Defensores de Belgrano (Villa Ramallo)
9. `rincon` — Deportivo Rincón
10. `soldeamerica` — Sol de América (Formosa)

## Criterio de relevamiento

- Temporada 2026; primera plantilla y jugadores con participación relevante, sin reservas ni juveniles sin minutos verificables.
- FM27 / FM Blog como referencia principal de media y posición, igual que en B Metro. Se toma el Current Ability (CA/ABI) individual en escala 1–99; no el Potential Ability (PA), ni un promedio del club, ni OVR de EA. Cada ficha debe conservar su enlace individual de FM Blog en `rating_source` y `fuente_rol`.
- Pertenencia al plantel 2026 y participación contrastadas con nóminas y registros de competición (Mundo Ascenso, AFA y fuentes de clubes).
- Los dorsales y fechas de nacimiento se cargan sólo cuando hay respaldo individual. Si faltan, quedan vacíos.
- No se inventan futbolistas, edades, dorsales, nacionalidades ni pies dominantes. Las estimaciones propias sólo se usan con participación comprobable y quedan identificadas.
- No se aplica el +10 de Primera/Primera Nacional. Se conserva ABI como base, sin ajuste general.

## Fuentes de estructura y pertenencia

- Reglamento AFA Federal A 2026: https://assets1.afa.com.ar/2026/BOLETINES/14-REGLAMENTO-FEDERAL-A-2026-14.04.26.pdf
- Participantes 2026: https://ascensodelinterior.com.ar/noticias/35763/federal-a%3A-los-37-participantes-de-la-edicin-2026
- Planteles 2026: Mundo Ascenso, ficha individual por club.
- Base FM27 Federal A: https://www.footballmanagerblog.org/database/fm27/competitions/108509-torneo-federal-a (37 clubes, 960 futbolistas indexados).
- Fichas de primer equipo FM27 consultadas para los diez clubes de esta tanda: Alvarado, Boca Unidos, Cipolletti, Defensores (VR), Sol de América (Formosa), Atenas (Río Cuarto), 9 de Julio (Rafaela), Deportivo Rincón, Bartolomé Mitre (Posadas) y San Martín (Mendoza). La base FM es referencia de capacidad/posición, no prueba suficiente de pertenencia al plantel real 2026.

## Estado

- Rama: `federal-a-2026-tanda-1`
- Referencia FM27: fichas de los diez clubes localizadas y consultadas; pendiente el cruce individual contra los planteles reales 2026.
- CSV de jugadores: pendiente de completar y auditar.
- Importación runtime: pendiente; no modificar `public/squads.*` en esta etapa.
- Validación: se añadirá cuando estén completos los diez clubes.
