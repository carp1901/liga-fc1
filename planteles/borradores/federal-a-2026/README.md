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

- Temporada 2026; primera plantilla y jugadores con participación relevante, sin reservas ni juveniles sin minutos verificables. Todo club debe disponer de al menos 18 futbolistas cargados: 11 titulares y 7 suplentes.
- FM27 / FM Blog como referencia principal de media y posición, igual que en B Metro. Se toma el Current Ability (CA/ABI) individual en escala 1–99; no el Potential Ability (PA), ni un promedio del club, ni OVR de EA. `rating_source` y `fuente_rol` apuntan a la ficha del primer equipo del club en FM Blog, donde aparece el CA y la posición individual de cada futbolista.
- Pertenencia al plantel 2026 verificada mediante la ficha de Mundo Ascenso y/o fuentes de plantel del club/competición, y contrastada con la primera plantilla FM27 cuando hay ficha individual. No se incorporan jugadores que sólo aparezcan en desarrollo/U20 ni jugadores que FM27 identifique como cedidos a otro club.
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
- Primera tanda depurada: **199 jugadores de diez clubes**, con coincidencia individual entre la ficha de plantel 2026 de Mundo Ascenso y la primera plantilla FM27 / FM Blog.
- Desglose: Alvarado 20; 9 de Julio (Rafaela) 25; Atenas (Río Cuarto) 19; San Martín (Mendoza) 18; Bartolomé Mitre (Posadas) 18; Boca Unidos 19; Cipolletti 18; Defensores de Belgrano (Villa Ramallo) 22; Deportivo Rincón 22; Sol de América (Formosa) 18.
- Las 199 edades se completaron desde las fichas FM27 individuales. La CA/ABI es la capacidad actual, no la PA.
- Dorsales: quedan vacíos. Mundo Ascenso presenta duplicaciones de camisetas y fichas repetidas/históricas para varios clubes; no se asignan números sin poder distinguir un dorsal vigente y único.
- Nacionalidades corregidas desde las fichas FM27: Luis Uliambre (PAR), Jair Blanco (COL) y José Cabañas (PAR).
- Archivos individuales y consolidado: `planteles/borradores/federal-a-2026-tanda-1/completo.csv`.
- Validación: 34 columnas, 199 edades, diez IDs de club esperados, sin duplicados internos, ratings ABI 1–99, `rating_base` igual a `rating` y ajuste 0.
- CI: el workflow del PR valida el CSV, ejecuta `dry-run`, integra los diez clubes en el runtime de la rama y compara cada jugador importado contra el CSV.
- Importación runtime: integrada en la rama del PR mediante `import-squads.js`; la prueba compara los 199 jugadores del runtime contra el CSV y pasó. Queda pendiente integrar el PR en `main` para que entre en la versión publicada.


## Corrección de banco mínimo

- Se detectó que cuatro planteles tenían menos de 18 futbolistas. Se añadieron siete jugadores con fuentes contrastables: Leandro Barrera (San Martín Mza); Lucciano Arraya Feraud, Esteban Klyniauk y Bruno Rodríguez (Bartolomé Mitre); Fernando Pettineroli (Cipolletti); Javier Sosa y Matías Olmedo (Sol de América).
- El test de runtime ahora recorre los 98 clubes cargados y falla si alguno queda por debajo de 18 jugadores.
- Los cuatro planteles que estaban incompletos quedan en 18 cada uno; los otros seis mantienen su cantidad original.
