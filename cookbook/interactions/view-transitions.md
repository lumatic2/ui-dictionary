# View Transitions

**한 줄 정의** — 브라우저 네이티브 View Transitions API 로 페이지·상태 전환을 cross-fade·morph.

## When
- SPA 라우트 전환에 부드러움 추가
- 같은 요소가 두 view 에 존재하는 경우 (`view-transition-name`) — shared element transition
- Chrome / Safari 18+ 환경

## Anti-use
- 폼 전환 (사용자가 즉시 결과를 봐야 함)
- 비대칭 데이터 — A view 에 없는 요소가 B 에 있으면 어색

## Code

```js
// 라우트 전환 시
async function navigate(url) {
  if (!document.startViewTransition) return location.assign(url);
  const transition = document.startViewTransition(async () => {
    await fetchAndRender(url);
  });
  await transition.finished;
}
```

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 200ms;
}

/* shared element */
.hero-image { view-transition-name: hero; }
```

`prefers-reduced-motion` 시 자동으로 짧아짐 — 별도 가드 불필요.

## References
- [MDN — View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [Jake Archibald — VT 데모](https://http203-playlist.netlify.app/)

*TODO: same-document variant.*
