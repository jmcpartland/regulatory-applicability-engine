import { questions } from '../engine/data'
import type { Answers } from '../engine/types'

/** The UI must enforce that the 4 mandatory questions are answered before showing results. */
export function mandatoryQuestionsAnswered(answers: Answers): boolean {
  return questions
    .filter((q) => q.mandatory)
    .every((q) => {
      const val = answers[q.id]
      return Array.isArray(val) ? val.length > 0 : val != null
    })
}
