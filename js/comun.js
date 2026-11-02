// despensa — cabecera, pie y tema compartidos por todas las páginas.
(function () {
  const paginas = [
    { id: "peso", href: "peso.html", texto: "Perder peso", clase: "s-peso" },
    { id: "ninos", href: "ninos.html", texto: "Niños", clase: "s-ninos" },
    { id: "entrenar", href: "entrenar.html", texto: "Entrenar", clase: "s-entrenar" },
    { id: "nutrientes", href: "nutrientes.html", texto: "Nutrientes", clase: "s-nutrientes" },
    { id: "menu", href: "menu.html", texto: "Menú y compra", clase: "s-menu" },
    { id: "datos", href: "datos.html", texto: "Datos", clase: "s-datos" },
    { id: "herramientas", href: "herramientas.html", texto: "Herramientas", clase: "s-herramientas nav-herramientas" },
  ];

  const actual = document.body.dataset.pagina || "";

  // Tema: guarda la elección del visitante si el navegador lo permite.
  const raiz = document.documentElement;
  function leerTema() {
    try { return localStorage.getItem("despensa-tema"); } catch (e) { return null; }
  }
  function guardarTema(t) {
    try { localStorage.setItem("despensa-tema", t); } catch (e) { /* sin almacenamiento */ }
  }
  const temaGuardado = leerTema();
  if (temaGuardado) raiz.dataset.theme = temaGuardado;

  function esOscuro() {
    if (raiz.dataset.theme) return raiz.dataset.theme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  const iconoLuna = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const iconoSol = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  // Marca: un tarro de despensa.
  const tarro = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="9" y="3" width="14" height="5" rx="1.5" fill="var(--proteina)"/><path d="M8 9h16v17a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 19h12v7a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1z" fill="var(--hortaliza)"/><path d="M10 15h12v4H10z" fill="var(--grano)"/></svg>';

  const nav = paginas.map(p =>
    `<a class="${p.clase}" href="${p.href}"${p.id === actual ? ' aria-current="page"' : ""}>${p.texto}</a>`
  ).join("");

  const cabecera = document.createElement("header");
  cabecera.className = "cabecera";
  cabecera.innerHTML = `
    <a class="saltar" href="#principal">Saltar al contenido</a>
    <div class="envoltorio">
      <a class="marca" href="./">${tarro}despensa</a>
      <nav class="nav" aria-label="Secciones">${nav}</nav>
      <button class="tema" type="button" aria-label="Cambiar entre modo claro y oscuro"></button>
    </div>`;
  document.body.prepend(cabecera);

  const botonTema = cabecera.querySelector(".tema");
  function pintarBoton() { botonTema.innerHTML = esOscuro() ? iconoSol : iconoLuna; }
  pintarBoton();
  botonTema.addEventListener("click", () => {
    const nuevo = esOscuro() ? "light" : "dark";
    raiz.dataset.theme = nuevo;
    guardarTema(nuevo);
    pintarBoton();
  });

  const pie = document.createElement("footer");
  pie.className = "pie";
  pie.innerHTML = `
    <div class="envoltorio">
      <div>
        <h2>Antes de nada</h2>
        <p>despensa es una guía divulgativa basada en recomendaciones públicas. No sustituye la consulta con tu médico, pediatra o dietista-nutricionista, sobre todo si tienes una enfermedad, estás embarazada o se trata de un bebé.</p>
        <p>© ${new Date().getFullYear()} Bendi · <a href="https://github.com/serbenda/despensa">Código en GitHub</a></p>
      </div>
      <div>
        <h2>Secciones</h2>
        <ul>${paginas.map(p => `<li><a href="${p.href}">${p.texto}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h2>Fuentes principales</h2>
        <ul>
          <li><a href="https://www.aesan.gob.es/AECOSAN/web/noticias_y_actualizaciones/noticias/2022/recomendaciones_dieteticas.htm">AESAN: recomendaciones dietéticas</a></li>
          <li><a href="https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet">OMS: alimentación sana</a></li>
          <li><a href="https://www.efsa.europa.eu/es/topics/topic/dietary-reference-values">EFSA: valores dietéticos de referencia</a></li>
          <li><a href="https://enfamilia.aeped.es/">AEP: En Familia</a></li>
          <li><a href="https://www.ine.es/dyngs/Prensa/es/ESdE2023.htm">INE: Encuesta de Salud de España 2023</a></li>
          <li><a href="https://www.bedca.net/">BEDCA: composición de alimentos</a></li>
        </ul>
      </div>
    </div>`;
  document.body.append(pie);

  // Índice de la página: marca la sección que se está leyendo.
  const enlaces = Array.from(document.querySelectorAll(".indice a[href^='#']"));
  if (enlaces.length && "IntersectionObserver" in window) {
    const porId = new Map(enlaces.map(a => [a.getAttribute("href").slice(1), a]));
    const visibles = new Map();
    const marcar = id => {
      enlaces.forEach(a => a.classList.toggle("activo", a === porId.get(id)));
      const a = porId.get(id);
      const lista = a && a.closest("ol");
      if (a && lista && lista.scrollWidth > lista.clientWidth) {
        lista.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
      }
    };
    const obs = new IntersectionObserver(entradas => {
      entradas.forEach(e => visibles.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null));
      const arriba = [...visibles.entries()].filter(([, v]) => v !== null).sort((a, b) => a[1] - b[1])[0];
      if (arriba) marcar(arriba[0]);
    }, { rootMargin: "-10% 0px -60% 0px" });
    porId.forEach((_, id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
  }
})();
