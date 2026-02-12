export type CampaignStatus = 'draft' | 'active' | 'paused' | 'archived'

export interface Campaign {
  id              : string
  name            : string
  description     : string | null
  status          : CampaignStatus
  target_pages    : string[]
  target_keywords : string[]
  created_at      : string
  updated_at      : string
}

export interface CampaignScript {
  campaign_id: string
  script_id: string
  is_active: boolean
  order: number
}
