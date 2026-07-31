# M1 — 이월 유지보수 마감 (완료)

- Date: 2026-08-01 · Plan: `plans/2026-07-31-m1-carryover-maintenance.md` · Changeset: `changesets/20260731-m1-carryover-maintenance/`

## 1. 결과

이월 finding 2건이 닫혔다. 디자인 verify 의 타이포 위반이 **8건 → 0**이 됐고, 사이트 SEO 셸 메타가 카피 언어(영어 단일)와 정합해졌다.

타이포는 화면을 고친 게 아니라 **규칙을 고쳐서** 닫혔다. 반응형 쌍(`text-5xl md:text-7xl`)을 2단계로 세던 오탐을 브레이크포인트 버킷 계수로 해소하고, 한 파일에 화면이 여럿인 집합 파일 4개에 사유 필수 opt-out 마커를 도입했으며, 임계값을 실측 근거로 5→7 재산정했다(@askewly/design 0.3.0, 테스트 60건). SEO 는 `lang="en"` + 셸 라우트 8곳의 head 메타를 영어로 통일하되 콘텐츠(용어 562건·docs 아티클)는 의도된 한국어라 경계를 그어 제외했다.

## 2. 이슈와 해결

- **임계 5 의 근거가 실사용과 어긋나 있었다** — DOG3 이 "우리 토큰 스케일이 5단계니까 5"로 정했는데, 실제 화면은 그 스케일에 없는 헤딩(30/48/72)과 마이크로 라벨(10/12)을 Tailwind 기본값·임의값에서 상시 빌려 쓴다. 마커 4건 적용 후 남은 3건(colors-page 6·get-started 6·recipe-gallery 7)이 전부 **정상 위계의 단일 화면**(마이크로 1 + 본문 2~3 + 헤딩 2)이라 접을 중복이 없었다. 계획서가 "임계 변경 = 제외"로 못박아 둔 조항에 걸려 **decision_required 로 중단**, 사용자에게 선택지 3안(임계 상향 / 토큰 스케일 확장 / 화면 접기)을 실측과 함께 제시해 ①임계 7 상향을 확정받았다. 7 은 정상 화면을 통과시키면서 이 규칙이 겨냥한 남용(마커 단 파일 14~15단계)은 어느 임계로 재도 두 배 초과로 잡는다.
- **면제가 조용해지지 않게 설계했다** — 마커는 사유 필수(빈 사유는 `typography-marker-no-reason` 위반), 면제 파일은 PASS/FAIL 양쪽 출력에 이름·사유가 나열된다. 정당화 없이 빠지는 면제가 게이트를 게이트가 아니게 만들기 때문. Failure probe 로 실증(사유 삭제 → FAIL 재출현 → 복원 → PASS).
- **부수 적발**: `min-[900px]:text-lg` 처럼 임의 브레이크포인트 변형이 붙은 유틸리티가 정규식에 **아예 안 잡히던 갭**(접두만이 아니라 유틸리티 전체가 스캔에서 사라짐). 신규 테스트가 드러내 함께 수정 — 규칙 보정이 없었으면 계속 안 보였을 결함이다.
- **get-started 는 접기 대상에서 제외**했다 — QA2 관측 7왕복으로 방금 승인된 화면이라, 사후에 크기를 건드리면 재관측을 부른다.

## 3. 증거

- Evidence: `evidence/carryover-maintenance/m1-closeout.md` — step 별 게이트 표(위반 8→7→3→0 추이, 3화면 크기 구성 실측, 라우트별 메타 전/후).
- 실표면: preview(4322) 실브라우저(Playwright) — 홈·/get-started 렌더 PASS, 콘솔 에러 0, `documentElement.lang === "en"`, title·description 영어 확인. dist 셸 라우트 9곳 head 메타 한국어 3건씩 → 0(양성 대조 포함).
- 재현: `cd packages/cli && npm test && npm run build` → `cd examples/ui-vocabulary-site && node ../../packages/cli/dist/index.js verify src/components --ext tsx && npm run lint && npm run build`.
- 크기 회고: changeset 1개·커밋 3건(step 당 1) — steps=3 계획 정합. 독립 step 3개 + 통합 검증이라 milestone-grade 성립.
- 평가 못 함: npm publish(0.3.0)·git push·실배포 반영 — 세션 말 사용자 보고 후 일괄(계획서 제외 항목).

## 4. 이월

- **토큰 타이포 스케일이 실사용과 어긋난다** — SSOT 5단계에 헤딩 단계·마이크로 라벨이 없고, `xl`(28)은 실화면에서 거의 안 쓰인다. 스케일 확장은 이번 선택지 ②였으나 채택되지 않았다(별도 milestone 규모). 근거: 이 보고서 §2 + evidence 의 3화면 구성 표.
