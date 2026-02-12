export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  PAGES: '/pages',
  PAGE_EDIT: (id: string) => `/pages/${id}/edit`,
  SCRIPTS: '/scripts',
  SCRIPT_NEW: '/scripts/new',
  SCRIPT_EDIT: (id: string) => `/scripts/${id}/edit`,
  CAMPAIGNS: '/campaigns',
  CAMPAIGN_NEW: '/campaigns/new',
  CAMPAIGN_EDIT: (id: string) => `/campaigns/${id}/edit`,
  ANALYTICS: '/analytics',
  SWAGGER: '/swagger',
} as const
