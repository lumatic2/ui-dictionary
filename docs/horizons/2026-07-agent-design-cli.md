# Horizon - Agent Design CLI

Date: 2026-07-10
Status: active

## Goal

디자인 시스템 SSOT(tokens·terms 536·recipes)를 로컬에서 질의·주입·검증하는 에이전트/개발자용 CLI `@askewly/design`(바이너리 `askewly-design`)을 이 레포 `packages/cli`에 만들어, 외부 프로젝트에서 조회 → 주입 → 검증 루프가 실제로 도는 상태로 만든다. CLI는 후속 데스크톱 앱(H2)의 코어 엔진이 된다.

## Why Now

콘텐츠 저작으로 닫히는 갭이 소진됐고(직전 horizon close, `docs/roadmap-gap-2026-07-10-c.md`), 남은 미공개 표면(Pro 에셋·Download 앱)은 실물 제품이 선행돼야 한다. 시장 조사(`docs/market/2026-07-10-agent-design-cli.md`)가 확인한 것: ① 토큰 도구 시장에 질의·검증 엔진이 공백 ② shadcn registry "소스 복사 주입" 모델이 검증됨 ③ 에이전트 소비는 CLI-first가 업계 정서(MCP 토큰비용 4-32배). 결정 기록: `docs/adr/0004-agent-design-cli.md`. 합의된 시퀀스: **H1 CLI(이번) → H2 데스크톱 앱(CLI 엔진의 GUI, OS-레벨 기능 필수) → H3 Docs(설치법·사용법·Principles)**.

## Milestones

### CLI1 - 코어 조회 CLI + registry 계약

DoD: `packages/cli`에 Node/TS CLI 스캐폴드 + `terms`(검색/상세)·`tokens`(tier/포맷별 출력)·`recipes`(목록/상세) 질의 커맨드가 SSOT 파생 데이터로 동작 + registry 계약 문서(shadcn registry-item 스키마 참조, 자산 경로·버전 규약) + 로컬 `npm pack` 설치 E2E(실패 모드: 없는 term/recipe 조회 시 명확한 에러·exit≠0) + 테스트.

Evidence: CLI1 plan doc + changeset README + E2E 출력 기록.

### CLI2 - 프로젝트 주입 (init / add)

DoD: `init`(대상 프로젝트에 DESIGN.md·tokens 산출물 생성)과 `add <recipe>`(레시피 소스 주입, semantic 토큰 참조·anti-pattern 노트 포함)가 동작하고, 외부 프로젝트 1곳에서 실증(AG3 패턴 — 주입 결과물이 색 리터럴 0으로 렌더) + 실패 모드(비-git 디렉터리, 기존 파일 충돌) 처리.

Evidence: CLI2 plan doc + changeset README + 외부 실증 기록.

### CLI3 - 검증 커맨드 + 패키지 공개

DoD: `verify`(색 hex/px 리터럴·primitive 직접 참조 lint, exit code 계약)가 동작 + npm `@askewly/design` 퍼블리시(사용자 npm 크레덴셜 필요 — 발급 전 blocked) + `npx askewly-design` 신규 환경 스모크 + llms.txt/사이트 연결 지점 기록(문서 심화는 H3).

Evidence: CLI3 plan doc + changeset README + npm 페이지·신규 환경 스모크.

## Close Criteria

외부 프로젝트에서 `npx askewly-design`으로 조회 → 주입 → 검증 루프 1회가 end-to-end로 실증되고, 패키지가 npm에 공개된 상태 (npm 크레덴셜 미발급 시 pack 기반 실증 + publish는 blocked 기록으로 부분 close 판정).

## Backlinks

- Objective: `docs/OBJECTIVE.md` (장기 아크 5 "에이전트 통합", 이동 축 "구현 가능한 코드·에셋·에이전트 가이드로")
- 직전 horizon: `docs/horizons/2026-07-docs-depth-page-examples.md` (closed 2026-07-10)
- 시장 재료: `docs/market/2026-07-10-agent-design-cli.md`
- 결정 기록: `docs/adr/0004-agent-design-cli.md`
- Gap report: `docs/roadmap-gap-2026-07-10-c.md`
