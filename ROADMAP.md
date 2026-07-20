# ROADMAP

> Last updated: 2026-07-21
> Status: 편집기 색·토큰 편집 — ECT1·ECT2 완료(브라우저·독립 검증이 자동 게이트 못 잡는 결함 5건 적발), ECT3(묶고 푼다) 착수. 직전 horizon(판독성) closed 2026-07-21, 기준 6(판단 가능성) 미달이 이 horizon의 개설 근거
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

## Active Milestones
<!-- harness:milestone id="ECT1" status="completed" priority="P0" -->
### ECT1 — 토큰이 조회되고, 실재가 검증된다
- DoD: 화면이 물어볼 수 있는 토큰 목록 API가 있고(두 어휘 격리 보장) + 편집기·템플릿 어휘가 같은 메타데이터 모양을 가지며 + 실재하지 않는 토큰은 저장되지 않는다.
- Evidence: evidence/editor-color-and-token-editing/ect1-lookup.md — changesets 206/207/208/209 · 보고서 archive/reports/2026-07-21-ect1-token-lookup-and-validation.md
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

<!-- harness:milestone id="ECT3" status="active" priority="P0" -->
### ECT3 — 묶고 푼다
- DoD: 색이 안 묶인 노드에 색을 묶고 + 묶인 색을 풀어 원시 색으로 벗어나며 + 그 상태가 화면에 보이고 undo로 전 구간이 되돌아온다.
- Evidence: evidence/editor-color-and-token-editing/ect3-bind-detach.md
- Gap: 바인딩 없는 노드는 색 변경 자체가 불가능하다. 리서치 5개 시스템 전부가 가진 어포던스가 우리에겐 0 (EU5 finding 2)
- Scale: changesets>=3; surfaces: 문서 모델·오퍼레이션·undo 역함수·인스펙터; capability: 묶고 푸는 색
- Plan: plans/2026-07-21-ect3-bind-and-detach.md
- Status: [ ]

<!-- harness:milestone id="ECT4" status="pending" priority="P1" -->
### ECT4 — 이미지 노드가 실제로 칠해진다
- DoD: 이미지 노드에 묶은 색 토큰이 실제로 칠해지고(브라우저 계산값 대조) + 바인딩 없는 노드는 시각 회귀가 없으며 + 허용 바인딩 키의 정본이 하나다.
- Evidence: evidence/editor-color-and-token-editing/ect4-image-render.md
- Gap: 렌더러가 image kind에서 tokenBindings를 참조조차 안 한다 — 인스펙터만 고치면 묶이는데 안 칠해진다 (실사 2·5)
- Scale: changesets>=2; surfaces: CanvasSurface 렌더·template-core 키 계약; capability: 실제로 칠해지는 바인딩
- Plan: plans/2026-07-21-ect4-image-node-and-contract.md
- Status: [ ]

<!-- harness:milestone id="ECT5" status="pending" priority="P1" -->
### ECT5 — 판단 가능성 재관측
- DoD: 사람이 사전 설명 없이 화면만 보고 과업 3건(색 토큰 변경·미바인딩 노드에 색 묶기·원시 색으로 벗어나기)을 수행한다. 과업별 성공/실패와 막힌 지점을 기록한다.
- Evidence: evidence/editor-color-and-token-editing/ect5-judgeability.md
- Gap: EU5에서 같은 게이트가 결함을 냈다 — probe와 계측이 못 잡는 것을 사람이 잡는다
- Scale: changesets>=2; surfaces: 실사용 관측·발견 결함 마감; capability: 색을 바꿀 수 있는 편집기
- Plan: (ECT4 완료 시 작성 — 사용자 결정 내장 milestone)
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
