import { Component, lazy, Suspense, type ReactNode } from "react"

const ThreeObjectSceneImpl = lazy(() => import("@/components/three-object-scene-impl"))

/**
 * Lazy three.js object scene: the R3F/three.js module (~155KB gzip fixed
 * cost) sits behind a dynamic import, so the main bundle never carries it —
 * the mandatory tier-④ pattern from knowledge/expressive-stack.md. Suspense
 * shows a skeleton while the chunk loads; a boundary catches WebGL/context
 * failures and renders a static fallback instead of a broken canvas.
 */
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export function LazyThreeObjectScene({ className }: { className?: string }) {
  const staticFallback = (
    <div className="flex h-full items-center justify-center">
      <p className="break-keep px-6 text-center text-sm text-muted-foreground">3D를 사용할 수 없는 환경입니다 — 콘텐츠는 이 정적 대체로 유지됩니다.</p>
    </div>
  )

  return (
    <div className={`overflow-hidden rounded-lg border bg-muted/30 ${className ?? ""}`}>
      <SceneBoundary fallback={staticFallback}>
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading 3D scene…</p>
            </div>
          }
        >
          <ThreeObjectSceneImpl />
        </Suspense>
      </SceneBoundary>
    </div>
  )
}

/** Colocated demo: the lazy boundary is the demo — watch the loading state, then the token-colored object. */
export function LazyThreeObjectSceneDemo() {
  return <LazyThreeObjectScene className="h-64 w-full max-w-md" />
}
