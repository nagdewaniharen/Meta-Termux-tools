import { z } from 'zod'

export const scriptSchema = z.object({
  name:        z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  code:        z.string().min(1, 'Code is required'),
  position:    z.enum(['head_start', 'head_end', 'body_start', 'body_end']),
  is_global:   z.boolean().default(false),
})

export const campaignSchema = z.object({
  name:            z.string().min(1, 'Name is required').max(100),
  description:     z.string().max(500).optional(),
  target_pages:    z.array(z.string()).min(1, 'Select at least one page'),
  target_keywords: z.array(z.string()).default([]),
})

export const pageUpdateSchema = z.object({
  title:       z.string().min(1).max(200),
  description: z.string().min(1).max(500),
})

// ── script propagation (finalize after campaign test) ──────
export const propagateScriptSchema = z.object({
  mode:         z.enum(['new_only', 'all_existing']),
  target_pages: z.array(z.string()).optional(), // if omitted → all pages
})

// ── script replacement (swap old → new across pages/campaigns) ─
export const replaceScriptSchema = z.object({
  new_script_id: z.string().min(1),
  target_pages:  z.array(z.string()).optional(), // if omitted → everywhere
})

// ── attach / detach script on a page ────────────────────────
export const pageScriptSchema = z.object({
  script_id: z.string().min(1),
  order:     z.number().int().min(0).default(0),
})

export type ScriptInput          = z.infer<typeof scriptSchema>
export type CampaignInput        = z.infer<typeof campaignSchema>
export type PageUpdateInput      = z.infer<typeof pageUpdateSchema>
export type PropagateScriptInput = z.infer<typeof propagateScriptSchema>
export type ReplaceScriptInput   = z.infer<typeof replaceScriptSchema>
export type PageScriptInput      = z.infer<typeof pageScriptSchema>
