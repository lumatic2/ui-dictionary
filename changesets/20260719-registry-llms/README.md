# changeset: transplant E2E + llms wiring (RC1 step 2)

- Date: 2026-07-19
- Milestone: RC1 step-2 (`plans/2026-07-19-rc1-registry-pipeline.md`)
- Target: RC1 — 코드 자산 registry 파이프라인

## Scope

- `scripts/generate-llms-txt.mjs` — "## Code Assets" 절: `public/r/registry.json`에서 파생한 27 자산 링크 + 소비 절차(fetch→write→deps→restyle)와 `npx shadcn add` 경로. /r/ 링크도 무결성 검사에 합류.
- `evidence/recipe-code-reuse/rc1-transplant.md` — 깨끗한 새 Vite 프로젝트 이식 실구동 기록 + 스크린샷.

## Contract

- source of truth: `scripts/generate-registry.mjs` 산출(`public/r/`)이 Code Assets 절의 유일 입력
- deploy: llms.txt (push 후 자동)
- out of scope: 계약 문서 개정 (RC2)

## Verification checklist

- [x] 이식 실구동 — stat-summary-grid를 registry JSON fetch만으로 신규 Vite 프로젝트에 이식, 브라우저 렌더 관측 (스크린샷)
- [x] llms.txt Code Assets 절 27링크 + 무결성 검사 통과
- [x] Failure probe: 결합 자산(landing-hero) 생성 시도 → 순수성 게이트 명시 거부 (step 1에서 실측, 게이트는 빌드 경로 공유)
- [ ] curl 배포 확인 (세션 push 후 — `curl https://ui.askewly.com/r/registry.json`)
