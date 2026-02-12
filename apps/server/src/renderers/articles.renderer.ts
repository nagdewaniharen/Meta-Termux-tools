export function renderArticlesContent(): string {
  return `
    <header class="article-header">
        <h1 class="article-title">Articles</h1>
        <p class="article-excerpt">Browse all articles and guides on the platform.</p>
    </header>

    <div class="article-content">
        <div class="featured-grid">
            <div class="featured-card">
                <div class="featured-card-title">Script Management 101</div>
                <p class="featured-card-text">A comprehensive guide to managing scripts across your website effectively.</p>
            </div>
            <div class="featured-card">
                <div class="featured-card-title">Campaign Best Practices</div>
                <p class="featured-card-text">Learn how to structure campaigns for maximum impact and minimal overhead.</p>
            </div>
            <div class="featured-card">
                <div class="featured-card-title">Performance Optimization</div>
                <p class="featured-card-text">Tips and techniques to keep your pages fast while running multiple scripts.</p>
            </div>
            <div class="featured-card">
                <div class="featured-card-title">Analytics Deep Dive</div>
                <p class="featured-card-text">Understanding your tracking data and turning insights into action.</p>
            </div>
            <div class="featured-card">
                <div class="featured-card-title">Security Considerations</div>
                <p class="featured-card-text">How to safely deploy third-party scripts without exposing your users.</p>
            </div>
            <div class="featured-card">
                <div class="featured-card-title">Advanced Targeting</div>
                <p class="featured-card-text">Target scripts to specific pages and audiences with campaign rules.</p>
            </div>
        </div>
    </div>
`
}
