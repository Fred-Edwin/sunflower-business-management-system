"use client"

import * as React from "react"
import {
  ClockIcon,
  FileTextIcon,
  RotateCcwIcon,
  ShapesIcon,
} from "lucide-react"
import { GallerySection, StateRow } from "./gallery-shell"
import { Button } from "@/components/ui/button"

import { MoneyDisplay } from "@/components/MoneyDisplay"
import { QuantityInput } from "@/components/QuantityInput"
import { StatusBadge, STATUS_VALUES } from "@/components/StatusBadge"
import { DocumentStatusBadge } from "@/components/DocumentStatusBadge"
import { AvailabilityBadge } from "@/components/AvailabilityBadge"
import { DayAvailabilityStrip } from "@/components/DayAvailabilityStrip"
import { ClientPicker } from "@/components/ClientPicker"
import { CatalogItemPicker } from "@/components/CatalogItemPicker"
import { SearchInput } from "@/components/SearchInput"
import { LineItemRow } from "@/components/LineItemRow"
import { TotalsPanel } from "@/components/TotalsPanel"
import { PageHeader } from "@/components/PageHeader"
import { EmptyState } from "@/components/EmptyState"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { ConflictBanner } from "@/components/ConflictBanner"
import { DocumentNoticeBanner } from "@/components/DocumentNoticeBanner"
import { VoiceMicButton } from "@/components/VoiceMicButton"
import { VoiceReviewField } from "@/components/VoiceReviewField"
import { TranscriptPanel } from "@/components/TranscriptPanel"
import { SegmentedToggle } from "@/components/SegmentedToggle"
import { DateRangeControl } from "@/components/DateRangeControl"
import { CalendarSpanControl } from "@/components/CalendarSpanControl"
import { CalendarGrid } from "@/components/CalendarGrid"
import { EventChip } from "@/components/EventChip"
import { AgendaDayGroup } from "@/components/AgendaDayGroup"
import { AgendaEventRow } from "@/components/AgendaEventRow"
import { Input } from "@/components/ui/input"
import { CircleAlertIcon, LoaderCircleIcon } from "lucide-react"

// Tier 2 composite gallery (PHASE-00B §5.5). Every component in every
// applicable state and its own variant axis, as separate static instances.
// Interactive popovers/dialogs are shown at their trigger; open one to see the
// panel (a force-mounted Radix overlay locks body scroll).

// Static mirror of the ConfirmDialog panel — used for the pending / error
// states in the gallery, so we don't force-open a real Radix Dialog (which
// engages react-remove-scroll and freezes the whole page). Kept in sync with
// ConfirmDialog.tsx by eye — this is gallery-only.
function ConfirmDialogPanelPreview({
  title,
  description,
  confirmLabel,
  cancelLabel,
  pending = false,
  error,
}: {
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  pending?: boolean
  error?: string
}) {
  return (
    <div className="flex w-[400px] max-w-full flex-col gap-4 rounded-lg border border-border bg-surface-raised p-5 text-sm text-text-primary shadow-lg">
      <div className="flex flex-col gap-1.5">
        <div className="text-base font-semibold leading-[22px]">{title}</div>
        <div className="text-[13px] leading-[19px] text-text-secondary">
          {description}
        </div>
      </div>
      {error ? (
        <div className="flex items-start gap-2 rounded-md border border-danger-solid bg-danger-subtle px-3 py-2.5">
          <CircleAlertIcon className="mt-px size-3.5 shrink-0 text-danger-solid" />
          <p className="text-xs leading-[17px] text-danger-solid">{error}</p>
        </div>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled={pending}>
          {cancelLabel}
        </Button>
        <Button
          variant="destructive"
          disabled={pending}
          className="bg-danger-solid text-neutral-0 hover:bg-danger-solid/90"
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
    </div>
  )
}

// ── Money & quantity ────────────────────────────────────────────────────────

function MoneySection() {
  return (
    <GallerySection
      title="MoneyDisplay"
      note="Geist Mono + tabular-nums always. cents in, formatMoney() at the render boundary (INV-M1/M5). Band 4X8-0."
    >
      <StateRow label="sizes · prefix on">
        <div className="flex flex-col items-end gap-2">
          <MoneyDisplay cents={3_200_000} prefix />
          <MoneyDisplay cents={14_800_000} prefix size="base" />
          <MoneyDisplay cents={10_900_000} prefix size="xl" />
          <MoneyDisplay cents={124_000_000} prefix size="3xl" />
        </div>
      </StateRow>
      <StateRow label="table column · prefix off">
        <div className="flex flex-col items-end gap-1.5">
          <MoneyDisplay cents={6_400_000} />
          <MoneyDisplay cents={20_000} />
          <MoneyDisplay cents={149_900} />
          <MoneyDisplay cents={1_049_300} />
        </div>
      </StateRow>
      <StateRow label="special values">
        <div className="flex flex-col items-end gap-1.5">
          <MoneyDisplay cents={0} />
          <MoneyDisplay cents={-1_200_000} />
          <MoneyDisplay cents={null} />
          <MoneyDisplay cents={null} loading />
        </div>
      </StateRow>
    </GallerySection>
  )
}

function QuantitySection() {
  const [a, setA] = React.useState(2)
  const [b, setB] = React.useState(50)
  return (
    <GallerySection
      title="QuantityInput"
      note="Integer stepper, tabular numerals. Over-availability = warning border, never blocked (INV-A6). Band 4Y0-0."
    >
      <StateRow label="resting (row, 24px) · focus · over-availability · disabled · error">
        <QuantityInput size="row" value={a} onChange={setA} />
        <QuantityInput size="row" value={a} onChange={setA} data-force-state="focus" />
        <QuantityInput size="row" value={200} overAvailable />
        <QuantityInput size="row" value={200} disabled />
        <QuantityInput size="row" value={0} aria-invalid />
      </StateRow>
      <StateRow label="standalone (36px, ± steppers) · over-availability · disabled">
        <QuantityInput value={b} onChange={setB} />
        <QuantityInput value={200} overAvailable />
        <QuantityInput value={200} disabled />
      </StateRow>
    </GallerySection>
  )
}

// ── Status ──────────────────────────────────────────────────────────────────

function StatusSection() {
  return (
    <GallerySection
      title="StatusBadge · DocumentStatusBadge · AvailabilityBadge"
      note="6px dot + label in the status colour. NO chip. Terminal states → muted label. Band 4U7-0."
    >
      <StateRow label='variant="document" · 10 states'>
        {STATUS_VALUES.document.map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
      </StateRow>
      <StateRow label='variant="event" · 4 states'>
        {STATUS_VALUES.event.map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
      </StateRow>
      <StateRow label='variant="inventory" · 5 severities'>
        {STATUS_VALUES.inventory.map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
      </StateRow>
      <StateRow label="filter-chip interaction states (resting · hover · focus · selected · disabled)">
        <StatusBadge status="sent" chip chipState="resting" />
        <StatusBadge status="sent" chip chipState="hover" />
        <StatusBadge status="sent" chip chipState="focus" />
        <StatusBadge status="sent" chip chipState="selected" />
        <StatusBadge status="sent" chip chipState="disabled" />
      </StateRow>
      <StateRow label="loading · long content (nowrap, no truncation)">
        <StatusBadge status="sent" loading />
        <StatusBadge status="partial" />
      </StateRow>
      <StateRow label="DocumentStatusBadge (named wrapper)">
        <DocumentStatusBadge status="voided" />
        <DocumentStatusBadge status="overdue" />
      </StateRow>
      <StateRow label='AvailabilityBadge · "N of M free" (ample / low) · "N free · day" · none · loading · not-checked'>
        <AvailabilityBadge minAvailable={3} totalQuantity={4} requested={2} />
        <AvailabilityBadge minAvailable={180} totalQuantity={200} requested={200} />
        <AvailabilityBadge
          minAvailable={1}
          totalQuantity={4}
          requested={2}
          form="worst-day"
          dayLabel="Sat 14"
        />
        <AvailabilityBadge
          minAvailable={0}
          totalQuantity={4}
          requested={2}
          form="worst-day"
          dayLabel="Sat 14"
        />
        <AvailabilityBadge minAvailable={0} totalQuantity={0} loading />
        <AvailabilityBadge minAvailable={0} totalQuantity={0} notChecked />
      </StateRow>
    </GallerySection>
  )
}

// ── Availability ────────────────────────────────────────────────────────────

function AvailabilitySection() {
  return (
    <GallerySection
      title="DayAvailabilityStrip"
      note="Worst-day = byDay entry === minAvailable (ties → earliest). Tinted warning-subtle when < checkedQuantity, else success-subtle, + border-strong. Own overflow-x. Band 500-0."
    >
      <StateRow label="worst day is low (tinted warning-subtle)">
        <DayAvailabilityStrip
          byDay={[
            { day: "2026-10-14", available: 1 },
            { day: "2026-10-15", available: 3 },
            { day: "2026-10-16", available: 4 },
          ]}
          minAvailable={1}
          checkedQuantity={2}
        />
      </StateRow>
      <StateRow label="worst day is fine (tinted success-subtle)">
        <DayAvailabilityStrip
          byDay={[
            { day: "2026-10-14", available: 6 },
            { day: "2026-10-15", available: 5 },
            { day: "2026-10-16", available: 7 },
          ]}
          minAvailable={5}
          checkedQuantity={2}
        />
      </StateRow>
      <StateRow label="loading · overflow (scrolls inside container →)">
        <div className="max-w-[360px]">
          <DayAvailabilityStrip byDay={[]} minAvailable={0} checkedQuantity={1} loading />
        </div>
      </StateRow>
    </GallerySection>
  )
}

// ── Pickers ─────────────────────────────────────────────────────────────────

const CLIENTS = [
  { id: "c1", name: "Grace Wambui" },
  { id: "c2", name: "Grace Njoki — Karatina" },
  { id: "c3", name: "Susan Wanjiru — Wedding" },
]
const CATALOG = [
  { id: "i1", name: "Chiavari chairs, gold", available: 180, total: 200 },
  { id: "i2", name: "Plastic chairs, white", available: 640, total: 800 },
  { id: "i3", name: "Tent 12x18m, white", available: 3, total: 4 },
]

function PickersSection() {
  const [c, setC] = React.useState<{ id: string; name: string } | null>(null)
  return (
    <GallerySection
      title="ClientPicker · CatalogItemPicker · SearchInput"
      note="Searchable pickers over one internal SearchableList (§5.4). Trigger 36px, popover surface-raised + shadow-md, options 32px. Bands 5D6-0 / 5AO-0. Open a trigger to see the list."
    >
      <StateRow label="ClientPicker · resting (empty) · selected · disabled-look">
        <div className="w-[280px]">
          <ClientPicker
            options={CLIENTS}
            value={c}
            onSelect={(id) => setC(CLIENTS.find((x) => x.id === id) ?? null)}
            onCreate={() => {}}
          />
        </div>
        <div className="w-[280px]">
          <ClientPicker
            options={CLIENTS}
            value={{ id: "c3", name: "Susan Wanjiru — Wedding" }}
          />
        </div>
      </StateRow>
      <StateRow label="ClientPicker · focus (trigger) · aria-expanded">
        <div className="w-[280px]">
          <ClientPicker options={CLIENTS} data-force-state="focus" />
        </div>
      </StateRow>
      <StateRow label="ClientPicker · voice unresolved-entity (NO MATCH)">
        <div className="w-[300px]">
          <ClientPicker
            options={CLIENTS}
            unresolvedName="James Mwangi"
            onCreate={() => {}}
            onPickExisting={() => {}}
          />
        </div>
      </StateRow>
      <StateRow label="CatalogItemPicker · resting · selected">
        <div className="w-[320px]">
          <CatalogItemPicker options={CATALOG} />
        </div>
        <div className="w-[320px]">
          <CatalogItemPicker
            options={CATALOG}
            value={{ id: "i1", name: "Chiavari chairs, gold" }}
          />
        </div>
      </StateRow>
      <StateRow label="SearchInput · resting + count · focus · empty · loading">
        <div className="w-[320px]">
          <SearchInput value="tent" onChange={() => {}} count="3 of 24" />
        </div>
        <div className="w-[320px]">
          <SearchInput value="tent" onChange={() => {}} count="3 of 24" data-force-state="focus" />
        </div>
        <div className="w-[320px]">
          <SearchInput value="" onChange={() => {}} placeholder="Search items…" />
        </div>
        <div className="w-[320px]">
          <SearchInput value="tent" onChange={() => {}} loading />
        </div>
      </StateRow>
    </GallerySection>
  )
}

// ── Documents ───────────────────────────────────────────────────────────────

function DocumentsSection() {
  const [qty, setQty] = React.useState(2)
  return (
    <GallerySection
      title="LineItemRow · TotalsPanel · PageHeader · EmptyState · ConfirmDialog"
      note="LineItemRow × quote|document|voice. document = read-only always (INV-I2), snapshot props only (INV-P2). Bands 51H-0 / 5ES-0 / 573-0 / 5G9-0 / 5HH-0."
    >
      <StateRow label='LineItemRow variant="quote" (header + 2 rows, over-availability on row 2)'>
        <div className="w-full max-w-[960px] overflow-x-auto rounded-md border border-border">
          <div className="flex border-b border-border-strong bg-surface-sunken">
            <div className="w-8 shrink-0 px-2.5 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.03em] text-text-secondary">#</div>
            <div className="w-[240px] shrink-0 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.03em] text-text-secondary">Item</div>
            <div className="w-[200px] shrink-0 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.03em] text-text-secondary">Description</div>
            <div className="w-20 shrink-0 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.03em] text-text-secondary">Qty</div>
            <div className="w-[150px] shrink-0 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.03em] text-text-secondary">Availability</div>
            <div className="w-[120px] shrink-0 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.03em] text-text-secondary">Unit price</div>
            <div className="w-[120px] shrink-0 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.03em] text-text-secondary">Total</div>
            <div className="w-9 shrink-0" />
          </div>
          <LineItemRow
            variant="quote"
            index={1}
            name="Tent 12x18m, white"
            description="Frame tent with sidewalls"
            unitPriceCents={3_200_000}
            quantity={qty}
            onQuantityChange={setQty}
            onDelete={() => {}}
            availability={{ minAvailable: 3, totalQuantity: 4 }}
          />
          <LineItemRow
            variant="quote"
            index={2}
            name="Chiavari chairs, gold"
            description="Includes cushion"
            unitPriceCents={20_000}
            quantity={200}
            onDelete={() => {}}
            availability={{ minAvailable: 180, totalQuantity: 200 }}
          />
        </div>
      </StateRow>
      <StateRow label='LineItemRow variant="document" (no #, no availability, no stepper, no delete — read-only always)'>
        <div className="w-full max-w-[720px] rounded-md border border-border">
          <LineItemRow
            variant="document"
            name="Chiavari chairs, gold"
            description="Includes cushion"
            unitPriceCents={20_000}
            quantity={200}
          />
        </div>
      </StateRow>
      <StateRow label='LineItemRow variant="voice" (item+qty · flagged row: warning bg + border + triangle, flag text never truncates)'>
        <div className="w-full max-w-[420px] rounded-md border border-border">
          <LineItemRow variant="voice" name="Chiavari chairs, gold" quantity={150} />
          <LineItemRow
            variant="voice"
            name="Round tables"
            quantity={15}
            flag="Round tables — size not caught"
          />
        </div>
      </StateRow>
      <StateRow label='TotalsPanel layout="ledger" · loading'>
        <TotalsPanel
          layout="ledger"
          rows={[
            { label: "Subtotal", cents: 10_400_000 },
            { label: "Delivery fee", cents: 500_000 },
            { label: "Discount", cents: 0 },
          ]}
          totalCents={10_900_000}
          deposit={{ label: "Deposit (30%)", cents: 3_270_000 }}
        />
        <TotalsPanel
          layout="ledger"
          rows={[
            { label: "Subtotal", cents: null },
            { label: "Delivery fee", cents: null },
          ]}
          totalCents={null}
          loading
        />
      </StateRow>
      <StateRow label='TotalsPanel layout="statcards"'>
        <TotalsPanel
          layout="statcards"
          invoiceTotalCents={14_800_000}
          paidToDateCents={6_000_000}
          balanceCents={8_800_000}
        />
      </StateRow>
      <StateRow label="PageHeader · desktop resting · reference-number (mono) + loading actions · empty · error">
        <div className="w-full max-w-[960px] rounded-lg border border-border p-6">
          <PageHeader
            breadcrumb="Quotes / New"
            title="New quote"
            status={{ value: "draft" }}
            actions={
              <>
                <Button variant="outline" size="lg">Save draft</Button>
                <Button size="lg">Issue quote</Button>
              </>
            }
            mobileAction={
              <VoiceMicButton placement="pill" label="Voice" />
            }
          />
          <div className="h-6" />
          <PageHeader
            breadcrumb="Invoices / INV-2026-0042"
            title="INV-2026-0042"
            mono
            status={{ value: "voided" }}
            actions={
              <>
                <div className="h-9 w-24 rounded-md bg-neutral-100" />
                <div className="h-9 w-[120px] rounded-md bg-neutral-100" />
              </>
            }
          />
          <div className="h-6" />
          <PageHeader title="No breadcrumb, no actions" />
          <div className="h-6" />
          <PageHeader
            title="Error — actions + badge hidden"
            breadcrumb="Quotes / New"
            status={{ value: "draft" }}
            actions={<Button size="lg">Issue</Button>}
            error
          />
        </div>
      </StateRow>
      <StateRow label="EmptyState · one action · two actions (canonical uses)">
        <div className="w-[320px]">
          <EmptyState
            icon={<RotateCcwIcon />}
            title="No history yet"
            body="Quotes, invoices and events for this client will appear here."
            actions={<Button size="lg">New quote</Button>}
          />
        </div>
        <div className="w-[320px]">
          <EmptyState
            icon={<FileTextIcon />}
            title="No quotes yet"
            body="Create your first quote, or capture one by voice."
            actions={
              <>
                <Button size="lg">New quote</Button>
                <Button variant="outline" size="lg">Capture by voice</Button>
              </>
            }
          />
        </div>
      </StateRow>
      <StateRow label="ConfirmDialog · resting (open it to see the panel)">
        <ConfirmDialog
          trigger={<Button variant="destructive">Void invoice…</Button>}
          title="Void this invoice?"
          description="INV-2026-0042 will be marked Voided and can no longer be edited or paid. A replacement invoice will be created and linked. The client-facing PDF stays on record."
          confirmLabel="Void invoice"
          cancelLabel="Keep invoice"
        />
      </StateRow>
      {/* pending / error are shown as STATIC panels — a force-open Radix Dialog
          locks body scroll and freezes the whole gallery page. */}
      <StateRow label="ConfirmDialog · pending / error (static panel previews)">
        <ConfirmDialogPanelPreview
          title="Void this invoice?"
          description="INV-2026-0042 will be marked Voided and can no longer be edited or paid."
          confirmLabel="Void invoice"
          cancelLabel="Keep invoice"
          pending
        />
        <ConfirmDialogPanelPreview
          title="Void this invoice?"
          description="INV-2026-0042 will be marked Voided and can no longer be edited or paid."
          confirmLabel="Void invoice"
          cancelLabel="Keep invoice"
          error="Couldn’t void the invoice — a payment was recorded while this dialog was open. Reload to see the current balance."
        />
      </StateRow>
    </GallerySection>
  )
}

// ── Banners ─────────────────────────────────────────────────────────────────

function BannersSection() {
  return (
    <GallerySection
      title="ConflictBanner · DocumentNoticeBanner"
      note="Two components — do NOT merge. ConflictBanner: no link (INV-A6). DocumentNoticeBanner: ALWAYS a forward link (INV-I3). Bands 5IX-0 / 5JT-0."
    >
      <StateRow label="ConflictBanner · full (availability shortfall) · full (clash) · compact pill">
        <div className="max-w-[560px]">
          <ConflictBanner message="Not enough PA system for these dates — 1 unit free, 2 needed on Sat 18 Oct. You can still add it and resolve the clash later." />
        </div>
      </StateRow>
      <StateRow label="ConflictBanner · full (staff / equipment clash)">
        <div className="max-w-[560px]">
          <ConflictBanner message="Two events on Sat 18 Oct share the 10×18m tent and the same 3-person crew." />
        </div>
      </StateRow>
      <StateRow label="ConflictBanner · compact pill (calendar day-cell)">
        <ConflictBanner variant="pill" message="Clash" />
      </StateRow>
      <StateRow label='DocumentNoticeBanner · tone="danger" (voided & replaced)'>
        <div className="max-w-[560px]">
          <DocumentNoticeBanner
            tone="danger"
            title="This invoice was voided"
            reason="Voided on 12 Aug 2026 — “wrong delivery address”. It has been replaced by a corrected invoice."
            link={{ label: "Go to INV-2026-0043", href: "#" }}
          />
        </div>
      </StateRow>
      <StateRow label='DocumentNoticeBanner · tone="neutral" (superseded quote)'>
        <div className="max-w-[560px]">
          <DocumentNoticeBanner
            tone="neutral"
            title="Superseded by a newer version"
            reason="QUO-2026-0011 v1 — the client asked for 50 more chairs on 3 Sep 2026."
            link={{ label: "Go to QUO-2026-0011 v2", href: "#" }}
          />
        </div>
      </StateRow>
    </GallerySection>
  )
}

// ── Voice ───────────────────────────────────────────────────────────────────

function VoiceSection() {
  return (
    <GallerySection
      title="VoiceMicButton · VoiceReviewField · TranscriptPanel"
      note="TranscriptPanel has NO collapsed state (INV-V3). VoiceReviewField flag = border + uppercase label + triangle, never colour alone (INV-V5). Bands 5KU-0 / 5M5-0 / 5OJ-0."
    >
      <StateRow label="VoiceMicButton · shell FAB · idle (w/ queue badge) · recording · processing">
        <VoiceMicButton placement="fab" state="idle" queueCount={3} />
        <VoiceMicButton placement="fab" state="recording" elapsed="0:12" />
        <VoiceMicButton placement="fab" state="processing" />
      </StateRow>
      <StateRow label="VoiceMicButton · per-form pill · idle · recording · processing">
        <VoiceMicButton placement="pill" state="idle" label="Dictate this quote" />
        <VoiceMicButton placement="pill" state="recording" elapsed="0:12" />
        <VoiceMicButton placement="pill" state="processing" />
      </StateRow>
      <StateRow label="VoiceReviewField · resting (passthrough) · flagged CHECK THIS + helper · flagged NO MATCH">
        <div className="w-[300px]">
          <VoiceReviewField label="Event date">
            <Input defaultValue="Sat 18 Oct 2026" />
          </VoiceReviewField>
        </div>
        <div className="w-[300px]">
          <VoiceReviewField
            flag="Check this"
            label="Event date"
            helper="Heard “the 14th” — month and year assumed."
          >
            <Input defaultValue="14 Oct 2026" />
          </VoiceReviewField>
        </div>
        <div className="w-[300px]">
          <VoiceReviewField flag="No match" label="Client">
            <p className="text-sm leading-[19px] text-text-primary">
              “Wanjiku from the county office” — not in your clients.
            </p>
            <div className="mt-0.5 flex gap-2">
              <Button size="sm">Create client</Button>
              <Button size="sm" variant="outline">Pick existing</Button>
            </div>
          </VoiceReviewField>
        </div>
      </StateRow>
      <StateRow label="TranscriptPanel · populated · extraction-failed (transcript still shown) · mobile">
        <div className="w-[340px]">
          <TranscriptPanel
            provenance="0:23 · Deepgram"
            transcript="Quote for Wanjiku, the county office. Saturday the eighteenth of October. One big tent, ten by eighteen. Two hundred chairs, the gold ones. A PA system. Deliver to Kiganjo grounds."
          />
        </div>
        <div className="w-[340px]">
          <TranscriptPanel
            provenance="0:41 · Deepgram"
            extractionFailed
            transcript="… and then also, uh, whatever we did for the Mwangi wedding but bigger, they’ll call back with numbers…"
          />
        </div>
        <div className="w-[280px]">
          <TranscriptPanel
            provenance="0:23"
            caption={null}
            transcript="Quote for Wanjiku, the county office. Saturday the eighteenth…"
          />
        </div>
      </StateRow>
    </GallerySection>
  )
}

// ── Calendar ────────────────────────────────────────────────────────────────

function CalendarSection() {
  const [view, setView] = React.useState<"calendar" | "agenda">("calendar")
  const [span, setSpan] = React.useState<"1w" | "2w">("1w")
  return (
    <GallerySection
      title="SegmentedToggle · DateRangeControl · CalendarSpanControl · CalendarGrid · EventChip · AgendaDayGroup · AgendaEventRow"
      note="Calendar composites. Bands 5AO-0 / 5PY-0 / 5RU-0."
    >
      <StateRow label="SegmentedToggle · 2-way · 3-way · focus · disabled">
        <SegmentedToggle
          segments={[
            { value: "day", label: "Day" },
            { value: "range", label: "Range" },
          ]}
          value="range"
          onChange={() => {}}
        />
        <SegmentedToggle
          segments={[
            { value: "calendar", label: "Calendar" },
            { value: "agenda", label: "Agenda" },
          ]}
          value={view}
          onChange={setView}
        />
        <SegmentedToggle
          segments={[
            { value: "week", label: "Week" },
            { value: "list", label: "List" },
          ]}
          value="list"
          onChange={() => {}}
          data-force-state="focus"
        />
        <SegmentedToggle
          segments={[
            { value: "1w", label: "1 week" },
            { value: "2w", label: "2 weeks" },
          ]}
          value="2w"
          disabled
        />
      </StateRow>
      <StateRow label="DateRangeControl · range mode · day mode">
        <DateRangeControl mode="range" label="14 Oct → 16 Oct 2026" />
        <DateRangeControl mode="day" label="14 Oct 2026" />
      </StateRow>
      <StateRow label="CalendarSpanControl (‹ Today › + span toggle)">
        <CalendarSpanControl span={span} onSpanChange={setSpan} />
      </StateRow>
      <StateRow label="EventChip · resting · on a conflict-day surface">
        <div className="w-[220px]">
          <EventChip title="Site visit — Kiganjo" subtitle="Wanjiku · recce" status="scheduled" />
        </div>
        <div className="w-[220px]">
          <EventChip
            title="County office fundraiser"
            subtitle="Wanjiku · full setup"
            status="accepted"
            className="bg-surface"
          />
        </div>
      </StateRow>
      <StateRow label="CalendarGrid · populated + conflict day · loading">
        <div className="w-full max-w-[980px]">
          <CalendarGrid
            todayColumn={5}
            days={[
              { date: "2026-10-13", dayNumber: 13, events: [] },
              {
                date: "2026-10-14",
                dayNumber: 14,
                events: [
                  { id: "e1", title: "Site visit — Kiganjo", subtitle: "Wanjiku · recce", status: "scheduled" },
                ],
              },
              { date: "2026-10-15", dayNumber: 15, events: [] },
              { date: "2026-10-16", dayNumber: 16, events: [] },
              {
                date: "2026-10-17",
                dayNumber: 17,
                events: [
                  { id: "e2", title: "Mwangi wedding", subtitle: "Grace M · full setup", status: "accepted" },
                ],
              },
              {
                date: "2026-10-18",
                dayNumber: 18,
                conflict: true,
                events: [
                  { id: "e3", title: "County office fundraiser", subtitle: "Wanjiku · full setup", status: "accepted" },
                  { id: "e4", title: "Karatina church harvest", subtitle: "Rev. Kamau · tent + chairs", status: "scheduled" },
                ],
              },
              { date: "2026-10-19", dayNumber: 19, events: [] },
            ]}
          />
        </div>
        <div className="w-full max-w-[980px]">
          <CalendarGrid days={[]} loading />
        </div>
      </StateRow>
      <StateRow label="AgendaDayGroup + AgendaEventRow · 1 event · conflict day (inline ConflictBanner) · empty day">
        <div className="w-full max-w-[720px] overflow-hidden rounded-lg border border-border">
          <AgendaDayGroup dateLabel="FRI 17 OCT" eventCount={1}>
            <AgendaEventRow
              timeRange="08:00–18:00"
              title="Mwangi wedding"
              detail="Grace M · Ndaru Gardens · full setup, 300 pax"
              status="accepted"
            />
          </AgendaDayGroup>
          <AgendaDayGroup
            dateLabel="SAT 18 OCT"
            eventCount={2}
            conflict
            conflictMessage="Both events need the 10×18m tent and the same 3-person crew."
          >
            <AgendaEventRow
              timeRange="07:00–15:00"
              title="County office fundraiser"
              detail="Wanjiku · Kiganjo grounds · tent, 200 chairs, PA"
              status="accepted"
              clash
            />
            <AgendaEventRow
              timeRange="10:00–16:00"
              title="Karatina church harvest"
              detail="Rev. Kamau · PCEA Karatina · tent + 150 chairs"
              status="sent"
            />
          </AgendaDayGroup>
          <AgendaDayGroup dateLabel="SUN 19 OCT" eventCount={0} />
        </div>
      </StateRow>
    </GallerySection>
  )
}

export function Tier2Gallery() {
  return (
    <>
      <div className="flex items-center gap-2 border-t border-border pt-8">
        <ShapesIcon className="size-4 text-text-muted" />
        <h2 className="text-lg font-semibold text-text-primary">
          Tier 2 — composites
        </h2>
        <ClockIcon className="ml-2 size-3.5 text-text-muted" />
        <span className="text-xs text-text-muted">
          §5.3 approved composite set · built from Tier 1 · semantic tokens only
        </span>
      </div>
      <MoneySection />
      <QuantitySection />
      <StatusSection />
      <AvailabilitySection />
      <PickersSection />
      <DocumentsSection />
      <BannersSection />
      <VoiceSection />
      <CalendarSection />
    </>
  )
}
