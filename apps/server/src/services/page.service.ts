import { prisma } from '@/lib/db'
import { NotFoundError } from '@meta/shared'
import type { PageUpdateInput } from '@meta/shared'

export async function getPages(limit: number = 20, offset: number = 0) {
  const [items, total] = await Promise.all([
    prisma.page.findMany({
      orderBy: { created_at: 'asc' },
      take: limit,
      skip: offset,
    }),
    prisma.page.count(),
  ])
  return { items, total }
}

export async function getPage(id: string) {
  const page = await prisma.page.findUnique({ where: { id } })
  if (!page) throw new NotFoundError('Page')
  return page
}

export async function getPageBySlug(slug: string) {
  const page = await prisma.page.findUnique({ where: { slug } })
  if (!page) throw new NotFoundError('Page')
  return page
}

export async function createPage(data: { title: string; slug: string; description: string; status?: 'draft' | 'published' }) {
  // Ensure slug is unique
  const existing = await prisma.page.findUnique({ where: { slug: data.slug } })
  if (existing) throw new Error('Page with this slug already exists')

  return prisma.page.create({ data })
}

export async function updatePage(id: string, data: PageUpdateInput) {
  const page = await prisma.page.findUnique({ where: { id } })
  if (!page) throw new NotFoundError('Page')
  return prisma.page.update({ where: { id }, data })
}

export async function getPageScripts(pageId: string) {
  return prisma.pageScript.findMany({
    where: { page_id: pageId },
    include: { script: true },
    orderBy: { order: 'asc' },
  })
}

export async function addScriptToPage(pageId: string, scriptId: string, order: number = 0) {
  return prisma.pageScript.create({
    data: { page_id: pageId, script_id: scriptId, order },
  })
}

export async function removeScriptFromPage(pageId: string, scriptId: string) {
  return prisma.pageScript.delete({
    where: { page_id_script_id: { page_id: pageId, script_id: scriptId } },
  })
}
