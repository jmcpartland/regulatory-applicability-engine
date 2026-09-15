export function ExpandCollapseControls({ onExpandAll, onCollapseAll }: { onExpandAll: () => void; onCollapseAll: () => void }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <button type="button" onClick={onExpandAll} className="font-medium text-blue-700 hover:underline">
        Expand all
      </button>
      <span className="text-slate-300" aria-hidden>
        |
      </span>
      <button type="button" onClick={onCollapseAll} className="font-medium text-blue-700 hover:underline">
        Collapse all
      </button>
    </div>
  )
}
