# ROADMAP

> Last updated: 2026-07-17
> Status: Expressive Stack — VI1 활성 (agent-adoption-loop closed 2026-07-17, monetization은 parked — `docs/horizons/CANDIDATES.md`)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="expressive-stack" status="active" -->
Goal: 화면에 그려지는 시각 표현 대다수를 4개 렌더링 티어(CSS·SVG/모션/Canvas/WebGL)로 계보화하고, 에이전트가 티어를 판정해 구현할 수 있는 recipe·knowledge를 정본화한다. Details: `docs/horizons/2026-07-expressive-stack.md`.

## Active Milestones

<!-- harness:milestone id="VI1" status="completed" priority="P0" evidence="docs/plans/2026-07-17-vi1-expressive-stack-map.md" -->
### VI1 — 표현 스택 지도
- DoD: 4개 렌더링 티어(CSS·SVG/모션 오케스트레이션/Canvas 2D·물리/WebGL·three.js) 기법 계보 리서치(전 항목 출처 URL+접근일) + 기법→티어 결정 표 + `knowledge/expressive-stack.md` 정본이 llms.txt에 노출되어 배포 curl로 확인되고, 자체 쇼케이스 12종의 티어 역산이 포함된다.
- Evidence: docs/plans/2026-07-17-vi1-expressive-stack-map.md
- Gap: "이 효과는 뭘로 만드나"를 판정할 지식이 시스템에 없음 — 사용자도 에이전트도 티어 구분 불가(2026-07-17 실질 수요).
- Scale: changesets>=2; surfaces: llms.txt fetch, knowledge 정본; capability: 기법→티어 판정 지식
- Status: [x]

- Completed at: 2026-07-17
- Summary: 4티어 계보 리서치(30기법, 전 항목 출처) + 쇼케이스 12종 실코드 역산 + 기법→티어 결정 표 21행 knowledge 정본 llms 배포 — changesets #112–113
<!-- harness:milestone id="VI2" status="active" priority="P1" evidence="docs/plans/2026-07-17-vi2-css-svg-recipes.md" -->
### VI2 — CSS·SVG 티어 recipes
- DoD: VI1 지도에서 선정한 선언 티어 기법이 recipe + Gallery live 데모로 구현되어 기존 검증 체인(validate-recipes·build·llms.txt·배포 curl)을 통과.
- Evidence: 활성화 시 plan doc + changeset 추적
- Gap: 선언 티어 고급 기법(gradient mesh·mask·SVG 필터 등) recipe 0건.
- Scale: changesets>=2; surfaces: Gallery live-render, llms.txt; capability: 선언 티어 표현 recipe
- Status: [ ]

<!-- harness:milestone id="VI3" status="pending" priority="P1" -->
### VI3 — 모션 오케스트레이션 티어 recipes
- DoD: 커서 반응·스프링·모션 안무 recipe가 live 데모로 검증 체인 통과 + 시그니처 원칙 5("실험적 터치는 수동")와의 접점이 recipe마다 명시.
- Evidence: 활성화 시 plan doc + changeset 추적
- Gap: JS 지휘+CSS 렌더 티어의 판단 기준·recipe 부재 — 쇼케이스에 구현물은 있으나 계약이 없음.
- Scale: changesets>=2; surfaces: Gallery live-render, llms.txt; capability: 모션 티어 표현 recipe
- Status: [ ]

<!-- harness:milestone id="VI4" status="pending" priority="P1" -->
### VI4 — Canvas·WebGL·three.js 티어
- DoD: three.js/R3F 정식 도입 + canvas 2D·물리·셰이더 recipe가 live 데모로 검증 체인 통과, 무거운 데모는 dynamic import lazy-load 격리(현 3MB 청크 경고 비악화 — 사용자 GO 조건 2026-07-17).
- Evidence: 활성화 시 plan doc + changeset 추적 + 번들 크기 전후 비교
- Gap: GPU 티어 자산 0건 — three.js 미도입.
- Scale: changesets>=2; surfaces: Gallery live-render(lazy), 번들 계측; capability: GPU 티어 표현 recipe
- Status: [ ]

<!-- harness:milestone id="VI5" status="pending" priority="P2" -->
### VI5 — 부품 층 계약 + 레퍼런스 흡수
- DoD: shadcn 재스타일 가이드("shadcn 룩 탈출")가 llms 배포되고, 외부 라이브러리(react-bits·magicui·GSAP 등) 흡수 기준(recipe화 vs 링크)이 정본화되며 toolshelf used 기록이 남는다.
- Evidence: 활성화 시 plan doc + changeset 추적
- Gap: 부품 층을 프로젝트 토큰으로 재스타일하는 계약 부재 — "shadcn 룩" 동질화 미해소.
- Scale: changesets>=2; surfaces: llms.txt, toolshelf; capability: 부품 층 판단 주입
- Status: [ ]

## 유지보수 후보 (milestone 아님)

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; Public Product & Monetization parked 2026-07-17 (PX completed), Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
