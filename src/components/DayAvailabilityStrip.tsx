import { cn } from "cn"

// The across-the-range availability breakdown (band 500-0, §12 promotion).
// One treatment, three placements: Availability Range mode, Availability mobile
// card (a DataTable `wide:true` region), item-detail per-day strip.
//
// Worst-day encoding EXACTLY per inventory-availability.md §7:
//   worst day  = the byDay entry whose `available === minAvailable`
//                (ties resolve to the earliest day)
//   that cell  = warning-subtle tint when its availability < checkedQuantity,
//                success-subtle otherwise, PLUS a border-strong outline
//   every other cell = untinted
// This is the ONLY severity encoding on the strip.
//
// Scrolls inside its OWN overflow-x container; the page body never scrolls
// horizontally.

type DayEntry = { day: string; available: number }

function formatDayLabel(iso: string): string {
  // Parse the yyyy-mm-dd as a plain calendar date (no timezone shift) and show
  // "Sat 14". Display timezone is fixed elsewhere; this is label-only.
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return iso
  const date = new Date(Date.UTC(y, m - 1, d))
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    date.getUTCDay()
  ]
  return `${weekday} ${d}`
}

/** Index of the worst day: first entry equal to minAvailable (earliest wins). */
function worstDayIndex(byDay: DayEntry[], minAvailable: number): number {
  return byDay.findIndex((entry) => entry.available === minAvailable)
}

export function DayAvailabilityStrip({
  byDay,
  minAvailable,
  checkedQuantity,
  loading = false,
  className,
}: {
  byDay: DayEntry[]
  minAvailable: number
  /** Line-item quantity in the quote builder; 1 elsewhere. */
  checkedQuantity: number
  loading?: boolean
  className?: string
}) {
  if (loading) {
    return (
      <div
        data-slot="day-availability-strip"
        className={cn("flex gap-2 overflow-x-auto pb-1", className)}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex w-16 shrink-0 flex-col items-center gap-0.5 rounded-md border border-border px-1 py-2"
          >
            <span className="h-2 w-8 rounded-sm bg-surface-sunken" />
            <span className="h-2.5 w-4 rounded-sm bg-surface-sunken" />
          </div>
        ))}
      </div>
    )
  }

  const worst = worstDayIndex(byDay, minAvailable)

  return (
    <div
      data-slot="day-availability-strip"
      className={cn("flex gap-2 overflow-x-auto pb-1", className)}
    >
      {byDay.map((entry, i) => {
        const isWorst = i === worst
        const short = isWorst && entry.available < checkedQuantity
        return (
          <div
            key={entry.day}
            className={cn(
              "flex w-16 shrink-0 flex-col items-center gap-0.5 rounded-md border px-1 py-2",
              isWorst
                ? cn(
                    "border-border-strong",
                    short ? "bg-warning-subtle" : "bg-success-subtle",
                  )
                : "border-border",
            )}
          >
            <span className="font-mono text-[10px] leading-3 text-text-muted">
              {formatDayLabel(entry.day)}
            </span>
            <span className="font-mono text-[13px] leading-4 tabular-nums text-text-primary">
              {entry.available}
            </span>
          </div>
        )
      })}
    </div>
  )
}
