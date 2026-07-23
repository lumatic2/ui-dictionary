# ROADMAP

> Last updated: 2026-07-22
> Status: **`real-use-lap` active (2026-07-22 승인).** 우리가 만든 걸로 우리가 쓸 것을 만든다 — Askewly Design 소개 덱(PPTX). 새 기계를 만들지 않고 막히는 지점만 결함으로 기록해 milestone으로 삼는다. 직전 **6연속 horizon이 같은 종류의 기준(실사용·사람 관측)에서 미달**로 닫혔다. changeset 267~286 예약.
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="real-use-lap" status="active" -->
Goal: 실사용 한 바퀴 — Askewly Design으로 Askewly Design 소개 덱(PPTX)을 실제로 만들고, 막히는 지점만 결함으로 기록해 milestone으로 삼는다. Details: `plans/horizons/2026-07-real-use-lap.md`.

<!-- harness:goal-archive10 id="design-output-gates" status="completed" -->
Goal: 산출물이 좋은지 기계가 잰다, 매체마다 다른 자로. closed 2026-07-22 — DOG1~DOG6 완료, **DOG7(사람 관측) 보류**: 관측 1회 실시했으나 verify 위반 0건이라 오탐률 미측정·승격 판정 미획득. 게이트는 경고 유지. Details: `plans/horizons/2026-07-design-output-gates.md`.

<!-- harness:goal-archive9 id="vocabulary-in-use" status="completed" -->
Goal: askewly-design 호출 경로에 UI 용어 사전 562개를 집어넣고, 요구 한 문장에서 요소를 판정해 구현 자산까지 착지하는 흐름을 완성한다. closed 2026-07-21 — 7항 중 6 PASS · 1 미달(사람 관측: 조회 절차 미준수). Details: `plans/horizons/2026-07-vocabulary-in-use.md`.

<!-- harness:goal-archive8 id="editor-color-and-token-editing" status="completed" -->
Goal: 편집기에서 색이 색으로 보이고, 바꿔진다 — 인스펙터 UI·토큰 조회 API·검증 계층·렌더러 4표면. closed 2026-07-21 — 7항 중 6 PASS, 기준 6(판단 가능성) **부분 충족 명시**. Details: `plans/horizons/2026-07-editor-color-and-token-editing.md`.

<!-- harness:goal-archive7 id="editor-legibility" status="completed" -->
Goal: AskewlyDesign 편집기를 사람이 화면만 보고 판단할 수 있는 물건으로 만든다 — 조작감과 판독성 두 축. closed 2026-07-21 — 6항 중 5 PASS, 기준 6(판단 가능성) **미달 명시**. Details: `archive/horizons/2026-07-editor-legibility.md`.

<!-- harness:goal-archive6 id="template-production-hardening" status="completed" -->
Goal: 템플릿 제작 파이프라인을 선언 수준에서 실제 동작 수준으로 끌어올린다. closed 2026-07-20 — 닫는 기준 9항 중 8 PASS, 기준 7(실사용·편집기 축) **미달 명시**. Details: `archive/horizons/2026-07-template-production-hardening.md`.

<!-- harness:goal-archive5 id="template-production-system" status="completed" -->
Goal: 브리프·토큰·레시피를 명함·제품 포스터·인포그래픽의 편집 가능한 CanvasDocument와 브라우저 제작 루프로 바꾼다. Details: `plans/horizons/2026-07-template-production-system.md`.

<!-- harness:goal-archive4 id="recipe-code-reuse" status="completed" -->
Goal: 사이트 레시피 데모 실구현을 registry 코드 자산으로 배포하고, 에이전트 코드 출발 계약과 스튜디오 구성↔레시피 매핑을 배선한다. Details: `plans/horizons/2026-07-recipe-code-reuse.md`.

<!-- harness:goal-archive3 id="studio-finish" status="completed" -->
Goal: 스튜디오 이월 갭 3건 마감 — 데이터 주도 주입 자동화·구성 패턴 완편(4유형+예약형)·미리보기 고도화(다크·반응형). Details: `plans/horizons/2026-07-studio-finish.md`.


## Active Milestones — real-use-lap

<!-- harness:milestone id="RU1" status="completed" priority="P0" evidence="evidence/real-use-lap/ru1-deck-production.md" -->
### RU1 — 덱을 끝까지 만든다 (관측 장치)
- DoD: Askewly Design 소개 덱 PPTX가 존재하고 사용자가 쓸 수 있다고 판정하며, 발표 게이트(캔버스 프리셋 대조·본문 대비 AA)가 1회 이상 실제 실행되고, 제작 중 막힌 지점이 결함 장부에 전수 기록된다.
- Evidence: evidence/real-use-lap/ru1-deck-production.md
- Gap: 발표 게이트는 절차에 적혔을 뿐 실행 0회다 — 슬라이드 산출물이 0건이라 먹일 입력이 없었다. `validateSlideDeclaration`도 실사용 0회
- Scale: changesets>=3; surfaces: 브리프·DESIGN.md 저장·슬라이드 구성·PPTX 산출·발표 게이트; capability: 우리 절차로 실제 쓰는 산출물
- Plan: (RU1은 관측 장치 — 사전 step 분해 대신 막힌 지점을 기록해 RU2~n을 뽑는다)
- Status: [x]

- Completed at: 2026-07-22
- Summary: **미달로 닫음.** 덱 10장 제작·발표 게이트 첫 실행(프리셋 PASS·대비 7/7 PASS)·결함 10건 기록했으나 사용자 판정 "실제로 못 써 · 내가 원하는 제작 흐름도 아니다 · 문답이 훨씬 많았어야 했다 · Askewly Design 자체가 제대로 작동 안 하는 느낌". **기계가 통과시킨 산출물을 사람이 못 쓴다고 판정** — DOG7과 같은 구조의 재현. 최대 결함 D10: 규모 게이트가 "DESIGN.md 있으면 인터뷰 없음"으로 브리프를 건너뛰어 덱의 내용·청중·구성을 전부 에이전트가 추정했다(DESIGN.md는 룩을 소유하지 내용을 소유하지 않는다). RU2로 이월.

## 유지보수 후보 (milestone 아님)

> 이월 finding 전수 장부는 `docs/findings.md` (2026-07-20 수집 — A~F 6군). 아래는 이 horizon 밖 항목만.

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Active Milestones — vocabulary-in-use

<!-- harness:milestone id="VL7" status="completed" priority="P0" evidence="changesets/20260721-vl7-treatment-comparison" -->
### VL7 — 분리력 검증 (캘리브레이션)
- DoD: 같은 케이스 세트에서 기준선 대비 향상 폭이 군집별로 기록되고, 향상의 출처가 분해되며, 회귀 케이스가 0이거나 사유가 남는다.
- Evidence: changesets/20260721-vl7-treatment-comparison
- Gap: 축이 그럴듯해 보여도 실제 요구 문장에서 두 후보가 다 걸리면 판정이 안 갈린다
- Scale: changesets>=3; surfaces: 처치 측정·기준선 대조·축 보정; capability: 향상 폭이 수치로 증명된 판정
- Plan: plans/2026-07-21-vl7-separation-gate.md
- Status: [x]

- Completed at: 2026-07-21
- Summary: 84.4%→96.9%, 회귀 0 (changeset 241)
<!-- harness:milestone id="VL8" status="completed" priority="P1" evidence="evidence/vocabulary-in-use/vl8-observation.md, changesets/20260721-vl8-observation-verdict" -->
### VL8 — 사람 관측 게이트
- DoD: 사용자가 사전 설명 없이 요구 한 문장을 던져 판정·근거·구현까지 가는 과업 3건의 성공/실패와 막힌 지점이 발화 인용과 함께 기록된다.
- Evidence: evidence/vocabulary-in-use/vl8-observation.md
- Gap: 직전 horizon에서 probe 11건과 브라우저 계측이 전부 놓친 결함을 사람이 한 번 만져서 잡았다
- Scale: changesets>=2; surfaces: 관측 프로토콜·사용자 과업·발견 결함 마감; capability: 사람이 던진 문장이 구현으로 착지
- Plan: plans/2026-07-21-vl8-human-observation.md
- Status: [x]

- Completed at: 2026-07-21
- Summary: **미달로 닫음.** 과업 3건 중 1건만 수행·그 1건 실패 — 에이전트가 규정된 category 축 조회 대신 자기 키워드 grep 후 "사전 밖 개념"으로 단정했으나 실제로는 `장식·배경 효과` 그룹에 aurora-background 등 3건이 있었다. 사용자가 되물어 드러남. VL7의 96.9%는 후보가 이미 좁혀진 케이스라 이 결함을 구조상 못 잰다. 문서 추가로 닫히지 않아 `vocabulary-lookup-discipline` 후보 적재 (changeset 243, 보고서 docs/reports/2026-07-21-vl8-human-observation.md)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; template-production-system (TPS1–TPS5) closed 2026-07-19, recipe-code-reuse (RC1–RC4) closed 2026-07-19, skill-entry (SE1–SE2) closed 2026-07-18, design-brief (DB2) closed 2026-07-19, Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
