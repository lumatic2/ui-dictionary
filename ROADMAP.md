# ROADMAP

> Last updated: 2026-07-22
> Status: **`design-output-gates` active (2026-07-22 승인).** 후보 4+8 병합 — 산출물 검사기와 매체 확장을 하나의 마무리 절차에 함께 꽂는다. DOG1~DOG6 계획 완비(게이트 6/6 PASS), changeset 247~266 예약. 직전 두 horizon이 **연속으로 사람 관측 게이트에서 미달·부분**으로 닫혀, 이번 관측 설계는 "사람만 답할 수 있는가"로 과업을 걸렀다.
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="design-output-gates" status="active" -->
Goal: 산출물이 좋은지 기계가 잰다, 매체마다 다른 자로 — 색·타이포 검사기를 쓸 만하게 고쳐 실제로 부르고, 인쇄·슬라이드 근거를 에이전트 경로에 싣는다. Details: `plans/horizons/2026-07-design-output-gates.md`.

<!-- harness:goal-archive10 id="vocabulary-in-use" status="completed" -->
Goal: askewly-design 호출 경로에 UI 용어 사전 562개를 집어넣고, 요구 한 문장에서 요소를 판정해 구현 자산까지 착지하는 흐름을 완성한다. closed 2026-07-21 — 7항 중 6 PASS · 1 미달(사람 관측: 조회 절차 미준수). Details: `plans/horizons/2026-07-vocabulary-in-use.md`.

<!-- harness:goal-archive9 id="editor-color-and-token-editing" status="completed" -->
Goal: 편집기에서 색이 색으로 보이고, 바꿔진다 — 인스펙터 UI·토큰 조회 API·검증 계층·렌더러 4표면. closed 2026-07-21 — 7항 중 6 PASS, 기준 6(판단 가능성) **부분 충족 명시**. Details: `plans/horizons/2026-07-editor-color-and-token-editing.md`.

<!-- harness:goal-archive8 id="editor-legibility" status="completed" -->
Goal: AskewlyDesign 편집기를 사람이 화면만 보고 판단할 수 있는 물건으로 만든다 — 조작감과 판독성 두 축. closed 2026-07-21 — 6항 중 5 PASS, 기준 6(판단 가능성) **미달 명시**. Details: `archive/horizons/2026-07-editor-legibility.md`.

<!-- harness:goal-archive7 id="template-production-hardening" status="completed" -->
Goal: 템플릿 제작 파이프라인을 선언 수준에서 실제 동작 수준으로 끌어올린다. closed 2026-07-20 — 닫는 기준 9항 중 8 PASS, 기준 7(실사용·편집기 축) **미달 명시**. Details: `archive/horizons/2026-07-template-production-hardening.md`.

<!-- harness:goal-archive6 id="template-production-system" status="completed" -->
Goal: 브리프·토큰·레시피를 명함·제품 포스터·인포그래픽의 편집 가능한 CanvasDocument와 브라우저 제작 루프로 바꾼다. Details: `plans/horizons/2026-07-template-production-system.md`.

<!-- harness:goal-archive5 id="recipe-code-reuse" status="completed" -->
Goal: 사이트 레시피 데모 실구현을 registry 코드 자산으로 배포하고, 에이전트 코드 출발 계약과 스튜디오 구성↔레시피 매핑을 배선한다. Details: `plans/horizons/2026-07-recipe-code-reuse.md`.

<!-- harness:goal-archive4 id="studio-finish" status="completed" -->
Goal: 스튜디오 이월 갭 3건 마감 — 데이터 주도 주입 자동화·구성 패턴 완편(4유형+예약형)·미리보기 고도화(다크·반응형). Details: `plans/horizons/2026-07-studio-finish.md`.

<!-- harness:goal-archive3 id="cascade-studio" status="completed" -->
Goal: 스튜디오를 폭포식(영향순·캐스케이드 적용)으로 재구축하고 스크롤 추종 라이브 미리보기·영상 후보·카피/인터랙션 축을 더한다. Details: `plans/horizons/2026-07-cascade-studio.md`.

## Active Milestones — design-output-gates

<!-- harness:milestone id="DOG1" status="completed" priority="P0" evidence="evidence/design-output-gates/dog1-linter-precision.md" -->
### DOG1 — 검사기가 맞는 것만 잡는다
- DoD: 색 검사기가 SVG 내부와 주석 안의 색 리터럴을 위반으로 보고하지 않고, 한 줄에 여러 위반이 있으면 전부 보고한다.
- Evidence: evidence/design-output-gates/dog1-linter-precision.md
- Gap: 실행 실사에서 오탐 2종(SVG·주석)과 누락 1종(줄 단위 첫 매치만)이 나왔다 — 브리프는 검사기가 없다고 했으나 실은 있고, 정확도가 문제였다
- Scale: changesets>=3; surfaces: 규칙 엔진·예외 처리·회귀 fixture; capability: 무시당하지 않는 검사기
- Plan: plans/2026-07-22-dog1-linter-precision.md
- Status: [x]

- Completed at: 2026-07-22
- Summary: 오탐 4→0·누락 1→0, 테스트 21→32 (changesets 247/248/249)
<!-- harness:milestone id="DOG2" status="completed" priority="P0" evidence="evidence/design-output-gates/dog2-publication.md" -->
### DOG2 — 남의 프로젝트에서 돈다
- DoD: `npx @askewly/design@<ver> verify <dir>` 가 이 레포 밖 임시 디렉터리에서 동작한다.
- Evidence: evidence/design-output-gates/dog2-publication.md
- Gap: `npm view @askewly/design` → E404. 패키지는 bin·files까지 준비됐는데 레지스트리에 없다
- Scale: changesets>=3; surfaces: 패키지 메타·배포·재배포 절차; capability: 남의 프로젝트에서 불리는 검사기
- Plan: plans/2026-07-22-dog2-cli-publication.md
- Status: [x]

- Completed at: 2026-07-22
- Summary: @askewly/design@0.1.0 공개 배포·레포 밖 npx 실증·배포 절차 정본 (changesets 250/251/252)
<!-- harness:milestone id="DOG3" status="completed" priority="P1" evidence="evidence/design-output-gates/dog3-typography.md" -->
### DOG3 — 타이포 단계를 센다
- DoD: 한 화면에서 쓰인 font-size 고유값 개수를 세고 임계(5) 초과 시 보고한다.
- Evidence: evidence/design-output-gates/dog3-typography.md
- Gap: 타이포 검사기가 없다. Kraft의 4를 그대로 쓰면 우리 5단계 스케일이 자기 위반이 된다
- Scale: changesets>=3; surfaces: 정규화 규칙·CLI 표면·자기 자산 실측; capability: 잴 수 있는 타이포 규율
- Plan: plans/2026-07-22-dog3-typography-scale.md
- Status: [x]

- Completed at: 2026-07-22
- Summary: 타이포 검사기·임계값 5 실측 확정·0.2.0 릴리스 (changesets 254/255/256)
<!-- harness:milestone id="DOG4" status="completed" priority="P1" -->
### DOG4 — 인쇄 근거가 에이전트 경로에 실린다
- DoD: 인쇄 규격이 docs/design-system/ 문서로 존재하고 llms.txt 경로에서 fetch되며, 매체별 게이트 차이가 분류 축으로 명시된다.
- Evidence: evidence/design-output-gates/dog4-print-publication.md
- Gap: print-spec.ts는 실재하는데 에이전트 정본 밖에 있다 — VL2와 동형 구조
- Scale: changesets>=3; surfaces: 문서 생성기·매체 분류·배포 등재; capability: 에이전트가 읽는 인쇄 규격
- Plan: plans/2026-07-22-dog4-print-evidence-publication.md
- Status: [x]

- Completed at: 2026-07-22
<!-- harness:milestone id="DOG5" status="pending" priority="P1" -->
### DOG5 — 슬라이드 매체 신설
- DoD: 슬라이드 규격 계약이 존재하고, 기계 검증 가능 항목만 게이트가 되며, 각 항목의 근거 등급이 명시된다.
- Evidence: evidence/design-output-gates/dog5-slide-medium.md
- Gap: 슬라이드 자산 0건. 그런데 통용 규칙 대부분이 1차 출처 없는 통설이다
- Scale: changesets>=3; surfaces: 규격 계약·통설 옵트인 처리·배포 등재; capability: 정직한 슬라이드 게이트
- Plan: plans/2026-07-22-dog5-slide-medium.md
- Status: [ ]

<!-- harness:milestone id="DOG6" status="pending" priority="P0" -->
### DOG6 — 마무리 절차가 셋을 다 부른다
- DoD: 마무리 절차가 매체에 따라 다른 게이트를 지시하고, 검사기를 호출해 위반을 에이전트가 받아 고친 뒤 다시 잰다.
- Evidence: evidence/design-output-gates/dog6-wiring.md
- Gap: SKILL.md 마무리 절차에 verify 호출이 없다 — 검사기가 있어도 안 불린다(VL8과 같은 병리)
- Scale: changesets>=3; surfaces: entry-protocol·스킬 배선·자가 수정 루프; capability: 실제로 불리는 게이트
- Plan: plans/2026-07-22-dog6-finish-procedure-wiring.md
- Status: [ ] — DOG1·DOG2 완료 후 착수

<!-- harness:milestone id="DOG7" status="pending" priority="P1" -->
### DOG7 — 사람 관측 게이트
- DoD: 사용자가 실제 디자인 작업 1건에서 새 마무리 절차를 겪고, 오탐이 성가신지와 차단 승격 가부를 발화로 답한다.
- Evidence: evidence/design-output-gates/dog7-observation.md
- Gap: 직전 2 horizon이 연속으로 사람 관측 게이트에서 미달·부분으로 닫혔다
- Scale: changesets>=2; surfaces: 관측·발견 결함 마감; capability: 사람이 무시하지 않는 게이트
- Plan: (DOG6 완료 시 작성 — 사용자 결정 내장)
- Status: [ ]

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
