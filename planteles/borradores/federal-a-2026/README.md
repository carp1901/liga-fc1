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
- FM27 / FM Blog como referencia principal de media y posición, igual que en B Metro. Se toma el Current Ability (CA/ABI) individual en escala 1–99; no el Potential Ability (PA), ni un promedio del club, ni OVR de EA. `rating_source` y `fuente_rol` apuntan a la ficha del primer equipo del club en FM Blog, donde aparece el CA y la posición individual de cada futbolista.
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
- Primera pasada de los diez clubes cargada en CSV: 192 jugadores en total.
- Desglose: Alvarado 20; 9 de Julio 25; Atenas 19; San Martín (Mendoza) 17; Bartolomé Mitre 15; Boca Unidos 19; Cipolletti 17; Defensores de Belgrano (Villa Ramallo) 22; Deportivo Rincón 22; Sol de América 16.
- Archivos individuales y consolidado: `planteles/borradores/federal-a-2026-tanda-1/completo.csv`.
- Control estructural inicial: 34 columnas por registro, 10 IDs de club esperados, 192 nombres sin duplicados dentro de la tanda, ratings ABI 1–99 y sin ajustes globales.
- Pendiente: segunda revisión de nombres/participación, depuración de jugadores que sólo figuran como reserva o sin minutos relevantes, confirmación de edades y dorsales con fuentes individuales y validación con el importador del juego.
- Importación runtime: pendiente; no modificar `public/squads.*` en esta etapa. No está publicado en `main` ni desplegado.
