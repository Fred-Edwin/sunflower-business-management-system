import { cn } from "cn"
import type { StatusValue } from "@/components/StatusBadge"

// The calendar item (band 5PY-0): title (13 semibold) + client·role (12 muted),
// a status-coloured left bar. The Agenda view uses AgendaEventRow instead.
// §12 promotion.

const BAR: Partial<Record<StatusValue, string>> = {
  draft: "bg-status-draft",
  sent: "bg-status-sent",
  accepted: "bg-status-accepted",
  declined: "bg-status-declined",
  scheduled: "bg-status-sent",
  "in-progress": "bg-status-accepted",
  completed: "bg-inventory-maintenance",
  cancelled: "bg-status-overdue",
}

export function EventChip({
  title,
  subtitle,
  status = "sent",
  onClick,
  className,
}: {
  title: string
  /** client · role, e.g. "Grace M · full setup". */
  subtitle?: string
  status?: StatusValue
  onClick?: () => void
  className?: string
}) {
  const Wrapper = onClick ? "button" : "div"
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      data-slot="event-chip"
      className={cn(
        "flex w-full gap-1.5 overflow-hidden rounded-md bg-surface-sunken py-[5px] pr-1.5 text-left",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "w-[3px] shrink-0 self-stretch rounded-sm",
          BAR[status] ?? "bg-status-draft",
        )}
      />
      <span className="flex min-w-0 flex-col gap-px">
        <span className="line-clamp-1 text-[13px] font-semibold leading-4 text-text-primary">
          {title}
        </span>
        {subtitle ? (
          <span className="line-clamp-1 text-xs leading-[15px] text-text-muted">
            {subtitle}
          </span>
        ) : null}
      </span>
    </Wrapper>
  )
}
