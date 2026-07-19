# changeset: 매니페스트 실측화 + 통합 커맨드

- Date: 2026-07-20
- Plan: TH4 step 3 (`plans/2026-07-20-th4-verification-materialization.md`)

매니페스트에 손으로 적는 필드가 사라졌다. 두 필드 다 **실행 결과로만** 채워진다.

## 무엇을 바꿨나

- **`exports` 실측화** — `['json','html','svg']` 문자열이 사라지고, exporter를 실제로 돌려 형식별 **바이트 수와 sha256**을 남긴다.
- **`negativePaths` 실행화** — 6종 문자열 목록이 사라지고, 각 경로를 **실제로 실행해** 거부 여부와 **에러 코드**를 기록한다. 하나라도 통과하면 스크립트가 exit 1.
- **`npm run verify`** — 줄 길이 → 넘침 → 산출물 → 통합 검증을 `&&`로 잇는다.

## 실측된 거부 경로

| id | 코드 |
|---|---|
| missing-content | `CONTENT_INCOMPLETE` |
| text-overflow | `TEXT_OVERFLOW` |
| missing-asset | `BROKEN_ASSET_REFERENCE` |
| invalid-token | `TOKEN_SET_NOT_FOUND` |
| repeat-count-out-of-range | `REPEAT_COUNT_OUT_OF_RANGE` |

**6종이 5종이 됐다.** 옛 목록의 `provider-invalid-mime-size`는 **구현이 아예 없다** — `LocalFallbackProvider`는 mime·크기를 검사하지 않고 요청을 그대로 되돌려준다. 선언만 있고 코드가 없는 경로였다. 없는 것을 있다고 적지 않기 위해 목록에서 뺐다(finding으로 승계). `source-unit-integrity`는 실재하는 `repeat-count-out-of-range`로 대체했다.

## Verification

- [x] `npm run verify` — **exit 0** (4단계 전부 통과)
- [x] 매니페스트에 `exports` 18건이 실제 바이트·해시로 기록됨
- [x] `npm --prefix packages/template-core test` — 155 PASS

### Failure probe ① — probe를 무력화하면 전체가 실패하는가

`invalid-token` probe의 본문을 `() => {}`(아무것도 안 함)로 바꿨다.

```
verify: FAIL — 거부해야 할 경로가 통과했다: invalid-token
exit=1
```

되돌린 뒤 exit 0 재확인. **"probe가 없어도 통과"하는 상태를 만들 수 없다.**

### Failure probe ② — 게이트 하나가 실패하면 연쇄가 끊기는가

`check-text-overflow.mjs`를 항상 실패하도록 바꿔 `npm run verify` 실행 → **exit 1**, 그 뒤의 `export-artifacts`는 **실행조차 되지 않음**(로그에 0회 등장). 되돌린 뒤 exit 0.

## finding 큐

- `provider-invalid-mime-size`는 공급자 검증이 실재하지 않아 뺐다. 공급자 계약 검증은 TH5(Codex imagegen 공급자)에서 세운다.
- `exports`의 sha256은 12자로 자른다. 산출물 동일성 비교용이지 무결성 보증용이 아니다.
- 매니페스트는 여전히 `evidence/template-production-system/`(닫힌 horizon 경로)에 쓰인다 — 경로 이전은 별건.
