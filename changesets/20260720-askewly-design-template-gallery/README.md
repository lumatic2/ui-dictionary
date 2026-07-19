# changeset: AskewlyDesign 템플릿 갤러리

- Date: 2026-07-20
- Plan: TH3 step 2 (`plans/2026-07-20-th3-studio-real-editing.md`, 2026-07-20 개정본)

AskewlyDesign에서 청사진 6종을 골라 캔버스로 연다. 편집 표면을 별도로 만들지 않고 이미 있는 편집기에 템플릿을 공급한다.

## 왜 표면을 바꿨나

컴파일된 템플릿의 `scene`은 **이미 AskewlyDesign이 쓰는 `CanvasDocument`**다. 6종 전부 `validateDocument` VALID. 그래서 포팅이 아니라 배선이었고, `apps/template-studio`에 속성 편집·이미지 교체·레이어 조작을 새로 만드는 건 이미 있는 것을 두 번째로 만드는 일이었다. (사용자 지시 2026-07-20.)

기존 시작 문서는 `createDocumentFixture(1000)` — 성능 측정용 더미 1000노드였다. 이제 템플릿에서 시작할 수 있다.

## 무엇을 바꿨나

- **`starter.ts` 신설** (template-core) — 청사진 id로 편집 가능한 프로젝트를 만든다. 기본 문구·자리표시 소재(data URI, 네트워크 없음) 포함. 실패는 **던진다**.
- **`TemplateGallery.tsx` 신설** (agent-design) — 6종 카드 + 토큰 세트 선택. 카드는 좌표가 아니라 **구조**로 구별을 말한다(단 수·슬롯 수·반복 유닛·인쇄 규격).
- **`App.tsx` 배선** — `Templates` 토글, `openTemplate`이 `createHistory(project.scene)`로 문서를 교체.

## Verification

- [x] `npm --prefix packages/template-core test` — **62 PASS** (53 + 신규 9) · `build` PASS
- [x] `npm --prefix apps/agent-design test` — **83 PASS** (기존 78 + 신규 5), 기존 테스트 무회귀 · `build` PASS
- [x] `node scripts/check-line-length.mjs` — PASS

### 6종이 실제로 다른 문서로 열리는가 (실브라우저)

| 청사진 | 서명 | 캔버스 노드 | 편집 가능 텍스트 |
|---|---|---|---|
| business-card-minimal | `tpl-b66d1fb5` | 6 | 3 |
| business-card-vertical | `tpl-84dee5ce` | 6 | 3 |
| product-poster-hero | `tpl-3f0cb2ce` | 6 | 3 |
| product-poster-editorial | `tpl-167d5b06` | 7 | 3 |
| infographic-stats | `tpl-d7e4e2be` | 6 | 4 |
| infographic-comparison | `tpl-bd621dd4` | **10** | **8** |

서명 6개가 전부 다르다. 비교형이 10노드/8텍스트인 것은 TH2의 반복 유닛 계약이 실제 편집기까지 살아 나온 결과다.

**직접 조작 확인** — 캔버스에서 `business-card-minimal:name`을 클릭해 "이름을 입력하세요" → "전유성"으로 고쳤고 revision이 16 → 26으로 올랐다. 템플릿의 슬롯 id가 편집기 노드 id로 그대로 보존된다.

### Failure probe — 열기 실패가 캔버스를 날리는가

카드 하나가 은퇴한 청사진 id(`infographic-retired`)를 들고 있는 상황을 주입했다.

```
error     : "열기 실패 — 청사진 'infographic-retired'가 카탈로그에 없습니다.
             사용 가능: business-card-minimal, ... infographic-comparison"
nodeIds   : 실패 전후 동일 (6개, business-card-minimal:*)
nameText  : "전유성"  ← 편집해둔 값이 그대로 살아 있다
preserved : true
```

`onOpen`을 부르지 않으므로 **편집 중이던 문서가 보존된다**. 증거: `evidence/template-production-hardening/th3/askewly-design-open-failure.png`. 되돌린 뒤 83 PASS 재확인.

시작점 자체의 실패 4종(`BLUEPRINT_NOT_FOUND`·`TOKEN_SET_NOT_FOUND`·`CONTENT_INCOMPLETE`·반복 목록 최소 개수 미달)도 테스트로 고정했다.

## 적발 — 캔버스가 템플릿을 **디자인으로 그리지 않는다** (중대)

템플릿은 열리고 편집되지만, 화면에는 **회색 상자들**로 나온다. 스크린샷(`askewly-design-business-card.png`)이 그 상태다.

원인 세 가지:

1. **토큰 세트 우주가 둘이다.** `CanvasSurface`는 `editorTokenMaps[tokenSetId]`를 보는데 여기엔 `askewly.default`/`askewly.dark`뿐이다. 템플릿의 `askewly.warm`은 없으므로 **조용히 `askewly.default`로 폴백**하고 모든 바인딩이 빗나가 `surface.muted` 한 색으로 칠해진다. TH3 step-1이 스튜디오에서 없앤 바로 그 조용한 폴백이 편집기에는 그대로 있다.
2. **`background` 바인딩만 해석한다.** 도형의 `fill`, 텍스트의 `color`·`fontFamily`, `textStyle`(크기·굵기·행간)은 아예 읽지 않는다.
3. **이미지 노드가 `<img>`로 그려지지 않는다.** 게다가 소재 목록은 `TemplateProject.assets`에 있고 `CanvasDocument`에는 `assetId`만 있어, 편집기가 URI를 찾을 경로 자체가 없다 — 계약 공백이다.

이건 step 하나로 닫을 크기가 아니다(렌더러 + 문서 계약 + 자산 해석). **milestone 급 후속으로 제안한다.** TH5(생성 소재)가 이미지 슬롯을 채우는 것을 전제하므로 그 전에 필요하다.

## finding 큐

- `App.tsx`의 `storageKey`는 `baseDocument.id` 기준이라 템플릿을 열어도 저장 키가 fixture 문서 키다 — 저장/재적재가 템플릿을 따라가지 않는다.
- 뷰포트 크기(1000/5000 노드) 토글을 건드리면 `baseDocument` 재생성으로 열어둔 템플릿이 fixture로 되돌아간다.
- `structureSummary`는 카탈로그에 없는 id를 만나면 '구조 정보 없음'을 낸다(화면을 깨뜨리지 않기 위해). 실제로 그 상태가 되면 갤러리 카드 자체가 잘못된 것이므로 별도 가드가 필요하다.
