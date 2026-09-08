import { cn } from "cn"
import { EventChip } from "@/components/EventChip"
import { ConflictBanner } from "@/components/ConflictBanner"
import type { StatusValue } from "@/components/StatusBadge"

// Month grid focused to a 1–2-week span (band 5PY-0). Weekday header row
// (MON…SUN, 12px), tall day cells, date number top-left (12px muted), a
// ConflictBanner compact pill in a conflict day-cell, EventChips stacked.
// States: populated, empty day, conflict day, loading. §12 promotion.

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

export type CalendarDay = {
  /** yyyy-mm-dd */
  date: string
  /** Day-of-month number to show. */
  dayNumber: number
  /** Dim days outside the focused span. */
  muted?: boolean
  conflict?: boolean
  events?: {
    id: string
    title: string
    subtitle?: string
    status?: StatusValue
  }[]
}

export function CalendarGrid({
  /** Weekday index (0 = MON) to emphasise in the header, e.g. today. */
  todayColumn,
  days,
  loading = false,
  className,
}: {
  todayColumn?: number
  days: CalendarDay[]
  loading?: boolean
  className?: string
}) {
  return (
    <div
      data-slot="calendar-grid"
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-surface",
        className,
      )}
    >
      <div className="flex border-b border-border-strong bg-surface-sunken">
        {WEEKDAYS.map((wd, i) => (
          <div key={wd} className="grow px-2.5 py-2">
            <span
              className={cn(
                "text-xs font-semibold leading-4 tracking-[0.03em]",
                i === todayColumn ? "text-text-primary" : "text-text-muted",
              )}
            >
              {wd}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        {(loading
          ? (Array.from({ length: 7 }).map((_, i) => ({
              date: String(i),
              dayNumber: i + 13,
              events: [],
            })) as CalendarDay[])
          : days
        ).map((day, i) => (
          <div
            key={day.date}
            className={cn(
              "flex min-h-[150px] grow basis-0 flex-col gap-1.5 p-2",
              i < 6 && "border-r border-border",
              day.conflict && "bg-danger-subtle",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "font-mono text-xs leading-4",
                  day.conflict
                    ? "font-semibold text-text-primary"
                    : day.muted
                      ? "text-border-strong"
                      : "text-text-muted",
                )}
              >
                {day.dayNumber}
              </span>
              {day.conflict ? (
                <ConflictBanner variant="pill" message="Clash" />
              ) : null}
            </div>

            {loading ? (
              <>
                <span className="h-[34px] rounded-md bg-neutral-100" />
                <span className="h-[34px] w-3/4 rounded-md bg-neutral-100" />
              </>
            ) : (
              day.events?.map((ev) => (
                <EventChip
                  key={ev.id}
                  title={ev.title}
                  subtitle={ev.subtitle}
                  status={ev.status}
                  className={day.conflict ? "bg-surface" : undefined}
                />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
