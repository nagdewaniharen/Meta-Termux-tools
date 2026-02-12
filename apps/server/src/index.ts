import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env.local') })

import app from './app'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`[meta server] running on http://localhost:${PORT}`)
})
