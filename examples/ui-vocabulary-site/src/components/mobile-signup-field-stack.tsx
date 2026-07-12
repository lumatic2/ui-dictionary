import { useRef, useState } from "react"
import { DeviceFrame } from "@/components/device-frame"
import { cn } from "@/lib/utils"

type FieldId = "name" | "email" | "password"

type FieldDefinition = {
  id: FieldId
  label: string
  type: "text" | "email" | "password"
  inputMode?: "text" | "email"
  enterKeyHint: "next" | "done"
  helper: string
}

const fields: FieldDefinition[] = [
  { id: "name", label: "Full name", type: "text", inputMode: "text", enterKeyHint: "next", helper: "" },
  { id: "email", label: "Email", type: "email", inputMode: "email", enterKeyHint: "next", helper: "" },
  { id: "password", label: "Password", type: "password", enterKeyHint: "done", helper: "At least 8 characters" },
]

/**
 * Vertically stacked signup fields with per-field keyboard type, a logical
 * next-field focus order driven by the keyboard's return key (no swipe
 * needed), and blur-time (not keystroke-time) validation so errors don't
 * flash while the user is still typing.
 */
export function MobileSignupFieldStackDemo() {
  const [values, setValues] = useState<Record<FieldId, string>>({ name: "", email: "", password: "" })
  const [touched, setTouched] = useState<Record<FieldId, boolean>>({ name: false, email: false, password: false })
  const refs = useRef<Partial<Record<FieldId, HTMLInputElement | null>>>({})

  function errorFor(id: FieldId): string | null {
    if (!touched[id]) return null
    if (id === "email" && values.email && !values.email.includes("@")) return "Enter a valid email"
    if (id === "password" && values.password && values.password.length < 8) return "At least 8 characters"
    return null
  }

  function focusNext(currentIndex: number) {
    const next = fields[currentIndex + 1]
    if (next) refs.current[next.id]?.focus()
  }

  return (
    <DeviceFrame statusBarLabel="9:41">
      <form
        className="flex h-full flex-col gap-4 p-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <p className="text-sm font-semibold text-foreground">Create account</p>

        {fields.map((field, index) => {
          const error = errorFor(field.id)
          return (
            <div key={field.id} className="flex flex-col gap-1">
              <label htmlFor={field.id} className="text-xs font-medium text-muted-foreground">
                {field.label}
              </label>
              <input
                id={field.id}
                ref={(node) => {
                  refs.current[field.id] = node
                }}
                type={field.type}
                inputMode={field.inputMode}
                enterKeyHint={field.enterKeyHint}
                autoComplete={field.type === "password" ? "new-password" : field.id}
                value={values[field.id]}
                onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))}
                onBlur={() => setTouched((current) => ({ ...current, [field.id]: true }))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && field.enterKeyHint === "next") {
                    event.preventDefault()
                    focusNext(index)
                  }
                }}
                className={cn(
                  "h-11 min-h-11 rounded-md border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                  error ? "border-destructive" : "border-input"
                )}
              />
              <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
                {error ?? field.helper}
              </p>
            </div>
          )
        })}

        <button
          type="submit"
          className="mt-auto h-11 min-h-11 rounded-md bg-primary text-sm font-semibold text-primary-foreground"
        >
          Create account
        </button>
      </form>
    </DeviceFrame>
  )
}
