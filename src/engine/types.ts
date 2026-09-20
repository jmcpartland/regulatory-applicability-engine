export interface TriggerNode {
  always?: boolean
  q?: string
  in?: string[]
  any?: TriggerNode[]
  all?: TriggerNode[]
  not?: TriggerNode
}

export interface Law {
  id: string
  name: string
  cat: 'us_fed' | 'us_state' | 'intl' | 'fw'
  type: 'comprehensive' | 'sectoral' | 'transparency' | 'data_adm' | 'framework'
  year: string
  pri: 'critical' | 'important' | 'watch'
  scope: string
  smb: string
  trigger: TriggerNode
  tier_override?: string
  tier_override_map?: Record<string, string>
  tier_reason?: string
  ai: string[]
  enf: string
  act: string
  /** Link to the official source text (statute, regulator page, or standards body page). */
  source: string
}

export interface QuestionAnswer {
  id: string
  label: string
}

export interface Question {
  id: string
  order: number
  type: 'single_select' | 'multi_select'
  prompt: string
  help: string
  answers: QuestionAnswer[]
  mandatory: boolean
  default?: string
}

/** A single question's answer: one id (single_select), several ids (multi_select), or unanswered. */
export type AnswerValue = string | string[] | null | undefined

export type Answers = Record<string, AnswerValue>

/** Tri-state trigger result: true (matches), false (explicitly doesn't), null (unknown). */
export type TriState = boolean | null

export const TIERS = ['baseline', 'applies', 'pending', 'verify', 'recommend', 'watch'] as const

export type Tier = (typeof TIERS)[number]

export type GroupedResults = Partial<Record<Tier, string[]>>
