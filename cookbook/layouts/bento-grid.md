# Bento Grid

**한 줄 정의** — 크기 다른 카드를 도시락 칸처럼 비균등하게 배치하는 그리드. Apple 마케팅·visionOS·Linear changelog 의 시그니처.

## What

CSS Grid 의 `grid-template-areas` 또는 `span` 으로 카드마다 다른 크기 부여. 정사각·세로 직사각·가로 직사각이 섞임. 중요한 카드를 크게 → 시각 위계가 콘텐츠 위계가 됨.

## When
- 마케팅 hero 아래 feature 섹션
- 대시보드 요약 (KPI 큰 칸 + 보조 작은 칸)
- changelog / release notes

## Anti-use
- 카드 수 < 4 (그리드 의미 없음)
- 모든 카드 내용이 동일 weight (그냥 균등 그리드가 나음)
- 좁은 viewport (mobile 은 1 컬럼으로 strip)

## Code

```css
.bento {
  display: grid;
  gap: var(--dimension-space-4);
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(200px, auto);
}

.bento > .feature      { grid-column: span 2; grid-row: span 2; }  /* 큰 카드 */
.bento > .wide         { grid-column: span 2; }                    /* 가로 */
.bento > .tall         { grid-row: span 2; }                       /* 세로 */
/* 나머지는 1×1 */

@media (max-width: 640px) {
  .bento { grid-template-columns: 1fr; }
  .bento > * { grid-column: auto; grid-row: auto; }
}
```

## Variants
- **Asymmetric**: feature 카드를 좌상단 고정 → 시선 흐름 강제
- **Magazine**: 가운데 큰 이미지 + 둘레 텍스트 카드

## References
- [Apple Vision Pro 페이지](https://www.apple.com/apple-vision-pro/)
- [Linear changelog](https://linear.app/changelog)

*TODO: tailwind 버전, screenshot.*
