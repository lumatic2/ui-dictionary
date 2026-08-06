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

## Changelog — 2026-08-01 재동기화 (M14 step-2)

SSOT 드리프트(M2 emphasis·status + M6 타이포 스케일 등) 반영 재실행. 스크립트 보수 2건 선행: ① rem→px ×16 환산(`'unit' in val` 분기가 px/rem 미구분이던 결함 — fresh 검증자 적발) ② 신규 경로 scope 등재(`dimension/size`→WIDTH_HEIGHT, `dimension/z-index`·`motion/duration`→`[]` 비노출).

| 실행 | 컬렉션 | created | updated | removed | unresolved |
|---|---|---|---|---|---|
| 1차 | `askewly/primitive` | **35** | 38 | 0 | — |
| 1차 | `askewly/semantic` | **18** | 21 | 0 | 0 |
| 2차 (idempotency) | `askewly/primitive` | **0** | 73 | 0 | — |
| 2차 (idempotency) | `askewly/semantic` | **0** | 39 | 0 | 0 |

- 총 73 primitive + 39 semantic/component alias (7월: 38+21).
- rem 표본 대조 PASS: `typography/scale/2xs`=10 · `xs`=12 · `3xl`=30 · `5xl`=48 · `7xl`=72 (rem×16), `base`=16 · `touch-target-min`=44 · `motion/duration/overlay`=200 (원값 유지).

## 남긴 것 / 후속

- 재동기화 절차: SSOT 변경 → 1~2번 재실행 (upsert라 안전, `askewly/*` 컬렉션 밖은 절대 안 건드림)
- typography/dimension은 primitive 컬렉션에 FLOAT/STRING으로 들어감 — Figma 쪽 number/string 변수로 spacing·radius·font-size 바인딩 가능
- 후속 후보(horizon 밖): figma-codex-workflow 스킬 갱신 3건(계약 §5), Figma→코드 역방향 실증

## Changelog

- **2026-08-06 (M35)**: 생성기 3건 추가. ① 계약 §2.2 변수 `description` 복사 구현(7월부터 미구현) — SSOT `$description` 이 없거나 빈 값이면 **필드를 생략**해 사람이 Figma 에 적어 둔 설명을 덮지 않는다. 실측: primitive 74종 중 5종만 description 보유(69종 생략), 빈 문자열 0건. ② `--read` — `askewly/*` 의 현재 변수를 뜨는 **쓰기 0** 페이로드(`setValueForMode`·`remove`·`createVariable`·`renameMode`·`addMode` 전부 0건 확인). upsert 가 되돌리기 어려운 만큼 쓰기 전 스냅숏 근거로 쓴다. ③ `--no-remove` — 계약 §2.4 의 orphan 삭제를 끄는 스위치(기본값은 계약대로 삭제). 켜면 페이로드에 `v.remove()` 0건, orphan 은 목록 보고만.
  - **직렬화 함정 폐구**: `JSON.stringify` 가 U+2028/U+2029 를 날것으로 내보낸다 — JS 소스로는 합법이나 `use_figma` 파서가 줄바꿈으로 읽어 SyntaxError(M14 실측). 직렬화 지점에서 이스케이프하도록 고쳤고, `$description` 에 따옴표·LF·U+2028·U+2029·백슬래시를 넣은 픽스처로 **재현 → 폐구 → 값 무손실 복원**까지 확인했다.
