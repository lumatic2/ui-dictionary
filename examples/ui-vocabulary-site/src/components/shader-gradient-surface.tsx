import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react"

import { readCssVarsAsHex } from "@/lib/css-color"

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

export function ShaderGradientSurface({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [colors, setColors] = useState<string[] | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (!hostRef.current) return
    const read = readCssVarsAsHex(hostRef.current, TOKEN_VARS)
    setColors(read.length >= 2 ? read : null)
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  // Token vars straight from CSS — also covers the case where hex
  // normalization is unavailable (no canvas): the shader is skipped and
  // this static field still renders from the same tokens.
  const staticFallback = (
    <div
      className="size-full"
      style={{
        background: `radial-gradient(120% 90% at 20% 20%, var(--primary) 0%, transparent 60%), radial-gradient(110% 90% at 80% 30%, var(--accent) 0%, transparent 60%), var(--muted)`,
      }}
      aria-hidden="true"
    />
  )

  return (
    <div ref={hostRef} className={`relative overflow-hidden rounded-lg border bg-muted/30 ${className ?? ""}`} aria-hidden="true">
      {staticFallback}
      {colors && (
        <ShaderBoundary fallback={null}>
          <Suspense fallback={null}>
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
