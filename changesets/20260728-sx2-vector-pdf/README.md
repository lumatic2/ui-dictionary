# Changeset — SX2: 벡터 PDF export

- Plan: `plans/2026-07-28-sx2-vector-pdf.md` · cross-repo: custom-skills

## step-1 — export-vector-pdf.mjs (custom-skills ae6a50d)

- print.html 직접 인쇄(page.pdf + preferCSSPageSize), document.fonts.ready 대기, 시스템 Chrome 폴백 이식(브라우저 바이너리 부재 적발분). 의존성 0.

## step-2 — 벡터성 실증

- 두 fixture: 페이지 수 4/4·6/6, 텍스트 추출 376·884자, 3면 래스터 눈 확인(Pretendard·풀블리드·fallback 노트).

## step-3 — 문서·배포 (ae6a50d·6c3ff8c)

- SKILL §7.10 트랙 선택 기준·description, authoring-contract 복사 목록+트리. --skill 단일 배포·배포본 재생성 확인. setup 원자 교체 vs 배포본 임시 산출물 충돌 1회(정리 후 해소).
