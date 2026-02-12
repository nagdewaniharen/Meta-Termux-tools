import { marked } from 'marked'
import type { GeneratedLandingPage, LandingPageCreative } from '@/services/landing-page-ai.service'

// Configure marked
marked.setOptions({ gfm: true, breaks: true })

// ── helpers ───────────────────────────────────────────────────
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function markdownToHtml(md: string): string {
  return (marked.parse(md) as string).trim()
}

function renderCreative(creative: LandingPageCreative): string {
  if (creative.type === 'video') {
    return `<div class="lp-media lp-media--video">
      <video autoplay loop muted playsinline>
        <source src="${escapeHtml(creative.url)}" type="video/mp4">
      </video>
    </div>`
  }
  return `<div class="lp-media lp-media--image">
    <img src="${escapeHtml(creative.url)}" alt="${escapeHtml(creative.alt || '')}" loading="lazy" />
  </div>`
}

// ── CSS ───────────────────────────────────────────────────────
const LANDING_PAGE_CSS = `
/* ── Reset & Base ──────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #c9d1d9;
  background-color: #0d1117;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
a { color: #58a6ff; text-decoration: none; }
a:hover { text-decoration: underline; }

/* ── Hero ──────────────────────────────────────────────────── */
/* ── Hero (Background Style) ───────────────────────────────── */
.lp-hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #000;
  overflow: hidden;
  border-bottom: 1px solid #30363d;
}
.lp-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); /* Reduced opacity from 0.7 to 0.4 for visibility */
  z-index: 1;
}
.lp-hero__media {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.8; /* Increased image opacity from 0.5 to 0.8 */
}
.lp-hero__media .lp-media { width: 100%; height: 100%; }
.lp-hero__media img,
.lp-hero__media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.lp-hero__content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  padding: 40px 24px;
}
.lp-hero__headline {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 24px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5); /* Added shadow for readability */
}
.lp-hero__subheadline {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  color: #e6edf3; /* Lighter text for better contrast */
  font-weight: 400;
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

/* ── CTA Button ────────────────────────────────────────────── */
.lp-cta-btn {
  display: inline-block;
  padding: 16px 40px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}
.lp-cta-btn--primary {
  background-color: #238636;
  color: #fff;
}
.lp-cta-btn--primary:hover {
  background-color: #2ea043;
  text-decoration: none;
}
.lp-cta-btn--lg { padding: 20px 56px; font-size: 1.25rem; }

/* ── Related Searches (Arbitrage Style) ────────────────────── */
.lp-section--related {
  background: #0d1117;
  padding: 40px 20px;
  border-bottom: 1px solid #21262d;
}
.lp-related-heading {
  font-size: 1rem;
  color: #8b949e;
  margin-bottom: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.lp-related-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
}
.lp-related-item {
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, #1f6feb 0%, #1158c7 100%);
  color: #fff;
  padding: 16px 24px;
  border-radius: 4px; /* Slightly rounded, arbitrage style is often boxy but modern ones are rounded */
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #3e8bf3;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}
.lp-related-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  background: linear-gradient(180deg, #388bfd 0%, #1f6feb 100%);
}
.lp-related-icon { margin-right: 16px; font-size: 1.25rem; opacity: 0.9; }
.lp-related-text { flex: 1; font-weight: 700; font-size: 1.1rem; }
.lp-related-arrow { font-size: 1.5rem; opacity: 0.8; }

/* ── Sections ──────────────────────────────────────────────── */
.lp-main { }
.lp-section { padding: 60px 24px; }
.lp-section--light { background: #0d1117; } /* Dark theme override */
.lp-section--dark { background: #161b22; }
.lp-section--references { background: #0d1117; border-top: 1px solid #21262d; }
.lp-section--cta {
  background: #161b22;
  text-align: center;
  border-top: 1px solid #30363d;
}
.lp-section__inner {
  max-width: 800px;
  margin: 0 auto;
}
.lp-section__heading {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
}
.lp-section__content {
  font-size: 1.1rem;
  color: #c9d1d9;
  line-height: 1.8;
}
.lp-section__content p { margin-bottom: 20px; }
.lp-section__content ul,
.lp-section__content ol { margin: 24px 0; padding-left: 24px; }
.lp-section__content li { margin-bottom: 12px; }
.lp-section__content strong { color: #fff; font-weight: 600; }
.lp-section__content h3 { color: #f0f6fc; margin: 32px 0 16px; font-size: 1.5rem; }

/* ── References ────────────────────────────────────────────── */
.lp-references-list {
  list-style: none;
  padding: 0;
}
.lp-references-list li { margin-bottom: 16px; }
.lp-reference-link {
  display: block;
  font-weight: 600;
  font-size: 1.1rem;
  color: #58a6ff;
}
.lp-reference-url {
  display: block;
  font-size: 0.875rem;
  color: #8b949e;
  font-weight: 400;
  margin-top: 4px;
}

/* ── Gallery ───────────────────────────────────────────────── */
.lp-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
.lp-media--image img {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #30363d;
}
.lp-media--video video {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #30363d;
}

/* ── Footer ────────────────────────────────────────────────── */
.lp-footer {
  padding: 40px 24px;
  text-align: center;
  background: #010409;
  color: #8b949e;
  font-size: 0.875rem;
  border-top: 1px solid #30363d;
}

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 768px) {
  .lp-hero { min-height: 50vh; }
  .lp-section { padding: 40px 16px; }
}

/* ── Animations ────────────────────────────────────────────── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.lp-hero__content { animation: fadeInUp 0.8s ease-out; }
.lp-section__inner { animation: fadeInUp 0.6s ease-out; }
`

// ── main renderer ─────────────────────────────────────────────
export function renderLandingPage(
  data: GeneratedLandingPage,
  creatives: LandingPageCreative[]
): string {
  // ── TEMPLATE ROUTING ────────────────────────────────────────
  if (data.template === 'article') {
    return renderArticleTemplate(data, creatives)
  }

  // ── STANDARD LANDING PAGE RENDERER ──────────────────────────
  const heroCreative = creatives.length > 0 ? renderCreative(creatives[0]) : ''
  const additionalCreatives = creatives.slice(1).map(renderCreative).join('\n')

  const sectionsHtml = data.sections
    .sort((a, b) => a.order - b.order)
    .map((section, idx) => {
      const contentHtml = markdownToHtml(section.content)
      const isEven = idx % 2 === 0
      return `
      <section class="lp-section ${isEven ? 'lp-section--light' : 'lp-section--dark'}" id="${escapeHtml(section.id)}">
        <div class="lp-section__inner">
          <h2 class="lp-section__heading">${escapeHtml(section.heading)}</h2>
          <div class="lp-section__content">${contentHtml}</div>
        </div>
      </section>`
    })
    .join('\n')

  // Related searches removed for ad compliance
  const relatedSearchesHtml = ''

  const referencesHtml = data.references && data.references.length > 0
    ? `
    <section class="lp-section lp-section--references">
      <div class="lp-section__inner">
        <h3 class="lp-section__heading">References</h3>
        <ul class="lp-references-list">
          ${data.references.map(ref => `
            <li>
              <a href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer" class="lp-reference-link">
                ${escapeHtml(ref.title)}
                <span class="lp-reference-url">${escapeHtml(ref.url)}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    </section>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.headline)}</title>
  <meta name="description" content="${escapeHtml(data.meta_description)}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${escapeHtml(data.headline)}">
  <meta property="og:description" content="${escapeHtml(data.meta_description)}">
  ${creatives.length > 0 && creatives[0].type === 'image' ? `<meta property="og:image" content="${escapeHtml(creatives[0].url)}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    ${LANDING_PAGE_CSS}
  </style>
</head>
<body>
  <!-- Hero (Background Image with Reduced Overlay) -->
  <header class="lp-hero">
    <div class="lp-hero__overlay"></div>
    ${heroCreative ? `<div class="lp-hero__media">${heroCreative}</div>` : ''}
    <div class="lp-hero__content">
      <h1 class="lp-hero__headline">${escapeHtml(data.headline)}</h1>
      <p class="lp-hero__subheadline">${escapeHtml(data.subheadline)}</p>
      <a href="#cta-section" class="lp-cta-btn lp-cta-btn--primary">${escapeHtml(data.cta_text)}</a>
    </div>
  </header>

  <!-- Content -->
  <main class="lp-main">
    ${relatedSearchesHtml}
    
    ${sectionsHtml}

    ${additionalCreatives ? `
    <section class="lp-section lp-section--gallery">
      <div class="lp-section__inner">
        <div class="lp-gallery">${additionalCreatives}</div>
      </div>
    </section>` : ''}

    ${referencesHtml}
  </main>

  <!-- Footer -->
  <footer class="lp-footer">
    <p>&copy; ${new Date().getFullYear()} Meta Termux. All rights reserved.</p>
  </footer>
</body>
</html>`
}

// ── ARTICLE RENDERER ──────────────────────────────────────────
function renderArticleTemplate(
  data: GeneratedLandingPage,
  creatives: LandingPageCreative[]
): string {
  const heroCreative = creatives.length > 0 ? renderCreative(creatives[0]) : ''
  const contentHtml = data.sections
    .sort((a, b) => a.order - b.order)
    .map(section => `
            <div class="lp-article-section" id="${escapeHtml(section.id)}">
                <h2>${escapeHtml(section.heading)}</h2>
                ${markdownToHtml(section.content)}
            </div>
        `)
    .join('\n')

  const referencesHtml = data.references?.length ? `
        <div class="lp-article-references">
            <h3>Sources</h3>
            <ul>
                ${data.references.map(ref => `<li><a href="${escapeHtml(ref.url)}" target="_blank" rel="nofollow">${escapeHtml(ref.title)}</a></li>`).join('')}
            </ul>
        </div>
    ` : ''

  const relatedSearchesHtml = data.related_searches && data.related_searches.length > 0 ? `
        <div class="lp-article-related">
            <h3>Related Topics</h3>
            <div class="lp-article-tags">
                ${data.related_searches.map(term => `<span class="lp-tag">${escapeHtml(term)}</span>`).join('')}
            </div>
        </div>
    ` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(data.headline)}</title>
    <meta name="description" content="${escapeHtml(data.meta_description)}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        ${LANDING_PAGE_CSS}
        
        /* Article specific overrides */
        body { background-color: #ffffff; color: #1a1a1a; font-family: 'Merriweather', serif; }
        h1, h2, h3, h4 { font-family: 'Inter', sans-serif; color: #111; }
        a { color: #0969da; text-decoration: underline; }
        
        .lp-article-container { max-width: 740px; margin: 0 auto; padding: 0 24px; }
        
        .lp-article-header { padding: 60px 0 40px; text-align: center; border-bottom: 1px solid #eaeaea; margin-bottom: 40px; }
        .lp-article-title { font-size: clamp(2rem, 4vw, 3rem); line-height: 1.1; margin-bottom: 16px; font-weight: 800; letter-spacing: -0.02em; }
        .lp-article-subtitle { font-size: 1.25rem; color: #555; line-height: 1.6; font-family: 'Inter', sans-serif; font-weight: 400; }
        .lp-article-meta { margin-top: 24px; font-size: 0.875rem; color: #666; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .lp-article-hero { margin: 0 0 40px; border-radius: 8px; overflow: hidden; }
        .lp-article-hero img { width: 100%; height: auto; display: block; }
        
        .lp-article-body { font-size: 1.125rem; line-height: 1.8; }
        .lp-article-body p { margin-bottom: 24px; }
        .lp-article-body h2 { font-size: 1.75rem; margin-top: 48px; margin-bottom: 20px; font-weight: 700; }
        .lp-article-body ul, .lp-article-body ol { margin-bottom: 24px; padding-left: 20px; }
        .lp-article-body li { margin-bottom: 10px; }
        
        .lp-article-references { margin-top: 60px; padding-top: 40px; border-top: 1px solid #eaeaea; font-family: 'Inter', sans-serif; }
        .lp-article-references h3 { font-size: 1.25rem; margin-bottom: 16px; }
        .lp-article-references ul { list-style: none; padding: 0; }
        .lp-article-references li { margin-bottom: 8px; font-size: 0.9rem; }
        
        .lp-article-related { margin-top: 40px; padding: 30px; background: #f6f8fa; border-radius: 8px; font-family: 'Inter', sans-serif; }
        .lp-article-related h3 { font-size: 1.25rem; text-transform: uppercase; color: #555; margin-bottom: 16px; }
        .lp-article-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .lp-tag { background: #fff; padding: 6px 12px; border: 1px solid #d0d7de; border-radius: 20px; font-size: 0.875rem; color: #0969da; font-weight: 500; }
        
        .lp-footer-article { margin-top: 80px; padding: 40px 0; text-align: center; color: #666; font-family: 'Inter', sans-serif; font-size: 0.875rem; border-top: 1px solid #eaeaea; }
    </style>
</head>
<body>
    <article class="lp-article-container">
        <header class="lp-article-header">
            <h1 class="lp-article-title">${escapeHtml(data.headline)}</h1>
            <p class="lp-article-subtitle">${escapeHtml(data.subheadline)}</p>
            <div class="lp-article-meta">Published by Meta Termux</div>
        </header>

        ${heroCreative ? `<div class="lp-article-hero">${heroCreative}</div>` : ''}

        <div class="lp-article-body">
            ${contentHtml}
        </div>

        ${referencesHtml}
        
        ${relatedSearchesHtml}
    </article>

    <footer class="lp-footer-article">
        <p>&copy; ${new Date().getFullYear()} Meta Termux. All rights reserved.</p>
    </footer>
</body>
</html>`
}
