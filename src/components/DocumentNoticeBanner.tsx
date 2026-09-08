import { CircleXIcon, ClockIcon, ArrowRightIcon } from "lucide-react"
import { cn } from "cn"

// Permanent document-state notice (band 5JT-0). INV-I3 — void/replace and
// superseded-quote notices ALWAYS carry the forward link. X-circle icon, bold
// title, reason line, a forward link button ("Go to INV-2026-0043").
//
//  tone="danger"   voided / replaced invoice
//  tone="neutral"  superseded quote version
//
// Distinct from ConflictBanner — this is a fact about the record, and it is
// permanent. §12 promotion.

export function DocumentNoticeBanner({
  tone,
  title,
  reason,
  link,
  className,
}: {
  tone: "danger" | "neutral"
  title: string
  reason: React.ReactNode
  /** The forward link — ALWAYS rendered (INV-I3). */
  link: { label: string; href: string }
  className?: string
}) {
  const danger = tone === "danger"
  const Icon = danger ? CircleXIcon : ClockIcon

  return (
    <div
      data-slot="document-notice-banner"
      data-tone={tone}
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3.5",
        danger
          ? "border-danger-solid bg-danger-subtle"
          : "border-border-strong bg-surface-sunken",
        className,
      )}
    >
      <Icon
        className={cn(
          "mt-px size-[18px] shrink-0",
          danger ? "text-danger-solid" : "text-text-muted",
        )}
      />
      <div className="flex grow flex-col gap-1.5">
        <p className="text-sm font-semibold leading-[19px] text-text-primary">
          {title}
        </p>
        <p className="text-[13px] leading-[19px] text-text-secondary">
          {reason}
        </p>
        <a
          href={link.href}
          className={cn(
            "mt-0.5 inline-flex h-8 shrink-0 items-center gap-1.5 self-start rounded-md border bg-surface px-3",
            danger ? "border-danger-solid" : "border-border-strong",
          )}
        >
          <span
            className={cn(
              "font-mono text-xs font-semibold leading-4",
              danger ? "text-danger-solid" : "text-text-secondary",
            )}
          >
            {link.label}
          </span>
          <ArrowRightIcon className="size-[13px] shrink-0 text-text-secondary" />
        </a>
      </div>
    </div>
  )
}
