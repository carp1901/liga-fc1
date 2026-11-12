# Auditoría general inicial — Primera C 2026, tanda 1

Fecha: 12/11/2026  
Estado: carga preliminar integrada en `main`; auditoría de depuración en curso.

## 1. Alcance y resultado de la carga

Se cargaron 312 registros de siete clubes, utilizando las nóminas 2026 publicadas por Solo Ascenso como base nominal. La importación automatizada validó el CSV, ejecutó el importador en modo dry-run, generó el runtime y comprobó que los planteles ajenos a estos siete clubes quedaran idénticos a `main`.

| Club | Jugadores cargados | ARQ | DEF | MED | DEL |
|---|---:|---:|---:|---:|---:|
| Juventud Unida | 51 | 4 | 15 | 21 | 11 |
| Estrella del Sur | 43 | 6 | 10 | 18 | 9 |
| Argentino de Rosario | 50 | 3 | 11 | 26 | 10 |
| Victoriano Arenas | 37 | 4 | 8 | 18 | 7 |
| Sacachispas | 49 | 4 | 14 | 23 | 8 |
| Leandro N. Alem | 47 | 5 | 14 | 22 | 6 |
| Club Mercedes | 35 | 4 | 12 | 11 | 8 |
| **Total** | **312** | **30** | **84** | **139** | **59** |

Las siete cantidades y las categorías de posición coinciden con las nóminas publicadas de Solo Ascenso: [Juventud](https://www.soloascenso.com.ar/club/juventud-unida/284), [Estrella](https://www.soloascenso.com.ar/club/estrella-del-sur-alejandro-korn/900), [Argentino](https://www.soloascenso.com.ar/club/argentino-de-rosario/243), [Victoriano](https://www.soloascenso.com.ar/club/victoriano-arenas/314), [Sacachispas](https://www.soloascenso.com.ar/club/sacachispas-fc/300), [Alem](https://www.soloascenso.com.ar/club.php?_pagi_pg=12&eq=285) y [Mercedes](https://www.soloascenso.com.ar/club/mercedes/438).

## 2. Controles automáticos

- 312 jugadores cargados en 7 clubes.
- 0 nombres repetidos dentro de un mismo club.
- 0 dorsales duplicados dentro de un mismo club.
- 0 dorsales vacíos.
- 312 dorsales marcados como estimados; no se los presenta como dorsales oficiales.
- 312 medias marcadas como estimaciones propias iniciales.
- Media global provisional: 44,1; rango actual: 42–46.
- No se completaron edades, nacionalidades, pie hábil ni roles específicos por inferencia.

## 3. Alertas de composición y tamaño

Los planteles de 35 a 51 jugadores son demasiado grandes para considerarlos definitivos sin una depuración de apariciones. La distribución también muestra acumulación de arqueros y mediocampistas:

- Estrella del Sur tiene 6 arqueros.
- Leandro N. Alem tiene 5 arqueros.
- Juventud, Victoriano, Sacachispas y Mercedes tienen 4 arqueros cada uno.
- Argentino tiene 26 mediocampistas; Sacachispas 23; Alem 22 y Juventud 21.

Esto no implica borrar automáticamente jugadores. El siguiente corte debe distinguir titulares, rotación, suplentes con minutos, juveniles inscritos, futbolistas sin participación y bajas confirmadas. El objetivo sigue siendo conservar un plantel realista con al menos 22 jugadores y siete alternativas de banco, sin completar cupos con futbolistas sin evidencia.

## 4. Identidades y movimientos ya resueltos

### Juventud Unida

Fernando Giménez no falta por error en la carga: fue goleador del equipo, pero el 23/07/2026 salió a préstamo a Villa Dálmine. Antes de salir había jugado 10 partidos y marcado cinco goles. Por eso no debe incluirse en el plantel de cierre de Juventud, aunque sí conservarse en el historial de participación 2026. Fuentes: [nota de salida](https://www.soloascenso.com.ar/notas/sacachispas-fc/salida-sensible-en-juventud-unida-se-fue-su-goleador/230602), [ficha contra Berazategui](https://www.soloascenso.com.ar/ficha/45134).

### Estrella del Sur

Juan Cruz Scarel aparece entre los goleadores de la temporada, pero dejó Estrella y pasó a Argentino de Quilmes en julio de 2026. La ficha de 2026 registra ocho partidos en Primera C y dos goles antes de continuar en Primera B. No debe añadirse al plantel de cierre de Estrella. Fuentes: [Transfermarkt](https://www.transfermarkt.com.ar/juan-cruz-scarel/profil/spieler/1067569), [ZeroZero](https://www.zerozero.pt/jogador/juan-scarel/1025222?epoca_id=155), [nota de su llegada a Argentino de Quilmes](https://www.eldia.com/quilmes/el-nuevo-goleador-que-firmo-con-el-mate-para-hacer-historia-quilmes_1784551980).

### Argentino de Rosario

Dago Sánchez Palencia, Facundo Aronna y Carlos Raga Córdoba fueron participantes de 2026, pero figuran como bajas hacia Defensores de Cambaceres. No deben reincorporarse al plantel de cierre de Argentino. Las altas de Ignacio Canteros y Juan Bautista Cantiani ya aparecen en la nómina. Manuel González figura en el mercado, pero no se incorpora hasta verificar identidad, posición y participación. Fuentes: [plantel y goleadores](https://www.soloascenso.com.ar/club/argentino-de-rosario/243), [mercado de pases](https://www.mundoascenso.com.ar/mercado-de-pases/).

### Lautaro Torres — homónimo resuelto

Hay dos jugadores distintos con ese nombre:
- Estrella del Sur: 23 años, 14 partidos y 5 goles en la Primera C 2026.
- Sacachispas: Lautaro Gabriel Torres, 30 años, 22 presencias y 1 gol.

No se deben fusionar. Fuentes: [perfil de Estrella](https://www.zerozero.pt/jogador/lautaro-torres/1632396?edicao_id=212447), [perfil de Sacachispas](https://www.soloascenso.com.ar/perfil/lautaro-torres/17811).

## 5. Evidencia de participación ya cruzada

Se revisaron fichas de partidos para validar presencia real, no sólo pertenencia a una nómina:
- Juventud y Mercedes: [Juventud 4–1 Mercedes, 30/08/2026](https://www.soloascenso.com.ar/ficha/45257), con titulares y nueve suplentes por equipo.
- Sacachispas y Victoriano: [Sacachispas 0–1 Victoriano, 21/09/2026](https://www.soloascenso.com.ar/ficha/45283), con titulares y suplentes de ambos.
- Leandro N. Alem: [Alem 0–3 Puerto Nuevo, 30/08/2026](https://www.soloascenso.com.ar/ficha/45260) y [J.J. Urquiza 1–2 Alem, 28/09/2026](https://www.soloascenso.com.ar/ficha/45299).
- Estrella del Sur: [Estrella 3–0 Alem, 04/07/2026](https://www.soloascenso.com.ar/ficha/45175).
- Argentino y Juventud: [Juventud 3–0 Argentino, 27/06/2026](https://www.soloascenso.com.ar/ficha/45158).

Los dorsales que aparecen en una ficha de partido son números usados en ese encuentro. No se convierten automáticamente en dorsales permanentes de temporada cuando no hay corroboración adicional.

## 6. Pendientes de la auditoría completa

1. Obtener perfiles individuales y presencias de los 312 jugadores para distinguir titulares, rotación y nombres nominales sin minutos.
2. Revisar altas, bajas, préstamos y homónimos club por club con fecha de corte de 2026.
3. Reducir planteles sólo donde la evidencia lo justifique; no imponer un número exacto de jugadores.
4. Corregir posiciones y asignar roles específicos (POR, DFC, LI, LD, MCD, MC, MCO, EI, ED, DC, etc.) con evidencia.
5. Completar edades, pie hábil y nacionalidades con fuentes fiables.
6. Sustituir medias provisionales por referencias individuales cuando existan; recalibrar el resto por rendimiento y nivel competitivo.
7. Reemplazar dorsales estimados por números confirmados cuando se encuentre evidencia de temporada; mantener estimados los restantes, siempre únicos y marcados.

**Conclusión:** la carga inicial está integrada y supera los controles de integridad básicos. No debe considerarse todavía una auditoría final ni una depuración de planteles. El próximo trabajo es la revisión individual de los siete clubes, manteniendo el runtime como base editable.
