import { prisma }                                        from '@/lib/db'
import { NotFoundError }                                 from '@meta/shared'
import { uploadHtml, deleteObject, objectExists, purgeCache } from '@/lib/storage'
import { getR2PublicUrl }                                from '@/lib/config'
import { renderPage }                                   from '@/renderers/base.renderer'

export async function previewPage(slug: string): Promise<string> {
  const page = await prisma.page.findUnique({ where: { slug } })
  if (!page) throw new NotFoundError('Page')
  return renderPage(page.slug)
}

export async function publishPage(slug: string): Promise<{ url: string }> {
  const page = await prisma.page.findUnique({ where: { slug } })
  if (!page) throw new NotFoundError('Page')

  const html = await renderPage(page.slug)
  const key  = page.slug === 'homepage' ? 'index' : page.slug

  await uploadHtml(key, html)

  await prisma.page.update({
    where: { id: page.id },
    data: {
      live_html:  html,
      draft_html: html,
      status:     'published',
      version:    { increment: 1 },
    },
  })

  const baseUrl = getR2PublicUrl()
  const url     = page.slug === 'homepage' ? `${baseUrl}/` : `${baseUrl}/${page.slug}`

  await purgeCache([url])

  return { url }
}

export async function unpublishPage(slug: string): Promise<void> {
  const page = await prisma.page.findUnique({ where: { slug } })
  if (!page) throw new NotFoundError('Page')

  const key = page.slug === 'homepage' ? 'index' : page.slug
  await deleteObject(key)

  await prisma.page.update({
    where: { id: page.id },
    data:  { status: 'draft', live_html: null },
  })
}

export async function rollbackPage(slug: string): Promise<void> {
  const page = await prisma.page.findUnique({ where: { slug } })
  if (!page) throw new NotFoundError('Page')
  if (!page.live_html) throw new Error('No published version to rollback to')

  await prisma.page.update({
    where: { id: page.id },
    data:  { draft_html: page.live_html },
  })
}

export async function getPagePublishStatus(slug: string): Promise<{ published: boolean; url: string }> {
  const page = await prisma.page.findUnique({ where: { slug } })
  if (!page) throw new NotFoundError('Page')

  const key       = page.slug === 'homepage' ? 'index' : page.slug
  const published = await objectExists(key)

  const baseUrl = getR2PublicUrl()
  const url     = page.slug === 'homepage' ? `${baseUrl}/` : `${baseUrl}/${page.slug}`

  return { published, url }
}
