"use client"

import * as React from "react"
import { CircleAlertIcon, LoaderCircleIcon } from "lucide-react"
import { cn } from "cn"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Destructive / irreversible-action confirmation — issue, accept, void (band
// 5HH-0). Dialog base (shadow-lg, focus trap). The body is a plain-language
// statement of what will happen — not "Are you sure?". The confirm button NAMES
// the action ("Void invoice", not "Confirm") — ui-conventions.md §9.9.
//
// States: resting, pending (button spinner + disabled), error (inline message,
// dialog stays open).

export function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  /** Names the action, e.g. "Void invoice". */
  confirmLabel,
  cancelLabel = "Cancel",
  /** danger for void/destructive; accent for issue/accept. */
  tone = "danger",
  pending = false,
  error,
  onConfirm,
  className,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description: React.ReactNode
  confirmLabel: string
  cancelLabel?: string
  tone?: "danger" | "accent"
  pending?: boolean
  error?: string
  onConfirm?: () => void
  className?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        showCloseButton={false}
        className={cn("sm:max-w-[400px]", className)}
      >
        <DialogHeader>
          <DialogTitle className="text-base font-semibold leading-[22px]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-[19px] text-text-secondary">
            {description}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="flex items-start gap-2 rounded-md border border-danger-solid bg-danger-subtle px-3 py-2.5">
            <CircleAlertIcon className="mt-px size-3.5 shrink-0 text-danger-solid" />
            <p className="text-xs leading-[17px] text-danger-solid">{error}</p>
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={pending}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            variant={tone === "danger" ? "destructive" : "default"}
            disabled={pending}
            onClick={onConfirm}
            className={cn(
              tone === "danger" &&
                "bg-danger-solid text-neutral-0 hover:bg-danger-solid/90",
            )}
          >
            {pending ? (
              <>
                <LoaderCircleIcon className="size-3.5 animate-spin" />
                {confirmLabel}…
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
