import { Router, Request, Response } from 'express'
import { z }                         from 'zod'
import { requireAuth }               from '@/lib/auth'
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

const router = Router()

const statusSchema = z.object({
  status: z.enum(['active', 'inactive']),
})

// GET /api/scripts
router.get('/', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)

    const limit  = Number(req.query.limit)  || 20
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
router.post('/', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const data   = scriptSchema.parse(req.body)
    const script = await createScript(data)
    res.status(201).json({ success: true, data: script })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// GET /api/scripts/:id
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
router.put('/:id', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const data   = scriptSchema.parse(req.body)
    const script = await updateScript(req.params.id, data)
    res.json({ success: true, data: script })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// DELETE /api/scripts/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    await deleteScript(req.params.id)
    res.json({ success: true })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// PATCH /api/scripts/:id/status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const { status } = statusSchema.parse(req.body)
    const script     = await updateScriptStatus(req.params.id, status)
    res.json({ success: true, data: script })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// ── page-level attach / detach ──────────────────────────────

// POST /api/scripts/:id/pages/:pageSlug   — attach script to a page
router.post('/:id/pages/:pageSlug', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const { order } = pageScriptSchema.parse(req.body)
    const result    = await addScriptToPage(req.params.pageSlug, req.params.id, order)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// DELETE /api/scripts/:id/pages/:pageSlug — detach script from a page
router.delete('/:id/pages/:pageSlug', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const result = await removeScriptFromPage(req.params.pageSlug, req.params.id)
    res.json({ success: true, data: result })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

// ── replace: swap old script → new script ──────────────────

// PUT /api/scripts/:id/replace   body: { new_script_id, target_pages? }
router.put('/:id/replace', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
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
router.post('/:id/propagate', async (req: Request, res: Response) => {
  try {
    await requireAuth(req)
    const { mode, target_pages } = propagateScriptSchema.parse(req.body)
    const result = await propagateScript(req.params.id, mode, target_pages)
    res.json({ success: true, data: result })
  } catch (err) {
    const { error, status } = toApiError(err)
    res.status(status).json({ success: false, error })
  }
})

export default router
