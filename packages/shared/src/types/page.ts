export type PageStatus = 'draft' | 'published' | 'archived'

export interface Page {
  id: string
  slug: string
  title: string
  description: string
  status: PageStatus
  draft_html: string | null
  live_html: string | null
  version: number
  created_at: string
  updated_at: string
}
