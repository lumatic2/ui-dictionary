# 디자인 시스템 포맷 조사 — 비교와 채택 기준

Date: 2026-07-07
Milestone: SMC0 (horizon `system-model-core`)
Method: sonnet 리서치 에이전트 6개 병렬 fan-out → Fable 게이트 검증·합성. 원본 노트: `docs/market/format-survey-notes/`

## 목적

SMC1(토큰 SSOT)·SMC3(레시피 포맷)의 스키마를 설계하기 전에 기존 포맷 선례를 조사해, 근거 없는 스키마 설계로 인한 재작업을 방지한다.

## 비교표

| 축 | DTCG | Radix Themes | shadcn registry | Vercel Geist | Material 3 | Stitch DESIGN.md |
|---|---|---|---|---|---|---|
| **본질** | 토큰 교환 표준 (JSON) | 테마 프리셋 + 컴포넌트 | 코드+토큰 배포 시스템 | 사내 시스템의 공개 문서 | OS급 3-tier 토큰 체계 | 에이전트용 단일 파일 |
| **토큰 계층** | group 컨벤션 (tier 비강제) | 12-step 용도 규약 + semantic alias | cssVars (semantic만) | 10-step numbered + semantic alias | ref→sys→comp 단방향 강제 | frontmatter 중첩 (primitive/semantic/component) |
| **light/dark** | 스펙 밖 (구현자 몫) | 서드파티 위임 | cssVars 테마 섹션 | 미확인 | sys 계층 분기 (핵심 설계) | 명시 필드 없음 (alpha) |
| **배포 형태** | `.tokens.json` | npm CSS 파일 | item 단위 파일 복사 (코드+토큰 원자) | npm + `.md` raw URL | 플랫폼별 아티팩트 | 단일 markdown |
| **에이전트 표면** | 도구 생태계 경유 | 없음 | **MCP + llms.txt** | **`.md` raw 접근** | 없음 | **그 자체가 에이전트 포맷** |
| **성숙도** | 2025.10 첫 stable (living) | 안정 | 안정·활발 | 안정 (사내 우선) | 안정 (비판 축적) | **alpha** |

## 선례별 핵심 교훈 (한 줄)

- **DTCG**: 토큰 값의 교환 포맷으로는 사실상 표준이 됐지만, 3-tier 규칙은 스펙이 강제해주지 않는다 — 자체 lint가 필수.
- **Radix**: step 번호에 용도를 고정한 규약(3=default, 8=focus ring…)은 사람·에이전트가 같은 어휘로 소통하게 만드는 가장 값싼 장치다.
- **shadcn**: 레시피 하나에 코드와 그 코드가 쓰는 semantic 토큰을 함께 패키징하면 "설치=코드+토큰"이 원자적이 된다. MCP+llms.txt 병행이 에이전트 표면의 현재 모범.
- **Geist**: 같은 소스에서 사람 페이지와 `.md` raw를 파생시키는 URL 설계는 저비용 고효과. 단 props 정보를 예시로만 전달하는 방식은 에이전트에게 부족하다.
- **Material 3**: 단방향 참조(comp→sys→ref)와 sys 계층 light/dark 분기는 그대로 가져올 것. comp 토큰 세분화 폭발(token bloat)은 그대로 피할 것.
- **에이전트 포맷 선례**: 토큰=구조화 데이터 / rationale=산문 분리, 발견(llms.txt)과 질의(MCP) 계층 분리, 안티패턴의 스펙 강제 섹션화가 공통 원칙.

## 채택 기준 (Askewly Design 포맷 결정)

SMC1~SMC3 설계는 아래 기준을 따른다.

### A. 토큰 SSOT (SMC1 입력)

1. **DTCG-호환 JSON/YAML을 SSOT 값 포맷으로 채택**한다 — `$value`/`$type`/alias 문법을 따르되, 스펙이 living standard이므로 stable 2025.10 기준으로 고정하고 draft 기능은 쓰지 않는다. 현 `DESIGN.md` frontmatter의 `{value, type}` 표기는 이미 이 방향과 정합.
2. **3-tier는 group 네이밍(`primitive`/`semantic`/`component`) + 자체 lint로 강제**한다: component→semantic→primitive 단방향 참조(M3 규칙), 역참조·건너뛰기 lint 에러. WCAG contrast 검사 포함.
3. **primitive scale에 용도 고정 규약을 부여**한다(Radix 12-step 또는 Geist 10-step 모델 참고 — 단계 수는 SMC1에서 확정). 규약 문구 자체가 사이트 문서와 에이전트 프롬프트의 공용 어휘가 된다.
4. **light/dark는 semantic 계층에서 분기**한다(M3 sys 모델): 같은 semantic 이름이 테마별로 다른 primitive를 가리킨다. 서드파티 위임(Radix 방식)은 에이전트 구현 편차를 낳으므로 채택하지 않는다.
5. **component 토큰은 최소주의**: 전역 semantic으로 표현 안 되는 override 지점에만 생성(M3 token bloat 반면교사). 미참조 토큰은 lint로 적발.

### B. 레시피/배포 포맷 (SMC3 입력)

6. **레시피 = 코드 + 자기가 참조하는 semantic 토큰 선언의 원자 패키지**(shadcn item 모델). 값은 레시피에 하드코딩하지 않고 SSOT에서 resolve.
7. **배포는 "복사해 소유" 모델**: npm 패키지·CLI를 만들지 않고, 사이트의 코드 복사와 (향후) implementation pack 다운로드가 소비 채널. 단 레시피 메타데이터(안정적 kebab-case id, dependency 필드)는 처음부터 기계 질의 가능 형태로 유지해 후일 MCP화 비용을 낮춘다.
8. **문서 구조는 "API Reference + variant 조합 예시 + Best Practices"**(Radix+Geist 혼합): 에이전트를 위해 명시적 props/토큰 표를 두고, 사람을 위해 조합 예시를 둔다.

### C. 에이전트 표면 (SMC3·차기 horizon 입력)

9. **DESIGN.md는 유지하되 SSOT가 아니라 파생물**로 재정의한다: 토큰 SSOT(A-1)에서 DESIGN.md frontmatter를 생성하는 매핑 계층을 둔다(Stitch 스펙이 alpha라 1:1 강결합 금지). Do's and Don'ts(안티패턴)는 필수 섹션.
10. **`ui.askewly.com/llms.txt`를 인덱스로 추가**한다 — 링크만, 값 중복 금지. Geist식 `.md` raw 접근(같은 소스에서 사람 페이지·markdown 파생)을 사이트 설계에 반영.
11. **MCP 서버는 지금 만들지 않는다** — 7번의 기계 질의 가능 메타데이터가 그 준비물이다.

## 후속 검증 큐 (미확인 항목)

- DTCG stable 2025.10 원문과 draft의 세부 차이 (특히 color 타입 구조) — SMC1 구현 직전 대조.
- Figma Variables의 DTCG export 정확도 — Figma Bridge horizon(FGB1) 진입 시 검증.
- Geist의 light/dark 메커니즘·component tier 존재 여부 — 필요 시 추가 캡처.
- M3 토큰 수치(800+)·Supernova 통계는 블로그 재인용 — 인용 시 1차 출처 확인.

## Changelog

- 2026-07-07: 최초 작성 (SMC0 완료 산출물).
