# 완료 — M19 킥스타트 원커맨드 (브리프→DESIGN.md→블록 이식→검증 일괄)

> 완료: 2026-08-04 · M19 (goal `reusable-composition` 2/2, M18 chain) · 배치: `docs/reports/`
> **짧게 쓴다.** 설계 논거·경위는 changeset·커밋에 있다.

## 1. 결과

- `npx @askewly/design init --block saas-app-shell` 한 번으로 [축약 브리프(3문항 또는 플래그) → 프로젝트 DESIGN.md 생성 → 토큰층(askewly-brand.css) 파생 → 블록·asset·primitives 재귀 이식(34파일) → 요구 변수 28건 기계 대조 → verify]가 수동 개입 없이 닫힌다. 사람 경로(readline)와 에이전트 경로(`--yes`+플래그)가 한 명령.
- 정본 배선 완료: block-contract §8(계약) · design-brief 축약 모드(블록 출발일 때만 풀 브리프에 우선) · entry-protocol A-0(스킬이 fetch하는 호출자 — 3문항을 사용자에게 묻고 플래그로 전달).
- **빈 프로젝트 E2E + 사용자 관측 통과**: 사용자 브리프 답(minimal-clean·blue·geist-sans)으로 생성된 실물을 브라우저 관측 — "나쁘진 않은데 더 다듬으면 좋겠다" → 통과(원커맨드 기본값이 쓸 만한 출발점 기준). goal `reusable-composition`(저장 단위 승급 M18 + 꺼내 쓰는 경로 M19) 완주 — 해커톤 착수가 "빈 페이지"가 아니라 "브리프 3답 + 원커맨드"에서 시작한다.

## 2. 이슈와 해결

- **M17 슬라이드 변환기 파서가 hex 전용** — hsl 팔레트로 생성한 DESIGN.md 를 못 읽음(step-2 failure probe 실현) → 팔레트 hex 전환(양식 정본 무변경, 생성기가 맞춘다 원칙), 변환 29변수·대비 AA PASS — 킥스타트 프로젝트는 덱 경로도 공짜로 얻는다.
- 미존재 블록명이 DESIGN.md 를 먼저 쓰고 죽는 반쪽 산출물 → fetch 선행으로 clean fail(파일 0개).
- 계획 드리프트 기록: step-2(브리프~토큰)·step-3(이식~verify)을 한 파일·한 커밋으로 병합 실행(응집 모듈 — 검증은 두 step 기준 각각 수행) · 신형 shadcn CLI init 프롬프트 이슈는 M18 에서 이월된 마찰로, 킥스타트가 components.json 없이도 동작하는 직접 이식 경로라 비발생.
- DoD 정직 잔여: deps `npm i`·css import 1줄·블록 렌더 1줄·라우팅은 원커맨드 밖(커맨드가 다음 단계로 안내 출력 — vite 스캐폴드 생성은 create-vite 소관, 범위 밖 명시).
- 사용자 폴리싱 코멘트(기본값 시각 품질 다듬기)·recharts 진입 애니메이션 정적 캡처 이슈 → finding 큐.

## 3. 증거

- changeset: `changesets/20260804-m19-kickstart-command` (step-1~4 절)
- 검증: CLI 빌드 PASS · 무옵션 init 회귀 3파일 · `--yes` 전 구간 34파일·28/28·verify PASS · 플래그 주입 반영 · 실패 모드 3종 exit 1 · 요구 변수 고의 결손 단위시험 · M17 변환기 호환(대비 최소 5.71:1) · check-llms-sync PASS — `evidence/reusable-composition/m19-kickstart.md`
- 크기 회고: changeset 1개(step 절 4개) — step 4개·human gate 통합 검증 실재로 milestone 라벨 정합. goal 은 2-milestone 연쇄로 계획대로 소진(과소 그릇 아님).
- 실표면: 빈 프로젝트에서 원커맨드 실행 결과를 사용자가 실브라우저로 관측하고 통과 판정 — 대시보드·설정·빈 상태·다크 토글 실조작 표면(스크린샷 `screenshots/m19-step4-e2e-light.png`).
- 재현: `node packages/cli/dist/index.js init <빈 디렉터리> --block saas-app-shell --yes --registry http://localhost:<r-서빙 포트>` (라이브는 push 후 `--registry` 생략)
- 배선: `init --block` 은 entry-protocol A-0(원격 fetch 정본)가 호출자 — 실발화 1회 증거 = step-4 E2E 가 그 경로(3문항→플래그) 그대로 실행됨. npm publish 전이라 라이브 소비는 후속(finding 큐 — cli-release-procedure 경로, 사용자 승인 후).
