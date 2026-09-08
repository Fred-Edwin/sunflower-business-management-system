import { cn } from "cn"

// One anatomy: a 6px dot + a label in the matching status colour. NO background
// chip (D3.2 #1 — band 4U7-0). Colour never carries meaning alone: the label is
// always present (design-system.md §3). Non-interactive by default; gains
// hover / focus / selected treatment ONLY as a table filter chip (`chip`).

type DocumentStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "expired"
  | "superseded"
  | "paid"
  | "partial"
  | "overdue"
  | "voided"

type EventStatus = "scheduled" | "in-progress" | "completed" | "cancelled"

type InventorySeverity =
  | "available"
  | "low"
  | "committed"
  | "damaged"
  | "maintenance"

export type StatusValue = DocumentStatus | EventStatus | InventorySeverity

type Domain = "document" | "event" | "inventory"

// Dot colour per value. Terminal states still get their own dot colour on the
// canvas; only the *label* goes muted (band 4U7-0).
const DOT: Record<StatusValue, string> = {
  draft: "bg-status-draft",
  sent: "bg-status-sent",
  accepted: "bg-status-accepted",
  declined: "bg-status-declined",
  expired: "bg-status-expired",
  superseded: "bg-status-superseded",
  paid: "bg-status-paid",
  partial: "bg-status-partial",
  overdue: "bg-status-overdue",
  voided: "bg-status-voided",
  scheduled: "bg-status-sent",
  "in-progress": "bg-status-accepted",
  completed: "bg-inventory-maintenance",
  cancelled: "bg-status-overdue",
  available: "bg-inventory-available",
  low: "bg-inventory-low",
  committed: "bg-inventory-committed",
  damaged: "bg-inventory-damaged",
  maintenance: "bg-inventory-maintenance",
}

const LABEL_COLOR: Record<StatusValue, string> = {
  draft: "text-status-draft",
  sent: "text-status-sent",
  accepted: "text-status-accepted",
  declined: "text-text-muted",
  expired: "text-status-expired",
  superseded: "text-text-muted",
  paid: "text-status-paid",
  partial: "text-status-partial",
  overdue: "text-status-overdue",
  voided: "text-text-muted",
  scheduled: "text-status-sent",
  "in-progress": "text-status-accepted",
  completed: "text-text-muted",
  cancelled: "text-text-muted",
  available: "text-inventory-available",
  low: "text-inventory-low",
  committed: "text-inventory-committed",
  damaged: "text-inventory-damaged",
  maintenance: "text-inventory-maintenance",
}

const DEFAULT_LABEL: Record<StatusValue, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
  superseded: "Superseded",
  paid: "Paid",
  partial: "Partially paid",
  overdue: "Overdue",
  voided: "Voided",
  scheduled: "Scheduled",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  available: "Available",
  low: "Low",
  committed: "Committed",
  damaged: "Damaged",
  maintenance: "Maintenance",
}

// Which values each domain is allowed to render, for the gallery variant axis
// and to keep call sites honest.
export const STATUS_VALUES: Record<Domain, StatusValue[]> = {
  document: [
    "draft",
    "sent",
    "accepted",
    "declined",
    "expired",
    "superseded",
    "paid",
    "partial",
    "overdue",
    "voided",
  ],
  event: ["scheduled", "in-progress", "completed", "cancelled"],
  inventory: ["available", "low", "committed", "damaged", "maintenance"],
}

type ChipState = "resting" | "hover" | "focus" | "selected" | "disabled"

export function StatusBadge({
  status,
  label,
  loading = false,
  /** Render as an interactive table filter chip. */
  chip = false,
  chipState = "resting",
  className,
}: {
  status: StatusValue
  label?: string
  loading?: boolean
  chip?: boolean
  chipState?: ChipState
  className?: string
}) {
  if (loading) {
    return (
      <span
        data-slot="status-badge"
        aria-hidden
        className={cn("inline-flex items-center gap-1.5", className)}
      >
        <span className="size-1.5 shrink-0 rounded-full bg-neutral-200" />
        <span className="inline-block h-2.5 w-11 rounded-sm bg-neutral-200" />
      </span>
    )
  }

  const text = label ?? DEFAULT_LABEL[status]

  const chipWrap =
    chip &&
    {
      resting: "",
      hover: "rounded-md bg-surface-sunken px-1.5 py-0.5",
      focus: "rounded-md px-1.5 py-0.5 shadow-[var(--focus-ring)]",
      selected: "rounded-md bg-accent-subtle px-2 py-0.5",
      disabled: "opacity-40",
    }[chipState]

  const selected = chip && chipState === "selected"

  return (
    <span
      data-slot="status-badge"
      data-status={status}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap",
        chipWrap,
        className,
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", DOT[status])}
        aria-hidden
      />
      <span
        className={cn(
          "text-[13px] leading-4",
          selected
            ? "font-semibold text-accent"
            : cn("font-medium", LABEL_COLOR[status]),
        )}
      >
        {text}
      </span>
    </span>
  )
}
