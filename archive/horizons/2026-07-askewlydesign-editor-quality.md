# Horizon — AskewlyDesign Editor Quality

Date: 2026-07-13
Status: active (사용자 승인 — 수익화보다 서비스·편집기 품질 우선)

## Goal

AskewlyDesign을 "미니 Figma 엔진 proof"에서 **실제 React UI를 보고, 만들고, 되돌리고, 소스와 안전하게 왕복하는 Mac 우선 코드 네이티브 편집 제품**으로 끌어올린다.

## Why Now

기존 작업은 canonical operation, hierarchy, direct manipulation, property metadata, component registry, agent bridge를 폭넓게 증명했다. 그러나 2026-07-13 fresh-clone·live-render 감사에서는 package별 수동 build, 깨진 Mac renderer 테스트, 1,000-node 기본 fixture, flat placeholder renderer, metadata-only layout, 불완전한 human Undo/Redo와 source reflection이 확인됐다.

따라서 다음 품질 단계는 기능 수를 늘리는 일이 아니다. 경쟁 제품의 공통 제작 루프인 **선택 → 직접 조작 → 속성 확인 → 재사용 → Undo**를 실제 UI와 코드 정본 위에서 끊김 없이 닫는 일이다. 비교 근거와 채택/비채택 판단은 `docs/market/2026-07-13-editor-quality-benchmark.md`에 기록한다.

## Product Contract

- 로컬 project source가 유일한 정본이다.
- canvas command는 deterministic source patch로 설명 가능해야 한다.
- 외부 source edit는 같은 node/component identity로 canvas에 반영돼야 한다.
- human, agent, system 편집은 같은 transaction·Undo·conflict 계약을 사용한다.
- document content와 selection/viewport 같은 ephemeral editor state를 구분한다.
- 로그인, 외부 Studio, 인터넷 연결 없이 기본 편집이 가능해야 한다.

## Milestones

### EQ0 — Mac Reproducible Baseline

fresh clone에서 단일 진입 절차로 Mac dev app과 전체 테스트 행렬을 재현한다. production shell과 benchmark/dev fixture를 분리하고, 이후 milestone이 신뢰할 기준선을 만든다.

### EQ1 — Real React Rendering Contract

flat 이름표 renderer를 실제 parent/child nesting, clipping, z-order, text와 supported component content가 보이는 renderer로 교체한다. canvas/preview/source가 공유하는 identity와 authority를 명시한다.

### EQ2 — Editor State And Editing Fidelity

document와 ephemeral state를 분리하고 desktop human Undo/Redo, snap·smart guide·spacing, deterministic auto layout, fixed/hug/fill, inline text mode와 inspector 동기화를 완성한다.

### EQ3 — Components And Assets

Assets를 검색·썸네일·분류·출처·최근 사용이 있는 재사용 surface로 만들고, main/instance/override/reset/swap/detach와 variant 전환을 실제 rendered implementation 및 source round-trip에 연결한다.

### EQ4 — Trusted Co-Creation And Mac Delivery

raw node ID와 revision 로그 대신 intent, progress, 사람에게 읽히는 selection, before/after visual·code diff, conflict 선택지와 transaction별 revert를 제공한다. agent 편집도 사람과 같은 Undo 경로를 사용한다. 이어 Apple Silicon용 설치·재실행 가능한 package에서 local font, recent reopen, watcher, IME, GPU fallback, crash recovery, a11y, performance, source integrity를 실제 프로젝트 반복 사용으로 검증한다.

## Horizon Close Criteria

- fresh clone Mac에서 문서화된 단일 entry command로 실행과 테스트가 재현된다.
- 실제 React fixture가 label box가 아니라 계층·layout·content를 가진 UI로 보인다.
- 대표 dashboard 화면을 mouse와 keyboard로 만들고 save/reopen/Undo/Redo 뒤 동일한 source와 화면을 얻는다.
- component variant를 preview해 instance로 배치하고 override와 source round-trip을 보존한다.
- agent 변경을 raw ID 해석 없이 이해·수락·되돌릴 수 있다.
- Apple Silicon package로 실제 UI 한 화면을 며칠간 편집한 evidence가 남는다.

## Scope Exclusions

- Figma 전체 vector/path, prototype, multiplayer, organization, Community, plugin 생태계 복제.
- Figma UI 외형이나 숨은 modifier 조합의 픽셀 단위 모사.
- 렌더링 계약 전에 실시간 협업·결제·프리미엄 기능 확대.
- 별도 visual document를 새 정본으로 만드는 export/codegen 중심 구조.

## Objective Impact

Objective 성공 상태의 "사람이 코드 네이티브 UI 캔버스에서 실제 컴포넌트를 만들고 에이전트와 production code로 무손실 왕복"을 데모가 아닌 제품 수준으로 달성한다. 장기 아크 6(제작 환경)을 실사용 가능 상태로 닫는 horizon이다.

## Backlinks

- Objective: `docs/OBJECTIVE.md`
- Market intake: `docs/market/2026-07-13-editor-quality-benchmark.md`
- First milestone plan: `docs/plans/2026-07-13-eq0-mac-reproducible-baseline.md`
- Paused predecessor: `docs/horizons/2026-07-public-product-monetization.md`
