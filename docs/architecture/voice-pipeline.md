# Voice Pipeline

Voice is an input method, not a feature. Anywhere the system accepts typing, it
accepts speech, and both paths land in the same form and the same review step.

**Voice ships last within v1.** The record system is built and working first,
because parsed output needs somewhere to go and because voice is the component
most likely to need iteration against real audio. See `../delivery/build-plan.md`.

---

## 1. Shape of the pipeline

```
  Device                          Server                        Providers
  ──────                          ──────                        ─────────
  record (MediaRecorder)
        │
        ├─► write blob to IndexedDB   ◄── happens BEFORE any network (INV-V6)
        │
        ├─► request presigned URL ──► /api/voice/upload-url
        │
        ├─► PUT audio ─────────────────────────────────────────► R2
        │
        └─► POST /api/voice/process ──┐
                                      │
                          ┌───────────▼────────────┐
                          │ STAGE 1: transcribe    │──► STT provider
                          │  + keyterm list        │    (Deepgram / Gemini)
                          └───────────┬────────────┘
                                      │
                          transcript persisted immediately (INV-V3)
                                      │
                          ┌───────────▼────────────┐
                          │ STAGE 2: extract       │──► Gemini Flash
                          │  Zod schema, temp 0    │    via AI Gateway
                          │  + date, catalog,      │
                          │    client list         │
                          └───────────┬────────────┘
                                      │
                            VoiceCapture → READY
                                      │
        ┌─────────────────────────────┘
        ▼
  Review screen: pre-filled form, transcript visible,
  uncertain fields flagged. NOTHING IS SAVED YET (INV-V1).
        │
        └─► user corrects → confirms → ordinary Server Action
                                     → correctedFields diff written
                                     → IndexedDB entry cleared
```

### Why two stages (INV-V2)

A single audio-to-fields call is forbidden. When a record comes out wrong, the
two-stage design tells you immediately whether the model misheard Susan or
misunderstood her. With one call, those are indistinguishable, and you cannot fix
what you cannot diagnose.

The transcript is also the tuning dataset. It is worth more over time than the
latency saved by collapsing the stages.

---

## 2. Entry points

Both share one pipeline and one review step. They differ only in whether the
intent is known in advance.

**A. Global capture (primary).** A persistent microphone in the app shell,
reachable from every screen. Susan speaks without navigating anywhere. The
extraction call returns an intent alongside the payload, and the app routes to
the matching review screen.

This is primary because the core use case is hands-busy. She cannot navigate to a
form while driving.

**B. Per-form capture (secondary).** A microphone on each `[voice-enabled]` form.
Intent is already known, so extraction runs against that form's schema directly.
No routing step, no intent classification, better accuracy.

Voice-enabled forms: quote creation, client creation, expense entry, payment
recording, damage/maintenance reporting, staff assignment.

---

## 3. Stage 1 — Transcription

Behind an adapter (INV-V7). No application code names a provider.

```ts
// modules/voice/stt/types.ts
export interface SttAdapter {
  readonly provider: string
  readonly model: string
  transcribe(input: {
    audioUrl: string
    mimeType: string
    keyterms: string[]
    languageHint?: string
  }): Promise<{
    transcript: string
    confidence?: number
    latencyMs: number
    raw: unknown        // stored for diagnosis
  }>
}
```

Implementations live in `modules/voice/stt/providers/`. The active one is chosen
by `STT_PROVIDER` env var, resolved once in `modules/voice/stt/index.ts`.

### Provider selection is a benchmark, not a decision

Per the PRD, the provider is chosen by testing candidates against roughly 20 real
recordings of Susan in her actual conditions: in-vehicle, on-site with wind and
background noise, and at a desk, with the keyterm list loaded.

**The selection criterion is accuracy on client surnames and Kenyan place names,
not published word-error rates.** A provider that scores well on American English
podcasts and mangles "Mwangi" and "Karatina" is useless here.

Candidates:

| Provider | Case for it | Case against |
|---|---|---|
| Deepgram Nova-3 | Dedicated keyterm prompting, low latency, purpose-built | Another vendor, another key |
| Gemini | One vendor for both stages, cheaper, accepts audio natively | Keyterm biasing is prompt-based and weaker |

Free tiers cover the evaluation. The benchmark harness is a PHASE-05 deliverable:
a script that runs every recording through every adapter and writes a comparison
table with per-recording diffs against a hand-written ground truth.

### Keyterms

A `Keyterm` table, rebuilt daily by `/api/cron/keyterms` from:

- client surnames
- delivery locations used in past quotes
- catalog item names

Supplied to the adapter on every call. This is a required work item, not an
optimisation — it is the difference between "Mwangi" and "one gee".

Language: Susan speaks English with Swahili code-switching, and Kenyan place
names throughout. Set the language hint accordingly and prefer providers that
handle code-switching rather than forcing a single language.

---

## 4. Stage 2 — Extraction

Vercel AI SDK `generateObject`, Gemini Flash, temperature 0, via AI Gateway.

The output schema is **the same Zod schema the form uses**. Not a parallel
definition. When the form's shape changes, the extraction schema changes with it
and any mismatch is a compile error.

```ts
const result = await generateObject({
  model: gateway('google/gemini-flash'),
  schema: voiceQuoteCaptureSchema,   // derived from modules/quotes/schema.ts
  temperature: 0,
  system: buildExtractionPrompt({ intent, context }),
  prompt: transcript,
})
```

### Required context (PRD constraint)

Every extraction call must be supplied with:

1. **Current date and the `Africa/Nairobi` timezone**, so "next Saturday" and
   "the 14th" resolve correctly.
2. **The live equipment catalog** (active item names and IDs), so spoken items
   resolve to real records rather than free text.
3. **The client list** (names and IDs), so spoken names resolve to existing
   clients.

Context 2 and 3 are why Gemini Flash's context window matters here. The whole
catalog and client list go into every call.

### Empty is better than wrong (INV-V4)

The prompt states this explicitly and the schema permits it. Every extractable
field is nullable. A blank field flagged for review is always better than a
confident guess, because a guess enters a client-facing document silently.

The model also returns `uncertainFields: string[]` — fields it filled but is not
confident about. These are flagged in the UI (INV-V5).

### Intent routing (global capture only)

One call returning a discriminated union:

```ts
z.discriminatedUnion('intent', [
  z.object({ intent: z.literal('QUOTE'),            payload: voiceQuoteSchema }),
  z.object({ intent: z.literal('EXPENSE'),          payload: voiceExpenseSchema }),
  z.object({ intent: z.literal('CLIENT'),           payload: voiceClientSchema }),
  z.object({ intent: z.literal('DAMAGE_REPORT'),    payload: voiceDamageSchema }),
  z.object({ intent: z.literal('PAYMENT'),          payload: voicePaymentSchema }),
  z.object({ intent: z.literal('STAFF_ASSIGNMENT'), payload: voiceStaffSchema }),
  z.object({ intent: z.literal('UNKNOWN'),          payload: z.object({}) }),
])
```

`UNKNOWN` is a real outcome, not a failure. It routes to a disambiguation screen
showing the transcript and asking what she meant, with the record types as
buttons. Guessing wrong and dropping her on the invoice screen when she described
an expense is worse than asking.

---

## 5. The review step

**Nothing saves automatically. Ever.** (INV-V1) This is the most important rule
in the module.

The review screen shows:

- The pre-filled form, using the same components as manual entry
- **The transcript, visible** (INV-V3)
- Uncertain fields visually flagged
- Unresolved entities marked (a spoken client name with no confident match shows
  as text with a "create new client?" affordance, not silently dropped)
- Normal validation, exactly as for typed input

She may edit any field, mix typing and speech freely, and confirm. On confirm the
save goes through the ordinary Server Action path. There is nothing special about
a voice-created record once it is saved, apart from `createdVia = VOICE` and
`voiceCaptureId`.

**On confirm, the diff between the model's output and the saved values is written
to `VoiceCapture.correctedFields`.** This is the tuning dataset and it is how the
PRD's "share of captures saved without correction" metric is computed.

---

## 6. Resilient capture

The one place v1 works offline, because captures happen on the road and a lost
inquiry has direct revenue cost.

**INV-V6. Audio is written to IndexedDB before any upload is attempted.**

```
record → IndexedDB → try upload
                       ├── success → process → review → save → clear entry
                       └── failure → stays queued, retried on reconnect
```

- Queue lives in IndexedDB (blobs, not base64 in localStorage).
- Retry on `online` event and on app focus, with exponential backoff.
- **The queue is visible in the app shell** with a count badge, so a pending
  inquiry is never invisible.
- Entries clear only after the record is saved, not after upload.
- Android is the target device, so the Background Sync API is available. Use it,
  with foreground retry as the fallback.

This applies to voice capture only. Every other operation assumes a live
connection.

---

## 7. Instrumentation

Every capture writes a `VoiceCapture` row (INV-V8):

| Field | Purpose |
|---|---|
| `audioStorageKey` | Re-run against a new provider or prompt |
| `transcript` | Diagnosis, and the tuning corpus |
| `sttProvider`, `sttModel`, `sttLatencyMs` | Provider comparison in production |
| `intent`, `intentConfidence` | Routing accuracy |
| `parsedPayload` | What the model produced |
| `uncertainFields` | What it flagged |
| `correctedFields`, `wasCorrected` | What Susan fixed — the tuning signal |
| Stage timestamps | Where latency actually goes |

An internal page lists captures where a field was corrected, filterable by
intent. That list is the prompt-tuning backlog.

---

## 8. Failure handling

| Failure | Behaviour |
|---|---|
| Upload fails | Stays in IndexedDB, retried, visible in queue |
| STT fails | `FAILED`, audio retained, retry offered |
| STT succeeds, extraction fails | **Transcript persisted**, review screen opens empty with the transcript shown. She corrects manually. Nothing is lost. |
| Intent is `UNKNOWN` | Disambiguation screen with the transcript |
| Model returns an unparseable object | Treated as extraction failure, same as above |
| Audio is silent or under ~1s | Rejected client-side before upload, with a message |

The recurring principle: **degrade to manual entry, never to data loss.** The
worst acceptable outcome is that Susan types the record herself while looking at
her own transcript.

---

## 9. Rollout order

Staged within the voice fast-follow, per the PRD:

1. **Quote capture**, per-form only. Validated with Susan against real
   recordings before anything else is built.
2. Same pipeline extended to expenses, damage reports, payments, staff
   assignment.
3. **Global capture with intent routing**, last.

Global capture is the primary entry point in the finished product but the last
thing built, because intent routing is only tunable once the individual
extraction schemas are known to work.

---

## 10. Tests

- Golden-file suite: stored transcripts → expected structured output. **No live
  API calls in the test suite, ever.**
- Relative date resolution against a fixed clock in `Africa/Nairobi`:
  "next Saturday", "the 14th", "tomorrow", "this coming Friday".
- Entity resolution: a spoken surname matching an existing client; a
  near-miss producing no match rather than the wrong client.
- Schema tolerance: a partial payload with nulls validates and reaches the
  review screen.
- Queue behaviour: capture with the network offline is retained and uploads on
  reconnect.
- `correctedFields` diffing produces the right field list.

Live-model evaluation is a **separate script**, run deliberately against the
benchmark corpus. It is not part of `pnpm test` and never runs in CI.
