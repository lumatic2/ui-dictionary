# Plan - CLI1 코어 조회 CLI + registry 계약

Date: 2026-07-10
Milestone: CLI1 (`ROADMAP.md`, active)

## 위계

- Objective: `docs/OBJECTIVE.md` — 장기 아크 5 "에이전트 통합"
- Horizon: `docs/horizons/2026-07-agent-design-cli.md` (active) — 시퀀스 CLI → 앱 → Docs (ADR 0004)
- Milestone: CLI1 — 코어 조회 CLI + registry 계약
- 시장 근거: `docs/market/2026-07-10-agent-design-cli.md` (질의·검증 엔진 공백, shadcn registry 스키마)

## Scope

이번 milestone: `packages/cli`에 `@askewly/design`(바이너리 `askewly-design`) Node/TS CLI를 세우고 조회 3종(`terms`/`tokens`/`recipes`)과 registry 계약 문서까지. 주입(init/add)은 CLI2, 검증(verify)·npm publish는 CLI3 범위 밖.

데이터 소스(SSOT 파생, 발명 금지): `docs/ui-vocabulary/terms.yml`(+생성 데이터), `tokens/askewly.tokens.json`, `recipes/*/*.md`, `docs/design-system/recipe-format.md`. 빌드 시점 파싱 vs 패키지에 데이터 번들 — 번들 방식(오프라인 동작, npm pack에 포함)을 기본으로 하되 Step 1에서 확정.

중단점: ① SSOT 스키마와 어긋나는 가공이 필요하면 blocked ② push는 세션 일괄.

## Step 트리

- [ ] Step 1 — CLI 스캐폴드 + 데이터 파이프: packages/cli(TS, commander 계열), SSOT → 번들 데이터 생성 스크립트(기존 build-ui-vocabulary-data.mjs 재사용 검토), `--version`/`--help` 동작. (verify: 로컬 빌드 + 바이너리 실행)
- [ ] Step 2 — 조회 커맨드 3종: `terms search|show`, `tokens [--tier|--format css|json]`, `recipes list|show` — 사람용 출력 + `--json`(에이전트용). 없는 항목 조회 시 명확한 에러 + exit≠0 (실패 모드). (verify: 커맨드별 실행 출력 + exit code 관측)
- [ ] Step 3 — registry 계약 문서: `docs/design-system/cli-registry-contract.md` — 자산 경로·버전 규약·shadcn registry-item 스키마 대응 관계(CLI2 add의 입력 계약). (verify: 문서가 실존 자산 경로만 참조)
- [ ] Step 4 — 패키징 E2E + 테스트: `npm pack` → 별도 임시 디렉터리 설치 → 조회 3종 + 실패 모드 재실행, 단위 테스트(파서·exit code). (verify: pack 설치 E2E 출력 기록 + 테스트 PASS)

## 결정 로그

- [확정 2026-07-10] 시퀀스 CLI→앱→Docs, 범위 조회+주입+검증(3 milestone), 이름 `@askewly/design`/`askewly-design`, 위치 packages/cli (사용자 확정, ADR 0004).
- [확정 2026-07-10] CLI 1차 인터페이스, MCP 보류 (ADR 0004).
- [AI 기본값] TS + commander 계열 + 데이터 번들 방식, 테스트는 vitest — 구현 중 합리 범위에서 조정 가능.
- [사용자 소유 — 예정] npm publish 크레덴셜은 CLI3에서 필요(BLOCKED until 발급). CLI1은 pack 검증까지라 불요.
- 그 외 예상 결정: 없음.
