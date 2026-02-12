export function renderAboutContent(): string {
    return `
    <header class="article-header">
        <h1 class="article-title">About Us</h1>
        <p class="article-excerpt">The story behind Meta Termux and the team that built it.</p>
    </header>

    <div class="about-mission">
        <h2 class="section-title">Our Mission</h2>
        <div class="section-body">
            <p>At Meta Termux, we believe that everyone has a story to tell. Our mission is to create a platform where developers and writers can share their experiences, insights, and knowledge. We strive to foster a community where diverse voices are heard and celebrated.

We're committed to providing a space where creators can express themselves freely and readers can explore a wide range of topics. Our goal is to empower the next generation of open source contributors.</p>
        </div>
    </div>

    <h2 class="section-heading">What We Value</h2>

    <div class="about-values">
        <div class="value-card">
            <div class="value-icon">01</div>
            <div class="value-title">Transparency</div>
            <p class="value-text">Every script visible, tracked, and under control. No surprises.</p>
        </div>
        <div class="value-card">
            <div class="value-icon">02</div>
            <div class="value-title">Performance</div>
            <p class="value-text">Script placement matters. We give  precise control over where and when scripts load.</p>
        </div>
        <div class="value-card">
            <div class="value-icon">03</div>
            <div class="value-title">Reliability</div>
            <p class="value-text">Campaign-based deployment means you can test changes before they go live, and roll back instantly.</p>
        </div>
    </div>

    <h2 class="section-heading">Founding Members</h2>
    <p class="section-subheading">People behind the platform</p>

    <div class="team-grid">
        <div class="team-card">
            <div class="team-avatar">HN</div>
            <div class="team-name">Mr. Haren Nagdewani</div>
            <div class="team-role">Founding Member</div>
            <p class="team-bio">.......</p>
        </div>
        <div class="team-card">
            <div class="team-avatar">KS</div>
            <div class="team-name">Mr. Khushwant Singh</div>
            <div class="team-role">Founding Member</div>
            <p class="team-bio">........</p>
        </div>
        <div class="team-card">
            <div class="team-avatar">AN</div>
            <div class="team-name">Mr. Aman Narula </div>
            <div class="team-role">Founding Member</div>
            <p class="team-bio">.......</p>
        </div>
    </div>
`
}
