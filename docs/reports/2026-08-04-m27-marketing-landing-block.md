# M27 — marketing-landing 블록 완료 보고

> 2026-08-04 · goal `second-block-marketing` · plan: `archive/plans/2026-08-04-m27-marketing-landing-block.md`

## 1. 결과

- 블록 등급 2호 `marketing-landing` 등재 — registry 55→56. 표준 퍼널형 랜딩 골격(섹션 9 파일 + 조립 page.tsx + mock data.json), 구성은 **자체 harvest asset 9종 재조합**(floating-bars-hero·logo-marquee·zigzag-story-section·terminal-demo-panel·staggered-entrance-group·contrast-duo-card·mesh-gradient-surface·rotating-label·scroll-driven-reveal) + 자체 구현 4섹션(pricing·FAQ·CTA·footer).
- 외부 흡수 실사(흡수 우선 규약): 후보 5계열 전건 기각(tailark next/link 195·next/image 109 실측, Launch UI 유료 벽, HyperUI 모델 불일치, 공식 blocks 카테고리 부재, 유료군) → 자체 조합 폴백. **"산출물→저장고(harvest)→재조합(블록)" 루프가 처음으로 전 구간 완주** — saas-app-shell(외부 흡수 베이스)과 달리 순수 자기 자산 조합.
- 킥스타트 두 번째 선택지 실증: CLI·생성기 무수정으로 registry 선언만으로 `init --block marketing-landing` 이 동작(비하드코딩 계약 실측 확인).

## 2. 이슈와 해결

- **환경**: 이전 세션의 stale E2E 프로세스(public/r cwd http.server + vite 4종)가 registry 재생성을 EPERM 차단 — handle64 로 식별·종료(레포 무변경).
- **CLI finding 2건 → 0.4.x 큐 적재**(scope 밖): ① 킥스타트 Next steps 안내가 블록명 무관 `SaasAppShell` 하드코딩 ② primitive 전이 의존(class-variance-authority) dep 안내 누락으로 신선 빌드 1회 실패(수기 설치 해소).
- kg 승격 후보: 0건 (finding 은 레포 내부 CLI 결함 — 일반성 없음).

## 3. 증거

- evidence: `evidence/second-block-marketing/m27-marketing-landing.md` (+ screenshots 6장) · changeset: `changesets/20260804-m27-marketing-landing-block/`
- 게이트: 재생성 기존 55종 diff 0 · site build+prerender 759 · tsc 0 · lint:colors 0 · verify 블록 0건 · llms-sync PASS · requiredCssVars 20/20.
- 실표면: 신선 vite 앱(레포 밖 scratchpad, teal restyle)을 실브라우저로 라이트/다크 전 섹션 구동 — 터미널 스트리밍·rotating label·마퀴 시간차 실발화 스크린샷 4장, 콘솔 에러 0, askewly 팔레트 잔존 0. 사이트 Recipe Gallery 데모도 실렌더 확인. **사용자 관측 통과(2026-08-04, Artifact 실화면)**.
- 재현: `python -m http.server 8899 --directory examples/ui-vocabulary-site/public` → `npx --yes @askewly/design@0.4.0 init <빈 dir> --block marketing-landing --color teal --yes --registry http://127.0.0.1:8899` (push·배포 후에는 `--registry` 불요).
- 배선: none — 장치 신설 없음(기존 생성기·CLI 경로 재사용이 검증 대상이었고 실발화 확인됨).
- 크기 회고: steps 3 + 통합 E2E + 사용자 게이트 = milestone 라벨 정합. 목표(두 번째 블록) = 1-milestone 그릇 — 과소 그릇 아님(목표 자체가 이 크기).
