---
id: permission-matrix-editor-grid
name: "Permission Matrix Editor Grid"
pattern_group: data-display
kind: block
status: draft
surface_refs: [internal-tools, saas-dashboards]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.raised
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.action.primary
  - color.semantic.action.destructive
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/permission-matrix-editor-grid.tsx
component_refs: [button]
term_refs: [permission-matrix-editor]
source_refs: [retool-user-permissions-template]
last_verified: 2026-07-12
---

## Intent

A permission matrix editor grid implements the `permission-matrix-editor` term's role-by-permission table as an editable, high-density admin surface: both axes stay readable while scrolling a large matrix, explicit grants are visually distinct from inherited ones, and a batch of checkbox edits stays pending behind a diff step instead of writing to the backend on every click. This is the interaction shape Retool-style admin templates and workspace role-settings screens repeat once a permission table grows past a handful of rows and columns.

## Anatomy

- Sticky row header: permission/module label, one per row.
- Sticky column header: role name, one per column.
- Per-cell control: a checkbox with three visual states — granted, inherited, denied.
- Dangerous-permission highlight: a badge on rows like "delete all" or "billing admin" that carries elevated risk.
- Bulk toggle: an entire row or column can be set at once (not modeled per-cell only).
- Diff banner: appears once any cell changes, states the pending change count, and offers commit or discard before anything is saved.

## States

- Clean: no pending changes — the diff banner is absent, not present-but-disabled.
- Pending edits: one or more cells changed since the last commit; the banner shows the exact count.
- Inherited cell: shown as granted but visually marked "inherited" rather than indistinguishable from an explicit grant.
- Dangerous permission row: carries a persistent risk badge regardless of grant state, so risk is visible even before scanning individual cells.
- Committed: pending state clears and the banner disappears after a successful save.

## Variants

- Full matrix with bulk row/column toggle (default, this recipe) for workspace-wide role administration.
- Read-only audit variant that renders the same grid without checkboxes, for reviewing current grants without edit risk.
- Single-role column view when only one role's permissions are being reviewed, dropping the multi-column sticky-header need.

## Code

```tsx
export function PermissionMatrixEditorGrid({ roles, permissions, cellState, pendingChangeCount, onToggleCell, onCommit, onDiscard }: PermissionMatrixEditorGridProps) {
  return (
    <section className="flex flex-col gap-2 overflow-hidden rounded-md border bg-card text-card-foreground">
      {pendingChangeCount > 0 ? (
        <div className="flex items-center justify-between gap-3 border-b bg-muted/50 px-4 py-2 text-sm">
          <span>{pendingChangeCount} unsaved permission change{pendingChangeCount === 1 ? "" : "s"}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onDiscard}>Discard</Button>
            <Button size="sm" onClick={onCommit}>Save changes</Button>
          </div>
        </div>
      ) : null}
      <div className="overflow-auto">
        <Table>
          {/* sticky permission-row header, sticky role-column header, per-cell checkbox with granted/inherited/denied state */}
        </Table>
      </div>
    </section>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/permission-matrix-editor-grid.tsx`.

## Checks

- No pending change renders no diff banner (not a disabled/empty one).
- Toggling a cell never writes immediately — it only updates local pending state until commit.
- Inherited grants are visually distinguishable from explicit ones, not just implied by tooltip.
- Dangerous-permission rows carry their risk badge in every state, not only when changed.
- Discard reverts every pending cell back to the last committed state, not just the most recent toggle.

## Anti-patterns

- **Silent auto-save per checkbox**: writing each toggle immediately removes the operator's chance to review a batch of changes before they take effect on live access control.
- **Inherited and explicit grants rendered identically**: an operator cannot tell whether revoking a cell actually removes access or just masks an inherited grant that persists elsewhere.
- **Risk badge only on hover or expand**: burying the dangerous-permission signal behind an interaction defeats its purpose — it must be scannable in the default row view.
- **Unbounded horizontal table with no sticky headers**: past a handful of roles, losing the permission-row label while scrolling right makes every cell ambiguous.

## Agent notes

- prompt_phrases: "역할을 열로 권한을 행으로 배치하고 저장 전 diff를 보여주는 permission matrix editor grid를 만들어줘", "위험한 권한에 경고 배지가 있는 편집 가능한 권한 매트릭스를 넣어줘"
- fallbacks: if the role/permission count is small (a handful of each), a simpler per-role permission-prompt list is an acceptable reduced variant — do not force the sticky dual-axis grid on a table that fits on one screen without scrolling.
- component composition: builds on the same term (`permission-matrix-editor`) that already defines the concept; this recipe is the grid-interaction structure (sticky headers, diff-before-commit), not a new concept.
