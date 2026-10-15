# URL X-Ray

A fast, safe, and open-source **URL expander** — see where a shortened link (bit.ly, tinyurl, is.gd, etc.) really goes *without* clicking it.

Built with pure HTML, CSS, and vanilla JavaScript. No build tools. No dependencies. No server required.

## Features

- **Zero server required** — runs entirely in the browser using public proxy APIs to safely follow HTTP redirects
- **Safe by design** — does not execute JavaScript or load page content from the destination URL
- **Hardened security** — strict Content Security Policy (CSP), no-referrer policy, zero inline scripts
- **Dual-proxy fallback** — uses `api.allorigins.win` as primary with automatic fallback to `corsproxy.io`
- **Light / dark mode** — system preference detected automatically, persisted in localStorage
- **Fully responsive** — mobile drawer, touch-friendly, accessible (WCAG 2.2 AA)
- **Custom cursor + scroll animations** — powered by `theme.js` from the alvakry-theme design system

## Tech stack

| Layer      | Detail                                      |
|------------|---------------------------------------------|
| Markup     | Semantic HTML5                              |
| Styles     | CSS custom properties, alvakry-theme system |
| Fonts      | Space Grotesk + Space Mono (Google Fonts)   |
| Logic      | Vanilla JS (`app.js`)                       |
| Theme / UX | `theme.js` — cursor, dark mode, hamburger   |

## Run locally

Static frontend — no build step needed.

```bash
git clone https://github.com/alvakry/url-xray.git
cd url-xray
# open index.html in your browser, or serve with any static server:
npx serve .
```

## How it works

1. You paste a shortened URL
2. The app sends a request through a CORS proxy
3. The proxy follows all HTTP 301/302 redirects and returns the final destination
4. The resolved URL is shown — no malicious scripts can execute because the destination page is never loaded

## File structure

```
urlxray-main/
├── index.html   — markup and page structure
├── style.css    — alvakry-theme design system + component styles
├── theme.js     — dark mode toggle, custom cursor, hamburger, scroll fade-in
├── app.js       — URL resolution logic
└── favicon.svg  — site icon
```

## Author

Open source by [@alvakry](https://github.com/alvakry)

## License

MIT
