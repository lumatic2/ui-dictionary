# ADR 0003 — Figma 브리지: 원격 MCP 주력 채널 + Figma variables는 파생 아티팩트

Date: 2026-07-07
Status: accepted
Context milestone: FB2 (`docs/horizons/2026-07-figma-bridge.md`)

## Context

Askewly Design은 `tokens/askewly.tokens.json`을 토큰 SSOT로 갖고, 디자이너 표면(Figma)에서도 같은 토큰을 쓸 수 있어야 한다. FB1 실측(`docs/research/figma-capability-map-2026-07.md`)으로 접근 경로 6개의 실제 능력이 확정됐다: REST variables API는 Enterprise 전용 + PAT 스코프 부족, 로컬 Dev Mode MCP는 플랜/계정 게이트, 원격 claude.ai Figma MCP의 `use_figma`(Plugin API JS)는 variables 생성·모드값 설정·노드 바인딩까지 전부 동작.

## Decision

1. **동기화 채널 = 원격 claude.ai Figma MCP `use_figma`.** chrome-ext 실 UI는 fallback, REST·플러그인 경로는 제외.
2. **방향 = Askewly → Figma 단방향 동기화.** Figma variables는 SSOT의 파생 아티팩트다. Figma에서의 수정은 SoT가 아니며 다음 push가 덮어쓴다. 역방향은 근거 기반 흡수 절차(레퍼런스 루프)만 허용.
3. **매핑 = 컬렉션 2개**(`askewly/primitive` 단일 모드, `askewly/semantic` light/dark) + **variable alias로 3-tier 보존**, 변수 이름은 DTCG 경로 그대로(점→슬래시).
4. **idempotent upsert** — 이름 키 upsert, 자기 소유 컬렉션 안에서만 삭제, 재실행 no-op 검증을 FB3 DoD로 한다.

## Consequences

- (+) 플랜·과금 게이트 없이 동기화 가능 (Enterprise REST 불필요, 플러그인 제작 불필요).
- (+) 에이전트가 코드 토큰명과 Figma 변수명을 문자열 일치로 대조 가능 — figma-codex-workflow 규칙과 정합.
- (−) 원격 MCP OAuth 계정(yusung345@g.skku.edu)이 닿는 파일에만 동기화 가능 — 대상 파일 위치가 계정 경계에 종속 (계약 §1).
- (−) claude.ai 커넥터 가용성에 의존 — 커넥터 장애 시 chrome-ext fallback은 수동성이 높다.
- oklch 원시값은 sRGB로 변환되어 들어간다 — Figma 표면에서는 근사값 (SSOT가 정본이므로 허용).

세부 규약(이름·타입·scopes·삭제 규칙)은 `docs/design-system/figma-bridge-contract.md`가 정본.
