import { useEffect, useRef, useState } from "react"
import { AlertCircleIcon, SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
}

export type ChatStatus = "idle" | "waiting" | "error"

type ChatConversationPanelProps = {
  messages: ChatMessage[]
  status: ChatStatus
  onSend: (text: string) => void
  onRetry: () => void
  emptyHint?: string
}

/**
 * Chat conversation panel: a bounded message thread (`role="log"` polite live
 * region) above a single input bar. The thread owns its own scroll and pins to
 * the newest message; waiting and error are explicit thread entries — a
 * typing indicator with a screen-reader mirror, and a tinted error row whose
 * only action is Retry. `break-keep` keeps CJK sentences from splitting
 * mid-word inside narrow bubbles.
 */
export function ChatConversationPanel({ messages, status, onSend, onRetry, emptyHint }: ChatConversationPanelProps) {
  const [draft, setDraft] = useState("")
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const thread = threadRef.current
    if (thread) thread.scrollTop = thread.scrollHeight
  }, [messages, status])

  const canSend = draft.trim().length > 0 && status !== "waiting"

  const send = () => {
    if (!canSend) return
    onSend(draft.trim())
    setDraft("")
  }

  return (
    <div className="flex h-[24rem] w-full max-w-md flex-col overflow-hidden rounded-lg border bg-background">
      <div ref={threadRef} aria-label="Conversation" className="flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-live="polite">
        {messages.length === 0 && status === "idle" ? (
          <p className="pt-12 text-center text-sm text-muted-foreground">{emptyHint ?? "No messages yet. Ask anything to start the conversation."}</p>
        ) : null}
        {messages.map((message) => (
          <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <p
              className={
                message.role === "user"
                  ? "max-w-[85%] break-keep rounded-lg rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                  : "max-w-[85%] break-keep rounded-lg rounded-bl-sm bg-muted px-3 py-2 text-sm text-foreground"
              }
            >
              <span className="sr-only">{message.role === "user" ? "You: " : "Assistant: "}</span>
              {message.text}
            </p>
          </div>
        ))}
        {status === "waiting" ? (
          <div className="flex justify-start" aria-hidden="false">
            <div className="flex items-center gap-1 rounded-lg rounded-bl-sm bg-muted px-3 py-2.5">
              <span className="sr-only">Assistant is typing</span>
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-muted-foreground motion-safe:animate-bounce motion-reduce:opacity-60"
                  style={{ animationDelay: `${dot * 150}ms` }}
                />
              ))}
            </div>
          </div>
        ) : null}
        {status === "error" ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2" role="alert">
            <AlertCircleIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div className="min-w-0 flex-1">
              <p className="break-keep text-sm text-foreground">The assistant could not respond. Your message was not lost.</p>
              <Button className="mt-1 h-auto p-0" size="sm" type="button" variant="link" onClick={onRetry}>
                Retry
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      <form
        className="flex items-end gap-2 border-t p-3"
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}
      >
        <textarea
          aria-label="Message"
          className="min-h-[2.5rem] max-h-32 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Send a message…"
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              send()
            }
          }}
        />
        <Button aria-label="Send message" className="shrink-0" disabled={!canSend} size="icon" type="submit">
          <SendIcon aria-hidden="true" className="size-4" />
        </Button>
      </form>
    </div>
  )
}

let demoMessageId = 0

/**
 * Colocated demo: replies to each sent message after a short waiting state,
 * and fails every third turn so the error row and its Retry path stay
 * observable in the gallery.
 */
export function ChatConversationPanelDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>("idle")
  const turnRef = useRef(0)
  const lastUserTextRef = useRef("")

  const reply = (userText: string) => {
    setStatus("waiting")
    window.setTimeout(() => {
      turnRef.current += 1
      if (turnRef.current % 3 === 0) {
        setStatus("error")
        return
      }
      demoMessageId += 1
      setMessages((current) => [
        ...current,
        { id: `m-${demoMessageId}`, role: "assistant", text: `Echoing back: "${userText}" — 한국어 문장도 단어 중간에서 잘리지 않고 줄바꿈됩니다.` },
      ])
      setStatus("idle")
    }, 900)
  }

  const send = (text: string) => {
    demoMessageId += 1
    lastUserTextRef.current = text
    setMessages((current) => [...current, { id: `m-${demoMessageId}`, role: "user", text }])
    reply(text)
  }

  return <ChatConversationPanel messages={messages} status={status} onSend={send} onRetry={() => reply(lastUserTextRef.current)} />
}
