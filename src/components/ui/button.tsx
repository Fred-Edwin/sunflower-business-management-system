import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-border-focus focus-visible:ring-3 focus-visible:ring-border-focus/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger-solid aria-invalid:ring-3 aria-invalid:ring-danger-solid/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-accent text-text-on-accent hover:bg-accent-hover active:bg-accent-active",
        outline:
          "border-border bg-background text-text-primary hover:bg-surface-sunken aria-expanded:bg-surface-sunken",
        secondary:
          "bg-neutral-100 text-text-primary hover:bg-neutral-200 aria-expanded:bg-neutral-200",
        ghost:
          "text-text-primary hover:bg-surface-sunken aria-expanded:bg-surface-sunken",
        destructive:
          "bg-danger-subtle text-danger-solid hover:bg-danger-subtle/70 focus-visible:border-danger-solid/40 focus-visible:ring-danger-solid/20",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        // Designed default = 36px, 14px pad-x, text 14 / weight 500
        // (Paper HA-0 header, node JE-0; PHASE-00B-tier1-fidelity.md).
        default:
          "h-[var(--control-h-md)] gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-[var(--control-h-sm)] gap-1 px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        // Mobile primary — --control-h-lg (design-system.md §9).
        lg: "h-[var(--control-h-lg)] gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-[var(--control-h-md)]",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-[var(--control-h-sm)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-[var(--control-h-lg)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
