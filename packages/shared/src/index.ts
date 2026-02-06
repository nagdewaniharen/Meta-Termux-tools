// ── types ──────────────────────────────────────────────────
export type { Page, PageStatus }                          from './types/page'
export type { Script, ScriptPosition, ScriptStatus }      from './types/script'
export type { Campaign, CampaignStatus, CampaignScript }  from './types/campaign'
export type { Article, ArticleStatus }                    from './types/article'

// ── constants ──────────────────────────────────────────────
export { PAGE_SLUGS, PAGE_DEFINITIONS }                   from './constants/pages'
export type { PageSlug, PageDefinition }                  from './constants/pages'
export { ROUTES }                                         from './constants/routes'
export { SCRIPT_POSITIONS, POSITION_LABELS }              from './constants/script-positions'

// ── config ─────────────────────────────────────────────────
export { SITE }                                           from './config/site'

// ── validation ─────────────────────────────────────────────
export {
  scriptSchema,
  campaignSchema,
  pageUpdateSchema,
  propagateScriptSchema,
  replaceScriptSchema,
  pageScriptSchema,
} from './validation'
export type {
  ScriptInput,
  CampaignInput,
  PageUpdateInput,
  PropagateScriptInput,
  ReplaceScriptInput,
  PageScriptInput,
} from './validation'

// ── errors ─────────────────────────────────────────────────
export { AppError, NotFoundError, ValidationError, AuthError, toApiError } from './errors'

// ── utils ──────────────────────────────────────────────────
export { escapeHtml }                                     from './utils'
