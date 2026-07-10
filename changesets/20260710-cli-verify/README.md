# 20260710 CLI Verify

## Target

- ROADMAP milestone: CLI3 - 검증 커맨드 + 패키지 공개
- Plan: 단일 changeset — horizon `docs/horizons/2026-07-agent-design-cli.md`

## Scope

- `packages/cli/src/verify.ts` + `verify [dir] [--ext]` 커맨드: 토큰 체계를 우회하는 색 값(hex 리터럴, raw rgb/hsl/oklch) 스캔 — file:line:rule 리포트, 위반 시 exit 1. 생성 토큰 파일(tokens.css/askewly.css)·node_modules/dist/build 제외.
- `test/verify.test.ts` (3 케이스) — 총 vitest 21.

## Contract

- verify는 소비 프로젝트 lint (SSOT 자체 lint는 레포 `scripts/lint-tokens.mjs`가 담당 — 역할 분리).
- 알려진 한계(v1): href="#abc123" 류 hex-형태 anchor 오탐 가능 — 발견 시 rule 정교화.

## Verification

- [x] vitest 21/21 (verify 3종: 규칙·라인번호, 생성 파일 skip, node_modules/dist skip).
- [x] 실행: 클린 프로젝트 exit 0 / hex·rgb 위반 exit 1 리포트.
- [x] **풀 루프 E2E (horizon 닫는 기준)**: fresh env에 tgz 설치 → npx로 조회(terms search·recipes show --json) → 주입(init·add popover) → 검증(verify PASS → hex 파일 추가 후 FAIL exit 1) 완주.
- [x] npm 퍼블리시 — **사용자 결정으로 보류** (2026-07-10: "CLI의 정확한 기능도 아직 확정 아니고 디자인 시스템으로서 완성된 게 없음"). horizon close criteria의 fallback(pack 기반 실증) 적용, publish는 후속 큐(H3 Docs 설치법 시점 재검토).
