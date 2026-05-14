# glass-landing

> `desing-manual` 의 첫 conformance fixture. Glass aesthetic family 기반 landing page.

| Light | Dark |
|---|---|
| ![](screenshots/glass-landing-light.png) | ![](screenshots/glass-landing-dark.png) |

다크 모드는 `themes.dark` 블록(DESIGN.md frontmatter)이 자동으로 `@media (prefers-color-scheme: dark)` 와 `[data-theme="dark"]` 두 가지 CSS rule 로 emit 되어 동작.

## 실행

```bash
cd examples/glass-landing
npm install
npm run build:design   # DESIGN.md → src/theme.generated.css (Tailwind @theme)
npm run dev            # http://localhost:5173
npm run build && npm run preview
```

`src/theme.generated.css` 는 gitignored. DESIGN.md 변경 시 `npm run build:design` 재실행 (CI 에선 자동).

## 검증

```bash
npm run lint:design  # DESIGN.md 4단계 (parse/schema/alias/contrast)
npm run lint:css     # stylelint
npm run lint:js      # eslint-plugin-tailwindcss
# 산출: .design/*.json
```

## 행사하는 기법

| Cookbook 항목 | 사용처 |
|---|---|
| [glassmorphism](../../cookbook/effects/glassmorphism.md) | `GlassNav`, `Hero` "Learn more", `FeatureBento` 카드 |
| [gradient-mesh](../../cookbook/effects/gradient-mesh.md) | `theme.css` body 배경 |
| [magnetic-button](../../cookbook/interactions/magnetic-button.md) | `Hero` "Get Started" |
| [bento-grid](../../cookbook/layouts/bento-grid.md) | `FeatureBento` (4 컬럼, feature 카드 2×2) |
| [spring-easing](../../cookbook/motion/spring-easing.md) | 카드 hover, magnetic reset |
| [focus-visible](../../cookbook/interactions/focus-visible.md) | `theme.css` :where 셀렉터 |

## DESIGN.md 흐름

```
DESIGN.md  (DTCG 토큰 + themes 블록)
   │
   ↓  scripts/lint/build.js  (자동)
src/theme.generated.css  @theme { ... } + dark overrides
   │
   ↓  Tailwind v4 가 자동 인식
*.tsx  className="bg-(--color-action-primary) ..."
```

`base.css` 는 토큰 너머의 스타일(body 배경, focus-visible, prefers-reduced-transparency) — 손으로 유지.

## 알려진 한계 / TODO

- [x] DESIGN.md → theme.css 자동 빌드 스크립트
- [x] `prefers-color-scheme: dark` + `[data-theme="dark"]` 토글 둘 다 지원
- [ ] Playwright `tests/design.spec.ts` baseline 캡처
- [ ] glass 위 텍스트 contrast 수동 측정 결과 박기 (lint 가 못 잡음)
- [ ] dark mode 에서 hero 의 `text-(--color-action-primary)` 부분 contrast 검토 (iris-500 on slate-900 ≈ 4.0:1, AA 경계)
