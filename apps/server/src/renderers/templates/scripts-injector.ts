import type { Script } from '@meta/shared'

export function groupScriptsByPosition(scripts: Script[]): Record<string, Script[]> {
  const groups: Record<string, Script[]> = {
    head_start: [],
    head_end:   [],
    body_start: [],
    body_end:   [],
  }

  for (const script of scripts) {
    if (groups[script.position]) {
      groups[script.position].push(script)
    }
  }

  return groups
}

export function renderScripts(scripts: Script[]): string {
  return scripts.map((s) => s.code).join('\n')
}

// ── inject scripts into a complete HTML string (fullPage mode) ─
export function injectScriptsIntoHtml(html: string, scripts: Script[]): string {
  const grouped = groupScriptsByPosition(scripts)

  const headStart = renderScripts(grouped.head_start)
  const headEnd   = renderScripts(grouped.head_end)
  const bodyStart = renderScripts(grouped.body_start)
  const bodyEnd   = renderScripts(grouped.body_end)

  if (headStart) html = html.replace('<head>', `<head>\n${headStart}`)
  if (headEnd)   html = html.replace('</head>', `${headEnd}\n</head>`)
  if (bodyStart) html = html.replace('<body>', `<body>\n${bodyStart}`)
  if (bodyEnd)   html = html.replace('</body>', `${bodyEnd}\n</body>`)

  return html
}
