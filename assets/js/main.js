document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // 1. CONTROL DE MODO CLARO / MODO OSCURO (PERSISTENCIA Y SWITCH)
  // =========================================================
  const toggleSwitch = document.querySelector('#checkbox-theme');
  const currentTheme = localStorage.getItem('theme');

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
  // 2. NAVEGACIÓN MÓVIL Y NAVBAR STICKY
  // =========================================================
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const siteNav = document.getElementById('site-nav');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Sombra dinámica en Navbar al hacer Scroll
  window.addEventListener('scroll', () => {
    if (siteNav) {
      if (window.scrollY > 20) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    }
  });

  // =========================================================
  // 3. DESPLAZAMIENTO SUAVE (SMOOTH SCROLL)
  // =========================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = siteNav ? siteNav.offsetHeight : 60;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =========================================================
  // 4. ANIMACIÓN DEL SVG Y INTERSECTIONS OBSERVER
  // =========================================================
  const panelSvg = document.getElementById('panel-svg');

  if (panelSvg) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    const svgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          panelSvg.classList.add('animate-svg');
        }
      });
    }, observerOptions);

    svgObserver.observe(panelSvg);
  }

  // =========================================================
  // 5. VISOR DE GALERÍA DE IMÁGENES (LIGHTBOX MODAL)
  // =========================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  const galleryImages = Array.from(document.querySelectorAll('.gallery-card img'));
  let currentIndex = 0;

  function openLightbox(index) {
    if (galleryImages.length === 0 || !lightbox) return;

    if (index < 0) index = galleryImages.length - 1;
    if (index >= galleryImages.length) index = 0;

    currentIndex = index;
    const selectedImg = galleryImages[currentIndex];

    lightboxImg.src = selectedImg.src;
    lightboxImg.alt = selectedImg.alt || 'Evidencia del proyecto';
    lightboxCaption.textContent = selectedImg.alt || '';

    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  }

  galleryImages.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(index));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => openLightbox(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => openLightbox(currentIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.hasAttribute('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    }
  });

  // =========================================================
  // 6. ANIMACIÓN DE APARICIÓN DE ELEMENTOS (FADE-IN ON SCROLL)
  // =========================================================
  const animatedElements = document.querySelectorAll('.timeline-step, .research-question, .honesty-note, .chart-card, .team-card');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
      el.classList.add('fade-in-prepared');
      fadeObserver.observe(el);
    });
  }

  // =========================================================
  // 7. SOPORTE DE RE-RENDERIZADO DE MATHJAX (SI APLICA)
  // =========================================================
  if (window.MathJax) {
    window.MathJax.typesetPromise && window.MathJax.typesetPromise();
  }

});
