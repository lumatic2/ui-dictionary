# Spring Easing

**한 줄 정의** — 끝에서 살짝 튕기는 cubic-bezier — 디지털 느낌 줄이고 물리감 부여.

## What

표준 `ease-out` 은 끝이 매끄럽고 디지털. spring 은 끝점을 살짝 over-shoot 하고 돌아옴. iOS, framer-motion 의 기본 모션.

대표 곡선 3 종:

| 이름 | bezier | 느낌 |
|---|---|---|
| gentle | `cubic-bezier(0.34, 1.20, 0.64, 1)` | 거의 안 튕김 |
| **default** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 적당 |
| bouncy | `cubic-bezier(0.34, 1.85, 0.64, 1)` | 강하게 튕김 |

## When
- modal / sheet 등장
- 카드 hover scale
- magnetic-button reset

## Anti-use
- 폼 입력 피드백 (정확한 끝 시점 필요)
- 긴 거리 이동 (over-shoot 가 어색)
- reduced-motion 환경

## Tokens

```yaml
motion:
  duration:
    fast:    { value: "150ms", type: duration }
    normal:  { value: "250ms", type: duration }
    slow:    { value: "400ms", type: duration }
  easing:
    spring:  { value: "cubic-bezier(0.34, 1.56, 0.64, 1)", type: cubicBezier }
    smooth:  { value: "cubic-bezier(0.4, 0, 0.2, 1)", type: cubicBezier }
```

## Code

```css
.card { transition: transform 400ms var(--motion-easing-spring); }
.card:hover { transform: scale(1.02); }

@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
}
```

## References
- [easings.net](https://easings.net/)
- [framer-motion spring](https://www.framer.com/motion/transition/#spring)
