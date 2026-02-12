export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export function getR2PublicUrl(): string {
  return process.env.AWS_PUBLIC_URL || process.env.R2_PUBLIC_URL || ''
}
