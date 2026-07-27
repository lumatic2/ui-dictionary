// 오너 판별 — 원문 이메일을 공개 번들에 넣지 않기 위해 SHA-256 hex 만 보관한다.
// 게이트는 클라이언트 표시 층이다(정적 SPA — 우회 가능). 결제 도입 시 서버 게이팅으로 재설계한다.
const OWNER_EMAIL_SHA256_SET = new Set([
  "4599d28efa65b0af89a8dc8f6e9faca9f65e61586efa6d03d9225ea338454273",
  "830ccfe7d9b941ab84a5a5554fa1eecfea475bbb0f25a3c0624e9d3f76dbf376",
])

export async function isOwnerEmail(email: string | undefined): Promise<boolean> {
  if (!email || typeof crypto === "undefined" || !crypto.subtle) {
    return false
  }
  const normalized = email.trim().toLowerCase()
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))
  const hex = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("")
  return OWNER_EMAIL_SHA256_SET.has(hex)
}
