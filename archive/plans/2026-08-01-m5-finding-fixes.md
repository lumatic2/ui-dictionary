# PLAN — M5: finding 소수리 — search title + llms 정합 게이트 (finding 정리 1/2)

> 생성: 2026-08-01 · 갈래: product 기능/화면 + tooling 게이트 · scope: dark-carryover finding 큐의 실작업 2건(search 문서 title 오표기 수리 · llms 재생성 누락 재발 방지 게이트) + 오탐 1건 기록. goal `finding-cleanup` 1번 milestone.
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M5→M6 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 정본 레포는 자기 결함 큐를 방치하지 않는다.
- **goal**: `finding-cleanup` (신규 — dark-carryover·M1 이월 finding 4건 정리) · **milestone**: M5 (연쇄: M5 → M6).
- **리서치 입력**: 조사 불요 — 이 세션 실측이 계획 입력: ① `/search?q=` 런타임 title "Patterns" 재현 + 원인 확정(`src/lib/page-meta.ts` 에 `search` page 유형 부재 — 검색 화면이 `plus`(Patterns) 라벨을 상속. prerender 정적 title 은 정상) ② 로고 포커스 링 finding 은 **오탐 실측**(키보드 Tab 시 `focus-visible:ring-2` 보라 링 정상 — 감사 때 프로그램적 `focus()` 가 `:focus-visible` 을 안 태운 측정 아티팩트) ③ llms 누락 실사례 = M1 `copy-language.md` 미반영(M2 재생성이 부수 정합화).

## Scope Boundary
- **포함**: ① page-meta 에 search 유형 추가 + 검색 화면 배선 — `/search` 런타임 title/description 정합 ② llms 정합 게이트 — 재생성 결과가 커밋본과 다르면 FAIL 하는 검사 신설 + 검증 체인 배선 ③ 로고 포커스 링 오탐 판정 evidence 기록(코드 무변경).
- **제외**: 라우팅 구조 변경(검색이 plus 모드를 공유하는 구조 자체는 유지 — title 만 정합) · llms 생성기 자체 개편 · 기타 finding(타이포 스케일 = M6).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 좁은 수정 2건 — 커밋 단위 revert.

## 스캐폴딩 결정
- source-of-truth: 런타임 title 정본 = `src/lib/page-meta.ts`(prerender 정적 title 과 동일 문구 유지 — `Search — Askewly Design`). llms 정합 정본 = `scripts/generate-llms-txt.mjs` 재생성 결과와 `public/llms*` 커밋본의 diff 0.
- 검증: 브라우저 실구동(`/search?q=button` 런타임 title) + 게이트 스크립트의 FAIL/PASS 양 경로 실증(의도적 소스 수정 → FAIL → 원복 → PASS) + site lint·build PASS.
- 배포/운영: push 는 goal 마감(M6) 시 일괄 — 요약 보고 후 사용자 승인(배포 배칭). M5 는 로컬 검증까지.
- 자기선언 도메인 — 없음 (좁은 수리 2건).
- 검토 후 제외: 게이트를 `@askewly/design` verify 에 통합 — 외부 패키지 개편 회피(기존 결정과 동일 논리), 레포 로컬 스크립트로.

## 결정 로그
- status: resolved
- **기술 결정**: ① search title 은 page-meta 확장(최소 수정 — 라우트 구조 무변경) ② llms 게이트 = `npm run lint:llms` 류 스크립트: 재생성 → `git diff --exit-code -- examples/ui-vocabulary-site/public/llms examples/ui-vocabulary-site/public/llms.txt` — 루트 재생성 커맨드 2종(generate-tokens·generate-llms-txt)을 모두 돌린 뒤 비교 ③ 오탐은 수리하지 않고 기록만(불필요 코드 변경 금지).
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — /search 런타임 title 정합**
  - Artifact: `src/lib/page-meta.ts` 에 search 유형(라벨 "Search") 추가 + App 의 검색 상태에서 usePageMeta 가 search 를 보고하도록 배선. prerender 정적 문구와 동일.
  - Files: write examples/ui-vocabulary-site/src/lib/page-meta.ts, examples/ui-vocabulary-site/src/App.tsx(usePageMeta 호출부). read src/routes.tsx, scripts/prerender-ui-vocabulary.ts(문구 대조).
  - Risk: 기계적 (라벨 분기 추가 — title 만 영향)
  - Dependencies: 없음
  - Verify: 브라우저 실구동 — `/search?q=button` 진입 시 `document.title === "Search — Askewly Design"` + `/patterns`·`/docs` title 무회귀 + build·lint PASS.
  - Failure probe: 검색어를 지워 plus 랜딩으로 돌아갔을 때 title 이 Search 로 잔존하는지 — 상태 전환 왕복 확인.
  - Commit: changeset `m5-finding-fixes` (README 절: step-1).

- [x] **step-2 — llms 정합 게이트 + 오탐 기록 (M5 마감)**
  - Artifact: llms 정합 검사 스크립트(재생성 2종 실행 → 커밋본 diff 0 확인, exit code) 신설 + npm script 배선 + 로고 포커스 링 오탐 판정 evidence 기록 + `evidence/finding-cleanup/m5-finding-fixes.md`.
  - Files: write scripts/check-llms-sync.mjs(또는 package.json script 조합), package.json(루트 또는 사이트), evidence/finding-cleanup/m5-finding-fixes.md. read scripts/generate-llms-txt.mjs, scripts/generate-tokens.mjs.
  - Risk: 기계적 (읽기·비교 게이트 — 소스 무변경)
  - Dependencies: 없음
  - Verify: FAIL 경로 실증(소스 문서에 임시 1줄 추가 → 게이트 FAIL → 원복 → PASS) + 현재 상태 PASS + 게이트 실행이 작업 트리를 더럽히지 않음(diff 후 원복 또는 검사 전 clean 요구 명시).
  - Failure probe: ① 게이트가 재생성 부산물을 커밋 안 된 채 남겨 다음 git 작업을 오염시키는지 — 실행 후 `git status --short` 청정 확인 ② EOL 오탐 잠재 리스크(fresh 검증자): 생성기는 무조건 LF 출력, `.gitattributes` 미지정 + `core.autocrlf=true` 라 미래 체크아웃에서 CRLF 정규화 시 false FAIL 가능 — llms 경로에 `.gitattributes` `eol=lf` 고정을 게이트와 함께 넣어 선제 차단.
  - Commit: changeset `m5-finding-fixes` (README 절: step-2).

## 검증/DoD
- **DoD**: `/search` 런타임 title 정합(실브라우저) + llms 정합 게이트가 FAIL/PASS 양 경로로 실증되어 검증 체인에 배선 + 오탐 1건 기록. 실패 모드: 소스-llms 불일치를 만들면 게이트가 잡는다.
- **Evidence**: `evidence/finding-cleanup/m5-finding-fixes.md`
- **회귀 게이트**: site lint·build PASS + title 무회귀 스팟.

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-01 작성.
- 2026-08-01 fresh 검증자(sonnet) 반영 — M6 tailwind theme.css 경로 정정(사이트 워크스페이스), M5 llms 게이트 EOL 오탐 리스크에 .gitattributes 선제 고정 추가. 사실 검증 전건 정확 판정.
