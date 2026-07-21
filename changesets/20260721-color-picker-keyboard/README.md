# 213 — color-picker-keyboard

- 날짜: 2026-07-21
- milestone: ECT2 step-3
- horizon: editor-color-and-token-editing

## 무엇을 왜

색 선택을 키보드로 완주할 수 있게 한다 — 열기(Enter/Space) · 이동(화살표, 순환) ·
선택(Enter) · 닫기(Esc) · **포커스 복귀**. anti-patterns 3(접근 가능한 인터랙션 경로)이
요구하는 것이고, 리서치가 본 5개 시스템도 포인터 외 경로를 갖는다.

키보드 커서는 현재 선택과 **형태로 구분**한다(커서=테두리, 현재=`· 지금 이 색` 글자).
색만으로 두 상태를 말하지 않는다.

## 브라우저가 잡은 결함 — 테스트는 초록이었다

키보드로 색을 고르면 **포커스가 캔버스 노드로 튕겼다.**

색을 고르면 문서가 바뀌고 그 리렌더에서 캔버스가 선택 노드에 포커스를 준다.
우리 복귀 호출(`swatchRef.current?.focus()`)이 먼저 나가고 캔버스가 나중에 가져간다.
**인스펙터만 렌더하는 단위 테스트는 이 경합을 못 본다** — 테스트는 통과했고 브라우저는 실패했다.

수정: 리렌더 **다음에** 복귀하도록 `useEffect`로 옮겼다. 브라우저 재확인에서 포커스가
견본으로 돌아온다.

이건 EU5와 같은 유형이다 — 자동 검증은 "있다"를 보고 사람은 "쓸 수 있다"를 본다.

## 변경 파일

- `apps/agent-design/src/PropertyInspector.tsx` — 키 핸들러·커서 상태·포커스 복귀(리렌더 후)
- `apps/agent-design/src/styles.css` — `[data-active]` 키보드 커서
- `apps/agent-design/src/PropertyInspector.test.tsx` — 키보드 7건

## Verification

| 항목 | 결과 |
|---|---|
| 열면 검색창으로 포커스 | PASS |
| 화살표 이동, 끝에서 순환 | PASS |
| Enter로 활성 항목 커밋 + 닫힘 | PASS |
| Esc로 닫힘 + 포커스 복귀 | PASS |
| 검색으로 목록이 줄어도 커서가 밖을 안 가리킴 | PASS |
| 키보드만으로 색 변경 완주 | PASS |
| **브라우저 실측** — 견본 포커스 → Enter → 타이핑 → 화살표 → Enter, **마우스 0회**, 포커스 견본 복귀 | PASS |
| **Failure probe** — 키 핸들러 제거 5건 / Esc 복귀 제거 1건 실패 | PASS |
| `npm test` | 178 passed / 15 files |
| `npm run typecheck` / `npm run verify` | exit 0 / exit 0 |
