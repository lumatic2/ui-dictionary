# UI Vocabulary Export/Capture Polish Plan

## planning_gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "UI Vocabulary MVP의 deferred H3 export/capture work를 새 product phase로 승격한다. 서버/로그인 없이 정적 Vite 앱 안에서 PDF/PNG 다운로드 품질을 다듬는다."
  perspectives:
    product: "사용자가 웹에서 본 카드와 카테고리 묶음을 바로 PDF/PNG 학습 자료로 저장할 수 있어야 한다."
    architecture: "terms.yml -> generated data -> React component 흐름은 유지한다. Export 대상 DOM에 stable data attributes를 부여하고, capture helper를 별도 lib로 분리한다."
    security: "외부 서비스나 secret은 쓰지 않는다. PNG 캡처 라이브러리를 추가한다면 npm package만 추가하고 remote upload는 금지한다."
    qa: "npm run build, npm run lint, Chrome smoke, PDF print mode DOM 확인, PNG download helper smoke를 통과해야 한다."
    skeptic: "전체 257개를 한 번에 포스터화하면 가독성이 깨질 수 있다. 기본 export는 filtered/category scope 중심으로 하고 full export는 PDF/print 전용으로 제한한다."
  dod:
    - "필터된 현재 결과를 A4 PDF로 저장할 때 nav/search/control이 숨고 카드 grid가 안정적으로 배치된다."
    - "카테고리 poster view가 한 화면/인쇄용 layout으로 렌더된다."
    - "단일 term card 또는 detail card를 PNG로 다운로드할 수 있다."
    - "Chrome smoke에서 export target DOM, count, filename, nonblank capture를 확인한다."
```

## Scope

이번 horizon은 UI Vocabulary Encyclopedia의 H3 `Visual Assets And Capture`를 닫는 작업이다.

In scope:

- 현재 필터 결과 PDF 저장 UX 정리.
- 전체 용어 PDF 저장 UX 정리.
- 카테고리별 poster/export layout 추가.
- 단일 카드 PNG 저장 기능 추가.
- export/capture QA smoke 추가.

Out of scope:

- 서버 저장, 로그인, 공유 링크.
- image generation model 사용.
- 모든 257개를 한 장 PNG로 강제 합성.
- cookbook 연결.

## Step Tree

- [x] Step 0 — export contract and dependencies
  - AC: export 대상, 파일명, PDF/PNG 범위, dependency 선택이 문서와 phase index에 기록된다.
- [x] Step 1 — print and PDF layout hardening
  - AC: `npm run build`, `npm run lint`, Chrome smoke에서 current/all PDF modes가 print DOM state를 정확히 만든다.
- [x] Step 2 — poster view for filtered/category exports
  - AC: poster view component가 same term data/visual renderer를 재사용하고, selected category/filter에 맞는 compact poster layout을 렌더한다.
- [x] Step 3 — single card PNG capture
  - AC: card/detail export target을 PNG로 저장하는 helper와 UI가 추가되고, smoke에서 nonblank data URL/blob가 확인된다.
- [x] Step 4 — export QA and documentation
  - AC: browser smoke checklist와 docs가 추가되고, print/capture output assumptions가 문서화된다.

## Technical Direction

- PDF는 browser-native `window.print()`를 유지한다. 대신 export mode state를 둬 `current`, `all`, `poster` 중 어떤 내용을 인쇄할지 명확히 한다.
- PNG는 DOM capture helper를 둔다. 구현 시 우선 후보는 `html-to-image`다.
  - 이유: React DOM node를 PNG data URL로 변환하는 검증된 경량 클라이언트 라이브러리다.
  - 금지: 외부 screenshot API, remote upload, secret 필요한 서비스.
- Export target에는 `data-export-root`, `data-export-card`, `data-export-poster` 같은 stable attributes를 둔다.
- CSS는 print 전용과 screen 전용을 분리한다. `data-print-hidden`, `data-print-grid`, `data-print-card` 기존 계약은 유지한다.

## Completion

2026-06-26 completed. See `docs/ui-vocabulary/export-capture.md` for usage, known limits, and smoke results.
