import * as React from "react"
import { cn } from "cn"

// Centred icon (~28px, 1.5 stroke, muted) / title (16–18 semibold) / body
// (muted) / one or two action buttons (band 5G9-0). DataTable hands off to this
// for its empty state. Canonical uses: "No history yet", "No active catalog
// items", "No quotes yet".

export function EmptyState({
  icon,
  title,
  body,
  actions,
  className,
}: {
  /** A lucide icon element — rendered at 28px, 1.5 stroke, muted. */
  icon?: React.ReactNode
  title: string
  body?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-lg border border-border bg-surface-sunken px-5 py-8 text-center",
        className,
      )}
    >
      {icon ? (
        <span className="text-text-muted [&_svg]:size-7 [&_svg]:stroke-[1.5]">
          {icon}
        </span>
      ) : null}
      <p className="text-base font-semibold leading-[22px] text-text-primary">
        {title}
      </p>
      {body ? (
        <p className="max-w-[240px] text-[13px] leading-[18px] text-text-muted">
          {body}
        </p>
      ) : null}
      {actions ? <div className="mt-0.5 flex gap-2">{actions}</div> : null}
    </div>
  )
}
