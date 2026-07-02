import { memo, type MouseEvent } from "react"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TermVisual } from "@/components/term-visual"
import type { VocabularyTerm } from "@/data/terms.generated"
import { categoryLabels, kindLabels, searchMatchReasonLabels, type SearchMatchReason } from "@/lib/search"
import { cn } from "@/lib/utils"

type TermResultRowProps = {
  term: VocabularyTerm
  matchReasons?: SearchMatchReason[]
  selected: boolean
  onSelect: (term: VocabularyTerm) => void
}

export const TermResultRow = memo(function TermResultRow({
  term,
  matchReasons = [],
  selected,
  onSelect,
}: TermResultRowProps) {
  const openTermPage = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onSelect(term)
  }

  return (
    <a
      data-export-card={term.id}
      data-print-card
      href={`?page=term&id=${encodeURIComponent(term.id)}`}
      onClick={openTermPage}
      className={cn(
        "group grid min-h-32 grid-cols-[5.5rem_minmax(0,1fr)] gap-4 px-0 py-4 text-foreground no-underline outline-none transition hover:bg-accent/30 focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center sm:px-3",
        selected && "bg-accent/40"
      )}
    >
      <div className="min-w-0 overflow-hidden rounded-md border bg-background">
        <TermVisual variant={term.asset.variant} label={term.ko.name} />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-md text-xs">
            {categoryLabels[term.category]}
          </Badge>
          {term.kind !== "component" && (
            <Badge variant="secondary" className="rounded-md text-xs">
              {kindLabels[term.kind]}
            </Badge>
          )}
          {matchReasons.slice(0, 2).map((reason) => (
            <Badge key={reason} variant="secondary" className="rounded-md text-[10px]">
              {searchMatchReasonLabels[reason]}
            </Badge>
          ))}
        </div>
        <div className="mt-2 grid gap-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-7 tracking-normal">
              <span className="block break-keep">{term.ko.name}</span>
              <span className="block break-words text-sm font-normal leading-5 text-muted-foreground">{term.en.name}</span>
            </h3>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{term.one_liner}</p>
        </div>
        <p className="mt-2 line-clamp-1 text-sm leading-6 text-muted-foreground">{term.prompt_phrases[0]}</p>
      </div>

      <span className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition group-hover:text-primary sm:flex">
        Open
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </span>
    </a>
  )
})
