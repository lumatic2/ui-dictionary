# Harvest 자산 전수 census — Cloudflare 계정 실측

> 2026-08-04 · 소비처: harvest 회수 계약 계획(`plans/2026-08-04-m20-harvest-teardown.md`) · 접근일: 2026-08-04
> 방법: wrangler(`pages project list`) + Cloudflare API(`workers/scripts`·`workers/domains`·`zones/dns_records`) + 전 표면 curl 라이브 스윕. 계정: askewly (zone `askewly.com`, 레코드 41건).

## 판정 요약

- **사용자 대면 웹 표면 29종** = Pages 8 + Workers 커스텀도메인 4 + Workers 무도메인(UI 추정) 2 + Vercel 13 + GitHub Pages 1 + prawn(A 레코드 직결) 1. (prawn-uptime 워커는 모니터 — 표면 아님, 비대상.)
- 라이브 스윕: 도메인 보유 27건 스윕 → **25건 HTTP 200**. 죽은 표면 2: `physical-ai-arm`(404) · `prawn`(무응답, A 76.76.21.21). 무도메인 워커 2건(askewly-knowledge-atlas·dashboard-landing)은 workers.dev 미확인 — teardown 에서 실측.
- 터널(cfargotunnel) 7건(`agent`·`api`·`brain-rag`·`dashboard`·`hermes`·`pulse`·`remote`)과 `cdn`(R2)·메일(MX/SPF/DKIM)은 **인프라 — harvest 비대상**.
- 주의: `ui.askewly.com` 의 실호스팅 = **Cloudflare Pages**(`ui-dictionary.pages.dev` CNAME 실측). 직전 핸드오프의 "Vercel 재배포" 표현은 부정확 — 기록 정정 대상.

## 표면 목록 (전건)

### Cloudflare Pages (8)

| 표면 | 도메인 | 최종 배포 | 라이브 |
|---|---|---|---|
| ui-dictionary | ui.askewly.com | 9시간 전 (git 연동) | 200 |
| development-dictionary | dev.askewly.com | 3주 전 | 200 |
| food-no-show | 음식노쇼.askewly.com (xn--bk1bs9o85bw39a) | 1개월 전 | 200 |
| americano-robot | americano-robot.askewly.com | 1개월 전 | 200 |
| askewly-accounting | accounting.askewly.com | 2개월 전 | 200 |
| askewly-tax | tax.askewly.com | 2개월 전 | 200 |
| askewly-golf | golf.askewly.com | 2개월 전 | 200 |
| askewly-fridge | fridge.askewly.com | 3개월 전 | 200 |

### Cloudflare Workers (7 — 커스텀 도메인 4 + 무도메인 3)

| 스크립트 | 도메인 | 최종 수정 | 라이브 |
|---|---|---|---|
| askewly-company | askewly.com (apex) | 2026-08-01 | 200 |
| askewly-brain | brain.askewly.com | 2026-07-19 | 200 |
| earth-accounting-firm | account.askewly.com | 2026-07-12 | 200 |
| kifrs-viz | kifrs.askewly.com | 2026-07-12 | 200 |
| askewly-knowledge-atlas | (커스텀 도메인 없음 — workers.dev 추정) | 2026-07-19 | 미확인 |
| dashboard-landing | (커스텀 도메인 없음 — workers.dev 추정) | 2026-07-31 | 미확인 |
| prawn-uptime | (모니터 워커 — UI 아님) | 2026-06-12 | 비대상 |

### Vercel (DNS CNAME `cname.vercel-dns.com`, 13)

| 도메인 | 라이브 |
|---|---|
| bizsim.askewly.com | 200 |
| bootcamp.askewly.com | 200 |
| futsal.askewly.com | 200 |
| guide.askewly.com | 200 |
| overrism.askewly.com | 200 |
| physical-ai-arm.askewly.com | **404** |
| portfolio.askewly.com | 200 |
| precon.askewly.com | 200 |
| robot-cleaner.askewly.com | 200 |
| robotics.askewly.com | 200 |
| sixsense.askewly.com | 200 |
| skku.askewly.com | 200 |
| ux.askewly.com | 200 |

### 기타 (2)

| 도메인 | 실체 | 라이브 |
|---|---|---|
| tax-benchmark.askewly.com | GitHub Pages (lumatic2.github.io) | 200 |
| prawn.askewly.com | A 76.76.21.21 (Vercel IP 직결) | **무응답** |

### 인프라 — harvest 비대상 (기록만)

- cfargotunnel 7: agent · api · brain-rag · dashboard · hermes · pulse · remote
- cdn.askewly.com → R2 public / 메일: MX(cloudflare) + SPF + DKIM + google-site-verification

## 다음 소비

- 이 census 가 M20 teardown(하나씩 뜯어보기)의 입력 목록. 소스 레포 매칭·스크린샷·harvest 재료 판정은 teardown ledger(`research/2026-08-04-m20-harvest-teardown-ledger.md` 예정)가 소유.
