import { lazy, memo, Suspense, type MouseEvent } from "react"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { VocabularyTerm } from "@/data/terms.generated"
import { categoryLabels, kindLabels, searchMatchReasonLabels, type SearchMatchReason } from "@/lib/search"
import { cn } from "@/lib/utils"

// UE5 step-2: 미니목 렌더러(term-visual, 수천 줄)를 목록 초기 청크에서 분리한다.
const TermVisual = lazy(() => import("@/components/term-visual").then((m) => ({ default: m.TermVisual })))

type TermResultRowProps = {
  term: VocabularyTerm
  matchReasons?: SearchMatchReason[]
  selected: boolean
  onSelect: (term: VocabularyTerm) => void
  /**
   * SQ3 검색 계층 변형. 미지정("default") = 기존 브라우징 목록 렌더 그대로(무회귀 계약).
   * hero = 정확 일치 티어(비주얼·이름 위계 강화), compact = 연관 언급 티어(한 줄 밀도).
   */
  variant?: "default" | "hero" | "compact"
}

export const TermResultRow = memo(function TermResultRow({
  term,
  matchReasons = [],
  selected,
  onSelect,
  variant = "default",
}: TermResultRowProps) {
  const openTermPage = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onSelect(term)
  }

  if (variant === "hero") {
    return (
      <a
        data-export-card={term.id}
        data-print-card
        href={`/terms/${encodeURIComponent(term.id)}`}
        onClick={openTermPage}
        className={cn(
          "group grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-4 px-0 py-5 text-foreground no-underline outline-none transition hover:bg-accent/30 focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[9.5rem_minmax(0,1fr)_auto] sm:gap-6 sm:px-3",
          selected && "bg-accent/40"
        )}
      >
        <div className="min-w-0 overflow-hidden rounded-md border bg-background">
          <Suspense fallback={<div aria-hidden="true" className="aspect-[4/3] w-full animate-pulse bg-muted/50" />}>
            <TermVisual variant={term.asset.variant} label={term.ko.name} />
          </Suspense>
        </div>

        <div className="min-w-0">
          <h3 className="break-keep text-xl font-semibold leading-7 tracking-normal">
            {term.ko.name}
            <span className="ml-2 break-words text-sm font-normal text-muted-foreground">{term.en.name}</span>
          </h3>
          <p className="mt-1.5 line-clamp-2 break-keep text-sm leading-6 text-muted-foreground">{term.one_liner}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-md text-xs">
              {categoryLabels[term.category]}
            </Badge>
            {term.kind !== "component" && (
              <Badge variant="secondary" className="rounded-md text-xs">
                {kindLabels[term.kind]}
              </Badge>
            )}
          </div>
        </div>

        <span className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition group-hover:text-primary sm:flex">
          Open
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </a>
    )
  }

  if (variant === "compact") {
    return (
      <a
        data-export-card={term.id}
        data-print-card
        href={`/terms/${encodeURIComponent(term.id)}`}
        onClick={openTermPage}
        className={cn(
          "group flex items-center gap-4 px-0 py-3 text-foreground no-underline outline-none transition hover:bg-accent/30 focus-visible:ring-2 focus-visible:ring-ring sm:px-3",
          selected && "bg-accent/40"
        )}
      >
        {/* 컴팩트 행은 썸네일 미표시 — w-14 미니목에서 한글 라벨이 음절 세로쌓임으로 깨진다(시그니처 하드 실패) */}
        <div className="min-w-0 flex-1">
          <p className="truncate">
            <span className="break-keep font-medium">{term.ko.name}</span>
            <span className="ml-2 text-sm text-muted-foreground">{term.en.name}</span>
          </p>
          <p className="mt-0.5 line-clamp-1 break-keep text-sm leading-6 text-muted-foreground">{term.one_liner}</p>
        </div>

        <div className="hidden shrink-0 flex-wrap items-center justify-end gap-1.5 sm:flex">
          {matchReasons.slice(0, 2).map((reason) => (
            <Badge key={reason} variant="secondary" className="rounded-md text-2xs">
              {searchMatchReasonLabels[reason]}
            </Badge>
          ))}
        </div>
        <ArrowUpRight className="hidden size-4 shrink-0 text-muted-foreground transition group-hover:text-primary sm:block" aria-hidden="true" />
      </a>
    )
  }

  return (
    <a
      data-export-card={term.id}
      data-print-card
      href={`/terms/${encodeURIComponent(term.id)}`}
      onClick={openTermPage}
      className={cn(
        "group grid min-h-32 grid-cols-[5.5rem_minmax(0,1fr)] gap-4 px-0 py-4 text-foreground no-underline outline-none transition hover:bg-accent/30 focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center sm:px-3",
        selected && "bg-accent/40"
      )}
    >
      <div className="min-w-0 overflow-hidden rounded-md border bg-background">
        <Suspense fallback={<div aria-hidden="true" className="aspect-[4/3] w-full animate-pulse bg-muted/50" />}>
          <TermVisual variant={term.asset.variant} label={term.ko.name} />
        </Suspense>
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
            <Badge key={reason} variant="secondary" className="rounded-md text-2xs">
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
