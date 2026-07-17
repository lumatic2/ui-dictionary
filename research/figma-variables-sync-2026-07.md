# FB3 실증 기록 — Askewly 토큰 → Figma variables

Date: 2026-07-07
Milestone: FB3 (horizon: `docs/horizons/2026-07-figma-bridge.md`)
계약: `docs/design-system/figma-bridge-contract.md` §2 (ADR 0003)

## 대상 파일

- **"Askewly Design Tokens"** — `create_new_file`로 어스큐리 팀(SKKU 계정 `yusung345@g.skku.edu`)에 생성
- fileKey: `xY42P22E7CtnvuxX8ZzZec` · URL: https://www.figma.com/design/xY42P22E7CtnvuxX8ZzZec

## 절차 (재실행 가능)

1. `node scripts/generate-figma-variables-sync.mjs` — SSOT(`tokens/askewly.tokens.json`)를 읽어 `tmp/figma-sync-1-primitive.js`, `tmp/figma-sync-2-semantic.js` 페이로드 생성 (oklch→sRGB 변환, scopes 매핑, 계약 §2.2 이름 규칙)
2. 원격 claude.ai Figma MCP `use_figma`로 페이로드 1 → 2 순차 실행 (호출 전 `skill://figma/figma-use/SKILL.md` 로드)
3. 동일 페이로드 재실행으로 idempotency 검증

## 실행 결과 (2026-07-07)

| 실행 | 컬렉션 | created | updated | removed | unresolved |
|---|---|---|---|---|---|
| 1차 | `askewly/primitive` (mode: default) | **38** | 0 | 0 | — |
| 1차 | `askewly/semantic` (modes: light/dark) | **21** | 0 | 0 | 0 |
| 2차 (idempotency) | `askewly/primitive` | **0** | 38 | 0 | — |
| 2차 (idempotency) | `askewly/semantic` | **0** | 21 | 0 | 0 |

- **이름 보존**: 변수 이름 = DTCG 경로 그대로 (`color/semantic/surface/base` 등 59개 전부) ✅
- **3-tier 보존**: semantic 21개(component 2개 포함)의 light/dark 값 전부 primitive/semantic 변수 **alias** — 값 복사 없음 ✅
- **idempotent**: 재실행 시 created 0 / removed 0 ✅ (계약 §2.4)
- dark 모드 `addMode` 성공 — student(Education) tier에서 멀티모드 게이트 없음

## 소비 실증 (디자이너 표면)

데모 프레임 "askewly token demo" (node `2:2`): light/dark 카드 2장 — `setExplicitVariableModeForCollection`으로 모드 분기, `surface/base` fill·`border/default` stroke·`text/default`/`text/muted`·`button/bg`/`button/text` 바인딩. 스크린샷으로 모드별 alias 해석 확인(light=흰 surface+violet 버튼, dark=gray/12 surface+gray/1 버튼 — SSOT dark 값 그대로).

## 남긴 것 / 후속

- 재동기화 절차: SSOT 변경 → 1~2번 재실행 (upsert라 안전, `askewly/*` 컬렉션 밖은 절대 안 건드림)
- typography/dimension은 primitive 컬렉션에 FLOAT/STRING으로 들어감 — Figma 쪽 number/string 변수로 spacing·radius·font-size 바인딩 가능
- 후속 후보(horizon 밖): figma-codex-workflow 스킬 갱신 3건(계약 §5), Figma→코드 역방향 실증
