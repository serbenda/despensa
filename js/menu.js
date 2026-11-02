// despensa — generador de menú semanal, despensa de casa y lista de la compra.
// Lo que marcas como «lo tengo», tanto en la despensa como en la lista de la compra,
// es el mismo conjunto: sirve para hacer el menú a partir de lo que hay en casa
// y para que la lista solo pida lo que falta.
(function () {
  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const ORDEN_PASILLOS = ["Fruta y verdura", "Pescadería", "Carnicería", "Huevos y lácteos", "Despensa", "Pan y cereales", "Congelados"];
  const NOMBRE_GRUPO = { legumbre: "Legumbre", pescado: "Pescado", huevo: "Huevo", carne: "Carne", verdura: "Verdura" };

  // Frecuencias semanales para 14 comidas principales (AESAN, 2022).
  const PLAN = {
    normal: { legumbre: 4, pescado: 3, huevo: 3, carne: 3, verdura: 1 },
    vegetariano: { legumbre: 6, huevo: 4, verdura: 4 },
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

  // Catálogo de todo lo que puede haber en casa: ingredientes de los platos y básicos.
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

  // Qué parte de un plato tienes ya. El ingrediente principal (el primero) pesa el doble
  // y los condimentos, la mitad.
  function cobertura(p, casa) {
    let total = 0, hay = 0;
    const faltan = [];
    p.i.forEach((x, k) => {
      const peso = k === 0 ? 2 : CONDIMENTOS.has(x) ? 0.5 : 1;
      total += peso;
      if (casa.has(x)) hay += peso; else faltan.push(x);
    });
    return { valor: hay / total, faltan };
  }

  // Reparte los grupos en 14 huecos: comida y cena de un mismo día nunca del mismo grupo,
  // y la legumbre preferentemente a mediodía.
  function repartirGrupos(vegetariano) {
    const plan = PLAN[vegetariano ? "vegetariano" : "normal"];
    const bolsa = [];
    for (const [g, n] of Object.entries(plan)) for (let k = 0; k < n; k++) bolsa.push(g);
    const maxLegumbreCena = vegetariano ? 2 : 0;
    for (let intento = 0; intento < 2000; intento++) {
      const h = barajar(bolsa);
      let ok = true, legCena = 0;
      for (let d = 0; d < 7 && ok; d++) {
        if (h[d * 2] === h[d * 2 + 1]) ok = false;
        if (h[d * 2 + 1] === "legumbre") legCena++;
      }
      if (ok && legCena <= maxLegumbreCena) return h;
    }
    return barajar(bolsa);
  }

  // Ordena las opciones: al azar, o primero las que más aprovechan lo que tienes
  // (con un poco de azar para que no salga siempre lo mismo).
  function ordenar(opciones, modo, casa) {
    if (modo !== "casa") return barajar(opciones);
    return opciones
      .map(o => ({ o, s: cobertura(o.p, casa).valor + Math.random() * 0.12 }))
      .sort((a, b) => b.s - a.s)
      .map(x => x.o);
  }

  function generar(vegetariano, modo, marcados) {
    const casa = new Set(marcados);
    const huecos = repartirGrupos(vegetariano);
    // En modo «con lo que tengo», rellena primero los grupos con más donde elegir
    // para que los mejores platos no se gasten en el primer hueco.
    const orden = huecos.map((g, i) => i);
    if (modo === "casa") orden.sort(() => Math.random() - 0.5);
    const usados = new Set();
    let rojas = 0;
    const menu = new Array(14);
    orden.forEach(i => {
      const g = huecos[i];
      let opciones = candidatos(g, vegetariano).filter(o => !usados.has(o.idx));
      // Carne roja o de cerdo: como mucho una vez por semana.
      if (g === "carne" && rojas >= 1) opciones = opciones.filter(o => o.p.blanca);
      const elegido = ordenar(opciones, modo, casa)[0] || barajar(candidatos(g, vegetariano))[0];
      if (g === "carne" && !elegido.p.blanca) rojas++;
      usados.add(elegido.idx);
      menu[i] = elegido.idx;
    });
    return { vegetariano, modo, menu, marcados: [...casa] };
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
    const ordenadas = ordenar(opciones, estado.modo, tengo());
    // Con lo que tengo: una de las tres mejores, para poder ir probando.
    const pool = estado.modo === "casa" ? ordenadas.slice(0, 3) : ordenadas;
    estado.menu[hueco] = pool[Math.floor(Math.random() * pool.length)].idx;
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

  const etiquetaCobertura = (c, n) => {
    if (!c.faltan.length) return `<span class="cobertura completa" title="Tienes todo">✓ Lo tienes todo</span>`;
    const txt = c.faltan.length === 1 ? `Falta ${c.faltan[0]}` : `Faltan ${c.faltan.length}`;
    return `<span class="cobertura" title="Te falta: ${c.faltan.join(", ")}">${txt}</span>`;
  };

  function pintarSemana(casa) {
    $("semana").innerHTML = DIAS.map((dia, d) => {
      const fila = [0, 1].map(m => {
        const hueco = d * 2 + m;
        const p = PLATOS[estado.menu[hueco]];
        const c = cobertura(p, casa);
        return `<dt>${m === 0 ? "Comida" : "Cena"}</dt>
          <dd class="g-${p.g}"><span><span class="sr">${NOMBRE_GRUPO[p.g]}: </span>${p.n}
            <button type="button" class="cambiar" data-hueco="${hueco}" aria-label="Cambiar ${p.n}">cambiar</button>
            ${casa.size ? etiquetaCobertura(c) : ""}</span></dd>`;
      }).join("");
      return `<article class="dia"><h3>${dia}</h3><dl>${fila}</dl></article>`;
    }).join("");
  }

  function pintarRecuento() {
    const cuenta = {};
    estado.menu.forEach(i => { const g = PLATOS[i].g; cuenta[g] = (cuenta[g] || 0) + 1; });
    const objetivos = {
      legumbre: { min: 4, texto: "al menos 4" },
      pescado: { min: 3, texto: "3 o más" },
      huevo: { max: 4, texto: "hasta 4" },
      carne: { max: 3, texto: "como mucho 3, mejor de ave" },
      verdura: { texto: "platos de verdura como protagonista" },
    };
    $("recuento").innerHTML = Object.keys(NOMBRE_GRUPO)
      .filter(g => cuenta[g] || (g === "pescado" && !estado.vegetariano))
      .map(g => {
        const n = cuenta[g] || 0, o = objetivos[g];
        const ok = (o.min === undefined || n >= o.min) && (o.max === undefined || n <= o.max);
        let puntos = "";
        for (let k = 0; k < n; k++) puntos += "<i></i>";
        return `<li class="g-${g}"><span class="r-nombre">${NOMBRE_GRUPO[g]}</span><span class="r-puntos" aria-hidden="true">${puntos}</span><span class="r-n">${n} ${n === 1 ? "vez" : "veces"}</span><span class="r-meta">${ok ? "✓ " : ""}Recomendación: ${o.texto}</span></li>`;
      }).join("");
  }

  function pintarCompra(casa) {
    const { porPasillo, total, claves } = listaCompra();
    const faltan = claves.filter(k => !casa.has(k)).length;
    $("compra-resumen").innerHTML = faltan
      ? `Te faltan <strong>${faltan}</strong> de ${total} productos. Marca lo que ya tienes o metes en el carro.`
      : `<strong>Lo tienes todo.</strong> No hace falta ir a comprar para este menú.`;
    $("compra").innerHTML = ORDEN_PASILLOS.filter(p => porPasillo[p]).map(pasillo =>
      `<li class="bloque"><p class="grupo">${pasillo}</p><ul>` +
      porPasillo[pasillo].sort((a, b) => (casa.has(a.clave) - casa.has(b.clave)) || a.nombre.localeCompare(b.nombre, "es")).map(it =>
        `<li><label><input type="checkbox" data-clave="${it.clave}"${casa.has(it.clave) ? " checked" : ""}><span>${it.nombre}</span></label></li>`
      ).join("") + `</ul></li>`
    ).join("");
  }

  function pintarDespensa(casa) {
    const filtro = ($("buscar-despensa").value || "").trim().toLowerCase();
    $("despensa-cuenta").textContent = casa.size
      ? `Tienes ${casa.size} ${casa.size === 1 ? "producto" : "productos"} marcados.`
      : "Aún no has marcado nada.";
    const porPasillo = {};
    Object.keys(CATALOGO).sort((a, b) => a.localeCompare(b, "es")).forEach(k => {
      if (filtro && !k.includes(filtro)) return;
      (porPasillo[CATALOGO[k]] ||= []).push(k);
    });
    const html = ORDEN_PASILLOS.filter(p => porPasillo[p]).map(p =>
      `<div class="despensa-grupo"><p class="grupo">${p}</p><div class="despensa-chips">${porPasillo[p].map(k =>
        `<button type="button" data-clave="${k}" aria-pressed="${casa.has(k)}">${mayus(k)}</button>`).join("")}</div></div>`).join("");
    $("despensa-lista").innerHTML = html || `<p class="suave">No hay nada que se llame «${filtro}». Prueba con otra palabra.</p>`;
  }

  function pintarHoy(casa) {
    const caja = $("hoy");
    if (!casa.size) {
      caja.innerHTML = `<p class="vacio">Marca lo que tienes en casa y aquí verás qué platos puedes cocinar ya.</p>`;
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
    $("vegetariano").checked = estado.vegetariano;
    document.querySelectorAll('input[name="modo-menu"]').forEach(r => { r.checked = r.value === estado.modo; });
    $("modo-nota").textContent = estado.modo === "casa"
      ? (casa.size ? "El menú aprovecha primero lo que tienes, sin saltarse las raciones recomendadas." : "Marca abajo lo que tienes en casa para que el menú lo aproveche.")
      : "Platos al azar que cumplen las raciones recomendadas.";
    pintarSemana(casa);
    pintarRecuento();
    pintarCompra(casa);
    pintarDespensa(casa);
    pintarHoy(casa);
  }

  function marcar(clave, si) {
    const s = tengo();
    si ? s.add(clave) : s.delete(clave);
    estado.marcados = [...s];
    guardar();
  }

  let estado = leer();
  const valido = estado && Array.isArray(estado.menu) && estado.menu.length === 14 && estado.menu.every(i => PLATOS[i]);
  if (!valido) { estado = generar(false, "azar", []); guardar(); }
  if (!estado.modo) estado.modo = "azar";
  if (!Array.isArray(estado.marcados)) estado.marcados = [];
  pintar();

  const rehacer = () => { estado = generar(estado.vegetariano, estado.modo, estado.marcados); guardar(); pintar(); };

  $("nuevo").addEventListener("click", rehacer);
  $("vegetariano").addEventListener("change", e => { estado.vegetariano = e.target.checked; rehacer(); });
  document.querySelectorAll('input[name="modo-menu"]').forEach(r => r.addEventListener("change", e => { estado.modo = e.target.value; rehacer(); }));
  $("imprimir").addEventListener("click", () => window.print());
  $("desmarcar").addEventListener("click", () => { estado.marcados = []; guardar(); pintar(); });

  $("semana").addEventListener("click", e => {
    const b = e.target.closest(".cambiar");
    if (b) cambiar(Number(b.dataset.hueco));
  });
  $("compra").addEventListener("change", e => {
    const c = e.target.dataset.clave;
    if (!c) return;
    marcar(c, e.target.checked);
    const casa = tengo();
    pintarSemana(casa); pintarDespensa(casa); pintarHoy(casa);
    $("compra-resumen").innerHTML = (() => {
      const { total, claves } = listaCompra();
      const faltan = claves.filter(k => !casa.has(k)).length;
      return faltan ? `Te faltan <strong>${faltan}</strong> de ${total} productos. Marca lo que ya tienes o metes en el carro.` : `<strong>Lo tienes todo.</strong> No hace falta ir a comprar para este menú.`;
    })();
  });

  $("despensa-lista").addEventListener("click", e => {
    const b = e.target.closest("button[data-clave]");
    if (!b) return;
    const si = b.getAttribute("aria-pressed") !== "true";
    marcar(b.dataset.clave, si);
    b.setAttribute("aria-pressed", si);
    const casa = tengo();
    $("despensa-cuenta").textContent = casa.size ? `Tienes ${casa.size} ${casa.size === 1 ? "producto" : "productos"} marcados.` : "Aún no has marcado nada.";
    pintarSemana(casa); pintarCompra(casa); pintarHoy(casa);
  });
  $("buscar-despensa").addEventListener("input", () => pintarDespensa(tengo()));
  $("basicos-casa").addEventListener("click", () => {
    const s = tengo();
    BASICOS_CASA.forEach(k => s.add(k));
    estado.marcados = [...s];
    guardar();
    pintar();
  });
  $("vaciar-despensa").addEventListener("click", () => { estado.marcados = []; guardar(); pintar(); });
  $("menu-con-lo-que-tengo").addEventListener("click", () => {
    estado.modo = "casa";
    rehacer();
    document.getElementById("t-semana").scrollIntoView({ block: "start" });
  });
})();
