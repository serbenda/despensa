# despensa

Guía práctica de alimentación para toda la familia: perder peso sin dietas milagro, comer bien de pequeños y rendir entrenando. Basada en fuentes públicas.

## Qué tiene

Cada sección empieza con un resumen de 30 segundos, sigue con herramientas para tu caso y termina con el detalle y las fuentes.

- **Portada**: el método del plato interactivo, entrada por objetivos y las seis claves con más respaldo.
- **Perder peso**: cintura y IMC, simulador de pequeños cambios, raciones con la mano, escala del hambre, semáforo de etiquetas, ultraprocesados, mitos y cuándo pedir ayuda.
- **Niños**: qué puede comer según su edad (mercurio, nitratos, arsénico, atragantamientos), raciones con su mano, consejos por etapas, fiambreras, azúcar en terrones, sueño y pantallas, y señales para consultar.
- **Entrenar**: plan de hidratos, proteína y agua según peso y carga del día, calculadora de sudoración, un día de ejemplo, suplementos según la evidencia y el déficit energético en el deporte.
- **Nutrientes**: explorador de fibra, calcio, hierro, omega-3 y sal con gráficos por ración; agua; vitaminas que cuestan; embarazo, dieta vegetariana y mayores de 65.
- **Menú y compra**: menú semanal según las frecuencias de la AESAN, lista de la compra por pasillos y calendario de temporada.
- **Herramientas**: todas las calculadoras en una página.
- **Datos**: cómo comemos en España con cifras oficiales y gráficos.

Las herramientas calculan en el navegador. Lo único que se guarda, y solo en el navegador de quien la usa, es la altura y el peso para no tener que repetirlos.

## Cómo está hecha

Web estática en HTML, CSS y JavaScript sin dependencias ni compilación, pensada para GitHub Pages. Para verla en local:

```bash
python3 -m http.server 8000
```

y abre <http://localhost:8000>.

```
index.html      portada y plato interactivo
peso.html       perder peso
ninos.html      niños
entrenar.html   entrenar
nutrientes.html nutrientes clave, agua y etapas especiales
herramientas.html todas las herramientas
menu.html       menú semanal, lista de la compra y temporada
datos.html      datos oficiales y gráficos
404.html        página no encontrada
css/            estilos compartidos (modo claro y oscuro)
js/comun.js     cabecera, pie y cambio de tema
js/plato.js     plato de la portada
js/platos.js    recetario y zonas del súper
js/menu.js      generador de menú y lista de la compra
js/temporada.js calendario de fruta y verdura de temporada
js/graficos.js  gráficos SVG sin dependencias (barras, líneas y terrones)
js/herramientas.js herramientas interactivas (data-herramienta="…")
```

## Fuentes

- [AESAN: recomendaciones dietéticas sostenibles y de actividad física](https://www.aesan.gob.es/AECOSAN/web/nutricion/subseccion/recomendaciones_dieteticas.htm)
- [OMS: alimentación sana](https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet) y [actividad física](https://www.who.int/es/news-room/fact-sheets/detail/physical-activity)
- [AEP: En Familia](https://enfamilia.aeped.es/)
- [Harvard: el plato para comer saludable](https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/translations/spanish/)
- [INE: Encuesta de Salud de España 2023](https://www.ine.es/dyngs/Prensa/es/ESdE2023.htm) y [monográfico de alimentación](https://www.sanidad.gob.es/gl/estadEstudios/estadisticas/encuestaSaludEspana/monografico3_ESdE2023_ResumenEjecutivo.pdf)
- [AESAN: estudio ALADINO 2023](https://aesan.gob.es/nutricion/datos-sobrepeso-obesidad/aladino-2023)
- [Mercasa con datos del MAPA: consumo alimentario en los hogares 2024](https://www.mercasa.es/wp-content/uploads/2026/01/datos-basicos-7-consumo-alimentario.pdf)
- [BEDCA: Base de Datos Española de Composición de Alimentos](https://www.bedca.net/)
- [EFSA: valores dietéticos de referencia](https://www.efsa.europa.eu/es/topics/topic/dietary-reference-values)
- [ACSM, AND y DC: nutrición y rendimiento deportivo (2016)](https://pubmed.ncbi.nlm.nih.gov/26891166/)
- [Australian Institute of Sport: marco de suplementos](https://www.ais.gov.au/nutrition/supplements)
- [AEP: prevención de atragantamientos](https://aeped.es/sites/default/files/atragantamiento_csvaep_final.pdf)

despensa es divulgativa y no sustituye la consulta con un profesional sanitario.

## Licencia

© 2026 Sergio Santiago Bendaña Quesada. Todos los derechos reservados. Consulta [LICENSE](LICENSE).
