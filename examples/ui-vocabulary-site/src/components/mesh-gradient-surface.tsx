import type { CSSProperties, ReactNode } from "react"

type MeshGradientSurfaceProps = {
  children?: ReactNode
  className?: string
}

/**
 * Mesh gradient surface: several token-derived radial-gradient layers stacked
 * on one element approximate a mesh gradient — pure CSS, zero dependencies,
 * static by default (tier ① in knowledge/expressive-stack.md). Colors are
 * mixed from the project's own --primary/--accent variables via color-mix, so
 * the surface re-themes with the token system instead of hardcoding stops.
 */
export function MeshGradientSurface({ children, className }: MeshGradientSurfaceProps) {
  const style: CSSProperties = {
    backgroundImage: [
      "radial-gradient(42% 55% at 18% 22%, color-mix(in oklch, var(--primary) 34%, transparent) 0%, transparent 100%)",
      "radial-gradient(50% 60% at 82% 18%, color-mix(in oklch, var(--accent) 65%, transparent) 0%, transparent 100%)",
      "radial-gradient(55% 65% at 70% 85%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 100%)",
      "radial-gradient(40% 45% at 12% 88%, color-mix(in oklch, var(--accent) 40%, transparent) 0%, transparent 100%)",
    ].join(", "),
  }

  return (
    <div className={`relative overflow-hidden bg-background ${className ?? ""}`} style={style}>
      {children}
    </div>
  )
}

/** Colocated demo: the surface as a hero-style backdrop with readable foreground copy. */
export function MeshGradientSurfaceDemo() {
  return (
    <MeshGradientSurface className="flex h-64 w-full max-w-2xl items-center justify-center rounded-lg border">
      <div className="px-8 text-center">
        <p className="text-lg font-semibold text-foreground">Token-derived mesh surface</p>
        <p className="mt-1 break-keep text-sm text-muted-foreground">네 개의 radial-gradient 레이어가 프로젝트 토큰에서 파생됩니다.</p>
      </div>
    </MeshGradientSurface>
  )
}
