import { prisma } from '@/lib/db'

export interface TrackingPayload {
  page_slug:      string
  campaign_id?:   string
  script_id?:     string
  event_type?:    string
  referrer?:      string
  user_agent?:    string
  ip_address?:    string
  country_code?:  string
  search_keyword?: string
}

export async function trackEvent(payload: TrackingPayload) {
  return prisma.trackingEvent.create({
    data: {
      page_slug:    payload.page_slug,
      campaign_id:  payload.campaign_id  || null,
      script_id:    payload.script_id    || null,
      event_type:   payload.event_type   || 'pageview',
      referrer:     payload.referrer     || null,
      user_agent:   payload.user_agent   || null,
      ip_address:   payload.ip_address   || null,
      country_code:   payload.country_code   || null,
      search_keyword: payload.search_keyword || null,
    },
  })
}

export async function getTrackingStats(pageSlug?: string, campaignId?: string, period?: string) {
  const now       = new Date()
  let   startDate: Date

  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000); break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break
    default:
      startDate = new Date(now.getTime() -  1 * 24 * 60 * 60 * 1000)
  }

  const dateFilter     = { created_at: { gte: startDate } }
  const pageFilter     = pageSlug   ? { page_slug: pageSlug }       : {}
  const campaignFilter = campaignId ? { campaign_id: campaignId }  : {}
  const baseWhere      = { ...dateFilter, ...pageFilter, ...campaignFilter }

  const [total, byPage, byCampaign] = await Promise.all([
    prisma.trackingEvent.count({ where: baseWhere }),
    prisma.trackingEvent.groupBy({
      by:    ['page_slug'],
      _count: true,
      where: baseWhere,
    }),
    prisma.trackingEvent.groupBy({
      by:    ['campaign_id'],
      _count: true,
      where: { ...baseWhere, campaign_id: { not: null } },
    }),
  ])

  return { total, byPage, byCampaign, period: period || 'day' }
}

export async function getRecentEvents(limit: number = 20, offset: number = 0) {
  const [items, total] = await Promise.all([
    prisma.trackingEvent.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.trackingEvent.count(),
  ])
  return { items, total }
}
