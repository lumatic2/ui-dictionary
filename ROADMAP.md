# ROADMAP

> Last updated: 2026-07-21
> Status: `vocabulary-in-use` **closed 2026-07-21**(VL1~VL8 — 6 PASS · VL8 미달). 남은 active 는 `editor-color-and-token-editing`(ECT1~4 완료·**ECT5 blocked**, 별도 세션). 다음 방향은 `plans/horizons/CANDIDATES.md` 에서 사용자가 선정한다 — VL8 이 적재한 6번 `vocabulary-lookup-discipline` 포함.
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

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

<!-- harness:goal id="vocabulary-in-use" status="completed" -->
Goal: askewly-design 호출 경로에 UI 용어 사전 562개를 집어넣고, 요구 한 문장에서 요소를 판정해 구현 자산까지 착지하는 흐름을 완성한다. **closed 2026-07-21 — 닫는 기준 7항 중 6 PASS · 1 미달**(사람 관측: 조회 절차 미준수). Details: `plans/horizons/2026-07-vocabulary-in-use.md`.

## Active Milestones — editor-color-and-token-editing
<!-- harness:milestone id="ECT5" status="completed" priority="P1" -->
### ECT5 — 판단 가능성 재관측
- DoD: 사람이 사전 설명 없이 화면만 보고 과업 3건(색 토큰 변경·미바인딩 노드에 색 묶기·원시 색으로 벗어나기)을 수행한다. 과업별 성공/실패와 막힌 지점을 기록한다.
- Evidence: evidence/editor-color-and-token-editing/ect5-judgeability.md
- Gap: EU5에서 같은 게이트가 결함을 냈다 — probe와 계측이 못 잡는 것을 사람이 잡는다
- Scale: changesets>=2; surfaces: 실사용 관측·발견 결함 마감; capability: 색을 바꿀 수 있는 편집기
- Plan: plans/2026-07-21-ect5-judgeability-observation.md
- Status: [x] 완료 2026-07-21 — 과업 ① **사전 안내 없이 성공**(직전 horizon에서 실패한 그 과업). ②③은 화면에 박힌 어휘("묶다/풀다")에 사용자가 막혀 미실시 → 문구 7건 교체 + 내부 어휘 유출 게이트. 재관측은 사용자 거절로 미실시 — **기준 6은 부분 충족으로 명시**하고 통과로 적지 않았다. changesets 243~246


## 유지보수 후보 (milestone 아님)

> 이월 finding 전수 장부는 `docs/findings.md` (2026-07-20 수집 — A~F 6군). 아래는 이 horizon 밖 항목만.

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Active Milestones — vocabulary-in-use

<!-- harness:milestone id="VL1" status="completed" priority="P0" evidence="evidence/vocabulary-in-use/vl1-flow-audit.md" -->
### VL1 — 흐름 실사 + 기준선
- DoD: 현행 경로가 실제 fetch 응답과 함께 기록되고, 갭 수치가 재현 가능한 스크립트로 계수되며, 외부 출처 라벨 30건 케이스의 기준선 정답률이 군집별로 나온다.
- Evidence: evidence/vocabulary-in-use/vl1-flow-audit.md
- Gap: 직전 horizon에서 선언 Gap 3개 중 2개가 실제와 달랐다 — 고치기 전에 잰다
- Scale: changesets>=3; surfaces: 계측·계수기·기준선 측정; capability: 측정된 현행 경로
- Plan: plans/2026-07-21-vl1-flow-audit.md
- Status: [x]

- Completed at: 2026-07-21
- Summary: 배포본 실사·계수기·기준선 84.4% (changesets 222/223/224)
<!-- harness:milestone id="VL2" status="completed" priority="P0" evidence="changesets/20260721-vocabulary-shard-generator, changesets/20260721-vocabulary-lookup-contract, changesets/20260721-llms-vocabulary-section" -->
### VL2 — 어휘 배포
- DoD: 562개 용어가 손실 없이 샤드로 배포되고, 조회 규약대로 임의 용어가 3 fetch 이내에 도달하며, 어느 경로에서도 원본 전체 fetch를 요구하지 않는다.
- Evidence: changesets/20260721-vocabulary-shard-generator, changesets/20260721-vocabulary-lookup-contract, changesets/20260721-llms-vocabulary-section
- Gap: llms.txt에 용어 데이터가 없다 — 사전 562개가 에이전트 경로 밖에 있다 (실사 계측)
- Scale: changesets>=3; surfaces: 샤딩 생성기·조회 규약·llms 등재; capability: 에이전트가 읽는 사전
- Plan: plans/2026-07-21-vl2-vocabulary-publication.md
- Status: [x]

- Completed at: 2026-07-21
- Summary: 562개 배포·조회 2 fetch·끊긴 참조 91→0 (changesets 225/226/227)
<!-- harness:milestone id="VL3" status="completed" priority="P0" evidence="changesets/20260721-term-asset-map, changesets/20260721-reference-integrity, changesets/20260721-no-asset-fallback" -->
### VL3 — 참조 복구 + 역방향 매핑
- DoD: 배포본 기준 끊긴 term_refs가 0이고, 용어↔레시피↔코드자산 매핑이 양방향 일치하며, 자산 없는 용어를 폴백 규약으로 실제 구현한 증거가 있다.
- Evidence: changesets/20260721-term-asset-map, changesets/20260721-reference-integrity, changesets/20260721-no-asset-fallback
- Gap: 배포된 계약 안에 해소 불가능한 참조 81건. 용어 커버리지 14.4% — 481개는 만들 근거가 없다
- Scale: changesets>=3; surfaces: 매핑 생성기·무결성 검사·폴백 규약; capability: 고른 용어를 만들 수 있는 상태
- Plan: plans/2026-07-21-vl3-reference-repair.md
- Status: [x]

- Completed at: 2026-07-21
- Summary: 3자 매핑·무결성 게이트·폴백 규약 (changesets 228/229/230)
<!-- harness:milestone id="VL4" status="completed" priority="P0" evidence="changesets/20260721-decision-format-contract, changesets/20260721-decision-validator, changesets/20260721-disclosure-family-decision" -->
### VL4 — 판별 데이터 계약
- DoD: 검증기가 군집 1개를 통과하고, 그 군집의 규칙이 서로 다른 요구 문장 5개를 서로 다른 요소로 가른다.
- Evidence: changesets/20260721-decision-format-contract, changesets/20260721-decision-validator, changesets/20260721-disclosure-family-decision
- Gap: 후보 사이를 가르는 축이 스키마에 없다 — 각 용어가 자기 시점의 anti_use만 갖는다
- Scale: changesets>=3; surfaces: decision-format 계약·validate-decisions.py·첫 군집; capability: 기계 검증되는 판별 데이터
- Plan: plans/2026-07-21-vl4-decision-data-contract.md
- Status: [x]

- Completed at: 2026-07-21
- Summary: 계약·검증기·첫 군집 (changesets 231/232/233)
<!-- harness:milestone id="VL5" status="completed" priority="P0" evidence="changesets/20260721-decision-miss-batch, changesets/20260721-decision-unverified-batch, changesets/20260721-decision-corpus-integrity" -->
### VL5 — 군집 채우기
- DoD: 다룬 군집이 validator를 통과하고, 기준선이 틀린 3케이스가 규칙으로 정답에 도달하며, 과적합 probe를 통과하고, 안 만든 군집의 사유가 인덱스에 남는다.
- Evidence: changesets/20260721-decision-miss-batch, changesets/20260721-decision-unverified-batch, changesets/20260721-decision-corpus-integrity
- Gap: 기준선 84.4%·8군집 만점 — 오판이 실제로 난 3군집 + 미확인 3군집에만 축이 필요하다 (VL1 계측)
- Scale: changesets>=3; surfaces: decisions 데이터 2배치·교차 무결성; capability: 모델이 못 맞히는 임계값을 덮는 판별 말뭉치
- Plan: plans/2026-07-21b-vl5-cluster-corpus-narrowed.md (구 15군집 판을 대체 — VL1 기준선 반영)
- Status: [x]

- Completed at: 2026-07-21
- Summary: 6군집·축 26·규칙 32, 오판 3/3 정답 도달 (changesets 234/235/236)
<!-- harness:milestone id="VL6" status="completed" priority="P0" evidence="changesets/20260721-protocol-vocabulary-lookup, changesets/20260721-protocol-element-decision, changesets/20260721-protocol-asset-branch-and-record, changesets/20260721-protocol-publication" -->
### VL6 — 프로토콜 재배선
- DoD: 요소가 미정인 요구가 A/B/C 어느 경로로 들어와도 용어 조회·요소 결정·자산 획득(또는 폴백)을 지나고, 우회 경로가 0이며, 보고에 요소 결정 블록이 요구된다.
- Evidence: changesets/20260721-protocol-vocabulary-lookup, changesets/20260721-protocol-element-decision, changesets/20260721-protocol-asset-branch-and-record, changesets/20260721-protocol-publication
- Gap: entry-protocol의 용어 언급 0회, 분류에서 레시피로 직행 — 자산이 있어도 안 불린다
- Scale: changesets>=3; surfaces: entry-protocol·decision-format 보고 계약·generate-llms-txt; capability: 에이전트가 실제로 거쳐가는 판단 경로
- Plan: plans/2026-07-21-vl6-protocol-rewiring.md
- Status: [x]

- Completed at: 2026-07-21
- Summary: 3단계 배선·우회 0·등재 (changesets 237-240)
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
