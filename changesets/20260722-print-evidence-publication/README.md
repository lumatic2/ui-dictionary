# 등재와 배포본 검증 — 로컬에 있다고 배포된 게 아니다

> 2026-07-22 · milestone DOG4 step-3 · changeset #260

## 왜

step-1·2가 문서 둘을 만들었다. 하지만 에이전트는 레포를 clone하지 않는다 — `https://ui.askewly.com/llms.txt`를 fetch한다. **인덱스에 없으면 없는 것이다.**

이것이 VL2가 발견한 갭의 정확한 형태다: 용어 562개가 사전 파일에는 있었지만 llms.txt 밖에 있어 에이전트에게는 존재하지 않았다.

## 무엇을

`scripts/generate-llms-txt.mjs`의 `FIXED_ASSETS`에 **`Media` 섹션**을 신설한다 — `medium-taxonomy.md`, `print-spec.md` 순서로.

순서가 이 순서인 이유: 분류가 먼저다. **어느 자를 대야 하는지 모르면 인쇄 규격을 읽어도 화면 체크리스트를 그대로 돌린다.** 그래서 taxonomy의 설명에 "Read this BEFORE assuming the screen checklist is the whole job — a print piece that passes it can still be broken paper"를 박았다.

`public/llms/`는 생성기가 매 실행마다 통째로 지우고 다시 만들므로 손으로 파일을 두면 조용히 사라진다. 등재는 `FIXED_ASSETS` 한 곳에서만 한다.

## 검증 — 로컬이 아니라 배포본에서

로컬 파일 존재는 검증으로 치지 않는다(VL8 규율). 실제 배포 URL을 친다:

```bash
curl -sf https://ui.askewly.com/llms.txt | grep -q "print-spec.md"
curl -sf https://ui.askewly.com/llms.txt | grep -q "medium-taxonomy.md"
curl -sI https://ui.askewly.com/llms/docs/design-system/print-spec.md
curl -sI https://ui.askewly.com/llms/docs/design-system/medium-taxonomy.md
```

응답 원문은 `evidence/design-output-gates/dog4-print-publication.md`.

## Failure probe

| 조작 | 잡히는 실패 |
|---|---|
| 등재하고 push는 건너뜀 | 배포본 fetch가 404 — **"등재했다"와 "배포됐다"는 다른 사건** |
| 등재 없이 push만 | `llms.txt` grep 실패 — **"파일은 있지만 인덱스에 없다"**(VL2류) |

두 방향 모두 로컬 검사로는 안 잡힌다. 그래서 이 step의 Verify는 배포본 fetch다.

## Contract

- source of truth: `scripts/generate-llms-txt.mjs`의 `FIXED_ASSETS` — `llms.txt`와 `public/llms/`는 생성물, 손으로 고치지 않는다
- deploy/sync target: Cloudflare Pages(`ui.askewly.com`) — `main` push에 자동 반응
- out of scope: 슬라이드 등재(DOG5), 마무리 절차 배선(DOG6)

## 검증

- [x] `node scripts/generate-llms-txt.mjs` 무결성 검사 exit 0 (159 assets)
- [x] `llms.txt`에 `## Media` 섹션과 두 링크 등장
- [x] 사본 2개가 `public/llms/docs/design-system/`에 생성 (실제 diff 4파일 — 나머지는 줄끝 churn, 내용 변화 0)
- [x] 배포본 fetch — 아래 evidence 파일
