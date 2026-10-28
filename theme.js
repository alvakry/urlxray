/* ═══════════════════════════════════════════════
   URL X-Ray — interactions
   Ported verbatim from whitewebsite/script.js
   with theme-toggle wired to data-theme on <html>
═══════════════════════════════════════════════ */

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* ─── CURSOR ─── */
(function initCursor() {
  if (prefersReducedMotion) return;

  const dot  = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  const DOT_HALF  = 5;
  const RING_HALF = 18;

  let mx = -200, my = -200;
  let rx = -200, ry = -200;
  let rafId = null;
  let isRunning = false;

  function step() {
    if (!isRunning) return;
    dot.style.transform  = `translate(${mx - DOT_HALF}px, ${my - DOT_HALF}px)`;
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - RING_HALF}px, ${ry - RING_HALF}px)`;
    rafId = requestAnimationFrame(step);
  }

  function start() { if (isRunning) return; isRunning = true; rafId = requestAnimationFrame(step); }
  function stop()  { isRunning = false; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, [data-hover]')) {
      dot.classList.add('hover'); ring.classList.add('hover');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, [data-hover]')) {
      dot.classList.remove('hover'); ring.classList.remove('hover');
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

  start();
})();


/* ─── SCROLL: progress + nav ─── */
(function initScroll() {
  const progress = document.querySelector('.scroll-progress');
  const nav      = document.querySelector('.nav');
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h   = document.documentElement;
      const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
      if (progress) progress.style.transform = `scaleX(${pct})`;
      if (nav)      nav.classList.toggle('scrolled', h.scrollTop > 20);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ─── REVEAL ─── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('will-animate');
      requestAnimationFrame(() => {
        el.classList.add('visible');
        el.addEventListener('transitionend', () => el.classList.remove('will-animate'), { once: true });
      });
      obs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  els.forEach(el => obs.observe(el));
})();


/* ─── STAGGER ─── */
(function initStagger() {
  const parents = document.querySelectorAll('[data-stagger]');
  if (!parents.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('stagger-ready');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.05 });

  parents.forEach(el => obs.observe(el));
})();


/* ─── THEME TOGGLE ─── */
(function initTheme() {
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // icons toggled by CSS; update drawer label for clarity
    const label = document.getElementById('drawerThemeLabel');
    if (label) label.textContent = theme === 'dark' ? 'Switch to light' : 'Switch to dark';
    localStorage.setItem('urlxray_theme', theme);
  }

  const saved = localStorage.getItem('urlxray_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  document.addEventListener('DOMContentLoaded', () => {
    ['themeBtn','themeBtnMobile'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
      });
    });
  });
})();


/* ─── HAMBURGER ─── */
(function initMenu() {
  document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const drawer    = document.getElementById('mobileDrawer');
    if (!hamburger || !drawer) return;

    function toggle(open) {
      hamburger.classList.toggle('open', open);
      drawer.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => toggle(!hamburger.classList.contains('open')));
    document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  });
})();


/* ─── ACTIVE NAV ─── */
(function initActiveNav() {
  document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!navLinks.length) return;

    const linkMap = new Map();
    navLinks.forEach(l => linkMap.set(l.getAttribute('href').slice(1), l));

    let current = null;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (!linkMap.has(id)) return;
        if (current) current.classList.remove('active');
        current = linkMap.get(id);
        current.classList.add('active');
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
  });
})();
