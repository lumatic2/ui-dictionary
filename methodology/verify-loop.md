# Verify Loop — 디자인 검증 파이프라인

> 7 단계 fail-fast 체인. 각 단계는 JSON 리포터를 내보내 **에이전트가 직접 읽고 자가수정 루프**를 돌릴 수 있다.
>
> 근거: [research-findings.md § C](research-findings.md#c-qa-도구-맵-fail-fast-순서).

## 설계 원칙

1. **싼 것부터** — ms 단위로 끝나는 단계가 앞에. CI 시간보다 dev 루프 시간이 중요.
2. **모두 JSON** — `.design/<stage>.json` 으로 떨어뜨려야 다음 에이전트가 읽는다. 사람용 stdout 은 보조.
3. **단계 독립** — 앞 단계 실패해도 뒤를 수동 실행 가능. 단, pre-commit 에선 1-4 가 게이트.
4. **거짓 양성 회피** — `color-mix()` 같은 함수형 값은 contrast 단계에서 fail 시키지 말고 info 만.

## 단계 요약

| # | 단계 | 도구 | 비용 | 게이트 | 산출 |
|---|---|---|---|---|---|
| 1 | parse | gray-matter | <50ms | pre-commit | `.design/lint.json` (parse 키) |
| 2 | schema | ajv (2020-12) | <100ms | pre-commit | (동상) |
| 3 | alias resolve | (자체) | <50ms | pre-commit | (동상) |
| 4 | token contrast | culori `wcagContrast` + apca-w3 | <500ms | pre-commit | (동상) |
| 5 | static CSS/TW lint | stylelint ∥ eslint-plugin-tailwindcss | 1-3s | pre-commit | `.design/css-lint.json` |
| 6 | rendered a11y | axe-core CLI | 5-15s | CI | `.design/axe.json` |
| 7 | visual regression | Playwright `toHaveScreenshot` (또는 odiff) | 10-60s | CI | `.design/vrt.json` |

## 단계 1-4 — 현 구현

`scripts/lint/index.js` 가 1-4 를 한 번에 돌린다.

```bash
node ~/projects/desing-manual/scripts/lint/index.js DESIGN.md
# stdout: [PASS]/[FAIL] per stage
# file:   <DESIGN.md 디렉토리>/.design/lint.json
```

### 리포트 shape

```json
{
  "file": "DESIGN.md",
  "ts": "2026-05-14T10:23:00.000Z",
  "ok": true,
  "stages": {
    "parse":   { "ok": true },
    "schema":  { "ok": true },
    "alias":   { "ok": true, "tokens": 27 },
    "contrast":{
      "ok": true,
      "themes": {
        "default": [
          { "fg": "color.semantic.text.default", "bg": "color.semantic.surface.base", "sev": "error", "ratio": 14.21 },
          { "fg": "color.semantic.text.muted",   "bg": "color.semantic.surface.base", "sev": "error", "ratio": 5.94 }
        ],
        "dark": [
          { "fg": "color.semantic.text.muted",   "bg": "color.semantic.surface.muted","sev": "error", "ratio": 3.31, "fail": true,
            "suggest": { "token": "color.semantic.text.muted", "value": "oklch(0.63 0.04 250)", "note": "OKLCH L 조정" } }
        ]
      }
    }
  }
}
```

각 theme 별 평가, fail 시 `suggest.value` 에 OKLCH 수정 후보 — 에이전트가 직접 토큰에 적용 가능.

### 에이전트 자가수정 루프 (예)

```text
사용자: "lint 가 dark theme 에서 fail 하는데 고쳐줘"
에이전트:
  1) Read .design/lint.json
     → stages.contrast.themes.dark 의 fail=true 항목 추출
     → [{ fg: text.muted, bg: surface.muted, ratio: 3.31, suggest.value: "oklch(0.63 0.04 250)" }]
  2) Read DESIGN.md → themes.dark 블록에 text.muted override 추가
     (혹은 primitive 사다리에 slate-400 추가 후 alias)
  3) Run lint → PASS 확인 후 commit
```

이게 가능한 이유 = JSON 이 (a) 구체 토큰 path (b) ratio (c) **OKLCH 수정 후보**까지 박아주기 때문.

`suggest.value` 가 `(none)` 이면 fg 의 L 조정만으로는 도달 불가 = bg 도 같이 움직여야 한다는 신호. 사람 결정 영역.

## 단계 5 — Static CSS/Tailwind Lint

DESIGN.md 의 토큰이 *실제 코드*에서 지켜지는지. lint 단독으론 의미 없고 코드 베이스 곁들여 돌릴 때만.

### Stylelint (CSS / SCSS / styled)

```bash
npm i -D stylelint stylelint-config-standard stylelint-declaration-strict-value
```

`.stylelintrc.json`:
```json
{
  "extends": ["stylelint-config-standard"],
  "plugins": ["stylelint-declaration-strict-value"],
  "rules": {
    "scale-unlimited/declaration-strict-value": [
      ["/color/", "background-color", "border-color", "fill"],
      { "ignoreValues": ["transparent", "currentColor", "inherit", "/^var\\(--/"] }
    ]
  }
}
```

**의도**: 색·배경·보더에 **CSS 변수**(즉 토큰)만 허용. raw hex/rgb 등장하면 fail. spacing 도 같은 룰 추가 가능.

```bash
npx stylelint "**/*.css" --formatter json > .design/css-lint.json
```

### eslint-plugin-tailwindcss (Tailwind v4)

```bash
npm i -D eslint eslint-plugin-tailwindcss
```

체크 항목: 유효하지 않은 클래스 / 클래스 순서 / 중복. Tailwind v4 `@theme` 의 토큰과 어긋난 임의값(`[#hex]`) 사용 적발.

```bash
npx eslint . --format json > .design/eslint.json
```

### 게이트 정책

5 단계는 pre-commit 에서 **변경 파일만** 돌린다 (`lint-staged`). 전체 코드베이스 lint 는 CI 에서.

## 단계 6 — Rendered A11y (axe-core)

빌드된 HTML 또는 Storybook 에 대해.

```bash
npm i -D @axe-core/cli
npm run build
npx axe http://localhost:4173 --save .design/axe.json --exit
```

PR 게이트: WCAG 2.1 AA 위반 0 건. info/minor 는 허용.

### 보완 — APCA (WCAG 3 draft)

axe 는 WCAG 2.1 기준. 미세 명도 조정 시 APCA Lc 값도 본다:

```bash
npm i apca-w3
node -e "
import { APCAcontrast, sRGBtoY } from 'apca-w3';
const lc = APCAcontrast(sRGBtoY([34,34,34]), sRGBtoY([248,248,248]));
console.log('Lc', lc.toFixed(1));
"
```

Lc 절댓값: body 60+, large 45+, UI 30+.

## 단계 7 — Visual Regression

Playwright 의 `toHaveScreenshot` 가 OSS first 권장. SaaS(Chromatic/Percy)는 opt-in.

### Playwright

```bash
npm init playwright@latest
```

`tests/design.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('button states', async ({ page }) => {
  await page.goto('/storybook?path=/story/button');
  await expect(page.locator('[data-testid=btn]')).toHaveScreenshot('button-default.png');
  await page.locator('[data-testid=btn]').hover();
  await expect(page.locator('[data-testid=btn]')).toHaveScreenshot('button-hover.png');
});
```

threshold (`maxDiffPixelRatio: 0.01`) 조정 — too tight = flaky, too loose = miss.

### odiff (faster alt)

```bash
npm i -D odiff-bin
npx odiff baseline.png actual.png diff.png  # exit 21 if diff
```

빠르고 가볍지만 자체 러너 없음 — Playwright 안에서 비교만 위임 가능.

### baseline 정책

- baseline 은 `tests/__screenshots__/` 에 commit
- 의도된 디자인 변경 시 `--update-snapshots` 명시적 실행. CI 가 자동 갱신 금지
- baseline 변경은 별도 PR 권장 (코드 변경 PR 에서 함께 갱신하면 리뷰어가 못 본다)

## 단계 0 — Aggregator (선택)

7 단계 산출을 `.design/report.json` 하나로 묶어 에이전트가 한 번에 읽게.

```bash
node ~/projects/desing-manual/scripts/lint/aggregate.js .design/ > .design/report.json
```

(현재 미구현. 후속 작업.)

## 통합 — Pre-commit / CI 매핑

### pre-commit (로컬, <5초 목표)

```bash
# .git/hooks/pre-commit.design (이미 templates/hooks/ 에 있음)
node ~/projects/desing-manual/scripts/lint/index.js DESIGN.md       # 1-4
npx lint-staged                                                      # 5 (변경 파일)
```

5 단계까지만. 6-7 은 너무 느려 dev 흐름을 끊는다.

### CI (PR 게이트, <2분 목표)

```yaml
# .github/workflows/design-qa.yml (예시)
jobs:
  design-qa:
    steps:
      - run: node ~/projects/desing-manual/scripts/lint/index.js DESIGN.md
      - run: npx stylelint "**/*.css" --formatter json -o .design/css-lint.json
      - run: npx eslint . --format json -o .design/eslint.json
      - run: npm run build
      - run: npx axe http://localhost:4173 --save .design/axe.json --exit
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        with: { name: design-qa, path: .design/ }
```

### 수동 (디자인 작업 중)

```bash
# 사이클이 빠른 1-4 만 watch
nodemon -w DESIGN.md -x "node ~/projects/desing-manual/scripts/lint/index.js DESIGN.md"
```

## 비용 가드레일

| 단계 | 예상 시간 | 초과 시 |
|---|---|---|
| 1-4 합산 | <500ms | 토큰 200 개 넘으면 alias resolution 최적화 (지금은 O(n²) 비슷) |
| 5 (lint-staged) | <3s | rule set 줄이기 |
| 6 (axe) | <15s | Storybook 페이지 수 제한, story 별 병렬 |
| 7 (VRT) | <60s | baseline 개수 줄이기, threshold 완화 |

CI 전체 2 분 넘으면 PR 리뷰 흐름 끊김 → 단계 6/7 을 별도 워크플로우로 분리해 비동기.

## 거짓 양성 / 거짓 음성 다루기

### 거짓 양성 (False positive)

- **contrast 단계가 `color-mix()` 를 fail 시킬 때** — 현재 구현은 unparseable 로 info 처리. fail X.
- **stylelint 가 의도된 inline 값을 잡을 때** — `/* stylelint-disable-next-line */` 으로 좁게. 파일 단위 disable 금지.
- **axe 의 region rule 등 SPA 특성 위양성** — 룰별 disable 가능하지만 사유 commit message 에 박을 것.

### 거짓 음성 (False negative)

- **lint PASS 인데 실제 보면 못생긴 디자인** — lint 가 잡지 못함. `methodology/prompt-patterns.md § 9 AI-slop Smell Test` 로 보완.
- **contrast PASS 인데 작은 텍스트가 안 읽힘** — WCAG 2.1 은 폰트 크기 무관. APCA Lc 보강 권장.
- **a11y PASS 인데 키보드 사용성이 끔찍** — axe 가 못 잡음. 수동 키보드 통과 테스트는 별도 체크리스트(verify-loop 와 분리).

## 에이전트 친화 가이드

본 파이프라인을 LLM 이 잘 활용하려면 산출 JSON 의 다음 3 가지가 박혀있어야 한다:

1. **구체 path** — 어떤 토큰/요소가 fail 했나
2. **현재 값과 목표 값** — `ratio: 3.8 (need ≥ 4.5)` 처럼
3. **수정 후보** — 가능하면 1-2 개 제안. 없으면 사람이 결정해야 함

현 구현(`scripts/lint/index.js`)은 1, 2 까지. 3 은 후속 작업 (token 의 OKLCH L 값 조정 제안 등).

## 후속 작업

- `scripts/lint/aggregate.js` — 7 단계 산출 통합 리포터
- `scripts/lint/suggest.js` — fail 시 수정 후보 생성
- `examples/` 에 7 단계 통과/실패 conformance fixtures
- 한 패키지로 묶어 `npx design-lint <target>` 형태 (npm 미발행, 로컬만)
- pre-commit hook 자동 설치 ↔ 해제 토글
