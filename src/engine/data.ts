import lawsData from '../../data/laws.json'
import questionsData from '../../data/questions.json'
import type { Law, Question } from './types'

export const laws = lawsData.laws as Law[]
export const questions = (questionsData.questions as Question[]).slice().sort((a, b) => a.order - b.order)

export const lawById: Record<string, Law> = Object.fromEntries(laws.map((l) => [l.id, l]))
