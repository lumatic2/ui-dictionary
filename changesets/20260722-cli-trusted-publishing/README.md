# Trusted Publishing — 토큰을 없앤다

> 2026-07-22 · DOG2 후속 정비 (milestone 아님 — 단일 응집 변경) · changeset #253

## 왜

DOG2가 `@askewly/design@0.1.0`을 배포했지만 경로가 **granular access token(bypass 2FA)** 이었다. 두 가지가 문제다:

1. **시한이 있다** — npm이 bypass 2FA 토큰을 제한한다: 계정 변경 2026-08, **직접 배포 2027-01**.
2. **매 배포마다 발급·사용·폐기 3단계** — 잊기 쉽고, 잊지 않으면 토큰이 살아 남는다.

Trusted Publishing(OIDC)은 **토큰 자체를 없앤다.** GitHub Actions가 npm에 신원을 증명하고, npm이 그 워크플로만 신뢰한다.

## 규모 판정

단일 응집 변경(워크플로 1개 + npm 설정)이라 **milestone을 만들지 않았다.** §A1 리프 판정: 한 coding pass, 검증 하나, 한 파일셋, 새 사용자 결정 없음 → step-grade. DOG2의 후속 정비로 기록한다.

## 무엇을

`.github/workflows/publish-cli.yml` 신설. 설계 판단 넷:

**① 수동 트리거만 (`workflow_dispatch`)** — 이 패키지는 **검사 규칙**을 담고 있다. 배포가 곧 남의 프로젝트의 판정 기준 변경이다. main push마다 자동으로 나가면 의도하지 않은 규칙이 퍼진다. 사람이 버전을 올리고 명시적으로 실행한다.

**② `id-token: write`** — 이 한 줄이 토큰을 대체한다.

**③ npm 11.5.1+ 명시적 확보** — OIDC는 그 이하에서 동작하지 않는다. `setup-node`가 딸려 보내는 npm이 더 낮을 수 있어 워크플로에서 최신 npm을 전역 설치하는 단계를 넣었다.

**④ 배포 후 전파 확인 + 레포 밖 실증** — DOG2에서 겪은 함정("publish 성공"과 "받을 수 있음"이 3분간 갈렸다)을 CI가 매번 잡는다. 임시 디렉터리에 위반 fixture와 clean fixture를 만들어 `npx`로 돌리고, 위반은 exit 1 / clean은 exit 0이 나오는지까지 검사한다. **배포가 아니라 배포본의 동작을 잰다.**

npm 쪽 연결: `lumatic2` / `ui-dictionary` / `publish-cli.yml` / `npm publish` 허용.

## 계정에서 실제로 일어난 일

Trusted Publisher 설정은 **계정 변경**이라 npm이 2FA를 요구했다 — 배너의 "계정 변경 2026-08" 제한이 이미 걸려 있다. 그래서 이 작업의 부수 효과로 **계정에 2FA(보안 키)가 등록됐다.**

에이전트가 할 수 없는 부분이 둘 있었고 사용자가 직접 했다: ① 비밀번호 확인 ② WebAuthn 등록·확인. 둘 다 OS 수준 인증이라 브라우저 자동화로 뚫리지 않는다 — 뚫리면 2FA가 아니다.

## Contract

- source of truth: `.github/workflows/publish-cli.yml`
- deploy/sync target: npm Trusted Publisher 설정(레포 밖 상태 — npmjs.com 패키지 설정)
- compatibility: 기존 토큰 경로는 그대로 남는다(비상용). 절차 문서가 OIDC를 기본으로 바꾼다.
- out of scope: 다른 패키지(`@askewly/design` 만), GitHub Environment 보호 규칙

## 검증

- [ ] npm Trusted Publisher 연결 완료 (사용자 보안 키 확인 필요)
- [ ] 워크플로가 GitHub에 존재 (push 후)
- [ ] **OIDC 배포 실증** — DOG3의 릴리스(`0.2.0`)로 검증한다. 규칙이 바뀌면 어차피 배포가 필요하므로 버전을 낭비하지 않는다.

> 마지막 항목이 이 changeset의 진짜 게이트다. 연결과 워크플로가 있어도 **한 번도 안 돌려봤으면 도는지 모른다.**
