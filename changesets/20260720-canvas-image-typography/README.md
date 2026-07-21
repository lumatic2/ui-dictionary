# changeset: 이미지 실렌더 + 문서 자족성

- Date: 2026-07-20
- Plan: TH7 step 2 (`plans/2026-07-20-th7-canvas-render-fidelity.md`)

이미지 노드가 실제 이미지로 그려진다. 그러기 위해 **문서가 소재를 직접 싣도록** 계약을 바꿨다.

## 계약 공백이 있었다

`ImageNode`는 `assetId`만 갖고, URI 목록은 `TemplateProject.assets`에 — 즉 **장면 바깥**에 있었다. 그래서 문서만 오가는 경로(에이전트 브리지·스냅샷·JSON 재가져오기)에서는 이미지 주소를 찾을 방법이 없었다. 편집기가 이미지를 안 그린 건 렌더 분기가 없어서이기도 했지만, 애초에 **그릴 데이터가 도달하지 않았다**.

계획의 결정 로그에서 (A)안 — 문서에 싣기 — 을 채택했고, **선택 필드**로 추가해 기존 문서를 무효화하지 않았다.

## 무엇을 바꿨나

- **`canvas-core`**: `CanvasAsset` 타입 신설, `CanvasDocument.assets?: Record<string, CanvasAsset>` 추가.
- **`canvas-core` 검증**: 이미지 노드가 가리키는 소재가 문서에 없으면 `missing asset <id>`로 거부한다 — 빈 상자로 조용히 렌더되면 결함인지 상태인지 구별되지 않는다.
- **`template-core` 컴파일러**: 장면에 소재를 채운다.
- **`CanvasSurface`**: `image` 전용 분기 신설 — `<img>`에 실제 `src`·`objectFit`·`opacity`. 소재를 못 찾으면 빈 상자 대신 **"소재 없음: \<id\>"** 를 적는다.
- **fixture 정정**: `businessCardFixture`의 장면에 소재가 없었다(프로젝트에는 있는데 장면에는 없는 불일치). 새 검증이 이 기존 결함을 잡아냈다.

## Verification

| 패키지 | 결과 |
|---|---|
| `packages/canvas-core` | **56 PASS** (52 + 신규 4) |
| `packages/template-core` | 72 PASS |
| `apps/agent-design` | 90 PASS |
| `apps/agent-design-bridge` | 46 PASS (무회귀) |
| `apps/agent-design-desktop` | 56 PASS (무회귀) |
| `packages/agent-design-mcp` | 21 PASS (무회귀) |

- [x] `node scripts/verify-template-production-system.mjs` — exit 0
- [x] `node scripts/check-line-length.mjs` — PASS

**계획의 되돌림 조건은 발동하지 않았다** — 선택 필드로 추가해 하위 패키지 어디도 깨지지 않았다.

### 이미지가 실제로 그려지는가 (실브라우저)

| 청사진 | `<img>` | 자연 크기 | 텍스트 크기(상위 3) |
|---|---|---|---|
| business-card-minimal | 1 | 800×1000 | 41 / 22 / 20px |
| business-card-vertical | 1 | 800×1000 | 41 / 22 / 20px |
| product-poster-hero | 1 | 1000×800 | 68 / 27 / 36px |
| product-poster-editorial | 1 | 1000×800 | 126 / 41 / 36px |
| infographic-stats | 0 | — | 72 / 135 / 189px |
| infographic-comparison | 0 | — | 63 / 27 / 36px |

`naturalWidth`가 0이 아니라는 것은 브라우저가 실제로 디코딩했다는 뜻이다. 증거: `evidence/template-production-hardening/th7/poster-with-image.png`.

### 서명 기준선 갱신 — 근거를 남기고 바꿨다

TH1의 `signature-lock.test.ts`가 3종 모두 실패했다. **가드가 제대로 작동한 것이다.** 서명은 정본 JSON 전체를 해싱하므로 `assets` 필드 추가만으로 값이 바뀐다 — 레이아웃·내용은 그대로다.

```
business-card-minimal  tpl-a5add834 → tpl-bb88ad00
product-poster-hero    tpl-e523954b → tpl-40154e67
infographic-stats      tpl-f864dd3b → tpl-c1cb1877
```

`signatures.json`에 `rebaselines` 배열을 신설해 **언제·어느 milestone에서·왜** 바꿨는지와 이전 값을 남겼다. 근거 없는 갱신은 가드를 무력화한다.

### Failure probe — 참조가 끊긴 소재

내보낸 JSON에서 **이미지 노드가 실제로 참조하는** 소재만 지우고 되가져왔다.

```
referencedAsset : starter-product
error           : "가져오기 차단 — INVALID_SCENE"
canvas          : 무변경 (img 1개, src 그대로)
```

**이 probe도 한 번 빗나갔다.** 처음엔 `Object.keys(assets)[0]`으로 지웠는데 그게 포스터가 **쓰지 않는** `starter-portrait`였다. 검증이 통과한 게 맞았고, 내 probe가 틀렸다. 참조 대상을 노드에서 역추적해 다시 확인했다.

## finding 큐

- **템플릿이 안 쓰는 소재까지 싣는다.** 컴파일러가 매니페스트 전체를 장면에 넣어, 포스터 문서에 `starter-portrait`가 함께 들어간다. 문서 크기와 왕복 비용이 불필요하게 늘어난다 — 참조된 것만 싣도록 좁힐 대상.
- **`infographic-stats`의 텍스트가 189px까지 커진다.** TH1에서 적발한 `fontSize = bounds.height * 0.45` 결함이 그대로다. 이제 화면에서 눈에 보인다.
- `TemplateProject.assets`와 `scene.assets`가 이중으로 존재한다. 현재는 전자가 정본이고 후자가 파생이지만, 편집기에서 소재를 교체하면 둘이 어긋날 수 있다.
