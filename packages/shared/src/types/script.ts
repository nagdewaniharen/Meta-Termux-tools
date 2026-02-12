export type ScriptPosition = 'head_start' | 'head_end' | 'body_start' | 'body_end'
export type ScriptStatus = 'active' | 'inactive'

export interface Script {
  id: string
  name: string
  description: string | null
  code: string
  position: ScriptPosition
  is_global: boolean
  status: ScriptStatus
  created_at: string
  updated_at: string
}
