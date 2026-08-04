# M25 — harvest 배치 4 evidence (2026-08-04)

> 보고: docs/reports/2026-08-04-m25-harvest-batch4.md · plan: archive/plans/2026-08-04-m25-harvest-batch4.md · changeset: changesets/20260804-m25-harvest-batch4

## 승격 (registry 48 → 55)

| 자산 | 형태 | 게이트 경로 |
|---|---|---|
| glow-points-scene-impl | three 정적 (셰이더·블룸·dispose) | deps `["three"]` — 선언 npm 의존 1호 |
| glow-points-scene | lazy wrapper·WebGL 폴백·에러 바운더리 | regDeps → impl URL |
| palette-generator-core | 코어 lib 354줄 정본 이전 (구 경로 shim) | — |
| color-palette-generator | 도구 836줄 추출 (Colors·홈 공유 소비 유지) | regDeps → core URL |
| cursor-reactive-field | home-page 추출 (상태·감쇠·글리프 필드 캡슐화) | — |
| auth-gate-modal / focus-hud-overlay | brain viewer.html 시맨틱 React 재작성 | regDeps → button/input |

- 게이트 부수: `react-dom` 기본 표면 편입 (flushSync — 기존 53건 diff 0).

## 검증 실측 (요지)

- 순수 추가 체인: 48→49→51→53→55, 각 단계 기존 per-item diff 0 (porcelain index 만 M).
- 시각 회귀: Colors 페이지 로컬 vs 라이브 풀페이지 동일 (m25-colors-local/live.png).
- WebGL 폴백: `addInitScript` getContext(webgl/webgl2)→null 스텁 → 폴백 노드 표시·canvas 0 (결정적).
- 씬 시간차: element 스크린샷 2장 상이(43,698≠45,420B — 궤도/breath), 신선 렌더 육안(3클러스터·헤일로·발광 엣지 — m25-glow-t1/t2.png).
- 실발화: 커서 0→54→13 · 모달 닫기 3경로·aria · HUD pointer-events none · 팔레트 Generate 교체·잠금 생존·셰이드 10단·복사 토스트.
- 통합 E2E: fetch 7종 의존 체인 전건 해석·tsc 0·콘솔 0 (m25-e2e-t1/t2.png).
- 사용자 관측 통과 ("그래 통과") — 보드 artifact 5ae085df M25 섹션.

## 이월·finding

- 씬 계약 밖 명시 이월: brain 2D 폴백·3D 라벨 오버랩 회피·raycast hover (소비자 몫).
- finding: 재생성 전 public/r 서빙 프로세스 정리 필요 (EPERM 실발생). 승계: CLI verify chart.tsx 오탐.
