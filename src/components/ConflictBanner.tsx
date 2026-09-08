import { TriangleAlertIcon } from "lucide-react"
import { cn } from "cn"

// Transient, advisory (band 5IX-0). INV-A6 — WARN, do not block: it carries NO
// forward link and NO action; it is advice, not a state. Warning triangle,
// danger-subtle bg, plain-language message naming the resource and the
// shortfall.
//
// Distinct from DocumentNoticeBanner — do NOT merge (different lifespan,
// severity, action model). §12 promotion.
//
// `variant="pill"` is the compact form for a calendar day-cell.

export function ConflictBanner({
  message,
  variant = "full",
  className,
}: {
  message: React.ReactNode
  variant?: "full" | "pill"
  className?: string
}) {
  if (variant === "pill") {
    return (
      <span
        data-slot="conflict-banner"
        data-variant="pill"
        className={cn(
          "inline-flex items-center gap-1 self-start rounded-full border border-danger-solid bg-danger-subtle py-0.5 pl-1.5 pr-2",
          className,
        )}
      >
        <TriangleAlertIcon className="size-[11px] shrink-0 text-danger-solid" />
        <span className="text-[11px] font-semibold leading-[14px] text-danger-solid">
          {message}
        </span>
      </span>
    )
  }

  return (
    <div
      data-slot="conflict-banner"
      data-variant="full"
      role="status"
      className={cn(
        "flex items-start gap-2.5 rounded-md border border-danger-solid bg-danger-subtle px-3.5 py-3",
        className,
      )}
    >
      <TriangleAlertIcon className="mt-px size-4 shrink-0 text-danger-solid" />
      <p className="text-[13px] leading-[19px] text-text-primary">{message}</p>
    </div>
  )
}
