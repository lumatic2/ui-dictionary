// FIXTURE — 오탐 케이스 1: SVG 내부의 색 리터럴.
// 기대: 위반 0건. SVG 아이콘의 fill/stroke 는 토큰 체계 밖이므로 예외다.
// 현재(DOG1 이전): hex-literal 위반으로 잡힌다 = 오탐.
export const Icon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M0 0h16v16H0z" fill="#000000" />
    <circle cx="8" cy="8" r="4" stroke="rgb(255, 255, 255)" />
  </svg>
)
