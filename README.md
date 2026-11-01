# despensa

Guía práctica de alimentación para toda la familia: perder peso sin dietas milagro, comer bien de pequeños y rendir entrenando. Basada en fuentes públicas.

## Qué tiene

- **Portada** con el método del plato interactivo: medio plato de verdura, un cuarto de cereal y un cuarto de proteína.
- **Perder peso**: cambios sostenibles, escala del hambre, cambios en la compra, cómo leer etiquetas y mitos.
- **Niños**: reparto de responsabilidades en la mesa, consejos por edades (1-3, 4-8 y 9-12 años), desayunos, meriendas, fiambrera y el «no me gusta».
- **Entrenar**: qué comer antes, durante y después, calculadora de rango de proteína, hidratación y suplementos.
- **Menú y compra**: generador de menú semanal según las frecuencias de la AESAN, con opción sin carne ni pescado, cambio de platos y lista de la compra por zonas del súper que se guarda en el navegador.

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
menu.html       menú semanal y lista de la compra
css/            estilos compartidos (modo claro y oscuro)
js/comun.js     cabecera, pie y cambio de tema
js/plato.js     plato de la portada
js/platos.js    recetario y zonas del súper
js/menu.js      generador de menú y lista de la compra
```

## Fuentes

- [AESAN: recomendaciones dietéticas sostenibles y de actividad física](https://www.aesan.gob.es/AECOSAN/web/nutricion/subseccion/recomendaciones_dieteticas.htm)
- [OMS: alimentación sana](https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet) y [actividad física](https://www.who.int/es/news-room/fact-sheets/detail/physical-activity)
- [AEP: En Familia](https://enfamilia.aeped.es/)
- [Harvard: el plato para comer saludable](https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/translations/spanish/)

despensa es divulgativa y no sustituye la consulta con un profesional sanitario.

## Licencia

© 2026 Sergio Santiago Bendaña Quesada. Todos los derechos reservados. Consulta [LICENSE](LICENSE).
