# Informe de regeneración de planteles (P3)

Comparación entre el juego antes de P3 (commit ecacc7b) y el juego regenerado desde los CSV con tools/regenerar-planteles.js.

| | Antes | Después |
|---|---:|---:|
| Clubes | 170 | 170 |
| Jugadores | 4811 | 4824 |

## Jugadores por división

| División | Antes | Después |
|---|---:|---:|
| Primera División | 1012 | 1012 |
| Primera Nacional | 1026 | 1039 |
| Primera B Metropolitana | 533 | 533 |
| Federal A | 883 | 883 |
| Primera C | 839 | 839 |
| Promocional Amateur | 518 | 518 |

## Altas y bajas por club

| División | Club | Solo antes (sale) | Solo después (entra) |
|---|---|---|---|
| Primera Nacional | allboys | — | Cristo Lozada Echenique |
| Primera Nacional | sanmartintuc | — | Juan Jaime, Alejandro Galván |
| Primera Nacional | tristansuarez | Rodrigo Conechny | Renzo Conechny |
| Primera Nacional | almirantebrown | — | Gastón Moreyra |
| Primera Nacional | gimnasiatiro | Tomás Banega, Joaquín Rocca, Joaquín Capano, Franco Rojas, Javier Aguirre | Tiago Banega, Juan Rocca, Juan Capano, Fabricio Rojas, Jonás Aguirre |
| Primera Nacional | quilmes | Gastón Marinelli, Tomás Ortega | Gonzalo Marinelli, Agustín Ortega |
| Primera Nacional | godoycruz | — | Nicolás Claa, Camilo Alessandria, Leandro Quiroz, Ezequiel Tejada, Bautista Cejas, Gonzalo Quinteros, Bruno Barrionuevo, Antonio Guerrero |
| Primera Nacional | defensoresbelgrano | — | Dilan Acosta |
| Federal A | cipolletti | Maximiliano Ramos | Máximo Ramos |

## Campos cambiados en jugadores que siguen

Nota: 8 nacionalidades de Federal A tanda 3 (Gardella, P. Bravo, Carena, Lesman, R. Pacheco, Dipp Lizondo Said, Santangelo y Luques) estaban como «Argentina» en el CSV; se normalizaron al código «ARG» que exige el test (decisión del 27/11/2026). Conservan su fuente individual. Ya están contadas en «Federal A · nat».

| División · campo | Jugadores | Ejemplos |
|---|---:|---|
| Primera C · nat | 537 | juventudunida/Agustín Burlón: null → "ARG"<br>juventudunida/Alessandro López: null → "ARG" |
| Primera C · natSource | 537 | juventudunida/Agustín Burlón: null → "https://www.footballmanagerblog.org/database/fm27/competitions/14037258-primera-c?playerPage=11"<br>juventudunida/Alessandro López: null → "https://www.footballmanagerblog.org/database/fm27/competitions/14037258-primera-c?playerPage=12" |
| Promocional Amateur · number | 456 | hacoaj/Santiago Andjell Tobal: 1 → null<br>hacoaj/Julián Bespresvany: 2 → null |
| Promocional Amateur · numberSource | 456 | hacoaj/Santiago Andjell Tobal: "Dorsal estimado secuencial para evitar duplicados; no confirmado como dorsal oficial de temporada." → "Pendiente de verificar en planilla oficial 2026; no se asigna dorsal estimado."<br>hacoaj/Julián Bespresvany: "Dorsal estimado secuencial para evitar duplicados; no  |
| Promocional Amateur · nat | 354 | defglew/Marcos Álvarez: null → "ARG"<br>defglew/Ramiro Álvarez: null → "ARG" |
| Promocional Amateur · natSource | 354 | defglew/Marcos Álvarez: null → "BDFA, plantel 2026 de defglew: nacionalidad individual publicada en la ficha del jugador. https://www.bdfa.com.ar/plantel-Defensores-de-Glew-6646.html"<br>defglew/Ramiro Álvarez: null → "https://www.footballmanagerblog.org/database/fm27/competitions/2000446424-argenti |
| Federal A · natSource | 64 | alvarado/J. Susvielles: "Nacionalidad individual no verificada; no se asigna. Fuente de identificación: https://www.mundoascenso.com.ar/plantel/1962-alvarado" → "Transfermarkt: https://www.transfermarkt.com.ar/joaquin-susvielles/profil/spieler/344420"<br>atenas/P. Muchut: "Nacionalidad individual no |
| Federal A · nat | 64 | alvarado/J. Susvielles: null → "Argentina"<br>atenas/P. Muchut: null → "ARG" |
| Primera División · age | 16 | independiente/Juan Arrayago: 17 → 18<br>independiente/Santiago Montiel: 25 → 26 |
| Primera Nacional · r | 1 | quilmes/Thomas Ortega: 65 → 69 |
| Primera Nacional · age | 1 | quilmes/Thomas Ortega: 21 → 25 |
| Primera Nacional · birthDate | 1 | quilmes/Thomas Ortega: "2005-08-30" → "2000-12-06" |
| Primera Nacional · number | 1 | quilmes/Thomas Ortega: 4 → 14 |
| Primera Nacional · specificRole | 1 | quilmes/Thomas Ortega: "LD" → "MC" |
| Primera Nacional · at | 1 | quilmes/Thomas Ortega: {"pas":56,"ctl":56,"reg":53,"rem":47,"des":59,"mar":67,"ant":69,"ref":15} → {"pas":69,"ctl":66,"reg":51,"rem":44,"des":60,"mar":68,"ant":77,"ref":15} |

Detalle completo de edades y datos de Thomas Ortega (Quilmes):

- age: independiente/Juan Arrayago: 17 → 18
- age: independiente/Santiago Montiel: 25 → 26
- age: talleres/Matías Gómez: 20 → 21
- age: huracan/Jordy Caicedo: 28 → 29
- age: gimnasia/Jeremías Langa: 20 → 21
- age: gimnasia/Santiago Villarreal: 20 → 21
- age: argentinos/Mateo Mendoza: 21 → 22
- age: belgrano/Juan Martín Velázquez: 21 → 22
- age: centralcba/Matías Vera: 30 → 31
- age: barracas/Iván Tapia: 27 → 28
- age: instituto/Matías Gallardo: 22 → 23
- age: aldosivi/Andrés Vombergar: 31 → 32
- age: platense/Nicolás Sumavil: 26 → 27
- age: platense/Víctor Cuesta: 37 → 38
- age: defensa/Fernando Román Villalba: 27 → 28
- age: banfield/Santiago Daniele: 20 → 21
- r: quilmes/Thomas Ortega: 65 → 69
- age: quilmes/Thomas Ortega: 21 → 25
- birthDate: quilmes/Thomas Ortega: "2005-08-30" → "2000-12-06"
- number: quilmes/Thomas Ortega: 4 → 14
- specificRole: quilmes/Thomas Ortega: "LD" → "MC"
