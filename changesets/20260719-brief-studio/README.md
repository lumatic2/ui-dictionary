# changeset: brief studio (실물 선택 브리프)

- Date: 2026-07-19
- Milestone: VB2 (`plans/2026-07-19-vb2-brief-studio.md`)

## 변경

- step-1: `templates/brief-studio.html`(컬러=미니 UI 프리뷰 4팔레트 · 서체=Google Fonts 스펙시멘 4종 · 인터랙션=만져보는 데모 3수위, AGENT 커스터마이즈 주석, keep-all·reduced-motion 준수) + `templates/brief-studio-server.py`(표준 라이브러리 수집 서버, POST /select → brief-selections.json).
- step-2: `docs/design-system/brief-studio.md` 계약 신설(구동 절차·폴백 3종·후보 큐레이션 규칙) + design-brief.md §2 시각 선택 경로 + skill 배선 + llms 등재(60 assets).

## 검증 checklist

- [x] 실구동: 렌더 → 3그룹 클릭 선택 → "선택 완료" → brief-selections.json 수집 (Playwright, evidence/visual-brief/)
- [x] Failure probe A: 서버 사망 시 폴백 textarea에 선택 JSON 표시 확인 (수동 전달 경로)
- [x] Failure probe 설계: 오프라인 폰트 실패 시 시스템 폰트 렌더(link 실패 무해) — 계약 §2 명시
- [x] 계약에 "스튜디오 실패 ≠ 브리프 중단" 폴백 명문화 (plan failure probe 조건)
- [ ] curl brief-studio.md 배포 확인 (폴링 중)
- [ ] step-3: 대화형 실연 (사용자 참여 대기)
