import { TriangleAlertIcon } from "lucide-react"
import { cn } from "cn"
import { StatusBadge, type StatusValue } from "@/components/StatusBadge"

// date range (mono) / title + client·venue·detail / status label or
// "Equipment clash" on the right; status left-bar on mobile (band 5RU-0).
// §12 promotion.

const BAR: Partial<Record<StatusValue, string>> = {
  draft: "bg-status-draft",
  sent: "bg-status-sent",
  accepted: "bg-status-accepted",
  scheduled: "bg-status-sent",
  "in-progress": "bg-status-accepted",
  completed: "bg-inventory-maintenance",
  cancelled: "bg-status-overdue",
}

export function AgendaEventRow({
  /** Pre-formatted, e.g. "08:00–18:00". */
  timeRange,
  title,
  /** client · venue · detail. */
  detail,
  status,
  /** Show "Equipment clash" instead of the status label. */
  clash = false,
  onClick,
  className,
}: {
  timeRange: string
  title: string
  detail?: string
  status?: StatusValue
  clash?: boolean
  onClick?: () => void
  className?: string
}) {
  const Wrapper = onClick ? "button" : "div"
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      data-slot="agenda-event-row"
      className={cn(
        "flex w-full items-start gap-4 border-b border-border px-4 py-3 text-left last:border-b-0",
        className,
      )}
    >
      {/* status left-bar — mobile only */}
      {status ? (
        <span
          aria-hidden
          className={cn(
            "mt-0.5 w-[3px] shrink-0 self-stretch rounded-sm md:hidden",
            BAR[status] ?? "bg-status-draft",
          )}
        />
      ) : null}
      <div className="w-[110px] shrink-0 pt-px">
        <span className="font-mono text-xs leading-[18px] text-text-muted">
          {timeRange}
        </span>
      </div>
      <div className="flex min-w-0 grow flex-col gap-0.5">
        <span className="text-sm font-semibold leading-[19px] text-text-primary">
          {title}
        </span>
        {detail ? (
          <span className="text-xs leading-4 text-text-muted">{detail}</span>
        ) : null}
      </div>
      <div className="shrink-0 pt-0.5">
        {clash ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium leading-4 text-danger-solid">
            <TriangleAlertIcon className="size-3 shrink-0" />
            Equipment clash
          </span>
        ) : status ? (
          <StatusBadge status={status} />
        ) : null}
      </div>
    </Wrapper>
  )
}
