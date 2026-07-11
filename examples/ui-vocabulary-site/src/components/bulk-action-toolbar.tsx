import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type BulkAction = {
  id: string
  label: string
  variant?: "default" | "outline" | "destructive"
  onAction: () => void
}

type BulkActionToolbarProps = {
  selectedCount: number
  visibleCount: number
  totalMatchingCount?: number
  onClearSelection: () => void
  onSelectAllMatching?: () => void
  actions: BulkAction[]
}

/**
 * Floating toolbar bound to a table/list selection model: it only renders
 * once selectedCount > 0, always shows an explicit count and a clear action,
 * and offers "select all N matching filter" only when every visible row is
 * already selected and more rows exist behind the current filter (builds on
 * `interactive-data-table`'s selection state rather than owning its own).
 */
export function BulkActionToolbar({
  selectedCount,
  visibleCount,
  totalMatchingCount,
  onClearSelection,
  onSelectAllMatching,
  actions,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null

  const allVisibleSelected = selectedCount === visibleCount
  const canSelectAllMatching =
    allVisibleSelected && typeof totalMatchingCount === "number" && totalMatchingCount > selectedCount

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card p-2 text-card-foreground">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="secondary">{selectedCount} selected</Badge>
        <Button size="sm" variant="ghost" onClick={onClearSelection}>
          Clear
        </Button>
        {canSelectAllMatching ? (
          <Button size="sm" variant="link" onClick={onSelectAllMatching}>
            Select all {totalMatchingCount} matching filter
          </Button>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            variant={action.variant === "destructive" ? "destructive" : "outline"}
            onClick={action.onAction}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
