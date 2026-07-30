# Dark Mode — 정의·경계·판정 규칙

Date: 2026-07-31
Milestone: DM1 (plan: `plans/2026-07-31-dm1-dark-mode-knowledge.md`)
지위: 살아있는 정본. "다크모드가 무엇이고 무엇이 아닌가, 어떤 다크가 좋은 다크인가"를 판정한다 — 특정 사이트에 어떻게 심는가(치환·배선 절차)는 각 구현 계획서 소관.
근거: `research/2026-07-31-dark-mode-goal-dark-mode.md` (Apple HIG·MDN·Material 3·Primer·Tailwind 웹 리서치, 출처 URL+접근일 전건).

## 1. 정의 — 다크모드는 "반전"이 아니라 별도 팔레트다

다크모드는 **시스템 또는 사이트 전역의 외형 스킴**으로, 저조도 환경의 편안한 시야를 위해 **어두운 팔레트로 재설계된 별도 테마**다. 세 요소가 함께 있어야 다크모드다:

1. **전역성** — 화면·뷰·메뉴·컨트롤 전반에 일관 적용되는 전역 상태 (Apple HIG는 systemwide appearance 로 정의).
2. **목적** — 저조도 편의·눈부심 감소. 사용자 다수가 이를 기본값으로 선택하며, 앱이 이 선호를 존중하길 기대한다.
3. **재설계** — 색만 뒤집는 게 아니라 대비 관계·표면 위계(elevation)·채도까지 다시 설계한 팔레트. "배경을 검게, 글자를 희게"의 기계적 반전은 다크모드가 아니다.

(Apple HIG https://developers.apple.com/design/human-interface-guidelines/foundations/dark-mode/ · MDN https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme · Material 3 https://m3.material.io/blog/android-dark-theme-tutorial, 접근일 2026-07-31)

## 2. 경계 — 다크모드가 아닌 것들

혼동 빈도가 높은 인접 개념 4종. 축이 다르면 다른 물건이다.

| 개념 | 축 | 다크모드와의 차이 |
|---|---|---|
| **Night Shift (색온도)** | 스펙트럼 | 색온도를 웜톤으로 이동해 블루라이트를 줄인다. 다크모드는 총 휘도를 낮추지만 스펙트럼은 안 바꾸고, Night Shift 는 스펙트럼을 옮기되 밝기는 안 낮춘다 — 독립 축, 동시 사용 가능 |
| **High contrast / forced-colors** | 접근성 강제 | 사용자 지정 제한 팔레트를 페이지 전체에 **강제**하는 렌더링 모드. 저자 CSS 색을 대부분 무시한다. 다크모드 대응이 이걸 커버한다고 가정하면 안 된다 — `@media (forced-colors: active)` 별도 축 |
| **Inverted colors (Smart/Classic Invert)** | 사후 반전 | OS 가 앱 지원 여부와 무관하게 색을 뒤집는 범용 오버라이드. 다크모드 = **개발자가 의도 설계한 테마**, Invert = 설계 없는 사후 처리 — 완성도 차이가 본질 |
| **Dark theme** | 어휘 | 사실상 동의어. 굳이 가르면 mode=전역 상태 전환, theme=그 상태에 대응하는 팔레트·토큰 산출물 (추정 — 공식 표준이 엄격히 구분하지 않음) |

(MDN forced-colors https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors · Apple https://support.apple.com/en-us/102191 · Smart Invert https://useyourloaf.com/blog/accessibility-smart-invert/, 접근일 2026-07-31)

**따름 정리**: 다크모드는 선호(preference) 기능이지 접근성 기능이 아니다. WCAG 대비 검증은 라이트/다크 **각 테마에서 독립적으로** 통과해야 한다 — 라이트 통과가 다크 통과를 의미하지 않는다. (https://www.boia.org/blog/offering-a-dark-mode-doesnt-satisfy-wcag-color-contrast-requirements, 접근일 2026-07-31)

## 3. 좋은 다크의 판정 규칙 (디자인)

1. **순수 검정 금지** — 배경 기본값은 `#000` 이 아니라 짙은 회색(Material 기준 `#121212`). 극단 대비는 halation(빛번짐)을 악화시키고, 비점수차 사용자(인구 약 47%가 어떤 형태로든 보유)에게 흰 텍스트가 번져 보인다. 텍스트도 순백 대신 오프화이트.
2. **Elevation 은 그림자가 아니라 표면 밝기** — 라이트에서 그림자로 표현하던 높이를, 다크에서는 표면에 밝은 오버레이를 합성해 "높을수록 밝게"로 표현한다 (Material: 0dp 0% → 24dp 16% 선형).
3. **채도를 낮춘다** — 어두운 배경 위 고채도 원색은 진동·번짐. 브랜드 색을 그대로 옮기지 말고 다크 전용으로 재조정한 값을 semantic 계층에 매핑한다.
4. **모든 색은 semantic 토큰을 거친다** — 원시 hex·리터럴 팔레트 클래스를 컴포넌트에 직접 쓰면 다크는 구조적으로 불가능해진다. Primer 원칙: primitive → semantic 2계층 참조 강제, `:root` 스코프 스왑만으로 전체 전환. 본 레포 3-tier 토큰([[theme-token]] 참조 구조)과 동일 패턴.
5. **이미지·일러스트는 별도 판정** — 라이트 전제 에셋(흰 배경 스크린샷·검정 텍스트 투명 PNG)은 다크에서 깨진다. 다크 전용 에셋 또는 SVG+`currentColor`.

(Material 3 https://m3.material.io/blog/android-dark-theme-tutorial · Primer https://primer.style/product/getting-started/foundations/color-usage/ · astigmatism https://www.boia.org/blog/dark-mode-can-improve-text-readability-but-not-for-everyone, 접근일 2026-07-31)

## 4. 웹 구현 판정 규칙

1. **상태 모델은 3-상태가 표준** — 라이트/다크/시스템. 명시 선택은 `localStorage` 저장, "시스템"은 키 제거 + `matchMedia("(prefers-color-scheme: dark)")` 추종(+change 리스너). Tailwind 는 class/selector 전략(`@custom-variant dark`)과 이 패턴을 공식 레퍼런스로 문서화.
2. **FOUC 는 head 인라인 스크립트로만 막힌다** — SSG/prerender 사이트에서 hydration 후 테마를 적용하면 첫 페인트에 잘못된 테마가 번쩍인다(FOUC, "FART"). `<head>` 안 동기 인라인 스크립트가 렌더 전에 `<html>` 클래스를 결정해야 한다 — 컴포넌트 코드로는 구조적으로 불가능.
3. **`color-scheme: light dark` 선언** — 스크롤바·폼 컨트롤·시스템 색을 브라우저가 자동 대응(공짜 다크). 커스텀 컴포넌트는 커버 안 됨.
4. **`meta theme-color` 는 media 분기** — `media="(prefers-color-scheme: dark)"` 이중 meta 로 모바일 브라우저 크롬까지 테마 대응.
5. **전환 transition 은 토글 시에만** — 상시 transition 은 초기 로드(FOUC 스크립트가 클래스를 붙이는 순간)에 불필요한 페이드를 만든다 (관행, 추정).
6. **수동 토글과 OS 감지의 정합** — `<picture media="(prefers-color-scheme: dark)">` 류 CSS/HTML 분기는 OS 설정만 본다. 사이트가 자체 토글로 테마를 강제하면 어긋난다 — 이미지 분기도 사이트 테마 상태를 따라야 한다.

(Tailwind https://tailwindcss.com/docs/dark-mode · FOUC https://css-tricks.com/flash-of-inaccurate-color-theme-fart/ · color-scheme https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme · theme-color https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color · 이미지 https://rhyslloyd.me/serve-dark-mode-images-natively/, 접근일 2026-07-31)

## 5. 참조 구현

- **GitHub Primer** — semantic 토큰 강제·`:root` 스왑 전환의 정본. https://primer.style/product/getting-started/foundations/color-usage/
- **Linear** — dark-first: 다크에서 elevation·표면 위계를 먼저 확정하고 라이트를 파생 — "라이트 먼저, 다크는 나중에 끼워 맞추기"의 실패를 구조적으로 회피. https://chyshkala.com/blog/why-linear-design-systems-break-in-dark-mode-and-how-to-fix-them
- **Stripe Connect embedded** — 임베드 컴포넌트에 호스트 테마를 파라미터로 명시 주입·동적 동기화 — 격리된 콘텐츠 표면(데모 카드·iframe)에 테마를 전달하는 패턴. https://docs.stripe.com/connect/embedded-appearance-support-dark-mode
- **Tailwind 공식 문서** — 3전략·3-상태 토글·FOUC 스니펫의 웹 구현 정본. https://tailwindcss.com/docs/dark-mode

(전건 접근일 2026-07-31)
