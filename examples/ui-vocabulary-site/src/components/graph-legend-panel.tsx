// Harvested from second-brain/poc-graph legend & filter sidebar
// (brain.askewly.com), 2026-08-04 (docs/design-system/harvest-contract.md §4).
// Category colors are data (consumer-owned palette), not styling literals.

export type LegendEntry = {
  id: string
  label: string
  /** Any CSS color the consumer's palette defines for this category. */
  color: string
  count: number
  active: boolean
}

type GraphLegendPanelProps = {
  title: string
  /** e.g. "161 notes · 534 connections". */
  meta?: string
  entries: LegendEntry[]
  onToggle: (id: string) => void
}

/**
 * Graph legend panel: the sidebar of a data-graph view — a titled legend
 * where every row is simultaneously a color key and a filter toggle (dot,
 * label, count badge). Toggled-off categories dim but keep their count so
 * the totals stay auditable. Category colors arrive as data from the
 * consumer's palette; the panel owns layout and interaction only.
 */
export function GraphLegendPanel({ title, meta, entries, onToggle }: GraphLegendPanelProps) {
  return (
    <aside className="w-64 rounded-lg border bg-card p-4 text-card-foreground">
      <h2 className="text-sm font-semibold">{title}</h2>
      {meta ? <p className="mt-0.5 font-mono text-xs text-muted-foreground">{meta}</p> : null}
      <ul className="mt-3 space-y-1">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onToggle(entry.id)}
              aria-pressed={entry.active}
              className={
                entry.active
                  ? "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                  : "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground opacity-50 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              }
            >
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="flex-1 truncate">{entry.label}</span>
              <span className="rounded bg-muted px-1.5 font-mono text-xs tabular-nums text-muted-foreground">{entry.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
