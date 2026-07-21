// FIXTURE — 오탐 케이스 1: SVG 내부의 색 리터럴.
// 기대: SVG 내부는 위반 0건. SVG 아이콘의 fill/stroke 는 토큰 체계 밖이므로 예외다.
// 단 SVG **밖**의 리터럴은 여전히 잡혀야 한다 — 예외가 파일 전체로 번지면 안 된다.
export const Icon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M0 0h16v16H0z" fill="#000000" />
    <circle cx="8" cy="8" r="4" stroke="rgb(255, 255, 255)" />
  </svg>
)
