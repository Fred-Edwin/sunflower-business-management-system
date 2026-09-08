import * as React from "react"
import { ChevronLeftIcon } from "lucide-react"
import { cn } from "cn"
import { StatusBadge, type StatusValue } from "@/components/StatusBadge"

// One component, two projections (band 573-0).
//
//  desktop (>= md)  breadcrumb (12px muted) / title (24px semibold; Geist Mono
//                   for reference numbers) / optional inline StatusBadge /
//                   action slot right.
//  mobile top-bar   back chevron + breadcrumb + optional single action or
//                   per-form mic, then title + badge stacked below.
//
// States: empty (title only), error (actions + badge hidden), long title wraps
// to 2 lines / breadcrumb truncates.
//
// §5.4 `capturedAt` decision: DROPPED. The band draws no capture-time chip, and
// TranscriptPanel's provenance line ("0:23 · Deepgram") already carries capture
// metadata on the one screen that needs it. Recorded in PHASE-00B §7.

type PageHeaderProps = {
  title: string
  breadcrumb?: string
  status?: { value: StatusValue; label?: string }
  /** Right-side action slot (desktop) — ghost + accent buttons, 36px. */
  actions?: React.ReactNode
  /** Mobile-only: a single action or the per-form mic, shown in the top bar. */
  mobileAction?: React.ReactNode
  /** Reference-number title — renders in Geist Mono. */
  mono?: boolean
  /** Error state — hides actions and the status badge. */
  error?: boolean
  onBack?: () => void
  className?: string
}

export function PageHeader({
  title,
  breadcrumb,
  status,
  actions,
  mobileAction,
  mono = false,
  error = false,
  onBack,
  className,
}: PageHeaderProps) {
  const showActions = !error && actions
  const showStatus = !error && status

  const titleEl = (
    <h1
      className={cn(
        "text-2xl font-semibold leading-[30px] text-text-primary",
        mono
          ? "font-mono tracking-[-0.01em]"
          : "tracking-[-0.015em]",
      )}
    >
      {title}
    </h1>
  )

  const statusEl = showStatus ? (
    <StatusBadge status={status.value} label={status.label} />
  ) : null

  return (
    <header data-slot="page-header" className={className}>
      {/* Desktop */}
      <div className="hidden items-center justify-between gap-4 border-y border-border py-5 md:flex">
        <div className="flex min-w-0 flex-col gap-1">
          {breadcrumb ? (
            <span className="truncate text-xs leading-4 text-text-muted">
              {breadcrumb}
            </span>
          ) : null}
          <div className="flex items-center gap-2.5">
            {titleEl}
            {statusEl}
          </div>
        </div>
        {showActions ? (
          <div className="flex shrink-0 gap-2">{actions}</div>
        ) : null}
      </div>

      {/* Mobile top-bar */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                aria-label="Back"
                className="shrink-0 text-text-secondary"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
            ) : null}
            {breadcrumb ? (
              <span className="truncate text-[13px] leading-4 text-text-muted">
                {breadcrumb}
              </span>
            ) : null}
          </div>
          {!error && mobileAction ? (
            <div className="shrink-0">{mobileAction}</div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2.5 px-4 py-4">
          {titleEl}
          {statusEl}
        </div>
      </div>
    </header>
  )
}
