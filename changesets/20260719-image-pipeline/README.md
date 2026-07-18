# changeset: image pipeline (Pexels + 생성 옵션)

- Date: 2026-07-19
- Milestone: SP3 (`plans/2026-07-19-sp3-image-pipeline.md`)
- 사용자: PEXELS_API_KEY 제공 → User 전역 환경변수 등록(값 비노출)

## 변경

- `templates/fetch-stock.py` 신설 — Pexels `/v1/search` `locale=ko-KR`, 후보 다운로드 + candidates.json(photographer·pexels_url·avg_color). 표준 라이브러리만.
- `docs/design-system/brief-studio.md` §4 이미지 축 절 — 스톡 우선(쿼리=전략층 파생, avg_color 톤 정렬)·생성 옵션(comfy/image_gen)·폴백 3종. llms 배포.

## 검증 checklist

- [x] 실호출: "따뜻한 카페 원두" ko-KR → 6장 다운로드 + 메타 (썸네일 실물 열람 확인)
- [x] Failure probe A: 키 부재 시 명시 에러("PEXELS_API_KEY 환경변수가 없다") 실증 — 등록 전 첫 실행에서 관측
- [x] Failure probe B(디버깅 기록): urllib 기본 UA가 Pexels CDN 403 차단 → UA 헤더 추가로 해소 (Invoke-WebRequest 200 대조로 원인 분리)
- [x] degrade: 오프라인/키 부재 시 스튜디오는 톤 카드 유지(이미지 축 독립) — 계약 명문
- [ ] curl brief-studio.md §4 배포 (폴링)
