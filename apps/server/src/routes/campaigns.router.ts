import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { toApiError, campaignSchema } from '@meta/shared'
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  updateCampaignStatus,
  getCampaignScripts,
  addScriptToCampaign,
  removeScriptFromCampaign,
} from '@/services/campaign.service'

const router = Router()

const statusSchema = z.object({
  status: z.enum(['draft', 'active', 'paused', 'archived']),
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, active, paused, archived]
 *         target_pages:
 *           type: array
 *           items:
 *             type: string
 *         target_keywords:
 *           type: array
 *           items:
 *             type: string
 */

// GET /api/campaigns
/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Retrieve a list of campaigns
 *     tags: [Campaigns]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of campaigns
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
 *                     $ref: '#/components/schemas/Campaign'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)

    const limit = Number(req.query.limit) || 20
    const offset = Number(req.query.offset) || 0
    const status = req.query.status as string | undefined

    const { items, total } = await getCampaigns(limit, offset, status)

    res.json({ success: true, data: items, meta: { page: offset, limit, total } })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/campaigns
/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               target_pages:
 *                 type: array
 *                 items:
 *                   type: string
 *               target_keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Campaign created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const data = campaignSchema.parse(req.body)
    const campaign = await createCampaign(data)
    res.status(201).json({ success: true, data: campaign })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// GET /api/campaigns/:id
/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const campaign = await getCampaign(req.params.id)
    res.json({ success: true, data: campaign })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// PUT /api/campaigns/:id
/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Update a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Campaign updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const data = campaignSchema.parse(req.body)
    const campaign = await updateCampaign(req.params.id, data)
    res.json({ success: true, data: campaign })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// DELETE /api/campaigns/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    await deleteCampaign(req.params.id)
    res.json({ success: true })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// PATCH /api/campaigns/:id/status
/**
 * @swagger
 * /campaigns/{id}/status:
 *   patch:
 *     summary: Update campaign status
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, active, paused, archived]
 *     responses:
 *       200:
 *         description: Campaign status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 */
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const { status } = statusSchema.parse(req.body)
    const campaign = await updateCampaignStatus(req.params.id, status)
    res.json({ success: true, data: campaign })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// GET /api/campaigns/:id/scripts
router.get('/:id/scripts', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const scripts = await getCampaignScripts(req.params.id)
    res.json({ success: true, data: scripts })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/campaigns/:id/scripts
router.post('/:id/scripts', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const { scriptId, order } = req.body
    await addScriptToCampaign(req.params.id, scriptId, order)
    res.status(201).json({ success: true })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// DELETE /api/campaigns/:id/scripts/:scriptId
router.delete('/:id/scripts/:scriptId', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    await removeScriptFromCampaign(req.params.id, req.params.scriptId)
    res.json({ success: true })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

export default router
