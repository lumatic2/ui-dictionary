---
id: bulk-action-toolbar-selection-model
name: "Bulk Action Toolbar with Selection Model"
pattern_group: data-display
kind: block
status: draft
surface_refs: [internal-tools, saas-dashboards]
tokens_used:
  - color.semantic.surface.raised
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.action.destructive
  - color.semantic.border.default
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/bulk-action-toolbar.tsx
component_refs: [interactive-data-table, button]
term_refs: [bulk-action-bar, table, checkbox]
source_refs: [tailwind-plus-application-ui]
last_verified: 2026-07-12
---

> **STOP — do not re-implement this recipe from prose.** A verified code asset exists: fetch https://ui.askewly.com/r/bulk-action-toolbar.json, write `files[].content` into the project, install the declared dependencies, THEN restyle the look to the project's own tokens (mandatory — component-restyle.md). Prose below is the contract you verify against, not the thing you rebuild.

## Intent

A bulk action toolbar turns a table's per-row selection into a single place to act on many rows at once. It appears only once a selection exists, always states the selected count out loud, and offers an explicit way to go beyond the current page — selecting every row that matches the active filter, not just the ones currently rendered. It builds directly on `interactive-data-table`'s selection state rather than defining a second, competing selection model.

## Anatomy

- Selected count: a badge or label stating how many rows are selected.
- Clear selection: always-visible action that resets selection to none.
- Select-all-matching-filter: appears only when every visible row is selected and more rows exist behind the current filter; offers to extend selection to all matches, not just the current page.
- Bulk actions: primary/secondary buttons for the available operations (e.g. archive, export); destructive actions (e.g. delete) are visually distinct from non-destructive ones.
- Placement: docked at the top or bottom of the table region so it stays reachable while scrolling.

## States

- Hidden: no rows selected — the toolbar renders nothing rather than an empty bar.
- Partial selection: some rows selected; count reflects the exact number, select-all-matching is not offered.
- All-visible selected: every rendered row is selected; if the table's total (post-filter) count is larger, the select-all-matching affordance appears.
- All-matching selected: user has extended selection beyond the visible page; count reflects the full matching total.
- Destructive action pending: a destructive bulk action (e.g. delete) routes through `destructive-confirmation` before executing — it never fires directly from the toolbar.

## Variants

- Sticky/floating bar anchored to the table (default) for desktop and tablet data operations.
- Compact variant with icon-only actions for dense internal-tool tables where horizontal space is scarce.
- Read-only variant with only "export selected" when no destructive or mutating action applies.

## Code

```tsx
export function BulkActionToolbar({ selectedCount, visibleCount, totalMatchingCount, onClearSelection, onSelectAllMatching, actions }: BulkActionToolbarProps) {
  if (selectedCount === 0) return null
  const allVisibleSelected = selectedCount === visibleCount
  const canSelectAllMatching = allVisibleSelected && typeof totalMatchingCount === "number" && totalMatchingCount > selectedCount

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card p-2 text-card-foreground">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="secondary">{selectedCount} selected</Badge>
        <Button size="sm" variant="ghost" onClick={onClearSelection}>Clear</Button>
        {canSelectAllMatching ? (
          <Button size="sm" variant="link" onClick={onSelectAllMatching}>Select all {totalMatchingCount} matching filter</Button>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <Button key={action.id} size="sm" variant={action.variant === "destructive" ? "destructive" : "outline"} onClick={action.onAction}>
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/bulk-action-toolbar.tsx`. Consumes the same row/selection shape as `interactive-data-table` — it does not own selection state, it renders based on it.

## Checks

- Toolbar renders nothing when selectedCount is 0 (no empty bar with disabled buttons).
- Selected count is always numerically accurate, including after select-all-matching-filter expands the selection.
- Select-all-matching-filter only appears when every visible row is already selected and the total exceeds the visible count.
- Destructive bulk actions require a confirmation step before executing.
- Clear selection resets to zero and re-hides the toolbar.

## Anti-patterns

- **Always-visible empty toolbar**: showing a disabled bulk-action bar with 0 selected wastes space and implies actions exist when they don't.
- **Silent full-selection lie**: labeling a "select all" checkbox as selecting everything when it only selects the current page misleads users operating on large filtered sets.
- **Undifferentiated destructive action**: styling delete the same as archive/export invites accidental data loss.
- **Selection state duplicated in the toolbar**: keeping a second copy of selected IDs inside the toolbar component instead of reading the table's selection model causes drift between the two.

## Agent notes

- prompt_phrases: "테이블에서 행을 선택하면 상단에 선택 개수와 일괄 작업 버튼이 나타나는 bulk action toolbar를 만들어줘", "필터에 맞는 전체 선택 옵션이 있는 bulk action toolbar를 테이블 위에 추가해줘"
- fallbacks: if a floating/sticky toolbar isn't feasible, an inline row directly above the table header is an acceptable substitute — do not hide bulk actions inside a per-row menu once more than one row is selected.
- component composition: assembles on top of `interactive-data-table`'s selection and filter state — do not fork a parallel selection model for this recipe.
