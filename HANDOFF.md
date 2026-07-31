# HANDOFF

## 이어서 할 일
> 2026-07-31 세션 종료 시 기록 (2차)

- **수동 QA 계속(사용자 예고)**: get-started 까지만 끝남 — 사용자가 실배포를 더 둘러보고 다음 결함을 가져오면 새 goal 로 /harness-plan. 카드 일러스트 수렴 규칙은 `docs/reports/2026-07-31-qa2-get-started-cards.md` §2 (기준 이미지 참조·피사체 75~85%·절단 금지 — imagegen 재작업 시 재사용)
- 일러스트 원본 PNG 는 세션 scratchpad 에만 있음(소멸) — 수정 필요 시 codex exec imagegen 재생성, 프롬프트 요지는 위 보고서·changeset `20260731-qa2-get-started-cards`
- kg 승격 후보 1건 이월: "생성 일러스트 시리즈 수렴 규칙(기준 이미지 직접 참조 + 피사체 점유율 75~85% + 이전 실패 원인 명시)" — 다음 세션에서 kg Add 절차로 draft 인입 판정
- 다음 큐: 『인터랙티브 웹 애니메이션』 책 스터디 자산화(사용자 주도, 2026-07-28 확정). real-use-lap 은 2026-07-31 사용자 판정("낡음")으로 폐기 — ROADMAP marker skipped·horizon 문서 삭제.
- 워크트리 `발표-슬라이드-만드는-법`: 미병합 19커밋 — 사용자 작업 중, 끝나면 /merge-worktree (pdf 워크트리는 2026-07-31 정리 완료 — 브랜치·원격 삭제)
- 이월 finding(유지보수): 다크모드 3건(토큰 부재 강조색·forced-colors·다크 og-image) · QA1 SEO 메타 언어 판단 · 디자인 verify 타이포 7건

### 계획 위치 (cascade)
- 북극성: Askewly Design — 이식 가능한 제품 축 추가(2026-07-31 사용자 승인, `CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — goal `site-polish` 완주(2026-07-31, QA1 회귀 마감·QA2 관측 7왕복 통과), active goal 0
- 다음 차례: 사용자 QA 결함 대기 → /harness-plan

### 현재 상태 / 주의점
- main push 완료(c0700f8), 실배포 라이브 확인(get-started 200 + 신규 webp 서빙, 2026-07-31)
- **사이트 카피 = 영어 단일 확정** — `docs/design-system/copy-language.md` 정본, 한국어 전환 재제안 금지(관측 회귀 이력)
- get-started 이미지 교체는 `public/assets/get-started/*.webp` 덮어쓰기 + build 로 끝남(코드 무변경)
