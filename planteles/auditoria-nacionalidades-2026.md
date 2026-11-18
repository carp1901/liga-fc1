# Auditoría de nacionalidades — Argentina 2026

## Alcance y estado de esta tanda

La auditoría cubre los planteles argentinos desde Primera División hasta Promocional Amateur. Se revisan códigos de nacionalidad y se registra una URL de respaldo por cada asignación nueva o existente. No se deduce la nacionalidad por el país del club ni por el apellido.

| División | Filas CSV | Nacionalidad cargada | Pendiente |
|---|---:|---:|---:|
| Primera | 1.012 | 1.012 | 0 |
| Primera Nacional | 1.039 | 1.039 | 0 |
| B Metropolitana | 533 | 533 | 0 |
| Federal A | 883 | 879 | 4 |
| Primera C | 839 | 238 | 601 |
| Promocional Amateur | 518 | 0 | 518 |
| **Total de filas fuente** | **4.824** | **3.701** | **1.123** |

**Nota sobre Primera Nacional:** los seis CSV contienen 1.039 jugadores, mientras que el runtime publicado registra 1.026. Hay 13 registros presentes en los CSV pero no en el runtime; esta auditoría no los importa ni modifica el plantel publicado.

## Trabajo de Federal A

Se asignaron 74 nacionalidades nuevas en esta tanda, con respaldo individual o de nómina de equipo. Se encontraron casos extranjeros y se asignaron sus códigos correspondientes, por ejemplo:

- Felipe Rivarola — Paraguay.
- Hugo Paniagua — Paraguay.
- Juan Bautista Roldán Villalba — Paraguay.
- Los demás casos confirmados de esta tanda — Argentina.

Quedan cuatro jugadores de Federal A sin asignación por falta de una fuente individual suficientemente fiable. Se mantienen vacíos, sin suponer que son argentinos por jugar en clubes del país.

También se corrigió el nombre de **Máximo Ramos** (figuraba como “Maximiliano Ramos”), contrastado con el club y sus registros de partidos.

## Normalización y visualización

- El importador normaliza las nacionalidades a códigos de tres letras y rechaza valores no reconocidos.
- La interfaz dibuja banderas con SVG generado por código; ya no depende de emojis de banderas.
- Se contemplan las nacionalidades presentes en los CSV, incluyendo Argentina, Uruguay, Paraguay, Chile, Brasil, Colombia, Ecuador, Perú, Bolivia, Venezuela, Siria, México, Estados Unidos, España, Portugal, Francia, Italia, Alemania, Hungría, Irlanda, Malasia, Japón, Puerto Rico, Eslovenia, Guatemala, Armenia y Suiza.
- Los nombres antiguos de países se convierten a códigos ISO/compatibles al importar. Las nacionalidades sin respaldo siguen pendientes.

## Pendientes

1. Federal A: resolver los cuatro casos restantes con evidencia individual.
2. Primera C: quedan 601 jugadores sin nacionalidad asignada; 238 ya tienen una asignación registrada.
3. Promocional Amateur: revisar y asignar nacionalidades a 518 jugadores.
4. Verificar las asignaciones preexistentes en las tres divisiones superiores con fuentes individuales cuando haya discrepancias.

En Primera C se verificaron ocho nacionalidades adicionales de Juventud Unida mediante fichas individuales: Alessandro López, Matías Ayala, Franco Cardozo, Julián Carnelos, Juan Chiarantano, Mariano Di Franco, Ian Escobar y Maximiliano Paredes, Enzo Arreguín, Kevin Barrionuevo, Duncan Hughes, Rodrigo Lastra, Tiago Luna, Ángel Luna, Esteban Fernández, Nahuel Aiuto, Luciano Brandán y Alexis Albistur, Braian Maidana, Andrés Molinas, Diego Cardozo y Lautaro Candia, Agustín Burlón, Ezequiel Figueroa, Valentín Díaz, Tomás Lingua Bender, Lucas Cabrera, Gastón David, Sebastián Feletto y Ramiro López. El test `test-nationality-audit.js` controla códigos válidos, fuentes presentes, duplicados internos y cantidades por división.