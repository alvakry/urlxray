# 🔍 URL X-Ray

A fast, safe, and open-source **URL Expander** that allows you to see where a shortened link (like it.ly, 	inyurl, is.gd, etc.) really goes *without* clicking it. 

Designed with a strict, dark-mode technical aesthetic and built with pure HTML, CSS, and Vanilla JavaScript.

## ✨ Features

- **Zero Server Required:** Runs entirely in the browser using public proxy APIs to safely follow HTTP redirects.
- **Safe & Secure:** Does not execute JavaScript or load page content from the destination URL, keeping you safe from malicious sites.
- **Hardened Security:** Implements strict Content Security Policy (CSP), 
o-referrer policies, and contains zero inline scripts.
- **Beautiful UI:** Pixel-perfect dark theme, fully responsive, and highly accessible (WCAG 2.2 AA compliant).
- **Dual-Proxy Fallback:** Uses pi.allorigins.win as the primary resolver with an automatic fallback to corsproxy.io to ensure maximum reliability.

## 🚀 How to Run Locally

Because this is a completely static frontend app, you don't need Node.js, Python, or any complicated build tools!

1. Clone the repository:
   `bash
   git clone https://github.com/alvakry/url-xray.git
   `
2. Open the directory and double-click index.html in your favorite web browser.
3. *Done!*

## 🛠️ How it Works

When you input a shortened URL, the app sends a request through a CORS proxy. These proxies follow all HTTP 301/302 redirects and return the final destination URL. 

Because the request happens via the proxy API (and not via an iframe or direct navigation), malicious scripts or trackers at the destination cannot execute on your machine.

## 👤 Author

Open source & secured by [@alvakry](https://github.com/alvakry).

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
