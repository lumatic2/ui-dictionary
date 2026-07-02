import type { TermCategory, TermKind, VocabularyTerm } from "@/data/terms.generated"
import { getNavigationCollection, isNavigationFilter, type NavigationFilter } from "@/lib/navigation-model"

export type TermKindFilter = `kind:${TermKind}`
export type TermKindCategoryFilter = `kind:${TermKind}:category:${TermCategory}`
export type TermKindGroupFilter = `kind:${TermKind}:group:${TermGroupId}`
export type TermFilter = "all" | TermCategory | TermGroupId | TermKindFilter | TermKindCategoryFilter | TermKindGroupFilter | NavigationFilter
export type SearchMatchReason =
  | "name"
  | "alias"
  | "category"
  | "kind"
  | "group"
  | "one_liner"
  | "description"
  | "visual_anatomy"
  | "when_to_use"
  | "prompt_phrase"

export type SearchResult = {
  term: VocabularyTerm
  score: number
  reasons: SearchMatchReason[]
  matchedText: string[]
}

export const categoryLabels: Record<TermCategory, string> = {
  input: "입력",
  selection: "선택·탐색",
  action: "행동",
  structure: "구조",
  feedback: "상태·피드백",
  "data-display": "데이터·콘텐츠",
  style: "스타일·재질",
  "layout-rendering": "레이아웃·렌더링",
  accessibility: "접근성",
}

export const searchMatchReasonLabels: Record<SearchMatchReason, string> = {
  name: "이름 일치",
  alias: "별칭 일치",
  category: "주제 일치",
  kind: "단위 일치",
  group: "세부 분류 일치",
  one_liner: "한 줄 설명",
  description: "설명 일치",
  visual_anatomy: "생김새 단서",
  when_to_use: "사용 상황",
  prompt_phrase: "AI 요청 문장",
}

export const kindLabels: Record<TermKind, string> = {
  component: "컴포넌트",
  block: "화면 블록",
  "form-pattern": "폼 패턴",
  "visual-effect": "시각 효과",
  "motion-pattern": "모션 패턴",
  "visual-treatment": "시각 처리",
}

export type TermGroupId =
  | "input-text"
  | "input-search-command"
  | "input-pickers"
  | "input-file-media"
  | "input-editing"
  | "input-auth-forms"
  | "selection-options"
  | "selection-navigation"
  | "selection-menus"
  | "selection-context"
  | "action-buttons"
  | "action-command-bars"
  | "action-bulk-danger"
  | "action-editor-media"
  | "structure-app-layout"
  | "structure-panels"
  | "structure-navigation"
  | "structure-sections"
  | "structure-mobile"
  | "structure-auth-layouts"
  | "structure-sidebar-layouts"
  | "feedback-alerts-toasts"
  | "feedback-loading-progress"
  | "feedback-empty-error"
  | "feedback-access-limits"
  | "feedback-auth-security"
  | "feedback-status-notifications"
  | "data-tables-lists"
  | "data-metrics-charts"
  | "data-timeline-history"
  | "data-people-integrations"
  | "structure-content-elements"
  | "data-basic-content-elements"
  | "data-chat-messaging"
  | "data-account-support"
  | "data-commerce-billing"
  | "data-motion-content"
  | "feedback-confirmation-help"
  | "feedback-accessibility-states"
  | "feedback-interaction-states"
  | "style-surface-material"
  | "style-border-color"
  | "style-typography"
  | "style-tokens"
  | "style-decorative-effects"
  | "layout-spacing-sizing"
  | "layout-responsive-viewport"
  | "layout-stacking-overflow"
  | "layout-scroll-behavior"
  | "accessibility-aria-screen-reader"
  | "accessibility-focus-motion"
  | "data-display-misc"
  | "structure-misc"
  | "selection-misc"
  | "action-misc"
  | "feedback-misc"
  | "style-misc"
type TermGroup = {
  id: TermGroupId
  category: TermCategory
  label: string
  ids: string[]
}

export const categoryGroups: TermGroup[] = [
  {
    id: "input-text",
    category: "input",
    label: "텍스트·숫자 입력",
    ids: ["text-field", "textarea", "textarea-autosize", "password-field", "number-input", "spin-button", "masked-input", "input-group", "otp-code-input", "passcode-keypad", "comment-composer", "copy-field", "api-key-field", "field-group", "floating-label-field", "clearable-input", "inline-submit-field", "character-count-field", "fieldset"],
  },
  {
    id: "input-search-command",
    category: "input",
    label: "검색·명령 입력",
    ids: ["search-field", "search-view", "mobile-search-header", "mobile-search-sheet", "address-autocomplete", "autocomplete", "search-suggestions", "command-palette"],
  },
  {
    id: "input-pickers",
    category: "input",
    label: "선택형 입력",
    ids: ["select", "native-select", "combobox", "date-picker", "mobile-date-picker", "date-range-picker", "time-picker", "time-wheel-picker", "wheel-picker", "color-picker", "rating-input", "tag-input", "tag-picker", "chip-input-mobile", "contact-picker", "product-option-sheet", "coupon-field", "quantity-stepper", "otp-input", "date-preset-picker", "pull-to-refresh-indicator"],
  },
  {
    id: "input-file-media",
    category: "input",
    label: "파일·미디어 입력",
    ids: ["file-upload", "upload-dropzone"],
  },
  {
    id: "input-editing",
    category: "input",
    label: "인라인 편집",
    ids: ["inline-edit", "rich-text-editor"],
  },
  {
    id: "input-auth-forms",
    category: "input",
    label: "계정·설정 폼",
    ids: ["login-form", "signup-form", "forgot-password-form", "reset-password-form", "change-password-form", "magic-link-login-form", "sso-login-form", "otp-challenge-form", "mfa-challenge-form", "passkey-login-form", "invite-signup-form", "account-creation-form", "email-change-form", "reauthentication-form", "react-hook-form-pattern", "tanstack-form-pattern", "formisch-form-pattern", "popover-form", "profile-settings-form", "newsletter-section"],
  },
  {
    id: "selection-options",
    category: "selection",
    label: "옵션 선택",
    ids: ["checkbox", "radio-group", "switch", "slider", "range-slider", "segmented-control", "tabs", "content-tabs", "listbox", "chip", "filter-chip", "inline-date-range-chip", "toggle-button", "toggle-group", "multi-select", "transfer-list", "disclosure", "import-data-choice", "auth-method-choice", "checkbox-card"],
  },
  {
    id: "selection-navigation",
    category: "selection",
    label: "탐색 전환",
    ids: ["breadcrumb", "breadcrumbs-menu", "pagination", "stepper", "page-control", "onboarding-pager", "navigation-rail", "sidebar-nav", "bottom-navigation", "tab-bar", "mobile-segmented-tabs", "scope-bar", "anchor-nav", "back-button", "edge-swipe-back", "navigation-bar", "tree-navigation", "wizard", "navigation-menu"],
  },
  {
    id: "selection-menus",
    category: "selection",
    label: "메뉴·드롭다운",
    ids: ["dropdown-menu", "mega-menu", "context-menu", "menu-bar", "mobile-popover-menu", "long-press-menu", "saved-view-tabs"],
  },
  {
    id: "selection-context",
    category: "selection",
    label: "계정·결제 컨텍스트",
    ids: ["workspace-switcher", "account-switcher", "payment-method-card"],
  },
  {
    id: "action-buttons",
    category: "action",
    label: "버튼·아이콘 행동",
    ids: ["button", "primary-button", "secondary-button", "destructive-button", "icon-button", "floating-action-button", "floating-search-button", "bottom-app-bar", "bottom-cta-bar", "voice-input-button", "clear-text-button", "link", "button-group", "split-button", "copy-button", "download-button", "share-button", "close-button", "overflow-button", "loading-button", "icon-toggle-button", "speed-dial", "social-login-button-group", "cta-section"],
  },
  {
    id: "action-command-bars",
    category: "action",
    label: "툴바·커맨드",
    ids: ["toolbar", "command-bar", "canvas-toolbar", "menu-item", "action-sheet", "share-sheet", "table-row-actions"],
  },
  {
    id: "action-bulk-danger",
    category: "action",
    label: "대량·위험 작업",
    ids: ["bulk-action-bar", "swipe-action", "swipe-to-delete", "swipe-action-row", "grab-handle", "destructive-confirmation"],
  },
  {
    id: "action-editor-media",
    category: "action",
    label: "편집·미디어 제어",
    ids: ["scrubber", "video-player-controls", "audio-player-controls", "cropper", "pinch-zoom-viewer"],
  },
  {
    id: "structure-app-layout",
    category: "structure",
    label: "앱·페이지 레이아웃",
    ids: ["app-shell", "page-layout", "dashboard-grid", "global-header", "top-app-bar", "header", "footer", "page-title-bar", "breadcrumb-header", "utility-bar", "status-bar", "checkout-step", "dashboard-overview-page", "settings-page-layout", "billing-settings-page", "onboarding-flow-page"],
  },
  {
    id: "structure-panels",
    category: "structure",
    label: "패널·오버레이",
    ids: ["card", "dialog", "drawer", "side-sheet", "popover", "floating-panel", "dockable-panel", "right-rail", "inspector-panel", "properties-panel", "preview-pane", "resizable-panel", "split-pane", "master-detail", "lightbox", "disclosure-card"],
  },
  {
    id: "structure-navigation",
    category: "structure",
    label: "사이드바·보드 구조",
    ids: ["navigation-drawer", "collapsible-sidebar", "mini-sidebar", "sidebar-section", "board-column", "navbar-menu", "nav-user-menu", "breadcrumb-overflow", "pagination-jump", "floating-navbar"],
  },
  {
    id: "structure-sections",
    category: "structure",
    label: "섹션·콘텐츠 구조",
    ids: ["grid", "section", "container", "hero", "disclosure-group", "sticky-header", "sticky-footer-bar", "pricing-section", "feature-grid-section", "bento-grid", "sticky-scroll-section", "spotlight-hero"],
  },
  {
    id: "structure-mobile",
    category: "structure",
    label: "반응형·모바일",
    ids: ["responsive-stack", "safe-area", "mobile-status-bar", "mobile-app-bar", "large-title-header", "standard-bottom-sheet", "modal-bottom-sheet", "mobile-filter-bottom-sheet", "full-screen-dialog", "sheet-drag-handle", "scrim", "carousel-peek", "media-lightbox-mobile", "map-bottom-panel", "mobile-bottom-sheet"],
  },
  {
    id: "structure-auth-layouts",
    category: "structure",
    label: "인증·온보딩 화면",
    ids: ["auth-card", "login-page", "split-auth-layout", "login-dialog", "invite-acceptance-screen", "welcome-choice-screen", "consent-review-screen"],
  },
  {
    id: "structure-sidebar-layouts",
    category: "structure",
    label: "사이드바 레이아웃",
    ids: ["sidebar-dashboard-layout", "collapsible-sidebar-layout", "icon-sidebar-layout", "inset-sidebar-layout", "right-sidebar-layout", "dual-sidebar-layout", "file-tree-sidebar-layout", "calendar-sidebar-layout", "sidebar-dialog-layout"],
  },
  {
    id: "feedback-alerts-toasts",
    category: "feedback",
    label: "알림·토스트·배너",
    ids: ["toast", "snackbar", "mobile-snackbar", "mobile-toast", "mobile-alert-dialog", "touch-ripple", "undo-toast", "toast-stack", "alert", "inline-alert", "message-bar", "success-toast", "error-toast", "announcement-banner", "trial-banner"],
  },
  {
    id: "feedback-loading-progress",
    category: "feedback",
    label: "로딩·진행",
    ids: ["progress-bar", "spinner", "skeleton", "skeleton-table", "loading-state", "syncing-state", "saving-indicator", "inline-loading", "setup-progress"],
  },
  {
    id: "feedback-empty-error",
    category: "feedback",
    label: "빈 상태·오류 복구",
    ids: ["empty-state", "mobile-empty-feed", "location-permission-empty", "empty-search-result", "empty-table", "empty-filter-state", "error-state", "warning-state", "info-state", "success-state", "validation-message", "error-boundary", "retry-panel", "maintenance-state"],
  },
  {
    id: "feedback-access-limits",
    category: "feedback",
    label: "권한·제한·세션",
    ids: ["permission-state", "permission-prompt", "permission-education-screen", "biometric-prompt", "locked-state", "offline-state", "rate-limit-state", "session-expired-dialog", "upgrade-prompt", "quota-warning", "unsaved-changes-banner"],
  },
  {
    id: "feedback-auth-security",
    category: "feedback",
    label: "인증·보안 상태",
    ids: ["email-verification-banner", "verification-required-screen", "magic-link-sent-state", "passkey-enrollment-prompt", "passkey-sign-in-sheet", "recovery-code-warning", "trusted-device-prompt", "device-approval-state", "access-request-panel", "access-pending-state", "invite-expired-state", "workspace-join-request", "setup-blocker-state", "reconnect-account-state"],
  },
  {
    id: "feedback-status-notifications",
    category: "feedback",
    label: "상태·알림 센터",
    ids: ["badge", "status-indicator", "status-chip", "health-indicator", "connection-status", "notification-center", "info-label", "role-badge", "order-status", "checkout-progress-header", "delivery-tracker", "coach-mark", "hover-card", "sonner-toast", "conversation-marker", "password-strength-meter", "meter", "progress-stepper"],
  },
  {
    id: "data-tables-lists",
    category: "data-display",
    label: "테이블·리스트",
    ids: ["table", "data-grid", "data-table-toolbar", "column-header-menu", "column-visibility-menu", "table-density-control", "comparison-table", "pivot-table", "tree-table", "tree-view", "expandable-row", "detail-row", "list", "structured-list", "contained-list", "grouped-list", "nested-list", "draggable-list", "drag-to-reorder-list", "virtualized-list", "infinite-scroll", "pull-to-refresh", "selection-summary", "filter-bar", "filter-panel", "faceted-filter", "advanced-filter-builder", "query-builder", "sort-control"],
  },
  {
    id: "data-metrics-charts",
    category: "data-display",
    label: "지표·차트",
    ids: ["metric-card", "chart", "legend", "chart-axis", "stat-list", "map-marker", "area-chart-card", "bar-chart-card", "line-chart-card", "pie-chart-card", "radar-chart-card", "radial-chart-card", "interactive-chart-card", "stacked-chart-card", "chart-tooltip-pattern", "chart-kpi-card"],
  },
  {
    id: "data-timeline-history",
    category: "data-display",
    label: "활동·히스토리",
    ids: ["timeline", "activity-feed", "audit-log", "notification-list", "version-history-list"],
  },
  {
    id: "data-people-integrations",
    category: "data-display",
    label: "사람·연동",
    ids: ["avatar", "avatar-group", "team-member-row", "webhook-endpoint-row", "integration-card", "connection-card", "avatar-stack", "status-avatar", "badge-group", "integration-grid-section"],
  },
  {
    id: "structure-content-elements",
    category: "structure",
    label: "콘텐츠 구조 요소",
    ids: ["aspect-ratio-box", "scroll-area", "message-scroller"],
  },
  {
    id: "data-basic-content-elements",
    category: "data-display",
    label: "기본 콘텐츠 요소",
    ids: ["thumbnail", "image", "logo", "icon", "typography", "label", "divider", "spacer", "accordion", "carousel", "item-row"],
  },
  {
    id: "data-chat-messaging",
    category: "data-display",
    label: "채팅·메시지",
    ids: ["chat-message", "chat-bubble", "chat-attachment", "notification-inbox-row"],
  },
  {
    id: "data-account-support",
    category: "data-display",
    label: "계정·지원 정보",
    ids: ["mfa-enrollment-card", "recovery-code-panel", "keyboard-shortcut-key"],
  },
  {
    id: "data-commerce-billing",
    category: "data-display",
    label: "커머스·청구",
    ids: ["image-gallery", "attachment-list", "feature-comparison", "cart-summary", "cart-summary-bar", "address-card", "billing-summary", "invoice-row"],
  },
  {
    id: "data-motion-content",
    category: "data-display",
    label: "움직이는 콘텐츠",
    ids: ["number-ticker", "infinite-moving-cards"],
  },
  {
    id: "feedback-confirmation-help",
    category: "feedback",
    label: "확인·도움말",
    ids: ["confirmation-dialog", "tooltip"],
  },
  {
    id: "feedback-accessibility-states",
    category: "feedback",
    label: "동기화·예측 상태",
    ids: ["optimistic-update", "pending-state", "gesture-hint"],
  },
  {
    id: "feedback-interaction-states",
    category: "feedback",
    label: "인터랙션 상태",
    ids: ["hover-state", "focus-ring", "active-state", "disabled-state", "selected-state", "drag-state", "drop-target", "tap-feedback", "hover-reveal"],
  },
  {
    id: "style-surface-material",
    category: "style",
    label: "표면·재질",
    ids: ["glassmorphism", "translucent-surface", "backdrop-blur", "shadow-elevation", "inner-shadow", "noise-texture"],
  },
  {
    id: "style-border-color",
    category: "style",
    label: "선·색상 처리",
    ids: ["opacity", "border-radius", "gradient-fill", "hairline-border", "highlight-stroke", "outline", "blend-mode", "semantic-color"],
  },
  {
    id: "style-typography",
    category: "style",
    label: "타이포그래피 처리",
    ids: ["font-weight", "line-height", "letter-spacing", "text-overflow", "line-clamp", "animated-shiny-text"],
  },
  {
    id: "style-tokens",
    category: "style",
    label: "토큰·시맨틱",
    ids: ["theme-token"],
  },
  {
    id: "style-decorative-effects",
    category: "style",
    label: "장식·배경 효과",
    ids: ["animated-gradient-background", "grid-pattern-background", "dot-pattern-background", "background-beams", "aurora-background", "shimmer-effect", "border-beam", "spotlight-card", "three-d-card", "canvas-reveal-card", "scroll-fade", "orbiting-icons", "marquee-row", "tracing-beam-section"],
  },
  {
    id: "layout-spacing-sizing",
    category: "layout-rendering",
    label: "간격·크기",
    ids: ["gap", "padding", "aspect-ratio", "object-fit"],
  },
  {
    id: "layout-responsive-viewport",
    category: "layout-rendering",
    label: "반응형·뷰포트",
    ids: ["breakpoint", "responsive-layout", "container-query", "mobile-first", "fluid-layout", "dynamic-viewport-unit", "safe-area-inset"],
  },
  {
    id: "layout-stacking-overflow",
    category: "layout-rendering",
    label: "겹침·넘침",
    ids: ["z-index", "stacking-context", "overflow", "clipping-mask", "sticky-position", "layout-shift"],
  },
  {
    id: "layout-scroll-behavior",
    category: "layout-rendering",
    label: "스크롤 동작",
    ids: ["scroll-snap"],
  },
  {
    id: "accessibility-aria-screen-reader",
    category: "accessibility",
    label: "ARIA·스크린리더",
    ids: ["aria-expanded", "aria-invalid", "aria-live", "sr-only"],
  },
  {
    id: "accessibility-focus-motion",
    category: "accessibility",
    label: "포커스·움직임 접근성",
    ids: ["focus-trap", "reduced-motion", "color-contrast", "direction-provider"],
  },
  {
    id: "data-display-misc",
    category: "data-display",
    label: "기타 데이터·콘텐츠",
    ids: ["kanban", "calendar-view", "description-list", "feed-card-mobile", "story-rail", "story-viewer", "media-card", "file-card", "product-card", "price-card", "plan-card", "calendar-event-card", "kanban-card", "onboarding-checklist", "help-center-card", "faq-list", "release-note-card", "profile-card"],
  },
  {
    id: "structure-misc",
    category: "structure",
    label: "기타 구조",
    ids: ["favicon", "open-graph-image", "testimonial-section"],
  },
  {
    id: "selection-misc",
    category: "selection",
    label: "기타 선택·탐색",
    ids: ["row-selection"],
  },
  {
    id: "action-misc",
    category: "action",
    label: "기타 행동",
    ids: ["reorder-handle"],
  },
  {
    id: "feedback-misc",
    category: "feedback",
    label: "기타 상태·피드백",
    ids: ["typing-text-effect", "blur-fade-in", "transition", "duration", "easing", "fade-transition", "slide-transition", "scale-transition"],
  },
  {
    id: "style-misc",
    category: "style",
    label: "기타 스타일·재질",
    ids: ["hover-card-stack"],
  },
]

export const categoryGroupsByCategory = categoriesToGroups()

const discoveryQueryBoosts = [
  { query: "토글", matches: [{ id: "switch", weight: 100 }, { id: "toggle-button", weight: 80 }, { id: "toggle-group", weight: 40 }] },
  { query: "켜고 끄는", matches: [{ id: "switch", weight: 80 }, { id: "toggle-button", weight: 70 }] },
  { query: "옆에서 나오는 창", matches: [{ id: "drawer", weight: 80 }, { id: "side-sheet", weight: 70 }, { id: "navigation-drawer", weight: 60 }] },
  { query: "위에 뜨는 창", matches: [{ id: "dialog", weight: 80 }, { id: "popover", weight: 70 }, { id: "tooltip", weight: 60 }] },
  { query: "표 필터", matches: [{ id: "filter-bar", weight: 80 }, { id: "filter-panel", weight: 70 }, { id: "faceted-filter", weight: 60 }, { id: "data-table-toolbar", weight: 50 }] },
  { query: "빈 화면", matches: [{ id: "empty-state", weight: 80 }, { id: "empty-search-result", weight: 70 }, { id: "empty-table", weight: 60 }] },
  { query: "카드 넘기기", matches: [{ id: "carousel", weight: 80 }, { id: "image-gallery", weight: 70 }] },
  { query: "결제 카드", matches: [{ id: "payment-method-card", weight: 80 }, { id: "price-card", weight: 70 }, { id: "plan-card", weight: 60 }] },
  { query: "진행 상태", matches: [{ id: "progress-bar", weight: 80 }, { id: "stepper", weight: 70 }, { id: "setup-progress", weight: 60 }] },
  { query: "명령어", matches: [{ id: "command-palette", weight: 80 }, { id: "search-view", weight: 70 }] },
  { query: "여러 개 중 하나", matches: [{ id: "radio-group", weight: 80 }, { id: "select", weight: 70 }, { id: "segmented-control", weight: 60 }] },
  { query: "목록에서 고르기", matches: [{ id: "select", weight: 80 }, { id: "combobox", weight: 70 }, { id: "dropdown-menu", weight: 60 }] },
  { query: "잠깐 뜨는 안내", matches: [{ id: "toast", weight: 80 }, { id: "snackbar", weight: 70 }, { id: "announcement-banner", weight: 60 }] },
  { query: "지도 아래 패널", matches: [{ id: "map-bottom-panel", weight: 100 }, { id: "mobile-bottom-sheet", weight: 60 }] },
  { query: "스토리 넘기는 화면", matches: [{ id: "story-viewer", weight: 100 }, { id: "story-rail", weight: 70 }, { id: "carousel", weight: 40 }] },
  { query: "상품 옵션 아래에서 선택", matches: [{ id: "product-option-sheet", weight: 100 }, { id: "standard-bottom-sheet", weight: 60 }, { id: "quantity-stepper", weight: 30 }] },
  { query: "고정된 하단 결제 버튼", matches: [{ id: "bottom-cta-bar", weight: 100 }, { id: "cart-summary-bar", weight: 70 }, { id: "sticky-footer-bar", weight: 40 }] },
]

export function searchTerms(
  terms: VocabularyTerm[],
  query: string,
  filter: TermFilter
) {
  const normalizedQuery = normalize(query)

  return terms.flatMap((term, index) => {
    if (!matchesFilter(term, filter)) {
      return []
    }
    if (!normalizedQuery) {
      return [{ term, score: 0, reasons: [], matchedText: [], sourceIndex: index }]
    }

    const result = scoreTerm(term, normalizedQuery)
    if (result.score === 0) {
      return []
    }

    return [{ ...result, sourceIndex: index }]
  }).sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score
    }

    return left.sourceIndex - right.sourceIndex
  }).map(({ sourceIndex: _sourceIndex, ...result }) => result)
}

export function searchableText(term: VocabularyTerm) {
  return normalize(
    [
      term.id,
      term.category,
      term.kind,
      term.ko.name,
      ...term.ko.aliases,
      term.en.name,
      ...term.en.aliases,
      term.one_liner,
      term.description,
      ...(term.navigation?.canonical_path ?? []),
      ...(term.navigation?.also_appears_in ?? []).flat(),
      ...term.visual_anatomy,
      ...term.when_to_use,
      ...term.anti_use,
      ...term.prompt_phrases,
    ].join(" ")
  )
}

export function matchesFilter(term: VocabularyTerm, filter: TermFilter) {
  if (filter === "all") {
    return true
  }
  if (isNavigationFilter(filter)) {
    return matchesNavigationFilter(term, filter)
  }
  if (isTermKindCategoryFilter(filter)) {
    const { kind, category } = getTermKindCategoryFromFilter(filter)
    return term.kind === kind && term.category === category
  }
  if (isTermKindGroupFilter(filter)) {
    const { kind, groupId } = getTermKindGroupFromFilter(filter)
    return term.kind === kind && getTermGroup(term)?.id === groupId
  }
  if (isTermCategory(filter)) {
    return term.category === filter
  }
  if (isTermKindFilter(filter)) {
    return term.kind === getTermKindFromFilter(filter)
  }

  return getTermGroup(term)?.id === filter
}

function matchesNavigationFilter(term: VocabularyTerm, filter: NavigationFilter) {
  const collection = getNavigationCollection(filter)
  if (!collection) {
    return false
  }

  if (term.navigation?.canonical_path && pathStartsWith(term.navigation.canonical_path, collection.path)) {
    return true
  }
  if (term.navigation) {
    return false
  }

  const groupId = getTermGroup(term)?.id

  return Boolean(
    collection.termIds?.includes(term.id)
    || collection.categories?.includes(term.category)
    || collection.kinds?.includes(term.kind)
    || (groupId && collection.groupIds?.includes(groupId))
  )
}

function pathStartsWith(path: string[], prefix: string[]) {
  return prefix.every((segment, index) => path[index] === segment)
}

export function getTermGroup(term: VocabularyTerm) {
  return categoryGroups.find((group) => group.ids.includes(term.id))
}

export function isTermCategory(filter: TermFilter): filter is TermCategory {
  return filter in categoryLabels
}

export function isTermKindFilter(filter: TermFilter | string): filter is TermKindFilter {
  if (!filter.startsWith("kind:") || filter.includes(":category:") || filter.includes(":group:")) {
    return false
  }

  return filter.slice("kind:".length) in kindLabels
}

export function getTermKindFromFilter(filter: TermKindFilter): TermKind {
  return filter.slice("kind:".length) as TermKind
}

export function isTermKindCategoryFilter(filter: TermFilter | string): filter is TermKindCategoryFilter {
  const match = filter.match(/^kind:([^:]+):category:([^:]+)$/)
  if (!match) {
    return false
  }

  return match[1] in kindLabels && match[2] in categoryLabels
}

export function getTermKindCategoryFromFilter(filter: TermKindCategoryFilter) {
  const [, kind, category] = filter.match(/^kind:([^:]+):category:([^:]+)$/) ?? []

  return {
    kind: kind as TermKind,
    category: category as TermCategory,
  }
}

export function isTermKindGroupFilter(filter: TermFilter | string): filter is TermKindGroupFilter {
  const match = filter.match(/^kind:([^:]+):group:([^:]+)$/)
  if (!match) {
    return false
  }

  return match[1] in kindLabels && categoryGroups.some((group) => group.id === match[2])
}

export function getTermKindGroupFromFilter(filter: TermKindGroupFilter) {
  const [, kind, groupId] = filter.match(/^kind:([^:]+):group:([^:]+)$/) ?? []

  return {
    kind: kind as TermKind,
    groupId: groupId as TermGroupId,
  }
}

function categoriesToGroups() {
  return Object.fromEntries(
    Object.keys(categoryLabels).map((category) => [
      category,
      categoryGroups.filter((group) => group.category === category),
    ])
  ) as Record<TermCategory, TermGroup[]>
}

function scoreTerm(term: VocabularyTerm, query: string): SearchResult {
  const reasons = new Set<SearchMatchReason>()
  const matchedText = new Set<string>()
  let score = 0

  for (const field of getSearchFields(term)) {
    const fieldScore = scoreField(field.text, query, field.exactWeight, field.prefixWeight, field.includesWeight)
    if (fieldScore === 0) {
      continue
    }

    score += fieldScore
    reasons.add(field.reason)
    matchedText.add(field.text)
  }

  for (const boost of discoveryQueryBoosts) {
    const match = boost.matches.find((item) => item.id === term.id)
    if (!normalize(boost.query).includes(query) || !match) {
      continue
    }

    score += match.weight
    reasons.add("prompt_phrase")
    matchedText.add(boost.query)
  }

  return {
    term,
    score,
    reasons: Array.from(reasons),
    matchedText: Array.from(matchedText).slice(0, 3),
  }
}

function getSearchFields(term: VocabularyTerm) {
  const group = getTermGroup(term)

  return [
    ...[term.ko.name, term.en.name, term.id].map((text) => ({
      text,
      reason: "name" as const,
      exactWeight: 120,
      prefixWeight: 80,
      includesWeight: 65,
    })),
    ...[...term.ko.aliases, ...term.en.aliases].map((text) => ({
      text,
      reason: "alias" as const,
      exactWeight: 100,
      prefixWeight: 80,
      includesWeight: 60,
    })),
    {
      text: categoryLabels[term.category],
      reason: "category" as const,
      exactWeight: 60,
      prefixWeight: 50,
      includesWeight: 40,
    },
    {
      text: kindLabels[term.kind],
      reason: "kind" as const,
      exactWeight: 60,
      prefixWeight: 50,
      includesWeight: 40,
    },
    ...(group ? [{
      text: group.label,
      reason: "group" as const,
      exactWeight: 60,
      prefixWeight: 50,
      includesWeight: 40,
    }] : []),
    {
      text: term.one_liner,
      reason: "one_liner" as const,
      exactWeight: 45,
      prefixWeight: 40,
      includesWeight: 35,
    },
    ...term.prompt_phrases.map((text) => ({
      text,
      reason: "prompt_phrase" as const,
      exactWeight: 40,
      prefixWeight: 35,
      includesWeight: 30,
    })),
    ...term.when_to_use.map((text) => ({
      text,
      reason: "when_to_use" as const,
      exactWeight: 35,
      prefixWeight: 30,
      includesWeight: 25,
    })),
    ...term.visual_anatomy.map((text) => ({
      text,
      reason: "visual_anatomy" as const,
      exactWeight: 30,
      prefixWeight: 25,
      includesWeight: 20,
    })),
    {
      text: term.description,
      reason: "description" as const,
      exactWeight: 20,
      prefixWeight: 18,
      includesWeight: 15,
    },
    ...term.anti_use.map((text) => ({
      text,
      reason: "description" as const,
      exactWeight: 10,
      prefixWeight: 8,
      includesWeight: 5,
    })),
  ]
}

function scoreField(
  field: string,
  query: string,
  exactWeight: number,
  prefixWeight: number,
  includesWeight: number
) {
  const normalizedField = normalize(field)

  if (!normalizedField) {
    return 0
  }
  if (normalizedField === query) {
    return exactWeight
  }
  if (normalizedField.startsWith(query)) {
    return prefixWeight
  }
  if (normalizedField.includes(query)) {
    return includesWeight
  }

  return 0
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ko-KR").replace(/\s+/g, " ")
}
