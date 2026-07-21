# RC4 step 1 — 실연 준비 (2026-07-19)

- 의뢰: 수제 도자기 온라인숍 (사용자 확정) · 톤 "따뜻하고 장인적" (AskUserQuestion 매듭)
- 실사: Pexels 2각도 쿼리("수제 도자기 공방"·"ceramic pottery hands wheel") 8장 수집 → 6장 이미지 축 배치 (썸네일 medium + full 분리, 크레딧 candidates.json 보존)
- 데이터: `studio-data.pottery.json` — 타일 4종(흙과 손·조용한 공방·갤러리 화이트·가마의 밤, boost 포함) · 헤드라인/서브 카피 각 6안 · recipes 매핑 13항 기본 상속. HTML 직접 편집 0 (SF1 경로)
- 생성: `make-studio.py` OK (tiles=4 axes=18) — 매핑 완전성 게이트(RC3) 통과

## 사전 점검 (failure probe — 끊긴 링크 0 확인 후에만 사용자 호출)

- 매핑 타깃 13 전부 도달: registry 코드 자산 9 · recipe 문서 폴백 4 · 끊김 0 (urllib 기본 UA 차단 오탐 → UA 헤더로 재검 — 점검 스크립트 결함이었지 배포 결함 아님)
- boost 무효 참조 1건 발견·수정 (clay-hands imagery → photo-1)
- Playwright 사전 렌더: 타일 4종·19섹션(18축)·실사 6장 url 렌더·헤드라인 반영·구성 8종(기본 노출)·미리보기 조립 확인
- 서버 `brief-studio-server.py :8740` 구동 + 사용자 기본 브라우저 열림 (Start-Process)

상태: 사용자 선택 대기 (brief-selections.json 폴링 백그라운드).
