// despensa — recetario base del menú semanal.
// g: grupo de proteína principal (legumbre, pescado, huevo, carne, verdura)
// i: ingredientes que van a la lista de la compra (los básicos de casa se añaden aparte)

const PASILLOS = {
  "Fruta y verdura": ["tomate", "cebolla", "pimiento", "calabacín", "berenjena", "zanahoria", "espinacas", "acelgas", "brócoli", "coliflor", "judías verdes", "lechuga", "pepino", "calabaza", "puerro", "champiñones", "patata", "boniato", "limón", "ajo", "aguacate", "alcachofas", "espárragos verdes", "col", "apio", "cogollos", "rúcula"],
  "Pescadería": ["merluza", "salmón", "sardinas", "bacalao", "lubina", "dorada", "gambas", "calamares", "mejillones", "caballa"],
  "Carnicería": ["pechuga de pollo", "muslos de pollo", "pavo", "conejo", "ternera magra", "carne picada de ternera", "lomo de cerdo"],
  "Huevos y lácteos": ["huevos", "queso fresco", "queso rallado", "mozzarella", "yogur natural", "requesón", "tofu firme", "bebida de soja enriquecida"],
  "Despensa": ["lentejas", "garbanzos", "alubias blancas", "alubias rojas", "lentejas rojas", "arroz integral", "pasta integral", "fideos integrales", "cuscús", "quinoa", "tomate triturado", "atún al natural", "caldo de verduras", "leche de coco", "nueces", "pimentón", "comino", "curry", "orégano", "tahini", "crema de cacahuete"],
  "Pan y cereales": ["pan integral", "tortillas de trigo integrales", "masa de pizza integral", "pan de hamburguesa integral", "tortitas de maíz"],
  "Congelados": ["guisantes", "maíz dulce", "verdura para wok"],
};

const PASILLO_DE = {};
for (const [pasillo, lista] of Object.entries(PASILLOS)) lista.forEach(x => { PASILLO_DE[x] = pasillo; });

const PLATOS = [
  // Legumbre
  { n: "Lentejas estofadas con verduras", g: "legumbre", i: ["lentejas", "zanahoria", "patata", "pimiento", "cebolla", "ajo", "pimentón"] },
  { n: "Garbanzos con espinacas", g: "legumbre", i: ["garbanzos", "espinacas", "ajo", "pimentón", "comino"] },
  { n: "Ensalada de garbanzos, tomate y pepino", g: "legumbre", i: ["garbanzos", "tomate", "pepino", "cebolla", "atún al natural"] },
  { n: "Alubias blancas con verduras", g: "legumbre", i: ["alubias blancas", "puerro", "zanahoria", "calabacín", "pimiento"] },
  { n: "Chili de alubias rojas con arroz", g: "legumbre", i: ["alubias rojas", "tomate triturado", "pimiento", "cebolla", "maíz dulce", "arroz integral", "comino"] },
  { n: "Dahl de lentejas rojas con arroz", g: "legumbre", i: ["lentejas rojas", "leche de coco", "tomate triturado", "cebolla", "curry", "arroz integral"] },
  { n: "Hummus con crudités y pan integral", g: "legumbre", i: ["garbanzos", "tahini", "limón", "zanahoria", "pepino", "pan integral"] },
  { n: "Ensalada templada de lentejas", g: "legumbre", i: ["lentejas", "tomate", "pimiento", "cebolla", "rúcula"] },
  { n: "Hamburguesas de garbanzo con ensalada", g: "legumbre", i: ["garbanzos", "zanahoria", "cebolla", "pan de hamburguesa integral", "lechuga", "tomate"] },
  { n: "Potaje de garbanzos y bacalao", g: "legumbre", i: ["garbanzos", "bacalao", "espinacas", "cebolla", "pimentón"] },
  { n: "Tacos de alubias rojas y verduras", g: "legumbre", i: ["alubias rojas", "tortillas de trigo integrales", "pimiento", "cebolla", "aguacate", "tomate"] },

  // Pescado
  { n: "Merluza al horno con patata y cebolla", g: "pescado", i: ["merluza", "patata", "cebolla", "limón"] },
  { n: "Salmón a la plancha con brócoli y arroz", g: "pescado", i: ["salmón", "brócoli", "arroz integral", "limón"] },
  { n: "Sardinas al horno con ensalada", g: "pescado", i: ["sardinas", "lechuga", "tomate", "pan integral"] },
  { n: "Bacalao con tomate y pimientos", g: "pescado", i: ["bacalao", "tomate triturado", "pimiento", "cebolla", "patata"] },
  { n: "Dorada a la sal con verduras asadas", g: "pescado", i: ["dorada", "calabacín", "berenjena", "pimiento"] },
  { n: "Arroz con gambas y calamares", g: "pescado", i: ["gambas", "calamares", "arroz integral", "pimiento", "tomate", "guisantes"] },
  { n: "Mejillones al vapor con patatas", g: "pescado", i: ["mejillones", "patata", "limón", "lechuga"] },
  { n: "Caballa al horno con boniato", g: "pescado", i: ["caballa", "boniato", "cogollos"] },
  { n: "Fideuá de pescado", g: "pescado", i: ["fideos integrales", "merluza", "gambas", "tomate", "pimiento"] },
  { n: "Lubina en papillote con verduras", g: "pescado", i: ["lubina", "calabacín", "zanahoria", "puerro", "patata"] },
  { n: "Pasta integral con atún y tomate", g: "pescado", i: ["pasta integral", "atún al natural", "tomate triturado", "cebolla", "orégano", "lechuga"] },

  // Huevo
  { n: "Tortilla de patata con ensalada", g: "huevo", i: ["huevos", "patata", "cebolla", "lechuga", "tomate"] },
  { n: "Revuelto de champiñones y espárragos", g: "huevo", i: ["huevos", "champiñones", "espárragos verdes", "pan integral"] },
  { n: "Tortilla de calabacín con pan con tomate", g: "huevo", i: ["huevos", "calabacín", "cebolla", "tomate", "pan integral"] },
  { n: "Huevos al plato con pisto", g: "huevo", i: ["huevos", "calabacín", "pimiento", "cebolla", "tomate triturado"] },
  { n: "Shakshuka con pan integral", g: "huevo", i: ["huevos", "tomate triturado", "pimiento", "cebolla", "comino", "pan integral"] },
  { n: "Tortilla de espinacas y queso", g: "huevo", i: ["huevos", "espinacas", "queso fresco", "pan integral", "tomate"] },
  { n: "Huevos rellenos de atún con ensalada", g: "huevo", i: ["huevos", "atún al natural", "lechuga", "tomate", "maíz dulce"] },
  { n: "Arroz a la cubana con tomate casero", g: "huevo", i: ["huevos", "arroz integral", "tomate triturado", "cebolla", "brócoli"] },

  // Carne (aves y conejo preferentes; una roja como mucho)
  { n: "Pollo al horno con patata y pimientos", g: "carne", i: ["muslos de pollo", "patata", "pimiento", "cebolla", "limón"], blanca: true },
  { n: "Pechuga a la plancha con cuscús y verduras", g: "carne", i: ["pechuga de pollo", "cuscús", "calabacín", "zanahoria"], blanca: true },
  { n: "Wok de pollo con verduras y arroz", g: "carne", i: ["pechuga de pollo", "verdura para wok", "arroz integral"], blanca: true },
  { n: "Fajitas de pollo con pimientos", g: "carne", i: ["pechuga de pollo", "tortillas de trigo integrales", "pimiento", "cebolla", "aguacate"], blanca: true },
  { n: "Pavo en salsa de verduras con arroz", g: "carne", i: ["pavo", "zanahoria", "puerro", "champiñones", "arroz integral"], blanca: true },
  { n: "Conejo al ajillo con ensalada", g: "carne", i: ["conejo", "ajo", "patata", "lechuga", "tomate"], blanca: true },
  { n: "Curry de pollo con arroz", g: "carne", i: ["pechuga de pollo", "leche de coco", "curry", "cebolla", "espinacas", "arroz integral"], blanca: true },
  { n: "Albóndigas de ternera en salsa de tomate", g: "carne", i: ["carne picada de ternera", "tomate triturado", "cebolla", "guisantes", "arroz integral"] },
  { n: "Ternera salteada con brócoli", g: "carne", i: ["ternera magra", "brócoli", "cebolla", "quinoa"] },
  { n: "Lomo a la plancha con pimientos y patata", g: "carne", i: ["lomo de cerdo", "pimiento", "patata"] },

  // Verdura como protagonista (con algo de proteína de queso, frutos secos o tofu)
  { n: "Crema de calabaza y ensalada de queso fresco", g: "verdura", i: ["calabaza", "puerro", "zanahoria", "queso fresco", "rúcula", "nueces"] },
  { n: "Pizza casera de verduras", g: "verdura", i: ["masa de pizza integral", "tomate triturado", "mozzarella", "champiñones", "pimiento", "cebolla"] },
  { n: "Wok de tofu con verduras", g: "verdura", i: ["tofu firme", "verdura para wok", "arroz integral"] },
  { n: "Berenjenas rellenas gratinadas", g: "verdura", i: ["berenjena", "tomate triturado", "cebolla", "queso rallado", "nueces"] },
  { n: "Menestra de verduras con huevo duro", g: "verdura", i: ["alcachofas", "judías verdes", "guisantes", "zanahoria", "huevos"] },
  { n: "Ensalada de quinoa, aguacate y queso", g: "verdura", i: ["quinoa", "aguacate", "tomate", "pepino", "queso fresco"] },
  { n: "Coliflor al horno con salsa de yogur y garbanzos tostados", g: "verdura", i: ["coliflor", "yogur natural", "garbanzos", "comino"] },
  { n: "Lasaña de verduras y requesón", g: "verdura", i: ["calabacín", "berenjena", "espinacas", "requesón", "tomate triturado", "queso rallado", "pasta integral"] },

  // Cenas ligeras
  { n: "Merluza a la plancha con ensalada", g: "pescado", i: ["merluza", "lechuga", "tomate", "pepino", "limón"] },
  { n: "Salmón en papillote con calabacín", g: "pescado", i: ["salmón", "calabacín", "limón", "pan integral"] },
  { n: "Sopa de pescado con verduras", g: "pescado", i: ["merluza", "gambas", "puerro", "zanahoria", "tomate", "caldo de verduras"] },
  { n: "Sardinas a la plancha con pimientos asados", g: "pescado", i: ["sardinas", "pimiento", "pan integral"] },
  { n: "Crema de calabacín y tortilla francesa", g: "huevo", i: ["huevos", "calabacín", "puerro", "patata"] },
  { n: "Revuelto de setas con ensalada de tomate", g: "huevo", i: ["huevos", "champiñones", "lechuga", "tomate"] },
  { n: "Crema de verduras con queso fresco y pan integral", g: "verdura", i: ["calabaza", "zanahoria", "puerro", "queso fresco", "pan integral"] },
  { n: "Verduras al horno con queso fresco y nueces", g: "verdura", i: ["berenjena", "calabacín", "pimiento", "cebolla", "queso fresco", "nueces"] },
  { n: "Pollo a la plancha con ensalada y pan integral", g: "carne", i: ["pechuga de pollo", "lechuga", "tomate", "pepino", "pan integral"], blanca: true },
  { n: "Pavo salteado con verduras", g: "carne", i: ["pavo", "calabacín", "pimiento", "champiñones", "cebolla"], blanca: true },
  { n: "Ensalada de alubias con tomate y pimiento", g: "legumbre", i: ["alubias blancas", "tomate", "pimiento", "cebolla"] },
];

const BASICOS = [
  ["Fruta de temporada variada", "Fruta y verdura"],
  ["Pan integral", "Pan y cereales"],
  ["Copos de avena", "Pan y cereales"],
  ["Leche", "Huevos y lácteos"],
  ["Yogur natural", "Huevos y lácteos"],
  ["Aceite de oliva virgen extra", "Despensa"],
  ["Frutos secos naturales", "Despensa"],
];

// Desayunos: cereal integral + lácteo o proteína + fruta.
const DESAYUNOS = [
  { n: "Tostada integral con tomate y aceite, y leche o café con leche", i: ["pan integral", "tomate", "aceite de oliva virgen extra", "leche"] },
  { n: "Copos de avena con yogur natural, fruta y nueces", i: ["copos de avena", "yogur natural", "fruta de temporada variada", "nueces"] },
  { n: "Tostada integral con aguacate y huevo, y una fruta", i: ["pan integral", "aguacate", "huevos", "fruta de temporada variada"] },
  { n: "Yogur natural con fruta troceada y frutos secos", i: ["yogur natural", "fruta de temporada variada", "frutos secos naturales"] },
  { n: "Tostada integral con queso fresco y tomate, y leche", i: ["pan integral", "queso fresco", "tomate", "leche"] },
  { n: "Gachas de avena con leche y plátano", i: ["copos de avena", "leche", "fruta de temporada variada"] },
  { n: "Tostada con crema de cacahuete 100 % y fruta", i: ["pan integral", "crema de cacahuete", "fruta de temporada variada"] },
  { n: "Tortilla francesa con pan integral y una mandarina", i: ["huevos", "pan integral", "fruta de temporada variada"] },
  { n: "Tostada integral con aguacate y tomate, y leche", i: ["pan integral", "aguacate", "tomate", "leche"] },
  { n: "Requesón con fruta y nueces, y una tostada integral", i: ["requesón", "fruta de temporada variada", "nueces", "pan integral"] },
  { n: "Tostada integral con hummus y una fruta", i: ["pan integral", "garbanzos", "tahini", "limón", "fruta de temporada variada"] },
  { n: "Leche con copos de avena, nueces y fruta", i: ["leche", "copos de avena", "nueces", "fruta de temporada variada"] },
  { n: "Tortitas de maíz con aguacate y tomate, y una fruta", i: ["tortitas de maíz", "aguacate", "tomate", "fruta de temporada variada"] },
  { n: "Fruta de temporada con un puñado de frutos secos", i: ["fruta de temporada variada", "frutos secos naturales"] },
  { n: "Fruta de temporada y una infusión", i: ["fruta de temporada variada"] },
];

// Meriendas y media mañana: pequeñas, con algo de proteína o fibra.
const MERIENDAS = [
  { n: "Fruta y un puñado de frutos secos", i: ["fruta de temporada variada", "frutos secos naturales"] },
  { n: "Bocadillo pequeño de queso fresco y tomate", i: ["pan integral", "queso fresco", "tomate"] },
  { n: "Yogur natural con fruta", i: ["yogur natural", "fruta de temporada variada"] },
  { n: "Palitos de zanahoria y pepino con hummus", i: ["zanahoria", "pepino", "garbanzos", "tahini", "limón"] },
  { n: "Vaso de leche y tostada integral con aceite", i: ["leche", "pan integral", "aceite de oliva virgen extra"] },
  { n: "Bocadillo pequeño de tortilla", i: ["pan integral", "huevos"] },
  { n: "Batido casero de leche y fruta, sin azúcar", i: ["leche", "fruta de temporada variada"] },
  { n: "Tostada integral con atún y tomate", i: ["pan integral", "atún al natural", "tomate"] },
  { n: "Tortitas de maíz con aguacate", i: ["tortitas de maíz", "aguacate"] },
  { n: "Una pieza de fruta", i: ["fruta de temporada variada"] },
];
