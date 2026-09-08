"use client"

import { MicIcon, SquareIcon, LoaderCircleIcon } from "lucide-react"
import { cn } from "cn"
import { VoiceQueueIndicator } from "@/components/VoiceQueueIndicator"

// Two placements, one component (band 5KU-0).
//
//  fab   — the shell FAB, bottom-right thumb zone on mobile, carries the
//          VoiceQueueIndicator badge.
//  pill  — the per-form pill, alongside a form title.
//
// Three visible states: idle, recording, processing.

type VoiceState = "idle" | "recording" | "processing"

type CommonProps = {
  state?: VoiceState
  onClick?: () => void
  /** Elapsed recording time, e.g. "0:12". */
  elapsed?: string
  className?: string
}

const PILL_LABEL: Record<VoiceState, (elapsed?: string) => string> = {
  idle: () => "Dictate this quote",
  recording: (e) => `Stop · ${e ?? "0:00"}`,
  processing: () => "Transcribing…",
}

export function VoiceMicButton({
  placement = "pill",
  state = "idle",
  onClick,
  elapsed,
  /** FAB only: pending voice-capture count for the badge. */
  queueCount = 0,
  label,
  className,
}: CommonProps & {
  placement?: "fab" | "pill"
  queueCount?: number
  /** Override the pill label. */
  label?: string
}) {
  if (placement === "fab") {
    return (
      <button
        type="button"
        onClick={onClick}
        data-slot="voice-mic-button"
        data-state={state}
        aria-label={
          state === "recording"
            ? "Stop recording"
            : state === "processing"
              ? "Processing voice capture"
              : "Start voice capture"
        }
        className={cn(
          "relative flex size-14 items-center justify-center rounded-full shadow-lg transition-colors",
          state === "recording"
            ? "bg-danger-solid text-neutral-0 shadow-[0_0_0_6px_var(--color-danger-subtle),var(--shadow-lg)]"
            : "bg-accent text-neutral-0",
          state === "processing" && "opacity-70",
          className,
        )}
      >
        {state === "recording" ? (
          <SquareIcon className="size-5 fill-current" />
        ) : state === "processing" ? (
          <LoaderCircleIcon className="size-[22px] animate-spin" />
        ) : (
          <MicIcon className="size-[22px]" />
        )}
        {state === "idle" ? (
          <VoiceQueueIndicator
            count={queueCount}
            className="absolute -right-0.5 -top-0.5 border-2 border-surface"
          />
        ) : null}
      </button>
    )
  }

  const Icon =
    state === "recording"
      ? SquareIcon
      : state === "processing"
        ? LoaderCircleIcon
        : MicIcon

  return (
    <button
      type="button"
      onClick={onClick}
      data-slot="voice-mic-button"
      data-state={state}
      className={cn(
        "inline-flex h-9 items-center gap-2 self-start rounded-full border px-3.5 text-[13px] font-medium leading-4 transition-colors",
        state === "recording"
          ? "border-danger-solid bg-danger-subtle text-danger-solid"
          : state === "processing"
            ? "border-border-strong bg-surface-sunken text-text-muted"
            : "border-border-strong bg-surface text-text-secondary",
        className,
      )}
    >
      <Icon
        className={cn(
          "size-[15px] shrink-0",
          state === "recording" && "fill-current",
          state === "processing" && "animate-spin",
        )}
      />
      {label ?? PILL_LABEL[state](elapsed)}
    </button>
  )
}
