import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { recipeCollectionOrder, recipeGalleryEntries, getRecipeGalleryEntriesByCollection, getRecipeGalleryEntry, type RecipeGalleryEntry } from "@/lib/recipe-gallery-data"
import { recipeDemoComponents } from "@/lib/recipe-gallery-demo-registry"
import { cn } from "@/lib/utils"

/**
 * Recipe Gallery — the site's live-render surface for the 35
 * `recipes/<collection>/<slug>.md` design-system recipes (recipe-format.md
 * "소비 규약"). The index groups every recipe by its collection; selecting a
 * card opens a detail view that renders the recipe's real implementation
 * component with sample data.
 */
export function RecipeGallery() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const selectedEntry = selectedSlug ? getRecipeGalleryEntry(selectedSlug) : undefined

  if (selectedEntry) {
    return <RecipeDetail entry={selectedEntry} onBack={() => setSelectedSlug(null)} />
  }

  return <RecipeGalleryIndex onSelect={setSelectedSlug} />
}

function RecipeGalleryIndex({ onSelect }: { onSelect: (slug: string) => void }) {
  return (
    <section className="flex flex-col gap-10 px-5 py-8 md:px-8 md:py-10 lg:px-10 2xl:px-12">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-askewly-violet">Recipe Gallery</p>
        <h1 className="text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
          Every recipe, live-rendered.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          All {recipeGalleryEntries.length} design-system recipes from <code className="rounded bg-muted px-1 py-0.5 text-sm">recipes/</code> grouped by collection.
          Each card opens its real implementation component, not a screenshot.
        </p>
      </div>

      {recipeCollectionOrder.map((collection) => {
        const entries = getRecipeGalleryEntriesByCollection(collection)
        if (entries.length === 0) return null

        return (
          <div key={collection} className="flex flex-col gap-4">
            <h2 className="text-lg font-medium text-foreground">{collection}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <RecipeCard key={entry.slug} entry={entry} onSelect={onSelect} />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

function RecipeCard({ entry, onSelect }: { entry: RecipeGalleryEntry; onSelect: (slug: string) => void }) {
  return (
    <button
      className="flex h-full flex-col gap-2 rounded-md border bg-card p-4 text-left text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-askewly-lavender hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
      type="button"
      onClick={() => onSelect(entry.slug)}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium">{entry.title}</h3>
        <Badge variant="outline" className="shrink-0 text-[10px]">{entry.collection}</Badge>
      </div>
      <p className="line-clamp-3 text-sm text-muted-foreground">{entry.description}</p>
    </button>
  )
}

function RecipeDetail({ entry, onBack }: { entry: RecipeGalleryEntry; onBack: () => void }) {
  const Demo = recipeDemoComponents[entry.slug]

  return (
    <section className="flex flex-col gap-6 px-5 py-8 md:px-8 md:py-10 lg:px-10 2xl:px-12">
      <Button variant="ghost" size="sm" className="self-start" onClick={onBack}>
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to Recipe Gallery
      </Button>

      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{entry.collection}</Badge>
        <h1 className="text-2xl font-semibold tracking-normal text-foreground md:text-3xl">{entry.title}</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">{entry.description}</p>
      </div>

      <div className={cn("flex w-full flex-col items-center overflow-x-auto rounded-md border bg-muted/30 p-6 md:p-10")} data-export-root>
        {Demo ? <Demo /> : <p className="text-sm text-muted-foreground">No live implementation registered for this recipe yet.</p>}
      </div>
    </section>
  )
}
