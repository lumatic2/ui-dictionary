# changeset: deep brief optional mode

- Date: 2026-07-19
- Milestone: VB4 (`plans/2026-07-19-vb4-deep-brief.md`)
- 사용자 확정: 딥 브리프 = 선택 모드 (기본 7도메인 유지)

## 변경

- `docs/design-system/design-brief.md` 부록 — 딥 도메인 3종(8 컴포넌트 스타일 · 9 헤더 IA · 10 푸터 IA) + 발동 규칙(사용자 명시 요청 또는 화면 3개 이상+수락, 소형에 제안=게이트 실패) + DESIGN.md 매핑(components:·rounded:·Layout 프로즈).
- `templates/brief-studio.html` 딥 섹션 — 주석 처리된 실물 렌더 그룹(버튼 3형태·헤더 미니 와이어프레임 3구성), 미발동 시 주석 유지 의무 명시.

## 검증 checklist (게이트 양방향)

- [x] 소형 시나리오 미발동: 템플릿 기본 상태에서 딥 그룹은 주석 — 렌더에 노출되지 않음(스튜디오 실구동으로 기확인된 기본 3그룹만) + 부록에 "소형에 제안=게이트 실패" 명문
- [x] 대규모 시나리오 발동: 부록 발동 규칙 2경로(명시 요청 / 3화면+수락) 명문 + 스튜디오 딥 섹션 커스터마이즈 지점 존재
- [x] curl 부록 배포 grep "딥 브리프" (attempt 12)
