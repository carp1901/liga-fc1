# Verificación en Solo Ascenso de los rescates de los PR #79 y #86

> **Estado:** verificado el **27/11/2026** por el dueño del proyecto, consultando Solo Ascenso (las fuentes de abajo).
>
> **Resultado:** **no se aplica ninguno de los rescates.** No se modificaron CSV ni planteles y no se regeneró `public/squads.*`.
>
> **PR #79 y #86:** siguen abiertos. Su cierre lo decide el dueño del proyecto.
>
> **Regla aplicada:** solo se cambia lo que la fuente confirma, sin completar nombres, posiciones ni dorsales que no figuren.
>
> **Historia:** este archivo nació como tarea pendiente, porque desde la sesión de Claude Code no se podía leer `soloascenso.com.ar` (la red del entorno lo bloquea). La verificación se hizo fuera de esa sesión.

## 1. Primera C — Lugano (PR #79): no aplicar
**Fuente:** https://www.soloascenso.com.ar/club/lugano/289 (consultada el 27/11/2026)

| CSV actual (`planteles/borradores/primera-c-2026/tanda2-inicial.csv`) | Corrección que proponía el #79 | Resultado |
|---|---|---|
| Matías Benardoni | Matías Bernardoni | **No confirmado: no cambiar.** Se mantiene «Matías Benardoni». |
| Leonel Ovejero (DEL) | Axel Ovejero | **No confirmado: no reemplazar.** La fuente muestra a Leonel Ovejero en la nómina, y a Axel Ovejero como una incorporación distinta, no como el mismo jugador. |

## 2. Promocional — Juventud de Bernal (PR #86): no aplicar el bloque
**Fuentes** (consultadas el 27/11/2026):
- https://www.soloascenso.com.ar/club/juventud-de-bernal/759
- https://www.soloascenso.com.ar/perfil/enzo-gonzalez/32325

**Bajas propuestas (10): no confirmadas.** Los 10 jugadores siguen apareciendo en la nómina 2026: Abimelec Santiago Vera Núñez, Elián Muñoz, Iván Nieto, José Martínez, Juan Pérez Tello, Juan Salinas, Lautaro Cáceres, Leandro Martínez, Tomás Ventresca y Ulises Velázquez.

**Altas propuestas (10): 9 aparecen, y con diferencias.**

| Jugador | Posición en el #86 | Resultado |
|---|---|---|
| Enzo González | MED | Aparece |
| Kevin Thomas Báez | DEL | **Figura en LIBRES, como defensor** |
| Leonel Conidi | DEF | Aparece |
| Marcos Albet | DEF | Aparece |
| Matías Gómez | ARQ | Aparece |
| Miguel Leguizamón | DEL | Aparece, **pero como defensor** |
| Pedro Amarilla | MED | Aparece |
| Santiago Benavidez | MED | Aparece |
| Sebastián Díaz | DEF | Aparece |
| Ángel Hernández Ramírez | DEL | Aparece, **pero como defensor** |

**Conclusión: no aplicar el bloque.** La fuente no confirma el reemplazo: las bajas siguen en la nómina, una alta está libre y dos tienen otra posición.

## 3. Promocional — bajas por tope de plantel (PR #86): no aplicar
Ninguno de los 9 casos tiene evidencia que justifique eliminar al jugador: los nueve siguen apareciendo en las nóminas consultadas (27/11/2026).

| Club (`club_id`) | Jugador | Resultado |
|---|---|---|
| barrancas | Rodrigo Villamayor | Sigue en la nómina: no eliminar |
| estrellaberisso | Martín Videla | Sigue en la nómina: no eliminar |
| estrellaberisso | Thiago Villoldo | Sigue en la nómina: no eliminar |
| sat | Lucas Rastelli | Sigue en la nómina: no eliminar |
| sat | Valentín Vidal | Sigue en la nómina: no eliminar |
| udprovincial | Lautaro Sapaya | Sigue en la nómina: no eliminar ⚠️ |
| udprovincial | Lukas González | Sigue en la nómina: no eliminar ⚠️ |
| uribelarrea | Axel Nuñez | Sigue en la nómina: no eliminar |
| uribelarrea | Stéfano Gigena | Sigue en la nómina: no eliminar |

⚠️ **Pendiente:** confirmar que el club de Solo Ascenso «Provincial (Lobos)» es el mismo que el `club_id` `udprovincial` del juego.

## 4. Pendientes que quedan
1. **Equivalencia de clubes:** «Provincial (Lobos)» ↔ `udprovincial`. Es solo una confirmación de identidad; no cambia ningún dato.
2. **Posibles correcciones a futuro:** surgieron de esta verificación pero no forman parte de los rescates, y no se aplican sin una decisión aparte:
   - Kevin Thomas Báez figura libre;
   - Miguel Leguizamón y Ángel Hernández Ramírez figuran como defensores.

   Ninguno de los tres está hoy en el CSV de Juventud de Bernal: eran altas del #86. Si en algún momento se incorporan, tiene que ser con la posición que muestra la fuente.
3. **Cierre de los PR #79 y #86:** lo decide el dueño del proyecto. Con este resultado, ninguno de sus cambios de datos queda por rescatar.
