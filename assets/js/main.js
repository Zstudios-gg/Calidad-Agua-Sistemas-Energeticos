document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // 1. NAVEGACIÓN MÓVIL (MENÚ HAMBURGUESA)
  // =========================================================
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    // Abrir / Cerrar menú
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar el menú al hacer clic en cualquier enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================
  // 2. CONTROL DE MODO CLARO / MODO OSCURO
  // =========================================================
  const toggleSwitch = document.querySelector('#checkbox-theme');
  const currentTheme = localStorage.getItem('theme');

  // Aplicar tema guardado en localStorage o detectar preferencia del sistema
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark' && toggleSwitch) {
      toggleSwitch.checked = true;
    }
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (toggleSwitch) toggleSwitch.checked = true;
    }
  }

  // Escuchar el cambio en el Switch
  if (toggleSwitch) {
    toggleSwitch.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // =========================================================
  // 3. VISOR DE GALERÍA (LIGHTBOX) CON NAVEGACIÓN
  // =========================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  // Obtener todas las imágenes dentro de tarjetas de galería
  const galleryImages = Array.from(document.querySelectorAll('.gallery-card img'));
  let currentIndex = 0;

  function openLightbox(index) {
    if (galleryImages.length === 0) return;
    
    // Ciclar índices (si supera el final, vuelve al inicio y viceversa)
    if (index < 0) index = galleryImages.length - 1;
    if (index >= galleryImages.length) index = 0;

    currentIndex = index;
    const selectedImg = galleryImages[currentIndex];

    lightboxImg.src = selectedImg.src;
    lightboxImg.alt = selectedImg.alt || 'Evidencia de campo';
    lightboxCaption.textContent = selectedImg.alt || '';
    
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // Evita scroll de fondo al estar abierto
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = ''; // Restaura el scroll
    }
  }

  // Eventos para abrir imágenes
  galleryImages.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(index));
  });

  // Botones del Lightbox
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => openLightbox(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => openLightbox(currentIndex + 1));

  // Cerrar al hacer clic en el fondo negro
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Navegación por teclado (Esc, Flechas)
  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.hasAttribute('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    }
  });

  // =========================================================
  // 4. DESPLAZAMIENTO SUAVE (SMOOTH SCROLL)
  // =========================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = document.querySelector('.site-nav')?.offsetHeight || 60;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
