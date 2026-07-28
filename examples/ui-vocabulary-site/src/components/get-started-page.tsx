import { ArrowRight, BookOpen, Palette, Search, Shapes, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { HomePageDestination } from "@/components/home-page"

type ExplorePath = {
  id: string
  icon: LucideIcon
  title: string
  description: string
  cta: string
  destination: HomePageDestination
}

const explorePaths: ExplorePath[] = [
  {
    id: "patterns",
    icon: Shapes,
    title: "Browse patterns",
    description: "Marketing, application UI, and ecommerce blocks — every section is a working demo you can inspect and reuse.",
    cta: "Open Patterns",
    destination: { page: "plus", filter: "nav:plus-marketing" },
  },
  {
    id: "docs",
    icon: BookOpen,
    title: "Read the docs",
    description: "Principles, foundations, and element guides — how the system decides hierarchy, tokens, states, and motion.",
    cta: "Open Docs",
    destination: { page: "docs", filter: "nav:docs-all" },
  },
  {
    id: "colors",
    icon: Palette,
    title: "Study the colors",
    description: "The palette and semantic tokens behind every surface, with a generator for building your own ramps.",
    cta: "Open Colors",
    destination: { page: "colors" },
  },
  {
    id: "recipes",
    icon: Sparkles,
    title: "Try the recipes",
    description: "Higher-impact visual techniques — gradients, motion choreography, and 3D — implemented and documented.",
    cta: "Open Recipe Gallery",
    destination: { page: "recipes" },
  },
]

export function GetStartedPage({ onNavigate }: { onNavigate: (destination: HomePageDestination) => void }) {
  return (
    <section className="min-h-[calc(100svh-3.5rem)] bg-background px-5 py-16 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-12">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-askewly-violet">Get started</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-foreground">Start exploring Askewly Design</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A visual library of product UI, the vocabulary behind it, and an agent-ready system that ships the same
            design decisions as code. Pick the path that matches what you came for.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {explorePaths.map((path) => (
            <button
              key={path.id}
              className="group flex flex-col gap-4 rounded-md border bg-card p-6 text-left shadow-sm transition hover:border-foreground/30"
              type="button"
              onClick={() => onNavigate(path.destination)}
            >
              <span aria-hidden="true" className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
                <path.icon className="size-4" />
              </span>
              <div>
                <p className="text-base font-semibold text-foreground">{path.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{path.description}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                {path.cta}
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-md border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
                <Search className="size-4" />
              </span>
              <p className="text-base font-semibold text-foreground">Look up any UI term</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              562 UI vocabulary entries with visuals, states, and related-term comparisons. Press{" "}
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">Ctrl F</kbd> anywhere
              on the site, or start from a term like accordion, combobox, or bento grid.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-md border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="grid size-9 place-items-center rounded-md bg-muted text-foreground">
                <Sparkles className="size-4" />
              </span>
              <p className="text-base font-semibold text-foreground">Building with an agent?</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Codex and Claude Code read this system directly. Point your agent at{" "}
              <a className="font-medium text-foreground underline underline-offset-4" href="/llms.txt">
                ui.askewly.com/llms.txt
              </a>{" "}
              — it links the entry protocol, tokens, pattern recipes, and anti-patterns.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
