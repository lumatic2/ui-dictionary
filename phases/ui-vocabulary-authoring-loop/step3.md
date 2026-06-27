# UI Vocabulary Authoring Loop Step 3

Date: 2026-06-27
Topic: shadcn-block-patterns
Status: local verified, not deployed

## Scope

Covered the remaining shadcn `registry:block` surface by reusable block/pattern concepts instead of copying numbered examples one by one.

The shadcn `registry:ui` surface was already covered in Step 1 and Step 2. This step focused on:

- sidebar block variants
- dashboard overview composition
- chart block variants

## Added Terms

Structure blocks:

- `dashboard-overview-page`
- `sidebar-dashboard-layout`
- `collapsible-sidebar-layout`
- `icon-sidebar-layout`
- `inset-sidebar-layout`
- `right-sidebar-layout`
- `dual-sidebar-layout`
- `file-tree-sidebar-layout`
- `calendar-sidebar-layout`
- `sidebar-dialog-layout`

Data-display blocks:

- `area-chart-card`
- `bar-chart-card`
- `line-chart-card`
- `pie-chart-card`
- `radar-chart-card`
- `radial-chart-card`
- `interactive-chart-card`
- `stacked-chart-card`
- `chart-tooltip-pattern`
- `chart-kpi-card`

## Duplicate Handling

This batch intentionally did not add shadcn numbered blocks as separate terms such as `sidebar-01`, `sidebar-02`, `login-01`, or `chart-area-default`.

The split used here:

- Existing component terms cover atomic parts such as `sidebar-nav`, `collapsible-sidebar`, `dashboard-grid`, `chart`, `chart-axis`, and `legend`.
- Step 2 already covers auth blocks such as `login-page`, `split-auth-layout`, and `signup-form`.
- Step 3 covers reusable block concepts that map across multiple shadcn examples.

## Verification

- `python scripts/validate-ui-vocabulary.py`: passed, 398 terms
- `npm run build:data`: passed, generated 398 terms
- `node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates`: passed, 0 candidates, 0 warnings
- `npm run build`: passed
- `npm run lint`: passed with existing shadcn fast-refresh warnings only
- Chrome local smoke at `http://127.0.0.1:5173/`: passed

Smoke queries:

- `sidebar layout`: 7 results, includes sidebar block variants with `블록` badge
- `dashboard overview`: 1 result, includes `Dashboard overview page`
- `area chart card`: 1 result, includes `Area chart card`
- `radar chart card`: 1 result, includes `Radar chart card`
- `chart tooltip`: 1 result, includes `Chart tooltip pattern`

## Deployment

Not deployed. This batch should be deployed after user approval.
