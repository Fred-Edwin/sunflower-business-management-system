"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "cn"
import { SegmentedToggle } from "@/components/SegmentedToggle"

// ‹ Today › cluster + a SegmentedToggle for the span (1 / 2 weeks). COMPOSED
// from SegmentedToggle + icon buttons, not monolithic (band 5AO-0). Calendar
// view. §12 promotion.

type Span = "1w" | "2w"

export function CalendarSpanControl({
  span,
  onSpanChange,
  onPrev,
  onNext,
  onToday,
  showSpanToggle = true,
  className,
}: {
  span?: Span
  onSpanChange?: (span: Span) => void
  onPrev?: () => void
  onNext?: () => void
  onToday?: () => void
  showSpanToggle?: boolean
  className?: string
}) {
  return (
    <div
      data-slot="calendar-span-control"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous"
        className="flex size-9 items-center justify-center rounded-md border border-border text-text-secondary outline-none transition-colors focus-visible:border-border-focus focus-visible:shadow-[var(--focus-ring)]"
      >
        <ChevronLeftIcon className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onToday}
        className="flex h-9 items-center rounded-md border border-border px-3.5 text-sm font-medium leading-[18px] text-text-primary outline-none transition-colors focus-visible:border-border-focus focus-visible:shadow-[var(--focus-ring)]"
      >
        Today
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next"
        className="flex size-9 items-center justify-center rounded-md border border-border text-text-secondary outline-none transition-colors focus-visible:border-border-focus focus-visible:shadow-[var(--focus-ring)]"
      >
        <ChevronRightIcon className="size-3.5" />
      </button>
      {showSpanToggle && span ? (
        <SegmentedToggle
          aria-label="Calendar span"
          segments={[
            { value: "1w", label: "1 week" },
            { value: "2w", label: "2 weeks" },
          ]}
          value={span}
          onChange={onSpanChange}
        />
      ) : null}
    </div>
  )
}
