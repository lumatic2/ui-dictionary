import { Component, lazy, Suspense, useMemo, type ReactNode } from "react"
import type { GlowPoint, GlowPointsSceneImplProps } from "@/components/glow-points-scene-impl"

const GlowPointsSceneImpl = lazy(() => import("@/components/glow-points-scene-impl"))

/**
 * Glow points scene: a luminous point-cloud stage (single Points draw call +
 * custom core/halo shader + UnrealBloom) for knowledge graphs, constellations,
 * and ambient data backdrops. This wrapper keeps three.js (~150KB+ gzip)
 * behind a dynamic import, verifies WebGL support up front, and falls back to
 * a static notice node when the context is unavailable — the scene is an
 * enhancement, never a gate. Rendering only: hover/raycast interaction is
 * intentionally left to the consumer.
 */

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"))
  } catch {
    return false
  }
}

class SceneErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function FallbackNotice({ className }: { className?: string }) {
  return (
    <div className={className} data-slot="glow-points-fallback">
      <div className="grid h-full place-items-center rounded-md border bg-muted/30 p-6 text-center">
        <p className="max-w-[16rem] text-sm text-muted-foreground">
          이 장면은 WebGL 이 있어야 렌더됩니다. 콘텐츠는 아래에서 그대로 볼 수 있어요.
        </p>
      </div>
    </div>
  )
}

export function GlowPointsScene(props: GlowPointsSceneImplProps) {
  const webgl = useMemo(supportsWebGL, [])

  if (!webgl) {
    return <FallbackNotice className={props.className} />
  }

  return (
    <SceneErrorBoundary fallback={<FallbackNotice className={props.className} />}>
      <Suspense fallback={<div className={props.className} data-slot="glow-points-loading" />}>
        <GlowPointsSceneImpl {...props} />
      </Suspense>
    </SceneErrorBoundary>
  )
}

/** Deterministic pseudo-random (LCG) so the demo constellation is stable across runs. */
function makeRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 48271) % 2147483647
    return state / 2147483647
  }
}

/** Colocated demo: a three-cluster constellation with neighbor edges. */
export function GlowPointsSceneDemo() {
  const { points, edges } = useMemo(() => {
    const random = makeRandom(7)
    const clusters = [
      { center: [-60, 10, 0], color: "#6e8fc4" },
      { center: [55, -20, 20], color: "#7fcdb5" },
      { center: [10, 55, -30], color: "#c4a9d9" },
    ]
    const points: GlowPoint[] = []
    const edges: Array<[number, number]> = []
    clusters.forEach((cluster) => {
      const base = points.length
      for (let i = 0; i < 46; i += 1) {
        points.push({
          x: cluster.center[0] + (random() - 0.5) * 85,
          y: cluster.center[1] + (random() - 0.5) * 85,
          z: cluster.center[2] + (random() - 0.5) * 85,
          color: cluster.color,
          size: 3.5 + random() * 5,
        })
        if (i > 0 && random() < 0.5) {
          edges.push([base + i, base + Math.floor(random() * i)])
        }
      }
    })
    return { points, edges }
  }, [])

  return <GlowPointsScene points={points} edges={edges} className="h-80 w-full max-w-2xl overflow-hidden rounded-lg border" />
}
