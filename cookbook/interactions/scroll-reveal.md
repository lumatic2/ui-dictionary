# Scroll Reveal

**한 줄 정의** — IntersectionObserver 로 viewport 진입 시 opacity·translate 애니메이션.

## When
- 콘텐츠 헤비 페이지의 단조로움 해소
- 위계 강조 (한 섹션씩 들어옴)

## Anti-use
- 위→아래 읽는 흐름이 중요한 long-form (스킵하는 사용자에게 빈 화면)
- form / dashboard
- reduced-motion 환경

## Code

```js
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('revealed');
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
```

```css
[data-reveal] {
  opacity: 0;
  translate: 0 24px;
  transition: opacity 600ms ease-out, translate 600ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
[data-reveal].revealed { opacity: 1; translate: 0 0; }

@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1; translate: 0 0; transition: none; }
}
```

stagger 가 필요하면 `transition-delay` 를 자식별로.

*TODO: variants (fade only, slide-in-x), screenshot.*
