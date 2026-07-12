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
code_asset: examples/ui-vocabulary-site/src/components/interactive-data-table.tsx
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
export function InteractiveDataTable({ rows }: InteractiveDataTableProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))

  const toggleAll = () =>
    setSelected((current) => (current.length === rows.length ? [] : rows.map((row) => row.id)))

  const allSelected = rows.length > 0 && selected.length === rows.length

  return (
    <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <header className="flex items-center justify-between gap-4 border-b p-4">
        <p className="text-sm text-muted-foreground">{rows.length} members</p>
        {selected.length > 0 ? (
          <Button size="sm" type="button" variant="outline" onClick={() => setSelected([])}>
            Archive {selected.length}
          </Button>
        ) : null}
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox aria-label="Select all rows" checked={allSelected} onCheckedChange={toggleAll} />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} data-state={selected.includes(row.id) ? "selected" : undefined}>
              <TableCell>
                <Checkbox aria-label={`Select ${row.name}`} checked={selected.includes(row.id)} onCheckedChange={() => toggle(row.id)} />
              </TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-muted-foreground">{row.role}</TableCell>
              <TableCell className="text-muted-foreground">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
