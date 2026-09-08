import { z } from "zod"

// Parsed once, at module load, so a missing or malformed variable fails at
// boot rather than at the first request that happens to need it
// (system-overview.md §3, portability rule 4).
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  DATABASE_URL: z.url(),

  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),

  // Optional: a clean clone with no Sentry project configured still runs.
  // NEXT_PUBLIC_ so client-side instrumentation (sentry.client.config.ts) can
  // read it too — the server config reads SENTRY_DSN directly.
  SENTRY_DSN: z.url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),

  // Object storage. The adapter interface exists in this phase (lib/storage.ts)
  // but nothing calls it yet, so these are optional until a phase implements it.
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n")

    // Thrown at import time: the app refuses to start rather than fail later,
    // mid-request, with a confusing downstream error.
    throw new Error(
      `Invalid environment configuration. Check .env against .env.example:\n${issues}`,
    )
  }

  return result.data
}

export const env = loadEnv()
