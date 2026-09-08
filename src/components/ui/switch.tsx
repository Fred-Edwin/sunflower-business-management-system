"use client"

import * as React from "react"
import { cn } from "cn"
import { Switch as SwitchPrimitive } from "radix-ui"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        // Track 32×18, 2px inset, thumb 14×14 (Paper HA-0 node K1-0;
        // PHASE-00B-tier1-fidelity.md). sm keeps the 24×14 proportion.
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent p-0.5 transition-all outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-border-focus focus-visible:ring-3 focus-visible:ring-border-focus/30 aria-invalid:border-danger-solid aria-invalid:ring-3 aria-invalid:ring-danger-solid/20 data-[size=default]:h-[18px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-accent data-unchecked:bg-neutral-300 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-neutral-0 ring-0 transition-transform group-data-[size=default]/switch:size-[14px] group-data-[size=sm]/switch:size-[10px] group-data-[size=default]/switch:data-checked:translate-x-[14px] group-data-[size=sm]/switch:data-checked:translate-x-[10px] data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
