import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { requireAuth, isOwner } from '@/lib/auth'
import {
  toApiError,
  scriptSchema,
  propagateScriptSchema,
  replaceScriptSchema,
  pageScriptSchema,
} from '@meta/shared'
import {
  getScripts,
  getScript,
  createScript,
  updateScript,
  deleteScript,
  updateScriptStatus,
  addScriptToPage,
  removeScriptFromPage,
  replaceScriptOnPages,
  propagateScript,
} from '@/services/script.service'

/**
 * @swagger
 * components:
 *   schemas:
 *     Script:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the script
 *         name:
 *           type: string
 *           description: The name of the script
 *         description:
 *           type: string
 *           description: The description of the script
 *         code:
 *           type: string
 *           description: The script code
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: The status of the script
 *     ScriptInput:
 *       type: object
 *       required:
 *         - name
 *         - code
 *         - position
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         code:
 *           type: string
 *           description: HTML script tag content
 *         position:
 *           type: string
 *           enum: [head_start, head_end, body_start, body_end]
 *         is_global:
 *           type: boolean
 */
const router = Router()

const statusSchema = z.object({
  status: z.enum(['active', 'inactive']),
})

// GET /api/scripts
/**
 * @swagger
 * /scripts:
 *   get:
 *     summary: Retrieve a list of scripts
 *     tags: [Scripts]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: A list of scripts
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
 *                     $ref: '#/components/schemas/Script'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)

    const limit = Number(req.query.limit) || 20
    const offset = Number(req.query.offset) || 0
    const status = req.query.status as string | undefined

    const { items, total } = await getScripts(limit, offset, status)

    res.json({ success: true, data: items, meta: { page: offset, limit, total } })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// POST /api/scripts
/**
 * @swagger
 * /scripts:
 *   post:
 *     summary: Create a new script
 *     tags: [Scripts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScriptInput'
 *     responses:
 *       201:
 *         description: Script created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Script'
 */
// POST /api/scripts
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await requireAuth(req)
    if (!isOwner(user.email)) {
      return res.status(403).json({ success: false, error: 'Only owners can create scripts' })
    }
    const data = scriptSchema.parse(req.body)
    const script = await createScript(data)
    res.status(201).json({ success: true, data: script })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// GET /api/scripts/:id
/**
 * @swagger
 * /scripts/{id}:
 *   get:
 *     summary: Get a script by ID
 *     tags: [Scripts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Script details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Script'
 *       404:
 *         description: Script not found
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const script = await getScript(req.params.id)
    res.json({ success: true, data: script })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// PUT /api/scripts/:id
/**
 * @swagger
 * /scripts/{id}:
 *   put:
 *     summary: Update a script
 *     tags: [Scripts]
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
 *             $ref: '#/components/schemas/ScriptInput'
 *     responses:
 *       200:
 *         description: Script updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Script'
 */
// PUT /api/scripts/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = await requireAuth(req)
    if (!isOwner(user.email)) {
      return res.status(403).json({ success: false, error: 'Only owners can update scripts' })
    }
    const data = scriptSchema.parse(req.body)
    const script = await updateScript(req.params.id, data)
    res.json({ success: true, data: script })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// DELETE /api/scripts/:id
/**
 * @swagger
 * /scripts/{id}:
 *   delete:
 *     summary: Delete a script
 *     tags: [Scripts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Script deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
// DELETE /api/scripts/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await requireAuth(req)
    if (!isOwner(user.email)) {
      return res.status(403).json({ success: false, error: 'Only owners can delete scripts' })
    }
    await deleteScript(req.params.id)
    res.json({ success: true })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// PATCH /api/scripts/:id/status
/**
 * @swagger
 * /scripts/{id}/status:
 *   patch:
 *     summary: Update script status
 *     tags: [Scripts]
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
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Script status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Script'
 */
// PATCH /api/scripts/:id/status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const user = await requireAuth(req)
    if (!isOwner(user.email)) {
      return res.status(403).json({ success: false, error: 'Only owners can allow/disallow scripts' })
    }
    const { status } = statusSchema.parse(req.body)
    const script = await updateScriptStatus(req.params.id, status)
    res.json({ success: true, data: script })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// ── page-level attach / detach ──────────────────────────────

// POST /api/scripts/:id/pages/:pageSlug   — attach script to a page
// POST /api/scripts/:id/pages/:pageSlug   — attach script to a page
router.post('/:id/pages/:pageSlug', async (req: Request, res: Response) => {
  try {
    const user = await requireAuth(req)
    if (!isOwner(user.email)) {
      return res.status(403).json({ success: false, error: 'Only owners can attach scripts' })
    }
    const { order } = pageScriptSchema.parse(req.body)
    const result = await addScriptToPage(req.params.pageSlug, req.params.id, order)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// DELETE /api/scripts/:id/pages/:pageSlug — detach script from a page
// DELETE /api/scripts/:id/pages/:pageSlug — detach script from a page
router.delete('/:id/pages/:pageSlug', async (req: Request, res: Response) => {
  try {
    const user = await requireAuth(req)
    if (!isOwner(user.email)) {
      return res.status(403).json({ success: false, error: 'Only owners can detach scripts' })
    }
    const result = await removeScriptFromPage(req.params.pageSlug, req.params.id)
    res.json({ success: true, data: result })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// ── replace: swap old script → new script ──────────────────

// PUT /api/scripts/:id/replace   body: { new_script_id, target_pages? }
// PUT /api/scripts/:id/replace   body: { new_script_id, target_pages? }
router.put('/:id/replace', async (req: Request, res: Response) => {
  try {
    const user = await requireAuth(req)
    if (!isOwner(user.email)) {
      return res.status(403).json({ success: false, error: 'Only owners can replace scripts' })
    }
    const { new_script_id, target_pages } = replaceScriptSchema.parse(req.body)
    const result = await replaceScriptOnPages(req.params.id, new_script_id, target_pages)
    res.json({ success: true, data: result })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// ── propagate: finalize after campaign test ─────────────────

// POST /api/scripts/:id/propagate   body: { mode, target_pages? }
// mode "new_only"     → adds to pages only (new campaigns inherit)
// mode "all_existing" → also pushes into every active campaign
// POST /api/scripts/:id/propagate   body: { mode, target_pages? }
// mode "new_only"     → adds to pages only (new campaigns inherit)
// mode "all_existing" → also pushes into every active campaign
router.post('/:id/propagate', async (req: Request, res: Response) => {
  try {
    const user = await requireAuth(req)
    if (!isOwner(user.email)) {
      return res.status(403).json({ success: false, error: 'Only owners can propagate scripts' })
    }
    const { mode, target_pages } = propagateScriptSchema.parse(req.body)
    const result = await propagateScript(req.params.id, mode, target_pages)
    res.json({ success: true, data: result })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

export default router
