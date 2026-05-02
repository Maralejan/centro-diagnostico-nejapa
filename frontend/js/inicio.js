// ========== CARRUSEL AUTOMÁTICO ==========
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  slides[index].classList.add('active');
  dots[index].classList.add('active');
}

function nextSlide() {
  currentSlide++;
  if (currentSlide >= slides.length) currentSlide = 0;
  showSlide(currentSlide);
}

// Cambio automático cada 5 segundos
let slideInterval = setInterval(nextSlide, 5000);

// Dots click
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlide = index;
    showSlide(currentSlide);
    // Reiniciar el intervalo para que no cambie justo después de hacer clic
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  });
});

// ========== CONTADORES CON OBSERVADOR DE VISIBILIDAD ==========
// Función que anima los contadores (se ejecuta solo una vez)
function iniciarContadores() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  // Evitar que se ejecute más de una vez
  if (iniciarContadores.yaEjecutado) return;
  iniciarContadores.yaEjecutado = true;

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let current = 0;
    counter.innerText = '0';

    const updateCounter = () => {
      const increment = target / 80;
      if (current < target) {
        current = Math.ceil(current + increment);
        if (current > target) current = target;
        counter.innerText = current;
        setTimeout(updateCounter, 20);
      } else {
        // Formato final según el valor
        if (target === 15) counter.innerText = "15+";
        else if (target === 50) counter.innerText = "1K+";
        else if (target === 100) counter.innerText = "100%";
        else if (target === 99) counter.innerText = "95%";
        else counter.innerText = target;
      }
    };
    updateCounter();
  });
}

// Configurar el observador para que detecte cuando la sección de estadísticas es visible
const observador = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      iniciarContadores();
      // Una vez iniciado, desconectamos el observador (ya no hace falta)
      observador.disconnect();
    }
  });
}, { threshold: 0.3 }); // Se activa cuando al menos el 30% de la sección es visible

// Buscar el contenedor de estadísticas (puede ser .confianza-stats o un padre)
const statsSection = document.querySelector('.confianza-stats');
if (statsSection) {
  observador.observe(statsSection);
} else {
  // Si no existe (por ejemplo, porque el DOM aún no cargó), esperar un poco
  setTimeout(() => {
    const fallbackStats = document.querySelector('.confianza-stats');
    if (fallbackStats) observador.observe(fallbackStats);
  }, 500);
}