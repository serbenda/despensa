# despensa

Guía práctica de alimentación para toda la familia: perder peso sin dietas milagro, comer bien de pequeños y rendir entrenando. Basada en fuentes públicas.

## Qué tiene

- **Portada** con el método del plato interactivo: medio plato de verdura, un cuarto de cereal y un cuarto de proteína.
- **Perder peso**: cambios sostenibles, escala del hambre, cambios en la compra, cómo leer etiquetas y mitos.
- **Niños**: reparto de responsabilidades en la mesa, consejos por edades (1-3, 4-8 y 9-12 años), desayunos, meriendas, fiambrera y el «no me gusta».
- **Entrenar**: qué comer antes, durante y después, calculadora de rango de proteína, hidratación y suplementos.
- **Menú y compra**: generador de menú semanal según las frecuencias de la AESAN, con opción sin carne ni pescado, cambio de platos, comprobación de las raciones semanales, lista de la compra por zonas del súper que se guarda en el navegador y calendario de fruta y verdura de temporada.
- **Datos**: cómo comemos en España con cifras oficiales (Encuesta de Salud de España 2023, ALADINO 2023, consumo en hogares 2024) y gráficos interactivos.

Cada sección incluye gráficos propios: cuánta comida son 100 kcal, el azúcar en terrones, la proteína por ración. Todos los gráficos son SVG hechos a mano, tienen tooltip, se pueden recorrer con teclado y llevan una tabla con los datos y la fuente.

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

despensa es divulgativa y no sustituye la consulta con un profesional sanitario.

## Licencia

© 2026 Sergio Santiago Bendaña Quesada. Todos los derechos reservados. Consulta [LICENSE](LICENSE).
