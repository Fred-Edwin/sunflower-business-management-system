import * as Sentry from "@sentry/nextjs"

// DSN is optional (lib/env.ts) so a clean clone with no Sentry project
// configured still runs — Sentry.init with an undefined dsn is a no-op.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
