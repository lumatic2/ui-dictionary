# changeset: 줄 길이 가드

- Date: 2026-07-20
- Plan: TH1 step 3 (`plans/2026-07-20-th1-code-legibility.md`)

템플릿 제작 스택의 코드 압축 재발을 막는 검사 스크립트를 추가했다.

## 무엇을 바꿨나

- **`scripts/check-line-length.mjs`** 신설 — 300자 초과 라인을 찾아 파일·줄·길이를 보고하고 exit 1을 낸다. **의존성 0** (Node 표준 모듈만).

감시 대상은 템플릿 제작 스택으로 좁혔다: `packages/template-core/src`, `apps/template-studio/src`, `scripts/verify-template-production-system.mjs`, `scripts/check-line-length.mjs`.

레포 전체를 훑지 않은 이유 — 초안은 `scripts/` 전체를 스캔했는데 범위 밖 파일(`generate-llms-txt.mjs`, 325자·385자 2건)이 잡혀 가드가 통과 불가능해졌다. 통과 불가능한 가드는 곧 무시되므로, 이 horizon의 닫는 기준 1이 정한 3표면으로 한정했다.

## Verification

- [x] `node scripts/check-line-length.mjs` — `PASS (300자 초과 라인 없음)`, exit 0
- [x] **Failure probe** — `App.tsx`에 403자 라인 주입 → `FAIL — 300자를 넘는 라인 1개 / apps/template-studio/src/App.tsx:244 (403자)`, exit 1. 되돌린 뒤 exit 0.

## finding 큐

- `scripts/generate-llms-txt.mjs`에 300자 초과 라인 2건(66행 325자, 154행 385자)이 있다. 이 horizon 범위 밖이라 손대지 않았다 — 별도 유지보수 후보.
