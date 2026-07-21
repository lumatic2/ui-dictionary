# changeset: 내보내기 토큰 충실도

- Date: 2026-07-20
- Plan: TH7 step 3 (`plans/2026-07-20-th7-canvas-render-fidelity.md`)

내보낸 SVG·HTML이 화면과 **같은 값**을 담는다. 그리고 산출물을 실제로 띄워 눈으로 봤다.

## 무엇을 바꿨나

- **토큰 해석을 내보내기에 배선** — 도형 채움은 `tokenBindings.fill`, 텍스트는 `color`·`fontFamily`가 정한다. 화면과 같은 규칙이다("바인딩이 있으면 그 바인딩만이 값을 정한다").
- **타이포 반영** — `font-size`·`font-weight`·`font-family`·`line-height`가 산출물에 실린다.
- **캔버스 바탕** — SVG는 `surface.canvas` 색 사각형을 최하단에 깔고, HTML은 프레임 배경에 넣는다. 그전에는 배경이 없어 흰 종이 위에 떠 있었다.
- **`TemplateExportError` 신설** — 토큰 세트나 바인딩이 해석되지 않으면 **검은색으로 때우지 않고 던진다**. 색이 빠진 산출물이 조용히 나가면 인쇄에 넘어간 뒤에야 발견된다.

## Verification

- [x] `npm --prefix packages/template-core test` — **78 PASS** (72 + 신규 6)
- [x] `npm --prefix packages/template-core run build` — PASS
- [x] 6청사진 × 2세트 = **SVG 12장 + HTML 6장을 실제로 생성해 브라우저에서 확인**

### 색이 실제로 실렸는가

테스트는 각 청사진이 **실제로 참조하는 바인딩만** 검사한다 — 안 쓰는 토큰을 요구하면 거짓 통과가 된다.

```
askewly.warm  강조 #2f7d4f 포함 · askewly.ink 강조 #7fd4a0 포함
ink 산출물에 warm 색(#2f7d4f) 부재 확인
font-weight="700" · Georgia 포함 확인
컴파일러 리터럴 #000000 미검출
```

증거: `evidence/template-production-hardening/th7/exports/` (SVG 12 + HTML 6 + 대조 시트), `exported-svg-contact-sheet.png`.

### Failure probe — 해석 실패를 검은색으로 때우는가

| 훼손 | 결과 |
|---|---|
| `tokenSetId`를 없는 값으로 | `TemplateExportError(TOKEN_SET_NOT_FOUND)` — SVG·HTML 모두 |
| 노드 바인딩을 없는 토큰으로 | `TemplateExportError(TOKEN_NOT_DEFINED)`, 메시지에 노드 id 포함 |

## 적발 — 산출물을 띄우지 않았으면 못 봤을 것

**12장을 브라우저에 띄우니 4장에서 텍스트가 캔버스 밖으로 잘렸다.** 테스트는 전부 통과한 상태였다.

```
product-poster-editorial  headline     font=126  필요폭≈1216 > 슬롯폭 920
infographic-stats         explanation  font=189  필요폭≈4404 > 슬롯폭 1000
```

원인은 컴파일러의 `fontSize = round(bounds.height * 0.45)` — **슬롯 높이만 보고 글자 크기를 정하고 글자 수와 폭을 보지 않는다.** TH1에서 finding으로 적어두고 지나간 그 결함이, 이제 최종 산출물에서 눈에 보인다.

이건 색·글꼴 충실도(이 milestone의 DoD)와는 다른 결함 계열 — **타이포그래피 맞춤(fitting)** 이다. 한글·라틴 문자폭이 다르고 줄바꿈 정책이 얽히므로 급히 때울 자리가 아니다. 별도 milestone 후보로 올린다: **TH9 — 텍스트 맞춤**.

`infographic-stats`·`product-poster-editorial` 두 청사진의 산출물은 **현 상태로 인쇄 발주에 쓸 수 없다.** 이 changeset은 색·글꼴·이미지 충실도만 닫는다.

## finding 큐

- 위 텍스트 넘침(TH9 후보). 근사 측정 스크립트는 `/tmp`에 두었고 정본화하려면 문자폭 테이블이 필요하다.
- HTML 내보내기에는 `surface.canvas`가 프레임 배경으로만 들어간다 — 인쇄용 `@page` 여백 규약은 아직 없다.
- SVG의 텍스트는 `<text>` 한 줄이라 줄바꿈이 없다. 여러 줄 텍스트는 현재 표현 자체가 불가능하다.
