# M15 완료 보고 — 귀환 절차 정본화·배선

Date: 2026-08-02 · Plan: `archive/plans/2026-08-01-m15-figma-return-path-canonicalize.md` · Changeset: `changesets/20260802-m15-figma-return-path-canonicalize/`

## 1. 결과

M14가 실증한 기계화 귀환 절차를 세 표면의 정본으로 흡수했다. ① `methodology/figma-workflow.md` — 기계화 회수(스냅숏 장부+diff)를 ⑤의 기본 경로로 승격, ③에 장부 필수·재등록 절차·함정(20kb 청크·FNV Math.imul) 명문화 ② `docs/design-system/figma-bridge-contract.md` — §3을 두 lane(3a 사람 디테일링 회수=기계화 / 3b 레퍼런스 흡수=선별)으로 분리, §1 채널 현행화, llms FIXED_ASSETS 등재로 에이전트 노출 ③ figma-codex-workflow 스킬 — promoted 승격(사용자 승인)+M14 교훈 반영+양 배포면(claude·codex) 배포+ask-yusung 라우터 등재.

## 2. 이슈와 해결

- **Gap 서술 정정**: 계약 §5 "미반영 3건"은 실사 결과 스킬 원본에 이미 반영돼 있었다 — 진짜 문제는 버킷(in-progress=미배포). 실작업을 승격·배포·라우터 등재로 재조준.
- **출고 게이트 적발**: promoted 승격이 ask-yusung 라우터 커버리지 FAIL을 유발 — 라우터 등재로 해소(게이트가 설계대로 작동).
- **배포본 diff 검증 함정**: setup.sh가 frontmatter description을 슬리밍하고 CRLF 변환 — "diff 0" 검증은 본문 기준+`--strip-trailing-cr`로 재정의해 통과.
- 라이브 llms.txt 반영은 이 레포 push 후 — 아래 재현의 curl로 확인 예정(deploy batching: 세션 일괄 push, 사용자 승인 대기).

## 3. 증거

- changeset: `changesets/20260802-m15-figma-return-path-canonicalize/` · 커밋: 30cb26f(step-1·2) · a3947b7(step-3 기록) · custom-skills 791033f·8de9b6a(push 완료)
- 검증: grep 대조(스크립트명·계정 문자열 양 문서 실재) · `npm run lint:llms` PASS · build 759 routes PASS · oxlint 선재 경고만 · 출고 정합 85건+라우터 39스킬 PASS
- 크기 회고: 3 step·changeset 1디렉터리 — 문서·배선 milestone으로 정합(통합 검증 = 3표면 배선 확인). 무마찰 구간(llms 재생성)은 커밋 후 lint:llms 재실행으로 재검증 PASS.
- 실표면: 배포 직후 이 세션의 스킬 목록에 `figma-codex-workflow`가 실제로 노출됨(하네스 스킬 리스트 관측 — 배포가 소비 표면에 닿았다는 직접 증거). 라이브 `https://ui.askewly.com/llms.txt` 반영은 push 후 확인 항목.
- 재현: `grep -n "figma-bridge-contract" examples/ui-vocabulary-site/public/llms.txt` · `cd examples/ui-vocabulary-site && npm run lint:llms` · push 후 `curl -s https://ui.askewly.com/llms.txt | grep figma-bridge-contract`
- 평가 못 함: 라이브 llms.txt 노출 — push가 goal 마감 일괄(사용자 승인 대기)이라 이 시점엔 측정 불가, push 후 curl 1줄로 닫는다.
