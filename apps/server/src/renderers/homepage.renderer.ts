import { escapeHtml } from '@meta/shared'

// ── static articles (mirrors seed data) ────────────────────────
const ARTICLES = [
    { slug: 'mastering-termux-basics-2025', title: 'Mastering Termux: The Essential 2025 Guide', excerpt: 'A comprehensive walkthrough for setting up a powerful terminal environment on Android. Learn the core commands and configuration secrets.', category: 'Guide', date: 'Jan 15, 2025', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=140&fit=crop' },
    { slug: 'package-management-deep-dive', title: 'Deep Dive into Package Management', excerpt: 'Understand how apt, pkg, and repositories work together. Master version control and software installation workflows.', category: 'DevOps', date: 'Jan 18, 2025', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=140&fit=crop' },
    { slug: 'mobile-dev-environment-setup', title: 'Building a Full-Stack Dev Environment Mobile', excerpt: 'Turn your device into a coding powerhouse. Setup Node.js v20+, Python 3.12, and Neovim for professional development on the go.', category: 'Workflow', date: 'Jan 22, 2025', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&h=140&fit=crop' },
    { slug: 'deploying-web-services', title: 'Deploying Production Web Services from Termux', excerpt: 'Host real websites and APIs. Learn to configure Nginx, manageable firewalls, and port forwarding for external access.', category: 'Server', date: 'Jan 25, 2025', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=140&fit=crop' },
    { slug: 'secure-remote-access-ssh', title: 'Secure Remote Access with SSH Keys', excerpt: 'Ditch passwords. Set up robust SSH key authentication for seamless and secure remote connections to your servers.', category: 'Security', date: 'Jan 28, 2025', img: 'https://images.unsplash.com/photo-1488735945-968b89bd03ee?w=200&h=140&fit=crop' },
    { slug: 'sqlite-data-persistence', title: 'Data Persistence Strategies with SQLite', excerpt: 'Integrate lightweight SQL databases into your scripts. Perfect for local data storage and offline-first applications.', category: 'Data', date: 'Jan 30, 2025' },
    { slug: 'cron-automation-mastery', title: 'Automating Your Life with Cron Jobs', excerpt: 'Schedule backups, status checks, and custom scripts to run automatically in the background. Complete cron syntax guide.', category: 'Automation', date: 'Feb 02, 2025' },
    { slug: 'hardening-system-security', title: 'Hardening Your Android Shell Environment', excerpt: 'Essential security practices: managing permissions, isolating environments, and preventing unauthorized access.', category: 'Security', date: 'Feb 05, 2025' },
]

const featured = ARTICLES.slice(0, 5)
const recent = ARTICLES.slice(5, 8)

export async function renderHomepageContent(): Promise<string> {
    const articleCards = featured.map((a) =>
        `<a href="/${a.slug}" class="article-item">
        <img src="${a.img}" alt="${escapeHtml(a.title)}" class="article-image" loading="lazy">
        <div class="article-info">
            <span class="article-category">${escapeHtml(a.category)}</span>
            <h3 class="article-title">${escapeHtml(a.title)}</h3>
            <p class="article-excerpt">${escapeHtml(a.excerpt)}</p>
            <div class="article-meta">
                <span>Meta Termux</span>
                <span>${a.date}</span>
            </div>
        </div>
    </a>`
    ).join('\n')

    const recentItems = recent.map((a) =>
        `<div class="update-item">
        <div class="update-title">${escapeHtml(a.title)}</div>
        <div class="update-date">${a.date}</div>
    </div>`
    ).join('\n')

    return `
    <section class="hero-section">
        <div class="hero-content">
            <div class="hero-badge">Diverse Content &amp; Stories</div>
            <h1 class="hero-title">Discover Stories That Matter</h1>
            <p class="hero-subtitle">
                Explore a world of diverse content &mdash; from lifestyle and travel
                to technology, culture, and personal stories shared by our community.
            </p>
        </div>

        <div class="hero-search">
            <form class="hero-search-form" id="heroSearchForm">
                <input type="text" class="hero-search-input" id="heroSearchInput"
                       placeholder="Search stories, articles, topics..." required>
                <button type="submit" class="hero-search-btn" id="heroSearchBtn" disabled>Search</button>
            </form>
        </div>

        <div class="platform-stats">
            <div class="stat-item"><div class="stat-value">1000+</div><div class="stat-label">Stories</div></div>
            <div class="stat-item"><div class="stat-value">50K+</div><div class="stat-label">Readers</div></div>
            <div class="stat-item"><div class="stat-value">100+</div><div class="stat-label">Writers</div></div>
            <div class="stat-item"><div class="stat-value">25</div><div class="stat-label">Categories</div></div>
        </div>
    </section>

    <div class="ad-inline"></div>

    <div class="content-grid">
        <!-- main: article cards -->
        <main class="main-content">
            <div class="section-header">
                <h2 class="section-title">Latest Stories</h2>
                <p class="section-description">Fresh perspectives and engaging content from our community of writers.</p>
            </div>
            <div class="article-list">
                ${articleCards || '<p style="color:#737373;padding:40px 0;">No articles yet. Check back soon.</p>'}
            </div>
        </main>

        <!-- sidebar -->
        <aside class="sidebar">
            <div class="sidebar-section">
                <h3 class="sidebar-title">Recent Updates</h3>
                <div class="update-list">
                    ${recentItems || '<p style="color:#737373;font-size:0.875rem;">Nothing new yet.</p>'}
                </div>
            </div>

            <div class="sidebar-section">
                <h3 class="sidebar-title">Browse Topics</h3>
                <div class="topic-grid">
                    <a href="/topics/lifestyle"    class="topic-link">Lifestyle</a>
                    <a href="/topics/travel"       class="topic-link">Travel</a>
                    <a href="/topics/food"         class="topic-link">Food</a>
                    <a href="/topics/health"       class="topic-link">Health</a>
                    <a href="/topics/entertainment" class="topic-link">Entertainment</a>
                    <a href="/topics/culture"      class="topic-link">Culture</a>
                </div>
            </div>

            <div class="sidebar-section newsletter-cta">
                <h3 class="sidebar-title">Stay Updated</h3>
                <p class="newsletter-text">Get weekly insights delivered to your inbox.</p>
                <form class="newsletter-form" id="newsletterForm">
                    <input type="email" class="newsletter-input" placeholder="Enter your email" required>
                    <button type="submit" class="newsletter-button">Subscribe</button>
                </form>
            </div>
        </aside>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function () {
        var form  = document.getElementById('heroSearchForm');
        var input = document.getElementById('heroSearchInput');
        var btn   = document.getElementById('heroSearchBtn');
        if (form && input && btn) {
            input.addEventListener('input', function () {
                btn.disabled = this.value.trim().length < 2;
            });
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var q = input.value.trim();
                if (q.length >= 2) window.location.href = '/search?q=' + encodeURIComponent(q);
            });
        }
        var nlForm = document.getElementById('newsletterForm');
        if (nlForm) {
            nlForm.addEventListener('submit', function (e) {
                e.preventDefault();
                alert('Thank you for subscribing!');
                this.querySelector('.newsletter-input').value = '';
            });
        }
    });
    </script>
`
}
