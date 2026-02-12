export const SCRIPT_POSITIONS = {
  HEAD_START: 'head_start',
  HEAD_END: 'head_end',
  BODY_START: 'body_start',
  BODY_END: 'body_end',
} as const

export type ScriptPosition = typeof SCRIPT_POSITIONS[keyof typeof SCRIPT_POSITIONS]

export const POSITION_LABELS: Record<ScriptPosition, string> = {
  head_start: 'Head - Start',
  head_end: 'Head - End',
  body_start: 'Body - Start',
  body_end: 'Body - End',
}
