# Expressive Stack — 표현 기술 티어 지도

Date: 2026-07-17
Milestone: VI1 (plan: `docs/plans/2026-07-17-vi1-expressive-stack-map.md`)
지위: 살아있는 정본. 근거·출처 전체는 `docs/research/2026-07-17-expressive-stack-genealogy.md`(동결 기록, 전 항목 출처 URL+접근일) — 이 문서는 판정 규칙만 담고 근거를 중복 서술하지 않는다.

Audience: 코드를 생성하는 에이전트(Codex, Claude Code). "이 시각 효과는 무엇으로 만드는가"를 판정하는 데 쓴다.

## 4개 렌더링 티어

| 티어 | 정의 | 판별 신호 |
|---|---|---|
| **① CSS·SVG** (선언) | 브라우저가 선언만으로 렌더·애니메이션. JS 개입 없음 | 상태 A→B 전환, 정적/반복 시각, 스크롤 진행률 매핑 |
| **② 모션 오케스트레이션** (JS 지휘 + CSS/DOM 렌더) | JS가 입력·측정·시퀀스를 계산하고 최종 렌더는 CSS transform/opacity | 커서 좌표·요소 측정·동적 시퀀스가 필요, 그러나 그리는 대상은 여전히 DOM |
| **③ Canvas 2D·물리** | JS가 픽셀 버퍼에 직접 그림. 물리 엔진 포함 | 수백 개 이상 개체, 경로 이력, 상호 충돌 — DOM 개체로는 성능 불가 |
| **④ WebGL·three.js** (GPU) | 셰이더 파이프라인. 3D·프레임 단위 절차적 픽셀 계산 | 조명·깊이·유기적 노이즈 애니메이션·유체 — CPU 픽셀 루프로 불가 |

## 기법→티어 결정 표

| 원하는 효과 | 티어 | 도구·기법 (근거: research doc 해당 절) |
|---|---|---|
| hover 시 색·그림자·크기 전환 | ① | CSS `transition` — JS 불필요 |
| 유리 질감(글래스모피즘)·배경 블러 | ① | `backdrop-filter` + `mix-blend-mode` |
| 메시/원뿔형 그라디언트 배경 | ① | 다중 radial-gradient 레이어링, `conic-gradient`, `@property`로 색 애니메이션 |
| 형태 잘라내기·리빌 | ① | `clip-path: path()`, `mask-image` |
| 스크롤 진행률에 매핑된 애니메이션 | ① | CSS scroll-driven animations (`animation-timeline`) — 단순 매핑이면 JS 불필요 |
| 그레인/필름 노이즈 텍스처 | ① | SVG `feTurbulence` 오버레이 (CSS filter 단독으론 노이즈 생성 불가) |
| 텍스트·이미지 왜곡 | ① | SVG `feTurbulence`+`feDisplacementMap` |
| 커서 추종·마그네틱 hover | ② | 포인터 좌표→거리 계산→CSS transform 갱신 (CSS `:hover`는 커서 위치를 모름) |
| 스프링·관성 있는 UI 모션 | ② | Framer Motion / react-spring (물리 파라미터 보간은 JS 런타임) |
| 핀 고정·스크럽·스크롤 스토리텔링 | ② | GSAP ScrollTrigger (CSS scroll-driven보다 세밀한 제어) |
| 리스트 재정렬·카드 확장 전환 | ② | FLIP 기법 (측정은 JS, 재생은 CSS transform) |
| 페이지·상태 전환 모핑 | ①+② | View Transitions API (트리거 JS 1줄 + `::view-transition-*` CSS) |
| 벡터 일러스트 애니메이션 | ② | Lottie (AE 제작 → lottie-web 재생) |
| 다요소 등장 안무(stagger) | ①/② | 정적이면 CSS `animation-delay`, 동적 개수·인터럽트면 JS stagger |
| 수백 개 파티클·커서 트레일 | ③ | Canvas 2D + rAF (DOM 개체로는 레이아웃 비용 폭발) |
| 개체 간 충돌·낙하·물리 | ③ | matter-js (트윈으론 상호작용 불가) |
| 제너러티브 아트·노이즈 드로잉 | ③ | p5.js / Canvas API |
| 3D 씬·조명·제품 뷰어 | ④ | three.js / R3F + drei (CSS `perspective`는 조명·깊이버퍼 없음 — 유사 흉내만) |
| 애니메이팅되는 유기적 셰이더 그라디언트 | ④ | GLSL / Paper Shaders (CSS 그라디언트는 프레임 단위 노이즈 불가) |
| 유체 시뮬레이션 | ④ | WebGL-Fluid-Simulation (Navier-Stokes는 GPU 병렬 필수) |
| 화면 전역 글로우·색수차 | ④ | @react-three/postprocessing |

## 판정 절차 (에이전트 의무)

1. **하위 티어 우선.** 같은 효과가 두 티어로 가능하면 항상 낮은 티어를 쓴다 — 예: 단순 hover에 JS 금지, 단순 스크롤 리빌에 GSAP 금지, 유사 3D(coverflow류)에 three.js 도입 금지(CSS `perspective`+`rotateY`로 충분한지 먼저 판정).
2. **티어 상승에는 근거를 적는다.** ②→③→④로 올릴 때는 "하위 티어로 안 되는 이유"(커서 이력 필요, 상호 충돌 필요, 조명/노이즈 필요 등)를 코드 리뷰어가 볼 위치(PR/변경 기록)에 남긴다.
3. **③·④ 티어는 reduced-motion 분기가 의무.** canvas/WebGL은 CSS와 달리 자동 억제되지 않는다 — `matchMedia('(prefers-reduced-motion: reduce)')`로 렌더 루프·자동 회전을 명시적으로 끄고, 스크린리더용 병렬 DOM 레이어를 제공한다.
4. **④ 티어는 lazy-load가 의무.** three.js는 gzip ~155KB 고정 비용 — dynamic import + Suspense로 격리하고 초기 번들에 넣지 않는다.
5. **시그니처 접점**: 실험적 표현(③·④ 티어 대부분, ②의 커서/마그네틱)은 운용 원칙 5 "실험적 터치는 수동" — 사용자가 명시로 요청했을 때만 도입하고, 기본 제품 UI에는 ① 티어와 ②의 실무 패턴(스프링·FLIP·stagger)까지만 기본값으로 쓴다.

## 자체 쇼케이스 역산 (참조 구현)

askewly.com 랜딩 Showcase Atlas 12종의 티어 분포 — 실코드 근거는 research doc 역산 표:
① CSS 다수(Image Treatment·Hero 등) + CSS 3D 유사물(Coverflow, Agent 카드 tilt) · ② Cursor-Reactive Field, Motion Choreography · ③ Physics(matter-js) · ④ Shader Gradient(Paper Shaders). three.js는 미사용 — GPU 티어 확장은 VI4.

## Changelog

- 2026-07-17: 초판 (VI1 — 리서치 30기법 계보 + 쇼케이스 12종 역산에서 증류).
