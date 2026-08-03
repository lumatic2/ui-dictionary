/**
 * Askewly Design (M18) — block-owned wiring, replaces dashboard-01's
 * tanstack/dnd-kit data-table with composed Askewly code assets:
 * interactive-data-table + recoverable-empty-state + actionable-toast.
 * The composed assets are imported, never modified (block contract §3).
 */
import { useMemo, useRef, useState } from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { ActionableToast, type Toast } from "@/components/actionable-toast"
import { InteractiveDataTable, type DataTableRow } from "@/components/interactive-data-table"
import { RecoverableEmptyState } from "@/components/recoverable-empty-state"

export function MembersTable({ rows }: { rows: DataTableRow[] }) {
  const [query, setQuery] = useState("")
  const [archivedIds, setArchivedIds] = useState<string[]>([])
  const [toast, setToast] = useState<Toast | null>(null)
  const lastArchivedRef = useRef<string[]>([])

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter((row) => !archivedIds.includes(row.id))
      .filter((row) => (q ? `${row.name} ${row.role}`.toLowerCase().includes(q) : true))
  }, [rows, query, archivedIds])

  const archiveVisible = () => {
    lastArchivedRef.current = visibleRows.map((row) => row.id)
    setArchivedIds((current) => [...current, ...lastArchivedRef.current])
    setToast({
      id: `archive-${Date.now()}`,
      title: `Archived ${lastArchivedRef.current.length} members`,
      duration: 6000,
      undoable: true,
    })
  }

  const undoArchive = () => {
    const undone = new Set(lastArchivedRef.current)
    setArchivedIds((current) => current.filter((id) => !undone.has(id)))
    setToast(null)
  }

  return (
    <section className="flex flex-col gap-3 px-4 lg:px-6">
      <div className="relative w-full max-w-xs">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Search members"
          className="pl-9"
          placeholder="Search members…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {visibleRows.length > 0 ? (
        <InteractiveDataTable rows={visibleRows} />
      ) : (
        <RecoverableEmptyState
          kind={query ? "search" : "filtered"}
          query={query || undefined}
          onRecover={() => {
            setQuery("")
            setArchivedIds([])
          }}
        />
      )}
      {toast ? (
        <div className="fixed right-4 bottom-4 z-50">
          <ActionableToast toast={toast} onDismiss={() => setToast(null)} onUndo={undoArchive} />
        </div>
      ) : null}
      {visibleRows.length > 0 ? (
        <button
          className="self-start text-sm text-muted-foreground underline-offset-4 hover:underline"
          type="button"
          onClick={archiveVisible}
        >
          Archive all visible (demo of toast + undo)
        </button>
      ) : null}
    </section>
  )
}
