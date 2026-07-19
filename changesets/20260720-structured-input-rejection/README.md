# changeset: 깨진 입력을 코드로 거부한다 + 조용한 폴백 제거

- Date: 2026-07-20
- Plan: TH10 step 3 (`plans/2026-07-20-th10-editor-defects.md`)

## 결함 ① — 형태가 깨진 입력이 TypeError로 터졌다

```
{}          → TypeError: Cannot read properties of undefined (reading 'schemaVersion')
null        → TypeError: Cannot read properties of null (reading 'scene')
nodes 없음   → TypeError: Cannot read properties of undefined (reading 'sourceRoot')
```

차단은 됐다. 하지만 **어디가 잘못됐는지 알 수 없다** — JSON 재가져오기 화면이 사용자에게 스택 트레이스를 보여주는 셈이었다.

수정: 필드를 읽기 **전에** 형태를 본다. 이제 무엇이 없는지 코드로 말한다.

```
{}          → MISSING_REQUEST, MISSING_ASSETS, MISSING_SCENE
null / [] / '문자열' → NOT_A_TEMPLATE_PROJECT
scene: {}   → MISSING_SCENE_NODES
```

## 결함 ② — 갤러리 카드의 조용한 폴백

`structureSummary(blueprintId)`가 카탈로그에서 id를 되찾다가 못 찾으면 `'구조 정보 없음'`을 표시했다. 그 상태면 **카드 자체가 잘못된 것**인데 화면은 정상처럼 보인다.

수정: 가드를 더하지 않고 **분기를 없앴다.** 카드가 이미 들고 있는 청사진 객체를 그대로 넘긴다 — 못 찾는 경우가 존재할 수 없다. 방어 코드보다 그 상태를 불가능하게 만드는 쪽이 낫다.

## Verification

- [x] `npm --prefix packages/template-core test` — **162 PASS** (155 + 신규 7)
- [x] `npm --prefix apps/agent-design test` — 98 PASS
- [x] `npm run verify` — 4단계 exit 0

### Failure probe

형태 검사 2줄을 제거했다.

```
× 어떤 입력에도 TypeError를 던지지 않는다
  → expected [Function] to not throw an error but 'TypeError: Cannot read properties of …' was thrown
Failed Tests 7
```

### 브라우저 실조작 (TH10 전체 DoD)

`http://localhost:5173`에서 실제로 눌러 확인했다.

| 확인 | 결과 |
|---|---|
| 명함 템플릿 열기 | `6 nodes`, 상태 `template starter-business-card-minimal · tpl-f0a891b8` |
| **토큰 세트 표시** | 드롭다운 값 = **`askewly.warm`**, 옵션 4개(편집기 2 + 템플릿 2) |
| **저장 → 재적재** | 저장 키 `agent-design:starter-business-card-minimal`, 재적재 후 **6 nodes 유지** (fixture 1,000노드로 안 돌아감) |
| **fixture 토글 잠금** | `disabled=true`, 배경 `oklch(0.35 0.03 270)`(`--ad-surface-muted`), `cursor: not-allowed` — 브라우저 기본 아님 |
| 캔버스 렌더 | warm 배경 + 초록 accent rail + 한글 자리표시자 |

증거: `evidence/template-production-hardening/th10/` (3장)

## 브라우저가 알려준 것

편집기 세트(`askewly.dark`)를 **템플릿 문서**에 붙여봤더니 노드 3개가 `data-token-unresolved`로 표시됐다. 두 어휘가 겹치지 않는다는 사실이 화면에서 그대로 드러난다 — 조용히 회색으로 덮지 않는다(TH7이 세운 계약). 목록에 둘을 나란히 놓은 지금 구조에서는 **사용자가 이 조합을 만들 수 있다**. 진단은 뜨지만 막지는 않는다.

## finding 큐

- 편집기 세트 ↔ 템플릿 문서 조합을 막을지 허용할지 미결. 지금은 허용하고 진단만 띄운다.
- 툴바의 `Viewport` 레이블이 select와 붙어 겹쳐 보인다(기존 chrome 이슈, 이번 범위 밖).
- 템플릿 갤러리 패널이 캔버스를 덮는다 — 열어둔 채로는 작업물이 안 보인다.
