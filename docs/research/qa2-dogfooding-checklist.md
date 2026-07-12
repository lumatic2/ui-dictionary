# QA2 Dogfooding 체크리스트 — AskewlyDesign 설치본

Date: 2026-07-12
Milestone: QA2 Step 2 (evidence)
Build: changeset #84 재패키징 산출물 (미서명 dev 인스톨러)

## 설치 lifecycle (Step 1 evidence)

- [x] 인스톨러 실행 → `%LOCALAPPDATA%\askewly_design` 설치
- [x] 시작 메뉴/바로가기 이름 = AskewlyDesign (`Programs\Askewly\AskewlyDesign.lnk` + 바탕화면)
- [x] 첫 실행 성공 (`docs/research/assets/qa2-step1-installed-launch.png`)
- [x] 언인스톨 → 잔여물 관측 (lifecycle 스크립트 PASS — squirrel tombstone만 허용 목록 내)
- [x] 재설치 → 정상 실행 (영구 설치본)

## Dogfooding 시나리오 (Step 2)

- [ ] 첫 실행 UX: 빈 상태·onboarding 표면 관찰
- [ ] 프로젝트 trust·열기
- [ ] 모바일 뷰포트 preset 전환
- [ ] Insert palette에서 recipe 삽입
- [ ] 노드 편집(속성·이동) → 저장
- [ ] Undo/Redo 왕복
- [ ] 앱 재시작 → 문서 연속성
- [ ] 에러 표면: 존재하지 않는 프로젝트/거부된 trust 경로

## 결함 목록 (심각도: blocker / major / minor / polish)

| # | 심각도 | 표면 | 증상 | 라우팅 |
|---|--------|------|------|--------|

## 관측 노트

(진행 중)
