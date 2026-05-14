# Noise Texture

**한 줄 정의** — SVG `feTurbulence` 또는 PNG 노이즈를 5-10% opacity 로 깔아 "AI 평면 톤" 을 깨는 기법.

## When
- gradient mesh 위 (도장 자국처럼 텍스처 부여)
- 단색 배경이 너무 깨끗해 디지털 티가 날 때
- Editorial / playful / glass 에 잘 어울림

## Anti-use
- 본문 텍스트 위 직접 (가독성)
- minimal (의도적으로 평면적이어야 함)
- 5% 미만은 안 보임 / 15% 초과는 지저분

## Code

```css
.noise::after {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
  mix-blend-mode: overlay;
  opacity: 0.08;
  pointer-events: none;
}
```

*TODO: 토큰 명세, screenshot, PNG vs SVG 트레이드오프.*
