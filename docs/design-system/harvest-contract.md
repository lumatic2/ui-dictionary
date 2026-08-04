# 회수 계약(하베스트) — 자기 산출물을 저장고 자산으로 승격하는 절차

Date: 2026-08-04
Milestone: M21 (plan: `plans/2026-08-04-m21-harvest-contract.md`)
지위: **자기 산출물**(해커톤·사이드 프로젝트·배포 표면)이 Askewly Design 저장고(registry asset/block)로 되돌아오는 경로의 정본. 외부(타인) 자산 흡수는 `absorption-criteria.md` 소유 — 이 계약은 자기 것 전용이며, 저장고→착수(블록·킥스타트, `block-contract.md`)의 출력 루프와 짝을 이루는 **입력 루프**다.

Audience: 에이전트 + 시스템 관리자.

## 1. 언제 도는가

- 배포 표면·프로젝트가 하나 완성될 때마다(해커톤 마감, 사이드 프로젝트 출시) 1회. 또는 주기적 전수 teardown(선례: M20, `research/2026-08-04-m20-harvest-teardown-ledger.md`).
- 입력은 **라이브 실측**이다 — 코드 트리가 아니라 실브라우저 관측(스크린샷)에서 시작한다. 죽은 표면은 실측 코드(404/timeout)와 함께 사망 기록으로 남긴다.

## 2. 후보 판정 축 (M20 결정 2 승계)

| 축 | 판정 |
|---|---|
| ① 재료 등급 | 블록 / 패턴 / 토큰 / 모션 / 없음 — 구체 후보(어떤 컴포넌트·팔레트·모션인지)를 명시 |
| ② 품질 | 상/중/하 — 타이포 위계·간격 일관성·색 체계의 의도성·generic 템플릿 티 |
| ③ 중복 | 기존 registry 자산·블록 전건 대조 — 겹치면 신규 등재 금지(§5) |

**④ 취향 게이트 (M20 교훈)**: ①~③ 은 에이전트 판정이지만 최종 풀은 **사용자 취향이 소유**한다 — M20 실측에서 사용자는 신규성·품질 상위 후보를 기각하고 브랜드 개성 축으로 풀을 확정했다("AI slop 느낌" 기각). 순위표는 추천일 뿐, 승격 풀 확정은 항상 사용자 관측 게이트를 거친다.

## 3. 승격 절차 (표준 6단)

1. **재료 추출** — 소스 레포에서 해당 컴포넌트/패턴 코드를 격리. 소스가 원격·타 기기·빌드 산출물뿐이면 원소스 확보가 선행(빌드 산출물 역추출 금지).
2. **restyle 정규화** — 하드코딩 색·치수를 토큰/CSS 변수로 치환(`component-restyle.md` 의무). look 은 소비 프로젝트 토큰 소유 — 원 프로젝트의 브랜드 아이덴티티(로고·일러스트·고유 팔레트)는 자산에 싣지 않고 §4 출처 표기로만 남긴다.
3. **요구 변수 선언** — 사용하는 CSS 변수 전건을 registry 항목 `requiredCssVars` 로 선언(M19 계약 승계).
4. **registry 등재** — 사이트 소스 SSOT(`examples/ui-vocabulary-site/src/components/…`)에 배치 후 `node scripts/generate-registry.mjs` 재생성. 등급은 기존 그릇만: 컴포넌트급 = asset, 페이지/앱 골격급 = 블록(`block-contract.md`). 신설 등급 금지.
5. **검증 체인** — 기존 자산 재생성 diff 0 + purity gate PASS + 사이트 `npm run build`·`npm run lint` PASS + 신선 프로젝트 이식 E2E(fetch→이식→restyle→`npx @askewly/design verify` 0건→실브라우저 스모크).
6. **사용자 관측** — 승격 실물 1회 관측 후 마감. 문서·recipe 배선이 필요하면 llms 재생성(`FIXED_ASSETS` 수동 등재 규칙 — absorption-criteria §원칙류 소스 L28)까지가 마감 범위.

## 4. 출처 표기

자기 산출물이라도 이력을 명시한다 — 자산 파일 헤더 주석 1줄 + registry `meta` 에: 원 프로젝트(레포 경로 또는 GitHub URL) · 라이브 URL · 회수일. 원 프로젝트가 팀 작업물이면(예: 공모전 팀 레포) 팀 표기를 유지한다.

## 5. 중복 규칙

- 기존 자산과 구조가 겹치면 **신규 등재 대신 기존 자산 보강**(변형 추가·문서 절 추가) 또는 기각. 같은 계열 후보가 복수면(예: 지식 그래프 캔버스 2종) 완성도 높은 하나만.
- 판정 근거는 teardown 장부의 카드(③ 중복 열)가 정본 — 승격 시 그 행을 인용한다.

## 6. 관련 계약

- `absorption-criteria.md` — 외부 자산 흡수(3분기 A/B/C). harvest 후보가 외부 코드를 포함하면 그쪽 라이선스 규칙이 함께 적용된다.
- `block-contract.md` §7/§8 — 블록급 승격물의 소비 경로. `component-restyle.md` — restyle 의무. `agent-asset-model.md` `copy_scope` — 승격물 범위 선언.
- entry-protocol — 신규 자산 유입 경로로서의 backlink.

## 부록 — 재현 절차 (첫 실증 M21 실측 시퀀스)

다음 산출물을 회수할 때 그대로 반복한다 (M21 2026-08-04 실측 — zigzag-story-section·terminal-demo-panel):

```
1. 소스 격리:   원 레포에서 대상 섹션/컴포넌트 파일 확인 (예: Askwely-company web/src/app/page.tsx building-section)
2. 재작성:      examples/ui-vocabulary-site/src/components/<name>.tsx — shadcn 시맨틱 클래스만, 헤더에 출처 주석 1줄
3. 등재 선언:   examples/ui-vocabulary-site/registry.json 에 item 추가 (meta.harvest: origin·liveUrl·harvestedAt)
4. 재생성:      node scripts/generate-registry.mjs   ← 기존 자산 diff 0 + purity gate가 회귀를 막는다
5. llms 반영:   node scripts/generate-llms-txt.mjs && node scripts/check-llms-sync.mjs (PASS 확인)
6. 사이트 게이트: cd examples/ui-vocabulary-site && npm run build && npm run lint
7. 신선 E2E:    킥스타트(init --block … --registry <로컬 서빙>)로 신선 프로젝트 → /r/<name>.json fetch 이식
               → CLI verify 0건 → dev 서버 실브라우저 스크린샷 관측 (정적 캡처가 아니라 시간차 2장 이상 — 모션 결함은 한 장에 안 잡힌다)
8. 사용자 관측: 실물 1회 → 마감
```

실측 교훈 (M21): ⑦ 의 실브라우저 관측이 정적 게이트 전부(빌드·lint·verify·purity)를 통과한 모션 결함(effect deps 의 inline-prop identity 리셋 루프)을 잡았다 — 시간차 스크린샷을 생략하지 않는다.

## Changelog

- 2026-08-04: 초판 — M21. 판정 축(M20 승계)+취향 게이트, 표준 6단 절차, 출처 표기, 중복 규칙.
