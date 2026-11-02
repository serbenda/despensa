# despensa

Guía práctica de alimentación para toda la familia: perder peso sin dietas milagro, comer bien de pequeños y rendir entrenando. Con herramientas interactivas, datos oficiales y criterio de nutricionista.

**Web:** <https://serbenda.github.io/despensa/>

![Portada de despensa: titular, plato interactivo sobre azulejo y menú de secciones](docs/capturas/portada.png)

## Índice

- [Qué es](#qué-es)
- [Recorrido por la web](#recorrido-por-la-web)
- [Herramientas](#herramientas)
- [Rigor y fuentes](#rigor-y-fuentes)
- [Diseño](#diseño)
- [Cómo está hecha](#cómo-está-hecha)
- [Cómo ampliarla](#cómo-ampliarla)
- [Probar, publicar y flujo de trabajo](#probar-publicar-y-flujo-de-trabajo)
- [Privacidad](#privacidad)
- [Licencia](#licencia)

## Qué es

despensa traduce las recomendaciones oficiales de alimentación (AESAN, EFSA, OMS, sociedades de pediatría y de nutrición deportiva) a decisiones de cada día: qué poner en el plato, qué comprar, qué darle a un niño según su edad o cuánto comer y beber si entrenas.

Está pensada para familias sin formación en nutrición. Por eso cada sección empieza con lo esencial en 30 segundos, sigue con herramientas que responden a tu caso y deja el detalle plegado para quien quiera profundizar.

despensa es divulgativa: no sustituye la consulta con un médico, pediatra o dietista-nutricionista.

## Recorrido por la web

| Página | Qué resuelve | Herramientas |
| --- | --- | --- |
| [Portada](index.html) | El método del plato y la entrada por objetivos: perder peso, niños, entrenar u organizar la semana. Las seis claves con más respaldo científico. | Plato interactivo |
| [Perder peso](peso.html) | Punto de partida, cambios sostenibles, raciones, hambre real, etiquetas, ultraprocesados, mitos y cuándo pedir ayuda. | Cintura e IMC, pequeños cambios, raciones con la mano, escala del hambre, semáforo de la etiqueta, mito o realidad |
| [Niños](ninos.html) | Reparto de papeles en la mesa, seguridad por edad, raciones, desayunos, fiambrera, el «no me gusta», azúcar, sueño y pantallas, señales para consultar. | Qué puede comer según su edad, raciones con su mano, ideas para la fiambrera, azúcar en terrones |
| [Entrenar](entrenar.html) | Combustible y proteína según el día, qué comer y cuándo, hidratación, un día de ejemplo, suplementos según la evidencia y déficit energético. | Plan de combustible, calculadora de sudor, proteína por ración |
| [Nutrientes](nutrientes.html) | Fibra, calcio, hierro, omega-3 y sal; agua; vitamina D, B12, yodo y folato; embarazo, dieta vegetariana y mayores de 65. | Explorador de nutrientes |
| [Menú y compra](menu.html) | Menú de siete días que cumple las frecuencias de la AESAN, lista de la compra por pasillos y temporada. | Generador de menú, lista marcable, calendario de temporada |
| [Datos](datos.html) | Cómo comemos en España: exceso de peso en adultos y niños, hábitos, renta y cesta de la compra. | Nueve gráficos con tabla y fuente |
| [Herramientas](herramientas.html) | Todas las calculadoras en una sola página. | Todas |

<p>
  <img src="docs/capturas/seccion.png" alt="Página de perder peso con el resumen de 30 segundos en forma de ticket" width="68%">
  <img src="docs/capturas/movil.png" alt="Página de niños en el móvil" width="24%">
</p>

## Herramientas

Todas calculan en el navegador. Se insertan en cualquier página con un `div` y el nombre de la herramienta (ver [Cómo ampliarla](#cómo-ampliarla)).

| Herramienta | `data-herramienta` | Qué calcula | Base |
| --- | --- | --- | --- |
| ¿Cómo está tu cintura? | `cintura` | Cintura entre altura con zonas de riesgo (menos de 0,5 sin riesgo añadido; 0,5 a 0,59 aumentado; 0,6 o más alto), perímetro de cintura por sexo e IMC con su categoría, rango de peso normal y lo que supone perder del 5 al 10 %. | NICE NG246, OMS |
| Pequeños cambios | `cambios` | Suma de calorías, azúcar y sal de los cambios elegidos y techo teórico de pérdida de peso en un año: 10 kcal diarias equivalen a unos 450 g a largo plazo, la mitad el primer año. | Modelo dinámico de Kevin Hall (NIH) |
| Raciones con la mano | `manos` | Palmas de proteína, manos en cuenco de cereal, puños de verdura y pulgares de grasa por comida para mujer, hombre, niño o deportista. Acepta `data-perfil="m|h|n|d"`. | Precision Nutrition, plato saludable |
| Semáforo de la etiqueta | `etiqueta` | Verde, ámbar o rojo para grasas, saturadas, azúcares y sal por 100 g o 100 ml, regla de raciones grandes y azúcar y sal por ración. Ocho productos de ejemplo. | Guía de etiquetado frontal del Gobierno británico |
| Qué puede comer según su edad | `edad` | Dieciséis alimentos con estado «evitar», «con cuidado» o «sí» para cinco tramos de edad, de 6 meses a 14 años, con filtro. | AESAN (mercurio, nitratos, cadmio), AEP (atragantamientos), ASPCAT y AESAN (arroz) |
| Ideas para la fiambrera | `fiambrera` | Combinación aleatoria de base, proteína, verdura y fruta. | Plato saludable |
| Tu plan de combustible | `deporte` | Hidratos al día (3 a 12 g/kg según la carga), proteína (1,2 a 2 g/kg), líquido antes (5 a 7 ml/kg), hidratos por hora durante según la duración y recuperación después. | ACSM, AND y DC 2016; ISSN 2017 |
| ¿Cuánto sudas? | `sudor` | Tasa de sudoración, porcentaje de peso perdido, lo que hay que beber por hora para no pasar del 2 % y cuánto reponer (1,25 a 1,5 l por kilo perdido). | ACSM 2016 |
| Explora los nutrientes | `nutrientes` | Fibra, calcio, hierro, omega-3 y sal: necesidades, a quién le falta, gráfico por ración frente a la necesidad diaria y consejos. Acepta `data-inicial="calcio"`. | EFSA, OMS, BEDCA |
| ¿Mito o realidad? | `mitos` | Doce afirmaciones con explicación y marcador. | AESAN, EFSA, OMS |

La altura y el peso escritos en una herramienta se comparten con las demás de la misma página y se recuerdan en el navegador para no repetirlos.

<p>
  <img src="docs/capturas/herramienta-etiqueta.png" alt="Semáforo de la etiqueta con un refresco de cola: azúcar alto por ración" width="49%">
  <img src="docs/capturas/herramienta-cintura.png" alt="Herramienta de cintura con el medidor de riesgo y el IMC" width="49%">
</p>

## Rigor y fuentes

- **Solo fuentes oficiales o de consenso.** Las recomendaciones salen de organismos públicos y sociedades científicas; los datos de consumo y salud, de estadísticas oficiales.
- **Cifras revisadas.** Todas las cifras, umbrales y fórmulas se contrastaron con su fuente antes de publicarse, con especial atención a la seguridad infantil.
- **Aproximaciones declaradas.** Los valores por ración (proteína, fibra, hierro, calcio, omega-3, sal, azúcar) son aproximados a partir de la BEDCA y de bases internacionales, y la web lo dice junto a cada gráfico.
- **Sin cifras agresivas.** No hay contadores de calorías ni objetivos de peso para niños. La pérdida de peso se presenta como un ritmo sostenible y con avisos sobre cuándo pedir ayuda.

Fuentes principales:

- [AESAN: recomendaciones dietéticas sostenibles y de actividad física (2022)](https://www.aesan.gob.es/AECOSAN/web/noticias_y_actualizaciones/noticias/2022/recomendaciones_dieteticas.htm)
- [AESAN: mercurio en el pescado (2019)](https://maldita.es/malditaciencia/2019/12/22/pescado-y-mercurio-las-recomendaciones-de-la-aesan-actualizan-las-anteriores-y-son-mas-restrictivas-en-los-menores-de-10-anos/), [nitratos y cadmio](https://www.consumer.es/seguridad-alimentaria/contaminantes-alimentarios-nuevas-recomendaciones-sobre-su-consumo.html) y [arroz en la infancia](https://www.consumer.es/?p=608092)
- [AESAN: estudio ALADINO 2023](https://aesan.gob.es/nutricion/datos-sobrepeso-obesidad/aladino-2023)
- [EFSA: valores dietéticos de referencia](https://www.efsa.europa.eu/es/topics/topic/dietary-reference-values), [agua](https://www.efsa.europa.eu/es/efsajournal/pub/1459) y [cafeína](https://www.efsa.europa.eu/en/efsajournal/pub/4102)
- [OMS: alimentación sana](https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet), [actividad física](https://www.who.int/es/news-room/fact-sheets/detail/physical-activity) y [reducción de sal](https://www.who.int/es/news-room/fact-sheets/detail/salt-reduction)
- [NICE NG246: sobrepeso y obesidad](https://www.nice.org.uk/guidance/ng246)
- [AEP: En Familia](https://enfamilia.aeped.es/) y [prevención de atragantamientos](https://aeped.es/sites/default/files/atragantamiento_csvaep_final.pdf)
- [ACSM, AND y DC: nutrición y rendimiento deportivo (2016)](https://pubmed.ncbi.nlm.nih.gov/26891166/) y [ISSN: proteína y ejercicio (2017)](https://pubmed.ncbi.nlm.nih.gov/28642676/)
- [Australian Institute of Sport: marco de suplementos](https://www.ais.gov.au/nutrition/supplements)
- [Gobierno británico: etiquetado nutricional frontal](https://assets.publishing.service.gov.uk/media/5a80cd03ed915d74e33fc7c5/FoP_Nutrition_labelling_UK_guidance.pdf)
- [INE: Encuesta de Salud de España 2023](https://www.ine.es/dyngs/Prensa/es/ESdE2023.htm) y [monográfico de alimentación](https://www.sanidad.gob.es/gl/estadEstudios/estadisticas/encuestaSaludEspana/monografico3_ESdE2023_ResumenEjecutivo.pdf)
- [Mercasa con datos del MAPA: consumo alimentario en los hogares 2024](https://www.mercasa.es/wp-content/uploads/2026/01/datos-basicos-7-consumo-alimentario.pdf)
- [BEDCA: Base de Datos Española de Composición de Alimentos](https://www.bedca.net/)

## Diseño

### La idea

Un mercado y una cocina españolas, no una plantilla. Cuatro elementos dan la identidad:

- **El plato como emblema.** El método del plato es el hilo de toda la web y la pieza central de la portada, servido por partes al cargar.
- **Titulares de cartel de mercado.** Bricolage Grotesque en su anchura estrecha y peso máximo, grande y apretada.
- **Azulejo.** Un patrón geométrico muy suave, solo como textura detrás del plato, en las cabeceras de sección y en las bandas oscuras.
- **El ticket de la compra.** El resumen de 30 segundos de cada sección tiene forma de ticket, con borde dentado y una ligera inclinación.

### Paleta

Cada grupo del plato tiene su color y cada sección hereda uno. El modo oscuro tiene su propia versión de cada tono, no una inversión automática.

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--papel` | `#f5f6f0` | `#161c18` | Fondo |
| `--tinta` | `#22302a` | `#e8ece4` | Texto |
| `--hortaliza` | `#3e8a4f` | `#6cbf7d` | Verdura · Perder peso |
| `--grano` | `#b7841f` | `#e2b24e` | Cereal · Niños |
| `--proteina` | `#b5475a` | `#e07b8c` | Proteína · Entrenar |
| `--azulejo` | `#2f6c8f` | `#6fa8cc` | Agua · Menú |
| `--mineral` | `#76559e` | `#b39ddb` | Nutrientes |
| `--banda` | `#1f2c25` | `#0d1310` | Bandas oscuras y pie |

Los estados (`ok`, `ojo`, `no`) son verde, ámbar y rojo propios, siempre con texto e icono, nunca solo color. Los colores de las series de gráficos se validaron para daltonismo.

### Tipografía

- **Bricolage Grotesque** (titulares): estrecha (`font-stretch` del 78 al 92 %) y en peso 700 a 800.
- **Atkinson Hyperlegible** (texto): diseñada para la máxima legibilidad, también para personas con baja visión.

### Componentes

| Componente | Clase | Para qué |
| --- | --- | --- |
| Cabecera de sección | `.cabecera-seccion` + `.con-esencial` | Banda teñida del color de la sección con el titular y el resumen |
| Resumen de 30 segundos | `.esencial` | Ticket con tres o cuatro ideas clave |
| Índice de la página | `.indice` | Barra lateral en escritorio y fila de pastillas fija en el móvil; marca la sección que estás leyendo |
| Herramienta | `.herramienta` (automática) | Panel con cabecera, campos, resultado y fuente |
| Resultado | `.resultado`, `.grande` | Cifra principal y explicación |
| Estado | `.estado.ok`, `.ojo`, `.no` | Etiqueta con icono y texto |
| Acordeón | `.acordeon details` | Detalle plegado |
| Objetivo | `.objetivo` | Baldas de color de la portada |
| Banda | `.banda` | Bloque oscuro con azulejo para cifras grandes |
| Siguiente paso | `.siguiente` | Cierre de página con la acción recomendada |

### Experiencia de uso

- Cabecera fija y translúcida con una barra de progreso de lectura en el color de la sección.
- En pantallas estrechas, el menú se abre en una hoja lateral con cada sección y su descripción.
- Botón para volver arriba en las páginas largas.
- Accesibilidad: enlace para saltar al contenido, foco visible, navegación con teclado en pestañas, gráficos y herramientas, resultados anunciados con `aria-live`, tabla de datos bajo cada gráfico y respeto a «reducir movimiento».
- Probada en escritorio, en móvil de 390 px y en modo oscuro, sin desbordes.
- Al imprimir se ocultan la navegación y los botones; el menú semanal sale en cuatro columnas.

![Página de entrenar en modo oscuro](docs/capturas/oscuro.png)

## Cómo está hecha

Web estática en HTML, CSS y JavaScript, sin dependencias ni paso de compilación. Cada página es un archivo HTML; la cabecera, la navegación, el pie y el tema se añaden desde `js/comun.js`.

```
index.html          portada
peso.html           perder peso
ninos.html          niños
entrenar.html       entrenar
nutrientes.html     nutrientes, agua y etapas especiales
menu.html           menú semanal, lista de la compra y temporada
datos.html          datos oficiales y gráficos
herramientas.html   todas las herramientas
404.html            página no encontrada
css/estilos.css     sistema de diseño completo (tokens, componentes, modo oscuro, impresión)
js/comun.js         cabecera, menú móvil, pie, tema, progreso, índice activo y volver arriba
js/herramientas.js  las diez herramientas interactivas
js/graficos.js      gráficos SVG: barras, líneas y terrones de azúcar
js/plato.js         plato interactivo de la portada
js/platos.js        recetario del menú y pasillos del súper
js/menu.js          generador de menú y lista de la compra
js/temporada.js     calendario de fruta y verdura de temporada
img/                icono y imagen para compartir en redes
docs/capturas/      capturas de este README
```

### Gráficos

`js/graficos.js` expone `window.Grafico` con tres tipos. Todos dibujan un SVG adaptable, tienen tooltip con ratón y teclado, una tabla con los datos y la fuente.

```js
Grafico.barras(elemento, {
  titulo: "Proteína en una ración habitual",
  subtitulo: "Gramos aproximados",
  unidad: " g", decimales: 0,
  color: "var(--proteina)", colorDestacado: "var(--hortaliza)",
  referencia: { valor: 25, etiqueta: "Lo que necesitas al día" }, // opcional
  datos: [{ etiqueta: "Lentejas, 250 g", valor: 22, nota: "cocidas", destacar: false }],
  fuente: 'BEDCA',
});

Grafico.lineas(elemento, { titulo, x: [2011, 2015, 2019, 2023], yMin: 0, yMax: 30, unidad: " %",
  series: [{ nombre: "Obesidad", valores: [18.3, 18.1, 17.3, 15.9], color: "var(--serie-b)" }] });

Grafico.terrones(elemento, { titulo, gramosPorTerron: 4,
  datos: [{ etiqueta: "Refresco de cola", racion: "lata de 330 ml", gramos: 35 }] });
```

### Lo que se guarda en el navegador

| Clave de `localStorage` | Contenido |
| --- | --- |
| `despensa-tema` | Modo claro u oscuro elegido |
| `despensa-datos` | Altura, cintura, peso y sexo escritos en las herramientas |
| `despensa-menu-v1` | Menú semanal actual y productos marcados de la lista |

## Cómo ampliarla

### Añadir una herramienta

1. En `js/herramientas.js`, crea `H.mi_herramienta = (el, opciones) => { … }`. Usa los ayudantes `cabeza()`, `campo()`, `segmentos()` y `estado()` para que tenga el mismo aspecto que las demás.
2. Añade su icono a `I` si lo necesita.
3. Ponla en cualquier página con `<div data-herramienta="mi_herramienta"></div>` y carga `js/herramientas.js` (y `js/graficos.js` si dibuja gráficos).
4. Añádela a `herramientas.html`, a la rejilla de la portada y a la tabla de este README.

### Añadir una página

1. Copia la estructura de `nutrientes.html`: cabecera con `.con-esencial`, índice, secciones y `.siguiente`.
2. Añádela al array `paginas` de `js/comun.js` con su color (`clase: "s-…"`) y una descripción corta para el menú móvil.
3. Si necesita un color nuevo, crea el token en `:root` y en los dos bloques de modo oscuro de `css/estilos.css`, y la clase `.s-…`.
4. Añádela a `sitemap.xml`.

### Añadir un plato al menú

En `js/platos.js`, añade un objeto a `PLATOS` con su nombre, su grupo (`legumbre`, `pescado`, `huevo`, `carne` o `verdura`) y sus ingredientes. Cada ingrediente tiene que existir en `PASILLOS` para salir en la lista de la compra. Si es carne blanca, añade `blanca: true`.

## Probar, publicar y flujo de trabajo

**En local:**

```bash
python3 -m http.server 8000
```

y abre <http://localhost:8000>.

**Publicar con GitHub Pages:** en *Settings → Pages*, elige *Deploy from a branch*, rama `main` y carpeta raíz. El archivo `.nojekyll` evita que GitHub procese la web. Para un dominio propio, por ejemplo `despensa.bendi.dev`, crea un `CNAME` en el DNS apuntando a `serbenda.github.io`, añade el dominio en *Settings → Pages* y actualiza las URL de `canonical`, `og:url`, `og:image`, `sitemap.xml` y `robots.txt`.

**Flujo de trabajo:** los cambios se hacen en la rama `development` y llegan a `main` mediante una *pull request* que revisa y fusiona el autor. Nunca se sube nada directamente a `main`.

## Privacidad

despensa no tiene servidor, cookies, analítica ni formularios. Las herramientas calculan en el dispositivo de quien las usa y solo guardan en su navegador lo indicado más arriba. La única petición externa es la de las tipografías a Google Fonts.

## Licencia

© 2026 Sergio Santiago Bendaña Quesada. Todos los derechos reservados. El código y los contenidos se publican solo para consulta; consulta [LICENSE](LICENSE).
