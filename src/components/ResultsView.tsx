import { lawById } from '../engine/data'
import type { GroupedResults } from '../engine/types'
import { TIER_META, TIER_ORDER } from '../lib/meta'
import { ExpandCollapseControls } from './ExpandCollapseControls'
import { LawCard } from './LawCard'
import { useOpenSet } from '../lib/useOpenSet'

export function ResultsView({ grouped, onEditAnswers }: { grouped: GroupedResults; onEditAnswers: () => void }) {
  const allIds = TIER_ORDER.flatMap((tier) => grouped[tier] ?? [])
  const total = allIds.length
  const { open, toggle, expandAll, collapseAll } = useOpenSet()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your regulatory profile</h1>
          <p className="mt-1 text-sm text-slate-600">
            {total} {total === 1 ? 'law or framework' : 'laws and frameworks'} surfaced based on your answers.
          </p>
        </div>
        <button
          type="button"
          onClick={onEditAnswers}
          className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit answers
        </button>
      </div>

      <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        This runs entirely in your browser — nothing you enter here is stored or sent anywhere.
      </p>

      {total > 0 && (
        <div className="mt-6 flex justify-end">
          <ExpandCollapseControls onExpandAll={() => expandAll(allIds)} onCollapseAll={collapseAll} />
        </div>
      )}

      <div className="mt-4 space-y-10">
        {TIER_ORDER.map((tier) => {
          const ids = grouped[tier]
          if (!ids || ids.length === 0) return null
          const meta = TIER_META[tier]
          return (
            <section key={tier}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} aria-hidden />
                <h2 className={`text-sm font-bold tracking-wide uppercase ${meta.text}`}>{meta.label}</h2>
                <span className="text-xs text-slate-400">({ids.length})</span>
              </div>
              <div className="space-y-4">
                {ids.map((id) => (
                  <LawCard key={id} law={lawById[id]} open={open.has(id)} onToggle={() => toggle(id)} />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {total === 0 && (
        <p className="mt-10 rounded-md border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
          No laws surfaced for this profile — double-check your answers if that seems unexpected.
        </p>
      )}
    </div>
  )
}
