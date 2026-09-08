"use client"

import { cn } from "cn"

// Generic 2–3-way view switch (band 5AO-0). Absorbs Day/Range, Calendar/Agenda,
// 1 week/2 weeks, Week/List. Track on surface-sunken; the selected segment =
// surface-0 + shadow-sm + text-primary. States: resting, focus, disabled.
// §12 promotion.

type Segment<T extends string> = { value: T; label: string }

export function SegmentedToggle<T extends string>({
  segments,
  value,
  onChange,
  disabled = false,
  "aria-label": ariaLabel,
  className,
}: {
  segments: Segment<T>[]
  value: T
  onChange?: (value: T) => void
  disabled?: boolean
  "aria-label"?: string
  className?: string
}) {
  return (
    <div
      data-slot="segmented-toggle"
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={cn(
        "inline-flex gap-0.5 rounded-md border border-border bg-surface-sunken p-0.5",
        "focus-within:shadow-[var(--focus-ring)]",
        disabled && "pointer-events-none opacity-45",
        className,
      )}
    >
      {segments.map((seg) => {
        const selected = seg.value === value
        return (
          <button
            key={seg.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange?.(seg.value)}
            className={cn(
              "rounded-sm px-3 py-1 text-[13px] leading-4 outline-none transition-colors",
              selected
                ? "bg-surface font-medium text-text-primary shadow-sm"
                : "text-text-muted",
            )}
          >
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}
