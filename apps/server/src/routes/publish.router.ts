import { Router, Request, Response } from 'express'
import { requireAuth } from '@/lib/auth'
import { toApiError } from '@meta/shared'
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
// GET /api/publish/:slug/status
/**
 * @swagger
 * /publish/{slug}/status:
 *   get:
 *     summary: Get page publish status
 *     tags: [Publish]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Publish status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
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
// POST /api/publish/:slug/preview
/**
 * @swagger
 * /publish/{slug}/preview:
 *   post:
 *     summary: Preview a page (HTML)
 *     tags: [Publish]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: HTML preview content
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
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
// POST /api/publish/:slug/publish
/**
 * @swagger
 * /publish/{slug}/publish:
 *   post:
 *     summary: Publish a page
 *     tags: [Publish]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
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
// POST /api/publish/:slug/unpublish
/**
 * @swagger
 * /publish/{slug}/unpublish:
 *   post:
 *     summary: Unpublish a page
 *     tags: [Publish]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page unpublished successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
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
// POST /api/publish/:slug/rollback
/**
 * @swagger
 * /publish/{slug}/rollback:
 *   post:
 *     summary: Rollback page to previous version
 *     tags: [Publish]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page rolled back successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
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
