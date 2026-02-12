import { Router, Request, Response } from 'express'
import { PAGE_SLUGS } from '@meta/shared'
import { renderPage } from '@/renderers/base.renderer'
import { renderErrorPage } from '@/renderers/error.renderer'
import { trackEvent } from '@/services/tracking.service'

const router = Router()

const VALID_SLUGS: string[] = Object.values(PAGE_SLUGS).filter((s) => s !== 'homepage')

// ── helper: fire-and-forget pageview event ─
function firePageview(req: Request, pageSlug: string) {
  trackEvent({
    page_slug: pageSlug,
    event_type: 'pageview',
    referrer: req.headers.referer,
    user_agent: req.headers['user-agent'],
    ip_address: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip,
  }).catch(() => { })
}

// GET /
router.get('/', async (_req: Request, res: Response) => {
  try {
    const html = await renderPage('homepage')
    firePageview(_req, 'homepage')

    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    }).send(html)
  } catch {
    res.status(500)
      .set('Content-Type', 'text/html')
      .send(renderErrorPage(500, 'Something went wrong. Please try again later.'))
  }
})

// GET /:slug
router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params

  // Check if it's a valid static slug OR attempt dynamic render.
  // We removed the strict VALID_SLUGS check to allow dynamic DB pages.
  // renderPage(slug) will throw if it can't find static config OR db page.


  try {
    const html = await renderPage(slug)
    firePageview(req, slug)

    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    }).send(html)
  } catch {
    res.status(500)
      .set('Content-Type', 'text/html')
      .send(renderErrorPage(500, 'Something went wrong. Please try again later.'))
  }
})

export default router
