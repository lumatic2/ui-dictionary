import { useState } from "react"
import { Button } from "@/components/ui/button"

/**
 * Focus HUD overlay: a corner heads-up display for exploratory canvases
 * (graph, map, 3D scene) that names what is currently focused — kicker line,
 * large focus title, a hint for the next action, and an "N activated" badge
 * that pairs with highlighted elements on the canvas. The whole overlay is
 * pointer-events-none so it never steals interaction from the surface under
 * it. Semantic tokens; the badge uses primary as its one accent.
 */

type FocusHudOverlayProps = {
  /** Small uppercase context line (e.g. product or mode name). */
  kicker: string
  /** The focused entity's name. Empty hides the HUD body. */
  title: string
  /** One-line hint for what the focus enables next. */
  hint?: string
  /** Count shown in the activation badge; badge hides at undefined. */
  activatedCount?: number
  activatedLabel?: string
}

export function FocusHudOverlay({ kicker, title, hint, activatedCount, activatedLabel = "activated" }: FocusHudOverlayProps) {
  if (!title) {
    return null
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute right-4 top-4 z-10 flex max-w-[16rem] flex-col items-end gap-1.5 text-right"
      data-slot="focus-hud"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{kicker}</p>
      <p className="text-xl font-semibold leading-tight tracking-tight text-foreground">{title}</p>
      {hint ? <p className="text-xs leading-5 text-muted-foreground">{hint}</p> : null}
      {activatedCount !== undefined ? (
        <span className="mt-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
          {activatedCount} {activatedLabel}
        </span>
      ) : null}
    </div>
  )
}

/** Colocated demo: a mock canvas where focusing a node drives the HUD. */
export function FocusHudOverlayDemo() {
  const nodes = [
    { id: "spring", title: "Spring physics", hint: "관련 근거 노드가 함께 빛납니다.", activated: 7 },
    { id: "stagger", title: "Stagger choreography", hint: "탭해서 연결된 기억을 살펴보세요.", activated: 4 },
  ]
  const [focused, setFocused] = useState<(typeof nodes)[number] | null>(nodes[0])

  return (
    <div className="relative h-72 w-full max-w-md overflow-hidden rounded-lg border bg-muted/30 p-4">
      <div className="flex gap-2">
        {nodes.map((node) => (
          <Button
            key={node.id}
            size="sm"
            type="button"
            variant={focused?.id === node.id ? "default" : "outline"}
            onClick={() => setFocused(node)}
          >
            {node.title}
          </Button>
        ))}
        <Button size="sm" type="button" variant="ghost" onClick={() => setFocused(null)}>
          Clear
        </Button>
      </div>

      <FocusHudOverlay
        kicker="Knowledge Universe"
        title={focused?.title ?? ""}
        hint={focused?.hint}
        activatedCount={focused?.activated}
        activatedLabel="memories activated"
      />
    </div>
  )
}
