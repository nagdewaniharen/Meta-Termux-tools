import { Router, Request, Response } from 'express'
import { requireAuth } from '@/lib/auth'
import { toApiError, pageUpdateSchema } from '@meta/shared'
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  getPageScripts,
  addScriptToPage,
  removeScriptFromPage,
} from '@/services/page.service'

/**
 * @swagger
 * components:
 *   schemas:
 *     Page:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         slug:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *         version:
 *           type: integer
 */
const router = Router()

// GET /api/pages
/**
 * @swagger
 * /pages:
 *   get:
 *     summary: Retrieve a list of pages
 *     tags: [Pages]
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
 *         description: A list of pages
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
 *                     $ref: '#/components/schemas/Page'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)

    const limit = Number(req.query.limit) || 20
    const offset = Number(req.query.offset) || 0

    const { items, total } = await getPages(limit, offset)

    res.json({ success: true, data: items, meta: { page: offset, limit, total } })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/pages
/**
 * @swagger
 * /pages:
 *   post:
 *     summary: Create a new page
 *     tags: [Pages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Page created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Page'
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const { title, slug, description } = req.body
    if (!title || !slug) {
      return res.status(400).json({ success: false, error: 'Title and Slug are required' })
    }

    // Default to draft
    const page = await createPage({
      title,
      slug,
      description: description || '',
      status: 'draft'
    })
    res.status(201).json({ success: true, data: page })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// GET /api/pages/:id
/**
 * @swagger
 * /pages/{id}:
 *   get:
 *     summary: Get a page by ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Page'
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const page = await getPage(req.params.id)
    res.json({ success: true, data: page })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// PUT /api/pages/:id
/**
 * @swagger
 * /pages/{id}:
 *   put:
 *     summary: Update a page
 *     tags: [Pages]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: Page updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Page'
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const data = pageUpdateSchema.parse(req.body)
    const page = await updatePage(req.params.id, data)
    res.json({ success: true, data: page })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// GET /api/pages/:id/scripts
router.get('/:id/scripts', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const scripts = await getPageScripts(req.params.id)
    res.json({ success: true, data: scripts })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/pages/:id/scripts
router.post('/:id/scripts', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const { scriptId, order } = req.body
    await addScriptToPage(req.params.id, scriptId, order)
    res.status(201).json({ success: true })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// DELETE /api/pages/:id/scripts/:scriptId
router.delete('/:id/scripts/:scriptId', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    await removeScriptFromPage(req.params.id, req.params.scriptId)
    res.json({ success: true })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

export default router
