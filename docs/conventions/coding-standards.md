# Coding Standards

Rules for how code is written in this repository. These exist so that any agent
session produces work that looks like it came from the same hand as every other
session.

When this document and a habit disagree, this document wins.

---

## 1. TypeScript

- `strict: true`. No exceptions, no `// @ts-expect-error` without a comment
  explaining what will remove it.
- **No `any`.** Use `unknown` and narrow. If a third-party type is wrong, declare
  the correct type locally rather than escaping the type system.
- No non-null assertions (`!`). If a value can be null, handle it.
- Prefer `type` over `interface` except when declaring a contract intended for
  implementation (the STT adapter, the storage adapter).
- Infer types from Zod schemas rather than writing them twice:
  `type Quote = z.infer<typeof quoteSchema>`.
- Return types are explicit on exported functions. Inference is fine internally.

---

## 2. File and module layout

Every module in `src/modules/` has the same five parts:

```
modules/<domain>/
├── schema.ts        Zod schemas. The source of truth for this domain's shapes.
├── domain/          Pure functions. No I/O, no Prisma, no React.
├── repository.ts    The ONLY file permitted to import Prisma in this module.
├── actions.ts       Server Actions.
└── ui/              Components specific to this module.
```

### The three structural rules

**1. `app/` renders, it does not decide.** A route file authenticates, calls a
module, and renders. A calculation in `app/` is in the wrong place.

**2. Modules do not import each other's repositories.** If quotes needs
inventory data, it calls an inventory *domain* function, or an inventory
repository function that has been deliberately exported for cross-module use and
documented as such. Reaching into another module's data layer is how a change to
quotes silently breaks invoicing.

**3. A shape is defined once.** The same Zod schema drives the form, the Server
Action input, and the AI extraction output. When it changes, everything
downstream fails at compile time. That is the point.

### No barrel files

Never create an `index.ts` that re-exports a module's contents. Barrels defeat
tree-shaking and are the most common cause of a Next.js dev server slowing to a
crawl. Import from the specific file:

```ts
// Yes
import { calculateQuoteTotals } from '@/modules/quotes/domain/totals'

// No
import { calculateQuoteTotals } from '@/modules/quotes'
```

### Naming

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `quote-totals.ts` |
| Components | PascalCase file and export | `QuoteLineItemRow.tsx` |
| Functions | camelCase, verb-first | `calculateQuoteTotals` |
| Domain functions | describe the operation | `issueQuote`, `acceptQuote` |
| Repository functions | `find*`, `create*`, `update*`, `list*` | `findQuoteById` |
| Server Actions | verb + noun | `createQuoteAction` |
| Zod schemas | `<thing>Schema` | `createQuoteSchema` |
| Money fields | always end in `Cents` | `unitPriceCents` |
| Booleans | `is`/`has`/`should` prefix | `isPreliminary` |

---

## 3. The domain layer

Domain functions are **pure**. Given the same inputs they return the same
outputs, they perform no I/O, and they throw only on genuinely invalid input.

```ts
// modules/quotes/domain/totals.ts
export function calculateQuoteTotals(input: {
  lineItems: { unitPriceCentsSnapshot: number; quantity: number }[]
  deliveryFeeCents: number
  discountCents: number
}): { subtotalCents: number; totalCents: number } {
  // pure arithmetic via lib/money
}
```

This is where the invariants live and where they are tested. A domain function
never touches Prisma, never reads the session, never formats a string for
display, and never returns JSX.

State transitions are domain functions taking current state and returning the
next state. The repository applies the result. That is what makes the state
machines in `document-lifecycle.md` testable without a database.

---

## 4. The repository layer

The only place Prisma is imported inside a module.

**Every query filters on `organizationId`** (INV-T2). No exceptions. A query
without it is a security defect.

```ts
export async function findQuoteById(
  organizationId: string,
  id: string,
  tx: PrismaClientOrTx = prisma,
) {
  return tx.quote.findFirst({
    where: { id, organizationId },
    include: { lineItems: { orderBy: { sortOrder: 'asc' } }, client: true },
  })
}
```

Two things to note in that signature and to copy everywhere:

- `organizationId` is the **first parameter**, always. Making it positional and
  first means omitting it is a type error rather than a silent data leak.
- The last parameter accepts a transaction client, defaulting to `prisma`. Any
  repository function must be callable inside a transaction.

Never use `findUnique` on a business table. It cannot express the tenant filter.
Use `findFirst`.

**No hard deletes** (INV-I5). There is no `prisma.*.delete()` in application code
against a business table.

---

## 5. Server Actions

Every mutation goes through `next-safe-action`. Authorisation and validation live
in the wrapper, not in the action body.

```ts
// lib/safe-action.ts
export const authedAction = createSafeActionClient()
  .use(async ({ next }) => {
    const session = await requireSession()
    const organizationId = await resolveOrganizationId(session)
    return next({ ctx: { session, organizationId } })
  })
```

```ts
// modules/quotes/actions.ts
export const createQuoteAction = authedAction
  .schema(createQuoteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const totals = calculateQuoteTotals(parsedInput)
    const quote = await createQuote(ctx.organizationId, { ...parsedInput, ...totals })
    revalidatePath('/quotes')
    return { quoteId: quote.id }
  })
```

Rules:

- The organisation comes from `ctx`, **never from client input**. An
  `organizationId` field in a Server Action's input schema is a defect.
- Input is validated by the schema, not by hand.
- Actions orchestrate. Business logic is in `domain/`, persistence is in
  `repository.ts`.
- Call `revalidatePath` or `revalidateTag` after a mutation. Do not refetch
  manually on the client.

---

## 6. Transactions

Any operation that allocates a reference number, creates bookings, or produces a
linked document runs inside one `prisma.$transaction`.

```ts
await prisma.$transaction(async (tx) => {
  const number = await allocateDocumentNumber(tx, orgId, 'INVOICE', year)
  const invoice = await createInvoice(orgId, { ...data, referenceNumber: number }, tx)
  return invoice
})
```

Number allocation and document insertion must never be separable (INV-N4).

PDF rendering happens **after** commit. A storage failure must not prevent a
document being issued.

---

## 7. Money

All arithmetic in `lib/money.ts`. Application code does not multiply, divide, or
apply percentages to currency inline.

```ts
export function multiplyMoney(cents: number, quantity: number): number
export function applyPercent(cents: number, percent: number): number  // rounds half-up, once
export function sumMoney(values: number[]): number
export function formatMoney(cents: number): string  // render boundary only
```

Rounding is half-up, applied once, at the point the fraction appears (INV-M4).
Two decimal places, one cent minimum (INV-M1). A domain function never returns a
formatted string.

---

## 8. Dates

- Timestamps: `DateTime`, stored UTC.
- Event dates: `@db.Date`, no time component. An event happens on a day.
- Display timezone is fixed to `Africa/Nairobi`. Never read the browser's zone.
- Use `date-fns` and `@date-fns/tz`. Never construct dates by string arithmetic.
- Helpers live in `lib/dates.ts`. `nowInNairobi()`, `toDateOnly()`,
  `formatEventDate()`.

---

## 9. Errors

Two categories, handled differently.

**Expected failures** are return values, not exceptions. A quote that cannot be
accepted because it is superseded returns a result the UI can render.

```ts
type Result<T> = { ok: true; data: T } | { ok: false; error: DomainError }
```

**Unexpected failures** throw and are caught by the error boundary and Sentry.

- Custom error classes in `lib/errors.ts`, all extending `AppError`.
- Never swallow an error. Never `catch {}` with an empty body.
- Error messages shown to the user say what happened and what to do. Never
  surface a stack trace or a Prisma error.

---

## 10. React and components

- **Server Components by default.** Add `'use client'` only when you need state,
  effects, or browser APIs, and add it as far down the tree as possible.
- Never fetch data in a Client Component. Pass it down from a Server Component.
- No `useEffect` for data fetching.
- Components take explicit props. No prop spreading except on the underlying DOM
  element of a Tier 1 primitive.
- One component per file, named the same as the file.
- Extract a component when it is used twice, not in anticipation.

Component tiers are defined in `ui-conventions.md`. In short: Tier 1 primitives
in `components/ui/`, Tier 2 app composites in `components/`, Tier 3 screens in
`app/`, styling essentially only in Tiers 1 and 2.

---

## 11. Forms

`react-hook-form` with `zodResolver`, using the module's schema.

```ts
const form = useForm<CreateQuoteInput>({
  resolver: zodResolver(createQuoteSchema),
  defaultValues,
})
```

- The same schema validates on the client and on the server. Never write two.
- Server errors map back onto fields via `setError`.
- Every voice-enabled form takes optional pre-filled values and a list of
  uncertain field names. The form does not know or care whether values came from
  speech or typing.

---

## 12. Comments

Comment **why**, never what. Code says what it does.

Comment these:
- Any non-obvious business rule, with the invariant ID: `// INV-A3: only accepted quotes commit`
- Any deliberate deviation from an apparent best practice, with the reason
- Any workaround, with what would remove it

Do not write JSDoc that restates the signature.

---

## 13. Dependencies

Adding a dependency needs a reason that survives the question "what does this do
that fifty lines of our own code would not?"

Already decided and not to be replaced: Prisma, Zod, react-hook-form, Tailwind,
shadcn/ui, Radix, lucide-react, sonner, nuqs, date-fns, `@react-pdf/renderer`,
Vercel AI SDK, next-safe-action, Vitest, Playwright.

Do not add: a state management library (Server Components plus URL state cover
it), a date library other than date-fns, a CSS-in-JS library, a component library
other than shadcn, an ORM query builder alongside Prisma.

---

## 14. Performance rules that are not optional

These exist because a slow inner loop compounds badly under agentic development.

- **No barrel files.** See §2.
- **No runtime CSS-in-JS.**
- Import icons individually: `import { Mic } from 'lucide-react'`.
- Keep `'use client'` boundaries low in the tree.
- `tsc --noEmit` runs as a separate watch process, never in the dev server path.
- Never import from `@/modules/*/repository` in a Client Component. It will pull
  Prisma into the browser bundle and the build will tell you, loudly.

---

## 15. Before declaring work complete

Run:

```bash
pnpm verify   # typecheck + lint + unit tests
```

All three must pass. This is the gate. Do not report a task finished with a
failing check, and do not disable a check to make it pass.
