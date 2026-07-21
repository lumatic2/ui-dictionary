# changeset: studio fixes (칩·크기·순서·해상도)

- Date: 2026-07-19
- Milestone: ST1 (`plans/2026-07-19-st1-studio-fixes.md`)
- 사용자 피드백: 칩 겹침·카드 크기·해상도 (댄스 뮤지컬 실연 적발)

## 변경

- `templates/brief-studio.html` — ① 순위·선택 표시를 absolute 오버레이 → **예약 상단 밴드**(콘텐츠와 구조적으로 비겹침) ② 대형 그룹 티어(`size:"lg"` — imagery 330px+, 타일 min-height 170px) ③ 축 순서 영향순 재배열(base→accent→typo→imagery→구성→헤더→푸터→카드→밀도→radius→motion→icon→dark→a11y).
- `templates/fetch-stock.py` — 해상도 분리: cand-N.jpg(medium, 스튜디오) + cand-N-full.jpg(large2x→large→original 폴백, 최종 페이지).
- `docs/design-system/brief-studio.md` — 해상도 계약 명문("medium을 최종 페이지에 쓰는 것은 결함").

## 검증 checklist

- [x] 겹침 0: band.bottom <= body.top — 데스크톱 1280·좁은 뷰포트 390 모두 (evaluate 실측)
- [x] imagery `grid lg` 렌더 + 축 순서 실측 (base→accent→typo→imagery→…)
- [x] 해상도 분리 실호출: 썸네일 5~8KB vs full 46~73KB 파일 동시 저장
- [x] Failure probe: large2x 부재 시 large→original 폴백 코드 경로 (src.get 체인)
- [ ] curl 해상도 계약 배포 (폴링)
