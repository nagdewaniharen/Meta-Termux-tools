export function renderHeader(): string {
    return `<header class="site-header">
    <div class="header-content">
        <a href="/" class="site-logo">
            <div class="logo-icon">M</div>
            <span>Meta Termux</span>
        </a>
        <nav class="header-nav">
            <a href="/" class="nav-link">Home</a>
            <a href="/articles" class="nav-link">Articles</a>
            <a href="/about" class="nav-link">About</a>
            <a href="/contact" class="nav-link">Contact</a>
        </nav>
    </div>
</header>`
}
