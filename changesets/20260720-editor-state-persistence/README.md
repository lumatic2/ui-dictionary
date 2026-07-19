# changeset: 편집 상태가 살아남는다

- Date: 2026-07-20
- Plan: TH10 step 1 (`plans/2026-07-20-th10-editor-defects.md`)

템플릿을 열어 작업한 상태가 두 경로로 사라지고 있었다. 둘 다 막았다.

## 결함 ① — 저장이 fixture를 기준으로 직렬화됐다

스냅샷은 `출발 문서 + 연산 로그`로 직렬화된다. 그런데 저장 호출이 출발 문서로 **항상 dev fixture**(`baseDocument`)를 넘겼다. 템플릿을 열면 이력은 템플릿 장면에서 새로 시작하는데, 저장은 여전히 fixture를 기준으로 로그를 감았다.

결과: 템플릿을 열어 저장하고 재적재하면 **1,000노드 fixture가 복원된다.** 템플릿도 편집도 사라진다.

저장 키도 같은 문제였다 — `agent-design:${baseDocument.id}`라 모든 템플릿이 fixture의 슬롯 하나를 공유했다.

수정: **`editingBase` 상태를 분리**했다. 지금 편집 중인 이력의 출발 문서를 따로 들고, 템플릿 열기·데스크톱 스냅샷·라이브 브리지 스냅샷이 각각 이 값을 갱신한다. 저장 키와 직렬화 기준이 둘 다 여기를 본다.

## 결함 ② — fixture 크기 토글이 열어둔 템플릿을 갈아치웠다

dev 진단 패널의 노드 수 토글(1,000/5,000)이 `baseDocument`를 재생성하고, 그걸 감시하는 effect가 이력을 통째로 리셋했다. 템플릿으로 작업 중에 이 값을 건드리면 문서가 fixture로 돌아간다.

수정: **템플릿이 이긴다.** 템플릿이 열려 있으면 리셋 effect가 즉시 반환하고, 토글 자체를 비활성화해 **UI가 거짓말하지 않게** 했다.

## Verification

- [x] `npm --prefix apps/agent-design test` — **93 PASS** (90 + TH10 신규 3)
- [x] `npm --prefix apps/agent-design run build` — vite exit 0

### Failure probe

| 무엇을 되돌렸나 | 결과 |
|---|---|
| 저장 기준을 `baseDocument`로 되돌림 | **1 failed** — `expected '1,000 nodes' to be '6 nodes'` (재적재가 fixture를 복원) |
| 크기 토글 가드 제거 + `disabled` 제거 | **2 failed** — `expected 'unsaved' to contain 'template'` (문서가 fixture로 되돌아감) |

probe 1의 메시지가 결함 그 자체다 — 6노드 명함 템플릿을 저장했는데 1,000노드 fixture가 돌아왔다.

## finding 큐

- 라이브 브리지 `onSnapshot`도 `editingBase`를 갱신하도록 함께 고쳤다 — 같은 결함이 그 경로에도 있었다.
- 템플릿을 **닫는** 동작이 없다. `templateProject`가 null로 돌아가는 경로가 명시적이지 않아, 다시 fixture로 가려면 새로고침이 필요하다.
- 브라우저 실조작 확인은 TH10 step-3 뒤에 세 결함을 한 번에 관측한다.
