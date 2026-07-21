# changeset: VL1 step-1 — 현행 호출 경로 실사

- Date: 2026-07-21
- Plan: VL1 step-1 (`plans/2026-07-21-vl1-flow-audit.md`)
- 증거: `evidence/vocabulary-in-use/vl1-flow-audit.md`

## 무엇을 했나

`askewly-design` 호출부터 구현까지의 경로를 **배포본(`ui.askewly.com`) 기준으로 실제 fetch**해 기록했다. 문서를 읽고 추정한 경로가 아니다 — 5단계 전부 응답을 확인했고 미확인 항목은 0건이다.

## 관측

| 항목 | 값 |
|---|---|
| 호출 경로 5단계 중 용어 사전이 등장하는 단계 | **0** |
| llms.txt 섹션 8개 중 용어 데이터 섹션 | **없음** — `groups.yml`(그룹명 57개)만 |
| entry-protocol의 term/vocabulary/dictionary 언급 | **0회** |
| `llms/docs/ui-vocabulary/terms.yml` | **HTTP 404** |
| 레시피 `term_refs`를 정의로 잇는 URL | **없음** |

## 특히

- `groups.yml` 설명문이 "referenced by every vocabulary term"이라고 말하는데 **참조하는 쪽인 term이 배포되어 있지 않다.** 그룹 이름 57개만 있고 내용물을 알 방법이 없다.
- 프로토콜 C(단일 컴포넌트) 첫 줄이 `Fetch the matching recipe if one exists` — **"없으면"이 없다.** 레시피 45개 밖의 요소는 경로가 끊긴다.

## 검증

- 실제 fetch 응답 첫 줄을 장부에 인용 (failure probe 통과 — 추정 0건)
- 404 응답으로 미배포 확인

## 판정

complete. 발견 결함은 고치지 않고 VL2·VL3·VL6으로 흘렸다(plan scope 결정대로).
