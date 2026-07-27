# 완료 — UE1 탐색이 작동한다

> 완료: 2026-07-27 · UE1 (goal `ui-encyclopedia`) · 배치: `archive/reports/2026-07-27-ue1-encyclopedia-navigation.md` (record — 작성 후 동결)

## 1. 결과

사이트에서 "찾는다"가 실제로 된다: 어느 페이지에서든 검색하면 사전 전체 562개에서 결과가 나오고(전엔 현재 필터에 갇혀 0건), 사이드바 카테고리 클릭이 용어 상세에서도 목록으로 착지하며(전엔 무반응), Get Started/Open Docs 뒤 뒤로가기가 돌아오고, 카테고리·검색·상세 딥링크가 새 탭에서 재현된다. TOC 는 스크롤을 따라오고 좌측 내비 스크롤이 본문을 침범하지 않는다.

## 2. 이슈와 해결

- 기계 통합 E2E 5항 PASS 상태에서 **사람 관측이 결함 10건(O1~O10)을 적발** — RU1·DOG7 구조의 재확인이자, 이번엔 관측→즉시수리→재관측 3회 왕복으로 좁은 결함 5건(O1~O4·O8)을 milestone 안에서 닫았다. 검색은 제안과 결과가 별도 코드 경로라 두 번에 걸쳐 고쳤다(O2 제안 → O8 결과).
- 잔여(정직): O5(Get Started 빈 페이지)·O6(Docs 랜딩 역할)·O7(내비 IA)·O9(검색 결과 UI 품질)·O10(Header Sections 예제가 hero 와 구분 안 서고 변형 차별성 미달)은 구조 결함 — plan finding 큐에 기록, UE2/UE3/UE5 입력. 라우팅 분리(UE5) 사용자 확정으로 ROADMAP 등록.

## 3. 증거

- changeset: `changesets/20260727-ue1-encyclopedia-navigation` (step-1·2·3 + 관측 수리 2회 보강)
- 검증: Playwright — step-1 착지 3/3 PASS · step-2 딥링크 5항 PASS · step-3 통합 5항 PASS · 관측 수리 F1~F3·O8 4항 PASS, 전 과정 콘솔 에러 0. `npm run build` exit 0 · `npm run lint` exit 0. 전문: `evidence/ui-encyclopedia/ue1-navigation.md`
- 크기 회고: changeset 디렉터리 1개(절 5개)로 닫혔으나 독립 응집 변경 3+2건·사람 관측 3회 왕복 — milestone-grade 정합. 다만 step-1·2 는 한 changeset 절로 묶일 만큼 가까웠다.
- 실표면: 사용자가 실제 브라우저에서 검색→아코디언 결과 확인("ㅇㅇ 아코디언 나온다")·사이드바→Header Sections 8예제 확인("예제 8가지 있는거 봤어")·뒤로가기 확인("뒤로가기는 되고") — 관측 3회차 통과.
- 재현: `cd examples/ui-vocabulary-site && npm run dev` 후 `?q=아코디언`·`?page=term&id=accordion`·사이드바 Header Sections 클릭
