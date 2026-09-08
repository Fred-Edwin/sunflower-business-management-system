"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "cn"

// INTERNAL shared helper behind ClientPicker, CatalogItemPicker, and
// SearchInput's popover (PHASE-00B §5.4). NOT a public composite — not exported
// for screen use, no gallery entry of its own; its states are exercised through
// the three pickers. Defines the popover shell, the search row, keyboard
// navigation over options, and the empty / loading states once.
//
// Deliberately not pre-abstracted beyond these three consumers.

export type SearchableOption = {
  value: string
  /** Primary label. */
  label: string
  /** Optional right-aligned slot (e.g. an availability badge). */
  trailing?: React.ReactNode
  disabled?: boolean
}

type SearchableListProps = {
  query: string
  onQueryChange: (query: string) => void
  options: SearchableOption[]
  onSelect: (value: string) => void
  placeholder?: string
  loading?: boolean
  /** Rendered below the options — e.g. a "Create client <query>" affordance. */
  footer?: React.ReactNode
  /** Shown when there are no options and not loading. */
  emptyLabel?: React.ReactNode
  /** Hide the search row (SearchInput renders its own field). */
  hideSearch?: boolean
  className?: string
}

export function SearchableList({
  query,
  onQueryChange,
  options,
  onSelect,
  placeholder = "Search…",
  loading = false,
  footer,
  emptyLabel,
  hideSearch = false,
  className,
}: SearchableListProps) {
  const [active, setActive] = React.useState(0)
  const listRef = React.useRef<HTMLDivElement>(null)

  const enabled = options.filter((o) => !o.disabled)

  React.useEffect(() => {
    setActive(0)
  }, [query, options.length])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, enabled.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const opt = enabled[active]
      if (opt) onSelect(opt.value)
    }
  }

  return (
    <div
      data-slot="searchable-list"
      className={cn(
        "overflow-hidden rounded-md border border-border-focus bg-surface-raised shadow-md",
        className,
      )}
      onKeyDown={onKeyDown}
    >
      {!hideSearch ? (
        <div className="flex h-9 items-center gap-2 border-b border-border px-3">
          <SearchIcon className="size-3.5 shrink-0 text-text-muted" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            autoFocus
            className="w-full bg-transparent text-[13px] leading-4 text-text-primary outline-none placeholder:text-text-muted"
          />
        </div>
      ) : null}

      <div ref={listRef} role="listbox" className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col">
            <div className="flex h-9 items-center px-3">
              <span className="h-2.5 w-32 rounded-sm bg-neutral-100" />
            </div>
            <div className="flex h-9 items-center justify-between px-3">
              <span className="h-2.5 w-40 rounded-sm bg-neutral-100" />
              <span className="h-2.5 w-14 rounded-sm bg-neutral-100" />
            </div>
          </div>
        ) : enabled.length === 0 ? (
          <div className="px-3 py-4 text-center text-[13px] leading-4 text-text-muted">
            {emptyLabel ?? "No matches"}
          </div>
        ) : (
          options.map((opt) => {
            const idx = enabled.indexOf(opt)
            const isActive = idx === active
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isActive}
                disabled={opt.disabled}
                onMouseEnter={() => idx >= 0 && setActive(idx)}
                onClick={() => onSelect(opt.value)}
                className={cn(
                  "flex h-9 w-full items-center justify-between gap-2 px-3 text-left text-[13px] leading-4 text-text-primary",
                  isActive && "bg-surface-sunken",
                  opt.disabled && "pointer-events-none opacity-50",
                )}
              >
                <span className="truncate">{opt.label}</span>
                {opt.trailing ? (
                  <span className="shrink-0">{opt.trailing}</span>
                ) : null}
              </button>
            )
          })
        )}
      </div>

      {footer ? (
        <div className="border-t border-border px-3 py-2 text-[13px] leading-4">
          {footer}
        </div>
      ) : null}
    </div>
  )
}
