// despensa — cabecera, pie y tema compartidos por todas las páginas.
(function () {
  const paginas = [
    { id: "peso", href: "peso.html", texto: "Perder peso", clase: "s-peso" },
    { id: "ninos", href: "ninos.html", texto: "Niños", clase: "s-ninos" },
    { id: "entrenar", href: "entrenar.html", texto: "Entrenar", clase: "s-entrenar" },
    { id: "menu", href: "menu.html", texto: "Menú y compra", clase: "s-menu" },
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
        <h2>Fuentes</h2>
        <ul>
          <li><a href="https://www.aesan.gob.es/AECOSAN/web/nutricion/subseccion/recomendaciones_dieteticas.htm">AESAN: recomendaciones dietéticas</a></li>
          <li><a href="https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet">OMS: alimentación sana</a></li>
          <li><a href="https://www.who.int/es/news-room/fact-sheets/detail/physical-activity">OMS: actividad física</a></li>
          <li><a href="https://enfamilia.aeped.es/">AEP: En Familia</a></li>
          <li><a href="https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/translations/spanish/">Harvard: el plato para comer saludable</a></li>
        </ul>
      </div>
    </div>`;
  document.body.append(pie);
})();
