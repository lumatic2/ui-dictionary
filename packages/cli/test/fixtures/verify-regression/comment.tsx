// FIXTURE — 오탐 케이스 2: 주석 안의 색 리터럴.
// 기대: 위반 0건. 주석은 실행되지 않으므로 렌더 결과에 영향이 없다.
// 현재(DOG1 이전): hex-literal 위반으로 잡힌다 = 오탐.

// design ref: #FF0000 was the old brand color, replaced by --color-accent
/* legacy palette: rgb(10, 20, 30) — kept for archaeology only */
export const Comment = () => <div className="bg-primary text-foreground">ok</div>
