import { paletteSeedLibrary } from "@/lib/palette-generator"
import { cn } from "@/lib/utils"

/** Decorative live mini previews for the Get Started explore cards (QA2).
 *  Token-only chrome, aria-hidden + pointer-events-none, light/dark via semantic tokens,
 *  motion respects prefers-reduced-motion (motion-reduce:animate-none). */

function PreviewFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative h-28 select-none overflow-hidden rounded-md border bg-background",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PatternsPreview() {
  return (
    <PreviewFrame>
      <div className="flex h-5 items-center gap-1.5 border-b bg-card px-2">
        <span className="size-1.5 rounded-full bg-askewly-violet" />
        <span className="h-1 w-8 rounded-full bg-muted-foreground/30" />
        <span className="ml-auto h-1 w-5 rounded-full bg-muted-foreground/20" />
        <span className="h-1 w-5 rounded-full bg-muted-foreground/20" />
      </div>
      <div className="px-6 pt-3 text-center">
        <div className="mx-auto h-2 w-24 rounded-full bg-foreground/70" />
        <div className="mx-auto mt-1.5 h-1.5 w-32 rounded-full bg-muted-foreground/30" />
        <div className="mx-auto mt-2 h-3 w-12 rounded-sm bg-askewly-violet/80" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 px-4">
        {[0, 1, 2].map((block) => (
          <div key={block} className="h-8 rounded-sm border bg-muted" />
        ))}
      </div>
    </PreviewFrame>
  )
}

export function DocsPreview() {
  return (
    <PreviewFrame className="flex">
      <div className="flex w-14 shrink-0 flex-col gap-1.5 border-r bg-card p-2">
        {[10, 8, 9, 7, 8].map((width, index) => (
          <span
            key={index}
            className={cn("h-1 rounded-full", index === 1 ? "bg-askewly-violet" : "bg-muted-foreground/25")}
            style={{ width: `${width * 4}px` }}
          />
        ))}
      </div>
      <div className="flex-1 p-3">
        <div className="h-2 w-20 rounded-full bg-foreground/70" />
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted-foreground/25" />
        <div className="mt-1 h-1.5 w-4/5 rounded-full bg-muted-foreground/25" />
        <div className="mt-2.5 rounded-sm border bg-muted p-1.5">
          <div className="h-1 w-3/5 rounded-full bg-askewly-violet/60" />
          <div className="mt-1 h-1 w-2/5 rounded-full bg-muted-foreground/40" />
        </div>
      </div>
    </PreviewFrame>
  )
}

export function ColorsPreview() {
  const seeds = paletteSeedLibrary.slice(0, 3)
  return (
    <PreviewFrame className="flex flex-col justify-center gap-1.5 p-3">
      {seeds.map((seed) => (
        <div key={seed.id} className="grid h-6 overflow-hidden rounded-sm" style={{ gridTemplateColumns: `repeat(${seed.colors.length}, minmax(0, 1fr))` }}>
          {seed.colors.map((color) => (
            <span key={`${seed.id}-${color.hex}`} style={{ backgroundColor: color.hex }} />
          ))}
        </div>
      ))}
    </PreviewFrame>
  )
}

export function RecipesPreview() {
  return (
    <PreviewFrame className="grid place-items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-askewly-violet/25 via-transparent to-askewly-orchid/25" />
      <div className="relative flex items-center gap-2">
        <span className="size-8 rounded-full bg-gradient-to-br from-askewly-violet to-askewly-orchid motion-safe:animate-[spin_9s_linear_infinite] motion-reduce:animate-none" style={{ borderRadius: "38% 62% 55% 45% / 45% 40% 60% 55%" }} />
        <span className="size-2 rounded-full bg-askewly-violet/70 motion-safe:animate-pulse motion-reduce:animate-none" />
        <span className="size-1.5 rounded-full bg-askewly-orchid/70 motion-safe:animate-pulse motion-reduce:animate-none [animation-delay:300ms]" />
        <span className="h-6 w-px bg-border" />
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">motion / 3d</span>
      </div>
    </PreviewFrame>
  )
}
