import { prisma } from '@/lib/db'
import { NotFoundError } from '@meta/shared'
import { uploadHtml, deleteObject, objectExists, purgeCache } from '@/lib/storage'
import { getR2PublicUrl } from '@/lib/config'
import {
    generateLandingPageContent,
    type GenerateLandingPageInput,
} from './landing-page-ai.service'
import { renderLandingPage } from '@/renderers/landing-page.renderer'


// ── generate + create (draft) ─────────────────────────────────
export async function createLandingPage(input: GenerateLandingPageInput) {
    console.log(`[Service] Generating landing page: "${input.title}"`)

    try {
        // 1) call AI to generate structured content
        const generated = await generateLandingPageContent(input)
        console.log(`[Service] AI content generated. Slug: ${generated.slug}`)

        // 2) check slug uniqueness — append timestamp if needed
        let slug = generated.slug
        const existing = await prisma.landingPage.findUnique({ where: { slug } })
        if (existing) {
            slug = `${generated.slug}-${Date.now()}`
        }

        // 3) render HTML
        const safeCreatives = input.creatives || []
        const html = renderLandingPage(generated, safeCreatives)

        // 4) persist to DB as draft
        const landingPage = await prisma.landingPage.create({
            data: {
                title: input.title,
                slug,
                keyword: input.keyword,
                template: input.template || 'landing',
                description: generated.meta_description,
                creatives: safeCreatives as any,
                generated_html: html,
                status: 'draft',
            },
        })

        console.log(`[Service] Landing page created: ${landingPage.id}`)
        return landingPage
    } catch (error) {
        console.error('[Service] Create Landing Page failed:', error)
        throw error
    }
}

// ── list ─────────────────────────────────────────────────────
export async function getLandingPages(limit = 20, offset = 0) {
    const [items, total] = await Promise.all([
        prisma.landingPage.findMany({
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: offset,
            select: {
                id: true,
                title: true,
                slug: true,
                keyword: true,
                template: true,
                description: true,
                status: true,
                version: true,
                created_at: true,
                updated_at: true,
            },
        }),
        prisma.landingPage.count(),
    ])
    return { items, total }
}

// ── get single ────────────────────────────────────────────────
export async function getLandingPage(id: string) {
    const lp = await prisma.landingPage.findUnique({ where: { id } })
    if (!lp) throw new NotFoundError('LandingPage')
    return lp
}

// ── publish ──────────────────────────────────────────────────
export async function publishLandingPage(id: string): Promise<{ url: string }> {
    const lp = await prisma.landingPage.findUnique({ where: { id } })
    if (!lp) throw new NotFoundError('LandingPage')
    if (!lp.generated_html) throw new Error('No generated HTML to publish')

    // upload to R2/S3
    await uploadHtml(lp.slug, lp.generated_html)

    // update DB
    await prisma.landingPage.update({
        where: { id },
        data: {
            live_html: lp.generated_html,
            status: 'published',
            version: { increment: 1 },
        },
    })

    // build public URL
    const baseUrl = getR2PublicUrl()
    const url = `${baseUrl}/${lp.slug}`

    // purge CDN cache
    try {
        await purgeCache([url])
        console.log(`🔄 CDN cache purged for ${url}`)
    } catch (err) {
        console.warn('⚠️ Cache purge failed:', err)
    }

    console.log(`🎉 Landing page published: ${url}`)
    return { url }
}

// ── unpublish ─────────────────────────────────────────────────
export async function unpublishLandingPage(id: string) {
    const lp = await prisma.landingPage.findUnique({ where: { id } })
    if (!lp) throw new NotFoundError('LandingPage')

    await deleteObject(lp.slug)

    await prisma.landingPage.update({
        where: { id },
        data: { status: 'draft', live_html: null },
    })

    console.log(` Landing page unpublished: ${lp.slug}`)
}

// ── delete ────────────────────────────────────────────────────
export async function deleteLandingPage(id: string) {
    const lp = await prisma.landingPage.findUnique({ where: { id } })
    if (!lp) throw new NotFoundError('LandingPage')

    // remove from R2/S3 if published
    if (lp.status === 'published') {
        try {
            await deleteObject(lp.slug)
        } catch {
            // ignore — may already be gone
        }
    }

    await prisma.landingPage.delete({ where: { id } })
    console.log(` Landing page deleted: ${lp.slug}`)
}
