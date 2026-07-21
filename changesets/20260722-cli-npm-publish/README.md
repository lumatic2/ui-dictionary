# 실제 배포 — 2FA 벽과 전파 지연

> 2026-07-22 · milestone DOG2 step-2 · changeset #251

## 왜

DOG6이 스킬 마무리 절차에 `npx @askewly/design verify` 를 배선하려면 **그 패키지가 레지스트리에 실재해야** 한다. 배선 대상이 없는 배선은 배선이 아니다.

## 무엇을

`packages/cli/package.json` 에 `publishConfig.access: "public"` 추가 — 공개 의도를 코드에 남긴다(커맨드 플래그에만 의존하지 않는다).

`@askewly/design@0.1.0` 공개 레지스트리 배포.

## 계획에 없던 장벽 — 2FA

`npm publish --access public` → **E403**: *"Two-factor authentication or granular access token with bypass 2fa enabled is required."*

계획은 "로그인하면 publish 가능"을 전제했다. 틀렸다. 실패 시점에 아무것도 올라가지 않았음을 확인했다(버전 `0.1.0` 미소모).

브라우저 실사 결과:

- npm 2FA 설정은 **보안 키(WebAuthn)만** 제공한다 — 인증 앱(TOTP) 옵션이 없다.
- WebAuthn 등록은 **자동화 불가**다. 지문·PIN 같은 OS 수준 인증을 요구하고 그건 페이지 DOM 밖이다. 자동화를 막는 것이 이 방식의 존재 이유다.
- 남은 문은 granular access token(bypass 2FA) 하나. **시한이 있다 — 직접 배포 2027-01 폐지.**

## 토큰 취급

npm UI 자신이 경고한다: *"There are security risks with this option. For automation or CI/CD uses, please use Trusted Publishing instead."* 그래서 노출을 최소화했다:

| 설정 | 값 |
|---|---|
| 권한 | Read/write, **`@askewly` 스코프 한정**(All packages 아님) |
| 조직 접근 | 없음 |
| 만료 | 7일 |
| 사용 후 | **즉시 폐기** (토큰 목록 0건 확인) |

토큰 값은 어떤 파일에도 기록하지 않았고 `~/.npmrc` 에도 저장하지 않았다.

## 전파 지연 — 세 표면이 갈렸다

publish 가 `+ @askewly/design@0.1.0` 을 찍은 뒤:

| 표면 | 응답 |
|---|---|
| 웹 UI 패키지 목록 | "published 0.1.0 · a minute ago" |
| `npm access get status` | public (API 가 패키지를 안다) |
| `registry.npmjs.org/...` | **404** |

45초 간격 폴링 → **약 3분 뒤 200**. 신규 패키지 CDN 전파 지연이었다.

> **"publish 가 성공을 찍었다"와 "레지스트리에서 받을 수 있다"는 다른 사실이다.** 전자만 보고 닫았으면 DOG6 이 배선할 대상이 아직 없는 상태로 넘어갔다. 이 horizon 의 실사 규율이 여기서도 값을 했다.

## Contract

- source of truth: `packages/cli/package.json`
- deploy/sync target: **npm 공개 레지스트리** — `@askewly/design@0.1.0`
- compatibility: 런타임 코드 무변경. step-1 의 tarball 내용과 동일(shasum `4e9446f9...` 일치).
- out of scope: Trusted Publishing 전환(step-3에 시한 기록), 버전 정책 문서화(step-3)

## 검증

- [x] `npm publish --access public` → `+ @askewly/design@0.1.0`
- [x] 토큰 폐기 확인 — 토큰 목록 0건
- [x] `npm view @askewly/design version` → `0.1.0`
- [x] `npm access get status` → public
- [x] **레포 밖 `npx @askewly/design@0.1.0 verify`** — 위반 dir exit 1(2건), clean dir exit 0
- [x] 레포 밖 `npx ... terms search accordion` 정상 (데이터 번들 동작)
- [x] DOG1 수정이 공개 배포본에 실려 있음 확인(한 줄 두 규칙 둘 다 보고)

## finding 큐

- **2027-01 전 Trusted Publishing 전환 필요.** bypass 2FA 토큰은 그때 직접 배포에서 막힌다. 레포가 이미 GitHub 에 있으므로 Actions OIDC 경로가 열려 있다.
- **재배포마다 발급·사용·폐기 3단계 반복.** 이것 자체가 전환 이유다.
