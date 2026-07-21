---
name: 모과 커피
description: 따뜻한 동네 카페 랜딩 — 브리프 스튜디오 실물 선택으로 확정 (2026-07-19)
colors:
  primary: "#6B4A2F"
  on-primary: "#FAF8F4"
  surface: "#FAF8F4"
  on-surface: "rgba(30, 24, 18, 0.95)"
  surface-raised: "#FFFEFB"
  muted: "rgba(30, 24, 18, 0.58)"
  border: "rgba(30, 24, 18, 0.12)"
  dark-surface: "#1D1813"
  dark-on-surface: "rgba(248, 244, 238, 0.95)"
  dark-surface-raised: "#28211A"
  dark-primary: "#C9A276"
  dark-on-primary: "#1D1813"
  dark-muted: "rgba(248, 244, 238, 0.60)"
  dark-border: "rgba(248, 244, 238, 0.14)"
typography:
  headline-lg:
    fontFamily: "Gowun Batang"
    fontSize: 52px
    fontWeight: "700"
    lineHeight: 1.12
    letterSpacing: -0.02em
  body-md:
    fontFamily: "Gowun Batang"
    fontSize: 16.5px
    fontWeight: "400"
    lineHeight: 1.75
  label-md:
    fontFamily: "Gowun Batang"
    fontSize: 14px
    fontWeight: "700"
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 8px
  lg: 14px
spacing:
  unit: 4px
  gap: 16px
  container-padding: 24px
  section-margin: 72px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: 12px
  menu-card:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.lg}"
    padding: "{spacing.container-padding}"
---

# 모과 커피 — DESIGN.md

## Overview

따뜻한 동네 카페(사용자 결정). 매일 오는 단골의 온도 — 카피는 담담하고 다정하게. **결정(사용자, Brief Studio 실물 선택 2026-07-19)**: 웜 페이퍼 + 커피 브라운 팔레트, 고운바탕 전면 사용, 표준 인터랙션(hover + 등장 모션). **추정(기본값)**: 상호 "모과 커피"·메뉴·가격·주소 전부 더미, 다크 팔레트 정확값(커피→크림 라떼 반전)은 에이전트 파생.

## Colors

- 커피 브라운(`primary`)은 유일한 액센트 — 주요 버튼·강조 라벨에만. 배경은 웜 페이퍼, 순백은 카드(`surface-raised`) 한 곳.
- 다크 모드는 `dark-*` 토큰: 다크 로스트 배경 + 크림 액센트, 카드 위계는 명도 사다리(보더 최소).

## Typography

- 고운바탕 전면 사용(사용자 실물 선택). 세리프 본문은 행간을 넉넉히(1.75) — 읽는 속도가 느린 서체다.
- 한글 `word-break: keep-all`. 디스플레이 52px, 자간 -2%.
- 서체 추가 금지 — 위계는 굵기(400/700)·크기·색으로만.

## Layout

- 4px 그리드, 컨테이너 max-width 960px, 섹션 간 여백 72px — 세리프 톤에 맞게 여유 있게.

## Elevation & Depth

- 그림자 없음 — 카드 위계는 배경 명도(라이트: 페이퍼→순백 / 다크: ΔL≈3 사다리).

## Shapes

- 버튼 4px, 카드 14px. 필 금지.

## Components

- 상태 완비: hover(버튼 어둡게·카드 부양), focus-visible 링, active. 표준 인터랙션 — 등장 모션은 1회, reduced-motion 분기 의무.

## Do's and Don'ts

- Do: 다정한 카피, 실측 정보(가격·시간)는 tabular-nums.
- Don't: 이모지 아이콘, 커피색을 본문 텍스트에 남용, 스톡사진풍 장식, 실험적 연출(수동 승인 전).
