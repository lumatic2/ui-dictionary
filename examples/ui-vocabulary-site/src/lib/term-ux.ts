import type { VocabularyTerm } from "@/data/terms.generated"
import { categoryGroups } from "@/lib/search"

export type RelatedTerm = {
  term: VocabularyTerm
  relation: "비교" | "대안" | "함께 사용"
  note: string
}

export type UseCase = {
  id: string
  label: string
  description: string
  query: string
  termIds: string[]
}

const explicitRelations: Record<string, Array<{ id: string; relation: RelatedTerm["relation"]; note: string }>> = {
  dialog: [
    { id: "modal-bottom-sheet", relation: "대안", note: "모바일에서 짧은 선택이나 폼이면 아래에서 올라오는 시트가 더 자연스럽다." },
    { id: "full-screen-dialog", relation: "대안", note: "작업이 길거나 폼이 복잡하면 전체 화면 다이얼로그가 낫다." },
    { id: "mobile-alert-dialog", relation: "비교", note: "확인/경고만 필요하면 일반 dialog보다 더 작고 결정 중심으로 쓴다." },
  ],
  "mobile-bottom-sheet": [
    { id: "standard-bottom-sheet", relation: "비교", note: "배경 조작을 막지 않는 보조 패널이면 standard bottom sheet." },
    { id: "modal-bottom-sheet", relation: "비교", note: "배경을 막고 결정을 받아야 하면 modal bottom sheet." },
    { id: "sheet-drag-handle", relation: "함께 사용", note: "시트를 드래그로 확장/축소할 수 있으면 손잡이를 함께 둔다." },
  ],
  toast: [
    { id: "snackbar", relation: "비교", note: "짧은 행동 버튼이 필요하면 snackbar가 더 명확하다." },
    { id: "mobile-toast", relation: "비교", note: "모바일에서 아주 짧은 상태 피드백이면 floating toast가 가볍다." },
    { id: "undo-toast", relation: "함께 사용", note: "작업을 되돌릴 수 있어야 하면 undo action을 포함한다." },
  ],
  "tab-bar": [
    { id: "bottom-navigation", relation: "비교", note: "Material 계열의 최상위 destination 전환은 bottom navigation이라고 부르는 경우가 많다." },
    { id: "mobile-segmented-tabs", relation: "대안", note: "같은 화면 안의 하위 보기 전환이면 segmented tabs가 더 compact하다." },
  ],
  "bottom-navigation": [
    { id: "tab-bar", relation: "비교", note: "iOS 맥락에서는 같은 하단 destination 전환을 tab bar라고 부르는 경우가 많다." },
    { id: "bottom-app-bar", relation: "비교", note: "목적지 전환이 아니라 명령 실행이면 bottom app bar다." },
  ],
  "search-field": [
    { id: "mobile-search-header", relation: "대안", note: "검색이 화면의 핵심이면 모바일 헤더 자체를 검색창으로 만든다." },
    { id: "mobile-search-sheet", relation: "대안", note: "추천과 결과를 넓게 보여줘야 하면 별도 검색 시트를 연다." },
    { id: "autocomplete", relation: "함께 사용", note: "입력 중 후보를 보여주려면 autocomplete를 붙인다." },
  ],
  "product-card": [
    { id: "product-option-sheet", relation: "함께 사용", note: "모바일 상품 카드에서 옵션 선택은 하단 시트로 분리하면 편하다." },
    { id: "cart-summary-bar", relation: "함께 사용", note: "장바구니 상태를 계속 보여줘야 하면 하단 요약 바를 둔다." },
  ],
}

const relationLabels: Record<string, RelatedTerm["relation"]> = {
  compare: "비교",
  alternative: "대안",
  "use-with": "함께 사용",
}

export const useCases: UseCase[] = [
  {
    id: "mobile-commerce",
    label: "모바일 커머스",
    description: "상품 상세, 옵션 선택, 장바구니, 결제 흐름.",
    query: "상품 옵션 아래에서 선택",
    termIds: ["product-card", "product-option-sheet", "cart-summary-bar", "bottom-cta-bar", "checkout-progress-header"],
  },
  {
    id: "mobile-map",
    label: "지도·위치 앱",
    description: "지도 위 패널, 위치 권한, 장소 검색.",
    query: "지도 아래 패널",
    termIds: ["map-bottom-panel", "location-permission-empty", "address-autocomplete", "permission-prompt"],
  },
  {
    id: "auth-login",
    label: "로그인·인증",
    description: "OTP, 패스코드, 생체 인증, 권한 요청.",
    query: "SMS 인증번호 6자리",
    termIds: ["otp-code-input", "passcode-keypad", "biometric-prompt", "permission-education-screen"],
  },
  {
    id: "feed-social",
    label: "피드·소셜",
    description: "스토리, 피드 카드, 댓글 입력, 빈 피드.",
    query: "스토리 넘기는 화면",
    termIds: ["story-rail", "story-viewer", "feed-card-mobile", "comment-composer", "mobile-empty-feed"],
  },
  {
    id: "dashboard-filter",
    label: "대시보드 필터",
    description: "표 검색, 고급 필터, 저장 뷰, 대량 작업.",
    query: "표 필터",
    termIds: ["data-table-toolbar", "filter-panel", "faceted-filter", "saved-view-tabs", "bulk-action-bar"],
  },
  {
    id: "analytics-dashboard",
    label: "분석·리포트",
    description: "차트, 지표 카드, 비교표, 히스토리.",
    query: "지표 카드와 차트",
    termIds: ["metric-card", "chart", "chart-axis", "legend", "comparison-table", "activity-feed"],
  },
  {
    id: "landing-marketing",
    label: "랜딩·마케팅",
    description: "히어로, CTA, 후기, 기능 섹션, 장식 효과.",
    query: "랜딩 페이지 hero",
    termIds: ["hero", "cta-section", "testimonial-section", "feature-grid-section", "spotlight-hero", "animated-gradient-background"],
  },
  {
    id: "design-system",
    label: "디자인 시스템",
    description: "토큰, 색상, 표면, 타이포그래피, 상태 표현.",
    query: "디자인 토큰",
    termIds: ["theme-token", "semantic-color", "border-radius", "shadow-elevation", "font-weight", "focus-ring"],
  },
  {
    id: "responsive-layout",
    label: "반응형 레이아웃",
    description: "뷰포트, 컨테이너 쿼리, 안전 영역, 스크롤.",
    query: "모바일 반응형 레이아웃",
    termIds: ["responsive-layout", "container-query", "mobile-first", "safe-area-inset", "dynamic-viewport-unit", "scroll-snap"],
  },
  {
    id: "accessibility-review",
    label: "접근성 점검",
    description: "ARIA, 포커스, 스크린리더, 모션 저감.",
    query: "접근성 포커스 상태",
    termIds: ["aria-live", "aria-invalid", "sr-only", "focus-trap", "reduced-motion", "color-contrast"],
  },
  {
    id: "onboarding",
    label: "온보딩·가이드",
    description: "첫 사용 안내, 코치마크, 진행 상태.",
    query: "온보딩 넘김 화면",
    termIds: ["onboarding-pager", "coach-mark", "onboarding-checklist", "setup-progress"],
  },
]

export function getRelatedTerms(term: VocabularyTerm, terms: VocabularyTerm[], limit = 5): RelatedTerm[] {
  const byId = new Map(terms.map((item) => [item.id, item]))
  const yamlRelations = (term.related ?? []).flatMap((item) => {
    const related = byId.get(item.id)
    return related ? [{ term: related, relation: relationLabels[item.relation] ?? "비교", note: item.note }] : []
  })
  const explicit = (explicitRelations[term.id] ?? []).flatMap((item) => {
    const related = byId.get(item.id)
    return related ? [{ term: related, relation: item.relation, note: item.note }] : []
  })

  const primary = [...yamlRelations, ...explicit]
  if (primary.length > 0) {
    return primary.slice(0, limit)
  }

  const seen = new Set([term.id, ...primary.map((item) => item.term.id)])
  const group = categoryGroups.find((item) => item.ids.includes(term.id))
  const groupFallback = (group?.ids ?? []).flatMap((id) => {
    if (seen.has(id)) {
      return []
    }
    const related = byId.get(id)
    if (!related) {
      return []
    }
    seen.add(id)
    return [{ term: related, relation: "비교" as const, note: `같은 세부 분류인 '${group?.label}'에서 함께 비교할 만한 용어다.` }]
  })

  return [...primary, ...groupFallback].slice(0, limit)
}

export function getUseCasesForTerm(term: VocabularyTerm) {
  return useCases.filter((item) => item.termIds.includes(term.id))
}
