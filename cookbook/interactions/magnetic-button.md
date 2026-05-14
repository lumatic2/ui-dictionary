# Magnetic Button

**한 줄 정의** — 커서가 근접하면 버튼이 마우스 쪽으로 살짝 끌려오는 hover 인터랙션.

## What

마우스가 버튼의 일정 반경(보통 80-120px) 안에 들어오면, 버튼이 커서 방향으로 6-12px 정도 translate. 멀어지면 spring easing 으로 원위치. Awwwards 류 portfolio 사이트의 시그니처.

핵심 원리:
1. 컨테이너에 mouseover 리스너
2. 마우스 좌표 - 버튼 중심 좌표 = 변위 벡터
3. 변위 × 강도(0.2-0.4) 를 `transform: translate3d()` 로 적용
4. mouseleave 시 spring easing 으로 (0,0)

## When

- **portfolio / agency / hero CTA** — 한 페이지에 1-2 개만.
- 데스크탑 우선 디자인 (모바일은 효과 의미 없음).
- **Glass / playful aesthetic** 시스템에 잘 어울림.

## Anti-use

- **forms / dense UI** — 정확한 클릭이 필요한 곳에 쓰면 짜증.
- **3 개 이상 동시 사용** — 페이지 전체가 멀미.
- **`prefers-reduced-motion: reduce`** 환경 — 강제 비활성.
- **터치 디바이스** — pointer hover 가 없으므로 효과 없음. `(hover: hover)` 미디어쿼리로 게이트.
- **Brutalist / Editorial 시스템** — 톤 안 맞음.

## Tokens required

```yaml
tokens:
  dimension:
    space:
      "2": { value: "8px", type: dimension }     # 최대 변위
  motion:
    duration:
      spring: { value: "400ms", type: duration }
    easing:
      spring: { value: "cubic-bezier(0.34, 1.56, 0.64, 1)", type: cubicBezier }
```

## Code

### React + Tailwind v4

```tsx
import { useRef, useEffect } from 'react';

export function MagneticButton({
  children,
  strength = 0.3,
  radius = 100,
}: {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = ref.current;
    if (!btn) return;

    // 접근성·디바이스 가드
    const mq = window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        btn.style.transform = '';
        return;
      }
      btn.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    };

    const onLeave = () => {
      btn.style.transform = '';
    };

    window.addEventListener('pointermove', onMove);
    btn.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      btn.removeEventListener('pointerleave', onLeave);
    };
  }, [strength, radius]);

  return (
    <button
      ref={ref}
      className="
        px-6 py-3 rounded-md
        bg-action-primary text-on-primary
        transition-transform duration-[400ms]
        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
        will-change-transform
      "
    >
      {children}
    </button>
  );
}
```

핵심 디테일:
- **`pointermove` on `window`**, not button — 버튼 밖에서도 끌어와야 magnet 느낌
- **`pointerleave`** 로 reset (커서가 빠르게 빠져나가도 멈춤)
- **`will-change: transform`** + **`translate3d`** = GPU 가속 hint
- transition 은 hover 가 *떨어질 때*만 의미 있음. 마우스 추적 중엔 즉시 반영, 떨어지면 spring

### Vanilla JS

```js
function magnetize(btn, { strength = 0.3, radius = 100 } = {}) {
  const mq = matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)');
  if (!mq.matches) return;
  const move = (e) => {
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2;
    const dy = e.clientY - r.top - r.height / 2;
    if (Math.hypot(dx, dy) > radius) { btn.style.transform = ''; return; }
    btn.style.transform = `translate3d(${dx*strength}px,${dy*strength}px,0)`;
  };
  addEventListener('pointermove', move);
  btn.addEventListener('pointerleave', () => btn.style.transform = '');
}
```

## Variants

### 1. Magnetic + Halo

버튼 자체는 작게 움직이되, 뒤에 큰 halo (border-radius full, blur) 가 더 강하게 움직임. 시각적 무게중심 분리.

### 2. Inner Magnet

버튼 자체는 고정, 안의 아이콘만 끌려옴. 정밀 클릭이 필요할 때 안전한 변주.

## Screenshot

`./magnetic-button.gif` *(TODO: 캡처)*

## 검증 노트

- a11y: `prefers-reduced-motion` 강제 비활성 — code 의 mq 체크 필수.
- focus-visible: hover 효과만 있고 focus 인디케이터 누락하면 키보드 사용자 손해. 별도 outline 스타일 반드시.
- 클릭 정확도: strength 0.4 이상 + radius 150+ 이면 빗나감. 0.3 / 100 권장.

## References

- [Codrops — Magnetic Button (vanilla)](https://tympanus.net/codrops/2020/09/24/magnetic-button-with-vanilla-js/)
- [Awwwards 사이트 다수 사용 사례](https://www.awwwards.com/)
- MDN: [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Changelog

## 2026-05-14
- 초안. React + Vanilla, 두 variant, 접근성 가드.
