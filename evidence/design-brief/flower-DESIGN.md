---
tokens:
  color:
    background: "rgb(250, 248, 244)"          # 웜 페이퍼
    foreground: "rgba(26, 22, 16, 0.95)"      # 웜 잉크
    surface-raised: "rgb(255, 254, 251)"
    muted-foreground: "rgba(26, 22, 16, 0.58)"
    primary: "#2F7D4F"                        # 그린(잎색) — 유일한 액센트
    primary-hover: "#276B43"
    primary-foreground: "rgb(250, 248, 244)"
    border: "rgba(26, 22, 16, 0.12)"
  color-dark:
    background: "rgb(22, 26, 22)"
    foreground: "rgba(248, 247, 242, 0.95)"
    surface-raised: "rgb(32, 38, 32)"         # 명도 사다리 ΔL≈3
    muted-foreground: "rgba(248, 247, 242, 0.60)"
    primary: "#6FBE8F"
    primary-hover: "#84CCA1"
    primary-foreground: "rgb(22, 26, 22)"
    border: "rgba(248, 247, 242, 0.14)"
  typography:
    font-sans: '"Noto Sans KR", "Pretendard", ui-sans-serif, system-ui, sans-serif'
    display: "clamp(38px, 7vw, 58px) / 1.08, letter-spacing -0.035em, weight 800"
  dimension:
    radius-md: "6px"
    radius-lg: "12px"
---

# DESIGN — 동네 꽃집 랜딩 (가칭 "모퉁이 꽃집")

## 브리프 요약 (사용자 확정 2026-07-19)

- **톤**: 따뜻함·동네 꽃집 — 손으로 묶는 가게 온도
- **컬러**: 웜 페이퍼 베이스 + 그린 액센트 1색 (꽃 사진이 주인공, 배경은 물러섬)
- **타이포**: 산세리프 1종 + 크고 압축된 디스플레이 제목
- **구조**: 헤더 → 히어로 → 시그니처 꽃다발 3종(가격) → 주문 안내(당일배송·예약) → 가게 이야기 → 오시는 길·영업시간 → 푸터
- **인터랙션**: 표준 — hover 전환 + 섹션 등장 모션 (reduced-motion 분기 의무)
- **콘텐츠**: 더미 데이터 (실데이터로 교체 예정) · 다크 모드 제공

## 결정 vs 추정

- 결정(사용자 명시): 위 7도메인 전부 — 단, 모두 추천안 채택.
- 추정(기본값): 상호 "모퉁이 꽃집"(더미), 구체 가격·주소·전화번호(전부 더미), 그린의 정확한 값(#2F7D4F — 잎색 계열 내 에이전트 선택), 등장 모션 구현 방식(CSS scroll-driven 아님, IntersectionObserver 1회 재생).
- 실데이터 교체 시 이 파일의 더미 표기를 갱신할 것.
