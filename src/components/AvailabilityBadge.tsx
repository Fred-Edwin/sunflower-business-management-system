import { cn } from "cn"
import { StatusBadge } from "@/components/StatusBadge"

// Wrapper over StatusBadge (inventory domain) that formats availability numbers
// into the label (band 4YY-0). Two label forms:
//   "N of M free"  — quote builder, where the owned total matters
//   "N free · day" — availability worst-day form
// Severity is derived, not passed:
//   available  free >= requested
//   low        0 < free < requested
//   damaged    free === 0   (rendered as the "none" severity)

type LabelForm = "of-total" | "worst-day"

export function AvailabilityBadge({
  minAvailable,
  totalQuantity,
  requested = 1,
  form = "of-total",
  dayLabel,
  loading = false,
  notChecked = false,
  className,
}: {
  minAvailable: number
  totalQuantity: number
  /** The quantity being checked against (line-item qty, or 1 elsewhere). */
  requested?: number
  form?: LabelForm
  /** Weekday+date for the "worst-day" form, e.g. "Sat 14". */
  dayLabel?: string
  loading?: boolean
  notChecked?: boolean
  className?: string
}) {
  if (loading) {
    return <StatusBadge status="available" loading className={className} />
  }

  if (notChecked) {
    return (
      <span
        data-slot="availability-badge"
        className={cn("inline-flex items-center gap-1.5", className)}
      >
        <span className="size-1.5 shrink-0 rounded-full bg-border-strong" aria-hidden />
        <span className="text-[13px] leading-4 text-text-muted">
          Pick dates to check
        </span>
      </span>
    )
  }

  const severity =
    minAvailable === 0 ? "damaged" : minAvailable < requested ? "low" : "available"

  let label: string
  if (form === "worst-day") {
    label =
      minAvailable === 0
        ? `0 free${dayLabel ? ` · ${dayLabel}` : ""}`
        : `${minAvailable}${dayLabel ? ` · ${dayLabel}` : " free"}`
  } else {
    label = `${minAvailable} of ${totalQuantity} free`
  }

  return <StatusBadge status={severity} label={label} className={className} />
}
