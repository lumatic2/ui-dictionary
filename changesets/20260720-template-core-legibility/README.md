# changeset: template-core 가독성 복구 + 서명 회귀 방어망

- Date: 2026-07-20
- Plan: TH1 step 1 (`plans/2026-07-20-th1-code-legibility.md`)

`packages/template-core`의 압축된 소스를 정상 포맷으로 해제하고, 그 과정에서 동작이 바뀌지 않았음을 증명하는 서명 대조 테스트를 추가했다.

## 무엇을 바꿨나

- **기준선 고정** — 복구 **전** 세 청사진의 `templateSignature`를 `src/__fixtures__/signatures.json`에 캡처했다 (`tpl-a5add834` / `tpl-e523954b` / `tpl-f864dd3b`).
- **대조 테스트 신설** — `src/signature-lock.test.ts`가 기준선과 현재 컴파일 결과를 대조한다. TH2에서 청사진 구성이 의도적으로 바뀌기 전까지 이 값은 고정이다.
- **해제 대상 5파일** — `compiler.ts`, `catalog.ts`, `fixtures.ts`, `assets/provider.ts`, `catalog.test.ts`. 300자 초과 라인 7개 → 0개.
- **이름 붙인 상수 추출** (포맷 해제 중 가독성을 위해, 동작 동일): `TOKEN_BINDING_PATTERN`, `BOLD_SLOT_IDS`, `SAFE_AREA_INSET`, `violatesSafeArea()`, `TemplateCompileErrorCode`.

## 무엇을 안 바꿨나

계획의 scope 경계대로 **포맷과 가독성만** 바꿨다. 로직 개선·리팩터링·죽은 코드 삭제 없음. 서명 3종이 전부 동일한 것이 그 증거다.

## Verification

- [x] `npm --prefix packages/template-core test` — 14 tests PASS (신규 4건 포함)
- [x] `npm --prefix packages/template-core run build` — tsc PASS
- [x] `node scripts/verify-template-production-system.mjs` — exit 0, 세 서명 baseline과 동일
- [x] **Failure probe** — `signatures.json`의 서명을 1글자(`tpl-a5add834`→`tpl-a5add835`) 훼손하니 대조 테스트가 FAIL(1 failed / 13 passed), 되돌리니 14 passed. 방어망이 실제로 작동함을 확인.

## finding 큐 (TH2~TH4로 이월)

- `catalog.ts`의 `SAFE_AREA_INSET = 24`는 픽셀 고정값이다. TH2가 인쇄 규격(도련 3mm·안전영역 3mm)을 인코딩할 때 mm 기반으로 재정의해야 한다.
- `compiler.ts`의 `fontSize`/`lineHeight`가 슬롯 높이 비율(0.45 / 0.58)로 계산된다 — 타이포 스케일이 토큰이 아니라 코드 상수다. TH3 토큰 구동 때 재검토 대상.
