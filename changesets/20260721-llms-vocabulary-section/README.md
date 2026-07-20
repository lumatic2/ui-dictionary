# changeset: VL2 step-3 — llms.txt 용어 등재

- Date: 2026-07-21
- Plan: VL2 step-3 (`plans/2026-07-21-vl2-vocabulary-publication.md`)

## 무엇을 했나

`llms.txt`에 `## Vocabulary (562 UI terms)` 섹션을 신설했다. 조회 규약 + 인덱스 + 샤드 58개.
섹션 서두에 **"통째로 가져가지 마라, 원본 404는 정상"**을 못 박았다.

## 잡은 결함 3건 — 전부 커밋 전에 실행해봐서 나왔다

**① 재생성이 샤드를 통째로 지웠다 (near-miss, 가장 심각).**
`generate-llms-txt.mjs`는 `main()` 첫 줄에서 `public/llms`를 `rmSync`한다. 샤드를 따로 만들어
두면 다음 재생성 때 **조용히 사라진다.** 실증: 재생성 1회로 배포 용어 562→0, 끊긴 참조 0→91.
아무도 모르게 VL2를 통째로 취소시켰을 결함이다. 샤드 생성을 llms 파이프라인 안에서 호출하도록
묶어 두 산출물의 수명을 하나로 만들었다.

**② 이 체크아웃에서 생성기가 아예 못 돌았다.** 레시피 frontmatter 정규식이 `^---\n`이라
CRLF 체크아웃(Windows autocrlf)에서 매칭 실패 → `recipe has no frontmatter` 예외.
게다가 예외가 `rmSync` **뒤에** 터져서 실행할 때마다 배포 산출물이 파괴됐다.

**③ 고치고 나니 레시피 설명이 전부 `undefined`가 됐다.** frontmatter는 읽혔는데 필드가 전부
null이었다 — **JS 정규식에서 `\r`은 줄 종결자라 `.`가 먹지 못한다.** `split("\n")`이 남긴 `\r`
때문에 `/^(id|name|...):\s*(.+)$/`가 매번 실패한 것. `split(/\r?\n/)`로 고쳤다.

②③은 이 horizon과 무관한 기존 결함이지만, 고치지 않으면 등재 자체가 불가능해 최소 범위로 손댔다.

## 검증

- 재생성 후 배포 용어 562 · 끊긴 term_refs 0 · 자산 147개 · 무결성 검사 통과
- 레시피 설명 정상 복구(`Canvas Particle Field — application-ui recipe (status: draft)`)
- **probe A(멱등성)**: 연속 2회 재생성 후에도 샤드 58개 유지 — ①의 회귀 방지 확인
- **probe B(죽은 경로)**: 존재하지 않는 경로를 고의 등재 → `index links without backing files` exit 1

## 판정

complete.
