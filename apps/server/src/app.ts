import express from 'express'
import cors   from 'cors'

import pagesRouter    from './routes/pages.router'
import scriptsRouter  from './routes/scripts.router'
import campaignsRouter from './routes/campaigns.router'
import publishRouter  from './routes/publish.router'
import trackingRouter from './routes/tracking.router'
import websiteRouter  from './routes/website.router'
import docsRouter     from './routes/docs.router'

const app = express()

// ── CORS ───────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))

// ── body parsing ───────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── API routes (auth-gated, mounted first) ────────────────
app.use('/api/pages',     pagesRouter)
app.use('/api/scripts',   scriptsRouter)
app.use('/api/campaigns', campaignsRouter)
app.use('/api/publish',   publishRouter)
app.use('/api/tracking',  trackingRouter)
app.use('/api',           docsRouter)          // /api/swagger.json

// ── public website (catch-all, mounted last) ──────────────
app.use('/',              websiteRouter)

export default app
