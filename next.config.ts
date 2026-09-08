import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Portability rule (system-overview.md §3): standalone output from the
  // first commit, so Phase 3's move to a Docker Compose droplet is not a
  // rewrite.
  output: "standalone",
};

// The build emits 5 harmless warnings about import-in-the-middle,
// require-in-the-middle, and @sentry/node-core — transitive dependencies of
// Sentry's Node SDK that Turbopack can't fully externalize yet. Known
// upstream Sentry+Turbopack rough edge; does not fail the build or affect
// runtime behaviour.

export default nextConfig;
