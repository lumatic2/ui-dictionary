# M20 harvest teardown ledger — 배포 표면 29종

> 2026-08-04 · 소비처: `plans/2026-08-04-m20-harvest-teardown.md` (M20 step-1~3 쓰기 정본) · 입력: `research/2026-08-04-harvest-asset-census.md`(29 표면 census, 동결)
> step-1 = 소스 매칭 열 · step-2 = 표면별 teardown 카드 · step-3 = 후보 순위(말미 절)

## step-1 — 소스 레포 매칭 (29행)

매칭 방법: wrangler.toml `name` 실측 + `.vercel/project.json` 실측 + `agent-orchestration/manifests/*.json`(기기별 레포 장부) + `lumatic2` 프로필 README + `Askwely-company` projects.ts + INDEX.md. "추정" 표기는 step-2 라이브 실측으로 판별.

| # | 표면 (도메인) | 호스팅 | 로컬 소스 | 근거 |
|---|---|---|---|---|
| 1 | ui.askewly.com | CF Pages `ui-dictionary` | `~/projects/ui-dictionary` | wrangler.toml name 일치 |
| 2 | dev.askewly.com | CF Pages `development-dictionary` | `~/projects/development-dictionary` | 동명 레포 (+.vercel 바인딩도 있으나 DNS 정본=Pages) |
| 3 | 음식노쇼.askewly.com | CF Pages `food-no-show` | `~/projects/food-no-show` | wrangler.toml name 일치 |
| 4 | americano-robot.askewly.com | CF Pages `americano-robot` | **소스 원격 — M4 기기 `americano-robot-site`** | m4.json manifest (origin 미기록) |
| 5 | accounting.askewly.com | CF Pages `askewly-accounting` | 관련 레포 `~/projects/kifrs-rag` (라벨 "kIFRS") — 배포 설정 로컬 미확인 | Askwely-company projects.ts 라벨 |
| 6 | tax.askewly.com | CF Pages `askewly-tax` | 관련 레포 `~/projects/tax-agent` (라벨 "tax AI") — 배포 설정 로컬 미확인 | Askwely-company projects.ts 라벨 |
| 7 | golf.askewly.com | CF Pages `askewly-golf` | `~/projects/archive/golf` | m4.json origin `golf-ai-caddy` + 라벨 "AI 골프 캐디" |
| 8 | fridge.askewly.com | CF Pages `askewly-fridge` | `~/projects/archive/askewly-fridge` | luma3-portfolio works.ts repoUrl `lumatic2/askewly-fridge` |
| 9 | askewly.com (apex) | Worker `askewly-company` | `~/projects/Askwely-company` | wrangler.toml name 일치 |
| 10 | brain.askewly.com | Worker `askewly-brain` | `~/projects/second-brain/poc-graph` | wrangler.toml name 일치 |
| 11 | account.askewly.com | Worker `earth-accounting-firm` | `~/projects/ai-accounting-firm/web` | wrangler.toml name 일치 |
| 12 | kifrs.askewly.com | Worker `kifrs-viz` | `~/projects/kifrs-rag/web` | wrangler.toml name 일치 |
| 13 | (workers.dev) askewly-knowledge-atlas | Worker | `~/projects/knowledge-graph/web` | wrangler.toml name 일치 |
| 14 | (route dashboard.askewly.com/*) dashboard-landing | Worker | `~/projects/askewly-command` (`scripts/cloudflare-dashboard-landing-worker.js`) | deploy-public-landing-worker.ps1 실측 |
| 15 | bizsim.askewly.com | Vercel | `~/projects/bizsim` | 동명 레포 (windows.json origin 일치) |
| 16 | bootcamp.askewly.com | Vercel | `~/projects/ai-bootcamp-2026` | manifest 매칭 |
| 17 | futsal.askewly.com | Vercel | **소스 원격 — `lumatic2/futsal-app` (M4)** | m4.json origin |
| 18 | guide.askewly.com | Vercel | `~/projects/ai-guide` | INDEX.md (learn.askewly.com 표기와 병존 — step-2 실측) |
| 19 | overrism.askewly.com | Vercel | `~/projects/archive/over-series-site` **추정** | layout.tsx title "OVER SERIES" |
| 20 | physical-ai-arm.askewly.com | Vercel | 관련 `~/projects/physical-ai` (americano-robot-arm 계보) | cover-letter GITHUB_AUDIT — **404 사망 표면** |
| 21 | portfolio.askewly.com | Vercel `luma3-portfolio` | `~/projects/luma3-portfolio` | .vercel/project.json 실측 |
| 22 | precon.askewly.com | Vercel | **소스 미상** — 로컬·manifest·프로필 전수 grep 0건 | step-2 라이브 실측으로 정체 판별 |
| 23 | robot-cleaner.askewly.com | Vercel | `~/projects/cleaning-context` (public SoT `Team-LG-Clean-Robot/cleaning-context`) | cover-letter GITHUB_PUBLIC_SURFACE 실사 |
| 24 | robotics.askewly.com | Vercel | `~/projects/physical-ai` | lumatic2 README ("피지컬 AI 랩 라이브 표면") |
| 25 | sixsense.askewly.com | Vercel `upstage-sixsense-staging` | `~/projects/archive/upstage-sixsense` | .vercel/project.json 실측 + INDEX.md(계속 서빙) |
| 26 | skku.askewly.com | Vercel | `~/projects/archive/skku-2026` 또는 `archive/skku-startup-hub` **미판별** | 동명 후보 2 — step-2 라이브 실측으로 판별 |
| 27 | ux.askewly.com | Vercel `ux-dictionary` | `~/projects/ux-dictionary` | .vercel/project.json 실측 |
| 28 | tax-benchmark.askewly.com | GitHub Pages (lumatic2.github.io) | `~/projects/ktaxbench-leaderboard` (원 벤치 `korean-tax-accounting-ax-benchmark`) | CNAME + 레포 빌드 산출물 실측 |
| 29 | prawn.askewly.com | A 76.76.21.21 (Vercel IP) | `~/projects/prawn` (+public mirror `prawn-public`) | .vercel/project.json 실측 — **무응답 사망 표면** |

step-1 검증: 행 29/29 (census 29 표면 1:1), 소스 칸 공란 0 (미상 1건은 "소스 미상" 명시 — #22).

## step-2 — 표면별 teardown 카드

(step-2 에서 채움 — 카드 형식: 관측[스크린샷 실측]·판정 3축[재료 등급/품질/중복]·harvest 후보 여부+근거 1줄)

## step-3 — harvest 후보 순위

(step-2 완료 후 — 순위표 + M21 첫 승격 추천 1~2건 + 사용자 확정 기록)
