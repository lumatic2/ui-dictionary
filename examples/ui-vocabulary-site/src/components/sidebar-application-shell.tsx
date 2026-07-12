import { useState, type ReactNode } from "react"
import { FolderIcon, LayoutGridIcon, PanelLeftIcon, SettingsIcon, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type SidebarShellItem = {
  id: string
  label: string
  icon: LucideIcon
}

type SidebarApplicationShellProps = {
  items: SidebarShellItem[]
  activeId: string
  onSelect: (id: string) => void
  children: ReactNode
}

/**
 * Sidebar application shell: a collapsible navigation rail beside a
 * `min-w-0` main surface. Collapse keeps every item's accessible name
 * (via `aria-label`) and the active item exposes `aria-current="page"`
 * rather than relying on color alone.
 */
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
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
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

const demoItems: SidebarShellItem[] = [
  { id: "overview", label: "Overview", icon: LayoutGridIcon },
  { id: "projects", label: "Projects", icon: FolderIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
]

/**
 * Colocated demo: active-item state lives here, so switching sections
 * updates both `aria-current` and the main surface's content.
 */
export function SidebarApplicationShellDemo() {
  const [activeId, setActiveId] = useState("overview")
  const activeLabel = demoItems.find((item) => item.id === activeId)?.label ?? ""

  return (
    <SidebarApplicationShell activeId={activeId} items={demoItems} onSelect={setActiveId}>
      <h3 className="text-base font-medium text-foreground">{activeLabel}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        This surface owns its own max width and scroll, independent of the sidebar rail.
      </p>
    </SidebarApplicationShell>
  )
}
