import { BookOpen, ChevronRight, Search, Sparkles } from "lucide-react"
import type { HomePageDestination } from "@/components/home-page"
import { ColorsSwatchGrid, PatternsCollage, RecipesCollage } from "@/components/get-started-previews"
import { docsArticlePages } from "@/lib/documentation-pages"

/** Get Started, structure round 3 — follows primer.style's home grammar
 *  (research/2026-07-31-qa2-primer-structure.md, user-picked reference 2026-07-31):
 *  centered title → asymmetric two-card hero band → full-width band → three small
 *  foundation cards. Illustrations are real-size fragment collages, not scaled captures. */

function GetStartedLink({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-askewly-violet">
      {label}
      <ChevronRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
    </span>
  )
}

export function GetStartedPage({ onNavigate }: { onNavigate: (destination: HomePageDestination) => void }) {
  return (
    <section className="min-h-[calc(100svh-3.5rem)] bg-muted/40 px-5 py-16 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-semibold tracking-normal text-foreground">Get started</h1>
          <p className="mt-3 text-lg text-muted-foreground">A visual library and agent-ready system for product interfaces.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          <button
            className="group overflow-hidden rounded-2xl border bg-card p-8 pb-0 text-left shadow-sm transition-all duration-200 hover:scale-[1.015] hover:border-foreground/25 hover:shadow-md motion-reduce:transform-none"
            type="button"
            onClick={() => onNavigate({ page: "plus", filter: "nav:plus-marketing" })}
          >
            <h2 className="text-3xl font-normal leading-snug text-foreground md:text-4xl">
              Build working product UI
              <br /> with <span className="font-semibold">Patterns</span>
            </h2>
            <p className="mt-5">
              <GetStartedLink label="Get started with Patterns" />
            </p>
            <PatternsCollage />
          </button>

          <button
            className="group flex flex-col rounded-2xl border bg-card p-8 text-left shadow-sm transition-all duration-200 hover:scale-[1.015] hover:border-foreground/25 hover:shadow-md motion-reduce:transform-none"
            type="button"
            onClick={() => onNavigate({ page: "colors" })}
          >
            <ColorsSwatchGrid />
            <h2 className="mt-8 text-2xl font-normal leading-snug text-foreground md:text-3xl">
              Pick palettes and tokens
              <br /> with <span className="font-semibold">Colors</span>
            </h2>
            <p className="mt-auto pt-5">
              <GetStartedLink label="Get started with Colors" />
            </p>
          </button>
        </div>

        <button
          className="group grid gap-8 overflow-hidden rounded-2xl border bg-card p-8 text-left shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-foreground/25 hover:shadow-md motion-reduce:transform-none lg:grid-cols-[1fr_1.1fr]"
          type="button"
          onClick={() => onNavigate({ page: "recipes" })}
        >
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-normal leading-snug text-foreground md:text-4xl">
              Add visual impact
              <br /> with <span className="font-semibold">Recipes</span>
            </h2>
            <p className="mt-5">
              <GetStartedLink label="Get started with Recipes" />
            </p>
          </div>
          <RecipesCollage />
        </button>

        <h2 className="mt-10 text-2xl font-semibold text-foreground">More ways in</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <button
            className="group flex flex-col gap-4 rounded-2xl border bg-card p-7 text-left shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-foreground/25 hover:shadow-md motion-reduce:transform-none"
            type="button"
            onClick={() => onNavigate({ page: "docs", filter: "nav:docs-all" })}
          >
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-lg bg-muted text-foreground">
              <BookOpen className="size-5" />
            </span>
            <div>
              <p className="text-lg font-semibold text-foreground">Docs</p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {docsArticlePages.size} articles on how the system decides hierarchy, tokens, states, and motion.
              </p>
            </div>
            <p className="mt-auto">
              <GetStartedLink label="Learn more" />
            </p>
          </button>

          <div className="flex flex-col gap-4 rounded-2xl border bg-card p-7 shadow-sm">
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-lg bg-muted text-foreground">
              <Search className="size-5" />
            </span>
            <div>
              <p className="text-lg font-semibold text-foreground">UI Vocabulary</p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                562 UI terms with visuals, states, and related-term comparisons.
              </p>
            </div>
            <p className="mt-auto text-sm text-muted-foreground">
              Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">Ctrl F</kbd> anywhere
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border bg-card p-7 shadow-sm">
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-lg bg-muted text-foreground">
              <Sparkles className="size-5" />
            </span>
            <div>
              <p className="text-lg font-semibold text-foreground">Agents</p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                Codex and Claude Code read this system directly through the entry protocol.
              </p>
            </div>
            <p className="mt-auto">
              <a className="group inline-flex items-center gap-1 text-sm font-medium text-askewly-violet" href="/llms.txt">
                ui.askewly.com/llms.txt
                <ChevronRight aria-hidden="true" className="size-4" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
