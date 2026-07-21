# 배포 절차 정본 — 소스가 앞서면 남의 프로젝트는 옛 규칙으로 검사받는다

> 2026-07-22 · milestone DOG2 step-3 · changeset #252

## 왜

이 패키지는 **검사 규칙을 담고 있다.** 규칙이 바뀌어도 배포하지 않으면 남의 프로젝트에서 도는 것은 옛 버전이다.

`docs/design-system/` 문서는 원격 fetch라 즉시 반영되는데 **CLI는 배포해야 반영된다.** 이 비대칭 때문에 재배포가 반복 운영 절차가 된다 — 그리고 현행 경로는 토큰 발급·사용·폐기 3단계라 잊기 쉽다.

## 무엇을

`docs/design-system/cli-release-procedure.md` 신설:

- **버전 정책** — patch=오탐·누락 수정 / minor=새 규칙·커맨드·데이터 / major=인터페이스 변경
- **배포 전 확인** — `npm pack --dry-run` 기준값(13 files·약 237 kB), 누출 금지 목록
- **현행 토큰 경로** — 스코프 한정·7일 만료·**즉시 폐기**, 토큰 값 비기록
- **배포 후 3단 검증** — 전파(HTTP 200) → 버전 → **레포 밖 `npx` 실증**
- **배포본↔소스 대조**
- **⚠ 2027-01 시한** — bypass 2FA 폐지, Trusted Publishing 전환

## 문서에 박은 규율 둘

1. **"publish가 성공을 찍었다"와 "레지스트리에서 받을 수 있다"는 다른 사실이다.** 이번 배포에서 실제로 3분간 갈렸다.
2. **소스 버전이 배포본보다 앞서면 남의 프로젝트는 옛 규칙으로 검사받는다.** DOG6이 배선할 마무리 절차가 조용히 낡은 판정을 내리게 된다.

## Contract

- source of truth: `docs/design-system/cli-release-procedure.md`
- deploy/sync target: 없음(문서). 단 `docs/design-system/` 이므로 DOG4의 llms.txt 등재 대상 후보다 — 이번엔 등재하지 않았다(에이전트가 배포할 일은 없다, 사람용 절차다).
- out of scope: Trusted Publishing 실제 전환 — 시한과 방향만 기록

## 검증

- [x] 문서의 "배포본↔소스 대조" 절차를 실제 실행 — registry `0.1.0` = source `0.1.0`, 일치
- [x] 문서의 pack 기준값이 실측(13 files·237.0 kB)과 일치
- [x] 인용 2건에 출처 URL + 접근일 부착(Unpublish Policy, bypass 2FA deprecation)
- [x] 루트 `npm run verify` exit 0
- [x] 루트 `npm run check:lines` 통과(300자 초과 없음)
