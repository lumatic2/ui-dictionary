# changeset: 자기완결 소재

- Date: 2026-07-20
- Plan: TH12 step 1 (`plans/2026-07-20-th12-self-contained-artifacts.md`)
- 계기: `evidence/template-production-hardening/th6-commission.md` 결함 1

## 왜

TH6 실연이 실물로 잡았다. 소재 URI가 파일 경로라서 내보낸 SVG를 `<img>`로 끼우면
**그림 없이 조용히** 렌더된다. 인쇄소에 그대로 넘기면 빈 카드가 나온다.

TH5는 이걸 못 잡았다 — HTML 경로로만 렌더를 확인했기 때문이다.

## 무엇을 바꿨나

- **기본 URI가 data URI가 됐다.** 공급자가 PNG 헤더를 읽으려고 **이미 바이트를 읽고 있었으므로** 새 I/O가 생기지 않는다.
- **`MAX_ASSET_BYTES = 4MB` 상한 + `ASSET_TOO_LARGE`** — base64는 원본의 약 4/3라 상한이 없으면 문서 하나가 수십 MB가 된다.
- **`uriFor`가 바이트를 함께 받는다** — 호출자가 다른 규약(CDN 등)을 쓰고 싶으면 여전히 가능하다.

고친 자리가 exporter가 아니라 **공급자**인 이유: exporter 3개를 각각 고치면 새 exporter마다 같은 실수를 반복한다. 매니페스트가 자기완결적이면 JSON·HTML·SVG가 함께 고쳐진다.

## Verification

- [x] `npm --prefix packages/template-image-provider-codex test` — 18 PASS (15 + 신규 3)
- [x] data URI ↔ 원본 바이트 왕복 동일성 확인 (인코딩만 하고 잃지 않음)

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 기본 URI를 출력 경로로 | **2 failed** — `expected 'fixtures/cup.png' ... to start with 'data:image/png;base64,'` |

## finding 큐

- 316KB PNG가 base64로 약 421KB가 된다. 소재 여러 개인 포스터는 문서가 커진다 — 리사이즈·압축은 별도 후보.
