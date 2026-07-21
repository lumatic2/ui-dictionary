# changeset: VL5 step-1 — 오판 배치 (3군집)

- Date: 2026-07-21 · Plan: VL5 step-1 (`plans/2026-07-21b-vl5-cluster-corpus-narrowed.md`)

VL1 기준선이 실제로 틀린 3군집만 만들었다. 만점 8군집은 손대지 않는다(사용자 확정 "오판 난 자리로 좁힌다").

- `overlay-surfaces.md` — dialog/drawer/side-sheet/modal-bottom-sheet/full-screen-dialog (축 5·규칙 5)
- `single-choice-input.md` — radio-group/select/segmented-control/switch/combobox (축 4·규칙 6)
- `waiting-and-absence.md` — skeleton/spinner/progress-bar/empty-state (축 3·규칙 4)

## 세 군집이 공통으로 담은 것 — 모델이 못 맞히는 임계값

| 군집 | 모델이 아는 것 | 모르는 것 (이 파일이 담는 것) |
|---|---|---|
| 오버레이 | "맥락 유지면 drawer, 매듭지어야 하면 dialog" | **분량이 표면을 바꾼다** — 스크롤이 필요하면 dialog 가 아니다 |
| 단일 선택 | "5개 넘으면 드롭다운" | **공간이 개수보다 먼저 걸린다** — 자리가 있으면 라디오로 전부 노출 |
| 기다림 | "스켈레톤이 스피너보다 낫다" | **범위가 형태를 바꾼다** — 조각 하나면 스피너 |

VL4에서 배운 "규칙 순서 자체가 판정"을 세 파일 모두에 주석으로 남겼다.

## 검증

- `python scripts/validate-decisions.py` → PASS, 4 clusters / 축 18 / 규칙 22
- **기준선 오판 3건이 전부 정답에 도달**: overlay-3→drawer, single-choice-3→radio-group, waiting-3→spinner (3/3)
- **과적합 probe**: 케이스 밖 상황 10건(짧은 삭제 확인·필터 패널·모바일 공유 시트·국가 200개·정렬 8개·다크모드 토글·뷰 전환·30초 리포트·3초 진입·검색 0건) → **어긋남 0건**

## 곁가지

`modal`·`bottom-sheet` 같은 실무 명칭이 사전 id 로는 `dialog`·`modal-bottom-sheet` 다.
후보를 실존 id 로 맞추고 그 사실을 본문에 적었다 — 채점기 동의어 표가 둘을 같은 답으로 본다.
