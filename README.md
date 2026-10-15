<div align="center">

<img src="preview.png" alt="URL X-Ray Preview" width="160" />

# URL X-RAY

**See where shortened links really go — before you click.**

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-c8ff00?style=flat-square)](LICENSE)
[![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen?style=flat-square)](#)

</div>

---

```
paste url → follow redirects → see destination
```

URL X-Ray is a zero-dependency, browser-only tool that expands shortened URLs (bit.ly, tinyurl, t.co, etc.) and reveals their final destination — without you ever clicking them.

---

## Features

| | |
|---|---|
| 🛡 **Safe by design** | Never loads destination page content or executes remote scripts |
| 🔒 **Zero tracking** | No analytics, no storage, no server — runs entirely in your browser |
| ⚡ **Instant results** | Dual-proxy fallback ensures maximum uptime and speed |
| 🌗 **Light / dark mode** | Respects system preference, persisted across sessions |
| 📱 **Fully responsive** | Mobile drawer, touch-friendly, WCAG 2.2 AA accessible |
| ✦ **Designed with care** | alvakry-theme — Space Grotesk + Space Mono, custom cursor, scroll animations |

---

## How it works

```
┌─────────────────────────────────────────────────────┐
│  you paste      →  proxy fetches   →  final URL     │
│  https://bit.ly/xyz   all redirects     revealed    │
└─────────────────────────────────────────────────────┘
```

1. You paste a shortened URL into the tool
2. The request is sent through a CORS proxy (`api.allorigins.win`, fallback to `corsproxy.io`)
3. The proxy follows every HTTP 301/302 redirect chain
4. The resolved final URL is returned and displayed — destination scripts never execute

---

## Stack

```
urlxray-main/
├── index.html   — semantic markup, sections, aria roles
├── style.css    — alvakry-theme design system + all component styles
├── theme.js     — dark mode, custom cursor, hamburger, scroll fade-in
├── app.js       — URL resolution logic, dual-proxy, clipboard
└── favicon.png  — icon
```

No npm. No bundler. No framework. Open `index.html` and it works.

---

## Run locally

```bash
git clone https://github.com/alvakry/url-xray.git
cd url-xray

# option 1 — just open the file
start index.html

# option 2 — serve with any static server
npx serve .
```

---

## Supported shorteners

`bit.ly` · `tinyurl.com` · `is.gd` · `shorturl.at` · `ow.ly` · `t.co` · `rb.gy` · `cutt.ly` · and any other service that uses standard HTTP redirects.

---

## Security

- Strict **Content Security Policy** (CSP) — no inline scripts, no external connections beyond the two declared proxies
- **`no-referrer`** policy — destination sites cannot see where the request originated
- Destination page is **never loaded** — only the final redirect URL is read

---

<div align="center">

made by <a href="https://github.com/alvakry"><strong>@alvakry</strong></a> · MIT License

</div>
