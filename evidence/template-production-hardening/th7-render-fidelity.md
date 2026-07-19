# TH7 — 캔버스 렌더 충실도 (증거)

- 완료: 2026-07-20
- Plan: `plans/2026-07-20-th7-canvas-render-fidelity.md`
- Changesets: `20260720-canvas-token-paint`, `20260720-canvas-image-typography`, `20260720-export-token-fidelity`

## DoD 대조

| DoD 항목 | 선언 | 실측 | 판정 |
|---|---|---|---|
| 편집기가 토큰 색·글꼴로 그린다 | computed style 관측 | 캔버스 `#f7f2e8`↔`#1c2320`, 강조 `#2f7d4f`↔`#7fd4a0`, 이름 Georgia 41px/700 | PASS |
| 이미지가 실제로 그려진다 | `<img>` 자연 크기 ≠ 0 | 4청사진에서 800×1000 / 1000×800 디코딩 확인 | PASS |
| 내보낸 산출물이 같은 값을 담는다 | SVG·HTML 문자열 검사 + 실물 확인 | 12 SVG + 6 HTML 생성·브라우저 확인, warm/ink 색 상호 배제 | PASS |
| 해석 실패가 진단으로 드러난다 | 조용한 기본값 금지 | 편집기 미해결 표시, 내보내기 `TemplateExportError` | PASS |

## 실패 경로 확인

| # | 무엇을 훼손했나 | 결과 |
|---|---|---|
| 1 | 템플릿 문서를 편집기 토큰 모드로 강제 | 인라인 채색 0, 미해결 3노드 |
| 2 | 이미지가 참조하는 소재를 문서에서 제거 | `INVALID_SCENE` 차단, 캔버스 무변경 |
| 3 | 소재 목록 자체 부재 + 이미지 노드 존재 | `missing asset <id>` 거부 |
| 4 | 내보내기 `tokenSetId`를 없는 값으로 | `TOKEN_SET_NOT_FOUND` |
| 5 | 노드 바인딩을 없는 토큰으로 | `TOKEN_NOT_DEFINED` + 노드 id 지목 |

## 근접 실패 — probe가 세 번 틀렸다

이 milestone에서 **가장 값진 부분**이다.

1. **채색 probe 3회 실패.** ① 도형이 `node.fill` 리터럴(`#000000`)로 폴백 ② 도형이 `background` 경로로, 텍스트가 `text.default`로 흘러내림 ③ "바인딩이 있으면 그 바인딩만이 값을 정한다"로 단일화 후 통과. **세 번 다 화면은 그럴듯했다.**
2. **소재 probe 1회 빗나감.** `Object.keys(assets)[0]`으로 지운 것이 포스터가 쓰지 않는 자산이었다. 검증이 통과한 게 맞았고 probe가 틀렸다 — 참조 대상을 노드에서 역추적해 다시 확인했다.
3. **line-length 가드가 죽어 있었다.** TH3의 스튜디오 은퇴 때 감시 경로를 못 고쳐 `ENOENT`로 사망. 대상이 사라지면 조용히 건너뛰지 않고 실패하도록 고쳤다 — 대상 없는 가드는 통과를 가장한다.

## 서명 기준선 갱신 (근거 기록)

`assets` 필드 추가로 3종 서명이 바뀌었다. 레이아웃·내용은 무변경. `signatures.json`에 `rebaselines` 배열을 신설해 시점·milestone·근거·이전 값을 남겼다.

```
business-card-minimal  tpl-a5add834 → tpl-bb88ad00
product-poster-hero    tpl-e523954b → tpl-40154e67
infographic-stats      tpl-f864dd3b → tpl-c1cb1877
```

TH1의 서명 잠금이 이 변경을 실제로 막아섰다 — 가드가 작동했고, 근거를 남기고 통과시켰다.

## 적발 — 텍스트가 캔버스를 넘친다 (TH9 후보)

산출물 12장을 브라우저에 띄우자 **4장에서 텍스트가 잘렸다. 테스트는 전부 통과한 상태였다.**

```
product-poster-editorial  headline     font=126  필요폭≈1216 > 슬롯폭 920
infographic-stats         explanation  font=189  필요폭≈4404 > 슬롯폭 1000
```

원인은 `fontSize = round(bounds.height * 0.45)` — 슬롯 **높이**만 보고 글자 수·폭을 보지 않는다. TH1에서 finding으로 적고 지나간 결함이 최종 산출물에서 눈에 보이게 됐다.

**해당 두 청사진의 산출물은 현 상태로 인쇄 발주에 쓸 수 없다.** 색·글꼴 충실도(이 milestone의 DoD)와는 다른 결함 계열이므로 별도 milestone(TH9 — 텍스트 맞춤)으로 올린다.

## 하위 파급 (결정 (A)의 되돌림 조건 미발동)

`CanvasDocument.assets`를 **선택 필드**로 추가해 기존 문서를 무효화하지 않았다.

| 패키지 | 결과 |
|---|---|
| canvas-core | 52 → **56** |
| template-core | 62 → **78** |
| agent-design | 83 → **90** |
| agent-design-bridge | 46 (무회귀) |
| agent-design-desktop | 56 (무회귀) |
| agent-design-mcp | 21 (무회귀) |

## 크기 회고

changeset 3개(선언 `changesets>=3`) — 라벨 정합.
