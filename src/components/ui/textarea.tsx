import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-colors outline-none placeholder:text-text-muted focus-visible:border-border-focus focus-visible:ring-3 focus-visible:ring-border-focus/30 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-50 aria-invalid:border-danger-solid aria-invalid:ring-3 aria-invalid:ring-danger-solid/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
