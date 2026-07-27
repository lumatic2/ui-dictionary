import { useState } from "react"
import { ChevronDown, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * 아코디언 변형 데모 — UE2 파일럿. 실동작(펼침/접힘) + disabled 상태 포함.
 * 룩은 사이트 시맨틱 토큰만 사용한다 (색 리터럴 금지 — DOG 게이트).
 *
 * 변형 근거 레퍼런스 (직접 구현 재해석 — 전역 인용 규칙, 접근일 2026-07-27):
 * - 기본/단일 펼침 규칙: W3C WAI-ARIA APG Accordion Pattern
 *   https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 * - 보더 묶음형: shadcn/ui Accordion (bordered list-in-container 관례)
 *   https://ui.shadcn.com/docs/components/accordion
 * - 분리 카드형: MUI Accordion (개별 패널이 떨어진 카드로 서는 관례)
 *   https://mui.com/material-ui/react-accordion/
 * - FAQ 형: Tailwind Plus Marketing FAQ sections (질문 강조 + plus/minus 토글)
 *   https://tailwindcss.com/plus/ui-blocks/marketing/sections/faq-sections
 */

type DemoItem = {
  id: string
  title: string
  body: string
  disabled?: boolean
}

const items: DemoItem[] = [
  { id: "shipping", title: "배송은 얼마나 걸리나요?", body: "결제 후 영업일 기준 2~3일 안에 도착합니다. 도서 산간 지역은 하루가 더 걸릴 수 있습니다." },
  { id: "exchange", title: "교환·환불 규정이 궁금해요", body: "수령 후 14일 안에 신청할 수 있습니다. 단순 변심은 왕복 배송비가 부과됩니다." },
  { id: "membership", title: "멤버십 혜택은 어디서 보나요?", body: "마이페이지의 멤버십 탭에서 등급별 적립률과 쿠폰을 확인할 수 있습니다.", disabled: true },
]

function useSingleOpen(initial: string | null = "shipping") {
  const [openId, setOpenId] = useState<string | null>(initial)
  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id))
  return { openId, toggle }
}

/** 변형 1 — 기본: 구분선 목록형. 가장 중립적인 형태. */
export function AccordionBasicDemo() {
  const { openId, toggle } = useSingleOpen()

  return (
    <div className="divide-y">
      {items.map((item) => {
        const open = openId === item.id
        return (
          <div key={item.id}>
            <button
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-medium text-foreground transition hover:text-primary disabled:cursor-not-allowed disabled:text-muted-foreground/60"
              disabled={item.disabled}
              type="button"
              onClick={() => toggle(item.id)}
            >
              {item.title}
              <ChevronDown aria-hidden="true" className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
            </button>
            {open && !item.disabled && <p className="pb-3 text-sm leading-6 text-muted-foreground">{item.body}</p>}
          </div>
        )
      })}
    </div>
  )
}

/** 변형 2 — 보더 묶음형: 한 컨테이너 안에 행이 묶인다. 설정 그룹·패널에 어울린다. */
export function AccordionBorderedDemo() {
  const { openId, toggle } = useSingleOpen()

  return (
    <div className="divide-y overflow-hidden rounded-md border bg-background">
      {items.map((item) => {
        const open = openId === item.id
        return (
          <div key={item.id}>
            <button
              aria-expanded={open}
              className={cn(
                "flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-accent/40 disabled:cursor-not-allowed disabled:text-muted-foreground/60 disabled:hover:bg-transparent",
                open && "bg-accent/30"
              )}
              disabled={item.disabled}
              type="button"
              onClick={() => toggle(item.id)}
            >
              {item.title}
              <ChevronDown aria-hidden="true" className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
            </button>
            {open && !item.disabled && <p className="px-4 pb-3 text-sm leading-6 text-muted-foreground">{item.body}</p>}
          </div>
        )
      })}
    </div>
  )
}

/** 변형 3 — 분리 카드형: 항목이 각각의 카드로 선다. 펼침 항목이 강조된다. */
export function AccordionSplitDemo() {
  const { openId, toggle } = useSingleOpen()

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const open = openId === item.id
        return (
          <div key={item.id} className={cn("rounded-md border bg-background transition", open && "border-primary/40 shadow-sm")}>
            <button
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground/60"
              disabled={item.disabled}
              type="button"
              onClick={() => toggle(item.id)}
            >
              {item.title}
              <ChevronDown aria-hidden="true" className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
            </button>
            {open && !item.disabled && <p className="px-4 pb-3 text-sm leading-6 text-muted-foreground">{item.body}</p>}
          </div>
        )
      })}
    </div>
  )
}

/** 변형 4 — FAQ 형: 질문 강조 + plus/minus 토글, 여백이 넉넉하다. 마케팅 FAQ 섹션 관례. */
export function AccordionFaqDemo() {
  const { openId, toggle } = useSingleOpen()

  return (
    <div className="divide-y">
      {items.map((item) => {
        const open = openId === item.id
        const Icon = open ? Minus : Plus
        return (
          <div key={item.id} className="py-4 first:pt-1 last:pb-1">
            <button
              aria-expanded={open}
              className="flex w-full items-start justify-between gap-4 text-left disabled:cursor-not-allowed"
              disabled={item.disabled}
              type="button"
              onClick={() => toggle(item.id)}
            >
              <span className={cn("text-base font-semibold leading-6 text-foreground", item.disabled && "text-muted-foreground/60")}>
                {item.title}
              </span>
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-muted-foreground">
                <Icon aria-hidden="true" className="size-3.5" />
              </span>
            </button>
            {open && !item.disabled && <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">{item.body}</p>}
          </div>
        )
      })}
    </div>
  )
}
