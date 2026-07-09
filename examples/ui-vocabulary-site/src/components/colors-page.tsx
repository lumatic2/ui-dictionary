import { useState } from "react"
import { Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ColorPaletteGeneratorDemo, type HomePageDestination } from "@/components/home-page"
import { cn } from "@/lib/utils"

type ColorsView = "generator" | "palettes"

const colorsTabs: Array<{ id: ColorsView; label: string }> = [
  { id: "generator", label: "Generator" },
  { id: "palettes", label: "Palettes" },
]

const PALETTE_SKELETON_SLOTS = 8

export function ColorsPage({ onNavigate }: { onNavigate: (destination: HomePageDestination) => void }) {
  const [view, setView] = useState<ColorsView>("generator")

  return (
    <section className="min-h-[calc(100svh-3.5rem)] bg-background px-5 py-16 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-askewly-violet">Colors</p>
          <h1 className="mt-5 text-5xl font-semibold leading-none tracking-normal text-foreground md:text-7xl">
            Build and browse palettes worth keeping.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            A Coolors-style color surface for Askewly Design: generate palettes from curated seeds, then browse a
            curated library to pull colors straight into your project.
          </p>
        </div>

        <div className="flex gap-2 border-b" role="tablist" aria-label="Colors views">
          {colorsTabs.map((tab) => (
            <button
              key={tab.id}
              aria-selected={view === tab.id}
              className={cn(
                "-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition",
                view === tab.id
                  ? "border-askewly-violet text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              role="tab"
              type="button"
              onClick={() => setView(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {view === "generator" ? (
          <div className="flex flex-col gap-6">
            <ColorPaletteGeneratorDemo />
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card p-4 text-sm text-muted-foreground">
              <p>Every color traces back to a named seed source, shown when you inspect a swatch.</p>
              <Button
                className="h-9 rounded-lg"
                type="button"
                variant="outline"
                onClick={() => onNavigate({ page: "docs", filter: "nav:docs-foundations-color" })}
              >
                Read the Color foundation
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: PALETTE_SKELETON_SLOTS }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-md border bg-card shadow-sm">
                  <div className="grid h-24 grid-cols-5">
                    {Array.from({ length: 5 }, (_, swatchIndex) => (
                      <div key={swatchIndex} className="animate-pulse bg-muted" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3">
                    <p className="text-sm font-medium text-muted-foreground">Palette slot</p>
                    <div className="flex gap-1">
                      <span className="grid size-7 place-items-center rounded-md text-muted-foreground/50" aria-hidden="true">
                        <Copy className="size-3.5" />
                      </span>
                      <span className="grid size-7 place-items-center rounded-md text-muted-foreground/50" aria-hidden="true">
                        <Download className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-dashed bg-muted/30 p-8 text-center">
              <p className="text-sm font-medium text-foreground">Content pending — fill criteria: source-quality</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Curated palettes with copy and export actions land here once real palette data is ready.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
