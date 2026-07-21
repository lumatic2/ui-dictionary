// FIXTURE — 예외 범위 게이트: SVG 예외가 파일 전체로 번지지 않는지 잰다.
// 기대: 위반 2건 — SVG 밖의 `#123456`(hex-literal)과 `hsl(...)`(raw-color-fn).
//       SVG 내부의 `#abcdef` 는 잡히지 않는다.
// 이 파일이 PASS 로 나오면 예외를 너무 넓게 뚫은 것이다.
const border = "#123456"

export const Mixed = () => (
  <div style={{ outline: `1px solid hsl(210, 50%, 40%)`, borderColor: border }}>
    <svg viewBox="0 0 8 8">
      <rect width="8" height="8" fill="#abcdef" />
    </svg>
  </div>
)
