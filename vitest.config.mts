import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    // Repository tests share one Postgres connection per test file via the
    // rollback harness (tests/db.ts) — run test files sequentially so
    // concurrent transactions on the same connection don't interleave.
    fileParallelism: false,
  },
})
