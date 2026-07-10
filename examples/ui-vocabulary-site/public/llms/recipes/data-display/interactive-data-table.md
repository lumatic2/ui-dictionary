---
id: interactive-data-table
name: "Interactive Data Table"
pattern_group: data-display
kind: block
status: draft
surface_refs: [saas-dashboards, internal-tools, commerce]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.raised
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.action.primary
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/App.tsx
component_refs: [button]
term_refs: [table, data-grid, data-table-toolbar, table-density-control, table-row-actions]
source_refs: [tailwind-plus-application-ui]
last_verified: 2026-07-10
---

## Intent

An interactive data table supports scanning and acting on structured records while preserving column meaning. Selection, sorting, filtering, density, and row actions are added only when the user task needs them; the table remains readable without those controls.

## Anatomy

- Toolbar: query, filters, bulk actions, and result count when applicable.
- Header: stable column labels and optional sort controls.
- Body: one record per row with a durable row key.
- Selection and actions: explicit checkbox state, bulk summary, and row-level menu.
- Responsive fallback: stacked priority fields or a deliberate reduced column set.

## States

- Default and hover for scanning.
- Selected rows with observable count and reversible bulk state.
- Sorted column with direction announced in the header.
- Empty results with filter-reset guidance.
- Loading, error, and narrow-screen fallbacks that retain column meaning.

## Variants

- Read-only comparison table.
- Selectable operations table with bulk actions.
- Dense table for high-frequency operator work.
- Responsive stacked records when horizontal comparison is secondary.

## Code

```tsx
function InteractiveDataTable({ rows }: { rows: UserRow[] }) {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (id: string) => setSelected((current) =>
    current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
  )
  return (
    <section className="border bg-card text-card-foreground">
      <header className="flex items-center justify-between gap-4 border-b p-4">
        <p className="text-sm text-muted-foreground">{rows.length} members</p>
        {selected.length > 0 && <button type="button">Archive {selected.length}</button>}
      </header>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr><th scope="col">Select</th><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Status</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td><input aria-label={`Select ${row.name}`} checked={selected.includes(row.id)} type="checkbox" onChange={() => toggle(row.id)} /></td>
                <th scope="row">{row.name}</th><td>{row.role}</td><td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
```

## Checks

- Headers use table semantics and sorting exposes direction to assistive technology.
- Row keys and selection use stable IDs, not visual positions.
- Empty filtered results explain the filter and offer a reset action.
- Narrow screens preserve priority fields or stack records without unlabeled values.
- Bulk actions appear only when selection is non-empty and show the affected count.

## Anti-patterns

- **Table-shaped div grid**: visual columns have no header relationships for assistive technology.
- **Position-based selection**: sorting changes which record a checked index represents.
- **Every feature enabled**: filters, density, pagination, and bulk actions add noise without a user task.
- **Horizontal scroll as the only mobile plan**: primary record identity and action disappear off-screen.

## Agent notes

- prompt_phrases: "semantic selectable data table with stable IDs and mobile fallback", "operator table with explicit bulk action state"
- fallbacks: use a list when records have few comparable fields or each row is primarily a navigation target.
- canonical guidance: `docs/design-system/principles.md` principles 1, 2, and 5.
