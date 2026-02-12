import { Router, Request, Response } from 'express'
import multer from 'multer'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'
import { toApiError } from '@/lib/errors'
import { requireAuth } from '@/lib/auth'

const router = Router()

// Configure Multer (memory storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
})

// Validation schema
const uploadSchema = z.object({
    folder: z.enum(['creatives']).default('creatives'),
})

// Helper to upload to S3/R2
async function uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
    const REGION = process.env.AWS_REGION || 'auto'
    const ENDPOINT = process.env.AWS_ENDPOINT || process.env.R2_ENDPOINT
    const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID
    const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY
    const BUCKET = process.env.AWS_BUCKET_NAME || process.env.R2_BUCKET_NAME
    const PUBLIC_URL = process.env.AWS_PUBLIC_URL || process.env.R2_PUBLIC_URL

    if (!ACCESS_KEY || !SECRET_KEY || !BUCKET) {
        console.error('[Upload] Missing storage credentials')
        throw new Error('Storage configuration missing (AWS/R2 credentials)')
    }

    const s3Client = new S3Client({
        region: REGION,
        endpoint: ENDPOINT,
        credentials: {
            accessKeyId: ACCESS_KEY,
            secretAccessKey: SECRET_KEY,
        },
        forcePathStyle: true,
    })

    const fileExt = file.originalname.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const contentType = file.mimetype || 'application/octet-stream'

    await s3Client.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: fileName,
            Body: file.buffer,
            ContentType: contentType,
            // ACL: 'public-read', // Uncomment if bucket is public logic requires ACL
        })
    )

    // Build public URL
    if (PUBLIC_URL) {
        return `${PUBLIC_URL}/${fileName}`
    }

    // Fallback S3 URL construction
    if (ENDPOINT) {
        // Custom endpoint (R2/MinIO)
        return `${ENDPOINT}/${BUCKET}/${fileName}`
    }

    // Standard AWS S3 URL
    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`
}

// POST /api/upload
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
    try {
        // TODO: Re-enable auth later
        // await requireAuth(req)

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file provided' })
        }

        // Default to 'creatives' folder if not specified
        const folder = req.body.folder || 'creatives'

        const url = await uploadToS3(req.file, folder)

        res.json({ success: true, data: { url } })
    } catch (err) {
        console.error('Upload error:', err)
        const { error, status } = toApiError(err)
        res.status(status).json({ success: false, error })
    }
})

export default router
