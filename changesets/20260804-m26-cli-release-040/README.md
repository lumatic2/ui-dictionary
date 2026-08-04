# 20260804-m26-cli-release-040 — M26 CLI 0.4.0 출고

> plan: `plans/2026-08-04-m26-cli-release-040.md` · milestone: M26

## step-1 — 버전 0.4.0 + 배포 전 게이트 + push

- packages/cli 0.3.0 → 0.4.0 (minor — init --block 킥스타트·--color cosmos·번들 데이터 갱신 terms 563/recipes 48).
- 게이트: build(data 번들 OK) · vitest 60/60 PASS · tsc --noEmit exit 0 · pack dry-run 15 files·258.2kB(dist/·data/ 12 엔트리, src/·test/·scripts/ 부재 — 0.3.0 대비 +1파일 = M19 kickstart 모듈, 정상 증가).
