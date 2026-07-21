# changeset: 스냅·측정 분리 게이트

- Date: 2026-07-21
- Plan: EU2 step 3 (`plans/2026-07-21-eu2-snap-measure.md`)
- 증거: `evidence/editor-legibility/eu2-snap-measure.md`

## 무엇을 고정했나

- 양방향 분리: 드래그 중 측정 배지 0 · 정적 Alt 호버 중 정렬 가이드 0.
- 측정 기준을 `docs/ARCHITECTURE.md` §편집기 측정 기준에 명문화.

## 브라우저가 잡은 결함 2건

자동 검증이 전부 초록인 상태에서 실조작이 냈다.

### ① 빠른 드래그가 편집기를 백지로 만들었다

누르고·끌고·놓기가 한 틱 안에 일어나면 `finishGesture`의 클로저가 읽는 `previewBounds`가
아직 `{}`라, 빈 `transform-nodes`가 커밋되고 문서 계층이 거부한다 —
`transform-nodes requires at least one node`, `nodeCount: 0`.

**EU1부터 있던 잠복 결함이고 스냅과 무관하다.** jsdom에서는 재현 불가 — RTL이 이벤트마다
React를 flush 해서 "한 틱 안"이라는 조건이 성립하지 않는다.

수정: preview bounds를 ref로도 들고 `finishGesture`가 그것을 읽는다. 빈 preview는 커밋 안 함.

### ② 측정 배지가 드래그 내내 남았다

내 테스트는 "드래그 중 **진입**할 수 없다"만 봤고 "이미 떠 있던 것이 **꺼지는가**"는 안 봤다.
게이트가 한쪽 방향만 본 것이다. 브라우저에서 `measureDuringDrag: true`로 잡혔다.

## Verification

- [x] canvas-core 142 PASS / template-core 195 PASS / agent-design 119 PASS
- [x] `npm run verify` PASS
- [x] 브라우저 실조작: 커밋 좌표 `96px`(비스냅 93px), 판독 `↔ 220 ↕ 14`, 드래그 중 배지 0, 콘솔 오류 0

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| gesture 시작 시 측정 끄기를 제거 | agent-design 1 failed — "떠 있던 측정은 드래그가 시작되면 꺼진다" |
