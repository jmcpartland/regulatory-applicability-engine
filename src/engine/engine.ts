/**
 * Applicability engine evaluator.
 *
 * Resolves each law's trigger against a user's answers using tri-state logic
 * (true / false / null-for-unknown) and assigns a tier. This is a direct port
 * of eval.py — that file is the contract; keep the two in sync.
 */
import type { Answers, GroupedResults, Law, Question, Tier, TriggerNode, TriState } from './types'

/**
 * Fill in defaults for unanswered OPTIONAL questions. Mandatory questions are
 * gated by the UI (form cannot submit without them), so if one is missing here
 * it stays unknown and its dependent laws fall to 'verify' — a signal that the
 * input was incomplete. Returns a new object; does not mutate the input.
 */
export function applyDefaults(answers: Answers, questions: Question[]): Answers {
  const filled: Answers = { ...answers }
  for (const q of questions) {
    if (q.id in filled && filled[q.id] != null) continue
    if (!q.mandatory && q.default !== undefined) {
      filled[q.id] = q.default
    }
  }
  return filled
}

/** Return the user's answer(s) for a question as a Set, or null if unanswered. */
function answerSet(answers: Answers, qid: string): Set<string> | null {
  if (!(qid in answers)) return null
  const val = answers[qid]
  if (val == null) return null
  return new Set(Array.isArray(val) ? val : [val])
}

/**
 * Tri-state resolve of a trigger node.
 * Returns true (matches), false (explicitly does not match), or null (unknown).
 */
export function resolve(node: TriggerNode, answers: Answers): TriState {
  if (node.always) return true

  if (node.q !== undefined) {
    const got = answerSet(answers, node.q)
    if (got === null) return null
    const wanted = node.in ?? []
    return wanted.some((v) => got.has(v))
  }

  if (node.any !== undefined) {
    const results = node.any.map((c) => resolve(c, answers))
    if (results.some((r) => r === true)) return true
    if (results.some((r) => r === null)) return null
    return false
  }

  if (node.all !== undefined) {
    const results = node.all.map((c) => resolve(c, answers))
    if (results.some((r) => r === false)) return false
    if (results.some((r) => r === null)) return null
    return true
  }

  if (node.not !== undefined) {
    const inner = resolve(node.not, answers)
    if (inner === null) return null
    return !inner
  }

  return null
}

/** Assign a tier to a law given the user's answers. Returns 'none' if it doesn't apply. */
export function tierFor(law: Law, answers: Answers): Tier | 'none' {
  const match = resolve(law.trigger, answers)

  // Baseline laws (always-true trigger) — but a voluntary framework marked
  // recommend stays recommend even though its trigger is always-true.
  if (law.trigger.always && match === true) {
    if (law.tier_override === 'recommend') return 'recommend'
    return 'baseline'
  }

  if (match === false) return 'none'

  if (match === null) {
    // Trigger depends on an unanswered question — treat as verify (flag it),
    // but only if at least one branch could plausibly fire. We surface these
    // so the advisor reviews rather than silently dropping them.
    return 'verify'
  }

  // match is true — apply any tier override
  if (law.tier_override) return law.tier_override as Tier

  // per-answer override map (e.g. PCI reduced scope via third-party processor)
  if (law.tier_override_map) {
    for (const qidAnswer of Object.values(answers)) {
      const vals = Array.isArray(qidAnswer) ? qidAnswer : [qidAnswer]
      for (const v of vals) {
        if (v != null && v in law.tier_override_map) {
          return law.tier_override_map[v] as Tier
        }
      }
    }
  }

  return 'applies'
}

/** Return laws grouped by tier. Applies optional-question defaults first. */
export function evaluate(laws: Law[], answers: Answers, questions?: Question[]): GroupedResults {
  const finalAnswers = questions ? applyDefaults(answers, questions) : answers
  const grouped: GroupedResults = {}
  for (const law of laws) {
    const t = tierFor(law, finalAnswers)
    if (t === 'none') continue
    ;(grouped[t] ??= []).push(law.id)
  }
  return grouped
}
