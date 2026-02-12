import { prisma } from '@/lib/db'
import { getR2PublicUrl } from '@/lib/config'
import { wrapPage } from './templates/html-wrapper'
import { injectScriptsIntoHtml } from './templates/scripts-injector'
import type { Script } from '@meta/shared'

import { renderHomepageContent } from './homepage.renderer'
import { renderSearchContent } from './search.renderer'
import { renderArticlesContent } from './articles.renderer'
import { renderAboutContent } from './about.renderer'
import { renderContactContent } from './contact.renderer'
import { renderPrivacyContent } from './privacy.renderer'
import { renderTermsContent } from './terms.renderer'

interface PageConfig {
  title: string
  description: string
  render: () => string | Promise<string>
  fullPage?: boolean   // if true, render() returns complete HTML; scripts injected into it
}

const PAGE_CONFIGS: Record<string, PageConfig> = {
  homepage: {
    title: 'Meta Termux - Discover Amazing Content',
    description: 'A vibrant community blog platform featuring diverse articles, stories, and tools for developers.',
    render: renderHomepageContent,
  },
  search: {
    title: 'Search - Meta Termux',
    description: 'Search our comprehensive library of diverse articles, scripts, and insights.',
    render: renderSearchContent,
    fullPage: true,
  },
  articles: {
    title: 'Articles - Meta Termux',
    description: 'Browse all articles and guides.',
    render: renderArticlesContent,
  },
  about: {
    title: 'About - Meta Termux',
    description: 'Learn about Meta Termux, our mission, and the team.',
    render: renderAboutContent,
  },
  contact: {
    title: 'Contact - Meta Termux',
    description: 'Get in touch with the Meta Termux team.',
    render: renderContactContent,
  },
  privacy: {
    title: 'Privacy Policy - Meta Termux',
    description: 'How Meta Termux collects, uses, and protects your information.',
    render: renderPrivacyContent,
  },
  terms: {
    title: 'Terms of Use - Meta Termux',
    description: 'Terms of service for Meta Termux.',
    render: renderTermsContent,
  },
}

async function fetchScriptsFromDB(pageSlug: string): Promise<Script[]> {
  const [globalScripts, pageScriptRecords, activeCampaigns] = await Promise.all([
    prisma.script.findMany({
      where: { is_global: true, status: 'active' },
      orderBy: { created_at: 'asc' },
    }),
    prisma.pageScript.findMany({
      where: { page: { slug: pageSlug } },
      include: { script: true },
      orderBy: { order: 'asc' },
    }),
    prisma.campaign.findMany({
      where: { status: 'active' },
      include: {
        scripts: {
          where: { is_active: true },
          include: { script: true },
          orderBy: { order: 'asc' },
        },
      },
    }),
  ])

  const pageScripts = pageScriptRecords
    .filter((r: { script: { status: string } }) => r.script.status === 'active')
    .map((r: { script: unknown }) => r.script)

  const campaignScripts = activeCampaigns
    .filter((c: { target_pages: unknown }) => (c.target_pages as string[]).includes(pageSlug))
    .flatMap((c: { scripts: Array<{ script: { status: string } }> }) =>
      c.scripts
        .filter((cs) => cs.script.status === 'active')
        .map((cs) => cs.script)
    )

  const seen = new Set<string>()
  const all: Script[] = []

  for (const s of [...globalScripts, ...pageScripts, ...campaignScripts]) {
    if (!seen.has((s as Script).id)) {
      seen.add((s as Script).id)
      all.push(s as unknown as Script)
    }
  }

  return all
}

async function getScriptsForPage(pageSlug: string): Promise<Script[]> {
  try {
    return await fetchScriptsFromDB(pageSlug)
  } catch {
    // DB unavailable — render page with no injected scripts
    return []
  }
}

export async function renderPage(pageSlug: string): Promise<string> {
  const config = PAGE_CONFIGS[pageSlug]
  // if (!config) throw new Error(`Unknown page: ${pageSlug}`) <-- OLD

  // 1. Resolve content source
  let content = ''
  let title = 'Meta Termux'
  let description = ''
  let isFullPage = false

  if (config) {
    // Static page
    content = await config.render()
    title = config.title
    description = config.description
    isFullPage = config.fullPage || false
  } else {
    // Dynamic page: try fetching from DB
    // We only serve PUBLISHED pages with live_html
    const dbPage = await prisma.page.findUnique({
      where: { slug: pageSlug },
    })

    if (!dbPage || dbPage.status !== 'published' || !dbPage.live_html) {
      throw new Error(`Unknown page: ${pageSlug}`)
    }

    content = dbPage.live_html
    title = dbPage.title
    description = dbPage.description
    isFullPage = false // Dynamic pages are usually content-in-layout; can be changed if we added a flag to DB
  }

  // 2. Fetch scripts
  // Note: getScriptsForPage inside fetchScriptsFromDB uses the same slug.
  // Ideally, if it's a static page like 'search', we might want to allow DB overrides if a page entry exists.
  // Our logic supports this: fetchScriptsFromDB queries by slug.
  const scripts = await getScriptsForPage(pageSlug)

  // 3. Render
  if (isFullPage) {
    return injectScriptsIntoHtml(content, scripts)
  }

  const baseUrl = getR2PublicUrl()
  const url = pageSlug === 'homepage' ? `${baseUrl}/` : `${baseUrl}/${pageSlug}`

  return wrapPage({
    title,
    description,
    url,
    bodyContent: content,
    scripts,
  })
}
