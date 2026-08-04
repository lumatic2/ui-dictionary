# Dictionary-Site IA — 사전형 사이트 정보 구조

> 지위: 용어·개념 사전형 사이트의 데이터→화면 구조 판정 규칙. 출처 = development-dictionary(dev.askewly.com) 실구현 채굴(harvest, 2026-08-04 — `research/2026-08-04-m22-harvest-mining-ledger.md` ⑩ 카드). 코드 벤더링이 아니라 구조 계약을 이식한다.

## 핵심 계약 — 이중 SoT + 빌드 타임 교차검증

| 층 | 정본 | 규칙 |
|---|---|---|
| 콘텐츠 | `terms.yml` (항목당 1레코드) | 화면이 아니라 데이터가 정본. 코어 필드 = `id`·`name(ko/en)`·`one_liner`·`category`·`related` — 그 외(설명 섹션·visual model·출처)는 선택 확장. 15필드 전체 복사는 과잉(원 구현 실측 소견) |
| 내비 | `navigation.yml` (그룹·배치 별도 파일) | 콘텐츠와 **분리** — 같은 항목을 다른 축으로 재배치할 수 있어야 한다 |
| 검증 | 빌드 스크립트 2본 | ① 전 필드·enum·출처 id 런타임 단언 ② **교차검증**: 모든 term 이 nav 에 배치됐는가 + 모든 nav 참조가 실존하는가 — 하나라도 어긋나면 빌드 FAIL (조용한 누락 불가) |

## 화면 규칙

- 상세 렌더는 데이터 분기: 설명 섹션이 있으면 커스텀 아티클, 없으면 제네릭 섹션 — 템플릿 강제가 아니라 데이터가 형태를 고른다. visual model(노드 배열)은 데이터에서 다이어그램을 직접 렌더.
- 검색은 빌드 인덱스 없이 인메모리 가중 필드 스코어링(name > alias > category > one_liner)이면 수백 항목까지 충분. 한국어 자연어 질의는 수기 부스트 표로 보정.
- 빈 검색 결과는 회복 UX(되돌리기 액션 + 추천 질의)를 붙인다 — 막다른 화면 금지.

## 판정 절차

새 사전형 사이트 의뢰 시: ① 코어 5필드로 terms 정의 ② 내비를 별도 파일로 ③ 교차검증 빌드 게이트 먼저 배선 ④ 확장 필드는 실수요 발생 시. 본 레포 실구현 선례 = `docs/ui-vocabulary/`(terms.yml·groups.yml) — 같은 사상.

## Changelog

- 2026-08-04: 초판 — M23 harvest 배치 2 (B2). development-dictionary 실구현 채굴 착지.
