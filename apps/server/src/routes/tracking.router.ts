import { Router, Request, Response } from 'express'
import { requireAuth }               from '@/lib/auth'
import { toApiError }                from '@meta/shared'
import { trackEvent, getRecentEvents, getTrackingStats } from '@/services/tracking.service'

const router = Router()

// GET /api/tracking/events
router.get('/events', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)

    const limit  = Number(req.query.limit)  || 20
    const offset = Number(req.query.offset) || 0

    const { items, total } = await getRecentEvents(limit, offset)

    res.json({ success: true, data: items, meta: { page: offset, limit, total } })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/tracking/events
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
router.get('/stats', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)

    const pageSlug   = req.query.page_slug   as string | undefined
    const campaignId = req.query.campaign_id as string | undefined
    const period     = req.query.period      as string | undefined

    const stats = await getTrackingStats(pageSlug, campaignId, period)

    res.json({ success: true, data: stats })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

export default router
