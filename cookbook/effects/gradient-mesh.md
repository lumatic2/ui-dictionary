# Gradient Mesh

**한 줄 정의** — 여러 색의 부드러운 radial-gradient 를 겹쳐 만드는 유기적 배경.

## What

3-5 개의 큰 `radial-gradient` 를 `position` 다르게 겹치고 blur 강하게 → 페인팅 같은 다색 배경. Stripe, Linear, Vercel landing 의 hero 에서 보임.

## When
- hero / landing 배경
- Glass aesthetic 의 베이스 (그 위에 frosted 카드)

## Anti-use
- 본문 영역 배경 (가독성 해침)
- 4 색 초과 (탁해짐)
- minimal / brutalist / editorial 시스템

## Code (예시)

```css
.mesh {
  background:
    radial-gradient(at 20% 30%, oklch(70% 0.16 280) 0px, transparent 50%),
    radial-gradient(at 80% 20%, oklch(75% 0.14 200) 0px, transparent 50%),
    radial-gradient(at 50% 80%, oklch(72% 0.18 320) 0px, transparent 50%),
    var(--color-surface-base);
}
```

## References
- [Mesh Gradient generator (csshero)](https://meshgradient.com/)

*TODO: variant, screenshot, 토큰 명세 확장.*
