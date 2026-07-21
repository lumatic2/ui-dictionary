# CI 검증 결함 — 패키지가 아니라 버전을 물어야 했다

> 2026-07-22 · DOG3 릴리스 후속 · changeset #257

## 왜

`0.2.0` 릴리스에서 **배포는 성공했는데 검증 단계가 실패**했다. 패키지가 아니라 워크플로가 틀렸다.

## 무엇이 틀렸나

**① 패키지 존재만 확인하고 버전은 안 봤다.**

```
try 1: HTTP 200      ← 0.1.0 때문에 즉시 통과
npm error ETARGET No matching version found for @askewly/design@0.2.0
```

DOG2에서 "publish 성공"과 "받을 수 있음"이 다르다는 걸 배워 이 단계를 넣었는데, **한 칸 얕게** 적용했다. 물어야 할 것은 "패키지가 있나"가 아니라 "이 **버전**을 받을 수 있나"였다.

**② exit code 오독.**

`npx` 실패와 "린터가 위반을 찾음"이 둘 다 exit 1이다. `&&`/`||`로 갈랐더니:

- `bad` 검사 → `위반 검출 OK (exit 1)` — **거짓 안심** (실제로는 ETARGET)
- `clean` 검사 → `깨끗한 코드에 위반이 잡혔다(오탐)` — **거짓 경보** (실제로는 ETARGET)

**한 원인이 두 개의 서로 반대되는 거짓 진단을 냈다.**

## 수정

- 전파 확인을 `npm view @askewly/design@$VERSION` — 버전 단위 조회
- **설치와 검사 분리** — `npm install`이 먼저 실패하면 거기서 멈춘다. 그 뒤 exit code는 오직 린터에서만 온다
- exit code를 변수로 받아 `기대 1 / 기대 0` 명시 비교

## 검증

- [x] 수정 로직을 **로컬에서 배포본 0.2.0 대상으로** 실행 — 버전 조회 성공, `bad` exit 1, `clean` exit 0
- [x] 배포본의 타이포 규칙 동작 확인(레포 밖): 6단계 FAIL·5단계 PASS·`--typography-threshold 8` PASS
- [x] 수정된 CI 경로 자체는 다음 릴리스에서 실행 — 버전을 낭비해 CI를 시험하지 않는다

## 부수 기록 — OIDC 실증

같은 run 의 `배포` 단계는 **성공**했고 provenance attestation(`slsa.dev/provenance/v1`)이 붙었다. 토큰 배포에는 provenance 가 안 붙는다 — **Trusted Publishing 이 실제로 동작했다는 결정적 증거**다.
