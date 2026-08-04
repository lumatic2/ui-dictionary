# Graph Content Schema — 지식 그래프 콘텐츠 스키마

> 지위: 지식·콘텐츠 그래프 화면(연결 시각화, 세컨드브레인, 관계 탐색 UI)을 만들 때의 데이터 스키마 판정 규칙. 출처 = second-brain/poc-graph(brain.askewly.com) 실구현 채굴(harvest, 2026-08-04 — `research/2026-08-04-m22-harvest-mining-ledger.md` ② 카드). 코드 벤더링이 아니라 스키마 계약을 이식한다. 뷰어 코드(three.js 씬·force 어댑터)는 별도 이월(같은 장부 C1).

## 핵심 계약 — 타입 축과 계층 축을 동시에 갖는다

노드는 **분류 축 두 개를 독립으로** 가진다 — 하나로 합치면 "무엇인가"와 "어디에 속하는가"가 서로를 오염시킨다.

| 축 | 필드 | 값 | 규칙 |
|---|---|---|---|
| 타입(무엇) | `type` | 7종: `semantic`(개념)·`reflective`(통찰)·`procedural`(절차)·`episodic`(사건)·`thesis`(주장)·`topic`(주제)·`unclassified`(미분류) | 타입마다 고정 컬러+글리프 매핑(시각 어휘) — `unclassified` 를 정식 타입으로 두어 미분류가 조용히 사라지지 않게 한다 |
| 계층(어디) | `hierarchy` | 3단 `galaxy > cluster > system` + `role`(`galaxy\|cluster\|system\|star`) | 계층 자체도 노드로 렌더하되 `hierarchy_virtual` 플래그로 실콘텐츠 노드와 구분 — 가상 노드가 콘텐츠 수를 부풀리지 않는다 |

- 노드 정본 = 원문 1개(마크다운 파일)당 1노드. 화면이 아니라 소스 저장소가 정본이고, 그래프 데이터(`graph.json`)는 빌드 산출물이다.

## 엣지 계약 — 관계 종류·방향·검수 추적

| 요소 | 규칙 |
|---|---|
| 방향성 관계 | `rel` 11종: supports·extends·requires·refines·instantiates·contradicts·triggered-by·composes·mentions·related·contains — 방향(`dir`) 이 의미의 일부다 (`A extends B` ≠ `B extends A`) |
| 무방향 관계 | 태그·유사 계열(near-miss·topic-tag·thesis-tag)은 방향 없음으로 분리 — 방향성 관계와 같은 시각 언어를 쓰지 않는다 |
| 출처 추적 | `provenance: {layer, kind, reviewed}` — **기계 생성 엣지와 사람 검수 엣지를 같은 스키마 안에서 구분**한다. `reviewed:false` 엣지를 지우지 않고 표시만 다르게 |
| 노출 제어 | `overview_visible`·`overview_emphasis` — 전체 뷰에 다 그리지 않는다. 어떤 엣지가 개요에 나올지는 데이터가 선언 |

## 판정 절차

새 그래프 화면 의뢰 시: ① 타입 축(고정 시각 어휘 포함)과 계층 축을 분리 정의 ② 관계는 방향성/무방향 두 부류로 나누고 방향성 관계에 어휘를 먼저 확정 ③ 기계 생성 연결에는 `provenance.reviewed` 를 처음부터 배선 ④ 개요 노출은 렌더러 휴리스틱이 아니라 데이터 필드로. 물리·레이아웃(force 설정)은 스키마와 독립 관심사 — 이 문서 범위 밖.

## Changelog

- 2026-08-04: 초판 — M24 harvest 배치 3 (B4). second-brain/poc-graph 스키마 채굴 착지.
