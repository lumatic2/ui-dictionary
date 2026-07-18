# changeset: brief step in skill + E2E (기록)

- Date: 2026-07-18
- Milestone: DB2 (`plans/2026-07-18-db2-skill-e2e.md`)
- 실변경 위치: `~/projects/custom-skills/askewly-design/SKILL.md` (커밋 54c4a72)

## 변경

- askewly-design skill 절차 1에 브리프 인터뷰 한 줄 추가 — design-brief.md 참조만(내용 복제 없음, 라우터 계약 유지).
- `setup.sh --skill askewly-design` 재배포: Claude·Codex 양쪽 [OK].

## 검증 checklist

- [x] 양 배포처 grep "브리프 인터뷰" 각 1
- [x] Failure probe: 브리프 내용(7도메인·게이트 표)이 skill에 복제되지 않음 — URL 참조만 확인
- [x] E2E (a) 소형 수정(hover 추가) → 브리프 질문 0·게이트 생략, 스크린샷 2장 + 사람 확인 문구 (e2e-small.log)
- [ ] E2E (b) 신규 화면 → 인터뷰 발동 + DESIGN.md 생성 (대화형 실연, step-2)
- [x] E2E (c) DESIGN.md(바다책방 픽스처) → 재질문 없이 틸/쿨페이퍼 파생(about.html 토큰 6회), askewly 미주입, 데스크톱·모바일 스크린샷 (e2e-existing.log)
