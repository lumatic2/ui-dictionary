import type { ComponentType } from "react"
import { AccordionBasicDemo, AccordionBorderedDemo, AccordionFaqDemo, AccordionSplitDemo } from "@/components/variation-demos/accordion"
import { TabsPillDemo, TabsUnderlineDemo, TabsVerticalDemo } from "@/components/variation-demos/tabs"

/**
 * 용어 변형·상태 레지스트리 — UE2 데이터 층의 정본.
 *
 * terms.yml 파이프라인에 넣지 않는 이유: 변형 = 설명 + 실동작 데모 컴포넌트 쌍이라
 * YAML 이 코드 참조를 소유할 수 없다. 파일럿(아코디언·탭)으로 형태를 검증한 뒤
 * UE3 규모화 때 데이터/코드 경계를 재확정한다 (plan finding 큐).
 *
 * tier: Tailwind Plus 모델의 표시 층 — "free" = 대표(잠금 없음), "pro" = Pro 배지
 * (잠금 실동작은 UE4). states: 이 변형이 시연하는 상호작용 상태.
 */

export type TermVariationState = "펼침" | "접힘" | "전환" | "비활성" | "hover"

export type TermVariation = {
  id: string
  label: string
  one_liner: string
  tier: "free" | "pro"
  states: TermVariationState[]
  Demo: ComponentType
}

export type TermVariationSet = {
  termId: string
  variations: TermVariation[]
}

export const termVariations = new Map<string, TermVariationSet>([
  [
    "accordion",
    {
      termId: "accordion",
      variations: [
        { id: "basic", label: "기본", one_liner: "구분선 목록형 — 가장 중립적인 형태로 어떤 화면에도 섞인다.", tier: "free", states: ["펼침", "접힘", "비활성"], Demo: AccordionBasicDemo },
        { id: "bordered", label: "보더 묶음형", one_liner: "한 컨테이너 안에 행이 묶인다 — 설정 그룹·패널에 어울린다.", tier: "pro", states: ["펼침", "접힘", "비활성"], Demo: AccordionBorderedDemo },
        { id: "split", label: "분리 카드형", one_liner: "항목이 각각의 카드로 서고 펼친 항목이 강조된다.", tier: "pro", states: ["펼침", "접힘", "비활성"], Demo: AccordionSplitDemo },
        { id: "faq", label: "FAQ 형", one_liner: "질문을 크게 세우고 plus/minus 로 여닫는 마케팅 FAQ 관례.", tier: "pro", states: ["펼침", "접힘", "비활성"], Demo: AccordionFaqDemo },
      ],
    },
  ],
  [
    "tabs",
    {
      termId: "tabs",
      variations: [
        { id: "underline", label: "밑줄형", one_liner: "활성 탭 아래 인디케이터 — 콘텐츠 페이지의 기본형.", tier: "free", states: ["전환", "비활성"], Demo: TabsUnderlineDemo },
        { id: "pill", label: "필형(세그먼트)", one_liner: "묶인 컨트롤 안에서 하나가 선택된다 — 짧은 상호 배타 선택.", tier: "pro", states: ["전환", "비활성"], Demo: TabsPillDemo },
        { id: "vertical", label: "세로형", one_liner: "좌측 목록 + 우측 패널 — 설정·문서처럼 항목이 많을 때.", tier: "pro", states: ["전환", "비활성"], Demo: TabsVerticalDemo },
      ],
    },
  ],
])

export function getTermVariations(termId: string): TermVariationSet | undefined {
  return termVariations.get(termId)
}
