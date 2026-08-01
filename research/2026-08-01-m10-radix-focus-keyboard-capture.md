# M10 캡처 — 포커스·키보드 규율 (Radix Primitives)

Date: 2026-08-01 (접근일 동일)
Milestone: M10 · Radix 흡수 (plan: `plans/2026-08-01-m10-radix-focus-keyboard-absorption.md`)
소비처: `docs/research/loop/inbox.yml` batch `20260801-focus-keyboard` → `knowledge/focus-keyboard.md` + terms 보강
지위: 근거 동결 문서. 판정 규칙 정본은 `knowledge/focus-keyboard.md`.

## 소스 (실브라우저, 접근일 2026-08-01)

| # | 문서 | URL |
|---|---|---|
| S1 | Radix Primitives — Introduction | https://www.radix-ui.com/primitives/docs/overview/introduction |
| S2 | Radix Primitives — Accessibility | https://www.radix-ui.com/primitives/docs/overview/accessibility |
| S3 | Dialog (Features·Keyboard Interactions) | https://www.radix-ui.com/primitives/docs/components/dialog |
| S4 | Dropdown Menu (Features·Keyboard Interactions) | https://www.radix-ui.com/primitives/docs/components/dropdown-menu |
| S5 | Tabs (Keyboard Interactions) | https://www.radix-ui.com/primitives/docs/components/tabs |

캡처 방법 메모: 컴포넌트 페이지는 `get_page_text` 가 본문 추출에 실패(데모 헤비 구조) — 접근성 트리(read_page) + find 로 Features·Keyboard 표를 직접 추출했다.

## 관찰 — 원칙 층 (S1·S2)

- 준거 = **WAI-ARIA authoring practices**: 시맨틱(aria/role)만이 아니라 **행동**(포커스 관리·키보드 내비게이션)이 패턴별로 규정돼 있고, 네이티브 요소를 안 쓰면 그 행동 재구현이 개발자 책임이다.
- **라벨 없는 컨트롤은 미완성**: 커스텀 컨트롤은 accessible name/description 제공이 사용자 책임으로 남는다(프리미티브가 추상화는 제공).
- **포커스 이동 = 맥락 안내**: 상호작용으로 화면이 바뀌면 다음 tab stop 이 논리적이도록 포커스를 옮긴다 — 스크린리더에겐 이 이동이 곧 알림이다. 예: AlertDialog 열리면 포커스가 Cancel 버튼으로(응답을 예비).

## 관찰 — 컴포넌트 계약 (S3~S5)

- **Dialog**: modal 이면 포커스 자동 트랩 · Esc 는 닫고 **포커스를 트리거로 반환** · Title/Description 으로 스크린리더 공지 관리 · modal/non-modal 모드 분리.
- **Dropdown Menu**: "Focus is fully managed" — Space/Enter/ArrowDown 으로 열면 첫 항목에 포커스 · Arrow 로 항목 순회 · ArrowLeft/Right 는 읽기 방향 기준 서브메뉴 개폐 · **typeahead**(타이핑으로 항목 점프) · Esc = 닫기 + 트리거 포커스 반환 · dismiss·레이어링 동작이 계약으로 정의됨.
- **Tabs**: **roving tabindex** — Tab 키는 목록 안을 순회하지 않고 활성 트리거에 들어왔다가 다음 Tab 에 콘텐츠로 빠져나감 · Arrow 가 목록 내 이동(+orientation 기준) · Home/End 지원 · 이동 즉시 활성화(automatic activation).

## knowledge 결정표 재료

| 축 | 규칙 후보 |
|---|---|
| 준거 | 커스텀 위젯 행동의 정답은 WAI-ARIA APG — 발명하지 않는다 |
| 트랩·반환 | 모달 = 트랩 + Esc/닫기 시 트리거로 포커스 반환(반환 없는 트랩은 미완성) |
| 복합 위젯 | Tab 은 위젯 단위 진출입, 내부 순회는 Arrow(roving tabindex) + Home/End |
| 열림 직후 | 포커스는 첫 논리 항목으로(메뉴=첫 항목, 경고=안전한 버튼) |
| 타이핑 | 항목 목록엔 typeahead |
| 라벨 | 모든 커스텀 컨트롤에 accessible name — 시각 라벨이 없으면 aria-label |
| dismiss | Esc·외부 클릭·트리거 재클릭의 계층적 dismiss 를 계약으로 명시 |

## 비이식

Radix 패키지 구조·asChild API·기본 비주얼(Do-not-copy: 프리미티브를 브랜드로 출하하지 않는다 — exemplar 표 그대로).
