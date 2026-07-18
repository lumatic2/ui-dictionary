# ROADMAP

> Last updated: 2026-07-18
> Status: Cascade Studio active (폭포식 선택 + 라이브 미리보기 — 사용자 발의 2026-07-19)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="cascade-studio" status="active" -->
Goal: 스튜디오를 폭포식(영향순·캐스케이드 적용)으로 재구축하고 스크롤 추종 라이브 미리보기·영상 후보·카피/인터랙션 축을 더한다. Details: `plans/horizons/2026-07-cascade-studio.md`.

<!-- harness:goal-archive2 id="studio-depth" status="completed" -->
Goal: 브리프 스튜디오를 시니어 디자이너의 결정 공간 전체로 확장한다 — 스타일 타일 2단 구조·축 14종·후보 6~8 추천순·실사 이미지(Pexels+생성). Details: `plans/horizons/2026-07-studio-depth.md`.

<!-- harness:goal-archive id="visual-brief" status="completed" -->
Goal: 브리프 선택을 실물 보기(폰트·컬러·인터랙션 스튜디오)로 올리고, 결과물 크롬 상시 표시 게이트와 Stitch 양식 정합, 딥 브리프 선택 모드를 더한다. Details: `plans/horizons/2026-07-visual-brief.md`.

## Active Milestones

<!-- harness:milestone id="ST1" status="active" priority="P0" -->
### ST1 — 스튜디오 정비 (칩·크기·순서·해상도)
- DoD: 칩 겹침 0(좁은 뷰포트 포함)·타일/이미지 대형 카드·영향순 배치·medium/large2x 분리 실구동.
- Evidence: changesets/20260719-studio-fixes/README.md, 스크린샷
- Gap: 사용자 적발 결함 4종
- Scale: changesets>=2; surfaces: 로컬 스튜디오, Pexels; capability: 판독성·해상도 정비
- Status: [ ]

<!-- harness:milestone id="ST2" status="active" priority="P0" -->
### ST2 — 캐스케이드 + 스티키 라이브 미리보기
- DoD: 상위 선택이 하위 후보 렌더에 반영(evaluate 검증) + 미니 사이트 점진 조립 미리보기 실구동, 선택 보존 확인.
- Evidence: changesets/20260719-cascade-preview/README.md, 스크린샷 2
- Gap: 병렬 축은 조합 상상 강요 — 폭포+미리보기로 체감 (사용자 지시)
- Scale: changesets>=2; surfaces: 로컬 스튜디오; capability: 앱 프로토타입 완성형
- Status: [ ]

<!-- harness:milestone id="ST3" status="active" priority="P0" -->
### ST3 — 영상 파이프라인 (Pexels Videos)
- DoD: HD mp4+포스터 실호출·스튜디오 hover 재생·히어로 비디오 패턴(reduced-motion 폴백) 계약 배포.
- Evidence: changesets/20260719-video-pipeline/README.md
- Gap: 저해상 사진 한계 — "차라리 영상" (사용자)
- Scale: changesets>=2; surfaces: Pexels Videos API, 로컬, ui.askewly.com; capability: 영상 축
- Status: [ ]

<!-- harness:milestone id="ST4" status="pending" priority="P1" -->
### ST4 — 카피·인터랙션 축 + 통합 실연
- DoD: 헤드라인/서브/CTA/마우스 인터랙션 축 실구동(미리보기 반영) + 통합 실연 관측 → horizon close.
- Evidence: evidence/cascade-studio/
- Gap: 문구·인터랙션이 마지막 추정 영역 (사용자)
- Scale: changesets>=2; surfaces: 로컬 + 대화형 실연; capability: 전 결정 공간 선택화
- Status: [ ]

<!-- harness:milestone id="SP1" status="completed" priority="P0" evidence="changesets/20260719-brief-v2/README.md, research/2026-07-19-studio-depth-brief-practice.md, research/2026-07-19-studio-depth-tool-practice.md" -->
### SP1 — 브리프 v2 계약 (결정 공간 지도)
- DoD: design-brief v2(전략층 4항목·축 14종·2단 구조·딥 부록 흡수) + brief-studio 계약 v2가 llms 배포된다.
- Evidence: changesets/20260719-brief-v2/README.md, research/2026-07-19-studio-depth-brief-practice.md, research/2026-07-19-studio-depth-tool-practice.md
- Gap: 현 브리프는 결정 공간의 소부분 — 사용자 적발 + 리서치로 지도 확보
- Scale: changesets>=2; surfaces: ui.askewly.com curl; capability: 결정 공간 지도 계약
- Status: [x]

- Completed at: 2026-07-19
- Summary: 브리프 v2 배포 — 전략층 6·시각 축 14·스타일 타일 2단 구조 (리서치 2건 근거)
<!-- harness:milestone id="SP2" status="completed" priority="P0" evidence="changesets/20260719-studio-v2/README.md, evidence/studio-depth/v2-selections-test.json" -->
### SP2 — 스튜디오 v2 (2단 구조 + 축 14종)
- DoD: 타일→세부 재정렬→수집 v2 실구동 + 강제필터 금지·reduced-motion 실패 경로 확인.
- Evidence: changesets/20260719-studio-v2/README.md, evidence/studio-depth/v2-selections-test.json
- Gap: 3그룹×3~4후보는 최소 실증판 — 사용자 "선택지 적다"
- Scale: changesets>=2; surfaces: 로컬 스튜디오 실구동; capability: 전체 축 실물 선택
- Status: [x]

- Completed at: 2026-07-19
- Summary: 스튜디오 v2 실구동 — 타일 재정렬·강제필터 금지·수집 v2 검증
<!-- harness:milestone id="SP3" status="completed" priority="P0" evidence="changesets/20260719-image-pipeline/README.md, templates/fetch-stock.py" -->
### SP3 — 이미지 파이프라인 (Pexels + 생성 옵션)
- DoD: Pexels 실호출 후보 수신 + 스튜디오 실사 썸네일 그룹 + 계약 배포. 키 부재 명시 에러.
- Evidence: changesets/20260719-image-pipeline/README.md, templates/fetch-stock.py
- Gap: 플레이스홀더 사진 자리 — 실사·생성 경로 부재 (사용자 지적)
- Scale: changesets>=2; surfaces: Pexels API, 로컬 스튜디오, ui.askewly.com; capability: 실사 이미지 축
- Status: [x]

- Completed at: 2026-07-19
- Summary: Pexels ko-KR 실호출 6장 + 이미지 축 계약 배포, 키 User 전역 등록
<!-- harness:milestone id="SP4" status="completed" priority="P1" evidence="changesets/20260719-integrated-e2e/README.md, evidence/studio-depth/dance-selections.json, evidence/studio-depth/dance-DESIGN.md" -->
### SP4 — 통합 E2E 실연
- DoD: 실의뢰 1건 전 루프(전략층→타일→축→실사→DESIGN.md v2→구현→실물 게이트) 관측 + 갭 정직 기록 → horizon close.
- Evidence: changesets/20260719-integrated-e2e/README.md, evidence/studio-depth/dance-selections.json, evidence/studio-depth/dance-DESIGN.md
- Gap: 확장이 실사용감으로 검증돼야 close (SE2 교훈)
- Scale: changesets>=2; surfaces: 대화형 실연; capability: v2 루프 실증
- Status: [x]

- Completed at: 2026-07-19
- Summary: 통합 실연 관측 — 14축 실선택·자유 조합·실사 적용, 갭 3건 기록
<!-- harness:milestone id="VB1" status="completed" priority="P0" evidence="changesets/20260719-stitch-alignment/README.md, research/2026-07-19-vb1-stitch-design-md.md" -->
### VB1 — Stitch 양식 리서치·정합
- DoD: 공식 출처 기반 리서치 doc + 템플릿·저장 계약 diff 정합(채택/기각/유지 사유).
- Evidence: changesets/20260719-stitch-alignment/README.md, research/2026-07-19-vb1-stitch-design-md.md
- Gap: 템플릿이 Stitch 양식을 따른다고 하나 공식 스펙과 대조한 적 없음 (사용자 지적)
- Scale: changesets>=2; surfaces: research doc, llms curl; capability: 표준 정합된 DESIGN.md 양식
- Status: [x]

- Completed at: 2026-07-19
- Summary: 공식 스펙 확인(google-labs-code/design.md alpha) — flat 스키마·8섹션 채택, 3-tier는 확장 관례로 교정, 배포 반영
<!-- harness:milestone id="VB2" status="completed" priority="P0" evidence="changesets/20260719-brief-studio/README.md, evidence/visual-brief/cafe-brief-selections.json, evidence/visual-brief/cafe-DESIGN.md" -->
### VB2 — 브리프 스튜디오
- DoD: 폰트·컬러·인터랙션 실물 선택 스튜디오 실구동(렌더→선택→수집→DESIGN.md) + 계약 배포 + 실연.
- Evidence: changesets/20260719-brief-studio/README.md, evidence/visual-brief/cafe-brief-selections.json, evidence/visual-brief/cafe-DESIGN.md
- Gap: 브리프 선택지가 텍스트 라벨뿐 — 디자인 결정을 글로 함 (DB2 잔여 리스크)
- Scale: changesets>=3; surfaces: 로컬 스튜디오, ui.askewly.com, 대화형 실연; capability: 실물 선택 브리프
- Status: [x]

- Completed at: 2026-07-19
- Summary: 브리프 스튜디오 실구동+폴백+대화형 실연(실물 선택 3종→DESIGN.md→구현) 전부 관측
<!-- harness:milestone id="VB3" status="completed" priority="P1" evidence="changesets/20260719-chrome-gate/README.md, evidence/visual-brief/vb3-live-gate-e2e.log" -->
### VB3 — 크롬 상시 표시 게이트
- DoD: 프로토콜 5단계가 실물 브라우저 열림·유지를 지시하고 E2E로 관측.
- Evidence: changesets/20260719-chrome-gate/README.md, evidence/visual-brief/vb3-live-gate-e2e.log
- Gap: 사람 게이트 판정이 채팅 스크린샷에 의존 (사용자 지적)
- Scale: changesets>=2; surfaces: ui.askewly.com, 로컬 브라우저; capability: 실물 판정 게이트
- Status: [x]

- Completed at: 2026-07-19
- Summary: 사람 게이트 판정 표면 = 실물 브라우저(열기+서버 유지) 배포, E2E·실패경로 관측
<!-- harness:milestone id="VB4" status="completed" priority="P1" evidence="changesets/20260719-deep-brief/README.md, docs/design-system/design-brief.md" -->
### VB4 — 딥 브리프 선택 모드
- DoD: 컴포넌트·헤더/푸터 IA 부록 + 발동 규칙(요청·대규모만) 배포, 게이트 양방향 판정.
- Evidence: changesets/20260719-deep-brief/README.md, docs/design-system/design-brief.md
- Gap: 세분화 수요(사용자) vs 질문 피로 — 선택 모드로 양립 (사용자 확정)
- Scale: changesets>=2; surfaces: ui.askewly.com, 스튜디오; capability: 선택형 정밀 브리프
- Status: [x]

- Completed at: 2026-07-19
- Summary: 딥 브리프 선택 모드 배포 — 발동 2경로 명문, 기본 게이트 불변
<!-- harness:milestone id="DB1" status="completed" priority="P0" evidence="changesets/20260718-design-brief-contract/README.md, docs/design-system/design-brief.md" -->
### DB1 — 브리프 계약 정본 + 프로토콜 배선
- DoD: design-brief.md(규모 게이트·7도메인·DESIGN.md 계약·headless 폴백)가 llms 배포되고 entry-protocol이 브리프 단계를 지시한다.
- Evidence: changesets/20260718-design-brief-contract/README.md, docs/design-system/design-brief.md
- Gap: 무토큰 프로젝트의 룩 소유권을 만드는 절차 부재 — 에이전트 추정으로 메움(진주 만두 실증)
- Scale: changesets>=2; surfaces: ui.askewly.com curl; capability: 브리프 계약 정본
- Status: [x]

- Completed at: 2026-07-18
- Summary: 브리프 계약 4절 정본 + 프로토콜 0.5단계 배선, llms 59자산 배포
<!-- harness:milestone id="DB2" status="completed" priority="P0" evidence="changesets/20260718-brief-skill-e2e/README.md, evidence/design-brief/flower-DESIGN.md" -->
### DB2 — skill 개정 + E2E
- DoD: skill이 브리프 단계를 안무하고, E2E로 생략(소형)·발동(신규 화면)·파생(DESIGN.md 존재) 3경로가 관측된다.
- Evidence: changesets/20260718-brief-skill-e2e/README.md, evidence/design-brief/flower-DESIGN.md
- Gap: 계약이 실제 흐름에서 도는지 검증 필요(SE2 교훈: 1차 미발화)
- Scale: changesets>=2; surfaces: headless 세션 2 + 대화형 실연; capability: 브리프 흐름 실증
- Status: [x]

- Completed at: 2026-07-19
- Summary: skill 브리프 배선 + E2E 3경로(생략·발동·파생) 전부 관측 — 대화형 실연 포함
<!-- harness:milestone id="SE1" status="completed" priority="P0" evidence="changesets/20260718-askewly-design-skill/README.md" -->
### SE1 — skill 신설 + 프로토콜 사람 게이트 개정
- DoD: entry-protocol에 스크린샷+사람 확인 게이트가 배포 반영되고, askewly-design skill이 Claude·Codex 양쪽에 배포된다.
- Evidence: changesets/20260718-entry-protocol-human-gate/README.md, changesets/20260718-askewly-design-skill/README.md
- Gap: 자가 판정만으론 상한 보증 없음(사람 눈 부재) + 전역 규칙 진입은 비결정적(AD1 실측)
- Scale: changesets>=2; surfaces: ui.askewly.com curl, skill 배포처 2곳; capability: 사람 게이트 내장된 skill 진입 경로
- Status: [x]

- Completed at: 2026-07-18
- Summary: entry-protocol 사람 게이트 배포 + askewly-design skill Claude·Codex 배포
<!-- harness:milestone id="SE2" status="completed" priority="P0" evidence="changesets/20260718-global-routing-removal/README.md, changesets/20260718-skill-entry-e2e/README.md" -->
### SE2 — 전역 규칙 제거 + E2E 검증
- DoD: 양 전역 파일에서 "디자인 판정" 절 제거(grep 0) + headless E2E로 skill 발화·스크린샷 산출 관측.
- Evidence: changesets/20260718-global-routing-removal/README.md, changesets/20260718-skill-entry-e2e/README.md
- Gap: 전역 절은 모든 세션에 주입되는 noise — skill 단일 경로로 대체 (사용자 확정: 완전 제거)
- Scale: changesets>=2; surfaces: 전역 파일 2개, headless Claude/Codex 세션; capability: skill 단일 진입 경로 실증
- Status: [x]

- Completed at: 2026-07-18
- Summary: 전역 절 제거(grep 0) + 양 에이전트 E2E skill 발화·스크린샷 관측 (1차 FAIL→교정→PASS)
## 유지보수 후보 (milestone 아님)

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; Public Product & Monetization parked 2026-07-17 (PX completed), Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
