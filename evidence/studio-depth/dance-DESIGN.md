---
name: 흔적 — 댄스 뮤지컬 광고
description: 감각적(강렬·전율)·공연예술 포지셔닝 광고 페이지 — Brief Studio v2 14축 선택 (2026-07-19)
colors:
  primary: "#E5254B"
  on-primary: "#F6F3EE"
  surface: "#121114"
  on-surface: "rgba(246, 243, 238, 0.96)"
  surface-raised: "#1E1D21"
  muted: "rgba(246, 243, 238, 0.60)"
  border: "rgba(246, 243, 238, 0.14)"
typography:
  headline-lg:
    fontFamily: "Nanum Myeongjo"
    fontSize: 64px
    fontWeight: "800"
    lineHeight: 1.08
    letterSpacing: -0.02em
  body-md:
    fontFamily: "Noto Sans KR"
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 1.7
  label-md:
    fontFamily: "Noto Sans KR"
    fontSize: 13px
    fontWeight: "500"
    lineHeight: 1.4
    letterSpacing: 0.08em
rounded:
  sm: 4px
  md: 8px
spacing:
  unit: 4px
  gap: 20px
  container-padding: 24px
  section-margin: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: 14px
  card:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.sm}"
    padding: "{spacing.container-padding}"
---

# 흔적 — DESIGN.md

## Overview

감각적 댄스 뮤지컬 광고. **결정(사용자, Brief Studio v2 실물 선택 2026-07-19)**: 방향 타일 "잉크와 빛" + 액센트는 타일 밖 **크림슨**(자유 조합), 잉크 블랙 베이스, 명조 헤드/산스 본문, 구성 히어로→카드3→정보, 헤더 로고+링크+CTA, 푸터 멀티 컬럼, 카드 플랫+명도, 밀도 여유, radius 4px, 이미지 "암전 속 한 줄기"(Pexels 실사), 아이콘 아웃라인, **다크 우선**, 모션 표준, WCAG AA. 전략층: 강렬한·전율 / 공연·예술 포지셔닝 / 더미 콘텐츠. **추정**: 공연명 "흔적"·일정·가격·장소 전부 더미, 크림슨 정확값 #E5254B.

## Colors

- 크림슨은 유일한 신호 — 예매 CTA·마감 임박·브랜드 글리프 1점. 본문 잉크에 사용 금지.
- 다크 우선: 라이트 모드 없음(결정). 카드 위계는 명도 사다리(#121114 → #1E1D21), 보더 최소.

## Typography

- 헤드 = 나눔명조 800 (압축 자간 -2%), 본문 = Noto Sans KR — 서체 2종 고정, 추가 금지.
- 라벨은 자간 +8% 대문자 스타일 스몰 라벨. 한글 keep-all.

## Layout

- 밀도 "여유": 섹션 여백 96px, 컨테이너 960px. 히어로 → 공연 하이라이트 카드 3 → 관람 정보 → 멀티 컬럼 푸터.

## Elevation & Depth

- 그림자 없음 — 명도 사다리와 실사 이미지의 암부가 깊이를 만든다.

## Shapes

- radius 4px 단일 (버튼·카드 동일). 필 금지.

## Components

- 상태 완비: CTA hover 밝기 상승·focus-visible 링·active. 카드 hover 부양(표준 모션). 등장 모션 1회 + reduced-motion 분기.

## Do's and Don'ts

- Do: 실사(Pexels, 사진가 크레딧 푸터 표기)·여백이 말하게·수치는 tabular-nums.
- Don't: 이모지 아이콘, 크림슨 남용, 그라디언트 배경, 과장 모션(표준 유지).
