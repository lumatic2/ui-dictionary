# Focus & Keyboard — 포커스·키보드 규율 판정 규칙

Date: 2026-08-01
Milestone: M10 (plan: `plans/2026-08-01-m10-radix-focus-keyboard-absorption.md`)
지위: 커스텀 위젯·오버레이의 포커스·키보드 행동 판정 정본. 근거 원문은 `research/2026-08-01-m10-radix-focus-keyboard-capture.md` 에 동결(Radix Primitives, 접근 2026-08-01). 어떤 오버레이 **컨테이너를 고를지**는 [[mobile-navigation]] 소관, 이 문서는 고른 뒤의 **행동 계약**만 담는다. 포커스 링의 시각 규격은 terms(`focus-ring`), 감사 함정(programmatic focus 오탐)은 kg 노드 `focus-visible-audit-real-tab-key` 참조.

Audience: 에이전트(커스텀 위젯·오버레이 생성 시 필수 참조) + 사람.

## 0. 대원칙 — 정답은 WAI-ARIA APG, 발명하지 않는다

네이티브 요소를 div 로 대체하는 순간 시맨틱(role·aria)과 **행동**(키보드·포커스) 재구현이 전부 우리 책임이 된다. 각 패턴의 행동 정답은 WAI-ARIA authoring practices 에 이미 있다 — 키보드 동작을 창작하지 말고 APG 패턴을 찾는다.

## 1. 모달 오버레이 계약 (트랩 + 반환)

1. modal 이면 **포커스 트랩** — Tab 순환이 내부에 갇힌다. non-modal(popover 등)엔 트랩을 걸지 않는다.
2. **닫힐 때 포커스는 연 트리거로 반환** — Esc·버튼·scrim 어느 해제 경로든 동일. 반환 없는 트랩은 미완성.
3. **열림 직후 첫 논리 항목에 포커스** — 메뉴 = 첫 항목, 파괴적 확인 = 안전한 버튼(Cancel), 폼 모달 = 첫 필드. 포커스 이동이 곧 스크린리더 공지 채널이다.
4. Title/Description 을 배선해 열림이 "무엇인지" 공지되게 한다.

## 2. 복합 위젯 계약 (roving tabindex)

탭 목록·메뉴·툴바·라디오 그룹 같은 복합 위젯은 **Tab stop 1개**다:
1. Tab 은 위젯에 들어왔다(활성 항목) 다음 Tab 에 밖으로 나간다 — 항목마다 Tab 을 먹으면 FAIL.
2. 내부 이동은 방향키(orientation 기준) + Home/End.
3. 항목 목록엔 **typeahead** — 타이핑으로 매칭 항목 점프.
4. 이동-활성화 결합(automatic activation)이 기본, 비용 큰 패널 전환만 Enter 분리(manual).

## 3. 해제(dismiss) 계층 계약

1. 오버레이 해제 경로는 **계약으로 명시**: Esc · 외부 클릭/scrim · 트리거 재활성. 셋의 동작이 예측 가능해야 한다.
2. 겹친 레이어의 Esc 는 **최상위 하나만** 닫는다 — 스택 순서 명시.
3. 모달 깊이·중첩 허용 예외는 [[mobile-navigation]] §4 를 따른다.

## 4. 라벨 계약

1. **이름 없는 커스텀 컨트롤 금지** — 시각 라벨이 있으면 연결(label/aria-labelledby), 없으면 aria-label. 프리미티브가 배선을 추상화해도 라벨 내용은 제품 책임이다.
2. 상태 변화로 화면이 바뀌면 포커스 이동 + 라벨로 새 맥락을 공지한다(라이브 리전 남발 대신 포커스 채널 우선).

## 판정 절차 (에이전트 의무)

1. 커스텀 위젯을 만들기 전에 APG 에 해당 패턴이 있는지 먼저 확인한다(§0) — 있으면 그 키보드 표가 스펙이다.
2. 모달을 만들면 §1 4항(트랩·반환·초기 포커스·공지) 전부 체크 — 하나라도 빠지면 미완성.
3. 항목형 위젯이면 §2 로 Tab stop 수를 센다 — 위젯당 1개.
4. 포커스 가시성 검증은 실키 Tab 으로 한다 — 프로그램적 focus() 는 :focus-visible 을 안 태워 오탐을 만든다(kg 실측).
5. Radix 등 프리미티브의 기본 비주얼은 흡수 대상이 아니다 — 행동 계약만 가져오고 look 은 토큰 소유.

## Changelog

- 2026-08-01: 초판 (M10) — Radix Primitives(Introduction·Accessibility·Dialog·DropdownMenu·Tabs) 실브라우저 캡처 기반.
