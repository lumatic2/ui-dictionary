# Mobile Navigation & Modality — 컨테이너 선택 판정 규칙

Date: 2026-08-01
Milestone: M7 (plan: `plans/2026-08-01-m7-platform-guideline-absorption.md`)
지위: 모바일 화면에서 내비게이션 컨테이너와 모달 표면을 고르는 판정 규칙의 정본. 근거 원문은 `research/2026-08-01-m7-mobile-nav-sheets-capture.md` 에 동결(출처 URL·접근일 포함) — 이 문서는 판정 규칙만 담고 원문을 재서술하지 않는다. Apple HIG × Material 3 를 대조해 플랫폼 공통 규칙과 분기 지점을 가른다.

Audience: 에이전트(모바일 화면 생성 시 필수 참조) + 사람.

## 1. 주 내비게이션 컨테이너 선택

**화면당 주 내비게이션 컴포넌트는 1개다.** drawer + bottom bar 동시 사용은 안티패턴.

| 조건 | 컨테이너 | 근거 |
|---|---|---|
| 최상위 목적지 3~5개 · compact(폰) | bottom navigation / tab bar | M3 3~5 규칙 · HIG 탭바 |
| 목적지 3개 미만 | 페이지 내 tabs (주 내비 아님) | M3 — nav bar 금지 |
| 목적지 5개 초과 · medium+ | navigation rail (확장형) 또는 사이드바 전환 | M3 Expressive · HIG sidebarAdaptable |
| 목적지 5개 초과 · compact | 탭 커스터마이즈(기본 ≤5) 또는 rail 로 승격 | HIG iPadOS 커스터마이즈 |
| 데스크톱/expanded | rail·사이드바 — bottom bar 금지 | M3 |
| **navigation drawer 신규 채택** | **비권장** — 확장형 rail 이 대체 (M3 Expressive, 2026-08-01 확인) | 기존 제품 유지만 허용 |

## 2. 주 내비게이션 행동 계약

1. **탭 전환은 탭/클릭만** — 좌우 스와이프로 목적지를 전환하지 않는다(스와이프는 카드 캐러셀·행 액션 몫).
2. **상태 계약을 명시적으로 정한다** — preserve(스크롤·하위 탭·검색 유지) vs reset. 섹션을 자주 오가는 앱은 preserve.
3. **활성 목적지 재선택 = 최상단 스크롤.**
4. **탭 숨김·비활성 금지** — 내용이 없으면 빈 섹션에 이유를 보여준다.
5. **라벨 필수** — 1~2 단어, 줄바꿈·축소·제거 금지. 활성 표시는 1개만.
6. **스크롤 숨김은 스크린리더 활성 시 끈다.** FAB 는 바 위에, 바를 가리지 않는다.
7. **배지는 critical 정보만** — 남용하면 의미가 죽는다.

## 3. 모달 표면 선택 (태스크 무게로 가른다)

| 태스크 | 표면 | 핵심 계약 |
|---|---|---|
| 저중요 알림 (액션 선택적) | snackbar/toast | 비차단·자동 소멸 — dialog 금지 |
| 고중요 결정·확인 | dialog | 액션 ≤2(확인 트레일링) · 제목은 구체 질문 · 제3의 이동 버튼 금지 |
| 맥락 밀착 짧은 선택·목록 | modal bottom sheet | 초기 높이 ≤50% · scrim 탭/스와이프 dismiss · 초과분은 풀확장+내부 스크롤 |
| 메인 UI 와 병행 사용 | standard bottom sheet (nonmodal) | scrim 없음 · 동시 상호작용 (예: 미니 플레이어) |
| 키보드 폼·비즉시 저장·다단 작성 | full-screen dialog (compact 전용) | 확인 = 구체 동사(Send/Create) · 비활성화 금지 · 미저장 닫기 확인 · 큰 화면은 basic dialog 로 스왑 |
| 리사이즈 가능한 시트 | detent + grabber | medium detent = 점진 공개 · compose 류는 full-height 만 · grabber 가 스크린리더 리사이즈 경로 |

## 4. 모달 깊이 규칙

- **모달 깊이 = 1.** 시트 위에 시트를 쌓지 않는다 — 첫 시트를 닫고 다음을 연다.
- 예외 2개뿐: ① alert 는 모든 것 위에 뜰 수 있다(동시 1개만) ② full-screen dialog 위에는 basic dialog(미저장 확인·실패 통보)만 허용.
- 해제 경로는 항상 2개 이상(버튼 + 스와이프/scrim) + 데이터 유실 위험 시 확인 단계.

## 판정 절차 (에이전트 의무)

1. 모바일 화면을 만들기 전에 목적지 수·브레이크포인트로 §1 표에서 컨테이너를 정한다 — "모바일이니까 햄버거 메뉴"는 금지 수(§1 마지막 행).
2. 오버레이가 필요하면 §3 표에서 태스크 무게로 표면을 정하고 §4 깊이 규칙을 검사한다.
3. 규칙과 다른 선택을 하면 그 이유를 산출물에 한 줄 남긴다(플랫폼 규범 이탈은 의도여야 한다).
4. 스타일(Liquid Glass·M3 색 역할·인디케이터 모양)은 흡수 대상이 아니다 — look 은 프로젝트 토큰 소유.

## Changelog

- 2026-08-01: 초판 (M7) — HIG(tab-bars 2026-06-08판·sheets·modality) × M3(navigation-bar·bottom-sheets·dialogs·navigation-drawer) 실브라우저 캡처 기반. M3 Expressive drawer 비권장 반영.
