import * as Sentry from "@sentry/nextjs"

// DSN optional — see lib/env.ts. Client code reads the NEXT_PUBLIC_ variant
// since NODE env vars without that prefix are not available in the browser.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
