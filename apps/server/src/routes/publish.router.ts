import { Router, Request, Response } from 'express'
import { requireAuth }               from '@/lib/auth'
import { toApiError }                from '@meta/shared'
import {
  previewPage,
  publishPage,
  unpublishPage,
  rollbackPage,
  getPagePublishStatus,
} from '@/services/publish.service'

const router = Router()

const PREVIEW_BANNER =
  '<div style="position:fixed;top:0;left:0;right:0;background:#f59e0b;color:#000;' +
  'padding:8px;text-align:center;z-index:9999;font-family:sans-serif;font-size:14px;' +
  'font-weight:600;">PREVIEW MODE</div>'

// GET /api/publish/:slug/status
router.get('/:slug/status', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const status = await getPagePublishStatus(req.params.slug)
    res.json({ success: true, data: status })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/publish/:slug/preview
router.post('/:slug/preview', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const html = await previewPage(req.params.slug)
    res.set('Content-Type', 'text/html').send(PREVIEW_BANNER + html)
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/publish/:slug/publish
router.post('/:slug/publish', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const result = await publishPage(req.params.slug)
    res.json({ success: true, data: result })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/publish/:slug/unpublish
router.post('/:slug/unpublish', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    await unpublishPage(req.params.slug)
    res.json({ success: true, data: {} })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/publish/:slug/rollback
router.post('/:slug/rollback', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    await rollbackPage(req.params.slug)
    res.json({ success: true, data: {} })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

export default router
