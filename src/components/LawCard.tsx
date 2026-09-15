import type { Law } from '../engine/types'
import { CAT_META, priBadge, TYPE_META } from '../lib/meta'

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
      aria-hidden
    >
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  )
}

function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function LawCard({ law, open, onToggle }: { law: Law; open: boolean; onToggle: () => void }) {
  const cat = CAT_META[law.cat]
  const pri = priBadge(law)
  const type = TYPE_META[law.type]
  const isVoluntary = law.tier_override === 'recommend'
  const contentId = `${law.id}-content`

  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 shadow-sm ${cat.border} border-l-4`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={contentId}
        className={`w-full px-4 py-3 text-left ${cat.bg} cursor-pointer`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h3 className="text-base font-bold text-slate-900">{law.name}</h3>
              <span className="text-sm text-slate-500">{law.id.replace(/_/g, ' ')}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className={`rounded px-1.5 py-0.5 font-medium ${cat.pill}`}>{cat.label}</span>
              <span className={`rounded px-1.5 py-0.5 font-medium ${type.pill}`}>{type.label}</span>
              <span className={`rounded px-1.5 py-0.5 font-medium ${pri.pill}`}>{pri.label}</span>
              <span>{law.year}</span>
            </div>
            {!open && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{law.smb}</p>}
          </div>
          <ChevronIcon open={open} />
        </div>
      </button>

      {open && (
        <div id={contentId} className="divide-y divide-slate-100 bg-white">
          {law.tier_reason && (
            <div className="flex gap-2 bg-indigo-50 px-4 py-2.5">
              <span className="text-indigo-500" aria-hidden>
                ⓘ
              </span>
              <div>
                <div className="text-[11px] font-bold tracking-wide text-indigo-700 uppercase">Why this tier</div>
                <div className="mt-0.5 text-sm text-slate-700">{law.tier_reason}</div>
              </div>
            </div>
          )}
          <div className="px-4 py-2.5">
            <div className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Scope</div>
            <div className="mt-0.5 text-sm text-slate-700">{law.scope}</div>
          </div>
          <div className="px-4 py-2.5">
            <div className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">SMB relevance</div>
            <div className="mt-0.5 text-sm text-slate-700">{law.smb}</div>
          </div>
          {law.ai.length > 0 && (
            <div className="bg-violet-50 px-4 py-2.5">
              <div className="text-[11px] font-bold tracking-wide text-violet-700 uppercase">AI implications</div>
              <ul className="mt-0.5 list-disc space-y-1 pl-4 text-sm text-slate-700">
                {law.ai.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          <div className={isVoluntary ? 'bg-slate-50 px-4 py-2.5' : 'bg-red-50 px-4 py-2.5'}>
            <div
              className={`text-[11px] font-bold tracking-wide uppercase ${isVoluntary ? 'text-slate-500' : 'text-red-700'}`}
            >
              {isVoluntary ? 'Enforcement (voluntary)' : 'Enforcement'}
            </div>
            <div className="mt-0.5 text-sm text-slate-700">{law.enf}</div>
          </div>
          <div className={`px-4 py-2.5 ${cat.bg}`}>
            <div className={`text-[11px] font-bold tracking-wide uppercase ${cat.text}`}>Recommended action</div>
            <div className="mt-0.5 text-sm text-slate-700">{law.act}</div>
          </div>
          <div className="flex items-center justify-between gap-3 bg-slate-50 px-4 py-2.5">
            <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Source</span>
            <a
              href={law.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
            >
              Read the official text
              <span className="text-slate-400">({sourceHost(law.source)})</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                <path d="M6.5 4a.75.75 0 000 1.5h4.19L4.22 12.97a.75.75 0 101.06 1.06L11.75 7.6v4.19a.75.75 0 001.5 0v-6a.75.75 0 00-.75-.75h-6z" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
