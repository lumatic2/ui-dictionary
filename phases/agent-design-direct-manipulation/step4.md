# Step 4: Typed Properties And Korean Text

## 읽어야 할 파일
- `phases/agent-design-direct-manipulation/index.json` — 왜: 구조 조작과 constraint summary를 이어받는다.
- `packages/canvas-core/src/types.ts` — 왜: node kind별 typed property 영역을 확장한다.
- `apps/agent-design/src/CanvasSurface.tsx` — 왜: composition lifecycle 동안 React rerender로 입력을 파괴하지 않는다.
- `DESIGN.md` — 왜: inspector UI는 기존 token/personality/anti-pattern 정본을 따른다.

## 작업
- node kind별 property schema와 validation을 구현한다.
- props, token binding, layout mode, variant를 typed operation으로 commit한다.
- compositionstart부터 compositionend까지 Korean text를 local draft로 유지하고 한 operation으로 commit한다.

## Acceptance Criteria
```powershell
cd packages/canvas-core; npm test; npm run build
cd ../../apps/agent-design; npm test; npm run build
```

## 금지사항
- invalid prop/token/variant를 document에 먼저 쓰지 마라. commit 전에 거부한다.
- compositionupdate 중 history를 만들지 마라. 한글 조합 한 세션은 operation 한 건이다.
