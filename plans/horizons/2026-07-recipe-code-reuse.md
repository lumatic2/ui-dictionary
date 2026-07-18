# Horizon — Recipe Code Reuse (레시피 코드 자산화 + 스튜디오 연결)

Date: 2026-07-19
Status: proposed
Objective link: `OBJECTIVE.md` (성공 상태 ③ 에이전트 소비 — 문서 읽고 재구현 → 검증된 코드에서 출발로 격상 / 이동 축 "시각적 영감에서 → 구현 가능한 코드·에셋·에이전트 가이드로")
Preceding horizon: `plans/horizons/2026-07-studio-finish.md` (closed 2026-07-19)

## Goal

사이트에 이미 존재하는 레시피 데모 실구현(.tsx ~54개)을 **배포 가능한 코드 자산**으로 만들어, ① 에이전트가 레시피 문서를 읽고 매번 재구현하는 대신 검증된 코드에서 출발해 프로젝트 토큰으로 리스타일하고 ② 브리프 스튜디오의 구성 선택이 해당 레시피 코드 조합으로 이어지게 한다 (사용자 발의 2026-07-19: "사이트의 템플릿들을 활용할 수 있었으면").

## Why Now

- 자산 비대칭 실측: 레시피 42종의 llms 배포는 **문서(md)뿐** — 같은 레시피의 동작하는 React 구현이 사이트에 있는데 재사용 경로가 없다. 에이전트는 문서→재구현으로 매번 품질 분산을 만든다.
- studio-finish가 구성 축(13항 카탈로그)을 완편함 — 구성 선택과 레시피 구현 사이 다리가 다음 병목.
- 배포 포맷은 발명 불요 — shadcn registry 호환이 의존 선언·소비 CLI·에이전트 fetch 경로를 공짜로 준다 (`research/2026-07-19-recipe-code-reuse-shadcn-registry.md`).

## 리서치

- `research/2026-07-19-recipe-code-reuse-shadcn-registry.md` — 배포 포맷(shadcn registry 스키마·빌드·소비 경로) + 자체 결합도 실측(순수 데모 vs 사이트 결합 2유형). RC1 설계 입력.

## 무감독 분량

승인 후 최소 2~3 무감독 세션 (milestone 4개 · 독립 changeset 8개 이상 — studio-finish 디플레 적발(선언 2 대비 1세션 완주) 반영해 더 크게 담음. RC4는 사용자 참여 내장이라 무감독 구간은 RC1~RC3+RC4 준비).

## Milestones (설계 번들 인덱스)

| ID | 이름 | plan doc | 승인 | 리서치 |
|---|---|---|---|---|
| RC1 | 코드 자산 registry 파이프라인 | `plans/2026-07-19-rc1-registry-pipeline.md` | proposed | `research/2026-07-19-recipe-code-reuse-shadcn-registry.md` |
| RC2 | 코드 출발 계약 + 에이전트 E2E | `plans/2026-07-19-rc2-code-first-contract.md` | proposed | 불요 — RC1 산출이 입력 |
| RC3 | 스튜디오 구성 ↔ 레시피 매핑 | `plans/2026-07-19-rc3-composition-recipe-map.md` | proposed | 불요 — 내부 매핑 |
| RC4 | 통합 실연 (스튜디오→코드 조합→리스타일) | `plans/2026-07-19-rc4-integrated-demo.md` | proposed | 불요 — 실연 |

## Close Criteria (선언 / 실측 / 판정 대조용)

1. **코드 자산 배포**: `curl https://ui.askewly.com/r/<name>.json` 이 순수 데모 배치(≥12개) 각각에서 files[].content + 의존 선언(registryDependencies·dependencies·cssVars)을 반환한다 (실측: 배포 후 전수 curl 카운트, 로그 `evidence/recipe-code-reuse/`).
2. **이식 실구동**: registry 자산 1개 이상을 **깨끗한 새 Vite 프로젝트**에 이식해 브라우저 실구동 관측 (사이트 결합 잔재 0 — 프리모템 1 게이트).
3. **코드 출발 E2E**: 에이전트 세션 1회가 registry JSON을 fetch→새 프로젝트 적용→**프로젝트 토큰으로 리맵**(shadcn 기본 표정 탈출)까지 관측된다 (evidence 로그 + 스크린샷).
4. **매핑 배선**: 스튜디오 구성 카탈로그 13항 전부에 레시피 자산 매핑이 존재하고, 수집 JSON→DESIGN.md→구현 지시까지 매핑이 흐르는 것을 실측.
5. **통합 실연**: 실의뢰 1건 — 스튜디오 선택→매핑된 코드 조합 스캐폴드→리스타일→실물 브라우저 게이트 1회 관측 (사용자 참여).

## 미리 쓰는 실패 회고 (프리모템)

이 horizon 이 끝났는데 실패했다. 왜?

1. **가져온 코드가 안 돌아감** — 사이트 결합(데이터·경로·전역 CSS)이 자산에 딸려 들어가 소비 프로젝트에서 컴파일/렌더 실패. → 예방: RC1에 추출 규약(순수 데모만 1차 배치 + 의존 전수 선언) + Close ②의 "깨끗한 새 프로젝트 이식 실구동"을 milestone DoD로.
2. **shadcn 표정 복제** — 에이전트가 코드를 그대로 붙여 리스타일을 생략, "일반적인 AI 결과물" 문제가 코드 재사용으로 오히려 고착. → 예방: RC2 계약에 리스타일 의무 게이트(component-restyle 연결, cssVars→프로젝트 토큰 리맵) 명문 + E2E 판정 기준에 "기본 룩과 다른 토큰 적용 확인" 포함.
3. **매핑이 장식으로 남음** — 구성↔레시피 표는 만들었지만 구현 단계 지시에 배선되지 않아 에이전트가 무시. → 예방: RC3에서 표가 아니라 **수집 JSON 필드→DESIGN.md 섹션→entry-protocol 지시**까지 배선을 DoD로 하고, RC4 실연이 실제 사용을 관측.

## 범위 제외

- 결제·다운로드 권한 계층 (자산은 현행 공개 배포 범위 내)
- 사이트 결합 데모의 결합 절단 리팩터(1차 배치는 순수 데모만 — 절단은 후속 배치)
- 사이트 코드 복사 UI (사람용 — 이번 범위는 에이전트 경로)
- AskewlyDesign 네이티브 앱

## Backlinks

- Objective: `OBJECTIVE.md`
- Predecessor: `plans/horizons/2026-07-studio-finish.md`
- 리서치: `research/2026-07-19-recipe-code-reuse-shadcn-registry.md`
