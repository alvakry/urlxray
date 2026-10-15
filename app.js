const PROXY_SERVICES = [
    (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
];

function showState(stateId) {
    ['loadingState', 'successState', 'errorState'].forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove('visible');
        el.classList.add('hidden');
        el.style.display = '';
    });
    const target = document.getElementById(stateId);
    target.classList.remove('hidden');
    target.classList.add('visible');
    target.style.display = 'flex';
    const resultArea = document.getElementById('resultArea');
    resultArea.classList.remove('hidden');
}

function normalize(url) {
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    return url;
}

function getDomain(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
}

async function expandUrl(event) {
    event.preventDefault();
    const inputEl = document.getElementById('shortenedUrl');
    const btn = document.getElementById('xrayBtn');
    let rawUrl = inputEl.value.trim();
    if (!rawUrl) return;
    const url = normalize(rawUrl);
    showState('loadingState');
    btn.classList.add('loading');
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) });
        if (!res.ok) throw new Error(`Proxy responded with ${res.status}`);
        const data = await res.json();
        const finalUrl = (data.status && data.status.url) ? data.status.url : url;
        showSuccess(url, finalUrl);
    } catch (err) {
        try {
            const directRes = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, {
                method: 'HEAD',
                redirect: 'follow',
                signal: AbortSignal.timeout(10000),
            });
            const finalUrl = directRes.url ? decodeURIComponent(directRes.url.replace('https://corsproxy.io/?', '')) : url;
            showSuccess(url, finalUrl);
        } catch (err2) {
            showError(err2.message || 'Could not resolve the URL.');
        }
    } finally {
        btn.classList.remove('loading');
    }
}

function showSuccess(originalUrl, finalUrl) {
    const resultLink = document.getElementById('resultUrl');
    const openLink = document.getElementById('openLink');
    const redirectCount = document.getElementById('redirectCount');
    const finalDomain = document.getElementById('finalDomain');
    const changed = originalUrl !== finalUrl;
    resultLink.href = finalUrl;
    resultLink.textContent = finalUrl;
    openLink.href = finalUrl;
    redirectCount.textContent = changed ? '↪ Redirect detected' : '✓ No redirect';
    finalDomain.textContent = '🌐 ' + getDomain(finalUrl);
    showState('successState');
}

function showError(msg) {
    document.getElementById('errorMsg').textContent = msg;
    showState('errorState');
}

async function copyResult() {
    const url = document.getElementById('resultUrl').textContent;
    try {
        await navigator.clipboard.writeText(url);
        const btn = document.querySelector('.btn-copy');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span aria-hidden="true">✅</span> Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
    } catch {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('xrayForm');
    const copyBtn = document.querySelector('.btn-copy');
    if (form) form.addEventListener('submit', expandUrl);
    if (copyBtn) copyBtn.addEventListener('click', copyResult);
});
