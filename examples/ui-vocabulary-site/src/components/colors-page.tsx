import { useEffect, useState } from "react"
import { Check, Copy, Download, FileCode2, PanelsTopLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ColorPaletteGeneratorDemo,
  buildPaletteSvg,
  downloadPalettePng,
  getReadableTextColor,
  type HomePageDestination,
} from "@/components/home-page"
import { paletteSeedLibrary, type PaletteSeed } from "@/lib/palette-generator"
import { cn } from "@/lib/utils"

type ColorsView = "generator" | "palettes"

const colorsTabs: Array<{ id: ColorsView; label: string }> = [
  { id: "generator", label: "Generator" },
  { id: "palettes", label: "Palettes" },
]

async function writeToClipboard(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return
    }
  } catch {
    // fall through to textarea fallback below
  }
  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.left = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
}

function PaletteCard({
  seed,
  onCopy,
  onExport,
}: {
  seed: PaletteSeed
  onCopy: (message: string) => void
  onExport: (seed: PaletteSeed) => void
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border bg-card shadow-sm">
      <div className="grid h-24" style={{ gridTemplateColumns: `repeat(${seed.colors.length}, minmax(0, 1fr))` }}>
        {seed.colors.map((color) => {
          const textColor = getReadableTextColor(color.hex)
          return (
            <button
              key={color.hex}
              className="group/swatch relative flex items-end justify-start p-1.5 transition"
              style={{ backgroundColor: color.hex }}
              type="button"
              aria-label={`Copy ${color.name} ${color.hex}`}
              onClick={() => {
                void writeToClipboard(color.hex)
                onCopy(`${color.hex} copied to clipboard`)
              }}
            >
              <span
                className="pointer-events-none rounded bg-black/0 font-mono text-[10px] font-semibold uppercase tracking-normal opacity-0 transition group-hover/swatch:bg-black/25 group-hover/swatch:opacity-100"
                style={{ color: textColor }}
              >
                {color.hex.replace("#", "")}
              </span>
              <Copy
                aria-hidden="true"
                className="pointer-events-none absolute right-1.5 top-1.5 size-3 opacity-0 transition group-hover/swatch:opacity-100"
                style={{ color: textColor }}
              />
            </button>
          )
        })}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">{seed.name}</p>
          <div className="flex shrink-0 gap-1">
            <button
              className="grid size-7 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
              type="button"
              aria-label={`Copy ${seed.name} hex list`}
              onClick={() => {
                void writeToClipboard(seed.colors.map((color) => color.hex).join(", "))
                onCopy(`${seed.name} hex list copied`)
              }}
            >
              <Copy className="size-3.5" />
            </button>
            <button
              className="grid size-7 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
              type="button"
              aria-label={`Export ${seed.name}`}
              onClick={() => onExport(seed)}
            >
              <Download className="size-3.5" />
            </button>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">{seed.note}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
          Curated seed — Askewly Design in-repo library
        </p>
      </div>
    </div>
  )
}

function PaletteExportDialog({ seed, onClose }: { seed: PaletteSeed; onClose: () => void }) {
  const exportOptions: Array<[format: "image" | "code" | "svg", label: string, Icon: typeof Download]> = [
    ["image", "Image", Download],
    ["code", "Code", FileCode2],
    ["svg", "SVG", PanelsTopLeft],
  ]

  const handleExport = (format: "image" | "code" | "svg") => {
    if (format === "image") {
      downloadPalettePng(seed.colors)
    }
    if (format === "svg") {
      void writeToClipboard(buildPaletteSvg(seed.colors))
    }
    if (format === "code") {
      void writeToClipboard(`const palette = ${JSON.stringify(seed.colors.map((color) => color.hex), null, 2)}\n`)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/72 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border bg-card text-foreground shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <p className="text-lg font-semibold">Export {seed.name}</p>
          <button className="rounded p-1 text-muted-foreground transition hover:bg-muted" type="button" aria-label="Close export dialog" onClick={onClose}>
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 p-5">
          {exportOptions.map(([format, label, Icon]) => (
            <button
              key={format}
              className="grid aspect-square place-items-center gap-1 rounded-xl bg-muted p-3 text-center transition hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-askewly-violet"
              type="button"
              aria-label={`Export ${seed.name} as ${label}`}
              onClick={() => handleExport(format)}
            >
              <Icon aria-hidden="true" className="size-7" />
              <span className="text-sm font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ColorsPage({ onNavigate }: { onNavigate: (destination: HomePageDestination) => void }) {
  const [view, setView] = useState<ColorsView>("generator")
  const [copyToast, setCopyToast] = useState<string | null>(null)
  const [exportSeed, setExportSeed] = useState<PaletteSeed | null>(null)

  useEffect(() => {
    if (!copyToast) return
    const timer = window.setTimeout(() => setCopyToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [copyToast])

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
              {paletteSeedLibrary.map((seed) => (
                <PaletteCard key={seed.id} seed={seed} onCopy={setCopyToast} onExport={setExportSeed} />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card p-4 text-sm text-muted-foreground">
              <p>Every palette traces back to a named curated seed — the same in-repo library that powers the Generator.</p>
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
        )}
      </div>

      {copyToast && (
        <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-lg dark:bg-slate-50 dark:text-slate-950">
          <span className="inline-flex items-center gap-1.5">
            <Check aria-hidden="true" className="size-3.5" />
            {copyToast}
          </span>
        </div>
      )}

      {exportSeed && <PaletteExportDialog seed={exportSeed} onClose={() => setExportSeed(null)} />}
    </section>
  )
}
