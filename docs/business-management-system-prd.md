# PRD: Sunflower Events — Business Management System

**Status:** Draft v1.1
**Owner:** Lobster Technologies (Edwin Kamau)
**Client:** Susan, Sunflower Events

---

## Problem Statement

Susan runs Sunflower Events, an events rental business (tents, chairs, decor, PA systems) serving weddings, funerals, and corporate/institutional events across referral and competitive-bid channels. She single-handedly manages all office work — quotations, delivery notes, invoices, receipts — while also fielding client calls on the go and overseeing site visits.

Her business currently runs on paper and memory. When a client calls or messages while she's driving or on-site, she cannot produce a quotation in the moment, which has directly cost her deals — particularly with corporate and government clients who compare vendor quotes and move quickly. She carries physical books to write invoices and quotations, and has no centralized way to track equipment availability, event schedules, or business performance. Every part of the admin process is manual, slow, and vulnerable to loss or error.

The cost of not solving this is direct and ongoing revenue loss (deals lost to slower response time), physical record-keeping risk, and a ceiling on how much the business can grow without Susan personally handling more administrative load than one person can sustain.

## Goals

1. Reduce the time from client inquiry to sent quotation from (currently) hours/days to minutes, including while Susan is away from a desk.
2. Eliminate physical paperwork as the system of record — quotes, delivery notes, invoices, and receipts are generated and stored digitally.
3. Prevent equipment double-booking by giving Susan a single source of truth for what's available on any given date.
4. Give Susan visibility into per-event profitability (revenue vs. expenses) without manual calculation.
5. Make voice a first-class alternative to typing everywhere the system accepts manual data entry, so Susan can move quickly regardless of whether she's at a desk, driving, or on-site.
6. Ensure the digital system is a safe replacement for physical records — no historical document can be silently altered by later changes, and no data loss is possible from a single point of failure.

## Non-Goals

1. **Field staff mobile access** — v1 remains print-based for delivery notes and questionnaires used on-site by the delivery/setup team. Digitizing field staff workflows is a Phase 2 consideration once the office-side system is proven.
2. **Business analytics/reporting** (profitability by event type, seasonality, repeat-client analysis, tender win-rate) — deferred. Susan's core need right now is operational (getting quotes out, tracking equipment), not analytical.
3. **Win/loss tracking on quotes** — deferred. Not connected to a near-term pain point; adds data-entry overhead without addressing the urgent problem.
4. **Contract/terms attachment to quotes** — deferred. Real liability value, but is a separate legal/document workstream, not core to solving the paperwork and speed problem.
5. **Full-duplex conversational voice agent** — explicitly out of scope for this PRD. Voice is scoped as one-shot transcription-to-structured-data only (see Requirements). A conversational agent is a distinct, future initiative.
6. **Follow-up reminders on unanswered quotes** — not something Susan identified as a problem. Adding it in v1 would be solving for a pain point she didn't raise; may be revisited later if it comes up.
7. **Automated lead intake from the marketing website** — the website does not exist yet at the time this system is built, so there is no live source to integrate with in v1. Leads will be entered manually if/when they arrive by other means until the website (and its chatbot) ships.
8. **Multi-user access** — v1 exposes no user management, no roles, and no permissions UI. Susan is the only account. However, the data model and authentication layer are built multi-user from the start (every record is owned by a user), so adding a second office user later is a configuration change rather than a migration.
9. **Offline operation** — v1 does not support browsing, editing, or creating records without a connection. Susan has reliable Wi-Fi and cellular access where she operates. The single exception is voice capture, which must survive a dropped connection (see Requirements: Resilient Voice Capture) because captures happen on the road, where a lost inquiry has direct revenue cost.

## User Stories

**Susan (business owner / sole office operator)**
- As Susan, I want to create a quotation from my phone in under a minute, so that I can respond to a client while I'm still on the call or shortly after, before they move to another vendor.
- As Susan, I want to speak the details of a client request instead of typing them, so that I can capture inquiries safely while driving.
- As Susan, I want to see which tents, chairs, and PA equipment are already booked for a given date, so that I never commit equipment to two events at once.
- As Susan, I want delivery notes and questionnaires to generate automatically from a confirmed quote, so that I don't have to redraft the same information by hand.
- As Susan, I want invoices and receipts to generate from the delivery note and payment record, so that I don't retype client and item details at every stage.
- As Susan, I want to record a payment against an invoice (cash, mobile money, or bank transfer) and have a receipt generated automatically, so that payment tracking and receipting are never out of sync.
- As Susan, I want to log expenses against a specific event (fuel, repairs, wages, materials), so that I can see whether that event was actually profitable.
- As Susan, I want all my quotes, invoices, receipts, and delivery notes stored in one searchable place, so that I never again need to carry a physical book to find a past record.
- As Susan, I want to flag large or unfamiliar venues for a site visit before finalizing a quote, so that my pricing reflects the actual ground conditions.
- As Susan, I want to start a voice capture from anywhere in the app without first navigating to the right form, so that I can log an inquiry or an expense while driving without taking my eyes off the road.
- As Susan, I want to send a finished quote to a client over WhatsApp in one tap, so that the quote reaches the client on the channel they actually use.
- As Susan, I want to see how many of an item are free on a date, not just whether the item is "booked", so that I can confidently commit 200 of my 500 chairs to one event.

**Edge cases / error states**
- As Susan, if a voice transcription is misheard or incomplete, I want to review and correct the parsed fields before anything is saved, so that bad data never enters a quote or client record silently.
- As Susan, if I try to book equipment that's already reserved for overlapping dates, I want the system to warn me before I confirm, so that I don't double-commit assets.
- As Susan, if I record a voice capture and my connection drops, I want the recording held and sent automatically when signal returns, so that an inquiry is never lost to a dead zone.
- As Susan, if I change a price in my catalog, I want every quote and invoice I have already issued to keep showing the price it was issued at, so that my records match what the client received.

## Requirements

### Platform-Wide Rule: Voice as an Input Method Everywhere

Anywhere the system accepts manual (typed) data entry, it must also accept voice as an alternative input method. Typing and speaking are two paths into the same form.

Voice is available through **two entry points**:

**A. Global capture (primary).** A persistent microphone control in the app shell, reachable from any screen. Susan speaks a request without first navigating anywhere. The system determines what kind of record she is describing (quote, expense, client, damage report, payment, staff assignment), routes her to the matching review screen, and pre-fills it.

This is the primary entry point because the core use case is hands-busy: she cannot navigate to a specific form while driving.

**B. Per-form capture (secondary).** A microphone control on each individual form marked **[voice-enabled]** below, for when she is already on the right screen.

Both entry points share one pipeline and one review step.

#### How capture works

1. The user speaks naturally, e.g. *"Wedding for the Mwangi family, 200 chairs, one large tent, PA system, delivery to Kitengela on October 14th."*
2. Audio is recorded on the device and sent to the server.
3. The server transcribes the audio, then parses the transcript into the target form's structured fields. These are two distinct stages (see Technical Constraints below).
4. The filled form is shown for review. **Nothing saves automatically.**
5. The user corrects any field, whether it arrived by typing or by voice, and confirms.

This is one-shot capture (speak once, review, save), not a conversation. See Non-Goals regarding the full-duplex conversational agent.

#### Technical constraints on the voice pipeline

- The pipeline is **two-stage**: a dedicated speech-to-text step produces a transcript, and a separate extraction step parses that transcript into fields. A single combined audio-to-fields call is explicitly rejected, because it makes mishearing and misparsing indistinguishable when diagnosing a bad record.
- The **transcript is stored** alongside the parsed result for every capture. It is the diagnostic record and the tuning dataset.
- The extraction step must be supplied with: the current date and Africa/Nairobi timezone (so relative dates like "next Saturday" resolve), and the live equipment catalog and client list (so spoken items and names resolve to existing records rather than free text).
- The extraction step must be permitted to return empty fields. A blank field flagged for the user is always preferable to a confident guess.
- A **keyterm list** is maintained and supplied to the transcription step, built from client surnames, delivery locations, and catalog item names, refreshed on a schedule. This is a required work item, not an optimisation.
- The speech-to-text provider sits behind an adapter interface so it can be swapped without touching application code.

#### Resilient voice capture

- Audio is written to device storage before upload is attempted.
- If upload fails, the capture is queued and retried automatically when connectivity returns.
- Queued captures are visible to the user, so a pending inquiry is never invisible.
- This applies to voice capture only. All other operations assume a live connection (see Non-Goals).

#### Platform-wide acceptance criteria

- [ ] A global microphone control is reachable from every screen in the app
- [ ] Global capture correctly routes a spoken request to the matching record type and pre-fills its review screen
- [ ] Every form marked [voice-enabled] below has a working mic control alongside its manual fields
- [ ] Voice input produces the same structured result a manual entry would, shown for review before saving
- [ ] No screen saves data from voice input without explicit user confirmation
- [ ] Fields the system was uncertain about are visually flagged on the review screen
- [ ] The transcript is visible on the review screen
- [ ] User can freely mix input methods within the same form
- [ ] A capture recorded with no connection is retained and uploaded automatically on reconnect
- [ ] Relative dates ("next Saturday", "the 14th") resolve correctly against the current date in Africa/Nairobi
- [ ] Spoken item and client names resolve to existing catalog and client records where a confident match exists

### Must-Have (P0)

**Lead & Client Management**
- Capture inquiries via manual entry **[voice-enabled]** (the marketing website does not exist yet at v1 — see Non-Goals)
- Client profiles with full history of past events and notes
- Acceptance criteria:
  - [ ] User can create a new client record with name, contact info, and source — by typing or by voice
  - [ ] User can view a client's full quote/event history from their profile

**Quotation & Sales**
- Quote creation from a pricing catalog (tents, chairs, PA, decor, delivery fees) **[voice-enabled]**
- Site-visit flagging: quote can be marked "preliminary — pending site visit" and later confirmed
- Quote versioning (edits create a new version, history preserved)
- Deposit entry per quote (flat amount or percentage)
- Quote delivery must be one-tap shareable to WhatsApp (native share of the generated PDF or a shareable link), since WhatsApp is the channel clients actually use
- Acceptance criteria:
  - [ ] User can build a quote by selecting catalog items and quantities, either manually or by speaking the request (e.g., item names, quantities, client and date)
  - [ ] User can flag a quote as preliminary and later confirm it after a site visit, preserving the original estimate
  - [ ] Every edit to a sent quote is versioned; prior versions remain viewable
  - [ ] User can set a deposit as a fixed amount or % of total
  - [ ] A finished quote can be sent to a client via WhatsApp without leaving the app or manually locating a file

*Note: this promotes the client-facing shareable quote link from P1 to a delivery requirement. The "under 10 minutes to quote" goal is only real if the last mile is one tap.*

**Inventory & Asset Management**
- Equipment catalog (tents, chairs, PA, decor items) with total quantities held
- **Quantity-based availability**: availability for a given date is calculated as *total held − units under maintenance or damaged − units committed to overlapping bookings*. Availability is a number, not a yes/no state.
- Booking/availability calendar per asset, tied to confirmed quotes/events
- Visibility into what's currently out, in what quantity, and its expected return date
- Condition/damage/maintenance status per asset **[voice-enabled]**
- Acceptance criteria:
  - [ ] User can see, for any date, how many units of each item are free
  - [ ] System warns when a requested quantity exceeds available units for the requested dates, showing the number actually free
  - [ ] Committing units to an event reduces the available count for those dates
  - [ ] User can mark a number of units as damaged/under maintenance, by typing or by voice, removing exactly those units from available stock until cleared
  - [ ] Availability accounts for partial commitments (e.g. 200 of 500 chairs committed leaves 300 free)

*Note for build: buffer days (equipment leaving the day before and returning the day after an event) are deferred to a later revision. The quantity model must be built now; the buffer window can be layered on top of it without schema change.*

**Event/Job Scheduling & Operations**
- Master calendar of all events with conflict detection (staff and equipment overlap)
- Staff assignment per event **[voice-enabled]**
- Auto-generated logistics/packing checklist from the quote's line items
- Delivery note generation (printable)
- Questionnaire generation (printable, for on-site client sign-off)
- Acceptance criteria:
  - [ ] Calendar view shows all scheduled events with assigned staff and equipment
  - [ ] System flags if a staff member or equipment item is assigned to two overlapping events
  - [ ] Delivery note auto-populates from the confirmed quote's items
  - [ ] User can assign staff to an event by typing or by voice

**Financials**
- Invoice generation from the delivery note
- Deposit and balance tracking per invoice
- Manual payment recording (cash / mobile money / bank transfer) with date and method **[voice-enabled]**
- Receipt generation on payment
- Expense tracking per event (fuel, repairs, materials, wages) **[voice-enabled]**
- Automatic per-event profit/loss calculation (revenue minus logged expenses)
- Business-wide financial reports (monthly income, expenses, profit, cash flow)
- Acceptance criteria:
  - [ ] Invoice line items match the delivery note without manual re-entry
  - [ ] Recording a payment updates the invoice balance and generates a receipt, whether entered by typing or by voice
  - [ ] User can log an expense against an event by typing or by voice (e.g., "500 shillings fuel for the Kitengela event")
  - [ ] Each event shows a computed profit/loss based on invoiced revenue minus logged expenses
  - [ ] User can view a monthly summary of income, expenses, and profit

**Staff Management**
- Staff profiles (contact info, role) **[voice-enabled]**
- Event assignment history per staff member
- Day-rate/wage entry per event assignment, feeding into that event's expenses **[voice-enabled]**
- Acceptance criteria:
  - [ ] User can create a staff profile and assign a wage for an event, by typing or by voice
  - [ ] Wage entries automatically appear in that event's expense total

**Documents**
- Central, searchable storage of all quotes, invoices, receipts, and delivery notes
- Acceptance criteria:
  - [ ] User can search/filter historical documents by client, date, or event

**Data Integrity & Records**

- **Price snapshotting**: unit prices, item names, and any other client-visible values are copied onto a document's line items at the moment the document is created. Later edits to the pricing catalog never alter an already-issued quote, invoice, or receipt.
- **Document numbering**: quotes, invoices, and receipts carry sequential, human-readable reference numbers that are unique and never reused.
- **Immutability of issued documents**: once a document is sent to a client it is not edited in place. Quotes are re-versioned (existing requirement); invoices and receipts are corrected by issuing a linked replacement, not by overwriting.
- **Backups**: automated daily backup of the full database, retained for a rolling period, plus a user-triggered full data export the owner can download and keep herself.
- Acceptance criteria:
  - [ ] Changing a catalog price leaves all previously issued documents displaying their original prices
  - [ ] Every issued document has a unique sequential reference number
  - [ ] Backups run daily without manual intervention and a restore has been tested at least once before launch
  - [ ] User can download a complete export of her business records at any time

*Rationale: this system replaces physical books. A paper invoice does not change when Susan raises her prices, and it does not vanish when a server fails. The digital system must match both properties.*

**Access & Accounts**

- Authenticated login required for all access
- Every record is owned by a user account at the data-model level
- v1 ships with a single account and no user-management interface (see Non-Goals)
- Acceptance criteria:
  - [ ] All application data is behind authentication
  - [ ] Adding a second user account requires no schema change

**Instrumentation**

The Success Metrics below are only measurable if the underlying events are timestamped from launch. The following are required at v1, not deferred:

- Timestamp on inquiry creation
- Timestamp on quote sent
- Record of which input method (typed or voice) produced each record
- Log of every voice capture: audio reference, transcript, target record type, parsed result, whether the user corrected any field before saving
- Count of double-booking warnings raised, and whether the user proceeded anyway
- Acceptance criteria:
  - [ ] Inquiry-to-quote elapsed time can be computed for any quote without manual reconstruction
  - [ ] Share of records created by voice vs. typing can be reported for any period
  - [ ] Voice captures where the user corrected a field can be listed, for prompt tuning

*Rationale: without these, none of the leading indicators below can be reported, and there is no baseline to compare against after launch.*

### Nice-to-Have (P1)
- Bulk pricing catalog updates (seasonal pricing, promotions)
- Export of financial reports to PDF/Excel for accounting purposes

### Future Considerations (P2)
- Field staff mobile access (digital delivery notes/questionnaires signed on-site)
- Business insights/reporting (profitability by event type, seasonality, repeat-client value, tender win-rate)
- Win/loss tracking on quotes
- Low-stock/damage automated alerts
- Contract/terms attachment and generation
- Full-duplex conversational voice agent
- Live integration with the marketing website chatbot (availability checks, quote estimation)
- Follow-up reminders on quotes with no client response

## Success Metrics

**Leading indicators** (measurable from the Instrumentation requirements above)
- Median time from inquiry creation to quote sent: target under 10 minutes for straightforward requests
- Share of records created using voice input vs. manual typing
- Share of voice captures saved without any field correction (voice accuracy proxy)
- Number of equipment double-booking warnings raised, and how many were overridden

**Lagging indicators**
- Reduction in deals lost to slow response (self-reported by Susan; win/loss tracking remains out of v1 scope)
- Reduction in weekly admin time (self-reported)
- Share of business records fully digitized (target: 100% of new records within 60 days of launch, replacing physical books)

## Open Questions

- **[Engineering — resolved in principle]** The voice pipeline is two-stage: dedicated speech-to-text, then a separate parsing step. A single combined audio-to-fields call was evaluated and rejected on diagnosability grounds.
- **[Engineering — open]** Which speech-to-text provider. To be decided by benchmarking candidate providers against approximately 20 real recordings of Susan dictating in her actual conditions (in-vehicle, on-site with wind and background noise, at desk), with the keyterm list loaded. Selection criterion is accuracy on client surnames and Kenyan place names, not published word-error rates. Free tiers cover this evaluation.
- **[Engineering — open]** Hosting region. Deployment should be to a region with low round-trip latency to Nairobi; this materially affects perceived voice responsiveness.

## Timeline Considerations

- No hard external deadline currently known; timeline to be set against Susan's paperwork backlog and high season once scope is finalised.
- **Build order is fixed: voice ships last within v1.** The system of record (catalog, clients, the quote → delivery note → invoice → receipt chain, quantity-based inventory) is built and working first. Voice is added afterwards as a fast-follow inside the same v1 milestone.

  Two reasons: parsed voice output needs somewhere to go, so the underlying records must exist first; and voice is the component most likely to need iteration against real user audio, which is cheaper once everything around it is stable.
- Voice rollout within that fast-follow is itself staged: the quote capture flow first, validated with Susan on real recordings, then the same pipeline extended to expenses, damage logs, payments, and staff assignment, then global capture with intent routing.
- The marketing website (and its lead-capturing chatbot, per the companion PRD) remains a separate, later effort with no v1 dependency.
