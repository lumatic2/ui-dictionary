# changeset: 외부 참조 0 게이트

- Date: 2026-07-20
- Plan: TH12 step 2 (`plans/2026-07-20-th12-self-contained-artifacts.md`)
- 증거: `evidence/template-production-hardening/th12-self-contained.md`

step-1이 소재를 문서에 실었다. 이 step은 **그 상태가 유지되는지** 기계가 보게 한다.

## 무엇을 바꿨나

- `checkNoExternalReferences` — 기대값을 산출물이 아니라 **매니페스트**에서 가져온다. 모든 소재 URI가 `data:`여야 하고, 산출물의 `href`/`src` 중 `data:`가 아닌 것(SVG 네임스페이스 제외)이 있으면 실패한다. HTML·SVG 양쪽 경로에 건다.
- TH6 명함 산출물을 새 계약으로 재생성했다. **라이브 imagegen을 다시 호출하지 않았다** — 디스크의 PNG를 그대로 쓰고 URI 규약만 바뀌었으므로.

## 실측

```
askewly-card.svg   1,415 bytes + 별도 PNG 315,785  →  422,460 bytes 한 장
askewly-card.json  6,868  →  848,805
소재 URI           C:/Users/.../askewly-portrait.png  →  data:image/png;base64,… (421,070자)
```

같은 페이지에서 같은 방식(`<img src="...svg">`)으로 렌더했을 때 전에는 그림이 없었고 지금은 있다.

## Verification

- [x] `npm run verify` — 4단계 exit 0, 산출물 24개
- [x] TH6 명함 재렌더 — `th6/final-artifact-render.png`

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 매니페스트 URI를 파일 경로(`C:/tmp/...`)로 | 게이트 **42건** 실패, exit 1 |
