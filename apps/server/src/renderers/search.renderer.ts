/**
 * Search page — fullPage mode.
 * Returns COMPLETE HTML.  Ad/tracking scripts (Anura, CSA, Taboola, ClickFlare)
 * are NOT hardcoded here.  They live in the `scripts` DB table and get injected
 * at render time by injectScriptsIntoHtml via the Script system.
 *
 * This file owns: page chrome, search form, results UI, search JS.
 */
export function renderSearchContent(): string {
    return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="#0a0a0a">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></noscript>

    <title>Search - Meta Search Termux</title>
    <meta name="description" content="Search our comprehensive library of diverse articles, stories, and insights.">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="Search - Search Termux">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary">

    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        html { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
        body { background:#0a0a0a; color:#e5e5e5; line-height:1.6; min-height:100vh; display:flex; flex-direction:column; }

        /* header */
        .header { background:rgba(10,10,10,0.95); backdrop-filter:blur(10px); border-bottom:1px solid #262626; position:sticky; top:0; z-index:50; }
        .header-content { max-width:1200px; margin:0 auto; padding:12px 16px; }
        .logo { display:flex; align-items:center; gap:8px; text-decoration:none; color:#e5e5e5; font-weight:600; }
        .logo-icon { width:24px; height:24px; background:linear-gradient(135deg,#0668E1,#0084ff); border-radius:4px; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:12px; }

        /* search form */
        .search-form { display:flex; gap:6px; flex:1; max-width:600px; }
        .s-input { flex:1; padding:8px 12px; background:#1a1a1a; border:1px solid #374151; border-radius:4px; color:#e5e5e5; font-size:14px; outline:none; transition:border-color 0.2s; min-width:0; }
        .s-input:focus { border-color:#0668E1; }
        .s-input::placeholder { color:#6b7280; }
        .s-btn { padding:8px 16px; background:#0668E1; color:white; border:none; border-radius:4px; font-size:14px; font-weight:500; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:background-color 0.2s; }
        .s-btn:hover { background:#005bb5; }
        .s-btn:disabled { background:#374151; cursor:not-allowed; opacity:0.7; }

        /* main */
        .main { flex:1; max-width:1200px; margin:0 auto; padding:16px; width:100%; }
        #afsresults { width:100%; height:auto; margin-bottom:24px; }

        /* results */
        .results-section { margin-bottom:32px; }
        .results-info { margin-bottom:16px; padding-bottom:8px; border-bottom:1px solid #262626; color:#6b7280; font-size:13px; }
        .state { display:none; text-align:center; padding:32px 16px; }
        .state.active { display:block; }
        .spinner { width:20px; height:20px; border:2px solid #262626; border-top:2px solid #0668E1; border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 8px; }
        .err-icon { width:32px; height:32px; background:#dc2626; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; color:white; font-size:16px; }
        .empty-icon { width:32px; height:32px; background:#262626; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; color:#6b7280; font-size:16px; }
        .result { margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid #1a1a1a; animation:fadeIn 0.3s ease-out; }
        .result:last-child { border-bottom:none; margin-bottom:0; }
        .result-title { font-size:16px; font-weight:600; margin-bottom:4px; line-height:1.3; }
        .result-title a { color:#0668E1; text-decoration:none; }
        .result-title a:hover { text-decoration:underline; }
        .result-url { font-size:12px; color:#10b981; margin-bottom:4px; }
        .result-desc { font-size:13px; color:#a3a3a3; line-height:1.58; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

        /* footer */
        .footer { background:#111111; border-top:1px solid #262626; margin-top:auto; }
        .footer-content { max-width:1200px; margin:0 auto; padding:12px 16px; text-align:center; }
        .footer-links { display:flex; justify-content:center; gap:12px; margin-bottom:6px; flex-wrap:wrap; }
        .footer-links a { color:#a3a3a3; text-decoration:none; font-size:12px; transition:color 0.2s; }
        .footer-links a:hover { color:#e5e5e5; }
        .footer-text { color:#6b7280; font-size:11px; }

        /* responsive */
        @media (max-width:768px) {
            .header-content { display:flex; flex-direction:column; gap:12px; align-items:center; }
            .search-form { width:100%; max-width:400px; }
            .main { padding:12px; }
        }
        @media (min-width:769px) {
            .header-content { display:flex; align-items:center; gap:24px; }
            .search-form { margin-left:auto; }
        }

        @keyframes spin   { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <a href="/" class="logo">
                <div class="logo-icon">M</div>
                <span>Meta Termux</span>
            </a>
            <form class="search-form" id="searchForm">
                <input type="text" class="s-input" id="searchInput" placeholder="Search articles, tutorials..." autocomplete="off">
                <button type="submit" class="s-btn" id="searchBtn">Search</button>
            </form>
        </div>
    </header>

    <main class="main">
        <!-- CSA ads render into this container after script fires -->
        <div id="afsresults"></div>

        <section class="results-section">
            <div class="state" id="loadingState">
                <div class="spinner"></div>
                <div>Searching...</div>
            </div>
            <div class="state" id="errorState">
                <div class="err-icon">!</div>
                <div style="color:#dc2626;font-weight:500;margin-bottom:4px;">Search Error</div>
                <div class="error-message">Please try again</div>
            </div>
            <div class="state" id="emptyState">
                <div class="empty-icon">&#128269;</div>
                <div style="font-weight:500;margin-bottom:4px;">No results found</div>
                <div style="color:#6b7280;">Try different keywords</div>
            </div>
            <div id="resultsContainer" style="display:none;">
                <div class="results-info" id="resultsInfo"></div>
                <div id="resultsList"></div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <div class="footer-links">
                <a href="/">Home</a>
                <a href="/articles">Articles</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a href="/privacy">Privacy</a>
            </div>
            <div class="footer-text">&copy; ${new Date().getFullYear()} Meta Termux. All rights reserved.</div>
        </div>
    </footer>

    <!-- search logic only — ad scripts come from DB injection -->
    <script>
    (function () {
        var API = 'https://api.termuxtools.com';
        var form  = document.getElementById('searchForm');
        var input = document.getElementById('searchInput');
        var btn   = document.getElementById('searchBtn');
        var loading = document.getElementById('loadingState');
        var error   = document.getElementById('errorState');
        var empty   = document.getElementById('emptyState');
        var container = document.getElementById('resultsContainer');
        var info    = document.getElementById('resultsInfo');
        var list    = document.getElementById('resultsList');
        var busy    = false;

        function init() {
            var q = new URLSearchParams(window.location.search).get('q') || '';
            if (q) { input.value = q; search(q); }
            form.addEventListener('submit', submit);
            input.focus();
        }

        function submit(e) {
            e.preventDefault();
            var q = input.value.trim();
            if (q.length < 2) { showErr('Enter at least 2 characters'); return; }
            window.history.pushState({}, '', location.pathname + '?q=' + encodeURIComponent(q));
            search(q);
        }

        async function search(q) {
            if (busy) return;
            busy = true; hideAll();
            loading.classList.add('active');
            btn.disabled = true; btn.textContent = 'Searching...';
            try {
                var r = await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({query:q, options:{limit:10}}) });
                if (!r.ok) throw new Error();
                render(await r.json());
            } catch { showErr('Search temporarily unavailable'); }
            finally { busy = false; btn.disabled = false; btn.textContent = 'Search'; }
        }

        function render(data) {
            hideAll();
            var results = data.results || [];
            if (!results.length) { empty.classList.add('active'); return; }
            info.textContent = 'About ' + (data.totalResults || results.length).toLocaleString() + ' results' + (data.processingTime ? ' (' + data.processingTime + ')' : '');
            list.innerHTML = results.map(function(r, i) {
                return '<div class="result" style="animation-delay:' + (i*30) + 'ms">' +
                    '<div class="result-title"><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.title||'Untitled') + '</a></div>' +
                    '<div class="result-url">' + esc(domain(r.url)) + '</div>' +
                    '<div class="result-desc">' + esc(trunc(r.snippet||r.description||'',160)) + '</div></div>';
            }).join('');
            container.style.display = 'block';
        }

        function showErr(msg) { hideAll(); error.classList.add('active'); error.querySelector('.error-message').textContent = msg; }
        function hideAll() { [loading,error,empty].forEach(function(e){e.classList.remove('active');}); container.style.display='none'; }
        function esc(t) { var d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
        function domain(u) { try{return new URL(u).hostname;}catch{return u;} }
        function trunc(t,n) { t=(t||'').trim(); if(t.length<=n)return t; var c=t.substring(0,n),s=c.lastIndexOf(' '); return (s>0?c.substring(0,s):c)+'...'; }

        document.addEventListener('DOMContentLoaded', init);
    })();
    </script>

    <script type="application/ld+json">{"@context":"https://schema.org","@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://search.termuxtools.com/search?q={search_term_string}"},"query-input":"required name=search_term_string"}</script>
</body>
</html>`
}
