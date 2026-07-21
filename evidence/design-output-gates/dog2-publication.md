# DOG2 — 배포 evidence

> horizon `design-output-gates` · milestone DOG2
> 기록(record). step 진행에 따라 섹션을 추가하고 앞 관측은 고치지 않는다.

## step-1 — 배포 준비와 dry-run (2026-07-22)

### 패키지 메타데이터

| 필드 | 전 | 후 |
|---|---|---|
| `license` | `UNLICENSED` | **`MIT`** (승인 결정 7 — 레포 루트 LICENSE와 일치) |
| `repository` | 없음 | `git+https://github.com/lumatic2/ui-dictionary.git`, `directory: packages/cli` |
| `homepage` | 없음 | `https://ui.askewly.com` |
| `keywords` | 없음 | design-system · design-tokens · linter · ui · coding-agent |
| `files` | `["dist","data"]` | `["dist","data","README.md","LICENSE"]` |

신규 파일: `packages/cli/LICENSE`(루트 복사), `packages/cli/README.md`(npm 페이지 본문).

> ⚠ 실사 정정 — 원격은 `askewly/ui-dictionary`가 아니라 **`lumatic2/ui-dictionary`** 다. 처음 조직명을 추정해 적었다가 `git remote -v`로 확인해 고쳤다. 추정으로 URL을 적지 않는다.

### `npm pack` 관측

```
📦 @askewly/design@0.1.0 — total files: 13 · package size: 237.0 kB · unpacked: 852.9 kB
  LICENSE · README.md
  data/{askewly.css, DESIGN.md, recipes.json, terms.json, tokens.css, tokens.json}
  dist/{index.js, inject.js, load.js, verify.js}
  package.json
```

**포함 확인**: `dist/`·`data/` 둘 다 들어감.
**누출 확인**: `src/`·`test/`·`node_modules/`·`tsconfig.json`·`scripts/` **없음**.

### 레포 밖 실행

⚠ **첫 시도가 틀린 방법이었다.** tarball을 `tar -xzf`로 풀어 `node package/dist/index.js`를 직접 실행했더니 `ERR_MODULE_NOT_FOUND: commander`. **압축 해제는 설치가 아니다** — 의존성 해석이 없다. `npx`가 실제로 하는 일은 설치를 포함하므로, 로컬 tarball을 clean 프로젝트에 설치하는 방식으로 다시 쟀다.

```bash
mkdir /tmp/installtest && cd /tmp/installtest && npm init -y
npm install <repo>/packages/cli/askewly-design-0.1.0.tgz   # added 2 packages
npx askewly-design verify probe --ext tsx
```

| 커맨드 | 결과 |
|---|---|
| `verify probe --ext tsx` (oneline fixture) | **위반 2건** — `:4 hex-literal` + `:4 raw-color-fn`, exit 1 |
| `terms search accordion` | 정상 — `accordion — Accordion (아코디언)` 외 |
| `tokens` | 정상 — 토큰 JSON 출력 |
| `recipes list` | 정상 — 45개 목록 |

**DOG1의 수정이 패키지 빌드에 실려 있다** — 같은 줄의 두 규칙이 둘 다 보고된다(step-3 이전이면 1건이었다).

### Failure probe

`files`에서 `data`를 빼고 재pack·재설치:

```
Error: ENOENT: no such file or directory,
  open '…/node_modules/@askewly/design/data/terms.json'
```

번들 누락이 실제로 실행을 깨뜨림을 확인. 원복 후 재확인 정상(13 files · 237.0 kB).

> **plan의 probe 서술 정정**: plan은 "`verify`가 `data/terms.json`을 못 찾아 실패한다"고 적었으나 **`verify`는 데이터를 읽지 않는다** — 깨지는 것은 `terms`·`tokens`·`recipes` 쪽이다. probe의 목적(번들 누락이 실행을 깨뜨림)은 그대로 달성됐고, 대상 커맨드만 다르다.

### finding 큐

- **데이터 누락 시 raw stack trace가 그대로 나온다.** `ENOENT`가 잡히지 않아 사용자에게 Node 내부 스택이 노출된다. 배포본에서 이런 실패는 "설치가 깨졌다"는 한 줄 안내가 맞다. DOG2 step-3(재배포 절차)이나 별도 유지보수 항목 후보.

### step-2 진입 조건

- 결정 7(license=MIT)·8(scope=public) **확정됨**
- 그러나 **publish 실행 자체가 승인 정지점**이다 — `name@version`은 unpublish 후에도 영구 재사용 불가([npm Unpublish Policy](https://docs.npmjs.com/policies/unpublish), 접근 2026-07-22).

---

## step-2 — 실제 배포 (2026-07-22)

### 승인

사용자가 `npm login` 실행으로 배포 진행을 선택. 계정 `askewly`, 스코프 `@askewly`는 **user scope**(조직 아님 — 사이드바 Organizations: None).

### 계획에 없던 장벽 — 2FA

`npm publish --access public` → **E403**:

> Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.

계획은 "로그인하면 publish 가능"을 전제했으나 **npm이 직접 배포에 2FA를 요구**한다. 실패 시점에 아무것도 올라가지 않았음을 확인(`npm view` → E404, 버전 `0.1.0` 미소모).

브라우저로 계정 상태 실사:

| 확인 | 결과 |
|---|---|
| 2FA 설정 화면(`/settings/askewly/tfa`) | **보안 키(WebAuthn)만 제공** — 인증 앱(TOTP) 옵션 없음 |
| WebAuthn 자동화 가능성 | **불가** — 지문·PIN 등 OS 수준 인증이 필요하고 페이지 DOM 밖이다. 자동화를 막는 것이 이 방식의 목적 |
| 토큰 페이지 배너 | bypass 2FA 토큰 제한 시한 명시 — **계정 변경 2026-08 · 직접 배포 2027-01** |

### 경로 선택

열려 있는 문은 **granular access token(bypass 2FA)** 하나였다. npm UI 자신이 경고한다: *"There are security risks with this option. For automation or CI/CD uses, please use Trusted Publishing instead."*

노출을 최소화해 발급:

| 설정 | 값 |
|---|---|
| 이름 | `askewly-design-publish-2026-07` |
| 권한 | Read and write, **`@askewly` 스코프 한정** (All packages 아님) |
| 조직 접근 | 없음 |
| 만료 | 7일 (2026-07-29) |
| 사용 후 | **즉시 폐기** — 토큰 목록 0건 확인 |

토큰 값은 어떤 파일에도 기록하지 않았고 `~/.npmrc`에도 저장하지 않았다(1회 커맨드 인자로만 사용).

### publish 결과

```
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
+ @askewly/design@0.1.0
```

### 전파 지연 — 웹은 배포, API는 404

publish 직후 갈렸다:

| 표면 | 응답 |
|---|---|
| 웹 UI `/settings/askewly/packages` | **"@askewly/design · published 0.1.0 · a minute ago"** |
| `npm access get status` | **public** (API가 패키지를 안다) |
| `registry.npmjs.org/@askewly%2fdesign` | **404** |
| Staged Packages | 비어 있음 (보류 아님) |

45초 간격 폴링으로 **약 3분 뒤 HTTP 200**. 신규 패키지의 CDN 전파 지연이었다.

> 관측 규율: "publish가 성공을 찍었다"와 "레지스트리에서 받을 수 있다"는 **다른 사실**이다. 전자만 보고 닫았으면 DOG6이 배선할 대상이 아직 없는 상태로 넘어갔다.

### DoD 검증 — 레포 밖 `npx` 실증

```bash
cd <레포 밖 임시 디렉터리>
npx --yes @askewly/design@0.1.0 verify probe  --ext tsx   # exit 1, 위반 2건
npx --yes @askewly/design@0.1.0 verify probe2 --ext tsx   # exit 0, PASS
npx --yes @askewly/design@0.1.0 terms search accordion    # 정상
```

`npm view @askewly/design version` → `0.1.0`.

**DOG1의 수정이 공개 배포본에 실려 있다** — 같은 줄의 두 규칙이 둘 다 보고된다.

### finding 큐

- **2027-01 전에 Trusted Publishing으로 옮겨야 한다.** bypass 2FA 토큰은 그때 직접 배포에서 막힌다. GitHub Actions OIDC 경로(레포가 이미 GitHub에 있다)가 npm 공식 권고다. DOG2 step-3(재배포 절차)에 시한과 함께 적는다.
- **재배포마다 이 토큰 절차를 반복해야 한다** — 발급·사용·폐기 3단계. 이것 자체가 Trusted Publishing으로 옮길 이유다.

---

## step-3 — 버전·재배포 절차 (2026-07-22)

`docs/design-system/cli-release-procedure.md` 신설. 담은 것:

- **버전 정책** — patch=오탐·누락 수정 / minor=새 규칙·새 커맨드·데이터 갱신 / major=CLI 인터페이스 변경
- **배포 전 확인** — `npm pack --dry-run` 기준값(13 files·약 237 kB)과 누출 금지 목록
- **현행 토큰 경로** — 발급(스코프 한정·7일)·사용·**즉시 폐기** 3단계, 토큰 값 비기록 원칙
- **배포 후 검증** — 전파 확인 → 버전 확인 → **레포 밖 `npx` 실증**. "publish 성공"과 "받을 수 있음"을 갈라서 본다(이번 배포에서 실제로 3분간 갈렸다)
- **배포본↔소스 어긋남 확인** — 소스가 앞서면 남의 프로젝트는 옛 규칙으로 검사받는다
- **⚠ 2027-01 시한** — bypass 2FA 토큰 폐지, Trusted Publishing(GitHub Actions OIDC) 전환 필요

### 절차 자체 검증

문서의 "배포본↔소스 어긋남 확인" 절차를 실제로 돌렸다:

| 표면 | 값 |
|---|---|
| `npm view @askewly/design version` | `0.1.0` |
| `packages/cli/package.json` | `0.1.0` |

일치 — 미배포 변경 없음.

## DOG2 종합 (2026-07-22)

| 항목 | step-1 이전 | 최종 |
|---|---|---|
| `npm view @askewly/design` | **E404** | `0.1.0` |
| license | `UNLICENSED` (공개 불가) | `MIT` |
| 레포 밖 실행 | 불가 | `npx @askewly/design verify` 동작 |
| 재배포 절차 | 없음 | `docs/design-system/cli-release-procedure.md` |

DoD 충족: `npx @askewly/design@0.1.0 verify <dir>` 가 이 레포 밖에서 동작한다.
