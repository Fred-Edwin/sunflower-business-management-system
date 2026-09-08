import * as React from "react"
import { TriangleAlertIcon } from "lucide-react"
import { cn } from "cn"

// Wraps any field on the voice review form (band 5M5-0). INV-V5 — the
// uncertainty flag is border + label + icon, NEVER colour alone:
//   warning-subtle bg + 1px warning border + an uppercase flag label with a
//   triangle icon ("NO MATCH", "CHECK THIS") + optional helper text.
//
// Resting (no `flag`) is a PASSTHROUGH — the field looks exactly like manual
// entry, so the form is the same component whether values came from speech or
// typing.

export function VoiceReviewField({
  flag,
  label,
  helper,
  children,
  className,
}: {
  /** Uncertainty label, e.g. "CHECK THIS" / "NO MATCH". Omit for passthrough. */
  flag?: string
  /** The field's own label. */
  label?: React.ReactNode
  /** Helper text under the field, e.g. "Heard 'the 14th' — month assumed". */
  helper?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  if (!flag) {
    return (
      <div
        data-slot="voice-review-field"
        className={cn("flex flex-col gap-1.5", className)}
      >
        {label ? (
          <span className="text-xs font-medium leading-4 text-text-secondary">
            {label}
          </span>
        ) : null}
        {children}
      </div>
    )
  }

  return (
    <div
      data-slot="voice-review-field"
      data-flagged
      className={cn(
        "flex flex-col gap-1.5 rounded-lg border border-warning-solid bg-warning-subtle px-3 py-2.5",
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <TriangleAlertIcon className="size-3 shrink-0 text-warning-solid" />
        <span className="text-[10px] font-semibold uppercase leading-3 tracking-[0.05em] text-warning-solid">
          {flag}
        </span>
      </span>
      {label ? (
        <span className="text-xs font-medium leading-4 text-text-secondary">
          {label}
        </span>
      ) : null}
      {children}
      {helper ? (
        <span className="text-[11px] leading-[15px] text-text-muted">
          {helper}
        </span>
      ) : null}
    </div>
  )
}
