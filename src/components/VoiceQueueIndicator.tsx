import { cn } from "cn"

// Pending-voice-capture count. A danger circle badge (9px / 600 / white) on the
// shell Voice-capture control and the mobile FAB. Zero pending renders nothing —
// a pending inquiry is never invisible, but a settled queue adds no chrome
// (ui-conventions.md §1, §6; PHASE-00B §5.3).
//
// This is the one voice composite built in the vertical slice, because §6.6
// requires it in the app shell. Its other placement (the mobile FAB) arrives
// with VoiceMicButton in the deferred Tier 2 set.
export function VoiceQueueIndicator({
  count,
  className,
}: {
  count: number
  className?: string
}) {
  if (count <= 0) return null

  return (
    <span
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-danger-solid font-mono text-[9px] font-semibold text-neutral-0 tabular-nums",
        className,
      )}
      aria-label={`${count} voice ${count === 1 ? "capture" : "captures"} pending review`}
    >
      {count > 9 ? "9+" : count}
    </span>
  )
}
