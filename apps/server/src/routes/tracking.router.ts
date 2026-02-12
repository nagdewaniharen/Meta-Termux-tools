import { Router, Request, Response } from 'express'
import { requireAuth } from '@/lib/auth'
import { toApiError } from '@meta/shared'
import { trackEvent, getRecentEvents, getTrackingStats } from '@/services/tracking.service'

const router = Router()

// GET /api/tracking/events
/**
 * @swagger
 * /tracking/events:
 *   get:
 *     summary: Retrieve recent tracking events
 *     tags: [Tracking]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: A list of tracking events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       page_slug:
 *                         type: string
 *                       campaign_id:
 *                         type: string
 */
router.get('/events', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)

    const limit = Number(req.query.limit) || 20
    const offset = Number(req.query.offset) || 0

    const { items, total } = await getRecentEvents(limit, offset)

    res.json({ success: true, data: items, meta: { page: offset, limit, total } })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/tracking/events
/**
 * @swagger
 * /tracking/events:
 *   post:
 *     summary: Record a tracking event
 *     tags: [Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - page_slug
 *             properties:
 *               type:
 *                 type: string
 *               page_slug:
 *                 type: string
 *               campaign_id:
 *                 type: string
 *               meta:
 *                 type: object
 *     responses:
 *       201:
 *         description: Event recorded
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
router.post('/events', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const event = await trackEvent(req.body)
    res.status(201).json({ success: true, data: event })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// GET /api/tracking/stats
/**
 * @swagger
 * /tracking/stats:
 *   get:
 *     summary: Get tracking statistics
 *     tags: [Tracking]
 *     parameters:
 *       - in: query
 *         name: page_slug
 *         schema:
 *           type: string
 *       - in: query
 *         name: campaign_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [24h, 7d, 30d, all]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Statistics data
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
router.get('/stats', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)

    const pageSlug = req.query.page_slug as string | undefined
    const campaignId = req.query.campaign_id as string | undefined
    const period = req.query.period as string | undefined

    const stats = await getTrackingStats(pageSlug, campaignId, period)

    res.json({ success: true, data: stats })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

export default router
