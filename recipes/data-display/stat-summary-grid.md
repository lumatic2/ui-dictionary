---
id: stat-summary-grid
name: "Stat Summary Grid"
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
  - dimension.space.2
  - dimension.space.4
  - dimension.space.8
  - dimension.radius.md
  - typography.scale.sm
  - typography.scale.xl
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/home-page.tsx
component_refs: []
term_refs: [stat-list, dashboard-grid, status-indicator]
source_refs: [tailwind-plus-application-ui]
last_verified: 2026-07-10
---

## Intent

A stat summary grid gives a small set of operational measures a consistent hierarchy: label, current value, and a contextual trend or status. It supports quick orientation at the top of a real dashboard; it is not a license to fabricate metrics for decorative proof.

## Anatomy

- Section label or time range that defines the measurement context.
- Peer stat cells with label, value, and optional trend/status.
- Shared alignment and number formatting for comparison.
- Optional link to the detailed report, separate from the value itself.

## States

- Stable value with no trend when comparison is unavailable.
- Positive, negative, or neutral trend with text as well as color.
- Loading placeholder that preserves final dimensions.
- Unavailable data shown as an explicit message, not a misleading zero.

## Variants

- Bordered cells in an application dashboard.
- Unframed summary band above a table.
- Compact status list for an operations overview.
- Dark monitoring surface using the same semantic hierarchy.

## Code

```tsx
const dashboardStats = [
  { label: "Active workspaces", value: "24", trend: "+3 this week" },
  { label: "Checks passing", value: "98%", trend: "Stable" },
  { label: "Pending reviews", value: "6", trend: "2 due today" },
]

function StatSummaryGrid() {
  return (
    <section aria-labelledby="summary-title">
      <div className="flex items-end justify-between gap-4">
        <div><h2 id="summary-title">Workspace summary</h2><p className="text-muted-foreground">Last seven days</p></div>
        <a href="/reports">Open report</a>
      </div>
      <dl className="mt-6 grid grid-cols-1 border sm:grid-cols-3">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="border-b p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="mt-2 text-3xl font-medium text-foreground">{stat.value}</dd>
            <p className="mt-1 text-sm text-muted-foreground">{stat.trend}</p>
          </div>
        ))}
      </dl>
    </section>
  )
}
```

## Checks

- Every value names its unit, time range, and comparison context where relevant.
- Trend meaning is conveyed in text, not color alone.
- Unavailable data is distinct from a valid zero.
- Values align and wrap without pushing peer cells out of the grid.
- Metrics come from the named product workflow rather than generic dashboard filler.

## Anti-patterns

- **Fake proof metrics**: arbitrary revenue, users, or conversion numbers decorate a hero with no data source or product meaning.
- **Color-only trend**: red/green arrows provide no semantic label.
- **Card wall**: every number sits in a heavy independent card, weakening comparison.
- **Mixed time windows**: peer values compare daily, monthly, and lifetime measures without labels.

## Agent notes

- prompt_phrases: "operational stat grid with named time range and text trends", "compact dashboard summary without generic KPI decoration"
- fallbacks: use a status list when values are categorical rather than numeric.
- canonical guidance: `docs/design-system/principles.md` principles 2 and 4.
