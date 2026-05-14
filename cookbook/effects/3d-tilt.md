# 3D Tilt

**한 줄 정의** — 마우스 위치에 따라 카드가 perspective 기울어지는 hover 효과.

## When
- 제품 카드 hero, 포트폴리오 thumbnail
- Glass 위에 얹으면 무게감

## Anti-use
- 데이터 dense list 카드
- 모바일 (터치 hover X)
- reduced-motion 환경

## Code (요점)

```js
el.addEventListener('pointermove', (e) => {
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;   // -0.5 ~ 0.5
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`;
});
el.addEventListener('pointerleave', () => el.style.transform = '');
```

각도 10° 초과는 멀미. 보통 6-12° 범위.

*TODO: spec + screenshot.*
