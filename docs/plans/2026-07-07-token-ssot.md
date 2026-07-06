# SMC1 - 토큰 시스템 SSOT 구현 계획

Date: 2026-07-07
Status: active
Milestone: SMC1 (horizon `system-model-core` — `docs/horizons/2026-07-system-model-core.md`)
Objective: `docs/OBJECTIVE.md`
설계 입력: `docs/market/design-system-format-survey.md` 채택 기준 A-1~A-5, C-9

## 목적

토큰이 DESIGN.md frontmatter(수기)·site index.css(하드코딩)·산문 문서에 흩어져 정본이 없는 상태를 끝낸다. `tokens/askewly.tokens.json`을 유일한 기계 가독 SSOT로 세우고, DESIGN.md와 사이트 CSS를 파생물로 재정의하며, 3-tier 규칙을 lint로 강제한다.

## Step 트리

- [x] Step 1 - 토큰 SSOT 파일: `tokens/askewly.tokens.json` — 12-step primitive 규약(용도 고정), semantic light/dark 분기, component 최소 토큰. (verify: lint 92 checks PASS ✓)
- [x] Step 2 - lint 스크립트 `scripts/lint-tokens.mjs`: 단방향 참조·orphan·WCAG contrast. (verify: PASS + 고의 tier 위반 주입 시 FAIL exit 1 확인 ✓)
- [x] Step 3 - 파생 파이프라인 `scripts/generate-tokens.mjs`: SSOT → DESIGN.md frontmatter + tokens.css 생성, index.css 배선. (verify: build/lint PASS + Chrome smoke — `docs/research/assets/smc1-token-ssot-2026-07-07/landing-light.png`, 의도된 색 이동(primary/ring/accent)만 확인 ✓)
- [ ] Step 3b - 하드코딩 hex 치환: home-page.tsx/App.tsx 등 브랜드 hex 90+건을 토큰 유틸리티로 치환 (opacity modifier 건별 검토). (verify: grep 하드코딩 잔존 0 목표 + build + Chrome smoke)
- [x] Step 4 - custom-skills 디자인 스킬 영향 감사 → `docs/research/design-skills-impact-audit.md` (판정: 폐기 없음, guard/분기/문구 fix — 실제 스킬 수정은 후속) (verify: 스킬별 판정+근거 완비 ✓) (artifact: analysis): `~/projects/custom-skills`의 design-bootstrap/design-harness/design-bridge/design-consultation 등이 "DESIGN.md=SSOT" 전제를 어디서 쓰는지 조사해 fix/deprecate/keep 분류표 작성 → `docs/market/../` 아님, `docs/research/design-skills-impact-audit.md`. 실제 스킬 수정은 별도 작업(custom-skills 레포)으로 분리. (verify: 스킬별 판정+근거 행 완비)

## 결정 로그

1. **SSOT 포맷/위치**: DTCG-호환 JSON, `tokens/askewly.tokens.json` (stable 2025.10 기능만) — 채택.
2. **primitive gray scale**: 기존 6단(50~900)을 12-step Radix식 용도 규약으로 확장. semantic 계층이 컴포넌트를 차폐하므로 마이그레이션은 semantic 매핑 갱신으로 국소화 — 채택.
3. **dark mode**: semantic 계층 오버라이드 맵(`$extensions` 또는 병렬 그룹 — Step 1에서 구조 확정, M3 sys 모델) — 채택.
4. **사이트 정렬**: SSOT에서 생성한 `tokens.css`를 사이트가 import. index.css의 손 토큰은 생성물 참조로 치환 — 채택.
5. **custom-skills 수정 범위**: SMC1은 감사·분류만. 실제 수정/폐기는 audit 결과를 보고 별도 작업으로 — 채택 (사용자 지시 2026-07-07: "고치거나 폐기해야 함" — audit이 그 결정 재료).

### 사이트 실태 조사(2026-07-07) 반영 결정

6. **primary 보라 정본 = 브랜드 hex `#6F2DBD`** (askewly.violet). 사이트 `--primary`(oklch 276)는 SSOT 파생으로 교체 — 사용자 추출 팔레트가 정본, 버튼/링 색 미세 이동은 Chrome smoke로 확인.
7. **radius 정본 = 코드 현행값** (sm4/md6/lg8/xl12, base 0.5rem). DESIGN.md frontmatter를 코드에 맞춰 갱신 (PSS1 시각 승인 상태 유지).
8. **gray primitive = 사이트의 보랏빛 그레이(hue 270)를 12-step ramp로 정식화**. 기존 semantic 값들이 ramp의 특정 step에 정확히 앉도록 anchoring.
9. **`.dark` 블록은 생성하되 비활성** (토글 미구현 상태 유지) — 다크는 SSOT에 정의만, 활성화는 후속 작업.
10. **spacing/typography는 Tailwind `@theme` 바인딩 제외** (v4 기본 네임스페이스 충돌 위험) — 참조용 CSS 변수로만 방출.

## 중단점

- Step 3 완료 시(사이트 시각 회귀 없음 확인) 커밋 경계.
- Step 4 audit 결과가 스킬 폐기를 권고하면 사용자 확인 후 실행 (다른 레포 파괴적 변경).

## Changelog

- 2026-07-07: 최초 작성.
