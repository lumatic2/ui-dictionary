# PLAN — DOG3 타이포 단계를 센다

> 생성: 2026-07-22 · 갈래: tooling · scope 결정: font-size 계수 규칙과 CLI 표면만 만든다 — 색 검사기 정밀화·npm 배포·스킬 배선은 다른 milestone
Status: approved (2026-07-22 — 사용자가 horizon `design-output-gates` 6 milestone 묶음을 승인, horizon 전체 연쇄. horizon `design-output-gates` 승인 범위에 포함된 DOG3). 단, **결정 로그의 임계값 항목은 사용자 확정 대기**(horizon 결정 로그 미결 5번과 동일 항목).

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 산출물이 좋은지 기계가 잰다, 매체마다 다른 자로 (← `plans/horizons/2026-07-design-output-gates.md`)
- **milestone**: DOG3 — 타이포 단계를 센다. 화면에서 쓰인 font-size 고유값 개수를 세고, 임계 초과 시 보고한다.
- **리서치 입력**: horizon 문서 "리서치 입력" 절의 Kraft 원문 확인 사실(타이포 임계값 4단계, t1~t10 척도, [출처](https://medium.com/p/0bc268f819c7) SeieunYoo·medium.com/daangn·2026-04-30·접근 2026-07-22), `tokens/askewly.tokens.json`의 `typography.scale` 실측(아래 "왜 이게 먼저인가" 참조)

## 왜 이게 먼저인가

horizon 실사가 확정한 사실 두 가지가 이 milestone의 근거다.

1. **타이포 검사기가 아예 없다** — horizon "실사로 나온 진짜 결함" 표 결함 6. 색 검사기(`packages/cli/src/verify.ts`)는 있지만 타이포 단계를 재는 코드는 레포 어디에도 없다(`grep -r "font-size" packages/ scripts/` — 검사 로직 0건, 토큰 정의만 있음).
2. **우리 자체 토큰 스케일을 실제로 세어보면 5단계다** — `tokens/askewly.tokens.json:190-197`의 `typography.scale`은 `sm(14px)·base(16px)·lg(20px)·xl(28px)·2xl(40px)` **5개** 항목이다. Kraft 원문의 권고 임계값 4보다 하나 많다. 이 실측이 결정 로그의 임계값 논의를 좌우한다 — 우리 SSOT 자체가 4단계가 아니라는 뜻이다.
3. **Tailwind 유틸리티 클래스는 이 5단계 밖으로도 새어나간다** — `examples/ui-vocabulary-site/src/tokens.css`가 `--font-size-sm/base/lg/xl/2xl` 다섯 개만 재정의하고, `text-xs`·`text-3xl`~`text-9xl` 등은 Tailwind 기본 스케일(각각 12px·30px·36px…)을 그대로 쓴다. 즉 "우리 토큰 5단계"와 "실제로 화면에 쓰이는 font-size 전체 어휘"는 다른 크기의 집합이다.
4. **실제 컴포넌트 파일 하나를 읽어보면 5단계는커녕 두 자릿수가 나온다** — `examples/ui-vocabulary-site/src/components/home-page.tsx`에서 `text-[Npx]` 임의값만 세어도 `7px·8px·9px·10px·11px·12px·13px·15px·17px`가 나오고, 여기에 `text-xs`·`text-base`·`text-lg`·`text-4xl`·`md:text-6xl`이 더해진다. 이 파일 하나가 임계값 4~5를 압도적으로 초과한다 — 이것이 정확히 step-3에서 판정해야 할 "임계값이 틀렸나 셈법이 틀렸나" 질문의 실측 재료다(아래 "설계 결정" 참조: 이 값들은 축소 렌더된 목업 쇼케이스 카드 안의 장식용 텍스트이지, 하나의 실제 화면이 아닐 가능성이 크다).

## Scope Boundary
- **포함**: font-size 고유값 계수 규칙(Tailwind 유틸리티 클래스·인라인 style·CSS 선언 통합), 새 CLI 서브검사(`verify` 경로에 타이포 규칙 추가, 임계값 옵션), 우리 자산(`examples/ui-vocabulary-site`) 대상 실측 보정.
- **제외**:
  - 색 검사기 정밀화(SVG·주석 예외, 다중 위반) — DOG1.
  - `@askewly/design` npm 배포 — DOG2.
  - `SKILL.md`/entry-protocol에 `verify` 호출 배선 — DOG6. 이 milestone이 끝나도 마무리 절차는 여전히 타이포 검사를 자동으로 안 부른다.
  - 인쇄·슬라이드 매체의 타이포 규칙(자간·본문 최소 pt) — DOG4·DOG5. 이 milestone은 화면(웹 컴포넌트) 매체만 다룬다.
  - `spacing-rules`·`animation-stability` 채점기 이식 — horizon 비목표.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. 회귀 fixture는 규칙과 한 쌍이므로 되돌릴 때 함께 되돌린다(DOG1 선례와 동일 이유 — 갈라지면 회귀 게이트가 거짓 PASS를 낸다).

## 설계 결정 (step-1의 핵심 — 얼버무리지 않는다)

### 무엇을 하나의 '단계' 집합으로 합칠 것인가

**규칙: 모든 font-size 표현을 해석된 px 정수로 정규화한 뒤, 그 값들의 고유 집합(Set) 크기를 "단계 수"로 센다.**

세 가지 형태를 다음과 같이 하나의 px 값으로 환원한다:

| 형태 | 예 | 정규화 방법 |
|---|---|---|
| Tailwind 이름 유틸리티(우리 토큰 스케일 안) | `text-sm`·`text-lg`·`text-2xl` | **CLI 자신의 `askewly-design tokens --tier component` 아님 — `typography.scale` 서브트리(SSOT)에서 유도.** `tokens.css`가 재정의하는 이름(`sm/base/lg/xl/2xl`)은 하드코딩하지 않고 토큰 파일을 읽어 매핑한다 — ECT1의 "값의 정본은 SSOT" 원칙을 그대로 따른다. |
| Tailwind 이름 유틸리티(토큰 스케일 밖) | `text-xs`·`text-3xl`~`text-9xl` | Tailwind v4 공개 기본 스케일을 규칙 모듈 내 고정 조회 테이블로 명시(예: `xs=12px, 3xl=30px, 4xl=36px, 5xl=48px, 6xl=60px, 7xl=72px, 8xl=96px, 9xl=128px`) — 우리 SSOT가 정의하지 않는 이름이라 하드코딩 외 방법이 없다. 이 테이블 자체를 fixture로 고정해 값이 틀리면 테스트가 실패하게 한다. |
| Tailwind 임의값 유틸리티 | `text-[13px]`·`text-[0.9rem]` | px는 그대로 정수화. rem은 `× 16`(루트 기본값, 레포에 커스텀 root font-size 재정의 없음을 `index.css` 확인으로 전제)으로 px 환산 후 반올림. |
| 인라인 style | `style={{ fontSize: 14 }}`·`style={{ fontSize: "0.875rem" }}` | 숫자는 px로 간주, 문자열은 단위 파싱 후 위와 동일 변환. |
| CSS 선언 | `font-size: 14px;` (`.css` 파일) | 값 파싱 후 동일 변환. |

**반응형/상태 변형 접두사(`md:text-lg`, `hover:text-xl`, `dark:text-sm`)는 별도 단계로 세지 않는다.** 접두사를 벗겨내고 기저 유틸리티 이름만으로 정규화한다. 근거: 어떤 뷰포트에서도 한 시점에 활성인 크기는 하나뿐이다 — `md:text-lg`는 "항상 보이는 새 단계"가 아니라 "언제 `lg` 단계가 쓰이는가"를 바꿀 뿐이다. 이걸 별도 단계로 세면 반응형 디자인 자체가 벌점 대상이 되어 검사기가 정직한 반응형 코드를 처벌한다.

### "한 화면"을 무엇으로 경계 짓나

**단위 = 파일.** DOG1 색 검사기가 이미 파일 단위로 스캔한다(`verify.ts` `collectFiles`) — 같은 CLI 안에 두 개의 다른 스캔 경계를 두지 않는다. 또한 정적 분석으로 라우트·번들 그래프 없이 그을 수 있는 가장 굵은 경계이기도 하다.

**단, 이 선택이 실측 위험을 안고 있다는 걸 여기서 미리 적는다.** `home-page.tsx` 하나가 이미 최소 9개 이상의 px 임의값(장식용 미니어처 목업 쇼케이스 카드 안의 텍스트) + 여러 이름 유틸리티를 갖고 있다 — 이건 "화면 하나"가 아니라 "쇼케이스 갤러리 파일 안에 축소 렌더된 여러 개의 모의 화면"이다. **이 파일이 파일-단위 계수의 첫 번째 반례가 될 가능성이 높고, step-3의 실측이 바로 이 반례를 다룬다.** 판정 후보 두 가지를 여기 미리 적어둔다(step-3이 어느 쪽인지 실측으로 정한다):
- (a) 셈법이 틀렸다 → 파일 단위가 아니라 **최상위 export 컴포넌트 단위**로 좁히거나, 장식용 미니어처 블록을 계수에서 제외하는 마커/휴리스틱이 필요하다.
- (b) 임계값이 틀렸다 → 우리 스택 특유의 밀도(쇼케이스 사이트)를 감안해 임계값을 올린다.
- horizon 결정 로그 미결 5번의 "5로" 대안은 (b) 쪽 완화이지, (a)의 근본 원인(파일이 여러 화면을 담는다)은 해결하지 못한다는 점을 step-3 판정에서 함께 기록한다.

## 스캐폴딩 결정
- source-of-truth: 색 검사기와 동일하게 규칙의 정본은 `packages/cli/src/verify.ts`(또는 신설 `packages/cli/src/typography.ts` — step-2에서 확정)의 정규화·조회 테이블 상수다. 토큰 스케일 안의 이름은 `tokens/askewly.tokens.json`을 읽어 유도하고, 스케일 밖 Tailwind 기본값만 하드코딩한다 — 두 출처를 섞지 않는다.
- 검증: 회귀 fixture 코퍼스(`packages/cli/test/fixtures/typography-regression/`)가 "몇 단계인가"의 실측 기준이다. DOG1 선례(코드가 아니라 fixture가 기준)를 그대로 따른다.
- 배포/운영: 해당 없음 — 로컬 CLI, npm 배포는 DOG2. 서버·시크릿 무관.
- 자기선언 도메인 — **정규화 정확성**: rem→px 환산·Tailwind 기본 스케일 조회 테이블이 실제 값과 어긋나면 계수 자체가 무의미해진다. 조회 테이블 값을 fixture로 고정해 오차를 회귀로 잡는다(위 "설계 결정" 표와 동일 데이터를 fixture에 그대로 반영).
- 자기선언 도메인 — **임계값의 잠정성**: 사용자 확정 전까지 기본값 4를 코드에 박되 `--typography-threshold <n>` 옵션으로 즉시 바꿀 수 있게 한다. 즉 "확정 안 됨"이 "구현 못 함"으로 번지지 않게 옵션화한다.
- 검토 후 제외: 인증·결제·시크릿·마이그레이션·관측 — 해당 없음. 디자인(화면 UI) — 이 milestone은 CLI 내부 검사 규칙만 만들고 화면을 고치지 않는다(`askewly-design` 스킬 대상 아님).

## 결정 로그
- status: resolved
- **확정**: 정규화 규칙(px 환원 방식), 반응형 접두사 비계수, 스캔 단위 = 파일(위험 인지 상태로 채택, step-3이 재검토 입력을 만든다).
- **확정(실행 가능한 기본값으로 해소, horizon 미결 5번과 연동)**: 타이포 단계 임계값은 **기본값 4**(Kraft 원문 근거)로 코드에 박되 `--typography-threshold <n>` 옵션으로 즉시 조정 가능하게 한다 — "확정 안 됨"이 구현을 막지 않도록 옵션화로 해소했다. 단 우리 SSOT(`typography.scale`)가 이미 5단계라, 4를 그대로 쓰면 **토큰 정의를 다 쓰는 것만으로도 위반**이 된다는 점을 사용자 최종 확정 시 함께 고지한다. 대안은 5(horizon 문서의 완화 추천) 또는 "이름 유틸리티(SSOT 5단계)는 통과 기준선, 그 밖의 임의값·기본 스케일 이탈만 카운트"처럼 임계값과 셈법을 함께 조정하는 제3안. **step-3의 실측(우리 자산 실행 결과)이 최종 값 확정의 입력이다** — evidence에 `선언 / 실측 / 판정`으로 기록하고, horizon 결정 로그 미결 5번을 그 결과로 갱신한다.

## Step 트리

- [x] **step-1 — 무엇을 '단계'로 셀 것인가**
  - Artifact: font-size 정규화 규칙(Tailwind 이름 유틸리티·임의값·인라인 style·CSS 선언 → 해석된 px 정수 Set)과, 위 "설계 결정" 표의 조회 테이블·반응형 비계수 규칙을 구현한 순수 함수(`resolveTypographySteps(fileContent): Set<number>` 형태). fixture로 규칙을 고정한다.
  - Files: write `packages/cli/src/typography.ts`, `packages/cli/test/typography.test.ts`, `packages/cli/test/fixtures/typography-regression/named-utility.tsx`(토큰 스케일 안 5개 이름), `packages/cli/test/fixtures/typography-regression/out-of-scale.tsx`(`text-xs`·`text-4xl` 등 스케일 밖 이름), `packages/cli/test/fixtures/typography-regression/arbitrary-and-inline.tsx`(임의 px/rem + 인라인 style), `packages/cli/test/fixtures/typography-regression/responsive.tsx`(`md:text-lg` 등 — 기저 이름과 같은 단계로 합쳐지는지), `packages/cli/test/fixtures/typography-regression/mixed.css`(CSS `font-size` 선언).
  - Dependencies: 없음
  - Verify: `named-utility.tsx`(`text-sm`+`text-lg`+`text-xl` 사용)의 계수 결과가 `{14, 20, 28}` — 토큰 SSOT 값과 정확히 일치한다(하드코딩 목록이 아니라 `tokens/askewly.tokens.json`을 실제로 읽었다는 증거로, SSOT에서 `lg` 값을 22px로 바꾸면 결과도 22로 바뀐다). `out-of-scale.tsx`(`text-xs`+`text-4xl`)는 `{12, 36}`. `responsive.tsx`(`text-base`+`md:text-lg`)는 **2단계가 아니라 1개 파일에서 `{16, 20}` 2개 값**이지만 `md:text-lg`와 순수 `text-lg`를 같은 파일에 함께 써도 중복 계수되지 않는다(같은 20px 값은 Set에서 1개). `arbitrary-and-inline.tsx`(`text-[13px]`+`style={{fontSize:"0.875rem"}}`)는 `{13, 14}`.
  - Failure probe: rem→px 환산 계수를 16이 아닌 다른 값으로 바꾸면 `arbitrary-and-inline.tsx`의 기대값 14가 깨진다. 반응형 접두사를 벗기지 않고 별도 이름(`md:text-lg`)으로 취급하도록 되돌리면 `responsive.tsx` 기대 Set 크기가 달라져 테스트가 실패한다. 스케일 밖 조회 테이블 값을 하나 틀리게 고치면 `out-of-scale.tsx` 기대값이 깨진다.
  - Commit: changeset `typography-scale-rule`.

- [ ] **step-2 — CLI 표면**
  - Artifact: `askewly-design verify`가 색 규칙과 나란히 타이포 규칙을 돈다. 파일별 고유 font-size 개수가 임계값(기본 4, `--typography-threshold <n>` 옵션으로 조정)을 넘으면 위반 1건을 보고한다. 보고 형식은 기존 색 위반과 같은 모양(파일:줄·규칙명·발췌) — 규칙명은 `typography-scale-exceeded`, 줄은 임계값을 넘긴 시점(정렬된 고유값 중 (threshold+1)번째 값)이 처음 등장한 줄, 발췌는 파일에서 검출된 전체 고유값 목록(예: `font-size steps: 12, 14, 16, 20, 28, 36 (6 > limit 4)`).
  - Files: write `packages/cli/src/verify.ts`, `packages/cli/src/typography.ts`, `packages/cli/src/index.ts`(`verify` 커맨드에 `--typography-threshold` 옵션 추가), `packages/cli/test/verify.test.ts`, `packages/cli/test/fixtures/typography-regression/three-steps.tsx`(3단계, PASS 기대), `packages/cli/test/fixtures/typography-regression/six-steps.tsx`(6단계, FAIL 기대).
  - Dependencies: step-1
  - Verify: `askewly-design verify <fixture-dir>`를 3단계 fixture에 돌리면 PASS(색 위반 없다는 전제하에 typography 쪽도 통과), 6단계 fixture에 돌리면 FAIL — 종료 코드 1, 출력에 `typography-scale-exceeded` 규칙명과 6개 값 목록이 나온다. `--typography-threshold 8`로 같은 6단계 fixture를 돌리면 PASS로 뒤집힌다(옵션이 실제로 임계값을 바꾼다는 증거). 기존 색 검사 회귀(DOG1 fixture)가 계속 PASS.
  - Failure probe: 옵션을 무시하고 기본값만 쓰도록 배선을 되돌리면 `--typography-threshold 8` 테스트가 여전히 FAIL을 내 실패를 잡는다. 임계값 비교를 `>=`가 아니라 `>`로(또는 반대로) 잘못 두면 3단계·4단계 경계 fixture 중 하나가 기대와 어긋난다 — 이 경계 케이스를 fixture에 반드시 포함한다.
  - Commit: changeset `typography-scale-cli`.

- [ ] **step-3 — 우리 자산에 돌려본다**
  - Artifact: `examples/ui-vocabulary-site`에 새 타이포 검사를 실제로 실행한 결과와, 임계값 4(및 대안 5)가 우리 자산 기준으로 현실적인지 판정한 evidence. "설계 결정" 절에서 미리 지목한 `home-page.tsx` 반례가 (a) 셈법 문제인지 (b) 임계값 문제인지 실측으로 가른다.
  - Files: write `evidence/design-output-gates/dog3-typography.md`, 필요 시 `packages/cli/src/typography.ts`(step-3에서 셈법 결함이 드러나면 이 leaf 안에서 수정 — 새 leaf를 만들지 않고 실측→보정을 한 changeset에 묶는다).
  - Dependencies: step-2
  - Verify: `node packages/cli/dist/index.js verify examples/ui-vocabulary-site/src --ext tsx --typography-threshold 4`의 **실행 출력**(읽어서 낸 판단이 아니라 실행 관측 — horizon 프리모템 6 교훈)을 evidence에 그대로 옮긴다. 위반 파일 수·`home-page.tsx`의 실제 위반 여부와 검출된 값 목록을 기록하고, `선언(임계값 4가 통할 것이다) / 실측(위반 파일 N건, home-page.tsx 값 목록) / 판정(셈법 결함이다 / 임계값이 틀렸다 / 둘 다 아니다)` 한 줄로 닫는다.
  - Failure probe: evidence에 실행 로그(명령어 전문 + 원문 출력)가 없으면 이 step은 무효다 — "읽어보니 괜찮을 것 같다"류 서술은 실사가 아니다. 판정이 (a)를 가리키는데 코드 수정 없이 "임계값만 올리면 된다"로 마무리하면 셈법 결함이 다음 세션까지 남는다 — 반드시 판정과 실제 조치가 일치해야 한다.
  - Commit: changeset `typography-scale-calibration`.

## 검증/DoD
- **DoD**: `askewly-design verify`가 한 화면(파일)에서 쓰인 font-size 고유값 개수를 세고, 임계 초과 시 파일:줄·규칙명·발췌 형식으로 보고한다. 임계값은 사용자 확정 값(추천 4, 미확정 시 기본값 4 유지 + 옵션 조정 가능)을 반영한다.
- **Evidence**: `evidence/design-output-gates/dog3-typography.md` — step-1·2의 fixture 계수 결과와 step-3의 실행 로그 + `선언 / 실측 / 판정`.
- **회귀 게이트**: `npm run verify` + `npm run typecheck` + `packages/cli` 테스트(`cd packages/cli && npm test`) 전부 PASS(horizon 닫는 기준 9).

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-22 작성.
