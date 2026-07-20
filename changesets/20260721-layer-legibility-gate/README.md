# changeset: 레이어 판독성 게이트

- Date: 2026-07-21
- Plan: EU3 step 3 (`plans/2026-07-21-eu3-layer-legibility.md`)
- 증거: `evidence/editor-legibility/eu3-layers.md`

부모 경로 펼침은 EU3 이전부터 동작하고 있었다. 만드는 대신 **실재함을 probe로 증명하고
테스트로 고정**했다.

## Verification

- [x] agent-design 128 PASS · `tsc -b` 통과 · `npm run verify` PASS
- [x] 브라우저 실조작: 검색 `11건`·1000행→13행, 검색 결과에서 선택 시 캔버스가 따라옴,
      검색을 비운 뒤에도 깊은 행이 보이고 조상이 펼쳐진 상태 유지

### Failure probe

| 되돌린 것 | 결과 |
|---|---|
| 조상 펼침 effect 본문 제거 | 3 failed |

## 정정

계획 문서에 "부모 경로 펼침을 지키는 테스트가 없다"고 적었는데 **과장이었다.** probe를 돌려보니
기존 테스트 하나가 함께 떨어졌다 — 그 테스트는 *드러남*은 봤고, *조상이 펼쳐졌는지*와
*유지되는지*는 안 봤다. 실사를 계획에 반영하겠다고 해놓고 실사 자체가 거칠었던 부분이라 기록한다.
