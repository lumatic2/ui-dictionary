# changeset: VL2 step-2 — 용어 조회 규약

- Date: 2026-07-21
- Plan: VL2 step-2 (`plans/2026-07-21-vl2-vocabulary-publication.md`)

## 무엇을 했나

`docs/design-system/vocabulary-lookup.md` 신설. 에이전트가 용어를 찾는 절차를 세 갈래로 규정했다.

- **A. 이름을 아는 경우** — 인덱스에서 찾아 그 샤드 하나만. 2 fetch.
- **B. 이름을 모르는 경우** — 요구를 category 축으로 번역 → 후보 그룹 좁힘 → 샤드 대조. 2~3 fetch.
- **C. 사전에 없는 개념** — **막히지 않는다.** `related`를 한 겹 따라보고, 없으면 사전 밖으로
  보고 진행하되 그 사실을 보고에 남긴다. 조회 실패가 작업 중단이 되면 배선이 잘못된 것이다.

"하지 않는 것"도 명시: 원본을 찾아 나서지 마라(404가 정상), 샤드를 여러 개 미리 긁지 마라
(통짜 배포와 같아진다), 인덱스에서 정의를 기대하지 마라.

## 검증

서로 다른 category 3개 용어로 규약을 실제로 밟았다:

| 용어 | 경로 | fetch |
|---|---|---|
| accordion | index → data-basic-content-elements.yml (12KB) → 본문 5/5 필드 | 2 |
| date-picker | index → input-pickers.yml (28KB) → 본문 5/5 필드 | 2 |
| skeleton | index → feedback-loading-progress.yml (10KB) → 본문 5/5 필드 | 2 |

**failure probe** — 전체 파일을 받아야만 답이 나오는 경로가 남았는지:
- 배포 디렉터리에 원본 통짜 `terms.yml` 없음 (404가 정상)
- 인덱스에 `one_liner` 0건 — 정의를 인덱스에 흘리지 않았다. 흘렸으면 인덱스가 사전이 되고
  두 층 구조가 무너진다

## 판정

complete. 상한 3 fetch에 대해 실측 2 fetch.
