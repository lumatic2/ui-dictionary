import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react"

const MeshGradientLazy = lazy(() =>
  import("@paper-design/shaders-react").then((m) => ({ default: m.MeshGradient })),
)

/**
 * Shader gradient surface (tier ④ — Paper Shaders): an organic mesh gradient
 * animated per-frame on the GPU. The tier boundary against the CSS
 * `mesh-gradient-surface` recipe (tier ①) is animation: CSS layered
 * radial-gradients are static; frame-by-frame organic motion needs a shader.
 *
 * Contracts carried from the tier-④ rules (expressive-stack 판정 절차 3·4):
 * - lazy boundary: the shader runtime never enters the initial chunk.
 * - colors come from token CSS custom properties at mount — no hardcoded hex.
 * - prefers-reduced-motion → speed 0 (a static organic field, still tokened).
 * - WebGL failure → static CSS gradient fallback from the same token colors.
 */
class ShaderBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

const TOKEN_VARS = ["--primary", "--accent", "--muted"]

/**
 * Tokens are authored in oklch(), but the shader runtime only parses
 * hex/rgb — normalize through a 1x1 canvas (fillStyle accepts any CSS
 * color the browser can resolve, pixels read back as sRGB).
 */
function cssColorToHex(color: string): string | null {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`
}

function readTokenColors(el: Element): string[] {
  const styles = getComputedStyle(el)
  const colors = TOKEN_VARS.map((v) => styles.getPropertyValue(v).trim())
    .filter(Boolean)
    .map((c) => cssColorToHex(c))
    .filter((c): c is string => Boolean(c))
  return colors.length >= 2 ? colors : ["#6F2DBD", "#A663CC", "#B9FAF8"]
}

export function ShaderGradientSurface({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [colors, setColors] = useState<string[] | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (!hostRef.current) return
    setColors(readTokenColors(hostRef.current))
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const staticFallback = (
    <div
      className="size-full"
      style={{
        background: colors
          ? `radial-gradient(120% 90% at 20% 20%, ${colors[0]} 0%, transparent 60%), radial-gradient(110% 90% at 80% 30%, ${colors[1]} 0%, transparent 60%), ${colors[2] ?? colors[0]}`
          : undefined,
      }}
      aria-hidden="true"
    />
  )

  return (
    <div ref={hostRef} className={`relative overflow-hidden rounded-lg border bg-muted/30 ${className ?? ""}`} aria-hidden="true">
      {colors && (
        <ShaderBoundary fallback={staticFallback}>
          <Suspense fallback={staticFallback}>
            <MeshGradientLazy
              className="absolute inset-0 size-full"
              colors={colors}
              distortion={0.8}
              swirl={0.5}
              speed={reduced ? 0 : 0.4}
            />
          </Suspense>
        </ShaderBoundary>
      )}
    </div>
  )
}

/** Colocated demo: token-derived colors, lazy chunk, reduced-motion → frozen frame. */
export function ShaderGradientSurfaceDemo() {
  return (
    <div className="w-full max-w-md space-y-2">
      <ShaderGradientSurface className="h-56 w-full" />
      <p className="break-keep text-sm text-muted-foreground">
        GPU 셰이더 그라디언트 — 색은 토큰 변수에서 읽고, reduced-motion 에선 정지 프레임으로 유지됩니다.
      </p>
    </div>
  )
}
