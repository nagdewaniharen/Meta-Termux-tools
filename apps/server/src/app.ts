import express from 'express'
import cors from 'cors'

import pagesRouter from './routes/pages.router'
import scriptsRouter from './routes/scripts.router'
import campaignsRouter from './routes/campaigns.router'
import publishRouter from './routes/publish.router'
import trackingRouter from './routes/tracking.router'
import landingPagesRouter from './routes/landing-pages.router'
import websiteRouter from './routes/website.router'
import docsRouter from './routes/docs.router'

import uploadRouter from './routes/upload.router'

const app = express()

// ── CORS ───────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))

// ── body parsing ───────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── API routes (auth-gated, mounted first) ────────────────
app.use('/api/pages', pagesRouter)
app.use('/api/scripts', scriptsRouter)
app.use('/api/campaigns', campaignsRouter)
app.use('/api/publish', publishRouter)
app.use('/api/tracking', trackingRouter)
app.use('/api/landing-pages', landingPagesRouter)
app.use('/api/upload', uploadRouter)
app.use('/api', docsRouter)          // /api/swagger.json

// ── Swagger UI ─────────────────────────────────────────────
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Meta Termux API',
      version: '1.0.0',
      description: 'API documentation for Meta Termux Platform',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
      {
        url: 'https://meta-termux-tools-server.onrender.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
}

const specs = swaggerJsdoc(options)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs))

// ── public website (catch-all, mounted last) ──────────────
app.use('/', websiteRouter)

export default app
