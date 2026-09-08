"use client"

import { Trash2Icon, TriangleAlertIcon } from "lucide-react"
import { cn } from "cn"
import { MoneyDisplay } from "@/components/MoneyDisplay"
import { QuantityInput } from "@/components/QuantityInput"
import { AvailabilityBadge } from "@/components/AvailabilityBadge"

// One component, three variants (band 51H-0). Reconciled from three screen
// treatments.
//
//  quote     — # index, editable QuantityInput, AvailabilityBadge column,
//              unit price, line total, delete. Row hover = surface-sunken;
//              focus-within = accent inset.
//  document  — invoice / delivery note. NO index, NO availability, static qty,
//              NO delete. Snapshot values only (INV-P2 — the component API
//              takes name/description/price as props, never a catalog lookup).
//              Read-only ALWAYS (INV-I2 — issued documents immutable).
//  voice     — item + qty only. A flagged row takes the VoiceReviewField
//              uncertainty treatment (warning-subtle bg + warning border +
//              inline triangle). Flag text NEVER truncates.
//
// Mobile projection is via the DataTable card contract at the call site — not a
// separate component.

type SnapshotFields = {
  /** Snapshotted name — never the live catalog name (INV-P2). */
  name: string
  /** Snapshotted description. */
  description?: string
  /** Snapshotted unit price in KES cents (INV-M1). */
  unitPriceCents: number
  quantity: number
}

type QuoteLineItemRow = {
  variant: "quote"
  index: number
  onQuantityChange?: (quantity: number) => void
  onDelete?: () => void
  availability?: {
    minAvailable: number
    totalQuantity: number
  }
} & SnapshotFields

type DocumentLineItemRow = {
  variant: "document"
} & SnapshotFields

type VoiceLineItemRow = {
  variant: "voice"
  name: string
  quantity: number
  /** Uncertainty flag text — shown in full, never truncated (INV-V5). */
  flag?: string
}

type LineItemRowProps = (
  | QuoteLineItemRow
  | DocumentLineItemRow
  | VoiceLineItemRow
) & { className?: string }

const CELL = "shrink-0 px-3"

export function LineItemRow(props: LineItemRowProps) {
  if (props.variant === "voice") {
    const flagged = Boolean(props.flag)
    return (
      <div
        data-slot="line-item-row"
        data-variant="voice"
        className={cn(
          "flex items-center gap-2 px-3",
          flagged
            ? "border-b border-warning-solid bg-warning-subtle py-2"
            : "h-9 border-b border-border",
          props.className,
        )}
      >
        <div className="flex grow items-center gap-2">
          {flagged ? (
            <TriangleAlertIcon className="size-[13px] shrink-0 text-warning-solid" />
          ) : null}
          <span
            className={cn(
              "text-sm leading-[18px] text-text-primary",
              // Flag text never truncates (INV-V5).
              !flagged && "truncate",
            )}
          >
            {flagged ? props.flag : props.name}
          </span>
        </div>
        <span className="shrink-0 font-mono text-sm leading-[18px] tabular-nums text-text-primary">
          {props.quantity}
        </span>
      </div>
    )
  }

  if (props.variant === "document") {
    // Read-only always. No stepper, no delete, no availability (INV-I2).
    return (
      <div
        data-slot="line-item-row"
        data-variant="document"
        className={cn(
          "flex items-center border-b border-border last:border-b-0",
          props.className,
        )}
      >
        <div className={cn(CELL, "w-[240px]")}>
          <div className="truncate text-sm leading-[18px] text-text-primary">
            {props.name}
          </div>
        </div>
        <div className={cn(CELL, "w-[200px]")}>
          <div className="truncate text-[13px] leading-4 text-text-muted">
            {props.description}
          </div>
        </div>
        <div className="grow" />
        <div className={cn(CELL, "w-20 text-right")}>
          <span className="font-mono text-[13px] leading-4 tabular-nums text-text-primary">
            {props.quantity}
          </span>
        </div>
        <div className={cn(CELL, "w-[120px] text-right")}>
          <MoneyDisplay cents={props.unitPriceCents * props.quantity} />
        </div>
      </div>
    )
  }

  // variant === "quote"
  const { index, name, description, unitPriceCents, quantity, availability } =
    props
  const overAvailable =
    availability !== undefined && quantity > availability.minAvailable

  return (
    <div
      data-slot="line-item-row"
      data-variant="quote"
      className={cn(
        "group flex h-[38px] items-center border-b border-border transition-colors",
        "hover:bg-surface-sunken focus-within:shadow-[inset_0_0_0_2px_var(--color-accent)]",
        props.className,
      )}
    >
      <div className="flex w-8 shrink-0 justify-end px-2.5">
        <span className="font-mono text-xs leading-4 text-text-muted">
          {index}
        </span>
      </div>
      <div className={cn(CELL, "w-[240px]")}>
        <div className="truncate text-sm font-medium leading-[18px] text-text-primary">
          {name}
        </div>
      </div>
      <div className={cn(CELL, "w-[200px]")}>
        <div className="truncate text-[13px] leading-4 text-text-muted">
          {description}
        </div>
      </div>
      <div className={cn(CELL, "w-20")}>
        <QuantityInput
          size="row"
          value={quantity}
          onChange={props.onQuantityChange}
          overAvailable={overAvailable}
          aria-label={`Quantity for ${name}`}
        />
      </div>
      <div className={cn(CELL, "flex w-[150px] items-center")}>
        {availability ? (
          <AvailabilityBadge
            minAvailable={availability.minAvailable}
            totalQuantity={availability.totalQuantity}
            requested={quantity}
          />
        ) : null}
      </div>
      <div className={cn(CELL, "w-[120px] text-right")}>
        <MoneyDisplay cents={unitPriceCents} />
      </div>
      <div className={cn(CELL, "w-[120px] text-right")}>
        <MoneyDisplay cents={unitPriceCents * quantity} className="font-medium" />
      </div>
      <div className="flex w-9 shrink-0 justify-center">
        {props.onDelete ? (
          <button
            type="button"
            onClick={props.onDelete}
            aria-label={`Remove ${name}`}
            className="text-text-muted transition-colors hover:text-danger-solid"
          >
            <Trash2Icon className="size-[13px]" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
