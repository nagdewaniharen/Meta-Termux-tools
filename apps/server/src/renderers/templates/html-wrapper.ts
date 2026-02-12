import { renderHead }                          from './head'
import { renderHeader }                        from './header'
import { renderFooter }                        from './footer'
import { groupScriptsByPosition, renderScripts } from './scripts-injector'
import type { Script }                         from '@meta/shared'

interface WrapperParams {
  title:       string
  description: string
  url:         string
  bodyContent: string
  scripts:     Script[]
}

export function wrapPage({ title, description, url, bodyContent, scripts }: WrapperParams): string {
  const grouped = groupScriptsByPosition(scripts)

  const headStart = renderScripts(grouped.head_start)
  const headEnd   = renderScripts(grouped.head_end)
  const bodyStart = renderScripts(grouped.body_start)
  const bodyEnd   = renderScripts(grouped.body_end)

  const head = renderHead({ title, description, url, headStartScripts: headStart, headEndScripts: headEnd })

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
${head}
<body>
    ${bodyStart}
    ${renderHeader()}
    <div class="page-container">
        <div class="content-wrapper">
            ${bodyContent}
        </div>
    </div>
    ${renderFooter()}
    ${bodyEnd}
</body>
</html>`
}
