import { useMemo, useState } from 'react'
import { LibraryView } from './components/LibraryView'
import { NavBar, type View } from './components/NavBar'
import { QuestionForm } from './components/QuestionForm'
import { ResultsView } from './components/ResultsView'
import { laws, questions } from './engine/data'
import { evaluate } from './engine/engine'
import type { Answers } from './engine/types'
import { mandatoryQuestionsAnswered } from './lib/formState'

export default function App() {
  const [view, setView] = useState<View>('assessment')
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = mandatoryQuestionsAnswered(answers)
  const showResults = submitted && canSubmit

  const grouped = useMemo(() => evaluate(laws, answers, questions), [answers])

  function handleAnswerChange(questionId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar view={view} onNavigate={setView} />
      {view === 'library' ? (
        <LibraryView />
      ) : showResults ? (
        <ResultsView grouped={grouped} onEditAnswers={() => setSubmitted(false)} />
      ) : (
        <QuestionForm answers={answers} onAnswerChange={handleAnswerChange} onSubmit={() => setSubmitted(true)} />
      )}
    </div>
  )
}
