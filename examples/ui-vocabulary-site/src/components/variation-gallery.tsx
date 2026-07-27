import { LockKeyhole } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getTermVariations } from "@/data/term-variations"

/**
 * UE2 — 용어 상세의 바리에이션 갤러리.
 * 레지스트리에 데이터가 있는 용어만 섹션을 렌더한다 (노출 정책: 나열된 것 = 완성된 것).
 * UE4 — tier="pro" 는 오너 언락 전까지 잠금 표면(설명·상태 칩은 보이고 데모만 차단).
 *   클라이언트 표시 층 게이트다(정적 SPA — 우회 가능). 결제 도입 시 서버 게이팅으로 재설계.
 */
export function VariationGallery({ termId, proUnlocked = false }: { termId: string; proUnlocked?: boolean }) {
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
        {set.variations.map((variation) => {
          const locked = variation.tier === "pro" && !proUnlocked
          return (
            <article key={variation.id} className="flex flex-col overflow-hidden rounded-md border bg-background">
              <header className="flex items-start justify-between gap-3 border-b bg-muted/30 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{variation.label}</h3>
                    {variation.tier === "pro" && (
                      <Badge className="rounded-md bg-askewly-violet/10 text-[10px] font-semibold text-askewly-violet hover:bg-askewly-violet/10" variant="secondary">
                        {proUnlocked ? "Pro · unlocked" : "Pro"}
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
              <div className="relative flex-1 px-4 py-4">
                <div aria-hidden={locked} className={locked ? "pointer-events-none select-none blur-[3px] opacity-60" : undefined} {...(locked ? { inert: true } : {})}>
                  <variation.Demo />
                </div>
                {locked && (
                  <div className="absolute inset-0 grid place-items-center" data-variation-locked>
                    <div className="flex items-center gap-2 rounded-full border bg-background/90 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                      <LockKeyhole aria-hidden="true" className="size-3.5 text-askewly-violet" />
                      <span>Pro 변형 — 소유자 계정으로 로그인하면 조작할 수 있어요</span>
                    </div>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
