# changeset: 세 형식 제작 E2E

- Status: complete

## Target

- TPS5 step-2 — `three-format-end-to-end-proof`

## Scope

- `scripts/verify-template-production-system.mjs`: 고정 입력의 3형식 전체 제작 검증
- `evidence/template-production-system/e2e-manifest.json`: 형식·청사진·signature·export·network 증거
- `evidence/template-production-system/tps5-e2e.md`: TPS5 완료 근거

## Contract

- business-card, product-poster, infographic를 동일한 고정 입력과 로컬 asset으로 검증한다.
- compile → format integrity → signature → JSON/HTML/SVG export 계약을 재현한다.
- 모든 검증 행은 `network: false`여야 하며 secret·유료 출력이 없어야 한다.
- 라이브 GPT Image 2 호출과 공개 배포는 범위 밖이다.

## Verification

- [x] template-core tests/build PASS
- [x] OpenAI provider tests/build PASS
- [x] offline E2E 3/3 형식 PASS
- [x] 훼손 fixture·provider 오류 실패경로 PASS

## Result

고정 입력으로 3형식을 compile·validate·signature·JSON/HTML/SVG export 계약까지 검증하고 evidence manifest를 생성했다.
