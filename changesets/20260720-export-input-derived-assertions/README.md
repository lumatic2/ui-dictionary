# changeset: 단언의 근거를 입력에서 가져온다 + 훼손 3종

- Date: 2026-07-20
- Plan: TH4 step 2 (`plans/2026-07-20-th4-verification-materialization.md`)

산출물 검사가 **입력**과 대조된다. 그리고 **처음 돌린 순간 실제 결함을 잡았다.**

## 무엇을 바꿨나

- **`expectationsFor(blueprint, project)`** — "산출물에 있어야 할 것"을 셋에서 유도한다:
  - 텍스트 = 청사진 슬롯의 `contentKey` → **요청 내용**(반복 유닛은 `lists`에서)
  - 색·글꼴 = 슬롯 `tokenBindings` → **`tokens.ts`의 값**
  - 자산 URI = 슬롯 `assetRole` → **자산 매니페스트**
  - 치수 = **청사진 선언** `width`/`height`
  셋 다 exporter가 만든 값이 아니다. exporter가 무엇을 냈는지는 보지 않는다.
- **파서로 텍스트·속성을 추출** — SVG는 `XMLParser`, HTML은 `parse5`. SVG는 tspan으로 줄이 쪼개지므로 공백을 지워 이어붙여 비교한다.
- **훼손 probe 6종 추가** (형식 4종에 더해) — 게이트 안에 상주.

## 게이트가 첫 실행에서 잡은 결함

```
export-artifacts: FAIL — 산출물 결함 8건
  business-card-minimal / html: 토큰 글꼴 Georgia, "Noto Serif KR", serif이 산출물에 없다
  ... (6청사진 전부)
```

`exportHtml`이 글꼴 스택을 **이스케이프하지 않고** style 속성에 넣었다. 값이 `Georgia, "Noto Serif KR", serif`라 따옴표에서 **속성이 그 자리에서 끊긴다.** 파서는 style을 앞부분만 읽고, 글꼴·크기·굵기·행간이 통째로 사라진다.

SVG는 `esc()`를 거치고 있었다. HTML만 빠져 있었다 — 그래서 **HTML 내보내기의 타이포그래피가 전부 무효**였다. 155개 테스트도, 육안 확인도 이걸 못 잡았다(브라우저가 깨진 속성을 조용히 무시한다).

수정: `font-family:${esc(family)}`. 회귀 테스트를 `exporters.test.ts`에 추가했다.

## Verification

- [x] `node scripts/check-export-artifacts.mjs` — **PASS (산출물 18개, 자기검사 10건 통과)**
- [x] `npm --prefix packages/template-core test` — **155 PASS** (154 + 이스케이프 회귀 1)
- [x] `npm --prefix apps/agent-design test` — 90 PASS
- [x] `node scripts/check-line-length.mjs` · `check-text-overflow.mjs` — PASS
- [x] `node scripts/verify-template-production-system.mjs` — exit 0
- [x] 수정 후 `business-card-minimal.html`의 style 속성을 parse5로 재파싱해 `font-family:Georgia, "Noto Serif KR", serif`가 온전히 읽히는지 확인

### Failure probe — 내용 훼손 3종 (형식은 멀쩡한데 값이 틀린 경우)

| 훼손 | SVG | HTML |
|---|---|---|
| 토큰 색 hex를 `#ff00ff`로 치환 | 검출 | 검출 |
| 요청 문자열 하나를 삭제 | 검출 | 검출 |
| 자산 URI를 삭제 | 검출 | 검출 |

여섯 중 하나라도 통과시키면 게이트 전체가 exit 1이고 산출물 검사는 시작조차 하지 않는다.

**기대값이 0개인 것도 실패로 친다** — 색·문자열·자산 기대가 비면 probe가 조용히 사라지므로, 그 상태를 명시적으로 miss로 기록한다.

## finding 큐

- `role`·`contact` 슬롯은 `fontFamily` 바인딩이 없어 `system-ui`로 떨어진다. 의도인지 누락인지 미판정 — 타이포 스케일 설계(TH8 후보)와 겹친다.
- 검사는 "값이 산출물 어딘가에 있다"까지다. **어느 노드에** 붙었는지는 보지 않는다 — 색이 뒤바뀐 경우는 못 잡는다.
