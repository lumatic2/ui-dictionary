# Focus-visible Indicator

**한 줄 정의** — 키보드 포커스 시에만 보이는 outline. a11y 의 기본기.

## What

`:focus-visible` 의사클래스는 *키보드* 포커스에만 매칭 (마우스 클릭 포커스 제외). 모든 interactive 요소에 필요. 마우스 클릭 시 보이는 outline 이 거슬려서 `outline: none` 박는 실수의 정답.

## When
- **모든 interactive 요소에 무조건** (button, a, input, [role=button], …)
- 시스템 톤에 맞춰 색·두께 결정

## Anti-use
- `outline: none` 만 박고 대체 없음 — **금지**. WCAG 2.4.7 위반.
- focus ring 을 1px 로만 — too thin, 시인성 부족
- `:focus` 만 매칭 — 마우스 클릭 시도 outline 보임 (구식)

## Code

```css
/* 시스템 토큰 활용 */
:where(button, a, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--color-action-primary);
  outline-offset: 2px;
  border-radius: inherit;
}

/* 어두운 배경 위에서는 white ring */
.on-dark:focus-visible {
  outline-color: var(--color-text-on-primary);
}
```

Tailwind v4:

```html
<button class="focus-visible:outline-2 focus-visible:outline-action-primary focus-visible:outline-offset-2">
```

## 검증
- axe-core `target-size` rule + Lighthouse 로 자동 점검
- 수동: Tab 키만으로 페이지 한 바퀴 — 매 단계 outline 보이나?

## References
- [MDN — `:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [WCAG 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
