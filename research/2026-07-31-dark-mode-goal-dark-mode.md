# 다크모드 리서치 — 정의·주의점·구현 (2026-07-31)

> 소비처: `plans/2026-07-31-dm*-*.md` (goal `dark-mode` 계획서) · 용어 사전 '다크모드' 등재 · `knowledge/` 다크모드 지식 문서
> 수집: sonnet 하위 에이전트 웹 리서치(출처 URL+접근일 전건) + 사이트 현황 탐색(하단 §E)

## A. 정의·개념 경계

### A-1. 정확한 정의 (권위 소스 기준)

**Apple HIG**: 다크모드는 시스템 전역(systemwide) 외형 설정으로, 어두운 색상 팔레트를 사용해 저조도 환경에 적합한 편안한 시야 경험을 제공한다. 다크모드에서는 화면·뷰·메뉴·컨트롤 전반에 어두운 팔레트가 적용되며, 배경 대비 전경 콘텐츠를 부각하기 위해 더 큰 지각적 대비(perceptual contrast)를 쓰기도 한다. iOS/iPadOS/macOS/tvOS 사용자는 다크모드를 기본값으로 선택하는 경우가 많고, 모든 앱이 이 선호를 존중하길 기대한다.
출처: https://developers.apple.com/design/human-interface-guidelines/foundations/dark-mode/ (접근일 2026-07-31)

**MDN `prefers-color-scheme`**: 사용자가 라이트/다크 컬러 테마 중 무엇을 선호하는지 감지하는 CSS 미디어 기능. 값은 `light`(선호 표명 없음도 포함)와 `dark` 두 가지. OS 설정 또는 유저 에이전트 설정을 통해 사용자가 선호를 표명한다.
출처: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme (접근일 2026-07-31)

**Material Design 3**: 다크 테마 배경 기본값은 순수 검정이 아니라 짙은 회색 `#121212`. 표면(surface) 위에 반투명 흰색 오버레이를 합성하는 elevation overlay 시스템으로 "밝기"를 표현한다.
출처: https://m3.material.io/blog/android-dark-theme-tutorial (접근일 2026-07-31)

정리: 다크모드는 **① 시스템/사이트 전역 외형 스킴, ② 저조도 편의·눈부심 감소 목적, ③ 색상만이 아니라 대비·표면 구조까지 재설계된 별도 팔레트**라는 세 요소를 함께 가리키는 개념이다. 단순히 "배경을 검게, 글자를 희게" 뒤집는 것과 다르다(→ A-2).

### A-2. 인접 개념과의 경계

| 개념 | 다크모드와의 차이 |
|---|---|
| **Dark theme** | 실질적 동의어로 혼용되나, "mode"=OS/앱의 전역 상태 전환, "theme"=그 상태에 대응하는 디자인 산출물(팔레트·토큰 세트)을 가리키는 경향 (추정 — 공식 표준 문서가 엄격히 구분하지 않음) |
| **Night mode** | dark mode와 혼용되는 마케팅 용어. 공식 규격 근거 못 찾음 — 추정 |
| **Night Shift (색온도)** | 화면 색온도를 웜톤(최대 2700K)으로 이동해 블루라이트를 줄이는 Apple 별도 기능. 다크모드는 총 휘도를 낮추지만 스펙트럼은 안 바꾸고, Night Shift는 스펙트럼을 이동시키되 밝기는 안 낮춤 — 독립 축. 출처: https://support.apple.com/en-us/102191 · https://www.slashgear.com/1889319/iphone-night-mode-vs-shift-differences-explained/ (접근일 2026-07-31) |
| **High contrast / forced-colors** | 사용자 지정 제한 팔레트를 페이지 전체에 강제하는 접근성 렌더링 모드(`forced-colors` 미디어 기능). prefers-color-scheme(선호 전달)과 별개 축. 출처: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors (접근일 2026-07-31) |
| **Inverted colors (Smart/Classic Invert)** | OS가 사후에 강제로 색을 뒤집는 범용 오버라이드(iOS 접근성). 다크모드=개발자가 의도 설계한 테마-어웨어 시스템이라는 점이 결정적 차이. 출처: https://useyourloaf.com/blog/accessibility-smart-invert/ · https://blog.equally.ai/disability-guide/dark-mode-vs-smart-invert/ (접근일 2026-07-31) |

### A-3. 시스템 연동 vs 수동 토글 vs 3-상태 패턴

- **시스템 연동**: `prefers-color-scheme`만 따름(토글 없음) — Tailwind `media` 전략.
- **수동 토글**: `class`/`data-` 속성 기반, OS와 무관하게 강제.
- **3-상태(라이트/다크/시스템)**: 업계 사실상 표준. `localStorage`에 명시 선택 저장, 없으면(`!("theme" in localStorage)`) `matchMedia` 추종. "시스템" 선택 = `localStorage.removeItem("theme")`.
출처: https://tailwindcss.com/docs/dark-mode (접근일 2026-07-31)

## B. 디자인 주의점

### B-1. 순수 검정(#000) 대신 어두운 회색
- Material 다크 기본 배경 `#121212`. 이유: 밝은 콘텐츠와의 과도 대비로 인한 피로 방지, halation 악화 방지.
- 실무 권고치: 배경 `#121212`~`#1E1E1E` + 텍스트 `#E0E0E0`~`#F0F0F0` 오프화이트 (실무 가이드 — 추정 성격).
출처: https://m3.material.io/blog/android-dark-theme-tutorial · https://dubbot.com/dubblog/2023/dark-mode-a11y.html (접근일 2026-07-31)

### B-2. Elevation 표현 차이
- 라이트=그림자. 다크=onSurface 반투명 오버레이로 "표면이 밝아짐"을 높이로 표현(0dp 0% → 24dp 최대 16% 선형 증가).
출처: https://m3.material.io/blog/android-dark-theme-tutorial (접근일 2026-07-31)

### B-3. 채도·대비·halation·비점수차
- **채도**: 어두운 배경 위 고채도 원색은 진동·번짐 — desaturated 톤 권장(실무 경험칙 20~40% 감소, 추정). 출처: https://mohitphogat.medium.com/dark-mode-done-right-and-why-most-apps-get-it-wrong-a75f90aab30a (접근일 2026-07-31)
- **WCAG 대비**: 다크 제공이 대비 요건을 자동 충족하지 않음 — 일반 4.5:1, 큰 텍스트 3:1을 **테마별 개별 재검증**. 출처: https://www.boia.org/blog/offering-a-dark-mode-doesnt-satisfy-wcag-color-contrast-requirements (접근일 2026-07-31)
- **Halation·비점수차**: 인구 약 47%가 어떤 형태로든 비점수차 보유 — 검정 배경 위 흰 텍스트가 번져 보임. 대응: 오프블랙, dim 옵션. 출처: https://techealthinfo.com/dark-mode-and-astigmatism-5-tweaks-to-reduce-eye-strain/ · https://www.boia.org/blog/dark-mode-can-improve-text-readability-but-not-for-everyone (접근일 2026-07-31)
- **이미지·일러스트**: 라이트 전제 이미지(투명 PNG·흰 배경 스크린샷)는 다크 배경에서 어색 — `<picture>` 분기 또는 다크 전용 에셋(→ C-6).

### B-4. 브랜드 색 재조정과 시맨틱 토큰
- GitHub Primer: "모든 색은 시맨틱 변수를 거쳐야 하며 원시 hex 직접 참조 금지" — `:root` 스왑만으로 전체 팔레트 전환. 본 레포 3-tier 토큰 규칙과 구조 동일.
출처: https://primer.style/product/getting-started/foundations/color-usage/ (접근일 2026-07-31)

## C. 구현 주의점 (웹)

### C-1. FOUC / Flash of Wrong Theme ("FART")
- SSG/prerender 사이트에서 hydration 후 테마 적용 시 첫 페인트에 라이트가 번쩍임. **해결: `<head>` 인라인 스크립트**로 렌더 전에 localStorage/matchMedia를 읽어 `<html>`에 동기적으로 클래스 설정 — 컴포넌트 코드로는 불가.
출처: https://www.notanumber.in/blog/fixing-react-dark-mode-flickering · https://css-tricks.com/flash-of-inaccurate-color-theme-fart/ (접근일 2026-07-31)
- Tailwind 공식 스니펫:
```javascript
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);
```
출처: https://tailwindcss.com/docs/dark-mode (접근일 2026-07-31)

### C-2. localStorage vs 시스템 추종
- 명시 선택 시 `localStorage.theme` 저장, "시스템" 선택 시 remove. OS 실행 중 변경 반영은 `matchMedia(...).addEventListener("change", ...)` — 단 명시 선택 저장 시 리스너 무시(통상 패턴, 추정).

### C-3. Tailwind darkMode 전략
- `media`(기본) / `class`·selector(`@custom-variant dark (&:where(.dark, .dark *));`) / `data-` 속성. 3-상태 토글 = class 전략 + C-1 인라인 스크립트가 표준.
출처: https://tailwindcss.com/docs/dark-mode (접근일 2026-07-31)

### C-4. `color-scheme` CSS 속성
- `color-scheme: light dark;` 지정 시 스크롤바·폼 컨트롤·시스템 색을 브라우저가 자동 대응("공짜 다크"). 커스텀 컴포넌트는 별도 대응 필요, `light-dark()` 함수로 저자 CSS도 반응 가능.
출처: https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme · https://web.dev/articles/color-scheme (접근일 2026-07-31)

### C-5. meta theme-color
- `media` 속성에 prefers-color-scheme 쿼리로 테마별 브라우저 크롬 색 지정 가능.
출처: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color (접근일 2026-07-31)

### C-6. 이미지 대응
- `<picture>` + `prefers-color-scheme` source 분기. **한계**: OS 설정만 감지 — 사이트 수동 토글과 어긋날 수 있어 JS 분기 병행 필요. 투명 PNG(검정 텍스트 로고)는 다크 전용 에셋 또는 SVG+`currentColor`.
출처: https://rhyslloyd.me/serve-dark-mode-images-natively/ · https://www.brandonpugh.com/til/html/light-dark-images/ (접근일 2026-07-31)

### C-7. 트랜지션
- 전환 transition을 상시 걸면 초기 로드(FOUC 수정 스크립트 토글 순간)에 불필요한 페이드 — 토글 클릭 시에만 일시적으로 켜는 것이 관행(추정 — 표준 규격 없음).

### C-8. 접근성 구분
- 다크모드는 선호 기능이지 접근성 기능이 아님. WCAG 검증은 테마별 독립 실시. `forced-colors`는 별도 처리(`@media (forced-colors: active)`).
출처: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors (접근일 2026-07-31)

## D. 우수 구현 사례

1. **GitHub Primer** — primitive/semantic 2계층 CSS 변수, semantic만 참조 강제, `:root` 스왑 전환. https://primer.style/product/getting-started/foundations/color-usage/ (접근일 2026-07-31)
2. **Linear** — dark-first 설계: 다크에서 elevation·surface 위계를 먼저 확정 후 라이트 파생. https://chyshkala.com/blog/why-linear-design-systems-break-in-dark-mode-and-how-to-fix-them (접근일 2026-07-31)
3. **Stripe Connect embedded** — 임베드 컴포넌트에 호스트 테마를 appearance 파라미터로 명시 주입·동적 동기화. https://docs.stripe.com/connect/embedded-appearance-support-dark-mode (접근일 2026-07-31)
4. **Tailwind 공식 문서** — 3전략 + 3-상태 토글 + FOUC 인라인 스크립트의 웹 구현 정본. https://tailwindcss.com/docs/dark-mode (접근일 2026-07-31)

## E. 사이트 현황 실측 (ui-vocabulary-site, 2026-07-31 탐색)

- **인프라는 이미 완성·의도적 차단 상태**: `src/tokens.css:48-67` `.dark` 토큰 세트(DESIGN.md `themes.dark` 생성물), `src/index.css:5` `@custom-variant dark`, shadcn 프리미티브 8종 `dark:` variant 보유, `SiteThemeToggle` 구현체 존재(`App.tsx:2285`, 미배선). `App.tsx:102-107`이 2026-07-28 사용자 결정("카탈로그 하드코딩 색과 충돌해 가독성 붕괴")으로 `.dark` 강제 제거 + localStorage 삭제.
- **하드코딩 리터럴 색 클래스**: src 전체 4,983건/14파일 — 그중 `marketing-section-preview.tsx` 1,925건은 **데모 콘텐츠 자체**(per-example `theme` prop으로 이미 사이트 테마와 격리, 전환 대상 아님). 실제 전환 대상 = 사이트 셸: `App.tsx` 183 + `home-page.tsx` 177 + `article-documentation-layout.tsx` 95 = **455건** + `term-visual.tsx` 21 등 소수.
- **prerender**(`scripts/prerender-ui-vocabulary.ts`)는 meta 문자열 치환만 — 테마 중립. `index.html:7` `theme-color` 정적 고정(#312e81). FOUC 인라인 스크립트는 index.html(=프리렌더 셸 템플릿)에 넣으면 전 라우트에 적용됨.
- **게이트 갭**: design-lint·lint-tokens 모두 토큰 정의 레벨만 검사 — 컴포넌트 `.tsx`의 하드코딩 Tailwind 색 클래스는 안 잡음. 재발 방지 스캐너 부재.
