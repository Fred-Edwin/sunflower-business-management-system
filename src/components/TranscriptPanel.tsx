import { MicIcon, TriangleAlertIcon } from "lucide-react"
import { cn } from "cn"

// The always-visible transcript on the voice review screen (band 5OJ-0).
// INV-V3 — the transcript is ALWAYS visible, NEVER behind a disclosure; this
// component has NO collapsed state. It renders the transcript inline in every
// state, including extraction-failed. §12 promotion.
//
// Mic icon + "Transcript" + provenance ("0:23 · Deepgram") + the quoted
// transcript body in a sunken card + a caption. Right rail on desktop, stacked
// card on mobile.

export function TranscriptPanel({
  transcript,
  /** e.g. "0:23 · Deepgram" — capture duration and STT provider. */
  provenance,
  /** Show the extraction-failed notice above the transcript. */
  extractionFailed = false,
  caption = "The transcript is kept whatever you decide — it stays on the quote for reference.",
  className,
}: {
  transcript: string
  provenance?: string
  extractionFailed?: boolean
  caption?: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="transcript-panel"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-surface p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <MicIcon className="size-[15px] shrink-0 text-text-secondary" />
        <span className="text-[13px] font-semibold leading-[17px] text-text-primary">
          Transcript
        </span>
        {provenance ? (
          <span className="ml-auto font-mono text-[11px] leading-[14px] text-text-muted">
            {provenance}
          </span>
        ) : null}
      </div>

      {extractionFailed ? (
        <div className="flex items-start gap-2 rounded-md border border-warning-solid bg-warning-subtle px-3 py-2.5">
          <TriangleAlertIcon className="mt-px size-[13px] shrink-0 text-warning-solid" />
          <p className="text-xs leading-[17px] text-text-secondary">
            We couldn&rsquo;t pull fields from this one. Fill the form from the
            transcript below.
          </p>
        </div>
      ) : null}

      <div className="rounded-md border border-border bg-surface-sunken p-3">
        <p className="text-[13px] leading-5 text-text-secondary">
          &ldquo;{transcript}&rdquo;
        </p>
      </div>

      {caption ? (
        <p className="text-[11px] leading-[15px] text-text-muted">{caption}</p>
      ) : null}
    </div>
  )
}
