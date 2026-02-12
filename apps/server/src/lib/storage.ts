import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

// Support both AWS S3 and Cloudflare R2 via generic variables or specific fallbacks
const REGION = process.env.AWS_REGION || 'auto'
const ENDPOINT = process.env.AWS_ENDPOINT || process.env.R2_ENDPOINT
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY
const BUCKET = process.env.AWS_BUCKET_NAME || process.env.R2_BUCKET_NAME

if (!ACCESS_KEY || !SECRET_KEY || !BUCKET) {
  console.warn('[Storage] Missing storage credentials (AWS_... or R2_...)')
}

const s3Client = new S3Client({
  region: REGION,
  endpoint: ENDPOINT, // Optional for standard AWS S3, required for R2
  credentials: {
    accessKeyId: ACCESS_KEY || '',
    secretAccessKey: SECRET_KEY || '',
  },
  forcePathStyle: true, // Needed for R2/MinIO, usually harmless for S3
})

export async function uploadHtml(key: string, html: string): Promise<void> {
  if (!BUCKET) throw new Error('Storage bucket not configured')

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: html,
    ContentType: 'text/html',
    CacheControl: 'public, max-age=3600',
  }))
}

export async function deleteObject(key: string): Promise<void> {
  if (!BUCKET) return

  await s3Client.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }))
}

export async function objectExists(key: string): Promise<boolean> {
  if (!BUCKET) return false

  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }))
    return true
  } catch {
    return false
  }
}

export async function purgeCache(urls: string[]): Promise<void> {
  const token = process.env.CF_API_TOKEN
  const zoneId = process.env.CF_ZONE_ID
  if (!token || !zoneId) return

  try {
    await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    })
  } catch (err) {
    console.error('[Purge] Failed to purge cache', err)
  }
}
