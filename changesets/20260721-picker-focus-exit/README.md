# 214 — picker-focus-exit

- 날짜: 2026-07-21
- milestone: ECT2 — **독립 검증 refuted 후속**
- horizon: editor-color-and-token-editing

## 무엇이 틀렸나

ECT2 완료 주장("키보드로도 완주된다")에 대해 독립 검증이 **refuted**를 냈다.

Tab으로 목록 항목을 다 지나면 포커스가 툴바로 빠져나가는데 **색 목록은 화면에 그대로
떠 있었다** — `aria-expanded="true"`, DOM 존재, 실제 화면 좌표에 보임(검증자가 스크린샷 확인).
키보드 사용자에게 **유령 UI**다.

원인은 내 테스트 범위다. `onKeyDown`이 Esc·화살표·Enter만 처리했고, **테스트도 그 셋만 봤다.**
ECT1에서 두 번 refuted된 것과 같은 형태 — *내가 만든 경로만 검증했다.*

## 수정

포커스가 목록 **밖으로** 나가면 닫는다(`onBlur` + `relatedTarget` 포함 검사).
단 **포커스를 되돌리지 않는다** — 사용자가 스스로 나간 것이라 붙잡으면 포커스 덫이 된다.
그래서 `close(restoreFocus)`로 두 경로를 가른다:

| 닫는 경로 | 포커스 |
|---|---|
| Esc · 항목 선택 | 견본으로 복귀 (안 그러면 문서 처음으로 튕긴다) |
| **Tab-out** | **건드리지 않음** (덫 금지) |

## 함께 메운 near-miss

검증자가 지적: `editorPlaneRuntime.test.ts`가 선택 사각형(알파 0.18)만 검증하고
**정렬 가이드(0.72) 호출부는 커버가 없었다.** 코드는 맞지만 회귀 감지력이 없다.
가이드 알파 테스트를 추가하고, "프리멀티플라이드 값은 알파를 넘지 않는다"를 불변식으로 고정했다.

## 변경 파일

- `apps/agent-design/src/PropertyInspector.tsx` — `close(restoreFocus)`, 목록 `onBlur`
- `apps/agent-design/src/PropertyInspector.test.tsx` — Tab-out 3건
- `apps/agent-design/src/editorPlaneRuntime.test.ts` — 가이드 알파 1건

## Verification

| 항목 | 결과 |
|---|---|
| 포커스가 밖으로 나가면 목록이 닫힌다 | PASS |
| 목록 **안**에서 옮겨가는 건 닫지 않는다 (Tab 탐색 보존) | PASS |
| Tab-out 시 포커스를 붙잡지 않는다 (덫 금지) | PASS |
| 가이드 알파 0.72도 프리멀티플라이 규칙을 지난다 | PASS |
| **브라우저 실측** — 목록 안 Tab은 유지, 밖으로 나가면 닫힘·포커스 `Sidebar` 유지 | PASS |
| **Failure probe** — `onBlur` 닫기 제거 → 1건 실패 | PASS |
| `npm test` | 182 passed / 15 files |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |
