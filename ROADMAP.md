# ROADMAP

> Last updated: 2026-07-19
> Status: Recipe Code Reuse 제안(사용자 승인 대기) — 레시피 코드 자산화 + 스튜디오 연결 (사용자 발의 2026-07-19)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="recipe-code-reuse" status="active" -->
Goal: 사이트 레시피 데모 실구현을 registry 코드 자산으로 배포하고, 에이전트 코드 출발 계약과 스튜디오 구성↔레시피 매핑을 배선한다. Details: `plans/horizons/2026-07-recipe-code-reuse.md`.

<!-- harness:goal-archive4 id="studio-finish" status="completed" -->
Goal: 스튜디오 이월 갭 3건 마감 — 데이터 주도 주입 자동화·구성 패턴 완편(4유형+예약형)·미리보기 고도화(다크·반응형). Details: `plans/horizons/2026-07-studio-finish.md`.

<!-- harness:goal-archive3 id="cascade-studio" status="completed" -->
Goal: 스튜디오를 폭포식(영향순·캐스케이드 적용)으로 재구축하고 스크롤 추종 라이브 미리보기·영상 후보·카피/인터랙션 축을 더한다. Details: `plans/horizons/2026-07-cascade-studio.md`.

<!-- harness:goal-archive2 id="studio-depth" status="completed" -->
Goal: 브리프 스튜디오를 시니어 디자이너의 결정 공간 전체로 확장한다 — 스타일 타일 2단 구조·축 14종·후보 6~8 추천순·실사 이미지(Pexels+생성). Details: `plans/horizons/2026-07-studio-depth.md`.

<!-- harness:goal-archive id="visual-brief" status="completed" -->
Goal: 브리프 선택을 실물 보기(폰트·컬러·인터랙션 스튜디오)로 올리고, 결과물 크롬 상시 표시 게이트와 Stitch 양식 정합, 딥 브리프 선택 모드를 더한다. Details: `plans/horizons/2026-07-visual-brief.md`.

## Active Milestones

<!-- harness:milestone id="RC1" status="active" priority="P0" -->
### RC1 — 코드 자산 registry 파이프라인
- DoD: 순수 데모 ≥12개 shadcn registry 호환 빌드·전수 curl + 깨끗한 새 프로젝트 이식 1건 실구동 + 실패 모드 2종(미선언 의존·결합 자산) 거부.
- Evidence: `plans/2026-07-19-rc1-registry-pipeline.md`, `evidence/recipe-code-reuse/`
- Gap: 레시피 42종이 문서로만 배포 — 동작하는 구현 코드의 재사용 경로 부재 (사용자 발의)
- Scale: changesets>=2; surfaces: 로컬 빌드·curl, 새 Vite 프로젝트 실구동; capability: 배포 가능한 코드 자산 계층
- Status: [ ]

<!-- harness:milestone id="RC2" status="pending" priority="P0" -->
### RC2 — 코드 출발 계약 + 에이전트 E2E
- DoD: 계약 4문서에 코드 출발 경로(fetch→이식→토큰 리맵→Checks) 배포 + headless E2E 1회 관측(리맵 확인).
- Evidence: `plans/2026-07-19-rc2-code-first-contract.md`, `evidence/recipe-code-reuse/`
- Gap: 코드가 있어도 계약이 문서-재구현만 지시하면 소비 안 됨 + 리맵 생략 시 shadcn 표정 고착 (프리모템 2)
- Scale: changesets>=2; surfaces: ui.askewly.com curl, headless 세션; capability: 코드 출발 소비 경로 실증
- Status: [ ]

<!-- harness:milestone id="RC3" status="pending" priority="P1" -->
### RC3 — 스튜디오 구성 ↔ 레시피 매핑
- DoD: 구성 13항 매핑 전수 + 수집 JSON 노출 실측 + 계약 배선(DESIGN.md 저장→구현 지시) 배포.
- Evidence: `plans/2026-07-19-rc3-composition-recipe-map.md`, `evidence/recipe-code-reuse/`
- Gap: 구성 선택과 레시피 구현이 단절된 별개 축 (프리모템 3: 표만 있으면 장식으로 남음)
- Scale: changesets>=2; surfaces: 로컬 스튜디오 실구동, ui.askewly.com curl; capability: 브리프→구현 출발점 배선
- Status: [ ]

<!-- harness:milestone id="RC4" status="pending" priority="P1" -->
### RC4 — 통합 실연 (스튜디오→코드 조합→리스타일)
- DoD: 실의뢰 1건 전 루프(스튜디오→매핑→fetch·조합→리스타일→실물 게이트) 관측 + Close Criteria 5항 대조 → horizon close.
- Evidence: `plans/2026-07-19-rc4-integrated-demo.md`, `evidence/recipe-code-reuse/`
- Gap: 루프가 실사용감으로 검증돼야 close (SE2·ST4 교훈)
- Scale: changesets>=2; surfaces: 대화형 실연·실물 브라우저; capability: 코드 재사용 루프 실증
- Status: [ ]

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
