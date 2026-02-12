import { Router, Request, Response } from 'express'
import { requireAuth } from '@/lib/auth'
import { toApiError, landingPageGenerateSchema } from '@meta/shared'
import {
    createLandingPage,
    getLandingPages,
    getLandingPage,
    publishLandingPage,
    unpublishLandingPage,
    deleteLandingPage,
} from '@/services/landing-page.service'

const router = Router()

// ── Swagger schema ────────────────────────────────────────────
/**
 * @swagger
 * components:
 *   schemas:
 *     LandingPage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         keyword:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *         version:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

// ── POST /api/landing-pages/generate ──────────────────────────
/**
 * @swagger
 * /landing-pages/generate:
 *   post:
 *     summary: Generate a new AI landing page
 *     tags: [Landing Pages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - keyword
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Best Running Shoes 2025"
 *               keyword:
 *                 type: string
 *                 example: "running shoes"
 *               creatives:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [image, video]
 *                     url:
 *                       type: string
 *                       format: uri
 *                     alt:
 *                       type: string
 *     responses:
 *       201:
 *         description: Landing page generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/LandingPage'
 */
router.post('/generate', async (req: Request, res: Response) => {
    try {
        // TODO: Re-enable auth later
        // await requireAuth(req)
        const input = landingPageGenerateSchema.parse(req.body)
        const landingPage = await createLandingPage(input)
        res.status(201).json({ success: true, data: landingPage })
    } catch (err) {
        const { error, status } = toApiError(err)
        res.status(status).json({ success: false, error })
    }
})

// ── GET /api/landing-pages ────────────────────────────────────
/**
 * @swagger
 * /landing-pages:
 *   get:
 *     summary: List all landing pages
 *     tags: [Landing Pages]
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
 *         description: A list of landing pages
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
 *                     $ref: '#/components/schemas/LandingPage'
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        // TODO: Re-enable auth later
        // await requireAuth(req)
        const limit = Number(req.query.limit) || 20
        const offset = Number(req.query.offset) || 0
        const { items, total } = await getLandingPages(limit, offset)
        res.json({ success: true, data: { items, total } })
    } catch (err) {
        const { error, status } = toApiError(err)
        res.status(status).json({ success: false, error })
    }
})

// ── GET /api/landing-pages/:id ────────────────────────────────
/**
 * @swagger
 * /landing-pages/{id}:
 *   get:
 *     summary: Get a landing page by ID
 *     tags: [Landing Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Landing page details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/LandingPage'
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        // TODO: Re-enable auth later
        // await requireAuth(req)
        const lp = await getLandingPage(req.params.id)
        res.json({ success: true, data: lp })
    } catch (err) {
        const { error, status } = toApiError(err)
        res.status(status).json({ success: false, error })
    }
})

// ── POST /api/landing-pages/:id/publish ───────────────────────
/**
 * @swagger
 * /landing-pages/{id}/publish:
 *   post:
 *     summary: Publish a landing page (upload to R2/S3 and make live)
 *     tags: [Landing Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Landing page published
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 */
router.post('/:id/publish', async (req: Request, res: Response) => {
    try {
        // TODO: Re-enable auth later
        // await requireAuth(req)
        const result = await publishLandingPage(req.params.id)
        res.json({ success: true, data: result })
    } catch (err) {
        const { error, status } = toApiError(err)
        res.status(status).json({ success: false, error })
    }
})

// ── POST /api/landing-pages/:id/unpublish ─────────────────────
/**
 * @swagger
 * /landing-pages/{id}/unpublish:
 *   post:
 *     summary: Unpublish a landing page
 *     tags: [Landing Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Landing page unpublished
 */
router.post('/:id/unpublish', async (req: Request, res: Response) => {
    try {
        // TODO: Re-enable auth later
        // await requireAuth(req)
        await unpublishLandingPage(req.params.id)
        res.json({ success: true, data: {} })
    } catch (err) {
        const { error, status } = toApiError(err)
        res.status(status).json({ success: false, error })
    }
})

// ── DELETE /api/landing-pages/:id ─────────────────────────────
/**
 * @swagger
 * /landing-pages/{id}:
 *   delete:
 *     summary: Delete a landing page
 *     tags: [Landing Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Landing page deleted
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await requireAuth(req)
        await deleteLandingPage(req.params.id)
        res.json({ success: true })
    } catch (err) {
        const { error, status } = toApiError(err)
        res.status(status).json({ success: false, error })
    }
})

export default router
