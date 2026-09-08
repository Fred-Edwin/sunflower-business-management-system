"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "cn"

// Magnifier + field + optional result-count on the right ("3 of 24") — band
// 5AO-0. States: resting, focus, empty (placeholder), loading (count → dash).
// §12 promotion. Filter/search state lives in the URL at the call site (nuqs);
// this component is presentational.

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  /** e.g. "3 of 24" — omit to hide the count slot. */
  count,
  loading = false,
  "aria-label": ariaLabel,
  id,
  className,
}: {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  count?: string
  loading?: boolean
  "aria-label"?: string
  id?: string
  className?: string
}) {
  return (
    <div
      data-slot="search-input"
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-md border border-border bg-surface px-3 transition-colors",
        "focus-within:border-border-focus focus-within:shadow-[var(--focus-ring)]",
        className,
      )}
    >
      <SearchIcon className="size-3.5 shrink-0 text-text-muted" />
      <input
        id={id}
        type="search"
        value={value}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full min-w-0 bg-transparent text-[13px] leading-4 text-text-primary outline-none placeholder:text-text-muted [&::-webkit-search-cancel-button]:hidden"
      />
      {loading ? (
        <span
          aria-hidden
          className="h-0.5 w-4 shrink-0 bg-border-strong"
        />
      ) : count ? (
        <span className="shrink-0 text-xs leading-4 text-text-muted tabular-nums">
          {count}
        </span>
      ) : null}
    </div>
  )
}
