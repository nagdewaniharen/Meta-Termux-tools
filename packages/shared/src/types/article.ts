export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface Article {
  id         : string
  title      : string
  body       : string
  excerpt    : string
  slug       : string
  tags       : string[]
  keywords   : string[]
  status     : ArticleStatus
  created_at : string
  updated_at : string
}
