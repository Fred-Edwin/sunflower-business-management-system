import { cn } from "cn"

// Layout primitives for /dev/gallery. Every component state is a SEPARATE
// STATIC instance — `data-force-state="hover"` (etc.) makes the browser
// evaluate the primitive's real state selectors without a real pointer
// (globals.css forced-state convention, PHASE-00B §5.5).

export function GallerySection({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-border py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {note ? <p className="text-sm text-text-muted">{note}</p> : null}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

export function StateRow({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-text-muted">
        {label}
      </div>
      <div className={cn("flex flex-wrap items-center gap-4", className)}>
        {children}
      </div>
    </div>
  )
}
