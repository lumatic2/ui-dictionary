# M7 캡처 — 모바일 내비게이션·시트 (Apple HIG × Material 3)

Date: 2026-08-01 (접근일 동일)
Milestone: M7 · 플랫폼 가이드라인 흡수 (plan: `plans/2026-08-01-m7-platform-guideline-absorption.md`)
소비처: `docs/research/loop/inbox.yml` batch `20260801-mobile-nav-sheets` → `knowledge/mobile-navigation.md` + terms 보강
지위: 근거 동결 문서. 판정 규칙 정본은 `knowledge/mobile-navigation.md`, 이 문서는 원문 관찰만 담는다.

## 소스 (전부 실브라우저 확인, 접근일 2026-08-01)

| # | 문서 | URL | 문서측 최종 갱신 |
|---|---|---|---|
| S1 | Apple HIG — Tab bars | https://developer.apple.com/design/human-interface-guidelines/tab-bars | 2026-06-08 (Liquid Glass 용어 반영) |
| S2 | Apple HIG — Sheets | https://developer.apple.com/design/human-interface-guidelines/sheets | 2026-03-24 (버튼 배치 갱신) |
| S3 | Apple HIG — Modality | https://developer.apple.com/design/human-interface-guidelines/modality | 2023-12-05 |
| S4 | Material 3 — Navigation bar | https://m3.material.io/components/navigation-bar/guidelines | (표기 없음) |
| S5 | Material 3 — Bottom sheets | https://m3.material.io/components/bottom-sheets/guidelines | (표기 없음) |
| S6 | Material 3 — Dialogs | https://m3.material.io/components/dialogs/guidelines | (표기 없음) |
| S7 | Material 3 — Navigation drawer | https://m3.material.io/components/navigation-drawer/guidelines | M3 Expressive 비권장 공지 게시 |

## 관찰 — 내비게이션 컨테이너

- **S1**: 탭바는 내비게이션 전용(액션은 toolbar) · 탭 숨김/비활성 금지(빈 섹션은 이유 설명) · overflow(More 탭) 회피 · 라벨 단어 1개 권장 · 배지는 critical 정보만 · iOS 는 하단 플로팅(Liquid Glass), iPadOS 는 상단 배치 + `sidebarAdaptable`(탭바↔사이드바 전환, 복잡한 앱은 사용자 커스터마이즈 허용 — 기본 5개 이하 권장) · 콘텐츠가 화려하면 탭바는 모노크롬 우선.
- **S4**: 목적지 3~5개 규칙 — 3 미만은 tabs 로, 5 초과는 modal expanded navigation rail 등으로 · 모바일/태블릿 전용(데스크톱 금지 — rail/tabs 사용) · 라벨 제거 금지·줄바꿈/축소 금지 · active = filled 아이콘 + 인디케이터 1개만 · 아이콘-컨테이너 대비 3:1 · 상태 전환은 preserve state vs reset state 중 제품이 선택, 활성 탭 재선택 = 최상단 스크롤 · **스와이프로 목적지 전환 금지** · 스크린리더 활성 시 스크롤 숨김 금지 · FAB 는 탭바 위(가림 금지).
- **S7**: **M3 Expressive 업데이트에서 navigation drawer 는 비권장 — expanded navigation rail 로 대체 권고** (2026-07-04 baseline 리서치엔 없던 규범 변화) · 유지 시: 5+ 목적지/2+ 위계·standard(expanded+)와 modal(compact/medium) 분기 · **한 화면에 주 내비게이션 컴포넌트 2개 동시 사용 금지**(drawer+bar 조합 회피) · 320px 미만 웹은 drawer→bar 강제.

## 관찰 — 시트·다이얼로그 (모달리티)

- **S3**: 모달은 명확한 이득이 있을 때만 · 모달 태스크는 짧고 단순하게("앱 속 앱" 금지) · **모달 위 모달 금지**(alert 만 예외, alert 도 동시 1개) · 닫기 경로는 플랫폼 관례(상단 버튼/스와이프) · 데이터 유실 위험 시 확인(action sheet) 후 닫기.
- **S2**: 시트 = 현재 맥락에 밀착된 좁은 태스크 · iOS/iPadOS 만 nonmodal 시트 허용(포맷 팔레트류) · **detent**: large/medium 시스템 정의 + 커스텀, medium = 점진 공개(공유 시트), compose 류는 full-height 만 · resizable 시트에 grabber 필수(VoiceOver 리사이즈 경로) · 스와이프 dismiss 기대 + 미저장 변경 시 action sheet 확인 · Done 은 Cancel/Back 과 짝(3개 동시 금지) · 메인 인터페이스에서 시트는 동시 1장.
- **S5**: bottom sheet 분기 = standard(메인 UI 와 공존·동시 상호작용, 예: 미니 플레이어) vs modal(스크림·전 기능 차단) · **modal 초기 높이 ≤ 화면 50%**, 초과분은 풀스크린 확장 후 내부 스크롤 · drag handle 은 프리셋 높이 순환 + 단일 포인터 대체 수단 필수 · 데스크톱/expanded 에선 side sheet 로 교체 고려 · 풀스크린 모달 시트엔 close affordance 필수.
- **S6**: dialog = 고중요·차단(저중요는 snackbar — 중요도×액션 필요 여부 매트릭스) · **액션 최대 2개**(확인+해제, 3번째 Learn more 금지 — 인라인 확장으로 대체) · 확인 버튼이 해제보다 트레일링 · 헤드라인에 사과·경고·모호("Are you sure?") 금지 · basic vs full-screen 분기: 키보드 입력 폼·비즉시 저장·다이얼로그 위 다이얼로그 필요 → full-screen(compact 전용, 큰 화면은 basic 으로 스왑) · full-screen 확인 액션은 구체 동사(Send/Create, Done/OK 금지)·비활성화 금지, 미저장 닫기 시 basic dialog 확인 · 필드 에러는 인라인, 일반 에러만 dialog.

## 플랫폼 대조 요점 (knowledge 결정표 재료)

| 축 | Apple | Material | 시스템 규칙 후보 |
|---|---|---|---|
| 주 내비 컨테이너 | 탭바(하단, iPad 는 상단/사이드바 전환) | nav bar 3~5개(compact/medium 전용) | 목적지 수·플랫폼·브레이크포인트로 컨테이너 선택, 화면당 주 내비 1개 |
| 5+ 목적지 | 사이드바 전환/커스터마이즈 | (Expressive) expanded nav rail — drawer 비권장 | drawer 신규 채택 금지, rail/사이드바 우선 |
| 시트 용도 | 맥락 밀착 좁은 태스크, detent 점진 공개 | supplementary content/액션, modal ≤50% | "태스크 무게"로 시트 vs 풀스크린 가름 |
| 다이얼로그 | alert = critical 전용 | dialog = 고중요 차단, 액션 ≤2 | 저중요는 비차단 채널(snackbar/toast) |
| 중첩 | 모달 위 모달 금지(alert 예외) | full-screen dialog 위에만 basic 허용 | 모달 깊이 1 원칙 |
| 해제 | 스와이프+버튼, 미저장 확인 | scrim 탭·스와이프·close affordance | 해제 경로 ≥2 + 데이터 유실 가드 |

## 비이식(Non-transferable)

Liquid Glass 머티리얼·SF Symbols 지정·M3 색 역할명·활성 인디케이터의 구체 모양/모션 수치 — 스타일은 토큰 소유 원칙에 따라 흡수하지 않는다.
