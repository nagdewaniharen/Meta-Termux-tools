export function renderPrivacyContent(): string {
    return `
    <header class="article-header">
        <h1 class="article-title">Privacy Policy</h1>
        <p class="article-excerpt">Learn how Meta Termux collects, uses, and protects your personal information.</p>
    </header>

    <div class="legal-date">
        <p class="legal-date-text">Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="toc-card">
        <h2 class="toc-title">Table of Contents</h2>
        <ul class="toc-list">
            <li class="toc-item"><a href="#introduction" class="toc-link">1. Introduction</a></li>
            <li class="toc-item"><a href="#what-we-collect" class="toc-link">2. Information We Collect</a></li>
            <li class="toc-item"><a href="#how-we-use" class="toc-link">3. How We Use Your Information</a></li>
            <li class="toc-item"><a href="#sharing" class="toc-link">4. Information Sharing</a></li>
            <li class="toc-item"><a href="#security" class="toc-link">5. Data Security</a></li>
            <li class="toc-item"><a href="#your-rights" class="toc-link">6. Your Rights</a></li>
            <li class="toc-item"><a href="#contact" class="toc-link">7. Contact Us</a></li>
        </ul>
    </div>

    <div class="article-content">
        <section id="introduction">
            <h2 class="section-title">1. Introduction</h2>
            <div class="section-body">
                <p>Welcome to Meta Termux. We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our platform.</p>
            </div>
        </section>

        <section id="what-we-collect">
            <h2 class="section-title">2. Information We Collect</h2>
            <div class="section-body">
                <h3>Automatically Collected</h3>
                <ul>
                    <li>IP address and approximate location</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent</li>
                    <li>Referring website</li>
                </ul>
                <h3>Voluntarily Provided</h3>
                <ul>
                    <li>Email address (for account creation)</li>
                    <li>Contact form submissions</li>
                </ul>
            </div>
        </section>

        <section id="how-we-use">
            <h2 class="section-title">3. How We Use Your Information</h2>
            <div class="section-body">
                <ul>
                    <li>Providing and maintaining our services</li>
                    <li>Improving platform performance</li>
                    <li>Responding to inquiries</li>
                    <li>Analyzing usage patterns</li>
                    <li>Preventing fraud and abuse</li>
                </ul>
            </div>
        </section>

        <section id="sharing">
            <h2 class="section-title">4. Information Sharing</h2>
            <div class="section-body">
                <p>We do not sell your personal information. We may share data with service providers who assist in operating our platform, subject to confidentiality agreements.</p>
            </div>
        </section>

        <section id="security">
            <h2 class="section-title">5. Data Security</h2>
            <div class="section-body">
                <p>We implement industry-standard security measures including encryption in transit and at rest, access controls, and regular security audits.</p>
            </div>
        </section>

        <section id="your-rights">
            <h2 class="section-title">6. Your Rights</h2>
            <div class="section-body">
                <p>You have the right to access, correct, and delete your personal data. Contact us at hello@termuxtools.com to exercise these rights.</p>
            </div>
        </section>

        <section id="contact">
            <h2 class="section-title">7. Contact Us</h2>
            <div class="section-body">
                <p>If you have questions about this privacy policy, contact us at <strong>privacy@metatermux.com</strong>.</p>
            </div>
        </section>
    </div>
`
}
