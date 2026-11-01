// despensa — plato interactivo de la portada.
(function () {
  const plato = document.getElementById("plato");
  const nota = document.getElementById("plato-nota");
  if (!plato || !nota) return;

  const textos = {
    verdura: {
      titulo: "Medio plato: verdura y hortalizas",
      cuerpo: "Crudas, a la plancha, al horno o en guiso. Cuanta más variedad de colores, mejor. La fruta entera va de postre o entre horas: la recomendación es llegar a cinco raciones al día entre fruta y verdura.",
    },
    cereal: {
      titulo: "Un cuarto: cereal integral o tubérculo",
      cuerpo: "Pan, arroz o pasta integrales, avena, cuscús, quinoa, patata o boniato. Dan energía para el día; si entrenas mucho, este cuarto puede crecer.",
    },
    proteina: {
      titulo: "Un cuarto: proteína",
      cuerpo: "Legumbres (al menos cuatro veces por semana), pescado, huevos, aves, tofu o frutos secos. La carne roja, de vez en cuando, y la procesada (embutidos, salchichas), lo menos posible.",
    },
    agua: {
      titulo: "Para beber: agua",
      cuerpo: "Agua como bebida de diario. Los refrescos, zumos y bebidas azucaradas son de ocasión, y en los niños, mejor que no sean costumbre.",
    },
    aceite: {
      titulo: "Para cocinar: aceite de oliva",
      cuerpo: "La grasa de referencia para cocinar y aliñar, mejor virgen extra. Un chorrito bien puesto; no hace falta bañar el plato.",
    },
  };

  const trozos = plato.querySelectorAll(".trozo");

  function elegir(trozo) {
    const parte = trozo.dataset.parte;
    const t = textos[parte];
    const yaActivo = trozo.classList.contains("activo");
    trozos.forEach(x => { x.classList.remove("activo"); x.setAttribute("aria-pressed", "false"); });
    if (yaActivo) {
      plato.removeAttribute("data-activo");
      nota.innerHTML = "<strong>El método del plato</strong>Medio plato de verdura, un cuarto de cereal o patata y un cuarto de proteína, con agua para beber y aceite de oliva para cocinar.";
      return;
    }
    trozo.classList.add("activo");
    trozo.setAttribute("aria-pressed", "true");
    plato.setAttribute("data-activo", parte);
    nota.innerHTML = `<strong>${t.titulo}</strong>${t.cuerpo}`;
  }

  trozos.forEach(trozo => {
    trozo.setAttribute("aria-pressed", "false");
    trozo.addEventListener("click", () => elegir(trozo));
    trozo.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); elegir(trozo); }
    });
  });
})();
