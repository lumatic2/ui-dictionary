import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * 탭 변형 데모 — UE2 파일럿. 실동작(전환) + disabled 탭 상태 포함.
 * 룩은 사이트 시맨틱 토큰만 사용한다.
 *
 * 변형 근거 레퍼런스 (직접 구현 재해석 — 전역 인용 규칙, 접근일 2026-07-27):
 * - 기본/키보드 규칙: W3C WAI-ARIA APG Tabs Pattern
 *   https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 * - 밑줄형: Material Design 3 Tabs (primary tabs, active indicator)
 *   https://m3.material.io/components/tabs/overview
 * - 필형(세그먼트): Apple HIG Segmented Controls
 *   https://developer.apple.com/design/human-interface-guidelines/segmented-controls
 * - 세로형: 문서 사이트 설정/사이드 탭 관례 (Tailwind Plus Application UI Tabs)
 *   https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/tabs
 */

type DemoTab = {
  id: string
  label: string
  body: string
  disabled?: boolean
}

const tabs: DemoTab[] = [
  { id: "overview", label: "개요", body: "이 주문의 상태, 결제 수단, 배송 예정일을 한눈에 보여줍니다." },
  { id: "shipping", label: "배송", body: "운송장 번호와 배송 추적 이력이 시간순으로 나열됩니다." },
  { id: "invoice", label: "영수증", body: "결제 항목별 금액과 부가세가 표로 정리됩니다.", disabled: true },
]

function useActiveTab(initial = "overview") {
  const [activeId, setActiveId] = useState(initial)
  return { activeId, setActiveId }
}

function TabPanel({ activeId }: { activeId: string }) {
  const active = tabs.find((tab) => tab.id === activeId)
  return <p className="pt-3 text-sm leading-6 text-muted-foreground">{active?.body}</p>
}

/** 변형 1 — 밑줄형: 활성 탭 아래 인디케이터. 콘텐츠 페이지의 기본형. */
export function TabsUnderlineDemo() {
  const { activeId, setActiveId } = useActiveTab()

  return (
    <div>
      <div aria-label="주문 상세 탭" className="flex gap-1 border-b" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            aria-selected={activeId === tab.id}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition",
              activeId === tab.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              tab.disabled && "cursor-not-allowed text-muted-foreground/50 hover:text-muted-foreground/50"
            )}
            disabled={tab.disabled}
            role="tab"
            type="button"
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <TabPanel activeId={activeId} />
    </div>
  )
}

/** 변형 2 — 필형(세그먼트): 묶인 컨트롤 안에서 하나가 선택된다. 짧은 상호 배타 선택. */
export function TabsPillDemo() {
  const { activeId, setActiveId } = useActiveTab()

  return (
    <div>
      <div aria-label="주문 상세 탭" className="inline-flex items-center gap-1 rounded-lg bg-muted p-1" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            aria-selected={activeId === tab.id}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition",
              activeId === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              tab.disabled && "cursor-not-allowed text-muted-foreground/50 hover:text-muted-foreground/50"
            )}
            disabled={tab.disabled}
            role="tab"
            type="button"
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <TabPanel activeId={activeId} />
    </div>
  )
}

/** 변형 3 — 세로형: 좌측 탭 목록 + 우측 패널. 설정·문서처럼 항목이 많을 때. */
export function TabsVerticalDemo() {
  const { activeId, setActiveId } = useActiveTab()

  return (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
      <div aria-label="주문 상세 탭" className="flex flex-col gap-1 border-r pr-2" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            aria-selected={activeId === tab.id}
            className={cn(
              "rounded-md px-3 py-1.5 text-left text-sm font-medium transition",
              activeId === tab.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              tab.disabled && "cursor-not-allowed text-muted-foreground/50 hover:bg-transparent hover:text-muted-foreground/50"
            )}
            disabled={tab.disabled}
            role="tab"
            type="button"
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <TabPanel activeId={activeId} />
    </div>
  )
}
