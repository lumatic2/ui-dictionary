# ROADMAP

> Last updated: 2026-07-10
> Status: Agent Design CLI (active)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="agent-design-cli" status="active" -->
Goal: 디자인 시스템 SSOT를 로컬에서 질의·주입·검증하는 CLI `@askewly/design`을 `packages/cli`에 만들어 외부 프로젝트에서 조회→주입→검증 루프를 실증한다. Details: `docs/horizons/2026-07-agent-design-cli.md`. 직전 close: `docs/horizons/2026-07-docs-depth-page-examples.md`. 합의 시퀀스: CLI → 앱 → Docs (ADR 0004).

## Active Milestones

<!-- harness:milestone id="CLI1" status="completed" priority="P1" evidence="changesets/20260710-cli-core-query/README.md" -->
### CLI1 - 코어 조회 CLI + registry 계약
- DoD: packages/cli Node/TS 스캐폴드 + terms/tokens/recipes 질의 커맨드(SSOT 파생 데이터) + registry 계약 문서 + 로컬 npm pack 설치 E2E(실패 모드: 없는 항목 조회 시 명확한 에러·exit≠0) + 테스트.
- Evidence: changesets/20260710-cli-core-query/README.md
- Gap: 에이전트가 디자인 시스템을 소비할 로컬 인터페이스 부재 — llms.txt는 원격 정적 자산뿐, 질의·검증 엔진은 시장에도 공백 (market doc).
- Status: [x]

- Completed at: 2026-07-10
- Summary: 조회 CLI 3종+registry 계약 — pack fresh-env E2E·vitest 11 PASS
## Next Candidates

<!-- harness:milestone id="CLI2" status="completed" priority="P1" evidence="changesets/20260710-cli-inject/README.md" -->
### CLI2 - 프로젝트 주입 (init / add)
- DoD: init(DESIGN.md·tokens 생성)·add(레시피 소스 주입, semantic 토큰 참조 유지) 동작 + 외부 프로젝트 실증(색 리터럴 0) + 실패 모드(파일 충돌 등) 처리.
- Evidence: changesets/20260710-cli-inject/README.md
- Gap: 조회만으로는 에이전트 실용성 반쪽 — shadcn 모델의 핵심은 주입.
- Status: [x]

- Completed at: 2026-07-10
- Summary: init/add 주입 + askewly.css 테마 바인딩 — 외부 Vite 실증(토큰 렌더·hex 0)
<!-- harness:milestone id="CLI3" status="active" priority="P1" -->
### CLI3 - 검증 커맨드 + 패키지 공개
- DoD: verify(색·px 리터럴, primitive 직접 참조 lint, exit code 계약) + npm 퍼블리시(크레덴셜 발급 전 blocked) + npx 신규 환경 스모크.
- Evidence: CLI3 plan doc + changeset README + npm 페이지
- Gap: 구현물 판정 자동화 부재 + 배포 채널 부재.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (Docs Article Depth & Page Examples, Content Fill, Structure-First Buildout closed 2026-07-10; Figma Workflow, Figma Bridge, Public Site Shell, System Model Core, Agent Integration closed 2026-07-07).
