import type { ReactNode } from "react"
import { MeshGradientSurface } from "@/components/mesh-gradient-surface"

const GRAIN_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
)

type GrainTextureOverlayProps = {
  children?: ReactNode
  className?: string
  /** 0..1 — how visible the grain reads; keep subtle (default 0.28). */
  strength?: number
}

/**
 * Grain texture overlay: an SVG feTurbulence noise tile layered above the
 * surface with soft-light blending — kills gradient banding and adds film
 * texture (tier ①, SVG data-URI, zero JS). The noise layer is aria-hidden
 * decoration and must never carry content or intercept pointer events.
 */
export function GrainTextureOverlay({ children, className, strength = 0.28 }: GrainTextureOverlayProps) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{ backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`, opacity: strength }}
      />
    </div>
  )
}

/** Colocated demo: grain over a mesh gradient — exactly the banding-prone case the overlay exists for. */
export function GrainTextureOverlayDemo() {
  return (
    <GrainTextureOverlay className="w-full max-w-2xl rounded-lg border">
      <MeshGradientSurface className="flex h-64 items-center justify-center">
        <div className="px-8 text-center">
          <p className="text-sm font-medium text-foreground">Grain over gradient</p>
          <p className="mt-1 break-keep text-sm text-muted-foreground">feTurbulence 노이즈가 그라디언트 배너딩을 지우고 필름 질감을 더합니다.</p>
        </div>
      </MeshGradientSurface>
    </GrainTextureOverlay>
  )
}
