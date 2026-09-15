import { useCallback, useMemo, useState } from 'react'

export function useOpenSet() {
  const [open, setOpen] = useState<Set<string>>(new Set())

  const toggle = useCallback((id: string) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const expandAll = useCallback((ids: string[]) => setOpen(new Set(ids)), [])
  const collapseAll = useCallback(() => setOpen(new Set()), [])

  return useMemo(() => ({ open, toggle, expandAll, collapseAll }), [open, toggle, expandAll, collapseAll])
}
