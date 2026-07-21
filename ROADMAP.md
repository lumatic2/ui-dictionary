# ROADMAP

> Last updated: 2026-07-21
> Status: **horizon 2개 병행** — `editor-color-and-token-editing`(ECT1~4 완료·ECT5 blocked, 별도 세션) + `vocabulary-in-use`(VL1~7 완료·VL8 사용자 관측 대기). 두 갈래가 같은 base 에서 병렬로 달렸다 — 어느 쪽을 active 로 둘지는 사용자 결정.
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="editor-color-and-token-editing" status="active" -->
Goal: 편집기에서 색이 색으로 보이고, 바꿔진다 — 인스펙터 UI·토큰 조회 API·검증 계층·렌더러 4표면. Details: `plans/horizons/2026-07-editor-color-and-token-editing.md`.

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

<!-- harness:goal id="vocabulary-in-use" status="active" -->
Goal: askewly-design 호출 경로에 UI 용어 사전 562개를 집어넣고, 요구 한 문장에서 요소를 판정해 구현 자산까지 착지하는 흐름을 완성한다. Details: `plans/horizons/2026-07-vocabulary-in-use.md`.

<!-- harness:goal id="getdesign-pptx-pilot" status="active" -->
Goal: getdesign 레퍼런스 하나를 프로젝트 DESIGN.md로 조정하고, 같은 룩의 웹과 편집 가능한 PPTX를 만든다. Details: `plans/horizons/2026-07-getdesign-pptx-pilot.md`.

## Active Milestones — editor-color-and-token-editing
<!-- harness:milestone id="ECT1" status="completed" priority="P0" -->
### ECT1 — 토큰이 조회되고, 실재가 검증된다
- DoD: 화면이 물어볼 수 있는 토큰 목록 API가 있고(두 어휘 격리 보장) + 편집기·템플릿 어휘가 같은 메타데이터 모양을 가지며 + 실재하지 않는 토큰은 저장되지 않는다.
- Evidence: evidence/editor-color-and-token-editing/ect1-lookup.md — changesets 206/207/208/209 · 보고서 docs/reports/2026-07-21-ect1-token-lookup-and-validation.md
- Gap: 토큰 열거 API가 없어 UI가 목록을 물어볼 수 없고, 검증이 형태만 봐서 없는 토큰이 조용히 저장된다 (실사 1·3)
- Scale: changesets>=3; surfaces: documentTokens 조회·생성기·canvas-core 검증; capability: 화면이 물어볼 수 있는 토큰
- Plan: plans/2026-07-21-ect1-token-lookup-and-validation.md
- Status: [x] 완료 2026-07-21 — 열거 API·kind 유도·실재 검증. **독립 검증이 2회 refuted**(set-node-property만 막고 update-node·create-node가 뚫려 있었다). 경로마다 막는 방식을 버리고 모든 연산이 지나는 길목에서 델타를 보게 재설계, 3차 confirmed. changesets 206/207/208/209

<!-- harness:milestone id="ECT2" status="completed" priority="P0" -->
### ECT2 — 색이 색으로 보인다
- DoD: 이미 색 토큰이 묶인 노드에서 사람이 해석된 색 견본을 보고 목록에서 골라 색을 바꾼다 + 어휘 격리가 양방향으로 지켜지고 + 키보드로 완주된다.
- Evidence: evidence/editor-color-and-token-editing/ect2-swatch.md
- Gap: 화면에 "색" 단어 0건·견본 0개, 유일 경로가 자유 텍스트 입력 (EU5 계측)
- Scale: changesets>=3; surfaces: PropertyInspector·선택 팝오버·스타일; capability: 눈으로 고르는 색
- Plan: plans/2026-07-21-ect2-color-swatch-and-picker.md
- Status: [x] 완료 2026-07-21 — 견본·검색 목록·키보드. **브라우저가 자동 검증이 못 잡는 결함 3건 적발**(WebGPU 틴트가 선택 노드 색 오염 / 포커스가 캔버스로 튕김 / Tab-out 유령 UI). 독립 검증 refuted 1회 후 confirmed. changesets 210~214

<!-- harness:milestone id="ECT3" status="completed" priority="P0" -->
### ECT3 — 묶고 푼다
- DoD: 색이 안 묶인 노드에 색을 묶고 + 묶인 색을 풀어 원시 색으로 벗어나며 + 그 상태가 화면에 보이고 undo로 전 구간이 되돌아온다.
- Evidence: evidence/editor-color-and-token-editing/ect3-bind-detach.md
- Gap: 바인딩 없는 노드는 색 변경 자체가 불가능하다. 리서치 5개 시스템 전부가 가진 어포던스가 우리에겐 0 (EU5 finding 2)
- Scale: changesets>=3; surfaces: 문서 모델·오퍼레이션·undo 역함수·인스펙터; capability: 묶고 푸는 색
- Plan: plans/2026-07-21-ect3-bind-and-detach.md
- Status: [x] 완료 2026-07-21 — 묶기·풀기·왕복. 독립 검증 refuted 1회(literalColors 검증이 연산 하나에만 있어 update-node·create-node가 뚫림 — ECT1과 **같은 실패의 네 번째 반복**) 후 길목 배선으로 confirmed. changesets 215~218

<!-- harness:milestone id="ECT4" status="completed" priority="P1" -->
### ECT4 — 이미지 노드가 실제로 칠해진다
- DoD: 이미지 노드에 묶은 색 토큰이 실제로 칠해지고(브라우저 계산값 대조) + 바인딩 없는 노드는 시각 회귀가 없으며 + 허용 바인딩 키의 정본이 하나다.
- Evidence: evidence/editor-color-and-token-editing/ect4-image-render.md
- Gap: 렌더러가 image kind에서 tokenBindings를 참조조차 안 한다 — 인스펙터만 고치면 묶이는데 안 칠해진다 (실사 2·5)
- Scale: changesets>=2; surfaces: CanvasSurface 렌더·template-core 키 계약; capability: 실제로 칠해지는 바인딩
- Plan: plans/2026-07-21-ect4-image-node-and-contract.md
- Status: [x] 완료 2026-07-21 — 키 정본 단일화 + 이미지 노드 개방. **step-2의 전제가 거짓이었다** — 이미지 노드는 원래 칠해지고 있었고, 첫 실사의 틀린 한 문장이 horizon 문서·ECT3 제외·사용자 결정 3까지 전파됐다. 정정 기록 부착. changesets 219~221

<!-- harness:milestone id="ECT5" status="blocked" priority="P1" -->
### ECT5 — 판단 가능성 재관측
- DoD: 사람이 사전 설명 없이 화면만 보고 과업 3건(색 토큰 변경·미바인딩 노드에 색 묶기·원시 색으로 벗어나기)을 수행한다. 과업별 성공/실패와 막힌 지점을 기록한다.
- Evidence: evidence/editor-color-and-token-editing/ect5-judgeability.md
- Gap: EU5에서 같은 게이트가 결함을 냈다 — probe와 계측이 못 잡는 것을 사람이 잡는다
- Scale: changesets>=2; surfaces: 실사용 관측·발견 결함 마감; capability: 색을 바꿀 수 있는 편집기
- Plan: (관측 시점에 작성 — 사용자 결정 내장 milestone)
- Status: [ ]
- Blocked by: 사용자 브라우저 필요 (2026-07-21 사용자 확인: "브라우저 지금 못씀"). 스크린샷 제시로 대체하지 않는다 — 직전 horizon에서 실패한 방식이다.


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
<!-- harness:milestone id="VL8" status="active" priority="P1" -->
### VL8 — 사람 관측 게이트
- DoD: 사용자가 사전 설명 없이 요구 한 문장을 던져 판정·근거·구현까지 가는 과업 3건의 성공/실패와 막힌 지점이 발화 인용과 함께 기록된다.
- Evidence: evidence/vocabulary-in-use/vl8-observation.md
- Gap: 직전 horizon에서 probe 11건과 브라우저 계측이 전부 놓친 결함을 사람이 한 번 만져서 잡았다
- Scale: changesets>=2; surfaces: 관측 프로토콜·사용자 과업·발견 결함 마감; capability: 사람이 던진 문장이 구현으로 착지
- Plan: plans/2026-07-21-vl8-human-observation.md
- Status: [ ]

## Active Milestones — getdesign-pptx-pilot

<!-- harness:milestone id="GP1" status="completed" priority="P1" evidence="evidence/getdesign-pptx-pilot/gp1-generation.md" -->
### GP1 — Linear intake → 웹 → 편집 가능한 PPTX
- DoD: Linear reference를 프로젝트 DESIGN.md로 조정하고, 동일 토큰의 웹과 수정 가능한 16:9 6장 PPTX를 생성·실물 검증한다.
- Evidence: evidence/getdesign-pptx-pilot/gp1-generation.md
- Gap: 현재 Askewly Design은 웹·캔버스 중심이라 터미널 요청이 네이티브 PPTX로 닫히는 경로가 없다.
- Scale: changesets>=3; surfaces: DESIGN.md intake·Vite 웹·PPTX OOXML/로컬 열기; capability: 같은 룩의 수정 가능한 슬라이드.
- Plan: `plans/2026-07-21-gp1-linear-pptx-pilot.md`
- Status: [x]

- Completed at: 2026-07-21
- Summary: getdesign 기반 DESIGN.md에서 웹과 수정 가능한 6장 PPTX를 생성·편집 확인했다.
## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; template-production-system (TPS1–TPS5) closed 2026-07-19, recipe-code-reuse (RC1–RC4) closed 2026-07-19, skill-entry (SE1–SE2) closed 2026-07-18, design-brief (DB2) closed 2026-07-19, Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
