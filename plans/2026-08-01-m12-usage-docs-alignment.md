# PLAN — M12: 사람용 사용법 문서화 — 설치 경로 정합 + Quickstart (goal 1/2)

> 생성: 2026-08-01 · 갈래: 문서·사이트 정합 · scope: "사람이 이 시스템을 새 프로젝트에 쓰는 법"의 정면 경로를 만들고, 지금 사용자를 실패시키는 설치 명령 오기를 잡는다. goal `usage-and-site-surfacing` 1번 milestone (연쇄: M12 → M13).
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M12→M13 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 이식 가능한 제품. 이식(④)의 선행 조건이 "사람이 쓰는 법" 문서다(사용자 판정 2026-08-01 "사용법 문서화도 아직").
- **goal**: `usage-and-site-surfacing` · **리서치 입력**: 이 세션 조사 완료 — 사용법 문서 현황 6개 표면 실사(README·entry-protocol·methodology·templates·사이트 docs·CLI 계약). 핵심 발견: 사이트 Getting set up 페이지의 설치 명령이 존재하지 않는 패키지명(`ui-dictionary`)을 가리킴 — 실제 배포명은 `@askewly/design`(npm 레지스트리 200 확인), bin `askewly-design`.

## Scope Boundary
- **포함**: ① 설치 명령·패키지명 정합 수정(사이트 문서 페이지 + 잔존 오기 전수 소탕) ② 사람용 Quickstart 정본(README "How to use" 절 + templates/ 인덱스 + design-md-guide 외부 의존 경고) ③ 문서 그대로의 실구동 대조(published npm 패키지로 임시 프로젝트에서 E2E) + 실브라우저 스모크.
- **제외**: CLI 기능 추가·변경(문서화만 — CLI 코드 무변경) · npm 재배포(0.3.0 기준 문서화, 릴리스는 `cli-release-procedure.md` 별도 절차) · 사이트 Getting set up 페이지의 IA 재설계(카피·코드블록 정정 수준).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 커밋 단위 revert. scratchpad 임시 프로젝트는 세션 종료 시 방치 가능(레포 밖).

## 스캐폴딩 결정
- source-of-truth: 패키지명·커맨드의 정본 = `packages/cli/package.json` (`@askewly/design`·bin `askewly-design`). 사람용 사용 루프 정본 = 사이트 Getting set up 페이지(`documentation-pages.ts`) — README·entry-protocol 은 이를 링크.
- 검증: grep 오기 잔존 0 + site build + published 패키지 실설치 E2E(설치→커맨드 실행→출력 대조) + 실브라우저 스모크.
- 배포/운영: goal 마감(M13) 일괄 push — 사용자 승인 후(deploy batching 규약).
- 자기선언 도메인 — 없음.
- 검토 후 제외: llms.txt 재생성 — docs/design-system 원문(entry-protocol) 을 고치면 check-llms-sync 가 재생성을 요구하므로 체인에 포함(제외 아님을 명시). 사이트 소스만 고치는 경우는 비대상.

## 결정 로그
- status: resolved
- **사용자 확정(2026-08-01)**: 남은 갭 중 ②(사용법 문서화)→③(사이트 반영) 순서 진행 ("응. 2,3번 순서로 ㄱㄱ").
- **기술 결정**: ① 정본 방향 = 사이트 페이지가 사람용 루프의 정본, README 는 Quickstart 요약+링크(중복 서술 최소화 — 단일 출처 관례) ② npm 배포는 이미 돼 있음(레지스트리 200) — 배포 결정 불필요, 문서 정정만 ③ design-md-guide 의 레포 밖 스크립트(`~/projects/design-manual/...`) 참조는 내부화하지 않고 "저자 로컬 도구" 경고 한 줄로 처리(Surgical — 스크립트 이식은 이번 범위 밖).
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — 설치 경로 정합 수정 + 상호 링크**
  - Artifact: 사이트 Getting set up 코드블록 정정(`npm install @askewly/design` · `npx askewly-design add <id>`) + 레포 전수 grep 으로 잘못된 패키지명·bin 표기 잔존 0 + entry-protocol ↔ 사람용 페이지 상호 링크(레포 문서에서 사람용 루프의 위치를 찾을 수 있게).
  - Files: write examples/ui-vocabulary-site/src/lib/documentation-pages.ts, examples/ui-vocabulary-site/src/components/App.tsx(2007행 오기), examples/ui-vocabulary-site/src/components/article-documentation-layout.tsx(163행 오기), docs/design-system/entry-protocol.md, README.md(링크 줄). read packages/cli/package.json, docs/design-system/cli-registry-contract.md.
  - Risk: 기계적 (문자열 정정 — 빌드·grep 으로 차단)
  - Dependencies: 없음
  - Verify: `grep -rn "npm install ui-dictionary\|npx ui-dictionary"` 0건 + site `npm run build` PASS + entry-protocol 변경 시 `node scripts/generate-llms-txt.mjs && node scripts/check-llms-sync.mjs` PASS.
  - Failure probe: 오기가 사이트 한 곳이 아닐 수 있음(빌드 산출물·다른 docs 페이지·README) — 전수 grep 이 정본, 발견분 전부 정정.
  - Commit: changeset `m12-usage-docs-alignment` (README 절: step-1).

- [x] **step-2 — 사람용 Quickstart 정본 신설**
  - Artifact: README "How to use in a new project" 절(install → init → add → verify 4단계 + 사이트 Getting set up·llms.txt 링크) + `templates/README.md` **신규 작성**(각 템플릿 용도·적용 순서·전제 — 현재 부재 확인됨) + `methodology/design-md-guide.md` 외부 스크립트 의존 경고 1줄.
  - Files: write README.md, templates/README.md, methodology/design-md-guide.md. read templates/(전 파일 목록), docs/design-system/cli-registry-contract.md.
  - Risk: 기계적 (문서 신설 — 코드 무변경)
  - Dependencies: step-1
  - Verify: README·templates/README 의 상대 링크 실존(파일 존재 확인) + 명령 표기가 step-1 정본과 일치(grep 대조).
  - Failure probe: templates/ 파일 중 용도 불명확한 것(예: fetch-stock.py)이 있으면 추측으로 쓰지 않고 소스 코드를 읽어 용도 확인 후 기술.
  - Commit: changeset `m12-usage-docs-alignment` (README 절: step-2).

- [ ] **step-3 — 문서 그대로 실구동 대조 (E2E)**
  - Artifact: scratchpad 임시 프로젝트에서 published `@askewly/design@0.3.0` 실설치 → 문서화한 커맨드(`terms`·`tokens`·`recipes`·`init`·`add`) 실제 실행 → 출력이 문서 서술과 정합하는지 대조, 불일치 발견 시 문서 쪽 정정 + `evidence/usage-and-site-surfacing/m12-usage-docs-alignment.md`(DoD 대조 + 실행 로그 요지).
  - Files: write evidence/usage-and-site-surfacing/m12-usage-docs-alignment.md, (불일치 시) README.md·documentation-pages.ts 정정. read packages/cli/.
  - Risk: 기계적 (레포 밖 임시 디렉터리 실행 — 레포 무변경 기본)
  - Dependencies: step-2
  - Verify: 문서의 모든 명령이 실제 exit 0 + 출력 정합. 사이트 Getting set up 페이지 실브라우저 스모크(vite preview) — 정정된 코드블록 렌더 확인.
  - Failure probe: published 0.3.0 이 로컬 HEAD 와 달라 커맨드 표면이 다를 수 있음 — 문서는 published 기준으로 쓰고, 로컬에만 있는 기능은 버전 주석으로 구분(문서가 미래를 선전하지 않게).
  - Commit: changeset `m12-usage-docs-alignment` (README 절: step-3).

## 검증/DoD
- **DoD**: 사람이 README 또는 사이트에서 출발해 실패 없이 설치·주입까지 도달하는 경로가 문서로 존재하고, 그 문서의 모든 명령이 published 패키지로 실구동 검증됨. 실패 모드: 존재하지 않는 패키지명 잔존 = grep 게이트가 차단.
- **Evidence**: `evidence/usage-and-site-surfacing/m12-usage-docs-alignment.md`
- **회귀 게이트**: site build·lint + (entry-protocol 변경 시) check-llms-sync PASS.

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-01 작성.
