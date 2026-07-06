# 조사 노트 — Radix Themes / Radix Colors

> SMC0 시장 포맷 조사. 수집: 2026-07-07, sonnet 리서치 에이전트. 게이트 검증 완료.

## 1. 12-step scale 용도 규약

| Step | 용도 |
|---|---|
| 1-2 | App/subtle 배경 |
| 3-5 | 인터랙티브 컴포넌트 상태 (3=default, 4=hover, 5=active/selected) |
| 6-8 | 보더 (6=subtle separator, 7=interactive border, 8=focus ring) |
| 9-10 | Solid 배경 (9=최고 chroma, 10=hover) |
| 11-12 | 텍스트 (11=low-contrast, 12=high-contrast, APCA 대비 보장) |

- gray와 accent 스케일이 **동일한 12-step 의미 규약을 공유** — 규약이 색상과 무관하게 통일.
- Alias 메커니즘: `--red-1: var(--ruby-1);` 식으로 팔레트 통째 스왑 가능, 참조 변수명은 고정.

## 2. 테마 설정 표면

- `Theme` 컴포넌트 props: `accentColor`, `grayColor`, `radius`, `scaling`, `appearance`(light/dark).
- CSS 변수: `--accent-1~12`, `--gray-1~12`, alpha 변형 `-a`, semantic `--color-background`/`--color-panel-solid`/`--color-surface`/`--color-overlay`.
- `ThemePanel` — 런타임 테마 실시간 미리보기 개발 도구.

## 3. 배포 형태

- `@radix-ui/themes` (npm, React 컴포넌트 + styles.css).
- `@radix-ui/colors` (별도 npm) — **CSS 파일 형태 배포**(JS 객체 아님), 스케일별 light/dark 개별 stylesheet. Themes 없이 독립 사용 가능.

## 4. 컴포넌트 문서 구조 (Button 기준)

Introduction(설명+기본 예시) → API Reference(props 테이블) → Examples(Size/Variant/Color/High-contrast/Radius/Icons/Loading 기능별 데모).

## 5. Light/Dark

- `appearance` prop으로 강제 지정. **시스템 자동 감지는 의도적으로 미지원**(SSR/hydration 복잡성) — `next-themes` 등 서드파티에 위임, DOM 클래스 토글에 CSS가 반응. 내부 변수 스위칭 메커니즘은 미확인.

## 6. Askewly Design 채택 관점

가져올 것: ① 12-step 용도 고정 규약(primitive layer 규약으로 흡수 — 사이트 문서와 에이전트 프롬프트가 같은 어휘 사용) ② alias 메커니즘(테마 프리셋 스왑 + semantic 참조 고정) ③ 문서 구조(API Reference + 기능별 Examples — 사람/에이전트 겸용).

안 맞는 것: ① 런타임 React prop 기반 테마 주입(우리는 정적 SSOT 파일 → CSS 변수 생성 파이프라인 필요) ② CSS 전용 배포(에이전트가 값을 읽으려면 JSON/YAML 병행 필요) ③ 다크모드 서드파티 위임(에이전트 구현 편차 위험 — 자체 규약 필요).

## 7. 출처

- https://www.radix-ui.com/themes/docs/overview/getting-started
- https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- https://www.radix-ui.com/themes/docs/theme/dark-mode
- https://www.radix-ui.com/themes/docs/components/button
