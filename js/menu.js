// despensa — menú semanal en tres pasos: el menú, la lista de la compra y qué cocinar hoy.
// Lo que marcas en la lista de la compra significa «lo tengo en casa». Si hay algo
// marcado, cualquier menú nuevo lo aprovecha primero, sin saltarse las raciones de la AESAN.
(function () {
  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const ORDEN_PASILLOS = ["Fruta y verdura", "Pescadería", "Carnicería", "Huevos y lácteos", "Despensa", "Pan y cereales", "Congelados"];
  const NOMBRE_GRUPO = { legumbre: "Legumbre", pescado: "Pescado", huevo: "Huevo", carne: "Carne", verdura: "Verdura" };

  // Frecuencias semanales para 14 comidas principales (AESAN, 2022).
  const PLAN = {
    normal: { legumbre: 4, pescado: 3, huevo: 3, carne: 3, verdura: 1 },
    vegetariano: { legumbre: 6, huevo: 4, verdura: 4 },
  };
  const OBJETIVOS = {
    legumbre: { min: 4, texto: "al menos 4" },
    pescado: { min: 3, texto: "3 o más" },
    huevo: { max: 4, texto: "hasta 4" },
    carne: { max: 3, texto: "como mucho 3, mejor de ave" },
    verdura: { texto: "platos de verdura como protagonista" },
  };

  // Ingredientes que dan sabor pero no deciden el plato: pesan menos al buscar coincidencias.
  const CONDIMENTOS = new Set(["ajo", "cebolla", "pimentón", "comino", "curry", "orégano", "limón", "caldo de verduras", "tomate triturado"]);
  // Lo que casi todo el mundo tiene en casa, para marcarlo de una vez.
  const BASICOS_CASA = ["ajo", "cebolla", "patata", "huevos", "tomate triturado", "pimentón", "arroz integral", "pasta integral", "lentejas", "garbanzos", "atún al natural", "aceite de oliva virgen extra", "leche", "pan integral", "limón"];

  const CLAVE = "despensa-menu-v1";
  const $ = id => document.getElementById(id);
  const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);

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

  function candidatos(grupo, vegetariano) {
    return PLATOS.map((p, idx) => ({ p, idx }))
      .filter(({ p }) => p.g === grupo && !(vegetariano && tieneCarneOPescado(p)));
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
    // Si el ingrediente principal ya está en casa, el plato gana mucho peso.
    const principal = casa.has(p.i[0]) ? 0.35 : 0;
    return s / total + principal + Math.random() * azar - (anterior.has(idx) ? 0.18 : 0);
  }

  // Reparte los grupos en 14 huecos: comida y cena de un mismo día nunca del mismo grupo,
  // y la legumbre a mediodía (en el menú vegetariano, como mucho dos cenas).
  function repartirGrupos(vegetariano) {
    const plan = PLAN[vegetariano ? "vegetariano" : "normal"];
    const bolsa = [];
    for (const [g, n] of Object.entries(plan)) for (let k = 0; k < n; k++) bolsa.push(g);
    const maxLegumbreCena = vegetariano ? 2 : 0;
    for (let intento = 0; intento < 20000; intento++) {
      const h = barajar(bolsa);
      let ok = true, legCena = 0;
      for (let d = 0; d < 7 && ok; d++) {
        if (h[d * 2] === h[d * 2 + 1]) ok = false;
        if (h[d * 2 + 1] === "legumbre") legCena++;
      }
      if (ok && legCena <= maxLegumbreCena) return h;
    }
    // Reparto seguro si el azar no encuentra uno (muy improbable).
    return vegetariano
      ? ["legumbre", "huevo", "legumbre", "verdura", "legumbre", "huevo", "legumbre", "verdura", "huevo", "legumbre", "legumbre", "verdura", "verdura", "huevo"]
      : ["legumbre", "pescado", "legumbre", "huevo", "carne", "pescado", "legumbre", "huevo", "legumbre", "carne", "verdura", "pescado", "carne", "huevo"];
  }

  function generar(vegetariano, marcados, menuAnterior) {
    const casa = new Set(marcados);
    const anterior = new Set(menuAnterior || []);
    const azar = casa.size ? 0.15 : 1;
    const huecos = repartirGrupos(vegetariano);
    const usados = new Set();
    const compra = new Set();
    let rojas = 0;
    const menu = new Array(14);
    barajar(huecos.map((g, i) => i)).forEach(i => {
      const g = huecos[i];
      let opciones = candidatos(g, vegetariano).filter(o => !usados.has(o.idx));
      // Carne roja o de cerdo: como mucho una vez por semana.
      if (g === "carne" && rojas >= 1) opciones = opciones.filter(o => o.p.blanca);
      const elegido = opciones
        .map(o => ({ o, s: puntuar(o.p, casa, compra, azar, anterior, o.idx) }))
        .sort((a, b) => b.s - a.s)[0].o;
      if (g === "carne" && !elegido.p.blanca) rojas++;
      usados.add(elegido.idx);
      elegido.p.i.forEach(x => compra.add(x));
      menu[i] = elegido.idx;
    });
    return { vegetariano, menu, marcados: [...casa] };
  }

  // Comprueba que un menú guardado sigue cumpliendo todas las reglas.
  function cumpleReglas(menu, vegetariano) {
    const g = menu.map(i => PLATOS[i].g);
    const n = k => g.filter(x => x === k).length;
    if (vegetariano && menu.some(i => tieneCarneOPescado(PLATOS[i]))) return false;
    if (n("legumbre") < 4 || n("huevo") > 4) return false;
    if (!vegetariano && (n("pescado") < 3 || n("carne") > 3)) return false;
    if (menu.filter(i => PLATOS[i].g === "carne" && !PLATOS[i].blanca).length > 1) return false;
    for (let d = 0; d < 7; d++) if (g[2 * d] === g[2 * d + 1]) return false;
    const cenasLegumbre = [1, 3, 5, 7, 9, 11, 13].filter(h => g[h] === "legumbre").length;
    return cenasLegumbre <= (vegetariano ? 2 : 0);
  }

  function cambiar(hueco) {
    const actual = PLATOS[estado.menu[hueco]];
    const enMenu = new Set(estado.menu);
    const rojasEnMenu = estado.menu.filter(i => PLATOS[i].g === "carne" && !PLATOS[i].blanca).length;
    let opciones = candidatos(actual.g, estado.vegetariano).filter(o => !enMenu.has(o.idx));
    if (actual.g === "carne" && (actual.blanca ? rojasEnMenu >= 1 : rojasEnMenu > 1)) {
      opciones = opciones.filter(o => o.p.blanca);
    }
    if (!opciones.length) return;
    const casa = tengo();
    const compra = new Set();
    estado.menu.forEach((i, h) => { if (h !== hueco) PLATOS[i].i.forEach(x => compra.add(x)); });
    const mejores = opciones
      .map(o => ({ o, s: puntuar(o.p, casa, compra, casa.size ? 0.15 : 1, new Set(), o.idx) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3);
    estado.menu[hueco] = mejores[Math.floor(Math.random() * mejores.length)].o.idx;
    guardar();
    pintar();
    const boton = document.querySelector(`[data-hueco="${hueco}"]`);
    if (boton) boton.focus();
  }

  function listaCompra() {
    const items = new Map();
    estado.menu.forEach(i => PLATOS[i].i.forEach(x => {
      if (!items.has(x)) items.set(x, { nombre: mayus(x), pasillo: PASILLO_DE[x] });
    }));
    BASICOS.forEach(([nombre, pasillo]) => {
      const k = nombre.toLowerCase();
      if (!items.has(k)) items.set(k, { nombre, pasillo });
    });
    const porPasillo = {};
    for (const [k, v] of items) (porPasillo[v.pasillo] ||= []).push({ clave: k, nombre: v.nombre });
    return { porPasillo, total: items.size, claves: [...items.keys()] };
  }

  const etiquetaCobertura = c => {
    if (!c.faltan.length) return `<span class="cobertura completa">✓ Lo tienes todo</span>`;
    const txt = c.faltan.length === 1 ? `Falta ${c.faltan[0]}` : `Faltan ${c.faltan.length}`;
    return `<span class="cobertura" title="Te falta: ${c.faltan.join(", ")}">${txt}</span>`;
  };

  function pintarSemana(casa) {
    $("semana").innerHTML = DIAS.map((dia, d) => {
      const fila = [0, 1].map(m => {
        const hueco = d * 2 + m;
        const p = PLATOS[estado.menu[hueco]];
        return `<dt>${m === 0 ? "Comida" : "Cena"}</dt>
          <dd class="g-${p.g}"><span><span class="sr">${NOMBRE_GRUPO[p.g]}: </span><span class="plato-nombre">${p.n}</span>
            <button type="button" class="cambiar" data-hueco="${hueco}" aria-label="Cambiar ${p.n}">cambiar</button>
            ${casa.size ? etiquetaCobertura(cobertura(p, casa)) : ""}</span></dd>`;
      }).join("");
      return `<article class="dia"><h3>${dia}</h3><dl>${fila}</dl></article>`;
    }).join("");
    $("nota-menu").innerHTML = casa.size
      ? `Este menú aprovecha primero las <strong>${casa.size}</strong> cosas que has marcado como «lo tengo» en la lista de la compra.`
      : `Cada menú cumple las raciones semanales recomendadas. Si marcas en la lista de la compra lo que ya tienes, el menú lo aprovechará.`;
  }

  function pintarRecuento() {
    const cuenta = {};
    estado.menu.forEach(i => { const g = PLATOS[i].g; cuenta[g] = (cuenta[g] || 0) + 1; });
    let todoOk = true;
    $("recuento").innerHTML = Object.keys(NOMBRE_GRUPO)
      .filter(g => cuenta[g] || (g === "pescado" && !estado.vegetariano))
      .map(g => {
        const n = cuenta[g] || 0, o = OBJETIVOS[g];
        const ok = (o.min === undefined || n >= o.min) && (o.max === undefined || n <= o.max);
        if (!ok) todoOk = false;
        let puntos = "";
        for (let k = 0; k < n; k++) puntos += "<i></i>";
        return `<li class="g-${g}"><span class="r-nombre">${NOMBRE_GRUPO[g]}</span><span class="r-puntos" aria-hidden="true">${puntos}</span><span class="r-n">${n} ${n === 1 ? "vez" : "veces"}</span><span class="r-meta">${ok ? "✓ " : ""}Recomendación: ${o.texto}</span></li>`;
      }).join("");
    $("recuento-resumen").textContent = todoOk ? "✓ Cumple las raciones semanales recomendadas" : "Revisa las raciones de la semana";
  }

  function resumenCompra(casa) {
    const { total, claves } = listaCompra();
    const faltan = claves.filter(k => !casa.has(k)).length;
    $("compra-contador").innerHTML = faltan
      ? `<b>${faltan}</b><span>${faltan === 1 ? "producto por comprar" : "productos por comprar"}<br><small>de ${total} que necesita el menú</small></span>`
      : `<b>✓</b><span>Lo tienes todo<br><small>no hace falta ir a comprar</small></span>`;
    $("ajustar").disabled = !casa.size;
    $("ajustar-ayuda").textContent = casa.size
      ? "El menú se rehace para usar primero lo que tienes."
      : "Marca primero lo que ya tienes en casa.";
  }

  // La lista de la compra: los ingredientes del menú. Marcar = «lo tengo».
  function pintarCompra(casa) {
    const { porPasillo } = listaCompra();
    resumenCompra(casa);
    $("compra").innerHTML = ORDEN_PASILLOS.filter(p => porPasillo[p]).map(pasillo =>
      `<li class="bloque"><p class="grupo">${pasillo}</p><ul>` +
      porPasillo[pasillo].sort((a, b) => (casa.has(a.clave) - casa.has(b.clave)) || a.nombre.localeCompare(b.nombre, "es")).map(it =>
        `<li><label><input type="checkbox" data-clave="${it.clave}"${casa.has(it.clave) ? " checked" : ""}><span>${it.nombre}</span></label></li>`
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
    ).join("") || `<li><p class="suave">No hay nada que se llame «${filtro}».</p></li>`;
  }

  function pintarHoy(casa) {
    const caja = $("hoy");
    if (!casa.size) {
      caja.innerHTML = `<p class="vacio">Marca en la lista de la compra lo que ya tienes y aquí verás qué platos puedes cocinar.</p>`;
      return;
    }
    const todos = PLATOS.map((p, idx) => ({ p, idx, c: cobertura(p, casa) }))
      .filter(x => !(estado.vegetariano && tieneCarneOPescado(x.p)))
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
        <span class="hoy-plato">${x.p.n}</span>
        <span class="hoy-barra" aria-hidden="true"><i style="width:${Math.round(x.c.valor * 100)}%"></i></span>
        <span class="hoy-falta">${x.c.faltan.length ? "Te falta: " + x.c.faltan.join(", ") : "✓ Lo tienes todo"}</span>
      </li>`).join("")}</ul>`;
  }

  function pintar() {
    const casa = tengo();
    $("vegetariano").checked = !!estado.vegetariano;
    pintarSemana(casa);
    pintarRecuento();
    pintarCompra(casa);
    pintarOtros(casa);
    pintarHoy(casa);
  }

  function marcar(clave, si) {
    const s = tengo();
    si ? s.add(clave) : s.delete(clave);
    estado.marcados = [...s];
    guardar();
  }

  // Carga: acepta datos de versiones anteriores y descarta los que no cuadran.
  let estado = leer();
  if (!estado || typeof estado !== "object") estado = {};
  const previos = Array.isArray(estado.marcados) ? estado.marcados.filter(k => typeof k === "string") : [];
  const veg = !!estado.vegetariano;
  const valido = Array.isArray(estado.menu) && estado.menu.length === 14 &&
    estado.menu.every(i => Number.isInteger(i) && PLATOS[i]) && new Set(estado.menu).size === 14 &&
    cumpleReglas(estado.menu, veg);
  if (!valido) estado = generar(veg, previos);
  estado = { vegetariano: veg, menu: estado.menu, marcados: previos };
  guardar();
  pintar();

  const rehacer = () => { estado = generar(estado.vegetariano, estado.marcados, estado.menu); guardar(); pintar(); };

  $("nuevo").addEventListener("click", rehacer);
  $("vegetariano").addEventListener("change", e => { estado.vegetariano = e.target.checked; rehacer(); });
  $("imprimir").addEventListener("click", () => window.print());
  $("desmarcar").addEventListener("click", () => { estado.marcados = []; guardar(); pintar(); });
  $("semana").addEventListener("click", e => {
    const b = e.target.closest(".cambiar");
    if (b) cambiar(Number(b.dataset.hueco));
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
