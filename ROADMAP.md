# ROADMAP

> Last updated: 2026-07-20
> Status: 편집기 판독성·조작감 — EU1 완료, EU2(스냅·측정) 다음. 직전 horizon(제작 경화) closed 2026-07-20, 기준 7 미달 명시가 이 horizon의 개설 근거
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="editor-legibility" status="active" -->
Goal: AskewlyDesign 편집기를 사람이 화면만 보고 판단할 수 있는 물건으로 만든다 — 조작감(선택·핸들·스냅·측정)과 판독성(레이어·인스펙터) 두 축. Details: `plans/horizons/2026-07-editor-legibility.md`.

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
<!-- harness:milestone id="EU1" status="completed" priority="P0" -->
### EU1 — 조작 종류가 구분되는 선택
- DoD: 변 핸들(단축)·모서리 핸들(양축)·회전 핫존이 서로 다른 조작이고 시각적으로 구분된다 + 호버/선택/다중선택 상태가 각각 다르게 표현된다 + 각 조작의 입력→결과가 테스트로 고정된다.
- Evidence: evidence/editor-legibility/eu1-selection.md
- Gap: 현재 선택 표현이 조작 종류를 구분하지 않아 "지금 뭘 하는지" 커서 전에 알 수 없다 (리서치 1.1)
- Scale: changesets>=2; surfaces: CanvasSurface 렌더·입력 처리·선택 상태 모델; capability: 손에 붙는 선택
- Status: [x]
- Completed at: 2026-07-20
- Summary: 핸들 8개가 전부 같은 사각형이던 것을 모서리/변으로 갈랐고, 없던 회전을 문서 모델부터 넣었다. changesets 192/193/194

<!-- harness:milestone id="EU2" status="completed" priority="P0" -->
### EU2 — 스냅·정렬 가이드·거리 측정
- DoD: 드래그 중 자동 스냅과 정적 거리 측정이 **별개 상호작용**으로 동작한다 + 모든 측정이 바운딩 박스 기준이며 그 정의가 문서에 있다.
- Evidence: evidence/editor-legibility/eu2-snap-measure.md
- Gap: 정렬 보조가 없어 좌표를 눈대중으로 맞춘다. 스냅과 측정을 하나로 뭉치면 둘 다 어설퍼진다 (리서치 1.2·3.2)
- Scale: changesets>=2; surfaces: 입력 처리·가이드 렌더·좌표 모델; capability: 정렬이 손으로 되는 캔버스
- Status: [x] 완료 2026-07-21 — 가이드가 좌표를 보정하지 않던 상태를 고쳐 스냅이 실제로 붙고(96px, 비스냅 93px), Alt+호버 거리 측정 신설, 양방향 분리 게이트, 측정 기준 문서화. 브라우저가 유닛테스트 못 본 결함 2건 적발(빈 transform 커밋으로 편집기 백지 — EU1부터 잠복). changesets 195/196/197

<!-- harness:milestone id="EU3" status="completed" priority="P0" -->
### EU3 — 레이어 패널 판독성
- DoD: 타입이 아이콘으로 구분되고 + 선택 시 부모 경로가 펼침 유지되며 + 검색이 동작한다.
- Evidence: evidence/editor-legibility/eu3-layers.md
- Gap: 트리에서 미아가 된다 — "뭐가 뭔지 안 보인다"의 상당 부분이 여기일 가능성 (리서치 1.3·3.3)
- Scale: changesets>=2; surfaces: 레이어 패널·선택 동기화; capability: 문서 구조가 읽히는 패널
- Status: [x] 완료 2026-07-21 — 실사 결과 선언 Gap 3개 중 2개는 이미 존재. 아이콘 망라(폴백이 3종을 삼키던 것)와 계층 보존 검색을 신설하고, 부모 경로 펼침은 probe로 실재 증명 후 테스트 고정. 브라우저 1000행→13행. changesets 198/199/200

<!-- harness:milestone id="EU4" status="completed" priority="P0" -->
### EU4 — 인스펙터 정보구조
- DoD: 기하→구조→시각→내보내기 순서를 따르고 + 위치/크기는 상시, 스타일은 선택 종류에 따라 노출된다.
- Evidence: evidence/editor-legibility/eu4-inspector.md
- Gap: 현재 섹션 순서가 Figma·Penpot이 일치시킨 순서와 다르다 (리서치 1.4·3.4)
- Scale: changesets>=2; surfaces: PropertyInspector·선택 종류별 스키마; capability: 찾는 속성이 있는 자리에 있는 인스펙터
- Status: [x] 완료 2026-07-21 — 실사 결과 선언(순서 재배치)과 달리 위치·크기·각도가 인스펙터에 통째로 없었다. 기하 필드를 캔버스와 같은 연산으로 커밋하게 만들고, 섹션을 Figma·Penpot 공통 순서로, 선택 종류별 노출을 분리. 스크린샷이 이름 충돌을 적발. changesets 201/202/203

<!-- harness:milestone id="EU5" status="active" priority="P1" -->
### EU5 — 판단 가능성 게이트
- DoD: 사람이 **사전 설명 없이** 화면만 보고 과업 3건(요소 선택·크기 변경·색 토큰 변경)을 수행한다. 과업별 성공/실패와 막힌 지점을 기록한다.
- Evidence: evidence/editor-legibility/eu5-usability.md
- Gap: 직전 horizon에서 스크린샷 제시 방식이 실패했다 — 읽을 줄 아는 사람에게만 통하는 질문이었다
- Scale: changesets>=2; surfaces: 실사용 관측·발견 결함 마감; capability: 판단 가능한 편집기
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
