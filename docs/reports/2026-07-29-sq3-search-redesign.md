# SQ3 — O9 검색 결과 UI 재디자인 완료 보고 (2026-07-29)

## 1. 결과

- 검색 결과 화면 재디자인 완료 + 실배포 반영 + **사람 관측 1회 통과**(2026-07-29). UE1 관측 O9("너무 구려") 해소.
- 정보구조: 정답 티어(이름·별칭 일치 + 큐레이션 부스트 + use-case pin) vs 연관 언급 2티어 섹션 — 순위·개수 완전 보존("토글" 7=5+2). 요약 헤더 재디자인(검색어 강조 + 티어별 집계).
- 비주얼(askewly-design entry-protocol 경유): 정확 일치 = hero 행(비주얼·이름 위계 강화), 연관 = 타이포 중심 compact 행 + 매치 근거 배지. variant 기본값 = 기존 렌더(브라우징 무회귀 계약).

## 2. 이슈와 해결

- fresh 계획 검증자 적발 2건을 계획 단계에서 흡수: 부스트 매치가 reasons 로는 실필드 매치와 구별 불가 → 별도 티어 채널(exact boolean) · use-case pin 결과 티어 승격 누락 → exact:true.
- 시그니처 자가 판정에서 컴팩트 썸네일(w-14)의 한글 라벨 음절 세로쌓임(하드 실패) 적발 → 컴팩트 행 썸네일 제거(타이포 중심).
- finding 2건 기록(plan finding 큐): use-case 칩 UI 진입점 부재(데드 경로 — pin 티어는 코드 검증만 가능) · App.tsx 카카오 버튼 hex 잔존(verify 스코프 밖).
- 크기 회고: step 3개·changeset 1디렉터리 — milestone 라벨 정합.

## 3. 증거

- evidence: `evidence/site-quality/sq3-search-redesign.md` (계층화 실측 표·재디자인 판정·회귀 게이트·실배포·관측)
- 실표면: 실배포 `ui.askewly.com/search?q=토글` 실브라우저 — 2티어 렌더(5+2)·신형 헤더·콘솔 0에러 + **사용자 사람 관측 1회 통과**.
- 재현: dev 서버 + scratchpad `sq3_step{1,2}_check.py`(Playwright — 티어 합계·딥링크·0건·브라우징 무회귀·모바일 390px) · verify 비악화(색 0·타이포 7=이월분).
- 평가 못 함: use-case 칩 활성 검색의 실동작 — UI 진입점이 없는 데드 경로라 코드 검증까지만(finding 큐 기록).
