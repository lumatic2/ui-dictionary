# 20260804-m27-marketing-landing-block — M27 marketing-landing 블록

> plan: `plans/2026-08-04-m27-marketing-landing-block.md` · milestone: M27

## step-1 — 외부 공개 마케팅 블록 실사 + 베이스 판정 (흡수 우선)

- 후보 5계열 실측: tailark/blocks(MIT·2,272★ — next/link 195·next/image 109 결합) · Launch UI(MIT — 증거 구간 Pro 유료) · HyperUI(MIT — 플레인 HTML, 모델 불일치) · shadcn 공식 blocks(마케팅 카테고리 부재) · Magic UI templates/shadcnblocks(유료).
- 판정: **자체 조합 폴백** — 채택 규칙 3항 전부 충족 후보 없음(계획 결정 로그 폴백 규칙 발동, 재질문 없음). 자체 마케팅 asset 13종+가 라이브 harvest 산이라 품질 우위 성립. tailark·Launch UI 는 pricing/FAQ/footer 구조 참고 B 링크로만.
- 산출: `research/2026-08-04-m27-marketing-block-absorption-survey.md` + `docs/design-system/absorption-criteria.md` 판정 3행.

## step-2 — marketing-landing 블록 소스 + registry 등재 + 사이트 데모

- `src/components/blocks/marketing-landing/` 11파일: page.tsx(조립+재배열 가이드 주석) + 섹션 9(hero·logo-strip·story·demo·comparison·pricing·faq·cta·footer) + data.json(카피/로고/가격 mock 단일 표면). 구성 asset 9종 재사용(floating-bars-hero·logo-marquee·zigzag-story-section·terminal-demo-panel·staggered-entrance-group·contrast-duo-card·mesh-gradient-surface·rotating-label·scroll-driven-reveal), pricing/FAQ/CTA/footer 는 자체 구현. typing-headline 은 미채용 — terminal-demo-panel 과 타이핑 모션 중복(계획 결정 B 의 택일 슬롯에서 rotating-label 채택).
- registry.json `tier:"block"` 등재(requiredCssVars 20 — 사이드바 계열 제외) → `/r/marketing-landing.json` files 11·regDeps: primitives 3(accordion·badge·button)+asset URL 9·deps lucide-react. block-contract §6 행(재배열 가이드 포함) + recipe gallery(Marketing 컬렉션) 데모 배선.
- 게이트: 재생성 기존 55종 diff 0(git 무변경 실측) · site build+prerender 759 PASS · tsc -b exit 0 · oxlint 신규 0(기존 warning 만) · lint:colors 0 · `npx @askewly/design verify` 블록 10파일 0건 · 브라우저 렌더(hero/터미널 실발화/pricing/FAQ, 콘솔 에러 0).
- EPERM 잔해 정리: 이전 세션(f05620b5)의 stale E2E 프로세스(public/r cwd 의 http.server 8931·vite 5199/4177/4322/4323)가 public/r 디렉터리를 잠가 재생성 차단 — handle64 로 식별 후 종료(레포 변경 없음).

## step-3 — 킥스타트 통합 E2E + evidence

- 신선 scratchpad 에서 `npx @askewly/design@0.4.0 init m27-fresh --block marketing-landing --color teal --yes --registry http://127.0.0.1:8899`(로컬 public 서빙) → exit 0 · 24파일 이식 · requiredCssVars 20/20 · verify PASS. asset regDeps 9종은 라이브 URL 해결(로컬+라이브 혼합 정상).
- vite 앱 조립 → build PASS · 실브라우저 라이트/다크 4샷(터미널 스트리밍·rotating label·마퀴 시간차 실발화) · 콘솔 에러 0 · askewly 팔레트 잔존 0.
- finding 2건 CLI 0.4.x 큐 적재: ① Next steps 안내 `SaasAppShell` 하드코딩 ② primitive 전이 의존(cva) dep 안내 누락.
- 산출: `evidence/second-block-marketing/m27-marketing-landing.md` + screenshots 6장. 잔여 = 사용자 관측 1회.
