# 조사 노트 — Material Design 3 토큰 체계

> SMC0 시장 포맷 조사. 수집: 2026-07-07, sonnet 리서치 에이전트. 게이트 검증 완료.
> 게이트 정정: 원 노트의 "Askewly는 웹 단일 타깃" 전제는 Objective(모바일·크로스 표면 포함)와 어긋남 — 채택 관점 ③은 그 전제를 제외하고 읽을 것. 멀티 플랫폼 export는 "지금 불필요"가 아니라 "SSOT에서 파생 가능하게 남겨둘 것"이 정확한 결론.

## 1. ref / sys / comp 3계층

- **`md.ref`** (Tier 1): raw 값 — hex, tonal palette tone, 크기, 폰트. 예: `md.ref.palette.primary40`.
- **`md.sys`** (Tier 2): ref에 역할(role) 부여 — `md.sys.color.primary`, `md.sys.color.surface`. **light/dark 분기가 이 레이어에서 발생.**
- **`md.comp`** (Tier 3): sys를 컴포넌트 속성에 매핑 — `md.comp.fab.container.color`. 전역을 건드리지 않는 컴포넌트별 override 지점.
- 네이밍: `md.<tier>.<category>.<role/component>.<property>` dot-path → CSS로는 `mat-sys-*` prefix.

## 2. 단방향 참조 규칙

**comp → sys → ref, 역방향 금지.** 예: `md.comp.button.container.color` → `md.sys.color.primary` → `md.ref.palette.primary40`. comp가 ref를 직접 참조하지 않는 것이 원칙(실무 누수 비판 존재).

## 3. Dynamic color / 테마 연동

- seed color 1개 → 알고리즘이 5개 key color × 13 tone tonal palette 생성(= ref 레이어) → sys가 role별로 tone을 선택하되 **light/dark 스킴별로 다른 tone 매핑** → comp 소비.
- WCAG 대비가 tonal palette tone 간격 설계에 내장 — role 매핑을 따르면 기본 접근성 보장.

## 4. 코드 배포 형태

Android XML(Material Theme Builder), Jetpack Compose(`MaterialTheme.colorScheme.*`), Web CSS(`mat-sys-*` 변수). Flutter/JSON 중립 포맷 확장은 **미확인**(블로그 수준).

## 5. 알려진 비판·한계

- **Token bloat**: M3 관련 800+ 토큰 수치 언급(1차 출처 **미확인**), 엔터프라이즈 시스템의 미참조 토큰 문제.
- **컨텍스트 누수**: `-on-primary` 계열이 스코프 제한 없이 전역 노출 → 오용 위험.
- **네이밍 복잡도**: `M3/sys/dark/tertiary-fixed-...` 식 긴 이름의 탐색성 저하.
- 멀티 브랜드 시 토큰 파일 증식·drift.

## 6. Askewly Design 채택 관점

가져올 것: ① 엄격한 단방향 참조(comp→sys→ref)를 우리 3-tier lint 규칙으로 강제 ② sys(semantic) 계층에서의 light/dark 분기(같은 semantic 이름이 테마별 다른 primitive를 가리킴) ③ 생성적 primitive 레이어(seed + 생성 규칙로 관리 비용 절감) 개념.

안 맞는 것: ① comp tier의 M3식 세분화 폭발(우리 규모에선 과설계 — comp 토큰 최소주의) ② Dynamic Color의 OS 통합 전제(배경화면 seed 추출) ③ ~~멀티 플랫폼 export 불필요~~ (게이트 정정: 우리도 크로스 표면 목표 — 단 M3식 플랫폼별 중복 아티팩트가 아니라 SSOT 파생으로 달성).

## 7. 출처

- https://m3.material.io/foundations/design-tokens/overview
- https://m3.material.io/styles/color/system/how-the-system-works
- https://developer.android.com/develop/ui/compose/designsystems/material3
- https://material-web.dev/theming/material-theming/
- https://andretorgal.com/posts/2025-01/the-problem-with-design-tokens
