import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-border-focus focus-visible:ring-[3px] focus-visible:ring-border-focus/30 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-danger-solid aria-invalid:ring-danger-solid/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-accent text-text-on-accent [a]:hover:bg-accent-hover",
        secondary: "bg-neutral-100 text-text-primary [a]:hover:bg-neutral-200",
        destructive:
          "bg-danger-subtle text-danger-solid focus-visible:ring-danger-solid/20 [a]:hover:bg-danger-subtle/70",
        outline:
          "border-border text-text-primary [a]:hover:bg-surface-sunken [a]:hover:text-text-primary",
        ghost:
          "hover:bg-surface-sunken hover:text-text-primary",
        link: "text-accent underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
