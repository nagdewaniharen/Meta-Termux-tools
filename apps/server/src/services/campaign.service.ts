import { prisma }                from '@/lib/db'
import { NotFoundError }        from '@meta/shared'
import type { CampaignInput }   from '@meta/shared'

export async function getCampaigns(limit: number = 20, offset: number = 0, status?: string) {
  const where = status
    ? { status: status as 'draft' | 'active' | 'paused' | 'archived' }
    : {}
  const [items, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.campaign.count({ where }),
  ])
  return { items, total }
}

export async function getCampaign(id: string) {
  const campaign = await prisma.campaign.findUnique({ where: { id } })
  if (!campaign) throw new NotFoundError('Campaign')
  return campaign
}

export async function createCampaign(data: CampaignInput) {
  return prisma.campaign.create({ data })
}

export async function updateCampaign(id: string, data: CampaignInput) {
  const campaign = await prisma.campaign.findUnique({ where: { id } })
  if (!campaign) throw new NotFoundError('Campaign')
  return prisma.campaign.update({ where: { id }, data })
}

export async function deleteCampaign(id: string) {
  const campaign = await prisma.campaign.findUnique({ where: { id } })
  if (!campaign) throw new NotFoundError('Campaign')
  await prisma.campaignScript.deleteMany({ where: { campaign_id: id } })
  return prisma.campaign.delete({ where: { id } })
}

export async function updateCampaignStatus(
  id: string,
  status: 'draft' | 'active' | 'paused' | 'archived'
) {
  return prisma.campaign.update({ where: { id }, data: { status } })
}

export async function getCampaignScripts(campaignId: string) {
  return prisma.campaignScript.findMany({
    where:   { campaign_id: campaignId },
    include: { script: true },
    orderBy: { order: 'asc' },
  })
}

export async function addScriptToCampaign(campaignId: string, scriptId: string, order: number = 0) {
  return prisma.campaignScript.create({
    data: { campaign_id: campaignId, script_id: scriptId, is_active: true, order },
  })
}

export async function removeScriptFromCampaign(campaignId: string, scriptId: string) {
  return prisma.campaignScript.delete({
    where: { campaign_id_script_id: { campaign_id: campaignId, script_id: scriptId } },
  })
}

export async function getActiveCampaignsForPage(pageSlug: string) {
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'active' },
    include: {
      scripts: {
        where:   { is_active: true },
        include: { script: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  return campaigns.filter((c: { target_pages: unknown }) => {
    const targets = c.target_pages as string[]
    return targets.includes(pageSlug)
  })
}
