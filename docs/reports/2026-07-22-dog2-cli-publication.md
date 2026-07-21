# 최종 보고서 — DOG2 남의 프로젝트에서 돈다

> 2026-07-22 · horizon `design-output-gates` · milestone DOG2 · changesets 250·251·252

## 1. 문제 정의

`askewly-design` 스킬은 **남의 프로젝트에서 실행된다.** 그런데 색 검사기는 `ui-dictionary` 레포 안에 있었다. 그 프로젝트에서는 손이 닿지 않는다.

`npm view @askewly/design` → **E404.** 패키지는 `bin`·`files`·`prepack`까지 갖췄는데 레지스트리에 없었다. 사용자가 고른 실행 경로(`npx`)가 실재하지 않는 상태였고, 그대로 두면 DOG6이 마무리 절차에 `verify` 호출을 배선해도 **배선 대상이 없다.**

## 2. Objective 연결

Objective의 성공 상태 중 하나는 "Codex와 Claude Code가 시스템의 토큰·패턴 규칙을 읽고 의도적으로 디자인된 UI를 만든다"이다. 판단을 주입하는 문서는 `llms.txt`로 이미 어느 프로젝트에서든 fetch된다. **검사기만 그 대칭성이 없었다** — 문서는 원격인데 자는 로컬이었다.

## 3. 경로

3 step, 각 1 changeset: 준비·dry-run → 실제 배포 → 재배포 절차.

step-2는 설계된 **사용자 승인 정지점**이었다. 공개 배포는 되돌릴 수 없고(`name@version` 영구 재사용 불가), 사용자가 `npm login` 실행으로 진행을 선택했다.

## 4. 구현 결과

**메타데이터** — `license: UNLICENSED → MIT`(이 값이 실질적 차단 요인이었다: 그대로 올리면 코드는 받아지되 법적으로 아무도 못 쓴다), `repository`·`homepage`·`keywords` 보강, `LICENSE`·`README.md` 동봉, `publishConfig.access: public`.

**배포** — `@askewly/design@0.1.0`, 13 files · 237 kB. `dist/`·`data/` 포함, `src/`·`test/`·`node_modules/` 누출 0.

**절차 정본** — `docs/design-system/cli-release-procedure.md`. semver 정책, pack 기준값, 토큰 3단계, 배포 후 3단 검증, 배포본↔소스 대조, 2027-01 시한.

## 5. 이슈와 해결

### 계획에 없던 2FA 벽

계획은 "로그인하면 publish 가능"을 전제했다. `npm publish` → **E403**: 2FA 또는 bypass 토큰 필요.

브라우저로 계정을 실사하니 **npm 2FA는 이제 보안 키(WebAuthn)만 제공**한다 — 인증 앱(TOTP) 옵션이 없다. WebAuthn 등록은 지문·PIN 같은 OS 수준 인증을 요구하므로 **에이전트가 완료할 수 없다.** 자동화를 막는 것이 그 방식의 존재 이유다.

남은 문은 granular access token(bypass 2FA) 하나였고, npm UI 자신이 "보안 위험이 있다, CI/CD면 Trusted Publishing을 쓰라"고 경고한다. 노출을 최소화해 처리했다: `@askewly` 스코프 한정(All packages 아님) · 조직 접근 없음 · 7일 만료 · **사용 후 즉시 폐기**(목록 0건 확인). 토큰 값은 어떤 파일에도, `~/.npmrc`에도 기록하지 않았다.

### 전파 지연 — 세 표면이 갈렸다

`publish`가 `+ @askewly/design@0.1.0`을 찍은 뒤:

| 표면 | 응답 |
|---|---|
| 웹 UI 패키지 목록 | "published 0.1.0 · a minute ago" |
| `npm access get status` | public |
| `registry.npmjs.org/...` | **404** |

Staged Packages는 비어 있어 보류가 아니었다. 45초 간격 폴링으로 약 3분 뒤 200.

> **"publish가 성공을 찍었다"와 "레지스트리에서 받을 수 있다"는 다른 사실이다.** 전자만 보고 닫았으면 DOG6이 배선할 대상이 아직 없는 상태로 넘어갔다. 이 규율을 절차 문서에 박았다.

### step-1이 바로잡은 것 둘

- **압축 해제는 설치가 아니다.** tarball을 풀어 직접 실행했더니 `ERR_MODULE_NOT_FOUND: commander` — 의존성 해석이 없다. `npx`가 하는 일은 설치를 포함하므로 로컬 tarball 설치로 다시 쟀다.
- **원격 조직명을 추정해 적었다.** `askewly/ui-dictionary`로 썼는데 실제는 `lumatic2/ui-dictionary`. `git remote -v`로 확인해 고쳤다.

## 6. 결과물과 증거

**크기 회고**: changeset **3개**(250·251·252)로 닫혔다. 선언(`changesets>=3`)과 일치 — 인플레·디플레 없음.

| 항목 | 이전 | 최종 |
|---|---|---|
| `npm view @askewly/design` | E404 | `0.1.0` |
| license | `UNLICENSED` | `MIT` |
| 레포 밖 실행 | 불가 | 동작 |
| 재배포 절차 | 없음 | 정본 문서 |

- 실표면: npm 공개 레지스트리가 실표면이다. **이 레포 밖 임시 디렉터리**에서 `npx --yes @askewly/design@0.1.0 verify probe --ext tsx` → exit 1, 위반 2건(`:4 hex-literal` + `:4 raw-color-fn`); clean 디렉터리 → exit 0 PASS; `terms search accordion` → 정상(데이터 번들 동작). **DOG1의 수정이 공개 배포본에 실려 있음을 확인** — 한 줄 두 규칙이 둘 다 보고된다.
- 재현: `npm view @askewly/design version` → `0.1.0`; `curl -s -o /dev/null -w "%{http_code}" https://registry.npmjs.org/@askewly%2fdesign` → 200; 레포 밖 `npx` 3종은 위 커맨드 그대로.

증거: `evidence/design-output-gates/dog2-publication.md` (step-1·2·3 + 종합)

## 7. 후속 제안

- **⚠ 2027-01 전에 Trusted Publishing으로 전환해야 한다.** bypass 2FA 토큰은 그때 직접 배포에서 막힌다(계정 변경은 2026-08). 레포가 이미 GitHub에 있어 Actions OIDC 경로가 열려 있고, npm 공식 권고 방향이다. 전환하면 토큰 발급·폐기 절차 자체가 사라진다.
- **데이터 누락 시 raw stack trace 노출** — `ENOENT`가 잡히지 않아 Node 내부 스택이 사용자에게 나온다. "설치가 깨졌다" 한 줄이 맞다.
- **DOG6의 전제가 갖춰졌다** — 이제 마무리 절차가 `npx @askewly/design verify`를 부를 수 있다. 다만 규칙을 고칠 때마다 재배포가 필요하다는 점이 새 운영 부담으로 들어왔다.
