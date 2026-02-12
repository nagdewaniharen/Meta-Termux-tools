export function renderErrorPage(code: number, message: string): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="#0a0a0a">
    <title>${code} - Search Termux</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></noscript>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0a0a;
            color: #e2e8f0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .error-container { text-align: center; padding: 0 24px; }
        .error-code {
            font-size: 8rem;
            font-weight: 700;
            color: #ffffff;
            line-height: 1;
            margin-bottom: 16px;
            letter-spacing: -4px;
        }
        .error-divider {
            width: 60px;
            height: 2px;
            background: #7c3aed;
            margin: 24px auto;
            border-radius: 1px;
        }
        .error-message {
            font-size: 1.125rem;
            color: #94a3b8;
            margin-bottom: 40px;
            max-width: 480px;
            line-height: 1.6;
        }
        .error-link {
            display: inline-block;
            padding: 12px 28px;
            background: #7c3aed;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.9rem;
            letter-spacing: 0.02em;
            transition: background 0.2s ease;
        }
        .error-link:hover { background: #6d28d9; }
        .error-brand {
            position: fixed;
            bottom: 32px;
            color: #374151;
            font-size: 0.8rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-code">${code}</div>
        <div class="error-divider"></div>
        <p class="error-message">${message}</p>
        <a href="/" class="error-link">Back to Home</a>
    </div>
    <div class="error-brand">Search Termux</div>
</body>
</html>`
}
