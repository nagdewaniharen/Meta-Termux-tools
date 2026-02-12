export function renderContactContent(): string {
    return `
    <header class="article-header">
        <h1 class="article-title">Contact Us</h1>
        <p class="article-excerpt">Have a question or want to work together? We would love to hear from you.</p>
    </header>

    <div class="contact-grid">
        <div>
            <div class="article-content" style="margin: 0;">
                <div class="contact-form-group">
                    <label class="contact-label">Name</label>
                    <input type="text" class="contact-input" placeholder="Your name">
                </div>
                <div class="contact-form-group">
                    <label class="contact-label">Email</label>
                    <input type="email" class="contact-input" placeholder="your@email.com">
                </div>
                <div class="contact-form-group">
                    <label class="contact-label">Subject</label>
                    <input type="text" class="contact-input" placeholder="How can we help?">
                </div>
                <div class="contact-form-group">
                    <label class="contact-label">Message</label>
                    <textarea class="contact-textarea" placeholder="Tell us more..."></textarea>
                </div>
                <button class="contact-btn" onclick="alert('Thank you for your message!')">Send Message</button>
            </div>
        </div>

        <div>
            <div class="article-content" style="margin: 0;">
                <h3 class="section-title" style="margin-bottom: 32px;">Get in Touch</h3>
                <div class="contact-info-item">
                    <div class="contact-info-icon">@</div>
                    <div>
                        <div class="contact-info-title">Email</div>
                        <div class="contact-info-text">hello@metatermux.com</div>
                    </div>
                </div>
                <div class="contact-info-item">
                    <div class="contact-info-icon">+</div>
                    <div>
                        <div class="contact-info-title">Phone</div>
                        <div class="contact-info-text">+1 (555) 123-4567</div>
                    </div>
                </div>
                <div class="contact-info-item">
                    <div class="contact-info-icon">.</div>
                    <div>
                        <div class="contact-info-title">Office</div>
                        <div class="contact-info-text">San Francisco, CA</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`
}
