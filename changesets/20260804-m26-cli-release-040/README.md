# 20260804-m26-cli-release-040 — M26 CLI 0.4.0 출고

> plan: `plans/2026-08-04-m26-cli-release-040.md` · milestone: M26

## step-1 — 버전 0.4.0 + 배포 전 게이트 + push

- packages/cli 0.3.0 → 0.4.0 (minor — init --block 킥스타트·--color cosmos·번들 데이터 갱신 terms 563/recipes 48).
- 게이트: build(data 번들 OK) · vitest 60/60 PASS · tsc --noEmit exit 0 · pack dry-run 15 files·258.2kB(dist/·data/ 12 엔트리, src/·test/·scripts/ 부재 — 0.3.0 대비 +1파일 = M19 kickstart 모듈, 정상 증가).

## step-2 — Trusted Publishing 출고 + 레포 밖 실증

- `gh workflow run publish-cli.yml`(run 30902648076) → conclusion success · `npm view` 0.4.0 · registry URL 200.
- 레포 밖 실증(scratchpad, 레포 외부 디렉터리): ① verify exit 계약 — 위반 dir(hex+slate) exit 1 / clean dir exit 0 ② 킥스타트 라이브 — `npx @askewly/design@0.4.0 init live-kickstart --block saas-app-shell --color cosmos --yes` **--registry 플래그 없이** 라이브 `ui.askewly.com/r/saas-app-shell.json` 소비: DESIGN.md(cosmos)+askewly-brand.css+이식 34파일+requiredCssVars 28/28+verify PASS(블록 11파일·색 리터럴 0).
- 절차 정본에 0.4.0 실적 추기.
