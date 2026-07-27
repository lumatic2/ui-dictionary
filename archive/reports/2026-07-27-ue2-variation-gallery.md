# 완료 — UE2 용어 상세에 바리에이션 갤러리

> 완료: 2026-07-27 · UE2 (goal `ui-encyclopedia`) · 배치: `archive/reports/2026-07-27-ue2-variation-gallery.md` (record — 작성 후 동결)

## 1. 결과

용어 상세 페이지에 바리에이션 갤러리가 생겼다 — 아코디언 4변형(기본/보더 묶음형/분리 카드형/FAQ형)·탭 3변형(밑줄/필형/세로형)이 실제로 조작되는 데모로 렌더되고, 변형마다 한 줄 정의·상태 칩·Pro 배지(2번째부터, 표시 층)·근거 레퍼런스가 붙는다. 데이터 없는 용어 560개는 화면 변화 없음(노출 정책). 사용자의 최초 요구("아코디언의 생김새·쓰임·바리에이션을 본다")가 처음으로 실물이 됐다.

## 2. 이슈와 해결

- terms.yml 파이프라인 통합은 보류 — 변형 = 설명+실동작 데모 컴포넌트 쌍이라 YAML 이 코드 참조를 소유할 수 없다. TS 레지스트리로 파일럿 검증, 데이터/코드 경계는 UE3 규모화 때 재확정 (plan finding 큐).
- 기존 `src/components` 디자인 verify 위반 77건(이월 부채) 확인 — UE2 신규 파일은 0건. 별도 정리 후보로 큐 기록.

## 3. 증거

- changeset: `changesets/20260727-ue2-variation-gallery` (step-1·2·3)
- 검증: Playwright 6항 PASS(변형 렌더·단일 펼침 실조작·disabled·탭 전환·미등록 용어 무변화·다크 캡처), 콘솔 에러 0 · tsc·build·lint exit 0 · 디자인 verify 신규 파일 PASS. 전문: `evidence/ui-encyclopedia/ue2-variation-gallery.md`
- 크기 회고: changeset 1개(절 3개), 독립 응집 변경 2건(데이터 층/렌더러)+관측 — milestone-grade 하한선. 파일럿 성격상 적정.
- 실표면: 사용자가 브라우저에서 아코디언·탭 바리에이션 직접 조작 — "응 좋아. 이어서" (관측 1회 왕복 통과).
- 재현: `cd examples/ui-vocabulary-site && npm run dev` 후 `/terms/accordion`·`/terms/tabs`
