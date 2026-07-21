# PLAN — DOG2 남의 프로젝트에서 돈다

> 생성: 2026-07-22 · 갈래: 배포/운영 · scope 결정: 검사 규칙은 손대지 않는다 — 이미 있는 `@askewly/design` 패키지를 배포 가능한 상태로 만들고 실제로 배포한다
Status: approved (2026-07-22 — 사용자가 horizon `design-output-gates` 6 milestone 묶음을 승인, horizon 전체 연쇄. horizon `design-output-gates` 승인 범위에 포함된 DOG2. step-1은 즉시 착수 가능. step-2는 결정 5·6이 확정될 때까지 정지)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 산출물이 좋은지 기계가 잰다, 매체마다 다른 자로 (← `plans/horizons/2026-07-design-output-gates.md`)
- **milestone**: DOG2 — 남의 프로젝트에서 돈다. `npx @askewly/design@<ver> verify <dir>`가 이 레포 밖 임시 디렉터리에서 동작한다.
- **리서치 입력**: horizon 실사 결함 4(`npm view @askewly/design` → E404, 2026-07-22 실측), horizon 결정 로그 확정 2(npm 배포·기존 패키지 재사용)

## 왜 이게 먼저인가

`packages/cli`는 이미 `bin: {"askewly-design": "./dist/index.js"}` + `files: ["dist","data"]` + `prepack: npm run build`를 갖췄고, `npm run build`가 `build:data`(562 terms·45 recipes 번들) → `tsc` 순으로 실제 도는 것도 확인됐다(2026-07-22). 그런데 `npm view @askewly/design`은 **E404** — 레지스트리에 없다. 사용자가 고른 실행 경로(`npx`)가 실재하지 않는 채로 DOG6이 스킬 마무리 절차에 `verify` 호출을 배선해도, 남의 프로젝트에서는 아무것도 실행되지 않는다. DOG6이 배선을 걸기 전에 배선 대상이 실재해야 한다.

또한 현재 `license: "UNLICENSED"`다. 이 값 그대로 공개 레지스트리에 올리면 npm이 거부하지는 않지만(구문상 유효한 SPDX 식별자), 의미상 "이 패키지를 배포할 수 없다"는 선언이라 그대로 공개하는 것은 사용자 의도와 어긋난다. license 확정 없이 publish로 가면 되돌릴 수 없는 공개를 잘못된 전제 위에 하게 된다(horizon 프리모템 3).

## Scope Boundary
- **포함**: 패키지 메타데이터 정비(description·repository·keywords·engines 확인), `npm pack` dry-run 관측, 레포 밖 tarball 실증, license·scope 결정 확정, 실제 publish, 배포본 실증, 버전·재배포 절차 문서화.
- **제외**:
  - 검사 규칙 자체 변경(오탐·누락·타이포 계수) — DOG1·DOG3.
  - 스킬 마무리 절차에 `verify` 호출 배선 — DOG6.
  - `packages/cli`의 새 서브커맨드·기능 추가 — 이 milestone은 배포 가능성만 다룬다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped. **step-2는 설계된 정지점** — `user_stopped`로 명시 도달, 사용자 승인 없이 통과하지 않는다.
- rollback/cleanup: step-1은 로컬 tarball·임시 디렉터리만 건드리므로 되돌릴 것이 없다(파기하면 끝). step-2는 npm 공개 레지스트리에 실제로 올라가므로 **일반적인 git revert로 되돌릴 수 없다** — 아래 "npm unpublish 제약" 참조. step-3은 문서 변경만이라 되돌리기 쉽다.

## 스캐폴딩 결정
- source-of-truth: `packages/cli/package.json`(배포 메타데이터)와 `packages/cli/data/`(생성기가 낸 번들)가 정본이다. 배포는 이 둘을 tarball에 그대로 담아 내보내는 것이지, 새 정본을 만들지 않는다.
- 검증: `npm pack`이 실제로 담는 파일 목록과 레포 밖에서의 `npx`/`node dist/index.js` 실행 결과가 실측 기준이다. `package.json`의 `files` 선언을 읽은 것으로 검증을 대신하지 않는다(horizon 교훈 "실사 기본값은 실행해서 재기").
- 배포/운영: 이 milestone의 핵심 도메인이다. publish는 npm 공개 레지스트리에 실제 아티팩트를 올리는 되돌릴 수 없는 side-effect다. step-2를 사용자 승인 정지점으로 명시하고, publish 전 license·scope 결정을 매듭짓는다(프리모템 3 예방). npm unpublish 제약(아래 절)을 실측해 롤백 한계를 명시한다.
- 자기선언 도메인 — **버전 정책**: 검사 규칙이 바뀔 때마다 재배포가 필요한 반복 운영 절차다. semver 규약(패치=버그·오탐 수정, 마이너=새 규칙 추가, 메이저=CLI 인터페이스 변경)과 배포본-소스 drift 확인 방법을 문서화한다. 일반 코드 변경 절차와 달리 "공개 레지스트리에 이미 나간 버전은 고칠 수 없다"는 제약이 절차 자체에 들어간다.
- 자기선언 도메인 — **회귀**: 배포 준비 변경(메타데이터 수정)이 기존 `npm run build`·`vitest`를 깨지 않는지 확인한다.
- 검토 후 제외: 인증·시크릿(npm 토큰 자체는 사용자 로컬 npm login 세션을 쓴다고 가정, 이 계획에서 토큰을 다루지 않음)·마이그레이션·관측 — 걸리지 않음. 화면 UI — 이 milestone은 CLI·패키지 메타데이터만 다루므로 해당 없음.

## 결정 로그
- status: resolved
- 결정 5(license=**MIT**)·6(npm scope=**public**)이 2026-07-22 승인 시 확정됐다. `packages/cli/package.json` 의 `UNLICENSED` 는 step-1에서 MIT으로 교체한다.
- ⚠ 결정이 확정됐다고 step-2가 자동 진행되는 것은 아니다. **publish 실행 자체가 여전히 사용자 승인 정지점**이다 — 공개 배포는 되돌릴 수 없다(`name@version` 영구 재사용 불가).

### 사용자 소유 결정 (착수 전 확정 필요)

**5. license**

현재 `packages/cli/package.json`의 `"license": "UNLICENSED"`는 npm 공식 의미로 "이 패키지의 재사용을 허가하지 않는다"는 선언이다. 이 값 그대로 공개 레지스트리에 올리면 코드는 받아지지만 법적으로는 아무도 못 쓰는 패키지가 된다 — 공개 배포 의도와 모순된다.

| 선택지 | 의미 | 비고 |
|---|---|---|
| **MIT (레포 LICENSE와 일치)** — 추천 | 레포 루트가 이미 MIT(`LICENSE`, `README.md` 확인)다. 패키지 license를 MIT로 맞추면 레포 전체 라이선스 정책과 일관되고, 에이전트·서드파티가 별도 협의 없이 `npx`로 바로 쓸 수 있다. | 코드 재사용·포크에 제약이 거의 없다. Askewly의 자산이 공개 참고 시스템이라는 목적(OBJECTIVE.md)과 맞는다. |
| 사유 라이선스 문구(예: "Askewly Design License" 자체 텍스트) | 재사용 조건을 회사가 통제(예: 상업적 재배포 금지, 출처 표기 의무 등)할 수 있다. | 법률 문구 작성·검토 비용 발생. 이 milestone 범위 밖(법률 자문 불가). |
| private 레지스트리(예: GitHub Packages private, npm private scope) | 공개하지 않고 사내·특정 사용자만 접근. `license: UNLICENSED`를 유지할 수 있다. | horizon 결정 로그 확정 2("`npx`로 남의 프로젝트에서 부른다")와 어긋난다 — private 레지스트리는 인증 토큰 배포가 추가로 필요해 "아무 프로젝트에서나 `npx`" 목표를 못 채운다. |

**추천안: MIT.** 근거 — 레포 루트가 이미 MIT이고, 목적이 "에이전트가 실제로 쓰는 디자인 시스템"의 공개 배포이므로 재사용 제약이 있으면 목적과 충돌한다. **사용자 확정 전 publish 금지.** step-2는 이 결정이 `resolved`로 바뀌기 전에는 진행하지 않는다.

**6. npm 스코프 `@askewly` 소유·공개 여부**

- scoped package(`@askewly/design`)를 공개로 배포하려면 `npm publish --access public`이 필요하다(scoped package는 기본이 private이며, private scoped package는 유료 플랜이 필요하다 — 무료 계정에서는 `--access public` 없이 publish가 실패한다).
- `@askewly` 스코프(조직 또는 사용자 계정)가 npm에 이미 존재하는지, 이 세션에서 로그인된 npm 계정이 그 스코프에 publish 권한을 갖는지 **step-2 착수 시 `npm whoami`·`npm org ls @askewly`(또는 `npm access`)로 실측 확인이 필요하다.** 이 계획 작성 시점에는 로그인 세션을 확인하지 않았다 — 확인 필요로 남긴다.
- 사용자 결정 사항: `--access public`을 명시적으로 쓸 것(스코프 패키지의 공개 의도를 코드에도 남긴다), 그리고 `@askewly` 스코프 계정 접근 권한을 사용자가 보유·확인했는지.

### 확정 (참고 — horizon에서 이미 결정됨)
- 실행 위치: npm 배포, 새 패키지를 만들지 않고 기존 `packages/cli`(`@askewly/design`)를 배포한다(horizon 결정 로그 2).

## npm unpublish 제약 (확인됨 — 추측 아님)

출처: [npm 공식 Unpublish Policy](https://docs.npmjs.com/policies/unpublish) (접근 2026-07-22)

- **72시간 이내**: 다른 패키지가 의존하지 않는 한 제약 없이 unpublish 가능.
- **72시간 이후**: 아래 조건을 **모두** 만족해야 unpublish 가능 — 의존하는 패키지 없음, 최근 1주일 다운로드 300회 미만, 단일 소유자/관리자.
- **버전 재사용 금지**: "`package@version`이 한 번 쓰이면 그 조합은 영원히 다시 쓸 수 없다" — unpublish 후에도 같은 이름+버전으로 다시 publish 불가. 반드시 새 버전 번호로 올려야 한다.
- **전체 unpublish 후 24시간 제약**: 패키지의 모든 버전을 완전히 unpublish하면, 그 후 24시간 동안은 같은 이름으로 새 버전을 publish할 수 없다.
- **npm 권장 대안**: unpublish 조건을 못 채우는 경우 `npm deprecate`를 쓰라고 명시 권고한다 — 다운로드는 계속 되면서 사용자에게 경고 메시지가 뜬다.

**이 계획에 대한 함의**: step-2에서 잘못된 버전을 publish하면 그 버전 번호는 영구히 못 쓴다. 첫 publish 버전은 `0.1.0`(현재 `package.json` 버전)이 되므로, publish 전 버전 번호가 실제로 배포하려는 상태를 정확히 반영하는지 재확인한다. 실수했을 경우 되돌리기가 아니라 **다음 패치 버전으로 정정 publish**가 유일한 경로다.

## Step 트리

- [x] **step-1 — 배포 준비와 dry-run**
  - Artifact: 정비된 `packages/cli/package.json`(description·repository·keywords·engines 확인/보강), `npm pack` 실행 결과로 관측한 실제 tarball 파일 목록, 레포 밖 임시 디렉터리에 tarball을 풀어 `node dist/index.js verify <fixture>`가 도는 것을 확인한 로그.
  - Files: write `packages/cli/package.json`(메타데이터 필드만, `license` 값은 결정 5 확정 전까지 미변경), write `evidence/design-output-gates/dog2-publication.md`(dry-run 관측 기록).
  - Dependencies: 없음
  - Note: license 확정 여부와 무관하게 이 leaf는 즉시 착수 가능 — publish만 결정 대기(step-2).
  - Verify: `npm pack --dry-run` 및 실제 `npm pack` 출력에서 `dist/`와 `data/`가 포함되고 `src/`·`node_modules/`·테스트 파일이 **빠져 있다**. 생성된 tarball을 레포 밖 임시 디렉터리(`$TEMP`)에 압축 해제해 `node dist/index.js verify <fixture-dir>`를 실행하면 이 레포의 `node_modules`나 상대경로 없이 종료 코드가 정상적으로 나온다(0 또는 위반 시 1 — E404나 모듈 not found가 아님).
  - Failure probe: `data/`를 `files` 배열에서 빼고 재실행하면 `askewly-design verify`가 `data/terms.json`을 못 찾아 즉시 실패한다(번들 누락이 실제로 실행을 깨뜨림을 증명). `files`에 `src`를 추가하면 tarball 크기가 관측 가능하게 늘어난다(누출 여부를 크기로도 교차 확인).
  - Commit: changeset `cli-publish-readiness`.

- [x] **step-2 — 실제 배포**
  - ⚠ **사용자 승인 정지점.** license(결정 5)와 npm scope 공개 여부(결정 6)가 `resolved`로 확정되기 전에는 이 leaf에 착수하지 않는다. 공개 레지스트리 배포는 위 "npm unpublish 제약"에 따라 실질적으로 되돌릴 수 없다.
  - Artifact: `@askewly/design`이 npm 공개 레지스트리에 실재하는 상태(`npm view @askewly/design` 응답이 E404가 아니라 실제 버전 메타데이터를 반환), 레포 밖 임시 디렉터리에서 `npx @askewly/design@<ver> verify <dir>`가 정상 실행된 로그.
  - Files: write `packages/cli/package.json`(license 필드를 결정 5의 확정값으로, 필요 시 `publishConfig.access: "public"` 추가), write `evidence/design-output-gates/dog2-publication.md`(publish 실행 로그 + `npm view` 응답 + `npx` 실증 로그 추가).
  - Dependencies: step-1
  - Note: 착수 조건은 step-1 완료뿐 아니라 결정 5·6의 사용자 승인이다 — 위 "사용자 승인 정지점" 참조.
  - Verify: `npm view @askewly/design version`이 publish한 버전을 반환한다. **이 레포 밖** 임시 디렉터리(`cd`로 이 레포 경로를 벗어난 곳)에서 `npx @askewly/design@<ver> verify <fixture-dir>`를 실행해 정상 종료 코드를 받는다(로컬 `node_modules`나 이 레포의 상대 경로에 의존하지 않고 동작).
  - Failure probe: 잘못된 버전 번호로 publish했을 경우 그 정확한 `name@version` 조합은 영구히 재사용 불가(위 unpublish 제약 확인됨) — 이 leaf의 verify를 실행하기 전에 `npm view`로 배포된 버전이 의도한 값과 일치하는지 먼저 대조해, 불일치가 발견되면 **unpublish가 아니라 다음 패치 버전으로 정정 publish**하는 경로를 따른다.
  - Commit: changeset `cli-npm-publish`.

- [x] **step-3 — 버전·재배포 절차**
  - Artifact: 검사 규칙 변경(오탐 수정=패치, 새 규칙 추가=마이너, CLI 인터페이스 변경=메이저) 시 재배포가 필요하다는 semver 규약을 문서화한 절차서. 배포본과 소스가 어긋났는지 확인하는 방법(예: `npm view @askewly/design version`과 `packages/cli/package.json`의 `version` 필드 대조, 또는 배포된 tarball의 `data/terms.json` 항목 수와 로컬 `build:data` 재실행 결과 대조) 포함.
  - Files: write `packages/cli/README.md`(신규 — 현재 없음. 배포 상태·설치법·재배포 절차 안내), write `evidence/design-output-gates/dog2-publication.md`(절차 링크 추가).
  - Dependencies: step-2
  - Note: 실배포가 있어야 "배포본과 소스 대조" 절차를 실제로 검증할 대상이 생긴다.
  - Verify: 문서화된 대조 절차를 실제로 1회 실행해 배포본 버전과 로컬 소스 버전이 일치함을 확인한다(현재는 방금 배포한 직후이므로 일치가 정상). 절차서에 "불일치가 나오면 무엇을 하는가"(재배포 트리거 조건)가 명시돼 있다.
  - Failure probe: `package.json`의 `version`을 로컬에서만 올리고 재배포하지 않은 상태를 인위적으로 만들면, 절차서의 대조 방법이 그 drift를 실제로 잡아낸다(문서가 실행 가능한 점검임을 증명 — 읽기만 하는 서술이 아님).
  - Commit: changeset `cli-release-procedure`.

## 검증/DoD
- **DoD**: `npx @askewly/design@<ver> verify <dir>`가 이 레포 밖 임시 디렉터리에서 동작한다(horizon 닫는 기준 3).
- **Evidence**: `evidence/design-output-gates/dog2-publication.md` + `npm pack`/`npm view`/레포 밖 실행 로그
- **회귀 게이트**: `npm run verify` + `npm run typecheck` + `packages/cli` 테스트(`vitest run`) 전부 PASS

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-22 작성. license·scope 결정 미확정 — step-1까지만 사용자 승인 없이 진행 가능, step-2는 정지.
