import { AtSign, Bookmark, Check, Heart, MousePointer2, Pencil, Search, X } from "lucide-react"
import { MeshGradientSurface } from "@/components/mesh-gradient-surface"
import { paletteSeedLibrary } from "@/lib/palette-generator"

/** Get Started illustrations (QA2, round 3 — Primer-style collage).
 *  Reference: research/2026-07-31-qa2-primer-structure.md — real-size UI fragments,
 *  overlapped and cropped by the card edge. NOT scaled-down captures: every label
 *  stays at its natural, readable size. Token-only chrome; decorative (aria-hidden). */

/** Patterns hero card: connector line art + toast + tag + icon toolbar + spec box,
 *  bleeding past the card's bottom edge (Primer Product UI card). */
export function PatternsCollage() {
  return (
    <div aria-hidden="true" className="pointer-events-none relative mt-10 h-56 select-none overflow-hidden">
      <svg className="absolute -left-2 top-0 h-52 w-44 text-border" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="28" cy="24" r="9" />
        <circle cx="84" cy="58" r="9" />
        <circle cx="24" cy="128" r="9" />
        <path d="M35 30 C 56 38, 62 46, 76 52" />
        <path d="M78 65 C 56 84, 38 100, 28 120" />
      </svg>
      <div className="absolute left-24 top-6 flex items-center gap-2.5 rounded-lg border bg-card px-3.5 py-2.5 shadow-md">
        <span className="grid size-5 place-items-center rounded-full bg-askewly-violet/15 text-askewly-violet">
          <Check className="size-3" />
        </span>
        <span className="text-sm font-medium text-foreground">Saved to library</span>
        <X className="ml-2 size-3.5 text-muted-foreground" />
      </div>
      <span className="absolute left-40 top-[4.6rem] rounded-md bg-askewly-violet px-2 py-0.5 font-mono text-[11px] font-semibold text-primary-foreground shadow-sm">
        section
      </span>
      <div className="absolute left-16 top-24 flex items-center gap-3 rounded-xl border bg-card px-4 py-2.5 shadow-sm">
        <Search className="size-4 text-muted-foreground" />
        <Pencil className="size-4 text-muted-foreground" />
        <span className="grid size-6 place-items-center rounded-md border border-dashed border-askewly-violet text-askewly-violet">
          <Heart className="size-3.5" />
        </span>
        <Bookmark className="size-4 text-muted-foreground" />
        <AtSign className="size-4 text-muted-foreground" />
      </div>
      <div className="absolute left-[19rem] top-12 hidden w-64 rounded-lg border border-askewly-lavender bg-askewly-lavender/15 p-4 sm:block">
        <div className="border-l border-t border-askewly-violet/50 pl-3 pt-2">
          <p className="font-mono text-xs text-askewly-violet">width: 480px</p>
          <p className="mt-1.5 font-mono text-xs text-askewly-violet">height: max 320px</p>
        </div>
      </div>
      <div className="absolute left-56 top-[8.5rem] flex items-center gap-2.5 rounded-xl border bg-card p-3 shadow-md">
        <span className="rounded-lg bg-askewly-violet px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm">Get started</span>
        <span className="rounded-lg border bg-background px-4 py-2 text-sm font-medium text-foreground">Live preview</span>
        <MousePointer2 className="-ml-4 -mb-5 size-4 text-foreground drop-shadow-sm" />
      </div>
    </div>
  )
}

/** Colors narrow card: six real palette swatches with their hex labels at natural size
 *  (Primer's mona tile grid position). */
export function ColorsSwatchGrid() {
  const swatches = paletteSeedLibrary
    .flatMap((seed) => seed.colors.map((color) => ({ seedId: seed.id, ...color })))
    .filter((_, index) => index % 4 === 0)
    .slice(0, 6)
  return (
    <div aria-hidden="true" className="pointer-events-none grid select-none grid-cols-3 gap-3">
      {swatches.map((swatch) => (
        <div key={`${swatch.seedId}-${swatch.hex}`} className="flex flex-col gap-1.5">
          <span className="h-16 w-full rounded-xl border border-foreground/5" style={{ backgroundColor: swatch.hex }} />
          <span className="font-mono text-[11px] uppercase text-muted-foreground">{swatch.hex}</span>
        </div>
      ))}
    </div>
  )
}

/** Recipes full-width band: real MeshGradientSurface at natural size, cropped by the
 *  card's right edge, with a motion chip on top (Primer Brand UI collage position). */
export function RecipesCollage() {
  return (
    <div aria-hidden="true" className="pointer-events-none relative h-full min-h-52 select-none">
      <MeshGradientSurface className="absolute -right-10 top-0 h-56 w-[34rem] max-w-none rounded-xl border" />
      <div className="absolute bottom-6 left-0 flex items-center gap-2.5 rounded-lg border bg-card px-3.5 py-2.5 shadow-md">
        <span className="size-2.5 rounded-full bg-askewly-violet motion-safe:animate-pulse motion-reduce:animate-none" />
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">motion choreography</span>
      </div>
      <div className="absolute right-4 top-40 flex items-center gap-2.5 rounded-lg border bg-card px-3.5 py-2.5 shadow-md">
        <span className="inline-block size-2.5 rounded-[2px] bg-gradient-to-br from-askewly-violet to-askewly-orchid" />
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">mesh gradient</span>
      </div>
    </div>
  )
}
