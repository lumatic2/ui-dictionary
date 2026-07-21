// FIXTURE — 예외 범위 게이트: 주석 예외가 코드까지 삼키지 않는지 잰다.
// 기대: 위반 2건 — `#654321`(hex-literal)과 `rgba(...)`(raw-color-fn). 둘 다 실행되는 코드다.
//       주석 안의 `#000000` 과 `/* rgb(9,9,9) */` 는 잡히지 않는다.

/* palette note: rgb(9, 9, 9) — 폐기됨 */
const legacy = "#654321" // 주석 안의 #000000 은 잡히면 안 되지만 왼쪽 리터럴은 잡혀야 한다
const url = "https://example.com/docs#section" // `//` 가 문자열 안에 있어도 주석으로 오인하지 않는다

export const Shadow = () => (
  <div style={{ boxShadow: `0 1px 2px rgba(0, 0, 0, 0.2)`, color: legacy }}>{url}</div>
)
