import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type ContentGridAction = {
  label: string
  run: () => void
}

export type ContentGridItem = {
  id: string
  title: string
  description: string
  status?: string
  actions?: ContentGridAction[]
}

type ResponsiveContentGridProps = {
  items: ContentGridItem[]
}

/**
 * Responsive content grid: one column on mobile, up to three on wide
 * screens, in stable source (and keyboard) order. Every item and its text
 * wrapper carries `min-w-0` so titles truncate instead of forcing overflow.
 */
export function ResponsiveContentGrid({ items }: ResponsiveContentGridProps) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="min-w-0 rounded-lg border bg-card p-6 text-card-foreground">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-base font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
              {item.status ? <Badge variant="secondary">{item.status}</Badge> : null}
            </div>
            {item.actions?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {item.actions.map((action) => (
                  <Button key={action.label} size="sm" type="button" variant="outline" onClick={action.run}>
                    {action.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

const baseItems: Omit<ContentGridItem, "actions">[] = [
  { id: "item-1", title: "Design tokens", description: "Primitive, semantic, and component-scoped values.", status: "Stable" },
  { id: "item-2", title: "Recipe library", description: "Anatomy, states, and checks for reusable UI patterns.", status: "Draft" },
  { id: "item-3", title: "Canvas registry", description: "Recipes wired into the Insert palette for direct reuse.", status: "In progress" },
]

/**
 * Colocated demo: peer items with a per-card action wired to local state,
 * so the grid's `min-w-0`/reading-order contract can be seen with content
 * that actually changes.
 */
export function ResponsiveContentGridDemo() {
  const [openedId, setOpenedId] = useState<string | null>(null)

  const items: ContentGridItem[] = baseItems.map((item) => ({
    ...item,
    actions: [{ label: "Open", run: () => setOpenedId(item.id) }],
  }))

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveContentGrid items={items} />
      {openedId ? <p className="text-sm text-muted-foreground">Opened "{openedId}".</p> : null}
    </div>
  )
}
