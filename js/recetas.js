// despensa — recetas, cantidades y alérgenos del menú semanal.

// Cantidad por persona de cada ingrediente: [si es el ingrediente principal, si acompaña, unidad].
// Las legumbres, el arroz y la pasta van en seco. Sin cantidad: especias y aceite.
const QTY = {
  // Fruta y verdura
  "tomate": [200, 100, "g"], "cebolla": [100, 50, "g"], "pimiento": [150, 75, "g"], "calabacín": [250, 120, "g"],
  "berenjena": [250, 120, "g"], "zanahoria": [150, 60, "g"], "espinacas": [200, 80, "g"], "acelgas": [200, 100, "g"],
  "brócoli": [250, 120, "g"], "coliflor": [300, 150, "g"], "judías verdes": [150, 80, "g"], "lechuga": [0.25, 0.25, "ud"],
  "pepino": [150, 60, "g"], "calabaza": [300, 150, "g"], "puerro": [150, 60, "g"], "champiñones": [200, 80, "g"],
  "patata": [250, 150, "g"], "boniato": [250, 150, "g"], "limón": [0.5, 0.25, "ud"], "ajo": [1, 1, "diente"],
  "aguacate": [0.5, 0.5, "ud"], "alcachofas": [200, 100, "g"], "espárragos verdes": [150, 80, "g"], "col": [200, 100, "g"],
  "apio": [80, 40, "g"], "cogollos": [1, 1, "ud"], "rúcula": [50, 30, "g"],
  // Pescadería
  "merluza": [180, 100, "g"], "salmón": [150, 100, "g"], "sardinas": [200, 120, "g"], "bacalao": [180, 100, "g"],
  "lubina": [250, 150, "g"], "dorada": [300, 150, "g"], "gambas": [150, 60, "g"], "calamares": [150, 70, "g"],
  "mejillones": [400, 200, "g"], "caballa": [200, 120, "g"],
  // Carnicería
  "pechuga de pollo": [150, 100, "g"], "muslos de pollo": [250, 150, "g"], "pavo": [150, 100, "g"], "conejo": [250, 150, "g"],
  "ternera magra": [130, 100, "g"], "carne picada de ternera": [120, 80, "g"], "lomo de cerdo": [130, 100, "g"],
  // Huevos y lácteos
  "huevos": [2, 1, "ud"], "queso fresco": [100, 50, "g"], "queso rallado": [25, 15, "g"], "mozzarella": [60, 40, "g"],
  "yogur natural": [1, 1, "ud"], "requesón": [100, 60, "g"], "tofu firme": [150, 100, "g"],
  "bebida de soja enriquecida": [250, 200, "ml"], "leche": [250, 200, "ml"],
  // Despensa
  "lentejas": [80, 40, "g"], "garbanzos": [80, 40, "g"], "alubias blancas": [80, 40, "g"], "alubias rojas": [80, 40, "g"],
  "lentejas rojas": [80, 40, "g"], "arroz integral": [80, 50, "g"], "pasta integral": [80, 60, "g"],
  "fideos integrales": [80, 60, "g"], "cuscús": [70, 50, "g"], "quinoa": [70, 50, "g"], "tomate triturado": [150, 80, "g"],
  "atún al natural": [1, 1, "lata"], "caldo de verduras": [350, 200, "ml"], "leche de coco": [80, 60, "ml"],
  "nueces": [25, 15, "g"], "tahini": [15, 10, "g"], "crema de cacahuete": [20, 15, "g"],
  "frutos secos naturales": [25, 25, "g"], "copos de avena": [40, 30, "g"],
  // Pan y cereales
  "pan integral": [80, 50, "g"], "tortillas de trigo integrales": [2, 2, "ud"], "masa de pizza integral": [0.5, 0.5, "ud"],
  "pan de hamburguesa integral": [1, 1, "ud"], "tortitas de maíz": [3, 3, "ud"],
  // Congelados
  "guisantes": [150, 60, "g"], "maíz dulce": [60, 40, "g"], "verdura para wok": [250, 150, "g"],
  // Básicos
  "fruta de temporada variada": [1, 1, "pieza"],
};

// Alérgenos e intolerancias que se pueden filtrar, y qué ingredientes los llevan.
const ALERGIAS = [
  ["gluten", "Gluten"], ["lactosa", "Lactosa"], ["huevo", "Huevo"], ["frutos-secos", "Frutos secos"],
  ["cacahuete", "Cacahuete"], ["pescado", "Pescado"], ["marisco", "Marisco"], ["soja", "Soja"], ["sesamo", "Sésamo"],
];
const ALERGENOS = {
  "pan integral": ["gluten"], "pasta integral": ["gluten"], "fideos integrales": ["gluten"], "cuscús": ["gluten"],
  "tortillas de trigo integrales": ["gluten"], "masa de pizza integral": ["gluten"], "pan de hamburguesa integral": ["gluten"],
  "copos de avena": ["gluten"],
  "leche": ["lactosa"], "yogur natural": ["lactosa"], "queso fresco": ["lactosa"], "queso rallado": ["lactosa"],
  "mozzarella": ["lactosa"], "requesón": ["lactosa"],
  "huevos": ["huevo"],
  "nueces": ["frutos-secos"], "frutos secos naturales": ["frutos-secos", "cacahuete"],
  "crema de cacahuete": ["cacahuete"],
  "merluza": ["pescado"], "salmón": ["pescado"], "sardinas": ["pescado"], "bacalao": ["pescado"], "lubina": ["pescado"],
  "dorada": ["pescado"], "caballa": ["pescado"], "atún al natural": ["pescado"],
  "gambas": ["marisco"], "calamares": ["marisco"], "mejillones": ["marisco"],
  "tofu firme": ["soja"], "bebida de soja enriquecida": ["soja"],
  "tahini": ["sesamo"],
};

// Platos contundentes que se reservan para el mediodía: por la noche, algo más ligero.
const SOLO_COMIDA = new Set([
  "Lentejas estofadas con verduras", "Garbanzos con espinacas", "Alubias blancas con verduras",
  "Chili de alubias rojas con arroz", "Dahl de lentejas rojas con arroz", "Potaje de garbanzos y bacalao",
  "Arroz con gambas y calamares", "Fideuá de pescado", "Pasta integral con atún y tomate",
  "Arroz a la cubana con tomate casero", "Curry de pollo con arroz", "Albóndigas de ternera en salsa de tomate",
  "Lasaña de verduras y requesón", "Tortilla de patata con ensalada", "Pollo al horno con patata y pimientos",
]);

// Recetas: [minutos, pasos]. El aceite de oliva y la sal se dan por supuestos.
const RECETAS = {
  "Lentejas estofadas con verduras": [50, [
    "Sofríe la cebolla, el ajo y el pimiento picados a fuego medio unos 8 minutos.",
    "Añade el pimentón, remueve un momento fuera del fuego y echa las lentejas lavadas, la zanahoria y la patata en dados.",
    "Cubre con el doble de agua, lleva a hervor y deja a fuego suave 35–40 minutos, hasta que estén tiernas.",
    "Rectifica de sal y deja reposar cinco minutos antes de servir."]],
  "Garbanzos con espinacas": [25, [
    "Si usas garbanzos secos, déjalos en remojo la noche anterior y cuécelos; con bote, lávalos y escúrrelos.",
    "Dora el ajo laminado, añade el pimentón y el comino y, enseguida, las espinacas.",
    "Cuando las espinacas bajen, incorpora los garbanzos con un poco de agua de cocción y deja 10 minutos a fuego suave."]],
  "Ensalada de garbanzos, tomate y pepino": [15, [
    "Lava y escurre los garbanzos cocidos.",
    "Trocea el tomate, el pepino y la cebolla en dados pequeños.",
    "Mezcla todo con el atún escurrido y aliña con aceite, vinagre y sal. Mejor si reposa 10 minutos en la nevera."]],
  "Alubias blancas con verduras": [45, [
    "Pocha el puerro, la zanahoria y el pimiento troceados 10 minutos.",
    "Añade el calabacín en dados y las alubias (en remojo desde la noche anterior, o de bote, lavadas).",
    "Cubre de agua y cuece a fuego suave hasta que estén tiernas: unos 30 minutos con alubias cocidas, 1 hora y media si son secas."]],
  "Chili de alubias rojas con arroz": [40, [
    "Pon el arroz a cocer según el paquete.",
    "Sofríe la cebolla y el pimiento picados, añade el comino y el tomate triturado y deja 10 minutos.",
    "Incorpora las alubias cocidas y el maíz y cuece 15 minutos más, hasta que espese.",
    "Sirve el chili junto al arroz."]],
  "Dahl de lentejas rojas con arroz": [35, [
    "Pon el arroz a cocer según el paquete.",
    "Sofríe la cebolla picada, añade el curry y remueve un minuto.",
    "Echa las lentejas rojas lavadas, el tomate y agua hasta cubrir. Cuece 15–20 minutos, hasta que se deshagan.",
    "Añade la leche de coco, deja dos minutos más y sirve con el arroz."]],
  "Hummus con crudités y pan integral": [15, [
    "Tritura los garbanzos cocidos con el tahini, el zumo de limón, un poco de agua fría, aceite y sal hasta que quede cremoso.",
    "Corta la zanahoria y el pepino en bastones.",
    "Sirve el hummus con las verduras y el pan integral tostado."]],
  "Ensalada templada de lentejas": [20, [
    "Lava y escurre las lentejas cocidas y templalas un par de minutos en una sartén.",
    "Pica el tomate, el pimiento y la cebolla.",
    "Mezcla con la rúcula y aliña con aceite, vinagre y sal."]],
  "Hamburguesas de garbanzo con ensalada": [30, [
    "Tritura los garbanzos cocidos con la zanahoria rallada, la cebolla picada y sal hasta formar una masa.",
    "Forma hamburguesas y dóralas a la plancha 4 minutos por cada lado.",
    "Sirve en el pan con lechuga y tomate."]],
  "Potaje de garbanzos y bacalao": [40, [
    "Sofríe la cebolla picada y añade el pimentón fuera del fuego.",
    "Echa los garbanzos cocidos y cubre con agua. Deja 15 minutos a fuego suave.",
    "Añade las espinacas y el bacalao desalado en trozos y cuece 8 minutos más, sin que hierva fuerte."]],
  "Tacos de alubias rojas y verduras": [20, [
    "Saltea la cebolla y el pimiento en tiras 8 minutos.",
    "Añade las alubias cocidas, aplasta un poco la mitad y calienta 3 minutos.",
    "Calienta las tortillas y rellénalas con las alubias, tomate en dados y aguacate."]],
  "Merluza al horno con patata y cebolla": [40, [
    "Precalienta el horno a 200 °C.",
    "Asa la patata en rodajas finas y la cebolla en juliana con un chorrito de aceite 25 minutos.",
    "Pon la merluza encima, con sal y unas gotas de limón, y hornea 10–12 minutos más."]],
  "Salmón a la plancha con brócoli y arroz": [25, [
    "Pon el arroz a cocer según el paquete.",
    "Cuece el brócoli al vapor 5–6 minutos, que quede firme.",
    "Haz el salmón a la plancha, empezando por la piel, 3–4 minutos por lado. Sirve con limón."]],
  "Sardinas al horno con ensalada": [25, [
    "Precalienta el horno a 200 °C.",
    "Coloca las sardinas limpias en una bandeja con un poco de aceite y sal y hornea 12–15 minutos.",
    "Mientras, prepara una ensalada de lechuga y tomate. Sirve con el pan."]],
  "Bacalao con tomate y pimientos": [35, [
    "Sofríe la cebolla y el pimiento en tiras 10 minutos.",
    "Añade el tomate triturado y la patata en rodajas finas y deja 15 minutos a fuego suave.",
    "Coloca el bacalao desalado encima, tapa y cuece 8 minutos."]],
  "Dorada a la sal con verduras asadas": [40, [
    "Precalienta el horno a 200 °C y asa las verduras troceadas con un poco de aceite 20 minutos.",
    "Cubre la dorada entera con una capa de sal gruesa humedecida.",
    "Hornéala 20 minutos, rompe la costra y sirve con las verduras."]],
  "Arroz con gambas y calamares": [40, [
    "Dora los calamares en aros y reserva. Sofríe el pimiento y el tomate rallado.",
    "Añade el arroz, remueve un minuto y cubre con el triple de agua caliente.",
    "Cuece 25 minutos (el integral tarda más). En los últimos 5, añade los guisantes, las gambas y los calamares."]],
  "Mejillones al vapor con patatas": [25, [
    "Cuece las patatas en agua con sal 20 minutos.",
    "Limpia los mejillones y ponlos en una olla tapada con medio vaso de agua y unas gotas de limón hasta que se abran, unos 4 minutos.",
    "Sirve con las patatas y una ensalada de lechuga."]],
  "Caballa al horno con boniato": [40, [
    "Precalienta el horno a 200 °C y asa el boniato en rodajas 25 minutos.",
    "Añade la caballa abierta o en lomos y hornea 10 minutos más.",
    "Sirve con los cogollos aliñados."]],
  "Fideuá de pescado": [35, [
    "Dora los fideos en una paellera con un poco de aceite y reserva.",
    "Sofríe el pimiento y el tomate, añade la merluza en dados y las gambas y dales una vuelta.",
    "Echa los fideos y el doble de agua o caldo caliente y cuece 10–12 minutos, hasta que se sequen."]],
  "Lubina en papillote con verduras": [35, [
    "Precalienta el horno a 200 °C y cuece la patata en rodajas 10 minutos en agua.",
    "Pon en papel de horno la patata, la zanahoria, el calabacín y el puerro en tiras finas, y encima la lubina.",
    "Cierra el paquete y hornea 15–18 minutos."]],
  "Pasta integral con atún y tomate": [20, [
    "Cuece la pasta según el paquete.",
    "Sofríe la cebolla picada, añade el tomate triturado y el orégano y deja 10 minutos.",
    "Mezcla con el atún escurrido y la pasta. Acompaña con una ensalada."]],
  "Tortilla de patata con ensalada": [40, [
    "Pocha la patata en láminas y la cebolla a fuego suave 20 minutos, sin que se doren.",
    "Escúrrelas y mézclalas con los huevos batidos y sal.",
    "Cuaja la tortilla en la sartén 3 minutos por cada lado. Sirve con ensalada de lechuga y tomate."]],
  "Revuelto de champiñones y espárragos": [15, [
    "Saltea los espárragos en trozos 4 minutos y añade los champiñones laminados otros 4.",
    "Baja el fuego, echa los huevos batidos y remueve hasta que cuajen jugosos.",
    "Sirve con pan integral."]],
  "Tortilla de calabacín con pan con tomate": [25, [
    "Pocha el calabacín en dados y la cebolla 10 minutos.",
    "Mézclalos con los huevos batidos y cuaja la tortilla 3 minutos por cada lado.",
    "Sirve con el pan tostado untado de tomate."]],
  "Huevos al plato con pisto": [35, [
    "Haz el pisto: sofríe la cebolla, el pimiento y el calabacín en dados 15 minutos y añade el tomate 10 más.",
    "Pásalo a una cazuela, casca los huevos encima y tapa.",
    "Cuaja 5–6 minutos a fuego suave, o en el horno a 200 °C."]],
  "Shakshuka con pan integral": [30, [
    "Sofríe la cebolla y el pimiento 10 minutos con el comino.",
    "Añade el tomate triturado y deja 10 minutos, hasta que espese.",
    "Haz huecos, casca los huevos, tapa y cuaja 6 minutos. Sirve con pan."]],
  "Tortilla de espinacas y queso": [20, [
    "Saltea las espinacas hasta que bajen y escúrrelas bien.",
    "Bate los huevos con las espinacas y el queso fresco desmenuzado.",
    "Cuaja la tortilla 3 minutos por cada lado y sirve con pan y tomate."]],
  "Huevos rellenos de atún con ensalada": [25, [
    "Cuece los huevos 10 minutos, enfríalos y pélalos.",
    "Pártelos por la mitad y mezcla las yemas con el atún y un poco de tomate picado.",
    "Rellena las claras y sirve sobre lechuga, tomate y maíz."]],
  "Arroz a la cubana con tomate casero": [35, [
    "Cuece el arroz y el brócoli en ramitos por separado.",
    "Haz el tomate: sofríe la cebolla picada y añade el tomate triturado 15 minutos.",
    "Fríe o haz a la plancha los huevos y sirve con el arroz, el tomate y el brócoli."]],
  "Pollo al horno con patata y pimientos": [60, [
    "Precalienta el horno a 200 °C.",
    "Coloca la patata en gajos, el pimiento y la cebolla en una bandeja con un poco de aceite.",
    "Pon encima los muslos con sal y limón y hornea 45–50 minutos, dándoles la vuelta a mitad."]],
  "Pechuga a la plancha con cuscús y verduras": [20, [
    "Hidrata el cuscús con el mismo volumen de agua hirviendo, tapado, 5 minutos.",
    "Saltea el calabacín y la zanahoria en dados 6–8 minutos y mézclalos con el cuscús.",
    "Haz la pechuga a la plancha 4 minutos por cada lado."]],
  "Wok de pollo con verduras y arroz": [25, [
    "Pon el arroz a cocer según el paquete.",
    "Saltea la pechuga en tiras a fuego fuerte 4 minutos.",
    "Añade la verdura y saltea 5 minutos más. Sirve con el arroz."]],
  "Fajitas de pollo con pimientos": [25, [
    "Saltea la cebolla y el pimiento en tiras 8 minutos.",
    "Añade la pechuga en tiras y saltea 5 minutos más.",
    "Calienta las tortillas y rellénalas con el pollo y el aguacate."]],
  "Pavo en salsa de verduras con arroz": [40, [
    "Pon el arroz a cocer según el paquete.",
    "Dora el pavo en dados y reserva. Pocha el puerro, la zanahoria y los champiñones 10 minutos.",
    "Tritura la mitad de las verduras con un poco de agua, vuelve a juntarlo todo con el pavo y deja 10 minutos."]],
  "Conejo al ajillo con ensalada": [45, [
    "Dora el conejo troceado a fuego medio con sal 10 minutos.",
    "Añade los ajos laminados y un vaso de agua y deja 25 minutos a fuego suave, con la patata en dados.",
    "Sirve con una ensalada de lechuga y tomate."]],
  "Curry de pollo con arroz": [35, [
    "Pon el arroz a cocer según el paquete.",
    "Sofríe la cebolla, añade el curry y después la pechuga en dados. Dora 5 minutos.",
    "Echa la leche de coco y las espinacas y deja 10 minutos a fuego suave."]],
  "Albóndigas de ternera en salsa de tomate": [50, [
    "Forma las albóndigas con la carne y sal, y dóralas. Reserva.",
    "Sofríe la cebolla y añade el tomate triturado 10 minutos.",
    "Cuece las albóndigas en la salsa con los guisantes 15 minutos. Sirve con arroz."]],
  "Ternera salteada con brócoli": [25, [
    "Cuece la quinoa lavada en el doble de agua 15 minutos.",
    "Saltea la ternera en tiras a fuego fuerte 3 minutos y reserva.",
    "Saltea la cebolla y el brócoli 5 minutos, junta con la ternera y sirve con la quinoa."]],
  "Lomo a la plancha con pimientos y patata": [35, [
    "Asa la patata en gajos en el horno a 200 °C 25 minutos, o cuécela.",
    "Haz los pimientos en tiras a la plancha a fuego medio 10 minutos.",
    "Haz el lomo a la plancha 2–3 minutos por cada lado."]],
  "Crema de calabaza y ensalada de queso fresco": [35, [
    "Cuece la calabaza, la zanahoria y el puerro troceados, apenas cubiertos de agua, 20 minutos.",
    "Tritura hasta que quede fina y ajusta de sal.",
    "Acompaña con una ensalada de rúcula, queso fresco y nueces."]],
  "Pizza casera de verduras": [30, [
    "Precalienta el horno a 220 °C.",
    "Extiende la masa y cubre con el tomate triturado, la cebolla, el pimiento y los champiñones en láminas.",
    "Añade la mozzarella y hornea 12–15 minutos."]],
  "Wok de tofu con verduras": [25, [
    "Pon el arroz a cocer según el paquete.",
    "Seca el tofu, córtalo en dados y dóralo a fuego fuerte.",
    "Añade la verdura y saltea 5 minutos. Sirve con el arroz."]],
  "Berenjenas rellenas gratinadas": [50, [
    "Parte las berenjenas por la mitad, hazles cortes y ásalas a 200 °C 25 minutos.",
    "Vacía la pulpa y sofríela con la cebolla y el tomate 10 minutos. Añade las nueces picadas.",
    "Rellena, cubre con el queso y gratina 8 minutos."]],
  "Menestra de verduras con huevo duro": [35, [
    "Cuece los huevos 10 minutos y pélalos.",
    "Cuece las judías, la zanahoria y las alcachofas 12 minutos y añade los guisantes los últimos 3.",
    "Saltea todo junto un par de minutos y sirve con el huevo en cuartos."]],
  "Ensalada de quinoa, aguacate y queso": [25, [
    "Cuece la quinoa lavada en el doble de agua 15 minutos y déjala enfriar.",
    "Trocea el tomate, el pepino, el aguacate y el queso.",
    "Mezcla todo y aliña con aceite, limón y sal."]],
  "Coliflor al horno con salsa de yogur y garbanzos tostados": [40, [
    "Precalienta el horno a 210 °C.",
    "Asa la coliflor en ramitos y los garbanzos cocidos con aceite y comino 25 minutos.",
    "Sirve con el yogur mezclado con sal y un poco de limón o ajo."]],
  "Lasaña de verduras y requesón": [60, [
    "Sofríe el calabacín y la berenjena en dados 10 minutos y añade las espinacas y el tomate otros 10.",
    "Cuece las láminas de pasta si lo pide el paquete.",
    "Monta capas de pasta, verdura y requesón, termina con queso y hornea a 190 °C 25 minutos."]],
  "Merluza a la plancha con ensalada": [15, [
    "Prepara una ensalada de lechuga, tomate y pepino.",
    "Haz la merluza a la plancha 3–4 minutos por cada lado, empezando por la piel.",
    "Sirve con unas gotas de limón."]],
  "Salmón en papillote con calabacín": [25, [
    "Precalienta el horno a 200 °C.",
    "Pon en papel de horno el calabacín en láminas finas y el salmón encima con sal y limón.",
    "Cierra el paquete y hornea 12–15 minutos. Acompaña con un poco de pan."]],
  "Sopa de pescado con verduras": [35, [
    "Pocha el puerro y la zanahoria picados 8 minutos y añade el tomate rallado.",
    "Cubre con el caldo y deja 15 minutos a fuego suave.",
    "Añade la merluza en dados y las gambas y cuece 4 minutos más."]],
  "Sardinas a la plancha con pimientos asados": [30, [
    "Asa los pimientos en el horno a 200 °C 25 minutos, pélalos y córtalos en tiras.",
    "Haz las sardinas limpias a la plancha 2–3 minutos por cada lado.",
    "Sirve con los pimientos aliñados y un poco de pan."]],
  "Crema de calabacín y tortilla francesa": [30, [
    "Cuece el calabacín, el puerro y la patata troceados, apenas cubiertos de agua, 20 minutos.",
    "Tritura hasta que quede fina.",
    "Haz una tortilla francesa por persona y sirve con la crema."]],
  "Revuelto de setas con ensalada de tomate": [15, [
    "Saltea los champiñones laminados 5 minutos.",
    "Baja el fuego, echa los huevos batidos y remueve hasta que cuajen jugosos.",
    "Sirve con una ensalada de lechuga y tomate."]],
  "Crema de verduras con queso fresco y pan integral": [30, [
    "Cuece la calabaza, la zanahoria y el puerro troceados, apenas cubiertos de agua, 20 minutos.",
    "Tritura hasta que quede fina.",
    "Sirve con el queso fresco en dados y una rebanada de pan integral."]],
  "Verduras al horno con queso fresco y nueces": [40, [
    "Precalienta el horno a 200 °C.",
    "Asa la berenjena, el calabacín, el pimiento y la cebolla troceados con un poco de aceite 30 minutos.",
    "Sirve con el queso fresco en dados y las nueces picadas por encima."]],
  "Pollo a la plancha con ensalada y pan integral": [15, [
    "Prepara una ensalada de lechuga, tomate y pepino.",
    "Haz la pechuga en filetes finos a la plancha 3 minutos por cada lado.",
    "Sirve con una rebanada de pan integral."]],
  "Pavo salteado con verduras": [20, [
    "Saltea el pavo en tiras a fuego fuerte 4 minutos y reserva.",
    "Saltea la cebolla, el pimiento, el calabacín y los champiñones 6 minutos.",
    "Junta todo un minuto y sirve."]],
  "Ensalada de alubias con tomate y pimiento": [15, [
    "Lava y escurre las alubias cocidas.",
    "Pica el tomate, el pimiento y la cebolla en dados pequeños.",
    "Mezcla y aliña con aceite, vinagre y sal."]],
};
