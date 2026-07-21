# changeset: video pipeline (Pexels Videos)

- Date: 2026-07-19
- Milestone: ST3 (`plans/2026-07-19-st3-video-pipeline.md`)
- 사용자: "사진 해상도가 낮고, 차라리 영상이었으면"

## 변경

- `templates/fetch-stock.py` `--video` 모드 — Pexels Videos `/videos/search` ko-KR: HD(≤1280px) mp4 선택(4K 회피) + 포스터, 크리에이터·duration·size 메타.
- `templates/brief-studio.html` — 이미지 축 영상 후보(`video`/`poster`): hover muted 재생·이탈 시 정지, reduced-motion이면 포스터 고정(리스너 미부착).
- `docs/design-system/brief-studio.md` §4 — 영상 절: HD 상한·15MB 우선·히어로 비디오 패턴(autoplay muted loop + 포스터 폴백 의무). llms 배포.

## 검증 checklist

- [x] Videos API 실호출: "무용 공연 무대" → vid-1(1080px 24.6MB 22s)·vid-2(1280px 1.2MB 6s) + 포스터
- [x] hover 재생 실측: pointerenter → playing·currentTime 진행, pointerleave → paused (Playwright)
- [x] Failure probe: 첫 검증에서 이벤트 타깃 오류(.opt 디스패치)로 false negative → body-slot 타깃으로 원인 분리·재검증 (리스너 위치 문서화 가치)
- [x] reduced-motion: matchMedia 가드로 리스너 자체 미부착 (포스터 고정)
- [ ] curl §4 영상 절 배포 (통합 폴링)
