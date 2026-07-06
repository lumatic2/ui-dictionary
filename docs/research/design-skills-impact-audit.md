# 디자인 스킬 영향 감사 — 토큰 SSOT 전환

Date: 2026-07-07
Milestone: SMC1 Step 4 (plan: `docs/plans/2026-07-07-token-ssot.md`)
Method: sonnet 조사 에이전트가 `~/projects/custom-skills`의 design-* 스킬 4개를 감사, Fable 게이트 판정.

## 배경

ui-dictionary가 `tokens/askewly.tokens.json`(DTCG)을 정본으로 세우면서 DESIGN.md는 **생성되는 파생물**이 된다. 기존 스킬 생태계는 반대 방향 — DESIGN.md가 손으로 쓰는 정본이고 CSS가 파생물(`design-manual` 레포의 `build.js`/`lint`) — 을 전제한다.

## 구조적 발견

- 스킬 4개(design-bootstrap/bridge/harness/screen)는 전부 **`~/projects/design-manual` 레포의 스크립트를 감싸는 얇은 래퍼**다. 충돌의 뿌리는 스킬이 아니라 design-manual의 "DESIGN.md→CSS" 파이프라인 방향.
- ui-dictionary에는 과거 design-bootstrap이 남긴 `.design-harness.json`이 이미 존재 — 충돌은 가설이 아니라 현재형.
- design-consultation/design-qa는 custom-skills가 아니라 외부(gstack) 소스 — 이번 범위 밖.

## 판정 (최종)

| 스킬 | 충돌 | 판정 | 조치 |
|---|---|---|---|
| **design-bootstrap** | 강함 — DESIGN.md를 손편집 정본으로 생성·재검증하는 전체 흐름 | **keep (범용) + guard 추가** | 그린필드 프로젝트용으로 유지. SKILL.md에 "자체 토큰 SSOT(tokens/*.tokens.json)가 있는 프로젝트에서는 실행 금지 — DESIGN.md가 파생물이므로 덮어쓰면 파괴" guard 문단 추가. ui-dictionary에서의 재실행은 금지 |
| **design-bridge** | 약함 — CSS 변수 네이밍 규약 의존(미대조) | **keep** | 유지. ui-dictionary 토큰을 brownfield에 이식할 때 `generate-tokens.mjs` 출력 네이밍과 매핑표 대조 후 필요 시 갱신 |
| **design-harness** | §4 propagate만 강함 — 역방향 파이프라인 | **fix (§4 분기) / keep (§1–3)** | §4 propagate에 분기 추가: 프로젝트에 토큰 SSOT가 있으면 `design-manual build.js` 대신 그 프로젝트의 generate 스크립트를 호출하도록 안내. DesignSync/Codebase/convert는 그대로 |
| **design-screen** | 약함 — "DESIGN.md=정본" 문구, lint 경로 | **fix (경미)** | §2 원칙 문구를 "정본은 토큰 SSOT, DESIGN.md는 파생물일 수 있음 — SSOT가 있으면 SSOT 기준" 으로 갱신, §5 lint 호출을 프로젝트별 lint(우리는 `scripts/lint-tokens.mjs`)로 정정 |

## 원칙

**스킬을 ui-dictionary에 맞춰 폐기하지 않는다** — 범용(그린필드) 용도와 ui-dictionary 전용 용도를 분리하고, SSOT 보유 프로젝트 감지 시 동작을 바꾸는 guard/분기로 해결한다. SSOT 감지 규약: 프로젝트 루트에 `tokens/*.tokens.json`이 존재하면 DESIGN.md를 파생물로 취급.

## 실행 계획 (별도 작업 — custom-skills 레포)

1. design-bootstrap SKILL.md guard 문단 (문서 수정만)
2. design-harness §4 SSOT 분기 (문서 수정만)
3. design-screen §2/§5 문구·경로 정정 (문서 수정만)
4. `bash ~/projects/custom-skills/setup.sh` 재배포
5. (후속 확인) design-manual 레포 자체의 SSOT 지원 여부는 별도 판단 — 이번 범위 밖

## 미확인

- design-bridge 매핑표와 `generate-tokens.mjs` 출력 네이밍 대조
- `npm run lint:design` 스크립트의 실제 구현 (design-screen §5 경로)
- design-manual `schema/design-md.schema.json`과 새 frontmatter 생성물의 호환성
