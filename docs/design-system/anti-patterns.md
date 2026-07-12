# Anti-Pattern Guide — 에이전트용 통합 안티패턴 체크리스트

Date: 2026-07-12
Milestone: SD (plan: `docs/plans/2026-07-12-sd-surface-depth.md`, Step 5)
지위: `recipes/*/*.md`의 `Anti-patterns` 섹션 35건을 증류한 2차 자산. `docs/design-system/principles.md`(1차, 8개 원칙)를 대체하지 않으며 중복 서술하지 않는다 — principles.md가 더 일반적인 원칙이고, 이 문서는 recipe corpus에서 반복 관찰된 더 구체적인 실패 패턴을 다룬다. 두 문서가 충돌하면 principles.md가 이긴다.

Audience: Codex, Claude Code 등 코드를 생성하는 에이전트. 사람이 읽어도 되지만 1차 대상은 아니다.

## 사용법

각 클러스터는 4부로 구성된다: **원칙**(한 줄 규칙) → **왜**(근거) → **위반 예**(recipe 포인터 — 본문 사례 복붙 금지, 링크만) → **에이전트 지시형 문구**(프롬프트에 그대로 붙여 쓸 수 있는 명령형 문장). 구현 전·리뷰 시 체크리스트로 순회한다.

---

## 1. 금액·총액 정직성

**원칙**: 화면에 보이는 금액·총액·비용은 항상 최신 상태여야 하며, 확정 이전 단계에서 숨기거나 나중에만 드러내면 안 된다.

**왜**: 커머스 흐름에서 "확정 직전 서프라이즈 비용"은 이탈과 신뢰 붕괴의 1순위 원인이다. 여러 recipe가 독립적으로 이 실패를 반복 지적한다.

**위반 예**:
- `recipes/commerce/cart-drawer.md` (Anti-patterns: 숨겨진 수수료, stale subtotal)
- `recipes/commerce/checkout-order-summary.md` (Anti-patterns: surprise total, detached summary)
- `recipes/commerce/shipping-method-selector.md` (Anti-patterns: cost revealed only at confirmation)
- `recipes/commerce/product-detail-purchase-stack.md` (Anti-patterns: total revealed only after Add to cart)

**에이전트 지시형 문구**: "가격/수량/배송비가 바뀌는 모든 지점에서 표시된 총액을 같은 렌더에서 재계산하라. 확정 단계 전까지 비용을 숨기거나 '다음 단계에서 계산' 상태로 남기지 마라."

---

## 2. 파괴적 동작 보호

**원칙**: 되돌리기 어렵거나 광범위한 영향을 주는 동작(삭제, 권한 회수, 대량 작업)은 일반 동작과 시각적으로 구분하고, 즉시 반영 전에 검토 기회를 준다.

**왜**: 스타일 구분이 없으면 실수 클릭이 취소 불가능한 손실로 이어진다. 데이터 테이블·권한·커머스·오버레이 recipe 4종이 각각 다른 표면에서 같은 실패를 지적한다.

**위반 예**:
- `recipes/data-display/bulk-action-toolbar-selection-model.md` (Anti-patterns: undifferentiated destructive action)
- `recipes/data-display/permission-matrix-editor-grid.md` (Anti-patterns: 체크박스마다 즉시 auto-save)
- `recipes/overlays/action-sheet-destructive-confirmation.md` (Anti-patterns: destructive row가 강조 스타일처럼 보임)

**에이전트 지시형 문구**: "삭제/회수/대량 변경 동작은 다른 동작과 다른 색·배치로 구분하라. 라이브 상태에 영향을 주는 변경은 체크박스 하나하나가 아니라 배치 단위로 검토 후 커밋하게 하라."

---

## 3. 접근 가능한 상호작용 경로 보장

**원칙**: 포인터·제스처(스와이프, 드래그, hover)만으로 도달 가능한 동작을 만들지 말고, 키보드·탭 대체 경로를 항상 제공한다. 시각적 순서(CSS order 등)가 DOM/포커스 순서와 어긋나서도 안 된다.

**왜**: 이 실패가 corpus에서 가장 많이 반복된다 — command search, popover, 스와이프 행, 탭 바, pull-to-refresh, bottom sheet, 문서 헤더 등 표면을 가리지 않는다.

**위반 예**:
- `recipes/navigation/topbar-command-search.md` (Anti-patterns: 마우스 전용 행, autofocus 탈취, outside-click만 처리)
- `recipes/data-display/swipe-action-row-pattern.md` (Anti-patterns: 스와이프가 유일한 경로)
- `recipes/overlays/popover.md` (Anti-patterns: dismiss 후 focus 미복귀)
- `recipes/layout/responsive-content-grid.md` (Anti-patterns: CSS order로 시각 재정렬 → 리더 순서와 불일치)
- `recipes/forms/mobile-signup-field-stack.md` (Anti-patterns: 스와이프 전용 필드 이동, 44px 미만 터치 타깃)
- `recipes/data-display/pull-to-refresh-list-pattern.md` (Anti-patterns: 취소 경로 없음, 임계값 이전 발동)

**에이전트 지시형 문구**: "모든 인터랙션에 키보드 경로(Tab/Enter/화살표)와 명시적 탭 대체 수단을 구현하라. 포커스 이동(autofocus, 닫힐 때 focus 복귀)을 명시적으로 처리하라. 시각적 순서를 DOM 순서와 분리하지 마라."

---

## 4. 상태 신호는 색상·아이콘 단독 금지

**원칙**: 성공/실패, 추세, 활성 상태, 긴급도 같은 의미를 색상이나 아이콘만으로 전달하지 않는다. 항상 텍스트/라벨을 병행한다.

**왜**: 색맹·저시력 사용자와 스크린리더 사용자가 배제된다. 피드백·데이터·오버레이·레이아웃 recipe에서 반복 관찰된다.

**위반 예**:
- `recipes/feedback/actionable-toast.md` (Anti-patterns: color-only outcome)
- `recipes/data-display/stat-summary-grid.md` (Anti-patterns: color-only trend)
- `recipes/commerce/promo-banner-system.md` (Anti-patterns: 순수 시각 카운트다운, 텍스트 대체 없음)

**에이전트 지시형 문구**: "상태·추세·긴급도를 표현할 때 색상만 쓰지 말고 텍스트 라벨(단어, 숫자, aria-label)을 함께 렌더링하라."

---

## 5. 빈 상태·영 결과는 원인별로 구분

**원칙**: "아직 데이터 없음", "필터 결과 0건", "권한 없음", "에러"는 서로 다른 원인이며 같은 제네릭 메시지로 뭉뚱그리지 않는다. 각 경우 회복 동작(초기화, 재시도, 안내)을 제공한다.

**왜**: 원인을 구분하지 않으면 사용자가 자기 행동(필터)이 문제인지 시스템(데이터 없음)이 문제인지 알 수 없다. 커머스·데이터·피드백·내비게이션 recipe 5건이 반복 지적한다.

**위반 예**:
- `recipes/feedback/recoverable-empty-state.md` (Anti-patterns: 하나의 제네릭 일러스트, dead-end apology)
- `recipes/data-display/audit-log-filterable-export-feed.md` (Anti-patterns: "no events" vs "no matching filter" 미구분)
- `recipes/commerce/category-product-grid.md` (Anti-patterns: dead-end empty state, 리셋 동작 없음)

**에이전트 지시형 문구**: "빈 상태를 렌더링하기 전에 원인(최초 사용/필터 결과 0/권한 없음/에러)을 구분하고, 각각 다른 메시지와 회복 동작(필터 초기화, 재시도, 다음 단계 안내)을 붙여라."

---

## 6. 파생 상태는 단일 출처에서 계산

**원칙**: 같은 정보(선택 개수, 활성 버전, 총액, 페이지 번호)를 UI 두 곳에서 각자 들고 있지 않는다. 한쪽이 갱신되면 다른 쪽도 같은 소스에서 파생되어야 한다.

**왜**: 상태를 복제하면 한쪽만 갱신되는 드리프트가 생긴다 — 문서 버전 스위처, 대량 작업 툴바, 변경 로그 페이지네이션에서 독립적으로 관찰됐다.

**위반 예**:
- `recipes/navigation/versioned-docs-switcher-navbar-sidebar-swap.md` (Anti-patterns: 드롭다운과 사이드바 트리가 다른 버전을 가리킴)
- `recipes/data-display/bulk-action-toolbar-selection-model.md` (Anti-patterns: 선택 상태를 툴바 내부에 별도 보관)
- `recipes/docs/docs-changelog-category-filter-page.md` (Anti-patterns: 필터 변경 시 페이지 번호가 리셋되지 않음)

**에이전트 지시형 문구**: "선택/버전/필터/총액 같은 값은 단일 상태에서 읽어라. 화면 두 곳에 같은 값을 별도로 저장하지 말고, 한 값이 바뀌면 파생되는 모든 표시가 같은 렌더에서 갱신되게 하라."

---

## 7. 토큰 시스템 우회 금지

**원칙**: 시스템 토큰(`DESIGN.md`/`tokens/askewly.tokens.json`)에 없는 시각 효과(풀필 radius, 헤비 섀도우, 그라디언트, 장식용 블롭 배경)를 "AI가 흔히 쓰는 기본값"이라는 이유로 하드코딩하지 않는다.

**왜**: 토큰이 있어도 에이전트가 "이 정도는 흔하니까"라는 이유로 시스템 밖 값을 임의로 선택하는 실패가 버튼·히어로 두 recipe에서 구체적으로 지적된다. `principles.md` #3(토큰 단일 출처)의 더 일반적인 원칙을 구체적인 실패 형태로 좁힌 것이다.

**위반 예**:
- `recipes/forms/button.md` (Anti-patterns: 오버사이즈 풀필, 헤비 드롭섀도우, 그라디언트 채움)
- `recipes/marketing/landing-hero.md` (Anti-patterns: split hero, 장식용 blob/orb 배경, 퍼플 지배 배경)

**에이전트 지시형 문구**: "radius/shadow/gradient/배경 장식을 추가하기 전에 `DESIGN.md`에 그 값이 실제로 정의돼 있는지 확인하라. 정의되지 않은 값이면 '흔히 보이는 스타일'이라는 이유로 추가하지 마라."

---

## 8. 컴포넌트 계약 혼용 금지

**원칙**: 표면적으로 비슷해 보이는 두 컴포넌트(popover/dialog, tab bar/segmented tabs, action sheet/alert, promo banner/trust strip)를 서로의 역할로 대체하지 않는다. 각 recipe는 고유한 사용 조건을 가진다.

**왜**: "이미 배선되어 있으니까" 재사용하면 컴포넌트가 원래 보장하던 계약(모달 여부, 단일/다중 선택, 위험도)이 깨진다. 8개 recipe에서 독립적으로 관찰된, corpus에서 가장 폭넓게 반복되는 실패 유형이다.

**위반 예**:
- `recipes/overlays/popover.md` (Anti-patterns: dialog가 필요한 콘텐츠를 popover에 욱여넣음)
- `recipes/overlays/bottom-sheet-detents.md` (Anti-patterns: standard 변형에 scrim을 추가해 사실상 모달로 만듦)
- `recipes/commerce/promo-banner-system.md` (Anti-patterns: trust strip 역할과 혼동)
- `recipes/navigation/bottom-tab-bar.md` (Anti-patterns: 목적지 전환이 아닌 뷰 모드 전환에 사용)
- `recipes/navigation/large-title-collapsing-header.md` (Anti-patterns: 뒤로가기 버튼을 시트 dismiss와 혼동)

**에이전트 지시형 문구**: "컴포넌트를 고를 때 '이미 있는 것과 비슷해서' 대신 해당 recipe의 Intent/Anti-patterns를 먼저 확인하라. 모달 여부, 선택 개수, 위험도가 다르면 다른 recipe를 써라."

---

## 9. 구조화된 데이터 평탄화 금지

**원칙**: 그룹, 계층, 중첩 구조를 가진 데이터(권한 상속, 중첩 파라미터, 필터 조건 그룹, 카드 내부 구성)를 평평한 리스트나 반복된 카드 프레임으로 뭉개지 않는다.

**왜**: 구조를 평탄화하면 사용자가 관계(부모-자식, 상속-명시적, AND-OR)를 잃는다. 폼·문서·데이터·레이아웃·쇼케이스 recipe 6건이 각기 다른 표면에서 지적한다.

**위반 예**:
- `recipes/forms/advanced-filter-builder-condition-groups.md` (Anti-patterns: flat conditions with no grouping, exposed query string)
- `recipes/docs/api-reference-three-column-layout.md` (Anti-patterns: flattened nested params)
- `recipes/data-display/permission-matrix-editor-grid.md` (Anti-patterns: 상속된 권한과 명시적 권한을 동일하게 렌더링)
- `recipes/application-ui/showcase-card.md` (Anti-patterns: 카드 안에 카드를 중첩)
- `recipes/navigation/doc-search-cmdk-grouped-results-panel.md` (Anti-patterns: 섹션 라벨을 그룹 컴포넌트 없이 평범한 텍스트로만 렌더링)

**에이전트 지시형 문구**: "데이터에 그룹/중첩/상속 관계가 있으면 UI에서도 그 관계를 유지하라. 평평한 리스트로 옮기거나, 이미 구조를 가진 하위 컴포넌트를 인라인으로 재구현하지 마라."

---

## 10. 레이아웃·스크롤 메커니즘 충돌 방지

**원칙**: sticky, overflow, 반응형 컬럼 수 같은 레이아웃 메커니즘은 브레이크포인트·콘텐츠 변화와 함께 명시적으로 관리한다. 스크롤 컨테이너가 이중으로 생기거나, 로딩과 실제 콘텐츠의 레이아웃이 어긋나서는 안 된다.

**왜**: 목업 단계에서는 안 보이던 실패가 실데이터·좁은 화면에서 드러난다. 문서·커머스·데이터·레이아웃 recipe에서 5회 이상 반복된다.

**위반 예**:
- `recipes/docs/api-reference-three-column-layout.md` (Anti-patterns: 모바일에서 sticky 컬럼이 스크롤을 가로챔)
- `recipes/commerce/category-product-grid.md` (Anti-patterns: 스켈레톤과 실 콘텐츠의 컬럼 수 불일치로 reflow)
- `recipes/layout/sidebar-application-shell.md` (Anti-patterns: 본문과 사이드바가 독립적으로 스크롤)
- `recipes/docs/docs-code-block-with-tabs-and-copy.md` (Anti-patterns: 코드 블록이 전체 페이지를 가로 스크롤시킴)

**에이전트 지시형 문구**: "sticky/overflow를 추가하기 전에 좁은 뷰포트에서의 동작을 확인하라. 로딩 스켈레톤은 실제 콘텐츠와 같은 컬럼 수/구조를 가져야 한다. 가로 스크롤은 원인이 되는 요소에만 국한하라(`overflow-x-auto`를 그 요소에만)."

---

## 11. 부분 완료를 완료로 제시하지 않는다

**원칙**: 요청-응답 중 절반만 보여주거나, 여러 실패 중 집계 숫자만 보여주거나, 액션에 대한 피드백이 없는 상태를 "완료된 기능"처럼 내놓지 않는다.

**왜**: 절반만 구현된 계약은 겉보기에 동작하는 것처럼 보이지만 사용자가 다음 행동을 판단할 정보가 없다. 문서·폼 recipe에서 반복된다.

**위반 예**:
- `recipes/docs/api-reference-three-column-layout.md` (Anti-patterns: request sample만 있고 response sample이 없음)
- `recipes/docs/docs-code-block-with-tabs-and-copy.md` (Anti-patterns: 복사 버튼 클릭 후 확인 피드백 없음)
- `recipes/forms/data-import-wizard-validation-preview-steps.md` (Anti-patterns: "12 rows failed" 집계만 표시, 행별 상세 없음)
- `recipes/docs/article-documentation-layout.md` (Anti-patterns: 내부 계획 메모 언어가 공개 문서로 그대로 노출)

**에이전트 지시형 문구**: "요청/응답, 성공/실패, 입력/피드백처럼 쌍을 이루는 정보는 한쪽만 만들지 마라. 집계 수치를 보여줄 땐 항목별 상세로 내려갈 수 있는 경로도 함께 만들어라."

---

## 12. 과제 없는 기능·카드 전체 노출 금지

**원칙**: 사용자의 실제 작업과 연결되지 않는 기능(필터, 밀도 조절, 페이지네이션, 대량 작업)을 기본값으로 전부 켜두거나, 비교가 필요한 숫자들을 개별 무거운 카드로 흩어놓지 않는다.

**왜**: 기능이 많을수록 좋아 보이지만, 과제와 무관한 옵션은 스캔 비용만 늘리고 비교를 방해한다. 데이터 테이블·통계 카드 recipe에서 지적된다.

**위반 예**:
- `recipes/data-display/interactive-data-table.md` (Anti-patterns: filters/density/pagination/bulk actions를 과제 없이 전부 활성화)
- `recipes/data-display/stat-summary-grid.md` (Anti-patterns: 모든 수치가 각각 무거운 독립 카드에 들어가 비교가 약해짐)

**에이전트 지시형 문구**: "테이블/그리드에 기능을 추가하기 전에 이 화면의 사용자 작업이 그 기능을 요구하는지 확인하라. 비교가 목적인 숫자들은 하나의 낮은-임프레션 그리드로 묶고, 개별 무거운 카드로 쪼개지 마라."

---

## Changelog

- 2026-07-12: 초판. `recipes/*/*.md` 35건의 Anti-patterns 섹션을 12개 클러스터로 증류 (SD Step 5).
