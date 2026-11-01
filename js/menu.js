// despensa — generador de menú semanal y lista de la compra.
(function () {
  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const ORDEN_PASILLOS = ["Fruta y verdura", "Pescadería", "Carnicería", "Huevos y lácteos", "Despensa", "Pan y cereales", "Congelados"];
  const NOMBRE_GRUPO = { legumbre: "Legumbre", pescado: "Pescado", huevo: "Huevo", carne: "Carne", verdura: "Verdura" };

  // Frecuencias semanales para 14 comidas principales (AESAN, 2022).
  const PLAN = {
    normal: { legumbre: 4, pescado: 3, huevo: 3, carne: 3, verdura: 1 },
    vegetariano: { legumbre: 6, huevo: 4, verdura: 4 },
  };

  const CLAVE = "despensa-menu-v1";
  const $ = id => document.getElementById(id);

  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || null; } catch (e) { return null; }
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* sin almacenamiento */ }
  }

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

  function generar(vegetariano) {
    const huecos = repartirGrupos(vegetariano);
    const usados = new Set();
    let rojas = 0;
    const menu = huecos.map(g => {
      let opciones = barajar(candidatos(g, vegetariano)).filter(o => !usados.has(o.idx));
      // Carne roja o de cerdo: como mucho una vez por semana.
      if (g === "carne" && rojas >= 1) opciones = opciones.filter(o => o.p.blanca);
      const elegido = opciones[0] || barajar(candidatos(g, vegetariano))[0];
      if (g === "carne" && !elegido.p.blanca) rojas++;
      usados.add(elegido.idx);
      return elegido.idx;
    });
    return { vegetariano, menu, marcados: [] };
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
    estado.menu[hueco] = barajar(opciones)[0].idx;
    guardar();
    pintar();
    const boton = document.querySelector(`[data-hueco="${hueco}"]`);
    if (boton) boton.focus();
  }

  function listaCompra() {
    const items = new Map(); // clave en minúsculas → { nombre, pasillo }
    estado.menu.forEach(i => PLATOS[i].i.forEach(x => {
      const k = x.toLowerCase();
      if (!items.has(k)) items.set(k, { nombre: x.charAt(0).toUpperCase() + x.slice(1), pasillo: PASILLO_DE[x] });
    }));
    BASICOS.forEach(([nombre, pasillo]) => {
      const k = nombre.toLowerCase();
      if (!items.has(k)) items.set(k, { nombre, pasillo });
    });
    const porPasillo = {};
    for (const [k, v] of items) (porPasillo[v.pasillo] ||= []).push({ clave: k, nombre: v.nombre });
    return porPasillo;
  }

  function pintar() {
    $("vegetariano").checked = estado.vegetariano;

    $("semana").innerHTML = DIAS.map((dia, d) => {
      const fila = [0, 1].map(m => {
        const hueco = d * 2 + m;
        const p = PLATOS[estado.menu[hueco]];
        return `<dt>${m === 0 ? "Comida" : "Cena"}</dt>
          <dd class="g-${p.g}"><span><span class="sr">${NOMBRE_GRUPO[p.g]}: </span>${p.n}
            <button type="button" class="cambiar" data-hueco="${hueco}" aria-label="Cambiar ${p.n}">cambiar</button></span></dd>`;
      }).join("");
      return `<article class="dia"><h3>${dia}</h3><dl>${fila}</dl></article>`;
    }).join("");

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

    const marcados = new Set(estado.marcados);
    const porPasillo = listaCompra();
    $("compra").innerHTML = ORDEN_PASILLOS.filter(p => porPasillo[p]).map(pasillo =>
      `<li class="bloque"><p class="grupo">${pasillo}</p><ul>` +
      porPasillo[pasillo].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")).map(it =>
        `<li><label><input type="checkbox" data-clave="${it.clave}"${marcados.has(it.clave) ? " checked" : ""}><span>${it.nombre}</span></label></li>`
      ).join("") + `</ul></li>`
    ).join("");
  }

  let estado = leer();
  const valido = estado && Array.isArray(estado.menu) && estado.menu.length === 14 && estado.menu.every(i => PLATOS[i]);
  if (!valido) { estado = generar(false); guardar(); }
  pintar();

  $("nuevo").addEventListener("click", () => { estado = generar(estado.vegetariano); guardar(); pintar(); });
  $("vegetariano").addEventListener("change", e => { estado = generar(e.target.checked); guardar(); pintar(); });
  $("imprimir").addEventListener("click", () => window.print());
  $("desmarcar").addEventListener("click", () => { estado.marcados = []; guardar(); pintar(); });

  $("semana").addEventListener("click", e => {
    const b = e.target.closest(".cambiar");
    if (b) cambiar(Number(b.dataset.hueco));
  });
  $("compra").addEventListener("change", e => {
    const c = e.target.dataset.clave;
    if (!c) return;
    const s = new Set(estado.marcados);
    e.target.checked ? s.add(c) : s.delete(c);
    estado.marcados = [...s];
    guardar();
  });
})();
