import { useEffect, useRef, useState } from "react"
import { LockIcon, MailIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Auth gate modal: a sign-in card for surfaces where exploring is open to
 * everyone but one capability (asking, saving, publishing) is gated. Three
 * paths in fixed order — email/password, Google, and "request access" for
 * people without an account yet — so the gate never dead-ends a visitor.
 * Dismissable three ways (close button, backdrop, Escape); focus lands on
 * the first field when opened. Semantic tokens throughout.
 */

type AuthGateModalProps = {
  open: boolean
  /** What the gate protects, shown in the title (e.g. "질문하기"). */
  capability: string
  onClose: () => void
  onEmailSubmit: (email: string, password: string) => void
  onGoogle: () => void
  onRequestAccess: () => void
}

export function AuthGateModal({ open, capability, onClose, onEmailSubmit, onGoogle, onRequestAccess }: AuthGateModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    emailRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="absolute inset-0 z-20 grid place-items-center p-4" data-slot="auth-gate-root">
      <button
        type="button"
        aria-label="Dismiss sign-in"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        data-slot="auth-gate-backdrop"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Sign in to ${capability}`}
        className="relative w-full max-w-xs rounded-xl border bg-background p-5 shadow-xl"
        data-slot="auth-gate-card"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-4" aria-hidden="true" />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground">
            <LockIcon className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">로그인하고 {capability}</p>
            <p className="text-xs text-muted-foreground">둘러보기는 로그인 없이 계속할 수 있어요.</p>
          </div>
        </div>

        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            onEmailSubmit(email, password)
          }}
        >
          <Input ref={emailRef} type="email" placeholder="이메일" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="비밀번호" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" className="mt-1 w-full" disabled={!email || !password}>
            <MailIcon className="size-4" aria-hidden="true" />
            이메일로 로그인
          </Button>
        </form>

        <div className="my-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          또는
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-2">
          <Button type="button" variant="outline" className="w-full" onClick={onGoogle}>
            Google로 로그인
          </Button>
          <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={onRequestAccess}>
            계정이 없어요 — 가입 요청 보내기
          </Button>
        </div>
      </div>
    </div>
  )
}

/** Colocated demo: a gated surface with an open trigger, scoped to its own frame. */
export function AuthGateModalDemo() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  function resolve(path: string) {
    setStatus(path)
    setOpen(false)
  }

  return (
    <div className="relative h-96 w-full max-w-md overflow-hidden rounded-lg border bg-muted/30 p-4">
      <p className="text-sm font-semibold text-foreground">Knowledge graph</p>
      <p className="mt-1 text-sm text-muted-foreground">탐색은 자유, 질문은 로그인 뒤에.</p>
      <Button size="sm" className="mt-3" type="button" onClick={() => { setStatus(null); setOpen(true) }}>
        질문하기
      </Button>
      {status ? <p className="mt-3 text-xs text-muted-foreground" role="status">경로 선택됨: {status}</p> : null}

      <AuthGateModal
        open={open}
        capability="질문하기"
        onClose={() => setOpen(false)}
        onEmailSubmit={() => resolve("email")}
        onGoogle={() => resolve("google")}
        onRequestAccess={() => resolve("request-access")}
      />
    </div>
  )
}
