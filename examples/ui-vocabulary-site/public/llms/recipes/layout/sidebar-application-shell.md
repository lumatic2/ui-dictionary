---
id: sidebar-application-shell
name: "Sidebar Application Shell"
pattern_group: layout
kind: block
status: draft
surface_refs: [saas-dashboards, internal-tools, documentation]
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
  - dimension.space.8
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/sidebar-application-shell.tsx
component_refs: []
term_refs: [app-shell, sidebar-nav, collapsible-sidebar, sidebar-dashboard-layout]
source_refs: [tailwind-plus-application-ui]
last_verified: 2026-07-10
---

> Code asset (start here, then restyle to project tokens): https://ui.askewly.com/r/sidebar-application-shell.json

## Intent

A sidebar application shell gives repeated product navigation a stable rail while keeping the task surface flexible. It is appropriate for dashboards, internal tools, and documentation products where users move among peer work areas many times per session.

## Anatomy

- Sidebar rail: brand or workspace identity, primary navigation, and optional account controls.
- Active item: one unmistakable selected state, not a second primary CTA.
- Main surface: `minmax(0, 1fr)` content that owns its own max width and overflow.
- Mobile trigger: opens the same navigation model as a temporary sheet or drawer.

## States

- Expanded: labels and icons are visible.
- Collapsed: icons retain accessible names and active state.
- Mobile closed/open: navigation leaves the content flow and restores focus on dismiss.
- Long navigation: the rail scrolls independently while account actions remain reachable.

## Variants

- Light rail with bordered content.
- Dark rail with semantic text contrast.
- Compact icon rail for dense operator tools.
- Sidebar with a top header when global actions must remain separate from section navigation.

## Code

```tsx
export function SidebarApplicationShell({ items, activeId, onSelect, children }: SidebarApplicationShellProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="grid min-h-[28rem] overflow-hidden rounded-lg border bg-background lg:grid-cols-[auto_minmax(0,1fr)]">
      <aside className={cn("flex flex-col gap-1 border-b bg-card p-2 lg:border-b-0 lg:border-r", expanded ? "lg:w-56" : "lg:w-16")}>
        <button
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className="mb-1 inline-flex size-9 items-center justify-center self-start rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
          type="button"
          onClick={() => setExpanded((value) => !value)}
        >
          <PanelLeftIcon aria-hidden="true" className="size-4" />
        </button>
        <nav aria-label="Workspace" className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = item.id === activeId
            const Icon = item.icon
            return (
              <button
                key={item.id}
                aria-current={isActive ? "page" : undefined}
                aria-label={expanded ? undefined : item.label}
                className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition", isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground")}
                type="button"
                onClick={() => onSelect(item.id)}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {expanded ? <span className="truncate">{item.label}</span> : null}
              </button>
            )
          })}
        </nav>
      </aside>
      <main className="min-w-0 overflow-y-auto bg-background p-6">{children}</main>
    </div>
  )
}
```

## Checks

- The rail represents repeated peer navigation, not one page's local filters.
- Active state is exposed with `aria-current` and a visible semantic surface change.
- Collapse controls preserve accessible names and do not strand keyboard focus.
- Main content uses `min-w-0`; tables and code cannot force the rail off-screen.
- Mobile behavior uses a dismissible overlay or sheet and restores focus to its trigger.

## Anti-patterns

- **Permanent desktop rail squeezed onto mobile**: labels and content become unusably narrow instead of switching to a temporary surface.
- **Icon-only mystery navigation**: collapsed items lose accessible labels and tooltips.
- **Two independent scroll pages**: body and sidebar scroll unpredictably without a deliberate sticky/overflow model.
- **Every item looks active**: filled rows erase the current-location signal.

## Agent notes

- prompt_phrases: "responsive application shell with collapsible sidebar and stable content column", "operator dashboard rail with explicit active state"
- fallbacks: use a topbar when there are fewer than four peer destinations or navigation is infrequent.
- canonical guidance: `docs/design-system/principles.md` principles 1, 2, and 5.
