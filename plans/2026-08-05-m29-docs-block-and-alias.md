# PLAN — M29: 이식 경로 완결 — `@/` alias 안내 + docs-site 블록(3호) + 0.4.2 출고

> 생성: 2026-08-05 · 갈래: 신규 goal `docs-block-and-theme-derive` (1/2 — 연쇄 M30) · scope: 킥스타트가 인쇄한 안내**만으로** 세 번째 블록까지 신선 프로젝트가 빌드되는 상태를 만든다. 큐 ①(`@/` alias 안내 누락)과 ②(docs-site 블록)를 한 milestone 으로 묶는 이유는 아래 「왜 지금 묶는가」.
Status: approved (사용자 승인 2026-08-05 "ㄱㄱ" — 결정 A=(a) 감지 후 안내 · 결정 B=(a) 셸+3페이지 · M30 연쇄 포함)

## 북극성 → milestone → step (위계)

- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "나를 위한 정본 시스템에서 → 어디에 가든 내 디자인 색채를 입힐 수 있는 **이식 가능한 제품**으로" 축. 킥스타트는 그 이식이 실제로 일어나는 유일한 원커맨드 표면이고, 블록은 이식되는 단위다.
- **왜 지금 묶는가**: 두 건의 **통합 검증이 물리적으로 같은 한 번**이다 — ① 의 결함(alias 안내 누락)은 M27·M28 E2E 에서 *블록을 킥스타트하다가* 드러났고, 그 유일한 재현·검증 경로가 "신선 vite 프로젝트에 블록을 이식해 `tsc -b` 를 돌리는 것"이다. ② 는 어차피 그 E2E 를 한 번 해야 한다. 따로 내면 같은 E2E 를 두 번 하고 patch 릴리스도 두 번 난다. 반대로 ③(dark/light 파생)은 표면(custom-skills `/pt`)도 검증(슬라이드 렌더 관측)도 겹치는 데가 없어 M30 으로 분리했다.
- **입력 실측 (2026-08-05 계획 탐색)**:
  - ① **alias 안내 누락 재현 확인** — `packages/cli/src/kickstart.ts` L505~513 `Next steps` 4단계 중 3단계가 `import { <Export> } from "@/components/blocks/<block>/page"` 를 인쇄한다. 그리고 이식된 코드 자체가 `@/` 를 쓴다 — **`@/` 의존은 `rewriteImports`(L325~331)가 만드는 것이 아니라 레지스트리 소스에 이미 있고**(그 함수는 `@/registry/…` 를 `@/hooks/`·`@/lib/utils`·`@/components/ui/` 로 *재지정*하고, 네 번째 규칙은 오히려 `@/` 를 상대경로로 벗긴다), 결과적으로 **블록 코드 전체가 `@/` alias 에 의존하는데 그 alias 를 설정하라는 안내가 없다.** M28 라이브 E2E 2회 모두 수기로 메웠다(`tsc -b` 6건 실패, 보고서 §2 「DoD 잔여」).
  - ① **함정 하나 — vite react-ts 템플릿의 tsconfig 는 솔루션 파일이다.** 루트 `tsconfig.json` 은 `references` 만 갖고 `compilerOptions` 는 `tsconfig.app.json` 이 소유한다. `paths` 를 루트에 넣으면 `tsc -b` 가 무시한다 — 안내가 어느 파일을 지목하는지가 이 결함의 실질이다. (감지 로직도 루트만 보면 "설정 없음"으로 오판한다.)
  - ② **docs 계열 재료 실측 7종** (`examples/ui-vocabulary-site/public/r/` 57종 중): `api-reference-layout` · `docs-changelog-category-filter-page` · `docs-code-block` · `doc-search-cmdk-grouped-results-panel` · `versioned-docs-switcher-navbar-sidebar-swap` · `terminal-demo-panel` · `responsive-content-grid`. 셸+3페이지 구성을 자체 조합으로 채우기에 충분하다.
  - ② **블록 tier 기계 계약 확인** — `scripts/generate-registry.mjs` L53~113: `registry.json` 항목에 `tier:"block"` 이면 `src/components/blocks/<name>/` 디렉터리 전건을 읽고 순수성 게이트(등재 asset 만 import 허용)를 건다. 등재 asset 은 `@/components/<asset-name>` 로 import 하면 URL registryDependency 로 자동 변환된다.
  - ② **선례 규모** — M27(`marketing-landing`)은 3 step(실사 → 소스+등재+데모 → E2E+관측)으로 닫혔고 소스는 10파일 353줄이었다. 이번 `docs-site` 는 결정 B(셸+3페이지, docs asset 7종 거의 전부 소비)로 **그보다 크다.** 따라서 M27 의 분해를 줄이지 않고 **그대로 유지한 채** ①(CLI 1 step)과 출고 1 step 을 얹어 **5 step** 으로 간다 — 계획 검증 지적 반영(초안은 M27 의 두 step 을 합치면서 규모는 키웠고, 그러면 한 step 이 기계 검사 7종 + 사람 취향 게이트를 동시에 지어 리프 조건의 "단일 검증"이 깨진다).
- **조사 인용 (`research/` 선조회 — M12 규약)**: 기존 문서 3건을 인용한다 — `research/2026-08-04-m27-marketing-block-absorption-survey.md`(흡수 후보 판정 선례: Next.js 결합·유료 벽 기각 기준), `research/2026-07-19-st4-composition-patterns.md`(조합 패턴 장부), `research/tailwind-plus-documentation-capture-ledger.md`·`…-depth-ledger.md`(docs 표면 캡처 장부 — docs-site 구성의 1차 레퍼런스). **재리서치가 필요한 지점은 하나**: docs 사이트 **셸 골격**의 외부 공개 조합(Fumadocs·Nextra·Starlight 등)을 이식 가능성·라이선스로 실사한 문서가 없다 → step-2 에서 신규 작성.

## run 전 scope 결정

- **포함**: ① `@/` alias **감지 후 안내**(결정 A 확정) ② `docs-site` 블록 = **셸 + 3페이지**(결정 B 확정) + registry 등재 + `block-contract` §6 + llms 재생성 + 사이트 데모 배선 ③ `0.4.2` 출고 + CF Pages 배포 + 통합 E2E + 사용자 관측.
- **제외**: `/pt` `custom` 테마의 다크 판본(**M30** — 연쇄) · 설정 파일 자동 패치(결정 A 에서 기각된 안) · 4번째 블록 · 사이트의 블록 열람 공개 페이지 · 킥스타트 대화 흐름 개편(질문 3종 그대로) · verify 신규 규칙 · Figma 후속 3건 · recharts `isAnimationActive` 노출 검토(승계 finding) · 『인터랙티브 웹 애니메이션』 책 스터디 · D2 · Around.
- **연쇄**: **M30 — `custom` 테마의 다크 판본** (`plans/2026-08-05-m30-custom-dark-face.md`). 이 승인 1회로 M29 → M30 까지 무개입 진행한다.
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. **human gate 2개** — step-4 블록 시각 관측, step-5 `npm publish` 직전 승인.
- rollback/cleanup: 커밋 단위 revert. **`npm publish` 는 되돌릴 수 없다**(`cli-release-procedure.md` — unpublish 후에도 `name@version` 영구 점유) → 사전 게이트 전건 통과 + 사용자 명시 승인 후에만. E2E 신선 프로젝트는 scratchpad(레포 무오염). **세션 종료 시 dev 서버·정적 서빙 프로세스 정리 의무** — `TaskStop` 은 래퍼만 죽이고 node 자식이 살아남아 registry 재생성을 EPERM 으로 막는다(2026-08-04·08-05 연속 실사고). `netstat -ano | grep :<port>` → `Stop-Process -Id <pid> -Force`.

## 스캐폴딩 결정

- source-of-truth: 킥스타트 SSOT = `packages/cli/src/kickstart.ts` · 블록 소스 SSOT = `examples/ui-vocabulary-site/src/components/blocks/docs-site/` · 등재 정본 = `examples/ui-vocabulary-site/registry.json`(생성물 `public/r/*.json` 은 파생 — 직접 편집 금지) · 블록 계약 정본 = `docs/design-system/block-contract.md` §6 · 출고 절차 정본 = `docs/design-system/cli-release-procedure.md`.
- 검증: step 별 Verify + **통합 E2E** = 빈 vite react-ts 프로젝트에서 `npx --yes @askewly/design@0.4.2 init . --block docs-site --yes` → **인쇄된 alias 스니펫을 그대로 적용** → **인쇄된 `npm i` 를 그대로 실행** → 인쇄된 export 로 진입점 작성 → `npx tsc -b` **exit 0** → `npm run build` PASS → `verify` 0건 → 실브라우저 3페이지 렌더·콘솔 에러 0. 회귀 = `npx vitest run` 전건(현행 71) + `npx tsc --noEmit` exit 0 + `node scripts/generate-registry.mjs` 기존 57 자산 diff 0(신규 `docs-site`+인덱스만) + `node scripts/check-llms-sync.mjs` PASS + 사이트 `npm run build`+prerender PASS + `marketing-landing`·`saas-app-shell` 킥스타트 경로 무변경.
- 배포/운영: `npm publish` 1회(`0.4.2`, patch) + CF Pages 배포(registry 에 `docs-site` 가 올라가야 라이브 E2E 가 성립 — **배포가 출고보다 먼저**). git push 는 세션 일괄(deploy-batching 규약, 사전 요약 보고 후).
- 자기선언 도메인 — **alias 감지의 판정 권위**: tsconfig 계열은 **JSONC**(주석 허용)라 `JSON.parse` 가 실패할 수 있다. 파서를 들이지 않고 **원문 정규식 스캔**으로 판정한다(`"@/*"` paths 항목 / vite config 의 `resolve` alias 또는 `vite-tsconfig-paths`). 스캔 대상은 `tsconfig*.json` **전부**(솔루션 파일 함정) + `vite.config.{ts,js,mts,mjs}`. 기술 결정 ①.
- 자기선언 도메인 — **감지 불확실 시의 기본값**: 판정이 애매하면 **안내를 인쇄하는 쪽**으로 기운다. 중복 안내(이미 설정된 프로젝트에 한 단계 더 보이는 것)의 비용 < 누락 안내(빌드 실패)의 비용. 기술 결정 ②.
- 자기선언 도메인 — **블록 구성의 출처**: 흡수 우선(메모리 `absorption-first-building`) — step-2 실사에서 라이선스·결합도가 통과하는 외부 셸이 있으면 흡수하고 §5 2중 표기(파일 헤더 + §6 행)를 붙인다. 통과 후보가 없으면 `marketing-landing` 과 같이 자체 조합으로 간다. **불명확한 라이선스는 기각**(추정 금지).
- 검토 후 제외: 설정 파일 자동 패치(결정 A 에서 사용자가 기각) · registry 스키마에 `meta.exportName` 추가(M28 기술결정 ③ 에서 이미 기각 — 57 자산 재생성이 딸려온다) · 킥스타트에 `--install` 확장 · 사이트 블록 열람 페이지 신설.

## 결정 로그

- status: resolved
- **결정 A — `@/` alias 결함을 킥스타트가 어디까지 처리하는가 [사용자 소유 · 확정 2026-08-05]**: **(a) 감지 후 안내.** `vite.config`·`tsconfig*` 를 읽어 `@/*` alias 가 이미 있으면 안내를 생략하고, 없으면 복붙 가능한 설정 스니펫을 `Next steps` 최상단에 **필수 단계**로 인쇄한다. 기각: (b) 설정 파일 자동 패치 — config 형태가 제각각(defineConfig·기존 resolve·plugins 배열·JSONC 주석)이라 오편집 위험이 실재. (c) 감지 없이 항상 인쇄 — 이미 설정된 프로젝트에 불필요한 단계.
- **결정 B — docs-site 블록 범위 [사용자 소유 · 확정 2026-08-05]**: **셸 + 3페이지.** docs 셸(navbar + 버전 스위처 + 사이드바) + ⓐ 아티클 페이지(prose·code block·터미널 데모) + ⓑ API 레퍼런스 + ⓒ 체인지로그, cmdk 검색 오버레이 배선. 기존 docs asset 7종을 거의 전부 소비한다. 기각: 2페이지·1페이지 — docs asset 이 남고, 블록 tier(앱 골격급 조합) 기준이 흐려진다.
- **기술 결정 (사전 소진 — 재질문 없음)**:
  - ① **alias 감지 = 원문 정규식 스캔** (위 스캐폴딩 자기선언 ①). JSONC 파서 도입 없음.
  - ② **감지 불확실 = 안내 인쇄** (위 자기선언 ②).
  - ③ **버전 `0.4.2` (patch)** — 안내 문구 추가와 신규 블록 지원은 CLI 인터페이스(플래그·출력 형식·exit code 의미) 변경이 아니다. `cli-release-procedure.md` semver 표 patch 행.
  - ④ **배포 순서 = registry 먼저, npm 나중.** 라이브 E2E 가 `ui.askewly.com/r/docs-site.json` 을 fetch 하므로 CF Pages 배포가 선행이다. 중간 관측은 로컬 정적 서빙(`python -m http.server 8899 --directory examples/ui-vocabulary-site/public` → `--registry http://127.0.0.1:8899`, M27 기술결정 ④ 승계). **승계 제약**: 블록 JSON 의 asset `registryDependencies` 는 라이브 절대 URL 이라 로컬 서빙으로는 **asset 변경분이 오지 않는다** — asset 을 건드리면 파일 직접 복사로 관측하고 라이브는 배포 후 별도 1회 확인.
  - ⑥ **인쇄할 스니펫 = 신규 npm 의존을 만들지 않는 형태** (계획 검증 지적 — 결정 A 는 "복붙 가능한 스니펫"까지만 확정했다). `vite-tsconfig-paths` 설치를 권하지 않는다: 킥스타트가 인쇄하는 `npm i` 목록은 **이식된 파일이 실제로 import 하는 것**이라는 계약(M28 기술결정 ②)이 있는데, 빌드 도구 플러그인을 거기 섞으면 그 계약이 흐려진다. 대신 ⓐ tsconfig(= `compilerOptions` 를 실제로 소유한 파일) 의 `paths` ⓑ `vite.config` 의 `resolve.alias`(`node:path`·`fileURLToPath` 사용 — vite 가 이미 의존하는 Node 내장) **두 조각**을 인쇄하고, 이미 있는 쪽은 생략한다.
  - ⑤ **블록 `requiredCssVars` 는 소스 실측으로 채운다** — 블록 파일에서 실제 참조되는 CSS 변수를 grep 해 선언과 대조한다. 선언이 실사용보다 좁으면 킥스타트 §8-5 검사가 통과해 버리고 이식처에서 색이 빠진다(계약이 조용히 거짓이 되는 유일한 경로).
- **위임 결정**: step-2(외부 docs 셸 흡수 실사) = **use** — 단일 조사 위임 1회(병렬 아님·롤백 대상 없음). 라이선스 URL·접근일은 **parent 가 재확인**한 뒤 채택 판정한다(child 결과를 완료로 믿지 않는다). 그 외 step = **skip**(자체 코드 수정·검증이라 위임 이득 없음).

## Step 트리

- [x] **step-1 — `@/` alias 감지 + 안내 (결정 A)**
  - Artifact: `packages/cli/src/kickstart.ts` 에 순수 함수 `detectPathAlias(targetDir): { tsconfig: string | null; vite: boolean }` 추가 — `tsconfig*.json` **전부**를 원문 스캔해 `"@/*"` paths 를 가진 파일을 찾고(없으면 `compilerOptions` 를 실제로 소유한 파일 = `tsconfig.app.json` 우선, 없으면 `tsconfig.json` 을 안내 대상으로 지목), `vite.config.{ts,js,mts,mjs}` 에서 `resolve` alias 또는 `vite-tsconfig-paths` 를 스캔. + `Next steps` 최상단에 조건부 단계 삽입(둘 다 있으면 생략, 없는 쪽만 해당 **파일 이름을 지목한** 복붙 스니펫으로 인쇄). + 단위 테스트.
  - Files: edit packages/cli/src/kickstart.ts. edit packages/cli/test/kickstart.test.ts.
  - Risk: 기계적 (순수 함수 1개 + 출력 문자열. 이식·토큰 로직 불변)
  - Dependencies: 없음
  - Verify: `cd packages/cli && npx vitest run` 전건 PASS(신규 케이스 포함) + `npx tsc --noEmit` exit 0 + 로컬 빌드본으로 **신선 vite react-ts** scratchpad 프로젝트에 `init . --block marketing-landing --yes` → 인쇄된 스니펫을 **그대로 붙여넣고** `npx tsc -b` **exit 0** + `npm run build` PASS(= M28 에서 수기로 메웠던 6건 무재현) → 같은 디렉터리에서 `init` 재실행 시 alias 단계가 **인쇄되지 않음**.
  - Failure probe: ⓐ **오판(있다고 봄)** — 주석 처리된 `// "@/*": ["./src/*"]` 를 설정으로 읽어 안내를 생략하는 경우. 테스트에 주석 fixture 를 넣어 "안내 인쇄"로 남는지 확인(기술 결정 ② 방향). ⓑ **오판(없다고 봄)** — `tsconfig.app.json` 에 설정이 있는데 루트만 보고 중복 안내하는 경우. 솔루션 파일 fixture 로 확인. ⓒ 안내가 지목한 파일이 실제로 `compilerOptions` 를 소유하지 않아 `tsc -b` 가 무시하는 경우 — 위 Verify 의 `tsc -b` exit 0 이 이것을 잡는다.
  - Commit: changeset `20260805-m29-docs-block-and-alias` (README 절: step-1).

- [x] **step-2 — docs-site 셸 흡수 실사 + 구성 확정 (흡수 우선)**
  - Artifact: `research/2026-08-05-m29-docs-site-absorption-survey.md` — ⓐ 외부 공개 docs 사이트 조합 후보 **≥5건**(Fumadocs·Nextra·Starlight·Docusaurus·shadcn docs 셸 등) 각각 출처 URL + 접근일 + 라이선스 + 결합도(프레임워크·MDX 파이프라인 종속) + **채택/기각 사유 1줄** ⓑ 채택안 확정(흡수 or 자체 조합) ⓒ **구성표** — 셸/3페이지에 우리 asset 7종이 각각 어디 앉는지, 미사용이면 그 사유 ⓓ 블록의 `requiredCssVars` 초안.
  - Files: write research/2026-08-05-m29-docs-site-absorption-survey.md.
  - Risk: 위험 (라이선스 판정이 틀리면 하류 전체가 오염된다 — 그래서 URL 재확인을 parent 가 한다)
  - Dependencies: 없음 (step-1 과 독립 — 동시 가능)
  - Verify: 후보 ≥5건 각각 출처 URL + 접근일 기재(리서치·인용 규칙) + 라이선스 근거 링크가 **parent 재확인 표시**를 갖는다 + 구성표가 asset 7종 전부에 대해 배치 또는 미사용 사유를 명시 + 채택안이 `block-contract` §5(흡수) 또는 §3(자체 조합) 중 어느 경로인지 명시.
  - Failure probe: 라이선스가 불명확한 후보를 "MIT 추정"으로 채택하는 경우 — **불명확은 기각**이 계약(§5 "Unclear or commercial per-block terms → reject, never assume"). 실사 결과 채택 후보가 0건이면 그것은 실패가 아니라 **자체 조합 확정**이며, 그 사실을 ⓑ 에 적는다.
  - Commit: changeset (README 절: step-2).

- [x] **step-3 — `docs-site` 블록 소스 + registry 등재 + 계약 §6 (기계 검증까지)**
  - Artifact: `examples/ui-vocabulary-site/src/components/blocks/docs-site/`(셸 + 3 페이지 + `data.json` — step-2 구성표대로, 흡수분이 있으면 파일 헤더에 출처·라이선스·저작권 줄) + `registry.json` 에 `tier:"block"` 항목(+`requiredCssVars`, 기술 결정 ⑤ 로 실측) + `block-contract.md` §6 표 행 + Changelog 줄 + registry·llms 재생성.
  - Files: write examples/ui-vocabulary-site/src/components/blocks/docs-site/*(셸·3페이지·data.json). edit examples/ui-vocabulary-site/registry.json. edit docs/design-system/block-contract.md. (재생성 산출물: examples/ui-vocabulary-site/public/r/*, llms 산출물.)
  - Risk: 위험 (신규 자산 등재 — 순수성 게이트·llms 동기화·기존 57 자산 무변경이 동시에 걸린다)
  - Dependencies: step-2
  - Verify: `node scripts/generate-registry.mjs` 순수성 게이트 PASS + **기존 57 자산 diff 0**(신규 `docs-site` + 인덱스만) + `node scripts/check-llms-sync.mjs` PASS + `npx @askewly/design verify examples/ui-vocabulary-site/src/components/blocks/docs-site` **0건** + 사이트 `npm run build` PASS.
  - Failure probe: ⓐ 순수성 위반 — 미등재 컴포넌트 import 시 생성기가 fail 로 막는다(설계된 게이트). ⓑ **`requiredCssVars` 가 실사용보다 좁은 경우** — 블록 소스에서 참조되는 `var(--…)` 를 전수 grep 해 선언과 대조한다. 좁으면 킥스타트 §8-5 검사가 통과해 버려 이식처에서 색이 빠진다(계약이 조용히 거짓이 되는 유일한 경로).
  - Commit: changeset (README 절: step-3).

- [ ] **step-4 — 사이트 데모 배선 + 실브라우저 관측 (사람 게이트)**
  - Artifact: 사이트 데모 배선(`recipe-gallery-demo-registry.ts`·`navigation-model.ts` — `marketing-landing` 선례 경로) + 로컬 서빙 registry 로 킥스타트해 3페이지를 실브라우저로 띄우고 **라이트/다크 관측** → 지목분 반영 → `evidence/docs-block-and-theme-derive/m29-docs-site-block.md`(전/후 스크린샷·지목 항목·판정).
  - Files: edit examples/ui-vocabulary-site/src/lib/recipe-gallery-demo-registry.ts. edit examples/ui-vocabulary-site/src/lib/navigation-model.ts. write evidence/docs-block-and-theme-derive/m29-docs-site-block.md. (지목 시) edit examples/ui-vocabulary-site/src/components/blocks/docs-site/*. **경고(M28 교훈)**: 지목이 조합된 **asset 소스**(`docs-code-block` 등)에 걸릴 수 있다 — 걸리면 그 파일도 이 step 의 Files 로 간주하고 진행 로그에 명시한다(M28 에서 실제로 계획서보다 넓어진 지점).
  - Risk: 위험 (사람 취향 관측이 유일한 판정자 — 확인 전 완료 선언 금지)
  - Dependencies: step-3
  - Verify: 사이트 build + prerender PASS + 3페이지 실브라우저 렌더 라이트/다크 콘솔 에러 0 + 스크린샷 ≥4장 + **사용자 관측 1회 통과** + 지목 반영이 블록 소스에 닿았으면 registry 재생성 diff 가 해당 자산만·llms 동기화 PASS·`verify` 0건 유지.
  - Failure probe: 다크 모드에서 코드 블록·사이드바 대비가 무너지는 경우 — 라이트/다크 양쪽 관측을 게이트로 둔다. 취향 수정이 WCAG AA(4.5:1)를 깨면 되돌린다(취향이 접근성을 이기지 않는다).
  - Commit: changeset (README 절: step-4).

- [ ] **step-5 — CF Pages 배포 + `0.4.2` 출고 + 통합 E2E**
  - Artifact: registry 배포(CF Pages — `docs-site` 라이브) → `packages/cli/package.json` `0.4.2` + `cli-release-procedure.md` 배포 이력 행 + 사전 게이트 전건 실행 로그 → **사용자 승인 후** `npm publish` → 라이브 통합 E2E → `evidence/docs-block-and-theme-derive/m29-release-042.md`.
  - Files: edit packages/cli/package.json. edit docs/design-system/cli-release-procedure.md. write evidence/docs-block-and-theme-derive/m29-release-042.md.
  - Risk: 위험 (`npm publish` 불가역 — `name@version` 영구 점유. 사전 게이트 전건 PASS + 사용자 명시 승인 없이 실행 금지)
  - Dependencies: step-1, step-4
  - Verify: 배포 전 — `npm run build` · `npx vitest run` 전건 · `npx tsc --noEmit` exit 0 · `npm pack --dry-run` 파일 목록이 `0.4.1` 대비 예상 밖 증감 없음. 배포 후(**통합 E2E**) — 빈 vite react-ts 프로젝트에서 `npx --yes @askewly/design@0.4.2 init . --block docs-site --yes` → **인쇄된 alias 스니펫 그대로 적용** → **인쇄된 `npm i` 그대로 실행** → 인쇄된 export 로 진입점 작성 → `npx tsc -b` **exit 0** → `npm run build` PASS → `npx @askewly/design@0.4.2 verify .` 0건 → 실브라우저 3페이지 렌더·콘솔 에러 0.
  - Failure probe: publish 후 라이브 E2E 가 깨지는 경우 — 되돌리기가 없으므로 `0.4.3` 정정 릴리스로 처리하고(절차 문서 명시 방침), **사전 게이트를 통과했는데 라이브에서 깨졌다면 게이트에 빠진 검사가 무엇인지**를 evidence 에 함께 기록한다. registry 배포 누락으로 fetch 404 가 나는 경우 — 배포 순서(기술 결정 ④)를 지켰는지 먼저 확인.
  - Commit: changeset (README 절: step-5).

## 검증/DoD

- **DoD**: `0.4.2` 가 npm 에 있고 `docs-site` 가 라이브 registry 에 있으며, **빈 vite 프로젝트 → 킥스타트 1커맨드 → 인쇄된 안내만으로(수기 보완 0) → `tsc -b` exit 0 → 빌드 성공 → 3페이지 실브라우저 렌더**가 개입 없이 통과한다. M28 E2E 에서 2회 수기로 메웠던 alias 구멍이 무재현이고, 블록 3호가 `block-contract` §6 에 등재돼 llms 로 배포된다. 사용자 관측 1회 포함.
- **실패 모드 확인**: ① alias 감지 오판 양방향(주석 fixture·솔루션 파일 fixture — step-1 probe) ② 흡수 후보 라이선스 불명확 시 기각(step-2 probe) ③ `requiredCssVars` 과소 선언(step-3 probe ⓑ) ④ 다크 모드 대비 붕괴·취향이 WCAG 를 이김(step-4 probe) ⑤ publish 후 라이브 실패 시 게이트 공백 기록(step-5 probe).
- **Evidence**: `evidence/docs-block-and-theme-derive/m29-docs-site-block.md` · `…/m29-release-042.md`
- **회귀 게이트**: vitest 전건(현행 71 + 신규) · `tsc --noEmit` exit 0 · registry 기존 57 자산 diff 0 · llms 동기화 PASS · 사이트 build+prerender PASS · `marketing-landing`·`saas-app-shell` 킥스타트 경로 무변경.

## finding 큐

- (실행 중 발견분을 여기에 append)

## 진행 로그

- 2026-08-05 계획 검증 반영 — fresh 검증자 지적 3건: ⓐ `rewriteImports` 서술 부정확(결론 유지, 근거 정정) ⓑ step-3 과소분해(M27 의 2 step 을 합치면서 규모는 키움) → **step-3/4 로 분해, 총 5 step** ⓒ 인쇄 스니펫 형태 미결 → 기술 결정 ⑥ 추가(신규 npm 의존 금지).
- 2026-08-05 작성 — 결정 A(감지 후 안내)·B(셸+3페이지) 사용자 확정 반영. 입력 실측: kickstart.ts L505~513 alias 안내 부재 + `rewriteImports` 가 전 경로를 `@/` 로 접음 · vite react-ts 솔루션 tsconfig 함정 · docs 계열 asset 7종 존재 · 블록 tier 순수성 게이트 계약(generate-registry.mjs L53~113).
