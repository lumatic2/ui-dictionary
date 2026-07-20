# ROADMAP

> Last updated: 2026-07-21
> Status: 요소 결정 계층 — ED1(판별 데이터 계약) 승인 대기. 직전 horizon(편집기 판독성) closed 2026-07-21, 기준 6 미달 명시
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="element-decision-layer" status="active" -->
Goal: 요구 한 문장에서 어떤 UI 요소를 쓸지 판별 축으로 갈라 고르고, 근거와 기각 대안을 기록해 구현으로 인계하는 결정 계층을 세운다. Details: `plans/horizons/2026-07-element-decision-layer.md`.

<!-- harness:goal-archive8 id="editor-legibility" status="completed" -->
Goal: AskewlyDesign 편집기를 사람이 화면만 보고 판단할 수 있는 물건으로 만든다. closed 2026-07-21 — 닫는 기준 6항 중 5 PASS, 기준 6(판단 가능성) **미달 명시**. Details: `plans/horizons/2026-07-editor-legibility.md`.

<!-- harness:goal-archive8 id="template-production-hardening" status="completed" -->
Goal: 템플릿 제작 파이프라인을 선언 수준에서 실제 동작 수준으로 끌어올린다. closed 2026-07-20 — 닫는 기준 9항 중 8 PASS, 기준 7(실사용·편집기 축) **미달 명시**. Details: `archive/horizons/2026-07-template-production-hardening.md`.

<!-- harness:goal-archive7 id="template-production-system" status="completed" -->
Goal: 브리프·토큰·레시피를 명함·제품 포스터·인포그래픽의 편집 가능한 CanvasDocument와 브라우저 제작 루프로 바꾼다. Details: `plans/horizons/2026-07-template-production-system.md`.

<!-- harness:goal-archive6 id="recipe-code-reuse" status="completed" -->
Goal: 사이트 레시피 데모 실구현을 registry 코드 자산으로 배포하고, 에이전트 코드 출발 계약과 스튜디오 구성↔레시피 매핑을 배선한다. Details: `plans/horizons/2026-07-recipe-code-reuse.md`.

<!-- harness:goal-archive5 id="studio-finish" status="completed" -->
Goal: 스튜디오 이월 갭 3건 마감 — 데이터 주도 주입 자동화·구성 패턴 완편(4유형+예약형)·미리보기 고도화(다크·반응형). Details: `plans/horizons/2026-07-studio-finish.md`.

<!-- harness:goal-archive4 id="cascade-studio" status="completed" -->
Goal: 스튜디오를 폭포식(영향순·캐스케이드 적용)으로 재구축하고 스크롤 추종 라이브 미리보기·영상 후보·카피/인터랙션 축을 더한다. Details: `plans/horizons/2026-07-cascade-studio.md`.

## Active Milestones

<!-- harness:milestone id="ED1" status="active" priority="P0" -->
### ED1 — 판별 데이터 계약
- DoD: 검증기가 군집 1개를 통과하고, 그 군집의 규칙이 서로 다른 요구 문장 5개를 서로 다른 요소로 가른다.
- Evidence: evidence/element-decision-layer/ed1-data-contract.md
- Gap: 후보 사이를 가르는 축이 스키마에 없다 — 각 용어가 자기 시점의 anti_use만 갖는다
- Scale: changesets>=3; surfaces: decision-format 계약·validate-decisions.py·첫 군집 데이터; capability: 기계 검증되는 판별 데이터
- Plan: plans/2026-07-21-ed1-decision-data-contract.md
- Status: [ ]

<!-- harness:milestone id="ED2" status="pending" priority="P0" -->
### ED2 — 군집 채우기
- DoD: 군집 ≥10개가 검증기를 통과하고, 모든 후보가 terms.yml 실존 id이며, 모든 축에 출처·confidence가 있고, 교차 군집 모순이 0이다.
- Evidence: evidence/element-decision-layer/ed2-cluster-corpus.md
- Gap: 헷갈리는 군집 15개 중 1개만 있으면 대부분의 오판이 그대로 남는다
- Scale: changesets>=5; surfaces: decisions/ 데이터 4배치·교차 무결성 검사; capability: 오판 잦은 자리를 덮는 판별 말뭉치
- Plan: plans/2026-07-21-ed2-cluster-corpus.md
- Status: [ ]

<!-- harness:milestone id="ED3" status="pending" priority="P0" -->
### ED3 — 프로토콜 배선
- DoD: 생성된 llms.txt에 결정 섹션이 있고 경로가 전부 실존하며, A/B/C 어느 경로로 들어와도 요소가 미정이면 결정 단계를 지나고, 보고에 `요소 결정` 블록이 요구된다.
- Evidence: evidence/element-decision-layer/ed3-protocol-wiring.md
- Gap: 데이터가 있어도 entry-protocol이 분류→레시피로 직행하면 안 읽힌다
- Scale: changesets>=3; surfaces: entry-protocol·decision-format 보고 계약·generate-llms-txt; capability: 에이전트가 실제로 거쳐가는 결정 단계
- Plan: plans/2026-07-21-ed3-protocol-wiring.md
- Status: [ ]

<!-- harness:milestone id="ED4" status="pending" priority="P0" -->
### ED4 — 분리력 검증 (캘리브레이션)
- DoD: 외부 출처로 라벨링한 케이스 30건에서 기준선/처치 정답률과 군집별 향상 폭이 수치로 기록되고, 회귀 케이스가 0이거나 보정 사유가 남는다.
- Evidence: evidence/element-decision-layer/ed4-separation.md
- Gap: 축이 그럴듯해 보여도 실제 요구 문장에서 두 후보가 다 걸리면 판정이 안 갈린다
- Scale: changesets>=3; surfaces: 케이스 세트·격리 서브에이전트 측정·축 보정; capability: 향상 폭이 수치로 증명된 판정
- Plan: plans/2026-07-21-ed4-separation-gate.md
- Status: [ ]

<!-- harness:milestone id="ED5" status="pending" priority="P1" -->
### ED5 — 사람 관측 게이트
- DoD: 사용자가 사전 설명 없이 요구 한 문장을 던져 판정→근거→구현까지 가는 과업 3건의 성공/실패와 막힌 지점이 발화 인용과 함께 기록된다.
- Evidence: evidence/element-decision-layer/ed5-observation.md
- Gap: 직전 horizon에서 probe 11건과 브라우저 계측이 전부 놓친 결함을 사람이 한 번 만져서 잡았다
- Scale: changesets>=2; surfaces: 관측 프로토콜·사용자 과업·발견 결함 마감; capability: 사람이 던진 문장이 요소로 착지
- Plan: plans/2026-07-21-ed5-human-observation.md
- Status: [ ]


## 유지보수 후보 (milestone 아님)

> 이월 finding 전수 장부는 `docs/findings.md` (2026-07-20 수집 — A~F 6군). 아래는 이 horizon 밖 항목만.

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; template-production-system (TPS1–TPS5) closed 2026-07-19, recipe-code-reuse (RC1–RC4) closed 2026-07-19, skill-entry (SE1–SE2) closed 2026-07-18, design-brief (DB2) closed 2026-07-19, Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
