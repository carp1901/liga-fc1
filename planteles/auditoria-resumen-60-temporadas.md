# Auditoría de equilibrio — resumen de 60 temporadas

**Fecha:** 8 de noviembre de 2026  
**Período simulado:** 2026–2085  
**Estado:** las simulaciones finalizaron correctamente. La publicación automática del primer intento chocó con cambios concurrentes en `main`; se corrigió el workflow para reconciliar la rama antes de publicar.

## Resultados principales

### Primera División: balance de 30 clubes
- 60 temporadas y 120 torneos simulados (Apertura y Clausura).
- 27 campeones distintos.
- Más títulos: Boca Juniors (15), Rosario Central (12) y Belgrano (11).
- Sin títulos en esta muestra: Defensa y Justicia, Huracán e Instituto. Los tres sí registraron presencias frecuentes en posiciones competitivas; no equivale por sí solo a un problema de balance.
- Diferencia de fuerza efectiva entre el más alto y el más bajo: 5,05 puntos.

### Carrera multitemporada desde Primera Nacional
- Inicio: Acassuso, temporada 2026.
- 60 temporadas simuladas y 201 clubes seguidos.
- Se separaron los 30 clubes que comenzaron en Primera de los 36 que comenzaron en Primera Nacional:
  - **Originales de Primera:** 29 de 30 ganaron al menos un torneo de Primera (106 títulos acumulados). 26 descendieron a Nacional y consiguieron volver; Tigre fue el único de estos 30 que llegó a Primera C (dos temporadas).
  - **Originales de Primera Nacional:** 34 de 36 llegaron al menos una vez a Primera. Once consiguieron títulos de Primera, sumando 14 títulos. Cinco llegaron a Primera C: San Telmo (7 temporadas), All Boys (3), Acassuso (2), Chacarita (1) y Colegiales (1). Ciudad de Bolívar y Deportivo Madryn no llegaron a Primera durante el período.
- En el conjunto de las 60 temporadas, 120 títulos de Primera quedaron repartidos entre clubes que comenzaron en Primera o Primera Nacional.

### Renovación generacional
- 11.223 juveniles regenerados en 171 clubes.
- 3.929 regens seguían activos al cierre de 2085.
- Los planteles conservaron su tamaño al reemplazar a los jugadores retirados.

### Validaciones
- Las 15 comprobaciones de ascensos y descensos finalizaron correctamente.
- Las simulaciones de Primera y de carrera desde Nacional terminaron sin errores.

## Límites de esta auditoría

La simulación incluye envejecimiento, retiros, regeneración, ascensos, descensos y resultados de los torneos. El motor ya cuenta con un sistema de desarrollo individual basado en minutos y rendimiento en partidos offline reales. Sin embargo, **el test de 60 temporadas usa `simGame` directamente y no pasa por `developRound`**, por lo que ese desarrollo individual no queda incluido ni validado en esta auditoría. Tampoco se simulan mercado de pases ni cantera. Por eso, estos resultados sirven para validar la estructura de categorías y la renovación de planteles, pero no constituyen todavía una simulación completa de evolución futbolística individual.

## Próxima revisión

Auditar la calibración de medias y la composición de los 66 planteles originales de Primera y Primera Nacional, y luego abordar el desarrollo individual de jugadores sin alterar los planteles de Primera ya cerrados.


## Estado de los 66 planteles de 2026

El inventario de `squads-meta.json` registra **2.039 futbolistas**: 1.013 en Primera (promedio 33,8 por club) y 1.026 en Primera Nacional (promedio 28,5).

- **Integridad básica:** cero nombres duplicados y cero dorsales duplicados; edad, dorsal, nacionalidad y rol específico completos en los 2.039 jugadores.
- **Medias:** 920 verificadas y 1.119 estimadas, todas identificadas como tales. En Primera hay 875 verificadas y 138 estimadas; en Nacional, 45 verificadas y 981 estimadas.
- **Atributos:** 1.173 jugadores tienen atributos manuales y 866 usan atributos derivados por puesto, rol y media.
- **Pie hábil:** falta en 2.008 jugadores; es el principal dato biográfico pendiente, aunque no impide simular los partidos actuales.
- **Tamaño de planteles:** Tigre tiene 46 jugadores; San Lorenzo 40; Estudiantes (LP) y Rosario Central 38. Racing tiene 22. En Nacional, seis clubes tienen 22–23 jugadores: Almagro, Central Norte, Colegiales, Madryn, Racing (Cba.) y San Martín (T).

### Lectura y prioridades

La integridad de los datos básicos está completa, pero la confianza de las medias es muy desigual entre categorías: Primera tiene 86,4% de medias verificadas y Nacional apenas 4,4%. Las estimaciones están identificadas y no se presentan como OVR oficiales; el siguiente trabajo debe calibrarlas con rendimiento y nivel competitivo, sin inventar fuentes.

En cantidad, Tigre es el outlier más claro de Primera y conviene revisar si su lista incluye jugadores de reserva/profundidad que no deberían formar parte del plantel principal. Los planteles de Nacional están entre 22 y 34 jugadores, en línea general con el criterio de XI más banco; los seis de 22–23 merecen comprobar si falta algún suplente clave antes de ampliarlos. No se modificó ningún plantel en esta auditoría.
