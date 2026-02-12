export function renderTermsContent(): string {
    return `
    <header class="article-header">
        <h1 class="article-title">Terms of Use</h1>
        <p class="article-excerpt">Please read these terms before using Meta Termux.</p>
    </header>

    <div class="legal-date">
        <p class="legal-date-text">Effective: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="toc-card">
        <h2 class="toc-title">Table of Contents</h2>
        <ul class="toc-list">
            <li class="toc-item"><a href="#acceptance" class="toc-link">1. Acceptance of Terms</a></li>
            <li class="toc-item"><a href="#services" class="toc-link">2. Description of Services</a></li>
            <li class="toc-item"><a href="#accounts" class="toc-link">3. User Accounts</a></li>
            <li class="toc-item"><a href="#acceptable" class="toc-link">4. Acceptable Use</a></li>
            <li class="toc-item"><a href="#intellectual" class="toc-link">5. Intellectual Property</a></li>
            <li class="toc-item"><a href="#liability" class="toc-link">6. Limitation of Liability</a></li>
            <li class="toc-item"><a href="#termination" class="toc-link">7. Termination</a></li>
        </ul>
    </div>

    <div class="article-content">
        <section id="acceptance">
            <h2 class="section-title">1. Acceptance of Terms</h2>
            <div class="section-body">
                <p>By using Meta Termux, you agree to be bound by these terms. If you do not agree, please do not use our services.</p>
            </div>
        </section>

        <section id="services">
            <h2 class="section-title">2. Description of Services</h2>
            <div class="section-body">
                <p>Meta Termux provides a script management and campaign deployment platform. Services include script creation, campaign targeting, preview, publish, and analytics.</p>
            </div>
        </section>

        <section id="accounts">
            <h2 class="section-title">3. User Accounts</h2>
            <div class="section-body">
                <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
            </div>
        </section>

        <section id="acceptable">
            <h2 class="section-title">4. Acceptable Use</h2>
            <div class="section-body">
                <p>You must not use Meta Termux to deploy malicious scripts, engage in fraud, violate laws, or interfere with other users.</p>
            </div>
        </section>

        <section id="intellectual">
            <h2 class="section-title">5. Intellectual Property</h2>
            <div class="section-body">
                <p>The Meta Termux platform, branding, and documentation are our intellectual property. Scripts you create remain your property.</p>
            </div>
        </section>

        <section id="liability">
            <h2 class="section-title">6. Limitation of Liability</h2>
            <div class="section-body">
                <p>Meta Termux is provided on an "as is" basis. We are not liable for indirect, incidental, or consequential damages arising from your use of the platform.</p>
            </div>
        </section>

        <section id="termination">
            <h2 class="section-title">7. Termination</h2>
            <div class="section-body">
                <p>We reserve the right to suspend or terminate accounts that violate these terms. You may terminate your account at any time by contacting us.</p>
            </div>
        </section>
    </div>
`
}
