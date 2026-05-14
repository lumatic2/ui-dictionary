# Glassmorphism

**한 줄 정의** — 반투명 배경 + backdrop blur 로 "frosted glass" 표면을 만드는 기법.

## What

요소 뒤의 콘텐츠가 흐릿하게 비치는 패널. Apple visionOS, Windows 11 Mica, macOS Sonoma 의 핵심 표면 언어. 핵심 원료는 **3 가지**:

1. **반투명 배경색** (alpha 50-75%)
2. **`backdrop-filter: blur(...)`** (8-32px 권장)
3. **1px hairline 보더** (반투명 흰색 또는 검정)

선택적으로 saturate / brightness 도 함께 (`backdrop-filter: blur(16px) saturate(180%)`).

## When

- 배경에 **풍부한 컬러·이미지·gradient** 가 있을 때. 단색 배경 위 glass 는 의미 없음.
- **floating UI** (nav bar, modal, tooltip, command-K) — 위계가 분명히 드러남.
- **Glass / Aurora aesthetic family** 시스템 — 본 레포 [`design-md/glass`](../../design-md/glass/DESIGN.md) 참조.

## Anti-use

- **flat / minimal / brutalist 시스템** — 톤이 전혀 안 맞음. minimal 의 § 8 anti-patterns 에 박혀있음.
- **glass on glass 2 층 이상** — 위계 무너지고 흐릿함만 누적. 최대 1 층.
- **본문 텍스트 컨테이너** — 가독성 떨어짐. UI 표면만.
- **저성능 디바이스 타겟** — `backdrop-filter` 는 GPU 비용. mobile 다중 사용 시 프레임 떨어짐.
- **배경이 단색·저채도일 때** — 효과 안 보임 + contrast 검증 어려움.

## Tokens required

DESIGN.md frontmatter 에 다음이 있어야 함:

```yaml
tokens:
  color:
    semantic:
      surface:
        glass: { value: "color-mix(in oklch, {color.primitive.X.50} 60%, transparent)", type: color }
      border:
        glass: { value: "color-mix(in oklch, {color.primitive.X.500} 25%, transparent)", type: color }
  dimension:
    blur:
      sm: { value: "8px",  type: dimension }
      md: { value: "16px", type: dimension }
      lg: { value: "32px", type: dimension }
    radius:
      lg: { value: "20px", type: dimension }
```

토큰 없으면 `cookbook` 사용 전에 DESIGN.md 부터 추가.

## Code

### CSS (vanilla)

```css
.glass {
  background: var(--color-surface-glass);
  backdrop-filter: blur(var(--dimension-blur-md)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--dimension-blur-md)) saturate(180%);
  border: 1px solid var(--color-border-glass);
  border-radius: var(--dimension-radius-lg);
}

/* fallback: backdrop-filter 미지원 (Firefox 옛버전 등) */
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: var(--color-surface-muted); }
}
```

### React + Tailwind v4

```tsx
// tailwind.config 또는 @theme 에 토큰 매핑돼있다고 가정
export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-surface-glass
      backdrop-blur-md backdrop-saturate-150
      border border-border-glass
      rounded-lg
      p-6
    ">
      {children}
    </div>
  );
}
```

### 접근성 가드

```css
.glass {
  /* contrast 검증된 텍스트만 */
  color: var(--color-text-default);
}

/* prefers-reduced-transparency 존중 (Safari/iOS) */
@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: var(--color-surface-muted);
    backdrop-filter: none;
  }
}
```

## Variants

### 1. Floating Nav

```css
.nav-glass {
  position: sticky;
  top: var(--dimension-space-4);
  margin: 0 auto;
  max-width: 960px;
  background: var(--color-surface-glass);
  backdrop-filter: blur(var(--dimension-blur-lg)) saturate(180%);
  border: 1px solid var(--color-border-glass);
  border-radius: var(--dimension-radius-full);
  padding: var(--dimension-space-2) var(--dimension-space-4);
}
```

### 2. Glass Modal Overlay

```css
.modal-glass {
  background: var(--color-surface-glass);
  backdrop-filter: blur(24px) saturate(180%);
  /* dark 모드에서 alpha 더 진하게 */
}
@media (prefers-color-scheme: dark) {
  .modal-glass {
    background: color-mix(in oklch, var(--color-primitive-slate-900) 70%, transparent);
  }
}
```

## Screenshot

`./glassmorphism.png` *(TODO: 캡처)*

## 검증 노트

- contrast lint 단계에서 `color-mix(...)` 는 unparseable 로 처리됨 → 통과되지만 **사람이 한 번 더** 봐야 함.
- 글래스 위 텍스트는 axe-core 가 못 잡는 경우 많음. 실제 배경 색 추정해 culori 로 수동 체크 권장:
  ```js
  // 배경 평균색을 가정해 텍스트 contrast 산출
  import { wcagContrast, parse } from 'culori';
  wcagContrast(parse('oklch(98% 0.01 250)'), parse('oklch(15% 0.02 250)'));
  ```

## References

- [CSS Tricks — backdrop-filter](https://css-tricks.com/almanac/properties/b/backdrop-filter/)
- [Apple HIG — Materials (visionOS)](https://developer.apple.com/design/human-interface-guidelines/materials)
- [W3C Filter Effects Level 2](https://drafts.fxtf.org/filter-effects-2/)
- MDN: [`prefers-reduced-transparency`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency)

## Changelog

## 2026-05-14
- 초안. 토큰 명세, 두 코드 스니펫, 두 variant, a11y 가드.
