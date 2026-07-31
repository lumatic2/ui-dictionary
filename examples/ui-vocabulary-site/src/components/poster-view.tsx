import { Badge } from "@/components/ui/badge"
import { TermVisual } from "@/components/term-visual"
import type { VocabularyTerm } from "@/data/terms.generated"
import { categoryLabels } from "@/lib/search"

type PosterViewProps = {
  scopeLabel: string
  terms: VocabularyTerm[]
  totalCount: number
}

export function PosterView({ scopeLabel, terms, totalCount }: PosterViewProps) {
  const isLargeScope = terms.length > 72

  return (
    <section
      // hardcoded-color-ok: print output is fixed white paper by design, independent of site theme
      className="rounded-lg border bg-card p-5 shadow-sm print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none"
      data-export-poster
    >
      <header className="mb-5 grid gap-3 border-b pb-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">UI 용어 사전</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-normal text-foreground">{scopeLabel}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            이름과 생김새를 한 번에 훑어보는 컴팩트 포스터입니다.
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-2xl font-semibold">{terms.length}</p>
          <p className="text-sm text-muted-foreground">/ {totalCount} terms</p>
        </div>
      </header>

      {isLargeScope && (
        <div className="mb-4 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">
          범위가 큽니다. 학습용 포스터는 좌측 카테고리에서 대분류나 세부 분류를 고른 뒤 저장하면 더 읽기 좋습니다.
        </div>
      )}

      <div className="grid gap-2 md:grid-cols-2" data-export-poster-grid>
        {terms.map((term, index) => (
          <article
            key={term.id}
            className="grid min-h-28 grid-cols-[6rem_minmax(0,1fr)] gap-3 rounded-md border bg-background p-2 print:min-h-24 print:break-inside-avoid"
          >
            <div className="min-w-0 overflow-hidden rounded-md">
              <TermVisual variant={term.asset.variant} label={term.ko.name} size="poster" />
            </div>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold tracking-normal">{term.ko.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{term.en.name}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-muted-foreground">{index + 1}</span>
              </div>
              <Badge variant="outline" className="mt-2 rounded-md px-1.5 py-0 text-2xs">
                {categoryLabels[term.category]}
              </Badge>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{term.one_liner}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
