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

const router = Router()

// GET /api/pages
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
