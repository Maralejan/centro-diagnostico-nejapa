// ========== MENÚ HAMBURGUESA ==========
function closeMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu && navMenu.classList.contains('show')) {
    navMenu.classList.remove('show');
  }
}

function initHamburgerMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!menuToggle || !navMenu) return;
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    navMenu.classList.toggle('show');
  });
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.navbar')) {
      navMenu.classList.remove('show');
    }
  });
}

// ========== SPA ==========
let activeViewCss = null;

function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve(link);
    link.onerror = () => reject(new Error(`Error cargando CSS: ${href}`));
    document.head.appendChild(link);
  });
}

function loadPage(page) {
  const contentDiv = document.getElementById('content');
  contentDiv.style.visibility = 'hidden';

  if (activeViewCss) {
    activeViewCss.remove();
    activeViewCss = null;
  }

  const cssMap = {
    'servicios-c': 'css/servicios.css',
    'especialidades-c': 'css/especialidades.css',
    'nosotros-c': 'css/nosotros.css',
    'consejos-c': 'css/consejos.css',
    'contacto-c': 'css/contacto.css'
  };
  const cssPath = cssMap[page];
  const cssPromise = cssPath ? loadCSS(cssPath) : Promise.resolve(null);

  const htmlPromise = fetch(`${page}.html`).then(response => {
    if (!response.ok) throw new Error(`No se pudo cargar ${page}.html`);
    return response.text();
  });

  Promise.all([cssPromise, htmlPromise])
    .then(([cssLink, html]) => {
      if (cssLink) activeViewCss = cssLink;
      contentDiv.innerHTML = html;
      void contentDiv.offsetHeight;
      contentDiv.style.visibility = 'visible';

      // Cargar inicio.js si es necesario
      if (page === 'inicio') {
        if (!document.querySelector('script[src*="inicio.js"]')) {
          const script = document.createElement('script');
          script.src = 'js/inicio.js';
          script.onload = () => {
            if (window.iniciarCarrusel) window.iniciarCarrusel();
          };
          document.body.appendChild(script);
        } else {
          if (window.iniciarCarrusel) window.iniciarCarrusel();
        }
      }

      // ===== ACTUALIZAR CLASE ACTIVA USANDO data-page =====
      document.querySelectorAll('.navbar nav a').forEach(link => {
        link.classList.remove('active');
      });
      const activeLink = document.querySelector(`.navbar nav a[data-page="${page}"]`);
      if (activeLink) activeLink.classList.add('active');

      // Cerrar menú hamburguesa después de navegar
      closeMenu();
    })
    .catch(err => {
      console.error('Error al cargar la página:', err);
      contentDiv.innerHTML = '<p style="text-align:center; padding:40px;">⚠️ Error al cargar el contenido. Intenta de nuevo.</p>';
      contentDiv.style.visibility = 'visible';
    });
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
  initHamburgerMenu();
  loadPage('inicio');
});

window.loadPage = loadPage;
window.closeMenu = closeMenu;