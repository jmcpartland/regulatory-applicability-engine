import { laws } from '../engine/data'
import { CAT_META, CAT_ORDER } from '../lib/meta'
import { useOpenSet } from '../lib/useOpenSet'
import { ExpandCollapseControls } from './ExpandCollapseControls'
import { LawCard } from './LawCard'

export function LibraryView() {
  const allIds = laws.map((l) => l.id)
  const { open, toggle, expandAll, collapseAll } = useOpenSet()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Law & framework library</h1>
          <p className="mt-1 text-sm text-slate-600">
            All {laws.length} entries in the dataset, independent of any assessment answers — browse everything the
            engine knows about. This is a curated set of major U.S. federal and state privacy, cybersecurity, and AI
            law, key international regulations, and recommended frameworks — not an exhaustive legal database.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <ExpandCollapseControls onExpandAll={() => expandAll(allIds)} onCollapseAll={collapseAll} />
      </div>

      <div className="mt-4 space-y-10">
        {CAT_ORDER.map((cat) => {
          const inCat = laws.filter((l) => l.cat === cat)
          if (inCat.length === 0) return null
          const meta = CAT_META[cat]
          return (
            <section key={cat}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} aria-hidden />
                <h2 className={`text-sm font-bold tracking-wide uppercase ${meta.text}`}>{meta.label}</h2>
                <span className="text-xs text-slate-400">({inCat.length})</span>
              </div>
              <div className="space-y-4">
                {inCat.map((law) => (
                  <LawCard key={law.id} law={law} open={open.has(law.id)} onToggle={() => toggle(law.id)} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
