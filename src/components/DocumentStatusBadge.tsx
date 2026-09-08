import { StatusBadge } from "@/components/StatusBadge"

// Named wrapper = StatusBadge for a document status (band 4U7-0). The document
// domain has 10 states; this exists so call sites read `DocumentStatusBadge`
// rather than an untyped `variant` string.

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

export function DocumentStatusBadge({
  status,
  label,
  loading,
  chip,
  chipState,
  className,
}: {
  status: DocumentStatus
  label?: string
  loading?: boolean
  chip?: boolean
  chipState?: "resting" | "hover" | "focus" | "selected" | "disabled"
  className?: string
}) {
  return (
    <StatusBadge
      status={status}
      label={label}
      loading={loading}
      chip={chip}
      chipState={chipState}
      className={className}
    />
  )
}
