// The selector form is exempt; everything else on this file is not.
export function Mixed() {
  return (
    <div
      className="[&_.recharts-sector[stroke='#fff']]:stroke-transparent bg-[#ccc]"
      style={{ color: "#112233" }}
    />
  )
}
