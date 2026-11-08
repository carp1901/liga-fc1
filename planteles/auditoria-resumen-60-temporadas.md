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

La simulación incluye envejecimiento, retiros, regeneración, ascensos, descensos y resultados de los torneos. **Todavía no simula el desarrollo individual de cada futbolista según minutos, rendimiento y entrenamiento durante toda la temporada.** Tampoco incluye mercado de pases ni cantera. Por eso, estos resultados sirven para validar la estructura de categorías y la renovación de planteles, pero no constituyen todavía una simulación completa de evolución futbolística individual.

## Próxima revisión

Auditar la calibración de medias y la composición de los 66 planteles originales de Primera y Primera Nacional, y luego abordar el desarrollo individual de jugadores sin alterar los planteles de Primera ya cerrados.
