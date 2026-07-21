---
name: 직관 — 야구장 예약
description: 경기장 에너지+실용 예약 서비스 — Brief Studio 폭포식 18축 선택 (2026-07-19)
colors:
  primary: "#E4572E"
  on-primary: "#FFFDFA"
  surface: "#F8FAF7"
  on-surface: "rgba(18, 26, 20, 0.95)"
  surface-raised: "#FFFFFF"
  muted: "rgba(18, 26, 20, 0.58)"
  border: "rgba(18, 26, 20, 0.12)"
  dark-surface: "#12161A"
  dark-on-surface: "rgba(240, 246, 244, 0.96)"
  dark-surface-raised: "#1C2228"
  dark-primary: "#FF7A4D"
  dark-on-primary: "#16100C"
  dark-muted: "rgba(240, 246, 244, 0.60)"
  dark-border: "rgba(240, 246, 244, 0.14)"
typography:
  headline-lg:
    fontFamily: "Noto Serif KR"
    fontSize: 58px
    fontWeight: "700"
    lineHeight: 1.12
    letterSpacing: -0.02em
  body-md:
    fontFamily: "Noto Sans KR"
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 1.7
rounded:
  sm: 4px
  md: 8px
spacing:
  unit: 4px
  gap: 20px
  container-padding: 24px
  section-margin: 88px
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

# 직관 — DESIGN.md

## Overview

야구장 예약 서비스 광고 페이지. **결정(사용자, 폭포식 Brief Studio 18축 2026-07-19)**: 타일 "필드 데이" + 그래스 라이트 베이스, **액센트는 타일 밖 팀 오렌지**(자유 조합), 세리프 헤딩/산스 본문, **풀블리드 미디어 구성 + 영상 히어로**("타격 순간" 4s 루프, Pexels), 헤드라인 "이번 주말, 그 함성 속으로", 서브 "직관러 40만 명"(사회적 증거), CTA 하나 집중, 햄버거 헤더, 뉴스레터 푸터, 플랫+명도 카드, 여유 밀도, radius 4px, 모션 표준, **커서 인터랙션 선택 안함(에이전트 판단 → 기본 hover만)**, 아웃라인 아이콘, 라이트/다크 자동, 접근성 표준(AA). 전략층: 경기장 에너지+실용 / 생동감·현장감 / 더미.

## Colors — 팀 오렌지는 예매 CTA·긴급 신호에만. 다크는 야간 경기 톤(플러드라이트).
## Typography — 세리프 헤딩(현장의 무게) + 산스 본문(실용 가독). keep-all.
## Layout — 풀블리드 영상 히어로 → 관람 정보 → CTA 밴드 → 뉴스레터 푸터. 여백 88px.
## Elevation & Depth — 그림자 없음, 명도 사다리.
## Shapes — 4px 단일.
## Components — 상태 완비, 등장 모션 1회 + reduced-motion 분기. 히어로 영상은 reduced-motion·모바일에서 포스터 폴백(계약 의무).
## Do's and Don'ts — Do: 영상 크레딧 표기(Felipe Jiménez, Pexels)·잔여석 등 수치는 tabular-nums. Don't: 오렌지 남용·이모지 아이콘.
