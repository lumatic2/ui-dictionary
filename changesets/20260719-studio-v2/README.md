# changeset: studio v2 (2단 구조 + 축 14종)

- Date: 2026-07-19
- Milestone: SP2 (`plans/2026-07-19-sp2-studio-v2.md`)

## 변경

- `templates/brief-studio.html` **v2 전면 개편 — 데이터 주도형**: 에이전트는 `TILES`(방향 타일 3~4, boost 맵)·`AXES`(축 14종, 후보 6~8, rank) 데이터 객체만 교체하고 렌더러는 공통. 1단 스타일 타일 → 2단 축 14종(베이스/액센트 분리·타이포 페어 스펙시멘 8종·구성/헤더/푸터 와이어프레임·카드 실물 렌더·밀도/radius 스텝 슬라이더·이미지 톤 카드·아이콘 SVG 렌더·다크 프리뷰·모션 데모·접근성). 타일 선택 = 추천 재정렬("타일 추천" 배지), 순위 배지, 키보드 접근.
- 수집 스키마 v2: `{version: 2, tile, selections{14}, submittedAt}` — 서버는 무수정 호환.

## 검증 checklist

- [x] 실구동: 14축 렌더 → 전 축 선택 → 제출 → v2 JSON 수집 (version 2·tile·axes 14 확인)
- [x] Failure probe A(강제필터 금지): 타일 미선택 상태에서 2단 선택 가능 확인
- [x] 타일 재정렬: quiet-literary 선택 → accent 축 1번이 coffee("타일 추천" 배지)로 재정렬 관측
- [x] Failure probe B(reduced-motion): 데모·전환이 media query로 무력화 (CSS 명시)
- [x] 스크린샷 evidence: evidence/studio-depth/studio-v2.png
