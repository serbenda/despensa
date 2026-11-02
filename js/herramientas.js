// despensa — herramientas interactivas.
// Uso: <div data-herramienta="cintura"></div>. Cada herramienta se pinta sola,
// calcula en el navegador y no envía nada a ningún sitio. Los datos que escribe
// la persona (altura, peso) se recuerdan solo en su navegador para no repetirlos.
(function () {
  const nf = (v, d = 0) => Number(v).toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });
  const num = s => { const v = parseFloat(String(s).replace(",", ".")); return isFinite(v) ? v : NaN; };
  const r5 = v => Math.round(v / 5) * 5;
  let cont = 0;
  const uid = p => `${p}-${++cont}`;

  // Memoria ligera compartida entre herramientas (altura, peso…)
  const CLAVE = "despensa-datos";
  const mem = {
    leer() { try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; } },
    poner(k, v) {
      try { const d = this.leer(); if (d[k] === v) return; d[k] = v; localStorage.setItem(CLAVE, JSON.stringify(d)); } catch (e) { /* sin almacenamiento */ }
      // Rellena el mismo dato en las demás herramientas de la página si están vacías.
      document.querySelectorAll(`input[data-mem="${k}"]`).forEach(i => {
        if (i.value === "" && document.activeElement !== i) { i.value = v; i.dispatchEvent(new Event("input", { bubbles: true })); }
      });
    },
  };

  const I = {
    cintura: '<ellipse cx="12" cy="12" rx="9" ry="5"/><path d="M5 9.5v5M8.5 7.4v3M12 7v4M15.5 7.4v3M19 9.5v5"/>',
    etiqueta: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.4"/>',
    cambios: '<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>',
    manos: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7h-.6a6 6 0 0 1-5.1-2.9L2.6 15a1.5 1.5 0 0 1 2.6-1.5L8 16"/>',
    deporte: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    sudor: '<path d="M12 3s7 7.4 7 12a7 7 0 0 1-14 0c0-4.6 7-12 7-12z"/>',
    edad: '<circle cx="12" cy="12" r="9"/><path d="M9 10.5h.01M15 10.5h.01M9 15c1.6 1.4 4.4 1.4 6 0"/>',
    mitos: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.7M12 17.4h.01"/>',
    nutrientes: '<path d="M9 3h6M10 3v6l-5.2 9.2A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.8L14 9V3M7.5 15h9"/>',
    fiambrera: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 12h18M9 8V5h6v3"/>',
    menu: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  };
  const icono = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

  const cabeza = (ic, titulo, desc) =>
    `<div class="herr-cabeza"><span class="icono">${icono(ic)}</span><h3>${titulo}</h3><p>${desc}</p></div>`;

  const campo = (id, etiqueta, unidad, attrs, ayuda, valor) =>
    `<div class="campo"><label for="${id}">${etiqueta}</label>
      <div class="con-unidad"><input id="${id}" type="number" ${attrs || ""}${valor !== undefined && valor !== "" ? ` value="${valor}"` : ""}><span>${unidad}</span></div>
      ${ayuda ? `<small>${ayuda}</small>` : ""}</div>`;

  const segmentos = (nombre, leyenda, opciones, marcado) =>
    `<fieldset class="segmentos herr-fila"><legend>${leyenda}</legend>${opciones.map(([v, t]) =>
      `<label><input type="radio" name="${nombre}" value="${v}"${v === marcado ? " checked" : ""}><span>${t}</span></label>`).join("")}</fieldset>`;

  const estado = (tipo, texto) => `<span class="estado ${tipo}">${texto}</span>`;
  const valor = (el, sel) => { const n = el.querySelector(sel); return n ? num(n.value) : NaN; };
  const radio = (el, nombre) => { const n = el.querySelector(`input[name="${nombre}"]:checked`); return n ? n.value : null; };

  const H = {};

  // ---------------------------------------------------------------- Cintura
  H.cintura = el => {
    const d = mem.leer();
    const a = uid("alt"), c = uid("cin"), p = uid("pes"), sx = uid("sx");
    el.innerHTML = cabeza("cintura", "¿Cómo está tu cintura?", "La grasa que se acumula en la tripa dice más de tu salud que el peso. Para mayores de 18 años, sin embarazo.") +
      `<div class="herr-cuerpo">
        <div class="campos">
          ${campo(a, "Altura", "cm", 'min="120" max="230" step="1" inputmode="decimal" data-mem="altura"', "", d.altura)}
          ${campo(c, "Cintura", "cm", 'min="40" max="200" step="0.5" inputmode="decimal"', "A medio camino entre la última costilla y el hueso de la cadera, sin apretar y después de soltar el aire.", d.cintura)}
          ${campo(p, "Peso, opcional", "kg", 'min="30" max="300" step="0.1" inputmode="decimal" data-mem="peso"', "Para calcular también el IMC.", d.peso)}
        </div>
        ${segmentos(sx, "Sexo", [["m", "Mujer"], ["h", "Hombre"]], d.sexo || "m")}
        <div class="resultados-2" aria-live="polite"><div class="resultado r1"></div><div class="resultado r2"></div></div>
        <p class="nota-herr">Cintura entre altura: 0,4 a 0,49 sin riesgo añadido, 0,5 a 0,59 riesgo aumentado, 0,6 o más riesgo alto (<a href="https://www.nice.org.uk/guidance/ng246">NICE</a>), para personas con un IMC por debajo de 35. Perímetro de cintura y categorías del IMC: <a href="https://www.who.int/es/news-room/fact-sheets/detail/obesity-and-overweight">OMS</a>. Para niños y adolescentes se usan tablas de percentiles: pregunta en tu centro de salud.</p>
      </div>`;

    const calc = () => {
      const alt = valor(el, "#" + a), cin = valor(el, "#" + c), pes = valor(el, "#" + p);
      const sexo = radio(el, sx);
      if (alt) mem.poner("altura", alt);
      if (cin) mem.poner("cintura", cin);
      if (pes) mem.poner("peso", pes);
      mem.poner("sexo", sexo);
      const r1 = el.querySelector(".r1"), r2 = el.querySelector(".r2");
      if (!(alt >= 120 && alt <= 230 && cin >= 40 && cin <= 200)) {
        r1.innerHTML = '<p class="vacio">Escribe tu altura y tu cintura para ver el resultado.</p>';
      } else {
        const ratio = cin / alt;
        let est, txt;
        if (ratio < 0.4) { est = estado("ojo", "Por debajo de lo habitual"); txt = "Si has perdido peso sin buscarlo, coméntalo con tu médico."; }
        else if (ratio < 0.5) { est = estado("ok", "Sin riesgo añadido"); txt = "Tu cintura mide menos de la mitad de tu altura. Mantén lo que estás haciendo."; }
        else if (ratio < 0.6) { est = estado("ojo", "Riesgo aumentado"); txt = `Hay más grasa alrededor de los órganos. Bajar <strong>${nf(cin - alt / 2)} cm</strong> de cintura te devolvería a la zona saludable y reduce el riesgo de diabetes tipo 2 y de enfermedad del corazón.`; }
        else { est = estado("no", "Riesgo alto"); txt = `Merece la pena hablarlo con tu médico de cabecera. Cada centímetro cuenta: tu objetivo a largo plazo sería bajar de <strong>${nf(alt / 2)} cm</strong>.`; }
        const pos = Math.min(100, Math.max(0, (ratio - 0.35) / 0.4 * 100));
        const lim = sexo === "h" ? [94, 102] : [80, 88];
        const oms = cin >= lim[1] ? estado("no", "Riesgo alto") : cin >= lim[0] ? estado("ojo", "Riesgo aumentado") : estado("ok", "Sin riesgo añadido");
        r1.innerHTML = `<b>Cintura entre altura</b>
          <span class="grande">${nf(ratio, 2)}</span>${est}
          <div class="medidor" aria-hidden="true">
            <div class="medidor-barra"><i style="width:12.5%;background:var(--linea)"></i><i style="width:25%;background:var(--ok)"></i><i style="width:25%;background:var(--ojo)"></i><i style="width:37.5%;background:var(--no)"></i></div>
            <div class="medidor-marca"><b style="left:${pos}%"></b></div>
            <div class="medidor-etiquetas"><span>0,35</span><span>0,5</span><span>0,6</span><span>0,75</span></div>
          </div>
          <p>${txt}</p>
          <p class="suave" style="font-size:.92rem">Según el perímetro de cintura de la OMS (${sexo === "h" ? "hombres: 94 y 102 cm" : "mujeres: 80 y 88 cm"}): ${oms}</p>`;
      }
      if (!(alt >= 120 && pes >= 30 && pes <= 300)) {
        r2.innerHTML = `<b>Índice de masa corporal</b><p class="vacio" style="margin-top:.4rem">Añade tu peso si quieres verlo. La cintura es mejor indicador, pero el IMC es el que usa tu médico.</p>`;
      } else {
        const imc = pes / Math.pow(alt / 100, 2);
        const cat = imc < 18.5 ? ["ojo", "Bajo peso"] : imc < 25 ? ["ok", "Peso normal"] : imc < 30 ? ["ojo", "Sobrepeso"] : imc < 35 ? ["no", "Obesidad de grado 1"] : imc < 40 ? ["no", "Obesidad de grado 2"] : ["no", "Obesidad de grado 3"];
        const min = 18.5 * Math.pow(alt / 100, 2), max = 24.9 * Math.pow(alt / 100, 2);
        let extra = "";
        if (imc >= 25) {
          const p5 = pes * 0.05, p10 = pes * 0.10;
          extra = `<p>Perder entre <strong>${nf(p5, 1)} y ${nf(p10, 1)} kg</strong> (del 5 al 10 % de tu peso) ya mejora la tensión, el azúcar y el colesterol, aunque no llegues al «peso ideal».</p>`;
        }
        r2.innerHTML = `<b>Índice de masa corporal</b>
          <span class="grande">${nf(imc, 1)}</span>${estado(cat[0], cat[1])}
          <p style="margin-top:.6rem">Para tu altura, el rango normal va de ${nf(min)} a ${nf(max)} kg.</p>${extra}
          <p class="suave" style="font-size:.88rem">El IMC no distingue músculo de grasa: en personas muy musculadas o mayores de 65 años puede engañar. En personas de origen asiático, de Oriente Medio, africano o afrocaribeño el riesgo empieza antes: sobrepeso desde 23 y obesidad desde 27,5.</p>`;
      }
    };
    el.addEventListener("input", calc);
    calc();
  };

  // ---------------------------------------------------------------- Etiqueta
  const UMBRAL = {
    comida: { grasas: [3, 17.5], saturadas: [1.5, 5], azucares: [5, 22.5], sal: [0.3, 1.5] },
    bebida: { grasas: [1.5, 8.75], saturadas: [0.75, 2.5], azucares: [2.5, 11.25], sal: [0.3, 0.75] },
  };
  const NUTR = [["grasas", "Grasas"], ["saturadas", "Saturadas"], ["azucares", "Azúcares"], ["sal", "Sal"]];
  const EJEMPLOS = [
    { n: "Galletas tipo María", t: "comida", v: [11, 1.3, 22, 0.6], r: 30, rt: "6 galletas" },
    { n: "Cereales de chocolate", t: "comida", v: [4, 1.5, 30, 0.4], r: 30, rt: "un bol" },
    { n: "Yogur natural", t: "comida", v: [3.3, 2.1, 4.5, 0.13], r: 125, rt: "un yogur" },
    { n: "Pan de molde", t: "comida", v: [4.5, 0.5, 4.5, 1.2], r: 50, rt: "2 rebanadas" },
    { n: "Tomate frito", t: "comida", v: [3.5, 0.5, 8, 1.2], r: 50, rt: "dos cucharadas" },
    { n: "Chorizo", t: "comida", v: [30, 11, 1, 4], r: 30, rt: "unas rodajas" },
    { n: "Refresco de cola", t: "bebida", v: [0, 0, 10.6, 0.01], r: 330, rt: "una lata" },
    { n: "Batido de cacao", t: "bebida", v: [1.6, 1, 9, 0.15], r: 200, rt: "un brik" },
  ];

  H.etiqueta = el => {
    const tp = uid("tipo"), ids = NUTR.map(([k]) => uid(k)), rac = uid("rac");
    el.innerHTML = cabeza("etiqueta", "Semáforo de la etiqueta", "Copia los valores «por 100 g» o «por 100 ml» de la tabla nutricional y mira de un vistazo si es para diario o para de vez en cuando.") +
      `<div class="herr-cuerpo">
        <div class="presets" role="group" aria-label="Ejemplos"><span>Prueba con:</span>${EJEMPLOS.map((e, i) => `<button type="button" data-i="${i}" aria-pressed="false">${e.n}</button>`).join("")}</div>
        ${segmentos(tp, "¿Es comida o bebida?", [["comida", "Comida, por 100 g"], ["bebida", "Bebida, por 100 ml"]], "comida")}
        <div class="campos">
          ${NUTR.map(([k, t], i) => campo(ids[i], t, "g", 'min="0" max="100" step="0.1" inputmode="decimal"')).join("")}
          ${campo(rac, "Ración, opcional", "g o ml", 'min="1" max="2000" step="1" inputmode="decimal"', "Lo que te vas a tomar de una vez.")}
        </div>
        <div aria-live="polite"><div class="semaforo"></div><div class="resultado veredicto"></div></div>
        <p class="nota-herr">Umbrales del semáforo nutricional del <a href="https://assets.publishing.service.gov.uk/media/5a80cd03ed915d74e33fc7c5/FoP_Nutrition_labelling_UK_guidance.pdf">Gobierno británico</a>, la referencia más usada en Europa, incluida la regla para raciones grandes (bebidas de más de 150 ml y comidas de más de 100 g). Los azúcares de la etiqueta incluyen los propios de la leche y la fruta: en un yogur natural no son azúcar añadido.</p>
      </div>`;

    const calc = () => {
      const tipo = radio(el, tp);
      const u = UMBRAL[tipo], ud = tipo === "bebida" ? "ml" : "g";
      const vals = ids.map(i => valor(el, "#" + i));
      const sem = el.querySelector(".semaforo"), ver = el.querySelector(".veredicto");
      if (vals.every(v => isNaN(v))) {
        sem.innerHTML = "";
        ver.innerHTML = '<p class="vacio">Rellena al menos un valor o elige un ejemplo.</p>';
        return;
      }
      const rv = valor(el, "#" + rac);
      // Regla de raciones grandes: bebidas de más de 150 ml y comidas de más de 100 g.
      const limR = tipo === "bebida"
        ? (rv > 150 ? { grasas: 10.5, saturadas: 3, azucares: 13.5, sal: 0.9 } : null)
        : (rv > 100 ? { grasas: 21, saturadas: 6, azucares: 27, sal: 1.8 } : null);
      const niveles = NUTR.map(([k, t], i) => {
        const v = vals[i];
        if (isNaN(v)) return { k, t, n: null };
        let n = v <= u[k][0] ? "ok" : v > u[k][1] ? "no" : "ojo";
        let racion = false;
        if (limR && v * rv / 100 > limR[k] && n !== "no") { n = "no"; racion = true; }
        return { k, t, v, n, racion };
      });
      const txt = { ok: "Bajo", ojo: "Medio", no: "Alto" };
      sem.innerHTML = niveles.map(x => x.n
        ? `<div class="luz ${x.n}"><b>${x.t}</b><span class="v">${nf(x.v, x.v < 1 && x.v > 0 ? 2 : 1)} g</span>${estado(x.n, x.racion ? "Alto por ración" : txt[x.n])}</div>`
        : `<div class="luz"><b>${x.t}</b><span class="v">—</span></div>`).join("");
      const rojos = niveles.filter(x => x.n === "no"), ambar = niveles.filter(x => x.n === "ojo");
      let titulo, cuerpo;
      if (rojos.length) {
        titulo = "Para de vez en cuando";
        const mucho = { grasas: "mucha grasa", saturadas: "mucha grasa saturada", azucares: "mucho azúcar", sal: "mucha sal" };
        const lista = rojos.map(x => mucho[x.k]);
        cuerpo = `Tiene ${lista.length > 1 ? lista.slice(0, -1).join(", ") + " y " + lista[lista.length - 1] : lista[0]}. Busca una versión con menos o tómalo en ocasiones, no a diario.`;
      } else if (ambar.length >= 1) {
        titulo = "Bien, con algún valor medio";
        cuerpo = `Nada se dispara, pero hay ${ambar.length === 1 ? "un valor" : "varios valores"} en ámbar. Compara con otras marcas: a menudo hay una mejor en el mismo estante.`;
      } else {
        titulo = "Buena elección para el día a día";
        cuerpo = "Todos los valores son bajos. Aun así, mira la lista de ingredientes: cuantos menos y más reconocibles, mejor.";
      }
      let porcion = "";
      if (rv > 0) {
        const az = vals[2], sal = vals[3];
        const partes = [];
        if (!isNaN(az)) partes.push(`<strong>${nf(az * rv / 100, 1)} g de azúcar</strong> (${nf(az * rv / 100 / 4, 1)} terrones)`);
        if (!isNaN(sal)) partes.push(`<strong>${nf(sal * rv / 100, 2)} g de sal</strong> (el ${nf(sal * rv / 100 / 5 * 100)} % del máximo diario de 5 g)`);
        if (partes.length) porcion = `<p>En tu ración de ${nf(rv)} ${ud}: ${partes.join(" y ")}.</p>`;
      }
      ver.innerHTML = `<span class="grande" style="font-size:1.6rem">${titulo}</span><p>${cuerpo}</p>${porcion}`;
    };

    el.querySelector(".presets").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const ej = EJEMPLOS[+b.dataset.i];
      el.querySelectorAll(".presets button").forEach(x => x.setAttribute("aria-pressed", x === b));
      el.querySelector(`input[name="${tp}"][value="${ej.t}"]`).checked = true;
      ids.forEach((i, k) => { el.querySelector("#" + i).value = ej.v[k]; });
      el.querySelector("#" + rac).value = ej.r;
      calc();
    });
    el.addEventListener("input", e => {
      if (e.isTrusted) el.querySelectorAll(".presets button").forEach(x => x.setAttribute("aria-pressed", "false"));
      calc();
    });
    calc();
  };

  // ---------------------------------------------------------------- Pequeños cambios
  const CAMBIOS = [
    { de: "Un refresco al día", a: "Agua, con gas o con limón", kcal: 139, az: 35, sal: 0 },
    { de: "Bollería en el desayuno", a: "Tostada integral con tomate y aceite", kcal: 120, az: 12, sal: 0 },
    { de: "Dos sobres de azúcar en el café", a: "Café sin azúcar, o con canela", kcal: 64, az: 16, sal: 0 },
    { de: "Una cerveza al día", a: "Cerveza 0,0 o agua con gas", kcal: 80, az: 0, sal: 0 },
    { de: "Bolsa de patatas fritas por la tarde", a: "Una pieza de fruta", kcal: 125, az: 0, sal: 0.5 },
    { de: "Picoteo de embutido", a: "Hummus con palitos de zanahoria", kcal: 80, az: 0, sal: 1.5 },
    { de: "Pan extra en la comida", a: "Más ensalada o verdura", kcal: 90, az: 0, sal: 0.5 },
    { de: "Yogur de sabor", a: "Yogur natural con fruta troceada", kcal: 20, az: 9, sal: 0 },
    { de: "Precocinado para cenar", a: "Tortilla francesa con ensalada", kcal: 150, az: 3, sal: 1.5 },
    { de: "Tarde en el sofá", a: "30 minutos de paseo rápido", kcal: 130, az: 0, sal: 0, mov: true },
  ];

  H.cambios = el => {
    el.innerHTML = cabeza("cambios", "Pequeños cambios, efecto de verdad", "Marca los cambios que te ves capaz de mantener. Mejor dos para siempre que diez durante un mes.") +
      `<div class="herr-cuerpo">
        <ul class="lista-cambios">${CAMBIOS.map((c, i) => `<li><label><input type="checkbox" data-i="${i}">
          <span><span class="de">${c.mov ? "En lugar de" : "Cambia"}: ${c.de}</span><span class="a">${c.a}</span></span>
          <span class="kc">${c.mov ? "+" + c.kcal + " kcal gastadas" : "−" + c.kcal + " kcal"}</span></label></li>`).join("")}</ul>
        <div class="resultado" aria-live="polite"></div>
        <p class="nota-herr">Calorías aproximadas por cambio y día. El efecto sobre el peso usa la regla del modelo dinámico de <a href="https://www.niddk.nih.gov/bwp">Kevin Hall (NIH)</a>: cada 10 kcal diarias menos acaban suponiendo, como mucho, unos 450 g a los tres años, y la mitad llega durante el primer año. Cada cuerpo responde distinto.</p>
      </div>`;
    const calc = () => {
      const sel = [...el.querySelectorAll("input:checked")].map(i => CAMBIOS[+i.dataset.i]);
      const res = el.querySelector(".resultado");
      if (!sel.length) { res.innerHTML = '<p class="vacio">Marca uno o varios cambios para ver qué consiguen juntos.</p>'; return; }
      const kcal = sel.reduce((s, c) => s + c.kcal, 0);
      const az = sel.reduce((s, c) => s + c.az, 0);
      const sal = sel.reduce((s, c) => s + c.sal, 0);
      const total = kcal / 10 * 0.45;
      const ano = total * 0.5;
      const max = Math.max(...sel.map(c => c.kcal));
      res.innerHTML = `<div class="resultados-2">
          <div><b>Cada día</b><span class="grande">${nf(kcal)}<small>kcal</small></span><p class="suave">menos, o gastadas de más. Al año son ${nf(kcal * 365)} kcal.</p></div>
          <div><b>Efecto máximo en un año</b><span class="grande">−${nf(ano, 1)}<small>kg</small></span><p class="suave">Es el techo teórico si nada más cambia. En la práctica el apetito compensa una parte: conseguir la mitad ya sería un gran resultado, y lo importante es que dure.</p></div>
        </div>
        ${az ? `<p>Además, <strong>${nf(az * 7 / 4)} terrones de azúcar menos a la semana</strong>.</p>` : ""}
        ${sal ? `<p>Y unos <strong>${nf(sal, 1)} g menos de sal al día</strong>, un ${nf(sal / 5 * 100)} % del máximo recomendado.</p>` : ""}
        <ul class="barras-mini" aria-label="Aportación de cada cambio">${sel.map(c => `<li><span>${c.a}</span><i style="width:${c.kcal / max * 100}%"></i><span>${nf(c.kcal)} kcal</span></li>`).join("")}</ul>`;
    };
    el.addEventListener("change", calc);
    calc();
  };

  // ---------------------------------------------------------------- Raciones con la mano
  const FORMAS = {
    palma: '<svg viewBox="0 0 40 50" aria-hidden="true"><rect x="6" y="8" width="28" height="36" rx="12" fill="currentColor" opacity=".9"/></svg>',
    cuenco: '<svg viewBox="0 0 40 50" aria-hidden="true"><path d="M4 22h32a16 16 0 0 1-32 0z" fill="currentColor" opacity=".9"/></svg>',
    puno: '<svg viewBox="0 0 40 50" aria-hidden="true"><rect x="5" y="10" width="30" height="30" rx="9" fill="currentColor" opacity=".9"/><path d="M12 10v8M20 10v8M28 10v8" stroke="var(--superficie)" stroke-width="2.5" stroke-linecap="round"/></svg>',
    pulgar: '<svg viewBox="0 0 40 50" aria-hidden="true"><rect x="13" y="6" width="14" height="38" rx="7" fill="currentColor" opacity=".9"/></svg>',
  };
  const PERFILES = {
    m: { t: "Mujer adulta", v: [1, 1, 2, 1] },
    h: { t: "Hombre adulto", v: [2, 2, 2, 2] },
    n: { t: "Niño o niña", v: [1, 1, 2, 1], nota: "Con su propia mano: la ración crece con él." },
    d: { t: "Entrenas a diario", v: [2, 3, 2, 2], nota: "El cereal sube en los días de más carga y baja en los de descanso." },
  };
  const GRUPOS_MANO = [
    { k: "palma", g: "proteina", n: "Proteína", u: ["palma", "palmas"], ej: "Pescado, pollo, huevos (2), tofu o legumbre" },
    { k: "cuenco", g: "cereal", n: "Cereal o patata", u: ["mano en cuenco", "manos en cuenco"], ej: "Arroz, pasta, pan, patata o legumbre" },
    { k: "puno", g: "verdura", n: "Verdura", u: ["puño", "puños"], ej: "Cruda o cocinada: la mitad del plato" },
    { k: "pulgar", g: "grasa", n: "Grasa buena", u: ["pulgar", "pulgares"], ej: "Aceite de oliva, aguacate o frutos secos" },
  ];

  H.manos = (el, opt) => {
    const nm = uid("perfil");
    el.innerHTML = cabeza("manos", "Raciones con tu mano", "Sin báscula: tu mano va contigo y es proporcional a tu cuerpo. Cantidades para cada comida principal.") +
      `<div class="herr-cuerpo">
        ${segmentos(nm, "¿Para quién?", Object.entries(PERFILES).map(([k, p]) => [k, p.t]), opt.perfil || "m")}
        <div class="manos" aria-live="polite"></div>
        <p class="nota-herr nota-perfil"></p>
        <p class="nota-herr">Método de raciones con la mano de <a href="https://www.precisionnutrition.com/hand-portion-guide">Precision Nutrition</a>, adaptado al plato saludable. Es un punto de partida: ajústalo según tu hambre, tu actividad y cómo evoluciona tu peso.</p>
      </div>`;
    const pintar = () => {
      const p = PERFILES[radio(el, nm)];
      el.querySelector(".manos").innerHTML = GRUPOS_MANO.map((g, i) => {
        const n = p.v[i];
        return `<div class="mano g-${g.g}"><div class="iconos">${FORMAS[g.k].repeat(n)}</div>
          <strong>${g.n}</strong><span class="cuanto">${n} ${g.u[n === 1 ? 0 : 1]}</span><span>${g.ej}</span></div>`;
      }).join("");
      el.querySelector(".nota-perfil").textContent = p.nota || "Comida y cena. En el desayuno y la merienda, más o menos la mitad.";
    };
    el.addEventListener("change", pintar);
    pintar();
  };

  // ---------------------------------------------------------------- Plan para entrenar
  const CARGAS = {
    suave: { t: "Descanso o suave", ch: [3, 5], d: "Paseo, yoga, técnica" },
    moderado: { t: "Moderado, ~1 h", ch: [5, 7], d: "Gimnasio, correr una hora" },
    intenso: { t: "Intenso, 1 a 3 h", ch: [6, 10], d: "Series, partido, tirada larga" },
    extremo: { t: "Muy intenso, +4 h", ch: [8, 12], d: "Ultrafondo, etapas, doble sesión" },
  };
  H.deporte = el => {
    const d = mem.leer();
    const p = uid("peso"), cg = uid("carga"), du = uid("dur");
    el.innerHTML = cabeza("deporte", "Tu plan de combustible", "Cuánto comer y beber según tu peso y cómo es el día de entrenamiento. Recomendaciones del consenso de nutrición deportiva.") +
      `<div class="herr-cuerpo">
        <div class="campos">
          ${campo(p, "Tu peso", "kg", 'min="35" max="200" step="0.5" inputmode="decimal" data-mem="peso"', "", d.peso)}
          <div class="campo"><label for="${du}">Duración de la sesión</label>
            <select id="${du}">${[[30, "30 minutos"], [45, "45 minutos"], [60, "1 hora"], [90, "1 h 30 min"], [120, "2 horas"], [180, "3 horas"], [240, "4 horas o más"]].map(([v, t]) => `<option value="${v}"${v === 60 ? " selected" : ""}>${t}</option>`).join("")}</select></div>
        </div>
        ${segmentos(cg, "¿Cómo es el día de hoy?", Object.entries(CARGAS).map(([k, c]) => [k, c.t]), "moderado")}
        <div class="salida" aria-live="polite"></div>
        <p class="nota-herr">Basado en la posición conjunta del <a href="https://pubmed.ncbi.nlm.nih.gov/26891166/">American College of Sports Medicine, la Academy of Nutrition and Dietetics y Dietitians of Canada (2016)</a> y en la <a href="https://pubmed.ncbi.nlm.nih.gov/28642676/">ISSN sobre proteína (2017)</a>. Para competir o con objetivos de peso muy concretos, un dietista-nutricionista deportivo afina mucho más.</p>
      </div>`;
    const calc = () => {
      const kg = valor(el, "#" + p), carga = CARGAS[radio(el, cg)], min = +el.querySelector("#" + du).value;
      const sal = el.querySelector(".salida");
      if (!(kg >= 35 && kg <= 200)) { sal.innerHTML = '<div class="resultado"><p class="vacio">Escribe tu peso para ver tu plan.</p></div>'; return; }
      mem.poner("peso", kg);
      const ch = carga.ch.map(x => r5(x * kg));
      const pr = [r5(1.2 * kg), r5(2 * kg)];
      const porToma = Math.round(0.3 * kg);
      let durante, chH = "";
      if (min <= 45) durante = "Solo agua, a sorbos y según la sed.";
      else if (min <= 75) durante = "Agua. Si es muy intenso, unos sorbos de bebida isotónica pueden ayudar.";
      else if (min <= 150) { durante = "Entre 30 y 60 g de hidratos por hora a partir de la primera hora."; chH = "Un plátano cada 30 a 45 minutos, o uno o dos geles por hora."; }
      else { durante = "De 60 a 90 g de hidratos por hora, si tu tripa está entrenada para tomarlos."; chH = "Mezcla fuentes (bebida isotónica, geles, plátano, dátiles) y empieza pronto, antes de notar el bajón."; }
      const antesCH = min >= 90 ? `<li>Si la sesión pasa de hora y media: de ${r5(1 * kg)} a ${r5(2 * kg)} g de hidratos en esa comida.</li>` : "";
      sal.innerHTML = `<div class="resultados-2" style="margin-bottom:.9rem">
          <div class="resultado"><b>Hidratos de carbono al día</b><span class="grande">${nf(ch[0])}–${nf(ch[1])}<small>g</small></span><p class="suave">De ${carga.ch[0]} a ${carga.ch[1]} g por kilo. En 4 o 5 comidas, unos ${nf(r5((ch[0] + ch[1]) / 2 / 4.5))} g en cada una. Como guía: un plato de pasta o arroz son unos 60 g; dos rebanadas de pan, 30 g; un plátano, 25 g.</p></div>
          <div class="resultado"><b>Proteína al día</b><span class="grande">${nf(pr[0])}–${nf(pr[1])}<small>g</small></span><p class="suave">En 3 o 4 tomas de unos ${nf(porToma)} g. La parte alta, si haces fuerza o estás perdiendo peso.</p></div>
        </div>
        <ol class="tiempo">
          <li><h4>Antes</h4><span class="num">2 a 4 h antes</span><ul>
            <li>Comida normal con hidratos y poca grasa y fibra, para que no pese.</li>${antesCH}
            <li>Bebe de ${nf(r5(5 * kg) * 1)} a ${nf(r5(7 * kg))} ml unas 4 horas antes.</li></ul></li>
          <li><h4>Durante</h4><span class="num">${min >= 240 ? "4 h o más" : min >= 60 ? nf(min / 60, min % 60 ? 1 : 0) + " h" : min + " min"}</span><ul>
            <li>${durante}</li>${chH ? `<li>${chH}</li>` : ""}
            <li>Líquido: entre 400 y 800 ml por hora según calor y sudor. Calcula el tuyo con la herramienta de sudor.</li></ul></li>
          <li><h4>Después</h4><span class="num">${nf(porToma)} g de proteína</span><ul>
            <li>Tu siguiente comida, con proteína e hidratos. No hay prisa de minutos.</li>
            <li>Si vuelves a entrenar en menos de 8 horas: ${nf(r5(1 * kg))}–${nf(r5(1.2 * kg))} g de hidratos por hora durante las 4 primeras horas.</li>
            <li>Bebe entre 1,25 y 1,5 litros por cada kilo que hayas perdido.</li></ul></li>
        </ol>`;
    };
    el.addEventListener("input", calc);
    el.addEventListener("change", calc);
    calc();
  };

  // ---------------------------------------------------------------- Sudor
  H.sudor = el => {
    const d = mem.leer();
    const a = uid("pa"), b = uid("pd"), l = uid("liq"), t = uid("t");
    el.innerHTML = cabeza("sudor", "¿Cuánto sudas?", "Pésate antes y después de entrenar, sin ropa mojada. En 10 segundos sabrás cuánto beber.") +
      `<div class="herr-cuerpo"><div class="campos">
        ${campo(a, "Peso antes", "kg", 'min="35" max="200" step="0.1" inputmode="decimal" data-mem="peso"', "", d.peso)}
        ${campo(b, "Peso después", "kg", 'min="35" max="200" step="0.1" inputmode="decimal"')}
        ${campo(l, "Lo que bebiste", "ml", 'min="0" max="6000" step="50" inputmode="decimal"', "", 500)}
        ${campo(t, "Duración", "min", 'min="10" max="600" step="5" inputmode="decimal"', "", 60)}
      </div><div class="resultado" aria-live="polite"></div>
      <p class="nota-herr">Perder más del 2 % del peso corporal durante el ejercicio empeora el rendimiento y la concentración (<a href="https://pubmed.ncbi.nlm.nih.gov/26891166/">ACSM 2016</a>). Ganar peso entrenando también es un aviso: estás bebiendo de más.</p></div>`;
    const calc = () => {
      const pa = valor(el, "#" + a), pd = valor(el, "#" + b), liq = valor(el, "#" + l) || 0, min = valor(el, "#" + t);
      const res = el.querySelector(".resultado");
      if (!(pa > 30 && pd > 30 && min > 0)) { res.innerHTML = '<p class="vacio">Escribe tu peso antes y después.</p>'; return; }
      const perdida = pa - pd;
      const pct = perdida / pa * 100;
      const sudorL = perdida + liq / 1000;
      const tasa = sudorL / (min / 60);
      let est;
      if (pct < 0) est = estado("ojo", "Has ganado peso: bebiste de más");
      else if (pct <= 1) est = estado("ok", "Bien hidratado");
      else if (pct <= 2) est = estado("ojo", "Al límite");
      else est = estado("no", "Deshidratación que resta rendimiento");
      const horas = min / 60;
      const beberH = Math.max(0, (sudorL - 0.02 * pa) / horas) * 1000;
      const consejo = beberH > 0
        ? `Para no pasar del 2 % en una sesión así, bebe al menos unos <strong>${nf(Math.round(beberH / 50) * 50)} ml por hora</strong>.`
        : "Con esta duración, beber según la sed es suficiente para no pasar del 2 %.";
      res.innerHTML = `<div class="resultados-2">
        <div><b>Sudas</b><span class="grande">${nf(Math.max(0, tasa), 2)}<small>litros por hora</small></span><p class="suave">${consejo}</p></div>
        <div><b>Has perdido</b><span class="grande">${nf(Math.max(0, pct), 1)}<small>% de tu peso</small></span>${est}
          ${perdida > 0 ? `<p style="margin-top:.6rem">Para recuperarte, bebe entre <strong>${nf(perdida * 1.25, 1)} y ${nf(perdida * 1.5, 1)} litros</strong> en las próximas horas, con algo de sal en la comida.</p>` : ""}</div>
      </div>`;
    };
    el.addEventListener("input", calc);
    calc();
  };

  // ---------------------------------------------------------------- Según la edad (niños)
  const EDADES = [["b", "6 a 12 meses"], ["p", "1 a 3 años"], ["i", "4 a 6 años"], ["e", "7 a 10 años"], ["a", "11 a 14 años"]];
  // [estado por edad b,p,i,e,a] con texto opcional por edad
  const CUIDADOS = [
    { n: "Miel", e: { b: ["no", "Riesgo de botulismo infantil antes del año, aunque esté cocinada."], p: ["no", "Ya no hay riesgo de botulismo, pero es azúcar libre: mejor a partir de los 2 años."], _: ["ojo", "Es azúcar: de vez en cuando."] } },
    { n: "Sal añadida", e: { b: ["no", "Sus riñones aún no la manejan bien. Cocina sin sal."], _: ["ojo", "Poca y siempre yodada. Cuidado con embutidos, quesos y precocinados."] } },
    { n: "Azúcar, dulces y bollería", e: { b: ["no", "Nada de azúcar añadido."], p: ["no", "Cuanto más tarde lo prueben, mejor."], _: ["ojo", "De ocasión: cumpleaños y fiestas, no como premio."] } },
    { n: "Zumos, también naturales", e: { b: ["no", "Mejor la fruta entera, aplastada o en trozos."], p: ["no", "La fruta entera sacia y conserva la fibra."], _: ["ojo", "De vez en cuando. No cuentan como ración de fruta."] } },
    { n: "Leche de vaca como bebida", e: { b: ["no", "Antes del año, leche materna o de fórmula. En yogur o cocinada, en pequeñas cantidades, sí."], p: ["ok", "Sí, entera hasta los 2 años; desde los 2, entera o semidesnatada. Sin azúcar ni cacao azucarado."], _: ["ok", "Sí, entera o semidesnatada, sin azúcar ni cacao azucarado."] } },
    { n: "Espinacas y acelgas", e: { b: ["no", "Por los nitratos, mejor no antes del año. Si las usas, menos del 20 % del puré."], p: ["ojo", "Como mucho una ración al día, y ninguna si tiene una gastroenteritis bacteriana."], _: ["ok", "Sí, con normalidad. Guárdalas en la nevera una vez cocinadas."] } },
    { n: "Pez espada, tiburón, atún rojo y lucio", e: { a: ["ojo", "Por el mercurio, como mucho 120 g al mes."], _: ["no", "Por el mercurio, nada hasta los 10 años."] } },
    { n: "Pescado en general", e: { b: ["ok", "Sí, blanco y azul pequeño, sin espinas y bien cocinado."], _: ["ok", "De 3 a 4 veces por semana, variando entre blanco y azul."] } },
    { n: "Frutos secos", e: { e: ["ok", "Sí, enteros, siempre sentado y sin correr."], a: ["ok", "Sí, un puñado de naturales es un buen tentempié."], _: ["ojo", "Molidos o en crema, nunca enteros: riesgo de atragantamiento."] } },
    { n: "Uvas, cerezas, aceitunas, tomates cherry", e: { e: ["ok", "Sí."], a: ["ok", "Sí."], _: ["ojo", "Cortados a lo largo en cuartos, sin hueso ni pepitas."] } },
    { n: "Salchichas y embutidos", e: { b: ["no", "Demasiada sal y procesado."], p: ["ojo", "Ocasional y cortado en tiras a lo largo, nunca en rodajas."], _: ["ojo", "Procesados: de vez en cuando, no a diario."] } },
    { n: "Caramelos duros, chicles y palomitas", e: { e: ["ojo", "Ya con menos riesgo de atragantamiento, pero son de ocasión."], a: ["ojo", "De ocasión."], _: ["no", "Alto riesgo de atragantamiento hasta los 3 a 6 años."] } },
    { n: "Manzana y zanahoria crudas", e: { b: ["ojo", "Ralladas, cocidas o asadas."], p: ["ojo", "Ralladas o en láminas finas."], _: ["ok", "Sí, en trozos que pueda morder."] } },
    { n: "Arroz, bebidas y tortitas de arroz", e: { b: ["no", "Bebidas y tortitas de arroz, no, por el arsénico inorgánico. El arroz, blanco y variando con otros cereales."], p: ["ojo", "Bebidas de arroz, no. Tortitas, no a diario. Arroz como mucho 4 veces por semana y mejor blanco que integral."], i: ["ojo", "Bebidas de arroz, no. Tortitas, no a diario. Arroz como mucho 4 veces por semana."], _: ["ok", "Sí, variando con otros cereales."] } },
    { n: "Bebidas energéticas y con cafeína", e: { _: ["no", "No son para niños ni adolescentes, tampoco para hacer deporte."] } },
    { n: "Cabezas de gambas y cigalas", e: { _: ["ojo", "Mejor no chuparlas: acumulan cadmio. Para toda la familia."] } },
  ];
  H.edad = el => {
    const nm = uid("edad");
    el.innerHTML = cabeza("edad", "¿Qué puede comer según su edad?", "Elige la edad y verás qué evitar, qué dar con cuidado y qué ya puede comer con normalidad.") +
      `<div class="herr-cuerpo">
        ${segmentos(nm, "Edad", EDADES, "p")}
        <div class="filtro-edad" role="group" aria-label="Mostrar"><span>Mostrar:</span>
          <label><input type="checkbox" value="no" checked> ${estado("no", "Evitar")}</label>
          <label><input type="checkbox" value="ojo" checked> ${estado("ojo", "Con cuidado")}</label>
          <label><input type="checkbox" value="ok" checked> ${estado("ok", "Sí")}</label></div>
        <p class="edad-resumen" aria-live="polite"></p>
        <ul class="lista-edad"></ul>
        <p class="nota-herr">Fuentes: <a href="https://maldita.es/malditaciencia/2019/12/22/pescado-y-mercurio-las-recomendaciones-de-la-aesan-actualizan-las-anteriores-y-son-mas-restrictivas-en-los-menores-de-10-anos/">AESAN, mercurio (2019)</a>, <a href="https://www.consumer.es/seguridad-alimentaria/contaminantes-alimentarios-nuevas-recomendaciones-sobre-su-consumo.html">AESAN, nitratos y cadmio</a>, <a href="https://aeped.es/sites/default/files/atragantamiento_csvaep_final.pdf">AEP, atragantamientos</a> y <a href="https://www.consumer.es/?p=608092">AESAN y Agencia de Salud Pública de Cataluña, arroz</a>. Si hay alergias o una enfermedad, manda lo que diga su pediatra.</p>
      </div>`;
    const pintar = () => {
      const ed = radio(el, nm);
      const ver = new Set([...el.querySelectorAll(".filtro-edad input:checked")].map(i => i.value));
      const filas = CUIDADOS.map(c => ({ n: c.n, r: c.e[ed] || c.e._ }));
      const cuenta = { no: 0, ojo: 0, ok: 0 };
      filas.forEach(f => cuenta[f.r[0]]++);
      const txt = { no: "Evitar", ojo: "Con cuidado", ok: "Sí" };
      el.querySelector(".edad-resumen").innerHTML = `${EDADES.find(x => x[0] === ed)[1]}: <strong>${cuenta.no} para evitar</strong>, ${cuenta.ojo} con cuidado y ${cuenta.ok} sin problema.`;
      el.querySelector(".lista-edad").innerHTML = filas.filter(f => ver.has(f.r[0])).map(f =>
        `<li>${estado(f.r[0], txt[f.r[0]])}<div><strong>${f.n}</strong><p>${f.r[1]}</p></div></li>`).join("") || '<li><p>No hay nada con ese filtro.</p></li>';
    };
    el.addEventListener("change", pintar);
    pintar();
  };

  // ---------------------------------------------------------------- Mito o realidad
  const MITOS = [
    { f: "La fruta por la noche engorda.", v: false, x: "La fruta aporta lo mismo a las nueve de la mañana que a las nueve de la noche. Lo que cuenta es el total del día." },
    { f: "Las legumbres engordan.", v: false, x: "Un plato de lentejas sacia muchísimo por su fibra y su proteína. Lo que suma son el chorizo y la morcilla que a veces las acompañan." },
    { f: "Las legumbres de bote son igual de nutritivas que las cocidas en casa.", v: true, x: "Conservan proteína, fibra y minerales. Enjuágalas bajo el grifo para quitar parte de la sal." },
    { f: "El azúcar moreno es más sano que el blanco.", v: false, x: "Es casi la misma sacarosa con un poco de melaza. Mismas calorías y mismo efecto." },
    { f: "La verdura congelada pierde casi todos sus nutrientes.", v: false, x: "Se congela recién cosechada y conserva la mayoría de vitaminas. A veces más que la «fresca» que lleva días en la nevera." },
    { f: "El pan integral engorda menos que el blanco.", v: false, x: "Tiene casi las mismas calorías. Su ventaja es la fibra: sacia más y sube menos el azúcar en sangre. Fíjate en que ponga «100 % integral»." },
    { f: "El aceite de oliva, aunque sea sano, aporta muchas calorías.", v: true, x: "Una cucharada son unas 90 kcal. Es la mejor grasa para cocinar, pero mejor con cuchara que a chorro." },
    { f: "Beber agua durante la comida engorda.", v: false, x: "El agua no tiene calorías, la bebas cuando la bebas. Incluso ayuda a llenarse antes." },
    { f: "Tomar proteína después de entrenar ayuda a recuperar el músculo.", v: true, x: "Unos 20 a 40 g de proteína en las horas siguientes favorecen la recuperación. Con comida normal basta; el batido es solo una opción cómoda." },
    { f: "Los productos «light» ayudan a perder peso.", v: false, x: "«Light» solo significa un 30 % menos de algo respecto a la versión normal. Muchos siguen siendo ultraprocesados y a veces se come más «porque es light»." },
    { f: "Los niños necesitan zumo para tomar vitaminas.", v: false, x: "La fruta entera tiene las mismas vitaminas y además fibra. El zumo concentra el azúcar de varias piezas en un vaso." },
    { f: "Los huevos suben el colesterol: como mucho dos a la semana.", v: false, x: "En personas sanas, el huevo apenas influye en el colesterol de la sangre. La AESAN admite hasta cuatro a la semana dentro de una dieta variada, y otras guías, uno al día." },
  ];
  H.mitos = el => {
    el.innerHTML = cabeza("mitos", "¿Mito o realidad?", "Doce frases que se oyen en cualquier cocina. Elige y mira la explicación.") +
      `<div class="herr-cuerpo"><p class="marcador" aria-live="polite"></p>
        <ul class="mitos">${MITOS.map((m, i) => `<li class="mito" data-i="${i}"><p class="frase">${m.f}</p>
          <div class="opciones"><button type="button" data-v="0">Mito</button><button type="button" data-v="1">Realidad</button></div>
          <p class="explica" hidden></p></li>`).join("")}</ul>
        <p style="margin-top:1rem"><button type="button" class="boton secundario pequeno reiniciar">Volver a empezar</button></p></div>`;
    let aciertos = 0, hechas = 0;
    const marcador = () => { el.querySelector(".marcador").textContent = hechas ? `${aciertos} de ${hechas} acertadas` : `${MITOS.length} frases. ¿Cuántas aciertas?`; };
    el.querySelector(".mitos").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const li = b.closest(".mito"), m = MITOS[+li.dataset.i];
      const elegida = b.dataset.v === "1";
      const bien = elegida === m.v;
      hechas++; if (bien) aciertos++;
      li.querySelectorAll("button").forEach(x => { x.disabled = true; });
      b.classList.add("elegida");
      const p = li.querySelector(".explica");
      p.hidden = false;
      p.innerHTML = `${estado(bien ? "ok" : "no", bien ? "Aciertas" : "No")} <strong>Es ${m.v ? "realidad" : "un mito"}.</strong> ${m.x}`;
      marcador();
    });
    el.querySelector(".reiniciar").addEventListener("click", () => {
      aciertos = 0; hechas = 0;
      el.querySelectorAll(".mito").forEach(li => {
        li.querySelectorAll("button").forEach(x => { x.disabled = false; x.classList.remove("elegida"); });
        const p = li.querySelector(".explica"); p.hidden = true; p.innerHTML = "";
      });
      marcador();
    });
    marcador();
  };

  // ---------------------------------------------------------------- Fiambrera
  const FIAMBRERA = {
    base: { g: "cereal", n: "Base", o: ["Pan integral", "Pasta corta", "Arroz", "Wrap integral", "Cuscús", "Patata cocida", "Tortitas de maíz"] },
    prot: { g: "proteina", n: "Proteína", o: ["Tortilla francesa", "Atún al natural", "Garbanzos", "Pollo asado", "Queso fresco", "Huevo duro", "Hummus", "Lentejas cocidas"] },
    verd: { g: "verdura", n: "Verdura", o: ["Tomate cherry en cuartos", "Pepino en bastones", "Zanahoria rallada", "Pimiento rojo", "Maíz dulce", "Brócoli cocido", "Judías verdes"] },
    fruta: { g: "fruta", n: "Fruta", o: ["Mandarina", "Manzana en gajos", "Uvas cortadas", "Plátano", "Fresas", "Pera", "Kiwi"] },
  };
  H.fiambrera = el => {
    el.innerHTML = cabeza("fiambrera", "Ideas para la fiambrera", "Una pieza de cada columna y está equilibrada. Pulsa para otra combinación.") +
      `<div class="herr-cuerpo"><div class="idea-fiambrera" aria-live="polite"></div>
        <p><button type="button" class="boton pequeno otra">Dame otra idea</button></p>
        <p class="nota-herr">Si lleva tortilla, pollo o huevo, añade un acumulador de frío. Corta uvas y cherry a lo largo en los más pequeños.</p></div>`;
    const pintar = () => {
      el.querySelector(".idea-fiambrera").innerHTML = Object.values(FIAMBRERA).map(c =>
        `<div class="g-${c.g}"><b>${c.n}</b><span>${c.o[Math.floor(Math.random() * c.o.length)]}</span></div>`).join("");
    };
    el.querySelector(".otra").addEventListener("click", pintar);
    pintar();
  };

  // ---------------------------------------------------------------- Nutrientes
  const NUTRIENTES = {
    fibra: {
      t: "Fibra", para: "Sacia, regula el intestino y alimenta a las bacterias buenas. Se asocia a menos diabetes tipo 2, enfermedad del corazón y cáncer de colon.",
      cuanto: "25 g al día", fuenteRef: "EFSA; 30 g o más es aún mejor", falta: "A casi todos", faltaTxt: "La mayoría de adultos se queda por debajo.",
      unidad: " g", dec: 1, ref: { valor: 25, etiqueta: "25 g al día" },
      datos: [
        ["Lentejas cocidas, plato de 250 g", 19], ["Garbanzos cocidos, plato de 250 g", 19], ["Alubias cocidas, plato de 250 g", 16],
        ["Pera con piel, una mediana", 5.5], ["Brócoli, 150 g", 4.5], ["Manzana con piel, una mediana", 4.3], ["Pan integral, 60 g", 4.2],
        ["Copos de avena, 40 g", 4], ["Almendras, un puñado de 30 g", 3.7], ["Arroz integral cocido, 150 g", 2.7], ["Pan blanco, 60 g", 1.6], ["Arroz blanco cocido, 150 g", 0.6],
      ],
      consejos: ["Pasa a integral el pan, el arroz y la pasta: es el cambio más fácil. En menores de 3 años, el arroz mejor blanco, por el arsénico.", "Legumbre cuatro veces por semana resuelve casi la mitad.", "Fruta entera y con piel, mejor que zumo.", "Sube la fibra poco a poco y bebe agua para evitar gases."],
    },
    calcio: {
      t: "Calcio", para: "Construye y mantiene huesos y dientes. También interviene en la contracción muscular y la coagulación.",
      cuanto: "950 mg al día", fuenteRef: "EFSA, adultos desde 25 años; 1.000 mg de 18 a 24", falta: "Adolescentes y mayores", faltaTxt: "Y quien no toma lácteos ni bebidas enriquecidas.",
      unidad: " mg", dec: 0, ref: { valor: 950, etiqueta: "950 mg al día" },
      datos: [
        ["Tofu cuajado con sulfato de calcio, 100 g", 350, "varía mucho según la marca"], ["Vaso de leche, 250 ml", 300], ["Bebida vegetal enriquecida, 250 ml", 300],
        ["Queso curado, 30 g", 250], ["Sardinas en lata con espina, 50 g", 190], ["Yogur natural, 125 g", 175], ["Garbanzos cocidos, 250 g", 120],
        ["Almendras, 30 g", 80], ["Naranja, una grande", 80], ["Brócoli, 150 g", 60],
      ],
      consejos: ["Dos o tres raciones de lácteos o bebida enriquecida al día cubren casi todo.", "Las sardinas y boquerones en lata, con su espina, son una fuente excelente.", "La vitamina D ayuda a absorberlo: sal al sol un rato cada día.", "Si no tomas lácteos, elige bebidas vegetales enriquecidas con calcio."],
    },
    hierro: {
      t: "Hierro", para: "Transporta el oxígeno en la sangre. Si falta, aparecen cansancio, falta de concentración y anemia.",
      cuanto: "11 mg al día", fuenteRef: "EFSA; 16 mg en mujeres con la regla", falta: "Mujeres con la regla", faltaTxt: "También embarazadas, deportistas de fondo y dietas vegetarianas mal planificadas.",
      unidad: " mg", dec: 1, ref: { valor: 11, etiqueta: "11 mg al día" },
      datos: [
        ["Lentejas cocidas, plato de 250 g", 8.3], ["Garbanzos cocidos, plato de 250 g", 7.3], ["Mejillones cocidos, 100 g", 6.7], ["Espinacas cocidas, 150 g", 5.4],
        ["Tofu firme, 125 g", 3.4], ["Ternera, 120 g cocinada", 3.1], ["Dos huevos", 2.1], ["Pan integral, 60 g", 1.5], ["Pechuga de pollo, 120 g", 1.2], ["Pistachos, 30 g", 1.2],
      ],
      consejos: ["El hierro de la carne y el pescado se absorbe mejor que el de las legumbres y verduras.", "Acompaña la legumbre con vitamina C: pimiento, tomate, perejil o una naranja de postre.", "Deja el café y el té para una hora después de comer: frenan la absorción.", "No tomes suplementos de hierro sin análisis: el exceso también es dañino."],
    },
    omega3: {
      t: "Omega-3", para: "Los omega-3 del pescado (EPA y DHA) protegen el corazón y son clave para el cerebro y la vista, sobre todo en el embarazo y la infancia.",
      cuanto: "250 mg al día", fuenteRef: "EFSA, unos 1,75 g a la semana", falta: "Quien no come pescado azul", faltaTxt: "Una o dos raciones de pescado azul a la semana bastan.",
      unidad: " g", dec: 1, ref: { valor: 1.75, etiqueta: "Lo de una semana" },
      datos: [
        ["Salmón, 120 g", 2.2], ["Caballa, 120 g", 2.0], ["Boquerones frescos, 120 g", 1.7], ["Sardinas frescas, 120 g", 1.4], ["Trucha, 120 g", 1.1],
        ["Merluza, 120 g", 0.3], ["Gambas, 100 g", 0.3], ["Atún en lata, 80 g", 0.2], ["Nueces, 30 g", 0, "su omega-3 es de otro tipo y se aprovecha poco"],
      ],
      consejos: ["Una o dos raciones a la semana de salmón, caballa, sardinas o boquerones bastan.", "El pescado azul pequeño (sardina, boquerón, caballa) tiene poco mercurio.", "Si comes boquerones en vinagre o pescado crudo, congélalo antes al menos cinco días por el anisakis.", "Las nueces y el lino aportan omega-3 vegetal: bueno, pero no sustituye al pescado.", "Si no comes pescado, consulta si te conviene un suplemento de algas."],
    },
    sal: {
      t: "Sal", para: "El exceso sube la tensión arterial, la principal causa de infarto e ictus. La mayor parte ya viene dentro de los alimentos.",
      cuanto: "Menos de 5 g al día", fuenteRef: "OMS: una cucharadita rasa en total", falta: "Nos sobra a casi todos", faltaTxt: "En España se toma bastante más de lo recomendado.",
      unidad: " g", dec: 1, ref: { valor: 5, etiqueta: "Máximo diario" },
      datos: [
        ["Pizza congelada, media (200 g)", 2.6], ["Sopa de sobre, un plato", 2.2], ["Salchichas, dos (80 g)", 1.7], ["Jamón serrano, 30 g", 1.4],
        ["Aceitunas, diez", 1.0], ["Pan, dos rebanadas (60 g)", 0.7], ["Tomate frito, 50 g", 0.6], ["Queso curado, 30 g", 0.5], ["Patatas fritas de bolsa, 40 g", 0.5],
      ],
      consejos: ["Sal yodada, y poca: el yodo es necesario y en España falta.", "Hierbas, especias, ajo, limón y vinagre dan sabor sin sal.", "Lee la etiqueta: más de 1,5 g de sal por 100 g es mucho.", "Enjuaga las legumbres y las conservas al natural."],
    },
  };
  H.nutrientes = el => {
    el.innerHTML = cabeza("nutrientes", "Explora los nutrientes", "Elige uno y mira cuánto necesitas, quién suele quedarse corto y qué alimentos lo aportan de verdad.") +
      `<div class="herr-cuerpo"><div class="pestanas" role="tablist" aria-label="Nutriente">${Object.entries(NUTRIENTES).map(([k, n], i) =>
        `<button type="button" role="tab" data-k="${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${n.t}</button>`).join("")}</div>
        <div class="ficha-nutriente" role="tabpanel" aria-live="polite"></div>
        <p class="nota-herr">Cantidades aproximadas por ración a partir de la <a href="https://www.bedca.net/">BEDCA</a> y de bases de composición internacionales; cambian según el producto. Necesidades: <a href="https://www.efsa.europa.eu/es/topics/topic/dietary-reference-values">EFSA</a> y <a href="https://www.who.int/es/news-room/fact-sheets/detail/salt-reduction">OMS</a>.</p></div>`;
    const pintar = k => {
      const n = NUTRIENTES[k];
      el.querySelectorAll('[role="tab"]').forEach(b => { const s = b.dataset.k === k; b.setAttribute("aria-selected", s); b.tabIndex = s ? 0 : -1; });
      const f = el.querySelector(".ficha-nutriente");
      f.innerHTML = `<p>${n.para}</p>
        <div class="resumen"><div><b>Cuánto necesitas</b><span>${n.cuanto}</span><small>${n.fuenteRef}</small></div>
        <div><b>A quién le falta</b><span>${n.falta}</span><small>${n.faltaTxt}</small></div></div>
        <div class="grafico-n"></div>
        <h4>Para llegar sin esfuerzo</h4><ul>${n.consejos.map(c => `<li>${c}</li>`).join("")}</ul>`;
      if (window.Grafico) {
        Grafico.barras(f.querySelector(".grafico-n"), {
          titulo: `${n.t} en una ración habitual`, subtitulo: `La línea marca ${k === "omega3" ? "lo que necesitas en toda una semana" : k === "sal" ? "el máximo de todo el día" : "lo que necesitas en todo el día"}.`,
          unidad: n.unidad, decimales: n.dec, columna: "Ración", columnaValor: n.t, color: k === "sal" ? "var(--proteina)" : "var(--seccion)",
          referencia: n.ref, datos: n.datos.map(([e, v, nota]) => ({ etiqueta: e, valor: v, nota })),
        });
      }
    };
    const tabs = el.querySelector(".pestanas");
    tabs.addEventListener("click", e => { const b = e.target.closest("button"); if (b) pintar(b.dataset.k); });
    tabs.addEventListener("keydown", e => {
      const bs = [...tabs.querySelectorAll("button")], i = bs.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % bs.length;
      if (e.key === "ArrowLeft") j = (i - 1 + bs.length) % bs.length;
      if (j !== null) { e.preventDefault(); bs[j].focus(); pintar(bs[j].dataset.k); }
    });
    pintar(el.dataset.inicial || "fibra");
  };

  // Arranque
  document.querySelectorAll("[data-herramienta]").forEach(el => {
    const f = H[el.dataset.herramienta];
    if (!f) return;
    el.classList.add("herramienta");
    try { f(el, el.dataset); } catch (err) { el.innerHTML = '<p>Esta herramienta no se ha podido cargar. Recarga la página.</p>'; console.error(err); }
  });

  window.Despensa = { icono };
})();
