// FIXTURE — 누락 케이스: 한 줄에 서로 다른 규칙의 위반이 둘.
// 기대: 위반 2건 (hex-literal + raw-color-fn). 둘 다 진짜 위반이다.
// 현재(DOG1 이전): 1건만 보고된다 — 줄 단위로 첫 매치만 세므로 raw-color-fn 이 유실.
export const OneLine = () => <div style={{ color: "#111", background: "rgb(1,2,3)" }} />
