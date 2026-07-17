# 표현 스택 계보 리서치 — 4 렌더링 티어 기법 조사

- Date: 2026-07-17
- 소비처: VI1 표현 스택 지도 (`docs/plans/2026-07-17-vi1-expressive-stack-map.md`) → `knowledge/expressive-stack.md` 정본의 근거
- 방법: 백그라운드 리서처 2기(sonnet) 병렬 웹 조사(티어 ①②/③④ 분담) + 오케스트레이터 게이트(출처 샘플 검증·자체 쇼케이스 실코드 역산). 전 항목 출처 URL + 접근일 의무(전역 인용 규칙 2026-07-17).
- 지위: 기록(record) — 완료 시점 동결. 살아있는 정본은 `knowledge/expressive-stack.md`.

---

## 자체 쇼케이스 12종 티어 역산 (실코드 grep 근거)

랜딩 Showcase Atlas(`examples/ui-vocabulary-site/src/components/home-page.tsx`, `src/lib/atlas-items.ts`)의 표현 데모를 실코드로 역산한 결과 — **이미 4개 티어가 혼재**하며, 이 계보가 시스템 어디에도 성문화돼 있지 않았다(VI1의 존재 이유).

| Atlas 카드 | 구현 티어 | 실코드 근거 |
|---|---|---|
| Cursor-Reactive Field | ② 모션 오케스트레이션 | `onPointerMove` 좌표→distance/influence 계산→React state로 글리프 갱신 (home-page.tsx:866~) — 렌더는 DOM/CSS |
| Physics-Based Interaction | ③ Canvas 2D·물리 | `matter-js` 엔진 (home-page.tsx:13, MatterPhysicsDemo) |
| Shader Gradient System | ④ WebGL 셰이더 | `@paper-design/shaders-react` MeshGradient (home-page.tsx:14, 2245) — Paper Shaders는 본 리서치 GLSL 절에서도 독립적으로 재발견됨 |
| Product Surface Coverflow | ①+② CSS 3D transform + JS 상태 | `perspective: 1000px` + `rotateY` 스타일 계산 (home-page.tsx:1084~1095) — 진짜 3D 씬 아님(조명·깊이버퍼 없음) |
| Motion Choreography | ② (CSS 렌더 + JS 시퀀싱) | stagger/sequence 상태 머신 (home-page.tsx:935~) |
| Agent-Ready Design System | ①+② CSS 3D tilt | `rotateX/rotateY` + `preserve-3d` (home-page.tsx:756) |
| Color Palette Generator | ③ Canvas 2D (유틸) | PNG export에 `getContext("2d")` 사용 (home-page.tsx:1530) — 시각 효과가 아닌 내보내기 용도 |
| Image Treatment / Hero / Command / Commerce / Mobile | ① CSS | filter·grain·transition 등 선언 티어 (CSS transition/animation 23곳) |

관측: 사이트 전체에서 three.js는 미사용(package.json 부재), rAF 사용 2곳, WebGL은 Paper Shaders 경유 1곳뿐 — ④ 티어가 가장 얇다 (VI4의 존재 이유).

---

## 티어 ① CSS·SVG + ② 모션 오케스트레이션 (리서처 A, 접근일 2026-07-17)

## CSS·SVG 티어

### Mesh Gradient / Conic Gradient
(a) 여러 radial-gradient를 색상별 위치에 겹쳐 유기적인 색면을 만들거나, conic-gradient로 중심점 기준 회전형 색 전환을 만드는 기법.
(b) CSS 티어 — 네이티브 mesh-gradient 문법은 아직 표준화되지 않았지만 다중 radial-gradient 레이어링과 conic-gradient만으로 근사 가능하며, `@property`와 결합하면 색상 정지점(color-stop) 애니메이션도 순수 CSS로 된다.
(c) Colorffy Mesh Gradient Generator, CSS-Zone 2026 트렌드 기사에서 소개된 다중 레이어 기법.
(d) 제품 UI 적용 가능 — 히어로 배경, 브랜드 섹션 배경 등 실무용으로 흔히 쓰임.
(e) [conic-gradient() – MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/conic-gradient), [Latest CSS Gradient Features and Trends for 2026 – CSS-Zone](https://css-zone.com/blog/css-gradient-trends-2026), [Mesh Gradient Generator – Colorffy](https://colorffy.com/mesh-gradient-generator) — 접근일 2026-07-17

### CSS Mask / Clip-path 아트
(a) `clip-path`로 요소를 기하 형태로 잘라내거나 `mask-image`로 그라디언트/이미지를 투명도 스텐실로 사용해 복잡한 형태·리빌 효과를 만드는 기법.
(b) CSS 티어 — `clip-path: path()`는 SVG path 문법을 받아 베지어 곡선 등 polygon으로 불가능한 유기적 형태를 순수 CSS(+SVG path 문자열)로 구현하며 JS 없이 동작.
(c) `path()`/`polygon()` 기반 리빌 애니메이션, SVG를 mask 소스로 쓰는 패턴(CSS-Tricks, yuanchuan.dev 사례).
(d) 실무용 — 카드 리빌, 이미지 크롭, 섹션 디바이더에 널리 쓰임.
(e) [Clipping and Masking in CSS – CSS-Tricks](https://css-tricks.com/clipping-masking-css/), [Using mask as clip-path – yuanchuan](https://yuanchuan.dev/using-mask-as-clip-path), [Paths, shapes, clipping, and masking – web.dev](https://web.dev/learn/css/paths-shapes-clipping-masking) — 접근일 2026-07-17

### backdrop-filter + mix-blend-mode (글래스모피즘)
(a) `backdrop-filter: blur()`로 요소 뒤 배경을 흐리게 처리해 유리 질감을 만들고, `mix-blend-mode`로 배경과의 색상 합성 방식을 바꾸는 기법.
(b) CSS 티어 — GPU가 별도 레이어로 처리해 JS 오버레이 이미지 없이 성능 좋게 구현되며, `mix-blend-mode: normal`이 아닌 값은 backdrop-filter의 경계(backdrop root)를 새로 정의한다는 상호작용이 있음.
(c) Josh W. Comeau의 frosted-glass 튜토리얼, freefrontend의 liquid-glass 스니펫 모음.
(d) 실무용 — 내비게이션 바, 모달, 카드 오버레이에 표준적으로 쓰이는 패턴. Chrome 76+/Firefox 103+/Safari 18+/Edge 79+ 약 95% 지원.
(e) [backdrop-filter – MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter), [Next-level frosted glass with backdrop-filter – Josh W. Comeau](https://www.joshwcomeau.com/css/backdrop-filter/), [10+ CSS Liquid Glass Effects – freefrontend](https://freefrontend.com/css-liquid-glass/) — 접근일 2026-07-17

### Scroll-Driven Animations (CSS `animation-timeline` / `scroll()` / `view()`)
(a) 스크롤 위치(scroll progress timeline) 또는 뷰포트 내 요소 가시성(view progress timeline)을 애니메이션 진행률로 직접 매핑하는 순수 CSS 기법.
(b) CSS 티어 — JS의 scroll 이벤트 리스너·IntersectionObserver 없이 메인 스레드 블로킹 없이 동작, `animation-timeline: scroll()` 또는 `view()`로 선언.
(c) Chrome for Developers·WebKit·Smashing Magazine 튜토리얼, parallax·리빌 온스크롤 패턴.
(d) 실무용으로 빠르게 확산 중 — 프로그레스 바, 패럴랙스, 스크롤 리빌에 적합. Chromium 계열 우선 지원, Safari/Firefox 단계적 지원.
(e) [Scroll-driven animation timelines – MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines), [A guide to Scroll-driven Animations with just CSS – WebKit](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/), [An Introduction To CSS Scroll-Driven Animations – Smashing Magazine](https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/) — 접근일 2026-07-17

### @property / CSS Houdini (Properties and Values API)
(a) CSS 커스텀 프로퍼티에 타입·기본값·상속 여부를 등록해 브라우저가 값의 의미를 이해하게 만들고, 그 결과로 그라디언트 색상·각도 등 이전엔 트랜지션 불가능했던 값을 애니메이션시키는 기법.
(b) CSS 티어(Houdini API 경유) — `@property`로 syntax를 등록하면 브라우저가 보간(interpolation) 방법을 알게 되어 `transition`/`animation`이 그 값에 적용됨. 2024-07-09부로 모든 주요 브라우저에서 지원.
(c) 애니메이션 그라디언트, 커스텀 이징 커브에 사용되는 대표 패턴 (web.dev, egghead.io 예제).
(d) 실무용 — 브라우저 지원이 성숙해 프로덕션에 바로 쓸 수 있음(그라디언트 애니메이션, 커스텀 progress indicator 등).
(e) [@property: giving superpowers to CSS variables – web.dev](https://web.dev/articles/at-property), [@property: Next-gen CSS variables now with universal browser support – web.dev](https://web.dev/blog/at-property-baseline), [CSS Houdini – MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Properties_and_values_API/Houdini) — 접근일 2026-07-17

### SVG 필터 (`feTurbulence` / `feDisplacementMap`) — 텍스처·왜곡
(a) Perlin/fractal 노이즈를 `feTurbulence`로 생성하고, `feDisplacementMap`으로 그 노이즈를 이용해 이미지나 텍스트를 왜곡·텍스처화하는 SVG 필터 조합 기법.
(b) SVG 티어 — CSS `filter` 단독으로는 절차적 노이즈 생성이 불가능하고 SVG `<filter>` 프리미티브(feTurbulence + feDisplacementMap)의 조합이 필요함. `baseFrequency`로 노이즈 밀도, `numOctaves`로 디테일 단계 조절.
(c) Codrops의 feTurbulence 텍스처 튜토리얼, 텍스트 왜곡 데모(Henry From Online), 종이/필름 그레인 오버레이.
(d) 전시용 성격이 강함 — 브랜드 아트웍·히어로 텍스처에는 쓰이지만 인터랙티브 컴포넌트엔 드묾. 필터 스택이 무거워 성능 고려 필요.
(e) [SVG Filter Effects: Creating Texture with feTurbulence – Codrops](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/), [feTurbulence – MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence), [How to distort text with SVG filters – Henry From Online](https://henry.codes/writing/how-to-distort-text-with-svg/) — 접근일 2026-07-17

### CSS-only 아트 (Single-Div Art / 유명 CSS 아티스트)
(a) HTML 태그 1개(대개 `<div>`)와 순수 CSS(box-shadow, gradient, clip-path, transform 등)만으로 구상적 일러스트레이션을 그리는 기법·챌린지 문화.
(b) CSS 티어 — 애초에 "1-div" 제약 자체가 CSS만으로 형태·명암·질감을 표현하는 것을 증명하는 것이 목적. JS는 완전 배제.
(c) Lynn Fisher의 "A Single Div" 프로젝트와 Divtober 챌린지, Diana Smith의 CSS 페인팅, Ana Tudor(삼각함수 기반 기하 아트), Temani Afif, Annie Bombanie.
(d) 순수 전시용 — 포트폴리오·기술 시연 목적, 프로덕션 UI에 직접 쓰이진 않지만 clip-path/gradient/box-shadow 조합 스킬은 실무 컴포넌트 제작에 전이됨.
(e) [Pure CSS Art, one HTML tag — Divtober 2023 – Greg Robleto/Medium](https://robleto.medium.com/pure-css-art-one-html-tag-my-divtober-2023-collection-34d6eb83b106), [These Paintings Were Actually Coded Using Only CSS and HTML – TwistedSifter](https://twistedsifter.com/2019/11/painting-with-css-and-html-by-diana-smith/), [11 Crazy Inspiring CSS Artists You Need to Know – jsdev.space](https://jsdev.space/11-css-artists/) — 접근일 2026-07-17

### 이미지 그레인(필름 노이즈) 트리트먼트
(a) SVG `feTurbulence`로 생성한 노이즈를 그라디언트나 이미지 위에 레이어링해 배너딩(banding)을 줄이고 아날로그 필름 질감을 부여하는 기법.
(b) SVG+CSS 혼합 티어 — 순수 CSS `filter`만으로는 절차적 노이즈를 만들 수 없어 SVG 필터가 필요하지만, Adam Argyle이 제시한 서브픽셀 반복 radial-gradient 왜곡 기법은 SVG 없이 CSS 렌더링 아티팩트만으로 그레인을 흉내내기도 함. Canvas API로 픽셀 단위 실시간 노이즈 생성도 대안.
(c) CSS-Tricks "Grainy Gradients", ibelick의 grainy background 튜토리얼, Adam Argyle 영감 기법.
(d) 실무용 — 그라디언트 배너딩 방지, 브랜드 배경 텍스처에 표준적으로 채택됨.
(e) [Grainy Gradients – CSS-Tricks](https://css-tricks.com/grainy-gradients/), [How to Create Grainy CSS Backgrounds Using SVG Filters – freeCodeCamp](https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/), [Creating grainy backgrounds with CSS – ibelick](https://ibelick.com/blog/create-grainy-backgrounds-with-css) — 접근일 2026-07-17

## 모션 오케스트레이션 티어

### 커서 추적 / 마그네틱 호버
(a) 커서와 요소 간 거리를 계산해 요소가 커서 쪽으로 살짝 끌려오듯 transform을 적용하는 인터랙션.
(b) JS 티어 — 실시간 마우스 좌표 추적과 거리 계산, 그에 따른 동적 transform 갱신이 필요해 CSS `:hover`만으로는 재현 불가(정적 상태 전환만 가능).
(c) Vanilla JS 구현(Init HTML), Magnetic Elements 라이브러리, Cursify의 Magnetic Cursor 컴포넌트, Framer Motion+삼각함수 기반 sticky cursor(Olivier Larose 튜토리얼).
(d) 전시용 성격 강함 — 프리미엄 랜딩페이지·포트폴리오·제품 소개 사이트의 CTA 버튼에 주로 쓰이고, 일반 실무 대시보드/폼에는 과함.
(e) [Magnetic Hover Effect – Init HTML](https://en.inithtml.com/resources/magnetic-hover-effect-creating-cursor-attracted-buttons-with-vanilla-javascript/), [Create Cursor-Attracted Elements With Magnetic Elements Library – CSS Script](https://www.cssscript.com/cursor-magnetic-element/), [Build a Sticky Cursor Effect with Next.js, Framer Motion and Trigonometry – Olivier Larose](https://blog.olivierlarose.com/tutorials/sticky-cursor) — 접근일 2026-07-17

### 스프링 물리 애니메이션 (Framer Motion / react-spring)
(a) 지속시간·이징 커브 대신 tension(장력)·friction(마찰)·mass(질량) 같은 물리 파라미터로 애니메이션이 평형에 도달할 때까지 자연스럽게 움직이게 하는 기법.
(b) JS 티어 — 매 프레임 물리 시뮬레이션 계산(스프링 방정식 적분)이 필요해 선언적 CSS keyframe으로는 흉내만 가능하고 진짜 물리 기반 보간은 JS 런타임이 담당.
(c) react-spring(물리 파라미터 직접 노출), Framer Motion(기본값도 스프링 기반, 제스처 네이티브 지원) — 2026년 기준 Framer Motion이 React 애니메이션 라이브러리 중 주간 다운로드 약 600만으로 지배적.
(d) 실무용 — 인터럽트 시에도 관성이 자연스럽게 이어져(스냅 없이) 제품 UI 인터랙션(드래그, 리스트 재정렬, 모달 전환)에 표준적으로 채택.
(e) [React Spring vs. Framer Motion – DhiWise](https://www.dhiwise.com/post/react-spring-vs-framer-motion-a-detailed-guide-to-react), [Best React Animation Libraries in 2026 – PkgPulse](https://www.pkgpulse.com/guides/best-react-animation-libraries-2026), [GSAP vs Framer Motion vs React Spring: Which Should You Use in 2026? – Good Fella Lab](https://lab.good-fella.com/blog/gsap-vs-framer-motion-vs-react-spring) — 접근일 2026-07-17

### GSAP + ScrollTrigger
(a) 스크롤 위치를 애니메이션의 트리거 또는 재생헤드(scrub) 자체로 바인딩해 pin, snap, scrub 등을 구현하는 프레임워크-무관 JS 애니메이션 라이브러리 플러그인.
(b) JS 티어 — CSS scroll-driven animations보다 훨씬 세밀한 제어(핀 고정, 스크럽, 시퀀스 체이닝, 타임라인 동기화)가 가능하며 복잡한 스토리텔링형 스크롤 연출은 CSS만으로 재현 어려움.
(c) GSAP 공식 ScrollTrigger 플러그인, 다양한 스크롤 스토리·패럴랙스 데모(freefrontend 60+ 예제).
(d) 실무용 — 마케팅 랜딩페이지·에이전시 사이트에서 표준 도구로 널리 채택, CSS scroll-timeline과 병용/대체 논의 진행 중.
(e) [ScrollTrigger – GSAP Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Mastering GSAP ScrollTrigger — A Complete Practical Guide – DEV Community](https://dev.to/vishwark/mastering-gsap-scrolltrigger-a-complete-practical-guide-5bi3), [Scroll – GSAP](https://gsap.com/scroll/) — 접근일 2026-07-17

### FLIP 기법 (First, Last, Invert, Play)
(a) 레이아웃 변경 전후 요소의 위치·크기를 기록한 뒤, transform으로 "마지막 상태에 있지만 첫 상태처럼 보이게" 역산하고 트랜지션을 걸어 재생하는 성능 최적화 애니메이션 기법.
(b) JS 티어(단, 결과는 CSS transform/opacity만 사용) — layout 값(width/height/top/left)의 변경 전후를 JS로 측정·계산(getBoundingClientRect 등)해야 하며, 이를 저비용 속성(transform, opacity)으로 리매핑하는 로직 자체가 JS 개입을 요구.
(c) Paul Lewis(Aerotwist)가 창안, GSAP Flip 플러그인, React 리스트 재정렬 애니메이션(Josh W. Comeau 사례).
(d) 실무용 — 리스트 재정렬, 카드 확장/축소, 공유 요소 전환(shared element transition) 등 프로덕션 UI 표준 패턴.
(e) [Animating Layouts with the FLIP Technique – CSS-Tricks](https://css-tricks.com/animating-layouts-with-the-flip-technique/), [FLIP Your Animations – Aerotwist](https://aerotwist.com/blog/flip-your-animations/), [Flip – GSAP Docs](https://gsap.com/docs/v3/Plugins/Flip/) — 접근일 2026-07-17

### View Transitions API
(a) 브라우저 네이티브 API로 DOM 상태 변경(SPA) 또는 페이지 이동(MPA) 전후 스냅샷을 자동 캡처해 크로스페이드/모핑 전환을 만들어주는 기법.
(b) 브라우저 API 티어(JS 호출 1줄 + CSS `::view-transition-*` 의사요소로 스타일링) — 트리거는 JS(`document.startViewTransition()`)지만 실제 전환 애니메이션 자체는 CSS로 정의되어 Framer Motion 같은 JS 애니메이션 라이브러리를 대체 가능.
(c) same-document 전환은 Chrome 111+/Safari 18+/Firefox 144+, cross-document(MPA) 전환은 Chrome 126+ (Firefox/Safari 미지원, 2026-07 기준).
(d) 실무용으로 빠르게 채택 중 — 페이지 전환·공유 요소 모핑에서 JS 라이브러리 의존도를 줄이는 방향, 단 progressive enhancement 필요.
(e) [View Transition API – MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API), [View Transitions API: Browser Support, Features, Limits – TestMu AI](https://www.testmuai.com/learning-hub/view-transitions-api-browser-support/), [View Transitions API and CSS Scroll-Driven Animations: The Browser Wins of 2026 – Frontend Horizon](https://www.frontendhorizon.com/blog/view-transitions-api-and-css-scroll-driven-animations-the-browser-wins-of-2026) — 접근일 2026-07-17

### Lottie
(a) After Effects에서 Bodymovin 플러그인으로 내보낸 애니메이션을 JSON(벡터 기반) 형태로 웹·모바일에서 네이티브 렌더링하는 애니메이션 포맷/라이브러리.
(b) JS 티어(렌더러 자체는 JS/Canvas/SVG 기반) — 디자이너가 애니메이션을 만드는 도구는 애프터이펙트지만, 재생·인터랙션 제어(play/pause/seek/speed)는 lottie-web JS 러너가 담당하며 CSS로는 임의의 벡터 애니메이션 프레임을 재현할 수 없음.
(c) Airbnb의 오픈소스 lottie-web, LottieFiles 플러그인/dotLottie 포맷.
(d) 실무용 — GIF 대비 10~50배 작은 파일 크기, 해상도 독립적 벡터 품질, 알파 투명도 지원으로 온보딩 일러스트·마이크로 인터랙션·로딩 인디케이터에 표준적으로 채택.
(e) [lottie-web – GitHub/airbnb](https://github.com/airbnb/lottie-web), [Lottie Docs](https://lottie.airbnb.tech/), [Animating with Lottie – CSS-Tricks](https://css-tricks.com/animating-with-lottie/) — 접근일 2026-07-17

### 모션 안무 원칙 (Stagger / Sequencing / Hierarchy)
(a) 여러 요소의 애니메이션 시작 시점을 의도적으로 어긋내거나(stagger) 특정 순서로 배열(sequencing)해 사용자의 시선과 주의를 유도하는 모션 디자인 원칙.
(b) 티어 무관(원칙) — CSS `animation-delay`로도, JS 라이브러리(Motion.dev의 `stagger()`, GSAP timeline)로도 구현 가능. 다만 요소 수가 동적이거나 인터랙션에 반응해야 하면 JS 티어가 유리.
(c) Material Design Choreography, Carbon Design System Motion, Fluent 2, IBM Design Language, Motion.dev `stagger` 유틸리티.
(d) 실무용 — 리스트 진입 애니메이션, 카드 그리드 로딩, 대시보드 위젯 등장 등에서 사실상 표준 지침. 항목 간 시작 간격은 20ms 이내 권장, 안정적 콘텐츠(정적 텍스트·헤더)부터 중요 정보(주요 버튼·계산 결과) 순으로 시퀀싱.
(e) [Motion – Carbon Design System](https://carbondesignsystem.com/elements/motion/choreography/), [Choreography – Material Design](https://m2.material.io/design/motion/choreography.html), [stagger – Motion.dev](https://motion.dev/docs/stagger), [5 steps for including motion design in your system – designsystems.com](https://www.designsystems.com/5-steps-for-including-motion-design-in-your-system/) — 접근일 2026-07-17

---

## 티어 ③ Canvas 2D·물리 + ④ WebGL·three.js (리서처 B, 접근일 2026-07-17)

## Canvas 2D·물리 티어

### Canvas 2D 파티클 시스템
(a) `<canvas>` 2D context에 다수의 점/스프라이트를 프레임마다 갱신·렌더링하는 기법.
(b) DOM+CSS 애니메이션은 수백~수천 개의 개별 요소를 60fps로 굴리기엔 레이아웃/페인트 비용이 크다 — Canvas는 픽셀 버퍼에 직접 그려 그런 오버헤드가 없다.
(c) tsparticles(구 particles.js 계승), jasonmayes/Particle-Engine, 커서 반응형 dot 배경 라이브러리들.
(d) 마케팅 랜딩/히어로 배경 등 전시용에 적합, 실무 UI(폼·테이블)엔 거의 안 쓰임.
(e) 파티클 수가 늘면 CPU 바운드가 됨 — offscreen canvas/worker로 분리 고려. reduced-motion 시 정지 프레임 또는 애니메이션 off 필요.
(f) https://www.jqueryscript.net/blog/best-particle-systems.html (접근일 2026-07-17), https://github.com/jasonmayes/Particle-Engine (접근일 2026-07-17)

### 캔버스 그라디언트·노이즈 기반 Generative Art
(a) 알고리즘 규칙(노이즈 함수, 랜덤 시드)으로 반복 실행마다 다른 그래픽을 생성하는 기법.
(b) CSS 그라디언트는 정적이고 규칙 기반 유기적 패턴을 만들 수 없다 — 캔버스 픽셀 단위 제어와 노이즈 함수 조합이 필요.
(c) p5.js `setup()/draw()` 모델, Processing 혈통.
(d) 브랜드 아이덴티티/아트 페이지 전시용, 프로덕션 UI에는 낮은 적용성.
(e) 매 프레임 전체 재드로우 시 성능 부담 — 정적 프레임으로 캐싱하거나 CSS `image-rendering`으로 대체 가능한지 우선 검토.
(f) https://amplifydai.com/en/resources/generative-art-p5js-guide-en/ (접근일 2026-07-17)

### p5.js 크리에이티브 코딩
(a) Processing을 브라우저로 이식한 설치 불필요 JS 라이브러리 — 도형·색·인터랙션을 간결한 API로 다룸.
(b) 저수준 Canvas API를 직접 다루는 것보다 학습곡선이 낮고 프로토타이핑이 빠름 — 순수 CSS/DOM으론 불가능한 픽셀 단위 알고리즘 아트 구현.
(c) p5.js 공식, Coding Train 튜토리얼 생태계.
(d) 워크숍/교육/아트 전시용 성격이 강함, 프로덕션 제품 UI 적용은 드묾.
(e) 큰 캔버스+고밀도 드로우콜에서 프레임드랍, reduced-motion 대응은 앱 단에서 직접 구현해야 함(라이브러리 내장 없음).
(f) https://blog.openreplay.com/creative-coding-p5js/ (접근일 2026-07-17)

### matter.js 2D 물리 엔진
(a) 브라우저용 2D rigid-body 물리 엔진 — 충돌·중력·마찰·스프링/힌지 제약을 시뮬레이션.
(b) CSS/JS 트윈 애니메이션은 물체 간 상호 충돌·반응(카드가 서로 부딪혀 튕기는 등)을 표현할 수 없다 — 실제 물리 계산이 필요.
(c) `matter-js` npm 패키지(liabru/matter-js), Matter.js 공식 갤러리 데모.
(d) "요소들이 떨어지고 부딪히는" 인터랙티브 랜딩/온보딩 전시용에 적합, 폼·리스트 같은 일반 UI엔 부적합.
(e) 물체 수가 많아지면 충돌 검사 비용 증가 — sleeping body 최적화 필요. reduced-motion 사용자에겐 물리 시뮬 자체를 건너뛰고 정적 배치로 대체 권장.
(f) https://brm.io/matter-js/ (접근일 2026-07-17), https://github.com/liabru/matter-js (접근일 2026-07-17)

### Canvas 기반 커서 트레일
(a) 마우스 이동 경로를 따라 파티클/글로우가 잔상처럼 남는 효과 — fixed 위치 캔버스에 `requestAnimationFrame`으로 그림.
(b) CSS `:hover`/transition은 커서 "경로"를 기억하지 못한다 — 프레임마다 좌표 이력을 버퍼링해 그리는 캔버스가 필요.
(c) Cursify Trail Cursor, amantha6/Cursor-Trial-Effect(스프링 물리 결합).
(d) 크리에이티브 포트폴리오/아트 사이트 전시용, 생산성 도구 UI엔 방해 요소로 작동해 부적합.
(e) `pointer-events: none` 필수, 고빈도 mousemove 이벤트는 쓰로틀링 필요. reduced-motion에서는 완전 비활성화가 표준.
(f) https://dev.to/mawayalebo/creating-an-interactive-glowing-mouse-trail-with-html5-canvas-and-javascript-4a04 (접근일 2026-07-17)

## WebGL·three.js 티어

### three.js 코어 씬 그래프
(a) WebGL을 감싼 JS 3D 엔진 — 씬/카메라/메시/머티리얼/라이트 객체 모델과 렌더 루프를 제공.
(b) Canvas 2D로는 실제 3D 변환(투영·조명·깊이 버퍼)을 직접 구현하기 매우 어렵다 — GPU 셰이더 파이프라인 접근이 필요.
(c) three.js 공식 예제 갤러리.
(d) 3D 제품 뷰어, 인터랙티브 히어로 등 전시/데모용이 주류지만 실무 CAD/구성기 툴에도 쓰임(coverflow 섹션 참조).
(e) `three.module.js` 자체가 gzip 약 155KB — 초기 로드 비용이 큼, 코드 스플리팅 필수. reduced-motion 시 자동 회전/카메라 이동 정지 필요.
(f) https://discourse.threejs.org/t/three-js-file-size-when-importing-via-npm-and-bundling-with-webpack/8904 (접근일 2026-07-17)

### React Three Fiber (R3F)
(a) three.js를 React 컴포넌트 트리로 선언적으로 다루게 하는 렌더러.
(b) three.js를 명령형 imperative API로 직접 다루면 React 상태/리렌더링과 동기화가 번거롭다 — R3F는 씬 그래프를 JSX로 표현해 React 생태계(hooks, context)에 편입시킨다.
(c) `@react-three/fiber` (pmndrs).
(d) 제품 쇼케이스/설정기(configurator) 등에서 실무 채택 사례 존재 — 전시용과 실무용 경계에 걸침.
(e) 리렌더 최적화 미숙 시 프레임드랍 — `useFrame` 내 상태 변경 최소화 필요.
(f) https://r3f.docs.pmnd.rs/getting-started/introduction (접근일 2026-07-17), https://github.com/pmndrs/react-three-fiber (접근일 2026-07-17)

### @react-three/drei 헬퍼 생태계
(a) R3F용 재사용 가능한 헬퍼 컴포넌트 모음(카메라 컨트롤, 환경맵, 텍스트, GLTF 로더 등) — 그 자체로 하나의 생태계.
(b) R3F만으로는 매번 카메라 컨트롤·로더·라이팅 리그를 로우레벨로 재구현해야 함 — drei가 공통 패턴을 캡슐화.
(c) `@react-three/drei`, 관련 확장 `@react-three/postprocessing`, `@react-three/uikit`, Leva(GUI 컨트롤), Lamina(레이어 셰이더 머티리얼).
(d) 제품 뷰어·인터랙티브 데모에서 실무적으로 널리 쓰임.
(e) 헬퍼별 번들 기여도 상이 — tree-shaking 가능한 것만 개별 import 권장.
(f) https://drei.docs.pmnd.rs/ (접근일 2026-07-17)

### GLSL 커스텀 셰이더 — 그라디언트/노이즈/디스토션
(a) 프래그먼트/버텍스 셰이더로 GPU에서 직접 색상·형태를 계산하는 기법(예: 메시 그라디언트, 배닝 없는 노이즈).
(b) CSS `linear/radial-gradient`는 정적·저해상도 색 전이만 가능하고, 애니메이팅되는 유기적 노이즈 왜곡은 GPU 셰이더 없이는 프레임 단위로 재현 불가능.
(c) Paper Shaders(Grain Gradient), Book of Shaders 노이즈 알고리즘, Jorge Jimenez의 gradient noise one-liner(콜오브듀티 출신 기법).
(d) 히어로 배경·브랜드 인트로 등 전시용이 대부분이나, 저해상도 보조 렌더타깃(256×256) 샘플링 같은 최적화로 실무 배포도 가능.
(e) 실시간 프래그먼트 셰이더는 픽셀당 연산 비용이 큼 — 저해상도 렌더타깃 우회 기법 필요. reduced-motion에서는 애니메이션 uniform(시간값) 갱신을 정지.
(f) https://blog.frost.kiwi/GLSL-noise-and-radial-gradient/ (접근일 2026-07-17), https://alexharri.com/blog/webgl-gradients (접근일 2026-07-17), https://shaders.paper.design/grain-gradient (접근일 2026-07-17), https://tympanus.net/codrops/2026/03/04/webgl-for-designers-creating-interactive-shader-driven-graphics-directly-in-the-browser/ (접근일 2026-07-17)

### WebGL 유체 시뮬레이션 (WebGL-Fluid-Simulation)
(a) Navier-Stokes 방정식을 GPU에서 실시간 근사해 소용돌이치는 유체 흐름을 시각화하는 기법.
(b) Canvas 2D나 CSS로는 유체 역학 방정식의 실시간 반복 계산을 감당할 수 없다 — 프래그먼트 셰이더의 병렬 연산이 필요.
(c) PavelDoGreat/WebGL-Fluid-Simulation, React 래퍼 x8BitRain/react-webgl-fluid.
(d) 인터랙티브 히어로/이벤트 페이지 전시용, 모바일 포함 실시간 인터랙션 가능하나 실무 UI 채택은 드묾.
(e) GPU 부하가 크고 배터리 소모 큼 — 저전력 모드 감지·해상도 다운스케일 필요. reduced-motion에서는 자동 애니메이션(스플랫 자동 생성)을 끄고 사용자 인터랙션에만 반응하도록 조정 권장.
(f) https://github.com/PavelDoGreat/WebGL-Fluid-Simulation (접근일 2026-07-17), https://paveldogreat.github.io/WebGL-Fluid-Simulation/ (접근일 2026-07-17)

### @react-three/postprocessing (포스트프로세싱)
(a) 렌더된 씬에 Bloom, Depth of Field, Chromatic Aberration, Vignette 등 화면 전체 효과를 EffectComposer로 합성하는 기법.
(b) 개별 머티리얼/셰이더 수정만으로는 화면 전역 효과(글로우, 색수차)를 표현할 수 없다 — 렌더 패스 체이닝이 필요.
(c) `@react-three/postprocessing`(pmndrs, `postprocessing` npm 패키지 래핑), 20개 이상 내장 이펙트.
(d) 제품 쇼케이스의 고급 마감 처리로 전시/일부 실무 겸용.
(e) EffectPass 병합으로 다중 이펙트의 렌더 비용을 줄이지만 여전히 추가 GPU 부하 — 모바일에서는 이펙트 수 제한 권장.
(f) https://github.com/pmndrs/react-postprocessing (접근일 2026-07-17), https://react-postprocessing.docs.pmnd.rs/effect-composer (접근일 2026-07-17)

### 3D Coverflow / WebGL 캐러셀
(a) 앨범 커버플로우처럼 3D 원근감으로 배치된 아이템을 회전·스크롤시키는 기법.
(b) CSS `transform: perspective`로도 유사 흉내는 가능하지만, 진짜 조명·그림자·왜곡 반사가 있는 캐러셀은 실제 3D 씬(카메라+메시)이 필요.
(c) addyosmani/threejs-coverflow, Codrops의 R3F+GSAP WebGL 캐러셀 튜토리얼.
(d) 미디어/커머스 갤러리에서 전시성과 실무성이 공존(제품 이미지 캐러셀 등).
(e) 아이템 수가 많으면 지오메트리/텍스처 메모리 관리 필요 — 화면 밖 아이템 언로드. reduced-motion 시 자동 회전 관성 스크롤을 끄고 클릭 기반 스텝 이동으로 대체.
(f) https://github.com/addyosmani/threejs-coverflow (접근일 2026-07-17), https://tympanus.net/codrops/2023/04/27/building-a-webgl-carousel-with-react-three-fiber-and-gsap/ (접근일 2026-07-17)

### WebGPU / three.js WebGPURenderer
(a) WebGL을 잇는 차세대 GPU API — three.js는 r171(2025년 9월)부터 `WebGPURenderer`를 제로 설정으로 지원.
(b) WebGL은 오래된 그래픽 파이프라인 모델(고정 함수 상태 머신)에 묶여 있어 컴퓨트 셰이더·최신 GPU 병렬성 활용이 제한적 — WebGPU는 더 낮은 오버헤드와 컴퓨트 파이프라인을 제공.
(c) three.js `WebGPURenderer`(구버전 브라우저는 WebGL2로 자동 폴백).
(d) 2026년 기준 Chrome/Edge/Firefox(147, 2026-01-13)/Safari(iOS 26/macOS Tahoe)에서 기본 활성화 — 전역 커버리지 약 95%, 아직은 성능 민감 전시용 우선 채택.
(e) 복잡한 씬에서 2~10배 성능 향상 보고되나 폴백 경로 테스트 필수, WebGPU 미지원 5%는 WebGL2로 자동 전환.
(f) https://www.utsubo.com/blog/threejs-2026-what-changed (접근일 2026-07-17), https://vr.org/articles/webgpu-baseline-2026-three-js-webxr-default (접근일 2026-07-17), https://threejs.org/docs/pages/WebGPURenderer.html (접근일 2026-07-17)

## React 통합·번들 전략

### R3F lazy-load / dynamic import + Suspense 패턴
(a) `React.lazy()` + `import()` + `<Suspense>`로 3D 씬/모델 로딩을 초기 페이지 로드와 분리하는 패턴.
(b) three.js/R3F를 앱 진입 번들에 포함시키면 초기 로드 시간이 크게 늘어난다 — 코드 스플리팅 없이는 대부분의 사용자가 3D를 보지 않아도 비용을 치르게 된다.
(c) React `lazy`/`Suspense`, R3F `useGLTF.preload()`, 라우트 단위 씬 스플리팅.
(d) 실무 적용 시 필수 패턴 — 3D를 부분 기능으로 쓰는 모든 프로덕션 앱에 해당.
(e) `useLoader`가 텍스처마다 프로미스를 throw해 Suspense가 자식을 언마운트하며 시각적 깜빡임을 유발할 수 있음 — 로딩 상태 UI 별도 설계 필요.
(f) https://r3f.docs.pmnd.rs/advanced/scaling-performance (접근일 2026-07-17), https://blog.greenroots.info/understanding-dynamic-imports-lazy-and-suspense-using-react-hooks (접근일 2026-07-17), https://aaronclaes.be/blogs/react-three-fiber/loading-assets (접근일 2026-07-17)

### three.js 번들 크기 실측
(a) `three.module.js`를 npm으로 설치해 webpack으로 번들링했을 때의 실제 전송 크기.
(b) three.js는 완전한 tree-shaking이 어려워(단일 거대 모듈 구조) 필요한 기능만 골라 담아도 상당한 고정 비용이 남는다 — 도입 전 비용 산정이 필요.
(c) three.js discourse 포럼 실측 스레드.
(d) 실무 채택 여부를 결정할 때 핵심 지표 — gzip 약 155KB는 텍스트/이미지 사이트의 초기 로드 예산을 크게 잠식.
(e) 일부 청크는 alias로 제외 가능하나 근본적으로 무겁다는 점을 감안해 lazy-load(위 항목)와 반드시 병행.
(f) https://discourse.threejs.org/t/three-js-file-size-when-importing-via-npm-and-bundling-with-webpack/8904 (접근일 2026-07-17)

### prefers-reduced-motion 대응 — WebGL/Canvas 접근성
(a) OS 레벨 "동작 줄이기" 설정을 CSS 미디어 쿼리로 감지해 캔버스/WebGL 애니메이션을 조건부로 끄는 기법.
(b) `<canvas>`/WebGL 콘텐츠는 CSS `animation`이 아니라 JS 렌더 루프로 움직이므로, CSS만으로는 자동 억제되지 않는다 — 반드시 JS에서 `matchMedia('(prefers-reduced-motion: reduce)')`를 읽어 렌더 루프·자동 회전·패럴랙스를 명시적으로 분기해야 한다.
(c) MDN/W3C WCAG 기법 C39, web.dev 가이드.
(d) 이 문서에서 다룬 모든 캔버스/WebGL 티어 기법(파티클, 물리, 유체, 셰이더, 캐러셀, 자동 회전 3D)에 공통 적용되는 게이팅 규칙.
(e) 전정기관 장애(vestibular disorder) 인구가 7천만 명 이상으로 추정 — 자동 회전·카메라 이동·대형 객체 스케일/패닝은 WCAG 2.3.3/2.2.2 위반 위험이 높은 1순위 억제 대상. WebGL 콘텐츠는 캔버스 자체가 스크린리더에 불투명하므로 파라렐 HTML 레이어(포커스 가능한 DOM 대응 요소 + aria-label + aria-live)로 보완 필요.
(f) https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion (접근일 2026-07-17), https://www.w3.org/WAI/WCAG21/Techniques/css/C39 (접근일 2026-07-17), https://web.dev/learn/accessibility/motion (접근일 2026-07-17), https://emit-solution.com/blog/webgl-barrierefreiheit-bfsg (접근일 2026-07-17)

---

## Backlinks

- 소비처: `knowledge/expressive-stack.md` (VI1 Step 2 정본)
- Plan: `docs/plans/2026-07-17-vi1-expressive-stack-map.md`
- Horizon: `docs/horizons/2026-07-expressive-stack.md`
