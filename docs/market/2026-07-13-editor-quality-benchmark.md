# Market Intake — Code-Native Editor Quality Benchmark

Date: 2026-07-13
Decision: AskewlyDesign 편집기 품질 horizon의 승인된 근거

## Problem Evidence

AskewlyDesign은 canonical document와 operation engine, layer tree, direct manipulation, registry, desktop/agent bridge를 갖췄다. 하지만 fresh-clone live inspection에서는 다음 제품 간극이 확인됐다.

- 루트 진입점이 없어 세 package의 install/build 순서를 수동으로 거쳐야 했다.
- production 기본 진입이 빈 프로젝트나 최근 프로젝트가 아니라 1,000-node benchmark fixture다.
- canvas node는 실제 React UI 대신 label을 가진 `<button>`/`<article>`/box로 그려지고 hierarchy도 flat absolute layer다.
- auto-layout은 metadata를 보존하지만 reflow하지 않고, guide는 보이지만 snap하지 않는다.
- canvas operation을 source patch로 자동 변환하지 않으며 source reconcile 범위도 name/label/static text에 가깝다.
- desktop human Undo/Redo와 document/selection/viewport history 의미가 편집기 사용 기대와 어긋난다.
- Assets는 `Soon`, Agent panel은 raw revision/node ID 중심이다.

따라서 "기능이 많다"가 아니라 실제 제작 루프의 연속성과 source integrity를 품질 기준으로 삼아야 한다.

## Official Product Comparison

| Product | 강한 제작 계약 | AskewlyDesign에 채택 | 그대로 복제하지 않음 |
|---|---|---|---|
| Figma | file browser→빈 canvas, canvas/Layers 동일 객체, 직접 조작+수치 속성, auto layout, main/instance, visual Assets, Undo+version history | 선택→조작→속성→재사용→Undo의 연속 루프, Mac keyboard 기대 | 전체 vector/prototype/collaboration/ecosystem과 UI 외형 |
| Penpot | 전통적 canvas/Layers/inspector, CSS Flex/Grid 의미, component/variant/assets/library | 편집 기본기와 실제 코드 layout 의미의 일치 | Inspect code를 source round-trip으로 간주 |
| Framer | stack/breakpoint, component library, preview/publish로 이어지는 완성 흐름 | asset 삽입 직후 완성 결과를 보는 피드백 | 사이트 builder와 online canvas 제약 |
| Plasmic | 실제 React app host, code component, codegen integration | supported code component의 실제 runtime rendering 교훈 | visual source와 git source의 이중 정본 |

## Benchmark By Milestone

### EQ0 — Reproducibility

- fresh clone에서 문서화된 단일 entry command로 install/build/dev launch가 성공한다.
- core, renderer, bridge, desktop test matrix가 Mac에서 green이다.
- production과 benchmark/dev fixture 진입이 명시적으로 분리된다.

### EQ1 — Rendering

- 현실적인 React fixture 하나가 label box가 아니라 실제 text, hierarchy, clipping, z-order를 가진 화면으로 보인다.
- canvas, preview, source가 동일 node/component identity를 추적한다.
- 지원하지 않는 CSS/runtime 상태는 silent approximation 대신 명시된 fallback을 보인다.

### EQ2 — Editing

- selection, drag/resize, inspector, inline text, snap/guide, layout가 같은 command와 화면 상태를 갱신한다.
- 모든 content edit는 한 번의 Undo로 원자적으로 되돌아가고 Redo가 같은 source diff를 복원한다.
- save/reopen 뒤 layout과 source가 달라지지 않는다.

### EQ3 — Reuse

- Assets가 thumbnail grid/list, search, type/source filter, recent use를 제공한다.
- component 생성→instance→override→variant switch→reset/swap/detach 흐름이 보이고 되돌릴 수 있다.
- project component, code component, recipe/token이 한 검색·삽입 계약을 사용한다.

### EQ4 — Trust And Delivery

- 모든 transaction에 `human | agent | system`, 대상 identity, before/after source diff가 남는다.
- conflict와 targeted revert가 사람에게 읽히는 UI로 제공된다.
- Apple Silicon package에서 reopen, font, keyboard, IME, recovery, performance, a11y, source integrity가 반복 검증된다.

## Decision

1. 실제 renderer가 없는 상태에서 toolbar polish나 agent 기능 확대를 먼저 하지 않는다.
2. Mac reproducible baseline을 EQ0로 고정한 뒤 real rendering을 EQ1 최우선 제품 milestone로 둔다.
3. Penpot의 editing basics, Framer의 immediate completion, Plasmic의 runtime connection을 선택적으로 흡수한다.
4. AskewlyDesign의 차별점은 export가 아니라 local source SoT와 deterministic round-trip이다.

## Official Sources

Accessed 2026-07-13.

- Figma: [File browser](https://help.figma.com/hc/en-us/articles/14381406380183-Guide-to-the-file-browser), [Auto layout](https://help.figma.com/hc/en-us/articles/360040451373-Explore-auto-layout-properties), [Components](https://help.figma.com/hc/en-us/articles/360038663154-Create-Components-to-reuse-in-designs), [Desktop app](https://help.figma.com/hc/en-us/articles/5601429983767-Guide-to-the-Figma-desktop-app)
- Penpot: [Workspace basics](https://help.penpot.app/user-guide/designing/workspace-basics/), [Flexible layouts](https://help.penpot.app/user-guide/designing/flexible-layouts/), [Components](https://help.penpot.app/user-guide/design-systems/components/), [Assets](https://help.penpot.app/user-guide/design-systems/assets/)
- Framer: [Requirements](https://www.framer.com/help/articles/requirements/), [Sharing components](https://www.framer.com/help/articles/sharing-components/), [Code components](https://www.framer.com/developers/components-introduction)
- Plasmic: [Components](https://docs.plasmic.app/learn/components/), [Code components](https://docs.plasmic.app/learn/code-components/), [App host](https://docs.plasmic.app/learn/app-hosting/), [Codegen](https://docs.plasmic.app/learn/codegen-guide/)
