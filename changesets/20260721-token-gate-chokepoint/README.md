# 209 — token-gate-chokepoint

- 날짜: 2026-07-21
- milestone: ECT1 — **독립 검증 2회 refuted 후속 수정**
- horizon: editor-color-and-token-editing

## 두 번 틀렸고, 두 번째에 방법이 틀렸다는 걸 알았다

| 회차 | 막은 것 | 검증자가 뚫은 것 |
|---|---|---|
| ECT1 최초 | `set-node-property` | **`update-node.patch.tokenBindings`** |
| 1차 수정 | 위 + `update-node` | **`create-node`** (노드 내용 통째로 신뢰) |

1차 수정은 뚫린 경로 하나를 더 막는 방식이었다. **그게 틀렸다.**
연산은 앞으로도 늘어나고, 새 연산마다 검사를 심는 걸 기억해야 하는 구조는 반드시 샌다.

## 그래서 길목 하나로 옮겼다

`applyOperation`·`replayOperations`는 이미 끝에서 문서를 검사한다 — **모든 연산이 지나는 길목**이다.
연산 종류를 가리지 않고 거기서 본다. `create-node`든 `batch` 안의 `update-node`든 앞으로 생길
연산이든 전부 이 문을 지난다.

### 왜 전체가 아니라 델타인가

문서 전체를 검사하면 **이미 저장돼 있던 죽은 바인딩까지 걸려 사용자가 자기 문서에서
아무것도 못 하게 된다.** ECT1의 결정("저장 시점만 막고 소급 무효화하지 않는다")을 지키려면
이 연산이 **새로 넣거나 바꾼** 바인딩만 봐야 한다. 손대지 않은 기존 값은 통과시킨다.

### 스냅샷 로드는 막지 않는다 — 의도된 경계

검증자는 `recoverSnapshot`도 우회로로 분류했으나, 여기서 막으면 사용자가 자기 문서를 못 연다.
토큰이 사라진 옛 문서는 열려야 하고 죽은 바인딩은 렌더에서 `data-token-unresolved`로 드러난다.
**쓰기(연산)는 막고 읽기는 막지 않는다** — 이 구분을 `persistence.ts`에 주석으로 명시해
다음 사람이 누락으로 오해하지 않게 했다.

## 변경 파일

- `packages/canvas-core/src/properties.ts` — `validateTokenBinding` 추출(규칙 정본 하나)
- `packages/canvas-core/src/operations.ts` — `assertTokenBindingDelta`를 `applyOperation`·`replayOperations` 길목에 배선. 1차 수정의 `update-node` 국소 검사는 **제거**(중복 규칙 금지)
- `packages/canvas-core/src/persistence.ts` — 로드 경계 명시 주석
- `packages/canvas-core/src/properties.test.ts` — 경로 무관 검증 8건

## Verification

| 항목 | 결과 |
|---|---|
| `create-node`로 가짜 토큰 박기 → 거부, 노드 생성 안 됨 | PASS |
| `batch`로 감싼 `update-node` → 거부 | PASS |
| `update-node` 직접 → 거부 (모양·실재 둘 다) | PASS |
| 실재하는 토큰은 모든 경로로 저장됨 | PASS |
| **손대지 않은 기존 죽은 바인딩은 다른 연산을 막지 않음** (델타인 이유) | PASS |
| 토큰 무관 patch(이름·bounds)는 영향 없음 | PASS |
| 두 경로가 같은 사유 문자열 (규칙이 하나라는 증거) | PASS |
| **Failure probe** — 길목 검사 2줄 제거 → 테스트 5건 실패, 원복 시 88건 통과 | PASS |
| canvas-core `vitest run` | 88 passed / 10 files |
| `npm test` (apps/agent-design) | 152 passed / 14 files |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |

## 배운 것 (다음 milestone에 적용)

**"경로마다 검사"는 검증 가능한 구조가 아니다.** 내가 아는 경로만 막게 되고,
자기 게이트는 자기가 막은 경로만 두드린다. 길목을 찾아 거기서 한 번 보는 구조여야
"모든 경로가 막혔나"가 관측 가능해진다.

ECT4의 "허용 키 정본은 하나"가 같은 병리에 대한 처방인데, 이번에 그 병리를 실물로 두 번 맞았다.
ECT4는 이 경험을 근거로 단일 출처를 **선택지가 아니라 조건**으로 잡는다.

## 남은 위험 (미해소)

`registerTokenVocabulary` 미등록 시 모양 검사로 조용히 강등된다. `App.tsx` 최상위 등록이
제거·조건부화되면 canvas-core 테스트는 전부 초록인 채 실제 앱만 뚫린다 —
`documentTokens.test.ts`의 배선 테스트 하나가 단일 방어선이다.
