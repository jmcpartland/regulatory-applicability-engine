import type { Law, Tier } from '../engine/types'

export interface Accent {
  label: string
  border: string
  bg: string
  text: string
  dot: string
  pill: string
}

// Colors carried over from privacy_cyber_laws_reference.jsx's card system:
// each law category there renders with its own accent (left border + tinted
// background), which we reuse here for both the tier groupings in the
// results view and the category/severity/domain badges on each card.
export const TIER_META: Record<Tier, Accent> = {
  applies: {
    label: 'Applies now',
    border: 'border-red-600',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-600',
    pill: 'bg-red-100 text-red-700',
  },
  pending: {
    label: 'In scope — not yet effective',
    border: 'border-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-600',
    pill: 'bg-amber-100 text-amber-700',
  },
  verify: {
    label: 'Probable — verify with an advisor',
    border: 'border-violet-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    dot: 'bg-violet-600',
    pill: 'bg-violet-100 text-violet-700',
  },
  recommend: {
    label: 'Recommended framework',
    border: 'border-teal-600',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    dot: 'bg-teal-600',
    pill: 'bg-teal-100 text-teal-700',
  },
  watch: {
    label: 'Watch',
    border: 'border-slate-400',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    pill: 'bg-slate-100 text-slate-600',
  },
  baseline: {
    label: 'Baseline — applies to everyone',
    border: 'border-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    pill: 'bg-blue-100 text-blue-700',
  },
}

export const TIER_ORDER: Tier[] = ['applies', 'pending', 'verify', 'recommend', 'watch', 'baseline']

// Matches the section order in privacy_cyber_laws_reference.jsx: Federal, State, International, AI, Frameworks.
export const CAT_ORDER: Law['cat'][] = ['federal', 'state', 'intl', 'ai', 'fw']

export const CAT_META: Record<Law['cat'], Accent> = {
  federal: {
    label: 'US Federal',
    border: 'border-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    pill: 'bg-blue-100 text-blue-700',
  },
  state: {
    label: 'US State',
    border: 'border-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-600',
    pill: 'bg-green-100 text-green-700',
  },
  intl: {
    label: 'International',
    border: 'border-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-600',
    pill: 'bg-amber-100 text-amber-700',
  },
  ai: {
    label: 'AI-Specific',
    border: 'border-violet-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    dot: 'bg-violet-600',
    pill: 'bg-violet-100 text-violet-700',
  },
  fw: {
    label: 'Framework & Standard',
    border: 'border-teal-600',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    dot: 'bg-teal-600',
    pill: 'bg-teal-100 text-teal-700',
  },
}

export const PRI_META: Record<Law['pri'], { label: string; pill: string }> = {
  critical: { label: 'Critical', pill: 'bg-red-100 text-red-700' },
  important: { label: 'Important', pill: 'bg-amber-100 text-amber-700' },
  watch: { label: 'Watch', pill: 'bg-slate-100 text-slate-600' },
}

// Voluntary frameworks (tier_override "recommend") are never legally mandatory, so labeling
// them "Critical"/"Important" next to an Enforcement row that says "Voluntary — no penalties"
// sends a mixed signal. Same underlying pri value, reworded to mean "how highly we'd
// prioritize adopting this" rather than "how much legal danger you're in".
export const VOLUNTARY_PRI_META: Record<Law['pri'], { label: string; pill: string }> = {
  critical: { label: 'High priority', pill: 'bg-indigo-100 text-indigo-700' },
  important: { label: 'Medium priority', pill: 'bg-indigo-50 text-indigo-600' },
  watch: { label: 'Low priority', pill: 'bg-slate-100 text-slate-600' },
}

export function priBadge(law: Law): { label: string; pill: string } {
  return law.tier_override === 'recommend' ? VOLUNTARY_PRI_META[law.pri] : PRI_META[law.pri]
}

export const TYPE_META: Record<Law['type'], { label: string; pill: string }> = {
  privacy: { label: 'Privacy', pill: 'bg-blue-100 text-blue-700' },
  cyber: { label: 'Cybersecurity', pill: 'bg-teal-100 text-teal-700' },
  ai_reg: { label: 'AI', pill: 'bg-violet-100 text-violet-700' },
  both: { label: 'Multi-domain', pill: 'bg-slate-100 text-slate-600' },
}
