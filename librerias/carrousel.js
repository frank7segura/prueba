function autoplayCarousel() {
  const carouselEl = document.getElementById("carousel");
  const slideContainerEl = carouselEl.querySelector("#slide-container");
  const slideEl = carouselEl.querySelector(".slide");
  let slideWidth = slideEl.offsetWidth;

  // Agregar manejadores de clic (solo si los botones existen en tu HTML)
  const backButton = document.querySelector("#back-button");
  const forwardButton = document.querySelector("#forward-button");
  if (backButton) {
    backButton.addEventListener("click", () => navigate("backward"));
  }
  if (forwardButton) {
    forwardButton.addEventListener("click", () => navigate("forward"));
  }

  // Manejadores para los indicadores (asegúrate de tener elementos .slide-indicator en tu HTML)
  document.querySelectorAll(".slide-indicator").forEach((dot, index) => {
    dot.addEventListener("click", () => navigate(index));
    dot.addEventListener("mouseenter", () => clearInterval(autoplay));
  });

  // Manejadores de teclado
  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") {
      clearInterval(autoplay);
      navigate("backward");
    } else if (e.code === "ArrowRight") {
      clearInterval(autoplay);
      navigate("forward");
    }
  });

  // Actualizar el ancho del slide al redimensionar la ventana
  window.addEventListener("resize", () => {
    slideWidth = slideEl.offsetWidth;
  });

  // Navegación automática
  const autoplay = setInterval(() => navigate("forward"), 3000);

  // Pausar el autoplay al pasar el mouse sobre el contenedor
  slideContainerEl.addEventListener("mouseenter", () =>
    clearInterval(autoplay)
  );

  // Reanudar autoplay al salir del contenedor
  slideContainerEl.addEventListener("mouseleave", () =>
    setInterval(() => navigate("forward"), 3000)
  );

  // Calcular la nueva posición de scroll
  const getNewScrollPosition = (arg) => {
    const gap = 10; // Espaciado entre diapositivas
    const maxScrollLeft = slideContainerEl.scrollWidth - slideWidth;

    if (arg === "forward") {
      const x = slideContainerEl.scrollLeft + slideWidth + gap;
      return x <= maxScrollLeft ? x : 0; // Volver al inicio si llega al final
    } else if (arg === "backward") {
      const x = slideContainerEl.scrollLeft - slideWidth - gap;
      return x >= 0 ? x : maxScrollLeft; // Ir al final si retrocede desde el inicio
    } else if (typeof arg === "number") {
      return arg * (slideWidth + gap);
    }
  };

  // Navegar a la posición calculada
  const navigate = (arg) => {
    slideContainerEl.scrollLeft = getNewScrollPosition(arg);
  };

  // Observador para los indicadores (actualiza los indicadores activos)
  const slideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const slideIndex = entry.target.dataset.slideindex;
          const activeIndicator = carouselEl.querySelector(
            ".slide-indicator.active"
          );
          if (activeIndicator) {
            activeIndicator.classList.remove("active");
          }
          const indicators = carouselEl.querySelectorAll(".slide-indicator");
          if (indicators[slideIndex]) {
            indicators[slideIndex].classList.add("active");
          }
        }
      });
    },
    { root: slideContainerEl, threshold: 0.1 }
  );

  // Aplicar el observador a cada slide
  document.querySelectorAll(".slide").forEach((slide) => {
    slideObserver.observe(slide);
  });
}

// Ejecutar el carrusel después de que el DOM esté listo
autoplayCarousel();
