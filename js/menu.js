// despensa — menú semanal en tres pasos: el menú (desayuno, comida, merienda y cena),
// la lista de la compra y qué cocinar hoy.
// Lo que marcas en la lista de la compra significa «lo tengo en casa». Si hay algo
// marcado, cualquier menú nuevo lo aprovecha primero, sin saltarse las raciones de la AESAN.
// Las alergias nunca se saltan; los platos que no os gustan, solo si no queda otra.
(function () {
  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const ORDEN_PASILLOS = ["Fruta y verdura", "Pescadería", "Carnicería", "Huevos y lácteos", "Despensa", "Pan y cereales", "Congelados"];
  const NOMBRE_GRUPO = { legumbre: "Legumbre", pescado: "Pescado", huevo: "Huevo", carne: "Carne", verdura: "Verdura" };
  const GRUPOS = Object.keys(NOMBRE_GRUPO);

  // Frecuencias semanales para 14 comidas principales (AESAN, 2022).
  const PLAN = {
    normal: { legumbre: 4, pescado: 3, huevo: 3, carne: 3, verdura: 1 },
    vegetariano: { legumbre: 6, huevo: 4, verdura: 4, pescado: 0, carne: 0 },
  };
  const OBJETIVOS = {
    legumbre: { min: 4, texto: "al menos 4" },
    pescado: { min: 3, texto: "3 o más" },
    huevo: { max: 4, texto: "hasta 4" },
    carne: { max: 3, texto: "como mucho 3, mejor de ave" },
    verdura: { texto: "platos de verdura como protagonista" },
  };
  const MAX_HUEVOS = 4; // AESAN: hasta 4 huevos a la semana, contando todas las comidas
  const MAX_CARNE = 3;
  const MAX_PERSONAS = 12;

  // Ingredientes que dan sabor pero no deciden el plato: pesan menos al buscar coincidencias.
  const CONDIMENTOS = new Set(["ajo", "cebolla", "pimentón", "comino", "curry", "orégano", "limón", "caldo de verduras", "tomate triturado"]);
  // Lo que casi todo el mundo tiene en casa, para marcarlo de una vez.
  const BASICOS_CASA = ["ajo", "cebolla", "patata", "huevos", "tomate triturado", "pimentón", "arroz integral", "pasta integral", "lentejas", "garbanzos", "atún al natural", "aceite de oliva virgen extra", "leche", "pan integral", "limón"];
  const NOMBRE_ALERGIA = Object.fromEntries(ALERGIAS);

  const CLAVE = "despensa-menu-v1";
  const $ = id => document.getElementById(id);
  const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || null; } catch (e) { return null; }
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* sin almacenamiento */ }
  }

  // Todo lo que puede haber en casa: ingredientes de los platos y básicos.
  const CATALOGO = {};
  for (const [pasillo, lista] of Object.entries(PASILLOS)) lista.forEach(x => { CATALOGO[x] = pasillo; });
  BASICOS.forEach(([nombre, pasillo]) => { CATALOGO[nombre.toLowerCase()] = pasillo; });

  const tengo = () => new Set(estado.marcados);

  const tieneCarneOPescado = p =>
    p.i.some(x => PASILLO_DE[x] === "Pescadería" || PASILLO_DE[x] === "Carnicería" || x === "atún al natural");
  const tieneHuevo = p => p.i.includes("huevos");
  const alergenosDe = p => [...new Set(p.i.flatMap(x => ALERGENOS[x] || []))];
  const ligero = p => !SOLO_COMIDA.has(p.n);
  const esCena = h => h % 2 === 1;

  // ---- Filtros: sin carne ni pescado, alergias y platos que no os gustan ----

  // Lo que se puede comer en casa: las alergias y el «sin carne ni pescado» no se saltan nunca.
  function permitido(p, e) {
    if (e.vegetariano && tieneCarneOPescado(p)) return false;
    const al = new Set(e.alergias || []);
    return !p.i.some(x => (ALERGENOS[x] || []).some(a => al.has(a)));
  }

  // Los platos entre los que elegir. Si al quitar los que no os gustan quedan muy pocos,
  // se vuelven a admitir (mejor repetir un plato que no os entusiasma que dejar huecos).
  function pool(e) {
    const ok = PLATOS.map((p, idx) => ({ p, idx })).filter(o => permitido(o.p, e));
    const vet = new Set(e.vetados || []);
    const sinVetar = ok.filter(o => !vet.has(o.p.n));
    const g = new Set(sinVetar.map(o => o.p.g));
    return { lista: sinVetar.length >= 8 && g.has("legumbre") ? sinVetar : ok, ignoraVetos: !(sinVetar.length >= 8 && g.has("legumbre")) };
  }

  // Cuántos platos distintos hay de cada grupo. La carne roja cuenta como uno solo,
  // porque no puede salir más de una vez; y fuera del grupo huevo solo cuentan los platos
  // sin huevo, para que el cupo de huevos de la semana nunca deje un hueco sin plato.
  function disponibles(lista) {
    const d = {}, rojas = {}, ligeros = {};
    GRUPOS.forEach(g => { d[g] = 0; ligeros[g] = 0; });
    lista.forEach(({ p }) => {
      if (p.g !== "huevo" && tieneHuevo(p)) return;
      if (p.g === "carne" && !p.blanca) { rojas.n = (rojas.n || 0) + 1; }
      else d[p.g]++;
      if (ligero(p)) ligeros[p.g]++;
    });
    d.carne += Math.min(rojas.n || 0, 1);
    return { d, ligeros };
  }

  // Cuántas veces sale cada grupo esta semana. Parte de la AESAN y, si un grupo no tiene
  // platos suficientes por las alergias o los gustos, reparte sus huecos entre los demás.
  function planPara(e) {
    const { lista } = pool(e);
    const { d } = disponibles(lista);
    const n = { ...PLAN[e.vegetariano ? "vegetariano" : "normal"] };
    const tope = g => (g === "carne" ? MAX_CARNE : g === "huevo" ? MAX_HUEVOS : Infinity);
    let exceso = 0;
    GRUPOS.forEach(g => { if (n[g] > d[g]) { exceso += n[g] - d[g]; n[g] = d[g]; } });
    const orden = e.vegetariano ? ["legumbre", "verdura", "huevo"] : ["legumbre", "verdura", "pescado", "carne", "huevo"];
    // Primero, con platos distintos; si no llega, repitiendo.
    for (const repetir of [false, true]) {
      let avanza = true;
      while (exceso > 0 && avanza) {
        avanza = false;
        for (const g of orden) {
          if (exceso <= 0) break;
          if (d[g] === 0 || n[g] >= tope(g) || (!repetir && n[g] >= d[g])) continue;
          n[g]++; exceso--; avanza = true;
        }
      }
    }
    // Último recurso: la legumbre siempre tiene platos sin alérgenos.
    if (exceso > 0) n.legumbre += exceso;
    return n;
  }

  const limiteLegumbreCena = (e, n) => Math.max(e.vegetariano ? 2 : 0, n.legumbre - 7);

  // ---- Generar el menú ----

  // Cuántos platos con huevo hay en total en la semana, menos los huecos indicados.
  function huevosEnSemana(e, sin) {
    sin = sin || {};
    let n = 0;
    e.menu.forEach((i, h) => { if (sin.menu !== h && tieneHuevo(PLATOS[i])) n++; });
    (e.desayunos || []).forEach((i, h) => { if (sin.d !== h && tieneHuevo(DESAYUNOS[i])) n++; });
    (e.meriendas || []).forEach((i, h) => { if (sin.m !== h && tieneHuevo(MERIENDAS[i])) n++; });
    return n;
  }

  function barajar(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  const peso = (x, k) => (k === 0 ? 2 : CONDIMENTOS.has(x) ? 0.5 : 1);

  // Qué parte de un plato tienes ya. El ingrediente principal (el primero) pesa el doble
  // y los condimentos, la mitad.
  function cobertura(p, casa) {
    let total = 0, hay = 0;
    const faltan = [];
    p.i.forEach((x, k) => {
      total += peso(x, k);
      if (casa.has(x)) hay += peso(x, k); else faltan.push(x);
    });
    return { valor: hay / total, faltan };
  }

  // Puntuación para elegir plato: lo que ya tienes cuenta entero; lo que ya vas a comprar
  // para otro plato de la semana cuenta un poco (así la lista sale más corta); y un toque
  // de azar para que cada menú sea distinto. Los platos del menú anterior se evitan.
  function puntuar(p, casa, compra, azar, anterior, idx) {
    let total = 0, s = 0;
    p.i.forEach((x, k) => {
      total += peso(x, k);
      if (casa.has(x)) s += peso(x, k);
      else if (compra.has(x)) s += 0.25 * peso(x, k);
    });
    const principal = casa.has(p.i[0]) ? 0.35 : 0;
    return s / total + principal + Math.random() * azar - (anterior.has(idx) ? 0.18 : 0);
  }

  // Reparte los grupos en 14 huecos: comida y cena de un mismo día nunca del mismo grupo,
  // la legumbre a mediodía y, si se puede, cenas de los grupos con platos ligeros.
  function repartirGrupos(e, n, ligeros) {
    const bolsa = [];
    GRUPOS.forEach(g => { for (let k = 0; k < n[g]; k++) bolsa.push(g); });
    const maxLeg = limiteLegumbreCena(e, n);
    const maxGrupo = Math.max(...GRUPOS.map(g => n[g]));
    for (let intento = 0; intento < 20000; intento++) {
      const h = barajar(bolsa);
      let ok = true;
      const cenas = {};
      for (let d = 0; d < 7 && ok; d++) {
        if (maxGrupo <= 7 && h[d * 2] === h[d * 2 + 1]) ok = false;
        cenas[h[d * 2 + 1]] = (cenas[h[d * 2 + 1]] || 0) + 1;
      }
      if (!ok || (cenas.legumbre || 0) > maxLeg) continue;
      // Las primeras veces se exige además que haya cenas ligeras para todos.
      if (intento < 15000 && GRUPOS.some(g => (cenas[g] || 0) > Math.max(ligeros[g], n[g] - 7))) continue;
      return h;
    }
    // Reparto seguro: de más a menos frecuente, primero las comidas y luego las cenas.
    // Así comida y cena nunca coinciden si ningún grupo pasa de siete.
    const orden = GRUPOS.slice().sort((a, b) => (b === "legumbre") - (a === "legumbre") || n[b] - n[a]);
    const fila = orden.flatMap(g => Array(n[g]).fill(g));
    const h = new Array(14);
    fila.forEach((g, k) => { h[k < 7 ? k * 2 : (k - 7) * 2 + 1] = g; });
    return h;
  }

  // Elige 7 desayunos o meriendas: sin repetir si se puede, respetando los filtros
  // y sin pasarse de huevos.
  function elegirExtras(lista, e, casa, compra, azar, anterior, huevosLibres) {
    const elegidos = [];
    let libres = huevosLibres;
    for (let k = 0; k < 7; k++) {
      let opciones = lista.map((p, idx) => ({ p, idx }))
        .filter(o => permitido(o.p, e) && !(libres <= 0 && tieneHuevo(o.p)));
      const sinRepetir = opciones.filter(o => !elegidos.includes(o.idx));
      if (sinRepetir.length) opciones = sinRepetir;
      const o = opciones.map(o => ({ o, s: puntuar(o.p, casa, compra, azar, anterior, o.idx) })).sort((a, b) => b.s - a.s)[0].o;
      if (tieneHuevo(o.p)) libres--;
      o.p.i.forEach(x => compra.add(x));
      elegidos.push(o.idx);
    }
    return { elegidos, libres };
  }

  // Opciones para un hueco, de mejor a peor: sin repetir, ligeras por la noche,
  // como mucho una carne roja y sin pasarse de huevos.
  function opcionesHueco(lista, g, h, usados, rojas, huevosLibres) {
    const filtrar = (a, f) => { const b = a.filter(f); return b.length ? b : a; };
    let o = lista.filter(x => x.p.g === g);
    if (!o.length) o = lista.filter(x => x.p.g === "legumbre");
    if (g === "carne" && rojas >= 1) o = filtrar(o, x => x.p.blanca);
    if (g !== "huevo" && huevosLibres <= 0) o = filtrar(o, x => !tieneHuevo(x.p));
    const nuevos = o.filter(x => !usados.has(x.idx));
    if (esCena(h)) {
      const ligerosNuevos = nuevos.filter(x => ligero(x.p));
      if (ligerosNuevos.length) return ligerosNuevos;
      if (nuevos.length) return nuevos;
      const ligeros = o.filter(x => ligero(x.p));
      return ligeros.length ? ligeros : o;
    }
    return nuevos.length ? nuevos : o;
  }

  function generar(base, marcados, anteriorEstado) {
    const e = { vegetariano: !!base.vegetariano, alergias: base.alergias || [], vetados: base.vetados || [], personas: base.personas };
    const casa = new Set(marcados);
    const prev = anteriorEstado || {};
    const anterior = new Set(prev.menu || []);
    const azar = casa.size ? 0.15 : 1;
    const { lista } = pool(e);
    const n = planPara(e);
    const { ligeros } = disponibles(lista);
    const huecos = repartirGrupos(e, n, ligeros);
    const usados = new Set();
    const compra = new Set();
    let rojas = 0;
    // Los huecos del grupo huevo ya gastan su cupo; el resto de platos con huevo, del sobrante.
    let huevosLibres = MAX_HUEVOS - n.huevo;
    const menu = new Array(14);
    // Primero las cenas, para que se queden con los platos ligeros.
    const orden = [...barajar([1, 3, 5, 7, 9, 11, 13]), ...barajar([0, 2, 4, 6, 8, 10, 12])];
    orden.forEach(h => {
      const g = huecos[h];
      const opciones = opcionesHueco(lista, g, h, usados, rojas, huevosLibres);
      const elegido = opciones
        .map(o => ({ o, s: puntuar(o.p, casa, compra, azar, anterior, o.idx) }))
        .sort((a, b) => b.s - a.s)[0].o;
      if (g === "carne" && !elegido.p.blanca) rojas++;
      if (g !== "huevo" && tieneHuevo(elegido.p)) huevosLibres--;
      usados.add(elegido.idx);
      elegido.p.i.forEach(x => compra.add(x));
      menu[h] = elegido.idx;
    });
    const d = elegirExtras(DESAYUNOS, e, casa, compra, azar, new Set(prev.desayunos || []), huevosLibres);
    const m = elegirExtras(MERIENDAS, e, casa, compra, azar, new Set(prev.meriendas || []), d.libres);
    return { ...e, menu, desayunos: d.elegidos, meriendas: m.elegidos, marcados: [...casa] };
  }

  // Comprueba que un menú guardado sigue cumpliendo todas las reglas con sus filtros.
  function cumpleReglas(e) {
    const menu = e.menu;
    if (!Array.isArray(menu) || menu.length !== 14 || !menu.every(i => Number.isInteger(i) && PLATOS[i])) return false;
    const extrasOk = (arr, lista) => Array.isArray(arr) && arr.length === 7 &&
      arr.every(i => Number.isInteger(i) && lista[i] && permitido(lista[i], e));
    if (!extrasOk(e.desayunos, DESAYUNOS) || !extrasOk(e.meriendas, MERIENDAS)) return false;
    const { lista, ignoraVetos } = pool(e);
    const enPool = new Set(lista.map(o => o.idx));
    if (!menu.every(i => enPool.has(i))) return false;
    if (huevosEnSemana(e) > MAX_HUEVOS) return false;
    if (menu.filter(i => PLATOS[i].g === "carne" && !PLATOS[i].blanca).length > 1) return false;
    const n = planPara(e);
    const { d, ligeros } = disponibles(lista);
    const g = menu.map(i => PLATOS[i].g);
    for (const k of GRUPOS) {
      const enGrupo = menu.filter(i => PLATOS[i].g === k);
      if (enGrupo.length !== n[k]) return false;
      // Sin platos repetidos, salvo que no haya bastantes.
      if (new Set(enGrupo).size < Math.min(n[k], d[k])) return false;
      // Por la noche, platos ligeros mientras los haya.
      const cenas = [1, 3, 5, 7, 9, 11, 13].filter(h => g[h] === k);
      const pesadas = cenas.filter(h => !ligero(PLATOS[menu[h]])).length;
      if (pesadas > Math.max(0, cenas.length - ligeros[k])) return false;
    }
    if (Math.max(...GRUPOS.map(k => n[k])) <= 7) {
      for (let dd = 0; dd < 7; dd++) if (g[2 * dd] === g[2 * dd + 1]) return false;
    }
    const cenasLegumbre = [1, 3, 5, 7, 9, 11, 13].filter(h => g[h] === "legumbre").length;
    if (cenasLegumbre > limiteLegumbreCena(e, n)) return false;
    return ignoraVetos || !menu.some(i => (e.vetados || []).includes(PLATOS[i].n));
  }

  // Otro plato del mismo grupo para un hueco, entre los tres que mejor encajan.
  function sustituto(hueco) {
    const actual = estado.menu[hueco];
    const g = PLATOS[actual].g;
    const { lista } = pool(estado);
    const enMenu = new Set(estado.menu);
    const rojasFuera = estado.menu.filter((i, h) => h !== hueco && PLATOS[i].g === "carne" && !PLATOS[i].blanca).length;
    const sinHuevo = g !== "huevo" && huevosEnSemana(estado, { menu: hueco }) >= MAX_HUEVOS;
    let o = lista.filter(x => x.p.g === g && x.idx !== actual);
    if (g === "carne" && rojasFuera >= 1) o = o.filter(x => x.p.blanca);
    if (sinHuevo) o = o.filter(x => !tieneHuevo(x.p));
    const nuevos = o.filter(x => !enMenu.has(x.idx));
    if (nuevos.length) o = nuevos;
    if (esCena(hueco)) {
      const lig = o.filter(x => ligero(x.p));
      if (lig.length) o = lig;
    }
    if (!o.length) return null;
    const casa = tengo();
    const compra = new Set();
    estado.menu.forEach((i, h) => { if (h !== hueco) PLATOS[i].i.forEach(x => compra.add(x)); });
    const mejores = o
      .map(x => ({ x, s: puntuar(x.p, casa, compra, casa.size ? 0.15 : 1, new Set(), x.idx) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3);
    return mejores[Math.floor(Math.random() * mejores.length)].x.idx;
  }

  function cambiar(hueco) {
    const nuevo = sustituto(hueco);
    if (nuevo === null) return;
    estado.menu[hueco] = nuevo;
    guardar();
    pintar();
    const boton = document.querySelector(`[data-hueco="${hueco}"]`);
    if (boton) boton.focus();
  }

  function cambiarExtra(tipo, h) {
    const lista = tipo === "d" ? DESAYUNOS : MERIENDAS;
    const arr = tipo === "d" ? estado.desayunos : estado.meriendas;
    const sinHueco = tipo === "d" ? { d: h } : { m: h };
    const sinHuevo = huevosEnSemana(estado, sinHueco) >= MAX_HUEVOS;
    let opciones = lista.map((p, idx) => ({ p, idx }))
      .filter(o => o.idx !== arr[h] && permitido(o.p, estado) && !(sinHuevo && tieneHuevo(o.p)));
    const nuevos = opciones.filter(o => !arr.includes(o.idx));
    if (nuevos.length) opciones = nuevos;
    if (!opciones.length) return;
    arr[h] = opciones[Math.floor(Math.random() * opciones.length)].idx;
    guardar();
    pintar();
    const boton = document.querySelector(`[data-extra="${tipo}${h}"]`);
    if (boton) boton.focus();
  }

  // «No nos gusta»: el plato sale del menú y no vuelve a proponerse.
  function vetar(nombre) {
    if (!estado.vetados.includes(nombre)) estado.vetados.push(nombre);
    estado.menu.forEach((i, h) => {
      if (PLATOS[i].n !== nombre) return;
      const nuevo = sustituto(h);
      if (nuevo !== null) estado.menu[h] = nuevo;
    });
    if (!cumpleReglas(estado)) estado = generar(estado, estado.marcados, estado);
    guardar();
    pintar();
  }
  function recuperar(nombre) {
    estado.vetados = estado.vetados.filter(n => n !== nombre);
    if (!cumpleReglas(estado)) estado = generar(estado, estado.marcados, estado);
    guardar();
    pintar();
  }

  // ---- Cantidades ----

  const SIN_CANTIDAD = new Set(["pimentón", "comino", "curry", "orégano", "aceite de oliva virgen extra"]);
  const UNIDADES = { ud: ["unidad", "unidades"], lata: ["lata", "latas"], diente: ["diente", "dientes"], pieza: ["pieza", "piezas"] };
  const num = n => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

  // Para la compra: redondeo a lo que se compra de verdad.
  function cantidadCompra(c, u) {
    if (u === "g" || u === "ml") {
      const r = Math.ceil(c / (c < 100 ? 10 : 50)) * (c < 100 ? 10 : 50);
      return r >= 1000 ? `${num(r / 1000)} ${u === "g" ? "kg" : "l"}` : `${r} ${u}`;
    }
    const r = Math.max(1, Math.ceil(c - 0.01));
    return `${r} ${UNIDADES[u][r === 1 ? 0 : 1]}`;
  }
  // Para la receta: más fino, con medias y cuartos.
  function cantidadReceta(c, u) {
    if (u === "g" || u === "ml") {
      const paso = c < 50 ? 5 : c < 200 ? 10 : 25;
      const r = Math.round(c / paso) * paso || paso;
      return r >= 1000 ? `${num(r / 1000)} ${u === "g" ? "kg" : "l"}` : `${r} ${u}`;
    }
    if (c <= 0.25) return `¼ de ${UNIDADES[u][0]}`;
    if (c <= 0.5) return `½ ${UNIDADES[u][0]}`;
    const r = Math.ceil(c * 2) / 2;
    const entero = Math.floor(r), medio = r - entero ? "½" : "";
    return `${entero}${medio} ${UNIDADES[u][r > 1 ? 1 : 0]}`;
  }
  const porPersona = (x, principal) => {
    const q = QTY[x];
    return q ? { c: principal ? q[0] : q[1], u: q[2] } : null;
  };

  function basicosPermitidos() {
    return BASICOS.filter(([nombre]) => permitido({ i: [nombre.toLowerCase()] }, estado));
  }

  function listaCompra() {
    const items = new Map();
    const personas = estado.personas;
    const sumar = (x, principal) => {
      if (!items.has(x)) items.set(x, { nombre: mayus(x), pasillo: CATALOGO[x], c: 0, u: null });
      const it = items.get(x), q = porPersona(x, principal);
      if (q && !SIN_CANTIDAD.has(x)) { it.c += q.c * personas; it.u = q.u; }
    };
    estado.menu.forEach(i => PLATOS[i].i.forEach((x, k) => sumar(x, k === 0)));
    [...estado.desayunos.map(i => DESAYUNOS[i]), ...estado.meriendas.map(i => MERIENDAS[i])]
      .forEach(p => p.i.forEach(x => sumar(x, false)));
    basicosPermitidos().forEach(([nombre, pasillo]) => {
      const k = nombre.toLowerCase();
      if (!items.has(k)) items.set(k, { nombre, pasillo, c: 0, u: null });
    });
    // Fruta: tres piezas al día por persona, entre postres, desayunos y meriendas.
    const fruta = items.get("fruta de temporada variada");
    if (fruta) { fruta.c = 21 * personas; fruta.u = "pieza"; }
    const porPasillo = {};
    for (const [k, v] of items) {
      (porPasillo[v.pasillo] ||= []).push({ clave: k, nombre: v.nombre, cantidad: v.u ? cantidadCompra(v.c, v.u) : "" });
    }
    return { porPasillo, total: items.size, claves: [...items.keys()] };
  }

  // ---- Pintar ----

  const etiquetaCobertura = c => {
    if (!c.faltan.length) return `<span class="cobertura completa">✓ Lo tienes todo</span>`;
    const txt = c.faltan.length === 1 ? `Falta ${c.faltan[0]}` : `Faltan ${c.faltan.length}`;
    return `<span class="cobertura" title="Te falta: ${c.faltan.join(", ")}">${txt}</span>`;
  };

  function pintarSemana(casa) {
    const fila = (etiqueta, nombre, boton, clase, cob) => `<dt>${etiqueta}</dt>
          <dd class="${clase}"><span>${nombre}
            ${boton}
            ${casa.size ? etiquetaCobertura(cob) : ""}</span></dd>`;
    $("semana").innerHTML = DIAS.map((dia, d) => {
      const hc = d * 2, hn = d * 2 + 1;
      const comida = PLATOS[estado.menu[hc]], cena = PLATOS[estado.menu[hn]];
      const des = DESAYUNOS[estado.desayunos[d]], mer = MERIENDAS[estado.meriendas[d]];
      const enlace = (p, h) => `<button type="button" class="plato-nombre" data-receta="${h}" aria-haspopup="dialog">${p.n}</button>`;
      return `<article class="dia"><h3>${dia}</h3><dl>
        ${fila("Desayuno", `<span class="plato-nombre">${des.n}</span>`, `<button type="button" class="cambiar" data-extra="d${d}" aria-label="Cambiar desayuno del ${dia.toLowerCase()}">cambiar</button>`, "ligera", cobertura(des, casa))}
        ${fila("Comida", enlace(comida, hc), `<button type="button" class="cambiar" data-hueco="${hc}" aria-label="Cambiar ${comida.n}">cambiar</button>`, "g-" + comida.g, cobertura(comida, casa))}
        ${fila("Merienda", `<span class="plato-nombre">${mer.n}</span>`, `<button type="button" class="cambiar" data-extra="m${d}" aria-label="Cambiar merienda del ${dia.toLowerCase()}">cambiar</button>`, "ligera", cobertura(mer, casa))}
        ${fila("Cena", enlace(cena, hn), `<button type="button" class="cambiar" data-hueco="${hn}" aria-label="Cambiar ${cena.n}">cambiar</button>`, "g-" + cena.g, cobertura(cena, casa))}
      </dl></article>`;
    }).join("");
    const filtros = [];
    if (estado.alergias.length) filtros.push(`sin ${estado.alergias.map(a => NOMBRE_ALERGIA[a].toLowerCase()).join(", ")}`);
    if (estado.vetados.length) filtros.push(`sin ${estado.vetados.length === 1 ? "el plato" : `los ${estado.vetados.length} platos`} que no os gusta${estado.vetados.length === 1 ? "" : "n"}`);
    const extra = filtros.length ? ` Hecho ${filtros.join(" y ")}.` : "";
    $("nota-menu").innerHTML = (casa.size
      ? `Este menú aprovecha primero las <strong>${casa.size}</strong> cosas que has marcado como «lo tengo» en la lista de la compra.`
      : `Cada menú cumple las raciones semanales recomendadas. Toca un plato para ver la receta.`) + esc(extra);
  }

  function pintarRecuento() {
    const cuenta = {};
    estado.menu.forEach(i => { const g = PLATOS[i].g; cuenta[g] = (cuenta[g] || 0) + 1; });
    const ajustado = estado.alergias.length || estado.vetados.length;
    let todoOk = true;
    $("recuento").innerHTML = GRUPOS
      .filter(g => cuenta[g] || (g === "pescado" && !estado.vegetariano))
      .map(g => {
        const n = cuenta[g] || 0, o = OBJETIVOS[g];
        const ok = (o.min === undefined || n >= o.min) && (o.max === undefined || n <= o.max);
        if (!ok) todoOk = false;
        let puntos = "";
        for (let k = 0; k < n; k++) puntos += "<i></i>";
        const meta = ok ? `✓ Recomendación: ${o.texto}` : ajustado ? `Recomendación: ${o.texto}. Ajustado a vuestras alergias y gustos` : `Recomendación: ${o.texto}`;
        return `<li class="g-${g}"><span class="r-nombre">${NOMBRE_GRUPO[g]}</span><span class="r-puntos" aria-hidden="true">${puntos}</span><span class="r-n">${n} ${n === 1 ? "vez" : "veces"}</span><span class="r-meta">${meta}</span></li>`;
      }).join("");
    $("recuento-resumen").textContent = todoOk ? "✓ Cumple las raciones semanales recomendadas"
      : ajustado ? "Lo más cerca posible de las raciones recomendadas, con vuestros filtros" : "Revisa las raciones de la semana";
  }

  function resumenCompra(casa) {
    const { total, claves } = listaCompra();
    const faltan = claves.filter(k => !casa.has(k)).length;
    const para = `para ${estado.personas} ${estado.personas === 1 ? "persona" : "personas"}`;
    $("compra-contador").innerHTML = faltan
      ? `<b>${faltan}</b><span>${faltan === 1 ? "producto por comprar" : "productos por comprar"}<br><small>de ${total} que necesita el menú, ${para}</small></span>`
      : `<b>✓</b><span>Lo tienes todo<br><small>no hace falta ir a comprar</small></span>`;
    $("ajustar").disabled = !casa.size;
    $("ajustar-ayuda").textContent = casa.size
      ? "El menú se rehace para usar primero lo que tienes."
      : "Marca primero lo que ya tienes en casa.";
  }

  // La lista de la compra: los ingredientes del menú con cantidades. Marcar = «lo tengo».
  function pintarCompra(casa) {
    const { porPasillo } = listaCompra();
    resumenCompra(casa);
    $("compra").innerHTML = ORDEN_PASILLOS.filter(p => porPasillo[p]).map(pasillo =>
      `<li class="bloque"><p class="grupo">${pasillo}</p><ul>` +
      porPasillo[pasillo].sort((a, b) => (casa.has(a.clave) - casa.has(b.clave)) || a.nombre.localeCompare(b.nombre, "es")).map(it =>
        `<li><label><input type="checkbox" data-clave="${it.clave}"${casa.has(it.clave) ? " checked" : ""}><span>${it.nombre}${it.cantidad ? ` <small class="cant">${it.cantidad}</small>` : ""}</span></label></li>`
      ).join("") + `</ul></li>`
    ).join("");
  }

  // Más cosas que puedes tener en casa aunque este menú no las use.
  function contarOtros(casa) {
    const enLista = new Set(listaCompra().claves);
    const n = [...casa].filter(k => !enLista.has(k)).length;
    $("otros-cuenta").textContent = n ? `${n} marcadas` : "";
  }
  function pintarOtros(casa) {
    const enLista = new Set(listaCompra().claves);
    const filtro = ($("buscar-otros").value || "").trim().toLowerCase();
    const porPasillo = {};
    Object.keys(CATALOGO).sort((a, b) => a.localeCompare(b, "es")).forEach(k => {
      if (enLista.has(k) || (filtro && !k.includes(filtro))) return;
      (porPasillo[CATALOGO[k]] ||= []).push(k);
    });
    contarOtros(casa);
    $("otros").innerHTML = ORDEN_PASILLOS.filter(p => porPasillo[p]).map(pasillo =>
      `<li class="bloque"><p class="grupo">${pasillo}</p><ul>` + porPasillo[pasillo].map(k =>
        `<li><label><input type="checkbox" data-clave="${k}"${casa.has(k) ? " checked" : ""}><span>${mayus(k)}</span></label></li>`).join("") + `</ul></li>`
    ).join("") || `<li><p class="suave">No hay nada que se llame «${esc(filtro)}».</p></li>`;
  }

  function pintarHoy(casa) {
    const caja = $("hoy");
    if (!casa.size) {
      caja.innerHTML = `<p class="vacio">Marca en la lista de la compra lo que ya tienes y aquí verás qué platos puedes cocinar.</p>`;
      return;
    }
    const todos = pool(estado).lista.map(({ p, idx }) => ({ p, idx, c: cobertura(p, casa) }))
      .sort((a, b) => b.c.valor - a.c.valor || a.c.faltan.length - b.c.faltan.length || Math.random() - 0.5);
    // Variedad: como mucho dos platos de cada grupo.
    const porGrupo = {};
    const lista = [];
    for (const x of todos) {
      if ((porGrupo[x.p.g] || 0) >= 2) continue;
      porGrupo[x.p.g] = (porGrupo[x.p.g] || 0) + 1;
      lista.push(x);
      if (lista.length === 6) break;
    }
    caja.innerHTML = `<ul class="hoy-lista">${lista.map(x => `<li class="g-${x.p.g}">
        <span class="hoy-plato"><button type="button" class="plato-nombre" data-plato="${x.idx}" aria-haspopup="dialog">${x.p.n}</button></span>
        <span class="hoy-barra" aria-hidden="true"><i style="width:${Math.round(x.c.valor * 100)}%"></i></span>
        <span class="hoy-falta">${x.c.faltan.length ? "Te falta: " + x.c.faltan.join(", ") : "✓ Lo tienes todo"}</span>
      </li>`).join("")}</ul>`;
  }

  // Ajustes: personas, alergias y platos que no os gustan.
  function pintarAjustes() {
    $("vegetariano").checked = !!estado.vegetariano;
    $("personas").textContent = estado.personas;
    $("menos").disabled = estado.personas <= 1;
    $("mas").disabled = estado.personas >= MAX_PERSONAS;
    const al = new Set(estado.alergias);
    $("alergias").innerHTML = ALERGIAS.map(([k, n]) =>
      `<label class="chip"><input type="checkbox" data-alergia="${k}"${al.has(k) ? " checked" : ""}><span>Sin ${n.toLowerCase()}</span></label>`).join("");
    $("alergias-cuenta").textContent = al.size ? `(${al.size})` : "";
    $("vetados-cuenta").textContent = estado.vetados.length ? `(${estado.vetados.length})` : "";
    $("vetados").innerHTML = estado.vetados.length
      ? estado.vetados.map(n => `<li><span>${esc(n)}</span><button type="button" class="cambiar" data-recuperar="${esc(n)}">volver a proponerlo</button></li>`).join("")
      : `<li class="suave">Ninguno. Si un plato no os gusta, ábrelo y pulsa «No nos gusta».</li>`;
  }

  function pintar() {
    const casa = tengo();
    pintarAjustes();
    pintarSemana(casa);
    pintarRecuento();
    pintarCompra(casa);
    pintarOtros(casa);
    pintarHoy(casa);
  }

  // ---- Ficha de receta ----

  const ficha = $("ficha");
  let fichaHueco = null, fichaPlato = null;

  function abrirFicha(idx, hueco) {
    const p = PLATOS[idx];
    const [min, pasos] = RECETAS[p.n] || [0, []];
    const casa = tengo();
    const per = estado.personas;
    fichaHueco = hueco; fichaPlato = idx;
    const al = alergenosDe(p).map(a => NOMBRE_ALERGIA[a].toLowerCase());
    const ingredientes = p.i.map((x, k) => {
      const q = SIN_CANTIDAD.has(x) ? null : porPersona(x, k === 0);
      const cant = q ? cantidadReceta(q.c * per, q.u) : "al gusto";
      return `<li${casa.has(x) ? ` class="hay"` : ""}><span>${mayus(x)}</span><b>${cant}</b>${casa.has(x) ? `<small>en casa</small>` : ""}</li>`;
    }).join("");
    $("ficha-cuerpo").innerHTML = `
      <p class="ficha-meta g-${p.g}"><span class="ficha-grupo">${NOMBRE_GRUPO[p.g]}</span><span>${min} min</span><span>Para ${per} ${per === 1 ? "persona" : "personas"}</span>${ligero(p) ? "" : `<span>Mejor a mediodía</span>`}</p>
      <h2 id="ficha-titulo">${p.n}</h2>
      ${al.length ? `<p class="ficha-alergenos">Contiene: ${al.join(", ")}.</p>` : ""}
      <h3>Ingredientes</h3>
      <ul class="ficha-ingredientes">${ingredientes}</ul>
      <p class="suave">Además: aceite de oliva virgen extra y sal, sin pasarse.</p>
      <h3>Cómo se hace</h3>
      <ol class="ficha-pasos">${pasos.map(s => `<li>${s}</li>`).join("")}</ol>`;
    $("ficha-cambiar").hidden = hueco === null;
    if (ficha.showModal) ficha.showModal(); else ficha.setAttribute("open", "");
    ficha.querySelector(".ficha-cerrar").focus();
  }
  function cerrarFicha() { if (ficha.close) ficha.close(); else ficha.removeAttribute("open"); }

  ficha.addEventListener("click", e => { if (e.target === ficha) cerrarFicha(); });
  ficha.querySelector(".ficha-cerrar").addEventListener("click", cerrarFicha);
  $("ficha-cambiar").addEventListener("click", () => {
    const h = fichaHueco;
    cerrarFicha();
    if (h !== null) cambiar(h);
  });
  $("ficha-vetar").addEventListener("click", () => {
    const nombre = PLATOS[fichaPlato].n;
    cerrarFicha();
    vetar(nombre);
    const aviso = $("nota-menu");
    if (aviso) aviso.insertAdjacentHTML("beforeend", ` <strong>«${esc(nombre)}» no volverá a salir.</strong>`);
  });

  // ---- Estado ----

  function marcar(clave, si) {
    const s = tengo();
    si ? s.add(clave) : s.delete(clave);
    estado.marcados = [...s];
    guardar();
  }

  // Carga: acepta datos de versiones anteriores y descarta los que no cuadran.
  let estado = leer();
  if (!estado || typeof estado !== "object") estado = {};
  const claveAlergia = new Set(ALERGIAS.map(a => a[0]));
  const nombres = new Set(PLATOS.map(p => p.n));
  const limpio = {
    vegetariano: !!estado.vegetariano,
    personas: Number.isInteger(estado.personas) && estado.personas >= 1 && estado.personas <= MAX_PERSONAS ? estado.personas : 2,
    alergias: Array.isArray(estado.alergias) ? [...new Set(estado.alergias.filter(a => claveAlergia.has(a)))] : [],
    vetados: Array.isArray(estado.vetados) ? [...new Set(estado.vetados.filter(n => nombres.has(n)))] : [],
    marcados: Array.isArray(estado.marcados) ? estado.marcados.filter(k => typeof k === "string") : [],
  };
  const valido = Array.isArray(estado.menu) && cumpleReglas({ ...estado, ...limpio });
  estado = valido
    ? { ...limpio, menu: estado.menu, desayunos: estado.desayunos, meriendas: estado.meriendas }
    : generar(limpio, limpio.marcados);
  estado.marcados = limpio.marcados;
  guardar();
  pintar();

  const rehacer = () => { estado = generar(estado, estado.marcados, estado); guardar(); pintar(); };

  $("nuevo").addEventListener("click", rehacer);
  $("vegetariano").addEventListener("change", e => { estado.vegetariano = e.target.checked; rehacer(); });
  $("imprimir").addEventListener("click", () => window.print());
  const personas = delta => {
    estado.personas = Math.min(MAX_PERSONAS, Math.max(1, estado.personas + delta));
    guardar();
    const casa = tengo();
    pintarAjustes(); pintarCompra(casa);
  };
  $("menos").addEventListener("click", () => personas(-1));
  $("mas").addEventListener("click", () => personas(1));
  $("alergias").addEventListener("change", e => {
    const k = e.target.dataset.alergia;
    if (!k) return;
    const s = new Set(estado.alergias);
    e.target.checked ? s.add(k) : s.delete(k);
    estado.alergias = ALERGIAS.map(a => a[0]).filter(a => s.has(a));
    rehacer();
    const de = document.querySelector(`[data-alergia="${k}"]`);
    if (de) de.focus();
  });
  $("vetados").addEventListener("click", e => {
    const b = e.target.closest("[data-recuperar]");
    if (b) recuperar(b.dataset.recuperar);
  });
  $("desmarcar").addEventListener("click", () => { estado.marcados = []; guardar(); pintar(); });
  $("semana").addEventListener("click", e => {
    const r = e.target.closest("[data-receta]");
    if (r) { const h = Number(r.dataset.receta); abrirFicha(estado.menu[h], h); return; }
    const b = e.target.closest(".cambiar");
    if (!b) return;
    if (b.dataset.extra) cambiarExtra(b.dataset.extra[0], Number(b.dataset.extra.slice(1)));
    else cambiar(Number(b.dataset.hueco));
  });
  $("hoy").addEventListener("click", e => {
    const r = e.target.closest("[data-plato]");
    if (r) abrirFicha(Number(r.dataset.plato), null);
  });

  // Marcar en la lista o en «otras cosas» es lo mismo: «lo tengo».
  const alMarcar = e => {
    const c = e.target.dataset && e.target.dataset.clave;
    if (!c) return;
    marcar(c, e.target.checked);
    const casa = tengo();
    pintarSemana(casa); pintarHoy(casa); resumenCompra(casa); contarOtros(casa);
  };
  $("compra").addEventListener("change", alMarcar);
  $("otros").addEventListener("change", alMarcar);
  $("buscar-otros").addEventListener("input", () => pintarOtros(tengo()));
  $("basicos-casa").addEventListener("click", () => {
    const s = tengo();
    BASICOS_CASA.forEach(k => s.add(k));
    estado.marcados = [...s];
    guardar();
    pintar();
  });
  $("ajustar").addEventListener("click", () => {
    rehacer();
    $("paso-menu").scrollIntoView({ block: "start" });
  });
})();
