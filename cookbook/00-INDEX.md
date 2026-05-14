# Cookbook — 디자인 기법 카탈로그

> 한 장 = 한 기법. 시스템 레벨이 아니라 **부품 레벨**.
>
> 시스템 전체 톤은 [`design-md/<family>/`](../design-md/), 풀 적용 사례는 [`examples/`](../examples/). 여기는 그 사이.

## 파일 포맷 (모든 cookbook 파일 공통)

```markdown
# <기법 이름>

**한 줄 정의** — 무엇인지 한 줄.

## What
1-2 문단 설명. 시각적으로 어떤 결과인지.

## When
- 어울리는 시스템 (aesthetic family·맥락)
- 해결하는 문제

## Anti-use
- 쓰면 안 되는 곳 (구체적으로)
- 흔한 오용

## Tokens required
DESIGN.md 에 어떤 토큰이 있어야 동작하는지. 없으면 추가할 후보.

## Code
최소 동작 스니펫 (HTML/CSS 또는 React + Tailwind v4). 토큰 변수로 참조.

## Variants (optional)
주요 변주 1-2 개.

## Screenshot
`./<slug>.png` 또는 외부 링크.

## References
원전·튜토리얼.

## Changelog
## YYYY-MM-DD
- 메모
```

## 카탈로그

### effects/ — 시각 효과
- [glassmorphism](effects/glassmorphism.md) — frosted glass 패널
- [gradient-mesh](effects/gradient-mesh.md) — 부드러운 다색 배경 *(stub)*
- [noise-texture](effects/noise-texture.md) — SVG/canvas 노이즈 오버레이 *(stub)*
- [3d-tilt](effects/3d-tilt.md) — 마우스 위치 기반 perspective tilt *(stub)*

### interactions/ — 마이크로인터랙션
- [magnetic-button](interactions/magnetic-button.md) — 커서 근접 시 끌려오는 버튼
- [scroll-reveal](interactions/scroll-reveal.md) — IntersectionObserver 기반 등장 *(stub)*
- [view-transitions](interactions/view-transitions.md) — View Transitions API 활용 *(stub)*
- [focus-visible](interactions/focus-visible.md) — a11y 친화 포커스 인디케이터 *(stub)*

### layouts/ — 레이아웃 패턴
- [bento-grid](layouts/bento-grid.md) — 비균등 카드 그리드 *(stub)*

### motion/ — 모션 시스템
- [spring-easing](motion/spring-easing.md) — 스프링 cubic-bezier *(stub)*

## 사용 흐름

1. AI 에게 "X 기법 적용해줘" 시키기 전에 본 카탈로그 검색
2. 해당 파일의 **Tokens required** 확인 → DESIGN.md 에 없으면 먼저 추가
3. **Anti-use** 확인 → 우리 시스템에 안 맞으면 stop
4. **Code** 를 토대로 적용. 토큰 변수만 갈아끼우면 식별 가능한 우리 톤으로 나옴

## 기여 룰

- 새 기법 추가 시 위 포맷 그대로
- Anti-use 가 없는 기법은 받지 않음 (만능 기법은 없다)
- 토큰 참조 없는 코드는 받지 않음 (매직 넘버 박힌 스니펫 X)
- Screenshot 은 1280×800 max, png/webp
