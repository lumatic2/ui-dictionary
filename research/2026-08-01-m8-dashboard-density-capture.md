# M8 캡처 — 대시보드 밀도·저소음 위계 (Linear × Vercel/Geist)

Date: 2026-08-01 (접근일 동일)
Milestone: M8 · SaaS exemplar 흡수 (plan: `plans/2026-08-01-m8-saas-exemplar-absorption.md`)
소비처: `docs/research/loop/inbox.yml` batch `20260801-dashboard-density` → `knowledge/dashboard-density.md` + terms 보강
지위: 근거 동결 문서. 판정 규칙 정본은 `knowledge/dashboard-density.md`.

## 소스 (실브라우저, 접근일 2026-08-01)

| # | 문서 | URL | 비고 |
|---|---|---|---|
| S1 | Linear — A calmer interface for a product in motion | https://linear.app/now/behind-the-latest-design-refresh | 2026-03-12 게재 — 최신 리프레시 원칙 원문 |
| S2 | Geist — Introduction | https://vercel.com/geist/introduction | 시스템 구성 훑기(컴포넌트 카탈로그) |
| S3 | Geist — Colors | https://vercel.com/geist/colors | 10-스케일 역할 밴드 |

Linear 실제품 내부 화면은 로그인 벽 — 공식 블로그(리프레시 원문·전후 비교 서술)로 대체, 한계 기록.

## 관찰 — Linear (S1)

- **밀도 ≠ 소음**: 목표는 "rich density of information 을 유지하면서 압도감만 제거" — 밀도 감축이 아니라 소음 감축.
- **원칙 1 "Don't compete for attention you haven't earned"**: 태스크 중심 요소만 포커스 유지, 오리엔테이션·내비 요소는 후퇴 — 사이드바를 도착 후 몇 단계 어둡게, 데스크톱 탭은 전폭→콤팩트(라운드·아이콘/텍스트 축소).
- **아이콘 감축**: 인지 보조로 쓰되 과잉 시 사용량·크기 축소 + 컬러 배경 같은 장식 제거.
- **원칙 2 "Structure should be felt not seen"**: 보더·구분선은 이유 없이 증식한다 — 모서리 라운딩 + 대비 완화로 "보이지 않는 구조".
- **팔레트**: 쿨 블루계 → 저채도 웜 그레이로(과하면 muddy — 반복 실측으로 조정). 톤 무드 자체는 비이식, 원리(저채도 중립 + 반복 관측 조정)만 이식.
- **롤아웃 방법**: 피처 플래그 + dev toolbar 전후 비교 + 점진 통합(빅뱅 금지) — 프로세스 교훈, UI 표면 밖이라 이번 배치 보류 판정.

## 관찰 — Geist (S3)

- 10-스케일이 **역할 밴드**로 잘림: 1–3 컴포넌트 배경(default/hover/active) · 4–6 보더(default/hover/active) · 7–8 고대비 배경 · 9–10 텍스트·아이콘(secondary/primary).
- 페이지 배경은 2단뿐 — Background 1 기본, **Background 2 는 미묘한 구분이 필요할 때만 아껴서**.
- 인터랙션 상태는 새 색이 아니라 **스케일 인접 단계**로 표현(배경이 Background 1 이면 hover=Color 1·active=Color 2).
- 텍스트 위계 = 2단(secondary 9 / primary 10) — 대비로 위계를 만들고 단계 수는 최소.

## knowledge 결정표 재료

| 축 | 규칙 후보 | 근거 |
|---|---|---|
| 밀도 | 밀도는 유지하고 소음(보더·아이콘·밝기)을 줄인다 | S1 |
| 주의 배분 | 내비·오리엔테이션 표면은 도착 후 시각적으로 후퇴 | S1 |
| 구분선 | 기본값은 "없음" — 여백·라운딩·배경 미차로 먼저 구분하고 보더는 최후 수단 | S1 |
| 아이콘 | 스캔 보조 목적일 때만·장식 배경 금지·크기 절제 | S1 |
| 상태색 | hover/active 는 새 색이 아니라 같은 스케일 인접 단계 | S3 |
| 배경 층 | 페이지 배경 2단 상한 — 2단째는 아껴서 | S3 |
| 텍스트 위계 | primary/secondary 2단 원칙 — 3단 이상은 위계 실패 신호 | S3 |

## 비이식

Linear 다크 무드·정확한 그레이 값·Geist 흑백 아이덴티티·P3 색 값 — look 은 토큰 소유.
