export function renderFooter(): string {
    return `<footer class="site-footer">
    <div class="footer-content">
        <div class="footer-grid">
            <div class="footer-section">
                <div class="footer-brand-logo">
                    <div class="logo-icon">M</div>
                    <span>Meta Termux</span>
                </div>
                <p class="footer-brand-text">
                    Empowering developers with tools, scripts, and knowledge to build the future of open source.
                </p>
            </div>
            <div class="footer-section">
                <h3>Discover</h3>
                <ul>
                    <li><a href="/articles">All Scripts</a></li>
                    <li><a href="/articles">Featured Tools</a></li>
                    <li><a href="/articles">Weekly Picks</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Categories</h3>
                <ul>
                    <li><a href="/topics/security">Security</a></li>
                    <li><a href="/topics/automation">Automation</a></li>
                    <li><a href="/topics/development">Development</a></li>
                    <li><a href="/topics/networking">Networking</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Company</h3>
                <ul>
                    <li><a href="/about">About Meta Termux</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Meta Termux. All rights reserved.</p>
        </div>
    </div>
</footer>`
}
