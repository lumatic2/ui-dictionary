import { Badge } from "@/components/ui/badge"
import { getTermVariations } from "@/data/term-variations"

/**
 * UE2 — 용어 상세의 바리에이션 갤러리.
 * 레지스트리에 데이터가 있는 용어만 섹션을 렌더한다 (노출 정책: 나열된 것 = 완성된 것).
 * tier="pro" 는 표시 층만 — 잠금 실동작은 UE4.
 */
export function VariationGallery({ termId }: { termId: string }) {
  const set = getTermVariations(termId)

  if (!set || set.variations.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">바리에이션</h2>
        <p className="text-xs text-muted-foreground">{set.variations.length}개 변형 · 직접 조작해 보세요</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {set.variations.map((variation) => (
          <article key={variation.id} className="flex flex-col overflow-hidden rounded-md border bg-background">
            <header className="flex items-start justify-between gap-3 border-b bg-muted/30 px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{variation.label}</h3>
                  {variation.tier === "pro" && (
                    <Badge className="rounded-md bg-askewly-violet/10 text-[10px] font-semibold text-askewly-violet hover:bg-askewly-violet/10" variant="secondary">
                      Pro
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{variation.one_liner}</p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1">
                {variation.states.map((state) => (
                  <Badge key={state} className="rounded-md text-[10px] font-normal" variant="outline">
                    {state}
                  </Badge>
                ))}
              </div>
            </header>
            <div className="flex-1 px-4 py-4">
              <variation.Demo />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
