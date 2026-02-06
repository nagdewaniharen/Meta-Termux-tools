export const BASE_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; font-display: swap; overflow-x: hidden; }
  body { background: #0a0a0a; color: #e5e5e5; line-height: 1.6; overflow-x: hidden; }

  /* ── Meta Branding Colors ── */
  :root {
    --meta-blue: #0668E1;
    --meta-blue-hover: #005bb5;
    --meta-gradient: linear-gradient(135deg, #0668E1, #0084ff);
    --surface-1: #111111;
    --surface-2: #1c1c1c;
    --border: #262626;
  }

  .site-header { position: sticky; top: 0; z-index: 50; background: rgba(10,10,10,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }
  .header-content { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 60px; }
  
  /* Logo: Meta Infinity-like style */
  .site-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; color: #e5e5e5; font-weight: 600; font-size: 18px; letter-spacing: -0.5px; }
  .logo-icon { width: 32px; height: 32px; background: var(--meta-gradient); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px; box-shadow: 0 0 15px rgba(6, 104, 225, 0.3); }
  
  .header-nav { display: flex; gap: 32px; }
  .nav-link { color: #a3a3a3; text-decoration: none; font-weight: 500; font-size: 14px; transition: color 0.2s; }
  .nav-link:hover, .nav-link.active { color: #fff; }

  .page-container { min-height: calc(100vh - 60px); padding-bottom: 120px; }
  .content-wrapper { max-width: 1000px; margin: 0 auto; padding: 0 24px; }

  .article-header { padding: 48px 0 32px; text-align: center; }
  .article-title { font-size: 2.5rem; font-weight: 700; color: #fff; line-height: 1.2; margin-bottom: 16px; letter-spacing: -1px; }
  .article-excerpt { font-size: 1.125rem; color: #a3a3a3; line-height: 1.6; }

  .article-content { background: var(--surface-1); border-radius: 16px; padding: 48px; margin: 48px 0; border: 1px solid var(--border); }
  .section-title { font-size: 1.75rem; font-weight: 600; color: #fff; margin-bottom: 24px; line-height: 1.3; }
  .section-body { font-size: 1.125rem; line-height: 1.7; color: #d1d5db; margin-bottom: 40px; }
  .section-body:last-child { margin-bottom: 0; }
  .section-body p { margin-bottom: 20px; }
  .section-body h3 { font-size: 1.25rem; font-weight: 600; color: #fff; margin: 24px 0 12px; }
  .section-body ul, .section-body ol { margin: 16px 0; padding-left: 24px; }
  .section-body li { margin-bottom: 8px; }
  .section-body a { color: var(--meta-blue); text-decoration: none; }
  .section-body a:hover { text-decoration: underline; }
  .section-body strong { color: #fff; font-weight: 600; }

  .toc-card { background: var(--surface-2); border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid var(--border); }
  .toc-title { font-size: 1.25rem; font-weight: 600; color: #fff; margin-bottom: 16px; }
  .toc-list { list-style: none; padding: 0; }
  .toc-item { margin-bottom: 8px; }
  .toc-link { color: var(--meta-blue); text-decoration: none; font-size: 0.875rem; }
  .toc-link:hover { text-decoration: underline; }

  .legal-date { background: var(--surface-2); border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid var(--meta-blue); }
  .legal-date-text { color: #a3a3a3; font-size: 0.875rem; font-style: italic; }

  .site-footer { background: #000; border-top: 1px solid var(--border); padding: 80px 0 40px; margin-top: 80px; }
  .footer-content { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
  .footer-section h3 { color: #fff; font-weight: 600; margin-bottom: 24px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
  .footer-section ul { list-style: none; }
  .footer-section li { margin-bottom: 14px; }
  .footer-section a { color: #888; text-decoration: none; font-size: 14px; transition: color 0.2s; }
  .footer-section a:hover { color: #fff; }
  .footer-brand-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .footer-brand-text { color: #888; font-size: 14px; line-height: 1.6; max-width: 300px; }
  .footer-bottom { padding-top: 32px; border-top: 1px solid var(--border); text-align: center; color: #555; font-size: 13px; }

  .hero-section { padding: 100px 0 80px; text-align: center; }
  .hero-title { font-size: 4rem; font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 24px; letter-spacing: -2px; }
  .hero-subtitle { font-size: 1.25rem; color: #888; max-width: 600px; margin: 0 auto 48px; line-height: 1.6; }
  .hero-title span { background: var(--meta-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 60px 0; }
  .stat-card { background: var(--surface-1); border-radius: 16px; padding: 32px; text-align: center; border: 1px solid var(--border); }
  .stat-value { font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .stat-label { color: #888; font-size: 0.95rem; }
  
  .featured-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 40px 0; }
  .featured-card { background: var(--surface-1); border-radius: 16px; padding: 28px; border: 1px solid var(--border); transition: all 0.2s; }
  .featured-card:hover { border-color: var(--meta-blue); box-shadow: 0 0 0 1px var(--meta-blue); }
  .featured-card-title { font-size: 1.125rem; font-weight: 600; color: #fff; margin-bottom: 10px; }
  .featured-card-text { color: #a3a3a3; font-size: 0.9rem; line-height: 1.5; }
  .section-heading { font-size: 2rem; font-weight: 700; color: #fff; text-align: center; margin-bottom: 16px; letter-spacing: -0.5px; }
  .section-subheading { color: #888; text-align: center; margin-bottom: 40px; font-size: 1.05rem; }

  /* ── homepage: hero search ─────────────────────────── */
  .hero-badge { display: inline-block; background: rgba(6, 104, 225, 0.1); border: 1px solid rgba(6, 104, 225, 0.3); border-radius: 24px; padding: 8px 20px; margin-bottom: 32px; font-size: 14px; color: #fff; font-weight: 500; }
  .hero-search { max-width: 640px; margin: 0 auto 60px; }
  .hero-search-form { display: flex; gap: 12px; }
  .hero-search-input { flex: 1; padding: 18px 24px; background: var(--surface-1); border: 2px solid var(--border); border-radius: 14px; color: #fff; font-size: 16px; outline: none; transition: all 0.3s; min-width: 0; }
  .hero-search-input:focus { border-color: var(--meta-blue); box-shadow: 0 0 0 4px rgba(6, 104, 225, 0.15); }
  .hero-search-input::placeholder { color: #555; }
  .hero-search-btn { padding: 18px 32px; background: var(--meta-blue); color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; white-space: nowrap; flex-shrink: 0; }
  .hero-search-btn:hover { background: var(--meta-blue-hover); transform: translateY(-1px); }
  .hero-search-btn:disabled { background: var(--surface-2); cursor: not-allowed; opacity: 0.7; transform: none; }

  /* ── homepage: platform stats ──────────────────────── */
  .platform-stats { display: flex; justify-content: center; gap: 48px; margin-bottom: 80px; }
  .stat-item { text-align: center; }
  .stat-item .stat-value { font-size: 2.25rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .stat-item .stat-label { font-size: 0.875rem; color: #737373; font-weight: 500; }

  /* ── homepage: content grid ────────────────────────── */
  .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 60px; margin-bottom: 80px; }
  .section-header .section-title { font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .article-item { display: flex; gap: 24px; padding: 24px; background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; transition: all 0.3s; text-decoration: none; color: inherit; }
  .article-item:hover { border-color: var(--meta-blue); background: var(--surface-2); }
  .article-image { width: 160px; height: 110px; object-fit: cover; border-radius: 10px; flex-shrink: 0; }
  .article-info { flex: 1; min-width: 0; }
  .article-category { display: inline-block; background: rgba(6, 104, 225, 0.15); color: #60a5fa; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-bottom: 12px; }
  .article-item .article-title { font-size: 1.2rem; font-weight: 600; color: #fff; margin-bottom: 8px; line-height: 1.4; }
  .article-excerpt { color: #888; font-size: 0.95rem; line-height: 1.6; margin-bottom: 12px; }
  .article-meta { display: flex; gap: 16px; color: #666; font-size: 0.8rem; }
  .ad-inline { margin: 48px 0; padding: 32px; background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; text-align: center; min-height: 120px; display: flex; align-items: center; justify-content: center; }

  /* ── homepage: sidebar ─────────────────────────────── */
  .sidebar-section { background: var(--surface-1); border: 1px solid var(--border); border-radius: 16px; padding: 32px; margin-bottom: 32px; }
  .sidebar-title { font-size: 1.1rem; font-weight: 600; color: #fff; margin-bottom: 24px; letter-spacing: -0.3px; }
  .update-item { padding-bottom: 16px; border-bottom: 1px solid var(--border); }
  .update-title { font-size: 0.9rem; font-weight: 600; color: #e5e5e5; margin-bottom: 6px; line-height: 1.4; }
  .topic-link { display: block; padding: 12px 16px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; text-decoration: none; color: #a3a3a3; font-size: 0.9rem; font-weight: 500; text-align: center; transition: all 0.2s; }
  .topic-link:hover { border-color: var(--meta-blue); color: #fff; background: rgba(6, 104, 225, 0.05); }
  .newsletter-cta { background: linear-gradient(135deg, #111, #161616) !important; border: 1px solid var(--border) !important; }
  .newsletter-input { padding: 14px 16px; background: #000; border: 1px solid var(--border); border-radius: 10px; color: #fff; font-size: 14px; outline: none; }
  .newsletter-input:focus { border-color: var(--meta-blue); }
  .newsletter-button { padding: 14px 16px; background: var(--meta-blue); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 14px; }
  .newsletter-button:hover { background: var(--meta-blue-hover); }

  /* ── responsive overrides ──────────────────────────── */
  @media (max-width: 1024px) {
    .content-grid { grid-template-columns: 1fr; gap: 40px; }
    .platform-stats { gap: 32px; }
    .about-values, .team-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin: 48px 0; }
  .contact-input, .contact-textarea { width: 100%; padding: 16px; background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; color: #fff; font-size: 1rem; outline: none; font-family: inherit; transition: border-color 0.2s; }
  .contact-input:focus, .contact-textarea:focus { border-color: var(--meta-blue); }
  .contact-btn { width: 100%; padding: 16px; background: var(--meta-blue); border: none; border-radius: 12px; color: white; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .contact-btn:hover { background: var(--meta-blue-hover); }
  
  .about-mission { background: var(--surface-1); border-radius: 20px; padding: 60px; margin: 60px 0; border: 1px solid var(--border); text-align: center;}
  .about-values { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin: 48px 0; }
  .value-card { background: var(--surface-1); border-radius: 16px; padding: 40px 32px; border: 1px solid var(--border); text-align: center; }
  .value-icon { font-size: 2.5rem; margin-bottom: 20px; display: inline-block; background: rgba(6, 104, 225, 0.1); width: 80px; height: 80px; line-height: 80px; border-radius: 24px; color: var(--meta-blue); }
  .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin: 40px 0; }
  .team-card { background: var(--surface-1); border-radius: 16px; padding: 40px 32px; text-align: center; border: 1px solid var(--border); transition: transform 0.2s; }
  .team-card:hover { transform: translateY(-5px); }
  .team-avatar { width: 100px; height: 100px; border-radius: 32px; background: var(--meta-gradient); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: 700; box-shadow: 0 10px 30px rgba(6, 104, 225, 0.2); }
  .team-role { color: var(--meta-blue); font-size: 0.9rem; font-weight: 600; margin-bottom: 12px; }

  @media (max-width: 768px) {
    .header-content { padding: 0 16px; }
    .header-nav { display: none; }
    .content-wrapper { padding: 0 16px; }
    .hero-title { font-size: 3rem; }
    .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
    .contact-grid { grid-template-columns: 1fr; gap: 32px; }
    .hero-section { padding: 60px 0 40px; }
    /* On mobile, allow stacking but let tablet be horizontal */
    .stats-grid, .featured-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 480px) {
    .hero-title { font-size: 2.5rem; }
    .section-title { font-size: 1.5rem; }
    .footer-grid { grid-template-columns: 1fr; gap: 24px; }
  }
`

