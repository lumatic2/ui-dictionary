import type { TermCategory, VocabularyTerm } from "@/data/terms.generated"

export type TermFilter = "all" | TermCategory | TermGroupId

export const categoryLabels: Record<TermCategory, string> = {
  input: "입력",
  selection: "선택·전환",
  action: "버튼·행동",
  structure: "화면 구조",
  feedback: "안내·상태",
  "data-display": "목록·정보",
}

export type TermGroupId =
  | "input-text"
  | "input-search-command"
  | "input-pickers"
  | "input-file-media"
  | "input-editing"
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
  | "feedback-alerts-toasts"
  | "feedback-loading-progress"
  | "feedback-empty-error"
  | "feedback-access-limits"
  | "feedback-status-notifications"
  | "data-tables-lists"
  | "data-cards-content"
  | "data-metrics-charts"
  | "data-timeline-history"
  | "data-people-integrations"
  | "data-commerce-billing"

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
    ids: ["text-field", "textarea", "textarea-autosize", "password-field", "number-input", "masked-input", "input-group", "copy-field", "api-key-field"],
  },
  {
    id: "input-search-command",
    category: "input",
    label: "검색·명령 입력",
    ids: ["search-field", "search-view", "autocomplete", "search-suggestions", "command-palette"],
  },
  {
    id: "input-pickers",
    category: "input",
    label: "선택형 입력",
    ids: ["select", "combobox", "date-picker", "date-range-picker", "time-picker", "color-picker", "rating-input", "tag-input", "coupon-field", "quantity-stepper", "otp-input"],
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
    id: "selection-options",
    category: "selection",
    label: "옵션 선택",
    ids: ["checkbox", "radio-group", "switch", "slider", "range-slider", "segmented-control", "tabs", "content-tabs", "listbox", "chip", "filter-chip", "toggle-button", "toggle-group", "multi-select", "transfer-list", "disclosure"],
  },
  {
    id: "selection-navigation",
    category: "selection",
    label: "탐색 전환",
    ids: ["breadcrumb", "breadcrumbs-menu", "pagination", "stepper", "navigation-rail", "sidebar-nav", "bottom-navigation", "tab-bar", "anchor-nav", "back-button", "navigation-bar", "tree-navigation", "wizard"],
  },
  {
    id: "selection-menus",
    category: "selection",
    label: "메뉴·드롭다운",
    ids: ["dropdown-menu", "mega-menu", "context-menu", "menu-bar", "saved-view-tabs"],
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
    ids: ["button", "primary-button", "secondary-button", "destructive-button", "icon-button", "floating-action-button", "link", "button-group", "split-button", "copy-button", "download-button", "share-button", "close-button", "overflow-button", "loading-button", "icon-toggle-button", "speed-dial"],
  },
  {
    id: "action-command-bars",
    category: "action",
    label: "툴바·커맨드",
    ids: ["toolbar", "command-bar", "canvas-toolbar", "menu-item"],
  },
  {
    id: "action-bulk-danger",
    category: "action",
    label: "대량·위험 작업",
    ids: ["bulk-action-bar", "row-selection", "swipe-action", "confirmation-dialog", "destructive-confirmation"],
  },
  {
    id: "action-editor-media",
    category: "action",
    label: "편집·미디어 제어",
    ids: ["scrubber", "video-player-controls", "audio-player-controls", "cropper"],
  },
  {
    id: "structure-app-layout",
    category: "structure",
    label: "앱·페이지 레이아웃",
    ids: ["app-shell", "page-layout", "dashboard-grid", "global-header", "top-app-bar", "header", "footer", "page-title-bar", "breadcrumb-header", "utility-bar", "status-bar", "checkout-step"],
  },
  {
    id: "structure-panels",
    category: "structure",
    label: "패널·오버레이",
    ids: ["card", "dialog", "drawer", "side-sheet", "popover", "floating-panel", "dockable-panel", "right-rail", "inspector-panel", "properties-panel", "preview-pane", "resizable-panel", "split-pane", "master-detail", "lightbox"],
  },
  {
    id: "structure-navigation",
    category: "structure",
    label: "사이드바·보드 구조",
    ids: ["navigation-drawer", "collapsible-sidebar", "mini-sidebar", "sidebar-section", "board-column"],
  },
  {
    id: "structure-sections",
    category: "structure",
    label: "섹션·콘텐츠 구조",
    ids: ["grid", "section", "container", "hero", "sticky-header", "sticky-footer-bar"],
  },
  {
    id: "structure-mobile",
    category: "structure",
    label: "반응형·모바일",
    ids: ["responsive-stack", "mobile-bottom-sheet"],
  },
  {
    id: "feedback-alerts-toasts",
    category: "feedback",
    label: "알림·토스트·배너",
    ids: ["toast", "snackbar", "undo-toast", "toast-stack", "alert", "inline-alert", "success-toast", "error-toast", "announcement-banner", "trial-banner"],
  },
  {
    id: "feedback-loading-progress",
    category: "feedback",
    label: "로딩·진행",
    ids: ["progress-bar", "spinner", "skeleton", "skeleton-table", "loading-state", "syncing-state", "saving-indicator", "setup-progress"],
  },
  {
    id: "feedback-empty-error",
    category: "feedback",
    label: "빈 상태·오류 복구",
    ids: ["empty-state", "empty-search-result", "empty-table", "error-state", "warning-state", "info-state", "success-state", "validation-message", "error-boundary", "retry-panel", "maintenance-state"],
  },
  {
    id: "feedback-access-limits",
    category: "feedback",
    label: "권한·제한·세션",
    ids: ["permission-state", "locked-state", "offline-state", "rate-limit-state", "session-expired-dialog", "upgrade-prompt", "quota-warning", "unsaved-changes-banner"],
  },
  {
    id: "feedback-status-notifications",
    category: "feedback",
    label: "상태·알림 센터",
    ids: ["badge", "status-indicator", "status-chip", "health-indicator", "connection-status", "notification-center", "role-badge", "order-status"],
  },
  {
    id: "data-tables-lists",
    category: "data-display",
    label: "테이블·리스트",
    ids: ["table", "data-grid", "data-table-toolbar", "column-header-menu", "column-visibility-menu", "table-density-control", "empty-table", "comparison-table", "pivot-table", "tree-table", "tree-view", "expandable-row", "detail-row", "list", "grouped-list", "nested-list", "draggable-list", "reorder-handle", "virtualized-list", "infinite-scroll", "pull-to-refresh", "selection-summary", "filter-bar", "filter-panel", "faceted-filter", "advanced-filter-builder", "query-builder", "sort-control"],
  },
  {
    id: "data-cards-content",
    category: "data-display",
    label: "카드·콘텐츠",
    ids: ["media-card", "file-card", "product-card", "price-card", "plan-card", "profile-card", "calendar-event-card", "calendar-view", "kanban", "kanban-card", "onboarding-checklist", "help-center-card", "release-note-card", "thumbnail", "image", "logo", "icon", "typography", "label", "divider", "spacer", "description-list", "accordion", "carousel", "tooltip", "faq-list"],
  },
  {
    id: "data-metrics-charts",
    category: "data-display",
    label: "지표·차트",
    ids: ["metric-card", "chart", "legend", "chart-axis", "stat-list", "map-marker"],
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
    ids: ["avatar", "team-member-row", "webhook-endpoint-row", "integration-card", "connection-card"],
  },
  {
    id: "data-commerce-billing",
    category: "data-display",
    label: "커머스·청구",
    ids: ["image-gallery", "attachment-list", "feature-comparison", "cart-summary", "address-card", "billing-summary", "invoice-row"],
  },
]

export const categoryGroupsByCategory = categoriesToGroups()

export function searchTerms(
  terms: VocabularyTerm[],
  query: string,
  filter: TermFilter
) {
  const normalizedQuery = normalize(query)

  return terms.filter((term) => {
    if (!matchesFilter(term, filter)) {
      return false
    }
    if (!normalizedQuery) {
      return true
    }

    return searchableText(term).includes(normalizedQuery)
  })
}

export function searchableText(term: VocabularyTerm) {
  return normalize(
    [
      term.id,
      term.category,
      term.ko.name,
      ...term.ko.aliases,
      term.en.name,
      ...term.en.aliases,
      term.one_liner,
      term.description,
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
  if (isTermCategory(filter)) {
    return term.category === filter
  }

  return getTermGroup(term)?.id === filter
}

export function getTermGroup(term: VocabularyTerm) {
  return categoryGroups.find((group) => group.ids.includes(term.id))
}

export function isTermCategory(filter: TermFilter): filter is TermCategory {
  return filter in categoryLabels
}

function categoriesToGroups() {
  return Object.fromEntries(
    Object.keys(categoryLabels).map((category) => [
      category,
      categoryGroups.filter((group) => group.category === category),
    ])
  ) as Record<TermCategory, TermGroup[]>
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ko-KR").replace(/\s+/g, " ")
}
