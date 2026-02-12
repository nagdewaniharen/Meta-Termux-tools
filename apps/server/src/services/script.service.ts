import { prisma }                from '@/lib/db'
import { NotFoundError }        from '@meta/shared'
import type { ScriptInput }     from '@meta/shared'

export async function getScripts(limit: number = 20, offset: number = 0, status?: string) {
  const where = status ? { status: status as 'active' | 'inactive' } : {}
  const [items, total] = await Promise.all([
    prisma.script.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.script.count({ where }),
  ])
  return { items, total }
}

export async function getScript(id: string) {
  const script = await prisma.script.findUnique({ where: { id } })
  if (!script) throw new NotFoundError('Script')
  return script
}

export async function createScript(data: ScriptInput) {
  return prisma.script.create({ data })
}

export async function updateScript(id: string, data: ScriptInput) {
  const script = await prisma.script.findUnique({ where: { id } })
  if (!script) throw new NotFoundError('Script')
  return prisma.script.update({ where: { id }, data })
}

export async function deleteScript(id: string) {
  const script = await prisma.script.findUnique({ where: { id } })
  if (!script) throw new NotFoundError('Script')
  await prisma.pageScript.deleteMany({ where: { script_id: id } })
  await prisma.campaignScript.deleteMany({ where: { script_id: id } })
  return prisma.script.delete({ where: { id } })
}

export async function updateScriptStatus(id: string, status: 'active' | 'inactive') {
  return prisma.script.update({ where: { id }, data: { status } })
}

export async function getGlobalScripts() {
  return prisma.script.findMany({
    where:   { is_global: true, status: 'active' },
    orderBy: { created_at: 'asc' },
  })
}

// ── page-level script attach / detach ───────────────────────

async function resolvePageId(pageSlug: string): Promise<string> {
  const page = await prisma.page.findUnique({ where: { slug: pageSlug } })
  if (!page) throw new NotFoundError(`Page "${pageSlug}"`)
  return page.id
}

export async function addScriptToPage(pageSlug: string, scriptId: string, order: number = 0) {
  const pageId = await resolvePageId(pageSlug)
  await getScript(scriptId) // throws if missing

  return prisma.pageScript.create({
    data: { page_id: pageId, script_id: scriptId, order },
  })
}

export async function removeScriptFromPage(pageSlug: string, scriptId: string) {
  const pageId = await resolvePageId(pageSlug)

  const deleted = await prisma.pageScript.deleteMany({
    where: { page_id: pageId, script_id: scriptId },
  })
  if (deleted.count === 0) throw new NotFoundError('PageScript association')
  return { success: true }
}

// ── replace: swap oldScriptId → newScriptId everywhere ─────

export async function replaceScriptOnPages(
  oldScriptId: string,
  newScriptId: string,
  targetPages?: string[]
) {
  await getScript(oldScriptId)
  await getScript(newScriptId)

  // resolve target page IDs (or all pages if not specified)
  let pageIds: string[]
  if (targetPages && targetPages.length > 0) {
    const pages = await prisma.page.findMany({ where: { slug: { in: targetPages } } })
    pageIds = pages.map((p) => p.id)
  } else {
    const pages = await prisma.page.findMany()
    pageIds = pages.map((p) => p.id)
  }

  // 1. replace in PageScript
  const pageScriptUpdates = prisma.pageScript.updateMany({
    where: { script_id: oldScriptId, page_id: { in: pageIds } },
    data:  { script_id: newScriptId },
  })

  // 2. replace in CampaignScript for campaigns targeting those pages
  const campaigns = await prisma.campaign.findMany({ where: { status: 'active' } })
  const allSlugs  = await prisma.page.findMany().then((ps) => ps.map((p) => p.slug))
  const slugs: string[] = targetPages && targetPages.length > 0 ? targetPages : allSlugs
  const matchingCampaignIds = campaigns
    .filter((c) => (c.target_pages as string[]).some((s) => slugs.includes(s)))
    .map((c) => c.id)

  const campaignScriptUpdates = prisma.campaignScript.updateMany({
    where: { script_id: oldScriptId, campaign_id: { in: matchingCampaignIds } },
    data:  { script_id: newScriptId },
  })

  const [psResult, csResult] = await Promise.all([pageScriptUpdates, campaignScriptUpdates])

  return {
    pages_updated:    psResult.count,
    campaigns_updated: csResult.count,
  }
}

// ── propagate: finalize a script after campaign test ────────
// mode "new_only"     → adds to PageScript only (campaigns inherit via page)
// mode "all_existing" → adds to PageScript AND every active campaign targeting those pages

export async function propagateScript(
  scriptId: string,
  mode: 'new_only' | 'all_existing',
  targetPages?: string[]
) {
  await getScript(scriptId)

  // resolve target pages
  const slugs = targetPages && targetPages.length > 0
    ? targetPages
    : (await prisma.page.findMany().then((ps) => ps.map((p) => p.slug)))

  const pages = await prisma.page.findMany({ where: { slug: { in: slugs } } })

  // 1. add to PageScript for each target page (skip if already exists)
  const pagePromises = pages.map(async (page) => {
    const existing = await prisma.pageScript.findUnique({
      where: { page_id_script_id: { page_id: page.id, script_id: scriptId } },
    })
    if (!existing) {
      return prisma.pageScript.create({
        data: { page_id: page.id, script_id: scriptId, order: 99 },
      })
    }
    return null
  })

  const pageResults = await Promise.all(pagePromises)
  const pagesAdded = pageResults.filter(Boolean).length

  // 2. if all_existing → also push into every active campaign targeting these pages
  let campaignsAdded = 0
  if (mode === 'all_existing') {
    const campaigns = await prisma.campaign.findMany({ where: { status: 'active' } })
    const matching = campaigns.filter((c) =>
      (c.target_pages as string[]).some((s) => slugs.includes(s))
    )

    const campaignPromises = matching.map(async (campaign) => {
      const existing = await prisma.campaignScript.findUnique({
        where: { campaign_id_script_id: { campaign_id: campaign.id, script_id: scriptId } },
      })
      if (!existing) {
        await prisma.campaignScript.create({
          data: { campaign_id: campaign.id, script_id: scriptId, is_active: true, order: 99 },
        })
        return true
      }
      return false
    })

    const results = await Promise.all(campaignPromises)
    campaignsAdded = results.filter(Boolean).length
  }

  return { pages_added: pagesAdded, campaigns_added: campaignsAdded, mode }
}
