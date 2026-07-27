# RU1 — 덱을 끝까지 만든다 (관측 장치) · 증거

> milestone RU1 · horizon `real-use-lap` · 닫힘 2026-07-22 (**미달**)
> ⚠ **이 파일은 원본 증거가 아니라 소실 기록이다.** 작성 2026-07-27.

## 이 문서가 소실 기록인 이유

`ROADMAP.md` 는 RU1 의 evidence 로 이 경로를 가리켜 왔지만, **이 파일은 한 번도 커밋된 적이 없다.**

- `git log --all -- evidence/real-use-lap/ru1-deck-production.md` → 이력 0건
- 디스크에도 없음 (macair 체크아웃 2026-07-27 실사)
- `plans/horizons/2026-07-real-use-lap.md` 도 같은 상태였다 (이 changeset 에서 재구성)

RU1 을 등록한 커밋 `2db25ac`(2026-07-23, 하네스 재조립 C4)는 파일 4개 — `CLAUDE.md`·`OBJECTIVE.md`·`README.md`·`ROADMAP.md` — 만 건드렸다. horizon 계획서도 evidence 도 만들지 않은 채 ROADMAP 에 포인터만 썼다.

RU1 이 예약했다고 선언한 changeset 267~286 구간도 **한 건도 쓰이지 않았다** (이 changeset 이 267 을 처음 쓴다). 즉 RU1 의 작업물은 changeset 으로도 남지 않았다.

## 남아 있는 것 — ROADMAP Summary 전문

RU1 에 대해 버전 관리 안에 남은 기록은 `ROADMAP.md` 의 Summary 한 문단이 전부다. 원문 그대로 보존한다:

> **미달로 닫음.** 덱 10장 제작·발표 게이트 첫 실행(프리셋 PASS·대비 7/7 PASS)·결함 10건 기록했으나 사용자 판정 "실제로 못 써 · 내가 원하는 제작 흐름도 아니다 · 문답이 훨씬 많았어야 했다 · Askewly Design 자체가 제대로 작동 안 하는 느낌". **기계가 통과시킨 산출물을 사람이 못 쓴다고 판정** — DOG7과 같은 구조의 재현. 최대 결함 D10: 규모 게이트가 "DESIGN.md 있으면 인터뷰 없음"으로 브리프를 건너뛰어 덱의 내용·청중·구성을 전부 에이전트가 추정했다(DESIGN.md는 룩을 소유하지 내용을 소유하지 않는다). RU2로 이월.

`ROADMAP.md` 의 `Gap` 줄도 함께 보존한다:

> 발표 게이트는 절차에 적혔을 뿐 실행 0회다 — 슬라이드 산출물이 0건이라 먹일 입력이 없었다. `validateSlideDeclaration`도 실사용 0회

(Gap 은 RU1 *개설* 시점에 쓰인 것이라 Summary 의 "발표 게이트 첫 실행"과 어긋난다. 개설 후 실행됐다는 뜻으로 읽는다.)

## 회수 불가 항목

| 항목 | 상태 |
|---|---|
| 덱 10장 산출물 (PPTX) | **소실** — 레포 어디에도 없음 |
| 결함 10건 중 D1~D9 | **소실** — 번호만 알고 내용 미상 |
| 결함 D10 | **보존** (위 Summary 에 전문) |
| 발표 게이트 실행 결과 (프리셋 PASS·대비 7/7 PASS) | 수치만 보존, 원본 출력 소실 |
| 사용자 판정 발화 | **보존** (위 Summary 에 인용) |

D1~D9 는 복원 시도를 하지 않는다 — 추정으로 채우면 소실을 은폐하는 기록이 된다.

## RU2 로 넘어가는 입력

D1~D9 가 없으므로 RU2 는 **RU1 의 결함 목록을 물려받지 않는다.** 대신 현재 확보된 입력으로 다시 세운다:

1. **D10** (보존) — 브리프 인터뷰를 건너뛰어 내용·청중·구성을 에이전트가 추정했다.
2. **사용자 관찰 2축** (2026-07-26 확정) — 타이포(크기 단계·줄간·자간), 레이아웃(여백·정렬·그리드).
3. **실물 산출물** — `examples/getdesign-pptx-pilot/output/askewly-design-intro.pptx` (6장, native text/shapes). RU1 의 덱과 달리 이건 남아 있어 실제로 열어서 잴 수 있다.

## 재발 방지

이 소실의 직접 원인은 "ROADMAP 에 포인터를 쓰면서 대상 파일을 만들지 않았다"이다. 같은 부류의 두 번째 사고이기도 하다 — `archive/*` gitignore 가 완료 plan/horizon 의 add 를 막던 문제를 같은 changeset(267)에서 함께 고쳤다.

- `.gitignore` 에 `!archive/horizons/`·`!archive/plans/` 예외 추가
- `archive/horizons/2026-07-editor-legibility.md` 를 git 히스토리에서 복구
- ROADMAP 의 옛 경로 포인터 3건을 `archive/` 로 갱신

상세 → `changesets/20260727-roadmap-dangling-refs/README.md`
