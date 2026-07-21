// combobox — 자산 없는 용어를 폴백 규약으로 구현한 실증물.
//
// 이 컴포넌트는 레시피에서 나오지 않았다. `docs/design-system/no-asset-fallback.md` 의 절차를
// 밟아 **용어 항목 자체를 재료로** 만들었다: `docs/ui-vocabulary/terms.yml` 의 `combobox`.
//
// 부위(visual_anatomy) 4종을 전부 갖는다 — input trigger / typed query /
// filtered option list / highlighted option.
//
// 경계(anti_use):
//   - "선택지가 적으면 select나 radio group이 더 단순하다" → 옵션이 대여섯 개 이하면 이 컴포넌트를
//     쓰지 마라. 검색으로 좁힐 것이 없으면 combobox 는 클릭 한 번을 타이핑으로 바꾸는 손해다.
//   - "자유 입력만 필요하면 text field를 쓴다" → 목록 밖 문자열은 값이 될 수 없다. 값은 반드시
//     목록에서 선택된 항목이다.
//
// 이웃과의 차이(related): `select` 와 달리 입력으로 목록을 좁힌다. `dropdown-menu` 와 달리 항목
// 선택이 명령을 실행하지 않고 **값**이 된다.

import { useId, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type ComboboxOption = {
  value: string
  label: string
}

type ComboboxProps = {
  options: ComboboxOption[]
  value: string | null
  onChange: (value: string | null) => void
  label: string
  placeholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  label,
  placeholder = "검색해서 고르세요",
  emptyMessage = "일치하는 항목이 없습니다",
  className,
  disabled = false,
}: ComboboxProps) {
  const listboxId = useId()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)

  const selected = options.find((o) => o.value === value) ?? null

  // typed query: 입력값이 목록을 좁힌다. 이게 select 와 갈리는 지점이다.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  // 값이 선택된 상태에서는 그 라벨을, 고르는 중에는 질의를 보여준다.
  const displayValue = open ? query : (selected?.label ?? "")

  const commit = (option: ComboboxOption) => {
    onChange(option.value)
    setQuery("")
    setOpen(false)
    inputRef.current?.focus()
  }

  const close = () => {
    setQuery("")
    setOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        setActiveIndex(0)
        return
      }
      if (filtered.length === 0) return
      const delta = event.key === "ArrowDown" ? 1 : -1
      setActiveIndex((i) => (i + delta + filtered.length) % filtered.length)
      return
    }
    if (event.key === "Enter") {
      if (!open) return
      event.preventDefault()
      const option = filtered[activeIndex]
      // 목록 밖 문자열은 값이 되지 않는다 — anti_use "자유 입력만 필요하면 text field".
      if (option) commit(option)
      return
    }
    if (event.key === "Escape") {
      if (!open) return
      event.preventDefault()
      close()
    }
  }

  return (
    <div className={cn("relative flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>

      {/* input trigger — 별도 버튼이 아니라 인풋 자체가 트리거다 */}
      <input
        id={inputId}
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={open && filtered[activeIndex] ? `${listboxId}-${filtered[activeIndex].value}` : undefined}
        autoComplete="off"
        disabled={disabled}
        value={displayValue}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(close, 120)}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
          if (!open) setOpen(true)
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />

      {open ? (
        // filtered option list
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          className={cn(
            "absolute top-full z-20 mt-1 max-h-64 w-full overflow-y-auto",
            "rounded-md border border-border bg-popover p-1 shadow-md",
          )}
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">{emptyMessage}</li>
          ) : (
            filtered.map((option, index) => {
              const isActive = index === activeIndex
              const isSelected = option.value === value
              return (
                // highlighted option — 키보드 이동 위치를 시각과 aria 양쪽으로 표시한다
                <li
                  key={option.value}
                  id={`${listboxId}-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault() // blur 로 목록이 닫히기 전에 선택을 확정한다
                    commit(option)
                  }}
                  className={cn(
                    "cursor-pointer rounded-sm px-3 py-2 text-sm",
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground",
                    isSelected && !isActive && "font-medium",
                  )}
                >
                  {option.label}
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}
