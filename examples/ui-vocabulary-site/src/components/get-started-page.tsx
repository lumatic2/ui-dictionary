import { ArrowRight, Search, Sparkles } from "lucide-react"
import type { ComponentType } from "react"
import type { HomePageDestination } from "@/components/home-page"
import { ColorsPreview, DocsPreview, PatternsPreview, RecipesPreview } from "@/components/get-started-previews"
import { docsArticlePages } from "@/lib/documentation-pages"
import { paletteSeedLibrary } from "@/lib/palette-generator"
import { recipeGalleryEntries } from "@/lib/recipe-gallery-data"

type ExplorePath = {
  id: string
  preview: ComponentType
  title: string
  meta: string
  destination: HomePageDestination
}

const explorePaths: ExplorePath[] = [
  {
    id: "patterns",
    preview: PatternsPreview,
    title: "Patterns",
    meta: "Marketing · Application UI · Ecommerce",
    destination: { page: "plus", filter: "nav:plus-marketing" },
  },
  {
    id: "docs",
    preview: DocsPreview,
    title: "Docs",
    meta: `${docsArticlePages.size} articles`,
    destination: { page: "docs", filter: "nav:docs-all" },
  },
  {
    id: "colors",
    preview: ColorsPreview,
    title: "Colors",
    meta: `${paletteSeedLibrary.length} curated palettes + generator`,
    destination: { page: "colors" },
  },
  {
    id: "recipes",
    preview: RecipesPreview,
    title: "Recipes",
    meta: `${recipeGalleryEntries.length} live-rendered recipes`,
    destination: { page: "recipes" },
  },
]

export function GetStartedPage({ onNavigate }: { onNavigate: (destination: HomePageDestination) => void }) {
  return (
    <section className="min-h-[calc(100svh-3.5rem)] bg-background px-5 py-16 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-askewly-violet">Get started</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-foreground">Start exploring Askewly Design</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {explorePaths.map((path) => (
            <button
              key={path.id}
              className="group flex flex-col gap-4 rounded-md border bg-card p-4 text-left shadow-sm transition hover:border-foreground/30"
              type="button"
              onClick={() => onNavigate(path.destination)}
            >
              <path.preview />
              <span className="flex items-center justify-between px-1 pb-1">
                <span className="flex items-baseline gap-3">
                  <span className="text-base font-semibold text-foreground">{path.title}</span>
                  <span className="text-sm text-muted-foreground">{path.meta}</span>
                </span>
                <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex items-start gap-3 rounded-md border bg-card p-4 shadow-sm">
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-foreground">
              <Search className="size-4" />
            </span>
            <p className="text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-foreground">Look up any UI term.</span> 562 vocabulary entries with
              visuals and states. Press{" "}
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">Ctrl F</kbd> anywhere.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-md border bg-card p-4 shadow-sm">
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-foreground">
              <Sparkles className="size-4" />
            </span>
            <p className="text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-foreground">Building with an agent?</span> Point Codex or Claude Code at{" "}
              <a className="font-medium text-foreground underline underline-offset-4" href="/llms.txt">
                ui.askewly.com/llms.txt
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
