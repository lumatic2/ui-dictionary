# Horizon — Expressive Stack (표현 기술 스택 수직 통합)

Date: 2026-07-17
Status: closed (2026-07-17 — VI1~VI5 전부 완료, Close Criteria 3항 충족: 결정 표 llms 배포·4티어 각 1+ live recipe 검증 체인 통과·shadcn 재스타일 가이드 배포)
Objective link: `OBJECTIVE.md` (성공 상태 ③ 에이전트 소비 — "의도적으로 디자인된 느낌의 UI"의 표현 상한을 끌어올림)
Preceding horizon: `docs/horizons/2026-07-agent-adoption-loop.md` (closed 2026-07-17)

## Goal

"Tailwind(문법) → shadcn(부품) → Askewly(판단)" 스택에서 아래 두 층을 판단력의 대상으로 흡수한다. 웹 화면에 그려지는 시각 표현의 **대다수**(사용자 확정 2026-07-17)를 4개 렌더링 티어 — ① CSS·SVG(선언) ② 모션 오케스트레이션(JS 지휘+CSS 렌더) ③ Canvas 2D·물리 ④ WebGL·three.js(GPU) — 로 계보화하고, 에이전트가 "이 효과는 어느 층으로 만드나"를 판정해 실제로 구현할 수 있는 recipe·knowledge를 정본화한다.

## Why Now

- agent-adoption-loop가 판단 주입 루프(라우팅→시그니처 판정→갭 해소)를 검증 완료 — 루프에 채울 콘텐츠 깊이가 다음 병목.
- 사용자 실질 수요(2026-07-17): "CSS로 예술을 하는 것들은 어떻게 만드는 건지 궁금하고 우리 시스템에 편입하고 싶다" + "유려한 hover가 CSS인지 JS인지 모르겠다" — 기법→티어 판정 지식 자체가 부재.
- 자체 쇼케이스 실측: 랜딩 12종 데모가 이미 4개 티어 혼합(CSS transition 23곳·rAF·canvas 2D·matter-js)인데 그 계보가 시스템 어디에도 성문화돼 있지 않다.
- toolshelf recall 실측으로 흡수 후보 확보: react-bits·GSAP·magicui·cult-ui·animated-grid-lines·WebGL-Fluid-Simulation·taste-skill·nothing-design-skill.

## Milestones

> 실행 순서: VI1(지도) → VI2·VI3·VI4(티어별 recipe, VI1 산출이 선정 입력) → VI5(부품·흡수). VI2~VI5 plan doc은 VI1 결과를 입력으로 승격 시점에 펼친다(아는 만큼만).

### VI1 — 표현 스택 지도 (P0)

전 티어 기법 계보 리서치(`docs/research/`) + **기법→티어 결정 표**("이 효과는 뭘로 만드나") + `knowledge/expressive-stack.md` 정본화. 재료: 웹 리서치(출처 URL+접근일 의무), toolshelf 카드, 자체 쇼케이스 12종 역산. llms 배포로 에이전트 소비 가능하게.

### VI2 — CSS·SVG 티어 recipes (P1)

선언 티어 기법(gradient mesh·mask/clip-path·blend/filter·scroll-driven·SVG 필터·이미지 트리트먼트)을 recipe + Gallery live 데모로. 기존 검증 체인(validate-recipes·build·llms.txt) 그대로.

### VI3 — 모션 오케스트레이션 티어 recipes (P1)

커서 반응·자석/스프링·모션 안무·view transition 패턴. 시그니처 원칙 5("실험적 터치는 수동")와의 접점 — 언제 써도 되는가 — 를 recipe마다 명시.

### VI4 — Canvas·WebGL·three.js 티어 (P1)

three.js/R3F 정식 도입 + canvas 2D·물리·셰이더 recipe. **기술 조건(사용자 GO 2026-07-17): 무거운 데모는 dynamic import lazy-load로 격리** — 현 사이트 청크 3MB 경고를 악화시키지 않는 것이 DoD 일부.

### VI5 — 부품 층 계약 + 레퍼런스 흡수 (P2)

shadcn 재스타일 가이드("shadcn 룩 탈출") + 외부 라이브러리(react-bits·magicui·GSAP 등) 흡수 기준 — 무엇을 recipe로, 무엇을 링크로만. toolshelf used 기록 연동.

## Close Criteria

기법→티어 결정 표가 llms 배포되어 에이전트가 소비 가능하고, 4개 티어 각각에 live 데모 recipe가 1건 이상 검증 체인을 통과하며, shadcn 재스타일 가이드가 배포되면 닫는다.

## 범위 제외

- 차트·데이터 시각화 (별도 dataviz 영역)
- 네이티브 앱 렌더링, 비디오 편집급 처리
- 결제·수익화 (parked horizon — `docs/horizons/CANDIDATES.md` 복귀 후보 유지)
- AskewlyDesign 데스크톱 앱 캔버스 엔진 변경 (ADR 0006 계약 유지)

## Objective Impact Target

성공 상태 ③의 표현 상한 확장: 에이전트 산출물이 "정돈된 UI"를 넘어 "표현 티어를 의도적으로 선택한 UI"가 되게 한다. 이동 축 "탐색·주입 도구 → 제작 환경"의 표현력 축을 채운다.

## Backlinks

- Objective: `OBJECTIVE.md`
- Horizon 후보 백로그: `docs/horizons/CANDIDATES.md` (vertical-integration 후보 → 본 horizon으로 선정·개명 2026-07-17)
- Predecessor: `docs/horizons/2026-07-agent-adoption-loop.md` (closed 2026-07-17)
