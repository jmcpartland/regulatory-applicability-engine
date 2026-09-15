import type { ReactNode } from 'react'

export type View = 'assessment' | 'library'

function NavLink({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
        active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )
}

export function NavBar({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <span className="text-sm font-bold text-slate-900">Compliance Check</span>
        <nav className="flex gap-1">
          <NavLink active={view === 'assessment'} onClick={() => onNavigate('assessment')}>
            Assessment
          </NavLink>
          <NavLink active={view === 'library'} onClick={() => onNavigate('library')}>
            Law & framework library
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
