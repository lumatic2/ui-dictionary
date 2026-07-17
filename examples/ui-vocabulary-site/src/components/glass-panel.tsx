import type { ReactNode } from "react"
import { MeshGradientSurface } from "@/components/mesh-gradient-surface"

type GlassPanelProps = {
  children: ReactNode
  className?: string
}

/**
 * Glass panel: backdrop-filter blur over whatever renders behind it, with a
 * translucent token-derived fill and a hairline border so the panel reads as
 * a surface in both themes (tier ① — GPU-composited, no JS). Content on glass
 * must keep its own contrast: the fill opacity is the knob, not text color.
 */
export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div className={`rounded-lg border border-border/60 bg-background/60 shadow-sm backdrop-blur-md ${className ?? ""}`}>
      {children}
    </div>
  )
}

/** Colocated demo: glass floating over a busy mesh backdrop — the blur is what makes the label legible. */
export function GlassPanelDemo() {
  return (
    <MeshGradientSurface className="flex h-64 w-full max-w-2xl items-center justify-center rounded-lg border">
      <GlassPanel className="mx-6 max-w-sm px-6 py-5">
        <p className="text-sm font-medium text-foreground">Glass panel</p>
        <p className="mt-1 break-keep text-sm text-muted-foreground">배경이 아무리 복잡해도 backdrop-blur가 전경 가독성을 보존합니다. 채도 조절은 텍스트 색이 아니라 fill 불투명도로 합니다.</p>
      </GlassPanel>
    </MeshGradientSurface>
  )
}
