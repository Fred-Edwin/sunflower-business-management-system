import * as React from "react"
import { ConflictBanner } from "@/components/ConflictBanner"

// Chronological day grouping (band 5RU-0): a sunken date header
// ("SAT 18 OCT  2 events · conflict") + event rows beneath. Empty day = a quiet
// single "Nothing scheduled" row. A conflict day shows a ConflictBanner inline
// before its rows. §12 promotion.
//
// Event rows are passed as children (AgendaEventRow instances).

export function AgendaDayGroup({
  /** Pre-formatted, e.g. "SAT 18 OCT". */
  dateLabel,
  eventCount,
  conflict = false,
  /** Inline conflict explanation, shown as a ConflictBanner before the rows. */
  conflictMessage,
  children,
  className,
}: {
  dateLabel: string
  eventCount: number
  conflict?: boolean
  conflictMessage?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  const empty = eventCount === 0

  return (
    <div data-slot="agenda-day-group" className={className}>
      <div className="flex items-center gap-2 border-b border-border bg-surface-sunken px-4 py-2">
        <span className="font-mono text-xs font-semibold leading-4 tracking-[0.03em] text-text-primary">
          {dateLabel}
        </span>
        {!empty ? (
          <span className="text-xs leading-4 text-text-muted">
            {eventCount} {eventCount === 1 ? "event" : "events"}
          </span>
        ) : null}
        {conflict ? (
          <ConflictBanner variant="pill" message="conflict" />
        ) : null}
      </div>

      {empty ? (
        <div className="px-4 py-3">
          <span className="text-[13px] leading-4 text-text-muted">
            Nothing scheduled
          </span>
        </div>
      ) : (
        <>
          {conflict && conflictMessage ? (
            <div className="px-4 py-2.5">
              <ConflictBanner message={conflictMessage} />
            </div>
          ) : null}
          {children}
        </>
      )}
    </div>
  )
}
