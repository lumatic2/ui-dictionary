# changeset: VL6 step-2 — 프로토콜 요소 결정 단계

- Date: 2026-07-21 · Plan: VL6 step-2

N-2 요소 결정 단계. 군집 인덱스 → 해당 군집 → 축 답변 → 규칙 평가.

## 우회 경로를 닫았다

A/B/C 분기 위에 못 박았다: "All three branches assume N-1…N-3 already ran. **If you arrive here with the element still undecided, go back — none of the branches below will decide it for you.**"

B 분기에도 진입로를 뚫었다 — "진단 결과가 *잘못된 요소를 썼다*(내용이 스크롤되는데 modal, 네 개인데 드롭다운)면 그건 스타일 수정이 아니라 N-2 결정이다."

## 축을 못 답하면 되묻는다

"**If you cannot answer an axis from what the user said, ask them that question verbatim — one line.** Guessing an axis silently is the failure this step exists to prevent."

축이 안 갈려 되묻는 것은 실패가 아니라 정상 경로다.
