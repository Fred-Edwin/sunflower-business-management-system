"use client"

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "cn"

// from→to date pair (single date in Day mode) with a calendar icon and ‹ ›
// steppers (band 5AO-0). Composes the Tier 1 DatePicker at the call site for
// actual date selection — this component owns the presentation and the stepper
// affordances. Availability view. §12 promotion.
//
// Labels are pre-formatted by the caller via lib/dates (coding-standards.md §8)
// — this component never formats a date itself.

export function DateRangeControl({
  mode = "range",
  /** Pre-formatted, e.g. "14 Oct → 16 Oct 2026" or "14 Oct 2026". */
  label,
  onPrev,
  onNext,
  onOpenPicker,
  className,
}: {
  mode?: "range" | "day"
  label: string
  onPrev?: () => void
  onNext?: () => void
  onOpenPicker?: () => void
  className?: string
}) {
  return (
    <div
      data-slot="date-range-control"
      className={cn("inline-flex items-center gap-1", className)}
    >
      <button
        type="button"
        onClick={onOpenPicker}
        className="flex h-9 items-center gap-2 rounded-md border border-border px-3 outline-none transition-colors focus-visible:border-border-focus focus-visible:shadow-[var(--focus-ring)]"
      >
        <CalendarIcon className="size-3.5 shrink-0 text-text-muted" />
        <span className="font-mono text-[13px] leading-4 text-text-primary">
          {label}
        </span>
      </button>
      {mode === "range" ? (
        <>
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous range"
            className="flex size-9 items-center justify-center rounded-md border border-border text-text-secondary outline-none transition-colors focus-visible:border-border-focus focus-visible:shadow-[var(--focus-ring)]"
          >
            <ChevronLeftIcon className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next range"
            className="flex size-9 items-center justify-center rounded-md border border-border text-text-secondary outline-none transition-colors focus-visible:border-border-focus focus-visible:shadow-[var(--focus-ring)]"
          >
            <ChevronRightIcon className="size-3.5" />
          </button>
        </>
      ) : null}
    </div>
  )
}
