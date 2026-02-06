import { Router, Request, Response } from 'express'
import { openApiSpec }               from '@/docs/openapi'

const router = Router()

// GET /api/swagger.json
router.get('/swagger.json', (_req: Request, res: Response) => {
  res.json(openApiSpec)
})

export default router
