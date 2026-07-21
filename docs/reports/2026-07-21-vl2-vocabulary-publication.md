# 최종 보고서 — VL2 어휘 배포

> 완료: 2026-07-21 · 대상: VL2 (horizon `vocabulary-in-use`) · 작성: 완료 경계(§B3)

## 1. 문제 정의

VL1 실사가 확정한 것: `askewly-design` 호출부터 구현까지 5단계 어디에서도 562개 용어 사전에 도달하지 못한다. 사전은 사람이 보는 사이트 데이터로만 살아 있고, 배포된 `llms.txt`에는 그룹 이름 57개(`groups.yml`)만 있다. 그 설명문은 "referenced by every vocabulary term"이라고 말하는데 정작 참조하는 쪽인 term이 없다.

VL2의 일은 그 사전을 **에이전트가 감당할 수 있는 형태로** 경로에 올리는 것이다. 원본은 665KB다 — 그대로 링크를 걸면 컨텍스트의 상당량이 사전으로 채워지고 정작 구현할 여력이 남지 않는다.

## 2. Objective 연결

북극성은 에이전트가 의도적으로 디자인된 UI를 만들게 하는 것이다. 레포 이름이 `ui-dictionary`인데 정작 그 사전이 에이전트에게 안 보였다. VL2는 **레포의 이름값을 처음으로 에이전트 쪽에 지급**했다.

## 3. 경로

horizon `vocabulary-in-use`의 두 번째 milestone. 승인된 step 3개를 순서대로 밟았고 경로 변경은 없었다. 다만 step-3에서 기존 배포 파이프라인의 결함 3건을 만나 최소 범위로 손봐야 했다(§5).

## 4. 구현 결과

**562개 용어가 에이전트 경로에 올라왔다.** 통짜가 아니라 두 층이다 — 이름만 있는 인덱스(24KB)와 그룹별 샤드 58개(각 40KB 이하). 임의 용어를 찾는 데 드는 비용은 **2 fetch**이고, 원본 전체를 받을 일은 없다. 원본 경로는 일부러 배포하지 않으며 404가 정상이라고 규약에 명시했다.

**그리고 끊긴 참조 91곳이 전부 해소됐다.** VL1이 "사유가 전부 미배포이므로 VL2가 배포하면 대부분 자동 해소된다"고 예측했는데 실제로는 대부분이 아니라 전부였다. 배포 하나로 VL3의 절반이 먼저 닫힌 셈이다.

조회 규약은 세 갈래다. 이름을 알 때, 요구만 있고 이름을 모를 때(category 축으로 좁힌다), 그리고 **사전에 없는 개념일 때**. 세 번째가 중요하다 — 조회 실패가 작업 중단이 되면 배선이 잘못된 것이므로, `related`를 한 겹 따라보고 그래도 없으면 사전 밖으로 보고 진행하되 그 사실을 보고에 남기게 했다. 사전이 못 덮는 자리가 어디인지가 다음 수집 배치의 입력이다.

## 5. 이슈와 해결

**near-miss 하나가 이 milestone에서 가장 값진 산출이다.** `generate-llms-txt.mjs`는 `main()` 첫 줄에서 `public/llms`를 통째로 지운다. 샤드를 따로 만들어 두면 다음 재생성 때 **조용히 사라진다.** 실제로 실행해서 확인했다 — 재생성 1회에 배포 용어 562→0, 끊긴 참조 0→91로 되돌아갔다. 커밋했으면 아무도 모르게 VL2 전체가 취소됐을 것이고, 몇 milestone 뒤에 "왜 안 되지"로 발견됐을 것이다. 샤드 생성을 llms 파이프라인 안에서 호출하도록 묶어 두 산출물의 수명을 하나로 만들었고, 연속 2회 재생성으로 회귀가 없음을 확인했다.

**이 체크아웃에서 배포 생성기가 아예 못 돌고 있었다.** 레시피 frontmatter 정규식이 `^---\n`이라 CRLF 체크아웃에서 매칭에 실패해 `recipe has no frontmatter` 예외가 났다. 더 나쁜 것은 그 예외가 `rmSync` **뒤에** 터진다는 점이다 — 실행할 때마다 배포 산출물이 파괴되고 아무것도 다시 만들어지지 않았다. 이 horizon과 무관한 기존 결함이지만 고치지 않으면 등재 자체가 불가능해 정규식 한 줄만 손댔다.

**고치고 나니 레시피 설명이 전부 `undefined`가 됐다.** frontmatter는 읽혔는데 필드가 전부 null이었다. 원인은 **JS 정규식에서 `\r`이 줄 종결자라 `.`가 먹지 못한다**는 것 — `split("\n")`이 남긴 `\r` 때문에 필드 정규식이 매번 실패했다. `split(/\r?\n/)`로 고쳤다. 실행해보지 않고 커밋했으면 배포 인덱스 전체가 `undefined — undefined recipe`로 나갈 뻔했다.

## 6. 결과물과 증거

changeset 225(샤딩 생성기) · 226(조회 규약) · 227(llms 등재 + 결함 3건).

산출: `scripts/generate-vocabulary-shards.mjs`, `docs/design-system/vocabulary-lookup.md`, `examples/ui-vocabulary-site/public/llms/docs/ui-vocabulary/vocabulary/`(인덱스 + 샤드 58개), `llms.txt`의 `## Vocabulary` 섹션.

검증 관측:
- `node scripts/generate-vocabulary-shards.mjs --check` → 용어 562 / 샤드 58 / 인덱스 23.9KB / 최대 샤드 31KB(상한 40KB)
- `node scripts/audit-vocabulary-reach.mjs` → 배포된 용어 **562**(이전 0), 끊긴 term_refs **0**(이전 91)
- `node scripts/generate-llms-txt.mjs` → 147 자산, 무결성 검사 통과, 레시피 설명 정상
- 조회 실측: accordion·date-picker·skeleton 3개 모두 인덱스→샤드 **2 fetch**로 본문 5개 필드 도달
- probe(샤드 생성기): group 없는 용어 투입 → 명시 에러 exit 1 (조용한 누락 없음)
- probe(멱등성): 연속 2회 재생성 후에도 샤드 58개 유지
- probe(죽은 경로): 없는 경로 고의 등재 → `index links without backing files` exit 1
- probe(통짜 경로): 배포 디렉터리에 원본 `terms.yml` 없음, 인덱스에 `one_liner` 0건

크기 회고: changeset 3개로 닫혔다. 선언은 `changesets>=3`이므로 **정합**.

- 실표면: 배포 산출물을 로컬에서 생성·검증했다 — `llms.txt`에 `## Vocabulary` 섹션이 실렸고 등재 경로 147건이 전부 실존 파일로 해석된다. **라이브 URL 확인은 아직이다** — `git push`가 사용자 승인 지점이라 이 milestone에서 배포하지 않았다.
- 재현: `node scripts/generate-llms-txt.mjs && node scripts/audit-vocabulary-reach.mjs`

## 7. 후속 제안

- **VL3의 범위가 줄었다.** step-2(끊긴 참조 해소)는 VL2 배포로 이미 0이 됐다. 남은 것은 3자 매핑 생성과 자산 없는 용어 481개의 폴백 규약이다.
- **배포(push)가 밀려 있다.** 커밋 11건이 로컬에 있고 라이브 URL 확인(닫는 기준 1의 실배포분)은 push 후에만 가능하다.
- **`rmSync` 후 예외 = 배포물 파괴** 구조는 여전히 남아 있다. 이번엔 파이프라인에 묶어 우회했지만, 생성 실패가 배포 디렉터리를 비워두는 것 자체가 위험하다 — 임시 디렉터리에 만들고 성공 시 교체하는 쪽이 안전하다. 별건으로 남긴다.
