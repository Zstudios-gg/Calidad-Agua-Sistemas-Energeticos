// =========================================================
// UNACIFOR — Micrositio de defensa — main.js (vanilla, sin dependencias)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroRain();
  initScrollReveal();
  initMechanism();
  initCharts();
  initGallery();
});

/* ---------- Navegación móvil ---------- */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* ---------- Lluvia decorativa en el hero (CSS-driven, generada en JS) ---------- */
function initHeroRain() {
  const container = document.getElementById('hero-rain');
  if (!container) return;
  const dropCount = window.innerWidth < 600 ? 14 : 26;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement('span');
    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 5;
    const delay = Math.random() * 6;
    drop.style.left = left + '%';
    drop.style.animationDuration = duration + 's';
    drop.style.animationDelay = delay + 's';
    frag.appendChild(drop);
  }
  container.appendChild(frag);
}

/* ---------- Scroll reveal con IntersectionObserver nativo ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ---------- Animación principal del mecanismo ---------- */
function initMechanism() {
  const mechanism = document.querySelector('.mechanism');
  const stage = document.querySelector('.mechanism-stage');
  const btnPlay = document.getElementById('btn-play');
  const btnRestart = document.getElementById('btn-restart');
  const playIcon = document.getElementById('play-icon');
  const playLabel = document.getElementById('play-label');
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  if (!mechanism || !stage) return;

  let isPlaying = false; // starts paused until it scrolls into view
  let hasStarted = false;

  const setPaused = (paused) => {
    isPlaying = !paused;
    mechanism.classList.toggle('is-paused', paused);
    playIcon.className = paused ? 'ti ti-player-play' : 'ti ti-player-pause';
    playLabel.textContent = paused ? 'Reproducir' : 'Pausar';
    btnPlay.setAttribute('aria-pressed', String(!paused));
  };

  // Auto-play in loop only when the stage enters the viewport (no aggressive autoplay on load)
  if ('IntersectionObserver' in window) {
    const stageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasStarted) {
          hasStarted = true;
          setPaused(false);
        } else if (!entry.isIntersecting && hasStarted) {
          // pause while off-screen to save battery, resume label state on return
          mechanism.classList.add('is-paused');
        } else if (entry.isIntersecting && hasStarted && isPlaying) {
          mechanism.classList.remove('is-paused');
        }
      });
    }, { threshold: 0.35 });
    stageObserver.observe(stage);
  } else {
    setPaused(false);
  }

  // Play / Pause button — touch and click both supported via click event (fires for both)
  btnPlay.addEventListener('click', () => {
    setPaused(isPlaying);
  });

  // Restart: replay the CSS animation by forcing reflow
  btnRestart.addEventListener('click', () => {
    const animated = stage.querySelectorAll('.drop, .ionlabel, .crystal, .ray, .hotglow, .hottext');
    animated.forEach(el => {
      el.style.animation = 'none';
    });
    // Force reflow
    void stage.offsetWidth;
    animated.forEach(el => {
      el.style.animation = '';
    });
    if (!isPlaying) setPaused(false);
  });

  // Before / after toggle
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const state = btn.dataset.state;
      mechanism.classList.toggle('state-scaled', state === 'scaled');
      if (state === 'scaled') {
        mechanism.classList.add('is-paused');
      } else if (isPlaying) {
        mechanism.classList.remove('is-paused');
      }
    });
  });
}

/* ---------- Gráficos ligeros en Canvas nativo (sin librerías) ---------- */
function initCharts() {
  drawBarChart('chart-conductividad', {
    labels: ['Lluvia', 'Grifo', 'Purificada'],
    values: [0.12, 0.10, 0.00],
    unit: 'mS/cm',
    max: 0.20,
    thresholdLine: 0.20,
    thresholdLabel: 'Límite 0.20'
  });

  drawBarChart('chart-ph', {
    labels: ['Lluvia', 'Grifo', 'Purificada'],
    values: [8.1, 6.7, 6.2],
    unit: '',
    max: 10,
    acceptableRange: [6.0, 8.0]
  });
}

function drawBarChart(canvasId, opts) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Handle device pixel ratio for crisp rendering
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 400;
  const cssHeight = 260;
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  canvas.style.height = cssHeight + 'px';
  ctx.scale(dpr, dpr);

  const W = cssWidth, H = cssHeight;
  const paddingLeft = 36, paddingBottom = 34, paddingTop = 16, paddingRight = 12;
  const chartW = W - paddingLeft - paddingRight;
  const chartH = H - paddingTop - paddingBottom;

  ctx.clearRect(0, 0, W, H);

  const colors = ['#378ADD', '#1A7A7A', '#2C8C8C'];
  const max = opts.max;

  // acceptable range band (for pH chart)
  if (opts.acceptableRange) {
    const [lo, hi] = opts.acceptableRange;
    const yLo = paddingTop + chartH - (lo / max) * chartH;
    const yHi = paddingTop + chartH - (hi / max) * chartH;
    ctx.fillStyle = 'rgba(44, 140, 140, 0.12)';
    ctx.fillRect(paddingLeft, yHi, chartW, yLo - yHi);
  }

  // axis
  ctx.strokeStyle = '#DCD9D0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, paddingTop + chartH);
  ctx.lineTo(paddingLeft + chartW, paddingTop + chartH);
  ctx.stroke();

  const n = opts.values.length;
  const gap = 24;
  const barWidth = (chartW - gap * (n + 1)) / n;

  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';

  opts.values.forEach((val, i) => {
    const barH = (val / max) * chartH;
    const x = paddingLeft + gap * (i + 1) + barWidth * i;
    const y = paddingTop + chartH - barH;

    ctx.fillStyle = colors[i % colors.length];
    roundRectPath(ctx, x, y, barWidth, barH, 4);
    ctx.fill();

    // value label
    ctx.fillStyle = '#2A2A2A';
    ctx.fillText(val.toFixed(2).replace(/\.00$/, val % 1 === 0 ? '' : '.00'), x + barWidth / 2, y - 6);

    // category label
    ctx.fillStyle = '#6E6E6E';
    ctx.fillText(opts.labels[i], x + barWidth / 2, paddingTop + chartH + 18);
  });
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

/* ---------- Galería con lightbox táctil + swipe ---------- */
function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');
  if (items.length === 0 || !lightbox) return;

  let currentIndex = 0;

  const openAt = (index) => {
    currentIndex = (index + items.length) % items.length;
    const img = items[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  items.forEach((item, index) => {
    item.addEventListener('click', () => openAt(index));
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => openAt(currentIndex - 1));
  btnNext.addEventListener('click', () => openAt(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') openAt(currentIndex - 1);
    if (e.key === 'ArrowRight') openAt(currentIndex + 1);
  });

  // Swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) openAt(currentIndex + 1);
      else openAt(currentIndex - 1);
    }
  }, { passive: true });
}
