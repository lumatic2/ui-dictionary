import { lazy, Suspense, type ReactNode } from "react"
import { MarketingSectionPreviewLazy } from "@/components/marketing-section-preview-lazy"
import { cn } from "@/lib/utils"

/** Get Started thumbnails (QA2, structure B): scaled-down renders of the site's REAL
 *  demo components — not skeletons, not screenshots (reference: Tailwind Plus thumbnail
 *  grid, research/2026-07-31-qa2-get-started-references.md). Decorative: aria-hidden,
 *  pointer-events-none. Each heavy demo is lazy-loaded so the get-started chunk stays light. */

const ArticleDocsDemo = lazy(() =>
  import("@/components/recipe-gallery-demos").then((m) => ({ default: m.ArticleDocumentationLayoutDemo })),
)
const PaletteGeneratorDemo = lazy(() =>
  import("@/components/home-page").then((m) => ({ default: m.ColorPaletteGeneratorDemo })),
)
const MeshGradientDemo = lazy(() =>
  import("@/components/mesh-gradient-surface").then((m) => ({ default: m.MeshGradientSurfaceDemo })),
)

function ScaledFrame({ children, scale, className }: { children: ReactNode; scale: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative h-52 select-none overflow-hidden rounded-md border bg-background", className)}
    >
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: `${Math.round(100 / scale)}%`, transform: `scale(${scale})` }}>
        <Suspense fallback={<div className="h-[32rem] w-full animate-pulse bg-muted" />}>{children}</Suspense>
      </div>
    </div>
  )
}

export function PatternsPreview() {
  return (
    <ScaledFrame scale={0.35}>
      <MarketingSectionPreviewLazy theme="system" variant="hero-centered" />
    </ScaledFrame>
  )
}

export function DocsPreview() {
  return (
    <ScaledFrame scale={0.4}>
      <ArticleDocsDemo />
    </ScaledFrame>
  )
}

export function ColorsPreview() {
  return (
    <ScaledFrame scale={0.4}>
      <PaletteGeneratorDemo />
    </ScaledFrame>
  )
}

export function RecipesPreview() {
  return (
    <ScaledFrame scale={0.8}>
      <MeshGradientDemo />
    </ScaledFrame>
  )
}
