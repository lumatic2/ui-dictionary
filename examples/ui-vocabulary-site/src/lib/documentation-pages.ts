import type { TermFilter } from "@/lib/search"
import { navFilter } from "@/lib/navigation-model"

export type DocsNavGroup = {
  label: string
  items: Array<{ filter: TermFilter; label: string; shell?: boolean }>
}

export type DocsArticlePreviewVariant =
  | "docs-autocomplete"
  | "docs-command-palette"
  | "docs-copy-button"
  | "docs-dialog"
  | "docs-disclosure"
  | "docs-dropdown-menu"
  | "docs-popover"
  | "docs-select"
  | "docs-tabs"

export type DocsArticlePageData = {
  filter: TermFilter
  kind: "setup" | "element" | "foundation" | "agent-recipe"
  breadcrumb: string
  title: string
  lead: string
  sections: Array<{ title: string; body: string[]; code?: string }>
  preview?: DocsArticlePreviewVariant
  apiRows?: Array<{ name: string; description: string }>
  apiSections?: Array<{
    title: string
    description: string
    groups: Array<{ label: string; rows: Array<{ name: string; description: string }> }>
  }>
  examples?: Array<{ title: string; description: string; locked?: boolean }>
  onThisPage: string[]
  /**
   * Marks a dev-only skeleton page (layout + headings + empty-state slots, no
   * source-quality content yet). Gated by `isShellVisible` in `@/lib/exposure` —
   * hidden from nav/lists in production, always visible in dev.
   * Contract: docs/design-system/site-blueprint.md > "Production Exposure Policy".
   */
  shell?: boolean
}

export const docsNavGroups: DocsNavGroup[] = [
  {
    label: "Getting started",
    items: [
      { filter: navFilter("docs-getting-started-setup"), label: "Getting set up" },
      { filter: navFilter("docs-getting-started-html"), label: "Using HTML" },
      { filter: navFilter("docs-getting-started-react"), label: "Using React" },
      { filter: navFilter("docs-getting-started-vue"), label: "Using Vue" },
      { filter: navFilter("docs-getting-started-assets"), label: "Assets" },
    ],
  },
  {
    label: "Elements",
    items: [
      { filter: navFilter("docs-elements-introduction"), label: "Introduction" },
      { filter: navFilter("docs-elements-autocomplete"), label: "Autocomplete" },
      { filter: navFilter("docs-elements-command-palette"), label: "Command palette" },
      { filter: navFilter("docs-elements-copy-button"), label: "Copy button" },
      { filter: navFilter("docs-elements-dialog"), label: "Dialog" },
      { filter: navFilter("docs-elements-disclosure"), label: "Disclosure" },
      { filter: navFilter("docs-elements-dropdown-menu"), label: "Dropdown menu" },
      { filter: navFilter("docs-elements-popover"), label: "Popover" },
      { filter: navFilter("docs-elements-select"), label: "Select" },
      { filter: navFilter("docs-elements-tabs"), label: "Tabs" },
    ],
  },
  {
    label: "Foundations",
    items: [
      { filter: navFilter("docs-foundations-color"), label: "Color" },
      { filter: navFilter("docs-foundations-typography"), label: "Typography" },
      { filter: navFilter("docs-foundations-spacing-layout"), label: "Spacing & layout" },
      { filter: navFilter("docs-foundations-motion"), label: "Motion" },
      { filter: navFilter("docs-foundations-accessibility"), label: "Accessibility" },
      { filter: navFilter("docs-foundations-dark-mode"), label: "Dark mode" },
      { filter: navFilter("docs-foundations-tokens"), label: "Tokens" },
    ],
  },
  {
    label: "Agent Recipes",
    items: [
      { filter: navFilter("docs-agent-recipes"), label: "Overview" },
    ],
  },
]

const FOUNDATION_SECTION_TITLES = [
  "Tokens",
  "Usage examples",
  "Good vs bad",
  "Light / dark",
  "Implementation notes",
  "Agent constraints",
] as const


export const docsArticlePages = new Map<TermFilter, DocsArticlePageData>([
  [navFilter("docs-getting-started-setup"), {
    filter: navFilter("docs-getting-started-setup"),
    kind: "setup",
    breadcrumb: "UI Blocks / Docs",
    title: "Getting set up",
    lead: "UI Dictionary 문서는 용어를 외우는 문서가 아니라, 화면을 만들기 전에 구현 기준을 맞추는 작업대입니다. 먼저 프로젝트가 어떤 UI contract를 공유할지 정하고, 그 다음 element별 문서로 내려갑니다.",
    sections: [
      {
        title: "Requirements",
        body: [
          "작업을 시작하기 전에 세 가지가 필요합니다. 첫째, 화면이 해결할 사용자 과업입니다. 둘째, 그 과업을 이루는 UI vocabulary입니다. 셋째, desktop, mobile, keyboard, empty/error state를 확인할 검증 기준입니다.",
          "Tailwind Plus가 font와 dark mode 같은 기반을 먼저 고정하듯, UI Dictionary도 typography, spacing, contrast, focus-visible, overflow를 기본 계약으로 둡니다. 이 기준 없이 컴포넌트만 고르면 화면마다 리듬이 달라집니다.",
        ],
        code: "npm run build:data\nnpm run lint\nnpm run build\nnpm run audit:visuals",
      },
      {
        title: "Use the dictionary as implementation context",
        body: [
          "용어 페이지는 이름과 의미를 찾는 곳이고, Documentation 페이지는 그 용어를 화면에 배치하는 법을 설명하는 곳입니다. 예를 들어 Dialog를 찾았다면 단순히 modal을 만들라는 뜻이 아니라, focus trap, title, close path, destructive action까지 함께 챙기라는 뜻입니다.",
          "AI에게 넘길 때도 단어 목록만 주면 안 됩니다. 목적, 상태, 레이아웃, 금지 조건, 검증 방법을 한 번에 넘겨야 결과가 재사용 가능한 화면에 가까워집니다.",
        ],
        code: "Build a settings page with:\n- sidebar navigation\n- form layout\n- focus-visible states\n- toast feedback\n\nVerify:\n- no mobile overflow\n- keyboard focus is visible\n- empty/error states are represented",
      },
      {
        title: "Project baseline",
        body: [
          "새 화면을 만들 때는 큰 hero나 decorative card보다 실제 작업 surface를 먼저 엽니다. 정보가 많은 SaaS, CRM, 운영 도구라면 quiet, dense, scannable한 구성으로 시작합니다.",
          "버튼, 입력, 메뉴, 탭, 표, sidebar 같은 반복 primitive는 이미 있는 vocabulary와 연결합니다. 새로운 스타일을 만들기보다 기존 용어와 상태를 정확히 조합하는 것이 먼저입니다.",
        ],
      },
      {
        title: "Responsive and dark mode checks",
        body: [
          "데스크톱에서 좋아 보이는 것과 모바일에서 사용할 수 있는 것은 다릅니다. 첫 viewport에서 핵심 조작이 보이는지, 긴 단어와 code block이 넘치지 않는지, 좌우 rail이 접히는지 확인합니다.",
          "다크 모드를 지원하는 화면은 단순히 배경만 어둡게 바꾸지 않습니다. border, muted text, focus ring, disabled state, hover surface까지 같이 조정해야 합니다.",
        ],
      },
      {
        title: "Next steps",
        body: [
          "정적 HTML로 빠르게 실험할 때는 Using HTML로 이동합니다. 앱 컴포넌트로 묶을 때는 Using React 또는 Using Vue를 봅니다. 아이콘, 이미지, illustration이 필요한 화면이면 Assets에서 품질 기준을 먼저 정합니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: ["Requirements", "Use the dictionary", "Project baseline", "Responsive checks", "Next steps"],
  }],
  [navFilter("docs-getting-started-html"), {
    filter: navFilter("docs-getting-started-html"),
    kind: "setup",
    breadcrumb: "UI Blocks / Docs",
    title: "Using HTML",
    lead: "HTML로 구현할 때는 semantic element, label 연결, focus-visible 상태를 먼저 잡고 vocabulary를 class와 구조로 번역합니다.",
    sections: [
      {
        title: "Start with semantic structure",
        body: [
          "HTML 페이지는 div를 쌓기 전에 landmark와 heading hierarchy를 먼저 잡습니다. header, nav, main, section, aside, footer를 쓰면 스크린리더와 키보드 사용자가 화면 구조를 예측할 수 있습니다.",
          "UI Dictionary 용어를 HTML로 옮길 때는 이름보다 역할이 중요합니다. Button은 button element, navigation item은 link, input 설명은 label과 help text로 연결합니다.",
        ],
        code: "<main class=\"mx-auto max-w-5xl px-6 py-10\">\n  <section aria-labelledby=\"billing-title\">\n    <h1 id=\"billing-title\">Billing settings</h1>\n    <p>Manage plan, invoices, and payment methods.</p>\n  </section>\n</main>",
      },
      {
        title: "Attach labels and states",
        body: [
          "입력 UI는 시각적 placeholder만으로 설명하면 안 됩니다. label, description, error message를 분리하고, aria-describedby로 연결하면 상태가 바뀌어도 의미가 유지됩니다.",
          "disabled, required, invalid 같은 상태는 class뿐 아니라 HTML attribute와 같이 표현합니다. 그래야 스타일과 접근성 tree가 같은 사실을 말합니다.",
        ],
        code: "<label for=\"workspace-name\">Workspace name</label>\n<input id=\"workspace-name\" name=\"workspace-name\" aria-describedby=\"workspace-name-help\" />\n<p id=\"workspace-name-help\">Use the name your team recognizes.</p>",
      },
      {
        title: "Map vocabulary to utility classes",
        body: [
          "container, stack, divider, focus ring 같은 용어는 HTML에서는 class 조합으로 드러납니다. 하지만 class를 길게 나열하기 전에 어떤 vocabulary를 구현하는지 주석이나 문서에 남겨야 유지보수가 됩니다.",
          "반복되는 card나 form row는 copy-paste하기보다 작은 include, template partial, 또는 framework component로 승격할 후보로 표시합니다.",
        ],
      },
      {
        title: "Common pitfalls",
        body: [
          "클릭 가능한 div, label 없는 icon button, hover에만 의존하는 disclosure, table처럼 보이지만 실제로는 grid인 데이터 목록은 나중에 수정 비용이 큽니다.",
          "HTML 단계에서 완벽한 컴포넌트 추상화까지 만들 필요는 없지만, semantic role과 focus order는 초기부터 맞아야 합니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: ["Semantic structure", "Labels and states", "Utility classes", "Common pitfalls"],
  }],
  [navFilter("docs-getting-started-react"), {
    filter: navFilter("docs-getting-started-react"),
    kind: "setup",
    breadcrumb: "UI Blocks / Docs",
    title: "Using React",
    lead: "React에서는 UI vocabulary를 props, state, events, accessibility contract로 번역합니다. 컴포넌트 경계는 시각 모양이 아니라 반복되는 책임을 기준으로 자릅니다.",
    sections: [
      {
        title: "Component boundary",
        body: [
          "반복되는 UI 단위는 상태와 이벤트를 함께 받는 컴포넌트로 분리합니다. 예를 들어 Dialog는 open state, close action, labelled title, destructive action 여부를 명확히 가져야 합니다.",
          "반대로 한 번만 쓰는 페이지 composition은 너무 빨리 추상화하지 않습니다. 먼저 용어와 상태가 안정된 뒤 컴포넌트로 올리는 편이 좋습니다.",
        ],
        code: "type DialogProps = {\n  open: boolean\n  title: string\n  description?: string\n  destructive?: boolean\n  onOpenChange: (open: boolean) => void\n}",
      },
      {
        title: "State variants",
        body: [
          "Button, input, command palette 같은 element는 idle, focus, loading, disabled, empty, error 상태를 한 문서 안에서 확인할 수 있어야 합니다. 상태가 빠진 컴포넌트는 실제 앱에서 곧 깨집니다.",
          "variant prop은 색 이름보다 의도를 표현해야 합니다. primary, secondary, destructive, ghost처럼 역할을 말하면 디자인 토큰이 바뀌어도 컴포넌트 API가 덜 흔들립니다.",
        ],
      },
      {
        title: "Composition pattern",
        body: [
          "복합 컴포넌트는 trigger, panel, item, empty state처럼 슬롯을 분리합니다. Command palette, Dropdown menu, Tabs, Select는 이 방식이 특히 중요합니다.",
        ],
        code: "<CommandPalette open={open} onOpenChange={setOpen}>\n  <CommandInput value={query} onValueChange={setQuery} />\n  <CommandList emptyLabel=\"No terms found\" />\n</CommandPalette>",
      },
      {
        title: "Prompt handoff",
        body: [
          "AI에게는 컴포넌트명만 주지 말고 상태 contract와 검증 조건을 같이 줍니다. 결과물은 build, route smoke, console check, mobile overflow check로 확인합니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: ["Component boundary", "State variants", "Composition pattern", "Prompt handoff"],
  }],
  [navFilter("docs-getting-started-vue"), {
    filter: navFilter("docs-getting-started-vue"),
    kind: "setup",
    breadcrumb: "UI Blocks / Docs",
    title: "Using Vue",
    lead: "Vue에서는 vocabulary를 props, slots, emitted events로 나누어 문서화하면 React와 같은 UI contract를 유지할 수 있습니다.",
    sections: [
      {
        title: "Separate props from slots",
        body: [
          "Vue 컴포넌트는 정해진 상태는 props로, 바뀌는 화면 조각은 slots로 받는 편이 읽기 쉽습니다. 예를 들어 Card는 title, tone 같은 prop과 actions, default slot을 분리할 수 있습니다.",
          "UI Dictionary 용어를 Vue로 옮길 때는 slot 이름이 vocabulary가 됩니다. trigger, panel, item, icon, description 같은 이름은 구조를 설명합니다.",
        ],
        code: "<UiCard tone=\"muted\">\n  <template #title>Workspace</template>\n  <template #actions><button>Invite</button></template>\n  <p>Manage members and permissions.</p>\n</UiCard>",
      },
      {
        title: "Use emitted events as state contract",
        body: [
          "Dropdown, Dialog, Select처럼 상태가 상위 화면과 연결되는 element는 update:modelValue, close, select 같은 이벤트를 명확히 둡니다.",
          "컴포넌트 내부에서만 상태를 숨기면 URL, form state, analytics, keyboard shortcut과 연결하기 어렵습니다.",
        ],
        code: "<UiSelect\n  v-model=\"role\"\n  :options=\"roleOptions\"\n  @select=\"trackRoleSelection\"\n/>",
      },
      {
        title: "Keep accessibility visible",
        body: [
          "template 안에서 label, aria-describedby, focus-visible class가 흩어지기 쉽습니다. 입력 컴포넌트는 id 생성과 description 연결을 컴포넌트 내부 contract로 고정하는 편이 좋습니다.",
        ],
      },
      {
        title: "Implementation handoff",
        body: [
          "Vue 작업을 AI에게 맡길 때는 Composition API 여부, slot 이름, emitted event, keyboard behavior를 같이 지정합니다. 그렇지 않으면 시각적으로만 비슷하고 상태 연결이 빠진 컴포넌트가 나오기 쉽습니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: ["Props and slots", "Emitted events", "Accessibility", "Implementation handoff"],
  }],
  [navFilter("docs-getting-started-assets"), {
    filter: navFilter("docs-getting-started-assets"),
    kind: "setup",
    breadcrumb: "UI Blocks / Docs",
    title: "Assets",
    lead: "아이콘, 이미지, illustration, background asset은 UI term의 의미를 흐리지 않게 크기, 대비, 대체 텍스트 기준과 함께 관리합니다.",
    sections: [
      {
        title: "Icons",
        body: [
          "아이콘은 텍스트를 대신하는 장식이 아니라 행동이나 상태를 빠르게 인식시키는 신호입니다. 저장, 복사, 삭제, 검색처럼 익숙한 동작은 가능한 한 보편적인 아이콘을 씁니다.",
          "텍스트 없는 icon button은 accessible name이 필요합니다. tooltip은 보조 설명이고, aria-label이나 보이는 label을 대체하지 않습니다.",
        ],
        code: "<button aria-label=\"Copy token\" class=\"inline-grid size-9 place-items-center rounded-md\">\n  <CopyIcon aria-hidden=\"true\" />\n</button>",
      },
      {
        title: "Images and screenshots",
        body: [
          "제품 screenshot은 실제 화면 상태를 보여줄 때만 사용합니다. 흐릿한 장식 이미지나 제품을 가리는 crop은 reference documentation에서는 품질을 떨어뜨립니다.",
          "화면 preview에는 비율, 최소 높이, overflow 방지 규칙을 함께 둡니다. 이미지가 늦게 로드되어도 card 높이가 흔들리지 않아야 합니다.",
        ],
      },
      {
        title: "Illustrations and empty states",
        body: [
          "empty state illustration은 상황을 설명할 때만 씁니다. 단순히 빈 공간을 채우기 위한 그림은 CTA와 설명의 우선순위를 흐립니다.",
          "AI 생성 이미지를 쓰는 경우 페이지/preview 목적에 맞춘 fresh asset을 만들고, 재사용 여부와 출처를 evidence에 남깁니다.",
        ],
      },
      {
        title: "Figma and handoff assets",
        body: [
          "디자인 툴에서 넘어온 asset은 이름, 사용 위치, light/dark 대응, export scale을 같이 관리합니다. `logo-final-2.png` 같은 이름은 구현자가 의미를 알 수 없습니다.",
        ],
        code: "assets/\n  product-dashboard-preview@2x.png\n  empty-projects-illustration.svg\n  brand-mark-light.svg\n  brand-mark-dark.svg",
      },
    ],
    apiRows: [],
    onThisPage: ["Icons", "Images", "Illustrations", "Figma assets"],
  }],
  [navFilter("docs-elements-introduction"), {
    filter: navFilter("docs-elements-introduction"),
    kind: "element",
    breadcrumb: "UI Blocks / Docs",
    title: "Introduction",
    lead: "Elements 문서는 작은 UI primitive를 언제 쓰고, 어떤 상태를 가져야 하며, AI에게 어떻게 지시할지 정리합니다. 버튼 하나도 역할, 상태, 접근성, 레이아웃 맥락이 함께 있어야 합니다.",
    sections: [
      {
        title: "Available elements",
        body: [
          "이 섹션의 element는 Autocomplete, Command palette, Copy button, Dialog, Disclosure, Dropdown menu, Popover, Select, Tabs처럼 화면 곳곳에서 반복되는 기본 조작 단위입니다.",
          "각 element는 단독으로 끝나지 않습니다. Trigger, panel, item, label, empty state, error state, keyboard behavior가 함께 설계되어야 실제 앱에서 쓸 수 있습니다.",
        ],
      },
      {
        title: "Browser and device baseline",
        body: [
          "문서의 예시는 modern browser를 기준으로 하지만, 실제 구현 검증은 desktop과 390px mobile을 모두 통과해야 합니다. floating element는 작은 화면에서 full-width sheet나 inline list로 바뀔 수 있습니다.",
          "Hover에만 의존하는 affordance는 모바일에서 사라집니다. focus-visible, active, selected, disabled 상태가 별도 시각 신호를 가져야 합니다.",
        ],
      },
      {
        title: "Installation mindset",
        body: [
          "UI Dictionary는 특정 패키지 설치법보다 element contract를 먼저 설명합니다. Radix, Headless UI, native element, 자체 컴포넌트 중 무엇을 쓰더라도 같은 상태와 접근성 기준을 만족해야 합니다.",
        ],
        code: "Choose implementation library after the contract:\n- role and semantic element\n- controlled/uncontrolled state\n- keyboard path\n- empty/error behavior\n- responsive fallback",
      },
      {
        title: "How to read element pages",
        body: [
          "먼저 When to use에서 패턴 선택이 맞는지 확인합니다. 그 다음 State contract와 Component API에서 구현자가 빠뜨리기 쉬운 props, slots, events, focus behavior를 확인합니다.",
          "마지막으로 Related terms를 통해 비슷하지만 다른 패턴을 비교합니다. Dropdown menu와 Select, Popover와 Dialog, Disclosure와 Tabs는 특히 혼동하기 쉽습니다.",
        ],
      },
    ],
    apiRows: [
      { name: "purpose", description: "element가 해결하는 사용자 과업입니다. 모양보다 먼저 정합니다." },
      { name: "state", description: "open, selected, active, disabled, loading, empty, error 같은 표시 상태입니다." },
      { name: "a11y", description: "role, label, keyboard navigation, focus-visible, screen-reader announcement 기준입니다." },
      { name: "responsive", description: "좁은 화면에서 panel, menu, table, code block이 어떻게 접히는지 설명합니다." },
    ],
    onThisPage: ["Available elements", "Browser baseline", "Installation mindset", "How to read", "Component API", "Related terms"],
  }],
  [navFilter("docs-elements-autocomplete"), {
    filter: navFilter("docs-elements-autocomplete"),
    kind: "element",
    breadcrumb: "UI Blocks / Docs",
    title: "Autocomplete",
    lead: "Autocomplete는 입력 중 후보를 좁혀 선택까지 이어주는 element입니다. 검색어, 결과 목록, active option, empty/loading state가 하나의 흐름으로 움직여야 합니다.",
    sections: [
      {
        title: "Usage notes",
        body: [
          "사용자가 정확한 값을 기억하지 못하지만 후보 목록에서 고를 수 있을 때 씁니다. 팀원 초대, 도시 선택, 태그 입력, 문서 검색처럼 입력과 선택이 이어지는 흐름에 적합합니다.",
          "선택지가 매우 적으면 Select가 낫고, 명령 실행까지 포함하면 Command palette가 더 적합합니다. Autocomplete는 입력값을 좁혀 하나의 후보를 확정하는 데 집중합니다.",
        ],
      },
      {
        title: "Anatomy",
        body: [
          "기본 구조는 text input, option list, active option, empty result, loading indicator입니다. 선택된 값이 chip으로 남는 multi-select 형태라면 remove button과 keyboard deletion도 필요합니다.",
        ],
        code: "<Autocomplete value={query} onValueChange={setQuery}>\n  <AutocompleteInput aria-label=\"Search teammates\" />\n  <AutocompleteOptions emptyLabel=\"No teammates found\" />\n</Autocomplete>",
      },
      {
        title: "Keyboard and focus",
        body: [
          "Arrow keys는 active option을 이동하고 Enter는 선택합니다. Escape는 list를 닫거나 입력을 유지한 채 빠져나와야 합니다. Tab은 현재 focus order를 예측 가능하게 유지해야 합니다.",
          "스크린리더 사용자를 위해 input과 listbox, option 관계가 연결되어야 하며, active option 변화가 시각적으로만 표현되면 안 됩니다.",
        ],
      },
      {
        title: "Common pitfalls",
        body: [
          "검색 결과가 없을 때 빈 흰 박스만 보여주면 사용자는 실패인지 로딩인지 알 수 없습니다. empty message와 새 항목 생성 가능 여부를 분리합니다.",
          "서버 검색을 붙일 때는 debounce, stale result, loading, network error를 모두 상태로 다뤄야 합니다.",
        ],
      },
    ],
    preview: "docs-autocomplete",
    apiRows: [
      { name: "value", description: "입력창에 보이는 현재 query 또는 선택된 value입니다." },
      { name: "options", description: "query에 따라 필터링된 후보 목록입니다." },
      { name: "activeOption", description: "키보드나 pointer로 현재 강조된 option입니다." },
      { name: "onSelect", description: "후보를 확정하고 상위 form/search state를 갱신합니다." },
      { name: "emptyLabel", description: "후보가 없을 때 표시할 설명입니다. 생성 CTA와 구분합니다." },
    ],
    apiSections: [
      {
        title: "<Autocomplete>",
        description: "입력값, 후보 필터링, active option, 선택 완료를 조정하는 최상위 component입니다.",
        groups: [
          {
            label: "Props",
            rows: [
              { name: "value", description: "입력창에 보이는 query 또는 현재 선택된 value입니다." },
              { name: "onValueChange", description: "사용자가 타이핑할 때 상위 검색 상태를 갱신합니다." },
              { name: "disabled", description: "입력과 option 선택을 모두 비활성화합니다." },
            ],
          },
          {
            label: "State",
            rows: [
              { name: "open", description: "후보 목록이 열려 있는지 나타냅니다." },
              { name: "activeOption", description: "키보드나 pointer로 현재 강조된 option입니다." },
              { name: "loading", description: "서버 검색이나 지연된 후보 로딩 상태입니다." },
            ],
          },
        ],
      },
      {
        title: "<AutocompleteOptions>",
        description: "후보 목록과 empty/loading state를 표시하는 popover 또는 inline list 영역입니다.",
        groups: [
          {
            label: "Props",
            rows: [
              { name: "options", description: "렌더링할 후보 목록입니다. label과 value를 분리합니다." },
              { name: "emptyLabel", description: "후보가 없을 때 보여줄 안내입니다." },
              { name: "placement", description: "입력창 기준 list가 열리는 위치입니다." },
            ],
          },
        ],
      },
      {
        title: "<AutocompleteOption>",
        description: "사용자가 확정할 수 있는 단일 후보입니다.",
        groups: [
          {
            label: "Props",
            rows: [
              { name: "value", description: "선택 시 form/search state에 저장되는 안정적인 값입니다." },
              { name: "selected", description: "이미 선택된 후보인지 나타냅니다." },
              { name: "disabled", description: "선택할 수 없는 후보를 표시합니다." },
            ],
          },
        ],
      },
    ],
    examples: [
      { title: "Basic example", description: "단일 입력과 후보 목록을 연결해 팀원이나 문서를 빠르게 찾습니다." },
      { title: "Positioning the dropdown", description: "좁은 컨테이너와 모바일 화면에서 list가 잘리지 않도록 placement를 조정합니다." },
      { title: "Setting the dropdown width", description: "입력창 폭과 후보 panel 폭을 맞추거나 더 넓게 열어 긴 label을 보여줍니다." },
      { title: "Adding transitions", description: "후보 목록이 열리고 닫힐 때 짧은 opacity/scale transition을 사용합니다." },
      { title: "Disabling the input", description: "권한이나 로딩 상태에서는 입력과 option 선택을 함께 막습니다." },
    ],
    onThisPage: ["Component API", "<Autocomplete>", "<AutocompleteOptions>", "<AutocompleteOption>", "Examples", "Usage notes", "Related terms"],
  }],
  [navFilter("docs-elements-command-palette"), {
    filter: navFilter("docs-elements-command-palette"),
    kind: "element",
    breadcrumb: "UI Blocks / Docs",
    title: "Command palette",
    lead: "Command palette는 전역 검색, 빠른 이동, 명령 실행을 하나의 keyboard-first overlay로 묶는 element입니다. 검색창보다 넓고, 메뉴보다 빠르며, power user를 위한 shortcut surface입니다.",
    sections: [
      {
        title: "Usage notes",
        body: [
          "기능 수가 많고 사용자가 반복적으로 같은 화면을 오갈 때 씁니다. 문서 검색, 프로젝트 이동, 명령 실행, 최근 항목 접근이 한 곳에서 일어나면 탐색 비용이 줄어듭니다.",
          "단순 검색창과 다른 점은 결과가 link만이 아니라 action일 수 있다는 것입니다. 사용자는 결과를 고르는 순간 이동하거나, 설정을 열거나, 항목을 생성할 수 있습니다.",
        ],
      },
      {
        title: "Interaction contract",
        body: [
          "열기 단축키, active option, empty result, keyboard navigation, close behavior가 한 세트입니다. 입력이 비어 있을 때는 기본 명령이나 최근 항목을 보여주는 편이 좋습니다.",
          "Escape는 닫기, Enter는 실행, Arrow keys는 option 이동, modifier shortcut은 전역 열기를 담당합니다. Dialog처럼 화면 위에 뜨지만, 목적은 confirmation이 아니라 빠른 탐색과 실행입니다.",
        ],
        code: "<CommandPalette shortcut=\"Ctrl+K\">\n  <CommandInput placeholder=\"Search docs...\" />\n  <CommandGroup heading=\"Quick actions\" />\n</CommandPalette>",
      },
      {
        title: "Result grouping",
        body: [
          "결과가 많을수록 group heading이 중요합니다. Pages, Terms, Actions, Recent 같은 그룹을 나누면 같은 query에서도 사용자가 목적을 빠르게 파악합니다.",
          "각 item은 title, description, shortcut, icon을 가질 수 있지만 모든 정보를 넣을 필요는 없습니다. 반복 사용자가 scan할 수 있게 밀도와 대비를 조절합니다.",
        ],
      },
      {
        title: "Failure modes",
        body: [
          "가장 흔한 실패는 검색 결과만 있고 실행 후 피드백이 없는 경우입니다. 선택 후 페이지 이동, toast, modal open 같은 결과가 즉시 보여야 합니다.",
          "두 번째 실패는 모바일에서 desktop overlay를 그대로 쓰는 것입니다. 작은 화면에서는 full-screen command sheet가 더 안정적입니다.",
        ],
      },
    ],
    preview: "docs-command-palette",
    apiSections: [
      {
        title: "<CommandPalette>",
        description: "검색어와 active item을 관리하고 command list와 preview 영역을 조정하는 최상위 component입니다.",
        groups: [
          {
            label: "Props",
            rows: [
              { name: "open", description: "팔레트가 열려 있는지 나타냅니다." },
              { name: "query", description: "현재 검색어입니다. 필터링과 empty state를 결정합니다." },
              { name: "shortcut", description: "전역 열기 단축키입니다. 예: Ctrl K 또는 Cmd K." },
            ],
          },
          {
            label: "Events",
            rows: [
              { name: "onOpenChange", description: "단축키, escape, item 선택 후 열림 상태를 갱신합니다." },
              { name: "onQueryChange", description: "사용자가 입력할 때 검색어를 갱신합니다." },
              { name: "onSelect", description: "항목 선택 시 이동, 명령 실행, 검색 확정을 처리합니다." },
            ],
          },
        ],
      },
      {
        title: "<CommandList>",
        description: "검색 결과, 기본 명령, 그룹, empty state를 담는 list 영역입니다.",
        groups: [
          {
            label: "Slots",
            rows: [
              { name: "defaults", description: "검색어가 비어 있을 때 보여줄 최근 항목 또는 추천 명령입니다." },
              { name: "groups", description: "Pages, Terms, Actions처럼 목적별로 묶은 결과 그룹입니다." },
              { name: "noResults", description: "검색 결과가 없을 때 보여줄 안내와 다음 행동입니다." },
            ],
          },
        ],
      },
      {
        title: "<CommandPreview>",
        description: "active item의 세부 정보나 미리보기를 오른쪽 panel에 표시합니다.",
        groups: [
          {
            label: "Props",
            rows: [
              { name: "for", description: "preview content가 연결되는 item id입니다." },
              { name: "placement", description: "list 옆, 아래, 모바일 full-screen 중 어디에 표시할지 결정합니다." },
            ],
          },
        ],
      },
    ],
    examples: [
      { title: "Basic example", description: "검색어와 action list를 연결해 빠른 이동과 명령 실행을 제공합니다." },
      { title: "Opening and closing", description: "Ctrl K, trigger button, Escape, item selection이 모두 같은 open state를 갱신합니다." },
      { title: "Using with buttons", description: "버튼 item은 modal open, create action, setting toggle 같은 side effect를 실행합니다." },
      { title: "Using with links", description: "link item은 문서, 설정, 프로젝트 같은 route로 이동합니다." },
      { title: "Showing option previews", description: "active item의 상세 정보를 preview panel에 표시해 선택 전에 확인하게 합니다." },
      { title: "Showing default commands", description: "입력이 비어 있을 때 최근 항목이나 자주 쓰는 명령을 보여줍니다." },
      { title: "Handling no results", description: "검색 결과가 없으면 empty message와 새 항목 생성 가능성을 분리합니다." },
      { title: "Grouping related commands", description: "결과를 Pages, Terms, Actions처럼 그룹화해 scan 비용을 낮춥니다." },
      { title: "Customizing the filter logic", description: "초성, alias, prompt phrase, 최근 사용 기록을 필터링 로직에 포함합니다." },
    ],
    onThisPage: ["Component API", "<CommandPalette>", "<CommandList>", "<CommandPreview>", "Examples", "Usage notes", "Related terms"],
  }],
  [navFilter("docs-elements-copy-button"), {
    filter: navFilter("docs-elements-copy-button"),
    kind: "element",
    breadcrumb: "UI Blocks / Docs",
    title: "Copy button",
    lead: "Copy button은 코드, 토큰, URL처럼 재사용할 텍스트를 즉시 복사하게 하는 action element입니다. 성공, 실패, permission fallback이 함께 설계되어야 합니다.",
    sections: [
      {
        title: "When to use",
        body: [
          "사용자가 값을 직접 선택하고 복사하는 비용을 줄이고 싶을 때 씁니다. API key, install command, design token, 공유 링크, code block 옆에 배치하면 좋습니다.",
          "복사 대상이 긴 문장인지, 보안 값인지, 일회성 링크인지에 따라 label과 feedback이 달라집니다. 민감한 값은 노출/마스킹 정책도 함께 정해야 합니다.",
        ],
      },
      {
        title: "Interaction contract",
        body: [
          "기본 상태는 Copy, 성공 상태는 Copied, 실패 상태는 Try again 또는 manual copy guidance입니다. 성공 상태는 너무 오래 유지하지 말고 1-2초 후 원래 label로 돌아갑니다.",
        ],
        code: "<CopyButton value={installCommand}>\n  {copied ? \"Copied\" : \"Copy\"}\n</CopyButton>",
      },
      {
        title: "Feedback placement",
        body: [
          "작은 버튼 안에서 label이 바뀌는 방식은 밀도가 낮고 빠릅니다. 중요한 값이면 toast나 inline status를 함께 보여줄 수 있습니다.",
          "tooltip만으로 성공을 알리면 keyboard 사용자나 모바일 사용자가 놓치기 쉽습니다. button label, aria-live text, toast 중 하나는 명확해야 합니다.",
        ],
      },
      {
        title: "Clipboard failures",
        body: [
          "Clipboard API는 browser permission, insecure context, iframe policy에 따라 실패할 수 있습니다. 실패 시 값을 선택 가능한 text field나 code block으로 제공해야 합니다.",
        ],
      },
    ],
    apiRows: [
      { name: "value", description: "복사할 문자열입니다. 화면에 보이는 label과 다를 수 있습니다." },
      { name: "copied", description: "최근 복사 성공 여부입니다. 짧은 timeout 후 false로 돌아갑니다." },
      { name: "onCopied", description: "복사 성공 후 toast, analytics, inline status를 처리합니다." },
      { name: "onError", description: "Clipboard 실패 시 fallback UI나 manual copy 안내를 보여줍니다." },
    ],
    preview: "docs-copy-button",
    examples: [
      { title: "Basic example", description: "코드 블록 오른쪽 위에 copy action을 배치해 install command를 바로 복사합니다." },
      { title: "Success feedback", description: "복사 직후 label과 aria-live text를 바꿔 성공 상태를 짧게 보여줍니다." },
      { title: "Clipboard fallback", description: "권한이나 secure context 문제로 실패하면 선택 가능한 text field를 노출합니다." },
    ],
    onThisPage: ["Component API", "Examples", "When to use", "Interaction contract", "Feedback placement", "Clipboard failures", "Related terms"],
  }],
  [navFilter("docs-elements-dialog"), {
    filter: navFilter("docs-elements-dialog"),
    kind: "element",
    breadcrumb: "UI Blocks / Docs",
    title: "Dialog",
    lead: "Dialog는 현재 작업 흐름 위에 짧은 확인, 편집, 위험 행동을 올리는 modal element입니다. 배경 화면을 잠시 멈추고 사용자의 명확한 결정을 요구할 때 씁니다.",
    sections: [
      {
        title: "When to use",
        body: [
          "사용자가 현재 화면 맥락을 유지한 채 결정을 내려야 할 때 씁니다. 삭제 확인, 짧은 이름 변경, 초대 전 확인, 위험 action 설명처럼 집중된 작업에 적합합니다.",
          "긴 폼, 여러 단계, 복잡한 탐색이 필요한 작업은 별도 페이지나 side sheet가 더 적합합니다. Dialog는 화면을 막기 때문에 오래 머무르는 작업에는 부담이 큽니다.",
        ],
      },
      {
        title: "Accessibility contract",
        body: [
          "focus trap, labelled title, escape close, backdrop click 정책, destructive action 구분이 필요합니다. 닫기 버튼과 취소 경로도 항상 명시합니다.",
          "열릴 때 focus는 dialog 내부의 첫 의미 있는 control로 이동하고, 닫힐 때는 trigger로 돌아와야 합니다. screen reader가 title과 description을 읽을 수 있도록 연결합니다.",
        ],
        code: "<Dialog aria-labelledby=\"delete-project-title\">\n  <DialogTitle id=\"delete-project-title\" />\n  <DialogActions />\n</Dialog>",
      },
      {
        title: "Layout and actions",
        body: [
          "작은 확인 dialog는 제목, 설명, action row만으로 충분합니다. 편집 dialog는 field group과 footer action을 분리하고, primary action과 cancel action의 위치를 안정적으로 유지합니다.",
          "위험 action은 색만으로 구분하지 말고 verb도 명확히 씁니다. Delete, Remove access, Cancel subscription처럼 결과를 설명하는 label이 필요합니다.",
        ],
      },
      {
        title: "Responsive behavior",
        body: [
          "모바일에서는 dialog width보다 safe area와 scroll behavior가 중요합니다. 내용이 길면 내부 panel만 scroll되게 할지, 전체 page overlay가 scroll될지 정해야 합니다.",
        ],
      },
    ],
    preview: "docs-dialog",
    apiRows: [
      { name: "open", description: "Dialog 표시 상태입니다." },
      { name: "onOpenChange", description: "닫기 버튼, escape, action 완료 후 상태를 갱신합니다." },
      { name: "destructive", description: "삭제나 취소처럼 되돌리기 어려운 행동을 별도 시각 위계로 표시합니다." },
      { name: "initialFocus", description: "열릴 때 focus를 받을 control입니다. 확인 dialog와 form dialog에서 다를 수 있습니다." },
      { name: "returnFocus", description: "닫힌 뒤 focus가 돌아갈 trigger 또는 이전 작업 위치입니다." },
    ],
    examples: [
      { title: "Basic example", description: "짧은 확인 dialog로 위험 action의 결과를 설명하고 취소 경로를 제공합니다." },
      { title: "Destructive action", description: "삭제, 구독 취소처럼 되돌리기 어려운 action은 명확한 verb와 색상 위계를 함께 사용합니다." },
      { title: "Form dialog", description: "간단한 이름 변경이나 초대처럼 짧은 form을 modal 안에서 처리합니다." },
    ],
    onThisPage: ["Component API", "Examples", "When to use", "Accessibility contract", "Layout and actions", "Responsive behavior", "Related terms"],
  }],
  [navFilter("docs-elements-disclosure"), {
    filter: navFilter("docs-elements-disclosure"),
    kind: "element",
    breadcrumb: "UI Blocks / Docs",
    title: "Disclosure",
    lead: "Disclosure는 보조 정보를 접고 펼치는 element입니다. 사용자가 지금 필요한 만큼만 세부 정보를 열 수 있게 해 화면 밀도를 조절합니다.",
    sections: [
      {
        title: "When to use",
        body: [
          "FAQ 답변, 설정 설명, 고급 옵션, 긴 설명문처럼 기본 흐름을 방해하지 않아야 하는 정보를 숨길 때 씁니다. 사용자가 펼쳐도 현재 위치를 떠나지 않습니다.",
          "서로 같은 수준의 여러 보기 중 하나를 고르는 문제라면 Tabs가 더 적합합니다. Disclosure는 정보를 더 보여주는 패턴이고, Tabs는 콘텐츠 view를 전환하는 패턴입니다.",
        ],
      },
      {
        title: "State contract",
        body: [
          "기본 상태는 open 또는 closed입니다. trigger는 현재 상태를 시각적으로 보여줘야 하며, chevron rotation이나 label 변화가 도움이 됩니다.",
          "여러 disclosure를 묶으면 accordion처럼 하나만 열릴지, 여러 개가 동시에 열릴지 결정해야 합니다.",
        ],
        code: "<Disclosure open={isOpen} onOpenChange={setIsOpen}>\n  <DisclosureButton>Advanced options</DisclosureButton>\n  <DisclosurePanel />\n</Disclosure>",
      },
      {
        title: "Keyboard and focus",
        body: [
          "trigger는 button이어야 하며 Space와 Enter로 토글됩니다. panel 안의 focusable content는 열렸을 때만 tab order에 들어와야 합니다.",
          "닫힌 panel의 링크나 입력이 keyboard focus를 받을 수 있으면 사용자는 보이지 않는 UI로 이동하게 됩니다.",
        ],
      },
      {
        title: "Common pitfalls",
        body: [
          "중요한 오류나 필수 입력을 disclosure 안에 숨기면 사용자가 놓치기 쉽습니다. 필수 정보는 기본 화면에 남기고, 부가 설명만 접습니다.",
        ],
      },
    ],
    apiRows: [
      { name: "open", description: "panel이 펼쳐져 있는지 나타냅니다." },
      { name: "onOpenChange", description: "trigger 클릭 또는 keyboard toggle 후 상태를 갱신합니다." },
      { name: "defaultOpen", description: "초기 open 상태입니다. FAQ 첫 항목이나 설정 안내에 사용할 수 있습니다." },
      { name: "panelId", description: "trigger와 panel을 aria-controls로 연결할 때 쓰는 id입니다." },
    ],
    preview: "docs-disclosure",
    examples: [
      { title: "Basic example", description: "FAQ 질문을 버튼으로 두고 답변 panel을 접고 펼칩니다." },
      { title: "Multiple sections", description: "여러 disclosure가 동시에 열릴 수 있는 도움말 목록을 구성합니다." },
      { title: "Accordion behavior", description: "한 번에 하나의 panel만 열리도록 상태를 공유합니다." },
    ],
    onThisPage: ["Component API", "Examples", "When to use", "State contract", "Keyboard and focus", "Common pitfalls", "Related terms"],
  }],
  [navFilter("docs-elements-dropdown-menu"), {
    filter: navFilter("docs-elements-dropdown-menu"),
    kind: "element",
    breadcrumb: "UI Blocks / Docs",
    title: "Dropdown menu",
    lead: "Dropdown menu는 한 트리거 아래 관련 행동을 묶는 element입니다. 값 선택보다 action 선택에 가깝고, 항목 그룹과 keyboard navigation이 중요합니다.",
    sections: [
      {
        title: "When to use",
        body: [
          "카드 action, 계정 메뉴, row action, export menu처럼 현재 대상에 대한 명령을 묶을 때 씁니다. 사용자가 값을 고르는 form input이면 Select가 더 적합합니다.",
          "항목이 너무 많거나 검색이 필요하면 Command palette나 Combobox로 바꾸는 것이 좋습니다.",
        ],
      },
      {
        title: "Menu anatomy",
        body: [
          "기본 구조는 trigger, menu panel, menu item, separator, optional group label입니다. destructive item은 위치와 색, 텍스트를 명확히 구분합니다.",
        ],
        code: "<DropdownMenu>\n  <DropdownTrigger>Actions</DropdownTrigger>\n  <DropdownItem>Edit</DropdownItem>\n  <DropdownSeparator />\n  <DropdownItem tone=\"destructive\">Delete</DropdownItem>\n</DropdownMenu>",
      },
      {
        title: "Keyboard behavior",
        body: [
          "Enter 또는 Space는 trigger를 열고, Arrow keys는 item 사이를 이동합니다. Escape는 닫고 focus를 trigger로 돌려야 합니다.",
          "menu item은 link일 수도 button일 수도 있습니다. 실제 side effect가 있으면 button, navigation이면 link를 씁니다.",
        ],
      },
      {
        title: "Dropdown menu vs select",
        body: [
          "Dropdown menu는 명령 목록이고 Select는 값 목록입니다. Delete, Duplicate, Archive는 menu item이고, Admin, Member, Viewer는 select option입니다.",
        ],
      },
    ],
    apiRows: [
      { name: "open", description: "menu panel 표시 상태입니다." },
      { name: "items", description: "명령 item 목록입니다. label, icon, shortcut, destructive 여부를 가질 수 있습니다." },
      { name: "onAction", description: "item 선택 시 실행되는 action handler입니다." },
      { name: "placement", description: "trigger 기준 panel 위치입니다. viewport collision 처리가 필요합니다." },
    ],
    preview: "docs-dropdown-menu",
    examples: [
      { title: "Basic example", description: "Options 버튼 아래에 edit, duplicate, archive, delete 같은 row action을 묶습니다." },
      { title: "Using with buttons", description: "item을 button으로 렌더링해 현재 객체에 대한 side effect를 실행합니다." },
      { title: "Using with links", description: "navigation action은 link item으로 분리해 새 위치로 이동합니다." },
      { title: "Disabling an item", description: "권한이나 상태 때문에 실행할 수 없는 item은 disabled 상태와 이유를 함께 제공합니다." },
      { title: "Setting the dropdown width", description: "긴 label과 shortcut이 잘리지 않도록 trigger보다 넓은 panel 폭을 설정합니다." },
      { title: "Positioning the dropdown", description: "viewport edge에 닿을 때 panel 방향과 alignment를 조정합니다." },
      { title: "Adding transitions", description: "짧은 opacity/scale transition으로 열린 상태 변화를 부드럽게 보여줍니다." },
    ],
    onThisPage: ["Component API", "Examples", "When to use", "Menu anatomy", "Keyboard behavior", "Menu vs select", "Related terms"],
  }],
  [navFilter("docs-elements-popover"), {
    filter: navFilter("docs-elements-popover"),
    kind: "element",
    breadcrumb: "UI Blocks / Docs",
    title: "Popover",
    lead: "Popover는 트리거 근처에 짧은 보조 정보나 작은 조작을 띄우는 floating element입니다. 현재 맥락을 유지한 채 가벼운 세부 작업을 처리합니다.",
    sections: [
      {
        title: "When to use",
        body: [
          "짧은 필터, 작은 날짜 선택, quick settings, 보조 설명처럼 사용자가 현재 화면을 떠나지 않고 처리할 수 있는 작업에 씁니다.",
          "사용자의 결정을 강하게 막아야 하거나 focus trap이 필요한 작업이면 Dialog가 더 적합합니다. Popover는 가볍고 주변 맥락을 유지합니다.",
        ],
      },
      {
        title: "Positioning contract",
        body: [
          "Popover는 trigger와 시각적으로 연결되어야 합니다. placement, offset, collision handling, arrow 여부를 정하고 작은 화면에서 panel이 잘리지 않게 처리합니다.",
        ],
        code: "<Popover placement=\"bottom-start\" offset={8}>\n  <PopoverButton>Filters</PopoverButton>\n  <PopoverPanel />\n</Popover>",
      },
      {
        title: "Dismiss behavior",
        body: [
          "바깥 클릭, Escape, item 선택, trigger 재클릭 중 어떤 행동이 닫는지 명확해야 합니다. form을 포함한 popover는 submit 전 바깥 클릭으로 닫히는 것이 위험할 수 있습니다.",
        ],
      },
      {
        title: "Popover vs tooltip",
        body: [
          "Tooltip은 읽기 전용 힌트에 가깝고, Popover는 조작 가능한 panel일 수 있습니다. 버튼, input, link가 들어가면 tooltip이 아니라 popover로 봐야 합니다.",
        ],
      },
    ],
    preview: "docs-popover",
    apiRows: [
      { name: "open", description: "popover panel 표시 상태입니다." },
      { name: "placement", description: "trigger 기준 panel 위치입니다." },
      { name: "offset", description: "trigger와 panel 사이 간격입니다." },
      { name: "dismissOnInteractOutside", description: "바깥 클릭으로 닫을지 결정합니다. form popover에서는 신중히 씁니다." },
    ],
    examples: [
      { title: "Basic example", description: "Filter 버튼 옆에 작은 설정 panel을 열어 현재 목록을 조정합니다." },
      { title: "Positioning", description: "trigger 기준 bottom-start, top-end 같은 placement와 collision 처리를 설정합니다." },
      { title: "Dismiss behavior", description: "바깥 클릭, Escape, submit 후 닫힘 정책을 작업 위험도에 맞춥니다." },
    ],
    onThisPage: ["Component API", "Examples", "When to use", "Positioning contract", "Dismiss behavior", "Popover vs tooltip", "Related terms"],
  }],
  [navFilter("docs-elements-select"), {
    filter: navFilter("docs-elements-select"),
    kind: "element",
    breadcrumb: "UI Blocks / Docs",
    title: "Select",
    lead: "Select는 제한된 선택지 중 하나를 고르는 input element입니다. 사용자가 값을 확정하고 form state에 반영하는 것이 핵심입니다.",
    sections: [
      {
        title: "When to use",
        body: [
          "선택지가 제한적이고 사용자가 직접 값을 입력할 필요가 없을 때 씁니다. 역할, 상태, 국가, 정렬 기준처럼 정해진 목록에 적합합니다.",
          "옵션이 많아 검색이 필요하면 Autocomplete나 Combobox가 낫습니다. 명령 실행 목록이면 Dropdown menu가 더 적합합니다.",
        ],
      },
      {
        title: "Option model",
        body: [
          "옵션은 label과 value를 분리합니다. label은 사용자에게 보이는 텍스트이고 value는 form submit, API payload, URL query에 쓰이는 안정적인 값입니다.",
        ],
        code: "const roleOptions = [\n  { label: \"Admin\", value: \"admin\" },\n  { label: \"Member\", value: \"member\" },\n  { label: \"Viewer\", value: \"viewer\" },\n]",
      },
      {
        title: "Keyboard and validation",
        body: [
          "Select는 label, helper text, error message와 함께 form field로 작동합니다. required 상태와 invalid 상태가 시각적으로도, semantic하게도 드러나야 합니다.",
          "Native select를 쓰면 모바일 기본 picker를 활용할 수 있고, custom select를 쓰면 keyboard behavior와 screen reader contract를 직접 책임져야 합니다.",
        ],
      },
      {
        title: "Select vs dropdown menu",
        body: [
          "Select는 현재 값이 남고 form data가 바뀝니다. Dropdown menu는 action을 실행하고 값이 남지 않을 수 있습니다. 두 패턴을 시각적으로 비슷하게 만들더라도 역할은 구분해야 합니다.",
        ],
      },
    ],
    preview: "docs-select",
    apiRows: [
      { name: "value", description: "현재 선택된 option value입니다." },
      { name: "options", description: "사용자가 고를 수 있는 option 목록입니다." },
      { name: "onValueChange", description: "선택이 바뀔 때 form state를 갱신합니다." },
      { name: "placeholder", description: "아직 선택되지 않았을 때 보이는 안내입니다. 실제 value와 구분합니다." },
      { name: "invalid", description: "validation 실패 상태입니다. error text와 연결합니다." },
    ],
    examples: [
      { title: "Basic example", description: "역할, 상태, 정렬 기준처럼 제한된 option 중 하나를 선택합니다." },
      { title: "With validation", description: "required field와 error message를 select trigger와 semantic하게 연결합니다." },
      { title: "Native fallback", description: "모바일 form에서는 native select를 사용해 플랫폼 picker를 활용합니다." },
    ],
    onThisPage: ["Component API", "Examples", "When to use", "Option model", "Keyboard and validation", "Select vs menu", "Related terms"],
  }],
  [navFilter("docs-elements-tabs"), {
    filter: navFilter("docs-elements-tabs"),
    kind: "element",
    breadcrumb: "UI Blocks / Docs",
    title: "Tabs",
    lead: "Tabs는 같은 화면 안에서 관련된 보기나 설정 그룹을 빠르게 전환하는 navigation element입니다. 같은 수준의 콘텐츠를 비교하거나 반복해서 오갈 때 효과적입니다.",
    sections: [
      {
        title: "When to use",
        body: [
          "서로 같은 수준의 콘텐츠를 한 화면에서 전환할 때 씁니다. Overview, Activity, Settings처럼 한 객체의 다른 view를 보여주거나, table view와 chart view를 바꿀 때 적합합니다.",
          "서로 다른 목적의 페이지 이동에는 적합하지 않습니다. 사용자가 URL을 공유하거나 browser history로 이동해야 하는 흐름이면 일반 navigation이 낫습니다.",
        ],
      },
      {
        title: "State contract",
        body: [
          "active tab, hover, focus-visible, disabled, overflow 상태를 함께 설계합니다. active state는 색만 바꾸지 말고 border, indicator, surface 같은 구조적 신호를 포함하는 편이 좋습니다.",
          "탭 전환이 내부 state만 바꾸는지, URL query를 갱신하는지 결정해야 합니다. 사용자가 특정 tab URL을 공유해야 하면 URL과 동기화합니다.",
        ],
        code: "<Tabs value=\"activity\">\n  <TabsList>\n    <TabsTrigger value=\"activity\">Activity</TabsTrigger>\n  </TabsList>\n</Tabs>",
      },
      {
        title: "Keyboard behavior",
        body: [
          "Tab key는 tab list 전체를 한 번에 지나가고, Arrow keys가 tab 사이를 이동하는 방식이 일반적입니다. Home과 End를 지원하면 긴 tab list에서 이동이 쉬워집니다.",
          "tab panel은 선택된 tab과 연결되어야 하며, 비활성 panel의 focusable content가 tab order에 남지 않아야 합니다.",
        ],
      },
      {
        title: "Responsive behavior",
        body: [
          "모바일에서 tab label이 길면 줄바꿈보다 가로 스크롤이나 select fallback이 나을 수 있습니다. 단, 사용자가 현재 선택 상태를 바로 볼 수 있어야 합니다.",
          "너무 많은 tab은 정보 구조 문제일 수 있습니다. 5개를 넘어가면 sidebar navigation, segmented filter, command palette 같은 대안을 검토합니다.",
        ],
      },
      {
        title: "Tabs vs disclosure",
        body: [
          "Tabs는 같은 자리에서 콘텐츠 view를 바꾸고, Disclosure는 현재 콘텐츠 아래에 세부 정보를 더 보여줍니다. 둘 다 접고 펼치는 시각 효과를 가질 수 있지만 정보 구조는 다릅니다.",
        ],
      },
    ],
    preview: "docs-tabs",
    apiRows: [
      { name: "value", description: "현재 선택된 tab id입니다." },
      { name: "onValueChange", description: "사용자 선택과 URL/query state를 연결할 수 있습니다." },
      { name: "orientation", description: "가로/세로 탭 배치를 정합니다. 정보 밀도에 따라 선택합니다." },
      { name: "activationMode", description: "focus 이동 시 바로 선택할지, Enter/Space로 확정할지 정합니다." },
      { name: "panelId", description: "tab과 panel을 연결하는 id입니다. aria-controls와 labelledby에 사용합니다." },
    ],
    examples: [
      { title: "Basic example", description: "Overview, Activity, Settings 같은 같은 수준의 view를 한 화면에서 전환합니다." },
      { title: "Manual activation", description: "keyboard focus 이동과 실제 tab 선택을 분리해 큰 panel 전환의 부담을 줄입니다." },
      { title: "Scrollable tabs", description: "좁은 화면에서 label이 긴 tab list를 가로 스크롤로 유지합니다." },
    ],
    onThisPage: ["Component API", "Examples", "When to use", "State contract", "Keyboard behavior", "Responsive behavior", "Tabs vs disclosure", "Related terms"],
  }],
  [navFilter("docs-foundations-color"), {
    filter: navFilter("docs-foundations-color"),
    kind: "foundation",
    breadcrumb: "UI Blocks / Docs",
    title: "Color",
    lead: "Askewly Design의 Color는 3-tier 시스템입니다 — primitive 값, semantic 역할, 그리고 최소한의 component override tier로 구성됩니다. 컴포넌트와 앱 코드는 semantic 토큰만 참조해야 합니다. 이 간접 참조 덕분에 다크 모드나 향후 리테마가 find-and-replace가 아니라 토큰 하나만 바꾸는 작업이 됩니다.",
    sections: [
      {
        title: "Tokens",
        body: [
          "primitive tier는 원시값만 담습니다: 12단계 violet-tinted gray ramp(`color.primitive.gray.1`–`12`), `color.primitive.white`, 소규모 브랜드 세트(`askewly.violet`, `orchid`, `lavender`, `sky`, `mint`), destructive 상태용 `color.primitive.red.9`입니다. gray ramp에는 토큰 소스에 명시된 사용 관례가 있습니다 — 1-2는 앱 배경, 3-5는 interactive 컴포넌트 상태, 6-8은 border, 9-10은 solid/low-contrast foreground, 11-12는 text입니다.",
          "semantic tier는 컴포넌트가 실제로 참조하는 계층입니다: `surface.base/raised/overlay/muted/secondary/tint`, `text.default/muted/secondary/on-accent`, `action.primary/secondary/destructive`, `accent.base/foreground`, `border.default/input/focus/accent`. 각 semantic 토큰은 기본적으로 primitive 하나를 참조하고, 별도의 다크 모드 값을 가질 수 있습니다.",
          "component tier는 의도적으로 얇습니다 — 현재는 `button.bg`, `button.text` 두 개뿐이고, 둘 다 semantic action/text 토큰을 그대로 alias합니다. semantic 역할로 override를 표현할 수 없을 때만 새 component-level 색 토큰을 정당화합니다.",
        ],
        code: "// tokens/askewly.tokens.json (semantic tier, abridged)\ncolor.semantic.surface.base      -> color.primitive.gray.1\ncolor.semantic.surface.raised    -> color.primitive.white\ncolor.semantic.text.default      -> color.primitive.gray.12\ncolor.semantic.action.primary    -> color.primitive.askewly.violet\ncolor.semantic.border.focus      -> color.primitive.askewly.violet",
      },
      {
        title: "Usage examples",
        body: [
          "사이트 빌드에서는 이 semantic 토큰들이 CSS custom property(`src/tokens.css`)로 생성되고 Tailwind v4 theme에 바인딩됩니다. 그래서 복붙 가능한 형태는 raw hex 값이 아니라 Tailwind utility class입니다.",
        ],
        code: "<button class=\"rounded-lg bg-primary px-4 py-2 text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring\">\n  Save changes\n</button>\n\n<div class=\"rounded-xl border border-border bg-card p-4 text-foreground\">\n  <p class=\"text-muted-foreground\">Card surface on top of the app background.</p>\n</div>\n\n<button class=\"bg-destructive text-primary-foreground\">Delete workspace</button>",
      },
      {
        title: "Good vs bad",
        body: [
          "Good: 의도에 맞는 semantic 역할을 참조합니다 — raised panel에는 `bg-card`, 조용한 fill에는 `bg-muted`, 보조 텍스트에는 `text-muted-foreground`. Bad: 컴포넌트 마크업에 primitive 값(`#6F2DBD`, `oklch(0.88 0.015 270)`)을 그대로 하드코딩하는 것 — 다크 모드나 리테마가 그 표면을 바꿔야 하는 순간 깨집니다.",
          "Good: ramp 자체의 사용 관례대로 `color.primitive.gray.9`–`10`을 solid/low-contrast foreground로 씁니다. Bad: text 전용인 `gray.11`/`12`를 배경 fill로, 배경 전용인 `gray.1`/`2`를 본문 텍스트로 쓰는 것 — 둘 다 ramp가 보장하려던 대비를 깨뜨립니다.",
          "Good: 어떤 semantic 토큰도 맞지 않을 때만 새 component override를 추가합니다. Bad: 일회성 카드를 위해 완전히 새로운 semantic 역할(예: `surface.highlight`)을 만드는 것 — 이미 같은 용도로 존재하는 `surface.tint`나 `accent.base`를 조합하면 됩니다.",
        ],
      },
      {
        title: "Light / dark",
        body: [
          "다크 값은 semantic tier에만 존재하며, 각 토큰의 `$extensions['com.askewly.modes'].dark`에 있습니다. primitive와 component tier는 자체 다크 override를 절대 정의하지 않습니다 — 다크 모드는 전적으로 semantic tier의 관심사입니다.",
          "대부분의 surface/text/border 토큰은 단순히 gray ramp의 양 끝을 맞바꿉니다: `surface.base`는 라이트에서 `gray.1`, 다크에서 `gray.12`입니다. `text.default`는 라이트에서 `gray.12`, 다크에서 `gray.1`입니다.",
          "`action.primary`는 의도적인 예외입니다: 라이트 모드에서는 브랜드 violet에 흰색(`text.on-accent`) 텍스트지만, 다크 모드에서는 거의 흰색 fill(`gray.1`)에 거의 검은색 텍스트(`gray.12`)로 반전됩니다. 이는 브랜드 색을 어두운 배경에서 흐리게 죽이는 대신, primary 버튼이 다크 캔버스 위에서 최대 대비를 유지하도록 합니다.",
        ],
      },
      {
        title: "Implementation notes",
        body: [
          "참조 방향은 한 방향뿐입니다: component -> semantic -> primitive. component 토큰은 semantic 토큰을 가리킬 수 있고, semantic 토큰은 primitive를 가리킬 수 있지만 반대 방향은 없습니다. 컴포넌트는 semantic tier를 건너뛰고 primitive를 직접 가리켜서는 안 됩니다.",
          "`src/tokens.css`와 `.dark` class 블록은 생성된 산출물입니다(`scripts/generate-tokens.mjs`) — 생성된 CSS가 아니라 `tokens/askewly.tokens.json`을 수정해야 합니다.",
        ],
      },
      {
        title: "Agent constraints",
        body: [
          "컴포넌트 코드에 hex나 `oklch()` 값을 하드코딩하지 않습니다 — 항상 대응하는 Tailwind utility(`bg-card`, `text-foreground`, `border-border` 등)로 해결해야 토큰 간접 참조가 유지됩니다.",
          "일회성 시각 요구를 해결하려고 새 semantic 역할을 발명하지 않습니다. `surface.*`, `text.*`, `action.*`, `accent.*`, `border.*`를 먼저 확인하고 그 안에서 조합합니다.",
          "화면을 배포하기 전에 `.dark` class를 적용해 렌더링하고, 단순히 반전된 라이트 화면이 아닌지 확인합니다 — `action.primary`를 비롯한 일부 토큰은 다크 모드에서 \"같은 색조에 밝기만 다름\"이 아니라 의도적으로 다르게 동작합니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: [...FOUNDATION_SECTION_TITLES],
  }],
  [navFilter("docs-foundations-typography"), {
    filter: navFilter("docs-foundations-typography"),
    kind: "foundation",
    breadcrumb: "UI Blocks / Docs",
    title: "Typography",
    lead: "Askewly Design의 Typography는 작고 닫힌 세트입니다: 두 개의 font family, 5단계 type scale, 두 개의 font weight. 이렇게 작게 유지하는 이유는, 디자이너가 모든 heading 크기를 눈으로 일일이 확인하지 않아도 이 세트로 만든 화면이 시각적으로 일관되게 유지되기 때문입니다.",
    sections: [
      {
        title: "Tokens",
        body: [
          "`typography.font.sans`는 기본 UI 폰트 스택입니다: `Geist, \"Noto Sans KR\", ui-sans-serif, system-ui, sans-serif` — Noto Sans KR이 스택에 들어있는 이유는 같은 UI 안의 한국어 카피가 어긋난 시스템 폰트로 fallback되지 않게 하기 위해서입니다. `typography.font.mono`는 `\"Geist Mono\", ui-monospace, monospace`로, 코드 블록과 token/id 형태의 텍스트에 씁니다.",
          "`typography.scale`은 다섯 크기를 정의합니다: `sm`(14px), `base`(16px), `lg`(20px), `xl`(28px), `2xl`(40px). `typography.weight`는 정확히 두 weight만 정의합니다: `regular`(400), `medium`(500).",
          "소스에는 아직 line-height, letter-spacing, 추가 weight 토큰이 없습니다 — 현재 SSOT에 포함되지 않은 항목이므로, 더 굵은 weight(예: bold/700)나 커스텀 line-height는 암묵적 기본값이 아니라 명시되지 않은 gap으로 취급해야 합니다.",
        ],
        code: "typography.font.sans   -> [\"Geist\", \"Noto Sans KR\", \"ui-sans-serif\", \"system-ui\", \"sans-serif\"]\ntypography.font.mono   -> [\"Geist Mono\", \"ui-monospace\", \"monospace\"]\ntypography.scale.sm    -> 14px   typography.scale.lg  -> 20px\ntypography.scale.base  -> 16px   typography.scale.xl  -> 28px\n                                  typography.scale.2xl -> 40px\ntypography.weight.regular -> 400   typography.weight.medium -> 500",
      },
      {
        title: "Usage examples",
        body: [
          "이 값들은 Tailwind text-size utility와 생성된 두 custom property `--font-sans` / `--font-mono`로 해석됩니다. 그래서 실제 사용법은 raw CSS가 아니라 표준 Tailwind입니다.",
        ],
        code: "<h1 class=\"text-2xl font-medium text-foreground\">Workspace settings</h1>\n<p class=\"text-base text-muted-foreground\">Manage plan, members, and billing.</p>\n<code class=\"font-mono text-sm text-foreground\">npm run build</code>",
      },
      {
        title: "Good vs bad",
        body: [
          "Good: 화면의 모든 타입에 대해 가장 가까운 scale step(`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`)을 고릅니다. Bad: `text-[15px]`나 `text-[26px]`처럼 두 토큰 사이 어딘가에 있는 임의값을 \"보기 좋아서\"라는 이유만으로 쓰는 것입니다.",
          "Good: 본문 강조나 compact heading에는 `font-medium`(500)을 씁니다. Bad: 마치 시스템의 일부인 것처럼 `font-bold`(700)를 쓰는 것 — 아직 `bold`/700 weight 토큰이 존재하지 않으므로, 이는 토큰을 쓰는 게 아니라 토큰을 발명하는 선택입니다.",
        ],
      },
      {
        title: "Light / dark",
        body: [
          "Typography 토큰은 색을 담지 않고 다크 모드 override도 없습니다 — font family, scale, weight는 라이트/다크에서 동일합니다. 모드 간 가독성은 전적으로 color tier의 관심사입니다: 크기만으로 대비를 보장한다고 가정하지 말고, 모든 type 토큰을 `text.*` semantic color(Color foundation 참조)와 짝지어야 합니다.",
        ],
      },
      {
        title: "Implementation notes",
        body: [
          "생성된 CSS는 `--font-sans`, `--font-mono`, `--font-size-sm|base|lg|xl|2xl`, `--font-weight-regular|medium`을 노출합니다 — 이들은 Tailwind v4 theme에 바인딩되어 있으므로, raw custom property가 아니라 `font-sans`, `text-lg`, `font-medium` 등이 의도된 사용 표면입니다.",
        ],
      },
      {
        title: "Agent constraints",
        body: [
          "위 다섯 scale step이나 두 weight에 없는 font-size/weight 값을 새 토큰 제안으로 표시하지 않고 도입하지 않습니다 — \"임팩트를 위해\" `text-[15px]`나 600/700 weight를 조용히 추가하지 않습니다.",
          "더 굵은 weight를 강조용으로 쓸 수 있다고 가정하지 않습니다. 디자인 브리프가 bold 텍스트를 요구하면 이 SSOT 대비 gap으로 취급하고, weight 값을 추측하는 대신 그 사실을 말합니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: [...FOUNDATION_SECTION_TITLES],
  }],
  [navFilter("docs-foundations-spacing-layout"), {
    filter: navFilter("docs-foundations-spacing-layout"),
    kind: "foundation",
    breadcrumb: "UI Blocks / Docs",
    title: "Spacing & layout",
    lead: "Spacing는 4/8px grid를 따르고, radius는 하나의 base 값에 묶인 4단계 scale을 따릅니다. 코드에서 둘의 동작 방식은 다릅니다: radius 토큰은 실제 utility class로 Tailwind theme에 바인딩되어 있지만, spacing 토큰은 Tailwind class namespace가 아니라 참조용 관례입니다.",
    sections: [
      {
        title: "Tokens",
        body: [
          "`dimension.space`는 4/8px grid 위 6단계를 정의합니다: `1` = 4px, `2` = 8px, `4` = 16px, `8` = 32px, `12` = 48px, `16` = 64px. 토큰 소스 자체 설명에 따르면 이것들은 \"reference variables only — not bound into the Tailwind theme namespace\"입니다. 즉 `p-space-4` 같은 utility class는 존재하지 않고, 이 토큰들은 구현자가 맞춰야 할 grid를 문서화하기 위해 존재합니다.",
          "`dimension.radius`는 하나의 base radius(0.5rem)에서 파생된 4단계를 정의합니다: `sm` = 4px, `md` = 6px, `lg` = 8px, `xl` = 12px. spacing과 달리 radius는 Tailwind theme에 바인딩되어 있어서, `rounded-sm`/`rounded-md`/`rounded-lg`/`rounded-xl`이 이 값들에 직접 매핑됩니다.",
        ],
        code: "dimension.space.1  -> 4px    dimension.space.8  -> 32px\ndimension.space.2  -> 8px    dimension.space.12 -> 48px\ndimension.space.4  -> 16px   dimension.space.16 -> 64px\n\ndimension.radius.sm -> 4px   dimension.radius.lg -> 8px\ndimension.radius.md -> 6px   dimension.radius.xl -> 12px",
      },
      {
        title: "Usage examples",
        body: [
          "spacing은 바인딩된 theme가 아니라 관례이므로, 복붙 가능한 패턴은 다음과 같습니다: Tailwind 자체 spacing utility 중 grid(4, 8, 16, 32, 48, 64px)에 맞는 배수를 고르고, 모서리에는 바인딩된 radius class를 그대로 씁니다.",
        ],
        code: "<section class=\"flex flex-col gap-4 rounded-xl border border-border bg-card p-8\">\n  <h2 class=\"text-lg font-medium\">Team members</h2>\n  <div class=\"grid gap-2\">\n    <button class=\"rounded-md bg-secondary px-4 py-2\">Invite member</button>\n  </div>\n</section>",
      },
      {
        title: "Good vs bad",
        body: [
          "Good: `p-4`(16px), `gap-2`(8px), `p-8`(32px) — space 토큰이 설명하는 4/8 grid에 맞는 Tailwind 기본값입니다. Bad: 아무 layout 이유 없이 grid에서 벗어난 임의값 `p-[13px]`나 `gap-[10px]`.",
          "Good: 정의된 4단계 radius에 맞춰 카드와 dialog에 `rounded-lg`나 `rounded-xl`을 씁니다. Bad: 4단계 scale 밖의 값인 `rounded-[10px]`나 `rounded-[2px]` — 화면마다 모서리 처리가 일관되지 않게 됩니다.",
        ],
      },
      {
        title: "Light / dark",
        body: [
          "토큰 소스에는 `dimension.space`도 `dimension.radius`도 다크 모드 override가 없습니다 — spacing과 corner radius는 모드와 무관합니다. 다크 모드는 색만 바꿔야 하고 padding, gap, radius는 절대 바꾸면 안 됩니다. 다크 모드 레이아웃이 라이트 모드와 다른 spacing을 필요로 한다면, 이는 보통 색 대비 문제를 잘못된 tier에서 우회하고 있다는 신호입니다.",
        ],
      },
      {
        title: "Implementation notes",
        body: [
          "Radius는 단일 `--radius` base(0.5rem)에서 `calc()` offset으로 파생됩니다(`--radius-sm: calc(var(--radius) - 4px)`부터 `--radius-xl: calc(var(--radius) + 4px)`까지). 그래서 base 값 하나만 바꾸면 네 단계가 함께 이동합니다.",
          "Spacing은 아직 코드에 동등한 단일 소스가 없습니다 — 생성된 변수가 아니라 문서화된 grid이므로, 여기에 맞추는 것은 빌드가 강제하는 게 아니라 코드 리뷰 관례입니다.",
        ],
      },
      {
        title: "Agent constraints",
        body: [
          "`space-*` Tailwind class(`p-space-4`, `gap-space-2` 등)를 발명하지 않습니다 — theme에 존재하지 않습니다. Tailwind 내장 spacing utility를 쓰고 값을 4/8 grid 위에 유지합니다.",
          "다섯 번째 radius step이나 임의 radius 값을 도입하지 않습니다. `rounded-sm`/`md`/`lg`/`xl`만 씁니다.",
          "다크 모드 대비 문제의 우회책으로 spacing이나 radius를 조정하지 않습니다 — color 토큰을 고치는 것이 맞습니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: [...FOUNDATION_SECTION_TITLES],
  }],
  [navFilter("docs-foundations-motion"), {
    filter: navFilter("docs-foundations-motion"),
    kind: "foundation",
    breadcrumb: "UI Blocks / Docs",
    title: "Motion",
    lead: "Askewly Design의 토큰 SSOT(`tokens/askewly.tokens.json`)에는 아직 duration/easing 토큰 tier가 없습니다. 이 문서는 발명한 규칙이 아니라, 사이트 코드에 실제로 존재하는 모션 관례(dialog/sheet 애니메이션, prefers-reduced-motion 처리)를 있는 그대로 정리합니다.",
    sections: [
      {
        title: "Tokens",
        body: [
          "Color/Typography/Spacing와 달리 motion에는 아직 토큰 tier가 없습니다 — `dimension.duration`이나 `motion.easing` 같은 항목은 SSOT에 존재하지 않습니다. 따라서 현재 duration·easing 값은 컴포넌트 코드에 개별적으로 박혀 있는 실제 구현이며, 아직 재사용 가능한 토큰으로 승격되지 않은 상태입니다.",
          "실제 코드에서 관찰되는 값은 다음과 같습니다: Dialog는 `duration-200`(200ms)에 `data-[state=open]:animate-in`/`data-[state=closed]:animate-out`을 씁니다. Sheet(side panel)는 열릴 때 420ms `cubic-bezier(0.16, 1, 0.3, 1)`, 닫힐 때 240ms `cubic-bezier(0.7, 0, 0.84, 0)`를 씁니다. 이것들은 선언된 토큰이 아니라 관찰된 관례이므로, 새 컴포넌트를 만들 때 참고할 기준선이지 고정된 SSOT 값은 아닙니다.",
        ],
        code: "// examples/ui-vocabulary-site/src/components/ui/dialog.tsx (관찰된 관례, 토큰 아님)\n\"duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95\"\n\n// examples/ui-vocabulary-site/src/index.css — sheet\nanimation: sheet-slide-in-bottom 420ms cubic-bezier(0.16, 1, 0.3, 1) both;\nanimation: sheet-slide-out-bottom 240ms cubic-bezier(0.7, 0, 0.84, 0) both;",
      },
      {
        title: "Usage examples",
        body: [
          "새 overlay(Dialog, Popover, Dropdown menu 등)를 만들 때는 위 관찰된 값과 비슷한 범위(180-240ms 근처, ease 계열 curve)에서 시작하고, `data-[state=open]`/`data-[state=closed]` 같은 상태 attribute로 열림/닫힘 애니메이션을 분리합니다.",
          "`prefers-reduced-motion: reduce` 사용자를 위해서는 애니메이션을 끄되 상태 변화 자체는 즉시 반영되어야 합니다 — 사이트는 이를 위해 두 가지 실제 패턴을 씁니다: CSS `@media (prefers-reduced-motion: reduce)` 블록으로 특정 클래스의 애니메이션을 무력화하는 방식(`src/index.css`), 그리고 React에서 `window.matchMedia(\"(prefers-reduced-motion: reduce)\")`를 구독해 컴포넌트 로직 자체를 분기하는 방식(`home-page.tsx`의 `usePrefersReducedMotion`).",
        ],
        code: "// examples/ui-vocabulary-site/src/index.css\n@media (prefers-reduced-motion: reduce) {\n  [data-slot=\"sheet-overlay\"],\n  [data-slot=\"sheet-content\"],\n  .visual-hover-surface,\n  .visual-gradient-shift {\n    /* animation/transition 무력화 */\n  }\n}\n\n// examples/ui-vocabulary-site/src/components/home-page.tsx\nfunction usePrefersReducedMotion() {\n  const [reduced, setReduced] = useState(() =>\n    window.matchMedia(\"(prefers-reduced-motion: reduce)\").matches,\n  )\n  // ...change 이벤트로 갱신\n  return reduced\n}",
      },
      {
        title: "Good vs bad",
        body: [
          "Good: overlay가 열리고 닫힐 때 서로 다른 duration/easing을 쓰는 것(예: 열림 200ms ease-out, 닫힘 그보다 짧게) — 실제 Dialog/Sheet 구현이 이 패턴을 따릅니다. Bad: 열림과 닫힘에 같은 curve를 그대로 재사용해 닫힘이 굼뜨게 느껴지는 것.",
          "Good: showcase 데모처럼 반복·장식성 애니메이션(`visual-*` 클래스)을 `prefers-reduced-motion: reduce`에서 명시적으로 끄는 것. Bad: 상태 전달에 필요한 애니메이션(예: Dialog가 열렸다는 시각 신호)까지 전부 제거해 사용자가 상태 변화 자체를 놓치게 만드는 것 — reduced-motion 용어 자체가 \"모션을 줄인다고 상태 변화를 숨기면 안 된다\"고 명시합니다.",
        ],
      },
      {
        title: "Light / dark",
        body: [
          "duration과 easing에는 색이 없으므로 라이트/다크 모드에 따라 값이 달라지지 않습니다. 다만 애니메이션 도중 보이는 표면(overlay backdrop, glow, shadow)의 색은 Color foundation의 semantic 토큰을 따라야 하며, 다크 모드에서 backdrop 대비가 라이트 모드와 동일하게 읽히는지 별도로 확인해야 합니다.",
        ],
      },
      {
        title: "Implementation notes",
        body: [
          "모션 관련 코드는 두 곳에 흩어져 있습니다: Radix 기반 컴포넌트(`src/components/ui/dialog.tsx` 등)의 Tailwind `animate-in`/`animate-out` 유틸리티, 그리고 showcase 데모용 커스텀 keyframe(`src/index.css`의 `visual-*`, `sheet-*` 애니메이션). 전자는 컴포넌트 상태(`data-state`)에 결속되어 있고, 후자는 장식성 반복 애니메이션입니다.",
          "외부 모션 기법 레퍼런스(GSAP ScrollTrigger 등)는 `knowledge/motion-references.md`에 북마크되어 있습니다 — 이 문서는 showcase 데모 제작 시 참고하는 기법 목록이며, 토큰이나 규칙의 SSOT는 아닙니다.",
        ],
      },
      {
        title: "Agent constraints",
        body: [
          "존재하지 않는 `motion.duration.*`나 `motion.easing.*` 토큰을 참조하거나 발명하지 않습니다 — 현재 SSOT에는 motion tier가 없다는 사실을 gap으로 보고하고, 대신 이 문서에 정리된 관찰된 값(Dialog 200ms, Sheet 240-420ms)을 참고선으로 씁니다.",
          "반복·장식성 애니메이션을 추가할 때는 반드시 `prefers-reduced-motion: reduce`에서 끄거나 정지시키는 처리를 함께 구현합니다 — 애니메이션만 추가하고 reduced-motion 분기를 빠뜨리지 않습니다.",
          "reduced-motion 처리를 이유로 상태 변화 자체(열림/닫힘, 성공/실패, 선택됨)를 사용자에게 안 보이게 만들지 않습니다 — 애니메이션만 제거하고 최종 상태는 즉시, 명확하게 반영합니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: [...FOUNDATION_SECTION_TITLES],
  }],
  [navFilter("docs-foundations-accessibility"), {
    filter: navFilter("docs-foundations-accessibility"),
    kind: "foundation",
    breadcrumb: "UI Blocks / Docs",
    title: "Accessibility",
    lead: "Askewly Design의 접근성 기준은 두 곳에서 파생됩니다 — 토큰 SSOT의 대비/포커스 관련 색 토큰, 그리고 WCAG의 일반 원칙입니다. 이 문서는 새 규칙을 만들지 않고, 이미 존재하는 토큰과 표준을 화면 구현에 연결합니다.",
    sections: [
      {
        title: "Tokens",
        body: [
          "포커스 링은 전용 semantic 토큰을 가집니다: `color.semantic.border.focus`는 라이트에서 `askewly.violet`, 다크에서 `askewly.lavender`로 값이 바뀝니다. 이는 `--ring` custom property로 생성되고, Tailwind에서는 `focus-visible:ring-ring`/`focus-visible:border-ring` 형태로 쓰입니다.",
          "대비가 걸린 색 쌍(surface/text)은 Color foundation과 동일합니다: `surface.base`+`text.default`, `surface.raised`+`text.default`, `action.primary`+`text.on-accent`, `surface.secondary`+`text.secondary`. 접근성 관점에서 이 문서가 강조하는 것은, 이 쌍을 벗어나 임의 조합(예: `surface.muted` 위에 `text.on-accent`)을 쓰면 SSOT가 검증한 대비 관계 밖으로 나간다는 점입니다.",
        ],
        code: "// tokens/askewly.tokens.json\ncolor.semantic.border.focus  -> askewly.violet   (dark: askewly.lavender)\n\n// 생성된 CSS\n--ring: #6F2DBD;              /* light */\n--ring: #B298DC;               /* .dark (askewly.lavender) */\n\n// Tailwind 사용\nfocus-visible:border-ring focus-visible:ring-ring/50",
      },
      {
        title: "Usage examples",
        body: [
          "실제 버튼 구현(`src/components/ui/button.tsx`)은 focus-visible 상태와 invalid 상태를 별도 semantic 신호로 분리합니다 — 색만 바뀌는 게 아니라 outline(`border-ring`)과 ring(`ring-ring/50`)이 함께 나타납니다.",
          "스크린리더 전용 텍스트, ARIA live region, invalid 상태 같은 패턴은 UI Vocabulary에 이미 term으로 등록되어 있습니다: `sr-only`, `aria-live`, `aria-invalid`, `focus-trap`, `color-contrast`, `focus-ring`. 화면을 만들 때는 이 용어들이 요구하는 상태를 색 토큰과 함께 구현합니다.",
        ],
        code: "<button class=\"outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20\">\n  Save changes\n</button>",
      },
      {
        title: "Good vs bad",
        body: [
          "Good: 모든 interactive element에 `focus-visible:ring-ring` 계열 포커스 신호를 남깁니다 — hover 색만 바꾸고 keyboard focus 신호를 생략하지 않습니다. Bad: `outline-none`만 적용하고 대체 focus 신호를 주지 않는 것 — 이는 키보드 사용자에게 현재 위치를 완전히 숨깁니다.",
          "Good: `text.default`/`text.muted`/`text.secondary`처럼 이미 검증된 semantic text 색을 그 짝이 되는 surface 위에서만 씁니다. Bad: 대비를 눈대중으로 판단해 `text.muted`를 `surface.overlay`가 아닌 임의의 진한 배경 위에 얹는 것 — SSOT가 보장하는 짝을 깨뜨립니다.",
          "Good: destructive action에 `action.destructive` 색과 함께 \"Delete\", \"Remove access\" 같은 명확한 동사 label을 같이 씁니다. Bad: 색만 빨갛게 바꾸고 label은 \"OK\"로 남겨 두는 것 — 색맹 사용자나 저시력 사용자에게 위험 신호가 전달되지 않습니다.",
        ],
      },
      {
        title: "Light / dark",
        body: [
          "포커스 링 색은 라이트/다크에서 다릅니다(`askewly.violet` vs `askewly.lavender`) — 다크 배경에서 violet 링이 충분히 도드라지지 않기 때문에 별도 값을 씁니다. 새 컴포넌트를 다크 모드에서 검증할 때는 focus-visible 상태가 실제로 눈에 띄는지 별도로 확인해야 합니다.",
          "text/surface 대비 관계도 라이트/다크에서 값이 다르지만(Color foundation의 gray ramp 반전 참고) 관계 자체(어떤 text 토큰이 어떤 surface 토큰과 짝인지)는 유지됩니다 — 짝이 바뀌는 게 아니라 각 짝의 실제 색 값만 반전됩니다.",
        ],
      },
      {
        title: "Implementation notes",
        body: [
          "포커스 링은 `border.focus` 토큰 하나로 `--ring` custom property가 생성되고, `tailwind.config`/`@theme`을 통해 `ring-ring`, `border-ring` 두 utility 계열로 노출됩니다. 별도의 accessibility 전용 토큰 tier는 없습니다 — 접근성은 Color(대비·포커스 링)와 Motion(reduced-motion) foundation에 걸쳐 있는 관심사입니다.",
          "WCAG 자체의 수치 기준(예: 본문 텍스트 4.5:1, 큰 텍스트/UI 컴포넌트 3:1 대비)은 이 SSOT에 토큰으로 인코딩되어 있지 않습니다 — 이는 토큰이 아니라 W3C WCAG 2.1의 일반 원칙이며, 화면 구현 시 별도로 확인해야 하는 외부 기준입니다.",
        ],
      },
      {
        title: "Agent constraints",
        body: [
          "`outline-none`을 추가할 때는 반드시 그와 짝을 이루는 `focus-visible:ring-*`/`focus-visible:border-*`를 함께 추가합니다 — 포커스 신호를 지우기만 하고 대체하지 않는 조합은 만들지 않습니다.",
          "색 하나만으로 상태(성공/실패/위험)를 전달하지 않습니다 — label, 아이콘, 텍스트 중 최소 하나를 색과 함께 씁니다(Copy button, Dialog 문서의 관례와 동일).",
          "이 문서에 없는 새 접근성 규칙(예: 특정 애니메이션 duration이 접근성상 안전하다는 주장)을 발명하지 않습니다 — 근거가 필요하면 tokens.json, 이 문서, 또는 WCAG 원문을 인용합니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: [...FOUNDATION_SECTION_TITLES],
  }],
  [navFilter("docs-foundations-dark-mode"), {
    filter: navFilter("docs-foundations-dark-mode"),
    kind: "foundation",
    breadcrumb: "UI Blocks / Docs",
    title: "Dark mode",
    lead: "Askewly Design의 다크 모드는 semantic tier 전용 관심사입니다. 다크 모드를 \"라이트 화면을 반전시킨 것\"으로 취급하지 않는 것이 핵심 원칙입니다 — 몇몇 semantic 토큰은 라이트와 다크에서 구조적으로 다르게 동작합니다.",
    sections: [
      {
        title: "Tokens",
        body: [
          "다크 값은 각 semantic 토큰의 `$extensions['com.askewly.modes'].dark`에 정의됩니다. primitive tier(`color.primitive.*`)와 component tier(`color.component.*`)는 다크 override를 전혀 갖지 않습니다 — 다크 모드 전환은 오직 semantic 토큰이 primitive 참조를 바꾸는 방식으로만 일어납니다.",
          "대부분의 semantic 토큰은 gray ramp의 양 끝을 맞바꾸는 방식으로 다크 값을 가집니다: `surface.base`(`gray.1` → `gray.12`), `surface.raised`/`overlay`(`white` → `gray.11`), `text.default`(`gray.12` → `gray.1`), `border.default`/`input`(`gray.6` → `gray.10`).",
        ],
        code: "// tokens/askewly.tokens.json — 대칭 반전 패턴\ncolor.semantic.surface.base\n  light: color.primitive.gray.1\n  dark:  color.primitive.gray.12\n\ncolor.semantic.text.default\n  light: color.primitive.gray.12\n  dark:  color.primitive.gray.1",
      },
      {
        title: "Usage examples",
        body: [
          "구현에서는 이 반전이 `.dark` class 블록으로 생성됩니다(`src/tokens.css`). 컴포넌트 코드는 모드를 분기하지 않고 항상 같은 Tailwind utility(`bg-card`, `text-foreground`)를 쓰며, 실제 값 전환은 CSS custom property가 담당합니다.",
        ],
        code: "/* examples/ui-vocabulary-site/src/tokens.css (생성됨) */\n:root { --background: oklch(0.985 0 0); --foreground: oklch(0.16 0.015 270); }\n.dark { --background: oklch(0.16 0.015 270); --foreground: oklch(0.985 0 0); }\n\n<!-- 컴포넌트 코드는 모드 분기 없이 동일 -->\n<div class=\"bg-background text-foreground\">...</div>",
      },
      {
        title: "Good vs bad",
        body: [
          "Good: `action.primary`처럼 의미상 다크 모드에서 다르게 동작해야 하는 토큰은 실제로 다르게 정의합니다 — 라이트에서는 brand violet + 흰 텍스트, 다크에서는 거의 흰 fill + 거의 검은 텍스트로 반전되어 다크 캔버스에서도 최대 대비를 유지합니다. Bad: 이런 예외 없이 모든 토큰이 단순 명암 반전만 한다고 가정하고 새 컴포넌트를 만드는 것 — `action.primary`를 쓰는 primary 버튼은 그 가정이 깨집니다.",
          "Good: 새 화면을 다크 모드로 렌더링해 \"밝은 화면의 색만 반전된 것\"처럼 보이는지 실제로 확인합니다. Bad: 라이트 모드에서만 디자인하고 다크는 자동으로 맞겠거니 가정하는 것 — border, muted text, hover surface, focus ring이 각각 별도로 검증되어야 합니다.",
        ],
      },
      {
        title: "Light / dark",
        body: [
          "이 문서 자체가 다크 모드 동작을 다루므로, 핵심 요지는: 표면/텍스트/보더 대부분은 대칭 반전(`gray.1` ↔ `gray.12` 등)이고, `action.primary`(그리고 이를 사용하는 컴포넌트)는 의도적 비대칭 반전이라는 점입니다. `action.secondary`도 라이트에서 `askewly.orchid`, 다크에서 `askewly.mint`로 색상 자체가 바뀌는 비대칭 사례입니다.",
        ],
      },
      {
        title: "Implementation notes",
        body: [
          "다크 모드는 `.dark` class 하나로 토글됩니다 — `scripts/generate-tokens.mjs`가 `tokens/askewly.tokens.json`의 `$extensions['com.askewly.modes'].dark` 값들을 모아 `.dark { ... }` 블록으로 생성합니다. 이 생성된 블록을 손으로 고치지 않고, 소스 토큰을 고칩니다.",
          "다크 모드 전용 컴포넌트 분기(`if (isDark) ...`)는 필요하지 않습니다 — 모든 반전은 CSS custom property 레벨에서 해결되므로, 컴포넌트는 항상 semantic Tailwind utility만 참조하면 됩니다.",
        ],
      },
      {
        title: "Agent constraints",
        body: [
          "다크 모드를 \"모든 색의 명암을 뒤집는 필터\"로 취급하지 않습니다 — `action.primary`/`action.secondary`처럼 색상 자체가 바뀌는 토큰이 있다는 것을 전제로 화면을 검증합니다.",
          "새 semantic 토큰을 추가할 때 다크 override를 빠뜨리지 않습니다 — 라이트 값만 정의하고 다크 값을 비워두면 다크 모드에서 라이트 값이 그대로 새어 나옵니다.",
          "화면을 완성으로 보고하기 전에 `.dark` class를 적용한 스크린샷/렌더로 실제 확인합니다 — 라이트 모드에서만 보고 다크는 \"토큰이 알아서 처리하겠지\"라고 가정하지 않습니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: [...FOUNDATION_SECTION_TITLES],
  }],
  [navFilter("docs-foundations-tokens"), {
    filter: navFilter("docs-foundations-tokens"),
    kind: "foundation",
    breadcrumb: "UI Blocks / Docs",
    title: "Tokens",
    lead: "Askewly Design의 모든 디자인 값은 하나의 SSOT 파일 `tokens/askewly.tokens.json`에서 시작합니다. 이 문서는 그 파일의 3-tier 구조, 참조 방향 규칙, 그리고 CSS로 생성되는 파이프라인을 설명합니다.",
    sections: [
      {
        title: "Tokens",
        body: [
          "구조는 3-tier입니다: primitive(원시값) → semantic(역할) → component(최소 override). 현재 SSOT에 실제로 존재하는 tier는 color 뿐입니다 — `color.primitive`, `color.semantic`, `color.component`. dimension(`space`, `radius`)과 typography(`font`, `scale`, `weight`)는 tier 구분 없이 바로 값을 정의하는 flat 구조입니다.",
          "color tier 예시: primitive는 `color.primitive.gray.1`–`12`, `askewly.violet` 같은 원시값만 가집니다. semantic은 `color.semantic.surface.base`처럼 역할 이름으로 primitive를 참조합니다. component는 `color.component.button.bg`처럼 semantic을 다시 참조하는 얇은 override tier입니다.",
        ],
        code: "// tokens/askewly.tokens.json 구조\ncolor.primitive.gray.1        (원시값, 참조 없음)\ncolor.semantic.surface.base   -> color.primitive.gray.1\ncolor.component.button.bg     -> color.semantic.action.primary\n\n// dimension/typography는 tier 없이 flat\ndimension.space.4   = 16px\ndimension.radius.lg = 8px\ntypography.scale.base = 16px",
      },
      {
        title: "Usage examples",
        body: [
          "화면 코드는 이 JSON을 직접 import하지 않습니다 — `scripts/generate-tokens.mjs`가 `tokens/askewly.tokens.json`을 읽어 `examples/ui-vocabulary-site/src/tokens.css`(CSS custom property + `.dark` 블록)를 생성하고, 이 파일이 Tailwind v4 `@theme`에 바인딩되어 `bg-card`, `text-foreground`, `rounded-lg` 같은 utility class로 노출됩니다.",
          "새 토큰이 필요하면 순서는 항상 같습니다: `tokens/askewly.tokens.json`을 수정 → `node scripts/generate-tokens.mjs` 실행 → 생성된 `tokens.css`가 갱신 → Tailwind utility가 자동으로 새 값을 반영.",
        ],
        code: "// 새 semantic 토큰 추가 흐름\n1. tokens/askewly.tokens.json 에 color.semantic.surface.new 추가\n2. node scripts/generate-tokens.mjs 실행\n3. src/tokens.css 에 --new 커스텀 프로퍼티 생성 확인\n4. Tailwind theme 매핑 후 bg-new 같은 utility 사용",
      },
      {
        title: "Good vs bad",
        body: [
          "Good: 항상 `tokens/askewly.tokens.json`을 수정하고 생성 스크립트를 다시 돌립니다. Bad: 생성된 `src/tokens.css`나 `.dark` 블록을 손으로 직접 고치는 것 — 다음 생성 실행에서 그 수정이 덮어써져 사라집니다.",
          "Good: component가 semantic 토큰만 참조하고, semantic 토큰이 primitive를 참조하는 한 방향 체인을 지킵니다. Bad: component 코드가 semantic을 건너뛰고 primitive(`color.primitive.gray.9` 등)를 직접 참조하는 것 — 3-tier 구조가 주는 재테마 가능성을 무력화합니다.",
          "Good: 기존 semantic 역할(`surface.*`, `text.*`, `action.*`, `accent.*`, `border.*`)로 새 요구를 표현할 수 있는지 먼저 확인합니다. Bad: 확인 없이 바로 새 semantic 토큰을 추가하는 것 — component tier가 \"의도적으로 얇게\" 유지되는 정책과 어긋납니다.",
        ],
      },
      {
        title: "Light / dark",
        body: [
          "다크 모드 값은 semantic tier에서만 `$extensions['com.askewly.modes'].dark`로 정의됩니다. primitive와 component tier는 다크 override 필드를 갖지 않습니다 — 다크 모드는 구조적으로 semantic tier의 책임입니다(자세한 반전 규칙은 Dark mode foundation 참조).",
        ],
      },
      {
        title: "Implementation notes",
        body: [
          "`tokens/askewly.tokens.json`의 최상단 `$description`은 이 파일이 \"Askewly Design token SSOT (DTCG-compatible, stable 2025.10 subset)\"이며, tier 규칙이 \"component -> semantic -> primitive, one direction only\"임을 명시합니다. 생성 산출물은 두 곳입니다: DESIGN.md frontmatter, `examples/ui-vocabulary-site/src/tokens.css`.",
          "현재 SSOT에는 motion(duration/easing) tier가 없습니다 — Motion foundation 문서가 이 gap과 그 대신 코드에 존재하는 관찰된 관례를 별도로 다룹니다.",
        ],
      },
      {
        title: "Agent constraints",
        body: [
          "생성된 파일(`src/tokens.css`, `.dark` 블록, DESIGN.md frontmatter의 토큰 섹션)을 직접 편집하지 않습니다 — 항상 `tokens/askewly.tokens.json`을 고치고 생성 스크립트를 다시 실행합니다.",
          "참조 방향을 거스르지 않습니다 — component가 primitive를 직접 참조하거나, semantic이 component를 참조하는 코드를 만들지 않습니다.",
          "SSOT에 없는 tier(motion duration/easing, line-height, letter-spacing 등)를 있는 것처럼 참조하지 않습니다 — 필요하면 gap으로 보고합니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: [...FOUNDATION_SECTION_TITLES],
  }],
  [navFilter("docs-agent-recipes"), {
    filter: navFilter("docs-agent-recipes"),
    kind: "agent-recipe",
    breadcrumb: "UI Blocks / Docs",
    title: "Agent Recipes",
    lead: "Codex/Claude Code 같은 코딩 에이전트가 UI Dictionary를 근거로 화면을 만들 때 참고하는 레시피 표면입니다. llms.txt 실자산과 사람이 읽는 레시피/검증 체크리스트를 연결합니다.",
    sections: [
      {
        title: "What are Agent Recipes",
        body: [
          "레시피는 Codex/Claude Code 같은 코딩 에이전트가 특정 UI 블록(버튼, 팝오버, 커맨드 검색, 랜딩 히어로, 쇼케이스 카드)을 구현할 때 참고하는 구조화된 마크다운 문서입니다. 각 레시피는 `recipes/<pattern_group>/<id>.md` 경로에 있고, frontmatter(id, pattern_group, tokens_used, code_asset 등)와 8개 고정 섹션(Intent, Anatomy, States, Variants, Code, Checks, Anti-patterns, Agent notes)으로 구성됩니다. 형식 계약 전체는 `docs/design-system/recipe-format.md`가 정본입니다.",
          "소비 흐름은 3단계입니다: ① 에이전트가 https://ui.askewly.com/llms.txt 에 진입해 토큰·택소노미·레시피 자산의 인덱스를 확인합니다. ② 필요한 레시피 파일과 `tokens/askewly.tokens.json`을 로드해 frontmatter의 `tokens_used`(semantic/component 경로만)와 본문의 Anatomy/States/Checks/Anti-patterns를 읽습니다. ③ 그 결과로 나온 화면 코드는 색상 hex/px 리터럴을 하나도 포함하지 않고, semantic 또는 component 토큰 클래스(`bg-card`, `text-foreground` 등)만 참조합니다.",
          "llms.txt는 손으로 쓰지 않습니다 — `scripts/generate-llms-txt.mjs`가 tokens/taxonomy/contracts/recipes 네 섹션을 실존 파일에서 생성합니다. 이 표면은 그 생성 자산을 사람이 읽는 형태로 안내만 합니다.",
        ],
      },
      {
        title: "Recipe list",
        body: [
          "현재 레시피는 5종이며, 각각 하나의 `pattern_group`(10종 고정 어휘 중 하나)에 속합니다.",
          "- **Button** (`forms`) — 단일·즉시 액션을 트리거하는 버튼. primary/secondary/destructive/ghost/link 5개 variant와 고정 radius/height 스케일을 규정합니다.",
          "- **Topbar Command Search** (`navigation`) — 토글되는 아이콘이 전체 너비 검색 입력창으로 확장되고 그 아래 실시간 제안 팝오버가 뜨는 topbar 블록. 커맨드 팔레트보다 가벼운 진입점입니다.",
          "- **Popover** (`overlays`) — 트리거에 고정된 작은 플로팅 패널. dialog보다 가볍고 tooltip보다 상호작용성이 큰 콘텐츠(폼 필드, 짧은 설정 블록)에 씁니다. 다른 레시피(Topbar Command Search 등)가 조립해 쓰는 합성 원자입니다.",
          "- **Showcase Card** (`application-ui`) — 헤더(아이콘·제목·한 줄 설명) 아래 실제 인터랙션 데모가 실행되는 shell. 홈 쇼케이스 아틀라스 카드 전부가 이 계약을 따릅니다.",
          "- **Landing Hero** (`marketing`) — 공개 홈페이지의 첫 뷰포트 블록. 중앙 정렬 제목·부제·CTA 2개·단일 proof surface(검색창 등)로 구성되고 split hero/블롭 배경을 금지합니다.",
        ],
      },
      {
        title: "llms.txt asset",
        body: [
          "에이전트가 바로 읽을 수 있는 자산은 https://ui.askewly.com/llms.txt 입니다. 이 페이지는 그 자산을 사람이 읽는 형태로 안내하는 표면입니다. 아래 링크는 llms.txt에 실제로 나열된 것과 동일하며, 전부 실존 자산으로 검증되어 있습니다(2026-07-10 확인).",
          "**Tokens** — [tokens/askewly.tokens.json](https://ui.askewly.com/llms/tokens/askewly.tokens.json): 3-tier 디자인 토큰(primitive/semantic/component), 모든 색상·치수·타이포그래피의 단일 출처.",
          "**Taxonomy** — [pattern-taxonomy.md](https://ui.askewly.com/llms/docs/design-system/pattern-taxonomy.md): 7 surfaces × 10 pattern groups × 57 groups 분류 정본. [groups.yml](https://ui.askewly.com/llms/docs/ui-vocabulary/groups.yml): 각 용어가 참조하는 group 축 데이터.",
          "**Contracts** — [recipe-format.md](https://ui.askewly.com/llms/docs/design-system/recipe-format.md): 레시피 포맷 계약(intent/anatomy/tokens/states/checks/anti-patterns). [agent-asset-model.md](https://ui.askewly.com/llms/docs/design-system/agent-asset-model.md): 에이전트가 토큰·택소노미·레시피를 소비하는 방법.",
          "**Recipes** — [button](https://ui.askewly.com/llms/recipes/forms/button.md), [topbar-command-search](https://ui.askewly.com/llms/recipes/navigation/topbar-command-search.md), [popover](https://ui.askewly.com/llms/recipes/overlays/popover.md), [showcase-card](https://ui.askewly.com/llms/recipes/application-ui/showcase-card.md), [landing-hero](https://ui.askewly.com/llms/recipes/marketing/landing-hero.md).",
        ],
      },
      {
        title: "Verification checklist",
        body: [
          "레시피를 소비해 나온 구현물을 판정하는 기준입니다 (`docs/design-system/recipe-format.md`의 검증 계약 + `scripts/validate-recipes.py`에서 파생).",
          "- **색 리터럴 0**: 코드에 hex/rgb 색상 하드코딩이 없어야 합니다. 색은 항상 `tokens_used`에 적힌 semantic/component 토큰 경로를 통해서만 표현합니다.",
          "- **토큰 참조 방향 준수**: `color.primitive.*`를 컴포넌트 코드가 직접 참조하지 않습니다 — semantic 또는 component tier만 참조합니다 (Tokens foundation 문서 참조).",
          "- **라이트/다크 모드 확인**: 구현 결과를 `.dark` class 적용 상태로도 렌더해 확인합니다. 다크 모드는 semantic tier의 override로만 반전되므로, 컴포넌트 코드에 다크 전용 분기를 추가하지 않습니다.",
          "- **`code_asset` 경로 정합**: 레시피 frontmatter의 `code_asset`이 가리키는 실제 파일을 확인하고, 레시피 본문의 `Code` 섹션은 발췌일 뿐 그 파일이 코드 SSOT임을 전제로 합니다.",
          "- **Checks/Anti-patterns 반영**: 각 레시피의 `Checks` 섹션 항목을 통과하고, `Anti-patterns` 섹션에 나열된 실수(예: Button의 pill radius, Landing Hero의 split hero)를 재현하지 않았는지 확인합니다.",
        ],
      },
    ],
    apiRows: [],
    onThisPage: ["What are Agent Recipes", "Recipe list", "llms.txt asset", "Verification checklist"],
  }],
])
