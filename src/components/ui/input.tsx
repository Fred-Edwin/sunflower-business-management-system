import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-[var(--control-h-md)] w-full min-w-0 rounded-md border border-border bg-surface px-3 py-1 text-sm text-text-primary transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary placeholder:text-text-muted focus-visible:border-border-focus focus-visible:ring-3 focus-visible:ring-border-focus/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-50 aria-invalid:border-danger-solid aria-invalid:ring-3 aria-invalid:ring-danger-solid/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
