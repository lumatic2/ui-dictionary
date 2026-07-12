import { AtlasDemo } from "@/components/home-page"
import { atlasIconMap, atlasItems, type AtlasItemId } from "@/lib/atlas-items"
import { cn } from "@/lib/utils"

export function AtlasCard({ item }: { item: (typeof atlasItems)[number] }) {
  return (
    <article
      className={cn(
        "group flex h-full min-w-0 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-askewly-lavender hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]",
        item.layout,
      )}
    >
      <div className={cn("grid gap-5 p-6 sm:grid-cols-[5.75rem_minmax(0,1fr)]", item.id === "agent" && "sm:grid-cols-[4.25rem_minmax(0,1fr)]")}>
        <div className="flex items-start justify-center sm:justify-start">
          <LineArtIcon id={item.id} />
        </div>
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold tracking-normal text-card-foreground">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col border-t border-border bg-slate-50 p-5">
        <AtlasDemo id={item.id} />
      </div>
    </article>
  )
}

function LineArtIcon({ id }: { id: AtlasItemId }) {
  const Icon = atlasIconMap[id]

  return (
    <span className="flex h-16 w-20 shrink-0 items-start justify-center text-card-foreground">
      <Icon aria-hidden="true" className="mt-1 size-11" strokeWidth={1.75} absoluteStrokeWidth />
    </span>
  )
}
