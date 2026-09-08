"use client"

import * as React from "react"
import { cn } from "cn"
import { Label as LabelPrimitive } from "radix-ui"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Inline label beside a control (checkbox / radio / switch) — 13px,
        // matching the Paper screens (PHASE-00B-tier1-fidelity.md). FormLabel
        // overrides this for the field-label case (12px / 500 / secondary).
        "flex items-center gap-2 text-[13px] leading-4 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
