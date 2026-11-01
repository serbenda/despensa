// despensa — fruta y verdura de temporada (orientativo, España peninsular).
(function () {
  const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // Meses (1-12) en los que cada producto está en su mejor momento.
  const FRUTA = {
    "Naranja": [1, 2, 3, 4, 5, 11, 12],
    "Mandarina": [1, 2, 10, 11, 12],
    "Kiwi": [1, 2, 3, 4, 11, 12],
    "Limón": [1, 2, 3, 4, 5, 10, 11, 12],
    "Fresa": [3, 4, 5, 6],
    "Níspero": [4, 5, 6],
    "Cereza": [5, 6, 7],
    "Albaricoque": [5, 6, 7],
    "Melocotón": [6, 7, 8, 9],
    "Sandía": [6, 7, 8, 9],
    "Melón": [6, 7, 8, 9],
    "Ciruela": [6, 7, 8, 9],
    "Higo": [8, 9],
    "Uva": [8, 9, 10, 11],
    "Granada": [9, 10, 11, 12],
    "Caqui": [10, 11, 12],
    "Chirimoya": [10, 11, 12, 1],
    "Manzana": [1, 2, 3, 8, 9, 10, 11, 12],
    "Pera": [1, 2, 7, 8, 9, 10, 11, 12],
  };
  const VERDURA = {
    "Acelga": [1, 2, 3, 10, 11, 12],
    "Espinaca": [1, 2, 3, 4, 10, 11, 12],
    "Alcachofa": [1, 2, 3, 4, 11, 12],
    "Coliflor y brócoli": [1, 2, 3, 10, 11, 12],
    "Col y lombarda": [1, 2, 11, 12],
    "Puerro": [1, 2, 3, 10, 11, 12],
    "Zanahoria": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    "Espárrago verde": [3, 4, 5],
    "Guisante y haba": [3, 4, 5],
    "Lechuga": [3, 4, 5, 6, 7, 8, 9, 10],
    "Judía verde": [5, 6, 7, 8, 9],
    "Calabacín": [5, 6, 7, 8, 9],
    "Tomate": [6, 7, 8, 9],
    "Pimiento": [6, 7, 8, 9, 10],
    "Berenjena": [6, 7, 8, 9],
    "Pepino": [6, 7, 8, 9],
    "Calabaza": [9, 10, 11, 12],
    "Boniato": [10, 11, 12],
    "Setas": [10, 11],
  };

  const mesesCont = document.getElementById("meses");
  const lista = document.getElementById("temporada-lista");
  if (!mesesCont || !lista) return;

  const hoy = new Date().getMonth() + 1;
  const de = (tabla, m) => Object.keys(tabla).filter(k => tabla[k].includes(m));

  mesesCont.innerHTML = MESES.map((n, i) =>
    `<button type="button" role="tab" data-mes="${i + 1}" aria-selected="${i + 1 === hoy}" tabindex="${i + 1 === hoy ? 0 : -1}" title="${n}">${n.slice(0, 3)}</button>`
  ).join("");

  function mostrar(m) {
    mesesCont.querySelectorAll("button").forEach(b => {
      const sel = Number(b.dataset.mes) === m;
      b.setAttribute("aria-selected", sel);
      b.tabIndex = sel ? 0 : -1;
    });
    const f = de(FRUTA, m), v = de(VERDURA, m);
    lista.innerHTML = `
      <h3>${MESES[m - 1]}${m === hoy ? ", este mes" : ""}</h3>
      <div class="pares">
        <div class="par"><h3>Fruta</h3><ul class="chips">${f.map(x => `<li>${x}</li>`).join("")}</ul></div>
        <div class="par"><h3>Verdura y hortaliza</h3><ul class="chips">${v.map(x => `<li>${x}</li>`).join("")}</ul></div>
      </div>`;
    pintarCalendario(m);
  }

  mesesCont.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (b) mostrar(Number(b.dataset.mes));
  });
  mesesCont.addEventListener("keydown", e => {
    const actual = Number(document.activeElement.dataset.mes);
    if (!actual) return;
    let sig = null;
    if (e.key === "ArrowRight") sig = actual % 12 + 1;
    if (e.key === "ArrowLeft") sig = (actual + 10) % 12 + 1;
    if (sig) { e.preventDefault(); mostrar(sig); mesesCont.querySelector(`[data-mes="${sig}"]`).focus(); }
  });

  // Calendario completo: una fila por producto y una columna por mes.
  const cal = document.createElement("div");
  cal.className = "calendario-cont";
  lista.after(cal);

  function tablaCal(titulo, tabla, clase, m) {
    const cab = MESES.map((n, i) => `<th scope="col"${i + 1 === m ? ' class="hoy"' : ""}><abbr title="${n}">${n[0]}</abbr></th>`).join("");
    const filas = Object.keys(tabla).map(k =>
      `<tr><th scope="row">${k}</th>${MESES.map((n, i) => {
        const si = tabla[k].includes(i + 1);
        return `<td class="${si ? "si " + clase : ""}${i + 1 === m ? " hoy" : ""}">${si ? `<span class="sr">${n}: sí</span>` : ""}</td>`;
      }).join("")}</tr>`).join("");
    return `<figure class="calendario"><figcaption>${titulo}</figcaption><div class="tabla-scroll"><table><thead><tr><th scope="col"><span class="sr">Producto</span></th>${cab}</tr></thead><tbody>${filas}</tbody></table></div></figure>`;
  }

  function pintarCalendario(m) {
    cal.innerHTML = `<h3>El año entero</h3>` +
      tablaCal("Fruta", FRUTA, "c-fruta", m) + tablaCal("Verdura y hortaliza", VERDURA, "c-verdura", m);
  }

  mostrar(hoy);
})();
