import { prisma } from '@/lib/db'

// ── list all published articles ─────────────────────────────
export async function getArticles(limit: number = 50, offset: number = 0) {
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where:   { status: 'published' },
      orderBy: { created_at: 'desc' },
      take:    limit,
      skip:    offset,
    }),
    prisma.article.count({ where: { status: 'published' } }),
  ])
  return { items, total }
}

// ── fetch a single article by slug ──────────────────────────
export async function getArticle(slug: string) {
  return prisma.article.findUnique({
    where: { slug, status: 'published' },
  })
}

// ── full-text search across title, excerpt, body, tags, keywords ──
export async function searchArticles(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  // published articles and filter in-memory.  Fine for < 1 k articles.
  const articles = await prisma.article.findMany({
    where:   { status: 'published' },
    orderBy: { created_at: 'desc' },
  })

  return articles.filter((a) => {
    const tags     = (a.tags     as string[]).map((t) => t.toLowerCase())
    const keywords = (a.keywords as string[]).map((k) => k.toLowerCase())

    return (
      a.title.toLowerCase().includes(q)        ||
      a.excerpt.toLowerCase().includes(q)      ||
      a.body.toLowerCase().includes(q)         ||
      tags.some((t) => t.includes(q))          ||
      keywords.some((k) => k.includes(q))
    )
  })
}
