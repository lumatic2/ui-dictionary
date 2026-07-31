# 완료 — PB1 PPTX bespoke 트랙 정식화

> 완료: 2026-07-31 · PB1 (goal `pptx-bespoke` 1/2) · 배치: `docs/reports/` (이 레포 특례)
> **짧게 쓴다.** 설계 논거·경위는 custom-skills changeset 과 커밋 메시지에.

## 1. 결과

영상 방식(덱 전용 코드 + 산출물 보며 미세조정)을 스킬 고품질 트랙으로 정식화했다. 핵심 기계장치 `scripts/pptx-to-png.ps1` — PowerPoint COM Slide.Export 로 PPTX 를 슬라이드별 PNG 산출, 에이전트가 PPTX 를 직접 보는 눈(기존 품질 미달 원인이던 캘리브레이션 0회를 해소하는 전제). 계약 문서 `references/pptx-bespoke.md`(트랙 선택·입력 계약·표현 레시피·미세조정 루프 상한 5+3·라운드/편차 장부 양식) + SKILL.md 2단 트랙 라우팅 + verification.md 시각 게이트 절. custom-skills 커밋 6fdb3cc·86d33d3, changeset `20260731-pb1-bespoke-track-skill`, 배포 완료.

## 2. 이슈와 해결

- `pwsh -File` 경유 시 `[int[]]` 배열 파라미터가 "1,4"→14 로 뭉개짐 — 쉼표 문자열 파싱으로 전환, 스크립트·verification.md 에 기록.
- fresh 계획 검증자 발견 6건(의존 모순·COM 준용 범위 과장·"근접" 기준 미정의 등) 승인 전 반영.

## 3. 증거

- evidence: `evidence/slide-pipeline/pb1-bespoke-track.md`.
- 실표면: 배포본 스크립트로 실증 PPTX(askewly-design-intro.skill-track, 7장)에서 s01·s04 PNG 산출 → Read 육안 판독 성공(차트·텍스트·팔레트 식별 가능) + PASS 메시지 assertion + PowerPoint 프로세스 잔존 0 확인.
- 재현: `pwsh -File ~/.claude/skills/presentation-slides-yusung/scripts/pptx-to-png.ps1 decks/askewly-design-intro/export/askewly-design-intro.skill-track.pptx -Slides "1,4"`
- 배포: setup.sh 출고 정합 2회 통과, github push 완료.
- 크기 회고: step 2개·changeset 1개 — milestone 라벨 정합(독립 step 2 + 통합 검증).
