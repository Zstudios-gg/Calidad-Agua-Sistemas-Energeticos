document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // 1. CONTROL DE MODO CLARO / MODO OSCURO
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
  // 4. AUTO-SCROLL INDICADOR EN TABLA MÓVIL
  // =========================================================
  const tableContainer = document.getElementById('results-table-container');
  if (tableContainer) {
    setTimeout(() => {
      if (tableContainer.scrollWidth > tableContainer.clientWidth) {
        tableContainer.scrollTo({
          left: 70,
          behavior: 'smooth'
        });
        setTimeout(() => {
          tableContainer.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        }, 800);
      }
    }, 1500);
  }

  // =========================================================
  // 5. INTERACTIVIDAD EN SECCIÓN DE EQUIPO
  // =========================================================
  const teamCardInteractive = document.getElementById('team-toggle-card');
  if (teamCardInteractive) {
    teamCardInteractive.addEventListener('click', () => {
      teamCardInteractive.classList.toggle('is-expanded');
    });
  }

  // =========================================================
  // 6. VISOR DE GALERÍA DE IMÁGENES (LIGHTBOX MODAL)
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
  // 7. ANIMACIONES DE APARICIÓN (FADE-IN ON SCROLL)
  // =========================================================
  const animatedElements = document.querySelectorAll('.timeline-step, .research-question, .honesty-note, .team-card, .references-card');

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
  } else {
    animatedElements.forEach(el => el.style.opacity = '1');
  }

  // =========================================================
  // 8. SOPORTE DE RE-RENDERIZADO DE MATHJAX
  // =========================================================
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise();
  }

  // =========================================================
  // 9. CONTROLES DEL VIDEO (PLAY / PAUSA / SONIDO / REINICIAR)
  // =========================================================
  const panelVideo = document.getElementById('mecanismo-video');
  const playBtn = document.getElementById('anim-play');
  const resetBtn = document.getElementById('anim-reset');

  // Bandera para no pisar la pausa manual del usuario con el autoplay del viewport
  let manuallyPaused = false;

  function updatePlayButton(isPlaying) {
    if (!playBtn) return;
    playBtn.setAttribute('aria-pressed', String(isPlaying));
    playBtn.innerHTML = isPlaying
      ? '<i class="ti ti-player-pause-filled"></i> Pausar'
      : '<i class="ti ti-player-play-filled"></i> Reproducir';
  }

  if (panelVideo && playBtn) {
    panelVideo.addEventListener('play', () => updatePlayButton(true));
    panelVideo.addEventListener('pause', () => updatePlayButton(false));

    playBtn.addEventListener('click', () => {
      if (panelVideo.paused) {
        manuallyPaused = false;
        panelVideo.play();
      } else {
        manuallyPaused = true;
        panelVideo.pause();
      }
    });
  }

  if (panelVideo && resetBtn) {
    resetBtn.addEventListener('click', () => {
      panelVideo.currentTime = 0;
      manuallyPaused = false;
      panelVideo.play();
    });
  }

  // Botón de sonido: fallback manual si el navegador bloqueó el audio automático.
  // Al ser un clic directo del usuario, los navegadores SÍ permiten activar el audio aquí,
  // incluso si el autoplay con sonido fue bloqueado al cargar la página.
  const muteBtn = document.getElementById('anim-mute');

  function updateMuteButton(isMuted) {
    if (!muteBtn) return;
    muteBtn.setAttribute('aria-pressed', String(!isMuted));
    muteBtn.innerHTML = isMuted
      ? '<i class="ti ti-volume-off"></i> Activar sonido'
      : '<i class="ti ti-volume"></i> Silenciar';
  }

  if (panelVideo && muteBtn) {
    updateMuteButton(panelVideo.muted);
    muteBtn.addEventListener('click', () => {
      panelVideo.muted = !panelVideo.muted;
      updateMuteButton(panelVideo.muted);
    });
  }

  // Reproducir automáticamente solo cuando la sección entra al viewport, y pausar al salir
  let videoIsVisible = false;

  if (panelVideo && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        videoIsVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!manuallyPaused) {
            panelVideo.play().catch(() => {
              // Autoplay bloqueado por el navegador; el usuario puede darle Play manualmente
            });
          }
        } else {
          panelVideo.pause();
        }
      });
    }, { threshold: 0.2 });
    videoObserver.observe(panelVideo);
  }

  // Al terminar el video (ya sin loop), bajamos a la siguiente sección
  if (panelVideo) {
    panelVideo.addEventListener('ended', () => {
      if (!videoIsVisible) return; // el usuario ya se fue de la sección, no lo interrumpimos
      const nextSection = document.getElementById('problema');
      if (!nextSection) return;
      setTimeout(() => {
        const navHeight = siteNav ? siteNav.offsetHeight : 60;
        const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }, 1200);
    });
  }

  // =========================================================
  // 10. GRÁFICOS DE BARRAS NATIVOS EN CANVAS (SIN CHART.JS)
  // =========================================================
  function drawBarChart(canvasId, labels, values, colors, unitLabel, refLine) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 380;
    const cssHeight = 260;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    ctx.scale(dpr, dpr);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#EAEAEA' : '#2A2A2A';
    const gridColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(13,79,79,0.12)';

    const padding = { top: 20, right: 15, bottom: 40, left: 45 };
    const chartW = cssWidth - padding.left - padding.right;
    const chartH = cssHeight - padding.top - padding.bottom;
    const maxVal = Math.max(...values, refLine || 0) * 1.15 || 1;

    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // Ejes / grid
    ctx.strokeStyle = gridColor;
    ctx.fillStyle = textColor;
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'right';
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const y = padding.top + chartH - (chartH * i) / steps;
      const val = (maxVal * i) / steps;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
      ctx.fillText(val.toFixed(1), padding.left - 6, y + 3);
    }

    // Línea de referencia (rango aceptable) si aplica
    if (refLine !== undefined && refLine !== null) {
      const yRef = padding.top + chartH - (chartH * refLine) / maxVal;
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#AB3428';
      ctx.beginPath();
      ctx.moveTo(padding.left, yRef);
      ctx.lineTo(padding.left + chartW, yRef);
      ctx.stroke();
      ctx.restore();
    }

    // Barras
    const barSlot = chartW / labels.length;
    const barWidth = barSlot * 0.5;
    labels.forEach((label, i) => {
      const val = values[i];
      const barHeight = (val / maxVal) * chartH;
      const x = padding.left + barSlot * i + (barSlot - barWidth) / 2;
      const y = padding.top + chartH - barHeight;

      ctx.fillStyle = colors[i] || '#1A7A7A';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Valor encima de la barra
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(val.toFixed(2).replace(/\.00$/, ''), x + barWidth / 2, y - 6);

      // Etiqueta del eje X
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText(label, x + barWidth / 2, padding.top + chartH + 16);
    });

    if (unitLabel) {
      ctx.save();
      ctx.translate(12, padding.top + chartH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillStyle = textColor;
      ctx.fillText(unitLabel, 0, 0);
      ctx.restore();
    }
  }

  function renderCharts() {
    drawBarChart(
      'chart-conductividad',
      ['Lluvia', 'Grifo', 'Purificada'],
      [0.12, 0.10, 0.00],
      ['#1A7A7A', '#0D4F4F', '#B4881B'],
      'mS/cm'
    );
    drawBarChart(
      'chart-ph',
      ['Lluvia', 'Grifo', 'Purificada'],
      [8.1, 6.7, 6.2],
      ['#1A7A7A', '#0D4F4F', '#B4881B'],
      'pH',
      7.0
    );
  }

  renderCharts();
  window.addEventListener('resize', () => {
    clearTimeout(window._chartResizeTimer);
    window._chartResizeTimer = setTimeout(renderCharts, 200);
  });
  // Redibujar con los colores correctos al cambiar de tema
  if (toggleSwitch) {
    toggleSwitch.addEventListener('change', renderCharts);
  }

  // =========================================================
  // 11. SWIPE TÁCTIL EN EL LIGHTBOX (GALERÍA)
  // =========================================================
  if (lightbox) {
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) openLightbox(currentIndex + 1); // swipe izquierda -> siguiente
        else openLightbox(currentIndex - 1); // swipe derecha -> anterior
      }
    }, { passive: true });
  }

  // =========================================================
  // 12. AUTO-SCROLL DE BIENVENIDA (BAJA AL VIDEO AL ENTRAR)
  // =========================================================
  (function initWelcomeAutoScroll() {
    const target = document.getElementById('mecanismo');
    if (!target) return;

    // Si el usuario entró directo a una sección específica (ej. compartieron un enlace #resultados),
    // no lo interrumpimos bajándolo al video.
    if (window.location.hash && window.location.hash !== '#hero') return;

    let cancelled = false;
    const cancel = () => { cancelled = true; };

    // Cualquier gesto del usuario (scroll, touch, teclado) cancela el autoscroll programado
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(evt => {
      window.addEventListener(evt, cancel, { passive: true, once: true });
    });

    setTimeout(() => {
      if (cancelled || window.scrollY > 40) return;
      const navHeight = siteNav ? siteNav.offsetHeight : 60;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }, 1500);
  })();

});
