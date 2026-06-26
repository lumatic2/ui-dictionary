import { memo } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TermVisual } from "@/components/term-visual"
import type { VocabularyTerm } from "@/data/terms.generated"
import { categoryLabels, searchMatchReasonLabels, type SearchMatchReason } from "@/lib/search"
import { cn } from "@/lib/utils"

type TermCardProps = {
  term: VocabularyTerm
  index: number
  matchReasons?: SearchMatchReason[]
  selected: boolean
  onSelect: (term: VocabularyTerm) => void
}

export const TermCard = memo(function TermCard({ term, index, matchReasons = [], selected, onSelect }: TermCardProps) {
  const openDetail = () => onSelect(term)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openDetail()
    }
  }

  return (
    <Card
      data-export-card={term.id}
      data-print-card
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={handleKeyDown}
      className={cn(
        "overflow-hidden rounded-lg transition hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-primary shadow-md"
      )}
    >
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
        <div className="min-w-0">
          <Badge variant="outline" className="mb-2 rounded-md text-xs">
            {categoryLabels[term.category]}
          </Badge>
          <CardTitle className="truncate text-xl tracking-normal">
            {term.ko.name}
            <span className="ml-2 text-sm font-normal text-muted-foreground">{term.en.name}</span>
          </CardTitle>
          {matchReasons.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {matchReasons.slice(0, 2).map((reason) => (
                <Badge key={reason} variant="secondary" className="rounded-md text-[10px]">
                  {searchMatchReasonLabels[reason]}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
          {index + 1}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <TermVisual variant={term.asset.variant} label={term.ko.name} />
        <div className="flex flex-col gap-2">
          <p className="line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">{term.one_liner}</p>
          <p className="rounded-md bg-accent px-3 py-2 text-sm leading-5 text-accent-foreground">
            {term.prompt_phrases[0]}
          </p>
        </div>
      </CardContent>
    </Card>
  )
})
