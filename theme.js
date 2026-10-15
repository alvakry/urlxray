/**
 * alvakry-theme — base JS
 * ─────────────────────────────────────────
 * Drop this script at the bottom of <body>.
 * Handles: theme toggle, lang toggle, custom
 * cursor, hamburger menu, scroll fade-in.
 *
 * Requirements in HTML:
 *   Cursor    → <div class="cursor" id="cursor"></div>
 *   Theme btn → id="themeBtn"  + children id="themeIcon" id="themeLabel"
 *   Theme btn (mobile) → id="themeBtnMobile" + id="themeIconM" id="themeLabelM"
 *   Lang btns → id="btnEN" id="btnID" id="btnENM" id="btnIDM"
 *   Hamburger → id="hamburger"  (button)
 *   Drawer    → id="mobileDrawer"
 *   Drawer links → class="drawer-link"
 *
 * i18n: add data-i18n="key" to any element whose textContent should swap.
 *       Extend the `strings` object below with your own keys.
 *
 * Bilingual content: wrap text in <span lang="en">…</span> and
 *   <span lang="id">…</span> — CSS hides the inactive one automatically.
 */

(function () {

  /* ══════════════════════════════════════
     i18n strings  ← add your own keys here
     ══════════════════════════════════════ */
  var strings = {
    en: {
      'nav.home':     'home',
      'nav.work':     'work',
      'nav.about':    'about',
      'nav.thoughts': 'thoughts',
      'nav.contact':  'contact',
      /* add more keys as needed */
    },
    id: {
      'nav.home':     'beranda',
      'nav.work':     'karya',
      'nav.about':    'tentang',
      'nav.thoughts': 'pikiran',
      'nav.contact':  'kontak',
    }
  };

  /* ══════════════════════════════════════
     LANGUAGE
     ══════════════════════════════════════ */
  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    /* swap data-i18n text nodes */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (strings[lang] && strings[lang][key]) el.textContent = strings[lang][key];
    });

    /* active state on pills */
    ['btnEN', 'btnENM'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('active', lang === 'en');
    });
    ['btnID', 'btnIDM'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('active', lang === 'id');
    });

    /* hook for custom re-render (override in your page script) */
    if (typeof window.onLangChange === 'function') window.onLangChange(lang);

    localStorage.setItem('alvakry_lang', lang);
  }

  /* expose globally so onclick="setLang('id')" works in HTML */
  window.setLang = setLang;

  /* ══════════════════════════════════════
     THEME
     ══════════════════════════════════════ */
  function applyTheme(theme) {
    var isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);

    var icon  = isDark ? '☀︎' : '☾';
    var label = isDark ? 'light' : 'dark';

    var ids = [
      ['themeIcon',  'themeLabel'],
      ['themeIconM', 'themeLabelM'],
    ];
    ids.forEach(function (pair) {
      var iconEl  = document.getElementById(pair[0]);
      var labelEl = document.getElementById(pair[1]);
      if (iconEl)  iconEl.textContent  = icon;
      if (labelEl) labelEl.textContent = label;
    });

    localStorage.setItem('alvakry_theme', theme);
  }

  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  }

  window.toggleTheme = toggleTheme;

  /* ══════════════════════════════════════
     HAMBURGER / MOBILE DRAWER
     ══════════════════════════════════════ */
  function toggleMenu(open) {
    var hamburger = document.getElementById('hamburger');
    var drawer    = document.getElementById('mobileDrawer');
    if (!hamburger || !drawer) return;

    hamburger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  /* ══════════════════════════════════════
     CUSTOM CURSOR  (desktop only)
     ══════════════════════════════════════ */
  function initCursor() {
    var cursor = document.getElementById('cursor');
    if (!cursor) return;
    if (window.matchMedia('(hover: none)').matches) return; /* touch device */

    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('grow'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('grow'); });
    });
  }

  /* ══════════════════════════════════════
     SCROLL FADE-IN
     ══════════════════════════════════════ */
  function initScrollFade() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity   = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('section').forEach(function (el) {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(18px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      io.observe(el);
    });
  }

  /* ══════════════════════════════════════
     INIT  (runs on DOMContentLoaded)
     ══════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {

    /* restore preferences */
    var savedTheme = localStorage.getItem('alvakry_theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var savedLang  = localStorage.getItem('alvakry_lang') || 'en';
    applyTheme(savedTheme);
    setLang(savedLang);

    /* theme buttons */
    ['themeBtn', 'themeBtnMobile'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', toggleTheme);
    });

    /* hamburger */
    var hamburger = document.getElementById('hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', function () {
        toggleMenu(!hamburger.classList.contains('open'));
      });
    }

    /* drawer links close menu */
    document.querySelectorAll('.drawer-link').forEach(function (l) {
      l.addEventListener('click', function () { toggleMenu(false); });
    });

    /* Escape closes drawer */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') toggleMenu(false);
    });

    initCursor();
    initScrollFade();
  });

})();
