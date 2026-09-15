import { questions } from '../engine/data'
import type { Answers, Question } from '../engine/types'
import { mandatoryQuestionsAnswered } from '../lib/formState'

function isSelected(question: Question, answers: Answers, answerId: string): boolean {
  const val = answers[question.id]
  if (val == null) return false
  return Array.isArray(val) ? val.includes(answerId) : val === answerId
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        selected
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  )
}

function QuestionField({
  question,
  answers,
  onChange,
}: {
  question: Question
  answers: Answers
  onChange: (value: string | string[]) => void
}) {
  function toggle(answerId: string) {
    if (question.type === 'single_select') {
      onChange(answerId)
      return
    }
    const current = Array.isArray(answers[question.id]) ? (answers[question.id] as string[]) : []
    const next = current.includes(answerId) ? current.filter((v) => v !== answerId) : [...current, answerId]
    onChange(next)
  }

  return (
    <fieldset>
      <legend className="flex items-baseline gap-2 text-base font-semibold text-slate-900">
        {question.prompt}
        {question.mandatory ? (
          <span className="text-xs font-medium text-red-600">required</span>
        ) : (
          <span className="text-xs font-medium text-slate-400">optional</span>
        )}
      </legend>
      <p className="mt-1 text-sm text-slate-500">{question.help}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {question.answers.map((a) => (
          <OptionButton
            key={a.id}
            label={a.label}
            selected={isSelected(question, answers, a.id)}
            onClick={() => toggle(a.id)}
          />
        ))}
      </div>
    </fieldset>
  )
}

export function QuestionForm({
  answers,
  onAnswerChange,
  onSubmit,
}: {
  answers: Answers
  onAnswerChange: (questionId: string, value: string | string[]) => void
  onSubmit: () => void
}) {
  const ready = mandatoryQuestionsAnswered(answers)

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Which regulations apply to your business?</h1>
      <p className="mt-2 text-sm text-slate-600">
        Answer the questions below — the four marked "required" are enough to see your results. The rest sharpen
        the answer.
      </p>
      <p className="mt-2 text-xs text-slate-400">Runs entirely in your browser. Nothing you enter is stored or sent anywhere.</p>

      <form
        className="mt-8 space-y-8"
        onSubmit={(e) => {
          e.preventDefault()
          if (ready) onSubmit()
        }}
      >
        {questions.map((q) => (
          <QuestionField
            key={q.id}
            question={q}
            answers={answers}
            onChange={(value) => onAnswerChange(q.id, value)}
          />
        ))}

        <div className="sticky bottom-4 flex justify-end">
          <button
            type="submit"
            disabled={!ready}
            className={`rounded-md px-5 py-2.5 text-sm font-semibold shadow-sm ${
              ready
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'cursor-not-allowed bg-slate-200 text-slate-400'
            }`}
          >
            {ready ? 'See your results' : 'Answer the required questions to continue'}
          </button>
        </div>
      </form>
    </div>
  )
}
