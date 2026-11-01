// despensa — gráficos SVG sin dependencias.
// Cada gráfico se monta dentro de un <figure> con título, el dibujo, una tabla
// con los mismos datos (para lectores de pantalla y para quien prefiera números)
// y la fuente. Los colores salen de variables CSS, así que el modo oscuro es automático.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const nf = (v, dec) => v.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  function el(tag, attrs, padre) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(n);
    return n;
  }

  function texto(svg, x, y, cadena, attrs) {
    const t = el("text", Object.assign({ x, y }, attrs || {}), svg);
    t.textContent = cadena;
    return t;
  }

  // Barra con el extremo de datos redondeado (4px) y la base recta.
  function barraH(x, y, w, h, r) {
    r = Math.min(r, w, h / 2);
    if (w <= 0) return "";
    return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
  }

  // Envoltorio común: título, subtítulo, zona de dibujo, tabla y fuente.
  function marco(contenedor, cfg, filas, cabecera) {
    contenedor.classList.add("grafico");
    contenedor.innerHTML = "";
    if (cfg.titulo) {
      const h = document.createElement("h3");
      h.className = "grafico-titulo";
      h.textContent = cfg.titulo;
      contenedor.appendChild(h);
    }
    if (cfg.subtitulo) {
      const p = document.createElement("p");
      p.className = "grafico-sub";
      p.textContent = cfg.subtitulo;
      contenedor.appendChild(p);
    }
    const leyenda = document.createElement("div");
    leyenda.className = "grafico-leyenda";
    contenedor.appendChild(leyenda);
    const lienzo = document.createElement("div");
    lienzo.className = "grafico-lienzo";
    contenedor.appendChild(lienzo);
    const tip = document.createElement("div");
    tip.className = "grafico-tip";
    tip.hidden = true;
    lienzo.appendChild(tip);

    const det = document.createElement("details");
    det.className = "grafico-tabla";
    det.innerHTML = `<summary>Ver los datos en tabla</summary><div class="tabla-scroll"><table><thead><tr>${cabecera.map(c => `<th scope="col">${c}</th>`).join("")}</tr></thead><tbody>${filas.map(f => `<tr>${f.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    contenedor.appendChild(det);

    if (cfg.fuente) {
      const f = document.createElement("p");
      f.className = "grafico-fuente";
      f.innerHTML = "Fuente: " + cfg.fuente;
      contenedor.appendChild(f);
    }
    return { lienzo, tip, leyenda };
  }

  function mostrarTip(tip, lienzo, x, y, html) {
    tip.innerHTML = html;
    tip.hidden = false;
    const ancho = lienzo.clientWidth;
    const tw = tip.offsetWidth;
    let left = x + 12;
    if (left + tw > ancho) left = Math.max(0, x - tw - 12);
    tip.style.left = left + "px";
    tip.style.top = Math.max(0, y - tip.offsetHeight - 8) + "px";
  }

  function alRedimensionar(nodo, fn) {
    fn();
    let ultimo = nodo.clientWidth;
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        if (Math.abs(nodo.clientWidth - ultimo) > 4) { ultimo = nodo.clientWidth; fn(); }
      }).observe(nodo);
    }
  }

  // ---------- Barras horizontales (una serie) ----------
  // cfg: { titulo, subtitulo, fuente, datos:[{etiqueta, valor, destacar, nota}], unidad, decimales, max, color, referencia:{valor, etiqueta} }
  function barras(contenedor, cfg) {
    const dec = cfg.decimales || 0;
    const fmtD = d => nf(d.valor, d.decimales ?? dec) + (d.unidad ?? cfg.unidad ?? "");
    const filas = cfg.datos.map(d => [d.etiqueta, fmtD(d) + (d.nota ? ` (${d.nota})` : "")]);
    const { lienzo, tip } = marco(contenedor, cfg, filas, [cfg.columna || "", cfg.columnaValor || "Valor"]);

    function pintar() {
      lienzo.querySelectorAll("svg").forEach(s => s.remove());
      const W = Math.max(280, lienzo.clientWidth);
      const estrecho = W < 520;
      const alto = 22, hueco = estrecho ? 30 : 14;
      const etiquetaW = estrecho ? 0 : Math.min(230, W * 0.36);
      const margenDer = 70;
      const plotW = W - etiquetaW - margenDer;
      const filaH = alto + hueco + (estrecho ? 0 : 0);
      const top = 6;
      const H = top + cfg.datos.length * filaH + (cfg.referencia ? 22 : 4);
      const max = cfg.max || Math.max(...cfg.datos.map(d => d.valor), cfg.referencia ? cfg.referencia.valor : 0);

      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "img", "aria-label": cfg.titulo || "Gráfico de barras" });
      lienzo.insertBefore(svg, tip);

      // línea base
      el("line", { x1: etiquetaW, x2: etiquetaW, y1: top - 4, y2: H - (cfg.referencia ? 18 : 0), class: "g-eje" }, svg);

      cfg.datos.forEach((d, i) => {
        const y0 = top + i * filaH + (estrecho ? 18 : 0);
        const w = Math.max(2, (d.valor / max) * plotW);
        const g = el("g", { class: "g-marca" + (d.destacar ? " destacada" : ""), tabindex: 0 }, svg);
        if (estrecho) texto(g, 0, y0 - 6, d.etiqueta, { class: "g-etiqueta" });
        else texto(g, etiquetaW - 10, y0 + alto / 2 + 5, d.etiqueta, { class: "g-etiqueta", "text-anchor": "end" });
        el("rect", { x: etiquetaW, y: y0 - hueco / 2 + 1, width: plotW + margenDer, height: alto + hueco - 2, class: "g-golpe" }, g);
        el("path", { d: barraH(etiquetaW, y0, w, alto, 4), class: "g-barra", style: `fill:${d.destacar && cfg.colorDestacado ? cfg.colorDestacado : cfg.color || "var(--seccion)"}` }, g);
        texto(g, etiquetaW + w + 8, y0 + alto / 2 + 5, fmtD(d), { class: "g-valor" });
        const html = `<strong>${d.etiqueta}</strong>${fmtD(d)}${d.nota ? `<br><span>${d.nota}</span>` : ""}`;
        const ver = e => {
          const r = lienzo.getBoundingClientRect();
          const px = e && e.clientX ? e.clientX - r.left : etiquetaW + w;
          mostrarTip(tip, lienzo, px, y0, html);
        };
        g.addEventListener("mousemove", ver);
        g.addEventListener("focus", () => ver());
        g.addEventListener("mouseleave", () => { tip.hidden = true; });
        g.addEventListener("blur", () => { tip.hidden = true; });
      });

      if (cfg.referencia) {
        const x = etiquetaW + (cfg.referencia.valor / max) * plotW;
        el("line", { x1: x, x2: x, y1: top - 4, y2: H - 16, class: "g-referencia" }, svg);
        texto(svg, Math.min(x, W - 4), H - 3, cfg.referencia.etiqueta, { class: "g-nota", "text-anchor": x > W - 120 ? "end" : "middle" });
      }
    }
    alRedimensionar(lienzo, pintar);
  }

  // ---------- Líneas (una o varias series en el mismo eje) ----------
  // cfg: { titulo, subtitulo, fuente, x:[...], series:[{nombre, valores, color}], unidad, decimales, yMin, yMax, pasos }
  function lineas(contenedor, cfg) {
    const dec = cfg.decimales || 0;
    const fmt = v => nf(v, dec) + (cfg.unidad || "");
    const filas = cfg.x.map((x, i) => [String(x), ...cfg.series.map(s => fmt(s.valores[i]))]);
    const { lienzo, tip, leyenda } = marco(contenedor, cfg, filas, [cfg.columna || "Año", ...cfg.series.map(s => s.nombre)]);
    if (cfg.series.length > 1) {
      leyenda.innerHTML = cfg.series.map(s => `<span><i style="background:${s.color}"></i>${s.nombre}</span>`).join("");
    }

    function pintar() {
      lienzo.querySelectorAll("svg").forEach(s => s.remove());
      const W = Math.max(280, lienzo.clientWidth);
      const H = cfg.alto || 260;
      const m = { t: 14, r: W < 480 ? 54 : 130, b: 30, l: 40 };
      const pw = W - m.l - m.r, ph = H - m.t - m.b;
      const yMin = cfg.yMin ?? 0, yMax = cfg.yMax;
      const numerico = cfg.x.every(v => typeof v === "number");
      const x0 = cfg.x[0], x1 = cfg.x[cfg.x.length - 1];
      const X = i => m.l + (cfg.x.length === 1 ? pw / 2
        : numerico ? ((cfg.x[i] - x0) / (x1 - x0)) * pw
        : (i / (cfg.x.length - 1)) * pw);
      const Y = v => m.t + ph - ((v - yMin) / (yMax - yMin)) * ph;

      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "img", "aria-label": cfg.titulo || "Gráfico de líneas" });
      lienzo.insertBefore(svg, tip);

      const pasos = cfg.pasos || 4;
      for (let k = 0; k <= pasos; k++) {
        const v = yMin + ((yMax - yMin) * k) / pasos;
        el("line", { x1: m.l, x2: m.l + pw, y1: Y(v), y2: Y(v), class: k === 0 ? "g-eje" : "g-rejilla" }, svg);
        texto(svg, m.l - 8, Y(v) + 4, nf(v, 0) + (cfg.unidad || ""), { class: "g-tick", "text-anchor": "end" });
      }
      cfg.x.forEach((x, i) => texto(svg, X(i), H - 8, String(x), { class: "g-tick", "text-anchor": "middle" }));

      // Etiquetas finales sin solaparse
      const finales = cfg.series.map(s => ({ s, y: Y(s.valores[s.valores.length - 1]) })).sort((a, b) => a.y - b.y);
      for (let k = 1; k < finales.length; k++) if (finales[k].y - finales[k - 1].y < 30) finales[k].y = finales[k - 1].y + 30;

      cfg.series.forEach(s => {
        const d = s.valores.map((v, i) => `${i ? "L" : "M"}${X(i)},${Y(v)}`).join("");
        el("path", { d, class: "g-linea", style: `stroke:${s.color}` }, svg);
        s.valores.forEach((v, i) => el("circle", { cx: X(i), cy: Y(v), r: 4.5, class: "g-punto", style: `fill:${s.color}` }, svg));
        const fin = finales.find(f => f.s === s);
        const ultimo = s.valores[s.valores.length - 1];
        texto(svg, X(s.valores.length - 1) + 10, fin.y + 4, fmt(ultimo), { class: "g-valor" });
        if (W >= 480) texto(svg, X(s.valores.length - 1) + 10, fin.y + 19, s.nombre, { class: "g-nota" });
      });

      // Capa de hover: línea vertical y tooltip con todas las series en ese punto.
      const guia = el("line", { y1: m.t, y2: m.t + ph, class: "g-guia", visibility: "hidden" }, svg);
      const capa = el("rect", { x: m.l - 10, y: 0, width: pw + 20, height: H, class: "g-golpe", tabindex: 0 }, svg);
      let foco = cfg.x.length - 1;
      const verIndice = i => {
        foco = i;
        guia.setAttribute("x1", X(i)); guia.setAttribute("x2", X(i)); guia.setAttribute("visibility", "visible");
        const html = `<strong>${cfg.x[i]}</strong>` + cfg.series.map(s => `<span class="tip-fila"><i style="background:${s.color}"></i>${s.nombre}: ${fmt(s.valores[i])}</span>`).join("");
        const minY = Math.min(...cfg.series.map(s => Y(s.valores[i])));
        mostrarTip(tip, lienzo, X(i), minY, html);
      };
      capa.addEventListener("mousemove", e => {
        const r = svg.getBoundingClientRect();
        const px = (e.clientX - r.left) * (W / r.width);
        let mejor = 0;
        cfg.x.forEach((_, i) => { if (Math.abs(X(i) - px) < Math.abs(X(mejor) - px)) mejor = i; });
        verIndice(mejor);
      });
      capa.addEventListener("focus", () => verIndice(foco));
      capa.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") { e.preventDefault(); verIndice(Math.min(cfg.x.length - 1, foco + 1)); }
        if (e.key === "ArrowLeft") { e.preventDefault(); verIndice(Math.max(0, foco - 1)); }
      });
      const ocultar = () => { tip.hidden = true; guia.setAttribute("visibility", "hidden"); };
      capa.addEventListener("mouseleave", ocultar);
      capa.addEventListener("blur", ocultar);
    }
    alRedimensionar(lienzo, pintar);
  }

  // ---------- Terrones de azúcar (pictograma) ----------
  // cfg: { titulo, subtitulo, fuente, gramosPorTerron, datos:[{etiqueta, gramos, racion}] , limite:{gramos, etiqueta} }
  function terrones(contenedor, cfg) {
    const g = cfg.gramosPorTerron || 4;
    const filas = cfg.datos.map(d => [`${d.etiqueta} (${d.racion})`, `${nf(d.gramos, 0)} g`, nf(d.gramos / g, 1)]);
    const { lienzo } = marco(contenedor, cfg, filas, ["Producto y ración", "Azúcar", "Terrones"]);
    const lista = document.createElement("ul");
    lista.className = "terrones";
    lista.innerHTML = cfg.datos.map(d => {
      const n = d.gramos / g;
      const enteros = Math.floor(n), resto = n - enteros;
      let cubos = "";
      for (let k = 0; k < enteros; k++) cubos += '<i class="cubo"></i>';
      if (resto >= 0.25) cubos += `<i class="cubo parcial" style="--p:${Math.round(resto * 100)}%"></i>`;
      return `<li><span class="t-nombre"><strong>${d.etiqueta}</strong> <span>${d.racion}</span></span>
        <span class="t-cubos" aria-hidden="true">${cubos}</span>
        <span class="t-valor">${nf(d.gramos, 0)} g · ${nf(n, 1)} terrones</span></li>`;
    }).join("");
    lienzo.appendChild(lista);
    if (cfg.limite) {
      const p = document.createElement("p");
      p.className = "terrones-limite";
      p.textContent = cfg.limite;
      lienzo.appendChild(p);
    }
  }

  window.Grafico = { barras, lineas, terrones };
})();
