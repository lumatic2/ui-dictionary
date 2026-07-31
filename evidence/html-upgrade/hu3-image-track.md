# HU3 — 이미지 표현 트랙 (스톡·누끼·생성)

> 2026-07-31 · plan: `plans/2026-07-31-hu3-image-track.md` · changeset: custom-skills `20260731-hu3-image-track` (커밋 ba00378·9da6071·509de6b, push 완료)

## step-1 — 소싱 계약 (`references/imagery.md`)

- 3원천 소스 맵(Pexels·Adobe Free·Burst + 라이선스 확인 절차)·공통 규율(출처 장부 필수·**이미지 안 텍스트 금지**·얼굴 회피·스크림 대비)·imagegen 프롬프트 템플릿(HTML 번안 — 팔레트 hex 고정·Constraints 불변)·치수 가드(`template-image-provider-codex` 전례). SKILL §8 라우팅 행.

## step-2 — 레이아웃 표현 (커버 풀블리드+스크림)

- renderCover `assets.image` 풀블리드 + 테마색 좌진 스크림. 라운드 3회: r1 이미지 미표시(slide-content relative 가 inset 앵커 가로챔 → cover 만 static) · r2 sourceNote 제목 겹침 → 하단 고정 → nav-overlap 오탐 → bottom 88px · r3 수렴(`img/hu3-image-hero-v3.png`). layouts.md 슬롯 계약 절.

## step-3 — 3원천 실투입 실증

- **스톡**: Pexels navy paper(Tamanna Rumee) 커버 실렌더 — 스크림 위 제목 가독. **누끼**: Pexels 노트북(Mart Production) → `rmbg` birefnet-general 투명 PNG → split-screen 실렌더(`img/hu3-cutout.png`), shelf used 기록. **생성**: codex exec image_gen 실위임 — 산출 1672×941(**16:9 정합 — 커버 슬롯 크롭 손실 0**, 치수 가드 통과), Constraints 육안 PASS(글자/로고/얼굴 없음), 커버 실렌더(`img/hu3-gen-cover.png`).
- 출처 장부 4행(fixture `content/README.md`) + sourceNote 장부 참조형(긴 URL 경고 해소).
- standalone 5.96MB(이미지 base64 인라인) → **완전 오프라인** file:// 개봉: 요청 0·콘솔 0·6장 내비 `STANDALONE-OFFLINE PASS`.
- validate --lint(R4~R6 위반 0)·build·overflow 6장 PASS. 이미지 미사용 장·덱 무접촉(opt-in).

## 관측 노트

- split-screen 의 sourceNote 가 미디어 위 중앙에 겹치는 기존 배치는 HU4 실증 덱에서 재관측 대상(이번 회귀 아님 — 기존 계약).
