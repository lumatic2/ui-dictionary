---
id: audit-log-filterable-export-feed
name: "Audit Log Filterable Export Feed"
pattern_group: data-display
kind: block
status: draft
surface_refs: [internal-tools, saas-dashboards]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.raised
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.action.primary
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
code_asset: examples/ui-vocabulary-site/src/components/audit-log-filterable-export-feed.tsx
component_refs: [button]
term_refs: [audit-log, activity-feed]
source_refs: [linear-workspace-audit-log]
last_verified: 2026-07-12
---

## Intent

An audit log filterable export feed implements the `audit-log` term's actor/action/target/timestamp record as a filterable, exportable operational surface: filters scope by actor, action type, and date range, and export always applies to the currently active filter rather than silently dumping the full unfiltered table. Unlike `activity-feed`, which reads as a lightweight social/collaboration stream, this recipe is a forensic/compliance record — the column order (actor, action, target, timestamp) stays fixed regardless of filter state, and metadata expands on demand rather than always rendering inline.

## Anatomy

- Filter bar: actor, action type, and date range controls.
- Row: actor, action verb, target entity, timestamp, with metadata available via expand-on-demand.
- Export action: scoped to the current filter (CSV/JSON), never a silent full-table export.
- Empty state: distinguishes "no events match this filter" from "no events have occurred yet."

## States

- Populated with active filter: rows reflect only the current actor/action/date scope; the export label reflects that scope (e.g. "Export filtered").
- No events yet: empty state explains the log is genuinely empty, not filtered down to nothing.
- No matching filter: empty state explains the filter excluded everything and invites resetting it — distinct copy from the "no events yet" case.
- Row expanded: metadata renders inline for that row only, collapsing back on toggle.

## Variants

- Full filter bar + export (default, this recipe) for compliance/forensic review screens.
- Read-only feed without export, for surfaces where export permission is restricted to a subset of operators.
- Compact variant collapsing the date-range control into a single "last 24h/7d/30d" preset selector for lighter-weight admin panels.

## Code

```tsx
export function AuditLogFilterableExportFeed({ entries, actionFilter, onActionFilterChange, hasMatchingFilterButNoEvents, onExport }: AuditLogFilterableExportFeedProps) {
  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4 text-card-foreground">
      {/* filter bar (actor/action/date), export button scoped to filter, actor/action/target/timestamp rows, two distinct empty states */}
    </section>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/audit-log-filterable-export-feed.tsx`.

## Checks

- Export always reflects the currently active filter scope; it never silently exports the full unfiltered table.
- The "no events yet" and "no matching filter" empty states use distinct copy, not one generic empty message.
- Column order (actor, action, target, timestamp) stays fixed across all filter states.
- Metadata is not rendered inline by default — it requires an explicit expand action per row.
- Filtering does not remove or reorder columns, only the row set.

## Anti-patterns

- **Export ignores active filter**: exporting the full table while a filter is applied silently gives the operator more (or different) data than what they reviewed on screen.
- **One generic empty state**: collapsing "no events yet" and "no matching filter" into the same message forces the operator to guess whether the filter or the data is the problem.
- **Always-expanded metadata**: rendering full metadata inline for every row turns a scannable log into a wall of text, defeating the feed's forensic scanning purpose.
- **Treating this as `activity-feed`**: writing collaboration-style narrative copy ("Alice updated the doc") instead of structured actor/action/target/timestamp fields loses the compliance-grade precision this recipe exists for.

## Agent notes

- prompt_phrases: "actor, action, target, timestamp를 필터링하고 필터 범위로 export할 수 있는 audit log를 만들어줘", "감사 로그를 액션 타입과 날짜 범위로 필터링하고 CSV로 내보내는 화면을 넣어줘"
- fallbacks: if export permission is restricted, a read-only variant without the export button is an acceptable reduced variant — do not fabricate a disabled export button as a placeholder.
- component composition: implements the same term (`audit-log`) already in the dictionary; distinguishes itself from `activity-feed` by forensic/compliance intent rather than social/collaboration intent, per the term's own `anti_use` note.
