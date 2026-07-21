# @askewly/design 배포 절차

> 정본. `packages/cli` 를 npm 공개 레지스트리에 내보내는 방법과 제약.
> 최초 작성 2026-07-22 (DOG2 step-3). 최초 배포: `0.1.0`, 2026-07-22.

## 왜 재배포가 자주 필요한가

이 패키지는 **검사 규칙을 담고 있다.** 규칙이 바뀌면(오탐 수정·새 규칙 추가) 남의 프로젝트에서 도는 것은 여전히 옛 버전이다. `docs/design-system/` 의 문서는 원격 fetch라 즉시 반영되지만 **CLI는 배포해야 반영된다.** 이 비대칭이 이 문서가 존재하는 이유다.

## 버전 정책 (semver)

| 변경 | 올림 | 예 |
|---|---|---|
| **patch** | 오탐 수정, 누락 수정, 메시지 개선 | DOG1의 SVG·주석 예외 → `0.1.1` |
| **minor** | 새 검사 규칙, 새 서브커맨드, 데이터 갱신(용어·레시피 추가) | DOG3 타이포 검사기 → `0.2.0` |
| **major** | CLI 인터페이스 변경(플래그·출력 형식·exit code 의미) | `verify` 기본 동작 변경 |

**되돌릴 수 없다.** `name@version` 조합은 unpublish 후에도 영구 재사용 불가다. 잘못 올렸으면 되돌리기가 아니라 **다음 패치로 정정**한다. 출처: [npm Unpublish Policy](https://docs.npmjs.com/policies/unpublish) (접근 2026-07-22).

## 배포 전 확인

```bash
cd packages/cli
npm run build           # build:data(용어·레시피 번들) → tsc
npx vitest run          # 전부 PASS
npx tsc --noEmit        # exit 0
npm pack --dry-run      # 담기는 파일 확인
```

`npm pack --dry-run` 에서 확인할 것:
- `dist/`·`data/`·`LICENSE`·`README.md` **포함**
- `src/`·`test/`·`node_modules/`·`scripts/`·`tsconfig.json` **없음**
- 기준값: 13 files · 약 237 kB (크게 벗어나면 `files` 배열을 의심한다)

## 배포 (현행 — 토큰 경로)

⚠ **npm이 직접 배포에 2FA를 요구한다.** 이 계정의 2FA는 보안 키(WebAuthn)만 제공하고, 그건 OS 수준 인증이라 스크립트·에이전트가 완료할 수 없다. 따라서 현행 경로는 granular access token이다.

1. npmjs.com → Access Tokens → Generate New Token
2. 설정: **Read and write** · **`@askewly` 스코프 한정**(All packages 금지) · **Bypass 2FA 체크** · 조직 접근 없음 · 만료 최단(7일)
3. 배포:
   ```bash
   cd packages/cli
   npm publish --access public --//registry.npmjs.org/:_authToken=<TOKEN>
   ```
4. **즉시 토큰 폐기** — 토큰 목록에서 삭제하고 0건을 확인한다.

토큰 값은 파일·커밋·로그 어디에도 남기지 않는다. `~/.npmrc` 에도 저장하지 않는다.

## 배포 후 검증 — 두 사실을 갈라서 본다

**"publish가 성공을 찍었다"와 "레지스트리에서 받을 수 있다"는 다른 사실이다.** 2026-07-22 최초 배포에서 실제로 갈렸다 — 웹 UI는 "published"인데 레지스트리는 404였고, 약 3분 뒤 200이 됐다.

```bash
# 1. 전파 확인 (신규 패키지는 수 분 걸린다)
curl -s -o /dev/null -w "%{http_code}\n" https://registry.npmjs.org/@askewly%2fdesign

# 2. 버전 확인
npm view @askewly/design version

# 3. 레포 밖에서 실증 — 이것이 진짜 게이트다
cd <임시 디렉터리, 이 레포 밖>
npx --yes @askewly/design@<ver> verify <위반 있는 dir>   # exit 1
npx --yes @askewly/design@<ver> verify <clean dir>       # exit 0
```

3번을 건너뛰지 않는다. 레포 안에서 도는 것은 배포 검증이 아니다.

## 배포본↔소스 어긋남 확인

```bash
npm view @askewly/design version          # 레지스트리
node -p "require('./packages/cli/package.json').version"   # 소스
```

소스가 앞서 있으면 미배포 변경이 있다는 뜻이다. 검사 규칙을 고쳤는데 배포를 안 했으면 **남의 프로젝트는 여전히 옛 규칙으로 검사받는다** — DOG6이 배선한 마무리 절차가 조용히 낡은 판정을 내린다.

## ⚠ 시한 — 2027년 1월

npm이 bypass 2FA 토큰을 제한한다: **계정 변경 2026년 8월 · 직접 배포 2027년 1월.** 그 이후 위 토큰 경로는 막힌다.

전환 대상은 **Trusted Publishing**(GitHub Actions OIDC)이다 — 토큰 자체가 없어지므로 발급·폐기 절차도 사라진다. 이 레포는 이미 GitHub에 있어(`lumatic2/ui-dictionary`) 경로가 열려 있다. npm UI가 토큰 발급 화면에서 직접 권고하는 방향이기도 하다.

출처: [npm bypass 2FA token deprecation](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/) (접근 2026-07-22).
