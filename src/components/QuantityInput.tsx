"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { cn } from "cn"

// Integer stepper for line-item quantities (band 4Y0-0). Tabular numerals
// (INV-M5). Availability-aware: when `overAvailable` is set the border turns
// warning — but entry is NEVER blocked or disabled (INV-A6, "warn, do not
// block"). Two sizes: 24px bare field inside a table row, 36px standalone with
// ± steppers.

type QuantityInputProps = {
  value: number
  onChange?: (value: number) => void
  /** 24px bare field for a table row; 36px standalone with ± steppers. */
  size?: "row" | "standalone"
  /** Value exceeds free availability — warning border only (INV-A6). */
  overAvailable?: boolean
  /** Issued document — read-only. */
  disabled?: boolean
  min?: number
  max?: number
  "aria-invalid"?: boolean
  "aria-label"?: string
  id?: string
  className?: string
}

export function QuantityInput({
  value,
  onChange,
  size = "standalone",
  overAvailable = false,
  disabled = false,
  min = 0,
  max,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  id,
  className,
}: QuantityInputProps) {
  function commit(next: number) {
    if (disabled || !onChange) return
    let clamped = Number.isNaN(next) ? min : Math.trunc(next)
    if (clamped < min) clamped = min
    if (max !== undefined && clamped > max) clamped = max
    onChange(clamped)
  }

  const invalid = ariaInvalid ?? false

  const field = (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      aria-label={ariaLabel}
      onChange={(e) => commit(Number(e.target.value.replace(/[^0-9-]/g, "")))}
      className={cn(
        "w-full bg-transparent text-center font-mono font-medium tabular-nums text-text-primary outline-none",
        size === "row" ? "text-[13px] leading-4" : "text-sm leading-[18px]",
        disabled && "text-text-muted",
        invalid && "text-danger-solid",
      )}
    />
  )

  if (size === "row") {
    return (
      <div
        data-slot="quantity-input"
        className={cn(
          "flex h-6 w-16 items-center rounded-sm border bg-surface transition-colors",
          "focus-within:border-border-focus focus-within:shadow-[var(--focus-ring)]",
          invalid
            ? "border-danger-solid"
            : overAvailable
              ? "border-warning-solid"
              : "border-border",
          disabled && "border-border bg-surface-sunken opacity-60",
          className,
        )}
      >
        {field}
      </div>
    )
  }

  const StepButton = ({
    dir,
    icon: Icon,
  }: {
    dir: -1 | 1
    icon: typeof MinusIcon
  }) => (
    <button
      type="button"
      tabIndex={-1}
      disabled={disabled}
      aria-label={dir === -1 ? "Decrease quantity" : "Increase quantity"}
      onClick={() => commit(value + dir)}
      className={cn(
        "flex w-8 shrink-0 items-center justify-center bg-surface-sunken text-text-secondary transition-colors",
        "hover:bg-neutral-100 disabled:pointer-events-none",
        dir === -1 ? "border-r border-border" : "border-l border-border",
      )}
    >
      <Icon className="size-3.5" />
    </button>
  )

  return (
    <div
      data-slot="quantity-input"
      className={cn(
        "flex h-9 w-fit items-stretch overflow-hidden rounded-md border transition-colors",
        "focus-within:border-border-focus focus-within:shadow-[var(--focus-ring)]",
        invalid
          ? "border-danger-solid"
          : overAvailable
            ? "border-warning-solid"
            : "border-border",
        disabled && "border-border bg-surface-sunken opacity-60",
        className,
      )}
    >
      <StepButton dir={-1} icon={MinusIcon} />
      <div className="flex w-14 items-center justify-center">{field}</div>
      <StepButton dir={1} icon={PlusIcon} />
    </div>
  )
}
